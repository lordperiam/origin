/*
Contains server actions related to debate analysis using AI.
This file provides actions to analyze debate transcripts for rhetorical devices, logical fallacies, and argument quality,
and to retrieve analysis data by debate ID.
It supports the core functionality of debate analysis as outlined in the technical specification.
*/

"use server"

import { db } from "@/db/db"
import {
  InsertAnalysis,
  SelectAnalysis,
  analysesTable
} from "@/db/schema/analyses-schema"
import { transcriptsTable } from "@/db/schema/transcripts-schema"
import { ActionState } from "@/types"
import { eq } from "drizzle-orm"
import OpenAI from "openai"

/**
 * Analyzes a debate transcript using AI to identify rhetorical devices, fallacies, and argument quality.
 *
 * @param transcriptId - The ID of the transcript to analyze
 * @returns A promise resolving to an ActionState with the created analysis or an error message
 *
 * @remarks
 * - Fetches the transcript content from the database.
 * - Uses OpenAI's GPT-4 to analyze the transcript.
 * - Structures the analysis results as JSON for storage.
 * - Inserts the analysis into the database.
 * 
 * @dependencies
 * - db: Drizzle ORM database instance for queries and inserts
 * - analyses-schema: Schema for analyses table
 * - transcripts-schema: Schema for transcripts table
 * - openai: OpenAI library for AI analysis
 * 
 * @notes
 * - Assumes the transcript content is in English; multilingual support planned for future steps.
 * - Analysis results are stored as JSONB for flexibility; may be normalized later.
 * - Edge case: Empty or invalid transcript content results in an error response.
 * - Limitation: Relies on OpenAI's API; rate limits and costs must be managed.
 * 
 * @throws {Error} Logs and returns failure if any step fails (e.g., transcript not found, API errors).
 * 
 * @example
 * const result = await analyzeTranscriptAction("transcript_123");
 * if (result.isSuccess) console.log(result.data);
 */
export async function analyzeTranscriptAction(
  transcriptId: string
): Promise<ActionState<SelectAnalysis>> {
  try {
    // Validate input
    if (!transcriptId) {
      return {
        isSuccess: false,
        message: "transcriptId is required"
      }
    }

    // Fetch transcript from database
    const transcript = await db.query.transcripts.findFirst({
      where: eq(transcriptsTable.id, transcriptId)
    })
    if (!transcript) {
      return { isSuccess: false, message: "Transcript not found" }
    }

    const { content, debateId } = transcript

    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return { isSuccess: false, message: "OpenAI API key not set" }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Define the analysis prompt
    const prompt = `
Analyze the following debate transcript and identify:
1. Rhetorical devices used
2. Logical fallacies present
3. Overall argument quality (rated 1-10)

Transcript:
${content}

Provide the analysis in a structured JSON format with keys for "rhetoricalDevices", "fallacies", and "argumentQuality".
    `

    // Call OpenAI API for analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })

    // Parse the analysis results
    const analysisResults = JSON.parse(completion.choices[0].message.content || "{}")

    // Insert analysis into the database
    const [newAnalysis] = await db
      .insert(analysesTable)
      .values({
        debateId,
        results: analysisResults
      })
      .returning()

    return {
      isSuccess: true,
      message: "Analysis completed successfully",
      data: newAnalysis
    }
  } catch (error) {
    console.error("Error analyzing transcript:", error)
    return {
      isSuccess: false,
      message: "Failed to analyze transcript"
    }
  }
}

/**
 * Retrieves an analysis by debate ID.
 *
 * @param debateId - The ID of the debate to retrieve the analysis for
 * @returns A promise resolving to an ActionState with the analysis data or an error message
 *
 * @remarks
 * - Queries the analyses table using Drizzle ORM’s query method.
 * - Returns the first analysis found for the debate (assumes one analysis per debate for now).
 * - Returns failure if no analysis is found or a database error occurs.
 * - Used by the analysis page to fetch and display analysis details.
 *
 * @dependencies
 * - db: Drizzle ORM database instance for queries
 * - analyses-schema: Schema for analyses table
 *
 * @notes
 * - Assumes one analysis per debate; multiple analyses could be supported in future steps.
 * - Edge case: Returns undefined data with a failure message if no analysis exists.
 * - Limitation: Does not support filtering or sorting; fetches first match only.
 *
 * @throws {Error} Logs and returns failure if the database query fails (e.g., connection issues).
 *
 * @example
 * const result = await getAnalysisByDebateIdAction("debate_123");
 * if (result.isSuccess) console.log(result.data);
 */
export async function getAnalysisByDebateIdAction(
  debateId: string
): Promise<ActionState<SelectAnalysis | undefined>> {
  try {
    // Validate input
    if (!debateId) {
      return {
        isSuccess: false,
        message: "debateId is required"
      }
    }

    // Fetch the analysis from the database
    const analysis = await db.query.analyses.findFirst({
      where: eq(analysesTable.debateId, debateId)
    })

    if (!analysis) {
      return {
        isSuccess: false,
        message: "Analysis not found for this debate"
      }
    }

    return {
      isSuccess: true,
      message: "Analysis retrieved successfully",
      data: analysis
    }
  } catch (error) {
    console.error("Error retrieving analysis:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve analysis"
    }
  }
}