"use server"

/**
 * @description
 * This server page serves as the entry point for the privacy settings in the Neurogenesis app.
 * It fetches the user's profile data and renders the PrivacySettings component for managing privacy controls.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated users
 * - Data Fetching: Retrieves user profile via server actions
 * - Error Handling: Redirects unauthenticated users or shows error if profile fetch fails
 * - Styling: Integrates with dashboard layout and Neurogenesis design system
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/actions/db/profiles-actions": Fetches profile with getProfileByUserIdAction
 * - "@/components/settings/privacy-settings": Renders the privacy settings UI
 * - next/navigation: Provides redirect for unauthenticated users
 *
 * @notes
 * - Server component for secure data fetching per project rules
 * - Redirects to /login if not authenticated
 * - Displays error if profile cannot be loaded
 * - Assumes dashboard layout from Step 14 wraps this page
 * - Edge case: No profile found results in an error message
 */
import { auth } from "@clerk/nextjs/server"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import PrivacySettings from "@/components/settings/privacy-settings"
import { redirect } from "next/navigation"

/**
 * Privacy settings page component that fetches and displays user privacy settings.
 *
 * @returns {Promise<JSX.Element>} The rendered privacy settings page or error message
 */
export default async function PrivacySettingsPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()
  if (!userId) {
    // Redirect to login if not authenticated
    redirect("/login")
  }

  // Fetch user profile using server action
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Privacy Settings</h1>
        <p className="text-red-500">Error: Failed to load user profile</p>
      </div>
    )
  }

  const profile = profileResult.data

  // Render the privacy settings component with profile data
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Privacy Settings</h1>
      <PrivacySettings profile={profile} />
    </div>
  )
}
