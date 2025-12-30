import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (formData) => api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  registerAdmin: (formData) => api.post('/auth/register-admin', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile')
};

export const electionAPI = {
  getAll: () => api.get('/elections'),
  getActive: () => api.get('/elections/active'),
  create: (data) => api.post('/elections', data),
  update: (id, data) => api.put(`/elections/${id}`, data),
  toggleStatus: (id) => api.put(`/elections/${id}/toggle`),
  toggleResults: (id) => api.put(`/elections/${id}/toggle-results`),
  getVoters: (id) => api.get(`/elections/${id}/voters`),
  delete: (id) => api.delete(`/elections/${id}`),
  getCandidates: (electionId) => api.get(`/elections/${electionId}/candidates`),
  addCandidate: (data) => api.post('/elections/candidates', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateCandidate: (id, data) => api.put(`/elections/candidates/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCandidate: (id) => api.delete(`/elections/candidates/${id}`)
};

export const voteAPI = {
  castVote: (data) => api.post('/votes', data),
  getResults: (electionId) => api.get(`/votes/results/${electionId}`),
  checkStatus: (electionId) => api.get(`/votes/status/${electionId}`)
};

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getPendingUsers: () => api.get('/users/pending'),
  verifyUser: (userId) => api.put(`/users/verify/${userId}`),
  rejectUser: (userId) => api.put(`/users/reject/${userId}`)
};

export default api;