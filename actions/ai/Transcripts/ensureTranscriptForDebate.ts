import { getDebateByIdAction } from "../../db/debates-actions"
import { getDebateTranscriptsAction, generateTranscriptAction } from "@/actions/ai/transcript-actions"

// Ensures a transcript exists for a debate, triggers generation if missing
export async function ensureTranscriptForDebate(debateId: string) {
  const debateResult = await getDebateByIdAction(debateId)
  if (!debateResult.isSuccess || !debateResult.data) {
    return { error: "Debate not found" }
  }
  const debate = {
    id: debateResult.data.id,
    sourceUrl: debateResult.data.sourceId,
    sourcePlatform: debateResult.data.sourcePlatform,
  };

  const transcriptsResult = await getDebateTranscriptsAction(debateId)
  const transcript = transcriptsResult.isSuccess && transcriptsResult.data.length > 0
    ? transcriptsResult.data[0]
    : null

  if (!transcript) {
    // Fire-and-forget: generate transcript in the background
    generateTranscriptAction(debateId, debate.sourceUrl, debate.sourcePlatform as "YouTube" | "Spotify" | "DirectMedia" | undefined)
      .catch(err => console.error("Transcript generation failed:", err))
  }

  return {
    debate,
    transcript,
    transcriptStatus: transcript ? "ready" : "generating"
  }
}
