/**
 * @description
 * This client component provides the user interface for the virtual debate simulation in the Neurogenesis app.
 * It allows users to select debate parameters and run AI-powered debate simulations between historical and contemporary figures.
 *
 * Key features:
 * - Parameter Selection: UI elements for choosing debate participants, topics, format, and length
 * - Simulation Display: Area to show simulation results with options to view detailed analysis
 * - Responsive Design: Uses Tailwind CSS for styling and responsiveness
 * - Interactivity: Manages state with React hooks for user selections
 *
 * @dependencies
 * - react: For building the user interface and managing state
 * - "@/components/ui/card": Shadcn Card components for layout
 * - "@/components/ui/button": Shadcn Button for interactions
 * - "@/components/ui/select": Shadcn Select components for dropdowns
 * - "@/actions/ai/simulation-actions": Server actions for simulating debates
 *
 * @notes
 * - Client component to handle interactivity per project rules
 * - Connects to backend simulation actions for realistic AI-generated debates
 * - Provides options for debate formats, length, and participant combinations
 * - Links simulations to analysis views for deeper understanding
 */

"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Trash2, Plus, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  getAvailableParticipantsAction,
  getSuggestedTopicsAction,
  simulateDebateAction
} from "@/actions/ai/simulation-actions"
import {
  SimulatedParticipant,
  SimulationOptions,
  DebateFormat,
  DebateLength
} from "@/types/simulation-types"

/**
 * Simulation component that renders the simulation UI.
 *
 * @returns {JSX.Element} The rendered simulation interface
 */
