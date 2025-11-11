class MediaService {
  constructor() {
    this.baseURL = 'http://localhost:3001/api/media';
  }

  // Méthode pour récupérer et vérifier le token
  getAuthHeaders() {
    let token = localStorage.getItem('auth-token'); // 🔥 Changé de 'token' à 'auth-token'
    console.log('🔐 Token stocké:', token);
    
    // Vérifier le format du token
    if (!token) {
      console.error('❌ Aucun token trouvé dans localStorage');
      console.log('🔍 Clés disponibles dans localStorage:', Object.keys(localStorage));
      throw new Error('Token manquant');
    }
    
    // Nettoyer le token
    token = this.cleanToken(token);
    
    console.log('✅ Token nettoyé:', token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Méthode pour nettoyer et formater le token
  cleanToken(token) {
    // Retirer "Bearer " si présent
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    
    // Le token est déjà au bon format "real-jwt-token-xxx", pas besoin de modifier
    return token;
  }

  async getPodcasts(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseURL}/podcasts?${queryString}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur récupération podcasts:', error);
      throw error;
    }
  }

  async getVideos(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${this.baseURL}/videos?${queryString}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur récupération vidéos:', error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await fetch(`${this.baseURL}/categories`);
      return await response.json();
    } catch (error) {
      console.error('Erreur récupération catégories:', error);
      throw error;
    }
  }

  async deletePodcast(id) {
    try {
      console.log('🗑️ Suppression podcast ID:', id);
      const headers = this.getAuthHeaders();
      console.log('📤 Headers envoyés:', headers);
      
      const response = await fetch(`${this.baseURL}/podcasts/${id}`, {
        method: 'DELETE',
        headers: headers
      });
      
      console.log('📥 Statut réponse:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur réponse:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status} lors de la suppression`);
      }
      
      const result = await response.json();
      console.log('✅ Réponse suppression podcast:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erreur suppression podcast:', error);
      throw error;
    }
  }

  async deleteVideo(id) {
    try {
      console.log('🗑️ Suppression vidéo ID:', id);
      const headers = this.getAuthHeaders();
      console.log('📤 Headers envoyés:', headers);
      
      const response = await fetch(`${this.baseURL}/videos/${id}`, {
        method: 'DELETE',
        headers: headers
      });
      
      console.log('📥 Statut réponse:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur réponse:', errorData);
        throw new Error(errorData.message || `Erreur ${response.status} lors de la suppression`);
      }
      
      const result = await response.json();
      console.log('✅ Réponse suppression vidéo:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erreur suppression vidéo:', error);
      throw error;
    }
  }

  async updatePodcast(id, data) {
    try {
      console.log('✏️ Mise à jour podcast ID:', id, data);
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/podcasts/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status} lors de la mise à jour`);
      }
      
      const result = await response.json();
      console.log('✅ Réponse mise à jour podcast:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erreur mise à jour podcast:', error);
      throw error;
    }
  }

  async updateVideo(id, data) {
    try {
      console.log('✏️ Mise à jour vidéo ID:', id, data);
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseURL}/videos/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status} lors de la mise à jour`);
      }
      
      const result = await response.json();
      console.log('✅ Réponse mise à jour vidéo:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erreur mise à jour vidéo:', error);
      throw error;
    }
  }

  // Méthodes d'upload
  async uploadPodcast(formData) {
    try {
      let token = localStorage.getItem('auth-token'); // 🔥 Changé ici aussi
      token = this.cleanToken(token);
      
      const response = await fetch(`${this.baseURL}/podcasts/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur upload podcast:', error);
      throw error;
    }
  }

  async uploadVideo(formData) {
    try {
      let token = localStorage.getItem('auth-token'); // 🔥 Changé ici aussi
      token = this.cleanToken(token);
      
      const response = await fetch(`${this.baseURL}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      return await response.json();
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
      throw error;
    }
  }
}

export default new MediaService();