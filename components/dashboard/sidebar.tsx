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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  BarChart2,
  Settings as SettingsIcon
} from "lucide-react"

/**
 * Renders the sidebar with navigation links.
 *
 * @returns {JSX.Element} The sidebar navigation component
 */
export default async function Sidebar() {
  // Define navigation items for the dashboard
  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/analyses", label: "Analyses", icon: BarChart2 },
    { href: "/dashboard/settings", label: "Settings", icon: SettingsIcon }
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-2", // Add gap for icon spacing
                          "text-sidebar-foreground hover:text-sidebar-primary",
                          "hover:bg-sidebar-accent"
                        )}
                        aria-label={item.label}
                        tabIndex={0}
                      >
                        <item.icon className="size-5" aria-hidden="true" />
                        {item.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{item.label}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
