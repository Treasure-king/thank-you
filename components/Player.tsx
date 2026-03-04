"use client"
import { useKeyboardControls, Trail } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import { useRef, useMemo } from "react"
import * as THREE from "three"
import { useGameStore } from "@/hooks/useGameStore"

export default function Player() {
  const rb = useRef<RapierRigidBody>(null)
  const [, getKeys] = useKeyboardControls()
  const hasWon = useGameStore((state) => state.hasWon)

  // Use useMemo for persistent vectors to avoid garbage collection every frame
  const vec = useMemo(() => new THREE.Vector3(), [])
  const targetCameraPos = useMemo(() => new THREE.Vector3(0, 5, 12), [])
  const targetLookAt = useMemo(() => new THREE.Vector3(0, 2, 0), [])

  useFrame((state, delta) => {
    if (!rb.current) return

    // 1. Victory State: Stop movement and pan camera
    if (hasWon) {
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rb.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      state.camera.position.lerp(targetCameraPos, 0.03)
      state.camera.lookAt(targetLookAt)
      return 
    }

    // 2. Movement Logic
    const { forward, backward, left, right, jump } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    
    // Snappy movement for touch: 
    // On mobile, users expect instant response. We use delta to keep it consistent.
    const strength = 10 * delta 
    
    if (forward) impulse.z -= strength
    if (backward) impulse.z += strength
    if (left) impulse.x -= strength
    if (right) impulse.x += strength

    rb.current.applyImpulse(impulse, true)

    // 3. Jump Logic (Ground Check)
    // translation().y < 0.55 ensures ball is near the floor (radius 0.5 + small buffer)
    if (jump && Math.abs(rb.current.translation().y) < 0.55) {
      rb.current.applyImpulse({ x: 0, y: 6, z: 0 }, true)
    }

    // 4. Smooth Follow Camera
    const playerPos = rb.current.translation()
    
    // Mobile Tip: On portrait screens, increase the Z offset (18) and Y offset (12)
    // so the player isn't hidden by their own thumbs on the D-Pad.
    const isMobile = state.size.width < 768
    const cameraOffset = isMobile 
        ? new THREE.Vector3(0, 14, 20) // Further back for mobile
        : new THREE.Vector3(0, 10, 15) // Default for desktop
    
    vec.set(
        playerPos.x + cameraOffset.x, 
        playerPos.y + cameraOffset.y, 
        playerPos.z + cameraOffset.z
    )
    
    // Smoother lerp (0.1 is standard, 0.05 is cinematic)
    state.camera.position.lerp(vec, 0.1)
    state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z)
  })

  return (
    <RigidBody 
      ref={rb} 
      colliders="ball" 
      position={[0, 2, 0]} 
      restitution={0.4} // Reduced slightly to prevent "infinite bouncing"
      friction={1}
      linearDamping={0.8} // Increased damping for more "control" on mobile
      angularDamping={0.8}
    >
      <Trail
        width={1.2}
        length={6}
        color={new THREE.Color(hasWon ? "#00ffff" : "#ff69b4")}
        attenuation={(t) => t * t}
      >
        <mesh castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial 
            color={hasWon ? "#00ffff" : "hotpink"} 
            roughness={0.1} 
            metalness={0.9}
            emissive={hasWon ? "#00ffff" : "hotpink"}
            emissiveIntensity={hasWon ? 5 : 1}
          />
        </mesh>
      </Trail>
      <pointLight 
        intensity={hasWon ? 10 : 3} 
        distance={10} 
        color={hasWon ? "#00ffff" : "hotpink"} 
      />
    </RigidBody>
  )
}