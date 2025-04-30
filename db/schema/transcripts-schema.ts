/*
Defines the database schema for transcripts.
This schema stores transcriptions of debates, linked to the debates table, for AI analysis.
*/

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Transcripts table definition.
 * Stores transcript content linked to debates.
 *
 * Key features:
 * - id: Primary key for the transcript
 * - debateId: Foreign key linking to the debates table
 * - content: The transcript text
 * - createdAt: Timestamp for when the transcript was created
 * - updatedAt: Timestamp for when the transcript was last updated
 */
export const transcriptsTable = pgTable("transcripts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  debateId: uuid("debate_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new transcript.
 */
export type InsertTranscript = typeof transcriptsTable.$inferInsert

/**
 * Type for selecting a transcript.
 */
export type SelectTranscript = typeof transcriptsTable.$inferSelect
