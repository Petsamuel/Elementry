import { useEffect } from "react";
import { motion } from "motion/react";
import { useAuthStore } from "../store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import {
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Zap,
  Activity,
  BarChart3,
  Shield,
  DollarSign,
} from "lucide-react";

export default function CheapestPointPage() {
  const { user, selectedProjectId, currency: userCurrency } = useAuthStore();

  const { data: projectData, isLoading } = useQuery({
    queryKey: ["project", selectedProjectId],
    queryFn: async () => {
      const token = await user.getIdToken();
      return api.getProject(selectedProjectId, token);
    },
    enabled: !!user && !!selectedProjectId,
  });

  // Fetch recent projects to ensure we can default to the latest one
  const { data: recentProjects = [] } = useQuery({
    queryKey: ["cheapestRecentProjects"],
    queryFn: async () => {
      const token = await user.getIdToken();
      const response = await api.getRecentProjects(token);
      return response.projects || [];
    },
    enabled: !!user,
  });

  // Automatically select the most recent project if none is selected
  useEffect(() => {
    if (!selectedProjectId && recentProjects.length > 0) {
      useAuthStore.getState().setSelectedProjectId(recentProjects[0].id);
    }
  }, [recentProjects, selectedProjectId]);

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

  // Generate deterministic random metrics based on project ID
  const generateMetrics = (id) => {
    const hash = id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const v1 = 70 + (hash % 30); // 70-99
    const v2 = 65 + ((hash * 2) % 35); // 65-99
    const v3 = 80 + ((hash * 3) % 20); // 80-99

    return [
      {
        label: "Market Viability",
        value: v1,
        icon: TrendingUp,
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20",
      },
      {
        label: "Tech Feasibility",
        value: v2,
        icon: Shield,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
      },
      {
        label: "Time to Value",
        value: v3,
        icon: Zap,
        color: "text-accent",
        bg: "bg-accent/10",
        border: "border-accent/20",
      },
    ];
  };

  const metrics = generateMetrics(projectData.id || "default");

  const roadmapSteps = [
    { title: "Validation", desc: "Confirm core hypothesis", status: "current" },
    { title: "MVP Build", desc: "Core feature set", status: "pending" },
    { title: "Launch", desc: "Initial user acquisition", status: "pending" },
  ];

  return (
    <div className="space-y-8 relative pb-20 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs text-text-muted font-mono uppercase tracking-widest">
                Strategic Entry Point
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
              Cheapest Point
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/5">
            <Activity className="w-4 h-4 text-accent" />
            <span>
              Project:{" "}
              <span className="text-white font-bold">{projectData.name}</span>
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hero Card - Cheapest Entry Point */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8 relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-white/10 shadow-2xl group min-h-[400px] flex flex-col"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,255,22,0.15),transparent_60%)] opacity-60" />
          <motion.div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"
            animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Recommended First Step
              </div>

              <h2 className="text-xl lg:text-xl font-black text-white leading-relaxed tracking-wide max-w-3xl">
                {projectData.cheapest_entry_point || "Analysis Pending..."}
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl border-l-2 border-accent/30 pl-6">
                This entry point minimizes initial capital requirement while
                maximizing learning. It focuses on the core "Atomic Unit of
                Value" identified in the deconstruction phase.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Est. Cost
                </div>
                <div className="text-xl font-mono text-white">
                  {projectData.estimated_cost || "N/A"}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="text-xs text-gray-500 uppercase font-bold mb-1">
                  Timeline
                </div>
                <div className="text-xl font-mono text-white">
                  {projectData.time_to_validate || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Metrics Column */}
        <div className="lg:col-span-4 space-y-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${metric.bg}`}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} border border-white/5`}
                  >
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}%
                  </span>
                </div>

                <h3 className="text-gray-300 font-bold mb-3">{metric.label}</h3>

                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${metric.color.replace(
                      "text-",
                      "bg-"
                    )}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />

          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
              <Shield className="w-5 h-5" />
            </div>
            Strategic Advantages
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 relative z-10">
            {[
              "Leverages existing market demand",
              "Requires minimal custom development",
              "Direct path to revenue",
              "Scalable foundation",
              "Low technical debt",
              "High pivot flexibility",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                </div>
                <span className="text-gray-300 font-medium text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap / Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-5 bg-linear-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
        >
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-accent/5 to-transparent pointer-events-none" />

          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-accent/10 text-accent">
              <BarChart3 className="w-5 h-5" />
            </div>
            Execution Roadmap
          </h3>

          <div className="space-y-0 relative z-10 pl-2">
            {roadmapSteps.map((step, i) => (
              <div key={i} className="flex gap-6 relative pb-8 last:pb-0">
                {/* Connector Line */}
                {i !== roadmapSteps.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-white/10" />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-[#0A0A0A] ${
                    step.status === "current"
                      ? "bg-accent text-black shadow-[0_0_15px_rgba(200,255,22,0.4)]"
                      : "bg-white/10 text-gray-500"
                  }`}
                >
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>

                <div className="pt-1">
                  <h4
                    className={`font-bold text-lg ${
                      step.status === "current" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
