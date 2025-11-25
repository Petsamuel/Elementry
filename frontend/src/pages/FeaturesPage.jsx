import { motion } from "motion/react";
import {
  Layers,
  GitBranch,
  Target,
  MessageSquare,
  Map,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import TiltCard from "../components/TiltCard";
import ParticleBackground from "../components/ParticleBackground";

export default function FeaturesPage() {
  const features = [
    {
      icon: Layers,
      title: "Deconstruction Engine",
      desc: "Break any idea into 7 actionable sub-businesses using the Elemental Business Model.",
      color: "text-blue-400",
    },
    {
      icon: GitBranch,
      title: "Pivot & Fix Module",
      desc: "Diagnose weak links and find 7 adjacent pivot opportunities for recovery.",
      color: "text-purple-400",
    },
    {
      icon: Target,
      title: "Cheapest Point Engine",
      desc: "Identify the single least-cost, high-impact entry point to start immediately.",
      color: "text-green-400",
    },
    {
      icon: MessageSquare,
      title: "Elemental Coach",
      desc: "Guidance with the wisdom, tone, and practical logic of Utibe Okuk.",
      color: "text-orange-400",
    },
    {
      icon: Map,
      title: "Sustainability Blueprint",
      desc: "Generate roadmaps for gradual funding and community expansion.",
      color: "text-cyan-400",
    },
    {
      icon: Brain,
      title: "Growth Intelligence",
      desc: "AI that thinks like a builder, turning limitations into strategic advantages.",
      color: "text-accent",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-text dark:text-white tracking-tight"
          >
            The Intelligence of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Gradual Growth
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-muted leading-relaxed"
          >
            Start where you are, grow element by element. A complete toolkit to
            deconstruct, pivot, and scale your business using the Elemental
            Business Model.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <TiltCard className="glass-card p-8 h-full hover:bg-white/10 transition-colors group border border-white/5">
                <div
                  className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-white/5`}
                >
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-text dark:text-white mb-4 group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                <p className="text-text-muted leading-relaxed">{f.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Sections */}
        <div className="mt-40 space-y-40">
          {[
            {
              title: "Business Deconstruction",
              subtitle: "Don't just build a business. Build an ecosystem.",
              desc: "Our engine takes your core idea and explodes it into 7 distinct revenue streams—from production to content monetization. See the hidden value chains you're missing.",
              points: [
                "Identify 7 sub-businesses instantly",
                "Uncover hidden revenue streams",
                "Map out your entire value chain",
              ],
              image: "bg-gradient-to-br from-blue-600/20 to-purple-600/20",
              icon: Layers,
            },
            {
              title: "The Cheapest Point Strategy",
              subtitle: "Start Small, Start Smart.",
              desc: "Why risk everything? We identify the single most effective entry point that requires the least capital but offers the highest validation. Turn your limitations into a strategy.",
              points: [
                "Find your lowest barrier to entry",
                "Validate before you scale",
                "Minimize financial risk",
              ],
              image: "bg-gradient-to-br from-green-600/20 to-emerald-600/20",
              reverse: true,
              icon: Target,
            },
            {
              title: "Strategic Pivoting",
              subtitle: "Stuck? Reinvent your trajectory.",
              desc: "We don't just tell you to 'work harder'. We analyze your supply, sales, and strategy to reveal 7 concrete pivot options. Turn a dead end into a new beginning.",
              points: [
                "Diagnose critical weak links",
                "Discover adjacent market opportunities",
                "Generate a step-by-step recovery plan",
              ],
              image: "bg-gradient-to-br from-orange-600/20 to-red-600/20",
              icon: GitBranch,
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row items-center gap-20 ${
                section.reverse ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-bold uppercase tracking-wider">
                  <section.icon size={16} />
                  {section.title}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-text dark:text-white leading-tight">
                  {section.subtitle}
                </h2>
                <p className="text-xl text-text-muted leading-relaxed">
                  {section.desc}
                </p>
                <ul className="space-y-4">
                  {section.points.map((point, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <CheckCircle2 className="text-accent w-5 h-5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full aspect-square lg:aspect-video rounded-3xl overflow-hidden glass-panel p-2 relative group">
                <div className="absolute inset-0 bg-accent/5 blur-3xl group-hover:bg-accent/10 transition-colors duration-700" />
                <div
                  className={`w-full h-full rounded-2xl ${section.image} border border-white/10 relative overflow-hidden`}
                >
                  {/* Abstract Visuals Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <section.icon size={120} className="text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
