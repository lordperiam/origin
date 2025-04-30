/**
 * @description
 * This client component renders the analysis settings UI for the Neurogenesis app.
 * It allows users to configure their analysis preferences, such as enabling rhetorical device detection,
 * logical fallacy detection, and fact-checking.
 */

"use client"

import { useState, useTransition, useEffect } from "react"
import { updateAnalysisSettingsAction } from "@/actions/db/profiles-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/lib/hooks/use-toast"

interface AnalysisSettingsProps {
  userId: string
  initialSettings?: {
    detectRhetoricalDevices: boolean
    detectFallacies: boolean
    enableFactChecking: boolean
  }
}

export default function AnalysisSettings({
  userId,
  initialSettings = {
    detectRhetoricalDevices: true,
    detectFallacies: true,
    enableFactChecking: false
  }
}: AnalysisSettingsProps) {
  const [settings, setSettings] = useState(initialSettings)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Update settings if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  const handleUpdateSettings = async () => {
    console.log(`Updating analysis settings for user: ${userId}`, settings)
    startTransition(async () => {
      try {
        const result = await updateAnalysisSettingsAction(userId, settings)
        if (!result.isSuccess) {
          console.error("Failed to update settings:", result.message)
          toast({
            title: "Error",
            description: result.message || "Failed to update settings",
            variant: "destructive"
          })
        } else {
          console.log("Settings updated successfully:", settings)
          toast({
            title: "Settings Updated",
            description: "Your analysis settings have been saved successfully."
          })
        }
      } catch (error) {
        console.error("Error updating settings:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred while saving settings",
          variant: "destructive"
        })
      }
    })
  }

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle>Analysis Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">
              Rhetorical Device Detection
            </h3>
            <p className="text-muted-foreground">
              Detect and highlight rhetorical devices in debates
            </p>
          </div>
          <Switch
            checked={settings.detectRhetoricalDevices}
            onCheckedChange={checked =>
              handleToggle("detectRhetoricalDevices", checked)
            }
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">
              Logical Fallacy Detection
            </h3>
            <p className="text-muted-foreground">
              Identify logical fallacies in arguments
            </p>
          </div>
          <Switch
            checked={settings.detectFallacies}
            onCheckedChange={checked =>
              handleToggle("detectFallacies", checked)
            }
            disabled={isPending}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-white">Fact Checking</h3>
            <p className="text-muted-foreground">
              Enable automated fact checking for debates
            </p>
          </div>
          <Switch
            checked={settings.enableFactChecking}
            onCheckedChange={checked =>
              handleToggle("enableFactChecking", checked)
            }
            disabled={isPending}
          />
        </div>

        <Button
          onClick={handleUpdateSettings}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  )
}
