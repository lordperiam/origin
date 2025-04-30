// Service for dual transcript generation and cross-verification
// Uses a speech-to-text API (e.g., OpenAI Whisper or AssemblyAI) and compares with a provided transcript

import { createHash } from "crypto"

export type TranscriptCrosscheckResult = {
  generatedTranscript: string
  providedTranscript?: string
  similarity: number // 0-1
  diff: string[] // lines that differ
}

// Dummy implementation for now; replace with real API call
async function generateTranscriptFromAudio(audioUrl: string): Promise<string> {
  // TODO: Integrate with OpenAI Whisper, AssemblyAI, or other provider
  // For now, just return a placeholder
  return "[Generated transcript for: " + audioUrl + "]"
}

// Simple similarity: Jaccard index on set of words
function computeSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/))
  const setB = new Set(b.split(/\s+/))
  const intersection = new Set([...setA].filter(x => setB.has(x)))
  const union = new Set([...setA, ...setB])
  return union.size === 0 ? 1 : intersection.size / union.size
}

// Line-by-line diff
function computeDiff(a: string, b: string): string[] {
  const aLines = a.split("\n")
  const bLines = b.split("\n")
  const maxLen = Math.max(aLines.length, bLines.length)
  const diff: string[] = []
  for (let i = 0; i < maxLen; i++) {
    if (aLines[i] !== bLines[i]) {
      diff.push(
        `Line ${i + 1}:\n  Generated: ${aLines[i] || ""}\n  Provided: ${bLines[i] || ""}`
      )
    }
  }
  return diff
}

export async function crosscheckTranscript(
  audioUrl: string,
  providedTranscript?: string
): Promise<TranscriptCrosscheckResult> {
  const generatedTranscript = await generateTranscriptFromAudio(audioUrl)
  let similarity = 1
  let diff: string[] = []
  if (providedTranscript) {
    similarity = computeSimilarity(generatedTranscript, providedTranscript)
    diff = computeDiff(generatedTranscript, providedTranscript)
  }
  return {
    generatedTranscript,
    providedTranscript,
    similarity,
    diff
  }
}
