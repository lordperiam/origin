"use client"

/**
 * @description
 * This client component displays a list of debates sourced from various platforms in the Neurogenesis app.
 * It renders each debate as a card with title, source, date, and navigation links to transcript and analysis.
 * Now includes a search functionality to filter debates by title, source, or date.
 *
 * Key features:
 * - Search bar to filter debates by title, source platform, or participants
 * - Displays debates in a vertical list using Shadcn Card components
 * - Provides links to transcript and analysis pages using Next.js Link
 * - Responsive design with Tailwind CSS
 * - Adheres to design system: black bg, gold primary, white text
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

/**
 * Type definition for debate data
 * This is a temporary placeholder until we implement the actual schema
 */
interface SelectDebate {
  id: string
  title: string | null
  sourcePlatform: string
  sourceId: string | null
  date: string | null
  participants: string[] | null
}

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
 * @returns {JSX.Element} The rendered list of debate cards with search functionality
 */
export default function DebateList({ debates }: DebateListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter debates based on search query
  const filteredDebates = debates.filter(debate => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase()

    // Search in title
    if (debate.title && debate.title.toLowerCase().includes(query)) return true

    // Search in source platform
    if (
      debate.sourcePlatform &&
      debate.sourcePlatform.toLowerCase().includes(query)
    )
      return true

    // Search in participants
    if (debate.participants && Array.isArray(debate.participants)) {
      return debate.participants.some(participant =>
        participant.toLowerCase().includes(query)
      )
    }

    // Search in date
    if (debate.date) {
      const dateStr = new Date(debate.date).toLocaleDateString()
      if (dateStr.toLowerCase().includes(query)) return true
    }

    // Search in sourceId
    if (debate.sourceId && debate.sourceId.toLowerCase().includes(query))
      return true

    return false
  })

  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search debates by title, source, or participants..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {filteredDebates.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground text-lg">
            No debates found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDebates.map(debate => (
            <Card key={debate.id} className="bg-card text-foreground">
              <CardHeader>
                <CardTitle>{debate.title || "Untitled Debate"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Source: {debate.sourcePlatform}</p>
                <p>
                  Date:{" "}
                  {debate.date
                    ? new Date(debate.date).toLocaleDateString()
                    : "N/A"}
                </p>
                {debate.participants && debate.participants.length > 0 && (
                  <p>Participants: {debate.participants.join(", ")}</p>
                )}
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
      )}
    </div>
  )
}