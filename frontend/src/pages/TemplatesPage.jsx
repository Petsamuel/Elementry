import { motion } from "motion/react";
import {
  Layout,
  ShoppingBag,
  Smartphone,
  Globe,
  Coffee,
  Briefcase,
} from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";
import TiltCard from "../components/TiltCard";

export default function TemplatesPage() {
  const templates = [
    {
      title: "SaaS Platform",
      category: "Software",
      icon: <Layout className="w-6 h-6" />,
      description: "Subscription-based software model with tiered pricing.",
      color: "text-blue-400",
    },
    {
      title: "E-commerce Store",
      category: "Retail",
      icon: <ShoppingBag className="w-6 h-6" />,
      description: "Direct-to-consumer retail model with inventory management.",
      color: "text-accent",
    },
    {
      title: "Mobile App",
      category: "Mobile",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Freemium mobile application with in-app purchases.",
      color: "text-purple-400",
    },
    {
      title: "Marketplace",
      category: "Platform",
      icon: <Globe className="w-6 h-6" />,
      description: "Two-sided marketplace connecting buyers and sellers.",
      color: "text-green-400",
    },
    {
      title: "Subscription Box",
      category: "DTC",
      icon: <Coffee className="w-6 h-6" />,
      description: "Curated monthly delivery service model.",
      color: "text-orange-400",
    },
    {
      title: "Consulting Agency",
      category: "Service",
      icon: <Briefcase className="w-6 h-6" />,
      description: "High-ticket service provider model.",
      color: "text-pink-400",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden pb-20">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-3xl mx-auto pt-10"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text dark:text-white">
            Business <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-text to-primary animate-gradient-x dark:via-white">
              Templates
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-text-muted leading-relaxed font-light">
            Jumpstart your journey with proven business model structures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <TiltCard
              key={index}
              className="glass-card p-8 hover:bg-white/10 transition-colors cursor-pointer group border-white/5 hover:border-accent/30"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform border border-white/10 ${template.color}`}
                >
                  {template.icon}
                </div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider border border-white/10 px-3 py-1 rounded-full bg-black/5 dark:bg-black/40">
                  {template.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-text dark:text-white mb-3 group-hover:text-accent transition-colors">
                {template.title}
              </h3>
              <p className="text-text-muted text-lg leading-relaxed">
                {template.description}
              </p>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}
