CREATE TABLE `availability` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`osteopath_id` text NOT NULL,
	FOREIGN KEY (`osteopath_id`) REFERENCES `osteopath`(`id`) ON UPDATE no action ON DELETE cascade
);
