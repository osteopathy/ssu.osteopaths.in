import { genId } from "../../helpers/generate-id";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "../user";
import { osteopathTable } from "./index";
import { relations } from "drizzle-orm";

export const appointmentTable = sqliteTable('appointment', {
	id: genId(),
	date: text('date'),
	startTime: text('start_at'),
	duration: text('duration').default('30'),
	userId: text('user_id').references(() => userTable.id, { onUpdate: 'cascade', onDelete: 'no action' }),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopathTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});

export const appointmentRelations = relations(appointmentTable, ({ one }) => ({
	user: one(userTable, {
		fields: [appointmentTable.userId],
		references: [userTable.id]
	}),
	osteopath: one(osteopathTable, {
		fields: [appointmentTable.osteopathId],
		references: [osteopathTable.id]
	})
}));