"use server"

/**
 * @description
 * This server component displays the transcript content in a scrollable card for the Neurogenesis app.
 * It provides a clean, readable view of debate transcripts with a fixed-height scroll area.
 *
 * Key features:
 * - Renders transcript text in a Shadcn Card with ScrollArea
 * - Preserves formatting with whitespace-pre-wrap
 * - Fixed height (600px) for consistent layout
 * - Uses design system colors via Tailwind (black bg, white text)
 *
 * @dependencies
 * - Card, CardContent, CardHeader, CardTitle: Shadcn UI components from '@/components/ui/card'
 * - ScrollArea: Shadcn UI component for scrolling from '@/components/ui/scroll-area'
 *
 * @notes
 * - Marked as server component for static rendering efficiency per project rules
 * - No interactivity required yet; could become client component if features like highlighting are added
 * - Edge case: Very long transcripts are scrollable; very short ones fit within the card
 * - Limitation: Plain text display only; no formatting or annotations supported currently
 */

/**
 * Imports required for the transcript viewer functionality.
 */
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
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full">
          {/* Preserve line breaks and spacing in transcript text */}
          <p className="whitespace-pre-wrap">{content}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
