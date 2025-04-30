// Participant tracking and argument evolution analysis

export type Participant = {
  id: string
  name: string
  aliases?: string[]
}

export type ArgumentRecord = {
  debateId: string
  participantId: string
  argument: string
  timestamp: Date
}

/**
 * Compare arguments for a participant across debates
 * Returns a chronologically sorted list of arguments for a specific participant
 */
export function compareArgumentEvolution(
  records: ArgumentRecord[],
  participantId: string
): { debateId: string; argument: string }[] {
  return records
    .filter(r => r.participantId === participantId)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(r => ({ debateId: r.debateId, argument: r.argument }))
}