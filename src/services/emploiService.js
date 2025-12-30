// @/services/emploiService.js
import api from '@/lib/axios';

export const emploiService = {
  // Récupérer tous les emplois avec filtres
  async getAllEmplois(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.secteur && filters.secteur !== 'all') params.append('secteur', filters.secteur);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);
    
    const queryString = params.toString();
    return api.get(`/api/emploi${queryString ? `?${queryString}` : ''}`);
  },

  // Récupérer un emploi spécifique
  async getEmploi(id) {
    return api.get(`/api/emploi/${id}`);
  },

  // Créer un nouvel emploi
  async createEmploi(data) {
    return api.post('/api/emploi', data);
  },

  // Mettre à jour un emploi
  async updateEmploi(id, data) {
    return api.put(`/api/emploi/${id}`, data);
  },

  // Supprimer un emploi
  async deleteEmploi(id) {
    return api.delete(`/api/emploi/${id}`);
  },

  // Mettre à jour le statut
  async updateStatus(id, status) {
    return api.patch(`/api/emploi/${id}/status`, { status });
  },

  // Récupérer les statistiques
  async getStats() {
    return api.get('/api/emploi/stats/summary');
  },

  // Exporter en CSV
  async exportToCSV() {
    return api.get('/api/emploi/export/csv', {
      responseType: 'blob',
    });
  },
};