import React from "react"
import type {
  DebateOutcomeCriteria,
  DebateJustification
} from "@/lib/services/debate-justification"

export type DebateJustificationProps = {
  criteria: DebateOutcomeCriteria
  justification: DebateJustification
  onCriteriaChange?: (criteria: DebateOutcomeCriteria) => void
  onSubmit?: () => void
  loading?: boolean
}

/**
 * Component that displays debate outcome justification with adjustable criteria
 * Allows users to rate debate performance and generate AI-backed justifications
 */
export function DebateJustificationUI({
  criteria,
  justification,
  onCriteriaChange,
  onSubmit,
  loading
}: DebateJustificationProps) {
  return (
    <div className="rounded border bg-card p-4 shadow">
      <h2 className="mb-2 text-lg font-bold">Debate Outcome Justification</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Criteria</h3>
        <ul>
          {Object.entries(criteria).map(([key, value]) => (
            <li key={key} className="flex items-center gap-2">
              <span className="w-32 capitalize">{key}</span>
              <input
                type="range"
                min={1}
                max={5}
                value={value}
                disabled={!onCriteriaChange}
                onChange={e =>
                  onCriteriaChange &&
                  onCriteriaChange({
                    ...criteria,
                    [key]: Number(e.target.value)
                  })
                }
                className="w-full"
              />
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className="mb-4 rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Generating Justification..." : "Generate Justification"}
      </button>
      <div>
        <h3 className="font-semibold">LLM Justification</h3>
        <p className="mt-2 whitespace-pre-line text-foreground">
          {justification.reasoning}
        </p>
      </div>
    </div>
  )
}