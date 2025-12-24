import api from "../api";

export const vehiculesApi = {
  // Récupérer tous les véhicules avec filtres
  getVehicules: (params) => api.get("/vehicules", { params }),

  // Récupérer un véhicule par ID
  getVehiculeById: (id) => api.get(`/vehicules/${id}`),

  // Récupérer les véhicules d'un prestataire
  getVehiculesByPrestataire: (prestataireId) =>
    api.get(`/vehicules/prestataire/${prestataireId}`),

  // Créer une réservation
  createReservation: (data) => api.post("/reservations-vehicules", data),

  // Récupérer les réservations de l'utilisateur
  getMesReservations: (params) =>
    api.get("/reservations-vehicules/mes-reservations", { params }),

  // Récupérer une réservation par ID
  getReservationById: (id) => api.get(`/reservations-vehicules/${id}`),

  // Mettre à jour le statut d'une réservation
  updateReservationStatus: (id, data) =>
    api.put(`/reservations-vehicules/${id}/statut`, data),

  // Supprimer une réservation
  deleteReservation: (id) => api.delete(`/reservations-vehicules/${id}`),

  // Vérifier la disponibilité
  checkDisponibilite: (vehiculeId, dateDebut, dateFin) =>
    api.get(`/reservations-vehicules/vehicule/${vehiculeId}/disponibilite`, {
      params: { dateDebut, dateFin },
    }),

  // Récupérer les avis d'un véhicule
  getAvisVehicule: (vehiculeId, params) =>
    api.get(`/avis-vehicules/vehicule/${vehiculeId}`, { params }),

  // Créer un avis
  createAvis: (data) => api.post("/avis-vehicules", data),

  // Supprimer un avis
  deleteAvis: (id) => api.delete(`/avis-vehicules/${id}`),

  // Statistiques globales
  getStats: () => api.get("/vehicules/stats/global"),

  // Créer un véhicule (avec FormData pour les images)
  createVehicule: (formData) =>
    api.post("/vehicules", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Mettre à jour un véhicule (avec FormData pour les images)
  updateVehicule: (id, formData) =>
    api.put(`/vehicules/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Supprimer un véhicule
  deleteVehicule: (id) => api.delete(`/vehicules/${id}`),

  // Upload d'images vers Supabase (nouvelle fonction)
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });
    return api.post("/api/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Itinéraires
  updateReservationItinerary: (reservationId, data) =>
    api.put(`/reservations-vehicules/${reservationId}/itinerary`, data),

  getReservationItinerary: (reservationId) =>
    api.get(`/reservations-vehicules/${reservationId}/itinerary`),
};
