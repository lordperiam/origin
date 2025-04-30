import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import "@testing-library/jest-dom"
import SearchBar from "./search-bar"

describe("SearchBar", () => {
  it("renders input and calls onSearch", () => {
    const onSearch = vi.fn()
    render(<SearchBar placeholder="Search..." onSearch={onSearch} />)
    const input = screen.getByPlaceholderText("Search...")
    fireEvent.change(input, { target: { value: "debate" } })
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" })
    expect(onSearch).toHaveBeenCalledWith("debate")
  })

  it("is accessible with aria-label", () => {
    render(<SearchBar placeholder="Search..." onSearch={() => {}} />)
    const input = screen.getByRole("searchbox")
    expect(input).toHaveAttribute("aria-label")
  })
})
