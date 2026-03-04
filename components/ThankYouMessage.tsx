"use client"
import { Text3D, Center, Float, MeshWobbleMaterial, Sparkles } from "@react-three/drei"
import { useEffect, useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"

const ConfettiPiece = ({ delay }: { delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  // Vibrant palette for maximum contrast
  const colors = ["#ff00ff", "#00ffff", "#ffea00", "#ffffff", "#ff4d00"]
  const color = useMemo(() => colors[Math.floor(Math.random() * colors.length)], [])
  
  const speed = useMemo(() => Math.random() * 0.15 + 0.1, [])
  const rotationSpeed = useMemo(() => (Math.random() - 0.5) * 0.3, [])
  const xOffset = useMemo(() => (Math.random() - 0.5) * 25, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime() - delay
    if (t < 0) return 

    meshRef.current.position.y -= speed
    meshRef.current.rotation.x += rotationSpeed
    meshRef.current.rotation.z += rotationSpeed
    
    // Looping back to sky
    if (meshRef.current.position.y < -10) {
      meshRef.current.position.y = 20
    }
  })

  return (
    <mesh ref={meshRef} position={[xOffset, 20, (Math.random() - 0.5) * 15]}>
      <boxGeometry args={[0.2, 0.2, 0.02]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
    </mesh>
  )
}

export default function ThankYouMessage() {
  const line1 = useRef<THREE.Group>(null)
  const line2 = useRef<THREE.Group>(null)
  const line3 = useRef<THREE.Group>(null)
  // Standard helvetiker font (Three.js standard)
  const fontUrl = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"

  return (
    <>
      {/* 1. Confetti Rain - More density and spread */}
      {Array.from({ length: 100 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.08} />
      ))}

      {/* 2. Enhanced Particle Atmosphere */}
      <Sparkles count={150} scale={20} size={4} speed={0.8} color="#00ffff" />
      <Sparkles count={50} scale={15} size={2} speed={1.2} color="#ff00ff" />

      {/* 3. Text Group - Balanced Position */}
      <group position={[0, 3, -2]}> 
        {/* Top Line: Pure White for clarity */}
        <Center ref={line1} position={[0, 2.5, 0]}>
            <Text3D font={fontUrl} size={0.35} height={0.1}>
              YOU ARE TRULY
              <meshStandardMaterial color="pink" emissive="white" emissiveIntensity={0.9} />
            </Text3D>
        </Center>

        {/* Hero Line: Neon Pink/Purple with Wobble */}
        <Center ref={line2} position={[0, 1, 0]}>
            <Text3D
              font={fontUrl}
              size={1.2}
              height={0.2}
              bevelEnabled
              bevelThickness={0.1}
              bevelSize={0.05}
            >
              AMAZING!
              <MeshWobbleMaterial 
                factor={0.15} 
                speed={1.5} 
                color="#ff00ff" 
                emissive="#ff00ff" 
                emissiveIntensity={0.5} 
              />
            </Text3D>
        </Center>

        {/* Bottom Line: Electric Cyan */}
        <Center ref={line3} position={[0, -0.8, 0]}>
            <Text3D font={fontUrl} size={0.45} height={0.1}>
              Thanks for being my friend!
              <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={1} />
            </Text3D>
        </Center>
      </group>

    </>
  )
}