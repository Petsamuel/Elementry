import { useState } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
import RevenueStreamCard from "../components/RevenueStreamCard";
import {
  Sparkles,
  Target,
  AlertTriangle,
  PieChart,
  Lightbulb,
  Send,
  DollarSign,
} from "lucide-react";

export default function DeconstructPage() {
  const { user } = useAuthStore();
  const [idea, setIdea] = useState("");
  const [results, setResults] = useState(null);

  const deconstructMutation = useMutation({
    mutationFn: ({ idea, token }) => api.deconstructIdea(idea, token),
    onSuccess: (data) => {
      setResults(data);
      toast.success("Idea deconstructed successfully!");
    },
    onError: (error) => {
      console.error("Deconstruction failed:", error);
      toast.error(
        error.response?.data?.detail || "Failed to deconstruct idea."
      );
    },
  });

  const handleDeconstruct = async () => {
    if (!idea.trim()) {
      toast.error("Please enter your product idea");
      return;
    }

    try {
      const token = await user.getIdToken();
      deconstructMutation.mutate({ idea, token });
    } catch (error) {
      console.error("Error getting token:", error);
      toast.error("Authentication error. Please try logging in again.");
    }
  };

  // Mock revenue streams for demonstration
  const mockRevenueStreams = [
    {
      streamName: "Subscription Model",
      description: "Recurring monthly/annual revenue from users",
      strengthScore: 85,
      insights: [
        "Strong market fit for SaaS pricing",
        "Consider tiered pricing structure",
        "Potential for 70% gross margins",
      ],
    },
    {
      streamName: "Freemium Conversion",
      description: "Free tier with premium upgrades",
      strengthScore: 72,
      insights: [
        "Typical conversion rate: 2-5%",
        "Focus on value demonstration",
        "Implement usage-based triggers",
      ],
    },
    {
      streamName: "Enterprise Licensing",
      description: "B2B sales with custom contracts",
      strengthScore: 68,
      insights: [
        "Higher ACV potential",
        "Longer sales cycles expected",
        "Requires dedicated sales team",
      ],
    },
    {
      streamName: "API Access",
      description: "Developer-focused API monetization",
      strengthScore: 55,
      insights: [
        "Growing developer ecosystem needed",
        "Usage-based pricing recommended",
        "Documentation is critical",
      ],
    },
    {
      streamName: "Marketplace Commission",
      description: "Revenue from third-party transactions",
      strengthScore: 48,
      insights: [
        "Requires significant user base",
        "15-30% commission is standard",
        "Platform effects take time",
      ],
    },
    {
      streamName: "Advertising Revenue",
      description: "Display ads and sponsored content",
      strengthScore: 42,
      insights: [
        "Lower revenue per user",
        "May impact user experience",
        "Requires high traffic volume",
      ],
    },
    {
      streamName: "Data Licensing",
      description: "Anonymized insights and analytics",
      strengthScore: 38,
      insights: [
        "Privacy compliance critical",
        "B2B opportunity",
        "Requires data aggregation scale",
      ],
    },
  ];

  const examplePrompts = [
    "A SaaS platform that helps small businesses automate their social media posting",
    "An AI-powered fitness app that creates personalized workout plans",
    "A marketplace connecting freelance designers with startups",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-text">
            Deconstruct Your Idea
          </h1>
        </div>
        <p className="text-text-muted text-lg">
          Get instant AI-powered analysis of your product&apos;s revenue
          potential
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8"
      >
        <label className="block mb-4">
          <span className="text-text font-semibold text-lg mb-2 block">
            Describe Your Product Idea
          </span>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: A mobile app that uses AI to help users track their daily water intake and sends personalized hydration reminders based on activity level, weather, and health goals..."
            className="w-full h-40 px-4 py-3 bg-bg border border-border-light rounded-xl text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-text-muted text-sm">
              {idea.length} / 1000 characters
            </span>
            {idea.length > 0 && (
              <span className="text-primary text-sm font-medium">
                {idea.length < 50
                  ? "Add more details for better analysis"
                  : "Looking good!"}
              </span>
            )}
          </div>
        </label>

        {/* Example Prompts */}
        {!idea && (
          <div className="mb-6">
            <p className="text-text-muted text-sm mb-3">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setIdea(prompt)}
                  className="text-xs px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                >
                  {prompt.slice(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleDeconstruct}
          disabled={deconstructMutation.isPending || !idea.trim()}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deconstructMutation.isPending ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Deconstruct Idea
            </>
          )}
        </button>
      </motion.div>

      {/* Results Section - Show mock data for demonstration */}
      {(results || idea.length > 100) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Revenue Streams */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">
                7 Revenue Streams Analysis
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockRevenueStreams.map((stream, index) => (
                <RevenueStreamCard
                  key={stream.streamName}
                  {...stream}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Competitive Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">
                Competitive Angles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Market Position", "Unique Value", "Differentiation"].map(
                (angle) => (
                  <div
                    key={angle}
                    className="p-4 rounded-xl bg-accent/5 border border-accent/20"
                  >
                    <h3 className="font-semibold text-text mb-2">{angle}</h3>
                    <p className="text-text-muted text-sm">
                      Analysis insights will appear here based on your idea
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>

          {/* Risk Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-text">Risk Assessment</h2>
            </div>
            <div className="space-y-3">
              {[
                { level: "Low", risk: "Technical Feasibility", color: "green" },
                {
                  level: "Medium",
                  risk: "Market Competition",
                  color: "yellow",
                },
                { level: "High", risk: "User Acquisition Cost", color: "red" },
              ].map((item) => (
                <div
                  key={item.risk}
                  className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary"
                >
                  <span className="font-medium text-text">{item.risk}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      item.color === "green"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                        : item.color === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {item.level} Risk
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text">
                Recommended Portfolio Structure
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-text">
                  Primary Revenue (60%)
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">
                      Subscription Model
                    </span>
                    <span className="font-semibold text-text">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Freemium</span>
                    <span className="font-semibold text-text">20%</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-text">
                  Secondary Revenue (40%)
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">Enterprise</span>
                    <span className="font-semibold text-text">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">API Access</span>
                    <span className="font-semibold text-text">15%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
