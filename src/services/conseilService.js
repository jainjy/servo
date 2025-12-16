// services/conseilService.js - Version corrigée
import api from "../lib/api";

export const conseilService = {
  // Récupérer les informations de l'utilisateur connecté
  getUserInfo: async () => {
    const response = await api.get("/conseil/user-info");
    return response.data;
  },

  // Envoyer une demande de conseil
  sendDemandeConseil: async (demandeData) => {
    const response = await api.post("/conseil/demande", demandeData);
    return response.data;
  },

  // Récupérer les types de conseil
  getTypesConseil: async () => {
    const response = await api.get("/conseil/types");
    return response.data;
  },

  // Récupérer les experts
  getExperts: async () => {
    const response = await api.get("/conseil/experts");
    return response.data;
  },

  // Récupérer mes demandes
  getMesDemandes: async () => {
    const response = await api.get("/conseil/mes-demandes");
    return response.data;
  },

  // Ajouter un suivi à une demande
  addSuivi: async (demandeId, suiviData) => {
    const response = await api.post(
      `/conseil/demande/${demandeId}/suivi`,
      suiviData
    );
    return response.data;
  },

  // Récupérer les statistiques
  getStats: async () => {
    const response = await api.get("/conseil/stats");
    return response.data;
  },

  // Récupérer les services
  getServices: async () => {
    const response = await api.get("/conseil/services");
    return response.data;
  },

  // Récupérer les métiers
  getMetiers: async () => {
    const response = await api.get("/conseil/metiers");
    return response.data;
  },

  getDemandeById: async (demandeId) => {
    const response = await api.get(`/conseil/demande/${demandeId}`);
    return response.data;
  },

  // Récupérer tous les suivis d'une demande
  getSuivisByDemandeId: async (demandeId) => {
    const response = await api.get(`/conseil/demande/${demandeId}/suivis`);
    return response.data;
  },

  // Mettre à jour le statut d'une demande (pour utilisateur/expert)
  updateStatut: async (demandeId, statut) => {
    const response = await api.put(`/conseil/demande/${demandeId}/statut`, { statut });
    return response.data;
  },

  // Assigner un expert (pour utilisateur/expert)
  assignExpert: async (demandeId, expertId) => {
    const response = await api.put(`/conseil/demande/${demandeId}/assign`, { expertId });
    return response.data;
  }
};

// Pour admin
export const conseilAdminService = {
  // Récupérer toutes les demandes (admin)
  getAllDemandes: async () => {
    const response = await api.get("/conseil/admin/demandes");
    return response.data;
  },

  // Assigner un expert (admin)
  assignExpert: async (demandeId, expertId) => {
    const response = await api.put(`/conseil/admin/demande/${demandeId}/assign`, { expertId });
    return response.data;
  },

  // Envoyer une réponse admin
  sendAdminResponse: async (demandeId, message) => {
    const response = await api.post(`/conseil/admin/demande/${demandeId}/response`, { message });
    return response.data;
  },

  // Mettre à jour le statut (admin)
  updateDemandeStatus: async (demandeId, statut) => {
    const response = await api.put(`/conseil/admin/demande/${demandeId}/status`, { statut });
    return response.data;
  },

  // Récupérer les stats détaillées
  getDetailedStats: async () => {
    const response = await api.get("/conseil/admin/stats/detailed");
    return response.data;
  }
};