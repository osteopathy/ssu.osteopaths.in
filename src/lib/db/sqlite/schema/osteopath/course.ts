import { relations, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { osteopathTable } from './index';

export const courseTable = sqliteTable('course', {
	id: text('id').primaryKey(),
	label: text('label').notNull(),
	description: text('description')
	// duration in semesters
	// duration: text('duration'),
	// fee: text('fee'),
	// price: text('price'),
});

export type Course = InferSelectModel<typeof courseTable>;

// Schema for inserting a course - can be used to validate API requests
export const createCourseSchema = createInsertSchema(courseTable);
export type CreateCourseSchema = typeof createCourseSchema;

export const coursesRelations = relations(courseTable, ({ one }) => ({
	osteopath: one(osteopathTable, {
		fields: [courseTable.id],
		references: [osteopathTable.courseId]
	})
}));
