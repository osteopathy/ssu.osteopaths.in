import { genId } from "../../../helpers/generate-id";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { categoryToArticle } from "./categoryToArticle";
import { relations } from "drizzle-orm";

export const categoryTable = sqliteTable('category', {
    id: genId(),
    title: text('title').default('What is the title ?'),
    body: text("body"),
});


export const relation = relations(categoryTable, ({ many }) => ({
  articles: many(categoryToArticle),
}));