/**
 * Types for platform-specific APIs and data structures.
 * These types support the core functionality of debate sourcing from various platforms.
 */

/**
 * Supported platforms for sourcing debates
 */
export type Platform =
  | "YouTube"
  | "Twitch"
  | "Twitter"
  | "X"
  | "Podcasts"
  | "Substack"
  | "Spotify"
  | "SoundCloud"
  | "TikTok"
  | "Reddit"
  | "Telegram"
  | "Discord"
  | "DirectMedia"
  | "Other"
  | "Unknown"

/**
 * Generic platform item returned from any platform
 */
export interface PlatformItem {
  id: string
  title?: string
  participants?: string[]
  date?: string | Date
}

/**
 * YouTube API response structure
 */
export interface YouTubeResponse {
  items: {
    id: { videoId: string }
    snippet: {
      title: string
      publishedAt: string
      channelTitle: string
      description: string
    }
  }[]
}

/**
 * Twitch API response structure
 */
export interface TwitchResponse {
  data: {
    id: string
    title: string
    broadcaster_login: string
    started_at: string
  }[]
}

/**
 * Twitter/X API response structure
 */
export interface XResponse {
  data: {
    id: string
    text: string
    author_id: string
    created_at: string
  }[]
}

/**
 * Podcasts API response structure
 */
export interface PodcastsResponse {
  results: {
    id: string
    title_original: string
    pub_date_ms: string
    podcast: {
      publisher_original: string
    }
  }[]
}

/**
 * Substack API response structure
 */
export interface SubstackResponse {
  posts: {
    id: string
    title: string
    published_at: string
    author: {
      name: string
    }
  }[]
}

/**
 * Spotify API response structure
 */
export interface SpotifyResponse {
  episodes: {
    items: {
      id: string
      name: string
      release_date: string
      show: {
        publisher: string
      }
    }[]
  }
}

/**
 * TikTok API response structure
 */
export interface TikTokResponse {
  videos: {
    id: string
    desc: string
    author: {
      username: string
    }
    create_time: string
  }[]
}

/**
 * Reddit API response structure
 */
export interface RedditResponse {
  data: {
    children: {
      data: {
        id: string
        title: string
        author: string
        created_utc: number
      }
    }[]
  }
}

/**
 * Telegram API response structure
 */
export interface TelegramResponse {
  result: {
    messages: {
      message_id: string
      text: string
      chat: {
        title: string
      }
      date: number
    }[]
  }
}

/**
 * Discord API response structure
 */
export interface DiscordResponse {
  guilds: {
    id: string
    name: string
    owner: {
      username: string
    }
    created_at: string
  }[]
}
