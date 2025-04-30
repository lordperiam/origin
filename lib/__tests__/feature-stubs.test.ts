import {
  fetchDebateFromPlatform,
  generateDualTranscript,
  analyzeMultilingual,
  identifySpeakers,
  detectRhetoricAndFallacies,
  justifyDebateOutcome,
  crossEpisodeAnalysis,
  scrapeNewDebates
} from "../feature-stubs"
import { describe, it, expect } from "vitest"

describe("feature-stubs", () => {
  it("fetchDebateFromPlatform throws not implemented", () => {
    expect(() => fetchDebateFromPlatform("YouTube", "url")).toThrow(
      /not yet implemented/
    )
  })
  it("generateDualTranscript throws not implemented", () => {
    expect(() => generateDualTranscript("audioUrl")).toThrow(
      /not yet implemented/
    )
  })
  it("analyzeMultilingual throws not implemented", () => {
    expect(() => analyzeMultilingual("text", "fr")).toThrow(
      /not yet implemented/
    )
  })
  it("identifySpeakers throws not implemented", () => {
    expect(() => identifySpeakers("audioUrl")).toThrow(/not yet implemented/)
  })
  it("detectRhetoricAndFallacies throws not implemented", () => {
    expect(() => detectRhetoricAndFallacies("transcript")).toThrow(
      /not yet implemented/
    )
  })
  it("justifyDebateOutcome throws not implemented", () => {
    expect(() => justifyDebateOutcome({})).toThrow(/not yet implemented/)
  })
  it("crossEpisodeAnalysis throws not implemented", () => {
    expect(() => crossEpisodeAnalysis("participantId")).toThrow(
      /not yet implemented/
    )
  })
  it("scrapeNewDebates throws not implemented", () => {
    expect(() => scrapeNewDebates()).toThrow(/not yet implemented/)
  })
})
