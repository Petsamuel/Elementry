import { motion } from "motion/react";
import { Construction } from "lucide-react";

export default function ComingSoonPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-full bg-primary/10 text-primary"
      >
        <Construction className="w-12 h-12" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-text">
          {title || "Coming Soon"}
        </h1>
        <p className="text-text-muted text-lg max-w-md mx-auto">
          {description ||
            "We're working hard to bring you this feature. Stay tuned for updates!"}
        </p>
      </motion.div>
    </div>
  );
}
