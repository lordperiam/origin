"use server"

/**
 * @description
 * This server component serves as the page for viewing the transcript of a specific debate in the Neurogenesis app.
 * It fetches the debate details and its transcripts, then renders the transcript content using the TranscriptViewer component.
 *
 * Key features:
 * - Fetches debate details using getDebateByIdAction
 * - Fetches transcripts using getDebateTranscriptsAction
 * - Displays the first transcript’s content (assumes one primary transcript per debate)
 * - Handles missing debate or transcripts with user-friendly messages
 * - Styled with Tailwind adhering to design system (black bg, gold primary, white text)
 *
 * @dependencies
 * - getDebateByIdAction: Server action to fetch debate details from '@/actions/db/debates-actions'
 * - getDebateTranscriptsAction: Server action to fetch transcripts from '@/actions/ai/transcript-actions'
 * - TranscriptViewer: Component to render transcript content from '@/components/transcripts/transcript-viewer'
 * - notFound: Next.js utility for 404 handling
 *
 * @notes
 * - Uses server component for data fetching per Next.js and project rules
 * - Assumes one transcript per debate for simplicity; future steps may handle multiple transcripts
 * - No Suspense used as async operations are awaited directly, showing full page or error
 * - Edge case: Returns 404 if debate isn’t found; shows message if no transcripts exist
 * - Limitation: Does not support selecting among multiple transcripts yet
 */

/**
 * Imports required for the transcript page functionality.
 */
import { getDebateByIdAction } from "@/actions/db/debates-actions"
import { getDebateTranscriptsAction } from "@/actions/ai/transcript-actions"
import TranscriptViewer from "@/components/transcripts/transcript-viewer"
import { notFound } from "next/navigation"

/**
 * Props interface for the TranscriptPage component.
 * @interface TranscriptPageProps
 */
interface TranscriptPageProps {
  params: Promise<{ debateId: string }> // Dynamic route params with debateId
}

/**
 * Transcript page component that fetches and displays a debate’s transcript.
 *
 * @param {TranscriptPageProps} props - Component props containing route parameters
 * @returns {Promise<JSX.Element>} The rendered transcript page or error message
 */
export default async function TranscriptPage({ params }: TranscriptPageProps) {
  // Await params to get debateId per Next.js server component rules
  const { debateId } = await params

  // Fetch debate details to display title and verify existence
  const debateResult = await getDebateByIdAction(debateId)
  if (!debateResult.isSuccess) {
    // Return 404 if debate isn’t found
    return notFound()
  }
  const debate = debateResult.data

  // Fetch transcripts for the debate
  const transcriptsResult = await getDebateTranscriptsAction(debateId)
  if (!transcriptsResult.isSuccess || transcriptsResult.data.length === 0) {
    // Display message if no transcripts are available
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-8 text-4xl font-bold text-white">
          {(debate?.title ?? "Untitled Debate") + " - Transcript"}
        </h1>

        <div className="mt-4" />

        <div>
          <p className="text-white">No transcript available for this debate.</p>
        </div>
      </div>
    )
  }

  // Take the first transcript (assumption: one primary transcript per debate)
  const transcript = transcriptsResult.data[0]

  // Render the page with debate title and transcript content
  return (
    <div className="container mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          {(debate?.title ?? "Untitled Debate") + " - Transcript"}
        </h1>
      </div>

      <div>
        <TranscriptViewer content={transcript?.content ?? ""} />
      </div>
    </div>
  )
}
