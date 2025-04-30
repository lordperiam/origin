"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { updatePrivacySettingsAction, deleteProfileAction } from "@/actions/db/profiles-actions"
import { useToast } from "@/lib/hooks/use-toast"

/**
 * Props interface for PrivacySettings component.
 */
interface PrivacySettingsProps {
  userId: string
  initialSettings?: {
    profileVisibility: boolean
    anonymizeContributions: boolean
  }
}

/**
 * PrivacySettings component allows users to configure privacy preferences
 * and provides an option to delete their profile.
 */
export default function PrivacySettings({
  userId,
  initialSettings = {
    profileVisibility: true,
    anonymizeContributions: false
  }
}: PrivacySettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  /**
   * Updates a specific setting when the user toggles a switch.
   */
  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  /**
   * Saves the current privacy settings to the database.
   */
  const handleUpdateSettings = () => {
    startTransition(async () => {
      try {
        const result = await updatePrivacySettingsAction(userId, settings)
        
        if (!result.isSuccess) {
          toast({
            title: "Error",
            description: result.message || "Failed to update settings",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Settings Updated",
            description: "Your privacy settings have been saved successfully."
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred while saving settings",
          variant: "destructive"
        })
      }
    })
  }

  /**
   * Deletes the user's profile after confirmation.
   */
  const handleDeleteProfile = () => {
    startTransition(async () => {
      try {
        const result = await deleteProfileAction(userId)
        
        if (!result.isSuccess) {
          toast({
            title: "Error",
            description: result.message || "Failed to delete profile",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Profile Deleted",
            description: "Your profile has been deleted successfully."
          })
          // Redirect to home page or logout
          window.location.href = "/"
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive"
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Visibility Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Profile Visibility</h3>
            <p className="text-muted-foreground">
              Make your profile visible to other users
            </p>
          </div>
          <Switch
            checked={settings.profileVisibility}
            onCheckedChange={checked =>
              handleToggle("profileVisibility", checked)
            }
            disabled={isPending}
          />
        </div>

        {/* Anonymize Contributions Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Anonymize Contributions</h3>
            <p className="text-muted-foreground">
              Hide your name from contributions in public debates
            </p>
          </div>
          <Switch
            checked={settings.anonymizeContributions}
            onCheckedChange={checked =>
              handleToggle("anonymizeContributions", checked)
            }
            disabled={isPending}
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleUpdateSettings}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </Button>

        {/* Delete Profile Section */}
        <div className="pt-6 border-t mt-6">
          <h3 className="text-lg font-medium text-destructive mb-2">
            Danger Zone
          </h3>
          <p className="text-muted-foreground mb-4">
            Permanently delete your profile and all associated data. This action cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete Profile
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  profile and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteProfile}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Profile
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}