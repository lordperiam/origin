import { getDebateByIdAction } from "@/actions/db/debates-actions"
import DebateDetails from "@/components/debates/debate-details"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function DebatePage({
  params
}: {
  params: { debateId: string }
}) {
  const debateResult = await getDebateByIdAction(params.debateId)
  if (!debateResult.isSuccess || !debateResult.data) {
    notFound()
  }
  const debate = debateResult.data
  return (
    <div className="container mx-auto py-12">
      <DebateDetails debateId={debate.id} />
      <div className="mt-8 flex gap-6">
        <Link
          href={`/debates/${debate.id}/transcript`}
          className="text-primary underline"
        >
          Transcript
        </Link>
        <Link
          href={`/debates/${debate.id}/analysis`}
          className="text-primary underline"
        >
          Analysis
        </Link>
      </div>
    </div>
  )
}
