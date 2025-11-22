import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
import ComparisonView from "../components/ComparisonView";
import {
  GitBranch,
  TrendingUp,
  Zap,
  ArrowRight,
  Target,
  Activity,
  CheckCircle2,
  Loader2,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  Circle,
  CheckCircle,
  LayoutGrid,
  X,
  Flag,
} from "lucide-react";

export default function PivotPage() {
  const { user, selectedProjectId, setSelectedProjectId } = useAuthStore();
  const [selectedPivot, setSelectedPivot] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const queryClient = useQueryClient();

  // Fetch project if selectedProjectId is present
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Fetch saved pivots
  const { data: savedPivotsData, isLoading: isLoadingPivots } = useQuery({
    queryKey: ["pivots", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getPivots(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  const savedPivots = savedPivotsData?.pivots || [];
  const allPivotOptions = projectData?.pivot_options || [];

  // Filter out pivot options that are already active simulations
  const pivotOptions = allPivotOptions.filter(
    (option) => !savedPivots.some((p) => p.pivot_name === option)
  );

  // Auto-select latest project if none selected
  useEffect(() => {
    const initProject = async () => {
      if (user && !selectedProjectId) {
        try {
          const token = await user.getIdToken();
          const response = await api.getRecentProjects(token);
          if (response.projects && response.projects.length > 0) {
            // Sort by updated_at desc just in case
            const sorted = response.projects.sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            );
            setSelectedProjectId(sorted[0].id);
          }
        } catch (error) {
          console.error("Failed to auto-select project:", error);
        }
      }
    };
    initProject();
  }, [user, selectedProjectId, setSelectedProjectId]);

  // Auto-select the most recent saved pivot or first option if available
  useEffect(() => {
    if (!selectedPivot && !comparisonMode) {
      if (savedPivots.length > 0) {
        // Prioritize saved pivots
        setSelectedPivot(savedPivots[0]);
      } else if (pivotOptions.length > 0) {
        // Fallback to first potential vector as preview
        setSelectedPivot({ pivot_name: pivotOptions[0], isPreview: true });
      }
    }
  }, [savedPivots, pivotOptions, selectedPivot, comparisonMode]);

  const createPivotMutation = useMutation({
    mutationFn: ({ pivotName, projectId, token }) =>
      api.createPivot({ project_id: projectId, pivot_name: pivotName }, token),
    onSuccess: () => {
      toast.success("Pivot simulation activated!");
      queryClient.invalidateQueries(["pivots", selectedProjectId]);
    },
    onError: (error) => {
      console.error("Failed to create pivot:", error);
      toast.error("Failed to activate pivot simulation.");
    },
  });

  const completeActionMutation = useMutation({
    mutationFn: ({ pivotId, actionIndex, completed, token }) =>
      api.updatePivotAction(pivotId, actionIndex, completed, token),
    onSuccess: (updatedPivot) => {
      toast.success("Action updated!");
      queryClient.invalidateQueries(["pivots", selectedProjectId]);
      if (!comparisonMode) {
        setSelectedPivot(updatedPivot);
      }
    },
    onError: (error) => {
      console.error("Failed to update action:", error);
      toast.error("Failed to update action status.");
    },
  });

  const handleActivatePivot = async () => {
    if (!selectedPivot?.isPreview || !projectData?.id) return;

    try {
      const token = await user.getIdToken();
      createPivotMutation.mutate({
        pivotName: selectedPivot.pivot_name,
        projectId: projectData.id,
        token,
      });
    } catch (error) {
      console.error("Error activating pivot:", error);
    }
  };

  const handleToggleAction = async (index, currentCompleted) => {
    if (selectedPivot.isPreview) return;

    try {
      const token = await user.getIdToken();
      completeActionMutation.mutate({
        pivotId: selectedPivot.id,
        actionIndex: index,
        completed: !currentCompleted,
        token,
      });
    } catch (error) {
      console.error("Error toggling action:", error);
    }
  };

  const toggleComparisonSelection = (pivotId) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(pivotId)) {
        return prev.filter((id) => id !== pivotId);
      } else {
        if (prev.length >= 3) {
          toast.error("You can compare up to 3 simulations");
          return prev;
        }
        return [...prev, pivotId];
      }
    });
  };

  // Helper function to get risk color
  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "text-green-400";
      case "medium":
        return "text-yellow-400";
      case "medium-high":
      case "high":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (isLoadingProject || isLoadingPivots) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="p-4 rounded-full bg-white/5 mb-4">
          <GitBranch className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          No Project Selected
        </h2>
        <p className="text-text-muted">
          Please select a project from the dashboard or deconstruct a new idea.
        </p>
      </div>
    );
  }

  const pivotsToCompare = savedPivots.filter((p) =>
    selectedForComparison.includes(p.id)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between lg:flex-row flex-col">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-green-500/20 backdrop-blur-sm border border-accent/20">
              <GitBranch className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text">
                Pivot Engineering
              </h1>
              <p className="text-text-muted text-lg mt-1">
                Analyze adjacent market vectors and simulate strategic pivots.
              </p>
            </div>
          </div>

          {savedPivots.length >= 2 && (
            <button
              onClick={() => {
                setComparisonMode(!comparisonMode);
                if (!comparisonMode) {
                  setSelectedForComparison([]);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                comparisonMode
                  ? "bg-accent text-obsidian border-accent font-bold"
                  : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
              }`}
            >
              {comparisonMode ? (
                <X className="w-4 h-4" />
              ) : (
                <LayoutGrid className="w-4 h-4" />
              )}
              {comparisonMode ? "Exit Comparison" : "Compare Simulations"}
            </button>
          )}
        </div>
      </motion.div>

      {/* Comparison View */}
      {comparisonMode && pivotsToCompare.length >= 2 ? (
        <ComparisonView pivots={pivotsToCompare} />
      ) : (
        <>
          {/* Current Trajectory (Hide in comparison mode if active) */}
          {!comparisonMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group bg-obsidian border border-white/5 rounded-xl overflow-hidden p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-white">Current Trajectory</h3>
                  <span className="text-xs font-mono text-accent bg-primary/10 px-2 py-1 rounded ml-2">
                    ACTIVE
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg overflow-hidden text-pretty text-ellipsis truncate">
                  {projectData.name} 
                </p>
              </div>
            </motion.div>
          )}

          <div
            className={`grid grid-cols-1 ${
              comparisonMode ? "lg:grid-cols-4" : "lg:grid-cols-3"
            } gap-8`}
          >
            {/* Pivot Options List */}
            <div
              className={`${
                comparisonMode ? "lg:col-span-4" : "lg:col-span-2"
              } space-y-6`}
            >
              {/* Active Simulations (Saved Pivots) */}
              {savedPivots.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-accent" />
                      Active Simulations
                    </h2>
                    <span className="text-xs font-mono text-accent">
                      {savedPivots.length} RUNNING
                    </span>
                  </div>

                  {comparisonMode && (
                    <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg flex items-center gap-3 text-sm text-accent mb-4">
                      <LayoutGrid className="w-4 h-4" />
                      Select 2-3 simulations below to compare them side-by-side.
                    </div>
                  )}

                  <div
                    className={`grid ${
                      comparisonMode
                        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                    } gap-4`}
                  >
                    {savedPivots.map((pivot, index) => (
                      <motion.div
                        key={pivot.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        onClick={() => {
                          if (comparisonMode) {
                            toggleComparisonSelection(pivot.id);
                          } else {
                            setSelectedPivot(pivot);
                          }
                        }}
                        className={`relative group cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
                          comparisonMode
                            ? selectedForComparison.includes(pivot.id)
                              ? "bg-accent/10 border-accent/50 shadow-[0_0_20px_rgba(200,255,22,0.1)]"
                              : "bg-obsidian border-white/5 hover:bg-white/5"
                            : selectedPivot?.id === pivot.id
                            ? "bg-accent/10 border-accent/50 shadow-[0_0_20px_rgba(200,255,22,0.1)]"
                            : "bg-obsidian border-white/5 hover:border-accent/30 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {comparisonMode ? (
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center mt-1 transition-colors ${
                                selectedForComparison.includes(pivot.id)
                                  ? "bg-accent border-accent text-obsidian"
                                  : "border-gray-500"
                              }`}
                            >
                              {selectedForComparison.includes(pivot.id) && (
                                <CheckCircle className="w-3.5 h-3.5" />
                              )}
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-accent text-obsidian">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h4
                              className={`font-medium mb-1 ${
                                comparisonMode &&
                                selectedForComparison.includes(pivot.id)
                                  ? "text-accent"
                                  : "text-white"
                              }`}
                            >
                              {pivot.pivot_name}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span>
                                Viability:{" "}
                                {pivot.analysis?.viability_score || 0}%
                              </span>
                              <span>•</span>
                              <span>
                                {pivot.analysis?.progress_percentage || 0}% Done
                              </span>
                            </div>
                          </div>
                          {!comparisonMode && (
                            <div className="self-center">
                              <ArrowRight className="w-5 h-5 text-accent" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Potential Vectors (Hide in comparison mode) */}
              {!comparisonMode && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-gray-400" />
                      Potential Vectors
                    </h2>
                    <span className="text-xs font-mono text-text-muted">
                      {pivotOptions.length} DETECTED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {pivotOptions.map((pivotName, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        onClick={() =>
                          setSelectedPivot({
                            pivot_name: pivotName,
                            isPreview: true,
                          })
                        }
                        className={`relative group cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
                          selectedPivot?.pivot_name === pivotName &&
                          selectedPivot?.isPreview
                            ? "bg-white/10 border-white/20"
                            : "bg-obsidian border-white/5 hover:border-white/20 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-white transition-colors">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1 text-white group-hover:text-white transition-colors">
                              {pivotName}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              Potential Pivot Opportunity
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulation / Detail View (Hide in comparison mode) */}
            {!comparisonMode && (
              <div className="lg:col-span-1">
                <AnimatePresence mode="wait">
                  {selectedPivot ? (
                    <motion.div
                      key={selectedPivot.id || selectedPivot.pivot_name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="sticky top-6 bg-obsidian border border-white/5 rounded-xl overflow-hidden"
                    >
                      {/* Header */}
                      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-accent/5 to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw
                            className={`w-4 h-4 text-accent ${
                              selectedPivot.analysis?.status === "in_progress"
                                ? "animate-spin-slow"
                                : ""
                            }`}
                          />
                          <span className="text-xs font-mono text-accent">
                            {selectedPivot.isPreview
                              ? "PREVIEW_MODE"
                              : selectedPivot.analysis?.status
                                  ?.toUpperCase()
                                  .replace("_", " ") || "SIMULATION_ACTIVE"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">
                          {selectedPivot.pivot_name}
                        </h3>
                      </div>

                      <div className="p-6 space-y-6 max-h-full overflow-y-auto">
                        {/* Metrics */}
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">
                                Viability Score
                              </span>
                              <span className="text-accent font-mono font-bold">
                                {selectedPivot.analysis?.viability_score || 0}
                                /100
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent transition-all duration-500"
                                style={{
                                  width: `${
                                    selectedPivot.analysis?.viability_score || 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">
                                Market Fit
                              </span>
                              <span className="text-primary font-mono font-bold">
                                {selectedPivot.analysis?.market_fit ||
                                  "Analyzing..."}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{
                                  width: `${
                                    selectedPivot.analysis?.market_fit_score ||
                                    0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Progress (for active simulations) */}
                          {!selectedPivot.isPreview && (
                            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-accent flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Progress
                                </span>
                                <span className="text-accent font-mono font-bold">
                                  {selectedPivot.analysis
                                    ?.progress_percentage || 0}
                                  %
                                </span>
                              </div>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-accent transition-all duration-500"
                                  style={{
                                    width: `${
                                      selectedPivot.analysis
                                        ?.progress_percentage || 0
                                    }%`,
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                Week {selectedPivot.analysis?.current_week || 0}{" "}
                                of{" "}
                                {selectedPivot.analysis
                                  ?.estimated_timeline_weeks || 0}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Risk Assessment */}
                        {selectedPivot.analysis?.risk_level && (
                          <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertTriangle
                                className={`w-4 h-4 ${getRiskColor(
                                  selectedPivot.analysis.risk_level
                                )}`}
                              />
                              <h4 className="text-sm font-bold text-white">
                                Risk Assessment
                              </h4>
                              <span
                                className={`text-xs font-mono ${getRiskColor(
                                  selectedPivot.analysis.risk_level
                                )}`}
                              >
                                {selectedPivot.analysis.risk_level?.toUpperCase()}
                              </span>
                            </div>
                            <ul className="space-y-1">
                              {(selectedPivot.analysis.risk_factors || []).map(
                                (risk, i) => (
                                  <li
                                    key={i}
                                    className="text-xs text-gray-400 flex items-start gap-2"
                                  >
                                    <span className="text-orange-400 mt-0.5">
                                      •
                                    </span>
                                    {risk}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Estimates */}
                        {selectedPivot.analysis?.estimated_timeline && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  Timeline
                                </span>
                              </div>
                              <p className="text-sm font-medium text-white">
                                {selectedPivot.analysis.estimated_timeline}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  Investment
                                </span>
                              </div>
                              <p className="text-sm font-medium text-white">
                                {selectedPivot.analysis.estimated_investment}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <div className="pt-4 border-t border-white/5">
                          <button
                            onClick={
                              selectedPivot.isPreview
                                ? handleActivatePivot
                                : undefined
                            }
                            disabled={
                              createPivotMutation.isPending ||
                              !selectedPivot.isPreview
                            }
                            className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-50"
                          >
                            {createPivotMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            )}
                            {selectedPivot.isPreview
                              ? "Activate Simulation"
                              : "View Full Report"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center p-8 text-center border border-white/5 rounded-xl bg-white/5 border-dashed"
                    >
                      <div className="p-4 rounded-full bg-white/5 mb-4">
                        <Target className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-400 mb-2">
                        Select a Vector
                      </h3>
                      <p className="text-sm text-gray-500">
                        Choose a pivot option from the list to view detailed
                        analysis and simulation data.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Strategic Roadmap Section (New) */}
          {!comparisonMode && selectedPivot && !selectedPivot.isPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-white/5"
            >
              {/* Recommended Actions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        Action Plan
                      </h3>
                      <p className="text-xs text-gray-400">
                        High-impact steps to execute this pivot
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-accent">
                      {Math.round(
                        ((
                          selectedPivot.analysis?.recommended_actions || []
                        ).filter((a) =>
                          typeof a === "object" ? a.completed : false
                        ).length /
                          (selectedPivot.analysis?.recommended_actions || [])
                            .length) *
                          100
                      ) || 0}
                      %
                    </span>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Completion
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(selectedPivot.analysis?.recommended_actions || []).map(
                    (actionItem, i) => {
                      const action =
                        typeof actionItem === "string"
                          ? actionItem
                          : actionItem.action;
                      const priority =
                        typeof actionItem === "object"
                          ? actionItem.priority
                          : "medium";
                      const completed =
                        typeof actionItem === "object"
                          ? actionItem.completed
                          : false;

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() =>
                            !selectedPivot.isPreview &&
                            handleToggleAction(i, completed)
                          }
                          className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                            completed
                              ? "bg-accent/5 border-accent/20"
                              : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                          }`}
                        >
                          {/* Progress Bar Background for completed items */}
                          {completed && (
                            <motion.div
                              layoutId={`completed-bg-${i}`}
                              className="absolute inset-0 bg-accent/5 z-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            />
                          )}

                          <div className="relative z-10 flex items-start gap-4">
                            <div
                              className={`mt-0.5 p-1 rounded-full border transition-colors ${
                                completed
                                  ? "bg-accent text-black border-accent"
                                  : "border-gray-600 group-hover:border-accent/50 text-transparent"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <p
                                className={`text-sm font-medium leading-relaxed transition-colors ${
                                  completed
                                    ? "text-gray-400 line-through"
                                    : "text-gray-200"
                                }`}
                              >
                                {action}
                              </p>
                              {typeof actionItem === "object" && (
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getPriorityColor(
                                      priority
                                    )}`}
                                  >
                                    {priority} Priority
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
                    <Flag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Milestones
                    </h3>
                    <p className="text-xs text-gray-400">
                      Key achievements and timeline
                    </p>
                  </div>
                </div>

                <div className="relative pl-4 pt-2">
                  {/* Vertical Line */}
                  <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

                  <div className="space-y-8">
                    {selectedPivot.analysis?.milestones?.map((milestone, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                        className="relative flex gap-6 group"
                      >
                        {/* Timeline Node */}
                        <div
                          className={`relative z-10 w-6 h-6 rounded-full border-4 transition-colors shadow-lg ${
                            milestone.status === "completed"
                              ? "bg-primary border-black shadow-primary/50"
                              : "bg-obsidian border-gray-600 group-hover:border-primary"
                          }`}
                        >
                          {milestone.status === "completed" && (
                            <motion.div
                              layoutId="glow"
                              className="absolute inset-0 rounded-full bg-primary blur-md -z-10"
                            />
                          )}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 -mt-1">
                          <div className="bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group-hover:translate-x-1">
                            <div className="flex items-center justify-between mb-3">
                              <h4
                                className={`font-bold text-base ${
                                  milestone.status === "completed"
                                    ? "text-primary"
                                    : "text-white"
                                }`}
                              >
                                {milestone.name}
                              </h4>
                              <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                Week {milestone.due_weeks}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {(!selectedPivot.analysis?.milestones ||
                      selectedPivot.analysis.milestones.length === 0) && (
                      <div className="text-center py-12 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                        <Flag className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        No milestones defined for this pivot yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
