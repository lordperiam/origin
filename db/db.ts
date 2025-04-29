/*
Initializes the database connection and schema for the app.
Sets up Drizzle ORM with PostgreSQL and defines the schema for all tables.
This file provides the database instance used throughout the application for queries and transactions.
*/

import {
  analysesTable,
  debatesTable,
  profilesTable,
  transcriptsTable
} from "@/db/schema"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import { pgTable } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import postgres from "postgres"
import { relations } from "drizzle-orm"

/**
 * Load environment variables from .env.local.
 * This is necessary to access DATABASE_URL for the database connection, per project rules.
 */
config({ path: ".env.local" })

/**
 * PostgreSQL client instances
 */
const queryClient = postgres(process.env.DATABASE_URL!)
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 })

/**
 * Define table relations
 */
const debatesRelations = relations(debatesTable, ({ many }) => ({
  transcripts: many(transcriptsTable)
}))

const transcriptsRelations = relations(transcriptsTable, ({ one }) => ({
  debate: one(debatesTable, {
    fields: [transcriptsTable.debateId],
    references: [debatesTable.id]
  })
}))

/**
 * Drizzle ORM database instance.
 * Provides query and transaction capabilities for the application, integrating the schema.
 *
 * Key features:
 * - Connects to PostgreSQL via the client
 * - Uses the schema for type-safe database operations
 *
 * @dependencies
 * - drizzle-orm/postgres-js: Drizzle ORM implementation for PostgreSQL
 * - postgres: Underlying client for database connection
 *
 * @notes
 * - Assumes DATABASE_URL is set in .env.local by the user
 * - No migrations are generated here per project rules; migrations are handled separately
 * - Edge case: If DATABASE_URL is invalid, the app will fail to start (handled by runtime)
 */
export const db = drizzle(queryClient, {
  schema: {
    ...debatesRelations,
    ...transcriptsRelations,
    debates: debatesTable,
    transcripts: transcriptsTable,
    profiles: profilesTable,
    analyses: analysesTable
  }
})

// Initialize tables if they don't exist
const initDb = async () => {
  try {
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS debates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_platform TEXT NOT NULL,
        source_id TEXT NOT NULL,
        title TEXT,
        participants TEXT[],
        date TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `)

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database tables:", error)
  } finally {
    // Close the migration client after initialization
    await migrationClient.end()
  }
}

// Run initialization
initDb()
