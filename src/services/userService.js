import  api  from '@/lib/api';

class UserService {
  // Récupérer le profil utilisateur
  static async getProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération du profil');
    }
  }

  // Mettre à jour le profil
  static async updateProfile(userData) {
    try {
      const response = await api.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la mise à jour du profil');
    }
  }

  // Upload d'avatar
  static async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'upload de l\'avatar');
    }
  }

  // Changer le mot de passe
  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors du changement de mot de passe');
    }
  }

  // Récupérer les métiers d'un utilisateur
  static async getUserMetiers() {
    try {
      const response = await api.get('/users/profile/metiers');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des métiers');
    }
  }

  // Récupérer les services d'un utilisateur
  static async getUserServices() {
    try {
      const response = await api.get('/users/profile/services');
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des services');
    }
  }

  // Gestion des erreurs
  static handleError(error, defaultMessage) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(defaultMessage);
    }
  }
}

export default UserService;