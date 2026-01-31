import { useState, useEffect, useRef } from "react";
import { X, Upload, Trash, Plus, Tag, FileText, Palette, ArrowUpDown, CheckCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const AjoutActivitesModalCategorie = ({
  isOpen,
  onClose,
  onSubmit,
  editingActivity = null, // AJOUT: Cette prop est maintenant acceptée
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    isActive: true,
    sortOrder: 0,
    image: "", // URL pour l'aperçu
    imageFile: null, // Fichier image
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Couleurs prédéfinies pour sélection facile
  const colorOptions = [
    { value: "#3B82F6", label: "Bleu", bgColor: "bg-blue-500" },
    { value: "#10B981", label: "Vert", bgColor: "bg-green-500" },
    { value: "#EF4444", label: "Rouge", bgColor: "bg-red-500" },
    { value: "#F59E0B", label: "Orange", bgColor: "bg-yellow-500" },
    { value: "#8B5CF6", label: "Violet", bgColor: "bg-purple-500" },
    { value: "#EC4899", label: "Rose", bgColor: "bg-pink-500" },
    { value: "#6366F1", label: "Indigo", bgColor: "bg-indigo-500" },
    { value: "#06B6D4", label: "Cyan", bgColor: "bg-cyan-500" },
  ];

  // Icônes prédéfinies
  const iconOptions = [
    { value: "hiking", label: "Randonnée" },
    { value: "swimming", label: "Natation" },
    { value: "skiing", label: "Ski" },
    { value: "biking", label: "Vélo" },
    { value: "museum", label: "Musée" },
    { value: "restaurant", label: "Restaurant" },
    { value: "shopping", label: "Shopping" },
    { value: "beach", label: "Plage" },
    { value: "castle", label: "Château" },
    { value: "park", label: "Parc" },
    { value: "theater", label: "Théâtre" },
    { value: "music", label: "Musique" },
  ];

  // AJOUT: Initialiser le formulaire avec les données d'édition
  useEffect(() => {
    if (editingActivity && isOpen) {
      // console.log("📝 Initialisation avec activité à éditer:", editingActivity);

      setFormData({
        name: editingActivity.name || "",
        description: editingActivity.description || "",
        icon: editingActivity.icon || "",
        color: editingActivity.color || "#3B82F6",
        isActive:
          editingActivity.isActive !== undefined
            ? editingActivity.isActive
            : true,
        sortOrder: editingActivity.sortOrder || 0,
        image: editingActivity.image || "",
        imageFile: null, // On ne charge pas le fichier, juste l'URL
      });
    } else if (isOpen) {
      // Réinitialiser pour une nouvelle catégorie
      setFormData({
        name: "",
        description: "",
        icon: "",
        color: "#3B82F6",
        isActive: true,
        sortOrder: 0,
        image: "",
        imageFile: null,
      });
    }
  }, [editingActivity, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Veuillez saisir un nom pour la catégorie");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Ajouter les champs texte
      submitData.append("name", formData.name.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("icon", formData.icon);
      submitData.append("color", formData.color);
      submitData.append("isActive", formData.isActive.toString());
      submitData.append("sortOrder", formData.sortOrder.toString());

      // console.log("📋 Données à envoyer:", {
      //   isEditing: !!editingActivity,
      //   activityId: editingActivity?.id,
      //   name: formData.name.trim(),
      //   description: formData.description.trim(),
      //   icon: formData.icon,
      //   color: formData.color,
      //   isActive: formData.isActive.toString(),
      //   sortOrder: formData.sortOrder.toString(),
      //   hasImage: !!formData.imageFile
      // });

      // Ajouter l'image si elle existe
      if (formData.imageFile) {
        submitData.append("image", formData.imageFile);
        // console.log("📷 Image ajoutée:", formData.imageFile.name);
      }

      let response;

      // AJOUT: Logique différente pour modification vs ajout
      if (editingActivity) {
        // MODIFICATION: Appeler PUT
        // console.log(`🔄 Modification catégorie ID: ${editingActivity.id}`);

        // Si pas d'image sélectionnée mais une image existe déjà, on l'envoie quand même
        if (!formData.imageFile && editingActivity.image) {
          // console.log("ℹ️ Conservation de l'image existante");
        }

        response = await api.put(
          `/ActivityCategory/${editingActivity.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // AJOUT: Appeler POST
        // console.log("➕ Ajout nouvelle catégorie");
        response = await api.post("/ActivityCategory", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        // AJOUT: Message différent selon modification/ajout
        const successMessage = editingActivity
          ? "Catégorie modifiée avec succès ✅"
          : "Catégorie ajoutée avec succès ✅";

        toast.success(successMessage);

        // Appeler le callback onSubmit si fourni
        if (onSubmit) {
          onSubmit(response.data.data);
        }

        // Réinitialiser le formulaire
        setFormData({
          name: "",
          description: "",
          icon: "",
          color: "#3B82F6",
          isActive: true,
          sortOrder: 0,
          image: "",
          imageFile: null,
        });

        onClose();
      } else {
        toast.error(response.data.message || "Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);

      // Gestion d'erreur améliorée
      let errorMessage = editingActivity
        ? "Erreur lors de la modification de la catégorie"
        : "Erreur lors de l'ajout de la catégorie";

      if (error.response) {
        // Erreur de réponse du serveur
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;

        // Gestion spécifique pour les doublons
        if (error.response.status === 409 || errorMessage.includes("unique")) {
          errorMessage = "Une catégorie avec ce nom existe déjà";
        }

        if (error.response.status === 404 && editingActivity) {
          errorMessage = "La catégorie à modifier n'existe plus";
        }
      } else if (error.request) {
        // Erreur de réseau
        errorMessage = "Erreur de connexion au serveur";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille de l'image ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }

      // Créer une URL pour l'aperçu
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
        imageFile: file,
      }));
    }
  };

  const removeImage = () => {
    // Révoquer l'URL pour libérer la mémoire
    if (formData.image && formData.image.startsWith("blob:")) {
      URL.revokeObjectURL(formData.image);
    }
    setFormData((prev) => ({
      ...prev,
      image: "",
      imageFile: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // AJOUT: Fonction pour supprimer l'activité
  const handleDelete = async () => {
    if (
      !editingActivity ||
      !confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.delete(
        `/ActivityCategory/${editingActivity.id}`,
      );

      if (response.data.success) {
        toast.success("Catégorie supprimée avec succès");
        onSubmit(response.data.data); // Notifier le parent
        onClose();
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error(
        error.response?.data?.message || "Erreur lors de la suppression",
      );
    } finally {
      setLoading(false);
    }
  };

  // Nettoyer l'URL de l'image lors du démontage
  useEffect(() => {
    return () => {
      if (formData.image && formData.image.startsWith("blob:")) {
        URL.revokeObjectURL(formData.image);
      }
    };
  }, [formData.image]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Overlay de chargement */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg z-10">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-3">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-700 font-medium">
              {editingActivity
                ? "Modification en cours..."
                : "Ajout en cours..."}
            </p>
            <p className="text-sm text-gray-500">Veuillez patienter...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Tag className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {/* AJOUT: Titre différent selon édition/ajout */}
              {editingActivity
                ? "Modifier la catégorie"
                : "Ajouter une catégorie d'activité"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nom et Description */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Nom de la catégorie *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Randonnée, Visite culturelle, Gastronomie..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Le nom doit être unique
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Description de la catégorie..."
              />
            </div>
          </div>

          {/* Icône et Couleur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icône
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Sélectionner une icône</option>
                {iconOptions.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
              {formData.icon && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Aperçu :</span>
                  <div className="px-2 py-1 bg-gray-100 rounded-md">
                    {formData.icon}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Couleur
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      !loading &&
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    disabled={loading}
                    className={`h-8 rounded-md border-2 ${
                      formData.color === color.value
                        ? "border-gray-700 ring-2 ring-offset-1 ring-gray-300"
                        : "border-gray-200 hover:border-gray-300"
                    } ${color.bgColor} disabled:opacity-50`}
                    title={color.label}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{ backgroundColor: formData.color }}
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  disabled={loading}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>

          {/* Ordre et Statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ArrowUpDown className="w-4 h-4 inline mr-1" />
                Ordre d'affichage
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                min="0"
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Détermine l'ordre d'affichage (plus petit = premier)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Statut
              </label>
              <div className="flex items-center mt-2">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={loading}
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${formData.isActive ? "bg-green-500" : "bg-gray-300"}`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${formData.isActive ? "transform translate-x-6" : ""}`}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Image de la catégorie (optionnel)
            </label>

            {/* Aperçu de l'image */}
            {formData.image && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                <div className="relative inline-block">
                  <img
                    src={formData.image}
                    alt="Aperçu de la catégorie"
                    className="w-32 h-32 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Input file */}
            <label
              className={`flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200 transition-colors ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-blue-100"
              }`}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              {loading
                ? "Chargement..."
                : formData.image
                  ? "Changer l'image"
                  : "Choisir une image"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés: JPG, PNG, GIF. Taille max: 5MB
            </p>
          </div>

          {/* Aperçu de la catégorie */}
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Aperçu de la catégorie
            </h3>
            <div className="flex items-center space-x-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon ? (
                  <span className="font-semibold">
                    {formData.icon.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <Tag className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {formData.name || "Nom de la catégorie"}
                </h4>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.description}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${formData.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Ordre: {formData.sortOrder}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t">
            {/* AJOUT: Bouton Supprimer seulement en mode édition */}
            {editingActivity && (
              <div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            )}

            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {editingActivity
                      ? "Modification en cours..."
                      : "Ajout en cours..."}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingActivity
                      ? "Modifier la catégorie"
                      : "Ajouter la catégorie"}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutActivitesModalCategorie;