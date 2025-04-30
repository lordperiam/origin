import { useRouter } from "next/router"
import DebateDetails from "@/components/debates/debate-details"

export default function DebatePage() {
  const router = useRouter()
  const { debateId } = router.query

  if (!debateId) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-12">
      <DebateDetails debateId={debateId as string} />
    </div>
  )
}
