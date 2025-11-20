import { motion } from "motion/react";
import { useMemo } from "react";

export default function ParticleBackground() {
  // Memoize particle configurations to avoid calling impure functions during render
  const particles = useMemo(() => {
    return [...Array(20)].map(() => ({
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      initialScale: Math.random() * 0.5 + 0.5,
      animateX: Math.random() * window.innerWidth,
      animateY: Math.random() * window.innerHeight,
      duration: Math.random() * 10 + 10,
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute bg-accent/20 rounded-full blur-xl"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            scale: particle.initialScale,
          }}
          animate={{
            x: particle.animateX,
            y: particle.animateY,
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: particle.width,
            height: particle.height,
          }}
        />
      ))}
    </div>
  );
}
