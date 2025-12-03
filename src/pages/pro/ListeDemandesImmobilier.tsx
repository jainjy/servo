import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  Trash2,
  User,
  Mail,
  Phone,
  Clock,
  MessageCircle,
  Home,
  Filter,
  Search,
  Download,
  Building,
  RefreshCw,
  MoreVertical,
  Edit,
  Send,
  Ban,
  CheckSquare,
  AlertTriangle,
  Info,
  Building2,
  Users,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  FileText
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { demandeImmobilierAPI } from "@/lib/api";

const DemandeCard = ({ demande, onStatusChange, onRemove, isArtisan = false }: any) => {
  const [showActions, setShowActions] = useState(false);
  const [showStatusSelector, setShowStatusSelector] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Détecter si on est en mode mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatMessage = (message: string) => {
    if (!message) return "—";
    const parts = message.split(".");
    const userMessage = parts.find(
      (part) => !part.includes("Demande visite pour le bien") && 
                !part.includes("Postulation pour logement intermédiaire")
    );
    return userMessage ? userMessage.trim() : "—";
  };

  const getStatusIcon = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "en attente":
      case "en cours":
        return <Clock className="w-4 h-4" />;
      case "validée":
      case "validee":
      case "valide":
        return <CheckCircle className="w-4 h-4" />;
      case "refusée":
      case "refusee":
      case "refus":
        return <XCircle className="w-4 h-4" />;
      case "archivée":
      case "archivee":
      case "archive":
        return <Archive className="w-4 h-4" />;
      case "terminée":
      case "terminee":
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const statusOptions = [
    { value: "en attente", label: "En attente", icon: <Clock className="w-4 h-4" />, color: "bg-yellow-100 text-yellow-800" },
    { value: "validée", label: "Validée", icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-100 text-green-800" },
    { value: "refusée", label: "Refusée", icon: <XCircle className="w-4 h-4" />, color: "bg-red-100 text-red-800" },
    { value: "archivée", label: "Archivée", icon: <Archive className="w-4 h-4" />, color: "bg-gray-100 text-gray-800" },
    { value: "terminée", label: "Terminée", icon: <CheckSquare className="w-4 h-4" />, color: "bg-blue-100 text-blue-800" },
  ];

  const handleStatusSelect = (status: string) => {
    onStatusChange(demande.id, status);
    setShowStatusSelector(false);
  };

  const renderDesktopView = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
        {/* Section gauche - Image et informations de base */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Image */}
          {demande.property?.images?.length > 0 ? (
            <div className="relative overflow-hidden rounded-xl min-w-[150px] h-32 md:h-36">
              <img
                src={demande.property.images[0]}
                alt={demande.property?.title || "Propriété"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="min-w-[150px] h-32 md:h-36 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <Home className="w-8 h-8" />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-gray-900 text-lg md:text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                {demande.property?.title || "Demande de visite"}
              </h3>
              <p className="text-gray-600 text-sm flex items-center gap-2 mt-2">
                <span className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                  <MapPin className="w-4 h-4" />
                  {formatAddress(demande)}
                </span>
              </p>
            </div>

            {/* Informations client pour artisan */}
            {isArtisan && demande.createdBy && (
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Client: {demande.createdBy.firstName} {demande.createdBy.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{demande.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{demande.contactTel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section droite - Statut et date */}
        <div className="flex flex-col items-start lg:items-end gap-4 min-w-[200px]">
          <div className="flex flex-col gap-3 w-full">
            {/* Sélecteur de statut */}
            <div className="relative">
              <button
                onClick={() => setShowStatusSelector(!showStatusSelector)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg font-medium border-2 transition-all ${getStatusColor(demande.statut)} hover:shadow-md`}
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(demande.statut)}
                  <span className="capitalize">{demande.statut}</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showStatusSelector && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 z-50 py-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusSelect(option.value)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-gray-50 ${option.value === demande.statut ? option.color : "text-gray-700"}`}
                    >
                      {option.icon}
                      {option.label}
                      {option.value === demande.statut && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(demande.createdAt || demande.date).toLocaleDateString("fr-FR")}
              </span>
            </div>

            {demande.dateSouhaitee && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Visite: {new Date(demande.dateSouhaitee).toLocaleDateString("fr-FR")} à {demande.heureSouhaitee || "--:--"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/immobilier/${demande.propertyId || demande.property?.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Eye className="w-4 h-4" />
            Voir le bien
          </Link>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {showDetails ? "Masquer détails" : "Voir détails"}
          </button>
        </div>

        <div className="flex gap-3">
          {isArtisan && (
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-300 hover:scale-105"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 py-2">
                  <button
                    onClick={() => {
                      onRemove(demande.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer définitivement
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Détails supplémentaires */}
      {showDetails && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                Informations du client
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-800">
                      {demande.contactPrenom} {demande.contactNom}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{demande.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{demande.contactTel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                Message du client
              </h4>
              <div className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <span>{formatMessage(demande.description)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fermer les menus en cliquant ailleurs */}
      {(showActions || showStatusSelector) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowActions(false);
            setShowStatusSelector(false);
          }}
        />
      )}
    </div>
  );

  const renderMobileView = () => (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-500">
      {/* En-tête mobile */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base mb-2">
            {demande.property?.title || "Demande de visite"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{formatAddress(demande)}</span>
          </div>
        </div>
        
        {/* Bouton pour voir détails */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2 text-gray-500"
        >
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Informations principales */}
      <div className="space-y-3 mb-4">
        {/* Sélecteur de statut */}
        <div className="relative">
          <button
            onClick={() => setShowStatusSelector(!showStatusSelector)}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg font-medium border ${getStatusColor(demande.statut)}`}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon(demande.statut)}
              <span className="text-sm capitalize">{demande.statut}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showStatusSelector && (
            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 text-sm ${option.value === demande.statut ? option.color : "text-gray-700"}`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date et heure */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date(demande.createdAt || demande.date).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>

      {/* Boutons d'action mobile */}
      <div className="flex gap-2 mb-4">
        <Link
          to={`/immobilier/${demande.propertyId || demande.property?.id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          Voir
        </Link>

        {isArtisan && (
          <button
            onClick={() => onRemove(demande.id)}
            className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Détails dépliables */}
      {showDetails && (
        <div className="pt-4 border-t border-gray-100 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Client
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{demande.contactPrenom} {demande.contactNom}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{demande.contactTel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{demande.contactEmail}</span>
              </div>
            </div>
          </div>

          {demande.description && (
            <div>
              <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Message
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {formatMessage(demande.description)}
              </p>
            </div>
          )}

          {demande.dateSouhaitee && (
            <div>
              <h4 className="text-xs font-semibold text-gray-800 uppercase tracking-wide mb-3">
                Visite prévue
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(demande.dateSouhaitee).toLocaleDateString("fr-FR")}</span>
                {demande.heureSouhaitee && (
                  <>
                    <span>•</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{demande.heureSouhaitee}</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return isMobileView ? renderMobileView() : renderDesktopView();
};

const formatAddress = (demande: any) => {
  if (demande.property && (demande.property.address || demande.property.city)) {
    const parts = [demande.property.address, demande.property.city].filter(Boolean);
    return parts.join(", ");
  }
  const parts = [
    demande.lieuAdresse,
    demande.lieuAdresseVille,
    demande.lieuAdresseCp,
  ].filter(Boolean);
  if (parts.length) return parts.join(", ");
  return "Adresse non renseignée";
};

const getStatusColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "en attente":
    case "en cours":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "validée":
    case "validee":
    case "valide":
      return "bg-green-50 text-green-700 border-green-200";
    case "refusée":
    case "refusee":
    case "refus":
      return "bg-red-50 text-red-700 border-red-200";
    case "archivée":
    case "archivee":
    case "archive":
      return "bg-gray-50 text-gray-700 border-gray-200";
    case "terminée":
    case "terminee":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const ListeDemandesImmobilier = () => {
  const { user, isAuthenticated } = useAuth();
  const [demandes, setDemandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Vérifier si l'utilisateur est un artisan/professionnel
  const isArtisan = user?.role === "professional" || user?.role === "artisan" || user?.role === "pro";

  // Fonction pour charger les demandes depuis l'API
  const loadDemandes = async () => {
    if (!isAuthenticated || !user?.id) {
      console.log('❌ Utilisateur non authentifié ou ID manquant');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Chargement des demandes depuis l\'API...', { 
        isArtisan, 
        userId: user.id,
        userRole: user.role
      });
      
      let response;
      
      if (isArtisan) {
        response = await demandeImmobilierAPI.getArtisanDemandes(user.id);
        console.log('🏗️ Mode ARTISAN - Demandes pour ses propriétés:', response.data);
      } else {
        response = await demandeImmobilierAPI.getUserDemandes(user.id);
        console.log('👤 Mode CLIENT - Demandes envoyées:', response.data);
      }

      if (response.data && Array.isArray(response.data)) {
        const formattedDemandes = response.data.map(demande => ({
          ...demande,
          createdAt: demande.createdAt || demande.date,
          dateSouhaitee: demande.dateSouhaitee,
          heureSouhaitee: demande.heureSouhaitee,
          property: demande.property || {},
          contactNom: demande.contactNom || demande.createdBy?.lastName || "",
          contactPrenom: demande.contactPrenom || demande.createdBy?.firstName || "",
          contactEmail: demande.contactEmail || demande.createdBy?.email || "",
          contactTel: demande.contactTel || demande.createdBy?.phone || ""
        }));
        
        setDemandes(formattedDemandes);
        console.log(`✅ ${formattedDemandes.length} demandes chargées`);
      } else {
        console.error('❌ Format de données invalide:', response.data);
        setDemandes([]);
      }

    } catch (err: any) {
      console.error("❌ Erreur chargement demandes:", err);
      console.error("Détails erreur:", err.response?.data);
      
      setDemandes([]);
      
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Impossible de charger les demandes depuis le serveur",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger les demandes au montage
  useEffect(() => {
    loadDemandes();
  }, [isAuthenticated, user?.id, isArtisan]);

  // Écouter les événements de nouvelle demande
  useEffect(() => {
    const handleNewDemande = () => {
      console.log('🔄 Événement: Nouvelle demande détectée, rechargement...');
      loadDemandes();
    };

    window.addEventListener('demande:created', handleNewDemande);
    window.addEventListener('demande:statusChanged', handleNewDemande);

    return () => {
      window.removeEventListener('demande:created', handleNewDemande);
      window.removeEventListener('demande:statusChanged', handleNewDemande);
    };
  }, []);

  // Filter demandes based on active tab and search
  const filteredDemandes = React.useMemo(() => {
    let filtered = demandes;

    if (activeTab !== "all") {
      filtered = filtered.filter((demande) => {
        const status = (demande.statut || "").toLowerCase();
        switch (activeTab) {
          case "en_attente":
            return status === "en attente" || status === "en cours";
          case "validees":
            return ["validée", "validee", "valide"].includes(status);
          case "refusees":
            return ["refusée", "refusee", "refus"].includes(status);
          case "archivees":
            return ["archivée", "archivee", "archive"].includes(status);
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((demande) =>
        demande.contactPrenom?.toLowerCase().includes(term) ||
        demande.contactNom?.toLowerCase().includes(term) ||
        demande.contactEmail?.toLowerCase().includes(term) ||
        demande.property?.title?.toLowerCase().includes(term) ||
        formatAddress(demande).toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [demandes, activeTab, searchTerm]);

  // Statistiques pour chaque onglet
  const stats = React.useMemo(() => {
    const total = demandes.length;
    const enAttente = demandes.filter(d => 
      ["en attente", "en cours"].includes((d.statut || "").toLowerCase())
    ).length;
    const validees = demandes.filter(d => 
      ["validée", "validee", "valide"].includes((d.statut || "").toLowerCase())
    ).length;
    const refusees = demandes.filter(d => 
      ["refusée", "refusee", "refus"].includes((d.statut || "").toLowerCase())
    ).length;
    const archivees = demandes.filter(d => 
      ["archivée", "archivee", "archive"].includes((d.statut || "").toLowerCase())
    ).length;

    return { total, enAttente, validees, refusees, archivees };
  }, [demandes]);

  // Changer le statut d'une demande
  const handleStatusChange = async (id: number, statut: string) => {
    setUpdatingIds((s) => [...s, id]);
    try {
      console.log(`🔄 Changement statut demande ${id} -> ${statut}`);
      
      const response = await demandeImmobilierAPI.updateStatut(id, statut);
      
      if (response.data) {
        setDemandes((prev) =>
          prev.map((d) => (d.id === id ? { ...d, statut, updatedAt: new Date().toISOString() } : d))
        );

        window.dispatchEvent(
          new CustomEvent("demande:statusChanged", {
            detail: { demandeId: id, status: statut },
          })
        );

        toast({ 
          title: "Succès", 
          description: `Statut changé en "${statut}"`,
          variant: "default"
        });
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (err: any) {
      console.error("❌ Erreur changement statut:", err);
      toast({ 
        title: "Erreur", 
        description: err.response?.data?.error || "Impossible de changer le statut",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  const handleRemove = async (id: number) => {
    setUpdatingIds((s) => [...s, id]);
    try {
      const hardDelete = !isArtisan;
      
      const response = await demandeImmobilierAPI.deleteDemande(id, hardDelete);
      
      if (response.data) {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
        
        toast({
          title: isArtisan ? "Archivée" : "Supprimée",
          description: response.data.message || "La demande a été traitée avec succès.",
          variant: "default"
        });
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (err: any) {
      console.error("Erreur suppression demande", err);
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Impossible de supprimer la demande",
        variant: "destructive"
      });
    } finally {
      setUpdatingIds((s) => s.filter((x) => x !== id));
    }
  };

  // Export des données
  const handleExport = () => {
    if (filteredDemandes.length === 0) {
      toast({
        title: "Aucune donnée",
        description: "Aucune demande à exporter",
        variant: "destructive"
      });
      return;
    }

    const csvData = filteredDemandes.map(d => ({
      ID: d.id,
      Statut: d.statut,
      'Prénom client': d.contactPrenom,
      'Nom client': d.contactNom,
      'Email client': d.contactEmail,
      'Téléphone client': d.contactTel,
      'Bien': d.property?.title,
      'Adresse': formatAddress(d),
      'Date souhaitée': d.dateSouhaitee ? new Date(d.dateSouhaitee).toLocaleDateString("fr-FR") : '',
      'Heure': d.heureSouhaitee,
      'Message': d.description,
      'Date création': d.createdAt ? new Date(d.createdAt).toLocaleDateString("fr-FR") : '',
      'Client ID': d.createdBy?.id || 'N/A'
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
    a.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: `${filteredDemandes.length} demandes exportées`,
      variant: "default"
    });
  };

  if (!isAuthenticated)
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-600">
          Veuillez vous connecter pour voir les demandes.
        </p>
      </div>
    );

  if (loading)
    return <LoadingSpinner text="Chargement des demandes immobilières" />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête responsive */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {isArtisan ? (
                <Building2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              ) : (
                <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              )}
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                {isArtisan ? "Réservations" : "Mes demandes"}
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              {isArtisan 
                ? "Gérez les réservations de vos propriétés" 
                : "Gérez vos demandes de visite"}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">
                {demandes.length} demande(s)
              </span>
            </p>
          </div>

          {/* Boutons d'action responsive */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleExport}
              disabled={filteredDemandes.length === 0}
              className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exporter</span>
              <span className="md:hidden">CSV</span>
            </button>
            <button
              onClick={loadDemandes}
              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Actualiser</span>
              <span className="md:hidden">Rafraîchir</span>
            </button>
          </div>
        </div>

        {/* Statistiques responsive */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, color: "bg-white" },
            { label: "En attente", value: stats.enAttente, color: "bg-yellow-50" },
            { label: "Acceptées", value: stats.validees, color: "bg-green-50" },
            { label: "Refusées", value: stats.refusees, color: "bg-red-50" },
            { label: "Archivées", value: stats.archivees, color: "bg-gray-50" },
          ].map((stat, index) => (
            <div key={index} className={`${stat.color} rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 text-center shadow-sm`}>
              <div className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Barre de recherche responsive */}
        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 mb-4 md:mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1 w-full relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={isArtisan ? "Rechercher client, bien..." : "Rechercher bien, date..."}
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

        {/* Tabs de filtrage responsive */}
        <div className="flex items-center space-x-1 bg-white rounded-lg md:rounded-xl p-1 md:p-2 border border-gray-200 mb-4 md:mb-8 shadow-sm overflow-x-auto">
          {[
            { id: "all", label: "Toutes", count: stats.total },
            { id: "en_attente", label: "En attente", count: stats.enAttente },
            { id: "validees", label: "Acceptées", count: stats.validees },
            { id: "refusees", label: "Refusées", count: stats.refusees },
            { id: "archivees", label: "Archivées", count: stats.archivees },
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

        {/* Liste des demandes responsive */}
        <div className="space-y-4 md:space-y-6">
          {filteredDemandes.length > 0 ? (
            filteredDemandes.map((d) => (
              <DemandeCard
                key={d.id}
                demande={d}
                isArtisan={isArtisan}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg md:rounded-2xl border border-gray-200 p-6 md:p-12 text-center shadow-sm">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {isArtisan ? (
                  <Building className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                ) : (
                  <Calendar className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                )}
              </div>
              <h4 className="text-gray-700 text-base md:text-lg font-medium mb-2">
                Aucune demande{" "}
                {activeTab !== "all" ? "dans cette catégorie" : isArtisan ? "pour vos biens" : "de visite"}
              </h4>
              <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
                {isArtisan 
                  ? "Aucun client n'a encore réservé de visite pour vos propriétés."
                  : "Vous n'avez pas encore demandé de visite pour un bien immobilier."}
              </p>
              {!isArtisan && (
                <Link
                  to="/immobilier"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Voir les biens
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeDemandesImmobilier;