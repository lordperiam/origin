"use client"

import { useState, useTransition, useEffect } from "react"
import { updateAnalysisSettingsAction } from "@/actions/db/profiles-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/lib/hooks/use-toast"

/**
 * Props interface for AnalysisSettings component.
 */
interface AnalysisSettingsProps {
  userId: string
  initialSettings?: {
    detectRhetoricalDevices: boolean
    detectFallacies: boolean
    enableFactChecking: boolean
  }
}

/**
 * AnalysisSettings component allows users to configure analysis preferences.
 * Users can toggle rhetorical device detection, logical fallacy detection,
 * and fact-checking features.
 */
export default function AnalysisSettings({
  userId,
  initialSettings = {
    detectRhetoricalDevices: true,
    detectFallacies: true,
    enableFactChecking: false
  }
}: AnalysisSettingsProps) {
  // State for tracking settings and UI state
  const [settings, setSettings] = useState(initialSettings)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  // Update settings if initialSettings changes
  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings)
    }
  }, [initialSettings])

  /**
   * Saves the current analysis settings to the database.
   */
  const handleUpdateSettings = () => {
    startTransition(async () => {
      try {
        const result = await updateAnalysisSettingsAction(userId, settings)
        
        if (!result.isSuccess) {
          toast({
            title: "Error",
            description: result.message || "Failed to update settings",
            variant: "destructive"
          })
        } else {
          toast({
            title: "Settings Updated",
            description: "Your analysis settings have been saved successfully."
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
   * Updates a specific setting when the user toggles a switch.
   */
  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rhetorical Device Detection Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
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

        {/* Logical Fallacy Detection Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
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

        {/* Fact Checking Setting */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Fact Checking</h3>
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

        {/* Save Button */}
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