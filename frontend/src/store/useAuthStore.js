import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  currentPage: 'home', // home, dashboard, about, etc.
  selectedProjectId: null, // For viewing specific projects

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: 'home', selectedProjectId: null }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
}));
