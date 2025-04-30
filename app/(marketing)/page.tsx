/*
This server page is the marketing homepage.
*/

"use client" // Needs to be client for Three.js

import React, { useRef, useState, useEffect } from "react"
import NeuralMindMap from "@/components/visualizations/neural-mind-map" // Import the Three.js component
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react"

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // Simulate loading for smooth transition effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Enhanced Neural Mind Map visualization with blue particles */}
      <NeuralMindMap />

      {/* Subtle overlay gradient for better text contrast */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* Content overlay with improved styling and animations */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          className="container flex max-w-6xl flex-col items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -30 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-6xl font-bold leading-none tracking-tighter text-white md:text-7xl lg:text-8xl"
            style={{
              textShadow: "0px 2px 10px rgba(0, 0, 0, 0.5)" // Enhanced shadow for better readability
            }}
          >
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Neural
            </span>{" "}
            Understanding
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="mb-12 max-w-3xl text-xl font-light text-blue-50 md:text-2xl lg:text-3xl"
            style={{
              textShadow: "0px 1px 5px rgba(0, 0, 0, 0.3)" // Light shadow for better contrast
            }}
          >
            Navigate the complexities of discourse with powerful AI. Analyze
            arguments, simulate debates, and foster deeper insight with
            Neurogenesis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.8 }}
            transition={{
              duration: 0.8,
              delay: 0.6,
              type: "spring",
              stiffness: 100
            }}
            className="flex flex-col items-center gap-6 sm:flex-row"
          >
            <Link href="/debates" passHref>
              <Button
                size="lg"
                className="rounded-full bg-blue-500 px-8 py-6 text-lg font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-200 hover:scale-105 hover:bg-blue-600 hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
              >
                <BrainCircuit className="mr-2 size-5" />
                Explore Neural Network <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="/argument-locator" passHref>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-blue-400 px-8 py-6 text-lg font-semibold text-blue-100 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-500/20"
              >
                <Sparkles className="mr-2 size-5" />
                Discover Analysis
              </Button>
            </Link>
          </motion.div>

          {/* Feature highlights - inspired by dora.run sites */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="mt-24 grid grid-cols-1 gap-10 text-left md:grid-cols-3"
          >
            {/* Feature 1 */}
            <div className="rounded-xl border border-blue-500/20 bg-black/30 p-6 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <div className="mb-4 inline-flex rounded-full bg-blue-500/20 p-3">
                <BrainCircuit className="size-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                Neural Mind Mapping
              </h3>
              <p className="text-blue-200">
                Visualize complex neural networks with our interactive 3D
                interface. Watch arguments connect in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-blue-500/20 bg-black/30 p-6 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <div className="mb-4 inline-flex rounded-full bg-blue-500/20 p-3">
                <Sparkles className="size-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                Real-time Analysis
              </h3>
              <p className="text-blue-200">
                Experience AI-powered analysis as it happens. Watch arguments
                form and evolve with glowing precision.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-blue-500/20 bg-black/30 p-6 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <div className="mb-4 inline-flex rounded-full bg-blue-500/20 p-3">
                <ArrowRight className="size-6 text-blue-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                Institutional Insights
              </h3>
              <p className="text-blue-200">
                Transform complex data into actionable insights with our
                immersive visualization tools built for institutions.
              </p>
            </div>
          </motion.div>

          {/* Accessibility note with fade in */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 0.7 : 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16 text-sm text-blue-300/70"
          >
            <p>
              Our interface supports screen readers and includes
              colorblind-friendly visuals
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
