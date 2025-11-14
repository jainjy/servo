// services/documentService.js
import api from "@/lib/api";

// Types de documents (garder le même)
export const TYPES_DOCUMENTS = {
  ASSURANCE: {
    label: "Assurance",
    color: "bg-blue-100 text-blue-800",
    icon: "Shield",
  },
  DIPLOME: {
    label: "Diplôme",
    color: "bg-green-100 text-green-800",
    icon: "Award",
  },
  CERTIFICATION: {
    label: "Certification",
    color: "bg-purple-100 text-purple-800",
    icon: "FileCheck",
  },
  CONTRAT: {
    label: "Contrat",
    color: "bg-orange-100 text-orange-800",
    icon: "FileText",
  },
  CGV: { label: "CGV/CGU", color: "bg-red-100 text-red-800", icon: "Shield" },
  ARCHIVE: {
    label: "Archive",
    color: "bg-gray-100 text-gray-800",
    icon: "Archive",
  },
  IMMOBILIER: {
    label: "Immobilier",
    color: "bg-indigo-100 text-indigo-800",
    icon: "Home",
  },
};

export const STATUT_DOCUMENT = {
  VALIDE: { label: "Valide", color: "bg-green-100 text-green-800" },
  EXPIRANT: { label: "Expirant", color: "bg-yellow-100 text-yellow-800" },
  EXPIRE: { label: "Expiré", color: "bg-red-100 text-red-800" },
  EN_ATTENTE: { label: "En attente", color: "bg-blue-100 text-blue-800" },
};

export const CATEGORIES_IMMOBILIER = {
  REVENU_FONCIER: {
    label: "Revenu Foncier",
    icon: "Banknote",
    color: "bg-green-100 text-green-800",
  },
  BAIL_LOCATION: {
    label: "Bail de Location",
    icon: "FileSignature",
    color: "bg-blue-100 text-blue-800",
  },
  QUITTANCE_LOYER: {
    label: "Quittance de Loyer",
    icon: "Receipt",
    color: "bg-purple-100 text-purple-800",
  },
  ETAT_LIEUX: {
    label: "État des Lieux",
    icon: "Home",
    color: "bg-orange-100 text-orange-800",
  },
  GESTION: {
    label: "Gestion Immobilière",
    icon: "Building",
    color: "bg-indigo-100 text-indigo-800",
  },
  AUTRE: {
    label: "Autre",
    icon: "FileText",
    color: "bg-gray-100 text-gray-800",
  },
};

// Service pour les documents - CORRECTION DES URLS
export const documentService = {
  // Récupérer tous les documents
  async getDocuments(filters = {}) {
    try {
      const response = await api.get("/documents", { params: filters }); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des documents:", error);
      throw error;
    }
  },

  // Récupérer les documents immobiliers
  async getDocumentsImmobiliers(filters = {}) {
    try {
      const response = await api.get("/documents/immobilier", {
        // AJOUT /api
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des documents immobiliers:",
        error
      );
      throw error;
    }
  },

  // Uploader un document
  async uploadDocument(formData) {
    try {
      const response = await api.post("/documents/upload", formData, {
        // AJOUT /api
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'upload du document:", error);
      throw error;
    }
  },

  // Supprimer un document
  async deleteDocument(id) {
    try {
      const response = await api.delete(`/documents/${id}`); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      throw error;
    }
  },

  // Télécharger un document (retourne l'URL directe de Supabase)
  async downloadDocument(id) {
    try {
      const response = await api.get(`/documents/${id}`); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du document:", error);
      throw error;
    }
  },

  // Récupérer les contrats types
  async getContratsTypes() {
    try {
      const response = await api.get("/contrats-types"); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des contrats types:",
        error
      );
      throw error;
    }
  },

  // Sauvegarder un contrat type
  async saveContratType(contrat) {
    try {
      if (contrat.id) {
        const response = await api.put(
          `/contrats-types/${contrat.id}`, // AJOUT /api
          contrat
        );
        return response.data;
      } else {
        const response = await api.post("/contrats-types", contrat); // AJOUT /api
        return response.data;
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du contrat type:", error);
      throw error;
    }
  },

  // Supprimer un contrat type
  async deleteContratType(id) {
    try {
      const response = await api.delete(`/contrats-types/${id}`); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la suppression du contrat type:", error);
      throw error;
    }
  },

  // Récupérer les archives signées
  async getArchivesSignes() {
    try {
      const response = await api.get("/documents/archives"); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des archives:", error);
      throw error;
    }
  },

  // Récupérer les statistiques
  async getStats() {
    try {
      const response = await api.get("/documents/stats"); // AJOUT /api
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },
};
