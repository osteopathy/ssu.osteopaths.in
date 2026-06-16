import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { RequestEvent } from "@sveltejs/kit";
import { userSessionTable, type User, type UserSession } from "$lib/database/schema";
import { db } from "$lib/database";
import { eq } from "drizzle-orm";

export const sessionCookieName = "auth-session";
export const jwtCookieName = "auth-token";

export type SessionValidationResult =
	| {
			session: {
				id: UserSession["id"];
				userId: UserSession["userId"];
				expiresAt: UserSession["expiresAt"];
			};
			user: {
				id: User["id"];
				googleId: User["googleId"];
				email: User["email"];
				name: User["name"];
				picture: User["picture"];
				phone: User["phone"];
				universityMail: User["universityMail"];
				role: User["role"];
				status: User["status"];
			};
	  }
	| { session: null; user: null };

// JWT Based Session Auth Strategy

export async function setJWTTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(jwtCookieName, token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteJWTTokenCookie(event: RequestEvent): void {
	event.cookies.set(jwtCookieName, "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

// Database Session Strategy

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const userSession = await db.query.userSessionTable.findFirst({
		where: eq(userSessionTable.id, sessionId),
		with: {
			user: true
		}
	});

	if (userSession?.user === undefined) {
		return { session: null, user: null };
	}

	const session = {
		id: userSession?.id as string,
		userId: userSession?.userId as string,
		expiresAt: userSession?.expiresAt as Date
	};

	const user = {
		id: userSession?.user.id,
		googleId: userSession?.user?.googleId,
		name: userSession?.user?.name,
		email: userSession?.user?.email,
		picture: userSession?.user?.picture,
		phone: userSession?.user?.phone,
		universityMail: userSession?.user?.universityMail,
		role: userSession?.user?.role ?? "user",
		status: userSession?.user?.status ?? "idle"
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.$client.execute({
			sql: "DELETE FROM user_session WHERE id = ?",
			args: [session.id]
		});
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db.$client.execute({
			sql: "UPDATE user_session SET expires_at = ? WHERE user_session.id = ?",
			args: [Math.floor(session.expiresAt.getTime() / 1000), session.id]
		});
	}
	return { session, user };
}

export function invalidateSession(sessionToken: string): void {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(sessionToken)));
	db.$client.execute({
		sql: "DELETE FROM user_session WHERE id = ?",
		args: [sessionId]
	});
}

export function invalidateUserSessions(userId: number): void {
	db.$client.execute({ sql: "DELETE FROM user_session WHERE user_id = ?", args: [userId] });
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set(sessionCookieName, token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set(sessionCookieName, "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}
