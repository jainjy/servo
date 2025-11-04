import React, { useState, useEffect } from "react";
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
  ThumbsUp,
  ThumbsDown,
  Send,
  Briefcase,
} from "lucide-react";
import { proAPI } from "../../lib/proApi";

const getStatusColor = (status) => {
  switch (status) {
    case "Disponible":
      return "bg-green-100 text-green-800 border-green-200";
    case "Assignée":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Validée":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Refusée":
      return "bg-red-100 text-red-800 border-red-200";
    case "En attente":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
  // Si metier est un objet, extraire le libelle
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
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [devisPrice, setDevisPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!applicationMessage.trim()) {
      alert("Veuillez ajouter un message de motivation");
      return;
    }

    setIsLoading(true);
    try {
      await proAPI.applyToDemande(demande.id, {
        message: applicationMessage,
        devis: devisPrice || null,
      });
      setShowApplyModal(false);
      setApplicationMessage("");
      setDevisPrice("");
      onAction(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur lors de la postulation:", error);
      alert("Erreur lors de la postulation");
    } finally {
      setIsLoading(false);
    }
  };

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
    switch (demande.statut) {
      case "Disponible":
        return (
          <button
            onClick={() => setShowApplyModal(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Postuler
          </button>
        );

      // case "Assignée":
      //   return (
      //     <div className="flex gap-2">
      //       <button
      //         onClick={handleAccept}
      //         disabled={isLoading}
      //         className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
      //       >
      //         <ThumbsUp className="w-4 h-4" />
      //         Accepter
      //       </button>
      //       <button
      //         onClick={handleDecline}
      //         disabled={isLoading}
      //         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
      //       >
      //         <ThumbsDown className="w-4 h-4" />
      //         Refuser
      //       </button>
      //     </div>
      //   );

      // case "Validée":
      //   return (
      //     <Link
      //       to={`/pro/messages/${demande.id}`}
      //       state={{ demande }}
      //       className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
      //     >
      //       <Eye className="w-4 h-4" />
      //       Voir détails
      //     </Link>
      //   );

      default:
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
    }
  };

  return (
    <>
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
              {getMetierIcon(demande.metier)}
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
                  {typeof demande.metier === "string"
                    ? demande.metier
                    : demande.metier?.libelle}
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
            {renderActionButtons()}
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all duration-200">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de postulation */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Postuler à la demande
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message de motivation
                </label>
                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Présentez-vous et expliquez pourquoi vous êtes le bon professionnel pour ce travail..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devis estimatif (optionnel)
                </label>
                <input
                  type="number"
                  value={devisPrice}
                  onChange={(e) => setDevisPrice(e.target.value)}
                  placeholder="Montant en €"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApply}
                disabled={isLoading || !applicationMessage.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? "Envoi..." : "Postuler"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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

  useEffect(() => {
    loadDemandes(1);
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
    { key: "Toutes", label: "Toutes les demandes" },
    { key: "Disponible", label: "Disponibles" },
    { key: "Assignée", label: "En attente" },
    { key: "Validée", label: "Validées" },
    { key: "Refusée", label: "Refusées" },
  ];

  const realTimeStats = stats
    ? [
        {
          number: stats.total.toString(),
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
          number: stats.disponibles.toString(),
          label: "Disponibles",
          color: "green",
          icon: Briefcase,
        },
        {
          number: stats.assignees.toString(),
          label: "En attente",
          color: "orange",
          icon: Clock,
        },
        {
          number: stats.validees.toString(),
          label: "Validées",
          color: "blue",
          icon: CheckCircle,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Professionnel */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative">
            <h1 className="text-3xl font-bold text-gray-900">Mes demandes</h1>
          </div>
          <p className="text-gray-600">Gérez vos demandes de services</p>
        </div>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

        {/* Filtres rapides */}
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
                className={`px-4 py-2 rounded-lg ${
                  page === pagination.page
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
