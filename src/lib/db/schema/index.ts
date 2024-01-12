import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  gmail: text('gmail'),
  image: text('image'),
  role: text('role', {
    enum: ['user', 'osteopath']
  }).default('user')
})

export type User = InferSelectModel<typeof userTable>;
export type PartialUser = InferInsertModel<typeof userTable>;

export const usersRelations = relations(userTable, ({ many, one }) => ({
  sessions: many(sessionTable),
  osteopath: one(osteopathTable, {
    fields: [userTable.id],
    references: [osteopathTable.userId],
  })
}));

export const sessionTable = sqliteTable("user_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: integer("expires_at").notNull()
})

export const sessionRelation = relations(sessionTable, ({ one }) => ({
  session: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  })
}))

export const courseTable = sqliteTable('course', {
  name: text('name').primaryKey(),
  duration: text('duration').notNull()
})

export type Course = InferSelectModel<typeof courseTable>;
export type PartialCourse = InferInsertModel<typeof courseTable>;


export const osteopathTable = sqliteTable('osteopath', {
  id: text('id').primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  passedOut: integer('passed', { mode: 'boolean' }).default(false),
  year: text('year'),
  course: text('course').references(() => courseTable.name, { onDelete: 'no action' }),
})

export const osteopathsRelation = relations(osteopathTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [osteopathTable.userId],
    references: [userTable.id]
  }),
  course: one(courseTable, {
    fields: [osteopathTable.course],
    references: [courseTable.name]
  }),
  availabilities: many(availabilityTable)
}))

export const availabilityTable = sqliteTable('availability', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  day: text('day', {
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'friday', 'thursday', 'saturday']
  }).notNull(),
  startTime: text('start_time', { mode: 'text' }).notNull(),
  endTime: text('end_time', { mode: 'text' }).notNull(),
  osteopathId: text('osteopath_id')
    .notNull()
    .references(() => osteopathTable.id)
});

export const availabilityRelations = relations(availabilityTable, ({ one }) => ({
  osteopath: one(osteopathTable, {
    fields: [availabilityTable.osteopathId],
    references: [osteopathTable.id],
  })
}));
