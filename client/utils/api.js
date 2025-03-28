import axios from 'axios';

// Create a base API instance that points to your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://quickcamp-lmybdm8ra-alphamodos-projects.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This is important for cookies/authentication
});

// Add a request interceptor to include authentication token if available
api.interceptors.request.use(
  (config) => {
    // You can add auth token here from localStorage or cookies if needed
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Example API functions for different endpoints
export const authAPI = {
  login: (credentials) => api.post('/users/login/', credentials),
  register: (userData) => api.post('/users/register/', userData),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/', data),
  deleteAccount: () => api.delete('/users/account/'),
};

export const campaignAPI = {
  getCampaigns: () => api.get('/campaigns/'),
  getCampaign: (id) => api.get(`/campaigns/${id}/`),
  createCampaign: (data) => api.post('/campaigns/', data),
  updateCampaign: (id, data) => api.put(`/campaigns/${id}/`, data),
  deleteCampaign: (id) => api.delete(`/campaigns/${id}/`),
  getCountries: () => api.get('/campaigns/countries/'),
  getCustomAudiences: (accountId) => api.get(`/campaigns/audiences/${accountId}/`),
  getInterests: () => api.get('/campaigns/interests/'),
  getPixels: (accountId) => api.get(`/campaigns/pixels/${accountId}/`),
};

export const billingAPI = {
  getCredits: () => api.get('/billing/credits/'),
  purchaseCredits: (data) => api.post('/billing/purchase/', data),
  getTransactions: () => api.get('/billing/transactions/'),
};

export default api;
