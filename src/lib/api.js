// lib/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      console.log("erreur",error)
    }
    return Promise.reject(error);
  }
);

// Services pour le financement
export const financementAPI = {
  // Routes publiques
  getPartenaires: () => api.get('/financement/partenaires'),
  getAssurances: () => api.get('/financement/assurances'),
  submitDemande: (data) => api.post('/financement/demande', data),
  getUserDemandes: (userId) => api.get(`/financement/demandes/${userId}`),
  
  // NOUVELLES ROUTES ADMIN
  getAllDemandes: (params = {}) => api.get('/financement/admin/demandes', { params }),
  updateDemandeStatus: (id, status) => api.put(`/financement/admin/demandes/${id}/status`, { status }),
  deleteDemande: (id) => api.delete(`/financement/admin/demandes/${id}`),
};

export default api;