/*
Configures Drizzle for the app.
This file sets up Drizzle Kit for schema introspection and migration generation.
It ensures the schema is correctly mapped and migrations are output to the right directory.
*/

import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

/**
 * Load environment variables from .env.local.
 * This is necessary to access DATABASE_URL for database credentials, following project rules.
 */
config({ path: ".env.local" })

/**
 * Define the Drizzle configuration.
 * This configuration tells Drizzle Kit where to find the schema, where to output migrations,
 * and how to connect to the PostgreSQL database.
 * 
 * Key features:
 * - schema: Points to the schema export file
 * - out: Specifies the migrations output directory
 * - dialect: Sets PostgreSQL as the database type
 * - dbCredentials: Uses DATABASE_URL from environment variables
 * 
 * @dependencies
 * - dotenv: Loads environment variables from .env.local
 * - drizzle-kit: Provides defineConfig for Drizzle configuration
 * 
 * @notes
 * - Assumes DATABASE_URL is set in .env.local by the user
 * - No direct database operations are performed here; this is for migration generation
 * @returns {object} Configuration object for Drizzle Kit
 */
export default defineConfig({
  // Path to the schema file that defines the database tables
  schema: "./db/schema/index.ts",
  // Directory where migration files will be generated
  out: "./db/migrations",
  // Database dialect; set to PostgreSQL as per technical specification
  dialect: "postgresql",
  // Database credentials; uses DATABASE_URL from environment variables for security
  dbCredentials: { url: process.env.DATABASE_URL! }
})