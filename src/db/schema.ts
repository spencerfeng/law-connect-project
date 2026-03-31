import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const promptRuns = sqliteTable("prompt_runs", {
  id: text("id").primaryKey(),
  prompt: text("prompt").notNull(),
  status: text("status", { enum: ["pending", "completed", "failed"] })
    .notNull()
    .default("pending"),
  errorMessage: text("error_message"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
})

export const generatedItems = sqliteTable("generated_items", {
  id: text("id").primaryKey(),
  promptRunId: text("prompt_run_id")
    .notNull()
    .references(() => promptRuns.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category"),
  priority: text("priority", { enum: ["low", "medium", "high"] }),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull().default(sql`(json('[]'))`),
  position: integer("position").notNull(),
  isDeleted: integer("is_deleted", { mode: "boolean" }).notNull().default(false),
  editedAt: integer("edited_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
})
