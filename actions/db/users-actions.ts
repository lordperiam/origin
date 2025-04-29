/*
Contains server actions related to user profiles in the DB.
This file provides CRUD operations for managing user profiles, aligning with the technical specification's "users" table.
It builds on the starter template's profiles-actions.ts but uses "users" for clarity with the implementation plan.
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

/**
 * Creates a new user profile in the database.
 * 
 * @param data - The profile data to insert, excluding auto-generated fields like timestamps.
 * @returns A promise resolving to an ActionState with the created profile or an error message.
 * 
 * @remarks
 * - Uses Drizzle ORM’s insert method with returning clause to fetch the created record.
 * - Assumes `userId` in `data` matches a Clerk user ID for authentication linkage.
 * 
 * @throws {Error} Logs and returns failure if the database operation fails (e.g., duplicate userId).
 * 
 * @example
 * const result = await createUserProfileAction({ userId: "user_123", membership: "free" });
 * if (result.isSuccess) console.log(result.data);
 */
export async function createUserProfileAction(
  data: InsertProfile
): Promise<ActionState<SelectProfile>> {
  try {
    // Insert the new profile into profilesTable and return the created record
    const [newProfile] = await db.insert(profilesTable).values(data).returning()
    
    return {
      isSuccess: true,
      message: "User profile created successfully",
      data: newProfile
    }
  } catch (error) {
    console.error("Error creating user profile:", error)
    return {
      isSuccess: false,
      message: "Failed to create user profile"
    }
  }
}

/**
 * Retrieves a user profile by Clerk user ID.
 * 
 * @param userId - The Clerk user ID to retrieve the profile for.
 * @returns A promise resolving to an ActionState with the profile or an error message.
 * 
 * @remarks
 * - Uses Drizzle ORM’s query method with a where clause to find the profile.
 * - Returns a failure if no profile exists for the given userId.
 * 
 * @throws {Error} Logs and returns failure if the database query fails (e.g., connection issues).
 * 
 * @example
 * const result = await getUserProfileByIdAction("user_123");
 * if (result.isSuccess) console.log(result.data);
 */
export async function getUserProfileByIdAction(
  userId: string
): Promise<ActionState<SelectProfile>> {
  try {
    // Query the profile using the userId from profilesTable
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })

    if (!profile) {
      return {
        isSuccess: false,
        message: "User profile not found"
      }
    }

    return {
      isSuccess: true,
      message: "User profile retrieved successfully",
      data: profile
    }
  } catch (error) {
    console.error("Error getting user profile by ID:", error)
    return {
      isSuccess: false,
      message: "Failed to get user profile"
    }
  }
}

/**
 * Updates an existing user profile by Clerk user ID.
 * 
 * @param userId - The Clerk user ID of the profile to update.
 * @param data - Partial profile data to update (e.g., membership, stripeCustomerId).
 * @returns A promise resolving to an ActionState with the updated profile or an error message.
 * 
 * @remarks
 * - Uses Drizzle ORM’s update method with returning clause to fetch the updated record.
 * - Only updates fields provided in `data`; others remain unchanged.
 * 
 * @throws {Error} Logs and returns failure if the update fails (e.g., profile not found).
 * 
 * @example
 * const result = await updateUserProfileAction("user_123", { membership: "pro" });
 * if (result.isSuccess) console.log(result.data);
 */
export async function updateUserProfileAction(
  userId: string,
  data: Partial<InsertProfile>
): Promise<ActionState<SelectProfile>> {
  try {
    // Update the profile in profilesTable where userId matches and return the updated record
    const [updatedProfile] = await db
      .update(profilesTable)
      .set(data)
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "User profile not found to update"
      }
    }

    return {
      isSuccess: true,
      message: "User profile updated successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return {
      isSuccess: false,
      message: "Failed to update user profile"
    }
  }
}

/**
 * Deletes a user profile by Clerk user ID.
 * 
 * @param userId - The Clerk user ID of the profile to delete.
 * @returns A promise resolving to an ActionState indicating success or failure.
 * 
 * @remarks
 * - Uses Drizzle ORM’s delete method to remove the profile.
 * - Returns `undefined` as data since no record is returned on deletion.
 * 
 * @throws {Error} Logs and returns failure if the deletion fails (e.g., database error).
 * 
 * @example
 * const result = await deleteUserProfileAction("user_123");
 * if (result.isSuccess) console.log("Profile deleted");
 */
export async function deleteUserProfileAction(
  userId: string
): Promise<ActionState<void>> {
  try {
    // Delete the profile from profilesTable where userId matches
    await db.delete(profilesTable).where(eq(profilesTable.userId, userId))

    return {
      isSuccess: true,
      message: "User profile deleted successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error deleting user profile:", error)
    return {
      isSuccess: false,
      message: "Failed to delete user profile"
    }
  }
}