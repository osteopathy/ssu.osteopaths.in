ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `googleId` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `email` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `phone` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `picture` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `universityMail` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `status` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `metadata` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `name` text;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `role` text DEFAULT 'user';
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `createdAt` integer;
--> statement-breakpoint
ALTER TABLE `user` ADD COLUMN IF NOT EXISTS `updatedAt` integer;
