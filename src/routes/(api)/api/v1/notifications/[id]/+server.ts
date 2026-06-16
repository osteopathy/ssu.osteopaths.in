import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/database";
import { userNotificationTable } from "$lib/database/schema/notification";
import { eq, and } from "drizzle-orm";

export const PATCH: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) {
		error(401, "Unauthorized");
	}

	const notificationId = params.id;

	// Verify the notification belongs to the user
	const notification = await db.query.userNotificationTable.findFirst({
		where: and(
			eq(userNotificationTable.id, notificationId),
			eq(userNotificationTable.userId, locals.user.id)
		)
	});

	if (!notification) {
		error(404, "Notification not found");
	}

	// Mark as read
	await db
		.update(userNotificationTable)
		.set({ readAt: new Date().toISOString() })
		.where(eq(userNotificationTable.id, notificationId));

	return json({ status: "success" });
};
