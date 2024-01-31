CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`category` text DEFAULT 'issue',
	`created_at` integer,
	`user_id` text NOT NULL
);
