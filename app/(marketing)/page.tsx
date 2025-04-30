/*
This server page is the marketing homepage.
*/

"use server"

import React from "react"
import NeuralMindMapWrapper from "@/components/visualizations/neural-mind-map-wrapper"

export default async function HomePage() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <NeuralMindMapWrapper />
    </div>
  )
}
