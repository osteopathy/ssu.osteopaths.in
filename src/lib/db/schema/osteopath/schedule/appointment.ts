import { genId } from '../../../helpers/generate-id';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from '../../user';
import { osteopathTable } from '../index';
import { relations, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const appointmentTable = sqliteTable('appointment', {
	id: genId(),
	date: text('date'),
	startTime: text('start_at'),
	duration: text('duration').default('30'),
	userId: text('user_id').references(() => userTable.id, { onDelete: 'no action' }),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopathTable.id, { onDelete: 'cascade' }),
	status: text('status', {
		enum: ['idle', 'pending', 'timeout', 'confirmed', 'completed', 'cancelled']
	}).default('idle'),
	createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date())
});

export type Appointment = InferSelectModel<typeof appointmentTable>;
export type InsertAppointment = InferInsertModel<typeof appointmentTable>;

// Schema for inserting a appointment - can be used to validate API requests
export const createAppointmentSchema = createInsertSchema(appointmentTable);
export type CreateAppointmentSchema = typeof createAppointmentSchema;

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
