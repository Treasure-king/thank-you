"use client"
import { Canvas } from "@react-three/fiber"
import Experience from "@/components/Experience"
import { useGameStore } from "@/hooks/useGameStore"
import { KeyboardControls, Loader } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import * as THREE from 'three'

const GameUI = ({ gameStarted }: any) => {
  const { count, totalItems, hasWon, currentMessage, currentIndex, quizData } = useGameStore()
  const currentQuestion = quizData[currentIndex]

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-8 md:p-12">
      <div className="w-full flex justify-between items-start">
        {/* Score Tracker */}
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase mb-1">Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl text-white font-black leading-none">{count}</span>
            <span className="text-slate-500 font-bold">/ {totalItems}</span>
          </div>
        </div>

        {/* Central Question & Options Panel */}
        {gameStarted && !hasWon && currentQuestion && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, x:300, opacity: 1 }}
            key={currentIndex}
            className="absolute left-1/2 -translate-x-1/2 top-12 w-full max-w-xl text-center flex flex-col gap-4"
          >
            {/* Question Card */}
            <div className="bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
              <span className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">Question {currentIndex + 1}</span>
              <h2 className="text-white text-xl md:text-2xl font-medium mt-2 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* NEW: Options Legend (Taaki player ko pata ho kahan jana hai) */}
            <div className="grid grid-cols-2 gap-3 px-4">
              {['a', 'b', 'c', 'd'].map((label) => (
                <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center uppercase">
                    {label}
                  </span>
                  <span className="text-white/80 text-xs font-bold truncate">
                    {(currentQuestion as any)[label]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {hasWon && (
          <button
            onClick={() => window.location.reload()}
            className="pointer-events-auto bg-white text-black text-xs font-black px-8 py-4 rounded-full hover:bg-cyan-400 transition-colors cursor-pointer"
          >
            PLAY AGAIN
          </button>
        )}
      </div>

      {/* Feedback Messages */}
      <div className="relative w-full flex justify-center items-center h-20">
        <AnimatePresence mode="wait">
          {currentMessage && (
            <motion.div 
              key={currentMessage}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -20 }}
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-3xl backdrop-blur-2xl text-xl font-bold italic shadow-2xl"
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Hint */}
      <div className="flex flex-col items-center gap-4">
        {!hasWon && gameStarted && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex gap-4 items-center bg-black/40 px-6 py-2 rounded-full border border-white/5"
          >
            <kbd className="text-cyan-400 font-mono text-sm">WASD</kbd>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">to move & collect answers</span>
            <kbd className="text-cyan-400 font-mono text-sm ml-5">Spacebar</kbd>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">to Jump</span>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)

  const map = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
  ]

  return (
    <main className="h-screen w-full bg-[#050505] relative overflow-hidden font-sans">
      <AnimatePresence>
        {!gameStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.h1 className="text-white text-5xl font-black tracking-tighter mb-4 text-center">
              THE ULTIMATE <br/> <span className="text-cyan-400 font-serif italic text-6xl">Quiz Quest.</span>
            </motion.h1>
            <button 
              onClick={() => setGameStarted(true)}
              className="px-10 py-5 bg-white text-black font-black rounded-full hover:scale-110 transition-transform active:scale-95 duration-300 pointer-events-auto cursor-pointer"
            >
              START ADVENTURE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <GameUI gameStarted={gameStarted} />

      <KeyboardControls map={map}>
        <Canvas shadows={{ type: THREE.PCFShadowMap }} // PCFSoftShadowMap ki jagah sirf PCFShadowMap
  camera={{ position: [0, 8, 12], fov: 45 }}>
          <Experience />
        </Canvas>
      </KeyboardControls>
      
      <Loader />
    </main>
  )
}