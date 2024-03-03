import { relations, type InferSelectModel, eq } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { genId } from '../helpers/generate-id';
import { createInsertSchema } from 'drizzle-zod';
import { userTable } from '.';

export const feedbackTable = sqliteTable('feedback', {
	id: genId(),
	content: text('content').notNull(),
	category: text('category', { enum: ['issue', 'idea', 'other'] }).default('issue'),
	createdAt: integer('created_at').$default(() => Date.now()),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' })
});

export type Feedback = InferSelectModel<typeof feedbackTable>;
// Schema for inserting a user - can be used to validate API requests
export const createFeedbackSchema = createInsertSchema(feedbackTable);
export type CreateFeedbackSchema = typeof createFeedbackSchema;

export const feedbacksRelations = relations(feedbackTable, ({ many, one }) => ({
	user: one(userTable, {
		fields: [feedbackTable.userId],
		references: [userTable.id]
	})
}));
