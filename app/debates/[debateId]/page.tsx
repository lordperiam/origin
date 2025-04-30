import DebateDetails from "@/components/debates/debate-details"

interface DebatePageProps {
  params: {
    debateId: string
  }
}

export default function DebatePage({ params }: DebatePageProps) {
  const { debateId } = params
  // Your component logic

  return (
    <div className="container mx-auto py-12">
      <DebateDetails debateId={debateId} />
    </div>
  )
}
