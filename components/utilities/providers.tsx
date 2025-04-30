/**
 * @description
 * This client component provides the necessary providers for the Neurogenesis app.
 * It wraps the application with theme management, tooltip functionality, and analytics tracking.
 *
 * Key features:
 * - Theme Management: Integrates Next Themes for dark/light mode support
 * - Tooltip Provider: Enables Shadcn tooltips across the app
 * - Analytics: Adds PostHog for user behavior tracking
 *
 * @dependencies
 * - next-themes: Provides ThemeProvider for theme management via NextThemesProvider
 * - @/components/ui/tooltip: Shadcn TooltipProvider for tooltip functionality
 * - @/lib/posthog: PostHogProvider for analytics integration
 *
 * @notes
 * - Marked as "use client" to handle client-side providers as per project rules
 * - PostHogProvider ensures analytics tracking is available app-wide
 * - Nested providers maintain proper order: theme -> tooltip -> analytics
 * - Edge case: If PostHog initialization fails (e.g., no key), it won’t block rendering
 * - Limitation: Theme props are passed through; no additional analytics config here
 */

"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps
} from "next-themes"
import { PostHogProvider } from "@/lib/posthog"

/**
 * Props interface for the Providers component.
 * Extends ThemeProviderProps to include children and other theme-related props.
 *
 * @interface ProvidersProps
 * @extends {ThemeProviderProps}
 */
export interface ProvidersProps extends ThemeProviderProps {}

/**
 * Providers component that wraps the app with necessary providers.
 *
 * @param {ProvidersProps} props - Props including children and theme settings
 * @returns {JSX.Element} The nested provider structure wrapping the children
 */
export const Providers = ({ children, ...props }: ProvidersProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <PostHogProvider>{children}</PostHogProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
