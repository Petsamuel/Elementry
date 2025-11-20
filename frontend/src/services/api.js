import axios from 'axios';

const API_URL = 'http://localhost:8000';

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
};

