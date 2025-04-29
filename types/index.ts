/*
Centralized export file for all TypeScript types in the Neurogenesis app.
Ensures consistent importing via '@/types' as per project rules.
*/

export type ActionState<T> =
  | { isSuccess: true; message: string; data: T }
  | { isSuccess: false; message: string; data?: never }

export * from "./actions-types"
export * from "./platform-types"
