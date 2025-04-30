import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"

export default function NeuralMindMap() {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const paths = svg.querySelectorAll(".wave-line")

    // Animate the wave lines
    paths.forEach((path, index) => {
      gsap.to(path, {
        duration: 4,
        attr: { d: generateWavePath(index) },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      })
    })

    function generateWavePath(offset: number) {
      const width = 800
      const height = 600
      const amplitude = 20
      const frequency = 0.05
      let path = `M 0 ${height / 2}`

      for (let x = 0; x <= width; x += 10) {
        const y =
          height / 2 +
          Math.sin((x + offset * 50) * frequency) *
            amplitude *
            (1 - offset * 0.1)
        path += ` L ${x} ${y}`
      }

      return path
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute left-0 top-0 size-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
    >
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1ecfff" />
          <stop offset="100%" stopColor="#004e92" />
        </linearGradient>
      </defs>

      {/* Contour-like wave lines */}
      {[...Array(10)].map((_, i) => (
        <path
          key={i}
          className="wave-line"
          d={`M 0 ${300 + i * 20} L 800 ${300 + i * 20}`}
          stroke="url(#line-gradient)"
          strokeWidth="1.5"
          fill="none"
          opacity={1 - i * 0.1}
        />
      ))}
    </svg>
  )
}
