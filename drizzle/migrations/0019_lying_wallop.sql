CREATE TABLE `article` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'What is the title ?',
	`summary` text DEFAULT 'What is the summary ?',
	`content` text,
	`draft` integer DEFAULT true,
	`view_count` integer DEFAULT 0,
	`publish_date` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `article_to_osteopath` (
	`article_id` text NOT NULL,
	`osteopath_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `osteopath_id`),
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`osteopath_id`) REFERENCES `osteopath`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'What is the category ?',
	`body` text
);
--> statement-breakpoint
CREATE TABLE `category_to_article` (
	`article_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`article_id`, `category_id`),
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `comment` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`author_id` text NOT NULL,
	`article_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE no action ON DELETE cascade
);
