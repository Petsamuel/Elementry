import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  currentPage: 'home', // home, dashboard, about, etc.
  selectedProjectId: null, // For viewing specific projects
  currency: 'NGN',
  settings: {
    theme: 'dark',
    notifications: true,
    dataRetention: '30d',
  },

  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: 'home', selectedProjectId: null }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),
  setCurrency: (currency) => set({ currency }),
  updateSettings: (newSettings) => set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  
  fetchSettings: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const token = await user.getIdToken();
      const settings = await api.getSettings(token);
      set({ 
        currency: settings.currency || 'NGN',
        settings: {
          theme: settings.theme || 'dark',
          notifications: settings.notifications !== undefined ? settings.notifications : true,
          pushNotifications: settings.pushNotifications !== undefined ? settings.pushNotifications : false,
          marketingEmails: settings.marketingEmails !== undefined ? settings.marketingEmails : false,
          dataRetention: settings.dataRetention || '30d',
          reducedMotion: settings.reducedMotion !== undefined ? settings.reducedMotion : false,
          compactMode: settings.compactMode !== undefined ? settings.compactMode : false,
          aiOptimization: settings.aiOptimization !== undefined ? settings.aiOptimization : true,
        }
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  },
  
  saveSettings: async (settingsToSave) => {
    const { user } = get();
    if (!user) return false;
    
    try {
      const token = await user.getIdToken();
      await api.updateSettings(settingsToSave, token);
      
      // Update local state
      set((state) => ({
        currency: settingsToSave.currency || state.currency,
        settings: { ...state.settings, ...settingsToSave }
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  },
}));

