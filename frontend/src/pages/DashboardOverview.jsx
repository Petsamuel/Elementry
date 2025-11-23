import { motion } from "motion/react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "../components/StatCard";
import AlertCard from "../components/AlertCard";
import {
  Lightbulb,
  DollarSign,
  TrendingUp,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Clock,
  Loader2,
  GitBranch,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../services/api";

export default function DashboardOverview() {
  const { user, setCurrentPage, setSelectedProjectId } = useAuthStore();

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getDashboardStats(token);
    },
    enabled: !!user,
  });

  // Fetch alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ["dashboardAlerts"],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getAlerts(token);
    },
    enabled: !!user,
  });

  // Fetch recent projects
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["dashboardProjects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getRecentProjects(token);
    },
    enabled: !!user,
  });

  const stats = statsData?.stats || {
    ideas_analyzed: 0,
    revenue_streams: 0,
    success_rate: 0,
    active_projects: 0,
  };

  const usage = statsData?.usage || {
    plan: "starter",
    current_usage: 0,
    limit: 10,
    percentage: 0,
  };

  const alerts = alertsData?.alerts || [];
  const projects = projectsData?.projects || [];

  // Transform stats for StatCard component
  const statCards = [
    {
      title: "Ideas Analyzed",
      value: stats.ideas_analyzed.toString(),
      icon: Lightbulb,
      trend: "up",
      trendValue: "+3 this week",
    },
    {
      title: "Revenue Streams",
      value: stats.revenue_streams.toString(),
      icon: DollarSign,
      trend: "up",
      trendValue: `+${stats.revenue_streams}`,
    },
    {
      title: "Success Rate",
      value: `${stats.success_rate}%`,
      icon: TrendingUp,
      trend: stats.success_rate >= 70 ? "up" : "down",
      trendValue: `${stats.success_rate}%`,
    },
    {
      title: "Active Projects",
      value: stats.active_projects.toString(),
      icon: FolderOpen,
      trend: stats.active_projects > 0 ? "up" : "down",
      trendValue: stats.active_projects > 0 ? `+${stats.active_projects}` : "0",
    },
  ];

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (statsLoading || alertsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">
          Welcome back, {user?.displayName?.split(" ")[0] || "Builder"} 👋
        </h1>
        <p className="text-text-muted text-lg">
          Here&apos;s what&apos;s happening with your ideas today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* AI Alerts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold text-text">AI Insights</h2>
        </div>
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                {...alert}
                timestamp={formatTimestamp(alert.created_at)}
                delay={0.5 + index * 0.1}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted">
              No alerts yet. Start analyzing your ideas to get AI-powered
              insights!
            </p>
          </div>
        )}
      </motion.div>

      {/* Recent Projects & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-text">Recent Projects</h2>
            </div>
            <button
              onClick={() => setCurrentPage("saved")}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
              View All
            </button>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-3">
              {projects.slice(0, 2).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-colors group"
                >
                  {/* Project Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {formatTimestamp(project.updated_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-text-muted">Score</p>
                        <p className="font-bold text-text">
                          {project.overall_score || 0}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-muted">Streams</p>
                        <p className="font-bold text-text">
                          {project.revenue_streams_count || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setCurrentPage("deconstruct");
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProjectId(project.id);
                        setCurrentPage("pivot");
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent hover:text-accent text-sm font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <GitBranch className="w-4 h-4" />
                      Pivot & Fix
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted">
                No projects yet. Click &quot;New Analysis&quot; to get started!
              </p>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setCurrentPage("deconstruct")}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              New Analysis
            </button>
            <button
              onClick={() => setCurrentPage("saved")}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-5 h-5" />
              Saved Projects
            </button>
            <button
              onClick={() => setCurrentPage("resources")}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Resources
            </button>
          </div>

          {/* Usage Stats */}
          <div className="mt-6 pt-6 border-t border-border-light">
            <p className="text-text-muted text-sm mb-2">
              Monthly Usage (
              {usage.plan.charAt(0).toUpperCase() + usage.plan.slice(1)} Plan)
            </p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-text font-semibold">
                {usage.current_usage} / {usage.limit}
              </span>
              <span className="text-text-muted text-sm">analyses left</span>
            </div>
            <div className="h-2 bg-white/10 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usage.percentage}%` }}
                transition={{ duration: 1, delay: 1.2 }}
                className="h-full bg-accent rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
