import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  BookOpen,
  Users,
  Server,
  Wallet,
  Layers,
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  Box,
  Activity,
  Zap,
  Cpu,
  Briefcase,
  Globe,
  ArrowUpRight,
  MoreVertical,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";

export default function ResourcesPage() {
  const { user, selectedProjectId } = useAuthStore();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-text-muted">
        <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
        <p>No project selected or data unavailable.</p>
      </div>
    );
  }

  // Combine elements into a unified list with types
  const resources = [
    ...(projectData.elements || []).map((e) => ({ ...e, type: "element" })),
  ];

  const filteredResources = resources.filter((r) => {
    const matchesTab =
      activeTab === "all" || r.category?.toLowerCase() === activeTab;
    const matchesSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: "all", label: "All Assets", icon: Layers },
    { id: "human", label: "Human Capital", icon: Users },
    { id: "tech", label: "Technology", icon: Cpu },
    { id: "capital", label: "Financial", icon: Wallet },
  ];

  return (
    <div className="space-y-8 relative pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-primary font-medium tracking-wider uppercase">
            <Activity className="w-4 h-4" />
            <span>Resource Inventory</span>
          </div>
          <h1 className="text-4xl font-bold text-text tracking-tight">
            {projectData.name}
          </h1>
        </div>
       
      </div>

      {/* Controls Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-card-bg border border-border-light rounded-xl overflow-x-auto no-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-accent text-black shadow-md"
                  : "text-text-muted hover:text-text hover:bg-bg-secondary"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card-bg border border-border-light rounded-xl focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-card-bg border border-border-light rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-bg-secondary text-text"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-bg-secondary text-text"
                  : "text-text-muted hover:text-text"
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <motion.div
        layout
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`group relative bg-card-bg border border-border-light rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-xl hover:shadow-primary/5 ${
                  viewMode === "list" ? "flex items-center p-4 gap-6" : "p-6"
                }`}
              >
                {/* Hover Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div
                  className={`relative z-10 ${
                    viewMode === "list"
                      ? "shrink-0"
                      : "mb-4 flex justify-between items-start"
                  }`}
                >
                  <div className="p-3 bg-accent/10 rounded-xl group-hover:bg-accent/20 transition-colors border border-accent/10">
                    <Box className="w-6 h-6 text-accent" />
                  </div>
                  {viewMode === "grid" && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-border-light text-text-muted uppercase tracking-wider border border-white/5">
                      {resource.category || "General"}
                    </span>
                  )}
                </div>

                <div
                  className={`relative z-10 flex-1 ${
                    viewMode === "list"
                      ? "grid grid-cols-12 gap-4 items-center"
                      : ""
                  }`}
                >
                  <div className={viewMode === "list" ? "col-span-4" : ""}>
                    <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                      {resource.name}
                      {viewMode === "grid" && (
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted" />
                      )}
                    </h3>
                    {viewMode === "list" && (
                      <p className="text-xs text-text-muted mt-1">
                        {resource.category || "General"}
                      </p>
                    )}
                  </div>

                  <div
                    className={viewMode === "list" ? "col-span-5" : "mt-2 mb-6"}
                  >
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                      {resource.description || "No description available."}
                    </p>
                  </div>

                  {resource.complexity && (
                    <div
                      className={
                        viewMode === "list"
                          ? "col-span-3 flex justify-end"
                          : "pt-4 border-t border-border-light flex items-center justify-between text-sm"
                      }
                    >
                      {viewMode === "grid" && (
                        <span className="text-text-muted font-medium">
                          Complexity
                        </span>
                      )}
                      <div
                        className="flex items-center gap-1.5"
                        title={`Complexity: ${resource.complexity}/5`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1.5 h-4 rounded-full transition-colors ${
                              i < resource.complexity
                                ? "bg-primary shadow-[0_0_5px_var(--color-primary)]"
                                : "bg-border-light"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-text-muted"
            >
              <div className="w-20 h-20 bg-card-bg rounded-full flex items-center justify-center mb-4 border border-border-light">
                <Search className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg font-medium">
                No resources found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
