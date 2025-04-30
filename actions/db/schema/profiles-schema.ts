/*
Defines the database schema for profiles.
This schema stores user-related data, including membership status, Stripe integration details, and privacy settings.
It aligns with the technical specification's "users" table but uses "profiles" to match the starter template.
*/

import { pgEnum, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

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
 * Stores user metadata linked to Clerk authentication, Stripe payments, and privacy preferences.
 *
 * Key features:
 * - userId: Links to Clerk's user ID for authentication
 * - membership: Tracks subscription tier (free, pro, institutional)
 * - stripeCustomerId/stripeSubscriptionId: Associates user with Stripe for payments
 * - isVerified: Indicates if the user’s identity is verified
 * - isProfilePublic: Controls profile visibility (public/private)
 * - isContributionsAnonymized: Controls contribution attribution
 * - Timestamps: Records creation and update times for auditing
 *
 * @dependencies
 * - drizzle-orm/pg-core: Provides PostgreSQL schema utilities
 *
 * @notes
 * - Does not include fields like email or name since Clerk manages those
 * - Cascade deletes are not applicable as this is a top-level entity
 * - Privacy fields added to support Step 24 requirements
 * - Edge case: Unverified users have isContributionsAnonymized enforced as true in UI
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
  // Verification status, defaults to false (set via verification process)
  isVerified: boolean("is_verified").default(false).notNull(),
  // Profile visibility, defaults to true (public)
  isProfilePublic: boolean("is_profile_public").default(true).notNull(),
  // Contribution anonymization, defaults to true (anonymized)
  isContributionsAnonymized: boolean("is_contributions_anonymized")
    .default(true)
    .notNull(),
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