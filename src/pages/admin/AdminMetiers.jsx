import { useState, useEffect, useCallback } from "react";
import MetierForm from "../../components/admin/MetierForm";
import metierService from "../../services/metierService";

const AdminMetiers = () => {
  const [metiers, setMetiers] = useState([]);
  const [filteredMetiers, setFilteredMetiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMetier, setEditingMetier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("libelle");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    metier: null,
  });
  const [selectedMetiers, setSelectedMetiers] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");

  // Charger les métiers
  const loadMetiers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await metierService.getAllMetiers();
      setMetiers(data);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des métiers");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetiers();
  }, [loadMetiers]);

  // Filtrer et trier les métiers
  useEffect(() => {
    let result = [...metiers];

    if (searchTerm) {
      result = result.filter(
        (metier) =>
          metier.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          metier.id.toString().includes(searchTerm)
      );
    }

    result.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "services":
          aValue = a.services.length;
          bValue = b.services.length;
          break;
        case "users":
          aValue = a.users.length;
          bValue = b.users.length;
          break;
        default:
          aValue = a.libelle.toLowerCase();
          bValue = b.libelle.toLowerCase();
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredMetiers(result);
  }, [metiers, searchTerm, sortBy, sortOrder]);

  // Gestion des messages
  const showMessage = useCallback((message, type = "success") => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(message);
    }
  }, []);

  // CRUD Operations
  const handleCreateMetier = async (metierData) => {
    try {
      setFormLoading(true);
      setError("");
      await metierService.createMetier(metierData);
      await loadMetiers();
      setShowFormModal(false);
      showMessage("Métier créé avec succès !");
    } catch (err) {
      setError(err.message || "Erreur lors de la création du métier");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMetier = async (metierData) => {
    try {
      setFormLoading(true);
      setError("");
      await metierService.updateMetier(editingMetier.id, metierData);
      await loadMetiers();
      setShowFormModal(false);
      setEditingMetier(null);
      showMessage("Métier mis à jour avec succès !");
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du métier");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMetier = async (id) => {
    try {
      setError("");
      await metierService.deleteMetier(id);
      await loadMetiers();
      setDeleteModal({ isOpen: false, metier: null });
      showMessage("Métier supprimé avec succès !");
    } catch (err) {
      setError(err.message || "Erreur lors de la suppression du métier");
    }
  };

  const confirmDelete = (metier) => {
    if (metier.services.length > 0 || metier.users.length > 0) {
      showMessage(
        "Impossible de supprimer un métier avec des services ou utilisateurs associés",
        "error"
      );
      return;
    }
    setDeleteModal({ isOpen: true, metier });
  };

  // Gestion des sélections multiples
  const toggleSelectMetier = (metierId) => {
    const newSelected = new Set(selectedMetiers);
    if (newSelected.has(metierId)) {
      newSelected.delete(metierId);
    } else {
      newSelected.add(metierId);
    }
    setSelectedMetiers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedMetiers.size === filteredMetiers.length) {
      setSelectedMetiers(new Set());
    } else {
      setSelectedMetiers(new Set(filteredMetiers.map((m) => m.id)));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedMetiers.size === 0) return;

    if (bulkAction === "delete") {
      const hasDependencies = filteredMetiers.some(
        (metier) =>
          selectedMetiers.has(metier.id) &&
          (metier.services.length > 0 || metier.users.length > 0)
      );
      if (hasDependencies) {
        showMessage(
          "Certains métiers sélectionnés ont des dépendances et ne peuvent pas être supprimés",
          "error"
        );
        return;
      }

      if (
        window.confirm(
          `Êtes-vous sûr de vouloir supprimer ${selectedMetiers.size} métier(s) ?`
        )
      ) {
        try {
          await Promise.all(
            Array.from(selectedMetiers).map((id) =>
              metierService.deleteMetier(id)
            )
          );
          await loadMetiers();
          setSelectedMetiers(new Set());
          setBulkAction("");
          showMessage(
            `${selectedMetiers.size} métier(s) supprimé(s) avec succès !`
          );
        } catch {
          showMessage("Erreur lors de la suppression en masse", "error");
        }
      }
    }
  };

  // Gestion du formulaire modal
  const handleAddNewClick = () => {
    setEditingMetier(null);
    setShowFormModal(true);
    setError("");
  };

  const handleEditClick = (metier) => {
    setEditingMetier(metier);
    setShowFormModal(true);
    setError("");
  };

  const handleCancelForm = () => {
    setShowFormModal(false);
    setEditingMetier(null);
    setError("");
  };

  const handleSubmitForm = (metierData) => {
    if (editingMetier) {
      handleUpdateMetier(metierData);
    } else {
      handleCreateMetier(metierData);
    }
  };

  // Statistiques
  const stats = {
    total: metiers.length,
    withServices: metiers.filter((m) => m.services.length > 0).length,
    withUsers: metiers.filter((m) => m.users.length > 0).length,
  };

  // Loading Spinner
  const LoadingSpinner = ({ message = "Chargement..." }) => (
    <div className="flex flex-col items-center justify-center min-h-64 py-12 bg-[#FFFFFF]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F] mb-4" />
      <p className="text-[#8B4513] text-lg">{message}</p>
    </div>
  );

  // Modal de confirmation
  const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    cancelText,
  }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
        <div className="bg-[#FFFFFF] rounded-xl shadow-2xl max-w-md w-full border border-[#D3D3D3]">
          <div className="flex items-center justify-between p-6 border-b border-[#D3D3D3] bg-[#556B2F]/5">
            <h3 className="text-lg font-semibold text-[#556B2F]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#8B4513] hover:text-[#556B2F] text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            <p className="text-[#8B4513]">{message}</p>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t border-[#D3D3D3] bg-[#556B2F]/5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#8B4513] border border-[#D3D3D3] rounded-lg hover:bg-[#FFFFFF] transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Card mobile
  const MetierCard = ({
    metier,
    isSelected,
    onToggleSelect,
    onEdit,
    onDelete,
  }) => {
    const canDelete =
      metier.services.length === 0 && metier.users.length === 0;
    return (
      <div
        className={`bg-[#FFFFFF] rounded-xl border border-[#D3D3D3] p-4 mb-3 transition-all duration-200 ${
          isSelected ? "ring-2 ring-[#556B2F] bg-[#556B2F]/5" : "hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(metier.id)}
              className="rounded border-[#D3D3D3] text-[#556B2F] focus:ring-[#556B2F]"
            />
            <div className="flex-shrink-0 w-10 h-10 bg-[#556B2F]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#556B2F] font-semibold text-sm">
                #{metier.id}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(metier)}
              className="bg-[#556B2F]/10 hover:bg-[#556B2F]/20 text-[#556B2F] p-2 rounded-lg transition-colors"
              title="Modifier"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(metier)}
              className={`p-2 rounded-lg transition-colors ${
                canDelete
                  ? "bg-red-100 hover:bg-red-200 text-red-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              title={
                canDelete
                  ? "Supprimer"
                  : "Impossible de supprimer - des dépendances existent"
              }
              disabled={!canDelete}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-[#556B2F] text-base mb-1">
              {metier.libelle}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-[#8B4513]">Services:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  metier.services.length > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {metier.services.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8B4513]">Utilisateurs:</span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  metier.users.length > 0
                    ? "bg-purple-100 text-purple-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {metier.users.length}
              </span>
            </div>
          </div>
          {(metier.services.length > 0 || metier.users.length > 0) && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>
                {metier.services.length > 0 &&
                  `${metier.services.length} service(s)`}
                {metier.services.length > 0 && metier.users.length > 0 && " • "}
                {metier.users.length > 0 &&
                  `${metier.users.length} utilisateur(s)`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des métiers..." />;
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec statistiques */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#D3D3D3] p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#556B2F] mb-2">
                Administration des Métiers
              </h1>
              <p className="text-[#8B4513]">
                Gérez la liste des métiers disponibles dans l'application
              </p>
            </div>
            <button
              onClick={handleAddNewClick}
              className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={showFormModal}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter un métier
            </button>
          </div>
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#556B2F]/5 border border-[#556B2F]/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#556B2F]/15 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-[#556B2F]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#556B2F]">
                    Total des métiers
                  </p>
                  <p className="text-2xl font-bold text-[#556B2F]">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Avec services
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {stats.withServices}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg
                    className="w-6 h-6 text-purple-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">
                    Avec utilisateurs
                  </p>
                  <p className="text-2xl font-bold text-purple-700">
                    {stats.withUsers}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'alerte */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-600 hover:text-red-800 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-800">{success}</span>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="text-green-600 hover:text-green-800 text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#D3D3D3] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
              {/* Barre de recherche */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-[#8B4513]/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un métier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-[#D3D3D3] rounded-lg focus:ring-[#556B2F] focus:border-[#556B2F] text-[#8B4513]"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-[#D3D3D3] rounded-lg px-3 py-2 focus:ring-[#556B2F] focus:border-[#556B2F] text-[#8B4513] bg-[#FFFFFF]"
                >
                  <option value="libelle">Trier par nom</option>
                  <option value="id">Trier par ID</option>
                  <option value="services">Trier par services</option>
                  <option value="users">Trier par utilisateurs</option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="px-3 py-2 border border-[#D3D3D3] rounded-lg hover:bg-[#556B2F]/5 transition-colors text-[#8B4513]"
                  title={
                    sortOrder === "asc" ? "Tri décroissant" : "Tri croissant"
                  }
                >
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      sortOrder === "desc" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actions groupées */}
            {selectedMetiers.size > 0 && (
              <div className="flex items-center gap-3 bg-[#556B2F]/5 px-4 py-2 rounded-lg border border-[#556B2F]/40">
                <span className="text-sm text-[#556B2F] font-medium">
                  {selectedMetiers.size} sélectionné(s)
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="border border-[#D3D3D3] rounded px-2 py-1 text-sm bg-[#FFFFFF] text-[#8B4513]"
                >
                  <option value="">Actions groupées</option>
                  <option value="delete">Supprimer</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Appliquer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Liste des métiers */}
        <div className="bg-[#FFFFFF] rounded-xl shadow-sm border border-[#D3D3D3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D3D3D3] bg-[#556B2F]/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-[#556B2F]">
                Liste des métiers
              </h2>
              <div className="flex items-center gap-4">
                <span className="bg-[#556B2F]/10 text-[#556B2F] px-3 py-1 rounded-full text-sm font-medium">
                  {filteredMetiers.length} métier(s)
                </span>
                {metiers.length > 0 && (
                  <button
                    onClick={loadMetiers}
                    className="p-2 rounded-lg hover:bg-[#556B2F]/10 transition-colors border border-[#D3D3D3] text-[#556B2F]"
                    title="Actualiser"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredMetiers.length === 0 ? (
            <div className="text-center py-12 px-6 bg-[#FFFFFF]">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-[#556B2F] mb-2">
                {searchTerm ? "Aucun résultat trouvé" : "Aucun métier trouvé"}
              </h3>
              <p className="text-[#8B4513] mb-6">
                {searchTerm
                  ? "Aucun métier ne correspond à votre recherche"
                  : "Commencez par ajouter votre premier métier"}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleAddNewClick}
                  className="bg-[#556B2F] hover:bg-[#6B8E23] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Ajouter un métier
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop - Tableau */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#556B2F]/10">
                    <tr>
                      <th className="w-12 px-6 py-4">
                        <input
                          type="checkbox"
                          checked={
                            selectedMetiers.size === filteredMetiers.length &&
                            filteredMetiers.length > 0
                          }
                          onChange={toggleSelectAll}
                          className="rounded border-[#D3D3D3] text-[#556B2F] focus:ring-[#556B2F]"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                        Métier
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                        Services
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                        Utilisateurs
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-[#8B4513] uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D3D3D3]">
                    {filteredMetiers.map((metier) => (
                      <tr
                        key={metier.id}
                        className={`hover:bg-[#556B2F]/5 transition-colors ${
                          selectedMetiers.has(metier.id)
                            ? "bg-[#556B2F]/10"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedMetiers.has(metier.id)}
                            onChange={() => toggleSelectMetier(metier.id)}
                            className="rounded border-[#D3D3D3] text-[#556B2F] focus:ring-[#556B2F]"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#556B2F]/10 rounded-lg flex items-center justify-center">
                              <span className="text-[#556B2F] font-semibold text-sm">
                                #{metier.id}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#556B2F]">
                                {metier.libelle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              metier.services.length > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {metier.services.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              metier.users.length > 0
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {metier.users.length}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => handleEditClick(metier)}
                              className="bg-[#556B2F]/10 hover:bg-[#556B2F]/20 text-[#556B2F] p-2 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => confirmDelete(metier)}
                              className={`p-2 rounded-lg transition-colors ${
                                metier.services.length > 0 ||
                                metier.users.length > 0
                                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  : "bg-red-100 hover:bg-red-200 text-red-700"
                              }`}
                              title={
                                metier.services.length > 0 ||
                                metier.users.length > 0
                                  ? "Impossible de supprimer - des dépendances existent"
                                  : "Supprimer"
                              }
                              disabled={
                                metier.services.length > 0 ||
                                metier.users.length > 0
                              }
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile - Cartes */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredMetiers.map((metier) => (
                  <MetierCard
                    key={metier.id}
                    metier={metier}
                    isSelected={selectedMetiers.has(metier.id)}
                    onToggleSelect={toggleSelectMetier}
                    onEdit={handleEditClick}
                    onDelete={confirmDelete}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal de formulaire */}
        <MetierForm
          metier={editingMetier}
          onSubmit={handleSubmitForm}
          onCancel={handleCancelForm}
          loading={formLoading}
          isOpen={showFormModal}
        />

        {/* Modal de confirmation de suppression */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, metier: null })}
          onConfirm={() => handleDeleteMetier(deleteModal.metier?.id)}
          title="Confirmer la suppression"
          message={`Êtes-vous sûr de vouloir supprimer le métier "${deleteModal.metier?.libelle}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
        />
      </div>
    </div>
  );
};

export default AdminMetiers;
