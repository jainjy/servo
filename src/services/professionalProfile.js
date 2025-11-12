// services/professionalProfile.js
import api from "@/lib/api";

export const professionalProfileService = {
  // Récupérer les données d'un professionnel par son ID
  async getProfessionalProfile(professionalId) {
    try {
      const response = await api.get(`/professional/profile/${professionalId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les statistiques du professionnel
  async getProfessionalStats(professionalId) {
    try {
      const response = await api.get(
        `/professional/profile/stats/${professionalId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les avis du professionnel
  async getProfessionalReviews(professionalId) {
    try {
      const response = await api.get(
        `/professional/profile/reviews/${professionalId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer les services du professionnel
  async getProfessionalServices(professionalId) {
    try {
      const response = await api.get(
        `/professional/profile/services/${professionalId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
