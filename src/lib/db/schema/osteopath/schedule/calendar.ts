import { relations, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { osteopathTable } from '../index';
import { genId } from '../../../helpers/generate-id';

export const calendarTable = sqliteTable('calendar', {
	id: genId(),
	gmail: text('gmail').notNull(),
	idToken: text('id_token').notNull(),
	accessToken: text('access_tokens').notNull(),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }).notNull(),
	refreshToken: text('refresh_token'),
	calendarId: text('calendar_id'),
	eventId: text('event_id')
});

export type Calendar = InferSelectModel<typeof calendarTable>;

// Schema for inserting a calendar - can be used to validate API requests
export const createCalendarSchema = createInsertSchema(calendarTable);
export type CreateCalendarSchema = typeof createCalendarSchema;

export const calendarsRelations = relations(calendarTable, ({ one }) => ({
	osteopath: one(osteopathTable, {
		fields: [calendarTable.id],
		references: [osteopathTable.calendarId]
	})
}));
