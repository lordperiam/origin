/**
 * @description
 * This server page serves as the entry point for the analysis settings in the Neurogenesis app.
 * It fetches the user's profile data and renders the AnalysisSettings component for managing customizable analysis criteria.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated users
 * - Data Fetching: Retrieves user profile via server actions for settings context
 * - Error Handling: Redirects unauthenticated users or shows error if profile fetch fails
 * - Styling: Integrates with dashboard layout and Neurogenesis design system
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/actions/db/profiles-actions": Fetches profile with getProfileByUserIdAction
 * - "@/components/settings/analysis-settings": Renders the analysis settings UI
 * - next/navigation: Provides redirect for unauthenticated users
 *
 * @notes
 * - Server component for secure data fetching per project rules
 * - Redirects to /login if not authenticated
 * - Creates a profile if one doesn't exist
 * - Assumes dashboard layout from Step 14 wraps this page
 * - Edge case: No profile found results in attempt to create a new one
 * - Limitation: Does not fetch existing analysis criteria; assumes defaults for now
 */

import { auth } from "@clerk/nextjs/server"
import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import AnalysisSettings from "../../../components/settings/analysis-settings"
import { redirect } from "next/navigation"

/**
 * Analysis settings page component that fetches and displays user analysis settings.
 * Creates a profile if one doesn't exist yet.
 *
 * @returns {Promise<JSX.Element>} The rendered analysis settings page or error message
 */
export default async function AnalysisSettingsPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()
  if (!userId) {
    // Redirect to login if not authenticated
    redirect("/login")
  }

  try {
    // Fetch user profile using server action
    let profileResult = await getProfileByUserIdAction(userId)

    // If profile doesn't exist, create one
    if (!profileResult.isSuccess || !profileResult.data) {
      console.log("Attempting to create profile for user:", userId)

      try {
        // Create a basic profile for the user with default settings
        // Only providing the required userId field and letting schema defaults handle the rest
        profileResult = await createProfileAction({
          userId
        })

        console.log("Profile creation result:", profileResult)
      } catch (createError) {
        console.error("Error during profile creation:", createError)
      }

      // If profile creation failed, show error
      if (!profileResult.isSuccess || !profileResult.data) {
        return (
          <div className="container mx-auto py-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white">
              Analysis Settings
            </h1>
            <p className="text-red-500">Error: {profileResult.message}</p>
            <p className="mt-2 text-sm text-red-300">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </div>
        )
      }
    }

    // Render the analysis settings component with profile data
    return (
      <div className="container mx-auto py-12">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Analysis Settings
        </h1>
        <AnalysisSettings
          userId={userId}
          initialSettings={
            (profileResult.data.analysisSettings as {
              detectRhetoricalDevices: boolean
              detectFallacies: boolean
              enableFactChecking: boolean
            }) || {
              detectRhetoricalDevices: true,
              detectFallacies: true,
              enableFactChecking: false
            }
          }
        />
      </div>
    )
  } catch (error) {
    console.error("Error in Analysis Settings Page:", error)
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Analysis Settings
        </h1>
        <p className="text-red-500">
          An error occurred while loading analysis settings
        </p>
      </div>
    )
  }
}
