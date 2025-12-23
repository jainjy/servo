import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';


// Configurer axios avec l'authentification
const api = axios.create({
  baseURL: `${API_BASE_URL}/pro/emplois`,
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

export const emploiService = {
  // Récupérer toutes les offres avec filtres
  getAllEmplois: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Ajouter seulement les paramètres non vides
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.type && params.type !== 'all') queryParams.append('type', params.type);
    if (params.secteur && params.secteur !== 'all') queryParams.append('secteur', params.secteur);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const url = queryParams.toString() ? `/?${queryParams.toString()}` : '/';
    const response = await api.get(url);
    return response.data;
  },

  // Récupérer une offre spécifique
  getEmploiById: async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
  },

  // Créer une nouvelle offre
  createEmploi: async (emploiData) => {
    const response = await api.post('/', emploiData);
    return response.data;
  },

  // Mettre à jour une offre
  updateEmploi: async (id, emploiData) => {
    const response = await api.put(`/${id}`, emploiData);
    return response.data;
  },

  // Supprimer une offre
  deleteEmploi: async (id) => {
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