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
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Mock type for SelectAnalysis until we implement the actual schema
 */
interface SelectAnalysis {
  id: string
  debateId: string
  results: any
  createdAt: Date
}

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

  // Helper to check for stub error messages
  function isStubResult(value: any) {
    if (typeof value === "string") {
      return value.includes("not yet implemented")
    }
    if (Array.isArray(value)) {
      return value.some(
        v => typeof v === "string" && v.includes("not yet implemented")
      )
    }
    return false
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
            {isStubResult(results.rhetoricalDevices) ? (
              <p className="text-yellow-500">
                Rhetorical device detection not yet implemented.
              </p>
            ) : results.rhetoricalDevices &&
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
            {isStubResult(results.fallacies) ? (
              <p className="text-yellow-500">
                Logical fallacy detection not yet implemented.
              </p>
            ) : results.fallacies && results.fallacies.length > 0 ? (
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
            {isStubResult(results.argumentQuality) ? (
              <p className="text-yellow-500">
                Argument quality rating not yet implemented.
              </p>
            ) : (
              <p>
                {results.argumentQuality
                  ? `Rated ${results.argumentQuality}/10`
                  : "Not rated"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}