"use client"
import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import TranscriptViewer from "@/components/transcripts/transcript-viewer"

// Placeholder TranscriptPageClient component for build
export default function TranscriptPageClient({
  debateId
}: {
  debateId: string
}) {
  return <div>TranscriptPageClient placeholder. debateId: {debateId}</div>
}
