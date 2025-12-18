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
  X, Check,
  Package,
  Users,
  TrendingUp,
  Filter as FilterIcon
} from "lucide-react";
import { proAPI } from "../../lib/proApi";

const getStatusColor = (status) => {
  switch (status) {
    case "validée":
      return "bg-[#6B8E23]/20 text-[#556B2F] border border-[#6B8E23]/30";
    case "assignée":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "en cours":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "refusée":
      return "bg-red-100 text-red-800 border border-red-200";
    case "en attente":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "terminée":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "annulée":
      return "bg-[#D3D3D3] text-[#8B4513] border border-[#D3D3D3]";
    default:
      return "bg-[#D3D3D3] text-[#8B4513] border border-[#D3D3D3]";
  }
};

const getUrgencyColor = (urgency) => {
  switch (urgency) {
    case "Urgent":
      return "text-red-500";
    case "Moyen":
      return "text-amber-500";
    case "Faible":
      return "text-[#6B8E23]";
    default:
      return "text-[#8B4513]";
  }
};

const getUrgencyIcon = (urgency) => {
  switch (urgency) {
    case "Urgent":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "Moyen":
      return <Clock className="w-4 h-4 text-amber-500" />;
    case "Faible":
      return <CheckCircle className="w-4 h-4 text-[#6B8E23]" />;
    default:
      return <Clock className="w-4 h-4 text-[#8B4513]" />;
  }
};

const getMetierIcon = (metier) => {
  const metierName =
    typeof metier === "string" ? metier : metier?.libelle || "";
  const metierLower = metierName.toLowerCase();

  if (metierLower.includes("plombier") || metierLower.includes("plomberie"))
    return <Wrench className="w-5 h-5 text-[#6B8E23]" />;
  if (
    metierLower.includes("électricien") ||
    metierLower.includes("électricité")
  )
    return <Zap className="w-5 h-5 text-[#6B8E23]" />;
  if (metierLower.includes("menuisier") || metierLower.includes("menuiserie"))
    return <Home className="w-5 h-5 text-[#6B8E23]" />;
  if (metierLower.includes("peintre") || metierLower.includes("peinture"))
    return <Palette className="w-5 h-5 text-[#6B8E23]" />;
  return <Briefcase className="w-5 h-5 text-[#8B4513]" />;
};

