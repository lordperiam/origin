"use server"

/**
 * @description
 * This server page serves as the entry point for the enhanced institutional dashboard in the Neurogenesis app.
 * It fetches institutional-specific debate data and renders the InstitutionalDashboard component.
 *
 * Key features:
 * - Authentication: Uses Clerk to restrict access to authenticated institutional users
 * - Data Fetching: Retrieves all debates via server actions for institutional analysis
 * - Authorization: Ensures only institutional members can access this dashboard
 * - Advanced UI/UX: Integrates with the neural visualization aesthetic
 * - Accessibility: Supports screen readers and colorblind-friendly design
 */

import { auth } from "@clerk/nextjs/server"
import { getAllDebatesAction } from "@/actions/db/debates-actions"
import { getProfileByUserIdAction } from "@/actions/db/profiles-actions"
import InstitutionalDashboard from "@/components/dashboard/institutional-dashboard"
import { redirect } from "next/navigation"
import { SelectDebate } from "@/db/schema/debates-schema"
import Link from "next/link"

/**
 * Institutional dashboard page component with enhanced UI/UX.
 *
 * @returns {Promise<JSX.Element>} The rendered institutional dashboard page
 */
export default async function InstitutionalDashboardPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()

  // Redirect unauthenticated users to login
  if (!userId) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md rounded-xl border border-blue-500/20 bg-black/40 p-8 shadow-[0_0_25px_rgba(59,130,246,0.3)] backdrop-blur-lg">
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            Institutional Dashboard
          </h1>
          <p className="mb-6 text-blue-50">
            Please sign in to access the institutional analytics dashboard.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Fetch user profile to verify membership
  const profileResult = await getProfileByUserIdAction(userId)
  if (!profileResult.isSuccess || !profileResult.data) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md rounded-xl border border-red-500/20 bg-black/40 p-8 shadow-[0_0_25px_rgba(239,68,68,0.3)] backdrop-blur-lg">
          <h1 className="mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
            Profile Error
          </h1>
          <p className="mb-6 text-red-300">
            Unable to load your user profile. Please try again later.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]"
          >
            Return to Dashboard
          </Link>
        </div>
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

  // Mock advanced analytics data for institutions
  const mockAnalytics = {
    totalDebates: debates.length,
    averageParticipants: debates.length
      ? debates.reduce(
          (sum, debate) => sum + (debate.participants?.length || 0),
          0
        ) / debates.length
      : 0,
    platformsUsed: [
      ...new Set(debates.map(debate => debate.sourcePlatform || "Unknown"))
    ].filter(platform => platform !== "Unknown").length
  }

  // Render the dashboard with fetched data or error message
  if (!debatesResult.isSuccess) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md rounded-xl border border-red-500/20 bg-black/40 p-8 shadow-[0_0_25px_rgba(239,68,68,0.3)] backdrop-blur-lg">
          <h1 className="mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
            Data Load Error
          </h1>
          <p className="mb-6 text-red-300">
            Unable to load dashboard data. Please try again later.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-red-500 px-6 py-3 text-sm font-medium text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-200 hover:scale-105 hover:bg-red-600 hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
            Institutional Analytics
          </h1>
          <p className="mt-2 max-w-2xl text-blue-200/70">
            Advanced neural visualizations and insights for your organization's
            debates and discussions
          </p>
        </div>
        <div className="hidden space-x-4 md:flex">
          <button className="rounded-lg border border-blue-500/20 bg-black/40 px-4 py-2 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)] backdrop-blur-lg transition-all hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </span>
          </button>
          <button className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Generate Report
            </span>
          </button>
        </div>
      </div>

      <InstitutionalDashboard debates={debates} analytics={mockAnalytics} />
    </div>
  )
}
