import type { RequestHandler } from "./$types";
import * as auth from "$lib/server/auth/session";
import { JWT_SECRET } from "$env/static/private";
import { base64url, EncryptJWT } from "jose";
import { error, json } from "@sveltejs/kit";

export const POST: RequestHandler = async (event) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		return error(401, "Unauthorized");
	}
	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session && user) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		const secret = base64url.decode(JWT_SECRET);
		const jwt = await new EncryptJWT({ user })
			.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
			.setExpirationTime(session.expiresAt)
			.encrypt(secret);
		auth.setJWTTokenCookie(event, jwt, session.expiresAt);
	}
	return json({ type: "success" });
};
