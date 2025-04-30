/*
Defines the database schema for transcripts.
This schema stores transcriptions of debates, linked to the debates table, for AI analysis.
*/

import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { Platform } from "@/types/platform-types"

/**
 * Transcripts table definition.
 * Stores transcript content linked to debates.
 *
 * Key features:
 * - id: Primary key for the transcript
 * - debateId: Foreign key linking to the debates table
 * - content: The transcript text
 * - language: The language of the transcript (e.g., "en" for English)
 * - verified: Whether the transcript has been verified for accuracy
 * - sourcePlatform: The platform the transcript was sourced from (e.g., "YouTube")
 * - sourceUrl: The original URL where the content was found
 * - sourceId: Platform-specific identifier for the source
 * - createdAt: Timestamp for when the transcript was created
 * - updatedAt: Timestamp for when the transcript was last updated
 */
export const transcriptsTable = pgTable("transcripts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  debateId: uuid("debate_id").notNull(),
  content: text("content").notNull(),
  language: text("language").default("en"),
  verified: boolean("verified").default(false),
  sourcePlatform: text("source_platform"),
  sourceUrl: text("source_url"),
  sourceId: text("source_id"),
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
