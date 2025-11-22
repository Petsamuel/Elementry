import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Sparkles,
  Send,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Rocket,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Users,
  Megaphone,
  Box,
  Activity,
  Shield,
  Layers,
  Globe,
  Cpu,
  Search,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function DeconstructPage() {
  const { user, selectedProjectId, setSelectedProjectId, setCurrentPage } =
    useAuthStore();
  const [idea, setIdea] = useState("");
  const [results, setResults] = useState(null);

  // Fetch project if selectedProjectId is present
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Populate state when project data is loaded
  useEffect(() => {
    if (projectData) {
      setIdea(projectData.name || "");
      setResults(projectData);
      setSelectedProjectId(null);
    }
  }, [projectData, setSelectedProjectId]);

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

  const createPivotMutation = useMutation({
    mutationFn: ({ pivotName, projectId, token }) =>
      api.createPivot({ project_id: projectId, pivot_name: pivotName }, token),
    onSuccess: () => {
      toast.success("Pivot opportunity activated!");
      setCurrentPage("pivot");
    },
    onError: (error) => {
      console.error("Failed to create pivot:", error);
      toast.error("Failed to activate pivot opportunity.");
    },
  });

  const handlePivotClick = async (pivotName) => {
    if (!results?.project_id) return;
    try {
      const token = await user.getIdToken();
      createPivotMutation.mutate({
        pivotName,
        projectId: results.project_id,
        token,
      });
    } catch (error) {
      console.error("Error activating pivot:", error);
    }
  };

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

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const examplePrompts = [
    "A SaaS platform that helps small businesses automate their social media posting",
    "An AI-powered fitness app that creates personalized workout plans",
    "A marketplace connecting freelance designers with startups",
  ];

  const getMonetizationScore = (potential) => {
    const p = potential?.toLowerCase();
    if (p === "very high") return 100;
    if (p === "high") return 80;
    if (p === "medium") return 50;
    return 30;
  };

  const getMonetizationBadge = (potential) => {
    const p = potential?.toLowerCase();
    if (p === "high" || p === "very high")
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (p === "medium")
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  // Prepare chart data
  const monetizationData = results?.elements?.reduce((acc, element) => {
    const potential = element.monetization_potential?.toLowerCase();
    const existing = acc.find((item) => item.name === potential);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: potential || "unknown", value: 1 });
    }
    return acc;
  }, []);

  const barChartData = results?.elements?.map((element, index) => ({
    name:
      element.name.length > 15
        ? element.name.slice(0, 12) + "..."
        : element.name,
    score: getMonetizationScore(element.monetization_potential),
    fullName: element.name,
  }));

  const radarData = results?.elements?.slice(0, 6).map((element) => ({
    element:
      element.name.length > 12
        ? element.name.slice(0, 10) + "..."
        : element.name,
    potential: getMonetizationScore(element.monetization_potential),
  }));

  const COLORS = {
    "very high": "#c8ff16",
    high: "#a3d912",
    medium: "#5941ff",
    low: "#9ca3af",
    unknown: "#374151",
  };

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
          <div className="p-3 rounded-xl bg-linear-to-br from-accent/20 to-green-500/20 backdrop-blur-sm border border-accent/20">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-text">
            Deconstruct Your Idea
          </h1>
        </div>
        <p className="text-text-muted text-lg">
          Get instant AI-powered analysis of your product's revenue potential
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

      {/* Results Section - Bento Grid Layout */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Bento Grid Container - Premium Redesign */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-auto">
              {/* Large Card - Monetization Distribution (Pie Chart) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 lg:row-span-2 relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 p-6"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <PieChart className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        Revenue Distribution
                      </h3>
                      <p className="text-xs text-text-muted font-mono">
                        ANALYSIS_BY_POTENTIAL
                      </p>
                    </div>
                  </div>
                  {monetizationData && monetizationData.length > 0 ? (
                    <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={monetizationData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {monetizationData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name] || COLORS.unknown}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0a0a0a",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            }}
                            itemStyle={{ color: "#fff" }}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                      {/* Legend */}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {monetizationData.map((entry, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{
                                backgroundColor:
                                  COLORS[entry.name] || COLORS.unknown,
                              }}
                            />
                            <span className="text-gray-400 capitalize">
                              {entry.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-text-muted">
                      No data available
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Quick Insights - Cheapest Entry */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-500 p-6"
              >
                <div className="absolute inset-0 bg-linear-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 group-hover:scale-110 transition-transform duration-300">
                    <Rocket className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      Cheapest Entry Point
                    </h3>
                    <p className="text-xs text-accent font-mono mb-3">
                      RECOMMENDED_STARTING_VECTOR
                    </p>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {results.cheapest_entry_point}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Element Potential Bar Chart */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 lg:row-span-2 relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 p-6"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <BarChart3 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        Element Comparison
                      </h3>
                      <p className="text-xs text-text-muted font-mono">
                        MONETIZATION_POTENTIAL_INDEX
                      </p>
                    </div>
                  </div>
                  {barChartData && barChartData.length > 0 ? (
                    <div className="flex-1 min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            fontFamily="monospace"
                          />
                          <YAxis
                            stroke="#6b7280"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            fontFamily="monospace"
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.05)" }}
                            contentStyle={{
                              backgroundColor: "#0a0a0a",
                              border: "1px solid rgba(255,255,255,0.1)",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                            }}
                            labelStyle={{
                              color: "#fff",
                              marginBottom: "0.5rem",
                            }}
                            formatter={(value, name, props) => [
                              <span key="val" className="text-accent font-mono">
                                {value}
                              </span>,
                              <span key="name" className="text-gray-400">
                                Score
                              </span>,
                            ]}
                          />
                          <Bar
                            dataKey="score"
                            fill="#5941ff"
                            radius={[4, 4, 0, 0]}
                            className="hover:opacity-80 transition-opacity"
                          >
                            {barChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.score >= 80
                                    ? "#c8ff16" // Accent for high score
                                    : entry.score >= 50
                                    ? "#5941ff" // Primary for medium
                                    : "#374151" // Dark gray for low
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-text-muted">
                      No data available
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sustainability Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 p-6"
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">
                      Sustainability
                    </h3>
                    <p className="text-xs text-primary font-mono mb-3">
                      LONG_TERM_VIABILITY
                    </p>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {results.sustainability_tip}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Overall Score */}
              {results.overall_score && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-500 p-6 flex flex-col items-center justify-center text-center"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-[radial-linear(circle_at_center,rgba(200,255,22,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 mx-auto group-hover:border-accent/30 group-hover:shadow-[0_0_20px_rgba(200,255,22,0.2)] transition-all duration-500">
                      <Award className="w-8 h-8 text-white group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="font-bold text-white mb-1">
                      Overall Viability
                    </h3>
                    <p className="text-xs text-text-muted font-mono mb-4">
                      COMPOSITE_SCORE
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 group-hover:from-accent group-hover:to-primary transition-all duration-500">
                        {results.overall_score}
                      </span>
                      <span className="text-text-muted text-xl font-mono">
                        /100
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Business Elements Grid */}
            {/* Business Elements Grid - Premium Redesign */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Layers className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Business Architecture
                    </h2>
                    <p className="text-text-muted text-sm">
                      {results.elements?.length || 7} Core Modules
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-text-muted font-mono">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  SYSTEM_READY
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.elements?.map((element, index) => {
                  // Dynamic Icon Mapping
                  const getElementIcon = (type) => {
                    const t = type?.toLowerCase() || "";
                    if (t.includes("value")) return Sparkles;
                    if (t.includes("customer") || t.includes("segment"))
                      return Users;
                    if (t.includes("channel")) return Megaphone;
                    if (t.includes("revenue") || t.includes("stream"))
                      return DollarSign;
                    if (t.includes("resource")) return Box;
                    if (t.includes("activit")) return Activity;
                    if (t.includes("partner")) return Globe;
                    if (t.includes("cost")) return PieChart;
                    return Cpu;
                  };

                  const Icon = getElementIcon(element.type);
                  const isHighPotential =
                    element.monetization_potential?.toLowerCase() ===
                      "very high" ||
                    element.monetization_potential?.toLowerCase() === "high";

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group relative bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-500"
                    >
                      {/* Holographic Overlay Effect */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      <div className="absolute -inset-1 bg-linear-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-lg bg-white/5 group-hover:bg-accent/10 transition-colors duration-300 border border-white/5 group-hover:border-accent/20">
                            <Icon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors duration-300" />
                          </div>
                          <span className="font-mono text-xs text-white/20 group-hover:text-accent/50 transition-colors">
                            0{index + 1}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors duration-300">
                              {element.name}
                            </h3>
                            <p className="text-xs font-mono text-primary uppercase tracking-wider mt-1">
                              {element.type}
                            </p>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                            {element.description}
                          </p>
                        </div>

                        {/* Footer / Monetization Indicator */}
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <span className="text-xs text-gray-500 font-medium">
                            Revenue Potential
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((bar) => (
                                <div
                                  key={bar}
                                  className={`w-1 h-3 rounded-full ${
                                    (isHighPotential && bar <= 3) ||
                                    (element.monetization_potential?.toLowerCase() ===
                                      "medium" &&
                                      bar <= 2) ||
                                    bar === 1
                                      ? "bg-accent"
                                      : "bg-white/10"
                                  } ${
                                    isHighPotential
                                      ? "shadow-[0_0_8px_rgba(200,255,22,0.5)]"
                                      : ""
                                  }`}
                                />
                              ))}
                            </div>
                            <span
                              className={`text-xs font-bold ${
                                isHighPotential
                                  ? "text-accent"
                                  : "text-white/60"
                              }`}
                            >
                              {element.monetization_potential}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Pivot Options - Premium Redesign */}
            {results.pivot_options && results.pivot_options.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden p-6"
              >
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Pivot Opportunities
                      </h2>
                      <p className="text-text-muted text-sm font-mono">
                        ADJACENT_MARKET_VECTORS
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {results.pivot_options.map((pivot, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 5 }}
                        onClick={() => handlePivotClick(pivot)}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-white/10 transition-all group/item cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-lg bg-white/5 group-hover/item:bg-accent/20 transition-colors">
                            <TrendingUp className="w-4 h-4 text-gray-400 group-hover/item:text-accent transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-400 group-hover/item:text-white transition-colors leading-relaxed">
                              {pivot}
                            </p>
                            {createPivotMutation.isPending && (
                              <span className="text-xs text-accent animate-pulse mt-1 block">
                                Activating...
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
