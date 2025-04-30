"use server"

/**
 * @description
 * This server page serves as the entry point for the argument locator feature in the Neurogenesis app.
 * It fetches all debates from the database and renders the ArgumentLocator component to display them.
 *
 * Key features:
 * - Authentication: Restricts access to authenticated users via Clerk
 * - Data Fetching: Retrieves all debates using getAllDebatesAction
 * - Error Handling: Displays error message if debate fetch fails
 * - Styling: Uses Neurogenesis design system (black bg, gold primary, white text)
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - "@/actions/db/debates-actions": Fetches debates with getAllDebatesAction
 * - "@/components/argument-locator/locator": Renders the argument locator UI
 * - next/navigation: Provides redirect for unauthenticated users
 *
 * @notes
 * - Server component for secure data fetching per project rules
 * - Redirects to /login if user is not authenticated
 * - Assumes debates are sourced from Step 15; future steps may add real-time filtering
 * - Edge case: No debates fetched results in an error message
 * - Limitation: Currently displays all debates; platform-specific search to be added later
 */

import { auth } from "@clerk/nextjs/server"
import { getAllDebatesAction } from "@/actions/db/debates-actions"
import ArgumentLocator from "@/components/argument-locator/locator"
import { redirect } from "next/navigation"
import { SelectDebate } from "@/db/schema/debates-schema"

/**
 * Argument locator page component that fetches and displays debates.
 *
 * @returns {Promise<JSX.Element>} The rendered argument locator page or error message
 */
export default async function ArgumentLocatorPage() {
  // Get authenticated user ID from Clerk
  const { userId } = await auth()
  if (!userId) {
    // Redirect unauthenticated users to login page
    redirect("/login")
  }

  // Fetch all debates from the database
  const debatesResult = await getAllDebatesAction()
  if (!debatesResult.isSuccess) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Argument Locator</h1>
        <p className="text-red-500">
          Error: Failed to load debates - {debatesResult.message}
        </p>
      </div>
    )
  }

  const debates: SelectDebate[] = debatesResult.data

  // Render the page with the ArgumentLocator component
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Argument Locator</h1>
      <ArgumentLocator debates={debates} />
    </div>
  )
}
