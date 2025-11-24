import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import {
  LayoutGrid,
  KanbanSquare,
  Calendar,
  BarChart3,
  Search,
  Filter,
  Plus,
  Zap,
  GitBranch,
  Target,
  MoreHorizontal,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import styles from "./StrategyBoard.module.css";
import { StrategyListItem } from "./PivotComponents";

// --- Constants ---
const TABS = [
  { id: "all", label: "Strategies" },
  { id: "pivot", label: "Pivots", icon: GitBranch },
  { id: "fix", label: "Fixes", icon: Zap },
  // { id: "potential", label: "Potential", icon: Sparkles },
];

const VIEW_MODES = [
  { id: "grid", icon: LayoutGrid, label: "Grid" },
  { id: "kanban", icon: KanbanSquare, label: "Board" },
  { id: "timeline", icon: Calendar, label: "Timeline" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
];

const STATUSES = ["discovery", "validation", "growth", "success"];

// --- Helper Components ---

const ViewToggle = ({ current, onChange }) => (
  <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-sm">
    {VIEW_MODES.map((mode) => (
      <button
        key={mode.id}
        onClick={() => onChange(mode.id)}
        className={`p-2 rounded-md transition-all duration-300 relative ${
          current === mode.id ? "text-white" : "text-gray-400 hover:text-white"
        }`}
        title={mode.label}
      >
        {current === mode.id && (
          <motion.div
            layoutId="activeView"
            className="absolute inset-0 bg-white/10 rounded-md"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <mode.icon className="w-4 h-4 relative z-10" />
      </button>
    ))}
  </div>
);

const TabButton = ({ active, onClick, children, icon: Icon, count }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
      active
        ? "text-white bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
    {count !== undefined && (
      <span
        className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-black/10 text-white" : "bg-white/10 text-white"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

// --- Main Component ---

export default function StrategyBoard({
  strategies = [],
  onEdit,
  onDelete,
  onStatusChange,
  onAnalyze,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter Strategies
  const filteredStrategies = useMemo(() => {
    return strategies.filter((s) => {
      // Tab Filter
      if (activeTab === "pivot" && s.type !== "pivot") return false;
      if (activeTab === "fix" && s.type !== "fix") return false;
      if (activeTab === "potential" && s.status !== "potential") return false;

      // Hide potential from other tabs unless explicitly in potential tab
      if (
        activeTab !== "potential" &&
        activeTab !== "all" &&
        s.status === "potential"
      )
        return false;

      // Search Filter
      if (
        searchQuery &&
        !s.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !s.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status Filter (Sub-filter)
      if (statusFilter !== "all" && s.status !== statusFilter) return false;

      return true;
    });
  }, [strategies, activeTab, searchQuery, statusFilter]);

  // Group by Status for Kanban
  const kanbanColumns = useMemo(() => {
    const cols = {
      discovery: [],
      validation: [],
      growth: [],
      success: [],
    };
    filteredStrategies.forEach((s) => {
      if (cols[s.status]) {
        cols[s.status].push(s);
      }
    });
    return cols;
  }, [filteredStrategies]);

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              count={
                tab.id === "all"
                  ? strategies.length
                  : strategies.filter((s) =>
                      tab.id === "potential"
                        ? s.status === "potential"
                        : s.type === tab.id
                    ).length
              }
            >
              {tab.label}
            </TabButton>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:border-accent focus:bg-white/10 outline-none transition-all w-48 focus:w-64"
            />
          </div>
          <ViewToggle current={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {/* Sub-Filters (Status) - Only show if not in Kanban mode */}
      {viewMode !== "kanban" && activeTab !== "potential" && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Filter className="w-4 h-4" />
          <span>Filter by Status:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-white/10 text-white"
                  : "hover:bg-white/5"
              }`}
            >
              All
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md transition-colors capitalize ${
                  statusFilter === status
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode + activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[400px]"
        >
          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className={styles.gridBoard}>
              <LayoutGroup>
                <AnimatePresence>
                  {filteredStrategies.map((strategy, index) => (
                    <motion.div
                      key={strategy.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={styles.perspectiveContainer}
                    >
                      <div className={styles.card3D}>
                        <StrategyListItem
                          strategy={strategy}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onStatusChange={onStatusChange}
                          onAnalyze={onAnalyze}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
              {filteredStrategies.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                  <Layers className="w-16 h-16 mb-4 opacity-20" />
                  <p className="text-lg">
                    No strategies found matching filters.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* KANBAN VIEW */}
          {viewMode === "kanban" && (
            <div className={styles.kanbanBoard}>
              {STATUSES.map((status) => (
                <div key={status} className={styles.kanbanColumn}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          status === "discovery"
                            ? "bg-blue-400"
                            : status === "validation"
                            ? "bg-yellow-400"
                            : status === "growth"
                            ? "bg-green-400"
                            : "bg-purple-400"
                        }`}
                      />
                      {status}
                    </h3>
                    <span className="text-xs font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                      {kanbanColumns[status]?.length || 0}
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                    {kanbanColumns[status]?.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <StrategyListItem
                          strategy={strategy}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onStatusChange={onStatusChange}
                          onAnalyze={onAnalyze}
                        />
                      </div>
                    ))}
                    {(!kanbanColumns[status] ||
                      kanbanColumns[status].length === 0) && (
                      <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-gray-600">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TIMELINE VIEW (Placeholder) */}
          {viewMode === "timeline" && (
            <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-2xl border border-white/10">
              <Calendar className="w-16 h-16 mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-white mb-2">
                Timeline View
              </h3>
              <p className="text-gray-400">
                Coming soon: Visualize your strategy roadmap.
              </p>
            </div>
          )}

          {/* ANALYTICS VIEW (Placeholder) */}
          {viewMode === "analytics" && (
            <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-2xl border border-white/10">
              <BarChart3 className="w-16 h-16 mb-4 text-gray-600" />
              <h3 className="text-xl font-bold text-white mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-gray-400">
                Coming soon: Deep dive into strategy performance metrics.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
