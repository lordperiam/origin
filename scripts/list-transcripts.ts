/**
 * Script to list all transcripts in the database
 */

import { db } from "@/db/db"
import { transcriptsTable } from "@/db/schema"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function listTranscripts() {
  try {
    const transcripts = await db.select().from(transcriptsTable)
    
    if (transcripts.length === 0) {
      console.log("No transcripts found in the database")
      return
    }

    console.log(`Found ${transcripts.length} transcripts:\n`)
    
    transcripts.forEach((transcript, index) => {
      console.log(`Transcript ${index + 1}:`)
      console.log(`ID: ${transcript.id}`)
      console.log(`Debate ID: ${transcript.debateId}`)
      console.log(`Language: ${transcript.language}`)
      console.log(`Verified: ${transcript.verified}`)
      console.log(`Content Preview: ${transcript.content.substring(0, 200)}...\n`)
    })
  } catch (error) {
    console.error("Error listing transcripts:", error)
  }
}

// Run the script
listTranscripts().catch(console.error) 