"use client"

/**
 * @description
 * This client component provides an interactive tutorial for new users in the Neurogenesis app.
 * It guides users through a step-by-step onboarding process, introducing key features and actions.
 *
 * Key features:
 * - Step Navigation: Multi-step flow with Previous/Next buttons
 * - Personalization: Displays user ID and adjusts based on membership
 * - Responsive UI: Uses Shadcn Card and Button components with Tailwind
 * - Interactivity: Manages state with React hooks and transitions
 *
 * @dependencies
 * - react: useState, useTransition for state management
 * - "@/components/ui/card": Shadcn Card components for layout
 * - "@/components/ui/button": Shadcn Button for navigation
 * - next/link: Link component for client-side navigation
 *
 * @notes
 * - Client component to support interactivity per project rules
 * - Three steps for simplicity; can expand with more content later
 * - Edge case: Disables Previous on first step, changes Next to Finish on last
 * - Limitation: Static content; no progress saving or analytics integration yet
 */

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * Props interface for the Tutorial component.
 *
 * @property {string} userId - Clerk user ID for personalization
 * @property {string} membership - User’s membership level (e.g., "free", "pro")
 */
interface TutorialProps {
  userId: string
  membership: string
}

/**
 * Tutorial component that renders the onboarding steps.
 *
 * @param {TutorialProps} props - Component props with user ID and membership
 * @returns {JSX.Element} The rendered tutorial card
 */
export default function Tutorial({ userId, membership }: TutorialProps) {
  const [step, setStep] = useState(0) // Current step index (0-based)
  const [isPending, startTransition] = useTransition() // Manage navigation transitions

  // Define onboarding steps with titles and content
  const steps = [
    {
      title: "Welcome Aboard!",
      content: (
        <div>
          <p className="text-muted-foreground mb-4">
            Hello, user {userId}! You’re now part of Neurogenesis, a platform to
            analyze debates and arguments with AI.
          </p>
          <p className="text-muted-foreground">
            Let’s walk you through the basics to get you started.
          </p>
        </div>
      )
    },
    {
      title: "Explore Core Features",
      content: (
        <div>
          <p className="text-muted-foreground mb-4">
            With your {membership} account, you can:
          </p>
          <ul className="text-muted-foreground list-disc space-y-2 pl-5">
            <li>Analyze debates from platforms like YouTube and Twitch</li>
            <li>Identify rhetorical devices and logical fallacies</li>
            <li>Visualize argument evolution with neural maps</li>
          </ul>
        </div>
      )
    },
    {
      title: "Get Started",
      content: (
        <div>
          <p className="text-muted-foreground mb-4">
            Ready to dive in? Start by exploring some debates or tweaking your
            analysis settings.
          </p>
          <Link href="/debates">
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary/10"
            >
              View Debates
            </Button>
          </Link>
        </div>
      )
    }
  ]

  // Handle navigation to the next step
  const handleNext = () => {
    startTransition(() => {
      if (step < steps.length - 1) {
        setStep(prev => prev + 1)
      }
    })
  }

  // Handle navigation to the previous step
  const handlePrevious = () => {
    startTransition(() => {
      if (step > 0) {
        setStep(prev => prev - 1)
      }
    })
  }

  return (
    <Card className="bg-card text-foreground border-border mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-white">{steps[step].title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Step Content */}
        <div className="mb-6">{steps[step].content}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 0 || isPending}
            className="text-primary border-primary hover:bg-primary/10"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {step === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="text-muted-foreground mt-4 text-center">
          Step {step + 1} of {steps.length}
        </div>
      </CardContent>
    </Card>
  )
}
