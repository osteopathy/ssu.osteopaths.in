import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { articleTable } from "./article";
import { osteopathTable } from "../index";

export const categoryToArticle = sqliteTable(
  'article_to_osteopath',
{
    articleId: text("article_id").notNull().references(() => articleTable.id),
    osteopathId: text("osteopath_id").notNull().references(() => osteopathTable.id),
},
  (table) => ({
    pk: primaryKey({ columns: [table.articleId, table.osteopathId] }),
    'id': primaryKey({ name: 'id', columns: [table.articleId , table.osteopathId] }),
  })
);

export const relation = relations(categoryToArticle, ({ one }) => ({
    category: one(osteopathTable, {
      fields: [categoryToArticle.osteopathId],
      references: [osteopathTable.id],
    }),
    article: one(articleTable, {
      fields: [categoryToArticle.articleId],
      references: [articleTable.id],
    }),
}));