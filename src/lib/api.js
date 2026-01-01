// lib/api.js
import axios from "axios";
import AuthService from "@/services/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

// Intercepteur de requête (Injecte le token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur de réponse (Gère le rafraîchissement automatique)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ CORRECTION: Exclure les routes d'auth du refresh automatique
    const isAuthRoute = originalRequest.url.includes("/auth/");

    // Si erreur 401 et que ce n'est pas déjà une tentative de rafraîchissement
    // ET que ce n'est pas une route d'authentification
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute // 🔥 IMPORTANT: Ne pas refresh sur les routes auth
    ) {
      originalRequest._retry = true;

      try {
        // Appeler la méthode de refresh
        const newToken = await AuthService.refreshToken();

        // Mettre à jour le header et relancer la requête initiale
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue (token expiré ou révoqué), déconnexion
        AuthService.logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default api;

// Services pour les demandes immobilières
export const demandeImmobilierAPI = {
  // Récupérer toutes les demandes (admin)
  getAllDemandes: () => api.get("/demandes/immobilier"),

  // Récupérer les demandes d'un utilisateur (client)
  getUserDemandes: (userId) => api.get(`/demandes/immobilier/user/${userId}`),

  // Récupérer les demandes pour les propriétés d'un artisan/professionnel
  getArtisanDemandes: (userId) =>
    api.get(`/demandes/immobilier/owner/${userId}`),

  // Mettre à jour le statut d'une demande
  updateStatut: (id, statut) =>
    api.patch(`/demandes/immobilier/${id}/statut`, { statut }),

  // Supprimer une demande
  deleteDemande: (id, hardDelete = false) =>
    api.delete(
      `/demandes/immobilier/${id}${hardDelete ? "?hardDelete=true" : ""}`
    ),

  // Créer une demande
  createDemande: (data) => api.post("/demandes/immobilier", data),

  // Récupérer l'historique d'une demande
  getHistory: (id) => api.get(`/demandes/immobilier/${id}/history`),

  // Récupérer l'historique utilisateur
  getUserHistory: (userId) =>
    api.get(`/demandes/immobilier/user/${userId}/history`),
};
// Services pour les locations saisonnières
export const locationSaisonniereAPI = {
  // Créer une location saisonnière
  createLocation: (data) => api.post("/locations-saisonniere", data),

  // Récupérer les locations d'un client
  getClientLocations: (userId) =>
    api.get(`/locations-saisonniere/client/${userId}`),

  // Récupérer les locations d'un artisan
  getArtisanLocations: (userId) =>
    api.get(`/locations-saisonniere/artisan/${userId}`),

  // Mettre à jour le statut d'une location
  updateLocationStatus: (id, status) =>
    api.patch(`/locations-saisonniere/${id}/status`, { status }),

  // Annuler une location
  cancelLocation: (id) => api.delete(`/locations-saisonniere/${id}`),

  // Récupérer les détails d'une location
  getLocationDetails: (id) => api.get(`/locations-saisonniere/${id}`),

  // Payer une location
  processPayment: (id, paymentData) =>
    api.post(`/locations-saisonniere/${id}/paiement`, paymentData),

  // Générer un contrat
  generateContract: (id) => api.get(`/locations-saisonniere/${id}/contrat`),
};
// Services pour le financement
export const financementAPI = {
  // Routes publiques
  getPartenaires: () => api.get("/financement/partenaires"),
  getPartenairesDetails: (id) => api.get(`/financement/partenaires/${id}`),
  getAssurances: () => api.get("/financement/assurances"),
  submitDemande: (data) => api.post("/financement/demande", data),
  getUserDemandes: (userId) => api.get(`/financement/demandes/${userId}`),

  // Services financiers
  getServiceFinancier: (id) => api.get(`/financement/services/${id}`),
  getServiceFinanciers: (params = {}) =>
    api.get("/financement/services", { params }),

  // NOUVELLES ROUTES ADMIN
  getAllDemandes: (params = {}) =>
    api.get("/financement/admin/demandes", { params }),
  updateDemandeStatus: (id, status) =>
    api.put(`/financement/admin/demandes/${id}/status`, { status }),
  deleteDemande: (id) => api.delete(`/financement/admin/demandes/${id}`),

  // Services financiers - Admin
  getAllServicesFinanciers: (params = {}) =>
    api.get("/financement/admin/services", { params }),
  toggleServiceStatus: (id, isActive) =>
    api.put(`/financement/admin/services/${id}/status`, { isActive }),

  // Gestion des partenaires - Admin
  getProfessionals: () => api.get("/financement/admin/professionals"),
  createPartenaire: (data) => api.post("/financement/admin/partenaires", data),
  updatePartenaire: (id, data) =>
    api.put(`/financement/admin/partenaires/${id}`, data),
  deletePartenaire: (id) => api.delete(`/financement/admin/partenaires/${id}`),

  // Services financiers - Professionnels
  getServicesFinanciersPro: (params = {}) =>
    api.get("/financement/pro/services", { params }),
  getPartenairesPro: () => api.get("/financement/pro/partenaires"),
  createServiceFinancier: (data) => api.post("/financement/services", data),
  updateServiceFinancier: (id, data) =>
    api.put(`/financement/services/${id}`, data),
  deleteServiceFinancier: (id) => api.delete(`/financement/services/${id}`),
};
// Services pour le tourisme
export const tourismeAPI = {
  // Routes admin
  createListingWithImages: (formData) =>
    api.post("/admin/tourisme", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateListingWithImages: (id, formData) =>
    api.put(`/admin/tourisme/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getListings: (params = {}) => api.get("/admin/tourisme", { params }),

  // CORRECTION : Ajouter le paramètre contentType
  getStats: (params = {}) => api.get("/admin/tourisme/stats", { params }),

  createListing: (data) => api.post("/admin/tourisme", data),
  updateListing: (id, data) => api.put(`/admin/tourisme/${id}`, data),
  deleteListing: (id) => api.delete(`/admin/tourisme/${id}`),
  toggleAvailability: (id) =>
    api.patch(`/admin/tourisme/${id}/toggle-availability`),
  toggleFeatured: (id) => api.patch(`/admin/tourisme/${id}/toggle-featured`),

  // Routes publiques (si nécessaire)
  getPublicListings: (params = {}) => api.get("/tourisme", { params }),
  getListingById: (id) => api.get(`/tourisme/${id}`),
  getAccommodations: (params = {}) =>
    api.get("/admin/tourisme/accommodations", { params }),

  getTouristicPlaces: (params = {}) =>
    api.get("/admin/tourisme/places", { params }),
  getFlights: (params = {}) => api.get("/Vol/flights", { params }),
  checkPlaceAvailability: (placeId, visitDate) =>
    touristicPlaceBookingsAPI.checkAvailability(placeId, visitDate),

  createPlaceBooking: (userId, bookingData) =>
    touristicPlaceBookingsAPI.createBooking(userId, bookingData),

  // Utilisez la méthode existante getTouristicPlaces
  getTouristicPlaces: (params = {}) =>
    api.get("/admin/tourisme/places", { params }),

  // Méthode de secours
  getListings: (params = {}) => api.get("/admin/tourisme", { params }),


  getNaturePatrimoine: (params = {}) => 
    api.get("/patrimoine", { params }), // Récupère tous les patrimoines
  
  getNaturePatrimoineById: (id) => 
    api.get(`/patrimoine/${id}`), // Récupère un patrimoine spécifique
  
  createNaturePatrimoine: (data) => 
    api.post("/patrimoine", data), // Crée un nouveau patrimoine
  
  updateNaturePatrimoine: (id, data) => 
    api.put(`/patrimoine/${id}`, data), // Met à jour un patrimoine
  
  deleteNaturePatrimoine: (id) => 
    api.delete(`/patrimoine/${id}`), // Supprime un patrimoine
  
};
// Services pour l'upload
export const uploadAPI = {
  // Upload d'images pour le tourisme
  uploadTourismImages: (formData) =>
    api.post("/upload/tourism-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Upload d'image unique
  uploadImage: (formData) =>
    api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Supprimer une image
  deleteImage: (path) => api.delete("/upload/image", { data: { path } }),
};
// Services pour les publicités
export const advertisementsAPI = {
  // Récupérer toutes les publicités (Admin)
  getAdvertisements: (params = {}) => api.get("/advertisements", { params }),

  // Récupérer les publicités actives (Publique)
  getActiveAdvertisements: (position) =>
    api.get("/advertisements/active", {
      params: position ? { position } : {},
    }),

  // Créer une publicité
  createAdvertisement: (formData) =>
    api.post("/advertisements", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Modifier une publicité
  updateAdvertisement: (id, formData) =>
    api.put(`/advertisements/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Supprimer une publicité
  deleteAdvertisement: (id) => api.delete(`/advertisements/${id}`),

  // Enregistrer un clic
  trackClick: (id) => api.post(`/advertisements/${id}/click`),

  // Statistiques
  getStats: () => api.get("/advertisements/stats/overview"),
};

export const estimationAPI = {
  // Soumettre les données pour estimation
  submitEstimation: (data) => api.post("/estimation/estimate", data),

  // Sauvegarder une estimation
  saveEstimation: (data) => api.post("/estimation/save", data),

  // Récupérer l'historique des estimations
  getEstimationHistory: (userId) => api.get(`/estimation/history/${userId}`),

  // Informations sur le service
  getServiceInfo: () => api.get("/estimation/info"),
};

export const annonceAPI = {
  // Créer une nouvelle annonce
  createAnnonce: (formData) =>
    api.post("/anonce", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Récupérer toutes les annonces
  getAnnonces: () => api.get("/anonce/affiche_anonce"),
  // Récupérer une annonce par ID
  getAnnonceById: (id) => api.get(`/anonce/${id}`),

  // Mettre à jour une annonce
  updateAnnonce: (id, formData) =>
    api.put(`/anonce/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  deleteAnnonce: (id) => api.delete(`/anonce/${id}`),

  // Récupérer les annonces de l'utilisateur connecté
  getUserAnnonces: () => api.get("/anonce/user/mes-annonces"),

  // Rechercher des annonces
  searchAnnonces: (filters) => api.get("/anonce/search", { params: filters }),
};

export const auditAPI = {
  // Créer une demande d'audit
  createAudit: (data) => api.post("/add_audit", data),

  // Récupérer toutes les demandes d’audit
  getAllAudits: () => api.get("/add_audit/all"),

  // Récupérer les audits de l'utilisateur connecté
  getUserAudits: () => api.get("/add_audit/user/mes-audits"),

  updateAuditStatus: (id, data) => api.patch(`/add_audit/${id}`, data),

  deleteAudit: (id) => api.delete(`/add_audit/delete/${id}`),
};

// Services pour les médias - AMÉLIORÉ
export const mediaAPI = {
  // Statistiques
  getStats: () => api.get("/admin/media/stats"),

  // Podcasts
  getPodcasts: (params = {}) => api.get("/admin/media/podcasts", { params }),
  createPodcast: (formData) =>
    api.post("/admin/media/podcasts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updatePodcast: (id, data) => api.put(`/admin/media/podcasts/${id}`, data),
  deletePodcast: (id) => api.delete(`/admin/media/podcasts/${id}`),

  // Vidéos
  getVideos: (params = {}) => api.get("/admin/media/videos", { params }),
  createVideo: (formData) =>
    api.post("/admin/media/videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateVideo: (id, data) => api.put(`/admin/media/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/admin/media/videos/${id}`),

  // Catégories
  getCategories: () => api.get("/admin/media/categories"),
};

// MediaService AMÉLIORÉ avec meilleure gestion d'erreur
export const MediaService = {
  getPodcasts: (params = {}) => mediaAPI.getPodcasts(params),
  getVideos: (params = {}) => mediaAPI.getVideos(params),
  createPodcast: (formData) => mediaAPI.createPodcast(formData),
  createVideo: (formData) => mediaAPI.createVideo(formData),

  // Méthodes améliorées avec gestion d'erreur
  updatePodcast: async (id, data) => {
    const response = await mediaAPI.updatePodcast(id, data);
    if (response.data && response.data.success === false) {
      throw new Error(
        response.data.message ||
          response.data.error ||
          "Erreur lors de la modification du podcast"
      );
    }
    return response;
  },

  updateVideo: async (id, data) => {
    const response = await mediaAPI.updateVideo(id, data);
    if (response.data && response.data.success === false) {
      throw new Error(
        response.data.message ||
          response.data.error ||
          "Erreur lors de la modification de la vidéo"
      );
    }
    return response;
  },

  // Méthode avec retry pour plus de robustesse
  updateVideoWithRetry: async (id, data, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await mediaAPI.updateVideo(id, data);

        if (response.data && response.data.success === true) {
          return response.data.data;
        }

        // Si success: false mais pas d'erreur throw, on retry
        if (i === retries - 1) {
          throw new Error(
            response.data.message ||
              response.data.error ||
              "Erreur lors de la modification"
          );
        }
      } catch (error) {
        console.error(`Tentative ${i + 1} échouée:`, error);
        if (i === retries - 1) throw error;
      }
    }
  },

  deletePodcast: (id) => mediaAPI.deletePodcast(id),
  deleteVideo: (id) => mediaAPI.deleteVideo(id),
  getCategories: () => mediaAPI.getCategories(),
  getStats: () => mediaAPI.getStats(),
};

export const productsAPI = {
  getStats: () => api.get("/products/stats"),
};

// Services pour le planning/calendrier
export const planningAPI = {
  // Récupérer le planning de l'utilisateur
  getPlanning: () => api.get("/planning"),

  // Créer un nouveau rendez-vous
  createAppointment: (data) => api.post("/planning", data),

  // Modifier un rendez-vous
  updateAppointment: (id, data) => api.put(`/planning/${id}`, data),

  // Supprimer un rendez-vous
  deleteAppointment: (id) => api.delete(`/planning/${id}`),
};

// Services pour les commandes
export const ordersAPI = {
  // Créer une commande
  createOrder: (data) => api.post("/orders", data),

  // Récupérer les commandes de l'utilisateur
  getUserOrders: (params = {}) => api.get("/orders/user/my-orders", { params }),

  // Récupérer les détails d'une commande
  getOrderById: (id) => api.get(`/orders/user/${id}`),

  // Annuler une commande
  cancelOrder: (id) => api.put(`/orders/user/${id}/cancel`),

  // Statistiques utilisateur
  getUserStats: () => api.get("/orders/user/stats"),

  // Test d'authentification
  testAuth: () => api.get("/orders/test/auth"),

  // Test de données
  testData: () => api.get("/orders/test-data"),
};

// Services pour le panier
export const cartAPI = {
  // Valider le panier
  validateCart: (data) => api.post("/cart/validate", data),

  // Vérifier le stock
  checkStock: (data) => api.post("/cart/check-stock", data),

  // Vérifier la disponibilité
  checkAvailability: (data) => api.post("/cart/check-availability", data),
};

// Ajouter dans lib/api.js
export const offresExclusivesAPI = {
  // Récupérer toutes les offres
  getOffres: (params = {}) => api.get("/offres-exclusives", { params }),

  // Récupérer les offres flash
  getOffresFlash: () => api.get("/offres-exclusives/flash"),

  // Récupérer les statistiques
  getStats: () => api.get("/offres-exclusives/stats"),

  // Récupérer les catégories
  getCategories: () => api.get("/offres-exclusives/categories"),
};

export const touristicPlaceBookingsAPI = {
  // Créer une réservation
  createBooking: (userId, data) =>
    api.post(`/touristic-place-bookings/${userId}`, data),

  // Récupérer les réservations
  getBookings: (params = {}) =>
    api.get("/touristic-place-bookings", { params }),

  // Récupérer une réservation spécifique
  getBookingById: (id) => api.get(`/touristic-place-bookings/${id}`),

  // Récupérer par numéro de confirmation
  getBookingByConfirmation: (confirmationNumber) =>
    api.get(`/touristic-place-bookings/confirmation/${confirmationNumber}`),

  // Mettre à jour le statut
  updateStatus: (id, statusData) =>
    api.put(`/touristic-place-bookings/${id}/status`, statusData),

  // Vérifier la disponibilité
  checkAvailability: (placeId, visitDate) =>
    api.get(`/touristic-place-bookings/place/${placeId}/availability`, {
      params: { visitDate },
    }),

  // Annuler une réservation
  cancelBooking: (id) => api.delete(`/touristic-place-bookings/${id}`),

  // Statistiques pour prestataires
  getPrestataireStats: (prestataireId, period = "month") =>
    api.get(`/touristic-place-bookings/prestataire/${prestataireId}/stats`, {
      params: { period },
    }),

  // Récupérer les réservations d'un lieu spécifique
  getBookingsByPlace: (placeId, params = {}) =>
    api.get("/touristic-place-bookings", {
      params: { placeId, ...params },
    }),
};

// Service utilitaire pour les réservations
export const bookingService = {
  // Calculer le prix total
  calculateTotalPrice: (basePrice, ticketType, numberOfTickets) => {
    const multipliers = {
      adult: 1,
      child: 0.5,
      student: 0.7,
      senior: 0.8,
    };

    const multiplier = multipliers[ticketType] || 1;
    return basePrice * multiplier * numberOfTickets;
  },

  // Formater la date pour l'affichage
  formatVisitDate: (dateString, timeString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return `${date.toLocaleDateString("fr-FR", options)} à ${timeString}`;
  },

  // Générer un QR code data URL (simulé)
  generateQRCodeData: (bookingData) => {
    const data = {
      confirmationNumber: bookingData.confirmationNumber,
      placeTitle: bookingData.place?.title,
      visitDate: bookingData.visitDate,
      visitTime: bookingData.visitTime,
      numberOfTickets: bookingData.numberOfTickets,
    };

    // En production, vous utiliseriez une vraie librairie QR code
    return `data:image/svg+xml;base64,${btoa(JSON.stringify(data))}`;
  },
};

export const flightsAPI = {
  // Récupérer tous les vols
  getFlights: (params = {}) => api.get("/vol", { params }),

  // Récupérer un vol par ID
  getFlightById: (id) => api.get(`/vol/${id}`),

  // Créer un vol
  createFlight: (data) => api.post("/vol", data),

  // Modifier un vol
  updateFlight: (id, data) => api.put(`/vol/${id}`, data),

  // Supprimer un vol
  deleteFlight: (id) => api.delete(`/vol/${id}`),

  // Statistiques des vols
  getFlightStats: () => api.get("/vol/stats"),
  // Créer une réservation de vol
  createReservation: (flightId, data) =>
    api.post(`/Vol/reservation/${flightId}/reserver`, data),
  getReservations: (params = {}) => api.get("/Vol/reservations", { params }),

  updateReservationStatus: (id, status) =>
    api.put(`/Vol/reservations/${id}/status`, { status }),
};

// Services pour les commandes professionnelles
export const ordersProAPI = {
  // Récupérer les commandes du pro avec filtres
  getProOrders: (params = {}) => api.get("/orders/pro", { params }),

  // Récupérer les statistiques du pro
  getProStats: () => api.get("/orders/pro/stats"),

  // Récupérer les statistiques par type de produit
  getProProductTypes: () => api.get("/orders/pro/product-types"),

  // Mettre à jour le statut d'une commande
  updateOrderStatus: (orderId, status) =>
    api.put(`/orders/pro/${orderId}/status`, { status }),

  // Récupérer les détails d'une commande spécifique
  getOrderDetails: (orderId) => api.get(`/orders/pro/${orderId}`),
};

// Fonction pour uploader des fichiers avec FormData
export const uploadPortraitFiles = async (files, portraitId = null) => {
  const formData = new FormData();

  // Ajouter les images
  if (files.images && files.images.length > 0) {
    files.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  // Ajouter l'audio
  if (files.interviewAudio) {
    formData.append("interviewAudio", files.interviewAudio);
  }

  // Si c'est une mise à jour, ajouter l'ID
  if (portraitId) {
    formData.append("portraitId", portraitId);
  }

  const response = await api.post("/portraits/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Fonctions spécifiques pour les portraits
export const portraitsAPI = {
  // Récupérer les portraits
  getAll: (params = {}) => api.get("/portraits", { params }),

  // Récupérer un portrait spécifique
  getById: (id) => api.get(`/portraits/${id}`),

  // Créer un portrait
  create: (data, files = null) => {
    if (files) {
      const formData = new FormData();

      // Ajouter les données JSON
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Ajouter les fichiers
      if (files.images && files.images.length > 0) {
        files.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      if (files.interviewAudio) {
        formData.append("interviewAudio", files.interviewAudio);
      }

      return api.post("/portraits", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return api.post("/portraits", data);
    }
  },

  // Mettre à jour un portrait
  update: (id, data, files = null) => {
    if (files) {
      const formData = new FormData();

      // Ajouter les données JSON
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key]));
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      // Ajouter les fichiers
      if (files.images && files.images.length > 0) {
        files.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      if (files.interviewAudio) {
        formData.append("interviewAudio", files.interviewAudio);
      }

      return api.put(`/portraits/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return api.put(`/portraits/${id}`, data);
    }
  },

  // Supprimer un portrait
  delete: (id) => api.delete(`/portraits/${id}`),

  // Statistiques
  getStats: () => api.get("/portraits/stats"),

  // Commentaires
  getComments: (portraitId, params = {}) =>
    api.get(`/portraits/${portraitId}/comments`, { params }),

  createComment: (portraitId, data) =>
    api.post(`/portraits/${portraitId}/comments`, data),

  likeComment: (portraitId, commentId) =>
    api.post(`/portraits/${portraitId}/comments/${commentId}/like`),

  // Partage
  recordShare: (portraitId, platform) =>
    api.post(`/portraits/${portraitId}/share`, { platform }),

  // Écoute
  recordListen: (portraitId, data) =>
    api.post(`/portraits/${portraitId}/listen`, data),
};

