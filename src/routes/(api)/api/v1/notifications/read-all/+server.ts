import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/database";
import { userNotificationTable } from "$lib/database/schema/notification";
import { eq, isNull } from "drizzle-orm";

export const PATCH: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		error(401, "Unauthorized");
	}

	// Mark all unread notifications as read
	await db
		.update(userNotificationTable)
		.set({ readAt: new Date().toISOString() })
		.where(eq(userNotificationTable.userId, locals.user.id));

	return json({ status: "success" });
};
