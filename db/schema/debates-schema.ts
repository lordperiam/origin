/*
Defines the database schema for debates.
This schema stores metadata about debates sourced from various platforms (e.g., YouTube, Twitch).
It supports the core functionality of debate sourcing and analysis.
*/

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

/**
 * Debates table definition.
 * Stores information about debates to be analyzed, including source details and participants.
 *
 * Key features:
 * - id: Unique identifier for each debate
 * - sourcePlatform: Platform where the debate originated (e.g., YouTube)
 * - sourceId: Platform-specific identifier (e.g., video ID)
 * - title: Debate title for display
 * - participants: List of participant names or identifiers
 * - date: Date of the debate for temporal analysis
 * - Timestamps: Tracks creation and updates
 *
 * @dependencies
 * - drizzle-orm/pg-core: Provides PostgreSQL schema utilities
 *
 * @notes
 * - participants is a text array; may refactor to a separate table for public figures later
 * - date field added beyond spec for tracking argument changes over time
 */
export const debatesTable = pgTable("debates", {
  // UUID primary key with default random value
  id: uuid("id").defaultRandom().primaryKey(),
  // Source platform, required for tracking origin
  sourcePlatform: text("source_platform").notNull(),
  // Source-specific ID, required for uniqueness
  sourceId: text("source_id").notNull(),
  // Optional title for user-friendly display
  title: text("title"),
  // Array of participants, stored as text for simplicity
  participants: text("participants").array(),
  // Optional debate date for chronological context
  date: timestamp("date"),
  // Creation timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Update timestamp with auto-update
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new debate.
 */
export type InsertDebate = typeof debatesTable.$inferInsert

/**
 * Type for selecting a debate.
 */
export type SelectDebate = typeof debatesTable.$inferSelect
