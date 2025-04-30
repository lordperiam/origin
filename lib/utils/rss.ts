import Parser from "rss-parser"

export interface ParsedEpisode {
  id: string
  title: string
  audioUrl: string
  publishedAt: string
  description?: string
}

/**
 * Parses an RSS feed from a given URL and returns the feed object.
 * Handles malformed feeds and missing fields gracefully.
 *
 * @param url - The RSS feed URL
 * @returns The parsed feed object or throws an error with details
 */
export async function parseRssFeed(url: string) {
  const parser = new Parser()
  try {
    const feed = await parser.parseURL(url)
    if (!feed || !feed.items || feed.items.length === 0) {
      throw new Error("RSS feed is empty or missing items.")
    }
    return feed
  } catch (error: any) {
    throw new Error(`Failed to parse RSS feed at ${url}: ${error.message}`)
  }
}

export async function parsePodcastRssFeed(
  feedUrl: string
): Promise<ParsedEpisode[]> {
  const parser = new Parser()
  try {
    const feed = await parser.parseURL(feedUrl)
    if (!feed.items || feed.items.length === 0) {
      throw new Error("No episodes found in RSS feed.")
    }
    return feed.items.map((item, idx) => {
      const enclosureUrl =
        item.enclosure?.url ||
        (typeof item.enclosure === "string" ? item.enclosure : "") ||
        ""
      if (!item.title || !enclosureUrl || !item.pubDate) {
        throw new Error(`Missing required fields in episode at index ${idx}`)
      }
      return {
        id:
          item.guid ||
          (typeof enclosureUrl === "string" ? enclosureUrl : "") ||
          item.link ||
          `${feedUrl}#${idx}`,
        title: item.title,
        audioUrl: enclosureUrl.toString(),
        publishedAt: item.pubDate,
        description: item.contentSnippet || item.content || item.summary || ""
      }
    })
  } catch (error: any) {
    throw new Error(`Failed to parse RSS feed: ${error.message}`)
  }
}
