import { relations, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';
import { genId } from '../helpers/generate-id';

export const sessionTable = sqliteTable('user_session', {
	id: genId(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at').notNull()
});

export type Session = InferSelectModel<typeof sessionTable>;

export const sessionRelation = relations(sessionTable, ({ one }) => ({
	session: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id]
	})
}));
