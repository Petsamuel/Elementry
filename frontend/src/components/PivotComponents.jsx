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
  Sparkles,
  Lock,
  Activity,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tabs from "@radix-ui/react-tabs";

// --- Visual Components ---

const ProgressRing = ({
  progress,
  size = 40,
  stroke = 3,
  color = "text-accent",
}) => {
  const radius = size / 2 - stroke;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-white/10"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold text-white">
        {progress}
      </span>
    </div>
  );
};

const Sparkline = ({
  data = [40, 25, 60, 45, 70, 55, 80],
  color = "#00FF00",
}) => {
  return (
    <div className="flex items-end gap-0.5 h-8 w-16 opacity-50">
      {data.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-t-sm"
          style={{ height: `${h}%`, backgroundColor: color }}
        />
      ))}
    </div>
  );
};

// --- Strategy List Item (New Design) ---
export const StrategyListItem = ({
  strategy,
  onEdit,
  onDelete,
  onStatusChange,
  onAnalyze,
  isAnalyzing,
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
    <div className="group relative p-6 rounded-2xl border border-white/5 bg-obsidian/80 backdrop-blur-xl hover:border-white/20 transition-all duration-500 h-full flex flex-col overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          {strategy.type && (
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
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
              className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(
                strategy.status
              )}`}
            >
              {strategy.status}
            </span>
          )}
        </div>

        {/* Actions Menu */}
        {!isPotential && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
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
                {["discovery", "validation", "growth", "success"].map((s) => (
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
                        getStatusColor(s).replace("text-", "bg-").split(" ")[0]
                      }`}
                    />
                    <span className="capitalize">{s}</span>
                  </DropdownMenu.Item>
                ))}
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
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {strategy.title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-3 mb-6 leading-relaxed">
          {strategy.description}
        </p>

        {/* Metrics / Visuals */}
        <div className="flex items-end justify-between mt-auto">
          {strategy.analysis?.viability_score ? (
            <div className="flex items-center gap-3">
              <ProgressRing progress={strategy.analysis.viability_score} />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold">
                  Viability
                </span>
                <span className="text-sm font-mono text-white">
                  {strategy.analysis.viability_score}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Activity className="w-4 h-4" />
              <span className="text-xs">No metrics yet</span>
            </div>
          )}

          {/* Sparkline Placeholder */}
          <Sparkline />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        {isPotential ? (
          <button
            onClick={() => onAnalyze(strategy)}
            disabled={isAnalyzing}
            className={`w-full py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn relative overflow-hidden ${
              isAnalyzing
                ? "bg-accent/20 border-accent/30 text-accent cursor-wait"
                : "bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-black"
            }`}
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                Unlocking...
              </>
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                <Lock className="w-4 h-4 group-hover/btn:hidden" />
                <Sparkles className="w-4 h-4 hidden group-hover/btn:block" />
                Unlock Strategy
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => onEdit(strategy)}
            className="text-xs font-medium text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            View Details <ArrowRight className="w-3 h-3" />
          </button>
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
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-[5%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl z-50 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div>
              <Dialog.Title className="text-2xl font-black text-white flex items-center gap-3">
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
            <div className="px-8 border-b border-white/10 bg-black/20">
              <Tabs.List className="flex gap-8">
                <Tabs.Trigger
                  value="overview"
                  className="py-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
                >
                  Overview
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="plan"
                  className="py-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
                >
                  Execution Plan
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="metrics"
                  className="py-4 text-sm font-bold text-gray-400 hover:text-white data-[state=active]:text-accent data-[state=active]:border-b-2 data-[state=active]:border-accent transition-all uppercase tracking-wide"
                >
                  Metrics
                </Tabs.Trigger>
              </Tabs.List>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-linear-to-b from-black to-obsidian">
              <form id="strategy-form" onSubmit={handleSubmit}>
                <Tabs.Content
                  value="overview"
                  className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Strategy Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all text-lg font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Hypothesis & Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none resize-none transition-all leading-relaxed"
                      placeholder="What is the core hypothesis? e.g., 'By automating sourcing, we reduce COGS by 20%...'"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      Strategy Type
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex-1">
                        <input
                          type="radio"
                          name="type"
                          value="fix"
                          checked={formData.type === "fix"}
                          onChange={() =>
                            setFormData({ ...formData, type: "fix" })
                          }
                          className="accent-accent w-4 h-4"
                        />
                        <span className="text-sm font-medium text-white">
                          Fix (Optimize)
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex-1">
                        <input
                          type="radio"
                          name="type"
                          value="pivot"
                          checked={formData.type === "pivot"}
                          onChange={() =>
                            setFormData({ ...formData, type: "pivot" })
                          }
                          className="accent-accent w-4 h-4"
                        />
                        <span className="text-sm font-medium text-white">
                          Pivot (New Opportunity)
                        </span>
                      </label>
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="plan"
                  className="space-y-6 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-500 flex flex-col items-center justify-center h-64">
                    <ListChecks className="w-12 h-12 mb-4 opacity-30" />
                    <h4 className="text-lg font-bold text-white mb-2">
                      Execution Plan
                    </h4>
                    <p>Checklist and milestones coming soon...</p>
                  </div>
                </Tabs.Content>

                <Tabs.Content
                  value="metrics"
                  className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        Projected Growth
                      </label>
                      <div className="relative">
                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={formData.growthRate || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              growthRate: e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-accent focus:bg-white/10 outline-none transition-all"
                          placeholder="e.g., +15% MoM"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        Confidence Score ({formData.confidence}%)
                      </label>
                      <div className="h-12 flex items-center">
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
                          className="w-full accent-accent h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                        />
                      </div>
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
                className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="strategy-form"
                className="btn-primary px-8 py-3 flex items-center gap-2 rounded-xl font-bold shadow-lg shadow-accent/20 hover:scale-105 transition-transform"
              >
                <Edit2 className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
// --- Diagnosis Result View (New) ---
export const DiagnosisResultView = ({ diagnosis }) => {
  if (!diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 p-1"
    >
      {/* Header / Top Secret Stamp */}
      <div className="absolute top-0 right-0 p-4 opacity-50 pointer-events-none">
        <div className="border-4 border-red-500/20 text-red-500/20 font-black text-4xl uppercase -rotate-12 px-4 py-2 tracking-widest">
          Confidential
        </div>
      </div>

      <div className="bg-obsidian rounded-[20px] p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-50" />

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 text-accent shadow-[0_0_20px_-5px_rgba(200,255,22,0.3)]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">
              Strategic Diagnosis Report
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <span>
                ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
              <span>•</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Critical Issues */}
          <div className="lg:col-span-7 space-y-6">
            {/* Weak Link */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                    Critical Weak Link
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  {diagnosis.weak_link}
                </h4>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {diagnosis.weak_link_detail}
                </p>
              </div>
            </motion.div>

            {/* Root Cause */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                  Root Cause Analysis
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                {diagnosis.root_cause}
              </h4>
            </motion.div>

            {/* Strategic Adjustment */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <GitBranch className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                  Strategic Pivot
                </span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {diagnosis.strategic_adjustment}
              </p>
            </motion.div>
          </div>

          {/* Right Column: Action & Score */}
          <div className="lg:col-span-5 space-y-6">
            {/* Viability Score */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">
                Current Viability Score
              </span>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-white/10"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <motion.circle
                    className={
                      diagnosis.viability_score > 70
                        ? "text-green-500"
                        : diagnosis.viability_score > 40
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                    strokeWidth="8"
                    strokeDasharray={365}
                    strokeDashoffset={
                      365 - (365 * diagnosis.viability_score) / 100
                    }
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                    initial={{ strokeDashoffset: 365 }}
                    animate={{
                      strokeDashoffset:
                        365 - (365 * diagnosis.viability_score) / 100,
                    }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">
                    {diagnosis.viability_score}
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">
                    / 100
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Immediate Fix */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-accent/10 border border-accent/20 h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-xs font-bold text-accent uppercase tracking-widest">
                  Tactical Fix
                </span>
              </div>
              <p className="text-white font-medium leading-relaxed">
                {diagnosis.immediate_fix}
              </p>

              <div className="mt-6 pt-6 border-t border-accent/20">
                <button className="w-full py-3 rounded-xl bg-accent text-black font-bold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Execute Fix Protocol
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
