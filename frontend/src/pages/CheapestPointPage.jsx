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
  const { user, selectedProjectId } = useAuthStore();

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

  // Simulated metrics for visual richness (in a real app, these would come from the API)
  const metrics = [
    {
      label: "Market Viability",
      value: 92,
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/20",
    },
    {
      label: "Tech Feasibility",
      value: 88,
      icon: Shield,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
    },
    {
      label: "Time to Value",
      value: 95,
      icon: Zap,
      color: "text-accent",
      bg: "bg-accent/10",
      border: "border-accent/20",
    },
  ];

  const roadmapSteps = [
    { title: "Validation", desc: "Confirm core hypothesis", status: "current" },
    { title: "MVP Build", desc: "Core feature set", status: "pending" },
    { title: "Launch", desc: "Initial user acquisition", status: "pending" },
  ];

  return (
    <div className="space-y-8 relative pb-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-linear-to-br from-accent/20 to-green-500/20 backdrop-blur-sm border border-accent/20">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-text">
            Cheapest Point
          </h1>
        </div>
        <p className="text-text-muted text-lg">
          Discover the most cost-effective path to validate your product idea and achieve market fit.
        </p>
      </motion.div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-primary font-medium tracking-wider uppercase">
            <Activity className="w-4 h-4" />
            <span>Strategic Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-text tracking-tight">
            {projectData.name}
          </h1>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Hero Card - Cheapest Entry Point */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl group"
        >
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -ml-10 -mb-10 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-700" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <span className="text-text-muted font-medium tracking-wide">
                  Recommended Entry Point
                </span>
              </div>

              <h2 className="text-xl md:text-xl lg:text-xl font-bold text-white mb-6 leading-[1.1] tracking-tight ">
                {projectData.cheapest_entry_point || "Analysis Pending..."}
              </h2>

              <p className="text-text-muted text-sm md:text-sm leading-relaxed max-w-2xl">
                This entry point minimizes initial capital requirement while
                maximizing learning. It focuses on the core "Atomic Unit of
                Value" identified in the deconstruction phase.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Column */}
        <div className="lg:col-span-4 space-y-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg border border-border-light rounded-2xl p-6 hover:border-primary/20 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-2.5 rounded-lg ${metric.bg} ${metric.color}`}
                >
                  <metric.icon className="w-5 h-5" />
                </div>
                <span className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}%
                </span>
              </div>
              <h3 className="text-text font-semibold mb-1">{metric.label}</h3>
              <div className="w-full bg-border-light h-1.5 rounded-full overflow-hidden">
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
            </motion.div>
          ))}
        </div>

        {/* Strategic Advantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-7 bg-card-bg border border-border-light rounded-3xl p-8"
        >
          <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            Strategic Advantages
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
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
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-secondary transition-colors"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                </div>
                <span className="text-text-muted font-medium text-sm leading-tight">
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
          className="lg:col-span-5 bg-linear-to-br from-primary/5 to-transparent border border-primary/10 rounded-3xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <h3 className="text-xl font-bold text-text mb-6 flex items-center gap-2 relative z-10">
            <BarChart3 className="w-5 h-5 text-primary" />
            Execution Roadmap
          </h3>

          <div className="space-y-6 relative z-10">
            {roadmapSteps.map((step, i) => (
              <div key={i} className="flex gap-4 relative">
                {/* Connector Line */}
                {i !== roadmapSteps.length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-border-light" />
                )}

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.status === "current"
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-card-bg border border-border-light text-text-muted"
                  }`}
                >
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>

                <div className="pt-1">
                  <h4
                    className={`font-bold ${
                      step.status === "current"
                        ? "text-text"
                        : "text-text-muted"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-sm text-text-muted mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
