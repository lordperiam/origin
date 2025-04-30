"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { motion } from "framer-motion" // For UI animations
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
interface NeuralMindMapProps {
  interactive?: boolean;
}
export default function NeuralMindMap({ interactive = true }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const mouse = useRef(new THREE.Vector2())
  const [loaded, setLoaded] = useState(false)
  const controlsRef = useRef<OrbitControls | null>(null)
  const frameId = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const currentMount = mountRef.current

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.001) // Subtle fog for depth
    
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 70
    
    // Renderer with better quality for the glowing effect
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio) // Limit for performance
    renderer.setClearColor(0x000000, 0) // Transparent background
    renderer.toneMapping = THREE.ACESFilmicToneMapping // Better color handling
    renderer.toneMappingExposure = 1.2 // Slightly brighter
    currentMount.appendChild(renderer.domElement)

    // Add OrbitControls if interactive
    if (interactive) {
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.minDistance = 30
      controls.maxDistance = 150
      controls.enablePan = false
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.3
      controlsRef.current = controls
    }

    // Enhanced particle system
    const particleCount = 15000 // More particles for richness
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const opacities = new Float32Array(particleCount) // For varied opacity
    const velocities: { x: number; y: number; z: number }[] = [] // For particle movement

    const color = new THREE.Color()

    // Create fluid, organic-looking particle clusters 
    // instead of a uniform sphere, similar to the blue image
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Organic distribution combining multiple patterns
      const phi = Math.random() * Math.PI * 2
      const costheta = Math.random() * 2 - 1
      const theta = Math.acos(costheta)
      
      // Base radius with noise
      let radius
      
      // Create two main clusters of particles with a connecting bridge
      const cluster = Math.random()
      if (cluster < 0.4) {
        // First cluster - slightly larger
        radius = 20 + Math.random() * 30 * Math.pow(Math.random(), 2)
        positions[i3] = radius * Math.sin(theta) * Math.cos(phi) - 20
        positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi) + 5
        positions[i3 + 2] = radius * Math.cos(theta) - 10
      } else if (cluster < 0.8) {
        // Second cluster - more compact
        radius = 15 + Math.random() * 25 * Math.pow(Math.random(), 1.5)
        positions[i3] = radius * Math.sin(theta) * Math.cos(phi) + 25
        positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi) - 10
        positions[i3 + 2] = radius * Math.cos(theta) + 15
      } else {
        // Bridge/connecting filaments
        radius = 10 + Math.random() * 60
        const t = Math.random()
        positions[i3] = (25 * t - 20 * (1-t)) + (Math.random() - 0.5) * 20
        positions[i3 + 1] = (-10 * t + 5 * (1-t)) + (Math.random() - 0.5) * 20
        positions[i3 + 2] = (15 * t - 10 * (1-t)) + (Math.random() - 0.5) * 20
      }

      // Precise electric blue color palette with variations
      // Focus on blue/cyan hues with occasional brighter particles
      const blueHue = 0.58 + Math.random() * 0.07 // Blue-cyan range
      const saturation = 0.8 + Math.random() * 0.2 // High saturation for vibrancy
      const lightness = 0.5 + Math.random() * 0.3 // Varied brightness
      
      // Occasionally add white-blue highlights
      if (Math.random() > 0.97) {
        color.setHSL(blueHue, 0.3, 0.85) // Brighter highlights
      } else {
        color.setHSL(blueHue, saturation, lightness)
      }
      
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b

      // Varied particle sizes - mostly small with some larger ones
      const particleSize = Math.random() > 0.95 
        ? Math.random() * 3 + 1.5 
        : Math.random() * 1.2 + 0.8
      
      sizes[i] = particleSize
      opacities[i] = 0.7 + Math.random() * 0.3 // Varied opacity
      
      // Add velocity for animation
      velocities.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      })
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1))

    // Custom particle texture for better glow effect
    const particleTexture = new THREE.TextureLoader().load("/particle-glow.png") 

    // Enhanced shader material with improved glow and interactions
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: particleTexture },
        time: { value: 0.0 },
        mousePos: { value: new THREE.Vector3() }
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        uniform vec3 mousePos;

        void main() {
          vColor = color;
          vOpacity = opacity;
          
          // Clone the original position for animations
          vec3 animated_position = position;
          
          // Enhanced wave motion
          float waveX = sin(animated_position.x * 0.05 + time * 0.2) * 0.5;
          float waveY = cos(animated_position.y * 0.05 + time * 0.1) * 0.5;
          float waveZ = sin(animated_position.z * 0.05 + time * 0.3) * 0.5;
          
          animated_position.x += waveX;
          animated_position.y += waveY;
          animated_position.z += waveZ;
          
          vec4 mvPosition = modelViewMatrix * vec4(animated_position, 1.0);
          
          // Enhanced pulsing effect with more organic rhythm
          float pulse = sin(time * 0.3 + position.x * 0.01 + position.y * 0.01) * 0.1 + 1.0;
          
          // More sophisticated mouse interaction with fluid falloff
          float dist = length(position - mousePos);
          float maxDistance = 25.0;
          float interactionStrength = max(0.0, 1.0 - dist/maxDistance);
          float pushStrength = interactionStrength * interactionStrength * 8.0; // Quadratic falloff for more natural feel
          
          if (dist < maxDistance) {
            vec3 direction = normalize(position - mousePos);
            mvPosition.xyz += direction * pushStrength;
            
            // Also make particles near mouse glow a bit more
            pulse += interactionStrength * 0.5;
          }

          // Size adjustment based on distance for better depth perception
          float distanceScale = 1.2 - (-mvPosition.z * 0.01);
          
          gl_PointSize = size * pulse * distanceScale * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float time;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          // Improved soft particle rendering
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          
          // Enhanced glow effect with more vibrant center
          float intensity = 1.5;
          vec3 glow = vColor * intensity;
          
          // Add slight color variations based on time
          float hueShift = sin(time * 0.2) * 0.02;
          glow.r += hueShift;
          glow.b -= hueShift;
          
          // Create final color with glow
          vec4 finalColor = vec4(glow, texColor.a * vOpacity);
          
          if (finalColor.a < 0.05) discard; // Remove very transparent pixels
          
          gl_FragColor = finalColor;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Add secondary smaller particles for background depth
    const bgParticleCount = 5000;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgParticleCount * 3);
    
    for (let i = 0; i < bgParticleCount * 3; i += 3) {
      // Position small particles in a larger sphere
      const radius = 100 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      bgPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      bgPositions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
      bgPositions[i+2] = radius * Math.cos(phi);
    }
    
    bgGeometry.setAttribute("position", new THREE.BufferAttribute(bgPositions, 3));
    
    const bgMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: 0x0066ff,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    
    const bgParticles = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgParticles);

    // Mouse move listener with smooth tracking
    const targetMouse = new THREE.Vector2()
    const onMouseMove = (event: MouseEvent) => {
      // Convert mouse position to normalized device coordinates
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", onMouseMove)

    // Touch move listener for mobile
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        targetMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1
        targetMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1
      }
    }
    window.addEventListener("touchmove", onTouchMove)

    // Improved resize listener with debouncing
    let resizeTimeout: NodeJS.Timeout
    const onResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (!currentMount) return
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
      }, 100) // Debounce resize events
    }
    window.addEventListener("resize", onResize)

    // Animation loop
    const clock = new THREE.Clock()
    const animate = () => {
      frameId.current = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()
      material.uniforms.time.value = elapsedTime
      
      // Smooth mouse movement with interpolation (easing)
      mouse.current.x += (targetMouse.x - mouse.current.x) * 0.05
      mouse.current.y += (targetMouse.y - mouse.current.y) * 0.05

      // Update mouse position uniform in world coordinates
      const vector = new THREE.Vector3(mouse.current.x, mouse.current.y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      material.uniforms.mousePos.value.copy(pos)

      // Update particle positions for organic movement
      const positions = geometry.attributes.position.array
      
      for(let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const velocity = velocities[i]
        
        // Apply soft, fluid-like motion to particles
        positions[i3] += velocity.x
        positions[i3 + 1] += velocity.y
        positions[i3 + 2] += velocity.z
        
        // Subtle bounds to keep particles in general viewing area
        // but with soft edges - this simulates a fluid-like behavior
        const posX = positions[i3]
        const posY = positions[i3 + 1]
        const posZ = positions[i3 + 2]
        const distance = Math.sqrt(posX * posX + posY * posY + posZ * posZ)
        
        if (distance > 80) {
          velocity.x -= posX * 0.0002
          velocity.y -= posY * 0.0002
          velocity.z -= posZ * 0.0002
        }
        
        // Add very slight damping for stability
        velocity.x *= 0.999
        velocity.y *= 0.999
        velocity.z *= 0.999
      }
      
      geometry.attributes.position.needsUpdate = true
      
      // Subtle continuous rotation of the entire scene for added dynamism
      particles.rotation.y = Math.sin(elapsedTime * 0.05) * 0.1
      particles.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05
      
      // Rotate background particles more slowly in opposite direction
      bgParticles.rotation.y = elapsedTime * -0.02
      bgParticles.rotation.z = elapsedTime * 0.01

      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update()
      }

      renderer.render(scene, camera)
    }
    animate()
    
    // Set loaded state after initial render
    setTimeout(() => setLoaded(true), 500)

    // Cleanup
    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("resize", onResize)
      clearTimeout(resizeTimeout)
      
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      
      // Dispose of resources
      geometry.dispose()
      material.dispose()
      bgGeometry.dispose()
      bgMaterial.dispose()
      
      if (particleTexture) {
        particleTexture.dispose()
      }
      renderer.dispose()
    }
  }, [interactive])

  // Render the visualization with a fade-in effect
  return (
    <>
      <div 
        ref={mountRef} 
        className="absolute left-0 top-0 z-0 size-full" 
        aria-hidden="true"
      />
      
      {/* Overlay with subtle vignette for enhanced depth */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-radial from-transparent to-black/30" />
      
      {/* Fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 z-0"
      />
    </>
  )
}
