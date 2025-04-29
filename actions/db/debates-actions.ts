/*
Contains server actions related to debates in the DB.
This file provides actions to fetch debates from external platforms and store them in the database.
It supports the core functionality of debate sourcing as outlined in the technical specification.
*/

"use server"

import { db } from "@/db/db"
import {
  InsertDebate,
  debatesTable,
  SelectDebate
} from "@/db/schema/debates-schema"
import { ActionState } from "@/types"
import { Platform } from "@/types/platform-types" // Assuming a types file for platform definitions
import { eq } from "drizzle-orm"

/**
 * Fetches debates from a specified platform and stores them in the database.
 * 
 * @param platform - The platform to fetch debates from (e.g., "YouTube", "Twitch").
 * @param apiKey - The API key for the platform, retrieved from environment variables.
 * @returns A promise resolving to an ActionState with the inserted debates or an error message.
 * 
 * @remarks
 * - Uses platform-specific APIs to fetch debate data (e.g., YouTube Data API).
 * - Normalizes fetched data to match the debatesTable schema (InsertDebate type).
 * - Inserts normalized data into debatesTable using Drizzle ORM.
 * - Handles rate limiting and invalid data errors gracefully.
 * 
 * @throws {Error} Logs and returns failure if the API call or database operation fails.
 * 
 * @example
 * const result = await fetchDebatesFromPlatformAction("YouTube", process.env.YOUTUBE_API_KEY);
 * if (result.isSuccess) console.log(result.data);
 */
export async function fetchDebatesFromPlatformAction(
  platform: Platform,
  apiKey: string
): Promise<ActionState<SelectDebate[]>> {
  try {
    // Validate inputs
    if (!platform || !apiKey) {
      return {
        isSuccess: false,
        message: "Platform and API key are required"
      }
    }

    // Fetch debates from the platform using the placeholder function
    const fetchedDebates = await fetchFromPlatform(platform, apiKey)

    // Validate fetched data
    if (!Array.isArray(fetchedDebates) || fetchedDebates.length === 0) {
      return {
        isSuccess: false,
        message: "No debates fetched from platform"
      }
    }

    // Normalize the fetched data to match InsertDebate type
    const normalizedDebates: InsertDebate[] = fetchedDebates.map(debate => ({
      sourcePlatform: platform,
      sourceId: debate.id,
      title: debate.title || "Untitled Debate", // Default title if missing
      participants: debate.participants || [], // Empty array if no participants
      date: debate.date ? new Date(debate.date) : undefined // Convert to Date object or undefined
    }))

    // Insert normalized debates into the database and return inserted records
    const insertedDebates = await db
      .insert(debatesTable)
      .values(normalizedDebates)
      .returning()

    return {
      isSuccess: true,
      message: "Debates fetched and stored successfully",
      data: insertedDebates
    }
  } catch (error) {
    console.error("Error fetching debates from platform:", error)
    return {
      isSuccess: false,
      message: "Failed to fetch debates from platform"
    }
  }
}

/**
 * Placeholder function to fetch debates from a platform using its API.
 * This should be replaced with actual API calls for each supported platform.
 * 
 * @param platform - The platform to fetch debates from.
 * @param apiKey - The API key for the platform.
 * @returns A promise resolving to an array of debate objects.
 * 
 * @remarks
 * - Currently returns an empty array as a placeholder.
 * - Should implement platform-specific logic (e.g., YouTube Data API search).
 * - Expected debate object shape: { id: string, title?: string, participants?: string[], date?: string }
 * 
 * @example
 * For YouTube:
 * const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=debate`);
 * return response.json().then(data => data.items.map(item => ({
 *   id: item.id.videoId,
 *   title: item.snippet.title,
 *   participants: [], // Extract from description or metadata
 *   date: item.snippet.publishedAt
 * })));
 */
