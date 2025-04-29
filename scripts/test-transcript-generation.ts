/**
 * Test script for generateTranscriptAction
 * 
 * This script tests the generateTranscriptAction by calling it with a debate ID and a YouTube URL.
 * 
 * Usage:
 * - Ensure you have set YOUTUBE_API_KEY and OPENAI_API_KEY in your .env.local file
 * - Run with: npx tsx scripts/test-transcript-generation.ts
 */

import { generateTranscriptAction } from "@/actions/ai/transcript-actions"
import dotenv from "dotenv"
import { v4 as uuidv4 } from "uuid"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

async function testTranscriptGeneration() {
  // Check if API keys are available
  const youtubeApiKey = process.env.YOUTUBE_API_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!youtubeApiKey) {
    console.error("Error: YOUTUBE_API_KEY is not set in .env.local")
    process.exit(1)
  }
  
  if (!openaiApiKey) {
    console.error("Error: OPENAI_API_KEY is not set in .env.local")
    process.exit(1)
  }

  console.log("Testing generateTranscriptAction with a YouTube URL...")
  
  // Generate a test UUID for the debate ID (normally this would be a real debate ID from your database)
  const debateId = uuidv4()
  
  // Real YouTube debate URLs
  const youtubeDebateUrls = [
    "https://www.youtube.com/watch?v=_S2G8jhhUHg", // Presidential Debate: Donald Trump vs. Joe Biden 
    "https://www.youtube.com/watch?v=DuhX1Qz9BkY", // Another presidential debate
    "https://www.youtube.com/watch?v=ThtRvBUBpQ4"  // Oxford Union debate
  ]
  
  // Pick a random debate URL from the list
  const youtubeUrl = youtubeDebateUrls[Math.floor(Math.random() * youtubeDebateUrls.length)]
  console.log(`Using YouTube URL: ${youtubeUrl}`)
  console.log(`Using test debate ID: ${debateId}`)
  
  try {
    // Call the action with the debate ID and YouTube URL
    const result = await generateTranscriptAction(debateId, youtubeUrl, "YouTube")
    
    // Log the result
    console.log("Result:", JSON.stringify(result, null, 2))
    
    // Print success or failure message
    if (result.isSuccess) {
      console.log("Success! Generated transcript for the debate.")
      console.log("Transcript excerpt:", result.data.content.substring(0, 300) + "...")
    } else {
      console.error(`Failed: ${result.message}`)
    }
  } catch (error) {
    console.error("Error executing generateTranscriptAction:", error)
  }
}

// Run the test
testTranscriptGeneration().catch(console.error) 