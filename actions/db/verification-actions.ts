/*
Contains server actions related to user identity verification in the Neurogenesis app.
This file provides actions to initiate and complete identity verification, updating user profiles accordingly.
It supports the requirement for robust identity verification of debate participants and users.
*/

"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { profilesTable, SelectProfile } from "@/db/schema/profiles-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import Securimage from "securimage";
import path from "path";

/**
 * Interface for verification request data.
 * Represents the data needed to initiate a verification request.
 *
 * @property {string} userId - Clerk user ID of the user requesting verification
 * @property {string} [identityDocument] - Optional document ID or type (mocked for now)
 */
interface VerificationRequest {
  userId: string
  identityDocument?: string
}

/**
 * Interface for verification completion data.
 * Represents the data returned from an external verification service (mocked).
 *
 * @property {string} userId - Clerk user ID of the verified user
 * @property {boolean} isVerified - Verification status
 */
interface VerificationResponse {
  userId: string
  isVerified: boolean
}

/**
 * Initiates an identity verification request for a user.
 *
 * @param {VerificationRequest} request - The verification request data
 * @returns {Promise<ActionState<string>>} - ActionState with a verification token or error message
 *
 * @description
 * This action checks if the user is authenticated, verifies their profile exists,
 * and initiates a verification process (mocked as an external service call).
 * It returns a token that would be used to complete verification.
 *
 * Key features:
 * - Authentication check using Clerk
 * - Profile existence validation
 * - Mocked external service call (placeholder for real integration)
 *
 * @dependencies
 * - @clerk/nextjs/server: For authentication via auth()
 * - @/db/db: Drizzle ORM database instance
 * - @/db/schema/profiles-schema: Profile table schema
 * - @/types: ActionState type
 *
 * @notes
 * - Currently mocks an external service; replace with real API (e.g., ID.me) in production
 * - Token is a placeholder; real service would provide a unique token
 * - Edge case: Unauthenticated users or missing profiles return errors
 * - Limitation: No real verification logic until external service is integrated
 */
export async function initiateVerificationAction(
  request: VerificationRequest
): Promise<ActionState<string>> {
  try {
    // Get authenticated user ID
    const { userId } = await auth()
    if (!userId || userId !== request.userId) {
      return {
        isSuccess: false,
        message: "Unauthorized: User must be authenticated to initiate verification"
      }
    }

    // Check if profile exists
    const profile = await db.query.profiles.findFirst({
      where: eq(profilesTable.userId, userId)
    })
    if (!profile) {
      return {
        isSuccess: false,
        message: "Profile not found for user"
      }
    }

    // Generate CAPTCHA using Securimage
    const captcha = new Securimage({
      image_width: 215,
      image_height: 80,
      image_bg_color: "#f4f4f4",
      text_color: "#333",
    });

    const captchaPath = path.join("public", "captcha", `${userId}.png`);
    captcha.generate(captchaPath);

    return {
      isSuccess: true,
      message: "Verification initiated successfully",
      data: `/captcha/${userId}.png`,
    };
  } catch (error) {
    console.error("Error initiating verification:", error);
    return {
      isSuccess: false,
      message: "Failed to initiate verification",
    };
  }
}

/**
 * Completes an identity verification process for a user.
 *
 * @param {string} verificationToken - Token from the verification initiation
 * @param {string} captchaInput - User's input for the CAPTCHA
 * @returns {Promise<ActionState<SelectProfile>>} - ActionState with updated profile or error
 *
 * @description
 * This action validates the token, mocks an external service response,
 * and updates the user's profile with a verification status.
 *
 * Key features:
 * - Token validation (mocked)
 * - Profile update with verification status
 * - Error handling for invalid tokens or database issues
 *
 * @dependencies
 * - @clerk/nextjs/server: For authentication via auth()
 * - @/db/db: Drizzle ORM database instance
 * - @/db/schema/profiles-schema: Profile table schema
 * - @/types: ActionState type
 *
 * @notes
 * - Adds isVerified field to profile dynamically; schema update required
 * - Mock response assumes success; real service would provide actual status
 * - Edge case: Invalid tokens or unauthenticated users return errors
 * - Limitation: No real external service integration yet
 */
export async function completeVerificationAction(
  verificationToken: string,
  captchaInput: string
): Promise<ActionState<SelectProfile>> {
  try {
    // Get authenticated user ID
    const { userId } = await auth()
    if (!userId) {
      return {
        isSuccess: false,
        message: "Unauthorized: User must be authenticated to complete verification"
      }
    }

    // Validate CAPTCHA input
    const captcha = new Securimage();
    const isCaptchaValid = captcha.check(captchaInput);

    if (!isCaptchaValid) {
      return {
        isSuccess: false,
        message: "Invalid CAPTCHA input",
      };
    }

    // Mock token validation and external service response
    // In production, verify token with external service and get real response
    if (!verificationToken.startsWith(`mock-verification-token-${userId}`)) {
      return {
        isSuccess: false,
        message: "Invalid or expired verification token"
      }
    }

    const mockResponse: VerificationResponse = {
      userId,
      isVerified: true // Mock success; real service would determine this
    }

    // Update profile with verification status
    const [updatedProfile] = await db
      .update(profilesTable)
      .set({ isVerified: mockResponse.isVerified }) // Assumes isVerified column exists
      .where(eq(profilesTable.userId, userId))
      .returning()

    if (!updatedProfile) {
      return {
        isSuccess: false,
        message: "Profile not found to complete verification"
      }
    }

    return {
      isSuccess: true,
      message: "Verification completed successfully",
      data: updatedProfile
    }
  } catch (error) {
    console.error("Error completing verification:", error)
    return {
      isSuccess: false,
      message: "Failed to complete verification"
    }
  }
}