import { api } from '@/lib/axios';

export const demandeDevisAPI = {
  // Créer une nouvelle demande de devis
  creerDemande: async (data) => {
    try {
      // Vérifier le token avant l'envoi
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token non trouvé');
      }

      console.log('Envoi de la demande avec token:', token);
      console.log('Données envoyées:', data);

      const response = await api.post('/demande-devis', data);
      console.log('Réponse reçue:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Obtenir les devis d'un utilisateur
  getDevisUtilisateur: async (userId) => {
    try {
      const response = await api.get(`/demande-devis/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
      throw error;
    }
  },

  // Répondre à un devis (accepter/refuser)
  repondreDevis: async (devisId, status) => {
    try {
      const response = await api.patch(`/demande-devis/${devisId}/reponse`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réponse au devis:', error);
      throw error;
    }
  }
};