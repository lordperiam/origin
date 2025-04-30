/**
 * @description
 * This file defines an API route for retrieving debate analyses in the Neurogenesis app.
 * It provides a GET endpoint at /api/analyses to fetch all stored analyses, supporting third-party access
 * as specified in the project request under "APIs & Integrations."
 *
 * Key features:
 * - Authentication: Restricts access to authenticated users via Clerk
 * - Data Fetching: Retrieves all analyses from the database using Drizzle ORM
 * - Response Format: Returns data in JSON with ActionState-like structure for consistency
 * - Error Handling: Handles unauthenticated access and database errors with appropriate status codes
 *
 * @dependencies
 * - @clerk/nextjs/server: auth() for user authentication
 * - @/db/db: Drizzle ORM database instance for querying
 * - @/db/schema/analyses-schema: SelectAnalysis type for type safety
 * - next/server: NextRequest and NextResponse for API route handling
 *
 * @notes
 * - Currently fetches all analyses; pagination or filtering could be added in future steps
 * - Rate limiting is noted but not implemented; consider middleware or external service for production
 * - Subscription tiers are not enforced yet; assumes all authenticated users have access
 * - Edge case: Empty analysis table returns success with empty array
 * - Limitation: No verification standard check implemented yet; all analyses are returned as-is
 */

import { auth } from "@clerk/nextjs/server"
import { db } from "@/db/db"
import { analysesTable, SelectAnalysis } from "@/db/schema/analyses-schema"
import { NextRequest, NextResponse } from "next/server"

/**
 * Handles GET requests to /api/analyses, returning all stored analyses.
 *
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with analyses or error message
 *
 * @remarks
 * - Requires authentication via Clerk; unauthenticated requests return 401
 * - Fetches all records from the analyses table
 * - Returns data in a structure similar to ActionState for consistency with server actions
 * - Logs errors to console for debugging; production should use a logging service
 *
 * @example
 * GET /api/analyses
 * Response:
 * {
 *   "isSuccess": true,
 *   "message": "Analyses retrieved successfully",
 *   "data": [{ "id": "uuid", "debateId": "uuid", "results": {...}, ... }]
 * }
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Check authentication
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { isSuccess: false, message: "Unauthorized: Authentication required" },
      { status: 401 }
    )
  }

  try {
    // Fetch all analyses from the database
    const analyses: SelectAnalysis[] = await db.select().from(analysesTable)

    // Structure response similar to ActionState
    const response = {
      isSuccess: true,
      message: "Analyses retrieved successfully",
      data: analyses
    }

    // Return JSON response with 200 status
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    // Log error for debugging
    console.error("Error fetching analyses in API route:", error)

    // Return error response with 500 status
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to retrieve analyses"
      },
      { status: 500 }
    )
  }
}
