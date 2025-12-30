import api from "../lib/api";

export const conseilService = {
  // Récupérer les informations de l'utilisateur connecté
  getUserInfo: async () => {
    try {
      const response = await api.get("/conseil/user-info");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération info utilisateur:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          data: null,
          error: "Non authentifié"
        };
      }
      
      return {
        success: false,
        data: null,
        error: "Erreur lors de la récupération des informations"
      };
    }
  },

  // Envoyer une demande de conseil
  sendDemandeConseil: async (demandeData) => {
    try {
      const response = await api.post("/conseil/demande", demandeData);
      return response.data;
    } catch (error) {
      console.error('Erreur envoi demande conseil:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Non authentifié. Veuillez vous connecter.",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: "Données invalides. Veuillez vérifier les informations."
        };
      }
      
      return {
        success: false,
        error: "Une erreur est survenue lors de l'envoi de votre demande."
      };
    }
  },

  // Récupérer les types de conseil
  getTypesConseil: async () => {
    try {
      const response = await api.get("/conseil/types");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération types conseil:', error);
      
      // Retourner un tableau vide au lieu de données par défaut
      return {
        success: false,
        data: [],
        error: "Impossible de charger les types de conseil"
      };
    }
  },

  // Récupérer les experts
  getExperts: async () => {
    try {
      const response = await api.get("/conseil/experts");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération experts:', error);
      
      // Retourner un tableau vide au lieu de données par défaut
      return {
        success: false,
        data: [],
        error: "Impossible de charger les experts"
      };
    }
  },

  // Récupérer mes demandes
  getMesDemandes: async () => {
    try {
      const response = await api.get("/conseil/mes-demandes");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Vous devez être connecté pour voir vos demandes",
          data: []
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération des demandes",
        data: []
      };
    }
  },

  // Récupérer une demande spécifique
  getDemandeById: async (demandeId) => {
    try {
      const response = await api.get(`/conseil/demande/${demandeId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demande:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 404) {
        return {
          success: false,
          error: "Demande non trouvée"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération de la demande"
      };
    }
  },

  // Récupérer tous les suivis d'une demande
  getSuivisByDemandeId: async (demandeId) => {
    try {
      const response = await api.get(`/conseil/demande/${demandeId}/suivis`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération suivis:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          data: []
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération des suivis",
        data: []
      };
    }
  },

  // Ajouter un suivi à une demande
  addSuivi: async (demandeId, suiviData) => {
    try {
      const response = await api.post(`/conseil/demande/${demandeId}/suivi`, suiviData);
      return response.data;
    } catch (error) {
      console.error('Erreur ajout suivi:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Non autorisé à ajouter un suivi"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de l'ajout du suivi"
      };
    }
  },

  // Mettre à jour le statut d'une demande
  updateStatut: async (demandeId, statut) => {
    try {
      const response = await api.put(`/conseil/demande/${demandeId}/statut`, { statut });
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Non autorisé à modifier cette demande"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la mise à jour du statut"
      };
    }
  },

  // Assigner un expert à une demande
  assignExpert: async (demandeId, expertId) => {
    try {
      const response = await api.put(`/conseil/demande/${demandeId}/assign`, { expertId });
      return response.data;
    } catch (error) {
      console.error('Erreur assignation expert:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Non autorisé à assigner un expert"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de l'assignation de l'expert"
      };
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get("/conseil/stats");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats:', error);
      
      // Retourner un tableau vide
      return {
        success: false,
        data: [],
        error: "Impossible de charger les statistiques"
      };
    }
  },

  // Récupérer les témoignages
  getTemoignages: async () => {
    try {
      const response = await api.get("/conseil/temoignages");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération témoignages:', error);
      
      // Retourner un tableau vide
      return {
        success: false,
        data: [],
        error: "Impossible de charger les témoignages"
      };
    }
  },

  // Récupérer les étapes
  getEtapes: async () => {
    try {
      const response = await api.get("/conseil/etapes");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération étapes:', error);
      
      // Retourner un tableau vide
      return {
        success: false,
        data: [],
        error: "Impossible de charger les étapes"
      };
    }
  },

  // Récupérer les avantages
  getAvantages: async () => {
    try {
      const response = await api.get("/conseil/avantages");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération avantages:', error);
      
      // Retourner un tableau vide
      return {
        success: false,
        data: [],
        error: "Impossible de charger les avantages"
      };
    }
  },

  // Récupérer les services
  getServices: async () => {
    try {
      const response = await api.get("/conseil/services");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération services:', error);
      return { success: false, data: [] };
    }
  },

  // Récupérer les métiers
  getMetiers: async () => {
    try {
      const response = await api.get("/conseil/metiers");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération métiers:', error);
      return { success: false, data: [] };
    }
  },

  // Récupérer les statistiques de l'utilisateur
  getStatsUser: async () => {
    try {
      const response = await api.get("/conseil/demandes/statistics/user");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats utilisateur:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération des statistiques"
      };
    }
  },

  // Vérifier l'authentification
  isAuthenticated: () => {
    const token = localStorage.getItem('auth-token');
    return !!(token && token !== 'null' && token !== 'undefined');
  },

  // Récupérer le token
  getToken: () => {
    return localStorage.getItem('auth-token');
  }
};

// Pour admin
export const conseilAdminService = {
  // Récupérer toutes les demandes (admin)
  getAllDemandes: async () => {
    try {
      const response = await api.get("/conseil/admin/demandes");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération demandes admin:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          data: []
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Accès réservé aux administrateurs",
          data: []
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération des demandes",
        data: []
      };
    }
  },

  // Assigner un expert (admin)
  assignExpert: async (demandeId, expertId) => {
    try {
      const response = await api.put(`/conseil/admin/demande/${demandeId}/assign`, { expertId });
      return response.data;
    } catch (error) {
      console.error('Erreur assignation expert admin:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Accès réservé aux administrateurs"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de l'assignation de l'expert"
      };
    }
  },

  // Envoyer une réponse admin
  sendAdminResponse: async (demandeId, message) => {
    try {
      const response = await api.post(`/conseil/admin/demande/${demandeId}/response`, { message });
      return response.data;
    } catch (error) {
      console.error('Erreur envoi réponse admin:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Accès réservé aux administrateurs"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de l'envoi de la réponse"
      };
    }
  },

  // Mettre à jour le statut (admin)
  updateDemandeStatus: async (demandeId, statut) => {
    try {
      const response = await api.put(`/conseil/admin/demande/${demandeId}/status`, { statut });
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour statut admin:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Accès réservé aux administrateurs"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la mise à jour du statut"
      };
    }
  },

  // Récupérer les stats détaillées
  getDetailedStats: async () => {
    try {
      const response = await api.get("/conseil/admin/stats/detailed");
      return response.data;
    } catch (error) {
      console.error('Erreur récupération stats détaillées:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Accès réservé aux administrateurs"
        };
      }
      
      return {
        success: false,
        error: "Erreur lors de la récupération des statistiques"
      };
    }
  }
};

export default conseilService;