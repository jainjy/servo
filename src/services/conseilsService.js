// services/conseilsService.js
import api from "../lib/api";

export const conseilsService = {
  // ==============================================
  // ROUTES PUBLIQUES
  // ==============================================

  // Récupérer les catégories
// Récupérer les catégories
getCategories: async () => {
  try {
    const response = await api.get("/conseils/categories");
    
    // Adapter la réponse si nécessaire
    if (response.data.success && Array.isArray(response.data.data)) {
      // S'assurer que chaque catégorie a le bon format
      const formattedData = response.data.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        color: cat.color,
        _count: {
          conseils: cat.conseilsCount || cat._count?.conseils || 0
        }
      }));
      
      return {
        ...response.data,
        data: formattedData
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    return { success: false, data: [] };
  }
},
  // Récupérer tous les conseils
  getConseils: async (params = {}) => {
    try {
      const response = await api.get("/conseils", { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseils:', error);
      return { success: false, data: [], pagination: {} };
    }
  },

  // Récupérer les conseils en vedette
  getFeaturedConseils: async () => {
    try {
      const response = await api.get("/conseils/featured");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseils vedette:', error);
      return { success: false, data: [] };
    }
  },

  // Récupérer un conseil spécifique
  getConseilById: async (id) => {
    try {
      const response = await api.get(`/conseils/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseil:', error);
      return { success: false, error: "Conseil non trouvé" };
    }
  },

  // Rechercher des conseils
  searchConseils: async (query) => {
    try {
      const response = await api.get("/conseils", { params: { search: query } });
      return response.data;
    } catch (error) {
      console.error('Erreur recherche conseils:', error);
      return { success: false, data: [] };
    }
  },

  // Suggestions de recherche
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get("/conseils/search/suggestions", { params: { q: query } });
      return response.data;
    } catch (error) {
      console.error('Erreur suggestions recherche:', error);
      return { success: false, data: [] };
    }
  },

  // Statistiques globales
  getGlobalStats: async () => {
    try {
      const response = await api.get("/conseils/stats/global");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats globales:', error);
      return { success: false, data: {} };
    }
  },

  // ==============================================
  // ROUTES UTILISATEUR CONNECTÉ
  // ==============================================

  // Sauvegarder un conseil
  saveConseil: async (conseilId) => {
    try {
      const response = await api.post(`/conseils/${conseilId}/save`);
      return response.data;
    } catch (error) {
      console.error('Erreur sauvegarde conseil:', error);
      if (error.response?.status === 401) {
        return { success: false, error: "Connectez-vous pour sauvegarder" };
      }
      return { success: false, error: "Erreur lors de la sauvegarde" };
    }
  },

  // Bookmark un conseil
  bookmarkConseil: async (conseilId) => {
    try {
      const response = await api.post(`/conseils/${conseilId}/bookmark`);
      return response.data;
    } catch (error) {
      console.error('Erreur bookmark conseil:', error);
      if (error.response?.status === 401) {
        return { success: false, error: "Connectez-vous pour bookmarker" };
      }
      return { success: false, error: "Erreur lors du bookmark" };
    }
  },

  // Récupérer les conseils sauvegardés
  getSavedConseils: async () => {
    try {
      const response = await api.get("/conseils/user/saved");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseils sauvegardés:', error);
      if (error.response?.status === 401) {
        return { success: false, error: "Connectez-vous pour voir vos sauvegardes" };
      }
      return { success: false, data: [] };
    }
  },

  // Récupérer les conseils bookmarkés
  getBookmarkedConseils: async () => {
    try {
      const response = await api.get("/conseils/user/bookmarked");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseils bookmarkés:', error);
      if (error.response?.status === 401) {
        return { success: false, error: "Connectez-vous pour voir vos favoris" };
      }
      return { success: false, data: [] };
    }
  },

  // Statistiques utilisateur
  getUserStats: async () => {
    try {
      const response = await api.get("/conseils/user/stats");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats utilisateur:', error);
      if (error.response?.status === 401) {
        return { success: false, error: "Connectez-vous pour voir vos statistiques" };
      }
      return { success: false, data: {} };
    }
  },

  // ==============================================
  // ROUTES ADMIN
  // ==============================================

  // Récupérer tous les conseils (admin)
  getAllConseilsAdmin: async (params = {}) => {
    try {
      const response = await api.get("/conseils/admin/all", { params });
      return response.data;
    } catch (error) {
      console.error('Erreur récupération conseils admin:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, data: [], pagination: {} };
    }
  },

  // Créer un conseil
  createConseil: async (conseilData) => {
    try {
      const response = await api.post("/conseils/admin/create", conseilData);
      return response.data;
    } catch (error) {
      console.error('Erreur création conseil:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la création" };
    }
  },

  // Mettre à jour un conseil
  updateConseil: async (id, updateData) => {
    try {
      const response = await api.put(`/conseils/admin/update/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour conseil:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la mise à jour" };
    }
  },

  // Supprimer un conseil
  deleteConseil: async (id) => {
    try {
      const response = await api.delete(`/conseils/admin/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur suppression conseil:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la suppression" };
    }
  },

  // Basculer le statut "en vedette"
  toggleFeatured: async (id) => {
    try {
      const response = await api.put(`/conseils/admin/toggle-featured/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur toggle featured:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la modification" };
    }
  },

  // Basculer le statut actif
  toggleActive: async (id) => {
    try {
      const response = await api.put(`/conseils/admin/toggle-active/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur toggle active:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la modification" };
    }
  },

  // Statistiques admin
getAdminStats: async () => {
  try {
    const response = await api.get("/conseils/admin/stats");
    console.log('📊 Stats admin récupérées:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur récupération stats admin:', error);
    if (error.response?.status === 403) {
      return { success: false, error: "Accès non autorisé" };
    } else if (error.response?.status === 500) {
      return { 
        success: false, 
        error: "Erreur serveur",
        data: {
          totals: {
            conseils: 0,
            active: 0,
            featured: 0,
            saves: 0,
            views: 0
          },
          topConseils: [],
          categoryStats: [],
          monthlyStats: [],
          recentActivity: []
        }
      };
    }
    return { success: false, data: {} };
  }
},

  // Gestion des catégories
  getAllCategoriesAdmin: async () => {
    try {
      const response = await api.get("/conseils/admin/categories/all");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération catégories admin:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, data: [] };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/conseils/admin/categories/create", categoryData);
      return response.data;
    } catch (error) {
      console.error('Erreur création catégorie:', error);
      if (error.response?.status === 403) {
        return { success: false, error: "Accès non autorisé" };
      }
      return { success: false, error: "Erreur lors de la création" };
    }
  }
};