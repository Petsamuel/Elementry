import { create } from 'zustand';

export const useStrategyStore = create((set) => ({
  marketAnalysis: {
    marketSize: {
      tam: { value: '', currency: 'USD', description: 'Total Addressable Market' },
      sam: { value: '', currency: 'USD', description: 'Serviceable Available Market' },
      som: { value: '', currency: 'USD', description: 'Serviceable Obtainable Market' },
    },
    competitors: [], // { id, name, strength, weakness, type: 'direct' | 'indirect' }
    trends: [], // { id, trend, impact: 'high' | 'medium' | 'low', direction: 'up' | 'down' }
    customerSegments: [], // { id, name, painPoints, needs }
  },
  risks: [], // { id, description, impact: 'high' | 'medium' | 'low', probability: 'high' | 'medium' | 'low', mitigation, status: 'identified' | 'mitigated' | 'occurred' }
  timeline: [], // { id, phase, title, description, status: 'pending' | 'in-progress' | 'completed', date }

  // Actions
  setMarketAnalysis: (section, data) => set((state) => ({
    marketAnalysis: {
      ...state.marketAnalysis,
      [section]: data
    }
  })),

  updateMarketSize: (type, data) => set((state) => ({
    marketAnalysis: {
      ...state.marketAnalysis,
      marketSize: {
        ...state.marketAnalysis.marketSize,
        [type]: { ...state.marketAnalysis.marketSize[type], ...data }
      }
    }
  })),

  addCompetitor: (competitor) => set((state) => ({
    marketAnalysis: {
      ...state.marketAnalysis,
      competitors: [...state.marketAnalysis.competitors, { ...competitor, id: crypto.randomUUID() }]
    }
  })),

  removeCompetitor: (id) => set((state) => ({
    marketAnalysis: {
      ...state.marketAnalysis,
      competitors: state.marketAnalysis.competitors.filter(c => c.id !== id)
    }
  })),

  addRisk: (risk) => set((state) => ({
    risks: [...state.risks, { ...risk, id: crypto.randomUUID(), status: 'identified' }]
  })),

  updateRisk: (id, data) => set((state) => ({
    risks: state.risks.map(r => r.id === id ? { ...r, ...data } : r)
  })),

  removeRisk: (id) => set((state) => ({
    risks: state.risks.filter(r => r.id !== id)
  })),
  
  setRisks: (risks) => set({ risks }),

  addTimelinePhase: (phase) => set((state) => ({
    timeline: [...state.timeline, { ...phase, id: crypto.randomUUID(), status: 'pending' }]
  })),

  updateTimelinePhase: (id, data) => set((state) => ({
    timeline: state.timeline.map(t => t.id === id ? { ...t, ...data } : t)
  })),


  removeTimelinePhase: (id) => set((state) => ({
    timeline: state.timeline.filter(t => t.id !== id)
  })),

  setStrategyDetails: (details) => set({
    marketAnalysis: details.marketAnalysis,
    risks: details.risks,
    timeline: details.timeline
  }),

  // Reset store
  reset: () => set({
    marketAnalysis: {
      marketSize: {
        tam: { value: '', currency: 'USD', description: 'Total Addressable Market' },
        sam: { value: '', currency: 'USD', description: 'Serviceable Available Market' },
        som: { value: '', currency: 'USD', description: 'Serviceable Obtainable Market' },
      },
      competitors: [],
      trends: [],
      customerSegments: [],
    },
    risks: [],
    timeline: []
  })
}));
