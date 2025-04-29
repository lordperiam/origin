/**
 * Script to list all debates in the database
 */

import { db } from "@/db/db"
import { debatesTable } from "@/db/schema"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

async function listDebates() {
  try {
    const debates = await db.select().from(debatesTable)
    
    if (debates.length === 0) {
      console.log("No debates found in the database")
      return
    }

    console.log(`Found ${debates.length} debates:\n`)
    
    debates.forEach((debate, index) => {
      console.log(`Debate ${index + 1}:`)
      console.log(`ID: ${debate.id}`)
      console.log(`Platform: ${debate.sourcePlatform}`)
      console.log(`Title: ${debate.title}`)
      console.log(`Date: ${debate.date ? new Date(debate.date).toLocaleString() : 'N/A'}\n`)
    })
  } catch (error) {
    console.error("Error listing debates:", error)
  }
}

// Run the script
listDebates().catch(console.error) 