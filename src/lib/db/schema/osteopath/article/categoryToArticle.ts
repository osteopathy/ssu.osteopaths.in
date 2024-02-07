import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { categoryTable } from "./category";
import { articleTable } from "./article";

export const categoryToArticle = sqliteTable(
  'category_to_article',
{
    articleId: text("article_id").notNull().references(() => articleTable.id),
    categoryId: text("category_id").notNull().references(() => categoryTable.id),
},
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.categoryId] }),
    'id': primaryKey({ name: 'id', columns: [table.articleId , table.categoryId] }),
  })
);

export const relation = relations(categoryToArticle, ({ one }) => ({
    category: one(categoryTable, {
      fields: [categoryToArticle.categoryId],
      references: [categoryTable.id],
    }),
    article: one(articleTable, {
      fields: [categoryToArticle.articleId],
      references: [articleTable.id],
    }),
}));