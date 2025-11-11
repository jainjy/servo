import api from "../lib/api";

export const adminDemandesService = {
  // Récupérer toutes les demandes avec filtres
  getDemandes: async (filters = {}) => {
    const { status, search, page, limit } = filters;
    const params = new URLSearchParams();

    if (status && status !== "Toutes") params.append("status", status);
    if (search) params.append("search", search);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    const response = await api.get(`/admin/demandes?${params.toString()}`);
    return response.data;
  },

  // Récupérer les statistiques
  getStats: async () => {
    const response = await api.get("/admin/demandes/stats");
    return response.data;
  },

  // Valider une demande
  validateDemande: async (demandeId) => {
    const response = await api.put(`/admin/demandes/${demandeId}/validate`);
    return response.data;
  },

  // Assigner un artisan
  assignArtisan: async (demandeId, artisanId) => {
    const response = await api.put(`/admin/demandes/${demandeId}/assign`, {
      artisanId,
    });
    return response.data;
  },

  // Récupérer les artisans disponibles
  getArtisans: async (filters = {}) => {
    const { metierId, serviceId } = filters;
    const params = new URLSearchParams();

    if (metierId) params.append("metierId", metierId);
    if (serviceId) params.append("serviceId", serviceId);

    const response = await api.get(
      `/admin/demandes/artisans?${params.toString()}`
    );
    return response.data;
  },
};
