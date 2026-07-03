import { db } from "$lib/database";
import { count, eq } from "drizzle-orm";
import type { Actions, PageServerLoad } from "./$types";
import { serviceProviderTable, userTable } from "$lib/database/schema";
import {
	generateSessionToken,
	setJWTTokenCookie,
	setSessionTokenCookie
} from "$lib/server/auth/session";
import { createSession } from "$lib/server/auth/utils";
import { JWT_SECRET } from "$lib/const";
import { base64url, EncryptJWT } from "jose";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.email !== "sukhpreetben10@gmail.com") redirect(302, "/");
	return {
		users: await db.query.userTable.findMany(),
		userCount: (await db.select({ count: count() }).from(userTable))?.[0].count
	};
};

export const actions: Actions = {
	async default(event) {
		if (event.locals.user?.email !== "sukhpreetben10@gmail.com") redirect(302, "/");
		const formData = await event.request.formData();
		const user_id = formData.get("user_id")?.toString();
		const action = formData.get("action")?.toString();

		if (action === "edit" && user_id) {
			const name = formData.get("name")?.toString();
			const role = formData.get("role")?.toString() as
				| "user"
				| "student"
				| "service_provider"
				| "guest";
			const status = formData.get("status")?.toString() as "idle" | "verified";
			await db.update(userTable).set({ name, role, status }).where(eq(userTable.id, user_id));
			if (role === "service_provider") {
				const serviceProvider = await db.query.serviceProviderTable.findFirst({
					where: eq(userTable.id, user_id)
				});
				if (!serviceProvider) {
					await db
						.insert(serviceProviderTable)
						.values({ userId: user_id, serviceId: "osteopathy" });
				}
			}
			return { success: true, message: "User updated" };
		}

		if (action === "delete" && user_id) {
			await db.delete(userTable).where(eq(userTable.id, user_id));
			return { success: true, message: "User deleted" };
		}

		// Impersonation
		if (user_id && !action) {
			const user = await db.query.userTable.findFirst({ where: eq(userTable.id, user_id) });
			if (user) {
				const sessionToken = generateSessionToken();
				const session = await createSession(sessionToken, user_id);
				setSessionTokenCookie(event, sessionToken, session.expiresAt);
				const secret = base64url.decode(JWT_SECRET);
				const payload = { user: user };
				const jwt = await new EncryptJWT(payload)
					.setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
					.setExpirationTime(session.expiresAt)
					.encrypt(secret);
				setJWTTokenCookie(event, jwt, session.expiresAt);
				return redirect(302, "/" + user.id);
			}
		}

		return { status: 200 };
	}
};
