/**
 * @description
 * This client page provides the signup interface for the Neurogenesis app using Clerk authentication.
 * It enhances the starter template’s signup page with custom branding and styling aligned with the Neurogenesis design system.
 *
 * Key features:
 * - Branding: Displays the Neurogenesis logo and signup prompt
 * - Styling: Applies black background, gold primary color, and white text
 * - Theme Sync: Uses Clerk’s dark theme when the app is in dark mode
 * - Responsiveness: Ensures a centered, mobile-friendly layout
 *
 * @dependencies
 * - @clerk/nextjs: Provides SignUp component and dark theme
 * - next-themes: Provides useTheme hook for theme detection
 * - lucide-react: Provides Receipt icon for logo
 * - next/link: Provides Link component for navigation
 *
 * @notes
 * - Must be a client component due to Clerk’s requirements
 * - Suppresses hydration warnings inherited from root layout
 * - Assumes Clerk middleware is configured in middleware.ts
 */

"use client"

import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { Receipt } from "lucide-react"
import Link from "next/link"

/**
 * Signup page component that renders the enhanced sign-up interface.
 *
 * @returns JSX element with custom branding and Clerk’s SignUp component
 */
export default function SignUpPage() {
  const { theme } = useTheme()

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
      {/* Branding Section */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <Receipt className="text-primary size-8" />
          <span className="text-foreground text-2xl font-bold">
            Neurogenesis
          </span>
        </Link>
        <p className="text-muted-foreground mt-2">
          Create an account to start analyzing debates with AI
        </p>
      </div>

      {/* Clerk SignUp Component */}
      <div className="border-border bg-card w-full max-w-md rounded-lg border p-6 shadow-lg">
        <SignUp
          forceRedirectUrl="/" // Redirect to home after successful signup
          appearance={{
            baseTheme: theme === "dark" ? dark : undefined,
            elements: {
              formButtonPrimary:
                "bg-primary text-primary-foreground hover:bg-primary/90",
              card: "bg-transparent shadow-none",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              formFieldLabel: "text-foreground",
              formFieldInput: "bg-input text-foreground border-border",
              footerActionLink: "text-primary hover:text-primary/90"
            }
          }}
        />
      </div>
    </div>
  )
}
