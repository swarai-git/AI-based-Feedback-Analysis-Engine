/*import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Legislation API
export const legislationAPI = {
  getAll: (params) => api.get('/legislation', { params }),
  getById: (id) => api.get(`/legislation/${id}`),
  create: (data) => api.post('/legislation', data),
  update: (id, data) => api.put(`/legislation/${id}`, data),
  delete: (id) => api.delete(`/legislation/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// Analysis API
export const analysisAPI = {
  analyzeSingle: (feedbackId) => api.post(`/analysis/analyze/${feedbackId}`),
  getAnalysis: (feedbackId) => api.get(`/analysis/${feedbackId}`),
  batchAnalyze: (legislationId) => api.post('/analysis/batch', { legislationId }),
  getByLegislation: (legislationId) => api.get(`/analysis/legislation/${legislationId}`),
  deleteAnalysis: (feedbackId) => api.delete(`/analysis/${feedbackId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (legislationId) => api.get(`/dashboard/stats/${legislationId}`),
  getSentimentTrend: (legislationId) => api.get(`/dashboard/sentiment-trend/${legislationId}`),
  getKeywords: (legislationId, limit = 20) => api.get(`/dashboard/keywords/${legislationId}`, { params: { limit } }),
  getFiltered: (legislationId, params) => api.get(`/dashboard/filtered/${legislationId}`, { params }),
  getCategories: (legislationId) => api.get(`/dashboard/categories/${legislationId}`),
  getHighPriority: (legislationId) => api.get(`/dashboard/high-priority/${legislationId}`),
  exportData: (legislationId) => api.get(`/dashboard/export/${legislationId}`),
};

// Upload API
export const uploadAPI = {
  uploadCSV: (formData) => api.post('/upload/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadSingle: (data) => api.post('/upload/single', data),
  getStats: (legislationId) => api.get(`/upload/stats/${legislationId}`),
  validateCSV: (formData) => api.post('/upload/validate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadTemplate: () => api.get('/upload/template', {
    responseType: 'blob'
  }),
};

export default api;*/



/*

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's actually an authentication error
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use React Router navigation instead of window.location
      // This prevents the hard refresh issue
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Legislation API
export const legislationAPI = {
  getAll: (params) => api.get('/legislation', { params }),
  getById: (id) => api.get(`/legislation/${id}`),
  create: (data) => api.post('/legislation', data),
  update: (id, data) => api.put(`/legislation/${id}`, data),
  delete: (id) => api.delete(`/legislation/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// Analysis API
export const analysisAPI = {
  analyzeSingle: (feedbackId) => api.post(`/analysis/analyze/${feedbackId}`),
  getAnalysis: (feedbackId) => api.get(`/analysis/${feedbackId}`),
  batchAnalyze: (legislationId) => api.post('/analysis/batch', { legislationId }),
  getByLegislation: (legislationId) => api.get(`/analysis/legislation/${legislationId}`),
  deleteAnalysis: (feedbackId) => api.delete(`/analysis/${feedbackId}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (legislationId) => api.get(`/dashboard/stats/${legislationId}`),
  getSentimentTrend: (legislationId) => api.get(`/dashboard/sentiment-trend/${legislationId}`),
  getKeywords: (legislationId, limit = 20) => api.get(`/dashboard/keywords/${legislationId}`, { params: { limit } }),
  getFiltered: (legislationId, params) => api.get(`/dashboard/filtered/${legislationId}`, { params }),
  getCategories: (legislationId) => api.get(`/dashboard/categories/${legislationId}`),
  getHighPriority: (legislationId) => api.get(`/dashboard/high-priority/${legislationId}`),
  exportData: (legislationId) => api.get(`/dashboard/export/${legislationId}`),
};

// Upload API
export const uploadAPI = {
  uploadCSV: (formData) => api.post('/upload/csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadSingle: (data) => api.post('/upload/single', data),
  getStats: (legislationId) => api.get(`/upload/stats/${legislationId}`),
  validateCSV: (formData) => api.post('/upload/validate', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  downloadTemplate: () => api.get('/upload/template', {
    responseType: 'blob'
  }),
};

export default api;




// Add to existing api.js

export const analysisAPI = {
  // Get duplicate/similar feedbacks grouped
  analyzeDuplicates: (legislationId, threshold = 0.6, useAI = false) =>
    api.get(`/analysis/legislation/${legislationId}/duplicates?threshold=${threshold}&useAI=${useAI}`),
  
  // Get AI-powered insights
  getAIInsights: (legislationId) =>
    api.get(`/analysis/legislation/${legislationId}/ai-insights`),
  
  // Get top suggested changes
  getTopSuggestions: (legislationId, limit = 20) =>
    api.get(`/analysis/legislation/${legislationId}/top-suggestions?limit=${limit}`),
  
  // Search within grouped feedbacks
  searchGroupedFeedbacks: (legislationId, query, threshold = 0.6) =>
    api.get(`/analysis/legislation/${legislationId}/search?query=${query}&threshold=${threshold}`),
  
  // Send duplicate alert email
  sendDuplicateAlert: (data) =>
    api.post('/analysis/send-duplicate-alert', data),
  
  // Send daily digest email
  sendDailyDigest: (data) =>
    api.post('/analysis/send-daily-digest', data)
};*/


