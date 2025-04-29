"use client"

/**
 * @description
 * This client component renders an interactive, animated neural mind map using D3.js for the Neurogenesis app.
 * It visualizes debate analysis data as a force-directed graph, showing nodes (e.g., arguments, fallacies) and their connections.
 *
 * Key features:
 * - Interactive: Users can drag nodes to explore the map
 * - Animated: Uses D3’s force simulation for dynamic layout
 * - Design System: Black background with gold accents and white text
 * - Responsive: Adjusts to container size with a fixed height
 *
 * @dependencies
 * - d3: Provides force-directed graph functionality and SVG manipulation
 * - react: Manages component lifecycle and rendering
 *
 * @notes
 * - Uses mock data; replace with real analysis data from `analysis-actions.ts` in future steps
 * - Edge case: Handles empty data by rendering nothing
 * - Limitation: Basic implementation; lacks zoom/pan (planned for later enhancements)
 * - Assumes SVG container fits within parent div; overflow is hidden
 */

/** Imports for D3.js, React, and project utilities */
import * as d3 from "d3"
import { useEffect, useRef } from "react"

/** Interface for a node in the neural map (e.g., argument, fallacy) */
interface Node {
  id: string // Unique identifier for the node
  group: number // Group for color differentiation (e.g., 1 for arguments, 2 for fallacies)
}

/** Interface for a link between nodes (e.g., argument to fallacy) */
interface Link {
  source: string // Source node ID
  target: string // Target node ID
  value: number // Strength of the connection (affects line thickness)
}

/** Interface for the graph data structure */
interface GraphData {
  nodes: Node[] // Array of nodes to display
  links: Link[] // Array of connections between nodes
}

/** Mock data for initial implementation; replace with API data later */
const mockData: GraphData = {
  nodes: [
    { id: "Argument 1", group: 1 },
    { id: "Argument 2", group: 1 },
    { id: "Fallacy 1", group: 2 },
    { id: "Device 1", group: 3 }
  ],
  links: [
    { source: "Argument 1", target: "Argument 2", value: 1 },
    { source: "Argument 1", target: "Fallacy 1", value: 2 },
    { source: "Argument 2", target: "Device 1", value: 3 }
  ]
}

/** Props interface for the NeuralMap component */
interface NeuralMapProps {
  data?: GraphData // Optional graph data; defaults to mock data if not provided
}

/**
 * NeuralMap component that renders the interactive mind map.
 *
 * @param {NeuralMapProps} props - Component props, including optional data
 * @returns {JSX.Element} The rendered SVG visualization within a styled div
 */
export default function NeuralMap({ data = mockData }: NeuralMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null) // Ref to the SVG element for D3 manipulation

  useEffect(() => {
    // Exit early if SVG ref isn’t available or data is empty
    if (!svgRef.current || data.nodes.length === 0) return

    // Define dimensions for the SVG
    const width = 800
    const height = 600

    // Select the SVG element and set its viewBox for responsiveness
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%") // Ensure it scales with container
      .attr("height", height)

    // Clear any existing content to prevent duplication
    svg.selectAll("*").remove()

    // Define a color scale for node groups (gold-based palette)
    const color = d3
      .scaleOrdinal<string>()
      .domain(["1", "2", "3"])
      .range(["#FFD700", "#DAA520", "#B8860B"]) // Gold shades per design system

    // Initialize force simulation for dynamic layout
    const simulation = d3
      .forceSimulation<Node>(data.nodes)
      .force(
        "link",
        d3
          .forceLink<Node, Link>(data.links)
          .id(d => d.id)
          .distance(100) // Distance between connected nodes
      )
      .force("charge", d3.forceManyBody().strength(-300)) // Repulsion between nodes
      .force("center", d3.forceCenter(width / 2, height / 2)) // Center the graph

    // Render links as lines
    const link = svg
      .append("g")
      .attr("stroke", "#999") // Gray links for contrast
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value)) // Thicker lines for stronger connections

    // Render nodes as circles
    const node = svg
      .append("g")
      .attr("stroke", "#fff") // White stroke for visibility
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 10) // Node radius
      .attr("fill", d => color(d.group.toString())) // Color by group
      .call(
        d3
          .drag<SVGCircleElement, Node>()
          .on("start", dragStarted)
          .on("drag", dragged)
          .on("end", dragEnded)
      ) // Enable dragging

    // Add labels to nodes
    const labels = svg
      .append("g")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .text(d => d.id)
      .attr("x", 12) // Offset from node
      .attr("y", 3)
      .attr("fill", "white") // White text per design system
      .style("font-size", "12px")

    // Update positions on each simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as any).x) // Type assertion due to D3’s dynamic typing
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y)

      node.attr("cx", d => d.x!).attr("cy", d => d.y!) // Non-null assertion as simulation ensures coords

      labels.attr("x", d => (d.x || 0) + 12).attr("y", d => (d.y || 0) + 3)
    })

    // Drag event handlers
    function dragStarted(event: d3.DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart() // Restart simulation on drag start
      event.subject.fx = event.subject.x // Fix position during drag
      event.subject.fy = event.subject.y
    }

    function dragged(event: d3.DragEvent<SVGCircleElement, Node, Node>) {
      event.subject.fx = event.x // Update fixed position as dragged
      event.subject.fy = event.y
    }

    function dragEnded(event: d3.DragEvent<SVGCircleElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0) // Stop simulation when drag ends
      event.subject.fx = null // Release fixed position
      event.subject.fy = null
    }

    // Cleanup function to stop simulation on unmount
    return () => {
      simulation.stop()
    }
  }, [data]) // Re-run effect if data changes

  return (
    <div className="overflow-hidden bg-black p-4">
      <svg ref={svgRef} className="w-full" style={{ height: "600px" }} />
    </div>
  )
}
