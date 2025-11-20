import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  currentPage: 'home', // home, dashboard, about, etc.

  login: (user) => set({ user, isAuthenticated: true, currentPage: 'dashboard' }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: 'home' }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
