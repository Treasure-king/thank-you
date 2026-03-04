"use client"
import { useKeyboardControls, Trail } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody, RapierRigidBody } from "@react-three/rapier"
import { useRef } from "react"
import * as THREE from "three"
import { useGameStore } from "@/hooks/useGameStore"

export default function Player() {
  const rb = useRef<RapierRigidBody>(null)
  const [, getKeys] = useKeyboardControls()
  const hasWon = useGameStore((state) => state.hasWon)

  // Vec3 helpers for performance
  const vec = new THREE.Vector3()
  // Final camera position for the "Thank You" message shot
  const targetCameraPos = new THREE.Vector3(0, 5, 12) 
  const targetLookAt = new THREE.Vector3(0, 2, 0)

  useFrame((state, delta) => {
    if (!rb.current) return

    // 1. Victory Camera & Physics Freeze
    if (hasWon) {
      // Ball ko slow karke stop kar do
      rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      rb.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      
      // Smoothly move camera to the victory spot
      state.camera.position.lerp(targetCameraPos, 0.03)
      
      // Look towards the center message
      const currentLookAt = new THREE.Vector3()
      state.camera.getWorldDirection(currentLookAt)
      state.camera.lookAt(targetLookAt)
      return 
    }

    // 2. Movement Logic (Only if not won)
    const { forward, backward, left, right, jump } = getKeys()
    const impulse = { x: 0, y: 0, z: 0 }
    const strength = 10 * delta // Thoda fast kiya for better feel
    
    if (forward) impulse.z -= strength
    if (backward) impulse.z += strength
    if (left) impulse.x -= strength
    if (right) impulse.x += strength

    rb.current.applyImpulse(impulse, true)

    // 3. Jump Logic
    // Height check to prevent infinite jumping
    if (jump && Math.abs(rb.current.translation().y) < 0.55) {
      rb.current.applyImpulse({ x: 0, y: 4, z: 0 }, true)
    }

    // 4. Smooth Follow Camera (During Play)
    const playerPos = rb.current.translation()
    const cameraOffset = new THREE.Vector3(0, 10, 15) 
    
    vec.set(playerPos.x + cameraOffset.x, playerPos.y + cameraOffset.y, playerPos.z + cameraOffset.z)
    state.camera.position.lerp(vec, 0.1)
    state.camera.lookAt(playerPos.x, playerPos.y, playerPos.z)
  })

  return (
    <RigidBody 
      ref={rb} 
      colliders="ball" 
      position={[0, 2, 0]} 
      restitution={0.6}
      friction={1}
      linearDamping={0.6} // Controls how fast it slows down
      angularDamping={0.6}
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
            emissiveIntensity={hasWon ? 5 : 0.8}
          />
        </mesh>
      </Trail>
      
      <pointLight intensity={hasWon ? 5 : 2} distance={10} color={hasWon ? "#00ffff" : "hotpink"} />
    </RigidBody>
  )
}