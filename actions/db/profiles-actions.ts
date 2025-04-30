/**
 * @description
 * Contains server actions related to profiles in the Neurogenesis app database.
 * This file provides CRUD operations for managing user profiles and additional actions for specific features like analysis settings.
 * It aligns with the technical specification's "users" table but uses "profiles" to match the starter template.
 *
 * Key features:
 * - CRUD Operations: Create, read, update, and delete user profiles
 * - Analysis Settings: Updates user-specific analysis criteria
 *
 * @dependencies
 * - drizzle-orm: For database operations via db instance
 * - @clerk/nextjs/server: For authentication via auth()
 * - "@/db/schema/profiles-schema": Profile table schema and types
 * - "@/types": ActionState type for consistent return values
 *
 * @notes
 * - All actions are server-side per project rules
 * - Uses kebab-case naming for files as required
 * - Assumes Clerk user IDs are unique and linked to profiles
 */

"use server"

import { db } from "@/db/db"
import {
  InsertProfile,
  profilesTable,
  SelectProfile
} from "@/db/schema/profiles-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import { auth } from "@clerk/nextjs/server"

/**
 * Creates a new user profile in the database.
 *
 * @param {InsertProfile} data - The profile data to insert, excluding auto-generated fields like timestamps
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with the created profile or error message
 */
export async function createProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    return {
      isSuccess: true,
      message: "Profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating profile:", error)
    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { isSuccess: false, message: `Failed to create profile: ${errorMessage}` }
  }
}

/**
 * Retrieves a user profile by Clerk user ID.
 *
 * @param {string} userId - The Clerk user ID to retrieve the profile for
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with the profile or error message
 */
export async function getProfileByUserIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.userId, userId))
      .limit(1)

    if (!profile) {
      return {
        isSuccess: false,
        message: "Profile not found"
      }
    }

    return {
      isSuccess: true,
      message: "Profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting profile by user id:", error)
    return {
      isSuccess: false,
      message: "Failed to get profile by user id"
    }
  }
}

/**
 * Updates an existing user profile by Clerk user ID.
 *
 * @param {string} userId - The Clerk user ID of the profile to update
 * @param {Partial<InsertProfile>} data - Partial profile data to update
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with the updated profile or error message
 */
export async function updateProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    return {
      isSuccess: true,
      message: "Profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { isSuccess: false, message: "Failed to update profile" }
  }
}

/**
 * Updates an existing user profile by Stripe customer ID.
 *
 * @param {string} stripeCustomerId - The Stripe customer ID of the profile to update
 * @param {Partial<InsertProfile>} data - Partial profile data to update
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with the updated profile or error message
 */
export async function updateProfileByStripeCustomerIdAction(
  stripeCustomerId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found by Stripe customer ID"
      }
    }

    return {
      isSuccess: true,
      message: "Profile updated by Stripe customer ID successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating profile by stripe customer ID:", error)
    return {
      isSuccess: false,
      message: "Failed to update profile by Stripe customer ID"
    }
  }
}

/**
 * Deletes a user profile by Clerk user ID.
 *
 * @param {string} userId - The Clerk user ID of the profile to delete
 * @returns {Promise<ActionState<void>>} - ActionState indicating success or failure
 */
export async function deleteProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))
    return {
      isSuccess: true,
      message: "Profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { isSuccess: false, message: "Failed to delete profile" }
  }
}

/**
 * Updates analysis settings for a user profile by Clerk user ID.
 *
 * @param {string} userId - The Clerk user ID of the profile to update
 * @param {Object} settings - Analysis settings to update
 * @param {boolean} settings.detectRhetoricalDevices - Enable rhetorical device detection
 * @param {boolean} settings.detectFallacies - Enable fallacy detection
 * @param {boolean} settings.enableFactChecking - Enable fact-checking
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with the updated profile or error message
 *
 * @notes
 * - Currently mocks settings storage by updating `updatedAt`; schema lacks settings column
 * - Future steps will add a JSONB column (e.g., analysisSettings) to profilesTable
 * - Validates authenticated user matches the profile being updated
 * - Edge case: Missing settings fields are ignored; only provided fields are processed
 */
export async function updateAnalysisSettingsAction(
  userId: string,
  settings: {
    detectRhetoricalDevices: boolean
    detectFallacies: boolean
    enableFactChecking: boolean
  }
): Promise<ActionState<SelectProfile>> {
  try {
    if (!userId) {
      return { isSuccess: false, message: "User ID is required" }
    }
    if (!settings || Object.keys(settings).length === 0) {
      return { isSuccess: false, message: "Settings data is required" }
    }

    const { userId: authUserId } = await auth()
    if (!authUserId || authUserId !== userId) {
      return {
        isSuccess: false,
        message: "Unauthorized: User must be authenticated and match profile"
      }
    }

    const [updatedProfile] = await db
      .update(profilesTable)
      .set({ 
        analysisSettings: settings,
        updatedAt: new Date()
      })
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return { isSuccess: false, message: "Profile not found to update" }
    }

    console.log("Updated analysis settings for user:", userId, settings)

    return {
      isSuccess: true,
      message: "Analysis settings updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating analysis settings:", error)
    return { isSuccess: false, message: "Failed to update analysis settings" }
  }
}