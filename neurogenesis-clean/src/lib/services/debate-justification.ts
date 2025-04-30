/**
 * Types and services for debate justification functionality
 * This allows providing AI-driven insights about debate outcomes and scoring
 */

// Debate outcome criteria schema and LLM-based justification service

export type DebateOutcomeCriteria = {
  clarity: number // 1-5
  evidence: number // 1-5
  logicalConsistency: number // 1-5
  civility: number // 1-5
  engagement: number // 1-5
  [key: string]: number
}

export type DebateJustification = {
  criteria: DebateOutcomeCriteria
  reasoning: string
}

// Dummy LLM call; replace with real LLM integration
async function generateJustificationLLM(
  criteria: DebateOutcomeCriteria,
  debateSummary: string
): Promise<string> {
  // TODO: Integrate with OpenAI, Anthropic, etc.
  return `Based on the provided criteria and debate summary, the outcome is justified as follows: ...`
}

export async function justifyDebateOutcome(
  criteria: DebateOutcomeCriteria,
  debateSummary: string
): Promise<DebateJustification> {
  const reasoning = await generateJustificationLLM(criteria, debateSummary)
  return { criteria, reasoning }
}