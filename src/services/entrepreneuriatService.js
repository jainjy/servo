// services/entrepreneuriatService.js
import api from "@/lib/api";

class EntrepreneuriatService {
  // Interviews
  static async getInterviews(params = {}) {
    try {
      const response = await api.get("/entrepreneuriat/interviews", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération interviews:", error);
      throw error;
    }
  }

  static async getInterviewById(id) {
    try {
      const response = await api.get(`/entrepreneuriat/interviews/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération interview:", error);
      throw error;
    }
  }

  static async createInterview(data) {
    try {
      const response = await api.post("/entrepreneuriat/interviews", data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur création interview:", error);
      throw error;
    }
  }

  static async updateInterview(id, data) {
    try {
      const response = await api.put(`/entrepreneuriat/interviews/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur mise à jour interview:", error);
      throw error;
    }
  }

  static async deleteInterview(id) {
    try {
      const response = await api.delete(`/entrepreneuriat/interviews/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur suppression interview:", error);
      throw error;
    }
  }

  static async trackInteraction(interviewId, action, duration = null) {
    try {
      const response = await api.post(
        `/entrepreneuriat/interviews/${interviewId}/interact`,
        { action, duration }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur enregistrement interaction:", error);
      throw error;
    }
  }

  // Ressources
  static async getResources(params = {}) {
    try {
      const response = await api.get("/entrepreneuriat/resources", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération ressources:", error);
      throw error;
    }
  }

  static async downloadResource(id) {
    try {
      const response = await api.get(
        `/entrepreneuriat/resources/${id}/download`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur téléchargement ressource:", error);
      throw error;
    }
  }

  // Événements
  static async getEvents(params = {}) {
    try {
      const response = await api.get("/entrepreneuriat/events", { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération événements:", error);
      throw error;
    }
  }

  static async registerToEvent(eventId) {
    try {
      const response = await api.post(
        `/entrepreneuriat/events/${eventId}/register`
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur inscription événement:", error);
      throw error;
    }
  }

  // Statistiques
  static async getStats() {
    try {
      const response = await api.get("/entrepreneuriat/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération statistiques:", error);
      throw error;
    }
  }

  static async getCategories() {
    try {
      const response = await api.get("/entrepreneuriat/categories");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération catégories:", error);
      throw error;
    }
  }

  // Suggestions
  static async getSuggestions(userId) {
    try {
      const response = await api.get(`/entrepreneuriat/suggestions/${userId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération suggestions:", error);
      throw error;
    }
  }

  // Recherche globale
  static async search(query, filters = {}) {
    try {
      const response = await api.get("/entrepreneuriat/search", {
        params: { q: query, ...filters },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur recherche:", error);
      throw error;
    }
  }
}

export default EntrepreneuriatService;
