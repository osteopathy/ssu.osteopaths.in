import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  gmail: text('gmail'),
  role: text('role', {
    enum: ['user', 'osteopath']
  })
})

export const usersRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
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
