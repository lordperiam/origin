"use client"

import { useState } from "react"
import { newFeatureAction } from "@/actions/new-feature-actions"

interface FeatureComponentProps {
  initialData?: string
}

export default function FeatureComponent({ initialData = "" }: FeatureComponentProps) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  async function handleAction() {
    setLoading(true)
    try {
      const result = await newFeatureAction("example-id")
      if (result.isSuccess && result.data) {
        setData(result.data.result)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-md">
      <h2 className="text-xl font-medium mb-2">Feature Component</h2>
      <div className="mb-4">{data || "No data"}</div>
      <button
        onClick={handleAction}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Loading..." : "Perform Action"}
      </button>
    </div>
  )
}