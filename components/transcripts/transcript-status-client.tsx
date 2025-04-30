"use client"

import { useEffect, useState, useRef } from "react"
import TranscriptViewer from "@/components/transcripts/transcript-viewer"

interface TranscriptStatusClientProps {
  debateId: string
}

export default function TranscriptStatusClient({
  debateId
}: TranscriptStatusClientProps) {
  const [status, setStatus] = useState<"generating" | "ready" | "notfound">(
    "generating"
  )
  const [transcript, setTranscript] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [startTime] = useState(Date.now())
  const ESTIMATED_SECONDS = 30 // You can adjust this estimate

  useEffect(() => {
    // Simulate a loading bar
    if (status === "generating") {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const elapsed = (Date.now() - startTime) / 1000
          if (elapsed >= ESTIMATED_SECONDS) return 100
          return Math.min(100, (elapsed / ESTIMATED_SECONDS) * 100)
        })
      }, 500)
    } else {
      setProgress(100)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, startTime])

  useEffect(() => {
    let polling: NodeJS.Timeout | null = null
    async function poll() {
      const res = await fetch(`/api/transcripts?debateId=${debateId}`)
      const data = await res.json()
      if (data.transcriptStatus === "ready" && data.transcript) {
        setTranscript(data.transcript)
        setStatus("ready")
      } else if (data.transcriptStatus === "generating") {
        setStatus("generating")
      } else {
        setStatus("notfound")
      }
    }
    poll()
    polling = setInterval(poll, 3000)
    return () => {
      if (polling) clearInterval(polling)
    }
  }, [debateId])

  if (status === "generating") {
    const secondsLeft = Math.max(
      0,
      ESTIMATED_SECONDS - Math.floor((Date.now() - startTime) / 1000)
    )
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-white">Transcript Generating</h1>
        <div className="mx-auto my-6 w-full max-w-lg">
          <div className="h-2 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            Estimated time left: {secondsLeft}s
          </p>
        </div>
        <p className="text-gray-400">
          The transcript for this debate is being generated. Please check back
          soon.
        </p>
      </div>
    )
  }

  if (status === "notfound") {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-white">Transcript Not Found</h1>
        <p className="text-gray-400">
          The transcript for this debate could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Debate Transcript</h1>
      <TranscriptViewer content={transcript.content} />
    </div>
  )
}
