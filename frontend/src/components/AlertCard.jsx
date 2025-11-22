import { motion } from "motion/react";
import { AlertTriangle, Info, CheckCircle, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useAuthStore } from "../store/useAuthStore";

export default function AlertCard({
  id,
  type = "info",
  title,
  message,
  timestamp,
  delay = 0,
}) {
  const [dismissed, setDismissed] = useState(false);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const dismissMutation = useMutation({
    mutationFn: async () => {
      const token = await user.getIdToken();
      return api.dismissAlert(id, token);
    },
    onSuccess: () => {
      setDismissed(true);
      // Invalidate alerts query to refresh the list
      queryClient.invalidateQueries(["dashboardAlerts"]);
    },
  });

  const config = {
    warning: {
      icon: AlertTriangle,
      bgClass: "bg-accent/10 border-accent/30",
      iconClass: "text-accent",
      titleClass: "text-white",
    },
    info: {
      icon: Info,
      bgClass: "bg-primary/10 border-primary/30",
      iconClass: "text-primary",
      titleClass: "text-white",
    },
    success: {
      icon: CheckCircle,
      bgClass: "bg-accent/10 border-accent/30",
      iconClass: "text-accent",
      titleClass: "text-white",
    },
  };

  const { icon: Icon, bgClass, iconClass, titleClass } = config[type];

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, delay }}
      className={`${bgClass} border rounded-xl p-4 backdrop-blur-sm relative group`}
    >
      {id && (
        <button
          onClick={() => dismissMutation.mutate()}
          disabled={dismissMutation.isPending}
          className="absolute top-3 right-3 text-text-muted hover:text-text opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Icon className={`w-5 h-5 ${iconClass}`} />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className={`font-semibold ${titleClass}`}>{title}</h4>
          <p className="text-text-muted text-sm leading-relaxed">{message}</p>
          {timestamp && (
            <p className="text-text-light text-xs mt-2">{timestamp}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
