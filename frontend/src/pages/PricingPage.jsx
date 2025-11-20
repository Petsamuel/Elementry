import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import TiltCard from "../components/TiltCard";
import ParticleBackground from "../components/ParticleBackground";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "0",
      desc: "Perfect for testing your idea and seeing how Elemental AI works.",
      features: [
        "1 Active Project",
        "Basic Idea Deconstruction",
        "Basic Pivot Suggestions",
        "Cheapest Entry Point Finder",
        "Standard Templates",
        "Limited AI Generation (10/mo)",
        "Community Support",
      ],
      notIncluded: [],
    },
    {
      name: "Pro",
      price: "29",
      desc: "For founders building real products and exploring multiple revenue paths.",
      popular: true,
      features: [
        "Unlimited Projects",
        "Full Idea Deconstruction (7 Elements)",
        "Full Pivot Engine",
        "Full Cheapest Point Engine",
        "Advanced Templates",
        "AI Generation (150/mo)",
        "Save & Export Blueprints",
        "Priority Support",
        "Light Team Collaboration (2 seats)",
      ],
      notIncluded: [],
    },
    {
      name: "Empire",
      price: "99",
      desc: "For teams, consultants, agencies, and organizations that need scale.",
      features: [
        "Everything in Pro",
        "Unlimited AI Generation",
        "Team Collaboration (10 seats)",
        "White-label Blueprint Exports",
        "Custom Domain & Branding",
        "SSO (Google / Firebase / Magic Links)",
        "Audit Logs",
        "24/7 Dedicated Support",
      ],
      notIncluded: [],
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
            Simple, Transparent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              Pricing
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-muted"
          >
            Start for free, upgrade when you&apos;re profitable. No hidden fees.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              <TiltCard
                className={`glass-card p-8 relative ${
                  plan.popular
                    ? "border-accent/50 shadow-[0_0_30px_rgba(200,255,22,0.1)]"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-black px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="text-center space-y-4 mb-8">
                  <h3 className="text-2xl font-bold text-text dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-black text-text dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-text-muted">/mo</span>
                  </div>
                  <p className="text-text-muted">{plan.desc}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                        <Check size={12} />
                      </div>
                      <span className="text-text dark:text-gray-200">{f}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 text-sm opacity-50"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-gray-500 shrink-0">
                        <X size={12} />
                      </div>
                      <span className="text-text-muted">{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? "bg-accent text-black hover:shadow-[0_0_20px_rgba(200,255,22,0.4)]"
                      : "bg-white/10 text-text dark:text-white hover:bg-white/20"
                  }`}
                >
                  {plan.price === "0" ? "Get Started" : "Subscribe Now"}
                </button>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
