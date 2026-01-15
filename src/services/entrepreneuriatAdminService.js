// services/entrepreneuriatAdminService.js
import api from "@/lib/api";

class EntrepreneuriatAdminService {
  // Statistiques détaillées
  static async getAdminStats() {
    try {
      const response = await api.get("/entrepreneuriat/admin/stats");
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération stats admin:", error);
      throw error;
    }
  }

  // Interactions récentes
  static async getRecentInteractions(limit = 20) {
    try {
      const response = await api.get("/entrepreneuriat/admin/interactions", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération interactions:", error);
      throw error;
    }
  }

  // Export des données
  static async exportData(type, format = "csv") {
    try {
      const response = await api.get(`/entrepreneuriat/admin/export/${type}`, {
        params: { format },
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur export données:", error);
      throw error;
    }
  }

  // Batch operations
  static async batchUpdate(items, updates) {
    try {
      const response = await api.patch("/entrepreneuriat/admin/batch", {
        items,
        updates,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur batch update:", error);
      throw error;
    }
  }

  static async batchDelete(items) {
    try {
      const response = await api.delete("/entrepreneuriat/admin/batch", {
        data: { items },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur batch delete:", error);
      throw error;
    }
  }
}

export default EntrepreneuriatAdminService;
