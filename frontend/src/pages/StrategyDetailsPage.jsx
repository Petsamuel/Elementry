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
import { useStrategyStore } from "../store/useStrategyStore";
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

  const {
    marketAnalysis,
    risks,
    timeline,
    setMarketAnalysis,
    updateMarketSize,
    addRisk,
    updateRisk,
    removeRisk,
    addTimelinePhase,
    updateTimelinePhase,
    removeTimelinePhase,
    addCompetitor,
    removeCompetitor,
    setStrategyDetails,
    reset: resetStrategyStore,
  } = useStrategyStore();

  // Fetch strategy details
  const { data: strategyDetails } = useQuery({
    queryKey: ["strategyDetails", selectedStrategyId],
    queryFn: async () => {
      if (!selectedStrategyId) return null;
      const token = await user.getIdToken();
      return api.getStrategyDetails(selectedStrategyId, token);
    },
    enabled: !!user && !!selectedStrategyId,
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (details) => {
      const token = await user.getIdToken();
      return api.updateStrategyDetails(selectedStrategyId, details, token);
    },
    onSuccess: () => {
      toast.success("Strategy details saved successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["strategyDetails", selectedStrategyId]);
    },
    onError: (error) => {
      toast.error("Failed to save changes");
      console.error(error);
    },
  });

  const [diagnosisResult, setDiagnosisResult] = useState(null);

  const runDiagnosis = () => {
    const issues = [];

    // Check Market Analysis
    if (!marketAnalysis?.marketSize?.tam?.value)
      issues.push("TAM (Total Addressable Market) is missing");
    if (!marketAnalysis?.marketSize?.sam?.value)
      issues.push("SAM (Serviceable Available Market) is missing");
    if (!marketAnalysis?.marketSize?.som?.value)
      issues.push("SOM (Serviceable Obtainable Market) is missing");
    if (!marketAnalysis?.competitors || marketAnalysis.competitors.length === 0)
      issues.push("No competitors listed");

    // Check Risks
    if (!risks || risks.length === 0) issues.push("No risks identified");

    // Check Timeline
    if (!timeline || timeline.length === 0)
      issues.push("Execution timeline is empty");

    setDiagnosisResult({
      success: issues.length === 0,
      issues: issues,
      timestamp: new Date().toISOString(),
    });

    if (issues.length === 0) {
      toast.success("Diagnosis complete: Strategy is well-defined!");
    }
  };

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

    if (strategyDetails) {
      setStrategyDetails(strategyDetails);
      setFormData((prev) => ({
        ...prev,
        title: strategyDetails.title || prev.title,
        description: strategyDetails.description || prev.description,
      }));
    }

    return () => {
      // Optional: reset store on unmount or strategy change if we want fresh state
      // resetStrategyStore();
    };
  }, [strategy, strategyDetails, setStrategyDetails, resetStrategyStore]);

  const handleSave = () => {
    saveMutation.mutate({
      title: formData.title,
      description: formData.description,
      marketAnalysis,
      risks,
      timeline,
    });
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
              <>
                <button
                  onClick={runDiagnosis}
                  className="px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent transition-colors flex items-center gap-2 font-medium"
                >
                  <Activity className="w-4 h-4" />
                  Run Diagnosis
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors flex items-center gap-2 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Strategy
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Diagnosis Alert */}
      <AnimatePresence>
        {diagnosisResult && !diagnosisResult.success && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-white">
                  Diagnosis: {diagnosisResult.issues.length} Issues Found
                </h3>
                <p className="text-gray-400">
                  The following sections need attention to improve your
                  strategy's viability score:
                </p>
                <div className="grid md:grid-cols-2 gap-2 mt-2">
                  {diagnosisResult.issues.map((issue, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-red-300 bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10"
                    >
                      <X className="w-4 h-4 shrink-0" />
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setDiagnosisResult(null)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-accent" />
                  Execution Timeline
                </h3>
                {isEditing && (
                  <button
                    onClick={() =>
                      addTimelinePhase({
                        title: "New Phase",
                        description: "Phase description",
                        date: new Date().toISOString().split("T")[0],
                      })
                    }
                    className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white transition-colors border border-white/10"
                  >
                    + Add Phase
                  </button>
                )}
              </div>

              <div className="grid gap-4">
                {timeline.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                    No timeline phases defined.{" "}
                    {isEditing
                      ? "Add one to get started."
                      : "Edit to add phases."}
                  </div>
                ) : (
                  timeline.map((phase, index) => (
                    <div
                      key={phase.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-4 group hover:border-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        {isEditing ? (
                          <input
                            value={phase.title}
                            onChange={(e) =>
                              updateTimelinePhase(phase.id, {
                                title: e.target.value,
                              })
                            }
                            className="bg-transparent border-b border-white/10 focus:border-accent outline-none w-full font-bold text-white"
                          />
                        ) : (
                          <h4 className="text-white font-bold mb-1">
                            {phase.title}
                          </h4>
                        )}

                        {isEditing ? (
                          <textarea
                            value={phase.description}
                            onChange={(e) =>
                              updateTimelinePhase(phase.id, {
                                description: e.target.value,
                              })
                            }
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-gray-300 focus:border-accent outline-none resize-none"
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-gray-400">
                            {phase.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {isEditing ? (
                              <input
                                type="date"
                                value={phase.date}
                                onChange={(e) =>
                                  updateTimelinePhase(phase.id, {
                                    date: e.target.value,
                                  })
                                }
                                className="bg-transparent border-b border-white/10 focus:border-accent outline-none text-gray-300"
                              />
                            ) : (
                              <span>{phase.date || "No date set"}</span>
                            )}
                          </div>

                          {isEditing ? (
                            <select
                              value={phase.status}
                              onChange={(e) =>
                                updateTimelinePhase(phase.id, {
                                  status: e.target.value,
                                })
                              }
                              className="bg-black/50 border border-white/10 rounded px-2 py-1 text-[10px] text-white outline-none uppercase"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : (
                            <div
                              className={`px-2 py-1 rounded text-[10px] font-mono uppercase ${
                                phase.status === "completed"
                                  ? "bg-green-500/10 text-green-400"
                                  : phase.status === "in-progress"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-white/5 text-gray-500"
                              }`}
                            >
                              {phase.status}
                            </div>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <button
                          onClick={() => removeTimelinePhase(phase.id)}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Tabs.Content>

            <Tabs.Content
              value="market"
              className="outline-none animate-in fade-in slide-in-from-bottom-4 space-y-8"
            >
              {/* Market Size Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Market Sizing (TAM/SAM/SOM)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(marketAnalysis.marketSize).map(
                    ([key, data]) => (
                      <div
                        key={key}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group"
                      >
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          {key}
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                          <span className="text-gray-400 text-sm">$</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={data.value}
                              onChange={(e) =>
                                updateMarketSize(key, { value: e.target.value })
                              }
                              placeholder="0"
                              className="bg-transparent border-b border-white/10 focus:border-accent outline-none w-full text-2xl font-black text-white"
                            />
                          ) : (
                            <span className="text-2xl font-black text-white">
                              {data.value || "0"}
                            </span>
                          )}
                          <span className="text-gray-400 text-sm">B</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {data.description}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Competitors Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Competitor Analysis
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() =>
                        addCompetitor({
                          name: "New Competitor",
                          strength: "High",
                          weakness: "None",
                          type: "direct",
                        })
                      }
                      className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white transition-colors border border-white/10"
                    >
                      + Add Competitor
                    </button>
                  )}
                </div>

                <div className="grid gap-4">
                  {marketAnalysis.competitors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                      No competitors listed.{" "}
                      {isEditing ? "Add key competitors." : ""}
                    </div>
                  ) : (
                    marketAnalysis.competitors.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white">
                            {comp.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">
                              {comp.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="uppercase">{comp.type}</span>
                              <span>•</span>
                              <span className="text-green-400">
                                Str: {comp.strength}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => removeCompetitor(comp.id)}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Tabs.Content>

            <Tabs.Content
              value="risks"
              className="outline-none animate-in fade-in slide-in-from-bottom-4 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent" />
                  Risk Register
                </h3>
                <button
                  onClick={() =>
                    addRisk({
                      description: "New Risk",
                      impact: "medium",
                      probability: "medium",
                      mitigation: "",
                    })
                  }
                  className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white transition-colors border border-white/10"
                >
                  + Add Risk
                </button>
              </div>

              <div className="grid gap-4">
                {risks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                    No risks identified yet. Add one to get started.
                  </div>
                ) : (
                  risks.map((risk) => (
                    <div
                      key={risk.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-4 group"
                    >
                      <div className="flex-1 space-y-2">
                        {isEditing ? (
                          <input
                            value={risk.description}
                            onChange={(e) =>
                              updateRisk(risk.id, {
                                description: e.target.value,
                              })
                            }
                            className="bg-transparent border-b border-white/10 focus:border-accent outline-none w-full font-bold text-white"
                          />
                        ) : (
                          <h4 className="font-bold text-white">
                            {risk.description}
                          </h4>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Impact:</span>
                            {isEditing ? (
                              <select
                                value={risk.impact}
                                onChange={(e) =>
                                  updateRisk(risk.id, {
                                    impact: e.target.value,
                                  })
                                }
                                className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  risk.impact === "high"
                                    ? "bg-red-500/20 text-red-400"
                                    : risk.impact === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {risk.impact}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Prob:</span>
                            {isEditing ? (
                              <select
                                value={risk.probability}
                                onChange={(e) =>
                                  updateRisk(risk.id, {
                                    probability: e.target.value,
                                  })
                                }
                                className="bg-black/50 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none"
                              >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                              </select>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  risk.probability === "high"
                                    ? "bg-red-500/20 text-red-400"
                                    : risk.probability === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {risk.probability}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className="text-xs text-gray-500 block mb-1">
                            Mitigation Strategy:
                          </span>
                          {isEditing ? (
                            <textarea
                              value={risk.mitigation}
                              onChange={(e) =>
                                updateRisk(risk.id, {
                                  mitigation: e.target.value,
                                })
                              }
                              className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-gray-300 focus:border-accent outline-none resize-none"
                              rows={2}
                              placeholder="How will you mitigate this risk?"
                            />
                          ) : (
                            <p className="text-sm text-gray-400">
                              {risk.mitigation ||
                                "No mitigation strategy defined."}
                            </p>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <button
                          onClick={() => removeRisk(risk.id)}
                          className="self-start p-2 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
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
