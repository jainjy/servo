import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search, Plus, FileText, Briefcase, DollarSign, Calendar,
  Filter, BarChart3, TrendingUp, Clock, MapPin, Building2,
  Users, CheckCircle2, XCircle, AlertCircle, Eye, Heart,
  MessageSquare, FileCheck, Truck, Star, Award, Download,
  Upload, Send, Edit3, Trash2, X, Sparkles, Package,
  Shield, Tag, Layers, UserCheck, Wallet, Receipt,
  Store
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AppelOffreCreateModal } from './AppelOffreCreateModal';
import { ReponseOffreModal } from './ReponseOffreModal';
import { CatalogueB2BModal } from './CatalogueB2BModal';

// Types
interface Professionnel {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  commercialName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  siret?: string;
  city?: string;
}

interface AppelOffre {
  id: string;
  numero: string;
  titre: string;
  description?: string;
  dateLimite: string;
  datePublication: string;
  budgetMin?: number;
  budgetMax?: number;
  typePrestation: string;
  dureeEstimee?: string;
  lieuIntervention?: string;
  estUrgent: boolean;
  statut: 'ouvert' | 'en_cours' | 'attribue' | 'expire' | 'annule';
  visibilite: string;
  piecesJointes?: string[];
  demande: {
    createdBy: Professionnel;
  };
  metier?: { id: number; libelle: string };
  service?: { id: number; libelle: string };
  reponses?: Array<{ id: string; statut: string; montantPropose: number }>;
  _count?: {
    reponses: number;
    vues: number;
    favoris: number;
  };
}

interface ReponseOffre {
  appelOffre: any;
  id: string;
  numero: string;
  montantPropose: number;
  montantTTC: number;
  delaiPropose: string;
  message?: string;
  statut: string;
  dateReponse: string;
  prestataire: Professionnel;
  devis?: { id: string; numero: string };
}

interface CatalogueItem {
  id: string;
  titre: string;
  description?: string;
  prixHT: number;
  prixTTC: number;
  unite: string;
  delaiMoyen?: string;
  zoneIntervention: string[];
  competences: string[];
  images: string[];
  garantie?: string;
  certification: string[];
  isActive: boolean;
  misEnAvant: boolean;
  professionnel: Professionnel;
  service: {
    id: number;
    libelle: string;
    category?: { name: string };
  };
}

