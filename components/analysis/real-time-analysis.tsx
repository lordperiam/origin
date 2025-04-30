"use client"

/**
 * @description
 * This client component displays the most recent debate analyses in the Neurogenesis app.
 * It periodically fetches and updates the list of latest analyses, providing a near-real-time view of analysis results.
 *
 * Key features:
 * - Periodic Fetching: Updates every 30 seconds via polling
 * - Analysis Display: Shows debate title, platform, analysis time, and navigation link
 * - Loading State: Displays loading message during initial fetch or updates
 * - Empty State: Shows message when no analyses are available
 * - Styling: Uses Shadcn Card components with Neurogenesis design system
 *
 * @dependencies
 * - react: useState, useEffect for state and lifecycle management
 * - "@/actions/ai/real-time-analysis-actions": getLatestAnalysesAction for data fetching
 * - "@/components/ui/card": Shadcn Card components for layout
 * - next/link: Link component for client-side navigation
 * - "@/types": LatestAnalysis type for type safety
 *
 * @notes
 * - Uses polling for simplicity; SSE or websockets planned for true real-time updates
 * - Displays up to 10 latest analyses as fetched from the server action
 * - Edge case: Handles loading and empty states with user-friendly messages
 * - Limitation: Polling interval (30s) is fixed; could be configurable later
 */

import { useEffect, useState } from "react"
import { getLatestAnalysesAction } from "@/actions/ai/real-time-analysis-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LatestAnalysis } from "@/types"

/**
 * RealTimeAnalysis component that fetches and displays the latest analyses.
 *
 * @returns {JSX.Element} The rendered list of analysis cards or loading/empty state
 */
export default function RealTimeAnalysis() {
  const [analyses, setAnalyses] = useState<LatestAnalysis[]>([]) // Store fetched analyses
  const [isLoading, setIsLoading] = useState<boolean>(true) // Track loading state

  useEffect(() => {
    /**
     * Fetches the latest analyses from the server action.
     * Updates state with results and handles errors silently (logged by server action).
     */
    const fetchAnalyses = async () => {
      const result = await getLatestAnalysesAction()
      if (result.isSuccess) {
        setAnalyses(result.data)
      }
      setIsLoading(false)
    }

    // Initial fetch on mount
    fetchAnalyses()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchAnalyses, 30000)

    // Cleanup interval on component unmount to prevent memory leaks
    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures effect runs only on mount/unmount

  // Display loading state during initial fetch
  if (isLoading) {
    return (
      <div className="text-center text-white">Loading latest analyses...</div>
    )
  }

  // Display empty state if no analyses are available
  if (analyses.length === 0) {
    return (
      <div className="text-center text-white">
        No recent analyses available.
      </div>
    )
  }

  // Render the list of analysis cards
  return (
    <div className="space-y-4">
      {analyses.map(analysis => (
        <Card
          key={analysis.analysisId}
          className="bg-card text-foreground border-border"
        >
          <CardHeader>
            <CardTitle className="text-white">
              {analysis.debateTitle || "Untitled Debate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Platform: {analysis.sourcePlatform}
            </p>
            <p className="text-muted-foreground">
              Analyzed at: {new Date(analysis.createdAt).toLocaleString()}
            </p>
            <Link
              href={`/debates/${analysis.debateId}/analysis`}
              className="text-primary mt-2 block hover:underline"
            >
              View Full Analysis
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
