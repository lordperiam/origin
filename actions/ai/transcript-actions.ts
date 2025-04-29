/*
Contains server actions related to transcript generation.
This file provides actions to generate and store transcripts from various sources.
*/

"use server"

import { db } from "@/db/db"
import { InsertTranscript, SelectTranscript, transcriptsTable } from "@/db/schema/transcripts-schema"
import { ActionState } from "@/types"
import { Platform } from "@/types/platform-types"
import { eq } from "drizzle-orm"
import OpenAI from "openai"
import { createReadStream } from "fs"
import { Readable } from "stream"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * Generates a transcript for a debate from a source URL and stores it in the database.
 * 
 * @param debateId - The ID of the debate to generate a transcript for
 * @param sourceUrl - The URL of the audio or video source
 * @param platform - Optional platform identifier (e.g., "YouTube", "Podcasts")
 * @returns A promise resolving to an ActionState with the generated transcript or an error message
 * 
 * @remarks
 * - Uses platform-specific APIs to fetch captions or transcripts when available
 * - Falls back to OpenAI's speech-to-text for audio sources without captions
 * - Stores the generated transcript in the database linked to the debate
 * 
 * @example
 * const result = await generateTranscriptAction("debate_123", "https://example.com/audio.mp3");
 * if (result.isSuccess) console.log(result.data);
 */
export async function generateTranscriptAction(
  debateId: string,
  sourceUrl: string,
  platform?: Platform
): Promise<ActionState<SelectTranscript>> {
  try {
    // Validate inputs
    if (!debateId || !sourceUrl) {
      return {
        isSuccess: false,
        message: "Debate ID and source URL are required"
      }
    }

    // Extract source ID if it's a YouTube URL
    let sourceId = ""
    if (platform === "YouTube" || sourceUrl.includes("youtube.com") || sourceUrl.includes("youtu.be")) {
      platform = "YouTube"
      
      // Extract video ID from YouTube URL
      if (sourceUrl.includes("youtube.com/watch?v=")) {
        sourceId = new URL(sourceUrl).searchParams.get("v") || ""
      } else if (sourceUrl.includes("youtu.be/")) {
        sourceId = sourceUrl.split("youtu.be/")[1].split("?")[0]
      }
      
      if (!sourceId) {
        return {
          isSuccess: false,
          message: "Could not extract YouTube video ID from URL"
        }
      }
    }

    // Initialize transcript content
    let transcriptContent = ""
    
    // Generate transcript based on platform
    if (platform === "YouTube" && sourceId) {
      // Fetch YouTube captions
      const apiKey = process.env.YOUTUBE_API_KEY
      
      if (!apiKey) {
        return {
          isSuccess: false,
          message: "YouTube API key is required for YouTube transcripts"
        }
      }
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/captions?videoId=${sourceId}&key=${apiKey}&part=snippet`
      );
      const data = await response.json();
      
      // Check if captions are available
      const captionText = data.items && data.items[0]?.snippet?.text;
      if (captionText) {
        transcriptContent = captionText;
      } else {
        return {
          isSuccess: false,
          message: "YouTube captions not available for this video"
        }
      }
    } else {
      // For non-YouTube sources or if captions not available, use OpenAI to transcribe
      try {
        // Check if OpenAI API key is available
        if (!process.env.OPENAI_API_KEY) {
          return {
            isSuccess: false,
            message: "OpenAI API key is required for audio transcription"
          }
        }
        
        // Download the audio file
        const audioResponse = await fetch(sourceUrl);
        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio from ${sourceUrl}`);
        }
        
        // Get audio data as blob and convert to File object
        const audioBlob = await audioResponse.blob();
        const audioFile = new File(
          [audioBlob], 
          "audio.mp3", 
          { type: audioBlob.type || "audio/mpeg" }
        );
        
        // Transcribe audio using OpenAI's Whisper model
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1"
        });
        
        transcriptContent = transcription.text;
      } catch (error) {
        console.error("Error transcribing audio:", error);
        return {
          isSuccess: false,
          message: "Failed to transcribe audio"
        };
      }
    }
    
    // Check if transcript was successfully generated
    if (!transcriptContent) {
      return {
        isSuccess: false,
        message: "Failed to generate transcript content"
      }
    }
    
    // Store transcript in database
    const newTranscript: InsertTranscript = {
      debateId,
      content: transcriptContent,
      language: "en", // Default to English, could be detected based on content
      verified: false // Set to false initially, requires verification
    }
    
    const [insertedTranscript] = await db
      .insert(transcriptsTable)
      .values(newTranscript)
      .returning()
    
    return {
      isSuccess: true,
      message: "Transcript generated and stored successfully",
      data: insertedTranscript
    }
  } catch (error) {
    console.error("Error generating transcript:", error)
    return {
      isSuccess: false,
      message: "Failed to generate transcript"
    }
  }
}

/**
 * Retrieves a transcript by ID.
 * 
 * @param transcriptId - The ID of the transcript to retrieve
 * @returns A promise resolving to an ActionState with the transcript or an error message
 * 
 * @example
 * const result = await getTranscriptAction("transcript_123");
 * if (result.isSuccess) console.log(result.data);
 */
export async function getTranscriptAction(
  transcriptId: string
): Promise<ActionState<SelectTranscript | undefined>> {
  try {
    const [transcript] = await db
      .select()
      .from(transcriptsTable)
      .where(eq(transcriptsTable.id, transcriptId))
      .limit(1)
    
    if (!transcript) {
      return {
        isSuccess: false,
        message: "Transcript not found"
      }
    }
    
    return {
      isSuccess: true,
      message: "Transcript retrieved successfully",
      data: transcript
    }
  } catch (error) {
    console.error("Error retrieving transcript:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve transcript"
    }
  }
}

/**
 * Retrieves all transcripts for a debate.
 * 
 * @param debateId - The ID of the debate to retrieve transcripts for
 * @returns A promise resolving to an ActionState with the transcripts or an error message
 * 
 * @example
 * const result = await getDebateTranscriptsAction("debate_123");
 * if (result.isSuccess) console.log(result.data);
 */
export async function getDebateTranscriptsAction(
  debateId: string
): Promise<ActionState<SelectTranscript[]>> {
  try {
    const transcripts = await db
      .select()
      .from(transcriptsTable)
      .where(eq(transcriptsTable.debateId, debateId))

    return {
      isSuccess: true,
      message: "Transcripts retrieved successfully",
      data: transcripts
    }
  } catch (error) {
    console.error("Error retrieving debate transcripts:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve debate transcripts"
    }
  }
}