"use client"

/**
 * @description
 * This client component renders the institutional dashboard UI for the Neurogenesis app.
 * It displays advanced debate statistics and a list of recent debates tailored for institutional users.
 *
 * Key features:
 * - Debate Statistics: Shows total debates, average participants, and platforms used
 * - Recent Debates List: Displays up to 5 recent debates with navigation links
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
 * - Client component to support future interactivity (e.g., filters, refresh)
 * - Limits debates to 5; pagination planned for future steps
 * - Analytics data is partially mocked; full integration awaits analysis actions
 * - Edge case: Handles empty debates/analytics with fallback messages
 * - Limitation: Static display; no real-time updates or advanced filtering yet
 */

import { SelectDebate } from "@/db/schema/debates-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Interface for analytics data displayed in the dashboard.
 *
 * @property {number} totalDebates - Total number of debates
 * @property {number} averageParticipants - Average number of participants per debate
 * @property {number} platformsUsed - Number of unique platforms sourced
 */
interface AnalyticsData {
  totalDebates: number
  averageParticipants: number
  platformsUsed: number
}

/**
 * Interface for InstitutionalDashboard props.
 *
 * @property {SelectDebate[]} debates - Array of debates for the institution
 * @property {AnalyticsData} analytics - Analytics data for display
 */
interface InstitutionalDashboardProps {
  debates: SelectDebate[]
  analytics: AnalyticsData
}

/**
 * InstitutionalDashboard component that renders the dashboard UI.
 *
 * @param {InstitutionalDashboardProps} props - Component props with debates and analytics
 * @returns {JSX.Element} The rendered dashboard layout
 */
export default function InstitutionalDashboard({
  debates,
  analytics
}: InstitutionalDashboardProps) {
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
      {/* Debate Statistics Section */}
      <Card className="bg-card text-foreground">
        <CardHeader>
          <CardTitle>Debate Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Total Debates: {analytics.totalDebates}</p>
            <p>
              Average Participants per Debate:{" "}
              {analytics.averageParticipants.toFixed(1)}
            </p>
            <p>Platforms Used: {analytics.platformsUsed}</p>
          </div>
        </CardContent>
      </Card>

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
    </div>
  )
}
