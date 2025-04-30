"use client"

/**
 * @description
 * This client component renders an infographic visualizing debate analysis data for the Neurogenesis app.
 * It displays a horizontal bar chart summarizing key metrics such as argument quality, number of rhetorical devices,
 * and number of fallacies, styled according to the app’s design system (black background, gold bars).
 *
 * Key features:
 * - Horizontal Bar Chart: Uses Recharts to display analysis metrics with categories on the y-axis
 * - Interactivity: Includes tooltips showing metric values on hover
 * - Responsive Design: Adapts to container size with a fixed height for consistency
 * - Data Handling: Displays a fallback message when no data is provided
 *
 * @dependencies
 * - recharts: Provides charting components (BarChart, Bar, XAxis, etc.) for visualization
 * - react: Manages component rendering and props
 *
 * @notes
 * - Currently expects pre-processed data as props; integration with server actions (e.g., getAnalysisAction) is planned for later steps
 * - Performance is suitable for small datasets; large datasets may require optimization (e.g., pagination or virtualization)
 * - Edge case: Handles empty or invalid data by rendering a fallback message
 * - Limitation: Single chart type (horizontal bar); additional visualizations (e.g., pie charts) may be added in future iterations
 * - Assumes parent container sets width; uses 100% width and fixed height internally
 */

/**
 * Imports required for the infographic component.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

/**
 * Interface for a single data point in the infographic.
 * Represents metrics derived from debate analysis.
 *
 * @property {string} name - Label for the metric (e.g., "Argument Quality")
 * @property {number} value - Numeric value of the metric (e.g., 8 for quality, 2 for fallacy count)
 */
interface InfographicData {
  name: string
  value: number
}

/**
 * Props interface for the Infographic component.
 *
 * @property {InfographicData[]} data - Array of data points to display in the chart
 */
interface InfographicProps {
  data: InfographicData[]
}

/**
 * Infographic component that renders a horizontal bar chart visualization.
 *
 * @param {InfographicProps} props - Component props containing the data to visualize
 * @returns {JSX.Element} The rendered bar chart wrapped in a styled div
 */
export default function Infographic({ data }: InfographicProps) {
  // Handle case where no data is provided or data array is empty
  if (!data || data.length === 0) {
    return (
      <div className="bg-card text-foreground flex h-[400px] w-full items-center justify-center rounded-lg">
        <p>No analysis data available to display.</p>
      </div>
    )
  }

  return (
    <div className="bg-card h-[400px] w-full rounded-lg p-4">
      {/* Chart title */}
      <h2 className="mb-4 text-xl font-bold text-white">
        Analysis Infographic
      </h2>

      {/* Responsive chart container */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical" // Horizontal bars with categories on y-axis
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Margins to prevent label clipping
        >
          {/* Grid for visual reference */}
          <CartesianGrid
            strokeDasharray="3 3" // Dashed grid lines
            stroke="hsl(var(--muted))" // Muted color for subtlety
          />

          {/* X-axis for values */}
          <XAxis
            type="number"
            stroke="hsl(var(--foreground))" // White stroke for visibility
            tick={{ fill: "hsl(var(--foreground))" }} // White ticks
          />

          {/* Y-axis for metric names */}
          <YAxis
            dataKey="name"
            type="category"
            stroke="hsl(var(--foreground))" // White stroke
            tick={{ fill: "hsl(var(--foreground))" }} // White ticks
          />

          {/* Tooltip for interactivity */}
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))", // Matches card background
              border: "1px solid hsl(var(--border))", // Subtle border
              color: "hsl(var(--foreground))" // White text
            }}
          />

          {/* Legend for clarity */}
          <Legend />

          {/* Bar representing metric values */}
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))" // Gold bars per design system
            name="Metric Value" // Legend label
            barSize={30} // Fixed bar height for consistency
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Example usage with mock data (for testing purposes, to be removed when integrated)
/*
<Infographic
  data={[
    { name: "Argument Quality", value: 8 },
    { name: "Rhetorical Devices", value: 5 },
    { name: "Fallacies", value: 2 },
  ]}
/>
*/
