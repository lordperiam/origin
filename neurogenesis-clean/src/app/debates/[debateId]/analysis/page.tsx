"use server"

/**
 * @description
 * This server component serves as the page for viewing the analysis of a specific debate in the Neurogenesis app.
 * It fetches the debate details and its analysis, then renders the analysis content using the AnalysisViewer component.
 *
 * Key features:
 * - Fetches debate details using getDebateByIdAction
 * - Fetches analysis using getAnalysisByDebateIdAction
 * - Displays the analysis results
 * - Handles missing debate or analysis with user-friendly messages
 * - Includes visualization with NeuralMap component
 */

import { getDebateByIdAction } from "@/actions/db/debates-actions"
import { getAnalysisByDebateIdAction } from "@/actions/ai/analysis-actions"
import AnalysisViewer from "@/components/analysis/analysis-viewer"
import { notFound } from "next/navigation"
import NeuralMap from "@/components/visualizations/neural-map"

/**
 * Props interface for the AnalysisPage component.
 */
interface AnalysisPageProps {
  params: { debateId: string } // Dynamic route params with debateId
}

/**
 * Analysis page component that fetches and displays a debate's analysis.
 *
 * @param {AnalysisPageProps} props - Component props containing route parameters
 * @returns {Promise<JSX.Element>} The rendered analysis page or error message
 */
export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { debateId } = params

  // Fetch debate details to display title and verify existence
  const debateResult = await getDebateByIdAction(debateId)
  if (!debateResult.isSuccess || !debateResult.data) {
    // Return 404 if debate isn't found
    return notFound()
  }
  const debate = debateResult.data

  // Fetch analysis for the debate
  const analysisResult = await getAnalysisByDebateIdAction(debateId)
  if (!analysisResult.isSuccess || !analysisResult.data) {
    // Display message if no analysis is available
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-8 text-4xl font-bold text-white">
          {debate.title || "Untitled Debate"} - Analysis
        </h1>
        <p className="text-white">No analysis available for this debate.</p>
      </div>
    )
  }

  // Render the page with debate title and analysis content
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">
        {debate.title || "Untitled Debate"} - Analysis
      </h1>
      <AnalysisViewer analysis={analysisResult.data} />
      <div className="mt-8">
        <NeuralMap />
      </div>
    </div>
  )
}