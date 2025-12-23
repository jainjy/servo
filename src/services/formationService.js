import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


// Configurer axios avec l'authentification
const api = axios.create({
  baseURL: `${API_BASE_URL}/pro/formations`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    // Pour React/Next.js côté client
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Gestion des erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion si non authentifié
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const formationService = {
  // Récupérer toutes les formations avec filtres
  getAllFormations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Ajouter seulement les paramètres non vides
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.category && params.category !== 'all') queryParams.append('category', params.category);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = queryParams.toString() ? `/?${queryParams.toString()}` : '/';
    const response = await api.get(url);
    return response.data;
  },

  // Récupérer une formation spécifique
  getFormationById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Créer une nouvelle formation
  createFormation: async (formationData) => {
    const response = await api.post('/', formationData);
    return response.data;
  },

  // Mettre à jour une formation
  updateFormation: async (id, formationData) => {
    const response = await api.put(`/${id}`, formationData);
    return response.data;
  },

  // Supprimer une formation
  deleteFormation: async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },

  // Changer le statut
  updateStatus: async (id, status) => {
    const response = await api.patch(`/${id}/status`, { status });
    return response.data;
  },

  // Récupérer les statistiques
  getStats: async () => {
    const response = await api.get('/stats/summary');
    return response.data;
  },

  // Exporter les formations en CSV
  exportToCSV: async () => {
    const response = await api.get('/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  }
};