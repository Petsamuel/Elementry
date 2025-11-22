import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Plus,
  X,
  GripVertical,
  Target,
  Zap,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  ListChecks,
  FileText,
  GitBranch,
  ShieldAlert,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";

// --- Draggable Strategy Card ---
export const StrategyCard = ({
  strategy,
  index,
  onEdit,
  onDelete,
  onComplete,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: strategy.id,
    data: {
      type: "STRATEGY",
      strategy,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isFix = strategy.type === "fix";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 rounded-xl border backdrop-blur-md transition-all duration-200 ${
        isOverlay
          ? "bg-accent/10 border-accent shadow-2xl scale-105 cursor-grabbing z-50"
          : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
      } ${strategy.completed ? "opacity-60 grayscale" : ""}`}
    >
      {/* Drag Handle & Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {strategy.type && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
                  isFix
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : "bg-accent/10 border-accent/20 text-accent"
                }`}
              >
                {isFix ? (
                  <Zap className="w-3 h-3" />
                ) : (
                  <GitBranch className="w-3 h-3" />
                )}
                {isFix ? "Fix" : "Pivot"}
              </span>
            )}
          </div>
          <h4 className="font-bold text-white text-sm leading-tight line-clamp-2">
            {strategy.title}
          </h4>
        </div>

        {/* Actions Menu */}
        {!isOverlay && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[140px] bg-black/90 border border-white/10 rounded-lg p-1 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  onClick={() => onEdit(strategy)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded cursor-pointer outline-none"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Details
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onComplete(strategy.id)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded cursor-pointer outline-none"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                  {strategy.completed ? "Mark Active" : "Complete"}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                <DropdownMenu.Item
                  onClick={() => onDelete(strategy.id)}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded cursor-pointer outline-none"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-3">
        {strategy.description}
      </p>

      {/* Metrics / Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          {strategy.growthRate && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3" />
              {strategy.growthRate}
            </span>
          )}
          {strategy.confidence && (
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Target className="w-3 h-3" />
              {strategy.confidence}%
            </div>
          )}
        </div>

        {strategy.completed && (
          <span className="flex items-center gap-1 text-[10px] text-green-400 font-bold">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        )}
      </div>
    </div>
  );
};

// --- Droppable Column ---
export const DropColumn = ({
  id,
  title,
  icon: Icon,
  count,
  children,
  isOver,
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full rounded-2xl border transition-colors duration-300 ${
        isOver
          ? "bg-white/5 border-accent/50 shadow-[0_0_30px_rgba(200,255,22,0.1)]"
          : "bg-black/20 border-white/5"
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isOver ? "bg-accent text-black" : "bg-white/5 text-gray-400"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <h3
            className={`font-bold text-sm ${
              isOver ? "text-white" : "text-gray-300"
            }`}
          >
            {title}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-gray-500">
          {count}
        </span>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar min-h-[200px]">
        {children}
        {children.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-xl p-4">
            <p className="text-xs text-center">Drop items here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Comprehensive Strategy Detail View ---
export const StrategyDetailView = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      description: "",
      type: "pivot",
      impact: "Medium",
      growthRate: "",
      confidence: 50,
    }
  );

  React.useEffect(() => {
    setFormData(
      initialData || {
        title: "",
        description: "",
        type: "pivot",
        impact: "Medium",
        growthRate: "",
        confidence: 50,
      }
    );
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl z-50 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <Dialog.Title className="text-xl font-bold text-white flex items-center gap-3">
                {initialData ? "Strategy Details" : "New Strategy"}
                {formData.type && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                      formData.type === "fix"
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-accent/10 border-accent/20 text-accent"
                    }`}
                  >
                    {formData.type}
                  </span>
                )}
              </Dialog.Title>
              <p className="text-sm text-gray-400 mt-1">
                Manage execution, metrics, and details.
              </p>
            </div>
            <Dialog.Close className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Tabs */}
          <Tabs.Root
            defaultValue="overview"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-6 border-b border-white/10">
              <Tabs.List className="flex gap-6">
                <Tabs.Trigger
                  value="overview"
                  className="py-3 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Overview
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="plan"
                  className="py-3 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4" /> Execution Plan
                  </div>
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="metrics"
                  className="py-3 text-sm font-medium text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" /> Metrics & Growth
                  </div>
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="strategy-form" onSubmit={handleSubmit}>
                <Tabs.Content
                  value="overview"
                  className="space-y-6 outline-none"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-accent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      Description / Hypothesis
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-accent outline-none resize-none"
                      placeholder="What is the core hypothesis? e.g., 'By automating sourcing, we reduce COGS by 20%...'"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                      Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="fix"
                          checked={formData.type === "fix"}
                          onChange={() =>
                            setFormData({ ...formData, type: "fix" })
                          }
                          className="accent-accent"
                        />
                        <span className="text-sm text-gray-300">
                          Fix (Optimize)
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="pivot"
                          checked={formData.type === "pivot"}
                          onChange={() =>
                            setFormData({ ...formData, type: "pivot" })
                          }
                          className="accent-accent"
                        />
                        <span className="text-sm text-gray-300">
                          Pivot (New Opportunity)
                        </span>
                      </label>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="plan" className="space-y-6 outline-none">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-gray-500">
                    <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Execution Checklist coming soon...</p>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="metrics"
                  className="space-y-6 outline-none"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Growth Rate
                      </label>
                      <input
                        type="text"
                        value={formData.growthRate || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            growthRate: e.target.value,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:border-accent outline-none"
                        placeholder="e.g., +15% MoM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                        Confidence Score ({formData.confidence}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.confidence || 50}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confidence: parseInt(e.target.value),
                          })
                        }
                        className="w-full accent-accent mt-3"
                      />
                    </div>
                  </div>
                </Tabs.Content>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-[#0A0A0A]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="strategy-form"
                className="btn-primary px-6 py-2 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
