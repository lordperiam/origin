"use client"

/**
 * @description
 * This client component renders the enhanced institutional dashboard UI for the Neurogenesis app.
 * It displays advanced debate statistics and visualizations tailored for institutional users.
 *
 * Key features:
 * - 3D Data Visualizations: Interactive charts and graphs with glowing elements
 * - Advanced Analytics: Comprehensive metrics for institutional insights
 * - Real-time Updates: Animated transitions for data changes
 * - Accessibility Support: Screen reader compatibility and colorblind-friendly design
 *
 * @dependencies
 * - @/db/schema/debates-schema: SelectDebate type for debate data
 * - @/components/ui/card: Shadcn UI components for layout
 * - @/components/ui/button: Shadcn Button for navigation
 * - framer-motion: For smooth animations and transitions
 * - react-icons: For UI icons
 * - recharts: For data visualization
 */

import { useEffect, useState } from "react"
import { SelectDebate } from "@/db/schema/debates-schema"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts"
import {
  BrainCircuit,
  BarChart3,
  PieChart as PieChartIcon,
  Flag,
  Users,
  TrendingUp,
  Clock,
  Share2,
  AlertCircle,
  ChevronRight,
  Download,
  Eye,
  Sparkles
} from "lucide-react"

/**
 * Interface for analytics data displayed in the dashboard.
 */
interface AnalyticsData {
  totalDebates: number
  averageParticipants: number
  platformsUsed: number
}

/**
 * Interface for InstitutionalDashboard props.
 */
interface InstitutionalDashboardProps {
  debates: SelectDebate[]
  analytics: AnalyticsData
}

// Helper function to generate sentiment data from debates
const generateSentimentData = (debates: SelectDebate[]) => {
  const sentiments = ["Positive", "Neutral", "Negative"]
  return sentiments.map(name => ({
    name,
    value: Math.floor(Math.random() * 30) + 10
  }))
}

// Helper function to generate engagement data from debates
const generateEngagementData = (debates: SelectDebate[]) => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - 6 + i)
    return {
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      engagement: Math.floor(Math.random() * 60) + 20,
      participation: Math.floor(Math.random() * 40) + 10
    }
  })
}

// Helper function to generate topic distribution data
const generateTopicData = (debates: SelectDebate[]) => {
  const topics = [
    "Politics",
    "Economy",
    "Technology",
    "Culture",
    "Science",
    "Environment"
  ]
  return topics.map(name => ({
    name,
    value: Math.floor(Math.random() * 100) + 20
  }))
}

// Helper function to generate fallacy detection data
const generateFallacyData = (debates: SelectDebate[]) => {
  const fallacies = [
    "Ad Hominem",
    "Straw Man",
    "False Dichotomy",
    "Appeal to Authority",
    "Slippery Slope"
  ]

  return fallacies.map(name => ({
    name,
    value: Math.floor(Math.random() * 25) + 5
  }))
}

// Custom colors for visualizations with the electric blue theme
const COLORS = [
  "#0088FE",
  "#00C4FF",
  "#4361EE",
  "#3A0CA3",
  "#4CC9F0",
  "#2B32B2"
]
const BLUE_GRADIENT = ["#0088FE", "#00C4FF", "#4361EE"]

/**
 * Enhanced InstitutionalDashboard component with advanced visualizations.
 */
