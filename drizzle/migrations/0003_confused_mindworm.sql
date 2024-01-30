CREATE TABLE `appointment` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text,
	`start_at` text,
	`duration` text DEFAULT '30',
	`user_id` text,
	`osteopath_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`osteopath_id`) REFERENCES `osteopath`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `medical_record` (
	`id` text PRIMARY KEY NOT NULL,
	`patient_id` text NOT NULL,
	`appointment_id` text,
	`allergies` text,
	`date_of_birth` text,
	`gender` text,
	`description` text,
	`treatment` text,
	`diagnosis` text,
	`prescription` text,
	FOREIGN KEY (`patient_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`appointment_id`) REFERENCES `appointment`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE osteopath ADD `about` text;--> statement-breakpoint
ALTER TABLE osteopath ADD `address` text;--> statement-breakpoint
ALTER TABLE user ADD `phone_number` text;--> statement-breakpoint
ALTER TABLE user ADD `phone_number_verified` integer DEFAULT false;