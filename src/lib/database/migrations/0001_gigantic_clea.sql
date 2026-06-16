PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_notification` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`type` text DEFAULT 'in-app' NOT NULL,
	`status` text,
	`data` text,
	`read_at` text,
	`user_id` text NOT NULL,
	`createdAt` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_notification`("id", "title", "body", "type", "status", "data", "read_at", "user_id", "createdAt") SELECT "id", "title", "body", "type", "status", "data", "read_at", "user_id", "createdAt" FROM `user_notification`;--> statement-breakpoint
DROP TABLE `user_notification`;--> statement-breakpoint
ALTER TABLE `__new_user_notification` RENAME TO `user_notification`;--> statement-breakpoint
PRAGMA foreign_keys=ON;