// Background job for continuous debate scraping using node-cron
// Ensure node-cron is installed
// Run: `npm install node-cron` and `npm install --save-dev @types/node-cron`
import cron from "node-cron"

// Ensure types are installed
// Run: `npm install node-cron` and `npm install --save-dev @types/node-cron` if not already installed
import { fetchDebatesFromPlatformAction } from "@/actions/db/debates-actions"

// Example: scrape every hour
cron.schedule("0 * * * *", async () => {
  // Add platforms and API keys as needed
  const platforms = ["YouTube", "Reddit"]
  for (const platform of platforms) {
    const apiKey = process.env[`${platform.toUpperCase()}_API_KEY`] || ""
    if (!apiKey) continue
    await fetchDebatesFromPlatformAction(platform as any, apiKey)
  }
  // Add logging or notification as needed
  console.log(`[${new Date().toISOString()}] Debate scraping job completed.`)
})

// To run: `npx ts-node scripts/debate-scraper-cron.ts`
