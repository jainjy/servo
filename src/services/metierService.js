// src/services/metierService.js
import api from '../lib/api';

class MetierService {
  // Récupérer tous les métiers
  async getAllMetiers() {
    try {
      const response = await api.get('/metiers');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des métiers');
    }
  }

  // Récupérer un métier par son ID
  async getMetierById(id) {
    try {
      const response = await api.get(`/metiers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du métier');
    }
  }

  // Créer un nouveau métier
  async createMetier(metierData) {
    try {
      const response = await api.post('/metiers', metierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du métier');
    }
  }

  // Mettre à jour un métier
  async updateMetier(id, metierData) {
    try {
      const response = await api.put(`/metiers/${id}`, metierData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du métier');
    }
  }

  // Supprimer un métier
  async deleteMetier(id) {
    try {
      const response = await api.delete(`/metiers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du métier');
    }
  }

  // Récupérer les statistiques des métiers
  async getMetiersStats() {
    try {
      const response = await api.get('/metiers/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  }
}

export default new MetierService();