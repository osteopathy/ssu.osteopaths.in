import { type calendar_v3, auth as google, calendar as googleCalendar } from '@googleapis/calendar';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REDIRECT_URI,
	GOOGLE_SCOPES,
	GOOGLE_CALENDAR_SCOPES
} from '$env/static/private';
import { db } from './db';
import { calendarTable } from '$lib/db/sqlite/schema';
import { eq } from 'drizzle-orm';

export const CalendarName = 'Osteopathy Appointment Calendar';

export default function calendarService(credential: {
	access_token: string;
	refresh_token: string | null;
	calendarId: string;
}) {
	const googleAuth = (credential: {
		access_token: string;
		refresh_token: string | null;
		calendarId: string;
	}) => {
		async function getGoogleAuth() {
			const { client_id, client_secret, redirect_uri } = {
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_CLIENT_SECRET,
				redirect_uri: GOOGLE_REDIRECT_URI
			};
			const myGoogleAuth = new MyGoogleAuth(client_id, client_secret, redirect_uri);
			myGoogleAuth.setCredentials({
				access_token: credential.access_token,
				refresh_token: credential.refresh_token,
				scope: [...GOOGLE_SCOPES.split(','), 'https://www.googleapis.com/auth/calendar'].join(' '),
				token_type: 'Bearer'
			});
			return myGoogleAuth;
		}

		const refreshAccessToken = async (myGoogleAuth: Awaited<ReturnType<typeof getGoogleAuth>>) => {
			try {
				console.log('Requesting for Refersh Token');
				const ress = await myGoogleAuth.refreshToken(credential.refresh_token);
				console.log('Response from refresh_token', ress);
				const { res } = ress;
				const token = res?.data;
				console.log('RESPONSE DATA !!!IMPORTANT!!!', token);
				credential.access_token = token.access_token;
				credential.refresh_token = token.refresh_token;
				// credential.expiry_date = token.expiry_date;
				await db
					.update(calendarTable)
					.set({
						accessToken: token.access_token,
						refreshToken: token.refersh_token,
						accessTokenExpiresAt: token.expiry_date
					})
					.where(eq(calendarTable.id, credential.calendarId));
				myGoogleAuth.setCredentials({
					access_token: credential.access_token,
					refresh_token: credential.refresh_token,
					scope: [...GOOGLE_SCOPES.split(','), ...GOOGLE_CALENDAR_SCOPES.split(',')].join(' '),
					token_type: 'Bearer',
					expiry_date: token.expiry_date
				});
			} catch (err) {
				let message;
				if (err instanceof Error) message = err.message;
				else message = String(err);
				console.error('GOOGLE ERROR MESSAGE \n', message);
				// if not invalid_grant, default behaviour (which admittedly isn't great)
				if (message !== 'invalid_grant') return myGoogleAuth;
				// when the error is invalid grant, it's unrecoverable and the credential marked invalid.
				// TODO: Evaluate bubbling up and handling this in the CalendarManager. IMO this should be done
				//       but this is a bigger refactor.
			}
			return myGoogleAuth;
		};
		return {
			getToken: async () => {
				const myGoogleAuth = await getGoogleAuth();
				const isExpired = () => myGoogleAuth.isTokenExpiring();
				return !isExpired() ? Promise.resolve(myGoogleAuth) : refreshAccessToken(myGoogleAuth);
			}
		};
	};
	const auth = googleAuth(credential);
	// '2013-02-14T13:15:03-08:00' (YYYY-MM-DDTHH:mm:ssZ)
	const createEvent = async (
		calendarId: string,
		{
			summary,
			startTime,
			endTime,
			timeZone,
			host,
			nonHost
		}: {
			summary: string;
			startTime: string;
			endTime: string;
			timeZone?: string;
			host: { email: string };
			nonHost: { email: string };
		}
	) => {
		const myGoogleAuth = await auth.getToken();
		const payload: calendar_v3.Schema$Event = {
			summary: CalendarName,
			description: summary,
			start: {
				dateTime: startTime,
				timeZone: timeZone || 'Asia/Kolkata'
			},
			end: {
				dateTime: endTime,
				timeZone: timeZone || 'Asia/Kolkata'
			},
			attendees: [
				{ email: host.email, organizer: true },
				{ email: nonHost.email, organizer: false }
			],
			reminders: {
				useDefault: true
			}
		};
		const calendar = googleCalendar({
			version: 'v3'
		});
		try {
			const res = await calendar.events.insert({
				auth: myGoogleAuth,
				calendarId,
				requestBody: payload,
				// conferenceDataVersion: 1,
				sendUpdates: 'none'
			});
			return res.data;
		} catch (error) {
			if (error) {
				console.error('There was an error contacting google calendar service: ', error);
			}
		}
	};

	const importEvent = async ({
		calendarId,
		start,
		end,
		iCalUID
	}: {
		calendarId?: string;
		start: calendar_v3.Schema$Event['start'];
		end: calendar_v3.Schema$Event['end'];
		iCalUID: calendar_v3.Schema$Event['iCalUID'];
	}) => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3'
		});
		try {
			const res = await calendar.events.import({
				auth: myGoogleAuth,
				calendarId: calendarId ?? 'primary',
				requestBody: {
					iCalUID,
					start,
					end
				}
			});
			return res.data;
		} catch (error) {
			console.error('Failed to Import the Calendar Event', error);
		}
	};

	const updateEvent = async (
		calendarId: string,
		eventId: string,
		payload: calendar_v3.Schema$Event
	) => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3'
		});
		try {
			const res = await calendar.events.update({
				auth: myGoogleAuth,
				calendarId,
				eventId,
				sendNotifications: true,
				sendUpdates: 'none',
				requestBody: payload
			});
			return res;
		} catch (error) {
			console.error('Error Updating the Calendar Event, while updating', error);
			return;
		}
	};

	const deleteEvent = async (calendarId: string, eventId: string) => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3'
		});
		const defaultCalendarId = 'primary';
		try {
			const res = await calendar.events.delete({
				auth: myGoogleAuth,
				calendarId: calendarId ? calendarId : defaultCalendarId,
				eventId,
				sendNotifications: false,
				sendUpdates: 'none'
			});
			return res;
		} catch (err) {
			console.error('There was an error contacting google calendar service: ', err);
			return err;
		}
	};

	const getAvailability = async (calendarId: string, dateFrom: string, dateTo: string) => {
		const myGoogleAuth = await auth.getToken();

		const calendar = googleCalendar({
			version: 'v3',
			auth: myGoogleAuth
		});

		const { data: calendarList } = await calendar.calendarList.list();
		const calendarIds = calendarList.items?.map((cal) => cal.id).filter(Boolean) || [calendarId];
		const apires = await calendar.freebusy.query({
			requestBody: {
				timeMin: dateFrom,
				timeMax: dateTo,
				items: calendarIds.map((id) => ({ id: id }))
			}
		});

		if (!apires?.data.calendars) return [];
		const result = Object.values(apires.data.calendars).reduce((c, i) => {
			i.busy?.forEach((busyTime) => {
				// @ts-ignore
				c.push({
					start: busyTime.start || '',
					end: busyTime.end || ''
				});
			});
			return c;
		});
		return result;
	};
	const listCalendars = async () => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3',
			auth: myGoogleAuth
		});
		const calendarList = await calendar.calendarList.list();
		return (
			calendarList.data.items?.map((cal) => ({
				externalId: cal.id ?? 'No id',
				name: cal.summary ?? 'No name',
				primary: cal.primary ?? false,
				readOnly: !(cal.accessRole === 'reader' || cal.accessRole === 'owner') && true,
				email: cal.id ?? '',
				summary: cal.summary
			})) || []
		);
	};

	const getCalendar = async (calendarId?: string) => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3',
			auth: myGoogleAuth
		});
		if (calendarId) {
			try {
				const res = await calendar.calendars.get({
					calendarId
				});
				return res.data;
			} catch (error) {
				console.log(`Getting the Calendar with CalendarID: ${calendarId} failed`, error);
			}
		}

		let list;
		try {
			list = await listCalendars();
		} catch (err) {
			console.log('Failed to get the list of Calendars', err);
		}
		const res = list?.find((item) => item.summary === CalendarName);
		if (!res) return undefined;
		const calendar_res = await calendar.calendars.get({
			calendarId: res.externalId as string
		});
		return calendar_res?.data;
	};

	const addCalendar = async () => {
		const myGoogleAuth = await auth.getToken();
		const calendar = googleCalendar({
			version: 'v3',
			auth: myGoogleAuth
		});
		const res = await calendar.calendars.insert({
			requestBody: {
				summary: CalendarName,
				timeZone: 'Asia/Kolkata'
			}
		});
		return res.data;
	};

	return {
		getCalendar,
		addCalendar,
		getAvailability,
		listCalendars,
		createEvent,
		deleteEvent,
		updateEvent,
		importEvent
	};
}

class MyGoogleAuth extends google.OAuth2 {
	constructor(client_id: string, client_secret: string, redirect_uri: string) {
		super(client_id, client_secret, redirect_uri);
	}
	isTokenExpiring() {
		return super.isTokenExpiring();
	}

	async refreshToken(token: string | null | undefined) {
		return super.refreshToken(token);
	}
}
