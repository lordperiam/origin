/**
 * @description
 * Centralized export file for all TypeScript types in the Neurogenesis app.
 * Ensures consistent importing via '@/types' as per project rules.
 */

/**
 * Generic type for server action responses.
 * @template T - The type of data returned on success
 */
export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }

export * from "./actions-types"
export * from "./platform-types"
export * from "./analysis-types" // Added export for real-time analysis types
