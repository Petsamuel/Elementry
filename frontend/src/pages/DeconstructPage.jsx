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
  Rocket,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Users,
  Megaphone,
  Box,
  Activity,
  Layers,
  Globe,
  Cpu,
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
import { DeconstructLoader } from "../components/CreativeLoaders";

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
  const {
    user,
    selectedProjectId,
    setSelectedProjectId,
    setCurrentPage,
    currency,
  } = useAuthStore();
  const [idea, setIdea] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedElement, setExpandedElement] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

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
    mutationFn: ({ idea, currency, token }) =>
      api.deconstructIdea(idea, currency, token),
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

  const updateProjectNameMutation = useMutation({
    mutationFn: async ({ projectId, name }) => {
      const token = await user.getIdToken();
      return api.updateProjectName(projectId, name, token);
    },
    onSuccess: (data) => {
      setResults({ ...results, name: data.name });
      toast.success("Project name updated!");
    },
    onError: (error) => {
      console.error("Failed to update project name:", error);
      toast.error("Failed to update project name.");
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
      deconstructMutation.mutate({ idea, currency, token });
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
                  {isEditingName ? (
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      onBlur={() => {
                        if (editedName.trim() && editedName !== results.name) {
                          updateProjectNameMutation.mutate({
                            projectId: results.project_id,
                            name: editedName.trim(),
                          });
                        }
                        setIsEditingName(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        } else if (e.key === "Escape") {
                          setEditedName(results.name || "Untitled Project");
                          setIsEditingName(false);
                        }
                      }}
                      autoFocus
                      className="text-2xl md:text-3xl font-black tracking-tight bg-transparent border-b-2 border-accent outline-none text-white uppercase max-w-md px-2"
                    />
                  ) : (
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      onClick={() => {
                        setEditedName(results.name || "Untitled Project");
                        setIsEditingName(true);
                      }}
                      className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-500 uppercase line-clamp-2 w-sm truncate cursor-pointer hover:opacity-80 transition-opacity"
                      title="Click to edit project name"
                    >
                      {results.name || "Untitled Project"}
                    </motion.h1>
                  )}
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
                      active={activeTab === "growth"}
                      onClick={() => setActiveTab("growth")}
                      icon={TrendingUp}
                    >
                      Growth
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Score Card - Enhanced with glow */}
                <Card className="lg:col-span-1 lg:row-span-1 p-6 relative overflow-hidden group border-accent/20 bg-obsidian/80 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,255,22,0.15),transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                    <div className="relative w-48 h-48 mb-8">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 rounded-full bg-accent/5 blur-xl animate-pulse" />

                      <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(200,255,22,0.3)]">
                        <defs>
                          <linearGradient
                            id="scoreGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#c8ff16" />
                            <stop offset="100%" stopColor="#80ff00" />
                          </linearGradient>
                        </defs>
                        {/* Background Track */}
                        <circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="8"
                          fill="none"
                        />
                        {/* Progress Arc */}
                        <motion.circle
                          cx="96"
                          cy="96"
                          r="80"
                          stroke="url(#scoreGradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: "0 502" }}
                          animate={{
                            strokeDasharray: `${
                              ((results.overall_score || 0) / 100) * 502
                            } 502`,
                          }}
                          transition={{
                            duration: 2,
                            ease: "easeOut",
                            delay: 0.3,
                          }}
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          className="text-7xl font-black text-white tracking-tighter"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.5,
                            type: "spring",
                          }}
                        >
                          {results.overall_score || 0}
                        </motion.span>
                        <span className="text-xs text-accent font-bold uppercase tracking-widest mt-1">
                          Viability
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                        <Activity className="w-5 h-5 text-accent" />
                        Project Health
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-[200px] mx-auto">
                        AI-calculated score based on market fit, monetization,
                        and scalability.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Revenue Mix - Enhanced */}
                <Card className="lg:col-span-2 p-6 relative overflow-hidden group bg-obsidian/80 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(89,65,255,0.1),transparent_60%)] opacity-50" />

                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                          <PieChart className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            Revenue Distribution
                          </h3>
                          <p className="text-xs text-text-muted font-mono uppercase">
                            Monetization Analysis
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-8">
                      <div className="flex-1 h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={monetizationData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={4}
                              dataKey="value"
                              stroke="none"
                              cornerRadius={4}
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
                                backgroundColor: "rgba(10,10,10,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                backdropFilter: "blur(10px)",
                                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                              }}
                              itemStyle={{ color: "#fff", fontWeight: 600 }}
                            />
                          </RechartsPie>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center">
                            <span className="block text-2xl font-bold text-white">
                              {results.elements?.length || 0}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase">
                              Streams
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3 pr-4">
                        {monetizationData.map((entry, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                              style={{
                                color: COLORS[entry.name] || COLORS.unknown,
                                backgroundColor: "currentColor",
                              }}
                            />
                            <span className="text-sm text-gray-300 capitalize flex-1 font-medium">
                              {entry.name}
                            </span>
                            <span className="text-sm text-white font-bold font-mono bg-white/5 px-2 py-0.5 rounded">
                              {Math.round(
                                (entry.value / results.elements.length) * 100
                              )}
                              %
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Stats - Enhanced */}
                <Card className="lg:col-span-1 p-6 space-y-4 relative overflow-hidden group bg-obsidian/80 backdrop-blur-xl">
                  <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 space-y-4 h-full flex flex-col justify-center">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all group/stat hover:bg-white/10">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5" /> Est. Cost
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/stat:opacity-100 -translate-x-2 group-hover/stat:translate-x-0 transition-all" />
                      </div>
                      <div className="text-3xl font-black text-white tracking-tight">
                        {results.estimated_cost}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group/stat hover:bg-white/10">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" /> Validation Time
                        </span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover/stat:opacity-100 -translate-x-2 group-hover/stat:translate-x-0 transition-all" />
                      </div>
                      <div className="text-3xl font-black text-white tracking-tight">
                        {results.time_to_validate}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all group/stat hover:bg-white/10">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Currency
                      </div>
                      <div className="text-3xl font-black text-accent tracking-tight">
                        {results.currency}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Entry Point Strategy - Enhanced */}
                <Card className="lg:col-span-2 p-8 relative overflow-hidden border-accent/20">
                  <div className="absolute top-0 right-0 p-40 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 p-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent shadow-[0_0_15px_rgba(200,255,22,0.15)]">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          Go-To-Market Strategy
                        </h3>
                        <p className="text-xs text-text-muted font-mono uppercase">
                          Recommended First Step
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-6 backdrop-blur-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                      <p className="text-gray-200 leading-relaxed text-lg font-medium">
                        {results.cheapest_entry_point}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <Zap className="w-3 h-3 text-accent" />
                        HIGH_IMPACT
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        LOW_COST
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Component Analysis Chart - Enhanced */}
                <Card className="lg:col-span-2 p-6 bg-obsidian/80 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          Component Viability
                        </h3>
                        <p className="text-xs text-text-muted font-mono uppercase">
                          Strength Analysis
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <XAxis
                          dataKey="name"
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.03)", radius: 4 }}
                          contentStyle={{
                            backgroundColor: "rgba(10,10,10,0.9)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                          }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={32}>
                          {barChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.score >= 80
                                  ? "url(#scoreGradient)" // Use gradient if possible, or fallback color
                                  : entry.score >= 50
                                  ? "#5941ff"
                                  : "#374151"
                              }
                              strokeWidth={0}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
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
                          <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
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
                              <p className="text-accent font-mono text-sm uppercase tracking-wider">
                                {expandedElement.type}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                              <h3 className="text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                                Description
                              </h3>
                              <p className="lg:text-lg text-[14.5px] text-white leading-relaxed">
                                {expandedElement.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <h3 className="text-xs font-bold text-gray-400 mb-1 uppercase">
                                  Monetization
                                </h3>
                                <p className="lg:text-xl text-[14.5px] font-bold text-accent">
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

            {/* GROWTH TAB */}
            {activeTab === "growth" && (
              <div className="space-y-8">
                {/* Funding Strategy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <DollarSign className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Gradual Funding Strategy
                    </h2>
                  </div>
                  <div className="grid gap-4">
                    {results.gradual_funding_strategy?.map((step, index) => (
                      <Card
                        key={index}
                        className="p-6 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">
                              {step.step}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {step.description}
                            </p>
                          </div>
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 whitespace-nowrap">
                            {step.amount}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Expansion Tips */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                      <Megaphone className="w-6 h-6 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Brand & Community Expansion
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.brand_and_community_expansion_tips?.map(
                      (tip, index) => (
                        <Card key={index} className="p-6">
                          <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">
                              {index + 1}
                            </div>
                            <p className="text-gray-300">{tip}</p>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                </div>

                {/* Sustainability Roadmap */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Globe className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Sustainability Roadmap
                    </h2>
                  </div>
                  <div className="relative border-l-2 border-white/10 ml-4 space-y-8 py-4">
                    {results.sustainability_roadmap?.map((milestone, index) => (
                      <div key={index} className="relative pl-8">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-obsidian border-2 border-blue-500" />
                        <div className="space-y-1">
                          <span className="text-xs font-mono text-blue-400 uppercase tracking-wider">
                            {milestone.timeline}
                          </span>
                          <h3 className="text-lg font-bold text-white">
                            {milestone.milestone}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pivot Opportunities */}
                <div className="space-y-4 pt-8 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <Zap className="w-6 h-6 text-purple-500" />
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Creative Loading Overlay for Deconstruction */}
      <AnimatePresence>
        {deconstructMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <DeconstructLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
