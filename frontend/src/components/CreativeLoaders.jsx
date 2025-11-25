import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Lock,
  Unlock,
  Zap,
  Cpu,
  Binary,
  Code2,
  Scan,
  ShieldCheck,
} from "lucide-react";
import { useState, useEffect } from "react";

// --- DeconstructLoader: Architectural Scanning & Data Parsing ---
export const DeconstructLoader = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Generate random particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    scale: 0.5 + Math.random() * 1.5,
  }));

  // Matrix-style code rain characters
  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const matrixColumns = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    chars: Array.from({ length: 20 }, () =>
      matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
    ),
    delay: Math.random() * 2,
    left: (i / 40) * 100,
    speed: 2 + Math.random() * 3,
  }));

  // Analysis stages
  const stages = [
    "Gathering information...",
    "Fetching data...",
    "Loading...",
    "Preparing...",
  ];

  // Cycle through stages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % stages.length);
    }, 2500); // Change stage every 2.5 seconds

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-100 overflow-hidden flex items-center justify-center">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-[0.07]">
        {matrixColumns.map((col) => (
          <motion.div
            key={col.id}
            className="absolute top-0 font-mono text-accent text-[10px] leading-none"
            style={{ left: `${col.left}%` }}
            initial={{ y: -200 }}
            animate={{ y: "120vh" }}
            transition={{
              duration: col.speed,
              repeat: Infinity,
              delay: col.delay,
              ease: "linear",
            }}
          >
            {col.chars.map((char, i) => (
              <div key={i} style={{ opacity: 1 - i / 20 }}>
                {char}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,22,0.05),transparent_60%)]" />

      {/* Central Scanning Interface */}
      <div className="relative w-[500px] h-[500px] flex items-center justify-center">
        {/* Rotating Rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute border border-accent/20 rounded-full"
            style={{
              width: `${i * 150}px`,
              height: `${i * 150}px`,
              borderStyle: i % 2 === 0 ? "dashed" : "solid",
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}

        {/* Scanning Beam */}
        <motion.div
          className="absolute w-full h-1 bg-accent/50 shadow-[0_0_20px_rgba(200,255,22,0.5)]"
          animate={{ top: ["0%", "100%", "0%"], opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Central Core */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="relative z-10 p-6 bg-black/50 backdrop-blur-md rounded-2xl border border-accent/30 shadow-[0_0_30px_rgba(200,255,22,0.2)]"
            >
              <Cpu className="w-16 h-16 text-accent" />
            </motion.div>
            {/* Pulse Effect */}
            <motion.div
              className="absolute inset-0 bg-accent/20 rounded-2xl"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          {/* Dynamic Text with Stage Cycling */}
          <div className="h-8 overflow-hidden flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-accent font-mono text-sm tracking-widest uppercase"
              >
                {stages[currentStageIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-accent"
              animate={{
                width: [
                  `${(currentStageIndex / stages.length) * 100}%`,
                  `${((currentStageIndex + 1) / stages.length) * 100}%`,
                ],
              }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* Floating Data Fragments */}
      {particles.slice(0, 10).map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-[8px] text-accent/40 font-mono"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ opacity: [0, 1, 0], y: [0, -20] }}
          transition={{ duration: 2, repeat: Infinity, delay: p.delay }}
        >
          0x{Math.floor(Math.random() * 1000).toString(16)}
        </motion.div>
      ))}
    </div>
  );
};

// --- StrategyUnlockLoader: Cryptographic Decryption ---
export const StrategyUnlockLoader = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  const stages = [
    "Gathering Market Data...",
    "Analyzing Competitive Landscape...",
    "Decrypting Strategic Patterns...",
    "Validating Pivot Vectors...",
    "Synthesizing Recommendations...",
  ];

  // Cycle through stages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev + 1) % stages.length);
    }, 2000); // Change stage every 2 seconds

    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div className="fixed inset-0 bg-[#050505] z-100 flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Lock Mechanism */}
        <div className="relative mb-12">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-[-20px] rounded-full border border-dashed border-accent/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <div className="w-32 h-32 rounded-2xl bg-black/50 border border-accent/30 backdrop-blur-xl flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(200,255,22,0.15)]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Lock className="w-12 h-12 text-accent" />
            </motion.div>

            {/* Scanning Line over Lock */}
            <motion.div
              className="absolute inset-x-0 h-[2px] bg-accent/80 shadow-[0_0_10px_#c8ff16]"
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Decrypting Text with Stage Cycling */}
        <div className="space-y-2 text-center">
          <motion.div
            className="text-2xl font-bold text-white tracking-tight"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            UNLOCKING STRATEGY
          </motion.div>
          <div className="h-6 overflow-hidden flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageIndex}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 justify-center text-xs font-mono text-accent/70"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>{stages[currentStageIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Binary Stream */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-1 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-8 bg-accent"
              animate={{ height: [10, 30, 10], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
