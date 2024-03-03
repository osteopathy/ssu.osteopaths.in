import { genId } from '../../../helpers/generate-id';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { osteopathTable } from '../index';
import { relations, type InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const availabilityTable = sqliteTable('availability', {
	id: genId(),
	day: text('day', {
		enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'friday', 'thursday', 'saturday']
	}).notNull(),
	startTime: text('start_time', { mode: 'text' }).notNull(),
	endTime: text('end_time', { mode: 'text' }).notNull(),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopathTable.id, { onDelete: 'cascade' })
});

export type Availability = InferSelectModel<typeof availabilityTable>;

// Schema for inserting a availability - can be used to validate API requests
export const createAvailabilitySchema = createInsertSchema(availabilityTable);
export type CreateAvailabilitySchema = typeof createAvailabilitySchema;

export const availabilityRelations = relations(availabilityTable, ({ one }) => ({
	osteopath: one(osteopathTable, {
		fields: [availabilityTable.osteopathId],
		references: [osteopathTable.id]
	})
}));
