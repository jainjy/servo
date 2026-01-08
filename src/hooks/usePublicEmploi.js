// hooks/usePublicEmploi.js
import { useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const usePublicEmploi = () => {
  const [emplois, setEmplois] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const { isAuthenticated, user } = useAuth();

  // Récupérer les offres d'emploi publiques avec filtres
  const fetchEmplois = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.secteur && filters.secteur !== 'all') params.append('secteur', filters.secteur);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.experience && filters.experience !== 'all') params.append('experience', filters.experience);
      if (filters.location) params.append('location', filters.location);
      if (filters.remoteOnly) params.append('remoteOnly', filters.remoteOnly);
      if (filters.urgentOnly) params.append('urgentOnly', filters.urgentOnly);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
   
      const response = await api.get(`/emploi/public?${params.toString()}`);
      
  
      setEmplois(response.data.data || []);
      setPagination(response.data.pagination || {});
      
      return response.data;
    } catch (err) {
      console.error('❌ Erreur fetchEmplois:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors du chargement des offres';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques publiques
  const fetchStats = useCallback(async () => {
    try {
      console.log('📡 Fetch stats publiques emploi...');
      
      const response = await api.get('/emploi/public/stats');
      
      console.log('✅ Stats emploi reçues:', response.data.data);
      setStats(response.data.data || {});
      
      return response.data;
    } catch (err) {
      console.error('❌ Erreur fetchStats:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors du chargement des statistiques';
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);

  // Récupérer les détails d'une offre
  const fetchEmploiDetails = useCallback(async (id) => {
    setIsLoading(true);
    try {
      console.log(`📡 Fetch détails emploi ${id}...`);
      
      const response = await api.get(`/emploi/public/${id}`);
      
      console.log('✅ Détails emploi reçus:', response.data.data);
      
      return response.data.data;
    } catch (err) {
      console.error('❌ Erreur fetchEmploiDetails:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors du chargement des détails';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Postuler à une offre d'emploi
  const applyToEmploi = useCallback(async (emploiId, applicationData) => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour postuler');
    }

    try {
      console.log(`📡 Postulation à emploi ${emploiId}:`, applicationData);
      
      const response = await api.post(`/emploi/public/${emploiId}/apply`, applicationData);
      
      console.log('✅ Postulation réussie:', response.data);
      
      toast.success(response.data.message || 'Candidature envoyée avec succès !');
      
      return response.data;
    } catch (err) {
      console.error('❌ Erreur applyToEmploi:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors de la postulation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    }
  }, [isAuthenticated]);

  // Récupérer les secteurs disponibles
  const fetchSecteurs = useCallback(async () => {
    try {
      console.log('📡 Fetch secteurs...');
      
      const response = await api.get('/emploi/public/secteurs');
      
      return response.data.data || [];
    } catch (err) {
      console.error('❌ Erreur fetchSecteurs:', err);
      return [];
    }
  }, []);

  // Récupérer les types de contrat disponibles
  const fetchTypesContrat = useCallback(async () => {
    try {
      console.log('📡 Fetch types contrat...');
      
      const response = await api.get('/emploi/public/types-contrat');
      
      return response.data.data || [];
    } catch (err) {
      console.error('❌ Erreur fetchTypesContrat:', err);
      return [];
    }
  }, []);

  // Enregistrer une vue
  const trackView = useCallback(async (emploiId) => {
    try {
      await api.post(`/emploi/public/${emploiId}/view`);
    } catch (err) {
      console.error('❌ Erreur trackView:', err);
      // Ne pas afficher d'erreur à l'utilisateur pour les vues
    }
  }, []);

  return {
    emplois,
    stats,
    isLoading,
    error,
    pagination,
    fetchEmplois,
    fetchStats,
    fetchEmploiDetails,
    applyToEmploi,
    fetchSecteurs,
    fetchTypesContrat,
    trackView
  };
};