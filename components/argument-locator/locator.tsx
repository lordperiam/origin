"use client"

/**
 * @description
 * This client component implements the argument locator feature in the Neurogenesis app.
 * It displays a list of debates and their arguments with search/filter capabilities.
 */

import { useState } from "react"
import { SelectDebate } from "@/db/schema/debates-schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SearchBar from "@/components/ui/search-bar"
import { motion } from "framer-motion"

interface ArgumentLocatorProps {
  debates: SelectDebate[]
}

export default function ArgumentLocator({ debates }: ArgumentLocatorProps) {
  const [filteredDebates, setFilteredDebates] =
    useState<SelectDebate[]>(debates)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredDebates(debates)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const results = debates.filter(
      debate =>
        debate.title?.toLowerCase().includes(lowercaseQuery) ||
        debate.sourcePlatform?.toLowerCase().includes(lowercaseQuery) ||
        debate.participants?.some(participant =>
          participant.toLowerCase().includes(lowercaseQuery)
        )
    )

    setFilteredDebates(results)
  }

  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>Argument Locator</CardTitle>
        <div className="pt-4">
          <SearchBar
            placeholder="Search debates by title, platform, or participants..."
            onSearch={handleSearch}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDebates.length > 0 ? (
            filteredDebates.map(debate => (
              <motion.div
                key={debate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
                }}
              >
                <Card className="hover:border-primary p-4 transition-all duration-200">
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
              </motion.div>
            ))
          ) : (
            <p>No debates found matching your search criteria.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
