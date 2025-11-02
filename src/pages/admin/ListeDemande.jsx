import React, { useState, useMemo, useEffect } from "react";
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
  MoreVertical,
  ArrowUpDown,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  User,
  Bell,
  Star,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminDemandesService } from "@/services/adminDemandesService";

// Composant de carte de demande pour l'admin
const DemandeCardAdmin = ({ demande, onViewDetails, onValidate, onAssign }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "En cours":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Validée":
        return "bg-green-100 text-green-800 border-green-200";
      case "Terminée":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Refusée":
        return "bg-red-100 text-red-800 border-red-200";
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
    switch (metier) {
      case "Plombier":
        return <Wrench className="w-5 h-5" />;
      case "Électricien":
        return <Zap className="w-5 h-5" />;
      case "Menuisier":
        return <Home className="w-5 h-5" />;
      case "Peintre":
        return <Palette className="w-5 h-5" />;
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group relative">
      {/* Badge Nouveau */}
      {demande.nouvelle && (
        <div className="absolute -top-2 -left-2">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            NOUVEAU
          </div>
        </div>
      )}

      {/* Badge Urgent */}
      {demande.urgent && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <AlertCircle className="w-3 h-3" />
            URGENT
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white relative">
            {getMetierIcon(demande.metierLabel)}
            {demande.nouvelle && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
              {demande.titre}
            </h3>
            <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                {demande.metierLabel}
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                {demande.lieu}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              demande.statut
            )}`}
          >
            {demande.statut}
          </span>
          <span
            className={`text-sm font-medium flex items-center gap-1 ${getUrgencyColor(
              demande.urgence
            )}`}
          >
            {getUrgencyIcon(demande.urgence)}
            {demande.urgence}
          </span>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
        {demande.description}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {demande.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {demande.client}
          </span>
          {demande.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {demande.budget}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* {demande.statut === 'En attente' && (
            <>
              <button
                onClick={() => onValidate(demande.id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Valider
              </button>
              <button
                onClick={() => onAssign(demande.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Assigner
              </button>
            </>
          )} */}
          <Link
            to={`/messages/${demande.id}`}
            state={{ demande }}
            className="bg-gray-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 group/btn"
          >
            <Eye className="w-4 h-4" />
            Détails
          </Link>
        </div>
      </div>
    </div>
  );
};

// Composant de statistiques pour l'admin
const StatsCardAdmin = ({
  number,
  label,
  color,
  icon,
  trend,
  badge,
  loading,
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  const IconComponent = icon;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm relative">
      {badge && (
        <div className="absolute -top-2 -right-2">
          <div
            className={`${badge.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg`}
          >
            {badge.icon && <badge.icon className="w-3 h-3" />}
            {badge.text}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <div
            className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}
          >
            {number}
          </div>
          <div className="text-gray-600 text-sm mt-1">{label}</div>
          {trend && (
            <div
              className={`text-xs mt-1 flex items-center gap-1 ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-3 h-3 ${trend > 0 ? "" : "rotate-180"}`}
              />
              {Math.abs(trend)}% vs mois dernier
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Page principale Admin
const AdminDemandesPage = () => {
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données
  const loadDemandes = async () => {
    try {
      setLoading(true);
      const filters = {
        status: activeFilter !== "Toutes" ? activeFilter : undefined,
        search: searchQuery || undefined,
        limit: 50,
      };

      const [demandesData, statsData] = await Promise.all([
        adminDemandesService.getDemandes(filters),
        adminDemandesService.getStats(),
      ]);

      setDemandes(demandesData.demandes);
      setStats(statsData);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, [activeFilter, searchQuery]);

  // Gérer la validation d'une demande
  const handleValidateDemande = async (demandeId) => {
    try {
      await adminDemandesService.validateDemande(demandeId);
      // Recharger les données
      await loadDemandes();
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      setError("Erreur lors de la validation");
    }
  };

  // Gérer l'assignation d'un artisan
  const handleAssignArtisan = async (demandeId) => {
    // Implémentez la logique d'assignation ici
    console.log("Assigner artisan pour la demande:", demandeId);
    // Vous pouvez ouvrir un modal pour sélectionner l'artisan
  };

  // Calcul des statistiques en temps réel basées sur les données filtrées
  const filteredDemandes = useMemo(() => {
    return demandes.filter((demande) => {
      const matchesFilter =
        activeFilter === "Toutes" || demande.statut === activeFilter;
      const matchesSearch =
        demande.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demande.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demande.lieu.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [demandes, activeFilter, searchQuery]);

  // Calcul des compteurs pour les filtres
  const filterCounts = useMemo(() => {
    const counts = {
      Toutes: demandes.length,
      "En attente": demandes.filter((d) => d.statut === "En attente").length,
      "En cours": demandes.filter((d) => d.statut === "En cours").length,
      Validée: demandes.filter((d) => d.statut === "Validée").length,
      Terminée: demandes.filter((d) => d.statut === "Terminée").length,
      Refusée: demandes.filter((d) => d.statut === "Refusée").length,
    };
    return counts;
  }, [demandes]);

  // Statistiques en temps réel basées sur les données filtrées
  const realTimeStats = useMemo(
    () => [
      {
        number: stats.total?.toString() || "0",
        label: "Total demandes",
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
        loading,
      },
      {
        number: stats.enAttente?.toString() || "0",
        label: "En attente",
        color: "orange",
        icon: Clock,
        loading,
      },
      {
        number: stats.urgentes?.toString() || "0",
        label: "Urgentes",
        color: "red",
        icon: AlertTriangle,
        badge:
          stats.urgentes > 0
            ? {
                color: "bg-red-500",
                text: `${stats.urgentes} urg.`,
                icon: AlertCircle,
              }
            : null,
        loading,
      },
      {
        number: stats.validees?.toString() || "0",
        label: "en cours",
        color: "green",
        icon: CheckCircle,
        loading,
      },
    ],
    [stats, loading]
  );

  const sortedDemandes = useMemo(() => {
    return [...filteredDemandes].sort((a, b) => {
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
  }, [filteredDemandes, sortBy]);

  const filters = [
    {
      key: "Toutes",
      label: "Toutes les demandes",
      count: filterCounts["Toutes"],
    },
    {
      key: "En attente",
      label: "En attente",
      count: filterCounts["En attente"],
    },
    { key: "En cours", label: "En cours", count: filterCounts["En cours"] },
    { key: "Validée", label: "Validées", count: filterCounts["Validée"] },
    { key: "Terminée", label: "Terminées", count: filterCounts["Terminée"] },
    { key: "Refusée", label: "Refusées", count: filterCounts["Refusée"] },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDemandes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Admin */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des demandes
          </h1>
          <p className="text-gray-600 mt-2">
            Administration de toutes les demandes clients
          </p>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {realTimeStats.map((stat, index) => (
          <StatsCardAdmin
            key={index}
            number={stat.number}
            label={stat.label}
            color={stat.color}
            icon={stat.icon}
            trend={stat.trend}
            badge={stat.badge}
            loading={stat.loading}
          />
        ))}
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          {/* Barre de recherche */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une demande, un client, une ville..."
                className="w-full lg:w-96 pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tri */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <ArrowUpDown className="w-4 h-4" />
              <span className="text-sm">Trier par:</span>
            </div>
            <select
              className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="urgence">Urgence</option>
              <option value="statut">Statut</option>
            </select>
          </div>
        </div>

        {/* Filtres rapides avec compteurs en temps réel */}
        <div className="flex gap-2 mt-6 justify-start flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border ${
                activeFilter === filter.key
                  ? "bg-blue-100 text-blue-700 border-blue-300 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {filter.label}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  activeFilter === filter.key
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
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
            ({filteredDemandes.length} demande
            {filteredDemandes.length > 1 ? "s" : ""})
          </span>
        </h2>
        <div className="text-gray-500 text-sm flex items-center gap-1">
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
          // Squelette de chargement
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))
        ) : sortedDemandes.length > 0 ? (
          sortedDemandes.map((demande) => (
            <DemandeCardAdmin
              key={demande.id}
              demande={demande}
              onValidate={handleValidateDemande}
              onAssign={handleAssignArtisan}
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
    </div>
  );
};

export default AdminDemandesPage;
