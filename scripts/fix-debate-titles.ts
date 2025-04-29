import { db } from "@/db/db"
import { debatesTable, SelectDebate } from "@/db/schema"
import { formatDebateTitle } from "@/lib/utils/format-debate-title"
import { eq } from "drizzle-orm"
import "dotenv/config"

async function fixDebateTitles() {
  try {
    // Get all debates
    console.log("Fetching all debates...")
    const debates = await db.select().from(debatesTable)
    console.log(`Found ${debates.length} debates to process`)

    // Update each debate title
    for (const debate of debates) {
      const originalTitle = debate.title || "Untitled Debate"
      const newTitle = formatDebateTitle(originalTitle)
      
      if (originalTitle !== newTitle) {
        console.log("\nUpdating debate title:")
        console.log("Original:", originalTitle)
        console.log("New:", newTitle)
        
        await db
          .update(debatesTable)
          .set({ 
            title: newTitle,
            updatedAt: new Date()
          })
          .where(eq(debatesTable.id, debate.id))
      }
    }

    console.log("\nTitle correction completed!")
  } catch (error) {
    console.error("Error fixing debate titles:", error)
  }
}

fixDebateTitles() 