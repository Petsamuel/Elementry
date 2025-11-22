import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";
import {
  Search,
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
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function SavedProjectsPage() {
  const { user, setCurrentPage, setSelectedProjectId } = useAuthStore();
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getRecentProjects(token);
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
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleViewProject = (projectId) => {
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
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 w-full md:w-64 transition-colors hover:bg-white/10"
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
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-obsidian border border-white/5 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-xs uppercase text-gray-400 font-medium">
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Overall Score
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredProjects?.map((project) => (
                  <motion.tr
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onClick={() => handleViewProject(project.id)}
                    className="group hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <FolderHeart className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-white text-sm md:text-base text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px] md:max-w-[200px]">
                          {project.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                          project.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : project.status === "completed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32 space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white font-medium">
                            {project.overall_score}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
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
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(project.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProject(project.id);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-colors"
                          title="View Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              className="min-w-[180px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-200"
                              sideOffset={5}
                              align="end"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenu.Item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatusMutation.mutate({
                                    projectId: project.id,
                                    status: "active",
                                  });
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg outline-none cursor-pointer transition-colors"
                              >
                                <PlayCircle className="w-4 h-4 text-green-400" />
                                Set Active
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatusMutation.mutate({
                                    projectId: project.id,
                                    status: "completed",
                                  });
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg outline-none cursor-pointer transition-colors"
                              >
                                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                Set Completed
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatusMutation.mutate({
                                    projectId: project.id,
                                    status: "archived",
                                  });
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg outline-none cursor-pointer transition-colors"
                              >
                                <Archive className="w-4 h-4 text-gray-400" />
                                Archive
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                              <DropdownMenu.Item
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProjectMutation.mutate(project.id);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg outline-none cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredProjects?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FolderHeart className="w-12 h-12 mb-4 opacity-20" />
            <p>No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
