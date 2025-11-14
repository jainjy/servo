import api from "../lib/api";

export const reviewService = {
  // Récupérer les avis du profil connecté
  getMyReviews: async () => {
    try {
      const response = await api.get("/reviews/me");
      return response.data;
    } catch (error) {
      console.error("Erreur récupération avis:", error);
      throw error;
    }
  },

  // Répondre à un avis
  respondToReview: async (reviewId, responses) => {
    try {
      const response = await api.post("/reviews/response", {
        reviewId,
        responses,
      });
      return response.data;
    } catch (error) {
      console.error("Erreur réponse avis:", error);
      throw error;
    }
  },

  // Récupérer les avis d'un utilisateur spécifique
  getUserReviews: async (userId) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur récupération avis utilisateur:", error);
      throw error;
    }
  },
};
