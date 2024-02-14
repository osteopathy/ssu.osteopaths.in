// routes/login/github/+server.ts
import { google } from '$lib/server/auth';
import { generateState, generateCodeVerifier } from 'arctic';
import { redirect } from '@sveltejs/kit';

import type { RequestEvent } from '@sveltejs/kit';
import { GOOGLE_CALENDAR_SCOPES, GOOGLE_SCOPES } from '$env/static/private';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const code = generateCodeVerifier();

	const calendar = event.url.searchParams.get('calendar') === 'true';

	const url = await google.createAuthorizationURL(state, code, {
		// Add Google Calendar Scopes
		scopes: [...GOOGLE_SCOPES.split(','), ...(calendar ? GOOGLE_CALENDAR_SCOPES.split(',') : [])]
	});

	// extra configrations for google
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set('prompt', 'consent');
	url.searchParams.set('include_granted_scopes', 'true');

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	event.cookies.set('google_oauth_code', code, {
		path: '/',
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	if (calendar)
		event.cookies.set('calendar', 'true', {
			path: '/',
			secure: import.meta.env.PROD,
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: 'lax'
		});

	redirect(302, url.toString());
}
