"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
      <h2 className="mb-4 text-2xl font-bold text-red-500">
        Something went wrong!
      </h2>
      <p className="mb-4 max-w-md text-center text-gray-600">
        {error.message || "An unexpected error occurred"}
      </p>
      <Button variant="destructive" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  )
}
