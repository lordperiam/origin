/*
Defines the database schema for analyses.
This schema stores AI-generated analysis results for debates, such as rhetorical devices and fallacies.
*/

import { pgTable, jsonb, timestamp, uuid } from "drizzle-orm/pg-core"
import { debatesTable } from "./debates-schema"

/**
 * Analyses table definition.
 * Stores the results of AI analysis performed on debates, linked to the debates table.
 *
 * Key features:
 * - id: Unique identifier for each analysis
 * - debateId: Foreign key linking to a debate
 * - results: JSONB field for flexible storage of analysis data
 * - Timestamps: Tracks creation and updates
 *
 * @dependencies
 * - drizzle-orm/pg-core: Provides PostgreSQL schema utilities
 * - debates-schema: References debatesTable for foreign key
 *
 * @notes
 * - Uses jsonb for results to accommodate varied analysis types; may normalize later
 * - Cascade delete ensures analyses are removed with their debate
 */
export const analysesTable = pgTable("analyses", {
  // UUID primary key with default random value
  id: uuid("id").defaultRandom().primaryKey(),
  // Foreign key to debates table, cascades on delete
  debateId: uuid("debate_id")
    .references(() => debatesTable.id, { onDelete: "cascade" })
    .notNull(),
  // JSONB field for analysis results (e.g., { rhetoricalDevices: [], fallacies: [] })
  results: jsonb("results").notNull(),
  // Creation timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Update timestamp with auto-update
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new analysis.
 */
export type InsertAnalysis = typeof analysesTable.$inferInsert

/**
 * Type for selecting an analysis.
 */
export type SelectAnalysis = typeof analysesTable.$inferSelect
