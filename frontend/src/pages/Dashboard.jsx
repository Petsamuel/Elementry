import { useState } from "react";
import InputSection from "../components/InputSection";
import ResultsView from "../components/ResultsView";
import { useAuthStore } from "../store/useAuthStore";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user } = useAuthStore();
  const [results, setResults] = useState(null);

  const deconstructMutation = useMutation({
    mutationFn: ({ idea, token }) => api.deconstructIdea(idea, token),
    onSuccess: (data) => {
      setResults(data);
      toast.success("Idea deconstructed successfully!");
    },
    onError: (error) => {
      console.error("Deconstruction failed:", error);
      toast.error(
        error.response?.data?.detail || "Failed to deconstruct idea."
      );
    },
  });

  const handleDeconstruct = async (ideaText) => {
    if (!ideaText.trim()) return;

    try {
      const token = await user.getIdToken();
      deconstructMutation.mutate({ idea: ideaText, token });
    } catch (error) {
      console.error("Error getting token:", error);
      toast.error("Authentication error. Please try logging in again.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold text-text">
          Welcome back, {user?.displayName || "Builder"}.
        </h1>
        <p className="text-text-muted">
          Ready to deconstruct your next big idea?
        </p>
      </div>

      <InputSection
        onDeconstruct={handleDeconstruct}
        loading={deconstructMutation.isPending}
      />

      {results && <ResultsView results={results} />}
    </div>
  );
}