const B2BMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appels-offre' | 'catalogue' | 'mes-offres' | 'mes-reponses'>('appels-offre');
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | 'both'>('both');
  
  // Modals
  const [showAppelOffreModal, setShowAppelOffreModal] = useState(false);
  const [showReponseModal, setShowReponseModal] = useState(false);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  const [selectedAppelOffre, setSelectedAppelOffre] = useState<AppelOffre | null>(null);
  
  // Data
  const [appelsOffre, setAppelsOffre] = useState<AppelOffre[]>([]);
  const [catalogue, setCatalogue] = useState<CatalogueItem[]>([]);
  const [mesReponses, setMesReponses] = useState<ReponseOffre[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);
  
  const { toast } = useToast();
  const apiBase = 'http://localhost:3001';
  
  // Thème
  const theme = {
    primary: '#2563eb',
    primaryDark: '#1d4ed8',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    lightBg: '#f8fafc',
    separator: '#e2e8f0'
  };

  // ============================================
  // FETCH DATA
  // ============================================
  
  const fetchAppelsOffre = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      const params = new URLSearchParams({
        ...(statusFilter !== 'all' && { statut: statusFilter }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(searchTerm && { search: searchTerm }),
        ...(activeTab === 'mes-offres' && { mesAppels: 'true' })
      });
      
      const res = await fetch(`${apiBase}/api/b2b/appels-offre?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) throw new Error('Erreur chargement');
      
      const response = await res.json();
      setAppelsOffre(response.data || []);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les appels d\'offres',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter, activeTab]);

  const fetchCatalogue = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        limit: '50'
      });
      
      const res = await fetch(`${apiBase}/api/b2b/catalogue?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) throw new Error('Erreur chargement');
      
      const response = await res.json();
      setCatalogue(response.data || []);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le catalogue',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const fetchMesReponses = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      const res = await fetch(`${apiBase}/api/b2b/mes-reponses`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (!res.ok) throw new Error('Erreur chargement');
      
      const response = await res.json();
      setMesReponses(response.data || []);
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos réponses',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'appels-offre' || activeTab === 'mes-offres') {
      fetchAppelsOffre();
    } else if (activeTab === 'catalogue') {
      fetchCatalogue();
    } else if (activeTab === 'mes-reponses') {
      fetchMesReponses();
    }
  }, [activeTab, fetchAppelsOffre, fetchCatalogue, fetchMesReponses]);

  // ============================================
  // STATISTIQUES
  // ============================================
  
  const stats = useMemo(() => {
    if (activeTab === 'appels-offre' || activeTab === 'mes-offres') {
      return {
        total: appelsOffre.length,
        ouverts: appelsOffre.filter(a => a.statut === 'ouvert').length,
        urgents: appelsOffre.filter(a => a.estUrgent).length,
        reponsesTotal: appelsOffre.reduce((acc, a) => acc + (a._count?.reponses || 0), 0)
      };
    } else if (activeTab === 'catalogue') {
      return {
        total: catalogue.length,
        actifs: catalogue.filter(c => c.isActive).length,
        misEnAvant: catalogue.filter(c => c.misEnAvant).length
      };
    } else if (activeTab === 'mes-reponses') {
      return {
        total: mesReponses.length,
        enAttente: mesReponses.filter(r => r.statut === 'en_attente').length,
        selectionnees: mesReponses.filter(r => r.statut === 'selectionne').length
      };
    }
    return {};
  }, [activeTab, appelsOffre, catalogue, mesReponses]);

  // ============================================
  // ACTIONS
  // ============================================
  
  const handleRepondre = (appelOffre: AppelOffre) => {
    setSelectedAppelOffre(appelOffre);
    setShowReponseModal(true);
  };

  const handleSelectionnerReponse = async (reponseId: string) => {
    if (!confirm('Sélectionner cette offre ? Les autres réponses seront refusées.')) return;
    
    try {
      const token = localStorage.getItem('auth-token') || localStorage.getItem('token');
      const res = await fetch(`${apiBase}/api/b2b/reponses/${reponseId}/selectionner`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!res.ok) throw new Error('Erreur sélection');
      
      toast({
        title: 'Succès',
        description: 'Offre sélectionnée avec succès'
      });
      
      fetchAppelsOffre();
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sélectionner l\'offre',
        variant: 'destructive'
      });
    }
  };

  // ============================================
  // RENDER STATUTS
  // ============================================
  
  const getStatusStyle = (statut: string) => {
    const styles: Record<string, { bg: string; text: string; label: string; icon: any }> = {
      ouvert: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'Ouvert',
        icon: CheckCircle2
      },
      en_cours: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        label: 'En cours',
        icon: Clock
      },
      attribue: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        label: 'Attribué',
        icon: Award
      },
      expire: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        label: 'Expiré',
        icon: XCircle
      },
      annule: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        label: 'Annulé',
        icon: X
      },
      en_attente: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        label: 'En attente',
        icon: AlertCircle
      },
      selectionne: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        label: 'Sélectionné',
        icon: CheckCircle2
      }
    };
    return styles[statut] || styles.en_attente;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return '—';
    return `${price.toLocaleString('fr-FR')} €`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                <Briefcase size={28} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Marketplace B2B
                </h1>
                <p className="text-gray-600 mt-1">
                  Appels d'offres et services entre professionnels
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {activeTab === 'appels-offre' && (
                <button
                  onClick={() => setShowAppelOffreModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all hover:shadow-lg"
                >
                  <Plus size={18} />
                  <span>Lancer un appel d'offres</span>
                </button>
              )}
              {activeTab === 'catalogue' && (
                <button
                  onClick={() => setShowCatalogueModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:shadow-lg"
                >
                  <Package size={18} />
                  <span>Publier une offre</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
            {[
              { id: 'appels-offre', label: '🔍 Appels d\'offres', icon: FileText },
              { id: 'catalogue', label: '📦 Catalogue B2B', icon: Package },
              { id: 'mes-offres', label: '📋 Mes appels d\'offres', icon: Briefcase },
              { id: 'mes-reponses', label: '✉️ Mes réponses', icon: Send }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={16} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Object.entries(stats).map(([key, value], index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={
                  activeTab === 'appels-offre' ? 'Rechercher un appel d\'offres...' :
                  activeTab === 'catalogue' ? 'Rechercher un service...' :
                  'Rechercher...'
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3">
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="ouvert">Ouvert</option>
                <option value="en_cours">En cours</option>
                <option value="attribue">Attribué</option>
              </select>
              
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="service">Service</option>
                <option value="prestation">Prestation</option>
                <option value="forfait">Forfait</option>
                <option value="etude">Étude</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {/* Appels d'offres */}
            {(activeTab === 'appels-offre' || activeTab === 'mes-offres') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appelsOffre.map((appel) => {
                  const status = getStatusStyle(appel.statut);
                  const StatusIcon = status.icon;
                  const daysLeft = Math.ceil((new Date(appel.dateLimite).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={appel.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden group">
                      {/* Header */}
                      <div className="p-5 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {appel.numero}
                            </span>
                            {appel.estUrgent && (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                                <AlertCircle size={12} />
                                Urgent
                              </span>
                            )}
                          </div>
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                            <StatusIcon size={12} />
                            {status.label}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2">
                          {appel.titre}
                        </h3>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 size={14} />
                          <span className="truncate">
                            {appel.demande.createdBy.companyName || 
                             appel.demande.createdBy.commercialName || 
                             `${appel.demande.createdBy.firstName} ${appel.demande.createdBy.lastName}`}
                          </span>
                        </div>
                      </div>
                      
                      {/* Body */}
                      <div className="p-5 space-y-3">
                        {/* Budget */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Wallet size={14} />
                            <span className="text-sm">Budget</span>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {appel.budgetMin && appel.budgetMax ? (
                              `${appel.budgetMin.toLocaleString('fr-FR')} - ${appel.budgetMax.toLocaleString('fr-FR')} €`
                            ) : appel.budgetMax ? (
                              `Max ${appel.budgetMax.toLocaleString('fr-FR')} €`
                            ) : (
                              'Non spécifié'
                            )}
                          </div>
                        </div>
                        
                        {/* Délai / Lieu */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock size={14} />
                            <span className="text-sm">Délai</span>
                          </div>
                          <div className="text-gray-900">
                            {appel.dureeEstimee || 'À définir'}
                          </div>
                        </div>
                        
                        {appel.lieuIntervention && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin size={14} />
                              <span className="text-sm">Lieu</span>
                            </div>
                            <div className="text-gray-900 truncate max-w-[150px]">
                              {appel.lieuIntervention}
                            </div>
                          </div>
                        )}
                        
                        {/* Métier / Service */}
                        {(appel.metier || appel.service) && (
                          <div className="flex items-center gap-2 text-sm">
                            <Tag size={14} className="text-gray-400" />
                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">
                              {appel.metier?.libelle || appel.service?.libelle}
                            </span>
                          </div>
                        )}
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between pt-2 text-sm">
                          <div className="flex items-center gap-3 text-gray-500">
                            <span className="flex items-center gap-1">
                              <Send size={14} />
                              {appel._count?.reponses || 0} réponses
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={14} />
                              {appel._count?.vues || 0} vues
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar size={12} className="text-gray-400" />
                            <span className={daysLeft < 3 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                              {daysLeft > 0 ? `${daysLeft} jours` : 'Expiré'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="p-5 bg-gray-50 border-t border-gray-100">
                        {activeTab === 'appels-offre' && appel.statut === 'ouvert' && daysLeft > 0 && (
                          <button
                            onClick={() => handleRepondre(appel)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                          >
                            <Send size={16} />
                            <span className="font-medium">Répondre à l'appel</span>
                          </button>
                        )}
                        
                        {activeTab === 'mes-offres' && (
                          <div className="flex gap-2">
                            <button
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                              onClick={() => {/* Voir les réponses */}}
                            >
                              <Users size={16} />
                              <span>Réponses ({appel._count?.reponses || 0})</span>
                            </button>
                            {appel.statut === 'ouvert' && (
                              <button
                                className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                onClick={() => {/* Modifier */}}
                              >
                                <Edit3 size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {appelsOffre.length === 0 && (
                  <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun appel d'offres
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {activeTab === 'mes-offres' 
                        ? 'Vous n\'avez pas encore lancé d\'appel d\'offres'
                        : 'Aucun appel d\'offres ne correspond à vos critères'}
                    </p>
                    {activeTab === 'mes-offres' && (
                      <button
                        onClick={() => setShowAppelOffreModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus size={16} />
                        Lancer un appel d'offres
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Catalogue B2B */}
            {activeTab === 'catalogue' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogue.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden">
                    {/* Image */}
                    <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                      {item.images && item.images[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.titre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-gray-400" />
                        </div>
                      )}
                      {item.misEnAvant && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Star size={12} />
                          Mis en avant
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {item.titre}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 size={14} />
                            <span>{item.professionnel.companyName || item.professionnel.commercialName}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                          {formatPrice(item.prixTTC)}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {item.unite}
                        </span>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>Délai: {item.delaiMoyen || 'À définir'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span className="truncate">
                            {item.zoneIntervention.join(', ') || 'Toute l\'île'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {item.competences.slice(0, 3).map((comp, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                            {comp}
                          </span>
                        ))}
                        {item.competences.length > 3 && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{item.competences.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-5 flex gap-2">
                        <button
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                          onClick={() => {/* Commander */}}
                        >
                          <Store size={16} />
                          <span className="font-medium">Commander</span>
                        </button>
                        <button
                          className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          onClick={() => {/* Contacter */}}
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {catalogue.length === 0 && (
                  <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune offre dans le catalogue
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Publiez votre première offre B2B
                    </p>
                    <button
                      onClick={() => setShowCatalogueModal(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Plus size={16} />
                      Publier une offre
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mes réponses */}
            {activeTab === 'mes-reponses' && (
              <div className="grid grid-cols-1 gap-6">
                {mesReponses.map((reponse) => {
                  const status = getStatusStyle(reponse.statut);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={reponse.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {reponse.numero}
                            </span>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {reponse.appelOffre?.titre}
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              <DollarSign size={14} className="text-gray-400" />
                              <span className="font-semibold text-gray-900">
                                {formatPrice(reponse.montantTTC)} TTC
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-gray-700">Délai: {reponse.delaiPropose}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-gray-700">
                                Répondu le {formatDate(reponse.dateReponse)}
                              </span>
                            </div>
                          </div>
                          
                          {reponse.message && (
                            <p className="mt-3 text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                              {reponse.message}
                            </p>
                          )}
                          
                          <div className="mt-4 flex gap-2">
                            {reponse.devis && (
                              <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100">
                                <FileCheck size={14} />
                                Voir le devis
                              </button>
                            )}
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                              <MessageSquare size={14} />
                              Message
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {mesReponses.length === 0 && (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Send size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucune réponse
                    </h3>
                    <p className="text-gray-600">
                      Vous n'avez pas encore répondu à des appels d'offres
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Modals */}
      <AppelOffreCreateModal
        open={showAppelOffreModal}
        onOpenChange={setShowAppelOffreModal}
        onSuccess={fetchAppelsOffre}
      />
      
      <ReponseOffreModal
        open={showReponseModal}
        onOpenChange={setShowReponseModal}
        appelOffre={selectedAppelOffre}
        onSuccess={() => {
          fetchAppelsOffre();
          fetchMesReponses();
        }}
      />
      
      <CatalogueB2BModal
        open={showCatalogueModal}
        onOpenChange={setShowCatalogueModal}
        onSuccess={fetchCatalogue}
      />
      
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default B2BMarketplace;