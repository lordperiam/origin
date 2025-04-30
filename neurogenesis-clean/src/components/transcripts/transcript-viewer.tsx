"use client"

/**
 * @description
 * This client component displays the transcript content in a scrollable card for the Neurogenesis app.
 * It provides a clean, readable view of debate transcripts with a fixed-height scroll area.
 *
 * Key features:
 * - Renders transcript text in a Shadcn Card with ScrollArea
 * - Preserves formatting with whitespace-pre-wrap
 * - Fixed height (600px) for consistent layout
 * - Uses design system colors via Tailwind (black bg, white text)
 */

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

/**
 * Props interface for the TranscriptViewer component.
 * @interface TranscriptViewerProps
 */
interface TranscriptViewerProps {
  content: string // The transcript text to display
}

/**
 * TranscriptViewer component that renders the transcript content.
 *
 * @param {TranscriptViewerProps} props - Component props containing the transcript content
 * @returns {JSX.Element} The rendered transcript viewer card
 */
export default function TranscriptViewer({ content }: TranscriptViewerProps) {
  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}