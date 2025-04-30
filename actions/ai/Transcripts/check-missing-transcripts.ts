// check-missing-transcripts.ts
import "module-alias/register"
import { db } from "@/db/db"
import { debatesTable } from "@/db/schema/debates-schema"
import { transcriptsTable } from "@/db/schema/transcripts-schema"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function checkMissingTranscripts() {
  const debates = await db.select().from(debatesTable)
  const transcripts = await db.select().from(transcriptsTable)
  const transcriptMap = new Map(transcripts.map(t => [t.debateId, true]))

  let missingCount = 0
  debates.forEach(debate => {
    if (!transcriptMap.has(debate.id)) {
      console.log(`Missing transcript for debate: ${debate.id} | ${debate.title}`)
      missingCount++
    }
  })
  if (missingCount === 0) {
    console.log("All debates have transcripts.")
  } else {
    console.log(`Total missing transcripts: ${missingCount}`)
  }
}

checkMissingTranscripts().catch(console.error)
