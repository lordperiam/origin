"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebateDetailsProps {
  debateId: string
}

export default function DebateDetails({ debateId }: DebateDetailsProps) {
  const [debate, setDebate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/debates/${debateId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch debate details")
        }
        const data = await response.json()
        setDebate(data)
        setError(null)
      } catch (err) {
        setError("Error loading debate details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (debateId) {
      fetchDebate()
    }
  }, [debateId])

  if (loading) {
    return <div className="py-8 text-center">Loading debate details...</div>
  }

  if (error || !debate) {
    return (
      <div className="py-8 text-center text-red-500">
        {error || "Unable to load debate details"}
      </div>
    )
  }

  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>{debate.title || "Untitled Debate"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Source</h3>
            <p>{debate.sourcePlatform}</p>
          </div>
          <div>
            <h3 className="font-medium">Participants</h3>
            <p>{debate.participants?.join(", ") || "Unknown"}</p>
          </div>
          <div>
            <h3 className="font-medium">Date</h3>
            <p>
              {debate.date
                ? new Date(debate.date).toLocaleDateString()
                : "Unknown"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
