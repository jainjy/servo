import api from "../lib/api";

export const expertService = {
  // Récupérer TOUTES les demandes (conseil + accompagnement)
  getToutesDemandesExpert: async () => {
    try {
   
      // Essayer d'abord l'endpoint unifié
      const response = await api.get("/expert/demandes-toutes");
      
      if (response.data?.success) {
       return response.data;
      }
      
      // Fallback 1: Récupérer séparément
    return await expertService.getDemandesSeparees();
      
    } catch (error) {
      console.error("❌ [expertService] Erreur endpoint unifié:", error.message);
  

      return expertService.getTestData();
    }
  },

  // Récupérer séparément et fusionner
  getDemandesSeparees: async () => {
    try {
    
      // Récupérer les deux types séparément avec gestion d'erreur
      const [conseilResponse, accompagnementResponse] = await Promise.allSettled([
        api.get("/expert/demandes-conseil"),
        api.get("/expert/demandes-accompagnement")
      ]);
      
      let toutesDemandes = [];
      
      // Conseils
      if (conseilResponse.status === 'fulfilled' && conseilResponse.value.data?.success) {
        const conseils = conseilResponse.value.data.data.map(d => ({
          ...d,
          typeDemande: 'conseil',
          origine: d.origine || 'page_conseil'
        }));
        toutesDemandes = [...toutesDemandes, ...conseils];
        // console.log("📊 [expertService] Demandes conseil trouvées:", conseils.length);
      } 
      
      // Accompagnements
      if (accompagnementResponse.status === 'fulfilled' && accompagnementResponse.value.data?.success) {
        const accompagnements = accompagnementResponse.value.data.data.map(d => ({
          ...d,
          typeDemande: 'accompagnement',
          origine: d.origine || 'page_accompagnement'
        }));
        toutesDemandes = [...toutesDemandes, ...accompagnements];
        // console.log("📊 [expertService] Demandes accompagnement trouvées:", accompagnements.length);
      } 
      // Trier par date
      toutesDemandes.sort((a, b) => 
        new Date(b.createdAt || b.created_at || b.date) - new Date(a.createdAt || a.created_at || a.date)
      );
      
    
      return {
        success: true,
        data: toutesDemandes,
        counts: {
          total: toutesDemandes.length,
          conseil: toutesDemandes.filter(d => d.typeDemande === "conseil").length,
          accompagnement: toutesDemandes.filter(d => d.typeDemande === "accompagnement").length
        },
        source: "fusionnée"
      };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur récupération séparée:", error.message);
      return expertService.getTestData();
    }
  },

  // Données de test basées sur vos données réelles
  getTestData: () => {
   
    // Données basées sur votre BD (exemple pour expertId: 2ef705e0-f60b-4c31-8cfe-87bdf31cffbc)
    const testDemandes = [
      {
        id: 1,
        userId: "b89334f1-94aa-4afe-9440-009c13f1c6cc",
        conseilType: "Médiation & Résolution",
        besoin: "ffesfsfgw",
        budget: "5k-10k",
        message: "sdevesdvsrev",
        nom: "Alice Du bois",
        email: "user@servo.mg",
        telephone: "+261 34 12 345 71",
        entreprise: "",
        expertId: "2ef705e0-f60b-4c31-8cfe-87bdf31cffbc",
        statut: "en_attente",
        origine: "page_conseil",
        createdAt: "2025-12-16 08:39:51.855",
        updatedAt: "2025-12-18 07:19:12.905",
        typeDemande: "conseil",
        user: {
          id: "b89334f1-94aa-4afe-9440-009c13f1c6cc",
          firstName: "Alice",
          lastName: "Du bois",
          email: "user@servo.mg",
          phone: "+261 34 12 345 71",
          companyName: "",
          avatar: ""
        },
        suivis: []
      },
      {
        id: 4,
        userId: "b89334f1-94aa-4afe-9440-009c13f1c6cc",
        conseilType: "Accompagnement Création",
        besoin: "vdvdrv",
        budget: "5k-10k",
        message: "Bonjour, je suis Alice Du bois.",
        nom: "Alice Du bois",
        email: "user@servo.mg",
        telephone: "+261 34 12 345 71",
        entreprise: "asadd",
        expertId: "2ef705e0-f60b-4c31-8cfe-87bdf31cffbc",
        statut: "en_attente",
        origine: "page_accompagnement",
        createdAt: "2025-12-17 07:52:20.43",
        updatedAt: "2025-12-17 11:00:47.495",
        typeDemande: "accompagnement",
        user: {
          id: "b89334f1-94aa-4afe-9440-009c13f1c6cc",
          firstName: "Alice",
          lastName: "Du bois",
          email: "user@servo.mg",
          phone: "+261 34 12 345 71",
          companyName: "asadd",
          avatar: ""
        },
        suivis: []
      }
    ];
    
    return {
      success: true,
      data: testDemandes,
      counts: {
        total: testDemandes.length,
        conseil: testDemandes.filter(d => d.typeDemande === "conseil").length,
        accompagnement: testDemandes.filter(d => d.typeDemande === "accompagnement").length
      },
      note: "⚠️ Données de test basées sur votre BD",
      source: "test"
    };
  },

  // Récupérer les statistiques de l'expert
  getStatsExpert: async () => {
    try {
    
      // Essayer d'abord /expert/stats
      try {
        const response = await api.get("/expert/stats");
        
        if (response.data?.success) {
          // console.log("✅ [expertService] Stats récupérées via /expert/stats:", response.data.data);
          return response.data;
        }
      } catch (error) {
        // console.log("🔄 [expertService] Erreur /expert/stats, essai /orders/pro/stats...");
      }
      
      // Fallback: essayer /orders/pro/stats
      try {
        const response = await api.get("/orders/pro/stats");
        
        if (response.data?.success) {
          // console.log("✅ [expertService] Stats récupérées via /orders/pro/stats:", response.data.data);
          return response.data;
        }
      } catch (orderError) {
        // console.log("⚠️ [expertService] Erreur /orders/pro/stats:", orderError.message);
      }
      
      // Fallback: calculer à partir des demandes
      // console.log("🔄 [expertService] Fallback: calcul stats depuis demandes");
      const demandesResponse = await expertService.getToutesDemandesExpert();
      const demandes = demandesResponse.success ? demandesResponse.data : [];
      
      const stats = expertService.calculateStatsFromDemandes(demandes);
      
      return {
        success: true,
        data: stats,
        note: "Stats calculées localement",
        source: "local"
      };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur récupération stats expert:", error.message);
      
      // Fallback: calculer à partir des demandes
      const demandesResponse = await expertService.getToutesDemandesExpert();
      const demandes = demandesResponse.success ? demandesResponse.data : [];
      
      const stats = expertService.calculateStatsFromDemandes(demandes);
      
      return {
        success: true,
        data: stats,
        note: "Stats calculées localement (erreur serveur)",
        source: "local-error"
      };
    }
  },

  // Calculer les stats à partir des demandes
  calculateStatsFromDemandes: (demandes) => {
    if (!demandes || !Array.isArray(demandes)) {
      return {
        total: 0,
        en_attente: 0,
        en_cours: 0,
        terminee: 0,
        annulee: 0,
        en_revision: 0,
        satisfaction: 95,
        tempsMoyenReponse: "24h",
        revenuTotal: 0,
        demandeMois: 0,
        conseil: 0,
        accompagnement: 0
      };
    }
    
    const maintenant = new Date();
    const moisEnCours = maintenant.getMonth();
    const anneeEnCours = maintenant.getFullYear();
    
    const demandeMois = demandes.filter(d => {
      if (!d.createdAt) return false;
      const date = new Date(d.createdAt);
      return date.getMonth() === moisEnCours && date.getFullYear() === anneeEnCours;
    }).length;
    
    const terminees = demandes.filter(d => d.statut === "terminee");
    const revenuTotal = terminees.length * 1500; // Estimation
    
    // Calculer conseil vs accompagnement
    const conseil = demandes.filter(d => d.typeDemande === "conseil" || d.origine === "page_conseil").length;
    const accompagnement = demandes.filter(d => d.typeDemande === "accompagnement" || d.origine === "page_accompagnement").length;
    
    return {
      total: demandes.length,
      en_attente: demandes.filter(d => d.statut === "en_attente").length,
      en_cours: demandes.filter(d => d.statut === "en_cours").length,
      terminee: terminees.length,
      annulee: demandes.filter(d => d.statut === "annulee").length,
      en_revision: demandes.filter(d => d.statut === "en_revision").length,
      satisfaction: 95,
      tempsMoyenReponse: "24h",
      revenuTotal: revenuTotal,
      demandeMois: demandeMois,
      conseil: conseil,
      accompagnement: accompagnement
    };
  },

  // Récupérer le profil expert
  getProfile: async () => {
    try {
     
      const response = await api.get("/expert/profile");
      
      if (response.data?.success) {
      
        return response.data;
      }
      
    
      return expertService.getDefaultProfile();
      
    } catch (error) {
      console.error("❌ [expertService] Erreur récupération profil expert:", error.message);
      
      // Données par défaut en cas d'erreur
      return expertService.getDefaultProfile();
    }
  },

  // Données de profil par défaut
  getDefaultProfile: () => {
    return {
      success: true,
      data: {
        id: "b14f8e76-667b-4c13-9eb5-d24a0f012071",
        name: "Expert Pro",
        email: "pro@servo.mg",
        phone: "+261 34 12 345 67",
        title: "Expert Professionnel",
        specialty: "Conseil stratégique",
        experience: "Expérience variable",
        rating: 4.5,
        projects: 0,
        avatar: "",
        companyName: "Votre entreprise",
        availability: 'disponible',
        certifications: [],
        metiers: ["Conseil", "Stratégie"],
        services: ["Audit", "Accompagnement"],
        userInfo: {
          role: "professional",
          userType: "PRESTATAIRE"
        }
      },
      note: "Données par défaut - erreur serveur",
      source: "default"
    };
  },

  // Mettre à jour le statut d'une demande
  updateDemandeStatus: async (demandeId, statut) => {
    try {
    
      const response = await api.put(`/expert/demande/${demandeId}/status`, { statut });
      
      if (response.data?.success) {

        return response.data;
      }
      
      return {
        success: false,
        error: response.data?.error || "Erreur lors de la mise à jour du statut"
      };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur mise à jour statut:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour du statut",
        message: error.message
      };
    }
  },

  // Ajouter un suivi
  addSuivi: async (demandeId, suiviData) => {
    try {
     
      const response = await api.post(`/expert/demande/${demandeId}/suivi`, suiviData);
      
      if (response.data?.success) {
       
        return response.data;
      }
      
      return {
        success: false,
        error: response.data?.error || "Erreur lors de l'ajout du suivi"
      };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur ajout suivi:", error);
      return {
        success: false,
        error: "Erreur lors de l'ajout du suivi",
        message: error.message
      };
    }
  },

  // Tester la connexion API
  testAPI: async () => {
    try {
    
      
      const endpoints = [
        { name: 'debug', endpoint: '/expert/debug' },
        { name: 'profile', endpoint: '/expert/profile' },
        { name: 'stats', endpoint: '/expert/stats' },
        { name: 'orders/stats', endpoint: '/orders/pro/stats' },
        { name: 'demandes-toutes', endpoint: '/expert/demandes-toutes' },
        { name: 'demandes-conseil', endpoint: '/expert/demandes-conseil' },
        { name: 'demandes-accompagnement', endpoint: '/expert/demandes-accompagnement' }
      ];
      
      const results = [];
      
      for (const route of endpoints) {
        try {
          const startTime = Date.now();
          const response = await api.get(route.endpoint);
          const endTime = Date.now();
          
          results.push({
            route: route.name,
            endpoint: route.endpoint,
            status: '✅ OK',
            time: `${endTime - startTime}ms`,
            success: response.data?.success,
            data: response.data?.data ? `${Array.isArray(response.data.data) ? response.data.data.length + ' items' : 'Object'}` : 'Pas de données'
          });
          
        } catch (error) {
          results.push({
            route: route.name,
            endpoint: route.endpoint,
            status: '❌ ERROR',
            error: error.response?.status || error.code,
            message: error.response?.data?.error || error.message
          });
        }
        
        // Pause pour éviter le timeout
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.table(results);
      return results;
      
    } catch (error) {
      console.error("❌ [expertService] Erreur test API:", error);
      return [];
    }
  },

  // Déboguer l'authentification
  debugAuth: async () => {
    try {
      
      
      // Vérifier le token
      const token = localStorage.getItem('auth-token');
     
      
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
        
        } catch (e) {
          // console.log("⚠️ [expertService] Token non décodable:", e.message);
        }
      }
      
      // Tester l'endpoint debug
      const response = await api.get("/expert/debug");
      
      if (response.data?.success) {
        // console.log("✅ [expertService] Debug auth réussi");
        return response.data.debug;
      }
      
      return null;
      
    } catch (error) {
      console.error("❌ [expertService] Erreur debug auth:", error.message);
      return null;
    }
  },

  // Vérifier les permissions utilisateur
  checkUserPermissions: async () => {
    try {
    
      const debugInfo = await expertService.debugAuth();
      
      if (debugInfo) {
        const canAccessExpert = debugInfo.permissions?.canAccessExpertRoutes || false;
        
      
        
        return {
          canAccessExpert,
          userInfo: debugInfo.user
        };
      }
      
      return { canAccessExpert: false, userInfo: null };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur vérification permissions:", error);
      return { canAccessExpert: false, error: error.message };
    }
  },

  // Mettre à jour la disponibilité
  updateAvailability: async (availability) => {
    try {
     
      const response = await api.put("/expert/availability", { availability });
      
      if (response.data?.success) {
       
        return response.data;
      }
      
      return {
        success: false,
        error: response.data?.error || "Erreur lors de la mise à jour"
      };
      
    } catch (error) {
      console.error("❌ [expertService] Erreur mise à jour disponibilité:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour de la disponibilité",
        message: error.message
      };
    }
  },

  // Obtenir des données de démonstration
  getDemoData: () => {
   
    return {
      profile: {
        id: "b14f8e76-667b-4c13-9eb5-d24a0f012071",
        name: "Expert Pro",
        email: "pro@servo.mg",
        phone: "+261 34 12 345 67",
        title: "Expert Professionnel",
        specialty: "Conseil stratégique & Accompagnement",
        experience: "5-10 ans d'expérience",
        rating: 4.8,
        projects: 7,
        avatar: "",
        companyName: "Votre Entreprise",
        availability: 'disponible',
        certifications: [],
        metiers: ["Conseil", "Stratégie", "Management"],
        services: ["Audit", "Conseil", "Accompagnement"],
        userInfo: {
          role: "professional",
          userType: "PRESTATAIRE"
        }
      },
      stats: {
        total: 7,
        en_attente: 5,
        en_cours: 1,
        terminee: 1,
        annulee: 0,
        en_revision: 0,
        satisfaction: 96,
        tempsMoyenReponse: "12h",
        revenuTotal: 1500,
        demandeMois: 7,
        conseil: 4,
        accompagnement: 3
      }
    };
  }
};

export default expertService;