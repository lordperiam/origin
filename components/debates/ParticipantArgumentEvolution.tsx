import React from "react"
import type {
  Participant,
  ArgumentRecord
} from "@/lib/services/participant-tracking"

export type ParticipantArgumentEvolutionProps = {
  participants: Participant[]
  argumentRecords: ArgumentRecord[]
  selectedParticipantId?: string
  onSelectParticipant?: (id: string) => void
}

export function ParticipantArgumentEvolutionUI({
  participants,
  argumentRecords,
  selectedParticipantId,
  onSelectParticipant
}: ParticipantArgumentEvolutionProps) {
  const selected = participants.find(p => p.id === selectedParticipantId)
  const records = argumentRecords
    .filter(r => r.participantId === selectedParticipantId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  return (
    <div className="rounded border bg-white p-4 shadow">
      <h2 className="mb-2 text-lg font-bold">Participant Argument Evolution</h2>
      <div className="mb-4">
        <label className="font-semibold">Select Participant:</label>
        <select
          className="ml-2 rounded border px-2 py-1"
          value={selectedParticipantId || ""}
          onChange={e =>
            onSelectParticipant && onSelectParticipant(e.target.value)
          }
        >
          <option value="">-- Choose --</option>
          {participants.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {selected && (
        <div>
          <h3 className="mb-2 font-semibold">Arguments Over Time</h3>
          <ul className="space-y-2">
            {records.map((r, i) => (
              <li key={i} className="rounded border bg-gray-50 p-2">
                <div className="text-xs text-gray-500">
                  Debate: {r.debateId} | {r.timestamp.toLocaleString()}
                </div>
                <div className="mt-1 text-gray-800">{r.argument}</div>
              </li>
            ))}
            {records.length === 0 && (
              <li className="text-gray-500">
                No arguments found for this participant.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
