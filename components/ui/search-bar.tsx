"use client"

import React, { useState } from "react"

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  onSearch
}) => {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="focus:ring-primary w-full rounded-md border bg-white px-4 py-2 text-black focus:outline-none focus:ring-2"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        className="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-white"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  )
}

export default SearchBar
