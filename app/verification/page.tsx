"use server"

/**
 * @description
 * This server page serves as the identity verification interface for the Neurogenesis app.
 * It fetches user authentication status and renders a form for users to initiate verification.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated users
 * - Data Fetching: Checks user profile for existing verification status
 * - UI Integration: Passes data to a client component for interactivity
 * - Styling: Adheres to Neurogenesis design system (black bg, gold primary)
 *
 * @dependencies
 * - @clerk/nextjs/server: For authentication via auth()
 * - @/actions/db/profiles-actions: Fetches user profile
 * - @/components/verification/verification-form: Client component for form UI
 *
 * @notes
 * - Server component for initial data fetching per project rules
 * - No Suspense needed as async operations are straightforward
 * - Edge case: Redirects unauthenticated users to login
 * - Limitation: Assumes profile exists; future steps may handle creation
 */

import { auth } from "@clerk/nextjs/server"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import VerificationForm from "@/components/verification/verification-form"
import Link from "next/link"

/**
 * Verification page component that handles initial rendering and data fetching.
 *
 * @returns {Promise<JSX.Element>} The rendered verification page
 */
export default async function VerificationPage() {
  // Get authenticated user ID
  const { userId } = await auth()

  // Redirect unauthenticated users to login
  if (!userId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Identity Verification
        </h1>
        <p className="text-white">
          Please{" "}
          <Link href="/login" className="text-primary hover:underline">
            sign in
          </Link>{" "}
          to verify your identity.
        </p>
      </div>
    )
  }

  // Fetch user profile
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Identity Verification
        </h1>
        <p className="text-red-500">Error: Failed to load user profile</p>
      </div>
    )
  }

  const profile = profileResult.data

  // Render the verification page with the form
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Identity Verification
      </h1>
      <VerificationForm
        userId={userId}
        isVerified={
          "isVerified" in profile ? (profile as any).isVerified : false
        } // Safely handle missing isVerified property
      />
    </div>
  )
}
