import { motion } from "motion/react";
import {
  Zap,
  Shield,
  Smartphone,
  Globe,
  BarChart,
  Cpu,
  ArrowRight,
} from "lucide-react";
import TiltCard from "../components/TiltCard";
import ParticleBackground from "../components/ParticleBackground";

export default function FeaturesPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Optimized for speed with zero-latency edge deployment.",
      color: "text-accent",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Bank-grade encryption and SOC2 compliance out of the box.",
      color: "text-blue-400",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      desc: "Responsive design that works perfectly on any device.",
      color: "text-pink-400",
    },
    {
      icon: Globe,
      title: "Global Scale",
      desc: "Deploy to 35+ regions automatically with a single click.",
      color: "text-green-400",
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      desc: "Track every metric that matters with live dashboards.",
      color: "text-purple-400",
    },
    {
      icon: Cpu,
      title: "AI Powered",
      desc: "Built-in generative AI capabilities for next-gen apps.",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
      <ParticleBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-text dark:text-white tracking-tight"
          >
            Everything you need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Scale Faster
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-muted"
          >
            A complete toolkit for modern founders. Stop reinventing the wheel
            and start building your empire.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <TiltCard className="glass-card p-8 h-full hover:bg-white/10 transition-colors group">
                <div
                  className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}
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

        {/* Feature Deep Dive */}
        <div className="mt-32 space-y-32">
          {[
            {
              title: "Global Infrastructure",
              desc: "Don't worry about servers. We handle the complexity of distributed systems so you can focus on your product.",
              image: "bg-gradient-to-br from-blue-600/20 to-purple-600/20",
            },
            {
              title: "Advanced Security",
              desc: "Sleep soundly knowing your data is protected by state-of-the-art encryption and security protocols.",
              image: "bg-gradient-to-br from-green-600/20 to-emerald-600/20",
              reverse: true,
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-16 ${
                section.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-text dark:text-white">
                  {section.title}
                </h2>
                <p className="text-xl text-text-muted leading-relaxed">
                  {section.desc}
                </p>
                <button className="group flex items-center gap-2 text-accent font-bold uppercase tracking-wider hover:gap-4 transition-all">
                  Learn more <ArrowRight size={20} />
                </button>
              </div>
              <div className="flex-1 w-full aspect-video rounded-2xl overflow-hidden glass-panel p-2">
                <div
                  className={`w-full h-full rounded-xl ${section.image} border border-white/10`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
