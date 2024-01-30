import { relations, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";
import { createInsertSchema } from 'drizzle-zod';
import { genId } from "../helpers/generate-id";

export const courseTable = sqliteTable('course', {
    id: text('id').primaryKey(),
    label: text('label').notNull(),
    description: text('description')
})

export type Course = InferSelectModel<typeof courseTable>

// Schema for inserting a course - can be used to validate API requests
export const createCourseSchema = createInsertSchema(courseTable);
export type CreateCourseSchema = typeof createCourseSchema;

export const coursesRelations = relations(courseTable, ({ many }) => ({
    osteopath: many(osteopathTable),
}));

export const osteopathTable = sqliteTable('osteopath', {
    id: genId(),
    username: text('username'),
    course: text('course',{enum: ['bos','mos','ios']}).references(() => courseTable.id).notNull(),
    batch: text('batch').default('0000'),
    userId: text('user_id').references(() => userTable.id).notNull(),

    about: text('about'),
    address: text('address'),
});

export type Osteopath = InferSelectModel<typeof osteopathTable>;

// Schema for inserting a osteopath - can be used to validate API requests
export const createOsteopathSchema = createInsertSchema(osteopathTable);
export type CreateOsteopathSchema = typeof createOsteopathSchema;

export const osteopathsRelations = relations(osteopathTable, ({ one }) => ({
    user: one(userTable,{
        fields: [osteopathTable.userId],
        references: [userTable.id],
    }),
    course: one(courseTable,{
        fields: [osteopathTable.course],
        references: [courseTable.id],
    })
}));

export const appointmentTable = sqliteTable('appointment', {
	id: genId(),
	date: text('date'),
	startTime: text('start_at'),
	duration: text('duration').default('30'),
	userId: text('user_id').references(() => userTable.id),
	osteopathId: text('osteopath_id')
		.notNull()
		.references(() => osteopathTable.id)
});

export const appointmentRelations = relations(appointmentTable, ({ one }) => ({
	user: one(userTable, {
		fields: [appointmentTable.userId],
		references: [userTable.id]
	}),
	osteopath: one(osteopathTable, {
		fields: [appointmentTable.osteopathId],
		references: [osteopathTable.id]
	}),
    medicalRecord: one(medicalRecord, {
        fields: [appointmentTable.id],
        references: [medicalRecord.appointmentId]
    })
}));

export const medicalRecord = sqliteTable('medical_record', {
    id: genId(),
    patientId: text('patient_id').notNull().references(() => userTable.id),
    appointmentId: text('appointment_id').references(() => appointmentTable.id),
    allergies: text('allergies'),
    dateOfBirth: text('date_of_birth'),
    gender: text('gender'),
    description: text('description'),
    treatment: text('treatment'),
    diagnosis: text('diagnosis'),
    prescription: text('prescription'),
})
