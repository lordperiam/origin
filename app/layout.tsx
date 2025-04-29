/**
 * @description
 * The root server layout for the Neurogenesis app.
 * Wraps all pages with Clerk authentication, theme providers, and global UI components.
 *
 * Key features:
 * - Authentication: Integrates ClerkProvider for user auth
 * - Theme Management: Uses Next Themes with a dark default theme
 * - Profile Sync: Creates a user profile on first login if it doesn't exist
 *
 * @dependencies
 * - ClerkProvider: Provides Clerk authentication context
 * - Providers: Custom theme provider wrapper
 * - Inter: Google font for typography
 *
 * @notes
 * - Suppresses hydration warnings due to server/client rendering differences
 * - Handles auth errors gracefully by continuing without user ID
 */

"use server"

import {
  createProfileAction,
  getProfileByUserIdAction
} from "@/actions/db/profiles-actions"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/utilities/providers"
import { TailwindIndicator } from "@/components/utilities/tailwind-indicator"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Initialize Inter font with Latin subset
const inter = Inter({ subsets: ["latin"] })

// Define metadata for the application
export const metadata: Metadata = {
  title: "Neurogenesis",
  description: "Analyze debates and arguments with AI."
}

/**
 * Root layout component that wraps all pages
 * @param children - React nodes representing page content
 * @returns JSX element with authentication and theme providers
 */
export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Initialize userId variable
  let userId: string | undefined

  // Attempt to get user ID and sync profile
  try {
    // Dynamically import auth to avoid middleware issues
    const { auth } = await import("@clerk/nextjs/server")
    const authResult = await auth()
    userId = authResult.userId || undefined

    // If user is authenticated, ensure profile exists
    if (userId) {
      const profileRes = await getProfileByUserIdAction(userId)
      if (!profileRes.isSuccess) {
        await createProfileAction({ userId })
      }
    }
  } catch (error) {
    console.error("Auth error:", error)
    // Proceed without user ID if auth fails
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <Providers
            attribute="class"
            defaultTheme="dark" // Set to dark to match Neurogenesis design
            enableSystem={false} // Disable system theme detection
            disableTransitionOnChange // Prevent transition flicker
          >
            {children}

            <TailwindIndicator />

            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
