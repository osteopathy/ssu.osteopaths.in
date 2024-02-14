import { relations } from 'drizzle-orm';
import { genId } from '../../../helpers/generate-id';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categoryToArticleTable } from './categoryToArticle';
import { osteopathTable } from '../index';
import { commentTable } from './comment';

export const articleTable = sqliteTable('article', {
	id: genId(),
	title: text('title').default('What is the title ?'),
	summary: text('summary').default('What is the summary ?'),
	content: text('content', { mode: 'json' }),
	draft: integer('draft', { mode: 'boolean' }).default(true),
	view_count: integer('view_count').default(0),
	publishDate: integer('publish_date', { mode: 'timestamp' }),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

export const articlesRelation = relations(articleTable, ({ many }) => ({
	comments: many(commentTable),
	categories: many(categoryToArticleTable),
	osteopaths: many(osteopathTable)
}));
