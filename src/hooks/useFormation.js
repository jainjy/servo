import { useState, useCallback } from 'react';
import { formationService } from '@/services/formationService';

export const useFormation = () => {
  const [formations, setFormations] = useState([]);
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
    applications: 0,
    participants: 0,
    total_views: 0
  });

  // Charger les formations avec filtres
  const fetchFormations = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await formationService.getAllFormations({
        ...filters,
        page: filters.page || pagination.page,
        limit: filters.limit || pagination.limit
      });
      
      setFormations(response.formations);
      setPagination(response.pagination);
      
      return response.formations;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des formations');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const statsData = await formationService.getStats();
      
      setStats({
        total: statsData.total || 0,
        active: statsData.active || 0,
        applications: statsData.total_applications || 0,
        participants: statsData.total_participants || 0,
        total_views: statsData.total_views || 0
      });
      
      return statsData;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      throw err;
    }
  }, []);

  // Créer une formation
  const createFormation = useCallback(async (formationData) => {
    setIsLoading(true);
    try {
      const newFormation = await formationService.createFormation(formationData);
      // Recharger la liste et les stats
      await Promise.all([fetchFormations(), fetchStats()]);
      return newFormation;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFormations, fetchStats]);

  // Mettre à jour une formation
  const updateFormation = useCallback(async (id, formationData) => {
    setIsLoading(true);
    try {
      const updatedFormation = await formationService.updateFormation(id, formationData);
      // Recharger la liste et les stats
      await Promise.all([fetchFormations(), fetchStats()]);
      return updatedFormation;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchFormations, fetchStats]);

  // Supprimer une formation
  const deleteFormation = useCallback(async (id) => {
    try {
      await formationService.deleteFormation(id);
      // Recharger la liste et les stats
      await Promise.all([fetchFormations(), fetchStats()]);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    }
  }, [fetchFormations, fetchStats]);

  // Changer le statut
  const updateStatus = useCallback(async (id, status) => {
    try {
      await formationService.updateStatus(id, status);
      // Recharger la liste
      await fetchFormations();
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    }
  }, [fetchFormations]);

  // Exporter en CSV
  const exportCSV = useCallback(async () => {
    try {
      const blob = await formationService.exportToCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formations-${new Date().toISOString().split('T')[0]}.csv`;
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
    await fetchFormations({ page: newPage });
  }, [fetchFormations]);

  return {
    formations,
    isLoading,
    error,
    stats,
    pagination,
    fetchFormations,
    fetchStats,
    createFormation,
    updateFormation,
    deleteFormation,
    updateStatus,
    exportCSV,
    changePage
  };
};