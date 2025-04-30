"use client"

import TranscriptStatusClient from "@/components/transcripts/transcript-status-client"

interface TranscriptPageClientProps {
  debateId: string
}

export default function TranscriptPageClient({
  debateId
}: TranscriptPageClientProps) {
  return <TranscriptStatusClient debateId={debateId} />
}
