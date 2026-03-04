"use client"
import { Canvas } from "@react-three/fiber"
import Experience from "@/components/Experience"
import { useGameStore } from "@/hooks/useGameStore"
import { KeyboardControls, Loader, useKeyboardControls } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import * as THREE from 'three'

// Helper component for mobile buttons
const TouchBtn = ({ icon, onStart, onEnd, className = "" }: any) => (
  <button 
    // preventDefault is crucial to stop "ghost clicks" and page scrolling
    onTouchStart={(e) => { e.preventDefault(); onStart(); }} 
    onTouchEnd={(e) => { e.preventDefault(); onEnd(); }}
    onMouseDown={onStart} 
    onMouseUp={onEnd}
    className={`w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-2xl active:bg-cyan-500 transition-colors select-none touch-none border border-white/10 pointer-events-auto ${className}`}
  >
    {icon}
  </button>
)

const GameUI = ({ gameStarted }: { gameStarted: boolean }) => {
  const { count, totalItems, hasWon, currentMessage, currentIndex, quizData } = useGameStore()
  const currentQuestion = quizData[currentIndex]
  
  // FIX: Casting to any to bypass the "Expected 0 arguments" TS error
  const [, setKeys] = useKeyboardControls() as any

  const handleTouch = (key: string, pressed: boolean) => {
    // This now correctly updates the keyboard state store in Drei
    setKeys({ [key]: pressed })
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-between p-6 md:p-12">
      {/* Top: Score & Question */}
      <div className="w-full flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 pointer-events-auto">
          <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase mb-1">Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl text-white font-black leading-none">{count}</span>
            <span className="text-slate-500 font-bold">/ {totalItems}</span>
          </div>
        </div>

        {gameStarted && !hasWon && currentQuestion && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            key={currentIndex} 
            className="w-full max-w-xl text-center flex flex-col gap-4 self-center"
          >
            <div className="bg-black/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
              <span className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">Question {currentIndex + 1}</span>
              <h2 className="text-white text-lg md:text-2xl font-medium mt-1 leading-tight">{currentQuestion.question}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 px-4">
              {['a', 'b', 'c', 'd'].map((label) => (
                <div key={label} className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500 text-black text-[10px] font-black flex items-center justify-center uppercase">{label}</span>
                  <span className="text-white/80 text-xs font-bold truncate">{(currentQuestion as any)[label]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Center: Feedback Messages */}
      <div className="h-20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.2 }}
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-3xl backdrop-blur-2xl text-xl font-bold italic shadow-2xl"
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Touch Controls */}
      <div className="w-full flex justify-between items-end pb-4">
        {!hasWon && gameStarted && (
          <>
            {/* D-Pad (Visible on mobile only) */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
              <div />
              <TouchBtn icon="▲" onStart={() => handleTouch('forward', true)} onEnd={() => handleTouch('forward', false)} />
              <div />
              <TouchBtn icon="◀" onStart={() => handleTouch('left', true)} onEnd={() => handleTouch('left', false)} />
              <TouchBtn icon="▼" onStart={() => handleTouch('backward', true)} onEnd={() => handleTouch('backward', false)} />
              <TouchBtn icon="▶" onStart={() => handleTouch('right', true)} onEnd={() => handleTouch('right', false)} />
            </div>

            {/* Jump Button (Visible on mobile only) */}
            <div className="md:hidden">
              <TouchBtn 
                icon="JUMP" 
                className="w-20 h-20 rounded-full border-2 border-cyan-400 !text-[10px] font-black text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                onStart={() => handleTouch('jump', true)} 
                onEnd={() => handleTouch('jump', false)} 
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [gameStarted, setGameStarted] = useState(false)
  
  // These names MUST match the names used in Player.tsx (forward, backward, etc.)
  const map = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
  ]

  return (
    <main className="h-screen w-full bg-[#050505] relative overflow-hidden font-sans touch-none select-none">
      <AnimatePresence>
        {!gameStarted && (
          <motion.div 
            exit={{ opacity: 0, y: -100 }} 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white text-5xl font-black text-center mb-8 tracking-tighter"
            >
              THE ULTIMATE <br/>
              <span className="text-cyan-400 italic font-serif">Quiz Quest.</span>
            </motion.h1>
            <button 
              onClick={() => setGameStarted(true)} 
              className="px-10 py-5 bg-white text-black font-black rounded-full hover:scale-110 active:scale-95 transition-transform cursor-pointer pointer-events-auto shadow-xl"
            >
              START ADVENTURE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <KeyboardControls map={map}>
        <GameUI gameStarted={gameStarted} />
        <Canvas 
          shadows 
          camera={{ position: [0, 8, 12], fov: 45 }}
          dpr={[1, 2]} // Performance optimization for mobile retina displays
        >
          <Experience />
        </Canvas>
      </KeyboardControls>
      
      <Loader />
    </main>
  )
}