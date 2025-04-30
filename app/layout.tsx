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

"use client"

import React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import SearchBar from "@/components/ui/search-bar"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "bg-background mx-auto min-h-screen w-full scroll-smooth antialiased",
            inter.className
          )}
        >
          <header className="bg-primary p-4 text-white">
            <div className="container mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold">Neurogenesis</h1>
              <SearchBar
                placeholder="Search videos..."
                onSearch={query => console.log("Search query:", query)}
              />
            </div>
          </header>
          <main className="container mx-auto py-8">{children}</main>
          <footer className="bg-primary p-4 text-center text-white">
            © 2025 Neurogenesis. All rights reserved.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
