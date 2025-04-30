/**
 * Common action types used throughout the application
 */

/**
 * Basic action result with success/failure indicator
 */
export interface ActionResult {
  success: boolean
  message: string
}

/**
 * Generic data action result with typed payload
 */
export interface DataActionResult<T> extends ActionResult {
  data?: T
}

/**
 * Progress tracking for long-running operations
 */
export interface ProgressStatus {
  progress: number // 0-100
  stage: string
  message: string
  completed: boolean
  error?: string
}

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }
