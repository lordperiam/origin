"use client"

/**
 * @description
 * This client component renders the privacy settings UI for the Neurogenesis app.
 * It allows users to toggle profile visibility, anonymize contributions (if verified), and delete their profile.
 *
 * Key features:
 * - Profile Visibility Toggle: Switch to make profile public/private
 * - Anonymization Toggle: Switch for verified users to anonymize contributions
 * - Delete Profile Button: Button with confirmation dialog
 * - Responsive Design: Uses Shadcn UI components with Tailwind styling
 * - Error Handling: Displays toast notifications for actions
 *
 * @dependencies
 * - react: useState, useTransition for state management
 * - "@/db/schema/profiles-schema": SelectProfile type for profile data
 * - "@/actions/db/profiles-actions": updateProfileAction, deleteProfileAction for updates
 * - "@/components/ui/button": Shadcn Button component
 * - "@/components/ui/card": Shadcn Card components for layout
 * - "@/components/ui/switch": Shadcn Switch component for toggles
 * - "@/lib/hooks/use-toast": Hook for toast notifications
 *
 * @notes
 * - Client component to handle interactivity per project rules
 * - Uses useTransition for smooth async updates
 * - Disables controls during pending actions to prevent race conditions
 * - Anonymization toggle hidden for unverified users with explanatory text
 * - Delete action uses browser confirm dialog; may upgrade to modal later
 * - Edge case: Reverts state on update failure
 * - Limitation: Institutional privacy tiers not implemented yet
 */
import { useState, useTransition } from "react"
import { SelectProfile } from "@/db/schema/profiles-schema"
import {
  updateProfileAction,
  deleteProfileAction
} from "@/actions/db/profiles-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/lib/hooks/use-toast"
import { useRouter } from "next/navigation"

/**
 * Props interface for PrivacySettings component.
 *
 * @property {SelectProfile} profile - User profile data including privacy settings
 */
interface PrivacySettingsProps {
  profile: SelectProfile
}

/**
 * PrivacySettings component that renders the privacy settings UI.
 *
 * @param {PrivacySettingsProps} props - Component props with user profile data
 * @returns {JSX.Element} The rendered privacy settings card
 */
export default function PrivacySettings({ profile }: PrivacySettingsProps) {
  // Local state to track UI changes optimistically
  const [isPublic, setIsPublic] = useState(profile.isProfilePublic)
  const [isAnonymized, setIsAnonymized] = useState(
    profile.isContributionsAnonymized
  )
  const [isPending, startTransition] = useTransition() // Manage loading state for async actions
  const { toast } = useToast() // Hook for displaying notifications
  const router = useRouter()

  /**
   * Updates the profile visibility setting.
   *
   * @param {boolean} checked - New visibility state (true = public)
   */
  const handleUpdatePublic = (checked: boolean) => {
    startTransition(async () => {
      setIsPublic(checked) // Optimistic update
      const result = await updateProfileAction(profile.userId, {
        isProfilePublic: checked
      })
      if (!result.isSuccess) {
        // Revert on failure and notify user
        setIsPublic(!checked)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    })
  }

  /**
   * Updates the contribution anonymization setting for verified users.
   *
   * @param {boolean} checked - New anonymization state (true = anonymized)
   */
  const handleUpdateAnonymized = (checked: boolean) => {
    startTransition(async () => {
      setIsAnonymized(checked) // Optimistic update
      const result = await updateProfileAction(profile.userId, {
        isContributionsAnonymized: checked
      })
      if (!result.isSuccess) {
        // Revert on failure and notify user
        setIsAnonymized(!checked)
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    })
  }

  /**
   * Deletes the user profile after confirmation.
   */
  const handleDeleteProfile = () => {
    // Prompt user for confirmation
    if (
      confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      startTransition(async () => {
        const result = await deleteProfileAction(profile.userId)
        if (result.isSuccess) {
          toast({
            title: "Profile Deleted",
            description: "Your profile has been successfully deleted."
          })
          router.push("/login")
        } else {
          toast({
            title: "Error",
            description: result.message,
            variant: "destructive"
          })
        }
      })
    }
  }

  return (
    <Card className="bg-card text-foreground border-border">
      <CardHeader>
        <CardTitle className="text-white">Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility Section */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">
              Profile Visibility
            </h3>
            <p className="text-muted-foreground">
              Control whether your profile is visible to others.
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={handleUpdatePublic}
            disabled={isPending} // Disable during updates
          />
        </div>

        {/* Contributions Anonymization Section */}
        {profile.isVerified ? (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">
                Contributions Anonymization
              </h3>
              <p className="text-muted-foreground">
                Choose whether to anonymize your contributions.
              </p>
            </div>
            <Switch
              checked={isAnonymized}
              onCheckedChange={handleUpdateAnonymized}
              disabled={isPending} // Disable during updates
            />
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium text-white">
              Contributions Anonymization
            </h3>
            <p className="text-muted-foreground">
              Your contributions are anonymized by default. Verify your identity
              to change this setting.
            </p>
          </div>
        )}

        {/* Delete Profile Section */}
        <div>
          <Button
            variant="destructive"
            onClick={handleDeleteProfile}
            disabled={isPending} // Disable during deletion
          >
            Delete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
