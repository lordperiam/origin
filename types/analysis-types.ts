/**
 * @description
 * This file defines types related to analysis data in the Neurogenesis app.
 * It provides a structured interface for the latest analysis data used in real-time features.
 *
 * Key types:
 * - LatestAnalysis: Represents the structure of recent analysis data for display
 */

/**
 * Interface for the structure of latest analysis data.
 * This type defines the shape of data returned by real-time analysis actions.
 *
 * @property {string} analysisId - Unique identifier of the analysis
 * @property {string} debateId - Unique identifier of the associated debate
 * @property {string | null} debateTitle - Title of the debate, if available
 * @property {string} sourcePlatform - Platform from which the debate was sourced
 * @property {string} createdAt - ISO timestamp when the analysis was created
 * @property {any} results - Analysis results stored as JSON (flexible for now)
 */
export interface LatestAnalysis {
  analysisId: string
  debateId: string
  debateTitle: string | null
  sourcePlatform: string
  createdAt: string
  results: any
}
