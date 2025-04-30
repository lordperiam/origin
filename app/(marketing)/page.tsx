/*
This server page is the marketing homepage.
*/

"use client" // Needs to be client for Three.js

import React from "react"
import NeuralMindMap from "@/components/visualizations/neural-mind-map" // Import the Three.js component
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    // Changed background to white
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <NeuralMindMap />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          // Changed text color to black, adjusted shadow for light background
          className="mb-6 text-5xl font-bold leading-tight tracking-tighter text-black md:text-7xl lg:text-8xl"
          style={{
            textShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          Unlock Understanding
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          // Changed text color to a dark neutral
          className="mb-10 max-w-2xl text-lg text-neutral-700 md:text-xl lg:text-2xl"
          style={{
            textShadow: "0px 1px 5px rgba(0, 0, 0, 0.05)"
          }}
        >
          Navigate the complexities of discourse. Analyze arguments, simulate
          debates, and foster deeper insight with Neurogenesis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.6,
            type: "spring",
            stiffness: 100
          }}
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/debates" passHref>
            <Button
              size="lg"
              // Adjusted primary button for light theme (assuming primary color contrasts well)
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-105"
            >
              Explore Debates <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button
              variant="outline"
              size="lg"
              // Adjusted outline button for light theme
              className="rounded-full border-neutral-400 px-8 py-3 text-lg font-semibold text-neutral-800 shadow-md transition-transform duration-200 hover:scale-105 hover:bg-neutral-100 hover:text-black"
            >
              Learn More
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
