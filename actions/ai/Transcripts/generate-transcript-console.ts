// generate-transcript-console.ts
import { generateTranscriptAction } from "@/actions/ai/transcript-actions"
import { db } from "@/db/db"
import { debatesTable } from "@/db/schema/debates-schema"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log("Usage: ts-node generate-transcript-console.ts <debateId> <sourceUrl> [platform]")
    process.exit(1)
  }
  const [debateId, sourceUrl, platform] = args
  // Optionally, check if debate exists
  const debate = await db.query.debates.findFirst({ where: (debatesTable.id as any).eq(debateId) })
  if (!debate) {
    console.error("Debate not found for ID:", debateId)
    process.exit(1)
  }
  const result = await generateTranscriptAction(debateId, sourceUrl, platform)
  if (result.isSuccess) {
    console.log("Transcript generated and stored:")
    console.log(result.data)
  } else {
    console.error("Failed to generate transcript:", result.message)
  }
}

main().catch(console.error)
