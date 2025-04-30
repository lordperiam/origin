"use server"

/**
 * @description
 * This server page serves as the entry point for the user dashboard in the Neurogenesis app.
 * It fetches user-specific debate and analysis data and renders the UserDashboard component.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated users
 * - Data Fetching: Retrieves user's debates and analyses via server actions
 * - Error Handling: Displays a message if data fetching fails
 * - Styling: Integrates with dashboard layout and design system
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/actions/db/debates-actions": Fetches debates with getAllDebatesAction
 * - "@/actions/ai/analysis-actions": Fetches analyses (mocked until implemented)
 * - "@/components/dashboard/user-dashboard": Renders the dashboard UI
 *
 * @notes
 * - Assumes debates are not user-specific yet; future steps will filter by userId
 * - Uses server component per project rules for data fetching
 * - No Suspense needed as async operations are straightforward
 * - Edge case: Handles unauthenticated users with a redirect prompt
 * - Limitation: Analysis fetching is mocked; awaits Step 10 completion
 */

import { auth } from "@clerk/nextjs/server"
import { getAllDebatesAction } from "@/actions/db/debates-actions"
// Placeholder until analysis-actions is fully implemented
import { ActionState } from "@/types"
import { SelectDebate } from "@/db/schema/debates-schema"
import UserDashboard from "@/components/dashboard/user-dashboard"
import Link from "next/link"

/**
 * Dashboard page component that fetches and displays user data.
 *
 * @returns {Promise<JSX.Element>} The rendered dashboard page
 */
export default async function DashboardPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()

  // Redirect unauthenticated users
  if (!userId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-white">
          Please{" "}
          <Link href="/login" className="text-primary hover:underline">
            sign in
          </Link>{" "}
          to access your dashboard.
        </p>
      </div>
    )
  }

  // Fetch user's debates (currently all debates; to be filtered by userId later)
  const debatesResult = await getAllDebatesAction()
  let debates: SelectDebate[] = []
  if (debatesResult.isSuccess) {
    debates = debatesResult.data
  } else {
    console.error("Failed to fetch debates:", debatesResult.message)
  }

  // Mock analysis fetch (replace with real action once Step 10 is complete)
  const mockAnalysesResult: ActionState<any[]> = {
    isSuccess: true,
    message: "Mock analyses retrieved",
    data: debates.map(debate => ({
      id: `${debate.id}-analysis`,
      debateId: debate.id,
      results: {
        rhetoricalDevices: ["Ethos", "Pathos"],
        fallacies: ["Ad Hominem"],
        argumentQuality: 7
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }

  // Render the dashboard with fetched data or error message
  if (!debatesResult.isSuccess) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-red-500">Error: Failed to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Your Dashboard</h1>
      <UserDashboard
        debates={debates}
        analyses={mockAnalysesResult.isSuccess ? mockAnalysesResult.data : []}
      />
    </div>
  )
}
