import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Lock, Unlock, Zap, Cpu, Binary, Code2 } from "lucide-react";

// --- DeconstructLoader: Particle Explosion & Morphing Shapes ---
export const DeconstructLoader = () => {
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
  const matrixColumns = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    chars: Array.from({ length: 15 }, () =>
      matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
    ),
    delay: Math.random() * 2,
    left: (i / 30) * 100,
  }));

  // Analysis stages
  const stages = [
    "Analyzing Architecture",
    "Deconstructing Components",
    "Mapping Revenue Streams",
    "Calculating Viability",
    "Generating Insights",
  ];

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] overflow-hidden">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-10">
        {matrixColumns.map((col) => (
          <motion.div
            key={col.id}
            className="absolute top-0 font-mono text-accent text-xs"
            style={{ left: `${col.left}%` }}
            initial={{ y: -100 }}
            animate={{ y: "100vh" }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: col.delay,
              ease: "linear",
            }}
          >
            {col.chars.map((char, i) => (
              <div key={i} className="opacity-50">
                {char}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Radial Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,22,0.15),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(89,65,255,0.1),transparent_60%)]" />

      {/* Particle Explosion */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `linear-gradient(135deg, #c8ff16, #5941ff)`,
            boxShadow: "0 0 20px rgba(200, 255, 22, 0.8)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, particle.scale, 0],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central Morphing Shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Outer Ring */}
          <motion.div
            className="w-64 h-64 border-4 border-accent/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Middle Hexagon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div
              className="w-40 h-40 border-4 border-primary/50"
              style={{
                clipPath:
                  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            />
          </motion.div>

          {/* Inner Triangle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-24 h-24 bg-linear-to-br from-accent/20 to-primary/20 backdrop-blur-sm"
              style={{
                clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
              }}
            />
          </motion.div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Cpu className="w-12 h-12 text-accent drop-shadow-[0_0_20px_rgba(200,255,22,0.8)]" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating Text Fragments */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {stages.map((stage, i) => (
          <motion.div
            key={i}
            className="absolute text-white/80 font-mono text-sm font-bold"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [20, 0, 0, -20],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          >
            {stage}
          </motion.div>
        ))}
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-6">
        <motion.div
          className="flex items-center gap-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* <Sparkles className="w-6 h-6 text-accent" /> */}
          <span className="text-xl font-bold text-white">
            Deconstructing Your Idea
          </span>
          {/* <Sparkles className="w-6 h-6 text-accent" /> */}
        </motion.div>

        {/* Progress Bar */}
        <div className="w-96 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-primary via-accent to-primary"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>

      {/* Scan Lines Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200, 255, 22, 0.03) 2px, rgba(200, 255, 22, 0.03) 4px)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
};

// --- StrategyUnlockLoader: Lock Animation & Circuit Patterns ---
export const StrategyUnlockLoader = () => {
  // Circuit nodes
  const circuitNodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 10 + (i % 5) * 20,
    y: 20 + Math.floor(i / 5) * 20,
    delay: i * 0.1,
  }));

  // Hexagonal grid
  const hexagons = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: 15 + (i % 5) * 18,
    y: 15 + Math.floor(i / 5) * 25,
    delay: i * 0.15,
  }));

  return (
    <div className="fixed inset-0 bg-linear-to-br from-black via-[#0a0a0a] to-black backdrop-blur-xl z-[100] overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(200, 255, 22, 0.3)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Hexagonal Grid Transformation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {hexagons.map((hex) => (
          <motion.div
            key={hex.id}
            className="absolute w-16 h-16 border-2 border-accent/20"
            style={{
              left: `${hex.x}%`,
              top: `${hex.y}%`,
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0, 1, 1.2],
              rotate: [0, 180],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: hex.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Circuit Board Pattern */}
      <div className="absolute inset-0">
        {circuitNodes.map((node, i) => (
          <motion.div key={node.id}>
            {/* Node */}
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-accent"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                boxShadow: "0 0 20px rgba(200, 255, 22, 0.8)",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: node.delay,
              }}
            />
            {/* Connecting Lines */}
            {i < circuitNodes.length - 1 && (
              <motion.div
                className="absolute h-0.5 bg-gradient-to-r from-accent/50 to-primary/50 origin-left"
                animate={{ scaleX: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: node.delay,
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Central Lock/Unlock Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Energy Waves */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-4 border-accent/30"
              style={{ width: "300px", height: "300px" }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: [0.5, 2],
                opacity: [0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Lock Container */}
          <motion.div
            className="relative z-10 w-32 h-32 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 backdrop-blur-xl border-2 border-white/10 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px rgba(200, 255, 22, 0.3)",
                "0 0 60px rgba(200, 255, 22, 0.6)",
                "0 0 30px rgba(200, 255, 22, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key="lock-unlock"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Lock className="w-16 h-16 text-accent drop-shadow-[0_0_30px_rgba(200,255,22,0.8)]" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Orbiting Particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-accent"
              style={{
                boxShadow: "0 0 15px rgba(200, 255, 22, 0.8)",
              }}
              animate={{
                rotate: 360,
                x: [0, 80 * Math.cos((i * Math.PI) / 2)],
                y: [0, 80 * Math.sin((i * Math.PI) / 2)],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Glitch Effect Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <div className="w-full h-full bg-linear-to-r from-transparent via-accent/20 to-transparent" />
      </motion.div>

      {/* Holographic Scan Line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent to-transparent"
        style={{
          boxShadow: "0 0 20px rgba(200, 255, 22, 0.8)",
        }}
        animate={{
          top: ["0%", "100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Bottom Status */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center gap-6">
        <motion.div
          className="flex items-center gap-3"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap className="w-6 h-6 text-accent" />
          <span className="text-xl font-bold text-white">
            Unlocking Strategy
          </span>
          <Zap className="w-6 h-6 text-accent" />
        </motion.div>

        {/* Circular Progress */}
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="4"
              fill="none"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke="#c8ff16"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0 251.2" }}
              animate={{ strokeDasharray: "251.2 0" }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Binary className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map(
        (corner) => (
          <motion.div
            key={corner}
            className={`absolute w-20 h-20 border-accent/50 ${
              corner.includes("top") ? "border-t-2" : "border-b-2"
            } ${corner.includes("left") ? "border-l-2" : "border-r-2"} ${
              corner.includes("top") ? "top-8" : "bottom-8"
            } ${corner.includes("left") ? "left-8" : "right-8"}`}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay:
                corner === "top-left"
                  ? 0
                  : corner === "top-right"
                  ? 0.5
                  : corner === "bottom-left"
                  ? 1
                  : 1.5,
            }}
          />
        )
      )}
    </div>
  );
};