const DemandeCard = ({ demande, onAction }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    if (!confirm("Êtes-vous sûr de vouloir accepter cette demande ?")) return;

    setIsLoading(true);
    try {
      await proAPI.acceptDemande(demande.id);
      onAction();
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
      onAction();
    } catch (error) {
      console.error("Erreur lors du refus:", error);
      alert("Erreur lors du refus");
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (
      demande.statut === "en attente" &&
      (!demande.assignment || demande.assignment.accepte === null)
    ) {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleDecline}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white lg:px-4 py-2 px-2 text-xs lg:text-sm rounded-sm lg:rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" />
            Refuser
          </button>
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="bg-[#6B8E23] hover:bg-[#556B2F] text-white lg:px-4 lg:py-2 px-2 py-1 lg:text-sm text-xs rounded-sm lg:rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
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
        className="bg-[#8B4513] hover:bg-[#556B2F] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        Voir détails
      </Link>
    );
  };

  return (
    <div className="bg-white rounded-lg py-8 lg:py-6 sm:rounded-xl border border-[#D3D3D3] p-3 sm:p-6 hover:border-[#6B8E23] hover:shadow-lg transition-all duration-300 group relative">
      {/* Badge Nouveau */}
      {demande.nouvelle && (
        <div className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2">
          <div className="bg-[#6B8E23] text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-md">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            <span className="hidden xs:inline">NOUVEAU</span>
            <span className="xs:hidden">NOUV</span>
          </div>
        </div>
      )}

      {/* Badge Urgent */}
      {demande.urgent && (
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2">
          <div className="bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 shadow-md animate-pulse">
            <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">URGENT</span>
            <span className="xs:hidden">URG</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
        <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#6B8E23]/10 flex items-center justify-center text-[#6B8E23] relative flex-shrink-0 border border-[#D3D3D3]">
            {getMetierIcon(demande.metier)}
            {demande.nouvelle && (
              <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 bg-[#6B8E23] rounded-full border border-white"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[#8B4513] text-xs lg:text-lg group-hover:text-[#6B8E23] transition-colors duration-200 line-clamp-2">
              {demande.titre}
            </h3>
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2 mt-1">
              <span className="bg-[#6B8E23]/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] lg:text-sm border border-[#D3D3D3] w-fit truncate text-[#556B2F]">
                {typeof demande.metier === "string"
                  ? demande.metier
                  : demande.metier?.libelle}
              </span>
              <span className="flex items-center gap-1 text-[#8B4513]/70 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{demande.lieu}</span>
              </span>
            </div>
          </div>
        </div>

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

      {/* Description */}
      <p className="text-[#8B4513]/80 text-xs sm:text-base mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
        {demande.description}
      </p>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 pt-3 sm:pt-4 border-t border-[#D3D3D3]">
        <div className="flex lg:flex-row flex-wrap items-center gap-2 sm:gap-4 text-[#8B4513]/60 text-xs sm:text-sm w-full sm:w-auto justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-[#8B4513]/60" />
            <span className="hidden xs:inline">{demande.date}</span>
            <span className="xs:hidden text-[10px]">{new Date(demande.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-[#8B4513]/60" />
            <span className="truncate max-w-20">{demande.client}</span>
          </span>
          {demande.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-[#8B4513]/60" />
              <span className="text-[10px] sm:text-sm text-[#556B2F] font-medium">{demande.budget}</span>
            </span>
          )}
        </div>

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
    green: "from-[#6B8E23] to-[#556B2F]",
    orange: "from-amber-500 to-amber-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  const bgColorClasses = {
    blue: "bg-blue-100",
    green: "bg-[#6B8E23]/10",
    orange: "bg-amber-100",
    purple: "bg-purple-100",
    red: "bg-red-100",
  };

  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl p-3 sm:p-6 border border-[#D3D3D3] hover:border-[#6B8E23] transition-all duration-300 group shadow-sm relative scale-95 sm:scale-100 hover:scale-100 sm:hover:scale-105">
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
          <div className="text-[#8B4513]/70 text-xs sm:text-sm mt-0.5 sm:mt-1 leading-tight">{label}</div>
        </div>
        <div
          className={`p-2.5 sm:p-3 rounded-lg ${bgColorClasses[color]} text-[#8B4513] group-hover:scale-110 transition-transform duration-300`}
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

  const filters = [
    { key: "Toutes", label: "Toutes" },
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
          label: "Total",
          color: "purple",
          icon: Package,
          badge:
            stats.nouvelles > 0
              ? {
                  color: "bg-[#6B8E23]",
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#6B8E23]/5 p-0 lg:p-2">
      {/* Header */}
      <div className="mb-4 lg:mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-1.5 bg-[#556B2F] rounded-full"></div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#8B4513]">
            Mes demandes
          </h1>
        </div>
        <p className="text-[#8B4513]/70">
          Gérez vos demandes de services
        </p>
      </div>

      {/* Statistiques */}
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
      <div className="bg-white rounded-xl p-6 border border-[#D3D3D3] mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Barre de recherche */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une demande, un client, une ville..."
                  className="w-full pl-10 pr-12 lg:pr-4 py-3 rounded-xl bg-[#6B8E23]/5 border border-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent transition-all duration-200 text-[#8B4513]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Bouton tri mobile */}
                <button
                  onClick={() => setIsSortModalOpen(true)}
                  className="lg:hidden absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#8B4513]/60 hover:text-[#6B8E23] hover:bg-[#6B8E23]/10 rounded-lg transition-colors duration-200"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bouton filtre mobile */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[#6B8E23] text-white rounded-xl font-medium"
          >
            <FilterIcon className="w-4 h-4" />
            Filtres
          </button>

          {/* Tri desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-[#8B4513]">
              <ArrowUpDown className="w-4 h-4 text-[#6B8E23]" />
              <span className="text-sm font-semibold">Trier par :</span>
            </div>

            <div className="relative">
              <select
                className="w-48 bg-white border border-[#D3D3D3] px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer appearance-none text-[#8B4513] font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date" className="bg-white hover:bg-[#6B8E23]/10 text-[#8B4513] py-2">Date de création</option>
                <option value="urgence" className="bg-white hover:bg-[#6B8E23]/10 text-[#8B4513] py-2">Niveau d'urgence</option>
                <option value="statut" className="bg-white hover:bg-[#6B8E23]/10 text-[#8B4513] py-2">Statut de la demande</option>
              </select>

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-[#8B4513]/60" />
              </div>
            </div>
          </div>

          {/* Modal de tri mobile */}
          {isSortModalOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-[#8B4513]/80 backdrop-blur-sm"
                onClick={() => setIsSortModalOpen(false)}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-6 animate-slide-up border border-[#D3D3D3]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-[#8B4513]">Trier par</h3>
                  <button
                    onClick={() => setIsSortModalOpen(false)}
                    className="p-2 text-[#8B4513]/60 hover:text-[#8B4513]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setSortBy('date');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'date'
                      ? 'bg-[#6B8E23]/10 border-[#6B8E23] text-[#556B2F]'
                      : 'bg-[#6B8E23]/5 border-[#D3D3D3] text-[#8B4513] hover:border-[#6B8E23]'
                      }`}
                  >
                    <span className="font-medium">Date de création</span>
                    {sortBy === 'date' && <Check className="w-5 h-5 text-[#6B8E23]" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy('urgence');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'urgence'
                      ? 'bg-[#6B8E23]/10 border-[#6B8E23] text-[#556B2F]'
                      : 'bg-[#6B8E23]/5 border-[#D3D3D3] text-[#8B4513] hover:border-[#6B8E23]'
                      }`}
                  >
                    <span className="font-medium">Niveau d'urgence</span>
                    {sortBy === 'urgence' && <Check className="w-5 h-5 text-[#6B8E23]" />}
                  </button>

                  <button
                    onClick={() => {
                      setSortBy('statut');
                      setIsSortModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${sortBy === 'statut'
                      ? 'bg-[#6B8E23]/10 border-[#6B8E23] text-[#556B2F]'
                      : 'bg-[#6B8E23]/5 border-[#D3D3D3] text-[#8B4513] hover:border-[#6B8E23]'
                      }`}
                  >
                    <span className="font-medium">Statut de la demande</span>
                    {sortBy === 'statut' && <Check className="w-5 h-5 text-[#6B8E23]" />}
                  </button>
                </div>

                <button
                  onClick={() => setIsSortModalOpen(false)}
                  className="w-full mt-6 py-3 bg-[#6B8E23] text-white rounded-xl font-semibold hover:bg-[#556B2F] transition-colors duration-200"
                >
                  Appliquer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtres mobiles */}
        {showMobileFilters && (
          <div className="lg:hidden grid grid-cols-2 gap-2 mt-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key);
                  setShowMobileFilters(false);
                }}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center border ${activeFilter === filter.key
                  ? "bg-[#6B8E23] text-white border-[#6B8E23] shadow-md"
                  : "bg-white text-[#8B4513] border-[#D3D3D3] hover:border-[#6B8E23]"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* Filtres desktop */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-6 gap-2 mt-6">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center border ${activeFilter === filter
                ? "bg-[#6B8E23] text-white border-[#6B8E23] shadow-md"
                : "bg-white text-[#8B4513] border-[#D3D3D3] hover:border-[#6B8E23] hover:bg-[#6B8E23]/5"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* En-tête de liste */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h2 className="text-xl font-semibold text-[#8B4513]">
            {activeFilter === "Toutes"
              ? "Toutes les demandes"
              : `Demandes ${activeFilter.toLowerCase()}`}
            <span className="text-[#8B4513]/60 text-sm font-normal ml-2">
              ({pagination.total} demande{pagination.total > 1 ? "s" : ""})
            </span>
          </h2>
          <p className="text-sm text-[#8B4513]/50 sm:hidden">
            Tri:{" "}
            {sortBy === "date"
              ? "Plus récent"
              : sortBy === "urgence"
              ? "Urgence"
              : "Statut"}
          </p>
        </div>
        <div className="text-[#8B4513]/50 text-sm hidden sm:flex items-center gap-1">
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
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#D3D3D3] p-6 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D3D3D3]"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#D3D3D3] rounded w-32"></div>
                    <div className="h-3 bg-[#D3D3D3] rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-[#D3D3D3] rounded w-20"></div>
                  <div className="h-4 bg-[#D3D3D3] rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-[#D3D3D3] rounded mb-4"></div>
              <div className="flex justify-between items-center pt-4">
                <div className="flex gap-4">
                  <div className="h-3 bg-[#D3D3D3] rounded w-16"></div>
                  <div className="h-3 bg-[#D3D3D3] rounded w-20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-[#D3D3D3] rounded w-20"></div>
                  <div className="h-8 bg-[#D3D3D3] rounded w-8"></div>
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
          <div className="bg-white rounded-2xl border border-[#D3D3D3] p-12 text-center shadow-sm">
            <div className="text-[#D3D3D3] mb-4">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h4 className="text-[#8B4513] text-lg font-medium mb-2">
              Aucune demande trouvée
            </h4>
            <p className="text-[#8B4513]/60 text-sm mb-6">
              Aucune demande ne correspond à vos critères de recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("Toutes");
              }}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white px-6 py-2 rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
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
            className="px-4 py-2 bg-white border border-[#D3D3D3] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] text-[#8B4513]"
          >
            Précédent
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => loadDemandes(page)}
                className={`px-4 py-2 rounded-lg ${page === pagination.page
                  ? "bg-[#6B8E23] text-white"
                  : "bg-white border border-[#D3D3D3] hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] text-[#8B4513]"
                  }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => loadDemandes(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 bg-white border border-[#D3D3D3] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#6B8E23]/5 hover:border-[#6B8E23] text-[#8B4513]"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
};

export default ProDemandesPage;