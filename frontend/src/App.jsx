import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "react-hot-toast";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";
import { api } from "./services/api";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import DeconstructPage from "./pages/DeconstructPage";
import SavedProjectsPage from "./pages/SavedProjectsPage";
import Home from "./pages/Home";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import TemplatesPage from "./pages/TemplatesPage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import { ThemeProvider } from "./context/ThemeContext";
import { auth, googleProvider } from "./lib/firebase";
import { signInWithPopup } from "firebase/auth";

const queryClient = new QueryClient();

function AppContent() {
  const { isAuthenticated, currentPage, login, logout, setCurrentPage } =
    useAuthStore();

  const syncUserMutation = useMutation({
    mutationFn: api.syncUser,
    onSuccess: (data) => {
      console.log("User synced:", data);
    },
    onError: (error) => {
      console.error("Sync failed:", error);
    },
  });

  // Google Sign-In
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      syncUserMutation.mutate(token);
      login(result.user);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Auth Persistence & Redirect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        login(user);

        // If on a public page, redirect to dashboard
        // We check if the current page is NOT a dashboard page
        const publicPages = [
          "home",
          "features",
          "pricing",
          "templates",
          "blog",
          "about",
        ];
        if (publicPages.includes(currentPage)) {
          setCurrentPage("dashboard");
        }
      } else {
        // User is signed out
        if (isAuthenticated) {
          logout();
        }
      }
    });

    return () => unsubscribe();
  }, [login, logout, currentPage, isAuthenticated, setCurrentPage]);

  const handleLogout = async () => {
    await auth.signOut();
    logout();
  };

  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <DashboardLayout onLogout={handleLogout}>
            {currentPage === "dashboard" && <DashboardOverview />}
            {currentPage === "deconstruct" && <DeconstructPage />}
            {currentPage === "saved" && <SavedProjectsPage />}
            {/* Legacy route - can be removed later */}
            {currentPage === "old-dashboard" && <Dashboard />}
            {/* Add other authenticated routes here */}
          </DashboardLayout>
        ) : (
          <PublicLayout onLogin={handleLogin} onNavigate={setCurrentPage}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentPage === "home" && <Home onStart={handleLogin} />}
              {currentPage === "features" && <FeaturesPage />}
              {currentPage === "pricing" && <PricingPage />}
              {currentPage === "templates" && <TemplatesPage />}
              {currentPage === "blog" && <BlogPage />}
              {currentPage === "about" && <AboutPage />}
            </motion.div>
          </PublicLayout>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
