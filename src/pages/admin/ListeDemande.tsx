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
  ArrowUpDown,
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  User,
  Bell,
  Star,
  Filter,
  Download,
  MoreHorizontal,
  ChevronRight,
  BarChart3,
  Target,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminDemandesService } from "@/services/adminDemandesService";

// Variables CSS pour les couleurs
const colorTheme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

// Composant de carte de demande pour l'admin
const DemandeCardAdmin = ({ demande, onViewDetails, onValidate, onAssign }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "En attente":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-800",
          border: "border-yellow-200",
          icon: "bg-yellow-100 text-yellow-700",
        };
      case "En cours":
        return {
          bg: "bg-blue-50",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: "bg-blue-100 text-blue-700",
        };
      case "Validée":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: "bg-emerald-100 text-emerald-700",
        };
      case "Terminée":
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: "bg-gray-100 text-gray-700",
        };
      case "Refusée":
        return {
          bg: "bg-red-50",
          text: "text-red-800",
          border: "border-red-200",
          icon: "bg-red-100 text-red-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-800",
          border: "border-gray-200",
          icon: "bg-gray-100 text-gray-700",
        };
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Urgent":
        return "text-red-600 bg-red-50 border-red-200";
      case "Moyen":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Faible":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getMetierIcon = (metier) => {
    const iconProps = "w-5 h-5";
    switch (metier) {
      case "Plombier":
        return <Wrench className={iconProps} />;
      case "Électricien":
        return <Zap className={iconProps} />;
      case "Menuisier":
        return <Home className={iconProps} />;
      case "Peintre":
        return <Palette className={iconProps} />;
      default:
        return <Wrench className={iconProps} />;
    }
  };

  const statusColors = getStatusColor(demande.statut);
  const urgencyColors = getUrgencyColor(demande.urgence);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Effet de bordure élégant */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: colorTheme.primaryDark }}
      ></div>

      {/* Header de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2.5 rounded-lg ${statusColors.icon} transition-transform group-hover:scale-110`}>
            {getMetierIcon(demande.metierLabel)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-[#6B8E23] transition-colors duration-200 truncate">
                {demande.titre}
              </h3>
              {demande.nouvelle && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  Nouveau
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${urgencyColors}`}>
                {demande.urgence === "Urgent" && <AlertCircle className="w-3 h-3" />}
                {demande.urgence}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <MapPin className="w-3 h-3" />
                {demande.lieu}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text} ${statusColors.border} border`}>
            {demande.statut}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(demande.date).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {demande.description}
      </p>

      {/* Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span className="font-medium" style={{ color: colorTheme.secondaryText }}>
              {demande.client}
            </span>
          </span>

          <span className="flex items-center gap-1.5">
            <div className="p-1 rounded bg-gray-100">
              {getMetierIcon(demande.metierLabel)}
            </div>
            <span>{demande.metierLabel}</span>
          </span>

          {demande.budget && (
            <span className="flex items-center gap-1.5 font-medium" style={{ color: colorTheme.secondaryText }}>
              <DollarSign className="w-4 h-4" />
              {demande.budget}
            </span>
          )}
        </div>

        <Link
          to={`/admin/messages/${demande.id}`}
          state={{ demande }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 group/btn"
          style={{
            backgroundColor: colorTheme.logo,
            color: 'white'
          }}
        >
          <Eye className="w-4 h-4" />
          <span>Voir détails</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

// Composant de statistiques amélioré
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
    green: {
      bg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      text: "text-emerald-600"
    },
    orange: {
      bg: "bg-gradient-to-br from-amber-500 to-amber-600",
      text: "text-amber-600"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      text: "text-red-600"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-blue-600"
    },
  };

  const IconComponent = icon;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const colors = colorClasses[color] || colorClasses.green;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-2xl font-bold mb-1 ${colors.text}`}>
            {number}
          </div>
          <div className="text-gray-600 text-sm">{label}</div>

          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs ${trend > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              <TrendingUp className={`w-3 h-3 ${trend > 0 ? '' : 'rotate-180'}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <div className={`p-3 rounded-xl ${colors.bg} text-white transition-transform group-hover:scale-110`}>
          <IconComponent className="w-5 h-5" />
        </div>
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${badge.color}`}>
            {badge.icon && <badge.icon className="w-3 h-3" />}
            {badge.text}
          </div>
        </div>
      )}
    </div>
  );
};

// Composant de filtre élégant
const FilterButton = ({ label, count, active, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 border ${active
        ? `text-white border-[#6B8E23] shadow-sm`
        : "text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        }`}
      style={active ? { backgroundColor: colorTheme.logo } : {}}
    >
      {icon && <icon className="w-4 h-4" />}
      <span>{label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
        }`}>
        {count}
      </span>
    </button>
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

  const handleValidateDemande = async (demandeId) => {
    try {
      await adminDemandesService.validateDemande(demandeId);
      await loadDemandes();
    } catch (err) {
      console.error("Erreur lors de la validation:", err);
      setError("Erreur lors de la validation");
    }
  };

  const handleAssignArtisan = async (demandeId, artisanId) => {
    try {
      await adminDemandesService.assignArtisan(demandeId, artisanId);
      await loadDemandes();
    } catch (err) {
      console.error("Erreur lors de l'assignation:", err);
      setError("Erreur lors de l'assignation");
    }
  };

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

  const realTimeStats = useMemo(
    () => [
      {
        number: stats.total?.toString() || "0",
        label: "Total demandes",
        color: "blue",
        icon: FileText,
        badge:
          stats.nouvelles > 0
            ? {
              color: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white",
              text: `${stats.nouvelles} nouvelles`,
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
        trend: 12,
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
              color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
              text: `${stats.urgentes} urgentes`,
              icon: AlertCircle,
            }
            : null,
        loading,
      },
      {
        number: stats.validees?.toString() || "0",
        label: "En cours",
        color: "green",
        icon: CheckCircle,
        trend: 8,
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
      label: "Toutes",
      count: filterCounts["Toutes"],
      icon: FileText,
    },
    {
      key: "En attente",
      label: "En attente",
      count: filterCounts["En attente"],
      icon: Clock,
    },
    {
      key: "En cours",
      label: "En cours",
      count: filterCounts["En cours"],
      icon: Target,
    },
    {
      key: "Validée",
      label: "Validées",
      count: filterCounts["Validée"],
      icon: CheckCircle,
    },
    {
      key: "Terminée",
      label: "Terminées",
      count: filterCounts["Terminée"],
      icon: ShieldCheck,
    },
    {
      key: "Refusée",
      label: "Refusées",
      count: filterCounts["Refusée"],
      icon: AlertCircle,
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colorTheme.lightBg }}>
        <div className="p-6 flex items-center justify-center h-screen">
          <div className="bg-white rounded-xl p-8 text-center max-w-md shadow-lg">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: colorTheme.logo }} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadDemandes}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colorTheme.logo,
                color: 'white'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colorTheme.lightBg }}>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header élégant */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
                  <div>
                    <h1
                      className="text-2xl font-bold"
                      style={{ color: colorTheme.secondaryText }}
                    >
                      Tableau de bord des demandes
                    </h1>
                    <p className="text-gray-600">
                      Gérez et suivez toutes les demandes de services
                    </p>
                  </div>
                  <button className="inline-flex items-center md:ml-96  gap-2 px-4 py-2.5 ml-2  rounded-lg font-medium border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                    <Download className="w-4 h-4" />
                    <span>Exporter</span>
                  </button>
              </div>
            </div>
          </div>

          <div
            className="h-1 w-20 rounded-full mt-2"
            style={{ backgroundColor: colorTheme.primaryDark }}
          ></div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Section de contrôle principale */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, client, ville..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                  style={{
                    focusRingColor: colorTheme.logo,
                    borderColor: colorTheme.separator
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-gray-600">
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm">Trier par:</span>
              </div>
              <select
                className="flex-1 lg:flex-none bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                style={{
                  focusRingColor: colorTheme.logo,
                  borderColor: colorTheme.separator
                }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Date récente</option>
                <option value="urgence">Niveau d'urgence</option>
                <option value="statut">Statut</option>
              </select>
            </div>
          </div>

          {/* Filtres rapides */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <FilterButton
                key={filter.key}
                label={filter.label}
                count={filter.count}
                active={activeFilter === filter.key}
                onClick={() => setActiveFilter(filter.key)}
                icon={filter.icon}
              />
            ))}
          </div>
        </div>

        {/* En-tête de liste */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter === "Toutes"
                ? "Toutes les demandes"
                : `Demandes ${activeFilter.toLowerCase()}`}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDemandes.length} demande{filteredDemandes.length > 1 ? "s" : ""} trouvée
              {filteredDemandes.length > 0 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Tri:{" "}
              <span className="font-medium" style={{ color: colorTheme.secondaryText }}>
                {sortBy === "date"
                  ? "Date récente"
                  : sortBy === "urgence"
                    ? "Urgence"
                    : "Statut"}
              </span>
            </span>
          </div>
        </div>

        {/* Liste des demandes */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
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
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colorTheme.logo + '10' }}
              >
                <Search
                  className="w-10 h-10"
                  style={{ color: colorTheme.logo }}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune demande trouvée
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Aucune demande ne correspond à vos critères de recherche.
                Essayez d'ajuster vos filtres ou votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("Toutes");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colorTheme.logo,
                  color: 'white'
                }}
              >
                <Filter className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDemandesPage;