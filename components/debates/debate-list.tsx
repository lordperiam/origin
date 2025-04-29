"use client"

/**
 * @description
 * This client component displays a list of debates sourced from various platforms in the Neurogenesis app.
 * It renders each debate as a card with title, source, date, and navigation links to transcript and analysis.
 *
 * Key features:
 * - Displays debates in a vertical list using Shadcn Card components
 * - Provides links to transcript and analysis pages using Next.js Link
 * - Responsive design with Tailwind CSS
 * - Adheres to design system: black bg, gold primary, white text
 *
 * @dependencies
 * - SelectDebate: Type definition for debate data from '@/db/schema/debates-schema'
 * - Card, CardContent, CardHeader, CardTitle: Shadcn UI components from '@/components/ui/card'
 * - Link: Next.js component for client-side navigation from 'next/link'
 *
 * @notes
 * - Marked as client component to support future interactivity (e.g., navigation handling)
 * - Uses Tailwind classes inheriting global styles (e.g., bg-card, text-primary)
 * - Links point to future pages (/debates/[id]/transcript, /analysis); 404s expected until implemented
 * - Edge cases: Handles missing title/date with fallbacks ("Untitled Debate", "N/A")
 * - Limitation: No pagination; displays all debates (optimization planned for later)
 */

import { SelectDebate } from "@/db/schema/debates-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

/**
 * Props interface for the DebateList component
 * @interface DebateListProps
 */
interface DebateListProps {
  debates: SelectDebate[] // Array of debates to display
}

/**
 * DebateList component
 * @param {DebateListProps} props - Component props containing the debates array
 * @returns {JSX.Element} The rendered list of debate cards
 */
export default function DebateList({ debates }: DebateListProps) {
  return (
    <div className="space-y-4">
      {debates.map(debate => (
        <Card key={debate.id} className="bg-card text-foreground">
          <CardHeader>
            <CardTitle>{debate.title || "Untitled Debate"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Source: {debate.sourcePlatform}</p>
            <p>
              Date:{" "}
              {debate.date ? new Date(debate.date).toLocaleDateString() : "N/A"}
            </p>
            <div className="mt-4 flex space-x-4">
              <Link
                href={`/debates/${debate.id}/transcript`}
                className="text-primary hover:underline"
              >
                View Transcript
              </Link>
              <Link
                href={`/debates/${debate.id}/analysis`}
                className="text-primary hover:underline"
              >
                View Analysis
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
