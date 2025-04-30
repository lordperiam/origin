/*
Defines types related to debate platforms.
This file provides types for supported platforms and their API responses to ensure type safety.
*/

export type Platform =
  | "YouTube"
  | "Twitch"
  | "X"
  | "Podcasts"
  | "Substack"
  | "Spotify"
  | "TikTok"
  | "Reddit"
  | "Telegram"
  | "Discord"
  | "SoundCloud"
  | "Twitter"
  | "DirectMedia"
  | "Unknown"
  | "Other"

// Base interface for platform items
export interface PlatformItem {
  id: string
  title?: string
  participants?: string[]
  date?: string
}

// YouTube API response types
export interface YouTubeResponse {
  items: {
    id: { videoId: string }
    snippet: {
      title: string
      publishedAt: string
    }
  }[]
}

// Twitch API response types
export interface TwitchResponse {
  data: {
    id: string
    title: string
    broadcaster_login: string
    started_at: string
  }[]
}

// X (Twitter) API response types
export interface XResponse {
  data: {
    id: string
    text: string
    author_id: string
    created_at: string
  }[]
}

// Podcasts API response types
export interface PodcastsResponse {
  results: {
    id: string
    title_original: string
    podcast: {
      publisher_original: string
    }
    pub_date_ms: string
  }[]
}

// Substack API response types
export interface SubstackResponse {
  posts: {
    id: string
    title: string
    author: {
      name: string
    }
    published_at: string
  }[]
}

// Spotify API response types
export interface SpotifyResponse {
  episodes: {
    items: {
      id: string
      name: string
      show: {
        publisher: string
      }
      release_date: string
    }[]
  }
}

// TikTok API response types
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

// Reddit API response types
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

// Telegram API response types
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

// Discord API response types
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
