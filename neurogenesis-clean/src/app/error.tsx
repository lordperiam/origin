"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="mb-4 text-3xl font-bold">Something went wrong</h1>
      <p className="mb-4">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="mb-2 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Try Again
      </button>
      <Link href="/" className="text-blue-700 underline">
        Go Home
      </Link>
    </div>
  )
}
