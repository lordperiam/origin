/**
 * @description
 * This file provides a centralized initialization of the OpenAI client for use across the Neurogenesis application.
 * It ensures that the OpenAI API key is properly loaded from environment variables and handles configuration errors.
 *
 * Key features:
 * - Initializes the OpenAI client with the API key from environment variables
 * - Exports the client for use in server actions and other modules
 * - Throws an error if the API key is not set, preventing application startup with invalid configuration
 *
 * @dependencies
 * - openai: The OpenAI library for interacting with the API
 *
 * @notes
 * - Requires OPENAI_API_KEY to be set in .env.local
 * - The error thrown for a missing API key will be visible in server logs during application startup
 * - Future expansions can include additional AI service clients or utility functions
 * - Edge case: If the API key is invalid, OpenAI API calls will fail later; this check only ensures presence
 * - Limitation: Currently supports only OpenAI; other services (e.g., custom models) can be added later
 */

import OpenAI from "openai"

// Ensure the API key is set before initializing the client
if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not set in environment variables. Please set it in .env.local."
  )
}

// Initialize the OpenAI client with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export { openai }