import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Legislation API
export const legislationAPI = {
  getAll: (params) => api.get('/legislation', { params }),
  getById: (id) => api.get(`/legislation/${id}`),
  create: (data) => api.post('/legislation', data),
  update: (id, data) => api.put(`/legislation/${id}`, data),
  delete: (id) => api.delete(`/legislation/${id}`),
};

// Feedback API
export const feedbackAPI = {
  getAll: (params) => api.get('/feedback', { params }),
  getById: (id) => api.get(`/feedback/${id}`),
  create: (data) => api.post('/feedback', data),
  update: (id, data) => api.put(`/feedback/${id}`, data),
  delete: (id) => api.delete(`/feedback/${id}`),
};

// ✅ MERGED Analysis API (only ONE export now)
export const analysisAPI = {
  // Basic analysis
  analyzeSingle: (feedbackId) => api.post(`/analysis/analyze/${feedbackId}`),
  getAnalysis: (feedbackId) => api.get(`/analysis/${feedbackId}`),
//  batchAnalyze: (legislationId) => api.post('/analysis/batch', { legislationId }),
  batchAnalyze: (legislationId) =>api.post('/analysis/batch', { legislationId }),

  getByLegislation: (legislationId) => api.get(`/analysis/legislation/${legislationId}`),
  deleteAnalysis: (feedbackId) => api.delete(`/analysis/${feedbackId}`),

  // Advanced features
  analyzeDuplicates: (legislationId, threshold = 0.6, useAI = false) =>
    api.get(`/analysis/legislation/${legislationId}/duplicates?threshold=${threshold}&useAI=${useAI}`),

  getAIInsights: (legislationId) =>
    api.get(`/analysis/legislation/${legislationId}/ai-insights`),

  getTopSuggestions: (legislationId, limit = 20) =>
    api.get(`/analysis/legislation/${legislationId}/top-suggestions?limit=${limit}`),

  searchGroupedFeedbacks: (legislationId, query, threshold = 0.6) =>
    api.get(`/analysis/legislation/${legislationId}/search?query=${query}&threshold=${threshold}`),

  sendDuplicateAlert: (data) =>
    api.post('/analysis/send-duplicate-alert', data),

  sendDailyDigest: (data) =>
    api.post('/analysis/send-daily-digest', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: (legislationId) => api.get(`/dashboard/stats/${legislationId}`),
  getSentimentTrend: (legislationId) => api.get(`/dashboard/sentiment-trend/${legislationId}`),
  getKeywords: (legislationId, limit = 20) =>
    api.get(`/dashboard/keywords/${legislationId}`, { params: { limit } }),
  getFiltered: (legislationId, params) =>
    api.get(`/dashboard/filtered/${legislationId}`, { params }),
  getCategories: (legislationId) =>
    api.get(`/dashboard/categories/${legislationId}`),
  getHighPriority: (legislationId) =>
    api.get(`/dashboard/high-priority/${legislationId}`),
  exportData: (legislationId) =>
    api.get(`/dashboard/export/${legislationId}`),
};

// Upload API
export const uploadAPI = {
  uploadCSV: (formData) =>
    api.post('/upload/csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  uploadSingle: (data) => api.post('/upload/single', data),
  getStats: (legislationId) => api.get(`/upload/stats/${legislationId}`),
  validateCSV: (formData) =>
    api.post('/upload/validate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  downloadTemplate: () =>
    api.get('/upload/template', { responseType: 'blob' }),
};

export default api;
