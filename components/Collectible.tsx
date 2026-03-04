"use client"
import { Float, Sparkles, useCursor, MeshDistortMaterial, Text } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { useState, useRef, useEffect } from "react"
import { useGameStore } from "@/hooks/useGameStore"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"

// Added 'label' prop to identify a, b, c, or d
export default function Collectible({ position, label }: { position: [number, number, number], label: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const [hovered, setHovered] = useState(false)
  const [collected, setCollected] = useState(false)
  
  const getOptionColor = (label: string) => {
  switch (label) {
    case 'a': return "#ff0055" // Neon Pink (Aura)
    case 'b': return "#00ff00" // Matrix Green (Logic)
    case 'c': return "#00ffff" // Cyber Cyan (System)
    case 'd': return "#ffea00" // Electric Yellow (Warning/Bright)
    default: return "#ffffff"
  }
}

  // Store actions
  const checkAnswer = useGameStore((state) => state.checkAnswer)
  const currentIndex = useGameStore((state) => state.currentIndex)

  useCursor(hovered)

  // Reset logic: Jab question change ho, objects wapas aa jayein
  useEffect(() => {
    setCollected(false)
    if (meshRef.current) {
      gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(1.7)" })
      meshRef.current.rotation.set(0, 0, 0)
    }
  }, [currentIndex])

  useFrame((state) => {
    if (!meshRef.current || collected) return
    const t = state.clock.getElapsedTime()
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = 2 + Math.sin(t * 4) * 1.5
    }
  })

  const handleCollect = () => {
    if (collected) return
    setCollected(true)

    const tl = gsap.timeline({
      // IMPORTANT: Animation khatam hote hi store check karega
      onComplete: () => checkAnswer(label)
    });

    tl.to(meshRef.current!.rotation, { y: Math.PI * 4, duration: 0.4, ease: "power2.in" })
    tl.to(meshRef.current!.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.1, ease: "power2.out" }, "-=0.1")
    tl.to(meshRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.3, ease: "back.in(4)" })
    
    if (lightRef.current) {
      tl.to(lightRef.current, { intensity: 20, duration: 0.1 }, 0)
      tl.to(lightRef.current, { intensity: 0, duration: 0.4 }, 0.1)
    }
  }

  return (
    <group position={position}>
      <pointLight 
        ref={lightRef}
        distance={4} 
        intensity={collected ? 0 : 3} 
        color={getOptionColor(label)} // Different colors for visual variety
      />

      {!collected && (
        <>
          <Sparkles count={20} scale={2} size={3} speed={0.6} color="#ffffff" opacity={0.5} />
          {/* Label Text: 3D world mein dikhayega ki ye A hai ya B */}
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {label.toUpperCase()}
          </Text>
        </>
      )}

      <RigidBody type="fixed" sensor onIntersectionEnter={handleCollect}>
        <Float speed={5} rotationIntensity={2} floatIntensity={1.5}>
          <mesh 
            ref={meshRef}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            castShadow
          >
            <torusKnotGeometry args={[0.3, 0.08, 128, 16]} />
            <MeshDistortMaterial 
              distort={0.3} 
              speed={4} 
              color={hovered ? "#ffffff" : (label === 'a' ? "#ff0055" : "#00ffff")} 
              emissive={getOptionColor(label)} 
              emissiveIntensity={2}
              roughness={0}
              metalness={1}
            />
          </mesh>
        </Float>
      </RigidBody>

      {collected && (
        <group>
          <Sparkles count={40} scale={2} size={6} speed={3} color="#ffffff" />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.5, 32]} />
            <meshBasicMaterial color="white" transparent opacity={1} />
          </mesh>
        </group>
      )}
    </group>
  )
}