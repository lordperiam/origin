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
 * Argument Evolutions table definition.
 * Tracks the evolution of arguments within a debate over time.
 * Each entry represents a change or development in an argument.
 */
export const argumentEvolutionsTable = pgTable("argument_evolutions", {
  id: uuid("id").defaultRandom().primaryKey(),
  debateId: uuid("debate_id")
    .notNull()
    .references(() => debatesTable.id),
  argumentText: text("argument_text").notNull(),
  evolutionType: text("evolution_type"), // e.g., 'refined', 'rebutted', 'supported', etc.
  author: text("author"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Debate Justifications table definition.
 * Stores justifications or rationales for debate outcomes or positions.
 */
export const debateJustificationsTable = pgTable("debate_justifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  debateId: uuid("debate_id")
    .notNull()
    .references(() => debatesTable.id),
  justificationText: text("justification_text").notNull(),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

export type InsertArgumentEvolution =
  typeof argumentEvolutionsTable.$inferInsert
export type SelectArgumentEvolution =
  typeof argumentEvolutionsTable.$inferSelect
export type InsertDebateJustification =
  typeof debateJustificationsTable.$inferInsert
export type SelectDebateJustification =
  typeof debateJustificationsTable.$inferSelect

/**
 * Type for inserting a new debate.
 */
export type InsertDebate = typeof debatesTable.$inferInsert

/**
 * Type for selecting a debate.
 */
export type SelectDebate = typeof debatesTable.$inferSelect