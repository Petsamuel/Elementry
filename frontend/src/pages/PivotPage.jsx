import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
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
} from "lucide-react";

export default function PivotPage() {
  const { user, selectedProjectId } = useAuthStore();
  const [selectedPivot, setSelectedPivot] = useState(null);
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
  const pivotOptions = projectData?.pivot_options || [];

  // Auto-select the most recent saved pivot if available and nothing selected
  useEffect(() => {
    if (savedPivots.length > 0 && !selectedPivot) {
      setSelectedPivot(savedPivots[0]);
    }
  }, [savedPivots, selectedPivot]);

  const createPivotMutation = useMutation({
    mutationFn: ({ pivotName, projectId, token }) =>
      api.createPivot({ project_id: projectId, pivot_name: pivotName }, token),
    onSuccess: () => {
      toast.success("Pivot simulation activated!");
      // Refetch pivots to update the list
      queryClient.invalidateQueries(["pivots", selectedProjectId]);
    },
    onError: (error) => {
      console.error("Failed to create pivot:", error);
      toast.error("Failed to activate pivot simulation.");
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
          <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-green-500/20 backdrop-blur-sm border border-accent/20">
            <GitBranch className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-text">Pivot Engineering</h1>
        </div>
        <p className="text-text-muted text-lg">
          Analyze adjacent market vectors and simulate strategic pivots.
        </p>
      </motion.div>

      {/* Current Trajectory */}
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
          <p className="text-gray-300 leading-relaxed text-lg">
            {projectData.name}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pivot Options List */}
        <div className="lg:col-span-2 space-y-6">
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
              <div className="grid grid-cols-1 gap-4">
                {savedPivots.map((pivot, index) => (
                  <motion.div
                    key={pivot.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setSelectedPivot(pivot)}
                    className={`relative group cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
                      selectedPivot?.id === pivot.id
                        ? "bg-accent/10 border-accent/50 shadow-[0_0_20px_rgba(200,255,22,0.1)]"
                        : "bg-obsidian border-white/5 hover:border-accent/30 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-accent text-obsidian">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1 text-accent">
                          {pivot.pivot_name}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>
                            Viability: {pivot.analysis?.viability_score || 0}%
                          </span>
                          <span>•</span>
                          <span>
                            {pivot.analysis?.progress_percentage || 0}% Complete
                          </span>
                        </div>
                      </div>
                      <div className="self-center">
                        <ArrowRight className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Potential Vectors (From Project Data) */}
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
                    setSelectedPivot({ pivot_name: pivotName, isPreview: true })
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
        </div>

        {/* Simulation / Detail View */}
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
                    <RefreshCw className="w-4 h-4 text-accent animate-spin-slow" />
                    <span className="text-xs font-mono text-accent">
                      {selectedPivot.isPreview
                        ? "PREVIEW_MODE"
                        : selectedPivot.analysis?.status?.toUpperCase() ||
                          "SIMULATION_ACTIVE"}
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
                          {selectedPivot.analysis?.viability_score || 0}/100
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
                          {selectedPivot.analysis?.market_fit || "Analyzing..."}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{
                            width: `${
                              selectedPivot.analysis?.market_fit_score || 0
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
                            {selectedPivot.analysis?.progress_percentage || 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all duration-500"
                            style={{
                              width: `${
                                selectedPivot.analysis?.progress_percentage || 0
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Week {selectedPivot.analysis?.current_week || 0} of{" "}
                          {selectedPivot.analysis?.estimated_timeline_weeks ||
                            0}
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
                              <span className="text-orange-400 mt-0.5">•</span>
                              {risk}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Actions */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      Recommended Actions
                    </h4>
                    <ul className="space-y-2">
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
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm"
                            >
                              {completed ? (
                                <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={
                                    completed
                                      ? "text-gray-500 line-through"
                                      : "text-gray-300"
                                  }
                                >
                                  {action}
                                </p>
                                {typeof actionItem === "object" && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded border inline-block mt-1 ${getPriorityColor(
                                      priority
                                    )}`}
                                  >
                                    {priority}
                                  </span>
                                )}
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>

                  {/* Milestones */}
                  {selectedPivot.analysis?.milestones && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        Milestones
                      </h4>
                      <div className="space-y-2">
                        {selectedPivot.analysis.milestones.map(
                          (milestone, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-white/5 border border-white/5"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">
                                  {milestone.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Week {milestone.due_weeks}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">
                                {milestone.description}
                              </p>
                            </div>
                          )
                        )}
                      </div>
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
                  Choose a pivot option from the list to view detailed analysis
                  and simulation data.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