async function fetchFromPlatform(platform: Platform, apiKey: string) {
  if (platform === "YouTube") {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=debate&type=video&part=snippet&maxResults=10`
    );
    const data = await response.json();
    return data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      participants: [], // Extract from description or metadata if available
      date: item.snippet.publishedAt
    }));
  } else if (platform === "Twitch") {
    const response = await fetch(
      `https://api.twitch.tv/helix/search/channels?query=debate`,
      {
        headers: {
          "Client-ID": apiKey,
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.data.map(item => ({
      id: item.id,
      title: item.title,
      participants: [item.broadcaster_login],
      date: item.started_at
    }));
  } else if (platform === "X") {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=debate&max_results=10`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.data.map(item => ({
      id: item.id,
      title: item.text.substring(0, 100),
      participants: [item.author_id],
      date: item.created_at
    }));
  } else if (platform === "Podcasts") {
    const response = await fetch(
      `https://listen-api.listennotes.com/api/v2/search?q=debate&type=episode&len_min=10&len_max=60`,
      {
        headers: {
          "X-ListenAPI-Key": apiKey
        }
      }
    );
    const data = await response.json();
    return data.results.map(item => ({
      id: item.id,
      title: item.title_original,
      participants: [item.podcast.publisher_original],
      date: item.pub_date_ms
    }));
  } else if (platform === "Substack") {
    const response = await fetch(
      `https://substack-api.example.com/search?token=${apiKey}&query=debate`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.posts.map(item => ({
      id: item.id,
      title: item.title,
      participants: [item.author.name],
      date: item.published_at
    }));
  } else if (platform === "Spotify") {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=debate&type=episode&limit=10`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.episodes.items.map(item => ({
      id: item.id,
      title: item.name,
      participants: [item.show.publisher],
      date: item.release_date
    }));
  } else if (platform === "TikTok") {
    const response = await fetch(
      `https://open-api.tiktok.com/v2/search/video/?keyword=debate&count=10`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.videos.map(item => ({
      id: item.id,
      title: item.desc.substring(0, 100),
      participants: [item.author.username],
      date: item.create_time
    }));
  } else if (platform === "Reddit") {
    const response = await fetch(
      `https://oauth.reddit.com/search?q=debate&sort=new&limit=10`,
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "DebateApp/1.0"
        }
      }
    );
    const data = await response.json();
    return data.data.children.map(item => ({
      id: item.data.id,
      title: item.data.title,
      participants: [item.data.author],
      date: new Date(item.data.created_utc * 1000).toISOString()
    }));
  } else if (platform === "Telegram") {
    const response = await fetch(
      `https://api.telegram.org/bot${apiKey}/searchPublicMessages?query=debate&limit=10`
    );
    const data = await response.json();
    return data.result.messages.map(item => ({
      id: item.message_id,
      title: item.text.substring(0, 100),
      participants: [item.chat.title],
      date: new Date(item.date * 1000).toISOString()
    }));
  } else if (platform === "Discord") {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/search?query=debate&limit=10`,
      {
        headers: {
          "Authorization": `Bot ${apiKey}`
        }
      }
    );
    const data = await response.json();
    return data.map(item => ({
      id: item.id,
      title: item.name,
      participants: [item.owner.username],
      date: item.created_at
    }));
  }
  // Default case
  return [];
}

// Additional CRUD actions can be added below as needed in future steps

/**
 * Retrieves all debates from the database.
 * 
 * @returns A promise resolving to an ActionState with all debates or an error message.
 * 
 * @remarks
 * - Simple read action for testing and debugging purposes.
 * - Uses Drizzle ORM's query method to fetch all records.
 * 
 * @example
 * const result = await getAllDebatesAction();
 * if (result.isSuccess) console.log(result.data);
 */
export async function getAllDebatesAction(): Promise<ActionState<SelectDebate[]>> {
  try {
    const debates = await db.select().from(debatesTable)
    return {
      isSuccess: true,
      message: "Debates retrieved successfully",
      data: debates
    }
  } catch (error) {
    console.error("Error retrieving debates:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve debates"
    }
  }
}
