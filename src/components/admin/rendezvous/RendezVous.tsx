"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, Calendar, Clock, User, CheckCircle, 
  AlertCircle, XCircle, ChevronRight, Eye, Trash2, Phone,
  Download, RefreshCw, X
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSocket } from '@/contexts/SocketContext';

type RendezVousEtat = 'nouveau' | 'confirme' | 'annule';

interface RendezVousEntreprise {
  id: string;
  nomComplet: string;
  email: string;
  telephone: string;
  projetDetails?: string;
  dateChoisie: string;
  heureChoisie: string;
  etat: RendezVousEtat;
  creeLe: string;
  userId?: string;
  User?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
}

const RendezVous = () => {
  const [rendezVous, setRendezVous] = useState<RendezVousEntreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEtat, setFilterEtat] = useState<RendezVousEtat | 'TOUS'>('TOUS');
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    confirme: 0,
    annule: 0
  });
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVousEntreprise | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { socket } = useSocket();

  // Couleurs selon le thème fourni
  const themeColors = {
    logo: "#556B2F",
    primary: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

  // Fonction pour charger les rendez-vous
  const fetchRendezVous = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/rendez-vous-entreprise', {
        params: {
          etat: filterEtat !== 'TOUS' ? filterEtat : undefined,
          search: searchTerm || undefined,
          page: 1,
          limit: 100
        }
      });

      if (response.data?.success) {
        const data = response.data.data || [];
        const formattedData = data.map((item: any) => ({
          id: item.id,
          nomComplet: item.nomComplet || '',
          email: item.email || '',
          telephone: item.telephone || '',
          projetDetails: item.projetDetails,
          dateChoisie: item.dateChoisie,
          heureChoisie: item.heureChoisie,
          etat: item.etat || 'nouveau',
          creeLe: item.creeLe || new Date().toISOString(),
          userId: item.userId,
          User: item.User
        }));
        
        setRendezVous(formattedData);
        console.debug('[RendezVous] fetched', formattedData.length, 'items');
      } else {
        toast.error('Erreur lors du chargement des rendez-vous');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors du chargement des rendez-vous');
    } finally {
      setLoading(false);
    }
  }, [filterEtat, searchTerm]);

  useEffect(() => {
    fetchRendezVous();
  }, [fetchRendezVous]);

  useEffect(() => {
    calculateLocalStats();
  }, [rendezVous]);

  const calculateLocalStats = () => {
    const total = rendezVous.length;
    const nouveau = rendezVous.filter(r => r.etat === 'nouveau').length;
    const confirme = rendezVous.filter(r => r.etat === 'confirme').length;
    const annule = rendezVous.filter(r => r.etat === 'annule').length;
    
    setStats({ total, nouveau, confirme, annule });
  };

  const filteredRendezVous = useMemo(() => {
    return rendezVous.filter(rdv => {
      if (!rdv) return false;

      const matchesSearch = searchTerm ?
        (rdv.nomComplet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         rdv.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         rdv.telephone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (rdv.projetDetails || '').toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      const matchesFilter = filterEtat === 'TOUS' || rdv.etat === filterEtat;

      return matchesSearch && matchesFilter;
    });
  }, [rendezVous, searchTerm, filterEtat]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getEtatColor = (etat: RendezVousEtat) => {
    switch(etat) {
      case 'nouveau': 
        return `bg-yellow-50 text-yellow-800 border-yellow-200`;
      case 'confirme': 
        return `bg-green-50 text-green-800 border-green-200`;
      case 'annule': 
        return `bg-red-50 text-red-800 border-red-200`;
      default: 
        return `bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  const getEtatIcon = (etat: RendezVousEtat) => {
    switch(etat) {
      case 'nouveau': return <AlertCircle className="w-4 h-4" />;
      case 'confirme': return <CheckCircle className="w-4 h-4" />;
      case 'annule': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getEtatText = (etat: RendezVousEtat) => {
    switch(etat) {
      case 'nouveau': return 'En attente';
      case 'confirme': return 'Confirmé';
      case 'annule': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const confirmerRendezVous = async (id: string) => {
    if (actionLoading[id]) return;
    
    setActionLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await api.put(`/rendez-vous-entreprise/${id}/confirmer`);

      if (response.data?.success) {
        toast.success('Rendez-vous confirmé avec succès');
        // Mettre à jour l'état local
        setRendezVous(prev => prev.map(rdv => 
          rdv.id === id ? { ...rdv, etat: 'confirme' } : rdv
        ));
        
        // Envoyer notification socket si nécessaire
        const rdvItem = rendezVous.find(r => r.id === id);
        if (socket && rdvItem?.userId) {
          socket.emit('rendezvous_confirmed', {
            toUserId: rdvItem.userId,
            rendezvousId: id,
            title: 'Rendez-vous confirmé',
            message: `Votre rendez-vous le ${formatFullDate(rdvItem.dateChoisie)} à ${formatHeure(rdvItem.heureChoisie)} a été confirmé.`,
          });
        }
      } else {
        toast.error(response.data?.message || 'Erreur lors de la confirmation');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setActionLoading(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
    }
  };

  const annulerRendezVous = async (id: string) => {
    if (actionLoading[id]) return;
    
    setActionLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await api.put(`/rendez-vous-entreprise/${id}/annuler`);

      if (response.data?.success) {
        toast.success('Rendez-vous annulé avec succès');
        // Mettre à jour l'état local
        setRendezVous(prev => prev.map(rdv => 
          rdv.id === id ? { ...rdv, etat: 'annule' } : rdv
        ));
        
        // Envoyer notification socket si nécessaire
        const rdvItem = rendezVous.find(r => r.id === id);
        if (socket && rdvItem?.userId) {
          socket.emit('rendezvous_cancelled', {
            toUserId: rdvItem.userId,
            rendezvousId: id,
            title: 'Rendez-vous annulé',
            message: `Votre rendez-vous le ${formatFullDate(rdvItem.dateChoisie)} à ${formatHeure(rdvItem.heureChoisie)} a été annulé.`,
          });
        }
      } else {
        toast.error(response.data?.message || 'Erreur lors de l\'annulation');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'annulation');
    } finally {
      setActionLoading(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
    }
  };

  // Écouter les notifications entrantes via socket et afficher un toast
  useEffect(() => {
    if (!socket) return;
    const handler = (payload: any) => {
      try {
        const text = payload?.message || payload?.title || 'Nouvelle notification';
        toast(text);
      } catch (e) {
        console.warn('Erreur handler notification', e);
      }
    };

    socket.on('new_notification', handler);
    return () => {
      socket.off('new_notification', handler);
    };
  }, [socket]);

  const deleteRendezVous = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce rendez-vous ?')) return;
    if (actionLoading[id]) return;
    
    setActionLoading(prev => ({ ...prev, [id]: true }));
    const previous = rendezVous;
    
    // Optimistic remove
    setRendezVous(prev => prev.filter(rdv => rdv.id !== id));

    try {
      const response = await api.delete(`/rendez-vous-entreprise/${id}`);

      if (response.data?.success) {
        toast.success('Rendez-vous supprimé avec succès');
        // Recharger les données
        fetchRendezVous();
      } else {
        setRendezVous(previous);
        toast.error(response.data?.message || 'Erreur lors de la suppression');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setRendezVous(previous);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
    }
  };

  const viewDetails = (rdv: RendezVousEntreprise) => {
    setSelectedRendezVous(rdv);
    setShowDetailsModal(true);
  };

  const exporterRendezVous = () => {
    try {
      const csvContent = [
        ['Nom Complet', 'Email', 'Téléphone', 'Date', 'Heure', 'État', 'Créé le', 'Détails Projet'],
        ...rendezVous.map(rdv => [
          rdv.nomComplet,
          rdv.email,
          rdv.telephone,
          rdv.dateChoisie,
          rdv.heureChoisie,
          getEtatText(rdv.etat),
          new Date(rdv.creeLe).toLocaleDateString('fr-FR'),
          rdv.projetDetails || ''
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `rendez-vous-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Export CSV réussi');
    } catch (error) {
      console.error('Erreur export:', error);
      toast.error('Erreur lors de l\'export');
    }
  };

  const getRendezVousStatusInfo = (rdv: RendezVousEntreprise) => {
    const now = new Date();
    let rdvDate;
    
    try {
      rdvDate = new Date(`${rdv.dateChoisie}T${rdv.heureChoisie}`);
    } catch {
      return { text: getEtatText(rdv.etat), color: 'text-gray-600', bg: 'bg-gray-100' };
    }
    
    if (rdv.etat === 'annule') {
      return { text: 'Annulé', color: 'text-red-600', bg: 'bg-red-50' };
    }
    
    if (rdv.etat === 'confirme') {
      if (rdvDate < now) {
        return { text: 'Terminé', color: 'text-gray-600', bg: 'bg-gray-100' };
      }
      return { text: 'Confirmé', color: 'text-green-600', bg: 'bg-green-50' };
    }
    
    if (rdv.etat === 'nouveau') {
      if (rdvDate < now) {
        return { text: 'En retard', color: 'text-orange-600', bg: 'bg-orange-50' };
      }
      return { text: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    }
    
    return { text: 'Inconnu', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const prochainsRendezVous = useMemo(() => {
    return rendezVous
      .filter(rdv => {
        if (rdv.etat === 'annule') return false;
        try {
          const rdvDate = new Date(`${rdv.dateChoisie}T${rdv.heureChoisie}`);
          return rdvDate > new Date();
        } catch {
          return false;
        }
      })
      .sort((a, b) => {
        try {
          const dateA = new Date(`${a.dateChoisie}T${a.heureChoisie}`);
          const dateB = new Date(`${b.dateChoisie}T${b.heureChoisie}`);
          return dateA.getTime() - dateB.getTime();
        } catch {
          return 0;
        }
      })
      .slice(0, 5);
  }, [rendezVous]);

  // Fonction pour formater l'heure
  const formatHeure = (heure: string) => {
    try {
      const [hours, minutes] = heure.split(':');
      return `${hours}h${minutes}`;
    } catch {
      return heure;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Rendez-vous Entreprise</h1>
              <p className="text-gray-600 mt-1">Gestion des rendez-vous pour création/reprise d'entreprise</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exporterRendezVous}
                style={{ backgroundColor: themeColors.primary }}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter CSV
              </button>
              <button
                type="button"
                onClick={fetchRendezVous}
                style={{ 
                  borderColor: themeColors.primary,
                  color: themeColors.primary
                }}
                className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.nouveau}</p>
              </div>
              <div className="bg-yellow-50 p-2 md:p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Confirmés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.confirme}</p>
              </div>
              <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Annulés</p>
                <p className="text-2xl font-bold text-gray-900">{stats.annule}</p>
              </div>
              <div className="bg-red-50 p-2 md:p-3 rounded-lg">
                <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, téléphone..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRendezVous()}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium hidden md:inline">État:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    style={{ 
                      backgroundColor: filterEtat === 'TOUS' ? themeColors.primary : '#f9fafb',
                      borderColor: filterEtat === 'TOUS' ? themeColors.primary : '#e5e7eb',
                      color: filterEtat === 'TOUS' ? 'white' : '#374151'
                    }}
                    className={`px-3 py-2 rounded-lg border text-sm`}
                    onClick={() => setFilterEtat('TOUS')}
                  >
                    Tous
                  </button>
                  <button 
                    type="button"
                    className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1 ${filterEtat === 'nouveau' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => setFilterEtat('nouveau')}
                  >
                    <AlertCircle className="w-3 h-3" />
                    En attente
                  </button>
                  <button 
                    type="button"
                    className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1 ${filterEtat === 'confirme' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => setFilterEtat('confirme')}
                  >
                    <CheckCircle className="w-3 h-3" />
                    Confirmés
                  </button>
                  <button 
                    type="button"
                    className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1 ${filterEtat === 'annule' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                    onClick={() => setFilterEtat('annule')}
                  >
                    <XCircle className="w-3 h-3" />
                    Annulés
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des rendez-vous */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tous les rendez-vous</h2>
                  <p className="text-sm text-gray-600">{filteredRendezVous.length} rendez-vous trouvés</p>
                </div>
                <div className="text-sm text-gray-500">
                  {loading && 'Chargement...'}
                </div>
              </div>
              
              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B8E23]"></div>
                  <p className="mt-2 text-gray-600">Chargement des rendez-vous...</p>
                </div>
              ) : filteredRendezVous.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="mt-2 text-gray-600">Aucun rendez-vous trouvé</p>
                  <button 
                    onClick={fetchRendezVous}
                    style={{ backgroundColor: themeColors.primary }}
                    className="mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Rafraîchir
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRendezVous.map((rdv) => {
                    const statusInfo = getRendezVousStatusInfo(rdv);
                    const isPast = new Date(`${rdv.dateChoisie}T${rdv.heureChoisie}`) < new Date();
                    
                    return (
                      <div key={rdv.id} className={`p-4 md:p-6 hover:bg-gray-50 transition-colors ${isPast && rdv.etat === 'nouveau' ? 'bg-orange-50' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-gray-900">{rdv.nomComplet}</h3>
                                  {isPast && rdv.etat === 'nouveau' && (
                                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                                      En retard
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">{rdv.email}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{formatFullDate(rdv.dateChoisie)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{formatHeure(rdv.heureChoisie)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{rdv.nomComplet}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{rdv.telephone}</span>
                              </div>
                            </div>
                            
                            {rdv.projetDetails && (
                              <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">Détails du projet :</p>
                                <p className="text-sm bg-gray-50 p-3 rounded-lg line-clamp-2">{rdv.projetDetails}</p>
                              </div>
                            )}
                            
                            <div className="text-sm text-gray-500 mb-3">
                              Créé le {formatDate(rdv.creeLe)}
                            </div>
                            
                            {/* Actions en bas de la carte */}
                            <div className="mt-3 flex flex-wrap gap-2">
                              {/* Bouton Confirmer pour les rendez-vous en attente */}
                              {rdv.etat === 'nouveau' && (
                                <button
                                  type="button"
                                  onClick={() => confirmerRendezVous(rdv.id)}
                                  disabled={actionLoading[rdv.id]}
                                  style={{ backgroundColor: themeColors.primary }}
                                  className="px-4 py-2 text-sm rounded-md font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {actionLoading[rdv.id] ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <CheckCircle className="w-4 h-4" />
                                  )}
                                  Confirmer
                                </button>
                              )}

                              {/* Bouton Annuler pour les rendez-vous en attente ou déjà confirmés */}
                              {(rdv.etat === 'nouveau' || rdv.etat === 'confirme') && (
                                <button
                                  type="button"
                                  onClick={() => annulerRendezVous(rdv.id)}
                                  disabled={actionLoading[rdv.id]}
                                  className="px-4 py-2 text-sm rounded-md font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                  {actionLoading[rdv.id] ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <XCircle className="w-4 h-4" />
                                  )}
                                  Annuler
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => viewDetails(rdv)}
                                style={{ 
                                  borderColor: themeColors.primary,
                                  color: themeColors.primary
                                }}
                                className="px-4 py-2 text-sm rounded-md font-medium bg-white border hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Détails
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteRendezVous(rdv.id)}
                                disabled={actionLoading[rdv.id]}
                                className="px-4 py-2 text-sm rounded-md font-medium bg-white text-red-700 hover:bg-red-50 border border-red-100 transition-colors flex items-center gap-2"
                              >
                                {actionLoading[rdv.id] ? (
                                  <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Prochains rendez-vous */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
                <p className="text-sm text-gray-600 mt-1">À venir</p>
              </div>
              
              <div className="p-4 md:p-6">
                {prochainsRendezVous.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto" />
                    <p className="mt-2 text-gray-600">Aucun rendez-vous à venir</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prochainsRendezVous.map((rdv) => {
                      const statusInfo = getRendezVousStatusInfo(rdv);
                      return (
                        <div key={rdv.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">{rdv.nomComplet}</h4>
                              <p className="text-sm text-gray-500 truncate">{rdv.email}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                              {statusInfo.text}
                            </span>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(rdv.dateChoisie)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-3 h-3" />
                              <span>{formatHeure(rdv.heureChoisie)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{rdv.telephone}</span>
                            </div>
                          </div>
                          
                          <button 
                            type="button"
                            onClick={() => viewDetails(rdv)}
                            style={{ 
                              borderColor: themeColors.primary,
                              color: themeColors.primary
                            }}
                            className="w-full flex items-center justify-center gap-2 py-2 border rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            Voir les détails
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal détails */}
      {showDetailsModal && selectedRendezVous && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4" style={{ backgroundColor: themeColors.logo }}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white text-xl font-bold">Détails du rendez-vous</h2>
                  <p className="text-white/80 text-sm mt-1">
                    ID: {selectedRendezVous.id}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Informations client</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="text-sm font-medium">{selectedRendezVous.nomComplet}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium">{selectedRendezVous.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="text-sm font-medium">{selectedRendezVous.telephone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">État</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEtatColor(selectedRendezVous.etat)}`}>
                        {getEtatText(selectedRendezVous.etat)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Détails du rendez-vous</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date choisie</p>
                      <p className="text-sm font-medium">{formatFullDate(selectedRendezVous.dateChoisie)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Heure choisie</p>
                      <p className="text-sm font-medium">{formatHeure(selectedRendezVous.heureChoisie)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Créé le</p>
                      <p className="text-sm font-medium">{formatDate(selectedRendezVous.creeLe)}</p>
                    </div>
                  </div>
                </div>

                {selectedRendezVous.projetDetails && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Détails du projet</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedRendezVous.projetDetails}</p>
                    </div>
                  </div>
                )}

                {selectedRendezVous.User && (
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Compte utilisateur associé</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Nom</p>
                          <p className="font-medium">
                            {selectedRendezVous.User.firstName} {selectedRendezVous.User.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedRendezVous.User.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zone d'actions simplifiée avec seulement le bouton Fermer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  style={{ 
                    backgroundColor: themeColors.primary,
                    color: 'white'
                  }}
                  className="flex-1 px-4 py-2 text-sm rounded-md font-medium hover:opacity-90 transition-opacity"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RendezVous;