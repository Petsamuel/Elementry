import { motion } from "motion/react";
import { Layers, DollarSign, ArrowUpRight } from "lucide-react";

export default function ResultsView({ results }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-20"
    >
      {/* Summary Section */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">
          Deconstruction Complete
        </h2>
        <p className="text-accent text-lg">
          Cheapest Entry Point: {results.cheapest_entry_point}
        </p>
      </div>

      {/* Grid of 7 Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.elements.map((element, index) => (
          <motion.div
            key={index}
            variants={item}
            className="glass-card p-6 hover:border-primary/50 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                {element.type}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {element.name}
              </h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {element.description}
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-accent">
              <DollarSign className="w-4 h-4" />
              {element.monetization_potential} Potential
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pivot Options */}
      <div className="glass-panel rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          Pivot Options
        </h3>
        <div className="flex flex-wrap gap-3">
          {results.pivot_options.map((option, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
            >
              {option}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
