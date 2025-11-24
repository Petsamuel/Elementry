import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
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
  ArrowRight,
  X,
  Maximize2,
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
} from "recharts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, FolderOpen, CheckCircle2 } from "lucide-react";

// --- Utility Components ---

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
      active ? "text-white" : "text-gray-400 hover:text-white"
    }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md"
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {Icon && (
        <Icon
          className={`w-4 h-4 lg:block hidden ${active ? "text-accent" : ""}`}
        />
      )}
      {children}
    </span>
  </button>
);

const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-obsidian border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-500 ${className}`}
  >
    {children}
  </motion.div>
);

const Badge = ({ children, className = "" }) => (
  <span
    className={`px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border ${className}`}
  >
    {children}
  </span>
);

// --- Main Component ---

export default function DeconstructPage() {
  const { user, selectedProjectId, setSelectedProjectId, setCurrentPage } =
    useAuthStore();
  const [idea, setIdea] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedElement, setExpandedElement] = useState(null);

  // Fetch project if selectedProjectId is present
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Fetch recent projects for selector
  const { data: recentProjects = [] } = useQuery({
    queryKey: ["recentProjects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getRecentProjects(token);
      return response.projects || [];
    },
    enabled: !!user,
  });

  // Populate state when project data is loaded
  useEffect(() => {
    if (projectData) {
      setIdea(
        projectData.description ||
          projectData.original_idea ||
          projectData.name ||
          ""
      );
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

  const barChartData = results?.elements?.map((element) => ({
    name:
      element.name.length > 15
        ? element.name.slice(0, 12) + "..."
        : element.name,
    score: getMonetizationScore(element.monetization_potential),
    fullName: element.name,
  }));

  const COLORS = {
    "very high": "#c8ff16",
    high: "#a3d912",
    medium: "#5941ff",
    low: "#9ca3af",
    unknown: "#374151",
  };

  const getElementIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("value")) return Sparkles;
    if (t.includes("customer") || t.includes("segment")) return Users;
    if (t.includes("channel")) return Megaphone;
    if (t.includes("revenue") || t.includes("stream")) return DollarSign;
    if (t.includes("resource")) return Box;
    if (t.includes("activit")) return Activity;
    if (t.includes("partner")) return Globe;
    if (t.includes("cost")) return PieChart;
    return Cpu;
  };

  return (
    <div className="space-y-8 min-h-screen pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {!results ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-br from-accent/20 to-green-500/20 backdrop-blur-sm border border-accent/20">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-4xl font-bold text-text">
                Deconstruct Your Idea
              </h1>
            </div>
            <p className="text-text-muted text-lg max-w-2xl">
              Get instant AI-powered analysis of your product's revenue
              potential
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    Project Analysis
                  </Badge>
                  <span className="text-xs text-text-muted font-mono">
                    ID: {results.project_id?.slice(0, 8) || "NEW_SESSION"}
                  </span>
                </motion.div>
                <div className="flex items-center gap-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-500 uppercase line-clamp-2 w-sm truncate"
                  >
                    {results.name || "Untitled Project"}
                  </motion.h1>
                  {/* Project Selector */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[200px] bg-[#0A0A0A] border border-white/10 rounded-xl p-1 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                        align="start"
                        sideOffset={5}
                      >
                        <div className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Switch Project
                        </div>
                        {recentProjects?.map((p) => (
                          <DropdownMenu.Item
                            key={p.id}
                            onClick={() => setSelectedProjectId(p.id)}
                            className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${
                              selectedProjectId === p.id
                                ? "bg-accent/10 text-accent"
                                : "text-gray-300 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[180px]">
                              {p.name}
                            </span>
                            {selectedProjectId === p.id && (
                              <CheckCircle2 className="w-3.5 h-3.5 ml-auto" />
                            )}
                          </DropdownMenu.Item>
                        ))}
                        {(!recentProjects || recentProjects.length === 0) && (
                          <div className="px-2 py-2 text-xs text-gray-500 italic">
                            No recent projects found.
                          </div>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="bg-obsidian/50 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
                <LayoutGroup>
                  <div className="flex items-center gap-1">
                    <TabButton
                      active={activeTab === "overview"}
                      onClick={() => setActiveTab("overview")}
                      icon={BarChart3}
                    >
                      Overview
                    </TabButton>
                    <TabButton
                      active={activeTab === "blueprint"}
                      onClick={() => setActiveTab("blueprint")}
                      icon={Layers}
                    >
                      Blueprint
                    </TabButton>
                    <TabButton
                      active={activeTab === "expansion"}
                      onClick={() => setActiveTab("expansion")}
                      icon={TrendingUp}
                    >
                      Expansion
                    </TabButton>
                  </div>
                </LayoutGroup>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Input Section (Only show if no results) */}
      {!results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-1 bg-linear-to-b from-white/5 to-transparent rounded-2xl border border-white/5"
        >
          <div className="bg-obsidian rounded-xl p-8">
            <label className="block mb-6">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe your product idea in detail..."
                className="w-full h-48 px-6 py-5 bg-black/20 border border-white/5 rounded-xl text-lg text-text placeholder-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all resize-none leading-relaxed"
                maxLength={1000}
              />
              <div className="flex items-center justify-between mt-3 px-2">
                <span className="text-text-muted text-xs font-mono">
                  {idea.length} / 1000 CHARS
                </span>
              </div>
            </label>

            {!idea && (
              <div className="mb-8">
                <p className="text-text-muted text-sm mb-3 font-medium">
                  Or start with an example:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setIdea(prompt)}
                      className="text-xs px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-gray-300 rounded-lg transition-all"
                    >
                      {prompt.slice(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleDeconstruct}
              disabled={deconstructMutation.isPending || !idea.trim()}
              className="w-full btn-primary h-14 text-lg font-bold flex items-center justify-center gap-3 rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {deconstructMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Architecture...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Deconstruct Idea
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-auto">
                {/* Revenue Distribution */}
                <Card className="lg:col-span-1 lg:row-span-2 p-6 relative group">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <PieChart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Revenue Mix</h3>
                        <p className="text-xs text-text-muted font-mono">
                          POTENTIAL_DISTRIBUTION
                        </p>
                      </div>
                    </div>
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
                            }}
                            itemStyle={{ color: "#fff" }}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>

                {/* Cheapest Entry */}
                <Card
                  delay={0.1}
                  className="lg:col-span-2 p-6 relative group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Recommended Entry Point
                      </h3>
                      <p className="text-xs text-accent font-mono mb-3">
                        MINIMUM_VIABLE_SEGMENT
                      </p>
                      <p className="text-gray-300 leading-relaxed ">
                        {results.cheapest_entry_point}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Element Comparison */}
                <Card delay={0.2} className="lg:col-span-2 lg:row-span-2 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        Component Analysis
                      </h3>
                      <p className="text-xs text-text-muted font-mono">
                        VIABILITY_INDEX
                      </p>
                    </div>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barChartData}>
                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.05)" }}
                          contentStyle={{
                            backgroundColor: "#0a0a0a",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="score"
                          fill="#5941ff"
                          radius={[4, 4, 0, 0]}
                        >
                          {barChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.score >= 80
                                  ? "#c8ff16"
                                  : entry.score >= 50
                                  ? "#5941ff"
                                  : "#374151"
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Overall Score */}
                <Card
                  delay={0.3}
                  className="p-6 flex flex-col items-center justify-center text-center relative group"
                >
                  <div className="absolute inset-0 bg-[radial-linear(circle_at_center,rgba(200,255,22,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 mx-auto group-hover:border-accent/30 transition-all duration-500 flex justify-center items-center">
                      <Award className="w-6 h-6 text-white group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="font-bold text-white mb-1">Total Score</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-black text-white group-hover:text-accent transition-colors">
                        {results.overall_score || 0}
                      </span>
                      <span className="text-text-muted text-xl font-mono">
                        /100
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* BLUEPRINT TAB */}
            {activeTab === "blueprint" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Business Architecture
                  </h2>
                  <div className="text-xs text-text-muted font-mono">
                    {results.elements?.length || 0} MODULES DETECTED
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {results.elements?.map((element, index) => {
                    const Icon = getElementIcon(element.type);
                    const isHighPotential =
                      element.monetization_potential?.toLowerCase() ===
                        "very high" ||
                      element.monetization_potential?.toLowerCase() === "high";

                    return (
                      <motion.div
                        key={index}
                        layoutId={`card-${index}`}
                        onClick={() => setExpandedElement(element)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative bg-obsidian border border-white/5 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-300 cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 p-6 h-full flex flex-col">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5 group-hover:border-accent/20 group-hover:bg-accent/10 transition-colors">
                              <Icon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" />
                            </div>
                            <Maximize2 className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                          </div>

                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">
                            {element.name}
                          </h3>
                          <p className="text-xs font-mono text-primary uppercase tracking-wider mb-3">
                            {element.type}
                          </p>
                          <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                            {element.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Potential
                            </span>
                            <Badge
                              className={
                                isHighPotential
                                  ? "bg-accent/10 text-accent border-accent/20"
                                  : "bg-white/5 text-gray-400 border-white/10"
                              }
                            >
                              {element.monetization_potential}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Expanded Card Modal */}
                <AnimatePresence>
                  {expandedElement && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExpandedElement(null)}
                        className="absolute inset-0"
                      />
                      <motion.div
                        layoutId={`card-${results.elements.indexOf(
                          expandedElement
                        )}`}
                        className="relative w-full max-w-2xl bg-obsidian border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-accent via-primary to-accent" />
                        <button
                          onClick={() => setExpandedElement(null)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-20"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                              {(() => {
                                const Icon = getElementIcon(
                                  expandedElement.type
                                );
                                return <Icon className="w-8 h-8 text-accent" />;
                              })()}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-white">
                                {expandedElement.name}
                              </h2>
                              <p className="text-primary font-mono text-sm uppercase tracking-wider">
                                {expandedElement.type}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                              <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                                Description
                              </h3>
                              <p className="text-lg text-white leading-relaxed">
                                {expandedElement.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-400 mb-1 uppercase">
                                  Monetization
                                </h3>
                                <p className="text-xl font-bold text-accent">
                                  {expandedElement.monetization_potential}
                                </p>
                              </div>
                              {/* Add more metrics here if available in the future */}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* EXPANSION TAB */}
            {activeTab === "expansion" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Pivot Opportunities
                    </h2>
                    <p className="text-text-muted text-sm font-mono">
                      ADJACENT_MARKET_VECTORS
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.pivot_options?.map((pivot, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-6 rounded-xl bg-obsidian border border-white/5 hover:border-accent/30 transition-all relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                            Vector 0{index + 1}
                          </h3>
                        </div>

                        <p className="text-gray-400 mb-6 flex-1 leading-relaxed">
                          {pivot}
                        </p>

                        <button
                          onClick={() => handlePivotClick(pivot)}
                          className="w-full py-3 rounded-lg bg-white/5 hover:bg-accent hover:text-black text-white font-medium transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <span>Analyze Vector</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
