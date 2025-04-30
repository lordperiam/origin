import { getAllDebatesAction } from "@/actions/db/debates-actions"
import DebateList from "@/components/debates/debate-list"

export default async function DebatesPage() {
  const debatesResult = await getAllDebatesAction()
  if (!debatesResult.isSuccess) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Debates</h1>
        <p className="text-red-500">Error: {debatesResult.message}</p>
      </div>
    )
  }
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">Debates</h1>
      <DebateList debates={debatesResult.data} />
    </div>
  )
}
