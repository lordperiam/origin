"use server"

/**
 * @description
 * This server component provides the layout for the dashboard section of the Neurogenesis app.
 * It establishes a consistent structure with a sidebar for navigation and a main content area
 * for rendering dashboard pages.
 *
 * Key features:
 * - Sidebar Navigation: Integrates the Sidebar component for consistent navigation
 * - Main Content Area: Flexibly renders child components with responsive padding
 * - Responsive Design: Uses Tailwind CSS grid for adaptability across screen sizes
 *
 * @dependencies
 * - Sidebar: Custom component for dashboard navigation
 * - cn: Utility function for conditional Tailwind class names
 *
 * @notes
 * - Marked as a server component per project rules, avoiding client-side logic
 * - Applies Neurogenesis design system: black background via `bg-background`
 * - No async operations are needed, so Suspense is not required
 * - Edge case: Small screens collapse content below sidebar implicitly via flex
 */

import Sidebar from "@/components/dashboard/sidebar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * Renders the dashboard layout with sidebar and main content.
 *
 * @param {DashboardLayoutProps} props - Props containing the child components to render
 * @returns {JSX.Element} The dashboard layout structure
 */
export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 p-4 md:p-6 lg:p-8", // Responsive padding
          "overflow-auto" // Ensures content scrolls if it exceeds viewport
        )}
      >
        {children}
      </main>
    </div>
  )
}
