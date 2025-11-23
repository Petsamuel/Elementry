import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Plus,
  X,
  Target,
  Zap,
  TrendingUp,
  BarChart3,
  ListChecks,
  FileText,
  GitBranch,
  ArrowRight,
  PlayCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";

// --- Strategy List Item (New Design) ---
export const StrategyListItem = ({
  strategy,
  onEdit,
  onDelete,
  onStatusChange,
  onAnalyze,
}) => {
  const isFix = strategy.type === "fix";
  const isPivot = strategy.type === "pivot";
  const isPotential = !strategy.status || strategy.status === "potential";

  const getStatusColor = (status) => {
    switch (status) {
      case "discovery":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "validation":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "growth":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "success":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative p-5 rounded-xl border border-white/5 bg-obsidian hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {strategy.type && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
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
            {!isPotential && (
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                  strategy.status
                )}`}
              >
                {strategy.status}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-accent transition-colors">
            {strategy.title}
          </h3>
          <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {strategy.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            {strategy.analysis?.viability_score && (
              <div className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span className="font-mono text-white">
                  {strategy.analysis.viability_score}% Viability
                </span>
              </div>
            )}
            {strategy.analysis?.estimated_timeline && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{strategy.analysis.estimated_timeline}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {isPotential ? (
            <button
              onClick={() => onAnalyze(strategy)}
              className="px-4 py-2 rounded-lg bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-colors flex items-center gap-2 shadow-lg shadow-accent/10"
            >
              <PlayCircle className="w-4 h-4" />
              Analyze
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(strategy)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="View Details"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[160px] bg-[#0A0A0A] border border-white/10 rounded-xl p-1 shadow-xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                    sideOffset={5}
                    align="end"
                  >
                    <div className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Move To
                    </div>
                    {["discovery", "validation", "growth", "success"].map(
                      (s) => (
                        <DropdownMenu.Item
                          key={s}
                          onClick={() => onStatusChange(strategy.id, s)}
                          disabled={strategy.status === s}
                          className={`flex items-center gap-2 px-2 py-2 text-sm rounded-lg cursor-pointer outline-none transition-colors ${
                            strategy.status === s
                              ? "opacity-50 cursor-default"
                              : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              getStatusColor(s)
                                .replace("text-", "bg-")
                                .split(" ")[0]
                            }`}
                          />
                          <span className="capitalize">{s}</span>
                        </DropdownMenu.Item>
                      )
                    )}
                    <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                    <DropdownMenu.Item
                      onClick={() => onDelete(strategy.id)}
                      className="flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer outline-none"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
