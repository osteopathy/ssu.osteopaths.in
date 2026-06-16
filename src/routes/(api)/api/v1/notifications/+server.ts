import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/database";
import { userNotificationTable } from "$lib/database/schema/notification";
import { eq, desc } from "drizzle-orm";

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) {
		error(401, "Unauthorized");
	}

	const limit = parseInt(url.searchParams.get("limit") || "50");
	const offset = parseInt(url.searchParams.get("offset") || "0");
	const unreadOnly = url.searchParams.get("unread") === "true";

	let query = db
		.select()
		.from(userNotificationTable)
		.where(eq(userNotificationTable.userId, locals.user.id))
		.orderBy(desc(userNotificationTable.createdAt))
		.limit(limit)
		.offset(offset);

	const notifications = await query;

	// Filter for unread if requested
	const filteredNotifications = unreadOnly ? notifications.filter((n) => !n.readAt) : notifications;

	return json({
		notifications: filteredNotifications,
		total: filteredNotifications.length
	});
};
