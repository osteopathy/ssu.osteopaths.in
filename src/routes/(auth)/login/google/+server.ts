import { generateState, generateCodeVerifier } from "arctic";
import { google } from "$lib/server/auth/google";

import type { RequestEvent } from "@sveltejs/kit";

export async function GET(event: RequestEvent): Promise<Response> {
	const connect = event.url.searchParams.get("connect") as
		| "university-mail"
		| "personal-mail"
		| null;

	const state = event.locals.user && connect !== null ? generateState() + connect : generateState();
	const codeVerifier = generateCodeVerifier();
	const url = google.createAuthorizationURL(state, codeVerifier, ["profile", "openid", "email"]);

	event.cookies.set("google_oauth_state", state, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});
	event.cookies.set("google_code_verifier", codeVerifier, {
		path: "/",
		httpOnly: true,
		maxAge: 60 * 10, // 10 minutes
		sameSite: "lax"
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString()
		}
	});
}
