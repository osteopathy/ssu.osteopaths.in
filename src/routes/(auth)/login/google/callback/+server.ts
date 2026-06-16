import {
	generateSessionToken,
	setJWTTokenCookie,
	setSessionTokenCookie,
	type SessionValidationResult
} from "$lib/server/auth/session";
import { google } from "$lib/server/auth/google";
import { decodeIdToken } from "arctic";

import type { RequestEvent } from "@sveltejs/kit";
import type { OAuth2Tokens } from "arctic";
import {
	createUser,
	createSession,
	getUserFromGoogleId,
	updateUniversityMail,
	updateGoogleAccount,
	getUserFromUniversityMail,
	createStudent,
	connectStudent,
	createUserWithUniversityMail
} from "$lib/server/auth/utils";
import { base64url, EncryptJWT } from "jose";
import { JWT_SECRET } from "$env/static/private";

// {
//   iss: 'https://accounts.google.com',
//   azp: 'b.',
//   aud: 'b.',
//   sub: 'a',
//   email: 'a',
//   email_verified: true,
//   at_hash: '-',
//   name: '',
//   picture: 'asd',
//   given_name: 'as',
//   family_name: 'a',
//   iat: 22..,
//   exp: 12.
// }

export async function GET(event: RequestEvent): Promise<Response> {
	console.log("[OAuth Callback] Starting Google OAuth callback handler");
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("google_oauth_state") ?? null;
	const codeVerifier = event.cookies.get("google_code_verifier") ?? null;

	console.log("[OAuth Callback] Code present:", !!code, "State present:", !!state);
	console.log(
		"[OAuth Callback] Stored state present:",
		!!storedState,
		"Code verifier present:",
		!!codeVerifier
	);

	if (code === null || state === null || storedState === null || codeVerifier === null) {
		console.error("[OAuth Callback] Missing required parameters");
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		console.error("[OAuth Callback] State mismatch - potential CSRF attack");
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
		console.log("[OAuth Callback] Successfully validated authorization code");
	} catch (e) {
		// Invalid code or client credentials
		console.error("[OAuth Callback] Failed to validate authorization code:", e);
		return new Response(null, {
			status: 400
		});
	}
	const notifyAdmin = async ({ title, body }: { title: string; body: string }) => {
		try {
			console.log("[OAuth Callback] Sending admin notification:", { title, body });
			await event.fetch("/api/v1/push/send", {
				method: "POST",
				body: JSON.stringify({
					title,
					body,
					userId: "JBWHKCYFWM"
				})
			});
			console.log("[OAuth Callback] Admin notification sent successfully");
		} catch (error) {
			console.error("[OAuth Callback] Failed to send admin notification:", error);
		}
	};

	const resolveSession = async (
		event: RequestEvent,
		userId: string,
		payload: { user: NonNullable<SessionValidationResult["user"]> },
		message?: string
	) => {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, userId);
		console.log("[OAuth Callback] Created session with token:", sessionToken);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		console.log("[OAuth Callback] Session token cookie set", JWT_SECRET);

		const secret = base64url.decode(JWT_SECRET);
		console.log("SECRET", secret);
		console.log("[OAuth Callback] Decoded JWT secret");
		const jwt = await new EncryptJWT(payload)
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			.setExpirationTime(session.expiresAt)
			.encrypt(secret);
		console.log("[OAuth Callback] Generated encrypted JWT");
		setJWTTokenCookie(event, jwt, session.expiresAt);

		return new Response(null, {
			status: 302,
			headers: {
				Location: "/" + userId + (message ? "?message=" + encodeURIComponent(message) : "")
			}
		});
	};
	console.log("[OAuth Callback] Decoding ID token", tokens.idToken());
	const claims = decodeIdToken(tokens.idToken()) as {
		sub: string;
		name: string;
		email: string;
		picture: string;
	};
	console.log("[OAuth Callback] Decoded ID token claims:", claims);
	// Reason to use googleUserId instead of just email
	// A Google ID token's sub field is unique to each Google Account and is never reused.
	// A Google Account can have multiple email addresses, but only one ID token.
	const userDetails = {
		name: claims.name,
		email: claims.email,
		picture: claims.picture,
		googleId: claims.sub
	};

	// checking if the mail is ending with @srisriuniversity.edu.in
	const [identifier, domain] = userDetails.email.split("@");

	if (event.locals.user && state?.endsWith("-mail")) {
		if (state.endsWith("university-mail") && domain === "srisriuniversity.edu.in") {
			// first-time need to create entry in student table
			if (!event.locals.user.universityMail) {
				const existingUser = await getUserFromUniversityMail(userDetails.email);

				if (existingUser) {
					return resolveSession(
						event,
						event.locals.user.id,
						{ user: event.locals.user },
						`already another account is linked to this university email ${userDetails.email}`
					);
				}

				const id = identifier.split(".")[1];
				const batch = id.substring(1, 5);
				const course = id.substring(5);

				if (batch && course) {
					await notifyAdmin({
						title: batch + course + " " + userDetails.name,
						body: "new student is added to the system"
					});
					await connectStudent(
						event.locals.user.id,
						userDetails.email,
						userDetails.name,
						batch,
						course
					);
					return resolveSession(event, event.locals.user.id, {
						user: {
							...event.locals.user,
							universityMail: userDetails.email,
							role: "student",
							status: "verified"
						}
					});
				}
			}
			await updateUniversityMail(event.locals.user.id, userDetails.email);
			event.locals.user.universityMail = userDetails.email;
		}
		if (state.endsWith("personal-mail")) {
			const existingUser = await getUserFromGoogleId(userDetails.googleId);
			if (existingUser) {
				return resolveSession(
					event,
					event.locals.user.id,
					{ user: event.locals.user },
					`already another account is linked to this mail ${userDetails.email}`
				);
			}
			await updateGoogleAccount(event.locals.user.id, userDetails.googleId, userDetails.email);
			event.locals.user.email = userDetails.email;
			event.locals.user.googleId = userDetails.googleId;
		}
		return resolveSession(event, event.locals.user.id, { user: event.locals.user });
	}

	const existingUser = await (async () => {
		if (domain === "srisriuniversity.edu.in") {
			return await getUserFromUniversityMail(userDetails.email);
		}
		if (domain === "gmail.com") {
			return await getUserFromGoogleId(userDetails.googleId);
		}
		return null;
	})();

	if (existingUser !== null) {
		return resolveSession(event, existingUser.id, { user: existingUser });
	}

	if (domain === "srisriuniversity.edu.in") {
		const id = identifier.split(".")[1];

		const batch = id.substring(1, 5);
		const course = id.substring(5);

		if (batch && course) {
			const student = await createStudent(
				userDetails.email,
				userDetails.name,
				userDetails.picture,
				batch,
				course
			);
			await notifyAdmin({
				title: `New Student Signup ${userDetails.name}`,
				body: `${batch} ${course} ${userDetails.email}`
			});
			return resolveSession(event, student.userId, {
				user: {
					id: student.userId,
					name: userDetails.name,
					googleId: null,
					email: null,
					phone: null,
					picture: student.picture,
					role: "student",
					status: "verified",
					universityMail: userDetails.email
				}
			});
		}

		const user = await createUserWithUniversityMail(
			userDetails.email,
			userDetails.name,
			userDetails.picture
		);
		await notifyAdmin({
			title: `New University Signup ${userDetails.name}`,
			body: `${userDetails.email}`
		});
		return resolveSession(event, user.id, { user });
	}

	const user = await createUser(
		userDetails.googleId,
		userDetails.name,
		userDetails.email,
		userDetails.picture
	);

	await notifyAdmin({
		title: `New User Signup ${userDetails.name}`,
		body: `${userDetails.email}`
	});

	return resolveSession(event, user.id, { user });
}
