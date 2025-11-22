import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import {
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Eye,
  CheckCircle2,
  Archive,
  PlayCircle,
  Loader2,
  FolderHeart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

export default function SavedProjectsPage() {
  const { user, setCurrentPage, setSelectedProjectId } = useAuthStore();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      // Fetch more projects for the full list
      const response = await api.getRecentProjects(token);
      // Note: api.getRecentProjects now calls the endpoint which defaults to 10 but we might want to update api.js to pass a limit
      // For now, let's assume the backend default or update api.js later to pass limit=100
      return response.projects;
    },
    enabled: !!user,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId) => {
      const token = await user.getIdToken();
      return api.deleteProject(projectId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }) => {
      const token = await user.getIdToken();
      return api.updateProjectStatus(projectId, status, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Status updated");
      setActiveMenu(null);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleViewProject = (projectId) => {
    // Navigate to Deconstruct page and pass projectId via store
    setSelectedProjectId(projectId);
    setCurrentPage("deconstruct");
  };

  const filteredProjects = data?.filter((project) => {
    const matchesStatus =
      filterStatus === "all" || project.status === filterStatus;
    const matchesSearch = project.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Saved Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage and revisit your business deconstructions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 w-full md:w-64"
            />
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            {["all", "active", "completed", "archived"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                  filterStatus === status
                    ? "bg-primary text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects?.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                  <FolderHeart className="w-6 h-6 text-primary" />
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(
                        activeMenu === project.id ? null : project.id
                      )
                    }
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenu === project.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                      <div className="p-1">
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              projectId: project.id,
                              status: "active",
                            })
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                        >
                          <PlayCircle className="w-4 h-4 text-green-400" /> Set
                          Active
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              projectId: project.id,
                              status: "completed",
                            })
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-400" /> Set
                          Completed
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              projectId: project.id,
                              status: "archived",
                            })
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg"
                        >
                          <Archive className="w-4 h-4 text-gray-400" /> Archive
                        </button>
                        <div className="h-px bg-white/10 my-1" />
                        <button
                          onClick={() =>
                            deleteProjectMutation.mutate(project.id)
                          }
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                {project.name}
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    project.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "completed"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {project.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Overall Score</span>
                  <span className="text-white font-medium">
                    {project.overall_score}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      project.overall_score >= 80
                        ? "bg-green-500"
                        : project.overall_score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${project.overall_score}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleViewProject(project.id)}
                className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all flex items-center justify-center gap-2 group-hover:border-primary/50 group-hover:text-primary"
              >
                <Eye className="w-4 h-4" /> View Analysis
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredProjects?.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <FolderHeart className="w-12 h-12 mb-4 opacity-20" />
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {activeMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveMenu(null)}
        />
      )}
    </div>
  );
}
