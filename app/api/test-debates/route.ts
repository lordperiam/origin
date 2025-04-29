"use server"

import { fetchDebatesFromPlatformAction } from "@/actions/db/debates-actions"
import { Platform } from "@/types/platform-types"
import { NextRequest, NextResponse } from "next/server"

/**
 * API route to test fetchDebatesFromPlatformAction
 *
 * This route accepts two query parameters:
 * - platform: The platform to fetch debates from (e.g., "YouTube", "Twitch")
 * - apiKey: The API key for the platform (optional, uses environment variable if not provided)
 *
 * Example usage:
 * GET /api/test-debates?platform=YouTube
 *
 * @param req - The Next.js request object
 * @returns A JSON response with the result of fetchDebatesFromPlatformAction
 */
export async function GET(req: NextRequest) {
  try {
    // Get platform from query parameters
    const searchParams = req.nextUrl.searchParams
    const platform = searchParams.get("platform") as Platform | null
    const apiKey = searchParams.get("apiKey")

    // Return error if platform is not provided
    if (!platform) {
      return NextResponse.json(
        { error: "Platform parameter is required" },
        { status: 400 }
      )
    }

    // Use provided API key or get from environment variables
    const key = apiKey || getApiKeyForPlatform(platform)

    // Return error if API key is not available
    if (!key) {
      return NextResponse.json(
        { error: `API key for ${platform} is not available` },
        { status: 400 }
      )
    }

    // Call the action with platform and API key
    const result = await fetchDebatesFromPlatformAction(platform, key)

    // Return the result
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in test-debates API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch debates" },
      { status: 500 }
    )
  }
}

/**
 * Helper function to get the API key for a specific platform from environment variables.
 *
 * @param platform - The platform to get the API key for
 * @returns The API key for the platform or null if not available
 */
function getApiKeyForPlatform(platform: Platform): string | null {
  switch (platform) {
    case "YouTube":
      return process.env.YOUTUBE_API_KEY || null
    case "Twitch":
      return process.env.TWITCH_API_KEY || null
    case "X":
      return process.env.X_API_KEY || null
    case "Podcasts":
      return process.env.PODCASTS_API_KEY || null
    case "Substack":
      return process.env.SUBSTACK_API_KEY || null
    case "Spotify":
      return process.env.SPOTIFY_API_KEY || null
    case "TikTok":
      return process.env.TIKTOK_API_KEY || null
    case "Reddit":
      return process.env.REDDIT_API_KEY || null
    case "Telegram":
      return process.env.TELEGRAM_API_KEY || null
    case "Discord":
      return process.env.DISCORD_API_KEY || null
    default:
      return null
  }
}
