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

// // Intercepteur pour gérer les erreurs globales
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       //window.location.href = '/login';
//       console.log("erreur",error)
//     }
//     return Promise.reject(error);
//   }
// );

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
// Services pour le tourisme
export const tourismeAPI = {
  // Routes admin
  getListings: (params = {}) => api.get('/admin/tourisme', { params }),
  getStats: () => api.get('/admin/tourisme/stats'),
  createListing: (data) => api.post('/admin/tourisme', data),
  updateListing: (id, data) => api.put(`/admin/tourisme/${id}`, data),
  deleteListing: (id) => api.delete(`/admin/tourisme/${id}`),
  toggleAvailability: (id) => api.patch(`/admin/tourisme/${id}/toggle-availability`),
  toggleFeatured: (id) => api.patch(`/admin/tourisme/${id}/toggle-featured`),
  
  // Routes publiques (si nécessaire)
  getPublicListings: (params = {}) => api.get('/tourisme', { params }),
  getListingById: (id) => api.get(`/tourisme/${id}`),
};

// Services pour l'upload
export const uploadAPI = {
  // Upload d'images pour le tourisme
  uploadTourismImages: (formData) => api.post('/upload/tourism-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Upload d'image unique
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Supprimer une image
  deleteImage: (path) => api.delete('/upload/image', { data: { path } }),
};
// Services pour les publicités
export const advertisementsAPI = {
  // Récupérer toutes les publicités (Admin)
  getAdvertisements: (params = {}) => api.get('/advertisements', { params }),
  
  // Récupérer les publicités actives (Publique)
  getActiveAdvertisements: (position) => api.get('/advertisements/active', { 
    params: position ? { position } : {} 
  }),
  
  // Créer une publicité
  createAdvertisement: (formData) => api.post('/advertisements', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Modifier une publicité
  updateAdvertisement: (id, formData) => api.put(`/advertisements/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Supprimer une publicité
  deleteAdvertisement: (id) => api.delete(`/advertisements/${id}`),
  
  // Enregistrer un clic
  trackClick: (id) => api.post(`/advertisements/${id}/click`),
  
  // Statistiques
  getStats: () => api.get('/advertisements/stats/overview'),
};

export const estimationAPI = {
  // Soumettre les données pour estimation
  submitEstimation: (data) => api.post('/estimation/estimate', data),
  
  // Sauvegarder une estimation
  saveEstimation: (data) => api.post('/estimation/save', data),
  
  // Récupérer l'historique des estimations
  getEstimationHistory: (userId) => api.get(`/estimation/history/${userId}`),
  
  // Informations sur le service
  getServiceInfo: () => api.get('/estimation/info'),
};
export const annonceAPI = {
  // Créer une nouvelle annonce
  createAnnonce: (formData) => api.post('/anonce', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Récupérer toutes les annonces
   getAnnonces: () => api.get('/anonce/affiche_anonce'),
  // Récupérer une annonce par ID
  getAnnonceById: (id) => api.get(`/anonce/${id}`),

  // Mettre à jour une annonce
  updateAnnonce: (id, formData) => api.put(`/anonce/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Supprimer une annonce
  deleteAnnonce: (id) => api.delete(`/anonce/${id}`),

  // Récupérer les annonces de l'utilisateur connecté
  getUserAnnonces: () => api.get('/anonce/user/mes-annonces'),

  // Rechercher des annonces
  searchAnnonces: (filters) => api.get('/anonce/search', { params: filters }),
};

export default api;
