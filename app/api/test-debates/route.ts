"use server"

import {
  getAllDebatesAction,
  fetchDebatesFromPlatformAction
} from "@/actions/db/debates-actions"
import { debatesTable } from "@/db/schema/debates-schema"
import { db } from "@/db/db"
import { Platform } from "@/types/platform-types"
import { NextRequest, NextResponse } from "next/server"

/**
 * API route for debates
 *
 * GET:
 *   - /api/debates            → all debates
 *   - /api/debates?platform=X → debates filtered by platform
 *   - /api/debates?platform=X&fetch=1 → fetch from platform API and store
 * POST:
 *   - Create a new debate (JSON body)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const platform = searchParams.get("platform") as Platform | null
    const fetchFromPlatform = searchParams.get("fetch") === "1"
    const apiKey = searchParams.get("apiKey")

    if (platform && fetchFromPlatform) {
      const key = apiKey || getApiKeyForPlatform(platform)
      if (!key) {
        return NextResponse.json(
          { error: `API key for ${platform} is not available` },
          { status: 400 }
        )
      }
      const result = await fetchDebatesFromPlatformAction(platform, key)
      return NextResponse.json(result)
    }

    // Get all debates or filter by platform
    const allDebates = await getAllDebatesAction()
    if (platform) {
      const filtered = (allDebates.data || []).filter(
        d => d.sourcePlatform === platform
      )
      return NextResponse.json({ ...allDebates, data: filtered })
    }
    return NextResponse.json(allDebates)
  } catch (error) {
    console.error("Error in debates API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch debates" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Basic validation
    if (!body.title || !body.sourcePlatform || !body.sourceId) {
      return NextResponse.json(
        { error: "title, sourcePlatform, and sourceId are required" },
        { status: 400 }
      )
    }
    const newDebate = {
      title: body.title,
      sourcePlatform: body.sourcePlatform,
      sourceId: body.sourceId,
      participants: body.participants || [],
      date: body.date ? new Date(body.date) : undefined
    }
    const [inserted] = await db
      .insert(debatesTable)
      .values(newDebate)
      .returning()
    return NextResponse.json({ isSuccess: true, data: inserted })
  } catch (error) {
    console.error("Error creating debate:", error)
    return NextResponse.json(
      { error: "Failed to create debate" },
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
