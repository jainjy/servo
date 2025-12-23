import { useState, useCallback } from 'react';
import { emploiService } from '@/services/emploiService';

export const useEmploi = () => {
  const [emplois, setEmplois] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    candidatures: 0,
    urgent: 0,
    total_postes: 0
  });

  // Charger les emplois avec filtres
  const fetchEmplois = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await emploiService.getAllEmplois({
        ...filters,
        page: filters.page || pagination.page,
        limit: filters.limit || pagination.limit
      });
      
      setEmplois(response.emplois);
      setPagination(response.pagination);
      
      return response.emplois;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des emplois');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await emploiService.getStats();
      
      setStats({
        total: statsData.total || 0,
        active: statsData.active || 0,
        candidatures: statsData.total_candidatures || 0,
        urgent: statsData.urgent || 0,
        total_postes: statsData.total_postes || 0
      });
      
      return statsData;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      throw err;
    }
  }, []);

  // Créer un emploi
  const createEmploi = useCallback(async (emploiData) => {
    setIsLoading(true);
    try {
      const newEmploi = await emploiService.createEmploi(emploiData);
      // Recharger la liste et les stats
      await Promise.all([fetchEmplois(), fetchStats()]);
      return newEmploi;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEmplois, fetchStats]);

  // Mettre à jour un emploi
  const updateEmploi = useCallback(async (id, emploiData) => {
    setIsLoading(true);
    try {
      const updatedEmploi = await emploiService.updateEmploi(id, emploiData);
      // Recharger la liste et les stats
      await Promise.all([fetchEmplois(), fetchStats()]);
      return updatedEmploi;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEmplois, fetchStats]);

  // Supprimer un emploi
  const deleteEmploi = useCallback(async (id) => {
    try {
      await emploiService.deleteEmploi(id);
      // Recharger la liste et les stats
      await Promise.all([fetchEmplois(), fetchStats()]);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchEmplois, fetchStats]);

  // Changer le statut
  const updateStatus = useCallback(async (id, status) => {
    try {
      await emploiService.updateStatus(id, status);
      // Recharger la liste
      await fetchEmplois();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    }
  }, [fetchEmplois]);

  // Exporter en CSV
  const exportCSV = useCallback(async () => {
    try {
      const blob = await emploiService.exportToCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offres-emploi-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return true;
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'export');
      throw err;
    }
  }, []);

  // Changer de page
  const changePage = useCallback(async (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    await fetchEmplois({ page: newPage });
  }, [fetchEmplois]);

  return {
    emplois,
    isLoading,
    error,
    stats,
    pagination,
    fetchEmplois,
    fetchStats,
    createEmploi,
    updateEmploi,
    deleteEmploi,
    updateStatus,
    exportCSV,
    changePage
  };
};