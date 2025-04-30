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
    debates: debatesTable,
    transcripts: transcriptsTable,
    profiles: profilesTable,
    analyses: analysesTable
  }
})

// Define relations separately
debatesRelations
transcriptsRelations

// Initialize tables if they don't exist
const initDb = async () => {
  try {
    // Enable pgcrypto for UUID generation
    await queryClient`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`

    // Create membership enum type if it doesn't exist
    await queryClient`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'membership'
        ) THEN
          CREATE TYPE membership AS ENUM ('free', 'pro', 'institutional');
        END IF;
      END $$;
    `

    // Create debates table
    await queryClient`
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
    `

    // Create transcripts table
    await queryClient`
      CREATE TABLE IF NOT EXISTS transcripts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        language TEXT NOT NULL DEFAULT 'en',
        verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `

    // Create profiles table
    await queryClient`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY NOT NULL,
        membership membership NOT NULL DEFAULT 'free',
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        analysis_settings JSONB DEFAULT '{"detectRhetoricalDevices":true,"detectFallacies":true,"enableFactChecking":false}',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `

    // Ensure analysis_settings column exists
    await queryClient`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'profiles' AND column_name = 'analysis_settings'
        ) THEN
          ALTER TABLE profiles 
          ADD COLUMN analysis_settings JSONB DEFAULT '{"detectRhetoricalDevices":true,"detectFallacies":true,"enableFactChecking":false}';
        END IF;
      END $$;
    `

    // Ensure onboardingCompleted column exists
    await queryClient`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
        ) THEN
          ALTER TABLE profiles 
          ADD COLUMN onboarding_completed BOOLEAN DEFAULT false NOT NULL;
        END IF;
      END $$;
    `

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database tables:", error)
  } finally {
    await migrationClient.end()
  }
}

// Run initialization
initDb()

export { initDb }
