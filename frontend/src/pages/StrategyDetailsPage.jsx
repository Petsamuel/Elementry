import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  CheckCircle2,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  ListChecks,
  FileText,
  GitBranch,
  Clock,
  AlertTriangle,
  Sparkles,
  Lock,
  Activity,
  Save,
  X,
  ChevronRight,
  Calendar,
  Users,
  DollarSign,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";

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

export default function StrategyDetailsPage() {
  const {
    selectedStrategyId,
    setSelectedStrategyId,
    setCurrentPage,
    selectedProjectId,
    user,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // If no strategy selected, go back
  useEffect(() => {
    if (!selectedStrategyId) {
      setCurrentPage("pivot");
    }
  }, [selectedStrategyId, setCurrentPage]);

  const queryClient = useQueryClient();

  // Fetch project data to get the strategy details
  // In a real app, we might have a specific endpoint for a single strategy,
  // but here we might need to find it within the project or pivots.
  // For now, let's assume we fetch the project and pivots and find the matching ID.

  const { data: projectData } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  const { data: activePivots = [] } = useQuery({
    queryKey: ["pivots", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getPivots(selectedProjectId, token);
      return response.pivots || [];
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Find the strategy
  const strategy = React.useMemo(() => {
    if (!selectedStrategyId) return null;

    // Check active pivots
    const active = activePivots.find((p) => p.id === selectedStrategyId);
    if (active)
      return { ...active, type: "pivot", status: active.status || "discovery" };

    // Check potential pivots (from projectData)
    // Note: Potential pivots in projectData are just strings usually, so we might need to handle that.
    // If the ID is like "potential-0", we look up by index.
    if (selectedStrategyId.startsWith("potential-")) {
      const index = parseInt(selectedStrategyId.split("-")[1]);
      const name = projectData?.pivot_options?.[index];
      if (name)
        return {
          id: selectedStrategyId,
          pivot_name: name,
          analysis: {
            market_fit:
              "Potential pivot opportunity. Analyze to unlock details.",
          },
          status: "potential",
          type: "pivot",
        };
    }

    return null;
  }, [selectedStrategyId, activePivots, projectData]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "pivot",
    impact: "Medium",
    growthRate: "",
    confidence: 50,
  });

  useEffect(() => {
    if (strategy) {
      setFormData({
        title: strategy.pivot_name || "",
        description: strategy.analysis?.market_fit || "",
        type: "pivot",
        impact: "Medium", // Default or fetch if available
        growthRate: "", // Default or fetch
        confidence: strategy.analysis?.viability_score || 50,
      });
    }
  }, [strategy]);

  const handleSave = () => {
    // Implement save logic here (mutation)
    toast.success("Changes saved locally (backend integration pending)");
    setIsEditing(false);
  };

  if (!strategy) return null;

  return (
    <div className="min-h-screen pb-20 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <button
          onClick={() => setCurrentPage("pivot")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Strategy Board
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4 flex items-center flex-col">
            <div className="space-y-4 flex flex-col">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    strategy.status === "potential"
                      ? "bg-gray-500/10 border-gray-500/20 text-gray-400"
                      : "bg-accent/10 border-accent/20 text-accent"
                  }`}
                >
                  {strategy.status || "Draft"}
                </span>
                <span className="text-gray-500 text-sm font-mono">
                  ID: {strategy.id.slice(0, 8)}
                </span>
              </div>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-4xl lg:text-2xl font-black text-white bg-transparent border-b border-white/10 focus:border-accent outline-none w-lg"
                  autoFocus
                />
              ) : (
                <h1 className="text-xl lg:text-2xl font-black text-white leading-tight lg:line-clamp-3 lg:w-lg w-full">
                  {formData.title}
                </h1>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 font-bold"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors flex items-center gap-2 font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Strategy
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Description Card */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Strategic Hypothesis
            </h3>
            {isEditing ? (
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full h-48 bg-black/20 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-accent outline-none resize-none leading-relaxed"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed text-lg">
                {formData.description}
              </p>
            )}
          </Card>

          {/* Tabs for deeper details */}
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex gap-6 border-b border-white/10 mb-8">
              <Tabs.Trigger
                value="overview"
                className="pb-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
              >
                Execution Plan
              </Tabs.Trigger>
              <Tabs.Trigger
                value="market"
                className="pb-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
              >
                Market Analysis
              </Tabs.Trigger>
              <Tabs.Trigger
                value="risks"
                className="pb-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
              >
                Risks & Mitigation
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content
              value="overview"
              className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4 group hover:border-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">
                      {i}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold mb-1">
                        Phase {i}: Implementation
                      </h4>
                      <p className="text-sm text-gray-400">
                        Detailed steps for this phase would go here. Currently a
                        placeholder.
                      </p>
                    </div>
                    <div className="px-2 py-1 rounded text-[10px] font-mono bg-white/5 text-gray-500 uppercase">
                      Pending
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            <Tabs.Content
              value="market"
              className="outline-none animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">Market Data</h3>
                <p className="text-gray-400 mt-2">
                  Detailed market analysis visualization coming soon.
                </p>
              </div>
            </Tabs.Content>

            <Tabs.Content
              value="risks"
              className="outline-none animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">
                  Risk Assessment
                </h3>
                <p className="text-gray-400 mt-2">
                  Risk matrix and mitigation strategies coming soon.
                </p>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Right Column - Sidebar Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Viability Score */}
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10" />
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Viability Score
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black text-white">
                {formData.confidence}
              </span>
              <span className="text-xl text-gray-500 mb-2">/100</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${formData.confidence}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-accent"
              />
            </div>
          </Card>

          {/* Key Metrics */}
          <Card className="p-6 space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Key Metrics
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Growth Potential
                  </span>
                </div>
                <span className="text-white font-bold">High</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Time to Value
                  </span>
                </div>
                <span className="text-white font-bold">3 Weeks</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    Est. Cost
                  </span>
                </div>
                <span className="text-white font-bold">Low</span>
              </div>
            </div>
          </Card>

          {/* Team / Stakeholders (Placeholder) */}
          {/* <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Stakeholders
            </h3>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/10 border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-bold text-white"
                >
                  U{i}
                </div>
              ))}
              <button className="w-10 h-10 rounded-full bg-white/5 border-2 border-[#0A0A0A] flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
