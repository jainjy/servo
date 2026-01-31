import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Trash,
  Plus,
  Tag,
  FileText,
  Palette,
  ArrowUpDown,
  CheckCircle,
  ImageIcon,
  DollarSign,
  Clock,
  Users,
  MapPin,
  Hash,
  Award,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const AjoutActiviteModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingActivity = null,
  categories = [], // Liste des catégories disponibles
}) => {
  const [formData, setFormData] = useState({
    // Informations de base
    title: "",
    description: "",
    shortDescription: "",
    categoryId: "",

    // Informations pratiques
    price: "",
    priceType: "per_person",
    duration: "",
    durationType: "minutes",
    level: "beginner",
    maxParticipants: "",
    minParticipants: 1,

    // Localisation
    location: "",
    address: "",
    latitude: "",
    longitude: "",
    meetingPoint: "",

    // Images
    mainImage: "",
    images: [],
    imageFiles: [], // Fichiers pour upload

    // Informations supplémentaires
    includedItems: [],
    requirements: [],
    highlights: [],

    // Statut
    status: "draft",
    featured: false,

    // Tableaux pour les inputs
    includedItemInput: "",
    requirementInput: "",
    highlightInput: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(categories);
  const fileInputRef = useRef(null);
  const imagesInputRef = useRef(null);

  // Niveaux disponibles
  const levelOptions = [
    { value: "beginner", label: "Débutant" },
    { value: "intermediate", label: "Intermédiaire" },
    { value: "advanced", label: "Avancé" },
    { value: "all", label: "Tous niveaux" },
  ];

  // Types de prix
  const priceTypeOptions = [
    { value: "per_person", label: "Par personne" },
    { value: "per_group", label: "Par groupe" },
    { value: "per_hour", label: "Par heure" },
  ];

  // Types de durée
  const durationTypeOptions = [
    { value: "minutes", label: "Minutes" },
    { value: "hours", label: "Heures" },
    { value: "days", label: "Jours" },
  ];

  // Statuts
  const statusOptions = [
    { value: "draft", label: "Brouillon" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archivée" },
  ];

  // Charger les catégories si non fournies
  useEffect(() => {
    const loadCategories = async () => {
      if (categories.length === 0 && isOpen) {
        setLoadingCategories(true);
        try {
          const response = await api.get("/ActivityCategory/public");
          if (response.data.success) {
            setAvailableCategories(response.data.data);
          }
        } catch (error) {
          console.error("Erreur chargement catégories:", error);
          toast.error("Erreur lors du chargement des catégories");
        } finally {
          setLoadingCategories(false);
        }
      }
    };
    loadCategories();
  }, [isOpen, categories]);

  // Initialiser le formulaire avec les données d'édition
  useEffect(() => {
    if (editingActivity && isOpen) {
      console.log("📝 Initialisation avec activité à éditer:", editingActivity);

      setFormData({
        title: editingActivity.title || "",
        description: editingActivity.description || "",
        shortDescription: editingActivity.shortDescription || "",
        categoryId:
          editingActivity.categoryId || editingActivity.category?.id || "",

        price: editingActivity.price || "",
        priceType: editingActivity.priceType || "per_person",
        duration: editingActivity.duration || "",
        durationType: editingActivity.durationType || "minutes",
        level: editingActivity.level || "beginner",
        maxParticipants: editingActivity.maxParticipants || "",
        minParticipants: editingActivity.minParticipants || 1,

        location: editingActivity.location || "",
        address: editingActivity.address || "",
        latitude: editingActivity.latitude || "",
        longitude: editingActivity.longitude || "",
        meetingPoint: editingActivity.meetingPoint || "",

        mainImage: editingActivity.mainImage || "",
        images: editingActivity.images || [],
        imageFiles: [],

        includedItems: Array.isArray(editingActivity.includedItems)
          ? editingActivity.includedItems
          : [],
        requirements: Array.isArray(editingActivity.requirements)
          ? editingActivity.requirements
          : [],
        highlights: Array.isArray(editingActivity.highlights)
          ? editingActivity.highlights
          : [],

        status: editingActivity.status || "draft",
        featured: editingActivity.featured || false,

        includedItemInput: "",
        requirementInput: "",
        highlightInput: "",
      });
    } else if (isOpen) {
      // Réinitialiser pour une nouvelle activité
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        categoryId: "",

        price: "",
        priceType: "per_person",
        duration: "",
        durationType: "minutes",
        level: "beginner",
        maxParticipants: "",
        minParticipants: 1,

        location: "",
        address: "",
        latitude: "",
        longitude: "",
        meetingPoint: "",

        mainImage: "",
        images: [],
        imageFiles: [],

        includedItems: [],
        requirements: [],
        highlights: [],

        status: "draft",
        featured: false,

        includedItemInput: "",
        requirementInput: "",
        highlightInput: "",
      });
    }
  }, [editingActivity, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error("Veuillez saisir un titre pour l'activité");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Veuillez saisir une description");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      // Ajouter les champs texte
      submitData.append("title", formData.title.trim());
      submitData.append("description", formData.description.trim());
      submitData.append("shortDescription", formData.shortDescription.trim());
      submitData.append("categoryId", formData.categoryId);

      // Informations pratiques
      if (formData.price) submitData.append("price", formData.price);
      submitData.append("priceType", formData.priceType);
      if (formData.duration) submitData.append("duration", formData.duration);
      submitData.append("durationType", formData.durationType);
      submitData.append("level", formData.level);
      if (formData.maxParticipants)
        submitData.append("maxParticipants", formData.maxParticipants);
      submitData.append("minParticipants", formData.minParticipants.toString());

      // Localisation
      submitData.append("location", formData.location);
      submitData.append("address", formData.address);
      if (formData.latitude) submitData.append("latitude", formData.latitude);
      if (formData.longitude)
        submitData.append("longitude", formData.longitude);
      submitData.append("meetingPoint", formData.meetingPoint);

      // Images principales
      if (formData.imageFiles[0]) {
        submitData.append("mainImage", formData.imageFiles[0]);
      } else if (
        formData.mainImage &&
        !formData.mainImage.startsWith("blob:")
      ) {
        submitData.append("mainImage", formData.mainImage);
      }

      // Images supplémentaires
      formData.imageFiles.forEach((file, index) => {
        if (index > 0) {
          // La première est déjà traitée comme mainImage
          submitData.append("images", file);
        }
      });

      // Informations supplémentaires (tableaux JSON)
      if (formData.includedItems.length > 0) {
        submitData.append(
          "includedItems",
          JSON.stringify(formData.includedItems),
        );
      }

      if (formData.requirements.length > 0) {
        submitData.append(
          "requirements",
          JSON.stringify(formData.requirements),
        );
      }

      if (formData.highlights.length > 0) {
        submitData.append("highlights", JSON.stringify(formData.highlights));
      }

      // Statut
      submitData.append("status", formData.status);
      submitData.append("featured", formData.featured.toString());

      let response;

      if (editingActivity) {
        // MODIFICATION
        console.log(`🔄 Modification activité ID: ${editingActivity.id}`);

        response = await api.put(
          `/activities/${editingActivity.id}`,
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // AJOUT
        console.log("➕ Ajout nouvelle activité");
        response = await api.post("/activities", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.success) {
        const successMessage = editingActivity
          ? "Activité modifiée avec succès ✅"
          : "Activité ajoutée avec succès ✅";

        toast.success(successMessage);

        if (onSubmit) {
          onSubmit(response.data.data);
        }

        onClose();
      } else {
        toast.error(response.data.message || "Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);

      let errorMessage = editingActivity
        ? "Erreur lors de la modification de l'activité"
        : "Erreur lors de l'ajout de l'activité";

      if (error.response) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;

        if (error.response.status === 409) {
          errorMessage = "Une activité avec ce titre existe déjà";
        }

        if (error.response.status === 404 && editingActivity) {
          errorMessage = "L'activité à modifier n'existe plus";
        }
      } else if (error.request) {
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
            ? value === ""
              ? ""
              : parseInt(value)
            : value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La taille de l'image ne doit pas dépasser 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image valide");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      const newImageFiles = [...formData.imageFiles];
      if (newImageFiles[0]) {
        URL.revokeObjectURL(formData.mainImage);
      }
      newImageFiles[0] = file;

      setFormData((prev) => ({
        ...prev,
        mainImage: imageUrl,
        imageFiles: newImageFiles,
      }));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`L'image ${file.name} dépasse 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      const newImageFiles = [...formData.imageFiles];
      const newImages = [...formData.images];

      validFiles.forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        newImageFiles.push(file);
        newImages.push(imageUrl);
      });

      setFormData((prev) => ({
        ...prev,
        images: newImages,
        imageFiles: newImageFiles,
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newImageFiles = [...formData.imageFiles];

    if (newImages[index].startsWith("blob:")) {
      URL.revokeObjectURL(newImages[index]);
    }

    newImages.splice(index, 1);
    newImageFiles.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
      imageFiles: newImageFiles,
      mainImage: index === 0 && newImages.length > 0 ? newImages[0] : "",
    }));
  };

  // Gestion des tableaux (inclus, prérequis, points forts)
  const addArrayItem = (field) => {
    const inputField = `${field}Input`;
    const value = formData[inputField].trim();

    if (value) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value],
        [inputField]: "",
      }));
    }
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleArrayKeyPress = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addArrayItem(field);
    }
  };

  // Nettoyer les URLs lors du démontage
  useEffect(() => {
    return () => {
      [...formData.images, formData.mainImage].forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.images, formData.mainImage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <Tag className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {editingActivity ? "Modifier l'activité" : "Ajouter une activité"}
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
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informations de base
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Titre de l'activité *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Randonnée guidée, Cours de cuisine..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={loading || loadingCategories}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description courte
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Description courte pour les aperçus..."
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.shortDescription.length}/200 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description détaillée *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                placeholder="Décrivez votre activité en détail..."
              />
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informations pratiques
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Prix (€)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="50.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de prix
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  {priceTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  {levelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Durée
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="0"
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="120"
                  />
                  <select
                    name="durationType"
                    value={formData.durationType}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    {durationTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Participants min
                </label>
                <input
                  type="number"
                  name="minParticipants"
                  value={formData.minParticipants}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants max
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Illimité si vide"
                />
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Localisation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lieu / Ville
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Paris, Montagne..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="123 Rue Exemple..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Point de rencontre
                </label>
                <input
                  type="text"
                  name="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Devant l'office de tourisme..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="any"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="48.8566"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="any"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Images
            </h3>

            {/* Image principale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Image principale *
              </label>

              {formData.mainImage && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                  <div className="relative inline-block">
                    <img
                      src={formData.mainImage}
                      alt="Image principale"
                      className="w-48 h-48 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(0)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

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
                  : formData.mainImage
                    ? "Changer l'image principale"
                    : "Choisir une image principale"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Images supplémentaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images supplémentaires
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {formData.images.slice(1).map((image, index) => (
                  <div key={index + 1} className="relative">
                    <img
                      src={image}
                      alt={`Image supplémentaire ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index + 1)}
                      disabled={loading}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>

              <label
                className={`flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-md border border-gray-200 transition-colors ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100"
                }`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter des images supplémentaires
                <input
                  ref={imagesInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informations supplémentaires
            </h3>

            {/* Éléments inclus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Éléments inclus
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.includedItemInput}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      includedItemInput: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleArrayKeyPress(e, "includedItems")}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Matériel fourni, transport, repas..."
                />
                <button
                  type="button"
                  onClick={() => addArrayItem("includedItems")}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.includedItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("includedItems", index)}
                      disabled={loading}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prérequis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Prérequis / Équipement nécessaire
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.requirementInput}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requirementInput: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleArrayKeyPress(e, "requirements")}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Chaussures de rando, maillot de bain..."
                />
                <button
                  type="button"
                  onClick={() => addArrayItem("requirements")}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("requirements", index)}
                      disabled={loading}
                      className="ml-2 text-yellow-600 hover:text-yellow-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Points forts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points forts
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.highlightInput}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      highlightInput: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleArrayKeyPress(e, "highlights")}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder="Vue panoramique, guide expert..."
                />
                <button
                  type="button"
                  onClick={() => addArrayItem("highlights")}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                  >
                    <List className="w-3 h-3 mr-1" />
                    {item}
                    <button
                      type="button"
                      onClick={() => removeArrayItem("highlights", index)}
                      disabled={loading}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Statut et visibilité
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    Mettre en avant (activité vedette)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.categoryId ||
                  !formData.description.trim()
                }
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
                      ? "Modifier l'activité"
                      : "Ajouter l'activité"}
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

export default AjoutActiviteModal;
