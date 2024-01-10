import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  gmail: text('gmail'),
  image: text('image'),
})

export type User = InferSelectModel<typeof userTable>;
export type PartialUser = InferInsertModel<typeof userTable>;

export const usersRelations = relations(userTable, ({ many, one }) => ({
  sessions: many(sessionTable),
  osteopath: one(osteopathTable)
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

export const osteopathTable = sqliteTable('osteopath', {
  id: text('id').primaryKey(),
  userId: text("user_id").references(() => userTable.id, { onDelete: 'cascade' }),
  passedOut: integer('passed', { mode: 'boolean' }).default(false),
  year: text('year'),
  course: text('course').references(() => courseTable.name, { onDelete: 'no action' }),
})

export const osteopathsRelation = relations(osteopathTable, ({ one }) => ({
  user: one(userTable),
  course: one(courseTable)
}))
