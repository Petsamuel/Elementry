import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Layers,
  GitBranch,
  DollarSign,
  FolderHeart,
  BookOpen,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

// Move SidebarContent outside to avoid creating components during render
const SidebarContent = ({
  isMobile = false,
  expanded = true,
  setSidebarOpen,
  menuItems,
  bottomItems,
  currentPage,
  setCurrentPage,
  onLogout,
}) => (
  <>
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-accent rounded-lg shrink-0 flex items-center justify-center text-black font-bold">
          E
        </div>
        {expanded && (
          <span className="font-bold text-xl tracking-tight whitespace-nowrap text-text">
            ELEMENTAL
          </span>
        )}
      </div>
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-text-muted hover:text-text transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}
    </div>

    <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
      {menuItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-text-muted hover:text-text hover:bg-accent/10"
            }`}
          >
            <item.icon
              className={`w-5 h-5 transition-colors ${
                isActive ? "text-accent" : "group-hover:text-accent"
              }`}
            />
            {expanded && <span className="font-medium">{item.name}</span>}
          </button>
        );
      })}
    </div>

    <div className="p-4 border-t border-border-light space-y-2">
      {/* Theme Toggle */}

      {bottomItems.map((item) => (
        <button
          key={item.id}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:text-text hover:bg-accent/10 transition-all group"
        >
          <item.icon className="w-5 h-5 group-hover:text-accent transition-colors" />
          {expanded && <span className="font-medium">{item.name}</span>}
        </button>
      ))}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
      >
        <LogOut className="w-5 h-5" />
        {expanded && <span className="font-medium">Log Out</span>}
      </button>
    </div>
  </>
);

export default function DashboardLayout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarExpanded] = useState(true);
  const { currentPage, setCurrentPage } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
    { name: "Deconstruct", icon: Layers, id: "deconstruct" },
    { name: "Pivot & Fix", icon: GitBranch, id: "pivot" },
    { name: "Cheapest Point", icon: DollarSign, id: "cheapest" },
    { name: "Saved Projects", icon: FolderHeart, id: "saved" },
    { name: "Resources", icon: BookOpen, id: "resources" },
  ];

  const bottomItems = [
    { name: "Help Center", icon: HelpCircle, id: "help" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-text flex overflow-hidden transition-colors duration-300">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[280px] bg-card-bg backdrop-blur-xl z-50 md:hidden flex flex-col border-r border-border-light"
          >
            <SidebarContent
              isMobile={true}
              expanded={true}
              setSidebarOpen={setSidebarOpen}
              menuItems={menuItems}
              bottomItems={bottomItems}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onLogout={onLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: desktopSidebarExpanded ? 280 : 80 }}
        className="bg-card-bg backdrop-blur-xl shrink-0 z-20 hidden md:flex flex-col transition-colors duration-300 border-r border-border-light"
      >
        <SidebarContent
          isMobile={false}
          expanded={desktopSidebarExpanded}
          setSidebarOpen={setSidebarOpen}
          menuItems={menuItems}
          bottomItems={bottomItems}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={onLogout}
        />
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-border-light flex items-center justify-between px-4 bg-card-bg backdrop-blur text-text">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold">
              E
            </div>
            <span className="font-bold text-lg">ELEMENTAL</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-text-muted hover:text-text transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          {/* Background Gradients */}
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50 dark:opacity-100">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
