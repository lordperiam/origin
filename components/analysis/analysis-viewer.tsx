"use client"

/**
 * @description
 * This client component renders the analysis results for a debate in the Neurogenesis app.
 * It displays rhetorical devices, logical fallacies, and argument quality in a card layout.
 *
 * Key features:
 * - Displays analysis data from the database
 * - Uses Shadcn Card components for structured presentation
 * - Handles missing or incomplete analysis data gracefully
 * - Styled with Tailwind adhering to design system (black bg, white text)
 *
 * @dependencies
 * - SelectAnalysis: Type definition for analysis data from '@/db/schema/analyses-schema'
 * - Card, CardContent, CardHeader, CardTitle: Shadcn UI components from '@/components/ui/card'
 *
 * @notes
 * - Marked as client component for static rendering efficiency per project rules
 * - Assumes analysis.results is a JSON object with specific keys; may need adjustment if structure changes
 * - Edge case: Handles missing analysis fields with fallback text
 * - Limitation: Basic display; future steps may add interactive features or detailed views
 */

/**
 * Imports required for the analysis viewer functionality.
 */
import { SelectAnalysis } from "@/db/schema/analyses-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Props interface for the AnalysisViewer component.
 * @interface AnalysisViewerProps
 */
interface AnalysisViewerProps {
  analysis: SelectAnalysis // The analysis data to display
}

/**
 * AnalysisViewer component that renders the analysis content.
 *
 * @param {AnalysisViewerProps} props - Component props containing the analysis data
 * @returns {JSX.Element} The rendered analysis viewer card
 */
export default function AnalysisViewer({ analysis }: AnalysisViewerProps) {
  // Extract results from analysis; assume it's a JSON object with expected structure
  const results = analysis.results as {
    rhetoricalDevices?: string[]
    fallacies?: string[]
    argumentQuality?: number
  }

  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rhetorical Devices Section */}
          <div>
            <h3 className="text-lg font-semibold">Rhetorical Devices</h3>
            {results.rhetoricalDevices &&
            results.rhetoricalDevices.length > 0 ? (
              <ul className="list-disc pl-5">
                {results.rhetoricalDevices.map((device, index) => (
                  <li key={index}>{device}</li>
                ))}
              </ul>
            ) : (
              <p>No rhetorical devices identified.</p>
            )}
          </div>

          {/* Logical Fallacies Section */}
          <div>
            <h3 className="text-lg font-semibold">Logical Fallacies</h3>
            {results.fallacies && results.fallacies.length > 0 ? (
              <ul className="list-disc pl-5">
                {results.fallacies.map((fallacy, index) => (
                  <li key={index}>{fallacy}</li>
                ))}
              </ul>
            ) : (
              <p>No logical fallacies identified.</p>
            )}
          </div>

          {/* Argument Quality Section */}
          <div>
            <h3 className="text-lg font-semibold">Argument Quality</h3>
            <p>
              {results.argumentQuality
                ? `Rated ${results.argumentQuality}/10`
                : "Not rated"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
