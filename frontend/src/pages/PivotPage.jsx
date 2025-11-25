import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import {
  GitBranch,
  Target,
  LayoutGrid,
  Stethoscope,
  Layers,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  ChevronDown,
  FolderOpen,
  Network,
  Plus,
  X,
  Sparkles,
  Loader2,
  Send,
  Calendar,
  Activity,
} from "lucide-react";
import {
  StrategyListItem,
  StrategyDetailView,
} from "../components/PivotComponents";
import StrategyBoard from "../components/StrategyBoard";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DeconstructLoader,
  StrategyUnlockLoader,
} from "../components/CreativeLoaders";

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
        layoutId="activeTabPivot"
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

export default function PivotPage() {
  const { user, selectedProjectId, setSelectedProjectId, currency } =
    useAuthStore();
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [challenges, setChallenges] = useState("");
  const [newProjectIdea, setNewProjectIdea] = useState("");
  const [diagnosisTab, setDiagnosisTab] = useState("select"); // 'select' | 'new'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'board' | 'evolution'
  const [analyzingStrategyId, setAnalyzingStrategyId] = useState(null);

  const queryClient = useQueryClient();

  // Fetch project
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Fetch active pivots
  const { data: activePivots = [] } = useQuery({
    queryKey: ["pivots", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getPivots(selectedProjectId, token);
      return response.pivots || [];
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Fetch recent projects for selector
  const { data: recentProjects = [] } = useQuery({
    queryKey: ["pivotRecentProjects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getRecentProjects(token);
      return response.projects || [];
    },
    enabled: !!user,
  });

  // Automatically select the most recent project if none is selected
  useEffect(() => {
    if (!selectedProjectId && recentProjects.length > 0) {
      setSelectedProjectId(recentProjects[0].id);
    }
  }, [recentProjects, selectedProjectId, setSelectedProjectId]);

  // Combine potential and active strategies
  const strategies = [
    ...(activePivots.map((p) => ({
      ...p,
      id: p.id,
      title: p.pivot_name,
      description: p.analysis?.market_fit || "Active pivot strategy",
      status: p.status || "discovery",
      type: "pivot", // Default to pivot for now
      analysis: p.analysis,
    })) || []),
    ...(projectData?.pivot_options || [])
      .filter(
        (opt) => !activePivots.some((p) => p.pivot_name === opt) // Filter out already active ones
      )
      .map((opt, i) => ({
        id: `potential-${i}`,
        title: opt,
        description: "Potential pivot opportunity. Analyze to unlock details.",
        status: "potential",
        type: "pivot",
      })),
  ];

  // --- Mutations ---

  const createPivotMutation = useMutation({
    mutationFn: async (pivotName) => {
      const token = await user.getIdToken();
      return api.createPivot(
        { project_id: selectedProjectId, pivot_name: pivotName, currency },
        token
      );
    },
    onSuccess: () => {
      toast.success("Analysis complete! Strategy added to board.");
      queryClient.invalidateQueries(["pivots", selectedProjectId]);
    },
    onError: () => {
      toast.error("Failed to analyze pivot.");
    },
  });

  const updatePivotStatusMutation = useMutation({
    mutationFn: async ({ pivotId, status }) => {
      const token = await user.getIdToken();
      return api.updatePivotStatus(pivotId, status, token);
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries(["pivots", selectedProjectId]);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const diagnoseMutation = useMutation({
    mutationFn: async ({ projectId, challenges, currency, token }) => {
      return api.diagnoseProject(projectId, challenges, currency, token);
    },
    onSuccess: () => {
      toast.success("Diagnosis complete!");
      queryClient.invalidateQueries(["project", selectedProjectId]);
      setShowDiagnosisForm(false);
      setChallenges("");
    },
    onError: (error) => {
      console.error("Diagnosis failed:", error);
      toast.error("Failed to run diagnosis.");
    },
  });

  const deconstructMutation = useMutation({
    mutationFn: async (idea) => {
      const token = await user.getIdToken();
      return api.deconstructIdea(idea, currency, token);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["recent-projects"]);
      setSelectedProjectId(data.project_id);
      toast.success("Idea deconstructed successfully!");
      setShowDiagnosisForm(false);
    },
    onError: () => toast.error("Failed to deconstruct idea."),
  });

  // --- Handlers ---

  const handleAnalyze = (strategy) => {
    setAnalyzingStrategyId(strategy.id);
    createPivotMutation.mutate(strategy.title, {
      onSettled: () => setAnalyzingStrategyId(null),
    });
  };

  const handleStatusChange = (id, newStatus) => {
    updatePivotStatusMutation.mutate({ pivotId: id, status: newStatus });
  };

  const handleDeleteStrategy = (id) => {
    toast.error("Delete not yet implemented in backend");
  };

  const handleRunDiagnosis = async (e) => {
    if (e) e.preventDefault();

    if (!selectedProjectId) {
      toast.error("Please select a project first");
      return;
    }

    try {
      const token = await user.getIdToken();
      diagnoseMutation.mutate({
        projectId: selectedProjectId,
        challenges: challenges || "General diagnosis",
        currency,
        token,
      });
    } catch (error) {
      console.error("Error running diagnosis:", error);
    }
  };

  const handleCreateAndDiagnose = async () => {
    if (!newProjectIdea.trim()) {
      toast.error("Please enter a project idea");
      return;
    }
    try {
      deconstructMutation.mutate(newProjectIdea);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 text-white space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <Badge className="bg-accent/10 text-accent border-accent/20">
                  Pivot Engineering
                </Badge>
                <span className="text-xs text-text-muted font-mono">
                  BETA_MODULE
                </span>
              </motion.div>

              <div className="flex items-center gap-4">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-500 uppercase w-sm truncate"
                >
                  {projectData?.name || "Pivot Engineering"}
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
                    active={activeTab === "board"}
                    onClick={() => setActiveTab("board")}
                    icon={LayoutGrid}
                  >
                    Strategy <span className="lg:block hidden">Board</span>
                  </TabButton>
                  <TabButton
                    active={activeTab === "evolution"}
                    onClick={() => setActiveTab("evolution")}
                    icon={Network}
                  >
                    Evolution
                  </TabButton>
                </div>
              </LayoutGroup>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Hero Section: Cheapest Entry Point */}
              <Card
                className="p-8 relative group overflow-hidden border-accent/30 cursor-pointer hover:border-accent/50 transition-all"
                onClick={() =>
                  useAuthStore.getState().setCurrentPage("cheapest")
                }
              >
                <div className="absolute inset-0 bg-linear-to-r from-accent/10 via-transparent to-transparent opacity-50" />
                <div className="absolute right-0 top-0 w-64 h-64 bg-accent/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-accent/20 border border-accent/30 text-accent">
                        <Target className="w-6 h-6" />
                      </div>
                      <h2 className="text-lg font-bold text-accent tracking-wide uppercase">
                        Cheapest Entry Point
                      </h2>
                    </div>
                    <h3
                      className="text-xl md:text-5xl font-black text-white leading-tight line-clamp-3"
                      title={projectData?.cheapest_entry_point || "N/A"}
                    >
                      {projectData?.cheapest_entry_point || "N/A"}
                    </h3>
                    <p className="text-gray-400 lg:text-lg text-sm">
                      This is your Minimum Viable Segment. Focus your initial
                      validation efforts here to minimize cost and maximize
                      learning.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <span className="text-xs text-gray-500 uppercase font-bold">
                        Estimated Cost
                      </span>
                      <div className="text-xl font-mono text-white">
                        {projectData?.estimated_cost || "N/A"}
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <span className="text-xs text-gray-500 uppercase font-bold">
                        Time to Validate
                      </span>
                      <div className="text-xl font-mono text-white">
                        {projectData?.time_to_validate || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Diagnosis Action */}
              <Card
                className="p-10 relative overflow-hidden border-accent/30"
                delay={0.3}
              >
                <div className="absolute inset-0 bg-linear-to-r from-accent/10 via-transparent to-transparent opacity-50" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-start gap-6 flex-col">
                    <div className="flex items-center gap-3">
                      <div className="p-5 rounded-2xl bg-accent/10 text-accent border border-accent/20 shadow-[0_0_30px_-10px_rgba(0,255,0,0.3)]">
                        <Stethoscope className="lg:w-10 lg:h-10 w-8 h-8" />
                      </div>
                      <h3 className="lg:text-3xl text-xl font-bold text-white">
                        AI Diagnosis
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-400 lg:text-xl text-lg max-w-full">
                        Identify weak links in your strategy and generate new
                        discovery options using our advanced AI model.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDiagnosisForm(true)}
                    className="btn-primary px-10 py-5 flex items-center gap-3 rounded-xl font-bold text-xl hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                  >
                    <Stethoscope className="w-6 h-6" />
                    Diagnosis
                  </button>
                </div>
              </Card>

              {/* Pipeline Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  {
                    label: "Discovery",
                    count: activePivots.filter((p) => p.status === "discovery")
                      .length,
                    icon: Layers,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                  },
                  {
                    label: "Validation",
                    count: activePivots.filter((p) => p.status === "validation")
                      .length,
                    icon: GitBranch,
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                  },
                  {
                    label: "Growth",
                    count: activePivots.filter((p) => p.status === "growth")
                      .length,
                    icon: TrendingUp,
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                  },
                  {
                    label: "Success",
                    count: activePivots.filter((p) => p.status === "success")
                      .length,
                    icon: CheckCircle2,
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/20",
                  },
                ].map((stat, i) => (
                  <Card
                    key={i}
                    className="p-6 flex items-center gap-5 hover:bg-white/5 transition-colors"
                    delay={0.4 + i * 0.1}
                  >
                    <div
                      className={`p-3 rounded-xl ${stat.bg} ${stat.border} border ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-3xl font-black text-white">
                        {stat.count}
                      </div>
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* STRATEGY BOARD TAB */}
          {activeTab === "board" && (
            <StrategyBoard
              strategies={strategies}
              onEdit={(s) => {
                useAuthStore.getState().setSelectedStrategyId(s.id);
                useAuthStore.getState().setCurrentPage("strategy-details");
              }}
              onDelete={handleDeleteStrategy}
              onStatusChange={handleStatusChange}
              onAnalyze={handleAnalyze}
              analyzingStrategyId={analyzingStrategyId}
            />
          )}

          {/* EVOLUTION TAB (Placeholder) */}
          {activeTab === "evolution" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Network className="w-6 h-6 text-accent" />
                  Strategy Evolution Map
                </h3>
                <div className="text-sm text-gray-400">
                  {activePivots.length + 1} Nodes
                </div>
              </div>

              <div className="relative pl-8 border-l-2 border-white/10 space-y-12">
                {/* Project Origin Node */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-obsidian shadow-[0_0_0_4px_rgba(255,255,255,0.1)]" />
                  <Card className="p-6 border-white/20">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          Origin
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {projectData?.name}
                        </h4>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {projectData?.original_idea || "Initial concept"}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {projectData?.created_at
                          ? new Date(
                              projectData.created_at
                            ).toLocaleDateString()
                          : "Unknown Date"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Score: {projectData?.overall_score || 0}/100
                      </span>
                    </div>
                  </Card>
                </motion.div>

                {/* Pivot Nodes */}
                {activePivots
                  .sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                  )
                  .map((pivot, index) => (
                    <motion.div
                      key={pivot.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="relative"
                    >
                      <div
                        className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-obsidian shadow-[0_0_0_4px_rgba(255,255,255,0.1)] ${
                          pivot.status === "success"
                            ? "bg-green-500"
                            : pivot.status === "growth"
                            ? "bg-purple-500"
                            : "bg-accent"
                        }`}
                      />
                      <Card
                        className="p-6 hover:border-accent/50 transition-colors cursor-pointer"
                        onClick={() => {
                          useAuthStore
                            .getState()
                            .setSelectedStrategyId(pivot.id);
                          useAuthStore
                            .getState()
                            .setCurrentPage("strategy-details");
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Pivot {index + 1}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  pivot.status === "success"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-accent/10 text-accent"
                                }`}
                              >
                                {pivot.status}
                              </span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">
                              {pivot.pivot_name}
                            </h4>
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {pivot.analysis?.market_fit || pivot.description}
                            </p>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5">
                            <GitBranch className="w-5 h-5 text-accent" />
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {pivot.created_at
                              ? new Date(pivot.created_at).toLocaleDateString()
                              : "Unknown Date"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Viability: {pivot.analysis?.viability_score || 0}%
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}

                {activePivots.length === 0 && (
                  <div className="relative">
                    <div className="absolute -left-[39px] top-0 w-4 h-4 rounded-full bg-white/20 border-4 border-obsidian" />
                    <div className="p-6 border border-white/5 border-dashed rounded-2xl bg-white/5 text-center text-gray-500">
                      No pivots yet. Start by exploring strategies.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Strategy Detail Modal */}
      <StrategyDetailView
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingStrategy}
        onSave={(data) => {
          // Handle save (update mutation)
          console.log("Saving strategy:", data);
          setIsModalOpen(false);
        }}
      />

      {/* Diagnosis Modal */}
      <Dialog.Root open={showDiagnosisForm} onOpenChange={setShowDiagnosisForm}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <Dialog.Title className="text-xl font-bold text-white flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-accent" />
                Run AI Diagnosis
              </Dialog.Title>
              <Dialog.Close className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <Tabs.Root
              value={diagnosisTab}
              onValueChange={setDiagnosisTab}
              className="p-6"
            >
              <Tabs.List className="flex gap-4 mb-6 bg-white/5 p-1 rounded-xl">
                <Tabs.Trigger
                  value="select"
                  className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all"
                >
                  Select Project
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="new"
                  className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all"
                >
                  New Project
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="select" className="space-y-4 outline-none">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Select Project to Diagnose
                  </label>
                  <div className="relative">
                    <select
                      value={selectedProjectId || ""}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select a project...
                      </option>
                      {recentProjects.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-[#0A0A0A]"
                        >
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Specific Challenges (Optional)
                  </label>
                  <textarea
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    placeholder="Describe specific issues you're facing..."
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleRunDiagnosis}
                  disabled={diagnoseMutation.isPending || !selectedProjectId}
                  className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
                >
                  {diagnoseMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Diagnosing...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      Run Diagnosis
                    </>
                  )}
                </button>
              </Tabs.Content>

              <Tabs.Content value="new" className="space-y-4 outline-none">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Describe Your New Idea
                  </label>
                  <textarea
                    value={newProjectIdea}
                    onChange={(e) => setNewProjectIdea(e.target.value)}
                    placeholder="Describe your product idea to create a new project and run diagnosis..."
                    className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleCreateAndDiagnose}
                  disabled={
                    deconstructMutation.isPending || !newProjectIdea.trim()
                  }
                  className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
                >
                  {deconstructMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating & Diagnosing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create & Diagnose
                    </>
                  )}
                </button>
              </Tabs.Content>
            </Tabs.Root>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

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

      {/* Creative Loading Overlay for Diagnosis */}
      <AnimatePresence>
        {diagnoseMutation.isPending && (
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

      {/* Creative Loading Overlay for Strategy Unlock */}
      <AnimatePresence>
        {createPivotMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            <StrategyUnlockLoader />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
