"use server"

/**
 * @description
 * This server component serves as the main page for displaying sourced debates in the Neurogenesis app.
 * It fetches debates from the database using a server action and renders them via the DebateList component.
 *
 * Key features:
 * - Fetches all debates using getAllDebatesAction
 * - Handles success and failure cases with error display
 * - Passes debates to DebateList for rendering
 * - Styled with Tailwind and design system (black bg, gold primary)
 *
 * @dependencies
 * - getAllDebatesAction: Server action to fetch debates from '@/actions/db/debates-actions'
 * - DebateList: Client component to display debates from '@/components/debates/debate-list'
 *
 * @notes
 * - Uses server component for data fetching as per Next.js and project rules
 * - Simple error handling displays message on fetch failure
 * - No Suspense used since async handling is inherent to server components
 * - Assumes debates are fetched successfully for rendering; pagination to be added later
 * - Edge case: Empty debate list is handled by DebateList
 */

import { getAllDebatesAction } from "@/actions/db/debates-actions"
import DebateList from "@/components/debates/debate-list"

/**
 * Debates page component
 * @returns {Promise<JSX.Element>} The rendered debates page
 */
export default async function DebatesPage() {
  // Fetch debates using the server action
  const result = await getAllDebatesAction()

  // Handle failure case by displaying an error message
  if (!result.isSuccess) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-red-500">Error: {result.message}</p>
      </div>
    )
  }

  // Render the page with the DebateList component
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Debates</h1>
      <DebateList debates={result.data} />
    </div>
  )
}
