"use server"

/**
 * @description
 * This server page serves as the entry point for the institutional dashboard in the Neurogenesis app.
 * It fetches institutional-specific debate data and renders the InstitutionalDashboard component.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated institutional users
 * - Data Fetching: Retrieves all debates via server actions for institutional analysis
 * - Authorization: Ensures only institutional members can access this dashboard
 * - Error Handling: Handles unauthenticated users, unauthorized access, and data fetch failures
 * - Styling: Integrates with dashboard layout and Neurogenesis design system
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/actions/db/debates-actions": Fetches debates with getAllDebatesAction
 * - "@/actions/db/profiles-actions": Fetches user profile with getProfileByUserIdAction
 * - "@/components/dashboard/institutional-dashboard": Renders the institutional dashboard UI
 *
 * @notes
 * - Assumes debates are not yet filtered by institution; future steps may add institutional-specific filtering
 * - Uses server component per project rules for data fetching
 * - No Suspense needed as async operations are straightforward
 * - Edge case: Redirects non-institutional users to the standard dashboard
 * - Limitation: Basic data fetching; advanced analytics will be mocked until fully implemented
 */

import { auth } from "@clerk/nextjs/server"
import { getAllDebatesAction } from "@/actions/db/debates-actions"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import InstitutionalDashboard from "@/components/dashboard/institutional-dashboard"
import { redirect } from "next/navigation"
import { SelectDebate } from "@/db/schema/debates-schema"
import Link from "next/link"

/**
 * Institutional dashboard page component that fetches and displays institutional data.
 *
 * @returns {Promise<JSX.Element>} The rendered institutional dashboard page
 */
export default async function InstitutionalDashboardPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()

  // Redirect unauthenticated users to login
  if (!userId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Institutional Dashboard
        </h1>
        <p className="text-white">
          Please{" "}
          <Link href="/login" className="text-primary hover:underline">
            sign in
          </Link>{" "}
          to access the institutional dashboard.
        </p>
      </div>
    )
  }

  // Fetch user profile to verify membership
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Institutional Dashboard
        </h1>
        <p className="text-red-500">Error: Failed to load user profile</p>
      </div>
    )
  }

  // Check if user has institutional membership; redirect otherwise
  if (profileResult.data.membership !== "institutional") {
    redirect("/dashboard") // Redirect to standard user dashboard
  }

  // Fetch all debates (institutional users see all for now; filtering to be added later)
  const debatesResult = await getAllDebatesAction()
  let debates: SelectDebate[] = []
  if (debatesResult.isSuccess) {
    debates = debatesResult.data
  } else {
    console.error("Failed to fetch debates:", debatesResult.message)
  }

  // Mock advanced analytics data (to be replaced with real analysis in future steps)
  const mockAnalytics = {
    totalDebates: debates.length,
    averageParticipants: debates.length
      ? debates.reduce(
          (sum, debate) => sum + (debate.participants?.length || 0),
          0
        ) / debates.length
      : 0,
    platformsUsed: [...new Set(debates.map(debate => debate.sourcePlatform))]
      .length
  }

  // Render the dashboard with fetched data or error message
  if (!debatesResult.isSuccess) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Institutional Dashboard
        </h1>
        <p className="text-red-500">Error: Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Institutional Dashboard
      </h1>
      <InstitutionalDashboard debates={debates} analytics={mockAnalytics} />
    </div>
  )
}
