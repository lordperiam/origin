/**
 * @description
 * Centralized export file for all TypeScript types in the Neurogenesis app.
 * Ensures consistent importing via '@/types' as per project rules.
 */

/**
 * Generic type for action state responses
 * Standardizes the shape of server action responses
 */
export interface ActionState<T = any> {
  isSuccess: boolean
  message: string
  data?: T
}

// No need for redundant export
// export type { ActionState }

export * from "./actions-types"
export * from "./platform-types"
export * from "./analysis-types" // Added export for real-time analysis types
