import { createTable, id, timestamps } from "../../utils";
import { text } from "drizzle-orm/sqlite-core";
import { userTable } from "../user";
import { relations, type InferSelectModel } from "drizzle-orm";

export const userNotificationTable = createTable("user_notification", {
	id,
	title: text("title").notNull(),
	body: text("body").notNull(),
	type: text("type", { enum: ["push", "email", "in-app"] })
		.notNull()
		.default("in-app"),
	status: text("status"),
	data: text("data", { mode: "json" }).$type<Record<string, unknown>>(),
	readAt: text("read_at"),
	userId: text("user_id")
		.references(() => userTable.id, { onDelete: "cascade" })
		.notNull(),
	createdAt: timestamps.createdAt
});

export type UserNotification = InferSelectModel<typeof userNotificationTable>;

export const userNotificationRelation = relations(userNotificationTable, ({ one }) => ({
	user: one(userTable, {
		fields: [userNotificationTable.userId],
		references: [userTable.id]
	})
}));
