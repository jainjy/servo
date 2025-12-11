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

// Définition du thème
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

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
        return <Clock className="w-4 h-4" style={{ color: theme.secondaryText }} />;
      case "validée":
      case "validee":
      case "valide":
        return <CheckCircle className="w-4 h-4" style={{ color: '#16A34A' }} />;
      case "refusée":
      case "refusee":
      case "refus":
        return <XCircle className="w-4 h-4" style={{ color: '#DC2626' }} />;
      case "archivée":
      case "archivee":
      case "archive":
        return <Archive className="w-4 h-4" style={{ color: theme.secondaryText }} />;
      case "terminée":
      case "terminee":
        return <CheckSquare className="w-4 h-4" style={{ color: '#2563EB' }} />;
      default:
        return <Info className="w-4 h-4" style={{ color: theme.secondaryText }} />;
    }
  };

  const statusOptions = [
    { value: "en attente", label: "En attente", icon: <Clock className="w-4 h-4" style={{ color: theme.secondaryText }} />, color: "bg-yellow-100 text-yellow-800" },
    { value: "validée", label: "Validée", icon: <CheckCircle className="w-4 h-4" style={{ color: '#16A34A' }} />, color: "bg-green-100 text-green-800" },
    { value: "refusée", label: "Refusée", icon: <XCircle className="w-4 h-4" style={{ color: '#DC2626' }} />, color: "bg-red-100 text-red-800" },
    { value: "archivée", label: "Archivée", icon: <Archive className="w-4 h-4" style={{ color: theme.secondaryText }} />, color: "bg-gray-100 text-gray-800" },
    { value: "terminée", label: "Terminée", icon: <CheckSquare className="w-4 h-4" style={{ color: '#2563EB' }} />, color: "bg-blue-100 text-blue-800" },
  ];

  const handleStatusSelect = (status: string) => {
    onStatusChange(demande.id, status);
    setShowStatusSelector(false);
  };

  const renderDesktopView = () => (
    <div className="rounded-2xl border p-6 hover:shadow-lg transition-all duration-500 group relative overflow-hidden" style={{ 
      backgroundColor: theme.lightBg,
      borderColor: theme.separator 
    }}>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
        {/* Section gauche - Image et informations de base */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Image */}
          {demande.property?.images?.length > 0 ? (
            <div className="relative overflow-hidden rounded-xl min-w-[150px] h-32 md:h-36" style={{ border: `1px solid ${theme.separator}` }}>
              <img
                src={demande.property.images[0]}
                alt={demande.property?.title || "Propriété"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="min-w-[150px] h-32 md:h-36 rounded-xl flex items-center justify-center shadow-lg" style={{ 
              backgroundColor: `${theme.primaryDark}20`,
              border: `1px solid ${theme.separator}`
            }}>
              <Home className="w-8 h-8" style={{ color: theme.primaryDark }} />
            </div>
          )}

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-bold text-lg md:text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight" style={{ color: theme.logo }}>
                {demande.property?.title || "Demande de visite"}
              </h3>
              <p className="text-sm flex items-center gap-2 mt-2">
                <span className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ 
                  backgroundColor: `${theme.separator}20`,
                  color: theme.secondaryText 
                }}>
                  <MapPin className="w-4 h-4" />
                  {formatAddress(demande)}
                </span>
              </p>
            </div>

            {/* Informations client pour artisan */}
            {isArtisan && demande.createdBy && (
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                  <User className="w-4 h-4" />
                  <span>Client: {demande.createdBy.firstName} {demande.createdBy.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                  <Mail className="w-4 h-4" />
                  <span>{demande.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
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
                  <span className="capitalize" style={{ color: getStatusTextColor(demande.statut) }}>
                    {demande.statut}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4" style={{ color: theme.secondaryText }} />
              </button>

              {showStatusSelector && (
                <div className="absolute top-full mt-2 w-full rounded-lg shadow-2xl border py-2 z-50" style={{ 
                  backgroundColor: theme.lightBg,
                  borderColor: theme.separator 
                }}>
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusSelect(option.value)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors hover:bg-gray-50 ${option.value === demande.statut ? option.color : "text-gray-700"}`}
                      style={{ color: theme.secondaryText }}
                    >
                      {option.icon}
                      {option.label}
                      {option.value === demande.statut && <Check className="w-4 h-4 ml-auto" style={{ color: theme.primaryDark }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm flex items-center gap-2" style={{ color: theme.secondaryText }}>
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(demande.createdAt || demande.date).toLocaleDateString("fr-FR")}
              </span>
            </div>

            {demande.dateSouhaitee && (
              <div className="text-sm flex items-center gap-2" style={{ color: theme.secondaryText }}>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t" style={{ borderColor: theme.separator }}>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/immobilier/${demande.propertyId || demande.property?.id}`}
            className="text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            style={{ 
              backgroundColor: theme.primaryDark,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.logo;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryDark;
            }}
          >
            <Eye className="w-4 h-4" />
            Voir le bien
          </Link>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
            style={{ 
              backgroundColor: `${theme.separator}20`,
              color: theme.secondaryText
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.separator}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.separator}20`;
            }}
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
                className="p-2.5 rounded-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: `${theme.separator}20`,
                  color: theme.secondaryText
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.separator}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${theme.separator}20`;
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-2xl border py-2 z-50" style={{ 
                  backgroundColor: theme.lightBg,
                  borderColor: theme.separator 
                }}>
                  <button
                    onClick={() => {
                      onRemove(demande.id);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 transition-colors"
                    style={{ color: '#DC2626' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEE2E2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
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
        <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.separator }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2" style={{ color: theme.logo }}>
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.primaryDark }}></div>
                Informations du client
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" style={{ color: theme.secondaryText }} />
                  <span style={{ color: theme.secondaryText }}>
                    <span className="font-medium" style={{ color: theme.logo }}>
                      {demande.contactPrenom} {demande.contactNom}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" style={{ color: theme.secondaryText }} />
                  <span style={{ color: theme.secondaryText }}>{demande.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4" style={{ color: theme.secondaryText }} />
                  <span style={{ color: theme.secondaryText }}>{demande.contactTel}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2" style={{ color: theme.logo }}>
                <div className="w-1 h-4 rounded-full" style={{ backgroundColor: theme.logo }}></div>
                Message du client
              </h4>
              <div className="leading-relaxed text-sm p-4 rounded-lg" style={{ 
                backgroundColor: `${theme.separator}10`,
                color: theme.secondaryText 
              }}>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: theme.secondaryText }} />
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
    <div className="rounded-xl border p-4 hover:shadow-lg transition-all duration-500" style={{ 
      backgroundColor: theme.lightBg,
      borderColor: theme.separator 
    }}>
      {/* En-tête mobile */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-base mb-2" style={{ color: theme.logo }}>
            {demande.property?.title || "Demande de visite"}
          </h3>
          <div className="flex items-center gap-2 text-sm mb-3" style={{ color: theme.secondaryText }}>
            <MapPin className="w-4 h-4" />
            <span className="truncate">{formatAddress(demande)}</span>
          </div>
        </div>
        
        {/* Bouton pour voir détails */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="p-2"
          style={{ color: theme.secondaryText }}
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
              <span className="text-sm capitalize" style={{ color: getStatusTextColor(demande.statut) }}>{demande.statut}</span>
            </div>
            <ChevronDown className="w-4 h-4" style={{ color: theme.secondaryText }} />
          </button>

          {showStatusSelector && (
            <div className="absolute top-full mt-1 w-full rounded-lg shadow-lg border py-1 z-50" style={{ 
              backgroundColor: theme.lightBg,
              borderColor: theme.separator 
            }}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={`w-full px-3 py-2 text-left flex items-center gap-2 text-sm ${option.value === demande.statut ? option.color : "text-gray-700"}`}
                  style={{ color: theme.secondaryText }}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date et heure */}
        <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
          <Calendar className="w-4 h-4" />
          <span>{new Date(demande.createdAt || demande.date).toLocaleDateString("fr-FR")}</span>
        </div>
      </div>

      {/* Boutons d'action mobile */}
      <div className="flex gap-2 mb-4">
        <Link
          to={`/immobilier/${demande.propertyId || demande.property?.id}`}
          className="flex-1 text-white px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: theme.primaryDark,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.logo;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.primaryDark;
          }}
        >
          <Eye className="w-4 h-4" />
          Voir
        </Link>

        {isArtisan && (
          <button
            onClick={() => onRemove(demande.id)}
            className="px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
            style={{ 
              border: `1px solid ${theme.separator}`,
              color: '#DC2626'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEE2E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Détails dépliables */}
      {showDetails && (
        <div className="pt-4 border-t space-y-4" style={{ borderColor: theme.separator }}>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: theme.logo }}>
              Client
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                <User className="w-4 h-4" />
                <span>{demande.contactPrenom} {demande.contactNom}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                <Phone className="w-4 h-4" />
                <span>{demande.contactTel}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: theme.secondaryText }}>
                <Mail className="w-4 h-4" />
                <span className="truncate">{demande.contactEmail}</span>
              </div>
            </div>
          </div>

          {demande.description && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: theme.logo }}>
                Message
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.secondaryText }}>
                {formatMessage(demande.description)}
              </p>
            </div>
          )}

          {demande.dateSouhaitee && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: theme.logo }}>
                Visite prévue
              </h4>
              <div className="flex items-center gap-2 text-sm" style={{ color: theme.secondaryText }}>
                <Calendar className="w-4 h-4" />
                <span>{new Date(demande.dateSouhaitee).toLocaleDateString("fr-FR")}</span>
                {demande.heureSouhaitee && (
                  <>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
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

const getStatusTextColor = (status: string) => {
  switch ((status || "").toLowerCase()) {
    case "en attente":
    case "en cours":
      return '#CA8A04'; // Jaune
    case "validée":
    case "validee":
    case "valide":
      return '#16A34A'; // Vert
    case "refusée":
    case "refusee":
    case "refus":
      return '#DC2626'; // Rouge
    case "archivée":
    case "archivee":
    case "archive":
      return theme.secondaryText; // Marron du thème
    case "terminée":
    case "terminee":
      return '#2563EB'; // Bleu
    default:
      return theme.secondaryText;
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
      <div className="min-h-screen mt-12 p-4 md:p-6 flex items-center justify-center" style={{ backgroundColor: `${theme.separator}20` }}>
        <p style={{ color: theme.secondaryText }}>
          Veuillez vous connecter pour voir les demandes.
        </p>
      </div>
    );

  if (loading)
    return <LoadingSpinner text="Chargement des demandes immobilières" />;

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: `${theme.separator}20` }}>
      <div className="max-w-7xl mx-auto">
        {/* En-tête responsive */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {isArtisan ? (
                <Building2 className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.primaryDark }} />
              ) : (
                <User className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.primaryDark }} />
              )}
              <h1 className="text-xl md:text-3xl font-bold" style={{ color: theme.logo }}>
                {isArtisan ? "Réservations" : "Mes demandes"}
              </h1>
            </div>
            <p style={{ color: theme.secondaryText }} className="text-sm md:text-base">
              {isArtisan 
                ? "Gérez les réservations de vos propriétés" 
                : "Gérez vos demandes de visite"}
            </p>
            <p className="text-xs md:text-sm mt-1" style={{ color: theme.secondaryText }}>
              <span className="font-semibold" style={{ color: theme.logo }}>
                {demandes.length} demande(s)
              </span>
            </p>
          </div>

          {/* Boutons d'action responsive */}
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button
              onClick={handleExport}
              disabled={filteredDemandes.length === 0}
              className="flex-1 md:flex-none text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: theme.primaryDark,
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = theme.logo;
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = theme.primaryDark;
                }
              }}
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Exporter</span>
              <span className="md:hidden">CSV</span>
            </button>
            <button
              onClick={loadDemandes}
              className="flex-1 md:flex-none text-white px-3 md:px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: theme.secondaryText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#6B240B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.secondaryText;
              }}
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
            <div key={index} className={`${stat.color} rounded-lg md:rounded-xl p-3 md:p-4 border text-center shadow-sm`} style={{ 
              borderColor: theme.separator 
            }}>
              <div className="text-lg md:text-2xl font-bold" style={{ color: theme.logo }}>{stat.value}</div>
              <div className="text-xs md:text-sm" style={{ color: theme.secondaryText }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Barre de recherche responsive */}
        <div className="rounded-lg md:rounded-xl p-3 md:p-4 border mb-4 md:mb-6 shadow-sm" style={{ 
          backgroundColor: theme.lightBg,
          borderColor: theme.separator 
        }}>
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1 w-full relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: theme.secondaryText }} />
              <input
                type="text"
                placeholder={isArtisan ? "Rechercher client, bien..." : "Rechercher bien, date..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-blue-500 text-sm md:text-base"
                style={{ 
                  borderColor: theme.separator,
                  backgroundColor: theme.lightBg,
                  color: theme.logo 
                }}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4" style={{ color: theme.secondaryText }} />
              <span className="text-sm" style={{ color: theme.secondaryText }}>Filtrer:</span>
            </div>
          </div>
        </div>

        {/* Tabs de filtrage responsive */}
        <div className="flex items-center space-x-1 rounded-lg md:rounded-xl p-1 md:p-2 border mb-4 md:mb-8 shadow-sm overflow-x-auto" style={{ 
          backgroundColor: theme.lightBg,
          borderColor: theme.separator 
        }}>
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
                  ? "text-white shadow-md"
                  : "hover:bg-gray-100"
              }`}
              style={activeTab === tab.id ? { 
                backgroundColor: theme.primaryDark 
              } : { 
                color: theme.secondaryText 
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = `${theme.separator}20`;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
              <span className={`px-1.5 md:px-2 py-0.5 md:py-1 text-xs rounded-full ${
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-gray-200"
              }`} style={activeTab !== tab.id ? { color: theme.secondaryText } : {}}>
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
            <div className="rounded-lg md:rounded-2xl border p-6 md:p-12 text-center shadow-sm" style={{ 
              backgroundColor: theme.lightBg,
              borderColor: theme.separator 
            }}>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ 
                backgroundColor: `${theme.separator}20`
              }}>
                {isArtisan ? (
                  <Building className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.secondaryText }} />
                ) : (
                  <Calendar className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme.secondaryText }} />
                )}
              </div>
              <h4 className="text-base md:text-lg font-medium mb-2" style={{ color: theme.logo }}>
                Aucune demande{" "}
                {activeTab !== "all" ? "dans cette catégorie" : isArtisan ? "pour vos biens" : "de visite"}
              </h4>
              <p className="mb-4 md:mb-6 text-sm md:text-base" style={{ color: theme.secondaryText }}>
                {isArtisan 
                  ? "Aucun client n'a encore réservé de visite pour vos propriétés."
                  : "Vous n'avez pas encore demandé de visite pour un bien immobilier."}
              </p>
              {!isArtisan && (
                <Link
                  to="/immobilier"
                  className="text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center gap-2"
                  style={{ 
                    backgroundColor: theme.primaryDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.logo;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primaryDark;
                  }}
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