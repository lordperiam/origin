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
 */

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

/**
 * Type definition for latest analysis data
 */
interface LatestAnalysis {
  analysisId: string
  debateId: string
  debateTitle: string | null
  sourcePlatform: string
  createdAt: string
}

/**
 * Placeholder function for getting latest analyses action
 * This will be replaced with the actual implementation later
 */
async function getLatestAnalysesAction(): Promise<{
  isSuccess: boolean
  data: LatestAnalysis[]
}> {
  // Mock data for development
  return {
    isSuccess: true,
    data: [
      {
        analysisId: "analysis-1",
        debateId: "debate-1",
        debateTitle: "Presidential Debate 2024",
        sourcePlatform: "YouTube",
        createdAt: new Date().toISOString()
      },
      {
        analysisId: "analysis-2",
        debateId: "debate-2",
        debateTitle: "Climate Change Summit",
        sourcePlatform: "CNN",
        createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      }
    ]
  }
}

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