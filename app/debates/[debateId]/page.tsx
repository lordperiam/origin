import DebateDetailsComponent from "@/components/debates/debate-details"

interface DebatePageProps {
  params: {
    debateId: string
  }
}
interface DebateDetailsProps {
  debate: {
    title: string
    description: string
  }
  transcript: {
    content: string
  } | null
  transcriptStatus: "ready" | "generating"
}

export default function DebateDetailsPage({
  debate,
  transcript,
  transcriptStatus
}: DebateDetailsProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{debate.title}</h1>
      <p className="text-gray-600">{debate.description}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Transcript</h2>
        {transcriptStatus === "generating" ? (
          <p className="text-yellow-500">
            Transcript is being generated. Please refresh the page later.
          </p>
        ) : transcript ? (
          <pre className="rounded bg-gray-100 p-4">{transcript.content}</pre>
        ) : (
          <p className="text-red-500">Transcript is not available.</p>
        )}
      </div>
    </div>
  )
}
