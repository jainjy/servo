import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const useFormation = () => {
  const [formations, setFormations] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeaders = () => {
    // 🔧 CORRECTION DÉFINITIVE: Utilise la clé "auth-token" (celle utilisée par AuthService)
    const token = localStorage.getItem('auth-token');
    
    // Debug
    console.log('🔑 useFormation - Token récupéré (auth-token):', token ? '✓ Présent' : '✗ Absent');
    console.log('👤 useFormation - User ID extrait:', token ? token.replace('real-jwt-token-', '') : 'Aucun');
    
    if (!token) {
      console.error('❌ useFormation - ERREUR: Pas de token trouvé avec la clé "auth-token"');
      console.error('   Keys disponibles:', Object.keys(localStorage));
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
    
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  const handleApiError = (error) => {
    console.error('❌ useFormation - Erreur API:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        // Nettoie toutes les clés d'authentification
        ['auth-token', 'user-data', 'token', 'user'].forEach(key => {
          localStorage.removeItem(key);
        });
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      
      if (status === 403) {
        throw new Error('Accès réservé aux professionnels');
      }
      
      throw new Error(data?.error || data?.message || `Erreur ${status}`);
    }
    
    if (error.request) {
      throw new Error('Impossible de joindre le serveur');
    }
    
    throw new Error(error.message || 'Une erreur est survenue');
  };

  // Récupérer les formations avec filtres
  const fetchFormations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.category && params.category !== 'all') queryParams.append('category', params.category);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit || 10);
      
      console.log('📡 useFormation - Fetch formations avec params:', Object.fromEntries(queryParams));
      
      const response = await axios.get(
        `${API_URL}/pro/formations?${queryParams.toString()}`,
        getAuthHeaders()
      );
      
      console.log('✅ useFormation - Réponse reçue,', response.data.data?.length || 0, 'formations');
      setFormations(response.data.data || []);
      setPagination(response.data.pagination || {});
      
      return response.data;
    } catch (error) {
      console.error('❌ useFormation - Erreur fetchFormations:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Récupérer les statistiques
  const fetchStats = useCallback(async () => {
    try {
      console.log('📡 useFormation - Fetch stats...');
      
      const response = await axios.get(
        `${API_URL}/pro/formations/stats`,
        getAuthHeaders()
      );
      
      console.log('✅ useFormation - Stats reçues:', response.data.data);
      setStats(response.data.data || {});
      
      return response.data;
    } catch (error) {
      console.error('❌ useFormation - Erreur fetchStats:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    }
  }, []);


  // Créer une formation
  const createFormation = async (formationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders();
      console.log('📡 Envoi requête POST /pro/formations:', formationData);
      
      const response = await axios.post(
        `${API_URL}/pro/formations`,
        formationData,
        headers
      );
      
      console.log('✅ Formation créée:', response.data);
      
      // Rafraîchir la liste
      await fetchFormations();
      await fetchStats();
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur createFormation:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une formation
  const updateFormation = async (id, formationData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const headers = getAuthHeaders();
      console.log(`📡 Envoi requête PUT /pro/formations/${id}:`, formationData);
      
      const response = await axios.put(
        `${API_URL}/pro/formations/${id}`,
        formationData,
        headers
      );
      
      console.log('✅ Formation mise à jour:', response.data);
      
      // Mettre à jour la liste localement
      setFormations(prev => 
        prev.map(formation => 
          formation.id === id ? { ...formation, ...formationData } : formation
        )
      );
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateFormation:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut
  const updateStatus = async (id, status) => {
    try {
      const headers = getAuthHeaders();
      console.log(`📡 Envoi requête PATCH /pro/formations/${id}/status:`, { status });
      
      const response = await axios.patch(
        `${API_URL}/pro/formations/${id}/status`,
        { status },
        headers
      );
      
      console.log('✅ Statut mis à jour:', response.data);
      
      // Mettre à jour localement
      setFormations(prev => 
        prev.map(formation => 
          formation.id === id ? { ...formation, status } : formation
        )
      );
      
      // Rafraîchir les stats
      await fetchStats();
      
      return response.data;
    } catch (error) {
      console.error('❌ Erreur updateStatus:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    }
  };

  // Supprimer une formation
  const deleteFormation = async (id) => {
    try {
      const headers = getAuthHeaders();
      console.log(`📡 Envoi requête DELETE /pro/formations/${id}`);
      
      await axios.delete(
        `${API_URL}/pro/formations/${id}`,
        headers
      );
      
      console.log('✅ Formation supprimée:', id);
      
      // Mettre à jour localement
      setFormations(prev => prev.filter(formation => formation.id !== id));
      
      // Rafraîchir les stats
      await fetchStats();
      
      return true;
    } catch (error) {
      console.error('❌ Erreur deleteFormation:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    }
  };

  // Exporter en CSV
  const exportCSV = async () => {
    try {
      const headers = getAuthHeaders();
      console.log('📡 Envoi requête GET /pro/formations/export/csv');
      
      const response = await axios.get(
        `${API_URL}/pro/formations/export/csv`,
        {
          ...headers,
          responseType: 'blob'
        }
      );
      
      console.log('✅ CSV reçu, taille:', response.data.size, 'bytes');
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `formations_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Libérer l'URL après téléchargement
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur exportCSV:', error);
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw errorMessage;
    }
  };

  // Changer de page
  const changePage = async (page) => {
    await fetchFormations({ page });
  };

  const fetchFormationCandidatures = async (formationId) => {
  try {
    const response = await axios.get(`${API_URL}/candidatures/formations/${formationId}`, {
      headers: getAuthHeaders()
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur récupération candidatures:', error);
    throw error;
  }
};

  return {
    formations,
    stats,
    pagination,
    isLoading,
    error,
    fetchFormations,
    fetchStats,
    createFormation,
    updateFormation,
    updateStatus,
    deleteFormation,
    exportCSV,
    changePage,
    fetchFormationCandidatures
  };
};