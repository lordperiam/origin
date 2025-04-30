"use client"

import React, { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch
}) => {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(query)
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center space-x-2"
    >
      <div className="relative grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="text-muted-foreground size-4" />
        </div>
        <input
          type="text"
          className="border-input bg-background focus:ring-ring focus:border-primary w-full rounded-md border px-10 py-2 text-sm outline-none focus:ring-2"
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          Search
        </Button>
      </motion.div>
    </form>
  )
}

export default SearchBar
