"use client"

/**
 * @description
 * This client component renders the user dashboard UI for the Neurogenesis app.
 * It displays recent debates and analysis metrics in a visually appealing layout.
 *
 * Key features:
 * - Debate List: Shows up to 5 recent debates with titles and links
 * - Analysis Metrics: Displays mock metrics (to be replaced with real data)
 * - Responsive Design: Grid layout adjusts for screen sizes
 * - Styling: Uses design system (black bg, gold primary, white text)
 *
 * @dependencies
 * - @/db/schema/debates-schema: SelectDebate type for debate data
 * - @/components/ui/card: Shadcn UI components for layout
 * - @/components/ui/button: Shadcn Button for navigation
 * - next/link: Client-side navigation links
 *
 * @notes
 * - Client component to support future interactivity (e.g., filters)
 * - Limits debates to 5; pagination planned for future steps
 * - Mock metrics used until analysis data is fully integrated
 * - Edge case: Handles empty debates/analyses with fallback messages
 * - Limitation: Static display; no real-time updates yet
 */

import { SelectDebate } from "@/db/schema/debates-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Interface for UserDashboard props.
 *
 * @property {SelectDebate[]} debates - Array of user's recent debates
 * @property {any[]} analyses - Array of analysis data (mocked for now)
 */
interface UserDashboardProps {
  debates: SelectDebate[]
  analyses: any[]
}

/**
 * UserDashboard component that renders the dashboard UI.
 *
 * @param {UserDashboardProps} props - Component props with debates and analyses
 * @returns {JSX.Element} The rendered dashboard layout
 */
export default function UserDashboard({
  debates,
  analyses
}: UserDashboardProps) {
  // Sort debates by date (newest first) and take top 5
  const recentDebates = debates
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 5)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recent Debates Section */}
      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle>Recent Debates</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDebates.length > 0 ? (
            <ul className="space-y-4">
              {recentDebates.map(debate => (
                <li
                  key={debate.id}
                  className="flex items-center justify-between"
                >
                  <span>{debate.title || "Untitled Debate"}</span>
                  <Link href={`/debates/${debate.id}/transcript`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      View
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent debates available.</p>
          )}
        </CardContent>
      </Card>

      {/* Analysis Metrics Section */}
      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle>Analysis Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {analyses.length > 0 ? (
            <div className="space-y-4">
              {/* Mock metrics; replace with real data later */}
              <div>
                <p>
                  Average Argument Quality:{" "}
                  {analyses.length > 0
                    ? Math.round(
                        analyses.reduce(
                          (sum, a) => sum + (a.results.argumentQuality || 0),
                          0
                        ) / analyses.length
                      )
                    : 0}
                  /10
                </p>
              </div>
              <div>
                <p>
                  Total Rhetorical Devices:{" "}
                  {analyses.reduce(
                    (sum, a) =>
                      sum + (a.results.rhetoricalDevices?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div>
                <p>
                  Total Fallacies Detected:{" "}
                  {analyses.reduce(
                    (sum, a) => sum + (a.results.fallacies?.length || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          ) : (
            <p>No analysis data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
