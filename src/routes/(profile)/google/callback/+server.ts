import { google, lucia } from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { db } from '$lib/db';
import { eq } from 'drizzle-orm';
import { calendarTable, osteopathTable, userTable, type Calendar } from '$lib/db/schema';
import calendarService from '$lib/server/calendar';

type GoogleUserResult = {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
};

function extractFromEmail(email_id: string | undefined | null) {
	let group;
	if (!(typeof email_id === 'string')) return;
	const regrex = /(?<name>\w+)\.(?<meta>\w+)@(?<university>\w+)\.edu\.in/;
	group = email_id.match(regrex)?.groups;
	if (!group) return;
	const { name, meta } = group;
	const reg = /(?:[a-zA-Z])+(?<year>\d{4})(?<batch>(?:[a-zA-Z])+)/;
	group = meta.match(reg)?.groups;
	if (!group) return;
	const { year, batch } = group;
	return { name, meta, year, batch };
}

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');

	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_oauth_code')!;
	const calendarIntegration = event.cookies.get('calendar') === 'true';
	console.log(storedState, state, code, codeVerifier, calendarIntegration);
	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, codeVerifier);

		const payload = (await fetch(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.accessToken}`,
			{
				headers: {
					Authorization: `Bearer ${tokens.idToken}`
				}
			}
		).then((res) => res.json())) as GoogleUserResult;

		if (!calendarIntegration) {
			let userId: string | null;

			const existingUser = payload?.email
				? await db.query.userTable.findFirst({
						where: eq(userTable.gmail, payload?.email)
					})
				: false;

			if (existingUser) userId = existingUser.id;

			userId ??= generateId(15);

			const emailDetail = extractFromEmail(payload.email);

			if (!existingUser) {
				if (emailDetail) {
					const { year, batch } = emailDetail;
					const { role, course } =
						batch === 'bos' || batch === 'mos' || batch === 'ios'
							? ({ role: 'osteopath', course: batch } as const)
							: ({ role: 'student', course: batch } as const);

					await db.insert(userTable).values({
						id: userId,
						gmail: payload.email,
						image: payload.picture,
						name: payload.name,
						role
					});

					if (role === 'osteopath')
						await db.insert(osteopathTable).values({
							courseId: course,
							userId,
							batch: year
						});
				} else {
					await db.insert(userTable).values({
						id: userId,
						gmail: payload.email,
						image: payload.picture,
						name: payload.name,
						role: 'user'
					});
				}
			}

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			return new Response(null, {
				status: 302,
				headers: {
					Location: '/'
				}
			});
		} else {
			if (!event.locals.user)
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/'
					}
				});

			const existingUser = event.locals.user;

			const osteopath = await db.query.osteopathTable.findFirst({
				where: eq(osteopathTable.userId, existingUser.id)
			});

			let calendarId = osteopath?.calendarId ?? generateId(15);

			const calendarAPI = calendarService({
				calendarId: calendarId,
				access_token: tokens.accessToken,
				refresh_token: tokens.refreshToken
			});

			console.log('FETCHING CALENDAR DETAILS');
			let cal = await calendarAPI.getCalendar();
			console.log('CALENDAR DETAILS');
			console.dir(cal, { depth: 3 });

			if (cal === undefined) console.log('ADDING CALENDAR');

			if (cal === undefined /* Osteopathy Calendar doesn't exist*/)
				cal = await calendarAPI.addCalendar();

			console.log('ADDED CALENDAR');
			console.dir(cal, { depth: 3 });

			let calendar: Calendar;
			console.log('OPERATION: CALENDAR UPDATE');
			if (osteopath?.calendarId) {
				calendar = (
					await db
						.update(calendarTable)
						.set({
							accessToken: tokens.accessToken,
							accessTokenExpiresAt: tokens.accessTokenExpiresAt,
							gmail: payload.email,
							idToken: tokens.idToken,
							refreshToken: tokens.refreshToken,
							calendarId: cal.id
						})
						.where(eq(calendarTable.id, calendarId))
						.returning()
				)[0];
			} else {
				calendar = (
					await db
						.insert(calendarTable)
						.values({
							id: calendarId,
							accessToken: tokens.accessToken,
							accessTokenExpiresAt: tokens.accessTokenExpiresAt,
							gmail: payload.email,
							idToken: tokens.idToken,
							refreshToken: tokens.refreshToken,
							calendarId: cal.id
						})
						.returning()
				)[0];
				if (calendar.id) {
					await db
						.update(osteopathTable)
						.set({
							calendarId: calendar.id
						})
						.where(eq(osteopathTable.userId, existingUser.id));
				}
			}
			console.log('OPERATION: CALENDAR UPDATED');
			console.dir(calendar, { depth: 3 });

			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);

			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return new Response(null, {
				status: 302,
				headers: {
					Location: osteopath?.username ? `/${osteopath.username}` : '/'
				}
			});
		}
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}
