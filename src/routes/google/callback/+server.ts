import { google, lucia } from "$lib/server/auth";
import { OAuth2Client } from "google-auth-library"
import type { RequestEvent } from "@sveltejs/kit";
import { OAuth2RequestError } from "arctic";
import { db } from "$lib/db";
import { eq } from "drizzle-orm";
import { userTable } from "$lib/db/schema";
import { generateId } from "lucia";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";

export async function GET(event: RequestEvent): Promise<Response> {
  const code = event.url.searchParams.get("code");
  const state = event.url.searchParams.get("state");
  // TODO: Implement Calendar
  const calendar = event.cookies.get('google_calendar');

  const storedState = event.cookies.get("google_oauth_state") ?? null;
  const codeVerifier = event.cookies.get('code-verifier')!

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const client = new OAuth2Client({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    })

    const ticket = await client.verifyIdToken({
      idToken: tokens.idToken,
    });

    const payload = ticket.getPayload();

    const existingUser = payload?.email ? await db.query.userTable.findFirst({
      where: eq(userTable.gmail, payload?.email)
    }) : false;

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    } else {
      const userId = generateId(15);
      await db.insert(userTable).values({
        id: userId,
        gmail: payload?.email,
        name: payload?.name,
      });
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  } catch (e) {
    console.log(e)
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
