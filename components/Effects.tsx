"use client"
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing"
import { useGameStore } from "@/hooks/useGameStore"
import { BlendFunction } from "postprocessing"

export default function Effects() {
  const hasWon = useGameStore((state) => state.hasWon)

  return (
    <EffectComposer>
      <Bloom 
        luminanceThreshold={1} 
        mipmapBlur 
        // We use a simple ternary instead of a GSAP ref to avoid circular serialization
        intensity={hasWon ? 3 : 1.5} 
        radius={0.4} 
      />
      
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
      
      <ChromaticAberration 
        offset={hasWon ? [0.002, 0.002] : [0.0005, 0.0005]} 
      />

      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  )
}