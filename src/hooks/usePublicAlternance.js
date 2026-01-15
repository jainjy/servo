// hooks/usePublicAlternance.js
import { useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export const usePublicAlternance = () => {
  const [offres, setOffres] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const { isAuthenticated, user } = useAuth();

  // Récupérer les offres d'alternance/stage publiques avec filtres
  const fetchOffres = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters.niveau && filters.niveau !== 'all') params.append('niveau', filters.niveau);
      if (filters.location) params.append('location', filters.location);
      if (filters.ecolePartenaire) params.append('ecolePartenaire', filters.ecolePartenaire);
      if (filters.remoteOnly) params.append('remoteOnly', filters.remoteOnly);
      if (filters.urgentOnly) params.append('urgentOnly', filters.urgentOnly);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      // console.log('📡 Fetch alternances publiques avec params:', Object.fromEntries(params));
      
      const response = await api.get(`/alternance/public?${params.toString()}`);
      
      // console.log('✅ Alternances publiques reçues:', response.data.data?.length || 0);
      
      setOffres(response.data.data || []);
      setPagination(response.data.pagination || {});
      
      return response.data;
    } catch (err) {
      console.error('❌ Erreur fetchOffres:', err);
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
      // console.log('📡 Fetch stats publiques alternance...');
      
      const response = await api.get('/alternance/public/stats');
      
      // console.log('✅ Stats alternance reçues:', response.data.data);
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
  const fetchOffreDetails = useCallback(async (id) => {
    setIsLoading(true);
    try {
      // console.log(`📡 Fetch détails alternance ${id}...`);
      
      const response = await api.get(`/alternance/public/${id}`);
      
      // console.log('✅ Détails alternance reçus:', response.data.data);
      
      return response.data.data;
    } catch (err) {
      console.error('❌ Erreur fetchOffreDetails:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors du chargement des détails';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Postuler à une offre d'alternance/stage
  const applyToAlternance = useCallback(async (offreId, applicationData) => {
    if (!isAuthenticated) {
      throw new Error('Vous devez être connecté pour postuler');
    }

    // Validation des documents
    if (!applicationData.cvUrl) {
      throw new Error('Veuillez fournir votre CV');
    }

    try {
     
      const response = await api.post(`/alternance/public/${offreId}/apply`, applicationData);
      
   
      toast.success(response.data.message || 'Candidature envoyée avec succès !');
      
      return response.data;
    } catch (err) {
      console.error('❌ Erreur applyToAlternance:', err);
      const errorMessage = err.response?.data?.error || 'Erreur lors de la postulation';
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    }
  }, [isAuthenticated]);

  // Récupérer les types disponibles
  const fetchTypes = useCallback(async () => {
    try {
     
      const response = await api.get('/alternance/public/types');
      
      return response.data.data || [];
    } catch (err) {
      console.error('❌ Erreur fetchTypes:', err);
      return [];
    }
  }, []);

  // Récupérer les niveaux disponibles
  const fetchNiveaux = useCallback(async () => {
    try {
     
      const response = await api.get('/alternance/public/niveaux');
      
      return response.data.data || [];
    } catch (err) {
      console.error('❌ Erreur fetchNiveaux:', err);
      return [];
    }
  }, []);

  // Enregistrer une vue
  const trackView = useCallback(async (offreId) => {
    try {
      await api.post(`/alternance/public/${offreId}/view`);
    } catch (err) {
      console.error('❌ Erreur trackView:', err);
    }
  }, []);

  // Uploader un fichier (CV ou lettre de motivation)
  const uploadFile = useCallback(async (file, type = 'cv') => {
    try {
   
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // console.log(`✅ ${type} uploadé:`, response.data.url);
      return response.data;
    } catch (err) {
      console.error(`❌ Erreur upload ${type}:`, err);
      throw new Error(`Erreur lors du téléchargement du ${type}`);
    }
  }, []);

  return {
    offres,
    stats,
    isLoading,
    error,
    pagination,
    fetchOffres,
    fetchStats,
    fetchOffreDetails,
    applyToAlternance,
    fetchTypes,
    fetchNiveaux,
    trackView,
    uploadFile
  };
};