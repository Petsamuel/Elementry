import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogOut } from "lucide-react";

import * as Avatar from "@radix-ui/react-avatar";
import { useAuthStore } from "../store/useAuthStore";

export default function PublicLayout({ children, onLogin, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add Dashboard to nav links when user is logged in
  const navLinks = [
    { name: "Home", id: "home" },
    ...(isAuthenticated ? [{ name: "Dashboard", id: "dashboard" }] : []),
    { name: "About", id: "about" },
    { name: "Features", id: "features" },
    { name: "Pricing", id: "pricing" },
    // { name: "Templates", id: "templates" },
    // { name: "Blog", id: "blog" },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-bg text-text font-sans selection:bg-accent selection:text-black overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-bg/80 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-10 h-10 bg-linear-to-br from-accent to-transparent rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
              E
            </div>
            <span className="font-bold text-2xl tracking-tight">ELEMENTAL</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.id)}
                className="text-sm font-medium text-gray-400 hover:text-accent transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Avatar.Root className="inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                  <Avatar.Image
                    className="h-full w-full rounded-full object-cover"
                    src={user?.photoURL}
                    alt={user?.displayName || "User"}
                  />
                  <Avatar.Fallback
                    className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-semibold text-sm"
                    delayMs={600}
                  >
                    {user?.displayName?.charAt(0)?.toUpperCase() ||
                      user?.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </Avatar.Fallback>
                </Avatar.Root>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-text-muted hover:text-red-500 transition-colors flex items-center gap-2"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="16px"
                  height="16px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,8,3.029V10.18c-3.461-3.334-8.06-5.38-13-5.38c-11.045,0-20,8.955-20,20s8.955,20,20,20c11.045,0,20-8.955,20-20C44.011,22.659,43.864,21.355,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,8,3.029V10.18c-3.461-3.334-8.06-5.38-13-5.38c-11.045,0-20,8.955-20,20c0,2.21,0.39,4.321,1.09,6.306L6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.864,21.355,43.611,20.083z"
                  />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              className="text-text"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-bg pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.id)}
                  className="block text-left text-gray-400 hover:text-accent"
                >
                  {link.name}
                </button>
              ))}
              <hr className="border-white/10 my-4" />
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar.Root className="inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                      <Avatar.Image
                        className="h-full w-full rounded-full object-cover"
                        src={user?.photoURL}
                        alt={user?.displayName || "User"}
                      />
                      <Avatar.Fallback
                        className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-semibold"
                        delayMs={600}
                      >
                        {user?.displayName?.charAt(0)?.toUpperCase() ||
                          user?.email?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <div>
                      <p className="text-base font-semibold text-text">
                        {user?.displayName || "User"}
                      </p>
                      <p className="text-sm text-text-muted">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left text-red-500 hover:text-red-600 flex items-center gap-2"
                  >
                    <LogOut className="w-6 h-6" />
                    Log Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-center font-bold"
                >
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="16px"
                  height="16px"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,8,3.029V10.18c-3.461-3.334-8.06-5.38-13-5.38c-11.045,0-20,8.955-20,20s8.955,20,20,20c11.045,0,20-8.955,20-20C44.011,22.659,43.864,21.355,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,8,3.029V10.18c-3.461-3.334-8.06-5.38-13-5.38c-11.045,0-20,8.955-20,20c0,2.21,0.39,4.321,1.09,6.306L6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.864,21.355,43.611,20.083z"
                  />
                </svg>
                  Sign in with Google 
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 min-h-screen">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-obsidian py-20 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 dark:bg-accent/10 rounded-lg flex items-center justify-center font-bold text-lg text-text-muted">
                E
              </div>
              <span className="font-bold text-xl text-text-muted">
                ELEMENTAL
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              The Intelligence of Gradual Growth.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => handleNavClick("features")}
                  className="hover:text-accent"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("pricing")}
                  className="hover:text-accent"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("templates")}
                  className="hover:text-accent"
                >
                  Templates
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => handleNavClick("about")}
                  className="hover:text-accent"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("blog")}
                  className="hover:text-accent"
                >
                  Blog
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-accent">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-white">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => handleNavClick("privacy")}
                  className="hover:text-accent"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("terms")}
                  className="hover:text-accent"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
