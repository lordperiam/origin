import { db } from "@/db/db"
import { debatesTable } from "@/db/schema"
import { fetchDebatesFromPlatformAction } from "@/actions/db/debates-actions"
import "dotenv/config"

async function resetDebates() {
  try {
    // Clear the debates table
    console.log("Clearing debates table...")
    await db.delete(debatesTable)
    console.log("Debates table cleared successfully")

    // Fetch fresh debates from YouTube
    console.log("Fetching fresh debates from YouTube...")
    const result = await fetchDebatesFromPlatformAction(
      "YouTube",
      process.env.YOUTUBE_API_KEY || ""
    )

    if (result.isSuccess) {
      console.log("Debates fetched successfully:", result.data)
    } else {
      console.error("Failed to fetch debates:", result.message)
    }
  } catch (error) {
    console.error("Error resetting debates:", error)
  }
}

resetDebates() 