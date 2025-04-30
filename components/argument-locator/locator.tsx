"use client"

/**
 * @description
 * This client component implements the argument locator feature in the Neurogenesis app.
 * It displays a list of debates and their arguments with search/filter capabilities.
 */

import { SelectDebate } from "@/db/schema/debates-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ArgumentLocatorProps {
  debates: SelectDebate[]
}

export default function ArgumentLocator({ debates }: ArgumentLocatorProps) {
  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>Argument Locator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {debates.length > 0 ? (
            debates.map(debate => (
              <Card key={debate.id} className="p-4">
                <h3 className="text-lg font-semibold">
                  {debate.title || "Untitled Debate"}
                </h3>
                <p className="text-muted-foreground">
                  Platform: {debate.sourcePlatform}
                  {debate.participants && debate.participants.length > 0 && (
                    <> • Participants: {debate.participants.join(", ")}</>
                  )}
                </p>
              </Card>
            ))
          ) : (
            <p>No debates found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
