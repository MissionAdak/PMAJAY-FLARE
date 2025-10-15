import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  auth: {
    login: (email, password) =>
      axios.post(`${API_BASE_URL}/api/v1/auth/login`, { email, password }),
    register: (name, email, password, role, state_id) =>
      axios.post(`${API_BASE_URL}/api/v1/auth/register`, { name, email, password, role, state_id })
  },

  states: {
    getAll: () => axios.get(`${API_BASE_URL}/api/v1/states`)
  },

  agencies: {
    getAll: (params) => axios.get(`${API_BASE_URL}/api/v1/agencies`, { params })
  },

  projects: {
    getAll: (params) => axios.get(`${API_BASE_URL}/api/v1/projects`, { params }),
    getById: (id) => axios.get(`${API_BASE_URL}/api/v1/projects/${id}`),
    updateProgress: (id, progress_percent, note) =>
      axios.post(`${API_BASE_URL}/api/v1/projects/${id}/progress`, { progress_percent, note }, {
        headers: getAuthHeaders()
      }),
    addFundTransaction: (id, amount, type, note) =>
      axios.post(`${API_BASE_URL}/api/v1/projects/${id}/funds`, { amount, type, note }, {
        headers: getAuthHeaders()
      })
  },

  reports: {
    upload: (formData) =>
      axios.post(`${API_BASE_URL}/api/v1/reports`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      })
  },

  dashboard: {
    getCentral: () =>
      axios.get(`${API_BASE_URL}/api/v1/dashboard/central`, {
        headers: getAuthHeaders()
      }),
    getState: (stateId) =>
      axios.get(`${API_BASE_URL}/api/v1/dashboard/state/${stateId}`, {
        headers: getAuthHeaders()
      }),
    getPublic: () => axios.get(`${API_BASE_URL}/api/v1/dashboard/public`)
  }
};