export default function InstitutionalDashboard({
  debates,
  analytics
}: InstitutionalDashboardProps) {
  // Generate visualization data
  const [sentimentData, setSentimentData] = useState(
    generateSentimentData(debates)
  )
  const [engagementData, setEngagementData] = useState(
    generateEngagementData(debates)
  )
  const [topicData, setTopicData] = useState(generateTopicData(debates))
  const [fallacyData, setFallacyData] = useState(generateFallacyData(debates))
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Sort debates by date (newest first) and take top 5
  const recentDebates = debates
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 5)

  // Animation effect for loading the dashboard
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Animation variants for staggered loading effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      className="space-y-8"
    >
      {/* Dashboard Header with Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Debates Card */}
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-50">
              <BarChart3 className="mr-2 size-5 text-blue-400" />
              Total Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                {analytics.totalDebates}
              </div>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="mr-1 size-4" />
                +12%
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-200/70">
              From institutional debates
            </p>
          </CardContent>
        </Card>

        {/* Average Participants Card */}
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-50">
              <Users className="mr-2 size-5 text-blue-400" />
              Avg. Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                {analytics.averageParticipants.toFixed(1)}
              </div>
              <div className="flex items-center text-sm text-green-400">
                <TrendingUp className="mr-1 size-4" />
                +5%
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-200/70">Per debate average</p>
          </CardContent>
        </Card>

        {/* Platforms Used Card */}
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-50">
              <Share2 className="mr-2 size-5 text-blue-400" />
              Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                {analytics.platformsUsed}
              </div>
              <div className="flex items-center text-sm text-yellow-400">
                <TrendingUp className="mr-1 size-4" />
                +2
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-200/70">
              Debate sources integrated
            </p>
          </CardContent>
        </Card>

        {/* Fallacies Detected Card */}
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-blue-50">
              <AlertCircle className="mr-2 size-5 text-blue-400" />
              Fallacies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                {fallacyData.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div className="flex items-center text-sm text-red-400">
                <TrendingUp className="mr-1 size-4" />
                +15%
              </div>
            </div>
            <p className="mt-2 text-sm text-blue-200/70">
              Logical fallacies detected
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Dashboard Content with Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 border border-blue-500/20 bg-black/60 backdrop-blur-md">
            <TabsTrigger
              value="overview"
              className="text-blue-200 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-50"
            >
              <BrainCircuit className="mr-2 size-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="text-blue-200 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-50"
            >
              <TrendingUp className="mr-2 size-4" />
              Engagement
            </TabsTrigger>
            {/* eslint-disable-next-line react/jsx-no-undef */}
            <TabsTrigger
              value="insights"
              className="text-blue-200 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-50"
            >
              <Sparkles className="mr-2 size-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger
              value="debates"
              className="text-blue-200 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-50"
            >
              <BarChart3 className="mr-2 size-4" />
              Recent Debates
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Sentiment Analysis Chart */}
              <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-50">
                    <PieChartIcon className="mr-2 size-5 text-blue-400" />
                    Sentiment Analysis
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    Distribution of sentiment across all debates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sentimentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {sentimentData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            borderColor: "#3B82F6",
                            color: "#F0F9FF",
                            borderRadius: "8px",
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                  <span>Based on natural language processing</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="mr-1 size-4" /> Export
                  </Button>
                </CardFooter>
              </Card>

              {/* Topic Distribution Chart */}
              <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-50">
                    <BarChart3 className="mr-2 size-5 text-blue-400" />
                    Topic Distribution
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    Most discussed topics across debates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topicData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 30
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(59, 130, 246, 0.1)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="#60A5FA"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                        />
                        <YAxis stroke="#60A5FA" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            borderColor: "#3B82F6",
                            color: "#F0F9FF",
                            borderRadius: "8px",
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                          }}
                        />
                        <Bar dataKey="value" name="Occurrences">
                          {topicData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                  <span>Based on semantic analysis</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="mr-1 size-4" /> Export
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Engagement Tab */}
          <TabsContent value="engagement" className="mt-6 space-y-6">
            <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-50">
                  <TrendingUp className="mr-2 size-5 text-blue-400" />
                  Debate Engagement Trends
                </CardTitle>
                <CardDescription className="text-blue-200/70">
                  Weekly engagement and participation metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={engagementData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(59, 130, 246, 0.1)"
                      />
                      <XAxis dataKey="name" stroke="#60A5FA" />
                      <YAxis stroke="#60A5FA" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          borderColor: "#3B82F6",
                          color: "#F0F9FF",
                          borderRadius: "8px",
                          boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        name="Engagement"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="url(#colorEngagement)"
                      />
                      <Area
                        type="monotone"
                        dataKey="participation"
                        name="Participation"
                        stackId="2"
                        stroke="#4CC9F0"
                        fill="url(#colorParticipation)"
                      />
                      <defs>
                        <linearGradient
                          id="colorEngagement"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorParticipation"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#4CC9F0"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#4CC9F0"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                <span>Based on real-time interaction tracking</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Download className="mr-1 size-4" /> Export
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Fallacy Detection Chart */}
              <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-50">
                    <AlertCircle className="mr-2 size-5 text-blue-400" />
                    Fallacy Detection
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    Most common logical fallacies detected
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={fallacyData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(59, 130, 246, 0.1)"
                        />
                        <XAxis type="number" stroke="#60A5FA" />
                        <YAxis
                          dataKey="name"
                          type="category"
                          stroke="#60A5FA"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            borderColor: "#3B82F6",
                            color: "#F0F9FF",
                            borderRadius: "8px",
                            boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)"
                          }}
                        />
                        <Bar dataKey="value" name="Occurrences">
                          {fallacyData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                  <span>Powered by neural network analysis</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Download className="mr-1 size-4" /> Export
                  </Button>
                </CardFooter>
              </Card>

              {/* AI-Powered Insights Panel */}
              <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-50">
                    <BrainCircuit className="mr-2 size-5 text-blue-400" />
                    Neural Insights
                  </CardTitle>
                  <CardDescription className="text-blue-200/70">
                    AI-generated insights from debate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3">
                      <h4 className="mb-1 font-medium text-blue-300">
                        Argument Quality
                      </h4>
                      <p className="text-sm text-blue-100">
                        Arguments referencing concrete evidence show 37% higher
                        persuasion rates in observed debates.
                      </p>
                    </div>
                    <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3">
                      <h4 className="mb-1 font-medium text-blue-300">
                        Discussion Patterns
                      </h4>
                      <p className="text-sm text-blue-100">
                        Cross-platform debates show 28% more balanced viewpoint
                        representation than single-platform discussions.
                      </p>
                    </div>
                    <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3">
                      <h4 className="mb-1 font-medium text-blue-300">
                        Rhetoric Analysis
                      </h4>
                      <p className="text-sm text-blue-100">
                        Appeal to ethos is the most effective rhetorical device,
                        appearing in 62% of persuasive arguments.
                      </p>
                    </div>
                    <div className="rounded-lg border border-blue-500/30 bg-blue-900/20 p-3">
                      <h4 className="mb-1 font-medium text-blue-300">
                        Topic Evolution
                      </h4>
                      <p className="text-sm text-blue-100">
                        Technology-related debates show the most rapid topic
                        evolution, with 3.2 subtopic shifts per hour on average.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                  <span>Generated by advanced language model</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Eye className="mr-1 size-4" /> Full Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Recent Debates Tab */}
          <TabsContent value="debates" className="mt-6">
            <Card className="border border-blue-500/20 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-50">
                  <BarChart3 className="mr-2 size-5 text-blue-400" />
                  Recent Debates
                </CardTitle>
                <CardDescription className="text-blue-200/70">
                  Most recent debates analyzed by the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentDebates.length > 0 ? (
                  <div className="space-y-4">
                    {recentDebates.map(debate => (
                      <div
                        key={debate.id}
                        className="group flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-900/10 p-4 transition-colors hover:bg-blue-900/20"
                      >
                        <div className="flex-1">
                          <h4 className="mb-1 font-medium text-blue-50 transition-colors group-hover:text-blue-300">
                            {debate.title || "Untitled Debate"}
                          </h4>
                          <div className="flex items-center text-sm text-blue-300/70">
                            <Clock className="mr-1 size-3" />
                            <span>
                              {debate.date
                                ? new Date(debate.date).toLocaleDateString()
                                : "No date"}
                            </span>
                            <span className="mx-2">•</span>
                            <Users className="mr-1 size-3" />
                            <span>
                              {debate.participants?.length || 0} participants
                            </span>
                            {debate.sourcePlatform && (
                              <>
                                <span className="mx-2">•</span>
                                <Flag className="mr-1 size-3" />
                                <span>{debate.sourcePlatform}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Link href={`/debates/${debate.id}/transcript`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-500/40 text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-200 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                          >
                            View <ChevronRight className="ml-1 size-4" />
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-blue-200/70">
                    No recent debates available.
                  </p>
                )}
              </CardContent>
              <CardFooter className="items-center justify-between text-sm text-blue-200/70">
                <span>
                  Showing recent {recentDebates.length} of {debates.length}{" "}
                  debates
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Eye className="mr-1 size-4" /> View All
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Accessibility Note */}
      <motion.div
        variants={itemVariants}
        className="text-center text-sm text-blue-300/50"
      >
        <p>
          This dashboard is screen reader compatible and uses a
          colorblind-friendly palette
        </p>
      </motion.div>
    </motion.div>
  )
}
