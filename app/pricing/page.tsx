/**
 * @description
 * This server page displays pricing plans for the Neurogenesis app, integrating Stripe payment links for subscriptions.
 * It provides options for Free, Pro, and Institutional tiers, with authentication-aware rendering.
 *
 * Key features:
 * - Pricing Cards: Displays three plans with features and checkout buttons
 * - Authentication: Adjusts UI based on user login status via Clerk
 * - Stripe Integration: Links to Stripe checkout with user ID as client reference
 * - Styling: Uses Neurogenesis design system (black bg, gold primary, white text)
 *
 * @dependencies
 * - @clerk/nextjs/server: Provides auth() for user authentication
 * - '@/components/ui/button': Shadcn Button for checkout links
 * - '@/components/ui/card': Shadcn Card for plan display
 * - '@/lib/utils': cn utility for conditional Tailwind classes
 *
 * @notes
 * - Uses server component for secure data fetching per project rules
 * - Requires Stripe checkout URLs in .env.local (NEXT_PUBLIC_STRIPE_*)
 * - Edge case: Disables buttons if links are missing (shows as #)
 * - Limitation: Static feature lists; dynamic features per tier to be added later
 */

"use server"

import { auth } from "@clerk/nextjs/server"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

/**
 * Interface for pricing card properties.
 *
 * @property {string} title - Plan title (e.g., "Pro")
 * @property {string} price - Monthly price (e.g., "$20")
 * @property {string} description - Brief plan description
 * @property {string} buttonText - Text for the checkout button
 * @property {string} buttonLink - Stripe checkout URL
 * @property {string[]} features - List of plan features
 * @property {string | null} userId - Clerk user ID for payment linking
 * @property {boolean} popular - Highlights plan as popular
 */
interface PricingCardProps {
  title: string
  price: string
  description: string
  buttonText: string
  buttonLink: string
  features: string[]
  userId: string | null
  popular: boolean
}

/**
 * Renders a pricing card with plan details and checkout button.
 *
 * @param {PricingCardProps} props - Properties for the pricing card
 * @returns {JSX.Element} The rendered pricing card
 */
function PricingCard({
  title,
  price,
  description,
  buttonText,
  buttonLink,
  features,
  userId,
  popular
}: PricingCardProps) {
  // Append userId as client_reference_id if authenticated
  const finalButtonLink = userId
    ? `${buttonLink}?client_reference_id=${userId}`
    : buttonLink

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col",
        popular && "border-primary shadow-lg"
      )}
    >
      {popular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="mb-6 flex items-baseline justify-center gap-x-2">
          <span className="text-5xl font-bold">{price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-x-2">
              <Check className="text-primary size-4" />
              <span className="text-muted-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={cn(
            "w-full",
            popular && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          asChild
        >
          <a
            href={finalButtonLink}
            className={cn(
              "inline-flex items-center justify-center",
              finalButtonLink === "#" && "pointer-events-none opacity-50"
            )}
          >
            {buttonText}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

/**
 * Renders the pricing page with subscription options.
 *
 * @returns {Promise<JSX.Element>} The rendered pricing page
 */
export default async function PricingPage() {
  const { userId } = await auth()

  // Define feature lists for each plan
  const freeFeatures = [
    "Basic debate sourcing",
    "Transcript generation",
    "Limited analysis features"
  ]
  const proFeatures = [
    "All Free features",
    "Advanced analysis tools",
    "Priority support",
    "API access"
  ]
  const institutionalFeatures = [
    "All Pro features",
    "Institutional dashboards",
    "Team collaboration",
    "Custom integrations"
  ]

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">Pricing Plans</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your needs. Upgrade anytime to unlock more
          features.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
        <PricingCard
          title="Free"
          price="$0"
          description="For individual enthusiasts"
          buttonText={userId ? "Current Plan" : "Sign Up"}
          buttonLink={userId ? "#" : "/signup"}
          features={freeFeatures}
          userId={userId}
          popular={false}
        />
        <PricingCard
          title="Pro"
          price="$20"
          description="For advanced users and professionals"
          buttonText="Subscribe"
          buttonLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_PRO || "#"}
          features={proFeatures}
          userId={userId}
          popular={true}
        />
        <PricingCard
          title="Institutional"
          price="$100"
          description="For teams and organizations"
          buttonText="Subscribe"
          buttonLink={
            process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_INSTITUTIONAL || "#"
          }
          features={institutionalFeatures}
          userId={userId}
          popular={false}
        />
      </div>

      <p className="text-muted-foreground mt-8 text-center text-sm">
        All prices in USD. Need a custom solution?{" "}
        <a href="/contact" className="font-medium underline underline-offset-4">
          Contact us
        </a>
      </p>
    </div>
  )
}
