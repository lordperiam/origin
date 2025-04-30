import { db } from "@/db/db";
import { transcriptsTable } from "@/db/schema/transcripts-schema";
import { eq } from "drizzle-orm";

/**
 * Fetches a transcript by its associated debate ID.
 *
 * @param debateId - The ID of the debate to fetch the transcript for.
 * @returns The transcript object or null if not found.
 */
export async function getTranscriptByDebateId(debateId: string) {
  try {
    const transcript = await db.query.transcripts.findFirst({
      where: eq(transcriptsTable.debateId, debateId),
    });

    return transcript || null;
  } catch (error) {
    console.error("Error fetching transcript by debate ID:", error);
    return null;
  }
}