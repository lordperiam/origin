import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-4 max-w-md text-center text-gray-600">
        Could not find the requested page.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
