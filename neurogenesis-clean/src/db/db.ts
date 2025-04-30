import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

// For development, use a local postgres connection
// For production, this will use connection strings from environment variables
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/neurogenesis"

// Initialize postgres client
const client = postgres(connectionString, { prepare: false })

// Initialize drizzle with the postgres client
export const db = drizzle(client)