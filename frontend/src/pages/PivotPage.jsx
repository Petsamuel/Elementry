import { useState, useEffect } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";
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
} from "lucide-react";
import {
  StrategyCard,
  DropColumn,
  StrategyDetailView,
} from "../components/PivotComponents";
import EvolutionMap from "../components/EvolutionMap";
import * as Dialog from "@radix-ui/react-dialog";

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

export default function PivotPage() {
  const { user, selectedProjectId, setSelectedProjectId } = useAuthStore();
  const [activeId, setActiveId] = useState(null);
  const [showDiagnosisForm, setShowDiagnosisForm] = useState(false);
  const [challenges, setChallenges] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [viewMode, setViewMode] = useState("pipeline"); // 'pipeline' | 'evolution'
  const [showFixPivotPrompt, setShowFixPivotPrompt] = useState(false);
  const [pendingPromotion, setPendingPromotion] = useState(null); // { id, container }

  const queryClient = useQueryClient();

  // Local state for columns
  const [columns, setColumns] = useState({
    discovery: [], // 7 Options
    validation: [], // Fix vs Pivot testing
    growth: [], // Scaling
    success: [], // Completed
  });

  // Fetch project
  const { data: projectData, isLoading: isLoadingProject } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
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
    <div className="min-h-screen pb-20 text-white">
      {/* View Switcher Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Pivot Engineering
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold">
              BETA
            </span>
          </div>
          <p className="text-gray-400 text-lg">
            Engineer your business pivots using the strategy board.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setViewMode("pipeline")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "pipeline"
                ? "bg-accent text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              Pipeline
            </div>
          </button>
          <button
            onClick={() => setViewMode("evolution")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === "evolution"
                ? "bg-accent text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Evolution Map
            </div>
          </button>
        </div>
      </div>

      {/* Idea Analysis Section (Always Visible or Collapsible) */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" /> Executive Summary
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {projectData?.description ||
              "An AI-powered platform designed to optimize business pivots through data-driven analysis and strategic vector mapping."}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Core Value Asset
          </h3>
          <p className="text-sm text-white font-bold">
            {projectData?.core_asset || "Proprietary Pivot Algorithm"}
          </p>
        </div>
        <div className="p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" /> Critical Risk
          </h3>
          <p className="text-sm text-gray-300">
            {projectData?.risk || "Market adoption latency due to complexity."}
          </p>
        </div>
      </div>

      {viewMode === "evolution" ? (
        <EvolutionMap projectData={projectData} />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Diagnosis Section */}
          <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <div className="absolute inset-0 bg-linear-to-r from-accent/5 via-transparent to-transparent opacity-50" />
              <div className="relative p-6 flex lg:items-center justify-between lg:flex-row flex-col gap-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="">
                    <h3 className="text-lg font-bold text-white">
                      AI Diagnosis
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Identify weak links to generate new discovery options.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiagnosisForm(true)}
                  className="btn-primary px-6 py-2 flex items-center gap-2 justify-center"
                >
                  <Stethoscope className="w-4 h-4" />
                  Run Diagnosis
                </button>
              </div>
            </div>
          </div>

          {/* Pipeline Board */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-400px)] min-h-[500px]">
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
                activeId ? findContainer(activeId) !== "validation" : false
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
              isOver={activeId ? findContainer(activeId) !== "growth" : false}
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
              isOver={activeId ? findContainer(activeId) !== "success" : false}
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
      )}

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
