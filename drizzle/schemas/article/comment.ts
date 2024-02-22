import { relations } from 'drizzle-orm';
import { genId } from '../../../helpers/generate-id';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { articleTable } from './article';
import { userTable } from '../..';

export const commentTable = sqliteTable('comment', {
	id: genId(),
	// (text of the comment)
	content: text('content').notNull(),
	authorId: text('author_id')
		.references(() => userTable.id, { onDelete: 'cascade' })
		.notNull(),
	articleId: text('article_id')
		.references(() => articleTable.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const commentsRelation = relations(commentTable, ({ one }) => ({
	author: one(userTable, {
		fields: [commentTable.authorId],
		references: [userTable.id]
	}),
	article: one(articleTable, {
		fields: [commentTable.articleId],
		references: [articleTable.id]
	})
}));
