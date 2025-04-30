import { notFound } from "next/navigation"
import DebateDetails from "@/components/debates/debate-details"

interface DebatePageParams {
  params: {
    debateId: string
  }
}

export default function DebatePage({ params }: DebatePageParams) {
  const { debateId } = params

  if (!debateId) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-12">
      <DebateDetails debateId={debateId} />
    </div>
  )
}
