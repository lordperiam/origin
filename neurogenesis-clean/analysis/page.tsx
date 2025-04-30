// In your src/app/debates/[debateId]/analysis/page.tsx file:
import { analyzeDebateContent } from "@/actions/ai/analysis-actions"
// ... rest of your imports

// Make sure your component is async
export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { debateId } = params
  // Use the action as needed
  // ...
}