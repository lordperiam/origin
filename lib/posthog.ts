"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

// Initialize PostHog only in the browser and only once
if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
    // Enable debug mode in development
    loaded: posthog => {
      if (process.env.NODE_ENV === "development") posthog.debug()
    },
    capture_pageview: false, // We'll manually capture pageviews
    autocapture: true,
    disable_session_recording: false, // Enable session recording
    persistence: "localStorage"
  })
}

export { posthog, PostHogProvider }
