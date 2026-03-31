CREATE TABLE `generated_items` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt_run_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` text,
	`priority` text,
	`tags` text DEFAULT (json('[]')) NOT NULL,
	`position` integer NOT NULL,
	`is_deleted` integer DEFAULT false NOT NULL,
	`edited_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`prompt_run_id`) REFERENCES `prompt_runs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `prompt_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`prompt` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`error_message` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
