import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  BarChart,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Shield,
  AlertCircle,
} from "lucide-react";
import ActivityCardAdmin from "./ActivityCardAdmin";
import AjoutActiviteModal from "./AjoutActiviteModal";
import ActivityDetailModal from "./ActivityDetailModal"; // Utilisez votre modal existante
import { api } from "@/lib/axios";
import { toast } from "sonner";

const ActivitiesListAdmin = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // États pour les modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' ou 'list'

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);

  // Charger les activités
  const loadActivities = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "all" ? statusFilter : undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        featured:
          featuredFilter !== "all" ? featuredFilter === "featured" : undefined,
        search: searchTerm || undefined,
        sortBy,
        sortOrder,
      };

      const response = await api.get("/activities", { params });

      if (response.data.success) {
        setActivities(response.data.data);
        setFilteredActivities(response.data.data);
        setTotalItems(
          response.data.pagination?.total || response.data.data.length,
        );
      }
    } catch (error) {
      console.error("Erreur chargement activités:", error);
      toast.error("Erreur lors du chargement des activités");
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories
  const loadCategories = async () => {
    try {
      const response = await api.get("/ActivityCategory/public");
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
    }
  };

  useEffect(() => {
    loadActivities();
    loadCategories();
  }, [
    currentPage,
    statusFilter,
    categoryFilter,
    featuredFilter,
    sortBy,
    sortOrder,
  ]);

  // Filtrer localement pour la recherche instantanée
  useEffect(() => {
    let results = activities;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (activity) =>
          activity.title.toLowerCase().includes(term) ||
          activity.description.toLowerCase().includes(term) ||
          activity.location?.toLowerCase().includes(term),
      );
    }

    setFilteredActivities(results);
  }, [searchTerm, activities]);

  // Gestion des actions
  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowDetailModal(true);
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setShowAddModal(true);
  };

  const handleDelete = async (activityId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return;
    }

    try {
      const response = await api.delete(`/activities/${activityId}`);
      if (response.data.success) {
        toast.success("Activité supprimée avec succès");
        loadActivities();
      }
    } catch (error) {
      console.error("Erreur suppression activité:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (activityId, newStatus) => {
    try {
      const response = await api.put(`/activities/${activityId}/publish`, {
        publish: newStatus === "active",
      });

      if (response.data.success) {
        toast.success(
          `Activité ${newStatus === "active" ? "publiée" : "mise en brouillon"}`,
        );
        loadActivities();
      }
    } catch (error) {
      console.error("Erreur changement statut:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleSuccess = () => {
    loadActivities();
    setShowAddModal(false);
    setEditingActivity(null);
  };

  // Calculs de pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    filteredActivities.length,
  );

  return (
    <div className="space-y-6">
      {/* Header avec statistiques et actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Activités
            </h1>
            <p className="text-gray-600 mt-1">
              {totalItems} activité{totalItems !== 1 ? "s" : ""} au total
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Bouton Ajouter */}
            {user?.role === "professional" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nouvelle activité
              </button>
            )}

            {/* Bouton Rafraîchir */}
            <button
              onClick={loadActivities}
              className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Rafraîchir"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="draft">Brouillons</option>
            <option value="inactive">Inactives</option>
            <option value="archived">Archivées</option>
          </select>

          {/* Filtre Catégorie */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes catégories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* Filtre Vedette */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes</option>
            <option value="featured">En vedette</option>
            <option value="not-featured">Non vedette</option>
          </select>
        </div>

        {/* Tri et vue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt">Date de création</option>
              <option value="title">Titre</option>
              <option value="price">Prix</option>
              <option value="rating">Note</option>
              <option value="bookingCount">Réservations</option>
            </select>

            <button
              onClick={() =>
                setSortOrder(sortOrder === "desc" ? "asc" : "desc")
              }
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {sortOrder === "desc" ? "↓ Décroissant" : "↑ Croissant"}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Vue grille"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Vue liste"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement des activités...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
            <Search className="w-12 h-12 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucune activité trouvée
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "Aucun résultat ne correspond à vos critères de recherche."
              : "Commencez par créer votre première activité."}
          </p>
          {user?.role === "professional" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Créer une activité
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        /* Vue Grille */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.slice(startIndex, endIndex).map((activity) => (
            <ActivityCardAdmin
              key={activity.id}
              activity={activity}
              user={user}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        /* Vue Liste */
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Activité
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Réservations
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities
                .slice(startIndex, endIndex)
                .map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {activity.mainImage ? (
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={activity.mainImage}
                              alt={activity.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {activity.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {activity.category?.name || "Non catégorisée"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(activity.status)}`}
                      >
                        {getStatusLabel(activity.status)}
                      </span>
                      {activity.featured && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          Vedette
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {activity.price || 0}€
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {activity.bookingCount || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.reviewCount || 0} avis
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(activity)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user?.role === "professional" && (
                          <>
                            <button
                              onClick={() => handleEdit(activity)}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleStatus(
                                  activity.id,
                                  activity.status === "active"
                                    ? "draft"
                                    : "active",
                                )
                              }
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                              title={
                                activity.status === "active"
                                  ? "Mettre en brouillon"
                                  : "Publier"
                              }
                            >
                              {activity.status === "active" ? (
                                <Shield className="w-4 h-4" />
                              ) : (
                                <AlertCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {filteredActivities.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-200">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-semibold">{startIndex + 1}</span>{" "}
            à <span className="font-semibold">{endIndex}</span> sur{" "}
            <span className="font-semibold">{totalItems}</span> activités
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AjoutActiviteModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setEditingActivity(null);
          }}
          onSubmit={handleSuccess}
          editingActivity={editingActivity}
          categories={categories}
        />
      )}

      {showDetailModal && selectedActivity && (
        <ActivityDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          activity={selectedActivity}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// Fonctions utilitaires pour le style (à inclure dans le même fichier)
const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "archived":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "Active";
    case "draft":
      return "Brouillon";
    case "inactive":
      return "Inactive";
    case "archived":
      return "Archivée";
    default:
      return "Inconnu";
  }
};

export default ActivitiesListAdmin;
