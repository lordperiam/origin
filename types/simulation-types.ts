/**
 * Type definitions for debate simulation functionality.
 * These types support the creation and management of simulated debates
 * between AI personalities with customizable topics and formats.
 */

/**
 * Represents a participant in a simulated debate.
 */
export interface SimulatedParticipant {
  /**
   * The name of the participant (e.g., "Socrates", "Nietzsche")
   */
  name: string

  /**
   * A description of the participant's background or characteristics
   */
  description?: string

  /**
   * Optional image URL for the participant
   */
  imageUrl?: string
}

/**
 * Debate format options
 */
export type DebateFormat =
  | "dialogue" // Free-flowing conversation
  | "structured" // Formal debate with timed sections
  | "moderated" // Conversation guided by a moderator
  | "oxford" // Traditional format with proposition and opposition
  | "panel" // Multiple participants with a panel discussion format

/**
 * Debate length options
 */
export type DebateLength =
  | "short" // ~3 turns per participant
  | "medium" // ~5 turns per participant
  | "long" // ~8 turns per participant
  | "very long" // ~12 turns per participant

/**
 * Configuration options for a debate simulation.
 */
export interface SimulationOptions {
  /**
   * Array of participants in the debate (minimum 2 required)
   */
  participants: SimulatedParticipant[]

  /**
   * The topic of the debate
   */
  topic: string

  /**
   * The format of the debate
   */
  format?: DebateFormat

  /**
   * Whether to include a moderator in the debate
   */
  moderator?: boolean

  /**
   * The length/complexity of the debate
   */
  debateLength?: DebateLength

  /**
   * Optional additional context or constraints for the debate
   */
  additionalContext?: string
}
