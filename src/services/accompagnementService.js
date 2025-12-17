// src/services/accompagnementService.js
import api from "../lib/api";

export const accompagnementService = {
  // Envoyer une demande d'accompagnement
  sendDemande: async (demandeData) => {
    try {
      const response = await api.post("/accompagnement/demande", demandeData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          return {
            success: false,
            error: data.error || "Données invalides. Veuillez vérifier les informations fournies."
          };
        }
        
        if (status === 401) {
          return {
            success: false,
            error: "Votre session a expiré. Veuillez vous reconnecter.",
            redirect: "/login"
          };
        }
      }
      
      return {
        success: false,
        error: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer."
      };
    }
  },

  // Récupérer les types d'accompagnement
  getTypesAccompagnement: async () => {
    try {
      const response = await api.get("/accompagnement/types");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des types:", error);
      
      const defaultTypes = [
        {
          id: 1,
          title: "Accompagnement Création",
          description: "De l'idée à la création de votre entreprise",
          category: "creation",
          duration: "3-6 mois",
          price: "À partir de 1 500€",
          icon: "Rocket",
          color: "#6B8E23",
          details: [
            "Étude de faisabilité complète",
            "Business plan détaillé",
            "Choix de la structure juridique",
            "Formalités d'immatriculation",
            "Aides et subventions"
          ],
          isFeatured: true,
          isPopular: false
        },
        {
          id: 2,
          title: "Accompagnement Croissance",
          description: "Développez et optimisez votre entreprise existante",
          category: "croissance",
          duration: "6-12 mois",
          price: "À partir de 2 500€",
          icon: "TrendingUp",
          color: "#27AE60",
          details: [
            "Stratégie de développement",
            "Optimisation des processus",
            "Analyse de marché",
            "Plan de croissance",
            "Recrutement stratégique"
          ],
          isFeatured: false,
          isPopular: true
        },
        {
          id: 3,
          title: "Transition & Transmission",
          description: "Préparez la transmission ou la cession de votre entreprise",
          category: "transition",
          duration: "12-24 mois",
          price: "Sur devis personnalisé",
          icon: "Handshake",
          color: "#8B4513",
          details: [
            "Évaluation de l'entreprise",
            "Préparation à la transmission",
            "Recherche d'acquéreurs",
            "Négociation",
            "Accompagnement juridique"
          ],
          isFeatured: false,
          isPopular: false
        }
      ];
      
      return { 
        success: true, 
        data: defaultTypes 
      };
    }
  },

  // Récupérer les experts
  getExperts: async () => {
    try {
      const response = await api.get("/accompagnement/experts");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des experts:", error);
      return { 
        success: false, 
        error: "Impossible de charger la liste des experts",
        data: [] 
      };
    }
  },

  // Récupérer les statistiques
  getStats: async () => {
    try {
      const response = await api.get("/accompagnement/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      
      const defaultStats = [
        {
          value: "95%",
          label: "Taux de réussite",
          icon: "Trophy",
          color: "#D4AF37"
        },
        {
          value: "500+",
          label: "Entreprises accompagnées",
          icon: "Users",
          color: "#6B8E23"
        },
        {
          value: "10",
          label: "Années d'expertise",
          icon: "Award",
          color: "#8B4513"
        },
        {
          value: "24h",
          label: "Réponse garantie",
          icon: "Clock",
          color: "#27AE60"
        }
      ];
      
      return { success: true, data: defaultStats };
    }
  },

  // Récupérer les témoignages
  getTemoignages: async () => {
    try {
      const response = await api.get("/accompagnement/temoignages");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des témoignages:", error);
      
      const defaultTemoignages = [
        {
          id: 1,
          name: "Julie Moreau",
          entreprise: "TechStart Solutions",
          texte: "L'accompagnement a été crucial pour le lancement de ma startup. L'expertise et le réseau mis à disposition ont fait toute la différence.",
          rating: 5,
          date: "15 Jan 2024",
          avatarColor: "#6B8E23",
          resultat: "+200% CA en 18 mois"
        },
        {
          id: 2,
          name: "Marc Lefebvre",
          entreprise: "Artisan & Co",
          texte: "Grâce à l'accompagnement stratégique, nous avons doublé notre chiffre d'affaires en 18 mois. Une équipe exceptionnelle !",
          rating: 5,
          date: "22 Nov 2023",
          avatarColor: "#8B4513",
          resultat: "Doublement du CA"
        }
      ];
      
      return { success: true, data: defaultTemoignages };
    }
  },

  // Récupérer les étapes
  getEtapes: async () => {
    try {
      const response = await api.get("/accompagnement/etapes");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des étapes:", error);
      
      const defaultEtapes = [
        {
          step: 1,
          title: "Diagnostic initial",
          description: "Analyse approfondie de votre situation et définition des objectifs",
          icon: "Search",
          color: "#6B8E23",
          details: "Entretien personnalisé, analyse SWOT, benchmark concurrentiel"
        },
        {
          step: 2,
          title: "Plan d'action",
          description: "Élaboration d'une stratégie sur mesure avec des échéances claires",
          icon: "Target",
          color: "#27AE60",
          details: "Roadmap détaillée, KPIs, planning d'exécution"
        },
        {
          step: 3,
          title: "Mise en œuvre",
          description: "Accompagnement pas à pas dans la réalisation de votre projet",
          icon: "Rocket",
          color: "#8B4513",
          details: "Suivi hebdomadaire, ajustements, reporting régulier"
        }
      ];
      
      return { success: true, data: defaultEtapes };
    }
  },

  // Récupérer les avantages
  getAvantages: async () => {
    try {
      const response = await api.get("/accompagnement/avantages");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des avantages:", error);
      
      const defaultAvantages = [
        {
          title: "Expertise certifiée",
          description: "Nos experts sont certifiés et possèdent une expérience avérée",
          icon: "ShieldCheck",
          color: "#6B8E23"
        },
        {
          title: "Approche personnalisée",
          description: "Chaque accompagnement est adapté à vos besoins spécifiques",
          icon: "HeartHandshake",
          color: "#27AE60"
        },
        {
          title: "Résultats mesurables",
          description: "Des objectifs clairs avec des indicateurs de performance",
          icon: "BarChart",
          color: "#8B4513"
        }
      ];
      
      return { success: true, data: defaultAvantages };
    }
  },

  // Récupérer les informations de l'utilisateur connecté
  getUserInfo: async () => {
    try {
      const response = await api.get("/accompagnement/user-info");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des infos utilisateur:", error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Authentification requise",
          redirect: "/login"
        };
      }
      
      return {
        success: false,
        error: "Impossible de récupérer vos informations. Veuillez rafraîchir la page."
      };
    }
  },

  // Récupérer mes demandes
  getMesDemandes: async () => {
    try {
      const response = await api.get("/accompagnement/mes-demandes");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Vous devez être connecté pour voir vos demandes",
          redirect: "/login",
          data: []
        };
      }
      
      return { success: false, error: "Erreur de chargement", data: [] };
    }
  },

  // Récupérer une demande spécifique
  getDemandeById: async (demandeId) => {
    try {
      const response = await api.get(`/accompagnement/demande/${demandeId}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la demande:", error);
      
      if (error.response?.status === 404) {
        return { 
          success: false, 
          error: "Cette demande n'existe pas ou a été supprimée" 
        };
      }
      
      if (error.response?.status === 403) {
        return { 
          success: false, 
          error: "Vous n'avez pas accès à cette demande" 
        };
      }
      
      return { 
        success: false, 
        error: "Erreur lors du chargement de la demande" 
      };
    }
  },

  // Ajouter un suivi à une demande
  addSuivi: async (demandeId, suiviData) => {
    try {
      const response = await api.post(`/accompagnement/demande/${demandeId}/suivi`, suiviData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du suivi:", error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: "Votre session a expiré. Veuillez vous reconnecter.",
          redirect: "/login"
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Vous n'êtes pas autorisé à ajouter un suivi à cette demande"
        };
      }
      
      throw {
        success: false,
        error: "Impossible d'ajouter le suivi. Veuillez réessayer."
      };
    }
  },

  // Mettre à jour le statut d'une demande
  updateStatut: async (demandeId, statut) => {
    try {
      const response = await api.put(`/accompagnement/demande/${demandeId}/statut`, { statut });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      
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
          error: "Vous n'êtes pas autorisé à modifier cette demande"
        };
      }
      
      throw {
        success: false,
        error: "Impossible de mettre à jour le statut. Veuillez réessayer."
      };
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return token !== null && token !== 'undefined' && token !== '';
  },

  // Récupérer le token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Récupérer l'utilisateur depuis le localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Erreur parsing user:", error);
        return null;
      }
    }
    return null;
  },

  // Sauvegarder l'utilisateur dans le localStorage
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Mettre à jour le token
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Vérifier les permissions
  hasPermission: (requiredRole) => {
    const user = accompagnementService.getCurrentUser();
    if (!user) return false;
    
    const userRole = user.role || 'client';
    const rolesHierarchy = {
      'admin': 3,
      'expert': 2,
      'client': 1
    };
    
    return rolesHierarchy[userRole] >= (rolesHierarchy[requiredRole] || 1);
  }
};

// Service admin spécifique pour l'accompagnement
export const accompagnementAdminService = {
  // Récupérer toutes les demandes d'accompagnement
  getAllDemandes: async () => {
    try {
      const response = await api.get("/admin/accompagnement/demandes");
      return response.data;
    } catch (error) {
      console.error("Erreur récupération demandes admin:", error);
      
      const testDemandes = [
        {
          id: 1001,
          conseilType: "Accompagnement Création",
          besoin: "Création d'une startup dans le domaine de la tech",
          budget: "1 500€ - 3 000€",
          message: "Je souhaite créer ma startup dans le domaine de la tech...",
          nom: "Pierre Martin",
          email: "pierre@startup.fr",
          telephone: "+33 6 12 34 56 78",
          entreprise: "FutureTech Startup",
          expertId: "1",
          statut: "en_attente",
          origine: "page_accompagnement",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T10:30:00Z",
          expert: {
            id: "1",
            firstName: "Sophie",
            lastName: "Laurent",
            email: "sophie@expert.fr"
          },
          user: {
            id: "user1001",
            firstName: "Pierre",
            lastName: "Martin",
            email: "pierre@startup.fr"
          },
          suivis: []
        },
        {
          id: 1002,
          conseilType: "Accompagnement Croissance",
          besoin: "Développement international de mon entreprise",
          budget: "2 500€ - 5 000€",
          message: "Nous souhaitons développer notre activité à l'international...",
          nom: "Marie Dubois",
          email: "marie@entreprise.fr",
          telephone: "+33 6 23 45 67 89",
          entreprise: "Global Solutions",
          expertId: "2",
          statut: "en_cours",
          origine: "page_accompagnement",
          createdAt: "2024-01-18T14:20:00Z",
          updatedAt: "2024-01-19T11:15:00Z",
          expert: {
            id: "2",
            firstName: "Thomas",
            lastName: "Petit",
            email: "thomas@expert.fr"
          },
          user: {
            id: "user1002",
            firstName: "Marie",
            lastName: "Dubois",
            email: "marie@entreprise.fr"
          },
          suivis: [
            {
              id: 1,
              message: "Premier contact établi avec la cliente",
              type: "message",
              createdAt: "2024-01-18T15:00:00Z",
              user: { firstName: "Thomas", lastName: "Petit" }
            }
          ]
        }
      ];
      
      return { 
        success: true, 
        data: testDemandes 
      };
    }
  },

  // Assigner un expert à une demande d'accompagnement
  assignExpert: async (demandeId, expertId) => {
    try {
      const response = await api.put(`/admin/accompagnement/demande/${demandeId}/assign`, { expertId });
      return response.data;
    } catch (error) {
      console.error("Erreur assignation expert:", error);
      return {
        success: false,
        error: "Erreur lors de l'assignation de l'expert"
      };
    }
  },

  // Récupérer les statistiques détaillées pour l'accompagnement
  getDetailedStats: async () => {
    try {
      const response = await api.get("/admin/accompagnement/stats");
      return response.data;
    } catch (error) {
      console.error("Erreur récupération stats admin:", error);
      
      const defaultStats = {
        totalDemandes: 15,
        demandesEnAttente: 5,
        demandesEnCours: 7,
        demandesTerminees: 3,
        demandesAnnulees: 0,
        totalAccompagnement: 15,
        enAttenteAccompagnement: 5,
        tauxConversion: 85,
        tempsMoyenTraitement: "48h"
      };
      
      return { success: true, data: defaultStats };
    }
  },

  // Envoyer une réponse admin à une demande d'accompagnement
  sendAdminResponse: async (demandeId, message) => {
    try {
      const response = await api.post(`/admin/accompagnement/demande/${demandeId}/response`, { message });
      return response.data;
    } catch (error) {
      console.error("Erreur envoi réponse admin:", error);
      return {
        success: false,
        error: "Erreur lors de l'envoi de la réponse"
      };
    }
  },

  // Mettre à jour le statut d'une demande d'accompagnement
  updateDemandeStatus: async (demandeId, statut) => {
    try {
      const response = await api.put(`/admin/accompagnement/demande/${demandeId}/status`, { statut });
      return response.data;
    } catch (error) {
      console.error("Erreur mise à jour statut admin:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour du statut"
      };
    }
  },

  // Ajouter un suivi à une demande d'accompagnement
  addSuivi: async (demandeId, suiviData) => {
    try {
      const response = await api.post(`/admin/accompagnement/demande/${demandeId}/suivi`, suiviData);
      return response.data;
    } catch (error) {
      console.error("Erreur ajout suivi admin:", error);
      return {
        success: false,
        error: "Erreur lors de l'ajout du suivi"
      };
    }
  }
};