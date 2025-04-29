/*
Defines the database schema for transcripts.
This schema stores transcriptions of debates, linked to the debates table, for AI analysis.
*/

import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { debatesTable } from "./debates-schema"

/**
 * Transcripts table definition.
 * Stores debate transcriptions with metadata for language and verification status.
 *
 * Key features:
 * - id: Unique identifier for each transcript
 * - debateId: Foreign key linking to a debate
 * - content: The transcript text
 * - language: Language of the transcript for multilingual support
 * - verified: Indicates if the transcript has been cross-verified
 * - Timestamps: Tracks creation and updates
 *
 * @dependencies
 * - drizzle-orm/pg-core: Provides PostgreSQL schema utilities
 * - debates-schema: References debatesTable for foreign key
 *
 * @notes
 * - Cascade delete ensures orphaned transcripts are removed
 * - Could extend with audio/video file references in the future
 */
export const transcriptsTable = pgTable("transcripts", {
  // UUID primary key with default random value
  id: uuid("id").defaultRandom().primaryKey(),
  // Foreign key to debates table, cascades on delete
  debateId: uuid("debate_id")
    .references(() => debatesTable.id, { onDelete: "cascade" })
    .notNull(),
  // Transcript content, required field
  content: text("content").notNull(),
  // Optional language identifier (e.g., 'en', 'es')
  language: text("language"),
  // Verification status, defaults to false
  verified: boolean("verified").default(false).notNull(),
  // Creation timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Update timestamp with auto-update
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
