/*
The root server layout for the app.
*/

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

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Receipt AI",
  description: "A full-stack web app template."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // Try to get user ID but don't throw an error if it fails
  let userId
  try {
    // Import auth dynamically to prevent issues with middleware detection
    const { auth } = await import("@clerk/nextjs/server")
    const authResult = await auth()
    userId = authResult.userId

    if (userId) {
      const profileRes = await getProfileByUserIdAction(userId)
      if (!profileRes.isSuccess) {
        await createProfileAction({ userId })
      }
    }
  } catch (error) {
    console.error("Auth error:", error)
    // Continue without user ID
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
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
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
