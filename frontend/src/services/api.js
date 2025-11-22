import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  syncUser: async (token) => {
    const response = await axios.post(
      `${API_URL}/auth/sync`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deconstructIdea: async (idea, token) => {
    const response = await axios.post(
      `${API_URL}/deconstruct`,
      { idea },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getDashboardStats: async (token) => {
    const response = await axios.get(
      `${API_URL}/dashboard/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getAlerts: async (token) => {
    const response = await axios.get(
      `${API_URL}/dashboard/alerts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getRecentProjects: async (token) => {
    const response = await axios.get(
      `${API_URL}/dashboard/projects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  dismissAlert: async (alertId, token) => {
    const response = await axios.post(
      `${API_URL}/dashboard/alerts/${alertId}/dismiss`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  getDashboardOverview: async (token) => {
    const response = await axios.get(`${API_URL}/dashboard/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  deleteProject: async (projectId, token) => {
    const response = await axios.delete(
      `${API_URL}/dashboard/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  updateProjectStatus: async (projectId, status, token) => {
    const response = await axios.patch(
      `${API_URL}/dashboard/projects/${projectId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getProject: async (projectId, token) => {
    const response = await axios.get(
      `${API_URL}/dashboard/projects/${projectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  createPivot: async (data, token) => {
    const response = await axios.post(
      `${API_URL}/pivots`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getPivots: async (projectId, token) => {
    const url = projectId 
      ? `${API_URL}/pivots?project_id=${projectId}`
      : `${API_URL}/pivots`;
      
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updatePivotAction: async (pivotId, actionIndex, completed, token) => {
    const response = await axios.patch(
      `${API_URL}/pivots/${pivotId}/actions/${actionIndex}`,
      { completed },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  updatePivotStatus: async (pivotId, status, token) => {
    const response = await axios.patch(
      `${API_URL}/pivots/${pivotId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

