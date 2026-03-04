import { create } from 'zustand'

const quizData = [
  { 
    question: "Agar hamari dosti mein koi 'Bug' aa jaye, toh aap kya karoge?", 
    a: "Friendship delete kar doge", 
    b: "Code phatne doge", 
    c: "Baith kar 'Debug' karoge aur sab thik karoge", 
    d: "Naya project (dost) dhundoge", 
    correct: "c" 
  },
  { 
    question: "Mere liye aapki jagah kya hai hamari life ke code mein?", 
    a: "Ek faltu ka Comment", 
    b: "Semicolon; jiske bina sab ruk jata hai", 
    c: "Infinite loop jo dimaag khata hai", 
    d: "404 Error", 
    correct: "b" 
  },
  { 
    question: "Agar hamari yaari ka 'Version Control' ho, toh hum kaunse stage par hain?", 
    a: "Beta testing (Abhi shuruat hai)", 
    b: "Deprecated (Purane ho gaye)", 
    c: "vInfinity.0 (Hamesha ke liye stable!)", 
    d: "Merge Conflict", 
    correct: "c" 
  },
  { 
    question: "Jab main emotional hota hoon, toh aap mere liye kya ho?", 
    a: "Stack Overflow (Saare solutions mil jate hain)", 
    b: "Slow Internet Connection", 
    c: "System Crash", 
    d: "Not Responding", 
    correct: "a" 
  },
  { 
    question: "Wada karo, chahe life mein kitne bhi 'Frameworks' badal jayein...", 
    a: "Humara 'Legacy Code' hamesha chalega", 
    b: "Hum ek dusre ko 'Git Ignore' nahi karenge", 
    c: "Hum hamesha 'Connected' rahenge", 
    d: "A, B aur C teno (Commitment hai!)", 
    correct: "d" 
  },
];

// Funny CSE Style Messages
const gratitudeMessages = [
  "Logic ek dum 200 OK hai! 🚀", 
  "Compiler khush hua! You're a Genius! 💻✨", 
  "Syntax Error zero! Dosti super-hit! 💖", 
  "Full Stack Bestie ho aap toh! 😎",
  "Commit successful! Dil jeet liya! 📥🔥"
];

const failMessages = [
  "Error 404: Dimag not found! 😂💅", 
  "Segmentation Fault! Itna galat kaise? 😅", 
  "Dosti compile nahi ho rahi, try again! 🧊",
  "Gaddari? Lagta hai logic gate kharab hai! ❌😜"
];

interface GameState {
  count: number
  currentIndex: number
  totalItems: number
  hasWon: boolean
  currentMessage: string | null
  quizData: typeof quizData
  checkAnswer: (label: string) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  count: 0,
  currentIndex: 0,
  totalItems: quizData.length,
  hasWon: false,
  currentMessage: null,
  quizData: quizData,

  checkAnswer: (selectedOption) => {
    const state = get();
    const isCorrect = selectedOption === state.quizData[state.currentIndex].correct;
    const nextIndex = state.currentIndex + 1;
    const isWon = isCorrect && nextIndex >= state.quizData.length;

    set({
      count: isCorrect ? state.count + 1 : state.count,
      currentMessage: isCorrect 
        ? gratitudeMessages[Math.floor(Math.random() * gratitudeMessages.length)]
        : failMessages[Math.floor(Math.random() * failMessages.length)],
      currentIndex: (isCorrect && !isWon) ? nextIndex : state.currentIndex,
      hasWon: isWon,
    });

    setTimeout(() => {
      set({ currentMessage: null });
    }, 2500);
  },
}))