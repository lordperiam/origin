/**
 * Test script for fetchDebatesFromPlatformAction
 * 
 * This script tests the fetchDebatesFromPlatformAction by calling it with the YouTube platform
 * and its corresponding API key from environment variables.
 * 
 * Usage:
 * - Ensure you have set YOUTUBE_API_KEY in your .env.local file
 * - Run with: npx tsx scripts/test-debates-api.ts
 */

import { fetchDebatesFromPlatformAction } from "@/actions/db/debates-actions"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

async function testFetchDebatesAction() {
  // Check if API key is available
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    console.error("Error: YOUTUBE_API_KEY is not set in .env.local")
    process.exit(1)
  }

  console.log("Testing fetchDebatesFromPlatformAction with YouTube...")
  
  try {
    // Call the action with YouTube platform and API key
    const result = await fetchDebatesFromPlatformAction("YouTube", apiKey)
    
    // Log the result
    console.log("Result:", JSON.stringify(result, null, 2))
    
    // Print success or failure message
    if (result.isSuccess) {
      console.log(`Success! Fetched ${result.data.length} debates.`)
    } else {
      console.error(`Failed: ${result.message}`)
    }
  } catch (error) {
    console.error("Error executing fetchDebatesFromPlatformAction:", error)
  }
}

// Run the test
testFetchDebatesAction().catch(console.error) 