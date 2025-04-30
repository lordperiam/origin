import {
  getDebateTranscriptsAction,
  getTranscriptAction
} from "@/actions/ai/transcript-actions"
import { NextRequest, NextResponse } from "next/server"
import { transcriptsTable } from "@/db/schema/transcripts-schema"
import { db } from "@/db/db"

/**
 * API route for transcripts
 *
 * GET:
 *   - /api/transcripts?debateId=abc123      → all transcripts for a debate
 *   - /api/transcripts?transcriptId=xyz789  → a specific transcript
 * POST:
 *   - Create a new transcript (JSON body)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const debateId = searchParams.get("debateId")
    const transcriptId = searchParams.get("transcriptId")
    if (transcriptId) {
      const result = await getTranscriptAction(transcriptId)
      return NextResponse.json(result)
    }
    if (debateId) {
      const result = await getDebateTranscriptsAction(debateId)
      return NextResponse.json(result)
    }
    return NextResponse.json(
      { error: "debateId or transcriptId parameter is required" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error in transcripts API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch transcripts" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Basic validation
    if (!body.debateId || !body.content) {
      return NextResponse.json(
        { error: "debateId and content are required" },
        { status: 400 }
      )
    }
    const newTranscript = {
      debateId: body.debateId,
      content: body.content,
      language: body.language || "en",
      verified: !!body.verified,
      sourcePlatform: body.sourcePlatform || null,
      sourceUrl: body.sourceUrl || null,
      sourceId: body.sourceId || null
    }
    const [inserted] = await db
      .insert(transcriptsTable)
      .values(newTranscript)
      .returning()
    return NextResponse.json({ isSuccess: true, data: inserted })
  } catch (error) {
    console.error("Error creating transcript:", error)
    return NextResponse.json(
      { error: "Failed to create transcript" },
      { status: 500 }
    )
  }
}
