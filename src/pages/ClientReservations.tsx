import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Home,
  Calendar,
  MapPin,
  Euro,
  Users,
  Filter,
  Search,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  DoorOpen,
  Info,
  AlertCircle,
  Bell,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import api from "@/lib/api";
import ReservationCard, { LocationSaisonniere } from '../components/ReservationCard';

const ClientReservations = () => {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<LocationSaisonniere[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    confirmee: 0,
    annulee: 0,
    terminee: 0,
    en_cours: 0,
    revenueTotal: 0,
  });
  const [hasNewReservation, setHasNewReservation] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Charger les réservations
  const loadReservations = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Chargement des réservations client...');
      
      const response = await api.get(`/locations-saisonnieres/client/${user.id}`);
      
      console.log('📥 API Response:', {
        status: response.status,
        dataLength: response.data?.length
      });

      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ ${response.data.length} réservations chargées`);
        
        // Vérifier s'il y a de nouvelles réservations
        const oldIds = reservations.map(r => r.id);
        const newReservations = response.data.filter(r => !oldIds.includes(r.id));
        
        if (newReservations.length > 0 && reservations.length > 0) {
          setHasNewReservation(true);
          console.log(`🎉 ${newReservations.length} nouvelle(s) réservation(s)`);
          
          // Afficher une notification pour chaque nouvelle réservation
          newReservations.forEach(reservation => {
            toast({
              title: "Nouvelle réservation !",
              description: `Votre réservation pour "${reservation.property?.title}" a été créée`,
              variant: "default",
              duration: 5000
            });
          });
        }
        
        setReservations(response.data);
        
        // Calculer les statistiques
        const statsData = {
          total: response.data.length,
          en_attente: response.data.filter((r: LocationSaisonniere) => r.statut === 'en_attente').length,
          confirmee: response.data.filter((r: LocationSaisonniere) => r.statut === 'confirmee').length,
          annulee: response.data.filter((r: LocationSaisonniere) => r.statut === 'annulee').length,
          terminee: response.data.filter((r: LocationSaisonniere) => r.statut === 'terminee').length,
          en_cours: response.data.filter((r: LocationSaisonniere) => r.statut === 'en_cours').length,
          revenueTotal: response.data
            .filter((r: LocationSaisonniere) => ['confirmee', 'terminee', 'en_cours'].includes(r.statut))
            .reduce((sum: number, r: LocationSaisonniere) => sum + r.prixTotal, 0),
        };
        
        setStats(statsData);
      } else {
        setReservations([]);
      }

    } catch (err: any) {
      console.error("❌ Erreur chargement réservations:", err);
      
      setReservations([]);
      
      toast({
        title: "Erreur",
        description: "Impossible de charger vos réservations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage avec écouteurs d'événements
  useEffect(() => {
    const handleReservationCreated = (event: CustomEvent) => {
      console.log('🎯 Événement réservation créée reçu:', event.detail);
      
      // Vérifier si cette réservation concerne cet utilisateur
      if (event.detail.clientId === user?.id) {
        console.log('✅ Nouvelle réservation pour cet utilisateur, rechargement...');
        
        // Attendre 1 seconde pour laisser le backend terminer
        setTimeout(() => {
          loadReservations();
          
          toast({
            title: "Nouvelle réservation",
            description: "Votre réservation a été créée avec succès",
            variant: "default",
            duration: 5000
          });
        }, 1000);
      }
    };
    
    const handleDemandeStatusChanged = (event: CustomEvent) => {
      const { statut, propertyId } = event.detail || {};
      const statutLower = statut?.toLowerCase();
      
      // Si une demande est marquée comme "loué", vérifier les réservations
      if (statutLower === 'loué' || statutLower === 'loue' || statutLower === 'rented') {
        console.log('🏠 Demande marquée comme louée, vérification réservations...');
        
        // Attendre 2 secondes pour laisser le backend créer la réservation
        setTimeout(() => {
          loadReservations();
        }, 2000);
      }
    };
    
    if (isAuthenticated && user?.id) {
      console.log("🚀 Démarrage chargement réservations...");
      loadReservations();
      
      // Écouter les événements
      window.addEventListener('reservation:created', handleReservationCreated as EventListener);
      window.addEventListener('demande:statusChanged', handleDemandeStatusChanged as EventListener);
      
      // Polling toutes les 30 secondes
      const pollingInterval = setInterval(() => {
        loadReservations();
      }, 30000);
      
      return () => {
        window.removeEventListener('reservation:created', handleReservationCreated as EventListener);
        window.removeEventListener('demande:statusChanged', handleDemandeStatusChanged as EventListener);
        clearInterval(pollingInterval);
      };
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // Filtrer les réservations
  const filteredReservations = React.useMemo(() => {
    let filtered = reservations;

    if (activeTab !== "all") {
      filtered = filtered.filter((reservation) => reservation.statut === activeTab);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((reservation) =>
        reservation.property?.title?.toLowerCase().includes(term) ||
        reservation.property?.city?.toLowerCase().includes(term) ||
        reservation.property?.address?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [reservations, activeTab, searchTerm]);

  // Changer le statut d'une réservation
  const handleStatusChange = async (id: number, statut: LocationSaisonniere['statut']) => {
    setUpdatingIds((s) => [...s, id]);
    try {
      const response = await api.patch(`/locations-saisonnieres/${id}/statut`, { statut });
      
      if (response.data) {
        setReservations((prev) =>
          prev.map((r) => r.id === id ? { ...r, statut, updatedAt: new Date().toISOString() } : r)
        );

        toast({ 
          title: "Succès", 
          description: `Statut changé en "${statut}"`,
          variant: "default"
        });
      }
    } catch (err: any) {
      console.error("❌ Erreur changement statut:", err);
      
      toast({ 
        title: "Erreur", 
        description: "Impossible de changer le statut",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  const handleRemove = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    setUpdatingIds((s) => [...s, id]);
    try {
      await api.delete(`/locations-saisonnieres/${id}`);
      
      setReservations((prev) => prev.filter((r) => r.id !== id));
      
      toast({
        title: "Supprimée",
        description: "La réservation a été supprimée",
        variant: "default"
      });
    } catch (err: any) {
      console.error("❌ Erreur suppression réservation:", err);
      
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réservation",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  const handleViewDetails = (reservation: LocationSaisonniere) => {
    if (reservation.propertyId) {
      window.open(`/immobilier/${reservation.propertyId}`, '_blank');
    }
  };

  const handleExport = () => {
    if (filteredReservations.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucune réservation à exporter",
        variant: "destructive"
      });
      return;
    }

    const csvData = filteredReservations.map(r => ({
      ID: r.id,
      Statut: r.statut,
      'Bien': r.property?.title,
      'Adresse': `${r.property?.address}, ${r.property?.city}`,
      'Date début': new Date(r.dateDebut).toLocaleDateString("fr-FR"),
      'Date fin': new Date(r.dateFin).toLocaleDateString("fr-FR"),
      'Prix total': r.prixTotal,
      'Adultes': r.nombreAdultes,
      'Enfants': r.nombreEnfants,
      'Date création': new Date(r.createdAt).toLocaleDateString("fr-FR"),
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mes-reservations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: `${filteredReservations.length} réservations exportées`,
      variant: "default"
    });
  };

  const clearNewReservationNotification = () => {
    setHasNewReservation(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-600">
          Veuillez vous connecter pour voir vos réservations.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Chargement de vos réservations" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Mes réservations
              </h1>
              {hasNewReservation && (
                <button
                  onClick={clearNewReservationNotification}
                  className="relative"
                  title="Nouvelles réservations disponibles"
                >
                  <Bell className="w-6 h-6 text-green-600 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              )}
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Suivez vos réservations en location saisonnière
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">
                {reservations.length} réservation(s)
              </span>
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleExport}
              disabled={filteredReservations.length === 0}
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exporter</span>
              <span className="md:hidden">CSV</span>
            </button>
            <button
              onClick={loadReservations}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Actualiser</span>
              <span className="md:hidden">Rafraîchir</span>
            </button>
            <Link
              to="/immobilier?type=location&saisonnier=true"
              className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Nouvelle réservation</span>
              <span className="md:hidden">Réserver</span>
            </Link>
          </div>
        </div>

        {/* Guide d'utilisation */}
        {reservations.length === 0 && (
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 text-lg mb-2">
                  Comment obtenir une réservation ?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <span className="text-blue-700 text-sm">
                        Faites une <strong>demande de visite</strong> pour un bien en location saisonnière
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <span className="text-blue-700 text-sm">
                        Attendez que le <strong>propriétaire confirme</strong> votre visite
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <span className="text-blue-700 text-sm">
                        Après la visite, le propriétaire marquera le bien comme <strong>"loué"</strong>
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <span className="text-blue-700 text-sm">
                        Une réservation sera <strong>automatiquement créée ici</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/immobilier?type=location&saisonnier=true"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Trouver un bien en location
                  </Link>
                  <Link
                    to="/mes-demandes"
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    <Calendar className="w-4 h-4" />
                    Voir mes demandes de visite
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification nouvelles réservations */}
        {hasNewReservation && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-green-800 font-medium">
                  De nouvelles réservations sont disponibles !
                </p>
                <p className="text-green-600 text-sm">
                  Actualisez la page pour voir les dernières réservations créées.
                </p>
              </div>
              <button
                onClick={clearNewReservationNotification}
                className="text-green-700 hover:text-green-800 text-sm font-medium"
              >
                Marquer comme lu
              </button>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {reservations.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mb-6">
            {[
              { label: "Total", value: stats.total, color: "bg-white", icon: <Home className="w-4 h-4" /> },
              { label: "En attente", value: stats.en_attente, color: "bg-yellow-50", icon: <Clock className="w-4 h-4" /> },
              { label: "Confirmées", value: stats.confirmee, color: "bg-green-50", icon: <CheckCircle className="w-4 h-4" /> },
              { label: "En cours", value: stats.en_cours, color: "bg-purple-50", icon: <DoorOpen className="w-4 h-4" /> },
              { label: "Terminées", value: stats.terminee, color: "bg-blue-50", icon: <Check className="w-4 h-4" /> },
              { label: "Annulées", value: stats.annulee, color: "bg-red-50", icon: <XCircle className="w-4 h-4" /> },
            ].map((stat, index) => (
              <div key={index} className={`${stat.color} rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 text-center shadow-sm`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {stat.icon}
                  <div className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</div>
                </div>
                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Barre de recherche */}
        {reservations.length > 0 && (
          <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 mb-4 md:mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
              <div className="flex-1 w-full relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher bien, dates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Filtrer:</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de filtrage */}
        {reservations.length > 0 && (
          <div className="flex items-center space-x-1 bg-white rounded-lg md:rounded-xl p-1 md:p-2 border border-gray-200 mb-4 md:mb-8 shadow-sm overflow-x-auto">
            {[
              { id: "all", label: "Toutes", count: stats.total },
              { id: "en_attente", label: "En attente", count: stats.en_attente },
              { id: "confirmee", label: "Confirmées", count: stats.confirmee },
              { id: "en_cours", label: "En cours", count: stats.en_cours },
              { id: "terminee", label: "Terminées", count: stats.terminee },
              { id: "annulee", label: "Annulées", count: stats.annulee },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium rounded-md md:rounded-lg transition-all duration-200 flex items-center gap-1 md:gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 md:px-2 py-0.5 md:py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Liste des réservations */}
        <div className="space-y-4 md:space-y-6">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                isOwner={false}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-lg md:rounded-2xl border border-gray-200 p-6 md:p-12 text-center shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-700 text-base md:text-lg font-medium mb-2">
                Vous n'avez pas encore de réservation
              </h4>
              <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
                Commencez par faire une demande de visite pour un bien en location saisonnière
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/immobilier?type=location&saisonnier=true"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Trouver un bien en location
                </Link>
                <Link
                  to="/mes-demandes"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Mes demandes de visite
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg md:rounded-2xl border border-gray-200 p-6 md:p-12 text-center shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-700 text-base md:text-lg font-medium mb-2">
                Aucune réservation trouvée
              </h4>
              <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
                Essayez de modifier vos critères de recherche ou sélectionnez un autre filtre
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientReservations;