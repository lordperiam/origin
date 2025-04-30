import { getAnalysisByDebateIdAction } from "@/actions/ai/analysis-actions"
import AnalysisViewer from "@/components/analysis/analysis-viewer"
import { notFound } from "next/navigation"

// Define a specific interface for this page's props
interface DebateAnalysisPageProps {
  params: {
    debateId: string
  }
  // You can add searchParams here if needed in the future
  // searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function DebateAnalysisPage({
  params
}: DebateAnalysisPageProps) {
  const analysisResult = await getAnalysisByDebateIdAction(params.debateId)
  if (!analysisResult.isSuccess || !analysisResult.data) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Analysis</h1>
        <p className="text-red-500">No analysis found for this debate.</p>
      </div>
    )
  }
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-6 text-3xl font-bold text-white">Debate Analysis</h1>
      <AnalysisViewer analysis={analysisResult.data} />
    </div>
  )
}
