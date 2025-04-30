"use client"

/**
 * @description
 * This client component renders a form for identity verification in the Neurogenesis app.
 * It allows users to initiate verification and displays their current verification status.
 *
 * Key features:
 * - Form Submission: Initiates verification via server action
 * - Status Display: Shows if user is verified or pending
 * - Responsive Design: Uses Tailwind CSS with Neurogenesis styling
 * - Interactivity: Handles form state and submission feedback
 *
 * @dependencies
 * - @/actions/db/verification-actions: Server actions for verification
 * - @/components/ui/button: Shadcn Button for submission
 * - @/components/ui/form: Shadcn Form components for UI
 * - @/components/ui/input: Shadcn Input for text entry
 * - react-hook-form: Manages form state and validation
 * - zod: Validates form input schema
 *
 * @notes
 * - Client-side to support form interactivity and state management
 * - Mocked document input; real service would require file upload or more fields
 * - Edge case: Handles verification already completed scenario
 * - Limitation: No real verification service integration yet
 */

import { initiateVerificationAction } from "@/actions/db/verification-actions"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"

/**
 * Schema for verification form validation.
 * Ensures a document ID is provided (mocked for now).
 */
const verificationSchema = z.object({
  identityDocument: z.string().min(1, "Document ID is required")
})

/**
 * Props interface for the VerificationForm component.
 *
 * @property {string} userId - Clerk user ID of the user
 * @property {boolean} isVerified - Current verification status
 */
interface VerificationFormProps {
  userId: string
  isVerified: boolean
}

/**
 * VerificationForm component that renders the verification UI.
 *
 * @param {VerificationFormProps} props - Component props with userId and isVerified
 * @returns {JSX.Element} The rendered verification form
 */
export default function VerificationForm({
  userId,
  isVerified
}: VerificationFormProps) {
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null
  )

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { identityDocument: "" }
  })

  /**
   * Handles form submission by initiating verification.
   *
   * @param {z.infer<typeof verificationSchema>} values - Form values with identity document
   */
  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    const result = await initiateVerificationAction({
      userId,
      identityDocument: values.identityDocument
    })

    if (result.isSuccess) {
      setVerificationStatus(`Verification initiated. Token: ${result.data}`)
      // In a real app, redirect user to external service with token
    } else {
      setVerificationStatus(`Error: ${result.message}`)
    }
  }

  // Display if already verified
  if (isVerified) {
    return (
      <div className="bg-card text-foreground rounded-lg p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Verification Status
        </h2>
        <p className="text-white">Your identity is already verified.</p>
      </div>
    )
  }

  return (
    <div className="bg-card text-foreground rounded-lg p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold text-white">
        Verify Your Identity
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identityDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">
                  Identity Document ID
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter document ID (mock)"
                    className="bg-input text-foreground border-border"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
          >
            Initiate Verification
          </Button>
        </form>
      </Form>

      {verificationStatus && (
        <p className="mt-4 text-white">{verificationStatus}</p>
      )}
    </div>
  )
}