export default function Simulation() {
  const router = useRouter()

  // Simulation parameters state
  const [selectedParticipants, setSelectedParticipants] = useState<
    SimulatedParticipant[]
  >([])
  const [availableParticipants, setAvailableParticipants] = useState<
    SimulatedParticipant[]
  >([])
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([])
  const [topic, setTopic] = useState<string>("")
  const [format, setFormat] = useState<DebateFormat>("dialogue")
  const [includeModerator, setIncludeModerator] = useState<boolean>(true)
  const [debateLength, setDebateLength] = useState<DebateLength>("medium")
  const [additionalContext, setAdditionalContext] = useState<string>("")
  const [customParticipant, setCustomParticipant] = useState<{
    name: string
    description: string
  }>({
    name: "",
    description: ""
  })

  // UI state
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState<string>("parameters")
  const [simulationResult, setSimulationResult] = useState<{
    debateId?: string
    transcriptId?: string
    message?: string
  } | null>(null)

  // Load available participants and suggested topics on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load participants
        const participantsResult = await getAvailableParticipantsAction()
        if (participantsResult.isSuccess && participantsResult.data) {
          setAvailableParticipants(participantsResult.data)
        }

        // Load suggested topics
        const topicsResult = await getSuggestedTopicsAction()
        if (topicsResult.isSuccess && topicsResult.data) {
          setSuggestedTopics(topicsResult.data)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        setError(
          "Failed to load participants and topics. Please refresh the page."
        )
      }
    }

    loadInitialData()
  }, [])

  /**
   * Adds a participant to the selected participants list
   *
   * @param participantName - The name of the participant to add
   */
  const addParticipant = (participantName: string) => {
    // Find the participant in the available participants
    const participant = availableParticipants.find(
      p => p.name === participantName
    )

    if (participant) {
      setSelectedParticipants(prev => {
        // Check if participant is already selected
        if (prev.some(p => p.name === participant.name)) {
          return prev
        }
        return [...prev, participant]
      })
    }
  }

  /**
   * Adds a custom participant to the selected participants list
   */
  const addCustomParticipant = () => {
    if (customParticipant.name.trim() === "") {
      setError("Please provide a name for the custom participant")
      return
    }

    const newParticipant: SimulatedParticipant = {
      name: customParticipant.name,
      description: customParticipant.description || "Custom participant"
    }

    setSelectedParticipants(prev => [...prev, newParticipant])

    // Reset custom participant fields
    setCustomParticipant({
      name: "",
      description: ""
    })
  }

  /**
   * Removes a participant from the selected participants list
   *
   * @param participantName - The name of the participant to remove
   */
  const removeParticipant = (participantName: string) => {
    setSelectedParticipants(prev =>
      prev.filter(p => p.name !== participantName)
    )
  }

  /**
   * Sets the debate topic, either from a suggestion or custom input
   *
   * @param newTopic - The topic to set
   */
  const setDebateTopic = (newTopic: string) => {
    setTopic(newTopic)
  }

  /**
   * Clears all selections and resets the form
   */
  const resetForm = () => {
    setSelectedParticipants([])
    setTopic("")
    setFormat("dialogue")
    setIncludeModerator(true)
    setDebateLength("medium")
    setAdditionalContext("")
    setError(null)
    setSimulationResult(null)
    setCurrentTab("parameters")
  }

  /**
   * Validates simulation parameters before running
   *
   * @returns Whether the parameters are valid
   */
  const validateParameters = (): boolean => {
    if (selectedParticipants.length < 2) {
      setError("Please select at least two participants for the debate")
      return false
    }

    if (!topic.trim()) {
      setError("Please enter a debate topic")
      return false
    }

    setError(null)
    return true
  }

  /**
   * Runs the debate simulation with the selected parameters
   */
  const runSimulation = async () => {
    if (!validateParameters()) {
      return
    }

    setIsRunning(true)
    setError(null)

    try {
      // Prepare simulation options
      const options: SimulationOptions = {
        participants: selectedParticipants,
        topic: topic,
        format: format,
        moderator: includeModerator,
        debateLength: debateLength,
        additionalContext: additionalContext || undefined
      }

      // Call the simulation action
      const result = await simulateDebateAction(
        options.participants.map(p => p.name),
        options.topic
      )

      if (result.isSuccess && result.data) {
        setSimulationResult({
          debateId: result.data.debateId, // Use 'debateId' as the correct property
          transcriptId: result.data.transcript, // Use 'transcript' as the correct property
          message: result.message || "Debate simulated successfully"
        })
        // Switch to the results tab
        setCurrentTab("results")
      } else {
        setError(result.message || "Failed to simulate debate")
      }
    } catch (error: any) {
      console.error("Error running simulation:", error)
      setError(error.message || "An unexpected error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  /**
   * Navigates to the debate details page for the simulated debate
   */
  const viewDebateDetails = () => {
    if (simulationResult?.debateId) {
      router.push(`/debates/${simulationResult.debateId}`)
    }
  }

  return (
    <Card className="bg-card text-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Debate Simulation</CardTitle>
        <CardDescription>
          Simulate a debate between historical and contemporary thinkers on a
          topic of your choice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="results" disabled={!simulationResult}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="parameters">
            <div className="space-y-6">
              {/* Error display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Participants Selection Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Select Participants</h3>

                {/* Selected participants */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedParticipants.length === 0 ? (
                    <p className="text-muted-foreground italic">
                      No participants selected
                    </p>
                  ) : (
                    selectedParticipants.map(participant => (
                      <Badge
                        key={participant.name}
                        variant="outline"
                        className="flex items-center gap-1 py-1 pl-2"
                      >
                        <span className="font-medium">{participant.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive ml-1 size-5"
                          onClick={() => removeParticipant(participant.name)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </Badge>
                    ))
                  )}
                </div>

                {/* Add predefined participant */}
                <div className="flex gap-2">
                  <Select onValueChange={addParticipant}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Add a participant" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableParticipants.map(participant => (
                        <SelectItem
                          key={participant.name}
                          value={participant.name}
                          disabled={selectedParticipants.some(
                            p => p.name === participant.name
                          )}
                        >
                          {participant.name} - {participant.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom participant */}
                <div className="border-input space-y-2 rounded-md border p-3">
                  <h4 className="text-sm font-medium">
                    Add Custom Participant
                  </h4>
                  <div className="grid gap-2">
                    <Label htmlFor="custom-name">Name</Label>
                    <Input
                      id="custom-name"
                      placeholder="e.g. Albert Einstein"
                      value={customParticipant.name}
                      onChange={e =>
                        setCustomParticipant(prev => ({
                          ...prev,
                          name: e.target.value
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="custom-description">
                      Description (optional)
                    </Label>
                    <Input
                      id="custom-description"
                      placeholder="e.g. Physicist known for theory of relativity"
                      value={customParticipant.description}
                      onChange={e =>
                        setCustomParticipant(prev => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addCustomParticipant}
                  >
                    <Plus className="mr-1 size-4" /> Add
                  </Button>
                </div>
              </div>

              {/* Topic Selection Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Debate Topic</h3>

                {/* Topic input */}
                <div className="grid gap-2">
                  <Label htmlFor="topic">
                    Enter a topic or select a suggestion
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g. The nature of consciousness"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                  />
                </div>

                {/* Topic suggestions */}
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics.slice(0, 6).map(suggestedTopic => (
                    <Badge
                      key={suggestedTopic}
                      variant="secondary"
                      className="hover:bg-secondary/80 cursor-pointer"
                      onClick={() => setDebateTopic(suggestedTopic)}
                    >
                      {suggestedTopic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Debate Format Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Debate Format</h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Format selection */}
                  <div className="space-y-2">
                    <Label htmlFor="format">Format Style</Label>
                    <Select
                      value={format}
                      onValueChange={value => setFormat(value as DebateFormat)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dialogue">Dialogue</SelectItem>
                        <SelectItem value="structured">
                          Structured Debate
                        </SelectItem>
                        <SelectItem value="moderated">
                          Moderated Discussion
                        </SelectItem>
                        <SelectItem value="oxford">Oxford Style</SelectItem>
                        <SelectItem value="panel">Panel Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Debate length */}
                  <div className="space-y-2">
                    <Label htmlFor="length">Debate Length</Label>
                    <Select
                      value={debateLength}
                      onValueChange={value =>
                        setDebateLength(value as DebateLength)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">
                          Short (~3 turns each)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (~5 turns each)
                        </SelectItem>
                        <SelectItem value="long">
                          Long (~8 turns each)
                        </SelectItem>
                        <SelectItem value="very long">
                          Very Long (~12 turns each)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Moderator option */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="moderator"
                    checked={includeModerator}
                    onCheckedChange={checked =>
                      setIncludeModerator(checked === true)
                    }
                  />
                  <Label htmlFor="moderator">Include a neutral moderator</Label>
                </div>

                {/* Additional context */}
                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (Optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Add any specific instructions or context for the debate simulation..."
                    value={additionalContext}
                    onChange={e => setAdditionalContext(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={resetForm}
                  disabled={isRunning}
                >
                  Reset
                </Button>
                <Button
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="min-w-[150px]"
                >
                  {isRunning ? "Simulating..." : "Run Simulation"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            {simulationResult ? (
              <div className="space-y-6">
                <Alert className="border-green-800 bg-green-800/20">
                  <AlertTitle>Simulation Complete</AlertTitle>
                  <AlertDescription>
                    {simulationResult.message}
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="mb-4 text-xl font-bold">
                    Your simulated debate is ready to view
                  </h3>

                  <p className="text-muted-foreground mb-6">
                    You can now view the full debate transcript and run analyses
                    to explore the arguments and positions.
                  </p>

                  <Button onClick={viewDebateDetails} className="min-w-[200px]">
                    View Debate Details <ArrowRight className="ml-2 size-4" />
                  </Button>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Debate ID
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs">
                        {simulationResult.debateId}
                      </code>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Transcript ID
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <code className="text-xs">
                        {simulationResult.transcriptId}
                      </code>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <Button variant="outline" onClick={resetForm}>
                    Create Another Simulation
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No simulation results to display
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
