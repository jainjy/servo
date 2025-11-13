import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Eye,
  Calendar,
  MapPin,
  Wrench,
  Zap,
  Home,
  Palette,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
  FileText,
  DollarSign,
  User,
  Bell,
  Star,
  ThumbsUp,
  ThumbsDown,
  Briefcase,
  ChevronDown,
  X, Check
} from "lucide-react";
import { proAPI } from "../../lib/proApi";

const getStatusColor = (status) => {
  switch (status) {
    case "validée":
      return "bg-green-100 text-green-800 border-green-200";
    case "assignée":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "en cours":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "refusée":
      return "bg-red-100 text-red-800 border-red-200";
    case "en attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "terminée":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "annulée":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "Urgent":
      return "text-red-500";
    case "Moyen":
      return "text-orange-500";
    case "Faible":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
};

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case "Urgent":
      return <AlertCircle className="w-4 h-4" />;
    case "Moyen":
      return <Clock className="w-4 h-4" />;
    case "Faible":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getMetierIcon = (metier) => {
  const metierName =
    typeof metier === "string" ? metier : metier?.libelle || "";
  const metierLower = metierName.toLowerCase();

  if (metierLower.includes("plombier") || metierLower.includes("plomberie"))
    return <Wrench className="w-5 h-5" />;
  if (
    metierLower.includes("électricien") ||
    metierLower.includes("électricité")
  )
    return <Zap className="w-5 h-5" />;
  if (metierLower.includes("menuisier") || metierLower.includes("menuiserie"))
    return <Home className="w-5 h-5" />;
  if (metierLower.includes("peintre") || metierLower.includes("peinture"))
    return <Palette className="w-5 h-5" />;
  return <Briefcase className="w-5 h-5" />;
};

const DemandeCard = ({ demande, onAction }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!confirm("Êtes-vous sûr de vouloir accepter cette demande ?")) return;

    setIsLoading(true);
    try {
      await proAPI.acceptDemande(demande.id);
      onAction(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de l'acceptation:", error);
      alert("Erreur lors de l'acceptation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm("Êtes-vous sûr de vouloir refuser cette demande ?")) return;

    setIsLoading(true);
    try {
      await proAPI.declineDemande(demande.id, "Refusé par l'artisan");
      onAction(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      alert("Erreur lors du refus");
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    // Afficher les boutons seulement si la demande est en attente et que l'artisan n'a pas encore répondu
    if (
      demande.statut === "en attente" &&
      (!demande.assignment || demande.assignment.accepte === null)
    ) {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white lg:px-4 py-2 px-2 text-xs lg:text-lg rounded-sm lg:rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" />
            Refuser
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white lg:px-4 lg:py-2 px-2 py-1 lg:text-lg text-xs rounded-sm lg:rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4" />
            Accepter
          </button>
        </div>
      );
    }

    return (
      <Link
        to={`/pro/messages/${demande.id}`}
        state={{ demande }}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Voir détails
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-lg py-8 lg:py-6 sm:rounded-xl border border-gray-200 p-3 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group relative">
      {/* Badge Nouveau - réduit sur mobile */}
      {demande.nouvelle && (
        <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2">
          <div className="bg-green-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span className="hidden xs:inline">NOUVEAU</span>
            <span className="xs:hidden">NOUVEAU</span>
          </div>
        </div>
      )}

      {/* Badge Urgent - réduit sur mobile */}
      {demande.urgent && (
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
          <div className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-md animate-pulse">
            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">URGENT</span>
            <span className="xs:hidden">URG</span>
          </div>
        </div>
      )}

      {/* Header compact pour mobile */}
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          {/* Icône réduite */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white relative flex-shrink-0">
            {getMetierIcon(demande.metier)}
            {demande.nouvelle && (
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border border-white"></div>
            )}
          </div>

          {/* Contenu texte compact */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-xs lg:text-lg group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {demande.titre}
            </h3>
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2 mt-1">
              <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] lg:text-sm border border-gray-200 w-fit truncate">
                {typeof demande.metier === "string"
                  ? demande.metier
                  : demande.metier?.libelle}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{demande.lieu}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status et urgence empilés sur mobile */}
        <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
          <span
            className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(
              demande.statut
            )}`}
          >
            {demande.statut}
          </span>
          <span
            className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${getUrgencyColor(
              demande.urgence
            )}`}
          >
            {getUrgencyIcon(demande.urgence)}
            {demande.urgence}
          </span>
        </div>
      </div>

      {/* Description réduite */}
      <p className="text-gray-700 text-xs sm:text-base mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
        {demande.description}
      </p>

      {/* Footer compact */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-gray-100">
        {/* Métadonnées empilées sur mobile */}
        <div className="flex lg:flex-row flex-wrap items-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm w-full sm:w-auto justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline">{demande.date}</span>
            <span className="xs:hidden text-[10px]">{new Date(demande.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate max-w-20">{demande.client}</span>
          </span>
          {demande.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm">{demande.budget}</span>
            </span>
          )}
        </div>

        {/* Actions réduites */}
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

const StatsCardPro = ({ number, label, color, icon, badge }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm relative scale-95 sm:scale-100 hover:scale-100 sm:hover:scale-105">
      {badge && (
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
          <div
            className={`${badge.color} text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-lg`}
          >
            {badge.icon && <badge.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            <span className="text-[10px] sm:text-xs">{badge.text}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}
          >
            {number}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-tight">{label}</div>
        </div>
        <div
          className={`p-2.5 sm:p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

const ProDemandesPage = () => {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadDemandes = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        status: activeFilter !== "Toutes" ? activeFilter : undefined,
        search: searchQuery || undefined,
        page,
        limit: pagination.limit,
      };

      const response = await proAPI.getDemandes(params);
      setDemandes(response.data.demandes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      alert("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await proAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des stats:", error);
    }
  };

  useEffect(() => {
    loadDemandes();
    loadStats();
  }, [activeFilter, searchQuery]);

  const handleAction = () => {
    loadDemandes(pagination.page);
    loadStats();
  };

  const sortedDemandes = [...demandes].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "urgence":
        const urgencyOrder = { Urgent: 3, Moyen: 2, Faible: 1 };
        return urgencyOrder[b.urgence] - urgencyOrder[a.urgence];
      case "statut":
        return a.statut.localeCompare(b.statut);
      default:
        return 0;
    }
  });

  // FILTRES BASÉS SUR LES VRAIS STATUTS DE LA BASE
  const filters = [
    { key: "Toutes", label: "Toutes les demandes" },
    { key: "en attente", label: "En attente" },
    { key: "en cours", label: "En cours" },
    { key: "validée", label: "Validées" },
    { key: "refusée", label: "Refusées" },
    { key: "terminée", label: "Terminées" },
  ];

  const realTimeStats = stats
    ? [
      {
        number: stats.total,
        label: "Demandes totales",
        color: "purple",
        icon: FileText,
        badge:
          stats.nouvelles > 0
            ? {
              color: "bg-green-500",
              text: `${stats.nouvelles} nouv.`,
              icon: Bell,
            }
            : null,
      },
      {
        number: stats.disponibles,
        label: "Disponibles",
        color: "green",
        icon: Briefcase,
      },
      {
        number: stats.assignees,
        label: "En attente",
        color: "orange",
        icon: Clock,
      },
      {
        number: stats.validees,
        label: "Validées",
        color: "blue",
        icon: CheckCircle,
      },
    ]
    : [];

  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-0 lg:p-2">
      {/* Header Professionnel */}
      <div className="flex items-center justify-between mb-4 lg:mb-8">
        <div className="flex flex-col md:flex-row items-center gap-1 lg:gap-4">

          <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>

          <p className="text-gray-600">Gérez vos demandes de services</p>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-1 lg:gap-4 mb-8">
        {realTimeStats.map((stat, index) => (
          <StatsCardPro
            key={index}
            number={stat.number}
            label={stat.label}
            color={stat.color}
            icon={stat.icon}
            badge={stat.badge}
          />
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Barre de recherche avec bouton tri intégré sur mobile */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative flex items-center gap-2">
              {/* Input de recherche */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une demande, un client, une ville..."
                  className="w-full pl-10 pr-12 lg:pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Bouton tri mobile - intégré à l'input */}
                <button
                  onClick={() => setIsSortModalOpen(true)}
                  className="lg:hidden absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tri desktop - caché sur mobile */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowUpDown className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold">Trier par :</span>
            </div>

            <div className="relative">
              <select
                className="w-48 bg-white border border-gray-300 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer appearance-none text-gray-700 font-medium bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date" className="bg-white hover:bg-blue-50 text-gray-700 py-2">Date de création</option>
                <option value="urgence" className="bg-white hover:bg-blue-50 text-gray-700 py-2">Niveau d'urgence</option>
                <option value="statut" className="bg-white hover:bg-blue-50 text-gray-700 py-2">Statut de la demande</option>
              </select>

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Modal de tri mobile */}
          {isSortModalOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsSortModalOpen(false)}
              />

              {/* Modal content */}
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Trier par</h3>
                  <button
                    onClick={() => setIsSortModalOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Options de tri */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSortBy('date');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'date'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <span className="font-medium">Date de création</span>
                    {sortBy === 'date' && <Check className="w-5 h-5 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy('urgence');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'urgence'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <span className="font-medium">Niveau d'urgence</span>
                    {sortBy === 'urgence' && <Check className="w-5 h-5 text-blue-600" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy('statut');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'statut'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <span className="font-medium">Statut de la demande</span>
                    {sortBy === 'statut' && <Check className="w-5 h-5 text-blue-600" />}
                  </button>
                </div>

                {/* Bouton d'action */}
                <button
                  onClick={() => setIsSortModalOpen(false)}
                  className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtres rapides */}
        <div className="grid grid-cols-2 lg:flex gap-2 mt-6 justify-start flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border ${activeFilter === filter.key
                ? "bg-blue-100 text-blue-700 border-blue-300 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* En-tête de liste */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeFilter === "Toutes"
            ? "Toutes les demandes"
            : `Demandes ${activeFilter.toLowerCase()}`}
          <span className="text-gray-600 text-sm font-normal ml-2">
            ({pagination.total} demande{pagination.total > 1 ? "s" : ""})
          </span>
        </h2>
        <div className="text-gray-500 text-sm hidden lg:flex items-center gap-1">
          <span>
            Tri:{" "}
            {sortBy === "date"
              ? "Plus récent"
              : sortBy === "urgence"
                ? "Urgence"
                : "Statut"}
          </span>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {loading ? (
          // Squelettes de chargement
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-4">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))
        ) : sortedDemandes.length > 0 ? (
          sortedDemandes.map((demande) => (
            <DemandeCard
              key={demande.id}
              demande={demande}
              onAction={handleAction}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-gray-300 mb-4">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h4 className="text-gray-700 text-lg font-medium mb-2">
              Aucune demande trouvée
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              Aucune demande ne correspond à vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("Toutes");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Search className="w-4 h-4" />
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => loadDemandes(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Précédent
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => loadDemandes(page)}
                className={`px-4 py-2 rounded-lg ${page === pagination.page
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => loadDemandes(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default ProDemandesPage;
