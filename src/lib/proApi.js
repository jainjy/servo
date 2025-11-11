import api from "./api";

// Services pour les professionnels
export const proAPI = {
  // Récupérer les demandes pour le professionnel
  getDemandes: (params = {}) => api.get("/pro/demandes", { params }),

  // Statistiques pour le professionnel
  getStats: () => api.get("/pro/demandes/stats"),

  // Accepter une demande
  acceptDemande: (id) => api.post(`/pro/demandes/${id}/accept`),

  // Refuser une demande
  declineDemande: (id, raison) =>
    api.post(`/pro/demandes/${id}/decline`, { raison }),

  // Postuler à une demande
  applyToDemande: (id, data) => api.post(`/pro/demandes/${id}/apply`, data),
};
