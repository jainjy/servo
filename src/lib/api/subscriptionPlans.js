import api from "../api";

export const subscriptionPlansAPI = {
  // Récupérer tous les plans d'abonnement
  getAllPlans: async () => {
    try {
      const response = await api.get("/subscription-plans");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des plans:", error);
      throw error;
    }
  },

  // Récupérer un plan spécifique
  getPlanByType: async (planType) => {
    try {
      const response = await api.get(`/subscription-plans/${planType}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du plan:", error);
      throw error;
    }
  },

  // Créer un nouveau plan (Admin)
  createPlan: async (planData) => {
    try {
      const response = await api.post("/subscription-plans", planData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du plan:", error);
      throw error;
    }
  },

  // Mettre à jour un plan (Admin)
  updatePlan: async (id, planData) => {
    try {
      const response = await api.put(`/subscription-plans/${id}`, planData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du plan:", error);
      throw error;
    }
  },
};
