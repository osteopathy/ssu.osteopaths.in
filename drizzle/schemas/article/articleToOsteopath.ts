import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { articleTable } from './article';
import { osteopathTable } from '../index';

export const articleToOsteopathTable = sqliteTable(
	'article_to_osteopath',
	{
		articleId: text('article_id')
			.notNull()
			.references(() => articleTable.id, { onDelete: 'cascade' }),
		osteopathId: text('osteopath_id')
			.notNull()
			.references(() => osteopathTable.id, { onDelete: 'no action' })
	},
	(table) => ({
		pk: primaryKey({ columns: [table.articleId, table.osteopathId] }),
		id: primaryKey({ name: 'id', columns: [table.articleId, table.osteopathId] })
	})
);

export const articlesToOsteopathsRelation = relations(articleToOsteopathTable, ({ one }) => ({
	category: one(osteopathTable, {
		fields: [articleToOsteopathTable.osteopathId],
		references: [osteopathTable.id]
	}),
	article: one(articleTable, {
		fields: [articleToOsteopathTable.articleId],
		references: [articleTable.id]
	})
}));
