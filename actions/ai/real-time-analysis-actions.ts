"use server"

/**
 * @description
 * This file contains server actions for real-time analysis features in the Neurogenesis app.
 * It provides functionality to retrieve the latest debate analyses for display in the real-time analysis component.
 *
 * Key features:
 * - Fetches the most recent analyses from the database
 * - Joins analysis data with debate metadata for comprehensive display
 * - Supports the real-time analysis component with up-to-date data
 *
 * @dependencies
 * - "@/db/db": Drizzle ORM database instance for querying
 * - "@/db/schema": Database schemas for analyses and debates tables
 * - "@/types": ActionState and LatestAnalysis types for type safety
 * - "drizzle-orm": eq and desc for query construction
 *
 * @notes
 * - Fetches the latest 10 analyses; limit adjustable based on performance needs
 * - Uses server actions for secure, server-side data retrieval
 * - Edge case: Handles empty database gracefully with success and empty array
 * - Limitation: Currently relies on client-side polling; SSE or websockets planned for true real-time updates
 */

import { db } from "@/db/db"
import { analysesTable, debatesTable } from "@/db/schema"
import { ActionState, LatestAnalysis } from "@/types"
import { eq, desc } from "drizzle-orm"

/**
 * Retrieves the 10 most recent analyses from the database with associated debate metadata.
 *
 * @returns {Promise<ActionState<LatestAnalysis[]>>} A promise resolving to an ActionState containing an array of the latest analyses or an error message
 *
 * @remarks
 * - Queries the analyses table, joining with debates to fetch title and platform
 * - Orders by creation time descending to get the most recent analyses
 * - Limits to 10 results for performance and UI simplicity
 * - Serializes Date objects to ISO strings for JSON compatibility
 *
 * @throws {Error} Logs and returns failure if the database query fails (e.g., connection issues)
 *
 * @example
 * ```typescript
 * const result = await getLatestAnalysesAction();
 * if (result.isSuccess) {
 *   console.log("Recent analyses:", result.data);
 * } else {
 *   console.error("Error:", result.message);
 * }
 * ```
 */
export async function getLatestAnalysesAction(): Promise<ActionState<LatestAnalysis[]>> {
  try {
    // Fetch the 10 most recent analyses with debate metadata
    const analyses = await db
      .select({
        analysisId: analysesTable.id,
        debateId: debatesTable.id,
        debateTitle: debatesTable.title,
        sourcePlatform: debatesTable.sourcePlatform,
        createdAt: analysesTable.createdAt,
        results: analysesTable.results
      })
      .from(analysesTable)
      .innerJoin(debatesTable, eq(analysesTable.debateId, debatesTable.id))
      .orderBy(desc(analysesTable.createdAt))
      .limit(10)

    // Serialize Date objects to ISO strings for client compatibility
    const serializedAnalyses: LatestAnalysis[] = analyses.map(analysis => ({
      analysisId: analysis.analysisId,
      debateId: analysis.debateId,
      debateTitle: analysis.debateTitle,
      sourcePlatform: analysis.sourcePlatform,
      createdAt: (analysis.createdAt instanceof Date
        ? analysis.createdAt.toISOString()
        : analysis.createdAt) as string,
      results: analysis.results
    }))

    return {
      isSuccess: true,
      message: "Latest analyses retrieved successfully",
      data: serializedAnalyses
    }
  } catch (error) {
    console.error("Error getting latest analyses:", error)
    return {
      isSuccess: false,
      message: "Failed to get latest analyses"
    }
  }
}