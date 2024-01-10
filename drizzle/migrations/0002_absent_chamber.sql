CREATE TABLE `course` (
	`name` text PRIMARY KEY NOT NULL,
	`duration` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `osteopath` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`passed` integer DEFAULT false,
	`course` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`course`) REFERENCES `course`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `role`;