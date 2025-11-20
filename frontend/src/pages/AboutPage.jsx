import { motion } from "motion/react";
import ParticleBackground from "../components/ParticleBackground";
import TiltCard from "../components/TiltCard";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-4xl mx-auto pt-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text dark:text-white">
            The Intelligence of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-text to-primary animate-gradient-x dark:via-white">
              Gradual Growth
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-light">
            Elemental AI embodies Utibe Okuk’s Elemental Business Model (EBM).
            It doesn’t just give answers — it breaks businesses into elements,
            identifies the cheapest entry point, and shows 7 other
            money-generating paths.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <TiltCard className="glass-card p-10 space-y-6 border-white/5 hover:border-accent/30">
            <h3 className="text-3xl font-bold text-accent">Core Vision</h3>
            <p className="text-text-muted text-lg leading-relaxed">
              To help individuals and businesses find their starting point,
              pivot intelligently, and scale sustainably — using the principle
              of elemental growth. We believe that every massive empire starts
              with a single, well-placed element.
            </p>
          </TiltCard>
          <TiltCard className="glass-card p-10 space-y-6 border-white/5 hover:border-accent/30">
            <h3 className="text-3xl font-bold text-accent">Mission</h3>
            <p className="text-text-muted text-lg leading-relaxed">
              To give structure to dreams, direction to ideas, and
              sustainability to businesses — one element at a time. We provide
              the tools, frameworks, and AI-powered insights to turn chaos into
              clarity.
            </p>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
