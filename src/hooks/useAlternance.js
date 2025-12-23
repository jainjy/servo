import { useState, useCallback } from 'react';
import { alternanceService } from '@/services/alternanceService';

export const useAlternance = () => {
  const [offres, setOffres] = useState([]);
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
    alternance: 0,
    stage: 0,
    candidatures: 0,
    urgent: 0
  });

  // Charger les offres avec filtres
  const fetchOffres = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await alternanceService.getAllOffres({
        ...filters,
        page: filters.page || pagination.page,
        limit: filters.limit || pagination.limit
      });
      
      setOffres(response.alternances);
      setPagination(response.pagination);
      
      return response.alternances;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des offres');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await alternanceService.getStats();
      
      // Calculer alternance/stage basé sur le type
      const alternanceCount = statsData['Alternance (Contrat pro)'] || 0 + (statsData['Alternance (Apprentissage)'] || 0);
      const stageCount = statsData['Stage conventionné'] || 0 + (statsData['Stage de fin d\'études'] || 0);
      
      setStats({
        total: statsData.total || 0,
        alternance: alternanceCount,
        stage: stageCount,
        candidatures: statsData.total_candidatures || 0,
        urgent: statsData.urgent || 0
      });
      
      return statsData;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      throw err;
    }
  }, []);

  // Créer une offre
  const createOffre = useCallback(async (offreData) => {
    setIsLoading(true);
    try {
      const newOffre = await alternanceService.createOffre(offreData);
      // Recharger la liste et les stats
      await Promise.all([fetchOffres(), fetchStats()]);
      return newOffre;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOffres, fetchStats]);

  // Mettre à jour une offre
  const updateOffre = useCallback(async (id, offreData) => {
    setIsLoading(true);
    try {
      const updatedOffre = await alternanceService.updateOffre(id, offreData);
      // Recharger la liste et les stats
      await Promise.all([fetchOffres(), fetchStats()]);
      return updatedOffre;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOffres, fetchStats]);

  // Supprimer une offre
  const deleteOffre = useCallback(async (id) => {
    try {
      await alternanceService.deleteOffre(id);
      // Recharger la liste et les stats
      await Promise.all([fetchOffres(), fetchStats()]);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchOffres, fetchStats]);

  // Changer le statut
  const updateStatus = useCallback(async (id, status) => {
    try {
      await alternanceService.updateStatus(id, status);
      // Recharger la liste
      await fetchOffres();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    }
  }, [fetchOffres]);

  // Exporter en CSV
  const exportCSV = useCallback(async () => {
    try {
      const blob = await alternanceService.exportToCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `offres-alternance-${new Date().toISOString().split('T')[0]}.csv`;
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
    await fetchOffres({ page: newPage });
  }, [fetchOffres]);

  return {
    offres,
    isLoading,
    error,
    stats,
    pagination,
    fetchOffres,
    fetchStats,
    createOffre,
    updateOffre,
    deleteOffre,
    updateStatus,
    exportCSV,
    changePage
  };
};