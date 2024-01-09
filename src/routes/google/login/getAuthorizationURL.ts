import { GOOGLE_CALENDAR_SCOPES, GOOGLE_SCOPES } from "$env/static/private";
import { google } from "$lib/server/auth";
import { generateCodeVerifier, generateState } from "arctic";

export default async function (opts = { calendar: false }) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier()
  const scopes = [...GOOGLE_SCOPES.split(','), ...(opts.calendar ? GOOGLE_CALENDAR_SCOPES.split(',') : [])]
  const url = await google.createAuthorizationURL(state, codeVerifier, { scopes },);
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', "consent");
  const cookies = {
    google: {
      name: "google_oauth_state",
      value: state,
      otps: {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      }
    },
    code: {
      name: "code-verifier",
      value: codeVerifier,
      otps: {
        path: "/",
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax"
      }
    }
  } as const
  return { url, cookies };
}
