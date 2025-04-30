/**
 * @description
 * This file configures and initializes the PostHog client for analytics in the Neurogenesis app.
 * It sets up PostHog for user behavior tracking and provides the PostHogProvider for React integration.
 *
 * Key features:
 * - Initializes PostHog with environment variables for key and host
 * - Configures debug mode in development, manual pageview capture, and session recording
 * - Exports the PostHog client and provider for use across the app
 *
 * @dependencies
 * - posthog-js: Core PostHog library for analytics
 * - posthog-js/react: React integration for PostHogProvider
 *
 * @notes
 * - Initialization occurs only in browser environments (typeof window !== "undefined")
 * - Uses NEXT_PUBLIC_ prefix for environment variables, adhering to Next.js exposure rules
 * - capture_pageview is disabled to allow manual control in future steps
 * - Edge case: Empty NEXT_PUBLIC_POSTHOG_KEY defaults to empty string, handled by PostHog
 * - Limitation: Assumes PostHog host defaults to app.posthog.com if not set
 */

"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

// Initialize PostHog only in the browser and only once
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Enable debug mode in development for easier troubleshooting
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug()
    },
    capture_pageview: false, // We'll manually capture pageviews in a later step
    autocapture: true, // Automatically capture clicks and form submissions
    disable_session_recording: false, // Enable session recording for detailed tracking
    persistence: "localStorage" // Use localStorage for persistence across sessions
  })
}

export { posthog, PostHogProvider }
