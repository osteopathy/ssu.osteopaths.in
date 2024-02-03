ALTER TABLE osteopath ADD `visible` integer DEFAULT true;--> statement-breakpoint
ALTER TABLE osteopath ADD `config` text;--> statement-breakpoint
ALTER TABLE osteopath ADD `passed_out` integer DEFAULT false;