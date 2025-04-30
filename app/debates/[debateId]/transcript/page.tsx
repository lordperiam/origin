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
import { useRouter } from "next/router"
import TranscriptViewer from "@/components/transcripts/transcript-viewer"
import { ensureTranscriptForDebate } from "@/actions/ai/Transcripts/ensureTranscriptForDebate"
import TranscriptPageClient from "@/components/transcripts/TranscriptPageClient"
import { getDebateByIdAction } from "@/actions/db/debates-actions"
import { getDebateTranscriptsAction } from "@/actions/ai/transcript-actions"
import TranscriptStatusClient from "@/components/transcripts/transcript-status-client"
import { notFound } from "next/navigation"

/**
 * Props interface for the TranscriptPage component.
 * @interface TranscriptPageProps
 */
interface TranscriptPageProps {
  params: { debateId: string } // Dynamic route params with debateId
}

/**
 * Debate transcript page placeholder
 *
 * @param {TranscriptPageProps} props - Component props containing route parameters
 * @returns {JSX.Element} The rendered placeholder for the transcript page
 */
export default async function DebateTranscriptPage({
  params
}: {
  params: { debateId: string }
}) {
  const debateResult = await getDebateByIdAction(params.debateId)
  if (!debateResult.isSuccess || !debateResult.data) {
    notFound()
  }
  const transcriptsResult = await getDebateTranscriptsAction(params.debateId)
  const transcript =
    transcriptsResult.isSuccess && transcriptsResult.data.length > 0
      ? transcriptsResult.data[0]
      : null

  if (!transcript) {
    // Show transcript generation status client component
    return <TranscriptStatusClient debateId={params.debateId} />
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Debate Transcript</h1>
      <TranscriptViewer content={transcript.content} />
    </div>
  )
}
