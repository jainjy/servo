import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

class MediaService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      timeout: 10000
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Gestion globale des erreurs
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ==================== PODCASTS ====================

  // Récupérer tous les podcasts
  async getPodcasts(filters = {}) {
    try {
      const response = await this.api.get('/media/podcasts', {
        params: { 
          limit: 6,
          ...filters 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération podcasts:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
        data: []
      };
    }
  }

  // Récupérer un podcast par ID
  async getPodcastById(podcastId) {
    try {
      const response = await this.api.get(`/media/podcasts/${podcastId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération podcast:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  }

  // Créer un podcast (PROFESSIONNELS)
  async uploadPodcast(formData) {
    try {
      const response = await this.api.post('/media/pro/podcasts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      });
      return response.data;
    } catch (error) {
      console.error('Erreur upload podcast:', error);
      throw error;
    }
  }

  // Mettre à jour un podcast (PROFESSIONNELS)
  async updatePodcast(podcastId, data) {
    try {
      const response = await this.api.put(`/media/pro/podcasts/${podcastId}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour podcast:', error);
      throw error;
    }
  }

  // Supprimer un podcast (PROFESSIONNELS)
  async deletePodcast(podcastId) {
    try {
      const response = await this.api.delete(`/media/pro/podcasts/${podcastId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression podcast:', error);
      throw error;
    }
  }

  // Incrémenter les écoutes d'un podcast
  async incrementPodcastListens(podcastId) {
    try {
      const response = await this.api.patch(`/media/podcasts/${podcastId}/listen`);
      return response.data;
    } catch (error) {
      console.error('Erreur incrémentation écoutes:', error);
      return { 
        success: false,
        error: error.response?.data?.message || 'Erreur serveur'
      };
    }
  }

  // ==================== VIDÉOS ====================

  // Récupérer toutes les vidéos
  async getVideos(filters = {}) {
    try {
      const response = await this.api.get('/media/videos', {
        params: { 
          limit: 6,
          ...filters 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération vidéos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion',
        data: []
      };
    }
  }

  // Récupérer une vidéo par ID
  async getVideoById(videoId) {
    try {
      const response = await this.api.get(`/media/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération vidéo:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  }

  // Créer une vidéo (PROFESSIONNELS)
  async uploadVideo(formData) {
    try {
      const response = await this.api.post('/media/pro/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 120000
      });
      return response.data;
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
      throw error;
    }
  }

  // Mettre à jour une vidéo (PROFESSIONNELS)
  async updateVideo(videoId, data) {
    try {
      const response = await this.api.put(`/media/pro/videos/${videoId}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour vidéo:', error);
      throw error;
    }
  }

  // Supprimer une vidéo (PROFESSIONNELS)
  async deleteVideo(videoId) {
    try {
      const response = await this.api.delete(`/media/pro/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression vidéo:', error);
      throw error;
    }
  }

  // Incrémenter les vues d'une vidéo
  async incrementVideoViews(videoId) {
    try {
      const response = await this.api.patch(`/media/videos/${videoId}/view`);
      return response.data;
    } catch (error) {
      console.error('Erreur incrémentation vues:', error);
      return { 
        success: false,
        error: error.response?.data?.message || 'Erreur serveur'
      };
    }
  }

  // ==================== CATÉGORIES ====================

  // Récupérer les catégories
  async getCategories(type = null) {
    try {
      const response = await this.api.get('/media/categories', {
        params: type ? { type } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  }

  // Créer une catégorie (PROFESSIONNELS)
  async createCategory(categoryData) {
    try {
      const response = await this.api.post('/media/pro/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Erreur création catégorie:', error);
      throw error;
    }
  }

  // ==================== FONCTIONNALITÉS AVANCÉES ====================

  // Récupérer les médias populaires
  async getPopularMedia(type = 'both', limit = 6) {
    try {
      const response = await this.api.get('/media/popular', {
        params: { type, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération médias populaires:', error);
      return {
        success: false,
        data: { podcasts: [], videos: [] }
      };
    }
  }

  // Récupérer les médias d'un professionnel
  async getMyMedia(type = 'both') {
    try {
      const response = await this.api.get('/media/pro/my-media', {
        params: { type }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération médias perso:', error);
      throw error;
    }
  }

  // ==================== FAVORIS ====================

  // Ajouter un média aux favoris
  async addToFavorites(mediaId, mediaType) {
    try {
      const response = await this.api.post('/media/favorites', {
        mediaId,
        mediaType
      });
      return response.data;
    } catch (error) {
      console.error('Erreur ajout favoris:', error);
      throw error;
    }
  }

  // Retirer un média des favoris
  async removeFromFavorites(mediaId, mediaType) {
    try {
      const response = await this.api.delete('/media/favorites', {
        data: { mediaId, mediaType }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur retrait favoris:', error);
      throw error;
    }
  }

  // Récupérer les favoris de l'utilisateur
  async getUserFavorites(mediaType = null) {
    try {
      const response = await this.api.get('/media/favorites', {
        params: mediaType ? { mediaType } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération favoris:', error);
      throw error;
    }
  }

  // ==================== STATISTIQUES BIEN-ÊTRE ====================

  // Mettre à jour les statistiques de bien-être
  async updateWellBeingStats(duration, category = null) {
    try {
      const response = await this.api.post('/media/wellbeing-stats', {
        duration,
        category
      });
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour stats:', error);
      throw error;
    }
  }

  // Récupérer les statistiques de bien-être
  async getWellBeingStats() {
    try {
      const response = await this.api.get('/media/wellbeing-stats');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      throw error;
    }
  }
}

export default new MediaService();