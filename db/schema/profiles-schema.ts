/*
Defines the database schema for profiles.
This schema stores user-related data, including membership status and Stripe integration details.
It aligns with the technical specification's "users" table but uses "profiles" to match the starter template.
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  jsonb,
  boolean
} from "drizzle-orm/pg-core"

/**
 * Enum for membership types, supporting free, pro, and institutional users as per the project requirements.
 */
export const membershipEnum = pgEnum("membership", [
  "free",
  "pro",
  "institutional"
])

/**
 * Profiles table definition.
 * Stores user metadata linked to Clerk authentication and Stripe payments.
 *
 * Key features:
 * - userId: Links to Clerk's user ID for authentication
 * - membership: Tracks subscription tier (free, pro, institutional)
 * - stripeCustomerId: Associates user with Stripe customer for payments
 * - stripeSubscriptionId: Tracks active Stripe subscription
 * - Timestamps: Records creation and update times for auditing
 *
 * @dependencies
 * - drizzle-orm/pg-core: Provides PostgreSQL schema utilities
 *
 * @notes
 * - Does not include fields like email or name since Clerk manages those
 * - Cascade deletes are not applicable as this is a top-level entity
 */
export const profilesTable = pgTable("profiles", {
  // Primary key linked to Clerk user ID
  userId: text("user_id").primaryKey().notNull(),
  // Membership status with default to 'free'
  membership: membershipEnum("membership").notNull().default("free"),
  // Optional Stripe customer ID for payment integration
  stripeCustomerId: text("stripe_customer_id"),
  // Optional Stripe subscription ID for subscription tracking
  stripeSubscriptionId: text("stripe_subscription_id"),
  // Analysis settings stored as JSONB
  analysisSettings: jsonb("analysis_settings").default({
    detectRhetoricalDevices: true,
    detectFallacies: true,
    enableFactChecking: false
  }),
  // Onboarding completed status with default to 'false'
  onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
  // Creation timestamp, defaults to current time
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Update timestamp, updates on modification
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

/**
 * Type for inserting a new profile.
 */
export type InsertProfile = typeof profilesTable.$inferInsert

/**
 * Type for selecting a profile.
 */
export type SelectProfile = typeof profilesTable.$inferSelect
