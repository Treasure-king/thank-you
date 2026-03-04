"use client"
import { OrbitControls, Grid, Float, ContactShadows, Stars } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import { useGameStore } from "@/hooks/useGameStore"
import ThankYouMessage from "./ThankYouMessage"
import Player from "./Player"
import Collectible from "./Collectible"
import Effects from "./Effects"
import { useMemo } from "react"
import * as THREE from "three"

export default function Experience() {
  const hasWon = useGameStore((state) => state.hasWon)
  const currentIndex = useGameStore((state) => state.currentIndex)

  const heartShape = useMemo(() => {
  const shape = new THREE.Shape()
  const x = 0, y = 0
  // Heart math path
  shape.moveTo(x + 0.5, y + 0.5)
  shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y)
  shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7)
  shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9)
  shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7)
  shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y)
  shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5)
  return shape
}, [])

  // Options positions (Square formation around center)
  const options = useMemo(() => [
    { pos: [-6, 1, -6] as [number, number, number], label: "a" },
    { pos: [6, 1, -6] as [number, number, number], label: "b" },
    { pos: [-6, 1, 6] as [number, number, number], label: "c" },
    { pos: [6, 1, 6] as [number, number, number], label: "d" },
  ], [])

  return (
    <>
      <OrbitControls makeDefault enablePan={false} maxPolarAngle={Math.PI / 2.1} />
      
      {/* Background Atmosphere */}
      <color attach="background" args={[hasWon ? "#0a001a" : "#080808"]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* 💡 Lighting - Intensities increased for better visibility */}
      <ambientLight intensity={0.8} /> 
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#00ffff" />
      <spotLight 
        position={[15, 20, 15]} 
        angle={0.3} 
        penumbra={1} 
        intensity={3} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />

      {/* Physics Engine - Debug mode turned OFF (Set to true if floor still invisible) */}
      <Physics debug={false}>
        <Player />

        {/* 1. Options (Collectibles) - Re-rendered on question change */}
        {!hasWon && options.map((option) => (
          <Collectible 
            key={`${currentIndex}-${option.label}`} 
            position={option.pos} 
            label={option.label} 
          />
        ))}

        {/* 2. Playing Area (The Floor) */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh receiveShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[50, 1, 50]} />
            {/* Color slightly changed to #111 so it's visible against black background */}
            <meshStandardMaterial color="#111111" roughness={0.8} metalness={0.2} />
          </mesh>
          
          {/* Grid for visual grounding */}
          <Grid 
            infiniteGrid 
            fadeDistance={40} 
            fadeStrength={5}
            sectionColor={hasWon ? "#ff00ff" : "#00ffff"} 
            cellColor="#333" 
            cellSize={1} 
            sectionSize={5} 
            position={[0, -0.01, 0]} // Slightly above floor to prevent z-fighting
          />
        </RigidBody>

        {/* 3. Invisible Boundary Walls (Prevents player from falling off) */}
        <RigidBody type="fixed" colliders="cuboid">
          {/* North */}
          <mesh position={[0, 5, -25]}><boxGeometry args={[50, 10, 1]} /><meshBasicMaterial transparent opacity={0} /></mesh>
          {/* South */}
          <mesh position={[0, 5, 25]}><boxGeometry args={[50, 10, 1]} /><meshBasicMaterial transparent opacity={0} /></mesh>
          {/* East */}
          <mesh position={[25, 5, 0]}><boxGeometry args={[1, 10, 50]} /><meshBasicMaterial transparent opacity={0} /></mesh>
          {/* West */}
          <mesh position={[-25, 5, 0]}><boxGeometry args={[1, 10, 50]} /><meshBasicMaterial transparent opacity={0} /></mesh>
        </RigidBody>
      </Physics>

      {/* Polish Effects */}
      <ContactShadows 
        position={[0, 0.01, 0]} 
        opacity={0.7} 
        scale={50} 
        blur={2.5} 
        far={10} 
        color={hasWon ? "#ff00ff" : "#00ffff"} 
      />
      
      <Effects />

      {/* Victory Celebration */}
      {hasWon && (
        <group position={[0, 0, 0]}>
          <ThankYouMessage />
<mesh 
    position={[2.25, 0.05, -5]} 
    rotation={[-Math.PI / 2, 0, Math.PI]} // Heart ko seedha karne ke liye Math.PI rotate kiya
    scale={[5, 5, 5]} // Size adjust karne ke liye scale use kiya
  >
    <shapeGeometry args={[heartShape]} />
    <meshStandardMaterial 
      color="#ff0055" // Heart ke liye Pinkish Red color
      emissive="#ff0055" 
      emissiveIntensity={8} 
      transparent 
      opacity={0.6} 
      side={THREE.DoubleSide}
    />
  </mesh>
        </group>
      )}
    </>
  )
}