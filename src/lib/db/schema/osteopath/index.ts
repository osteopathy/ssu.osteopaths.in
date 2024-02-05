import { relations, type InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "../user";
import { createInsertSchema } from 'drizzle-zod';
import { genId } from "../../helpers/generate-id";
import { courseTable } from "./course";
import { appointmentTable } from "./appointment";
import { calendarTable } from "./calendar";

export * from "./course"
export * from "./appointment"
export * from "./calendar"

export const osteopathTable = sqliteTable('osteopath', {
    id: genId(),
    username: text('username'),
    courseId: text('course_id',{enum: ['bos','mos','ios']}).references(() => courseTable.id, { onDelete: 'no action' }).notNull(),
    batch: text('batch').default('0000'),
    userId: text('user_id').references(() => userTable.id,{ onDelete: 'cascade' }).notNull(),
    calendarId: text('calendar_id').references(() => calendarTable.id, {onDelete: 'no action' }),

    about: text('about'),
    address: text('address'),

    visible: integer('visible', { mode: 'boolean' }).default(true),
    session: text('config',{
        mode: 'json'
    }).$type<{ duration: number, location: string, daily_limit: number  }>().default({
        duration: 45,
        location: 'Shruti Building, 2nd Floor',
        daily_limit: 4
    }),
    passedOut: integer('passed_out', { mode: 'boolean' }).default(false)
});

export type Osteopath = InferSelectModel<typeof osteopathTable>;

// Schema for inserting a osteopath - can be used to validate API requests
export const createOsteopathSchema = createInsertSchema(osteopathTable)

export type CreateOsteopathSchema = typeof createOsteopathSchema;

export const osteopathsRelations = relations(osteopathTable, ({ one,many }) => ({
    user: one(userTable,{
        fields: [osteopathTable.userId],
        references: [userTable.id],
    }),
    appointments: many(appointmentTable),
    course: one(courseTable,{
        fields: [osteopathTable.courseId],
        references: [courseTable.id],
    }),
    calendar: one(calendarTable,{
        fields: [osteopathTable.calendarId],
        references: [calendarTable.id],
    }),
}));