import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  GitBranch,
  Target,
  Sparkles,
  Plus,
  LayoutGrid,
  Stethoscope,
  ShieldAlert,
  Zap,
  Loader2,
  Layers,
  CheckCircle2,
  Trash2,
  Lightbulb,
  TrendingUp,
  Activity,
  Network,
  BarChart3,
  ArrowRight,
  ChevronDown,
  FolderOpen,
  RefreshCw,
  MoveRight,
  ChevronUp,
} from "lucide-react";
import {
  StrategyCard,
  DropColumn,
  StrategyDetailView,
} from "../components/PivotComponents";
import EvolutionMap from "../components/EvolutionMap";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
      {Icon && <Icon className={`w-4 h-4 ${active ? "text-accent" : ""}`} />}
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

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

// Custom hook for media query
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

// Debounce hook for auto-save
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default function PivotPage() {
  const { user, selectedProjectId, setSelectedProjectId } = useAuthStore();
  const [activeId, setActiveId] = useState(null);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [challenges, setChallenges] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'board' | 'evolution'
  const [showFixPivotPrompt, setShowFixPivotPrompt] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState(null); // { id, container }
  const [isBoardLoaded, setIsBoardLoaded] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(null);
  const [selectedCardForMove, setSelectedCardForMove] = useState(null);

  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const saveTimeoutRef = useRef(null);

  // Local state for columns
  const [columns, setColumns] = useState({
    discovery: [], // 7 Options
    validation: [], // Fix vs Pivot testing
    growth: [], // Scaling
    success: [], // Completed
  });

  const debouncedColumns = useDebounce(columns, 1000); // Debounce for 1 second

  // Fetch project
  const {
    data: projectData,
    isLoading: isLoadingProject,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
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

  // Initialize columns from project data
  useEffect(() => {
    if (projectData) {
      const potentialStrategies = (projectData.pivot_options || []).map(
        (opt, i) => ({
          id: `strategy-${i}-${Date.now()}`,
          title: opt,
          description: "Analyze market vectors to determine viability...",
          impact: "Medium",
          completed: false,
          type: null, // Not yet defined as Fix or Pivot
        })
      );

      // Only reset if we haven't modified (checking discovery length as proxy)
      if (
        columns.discovery.length === 0 &&
        columns.validation.length === 0 &&
        columns.growth.length === 0
      ) {
        setColumns((prev) => ({
          ...prev,
          discovery: potentialStrategies,
        }));
      }
    }
  }, [projectData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // --- Drag Handlers ---

  const findContainer = (id) => {
    if (id in columns) return id;
    return Object.keys(columns).find((key) =>
      columns[key].find((item) => item.id === id)
    );
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setColumns((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((i) => i.id === active.id);
      const overIndex = overItems.findIndex((i) => i.id === overId);

      let newIndex;
      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over?.id);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      const activeIndex = columns[activeContainer].findIndex(
        (i) => i.id === active.id
      );
      const overIndex = columns[overContainer].findIndex(
        (i) => i.id === over.id
      );

      if (activeIndex !== overIndex) {
        setColumns((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(
            prev[activeContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    // --- Promotion Logic ---
    // If moving from Discovery to Validation, trigger prompt
    if (activeContainer === "discovery" && overContainer === "validation") {
      setPendingPromotion({ id: active.id, container: overContainer });
      setShowFixPivotPrompt(true);
    }

    setActiveId(null);
  };

  // --- CRUD Handlers ---

  const handleAddStrategy = (data) => {
    const newStrategy = {
      id: `new-${Date.now()}`,
      ...data,
      completed: false,
    };
    setColumns((prev) => ({
      ...prev,
      discovery: [newStrategy, ...prev.discovery],
    }));
    toast.success("Strategy created");
  };

  const handleUpdateStrategy = (data) => {
    const container = findContainer(editingStrategy.id);
    if (!container) return;

    setColumns((prev) => ({
      ...prev,
      [container]: prev[container].map((item) =>
        item.id === editingStrategy.id ? { ...item, ...data } : item
      ),
    }));
    toast.success("Strategy updated");
  };

  const handleDeleteStrategy = (id) => {
    const container = findContainer(id);
    if (!container) return;

    setColumns((prev) => ({
      ...prev,
      [container]: prev[container].filter((item) => item.id !== id),
    }));
    toast.success("Strategy deleted");
  };

  const handleCompleteStrategy = (id) => {
    const container = findContainer(id);
    if (!container) return;

    const item = columns[container].find((i) => i.id === id);
    const newStatus = !item.completed;

    if (newStatus) {
      setColumns((prev) => ({
        ...prev,
        [container]: prev[container].filter((i) => i.id !== id),
        success: [{ ...item, completed: true }, ...prev.success],
      }));
      toast.success("Strategy marked as complete");
    } else {
      setColumns((prev) => ({
        ...prev,
        [container]: prev[container].filter((i) => i.id !== id),
        discovery: [{ ...item, completed: false }, ...prev.discovery],
      }));
      toast.success("Strategy reactivated");
    }
  };

  // --- Fix vs Pivot Logic ---
  const handleFixPivotDecision = (type) => {
    if (!pendingPromotion) return;

    const { id, container } = pendingPromotion;

    setColumns((prev) => ({
      ...prev,
      [container]: prev[container].map((item) =>
        item.id === id ? { ...item, type: type } : item
      ),
    }));

    setShowFixPivotPrompt(false);
    setPendingPromotion(null);
    toast.success(`Strategy marked as ${type === "fix" ? "Fix" : "Pivot"}`);
  };

  // --- Diagnosis Logic ---
  const diagnoseMutation = useMutation({
    mutationFn: async ({ projectId, challenges, token }) => {
      return api.diagnoseProject(projectId, challenges, token);
    },
    onSuccess: () => {
      toast.success("Diagnosis complete!");
      queryClient.invalidateQueries(["project", selectedProjectId]);
      setShowDiagnosisForm(false);
    },
    onError: (error) => {
      console.error("Diagnosis failed:", error);
      toast.error("Failed to run diagnosis.");
    },
  });

  const handleRunDiagnosis = async (e) => {
    e.preventDefault();
    if (!challenges.trim()) return;
    try {
      const token = await user.getIdToken();
      diagnoseMutation.mutate({
        projectId: selectedProjectId,
        challenges,
        token,
      });
    } catch (error) {
      console.error("Error running diagnosis:", error);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                  className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-white to-gray-500 uppercase line-clamp-2 truncate"
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
                          onClick={() => {
                            setSelectedProjectId(p.id);
                            // Reset columns on project switch to force reload
                            setColumns({
                              discovery: [],
                              validation: [],
                              growth: [],
                              success: [],
                            });
                          }}
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

                {/* <button
                  onClick={() => refetchProject()}
                  className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-400 hover:text-white"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button> */}
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
                    Strategy Board
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
              <Card className="p-8 relative group overflow-hidden border-accent/30">
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
                      className="text-4xl md:text-5xl font-black text-white leading-tight line-clamp-3"
                      title={projectData?.cheapest_entry_point || "N/A"}
                    >
                      {projectData?.cheapest_entry_point || "N/A"}
                    </h3>
                    <p className="text-gray-400 text-lg">
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
                        $0 - $500
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <span className="text-xs text-gray-500 uppercase font-bold">
                        Time to Validate
                      </span>
                      <div className="text-xl font-mono text-white">
                        1-2 Weeks
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
                  <div className="flex items-start gap-6">
                    <div className="p-5 rounded-2xl bg-accent/10 text-accent border border-accent/20 shadow-[0_0_30px_-10px_rgba(0,255,0,0.3)]">
                      <Stethoscope className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-white">
                        AI Diagnosis
                      </h3>
                      <p className="text-gray-400 text-lg max-w-xl">
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
                    count: columns.discovery.length,
                    icon: Layers,
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/20",
                  },
                  {
                    label: "Validation",
                    count: columns.validation.length,
                    icon: GitBranch,
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/20",
                  },
                  {
                    label: "Growth",
                    count: columns.growth.length,
                    icon: TrendingUp,
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                    border: "border-green-500/20",
                  },
                  {
                    label: "Success",
                    count: columns.success.length,
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
            <div className="h-[calc(100vh-280px)] min-h-[600px] pb-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-full">
                  {/* Column 1: Discovery */}
                  <DropColumn
                    id="discovery"
                    title="Discovery"
                    icon={Layers}
                    count={columns.discovery.length}
                    isOver={
                      activeId ? findContainer(activeId) !== "discovery" : false
                    }
                  >
                    <SortableContext
                      items={columns.discovery.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columns.discovery.map((strategy, index) => (
                        <StrategyCard
                          key={strategy.id}
                          strategy={strategy}
                          index={index}
                          onEdit={(s) => {
                            setEditingStrategy(s);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteStrategy}
                          onComplete={handleCompleteStrategy}
                        />
                      ))}
                    </SortableContext>
                  </DropColumn>

                  {/* Column 2: Validation (Fix vs Pivot) */}
                  <DropColumn
                    id="validation"
                    title="Validation"
                    icon={GitBranch}
                    count={columns.validation.length}
                    isOver={
                      activeId
                        ? findContainer(activeId) !== "validation"
                        : false
                    }
                  >
                    <SortableContext
                      items={columns.validation.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columns.validation.map((strategy, index) => (
                        <StrategyCard
                          key={strategy.id}
                          strategy={strategy}
                          index={index}
                          onEdit={(s) => {
                            setEditingStrategy(s);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteStrategy}
                          onComplete={handleCompleteStrategy}
                        />
                      ))}
                    </SortableContext>
                  </DropColumn>

                  {/* Column 3: Growth (Scaling) */}
                  <DropColumn
                    id="growth"
                    title="Growth"
                    icon={TrendingUp}
                    count={columns.growth.length}
                    isOver={
                      activeId ? findContainer(activeId) !== "growth" : false
                    }
                  >
                    <SortableContext
                      items={columns.growth.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columns.growth.map((strategy, index) => (
                        <StrategyCard
                          key={strategy.id}
                          strategy={strategy}
                          index={index}
                          onEdit={(s) => {
                            setEditingStrategy(s);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteStrategy}
                          onComplete={handleCompleteStrategy}
                        />
                      ))}
                    </SortableContext>
                  </DropColumn>

                  {/* Column 4: Success */}
                  <DropColumn
                    id="success"
                    title="Success"
                    icon={CheckCircle2}
                    count={columns.success.length}
                    isOver={
                      activeId ? findContainer(activeId) !== "success" : false
                    }
                  >
                    <SortableContext
                      items={columns.success.map((i) => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columns.success.map((strategy, index) => (
                        <StrategyCard
                          key={strategy.id}
                          strategy={strategy}
                          index={index}
                          onEdit={(s) => {
                            setEditingStrategy(s);
                            setIsModalOpen(true);
                          }}
                          onDelete={handleDeleteStrategy}
                          onComplete={handleCompleteStrategy}
                        />
                      ))}
                    </SortableContext>
                  </DropColumn>
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                  {activeId ? (
                    <StrategyCard
                      strategy={[
                        ...columns.discovery,
                        ...columns.validation,
                        ...columns.growth,
                        ...columns.success,
                      ].find((i) => i.id === activeId)}
                      isOverlay
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}

          {/* EVOLUTION TAB */}
          {activeTab === "evolution" && (
            <Card className="p-6 h-[calc(100vh-300px)] min-h-[600px]">
              <EvolutionMap projectData={projectData} />
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Strategy Detail View Modal */}
      <StrategyDetailView
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingStrategy ? handleUpdateStrategy : handleAddStrategy}
        initialData={editingStrategy}
      />

      {/* Fix vs Pivot Prompt Modal */}
      <Dialog.Root
        open={showFixPivotPrompt}
        onOpenChange={setShowFixPivotPrompt}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-in zoom-in-95 duration-200 text-center">
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-6 h-6 text-accent" />
              </div>
              <Dialog.Title className="text-xl font-bold text-white mb-2">
                Fix or Pivot?
              </Dialog.Title>
              <p className="text-gray-400 text-sm">
                You are moving this strategy to Validation. Is this an
                optimization of your current model or a new direction?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleFixPivotDecision("fix")}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all group"
              >
                <div className="flex justify-center mb-2 text-green-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="font-bold text-white mb-1">Fix</div>
                <p className="text-[10px] text-gray-500">Optimize weakness</p>
              </button>

              <button
                onClick={() => handleFixPivotDecision("pivot")}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-accent/10 transition-all group"
              >
                <div className="flex justify-center mb-2 text-accent group-hover:scale-110 transition-transform">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div className="font-bold text-white mb-1">Pivot</div>
                <p className="text-[10px] text-gray-500">New opportunity</p>
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Diagnosis Form Modal */}
      {showDiagnosisForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Run Diagnosis</h3>
            <textarea
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              placeholder="Describe your current challenges..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-4 focus:border-accent outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDiagnosisForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleRunDiagnosis}
                disabled={diagnoseMutation.isPending || !challenges.trim()}
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                {diagnoseMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Stethoscope className="w-4 h-4" />
                )}
                Analyze
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
