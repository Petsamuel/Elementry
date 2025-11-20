import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function RevenueStreamCard({
  streamName,
  description,
  strengthScore,
  insights = [],
  delay = 0,
}) {
  const [expanded, setExpanded] = useState(false);

  // Determine color based on strength score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-text mb-1">{streamName}</h3>
          <p className="text-text-muted text-sm">{description}</p>
        </div>
        <div
          className={`text-2xl font-bold ${getScoreColor(strengthScore)} ml-4`}
        >
          {strengthScore}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strengthScore}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            className={`h-full ${getProgressColor(strengthScore)} rounded-full`}
          />
        </div>
      </div>

      {/* Insights Toggle */}
      {insights.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Insights
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                View Insights ({insights.length})
              </>
            )}
          </button>

          {/* Expandable Insights */}
          <motion.div
            initial={false}
            animate={{
              height: expanded ? "auto" : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="mt-4 space-y-2">
              {insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-text-muted"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
