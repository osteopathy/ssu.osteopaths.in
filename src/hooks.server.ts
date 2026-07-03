import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth/session";
import { base64url, EncryptJWT, jwtDecrypt } from "jose";
import { JWT_SECRET } from "$lib/const";

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	const jwtToken = event.cookies.get(auth.jwtCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		return resolve(event);
	}

	if (!jwtToken) {
		event.locals.user = null;
		return resolve(event);
	}

	const secret = base64url.decode(JWT_SECRET);

	try {
		const value = await jwtDecrypt<{ user: NonNullable<auth.SessionValidationResult["user"]> }>(
			jwtToken,
			secret
		);
		if (!value.payload.exp) {
			event.locals.user = null;
			return resolve(event);
		}

		const expiresAt = value.payload.exp * 1000; // ms;
		// validate token after every 1 day
		if (Date.now() >= expiresAt - 1000 * 60 * 60 * 24 * 28) {
			const { session, user } = await auth.validateSessionToken(sessionToken);
			if (session && user) {
				auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
				const secret = base64url.decode(JWT_SECRET);
				const jwt = await new EncryptJWT({ user })
					.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
					.setExpirationTime(session.expiresAt)
					.encrypt(secret);
				auth.setJWTTokenCookie(event, jwt, session.expiresAt);
			} else {
				auth.deleteSessionTokenCookie(event);
				auth.deleteJWTTokenCookie(event);
			}
			event.locals.user = user;
			return resolve(event);
		}

		event.locals.user = value.payload.user;

		return resolve(event);
	} catch (e) {
		event.locals.user = null;
		return resolve(event);
	}
};

export const handle: Handle = handleAuth;
