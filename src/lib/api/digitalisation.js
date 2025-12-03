// api/digitalisation.js
import api from "@/lib/api";

export const digitalisationApi = {
  // Récupérer tous les services de digitalisation
  getAllServices: async () => {
    try {
      const response = await api.get("/digitalisation-services");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
      throw error;
    }
  },

  // Récupérer un service spécifique
  getServiceById: async (id) => {
    try {
      const response = await api.get(`/digitalisation-services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du service ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau service
  createService: async (serviceData, token) => {
    try {
      const response = await api.post("/digitalisation-services", serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
      throw error;
    }
  },

  // Mettre à jour un service
  updateService: async (id, serviceData, token) => {
    try {
      const response = await api.put(
        `/digitalisation-services/${id}`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du service ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un service
  deleteService: async (id, token) => {
    try {
      const response = await api.delete(`/digitalisation-services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du service ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les services d'un professionnel
  getServicesByProfessional: async (userId) => {
    try {
      const response = await api.get(
        `/digitalisation-services/professional/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des services du professionnel ${userId}:`,
        error
      );
      throw error;
    }
  },
};
