// hooks/useAlternance.js - VERSION CORRIGÉE
import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useAlternance = () => {
  const { user, isAuthenticated, getAuthHeaders } = useAuth();
  const [offres, setOffres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    alternance: 0,
    stage: 0,
    candidatures: 0,
    urgent: 0,
    active: 0,
    draft: 0,
    archived: 0,
    filled: 0,
    total_vues: 0,
    total_candidatures: 0,
    parType: {}
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    pages: 1,
    total: 0
  });

  // État pour suivre si les données ont été chargées
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Référence pour éviter les appels en double
  const fetchRef = useRef({ pending: false });

  // Récupérer le token depuis AuthService
  const getToken = useCallback(() => {
    const authHeaders = getAuthHeaders();
    const authHeader = authHeaders.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7); // Enlever "Bearer "
    }
    return null;
  }, [getAuthHeaders]);

  // Fonction utilitaire pour vérifier l'authentification
  const isAuthReady = useCallback(() => {
    const token = getToken();
    const ready = isAuthenticated && token && user?.id;
    
    return ready;
  }, [isAuthenticated, user, getToken]);

  // 🔥 Configuration axios avec les headers d'authentification
  const getAxiosConfig = useCallback((config = {}) => {
    try {
      const authHeaders = getAuthHeaders();
      const token = getToken();
      
      
      
      return {
        baseURL: 'http://localhost:3001',
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...config.headers
        },
        withCredentials: true,
        ...config
      };
    } catch (error) {
      console.error('❌ Error getting axios config:', error);
      throw new Error('Erreur d\'authentification');
    }
  }, [getAuthHeaders, getToken, user]);

  // Effet pour charger les données quand l'authentification change
  useEffect(() => {
    const loadDataIfAuthenticated = async () => {
      const token = getToken();
     

      if (isAuthReady() && !hasLoaded && !fetchRef.current.pending) {
        // console.log('🚀 Loading alternance data on auth change');
        try {
          await Promise.all([
            fetchOffres(),
            fetchStats()
          ]);
          setHasLoaded(true);
        } catch (error) {
          console.error('Failed to load alternance data:', error);
        }
      }
    };

    loadDataIfAuthenticated();
  }, [isAuthenticated, user, getToken]);

  const fetchOffres = useCallback(async (params = {}) => {
    // Éviter les appels en double
    if (fetchRef.current.pending) {
      // console.log('⏳ Fetch déjà en cours, annulation...');
      return;
    }

    // Vérifier l'authentification
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
     
      return;
    }

    fetchRef.current.pending = true;
    setIsLoading(true);
    setError(null);
    
    try {
      
      const config = getAxiosConfig({
        params: {
          search: params.search || '',
          status: params.status || 'all',
          type: params.type || 'all',
          niveau: params.niveau || 'all',
          page: params.page || 1,
          limit: params.limit || 10
        }
      });

      const response = await axios.get('/api/pro/alternance', config);

    

      if (response.data.success) {
        setOffres(response.data.alternances || []);
        
        // S'assurer que la pagination a les bonnes valeurs
        const paginationData = response.data.pagination || {
          page: 1,
          limit: 10,
          pages: 1,
          total: 0
        };
        
        setPagination({
          page: Number(paginationData.page) || 1,
          limit: Number(paginationData.limit) || 10,
          pages: Number(paginationData.pages) || 1,
          total: Number(paginationData.total) || 0
        });
        
        setHasLoaded(true);
      } else {
        throw new Error(response.data.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('❌ Error fetching alternances:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      
      let errorMsg = err.response?.data?.message || err.message || 'Erreur lors du chargement des offres';
      
      if (err.response?.status === 401) {
        errorMsg = 'Session expirée. Veuillez vous reconnecter.';
        setError(errorMsg);
        toast.error(errorMsg);
        window.dispatchEvent(new Event('auth-change'));
      } else if (err.response?.status === 403) {
        errorMsg = 'Accès non autorisé pour cette ressource';
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (err.response?.status === 404) {
        errorMsg = 'Aucune offre trouvée';
        setError(errorMsg);
      } else {
        setError(errorMsg);
        toast.error(errorMsg);
      }
      
      setOffres([]);
      setPagination({
        page: 1,
        limit: 10,
        pages: 1,
        total: 0
      });
    } finally {
      setIsLoading(false);
      fetchRef.current.pending = false;
    }
  }, [isAuthenticated, user, getToken, getAxiosConfig]);

  const fetchStats = useCallback(async () => {
    // Vérifier l'authentification
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
      console.log('⏳ Authentification non prête pour stats...', {
        isAuthenticated,
        hasToken: !!token,
        userId: user?.id
      });
      return;
    }

    try {
      console.log('📊 Fetching stats...');
      
      const config = getAxiosConfig();
      const response = await axios.get('/api/pro/alternance/stats/summary', config);
      
      console.log('✅ Stats response:', response.data);

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        
        // Calculer les totaux pour alternance et stage
        const alternanceCount = (data['Alternance (Contrat pro)'] || 0) + 
                               (data['Alternance (Apprentissage)'] || 0);
        const stageCount = (data['Stage conventionné'] || 0) + 
                          (data['Stage de fin d\'études'] || 0);
        
        // Mettre à jour les stats
        setStats({
          total: data.total || 0,
          alternance: alternanceCount,
          stage: stageCount,
          candidatures: data.total_candidatures || 0,
          urgent: data.urgent || 0,
          active: data.active || 0,
          draft: data.draft || 0,
          archived: data.archived || 0,
          filled: data.filled || 0,
          total_vues: data.total_vues || 0,
          total_candidatures: data.total_candidatures || 0,
          parType: {
            'Alternance (Contrat pro)': data['Alternance (Contrat pro)'] || 0,
            'Alternance (Apprentissage)': data['Alternance (Apprentissage)'] || 0,
            'Stage conventionné': data['Stage conventionné'] || 0,
            'Stage de fin d\'études': data['Stage de fin d\'études'] || 0
          }
        });
      }
    } catch (err) {
      console.error('❌ Error fetching alternance stats:', err);
    }
  }, [isAuthenticated, user, getToken, getAxiosConfig]);

  const createOffre = async (data) => {
    // Vérifier l'authentification
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
      console.error('❌ createOffre: Not authenticated', {
        isAuthenticated,
        hasToken: !!token,
        userId: user?.id
      });
      toast.error('Veuillez vous connecter pour créer une offre');
      throw new Error('Non authentifié');
    }

    setIsLoading(true);
    try {
      console.log('📝 Creating alternance with data:', data);
      console.log('🔐 Auth state:', { 
        user: user?.id, 
        token: token ? `${token.substring(0, 20)}...` : 'No token' 
      });
      
      const config = getAxiosConfig();
      
      // Préparer les données pour l'API
      const apiData = {
        ...data,
        dateDebut: data.dateDebut ? new Date(data.dateDebut).toISOString() : null,
        dateFin: data.dateFin ? new Date(data.dateFin).toISOString() : null
      };
      
      console.log('📤 Sending API data:', apiData);
      
      const response = await axios.post('/api/pro/alternance', apiData, config);
      
      console.log('✅ Create response:', response.data);

      if (response.data.success) {
        toast.success('Offre créée avec succès');
        // Rafraîchir les données
        await Promise.all([
          fetchOffres(),
          fetchStats()
        ]);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('❌ Error creating alternance:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la création';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOffre = async (id, data) => {
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
      toast.error('Veuillez vous connecter pour modifier une offre');
      throw new Error('Non authentifié');
    }

    setIsLoading(true);
    try {
      console.log(`✏️ Updating alternance ${id}`);
      
      const config = getAxiosConfig();
      const response = await axios.put(`/api/pro/alternance/${id}`, data, config);
      
      if (response.data.success) {
        toast.success('Offre mise à jour avec succès');
        await Promise.all([
          fetchOffres(),
          fetchStats()
        ]);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('❌ Error updating alternance:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOffre = async (id) => {
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
      toast.error('Veuillez vous connecter pour supprimer une offre');
      throw new Error('Non authentifié');
    }

    try {
      console.log(`🗑️ Deleting alternance ${id}`);
      
      const config = getAxiosConfig();
      const response = await axios.delete(`/api/pro/alternance/${id}`, config);
      
      if (response.data.success) {
        toast.success('Offre supprimée avec succès');
        await Promise.all([
          fetchOffres(),
          fetchStats()
        ]);
      } else {
        throw new Error(response.data.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('❌ Error deleting alternance:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la suppression';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateStatus = async (id, status) => {
    const token = getToken();
    if (!isAuthenticated || !token || !user?.id) {
      toast.error('Veuillez vous connecter pour modifier le statut');
      throw new Error('Non authentifié');
    }

    try {
      console.log(`🔄 Updating status ${id} to ${status}`);
      
      const config = getAxiosConfig();
      const response = await axios.patch(`/api/pro/alternance/${id}/status`, { status }, config);
      
      if (response.data.success) {
        toast.success('Statut mis à jour');
        setOffres(prev => prev.map(offre => 
          offre.id === parseInt(id) ? { ...offre, status } : offre
        ));
        await fetchStats();
        return response.data;
      } else {
        throw new Error(response.data.error || 'Erreur serveur');
      }
    } catch (err) {
      console.error('❌ Error updating alternance status:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

// ✅ Fonction exportCSV corrigée
  const exportCSV = async () => {
    console.log('📥 Exporting CSV');
    
    try {
      setIsLoading(true); // <-- Utilise setIsLoading au lieu de setLoading
      
      // Log des infos d'authentification
      const config = await getAxiosConfig();
      console.log('🔄 Axios config for export:', {
        hasAuthHeaders: config.headers && config.headers.Authorization,
        tokenLength: config.headers?.Authorization?.length || 0
      });
      
      // Utiliser fetch pour télécharger le fichier
      const response = await fetch('/api/pro/alternance/export/csv', {
        method: 'GET',
        headers: {
          'Authorization': config.headers.Authorization,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
      }
      
      // Récupérer le blob
      const blob = await response.blob();
      
      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien pour le téléchargement
      const a = document.createElement('a');
      a.href = url;
      a.download = `offres-alternance-${new Date().toISOString().split('T')[0]}.csv`;
      
      // Déclencher le téléchargement
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('✅ CSV exporté avec succès');
      toast.success('CSV exporté avec succès');
      
    } catch (error) {
      console.error('❌ Error exporting CSV:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = 'Erreur lors de l\'export CSV';
      
      if (error.message.includes('401')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur lors de l\'export. Veuillez réessayer.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Erreur réseau. Vérifiez votre connexion.';
      }
      
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false); // <-- Utilise setIsLoading ici aussi
    }
  };


  const changePage = async (page) => {
    const token = getToken();
    if (isAuthenticated && token && user?.id) {
      await fetchOffres({ page });
    }
  };

  // Fonction pour vérifier l'état d'authentification
  const checkAuthStatus = () => {
    const token = getToken();
    return {
      isAuthenticated,
      hasToken: !!token,
      userId: user?.id,
      isReady: isAuthenticated && !!token && !!user?.id
    };
  };

  return {
    // Données
    offres,
    isLoading,
    error,
    stats,
    pagination,
    hasLoaded,
    
    // Authentification
    isAuthenticated,
    user,
    
    // Méthodes
    fetchOffres,
    fetchStats,
    createOffre,
    updateOffre,
    deleteOffre,
    updateStatus,
    exportCSV,
    changePage,
    checkAuthStatus,
    refreshData: fetchOffres
  };
};