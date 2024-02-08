import { genId } from "$lib/db/helpers/generate-id";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { osteopathTable } from "../index";
import { relations } from "drizzle-orm";

export const availabilityTable = sqliteTable('availability', {
  id: genId(),
  day: text('day', {
    enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'friday', 'thursday', 'saturday']
  }).notNull(),
  startTime: text('start_time', { mode: 'text' }).notNull(),
  endTime: text('end_time', { mode: 'text' }).notNull(),
  osteopathId: text('osteopath_id')
    .notNull()
    .references(() => osteopathTable.id, { onDelete: 'cascade' })
});

export const availabilityRelations = relations(availabilityTable, ({ one }) => ({
  osteopath: one(osteopathTable, {
    fields: [availabilityTable.osteopathId],
    references: [osteopathTable.id],
  }),
}));
