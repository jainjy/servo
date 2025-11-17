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

export const auditAPI = {
  // Créer une demande d'audit
  createAudit: (data) => api.post('/add_audit', data),

  // Récupérer toutes les demandes d’audit
  getAllAudits: () => api.get('/add_audit/all'),

  // Récupérer les audits de l'utilisateur connecté
  getUserAudits: () => api.get('/add_audit/user/mes-audits'),

  // Mettre à jour le statut
  updateAuditStatus: (id, data) => api.patch(`/add_audit/${id}`, data),

  // Supprimer un audit
  deleteAudit: (id) => api.delete(`/add_audit/delete/${id}`),
};

// Services pour les médias
export const mediaAPI = {
  // Statistiques
  getStats: () => api.get('/admin/media/stats'),
  
  // Podcasts
  getPodcasts: (params = {}) => api.get('/admin/media/podcasts', { params }),
  createPodcast: (formData) => api.post('/admin/media/podcasts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updatePodcast: (id, data) => api.put(`/admin/media/podcasts/${id}`, data),
  deletePodcast: (id) => api.delete(`/admin/media/podcasts/${id}`),
  
  // Vidéos
  getVideos: (params = {}) => api.get('/admin/media/videos', { params }),
  createVideo: (formData) => api.post('/admin/media/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updateVideo: (id, data) => api.put(`/admin/media/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/admin/media/videos/${id}`),
  
  // Catégories
  getCategories: () => api.get('/admin/media/categories'),
};

// Mettez à jour votre MediaService existant pour utiliser ces nouvelles routes
export const MediaService = {
  getPodcasts: (params = {}) => mediaAPI.getPodcasts(params),
  getVideos: (params = {}) => mediaAPI.getVideos(params),
  createPodcast: (formData) => mediaAPI.createPodcast(formData),
  createVideo: (formData) => mediaAPI.createVideo(formData),
  updatePodcast: (id, data) => mediaAPI.updatePodcast(id, data),
  updateVideo: (id, data) => mediaAPI.updateVideo(id, data),
  deletePodcast: (id) => mediaAPI.deletePodcast(id),
  deleteVideo: (id) => mediaAPI.deleteVideo(id),
  getCategories: () => mediaAPI.getCategories(),
  getStats: () => mediaAPI.getStats(),
};

export const productsAPI = {
  getStats: () => api.get('/products/stats'),
};
// Services pour le planning/calendrier
export const planningAPI = {
  // Récupérer le planning de l'utilisateur
  getPlanning: () => api.get('/planning'),
  
  // Créer un nouveau rendez-vous
  createAppointment: (data) => api.post('/planning', data),
  
  // Modifier un rendez-vous
  updateAppointment: (id, data) => api.put(`/planning/${id}`, data),
  
  // Supprimer un rendez-vous
  deleteAppointment: (id) => api.delete(`/planning/${id}`),
}; 


export default api;
