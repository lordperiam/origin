# Testing the Debates API

This document provides instructions on how to test the `fetchDebatesFromPlatformAction` function, which fetches debates from various platforms and stores them in the database.

## Prerequisites

Before testing, make sure you have the following:

1. A `.env.local` file with the API keys for the platforms you want to test
2. Access to the database where debates will be stored

## Setting Up Environment Variables

Add the following environment variables to your `.env.local` file:

```
# API Keys for platforms
YOUTUBE_API_KEY="your_youtube_api_key"
TWITCH_API_KEY="your_twitch_api_key"
X_API_KEY="your_twitter_api_key"
PODCASTS_API_KEY="your_listen_notes_api_key"
SUBSTACK_API_KEY="your_substack_api_key"
SPOTIFY_API_KEY="your_spotify_api_key"
TIKTOK_API_KEY="your_tiktok_api_key"
REDDIT_API_KEY="your_reddit_api_key"
TELEGRAM_API_KEY="your_telegram_bot_token"
DISCORD_API_KEY="your_discord_bot_token"
```

Replace `"your_*_api_key"` with your actual API keys.

## Testing Methods

### Using the Script

We've created a script that tests the `fetchDebatesFromPlatformAction` with YouTube. To run it:

1. Install the required dependencies:
   ```
   npm install tsx dotenv
   ```

2. Run the script:
   ```
   npx tsx scripts/test-debates-api.ts
   ```

The script will:
- Load environment variables from `.env.local`
- Call `fetchDebatesFromPlatformAction` with the YouTube platform and API key
- Log the result to the console

### Using the API Route

We've also created an API route that can be used to test the action from a browser or API client:

1. Start the development server:
   ```
   npm run dev
   ```

2. Access the API route in your browser or API client:
   ```
   GET http://localhost:3000/api/test-debates?platform=YouTube
   ```

You can also specify a different platform:
   ```
   GET http://localhost:3000/api/test-debates?platform=Twitch
   ```

Or provide an API key directly:
   ```
   GET http://localhost:3000/api/test-debates?platform=YouTube&apiKey=your_api_key
   ```

### Manual Testing in Code

You can also test the action directly in your code:

```typescript
import { fetchDebatesFromPlatformAction } from "@/actions/db/debates-actions";

async function testAction() {
  const result = await fetchDebatesFromPlatformAction("YouTube", process.env.YOUTUBE_API_KEY!);
  console.log(result);
}

testAction();
```

## Expected Results

A successful response will look like:

```json
{
  "isSuccess": true,
  "message": "Debates fetched and stored successfully",
  "data": [
    {
      "id": "uuid-value",
      "sourcePlatform": "YouTube",
      "sourceId": "video-id",
      "title": "Debate Title",
      "participants": [],
      "date": "2023-06-15T00:00:00.000Z",
      "createdAt": "2023-06-15T00:00:00.000Z",
      "updatedAt": "2023-06-15T00:00:00.000Z"
    },
    // More debate objects...
  ]
}
```

If there's an error, you'll receive:

```json
{
  "isSuccess": false,
  "message": "Error message here"
}
```

## Troubleshooting

Common issues and their solutions:

1. **API Key Not Found**: Make sure you've added the correct API key to your `.env.local` file.

2. **No Debates Found**: Try changing the search query in the platform-specific fetch implementation.

3. **Database Connection Issues**: Verify your database connection string and ensure the database is running.

4. **Rate Limiting**: Some APIs have rate limits. If you're getting errors, try reducing the frequency of requests.

5. **CORS Issues**: If testing from a frontend, you might encounter CORS issues. Use the API route instead of calling the action directly. 