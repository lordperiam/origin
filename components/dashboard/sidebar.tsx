"use server"

/**
 * @description
 * This server component renders the sidebar navigation for the Neurogenesis app's dashboard.
 * It provides links to key dashboard sections, styled according to the app's design system.
 *
 * Key features:
 * - Navigation Links: Links to "Overview," "Analyses," and "Settings" sections
 * - Responsive Design: Fixed position on large screens, width adjusts by breakpoint
 * - Consistent Styling: Uses Shadcn Button component with custom Tailwind classes
 *
 * @dependencies
 * - Button: Shadcn UI component for styled buttons
 * - Link: Next.js component for client-side navigation
 * - cn: Utility function for conditional Tailwind class names
 *
 * @notes
 * - Marked as a server component per project rules, no client-side interactivity
 * - Applies design system: `bg-sidebar-background` (dark), `text-sidebar-foreground` (white)
 * - Hover states use `sidebar-primary` (gold) for visual feedback
 * - Edge case: Navigation items are static; dynamic items could be added later
 * - Limitation: No active link highlighting (requires client-side state)
 */

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * Renders the sidebar with navigation links.
 *
 * @returns {JSX.Element} The sidebar navigation component
 */
export default async function Sidebar() {
  // Define navigation items for the dashboard
  const navItems = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/analyses", label: "Analyses" },
    { href: "/dashboard/settings", label: "Settings" }
  ]

  return (
    <aside
      className={cn(
        "bg-sidebar-background text-sidebar-foreground", // Design system colors
        "w-64 p-4", // Base width and padding
        "md:w-72 lg:w-80", // Responsive width adjustments
        "fixed left-0 top-0 h-full", // Fixed positioning
        "border-sidebar-border border-r" // Right border for separation
      )}
    >
      {/* Sidebar Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Navigation List */}
      <nav>
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start", // Full-width, left-aligned
                    "text-sidebar-foreground hover:text-sidebar-primary", // Text and hover colors
                    "hover:bg-sidebar-accent" // Subtle hover background
                  )}
                >
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
