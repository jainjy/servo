import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


// Configurer axios avec l'authentification
const api = axios.create({
  baseURL: `${API_BASE_URL}/pro/alternance`,
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

export const alternanceService = {
  // Récupérer toutes les offres avec filtres
  getAllOffres: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Ajouter seulement les paramètres non vides
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params.niveau && params.niveau !== 'all') queryParams.append('niveau', params.niveau);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = queryParams.toString() ? `/?${queryParams.toString()}` : '/';
    const response = await api.get(url);
    return response.data;
  },

  // Récupérer une offre spécifique
  getOffreById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Créer une nouvelle offre
  createOffre: async (offreData) => {
    const response = await api.post('/', offreData);
    return response.data;
  },

  // Mettre à jour une offre
  updateOffre: async (id, offreData) => {
    const response = await api.put(`/${id}`, offreData);
    return response.data;
  },

  // Supprimer une offre
  deleteOffre: async (id) => {
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

  // Exporter les offres en CSV
  exportToCSV: async () => {
    const response = await api.get('/export/csv', {
      responseType: 'blob',
    });
    return response.data;
  }
};