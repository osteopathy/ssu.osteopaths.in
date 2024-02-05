CREATE TABLE `calendar` (
	`id` text PRIMARY KEY NOT NULL,
	`gmail` text NOT NULL,
	`id_token` text NOT NULL,
	`access_tokens` text NOT NULL,
	`access_token_expires_at` integer NOT NULL,
	`refresh_token` text,
	`calendar_id` text,
	`event_id` text
);
--> statement-breakpoint
ALTER TABLE osteopath ADD `calendar_id` text REFERENCES calendar(id);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/