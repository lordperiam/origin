"use client"

/**
 * @description
 * This client component serves as the client-side wrapper for the transcript page.
 * It passes the debateId to the TranscriptStatusClient component which handles
 * the actual transcript loading, generating, and display logic.
 *
 * Key features:
 * - Simple pass-through component to separate server and client concerns
 * - Uses the TranscriptStatusClient component to handle transcript state
 *
 * @dependencies
 * - TranscriptStatusClient: Client component to handle transcript state from '@/components/transcripts/transcript-status-client'
 */

import TranscriptStatusClient from "@/components/transcripts/transcript-status-client"

interface TranscriptPageClientProps {
  debateId: string
}

/**
 * TranscriptPageClient component that wraps the TranscriptStatusClient with the debateId.
 *
 * @param {TranscriptPageClientProps} props - Component props containing the debateId
 * @returns {JSX.Element} The rendered TranscriptStatusClient component
 */
export default function TranscriptPageClient({
  debateId
}: TranscriptPageClientProps) {
  return <TranscriptStatusClient debateId={debateId} />
}