import { ActionState } from "./index"

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
  analysisType: string
}

/**
 * Types for debate analysis features in the Neurogenesis app.
 * These types support both static and real-time analysis capabilities.
 */

/**
 * Base analysis data structure with common fields
 */
export interface BaseAnalysis {
  id: string
  debateId: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Analysis of a debate, including highlights and sentiment
 */
export interface DebateAnalysis extends BaseAnalysis {
  summary: string
  keyPoints: string[]
  sentiment: SentimentAnalysis
  topics: string[]
  arguments: Argument[]
}

/**
 * Sentiment analysis results
 */
export interface SentimentAnalysis {
  overall: number // -1 to 1 scale where -1 is negative, 0 is neutral, 1 is positive
  byParticipant: { [participant: string]: number }
  byTopic: { [topic: string]: number }
}

/**
 * Representation of an argument within a debate
 */
export interface Argument {
  id: string
  text: string
  participant: string
  timestamp: string | Date
  topics: string[]
  sentiment: number
  supporting?: string[] // References to supporting arguments by ID
  opposing?: string[] // References to opposing arguments by ID
  fallacies?: Fallacy[]
}

/**
 * Fallacy identified in an argument
 */
export interface Fallacy {
  type: FallacyType
  explanation: string
  confidence: number // 0 to 1
}

/**
 * Types of logical fallacies
 */
export type FallacyType =
  | 'ad_hominem'
  | 'straw_man'
  | 'false_dichotomy'
  | 'appeal_to_authority'
  | 'slippery_slope'
  | 'circular_reasoning'
  | 'hasty_generalization'
  | 'appeal_to_emotion'
  | 'red_herring'
  | 'other'

/**
 * Configuration for analysis
 */
export interface AnalysisConfig {
  detectFallacies: boolean
  trackSentiment: boolean
  identifyTopics: boolean
  generateSummary: boolean
  language: string
  model: string
  apiKey?: string
}

/**
 * Progress of an analysis operation
 */
export interface AnalysisProgress {
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number // 0 to 100
  currentStep: string
  error?: string
  estimatedTimeRemaining?: number // in seconds
}

/**
 * Response structure for debate analysis results
 */
export interface DebateAnalysisResult {
  analysisId: string
  debateId: string
  content: string
  createdAt: string
  updatedAt: string
}

/**
 * Server action response for getting latest analyses
 */
export type GetLatestAnalysesResponse = ActionState<LatestAnalysis[]>

/**
 * Server action response for getting analysis by ID
 */
export type GetAnalysisByIdResponse = ActionState<DebateAnalysisResult>
