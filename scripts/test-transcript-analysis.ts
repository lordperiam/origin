/**
 * Test script for analyzeTranscriptAction
 * 
 * This script tests the analyzeTranscriptAction by calling it with a transcript ID.
 * 
 * Usage:
 * - Ensure you have set OPENAI_API_KEY in your .env.local file
 * - Run with: npx tsx scripts/test-transcript-analysis.ts
 */

import { analyzeTranscriptAction } from "@/actions/ai/analysis-actions"
import { getTranscriptAction } from "@/actions/ai/transcript-actions"
import dotenv from "dotenv"

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" })

// Define the type for analysis results
interface AnalysisResults {
  text: string;
  rhetoricalDevices: string[];
  logicalFallacies: string[];
  keyArguments: string[];
  effectiveness: string;
  model: string;
  timestamp: string;
}

async function testTranscriptAnalysis() {
  // Check if API key is available
  const openaiApiKey = process.env.OPENAI_API_KEY
  
  if (!openaiApiKey) {
    console.error("Error: OPENAI_API_KEY is not set in .env.local")
    process.exit(1)
  }

  console.log("Testing analyzeTranscriptAction...")
  
  // Use a sample transcript ID - you need to replace this with an actual transcript ID from your database
  const transcriptId = "transcript_123" 
  
  try {
    // First, verify the transcript exists
    const transcriptResult = await getTranscriptAction(transcriptId)
    
    if (!transcriptResult.isSuccess) {
      console.error(`Transcript not found: ${transcriptResult.message}`)
      process.exit(1)
    }
    
    console.log(`Found transcript: ${transcriptId}`)
    console.log(`Content preview: ${transcriptResult.data.content.substring(0, 100)}...`)
    
    // Call the analysis action
    console.log("\nAnalyzing transcript...")
    const analysisResult = await analyzeTranscriptAction(transcriptId)
    
    // Log the result
    if (analysisResult.isSuccess) {
      console.log("\nSuccess! Analysis results:")
      console.log("Analysis ID:", analysisResult.data.id)
      console.log("Debate ID:", analysisResult.data.debateId)
      
      // Cast the results to the AnalysisResults interface
      const results = analysisResult.data.results as AnalysisResults
      
      console.log("\nRhetorical Devices:", results.rhetoricalDevices)
      console.log("\nLogical Fallacies:", results.logicalFallacies)
      console.log("\nKey Arguments:", results.keyArguments)
      console.log("\nEffectiveness:", results.effectiveness)
      
      // Show a preview of the full analysis text
      console.log("\nAnalysis Preview:", results.text.substring(0, 300) + "...")
    } else {
      console.error(`Failed: ${analysisResult.message}`)
    }
  } catch (error) {
    console.error("Error executing analyzeTranscriptAction:", error)
  }
}

// Run the test
testTranscriptAnalysis().catch(console.error) 