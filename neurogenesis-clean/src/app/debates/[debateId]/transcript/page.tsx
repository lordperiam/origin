"use server"

/**
 * @description
 * This server component serves as the page for viewing the transcript of a specific debate in the Neurogenesis app.
 * It obtains the debate ID from the route parameters and passes it to the client component.
 *
 * Key features:
 * - Extracts debateId from dynamic route parameters
 * - Passes the debateId to the TranscriptPageClient component
 * - Simple server component that delegates client-side rendering to the client component
 *
 * @dependencies
 * - TranscriptPageClient: Client component that handles transcript display
 *
 * @notes
 * - Uses server component pattern for efficient data passing from server to client
 * - Separates server and client concerns for better code organization
 */

import TranscriptPageClient from "./transcript-page-client"

/**
 * Props interface for the TranscriptPage component.
 */
interface TranscriptPageProps {
  params: {
    debateId: string
  }
}

/**
 * Renders the transcript page for a specific debate.
 * This is a server component that fetches initial data or delegates rendering.
 * @param {TranscriptPageProps} props - Component props containing route parameters
 * @returns {JSX.Element} The rendered TranscriptPageClient component
 */
export default async function TranscriptPage({ params }: TranscriptPageProps) {
  const { debateId } = params
  return <TranscriptPageClient debateId={debateId} />
}