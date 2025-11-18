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

// Services pour le financement
export const financementAPI = {
  getPartenaires: () => api.get('/financement/partenaires'),
  getAssurances: () => api.get('/financement/assurances'),
  submitDemande: (data) => api.post('/financement/demande', data),
  getUserDemandes: (userId) => api.get(`/financement/demandes/${userId}`),
  
  getAllDemandes: (params = {}) => api.get('/financement/admin/demandes', { params }),
  updateDemandeStatus: (id, status) => api.put(`/financement/admin/demandes/${id}/status`, { status }),
  deleteDemande: (id) => api.delete(`/financement/admin/demandes/${id}`),
};

// Services pour le tourisme
export const tourismeAPI = {
  getListings: (params = {}) => api.get('/admin/tourisme', { params }),
  getStats: () => api.get('/admin/tourisme/stats'),
  createListing: (data) => api.post('/admin/tourisme', data),
  updateListing: (id, data) => api.put(`/admin/tourisme/${id}`, data),
  deleteListing: (id) => api.delete(`/admin/tourisme/${id}`),
  toggleAvailability: (id) => api.patch(`/admin/tourisme/${id}/toggle-availability`),
  toggleFeatured: (id) => api.patch(`/admin/tourisme/${id}/toggle-featured`),
  
  getPublicListings: (params = {}) => api.get('/tourisme', { params }),
  getListingById: (id) => api.get(`/tourisme/${id}`),
   getAccommodations: (params = {}) => 
    api.get('/admin/tourisme/accommodations', { params }),
  
  getTouristicPlaces: (params = {}) => 
    api.get('/admin/tourisme/places', { params })
};

// Services pour l'upload
export const uploadAPI = {
  uploadTourismImages: (formData) => api.post('/upload/tourism-multiple', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  deleteImage: (path) => api.delete('/upload/image', { data: { path } }),
};

// Services pour les publicités
export const advertisementsAPI = {
  getAdvertisements: (params = {}) => api.get('/advertisements', { params }),
  
  getActiveAdvertisements: (position) => api.get('/advertisements/active', { 
    params: position ? { position } : {} 
  }),
  
  createAdvertisement: (formData) => api.post('/advertisements', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  updateAdvertisement: (id, formData) => api.put(`/advertisements/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  deleteAdvertisement: (id) => api.delete(`/advertisements/${id}`),
  
  trackClick: (id) => api.post(`/advertisements/${id}/click`),
  
  getStats: () => api.get('/advertisements/stats/overview'),
};

export const estimationAPI = {
  submitEstimation: (data) => api.post('/estimation/estimate', data),
  
  saveEstimation: (data) => api.post('/estimation/save', data),
  
  getEstimationHistory: (userId) => api.get(`/estimation/history/${userId}`),
  
  getServiceInfo: () => api.get('/estimation/info'),
};

export const annonceAPI = {
  createAnnonce: (formData) => api.post('/anonce', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  getAnnonces: () => api.get('/anonce/affiche_anonce'),
  
  getAnnonceById: (id) => api.get(`/anonce/${id}`),

  updateAnnonce: (id, formData) => api.put(`/anonce/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  deleteAnnonce: (id) => api.delete(`/anonce/${id}`),

  getUserAnnonces: () => api.get('/anonce/user/mes-annonces'),

  searchAnnonces: (filters) => api.get('/anonce/search', { params: filters }),
};

export const auditAPI = {
  createAudit: (data) => api.post('/add_audit', data),

  getAllAudits: () => api.get('/add_audit/all'),

  getUserAudits: () => api.get('/add_audit/user/mes-audits'),

  updateAuditStatus: (id, data) => api.patch(`/add_audit/${id}`, data),

  deleteAudit: (id) => api.delete(`/add_audit/delete/${id}`),
};

// Services pour les médias - AMÉLIORÉ
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

// MediaService AMÉLIORÉ avec meilleure gestion d'erreur
export const MediaService = {
  getPodcasts: (params = {}) => mediaAPI.getPodcasts(params),
  getVideos: (params = {}) => mediaAPI.getVideos(params),
  createPodcast: (formData) => mediaAPI.createPodcast(formData),
  createVideo: (formData) => mediaAPI.createVideo(formData),
  
  // Méthodes améliorées avec gestion d'erreur
  updatePodcast: async (id, data) => {
    const response = await mediaAPI.updatePodcast(id, data);
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || response.data.error || 'Erreur lors de la modification du podcast');
    }
    return response;
  },
  
  updateVideo: async (id, data) => {
    const response = await mediaAPI.updateVideo(id, data);
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || response.data.error || 'Erreur lors de la modification de la vidéo');
    }
    return response;
  },
  
  // Méthode avec retry pour plus de robustesse
  updateVideoWithRetry: async (id, data, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await mediaAPI.updateVideo(id, data);
        
        if (response.data && response.data.success === true) {
          return response.data.data;
        }
        
        // Si success: false mais pas d'erreur throw, on retry
        if (i === retries - 1) {
          throw new Error(response.data.message || response.data.error || 'Erreur lors de la modification');
        }
        
      } catch (error) {
        console.error(`Tentative ${i + 1} échouée:`, error);
        if (i === retries - 1) throw error;
      }
    }
  },
  
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
  getPlanning: () => api.get('/planning'),
  createAppointment: (data) => api.post('/planning', data),
  updateAppointment: (id, data) => api.put(`/planning/${id}`, data),
  deleteAppointment: (id) => api.delete(`/planning/${id}`),
}; 

export default api;