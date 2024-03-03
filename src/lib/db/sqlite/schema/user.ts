import { relations, type InferSelectModel, eq } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sessionTable } from './session';
import { genId } from '../helpers/generate-id';
import { createInsertSchema } from 'drizzle-zod';
import { appointmentTable, osteopathTable } from '.';

export const userTable = sqliteTable('user', {
	id: genId(),
	name: text('name'),
	gmail: text('gmail'),
	image: text('image'),
	role: text('role', {
		enum: ['user', 'student', 'osteopath', 'admin']
	})
		.notNull()
		.default('user'),

	phoneNumber: text('phone_number'),
	phoneNumberVerified: integer('phone_number_verified', { mode: 'boolean' }).default(false)
});

export type User = InferSelectModel<typeof userTable>;
// Schema for inserting a user - can be used to validate API requests
export const createUserSchema = createInsertSchema(userTable);
export type CreateUserSchema = typeof createUserSchema;

export const usersRelations = relations(userTable, ({ many, one }) => ({
	appointments: many(appointmentTable),
	sessions: many(sessionTable),
	osteopath: one(osteopathTable, {
		fields: [userTable.id],
		references: [osteopathTable.userId]
	})
}));
