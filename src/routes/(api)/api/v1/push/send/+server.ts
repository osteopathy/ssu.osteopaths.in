import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { webPush } from "$lib/server/webpush";
import { db } from "$lib/database";
import { userNotificationTable } from "$lib/database/schema/notification";
import { eq } from "drizzle-orm";
import { userNotificationSubscriptionTable, userTable } from "$lib/database/schema";
import { sendEmail, generateNotificationEmail } from "$lib/server/email";

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		error(401, "Unauthorized");
	}

	const {
		title,
		body,
		userId,
		types = ["in-app"],
		data
	}: {
		title: string;
		body: string;
		userId: string;
		types?: Array<"push" | "email" | "in-app">;
		data?: Record<string, unknown>;
	} = await request.json();

	const promises: Promise<unknown>[] = [];

	// Always create an in-app notification record
	await db.insert(userNotificationTable).values({
		title,
		body,
		userId,
		type: "in-app",
		data
	});

	// Send push notification if requested
	if (types.includes("push")) {
		const subscriptions = await db.query.userNotificationSubscriptionTable.findMany({
			where: eq(userNotificationSubscriptionTable.userId, userId)
		});

		const pushNotifications = subscriptions
			.filter((sub) => sub.auth && sub.p256dh && sub.endpoint)
			.map((subscription) => {
				const pushSubscription = {
					endpoint: subscription.endpoint!,
					keys: {
						p256dh: subscription.p256dh!,
						auth: subscription.auth!
					}
				};
				return webPush.sendNotification(
					pushSubscription,
					JSON.stringify({
						title,
						body
					})
				);
			});

		promises.push(...pushNotifications);
	}

	// Send email notification if requested
	if (types.includes("email")) {
		const user = await db.query.userTable.findFirst({
			where: eq(userTable.id, userId)
		});

		if (user?.email) {
			promises.push(
				sendEmail({
					to: user.email,
					subject: title,
					html: generateNotificationEmail(title, body)
				})
			);
		}
	}

	await Promise.allSettled(promises);

	return json({ status: "success" });
};
