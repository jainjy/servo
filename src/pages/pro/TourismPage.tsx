import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Users,
  Star,
  Heart,
  Bed,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Building,
  Bath,
  Square,
  TrendingUp,
  Home,
  Upload,
  Trash,
  Landmark,
  Camera,
  Clock,
  Globe,
  Plane,
  Hotel,
  Mountain,
  ChevronDown,
  Calendar,
  Clock3,
} from "lucide-react";
import { toast } from "sonner";
import { tourismeAPI } from "../../lib/api";
import { useAuth } from "@/hooks/useAuth";
import AjoutVolModal from "../../components/components/AjoutVol";
import AjoutActivitesModal from "@/components/components/AjoutActivites";
import { api } from "@/lib/axios";

// Amenities disponibles avec icônes
const availableAmenities = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "breakfast", label: "Petit-déjeuner", icon: Utensils },
  { id: "pool", label: "Piscine", icon: null },
  { id: "spa", label: "Spa", icon: null },
  { id: "gym", label: "Salle de sport", icon: Dumbbell },
  { id: "ac", label: "Climatisation", icon: Snowflake },
  { id: "tv", label: "Télévision", icon: Tv },
  { id: "kitchen", label: "Cuisine", icon: null },
];

// Catégories de lieux touristiques
const touristicCategories = [
  { id: "monument", label: "Monument", icon: Landmark },
  { id: "museum", label: "Musée", icon: Building },
  { id: "park", label: "Parc/Jardin", icon: null },
  { id: "beach", label: "Plage", icon: null },
  { id: "mountain", label: "Montagne", icon: Mountain },
  { id: "religious", label: "Site religieux", icon: null },
  { id: "historical", label: "Site historique", icon: Landmark },
  { id: "cultural", label: "Site culturel", icon: Camera },
  { id: "natural", label: "Site naturel", icon: null },
];

// Options pour le dropdown d'ajout
const addOptions = [
  {
    id: "accommodation",
    label: "Ajouter un hébergement",
    icon: Hotel,
  },
  {
    id: "touristic_place",
    label: "Ajouter un lieu touristique",
    icon: Landmark,
  },
  {
    id: "flight",
    label: "Ajouter un vol",
    icon: Plane,
  },
  {
    id: "activities",
    label: "Ajouter une activité",
    icon: Mountain,
  },
];

// Options pour le dropdown de type de contenu
const contentTypeOptions = [
  {
    id: "accommodations",
    label: " Hébergements",
    icon: Hotel,
    description: "Gérer vos hébergements et propriétés",
  },
  {
    id: "touristic_places",
    label: " Lieux Touristiques",
    icon: Landmark,
    description: "Gérer vos lieux touristiques",
  },
  {
    id: "flights",
    label: "Services de Vol",
    icon: Plane,
    description: "Gérer vos vols et compagnies aériennes",
  },
  {
    id: "activities",
    label: "Activités et Loisirs",
    icon: Mountain,
    description: "Gérer vos activités et loisirs",
  },
];

// Composant AdminModal séparé
const AdminModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingListing,
  contentType,
}) => {
  const defaultForm = {
    title: "",
    type: "hotel",
    category: "",
    price: 0,
    city: "",
    lat: 0,
    lng: 0,
    images: [],
    amenities: [],
    maxGuests: 2,
    available: true,
    featured: false,
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    instantBook: false,
    cancellationPolicy: "moderate",
    rating: 0,
    reviewCount: 0,
    isTouristicPlace: contentType === "touristic_places",
    openingHours: "",
    entranceFee: "",
    website: "",
    contactInfo: "",
    removedImages: [],
  };

  const [formData, setFormData] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleTypeChange = (e) => {
    const selectedValue = e.target.value;
    const isTouristic = selectedValue === "touristic_place";

    setFormData((prev) => ({
      ...prev,
      isTouristicPlace: isTouristic,
      type: isTouristic ? "touristic_place" : selectedValue,
      category: isTouristic ? "" : prev.category,
      price: isTouristic ? 0 : prev.price,
    }));
  };

  useEffect(() => {
    if (editingListing) {
      setFormData({ ...defaultForm, ...editingListing });
      setUploadedFiles([]);
    } else {
      setFormData({
        ...defaultForm,
        isTouristicPlace: contentType === "touristic_places",
      });
      setUploadedFiles([]);
    }
  }, [editingListing, contentType, isOpen]);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      setUploadedFiles((prev) => [...prev, ...files]);
      const newImageUrls = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImageUrls],
      }));
      toast.success(`${files.length} image(s) sélectionnée(s)`);
    } catch (error) {
      console.error("❌ Erreur sélection images:", error);
      toast.error("Erreur lors de la sélection des images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];

    setFormData((prev) => {
      const newImages = [...prev.images];
      const removedImage = newImages.splice(index, 1)[0];

      if (removedImage && !removedImage.startsWith("blob:")) {
        return {
          ...prev,
          images: newImages,
          removedImages: [...(prev.removedImages || []), removedImage],
        };
      }

      const fileIndex = uploadedFiles.findIndex(
        (file) => URL.createObjectURL(file) === removedImage
      );
      if (fileIndex !== -1) {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }

      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      console.log("📝 Préparation soumission formulaire:", formData);
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "images" && key !== "removedImages") {
          let value = formData[key];
          if (typeof value === "boolean") {
            value = value.toString();
          }
          if (Array.isArray(value)) {
            submitData.append(key, JSON.stringify(value));
          } else {
            submitData.append(key, value);
          }
        }
      });

      if (formData.removedImages && formData.removedImages.length > 0) {
        submitData.append(
          "removedImages",
          JSON.stringify(formData.removedImages)
        );
      }

      uploadedFiles.forEach((file) => {
        submitData.append("images", file);
      });

      let response;
      if (editingListing) {
        response = await tourismeAPI.updateListingWithImages(
          editingListing.id,
          submitData
        );
      } else {
        response = await tourismeAPI.createListingWithImages(submitData);
      }

      console.log("📥 Réponse API:", response.data);

      if (response.data.success) {
        onSubmit(response.data.data);
        toast.success(
          editingListing
            ? `${formData.isTouristicPlace ? "Lieu touristique" : "Hébergement"
            } modifié avec succès ✅`
            : `${formData.isTouristicPlace ? "Lieu touristique" : "Hébergement"
            } créé avec succès ✅`
        );
      }
    } catch (error) {
      console.error("❌ Erreur soumission:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la soumission"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData(defaultForm);
    setUploadedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingListing
                ? `Modifier ${formData.isTouristicPlace
                  ? "le lieu touristique"
                  : "l'hébergement"
                }`
                : contentType === "accommodations"
                  ? "Nouvel hébergement"
                  : "Nouveau lieu touristique"}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={uploading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!editingListing && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type de contenu *
              </label>
              <select
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={
                  formData.isTouristicPlace ? "touristic_place" : formData.type
                }
                onChange={handleTypeChange}
              >
                <optgroup label="Hébergements">
                  <option value="hotel">Hôtel</option>
                  <option value="apartment">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="guesthouse">Maison d'hôtes</option>
                </optgroup>
                <optgroup label="Lieux Touristiques">
                  <option value="touristic_place">Lieu Touristique</option>
                </optgroup>
              </select>
            </div>
          )}

          {formData.isTouristicPlace && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {touristicCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 9h-18h, fermé le lundi"
                    value={formData.openingHours || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        openingHours: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tarif d'entrée
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Gratuit, 10€, Enfants: 5€"
                    value={formData.entranceFee || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        entranceFee: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Site web
                  </label>
                  <input
                    type="url"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.website || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: +33 1 23 45 67 89"
                    value={formData.contactInfo || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactInfo: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {!formData.isTouristicPlace && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Type d'hébergement *
                  </label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, type: e.target.value }))
                    }
                    required
                  >
                    <option value="hotel">Hôtel</option>
                    <option value="apartment">Appartement</option>
                    <option value="villa">Villa</option>
                    <option value="guesthouse">Maison d'hôtes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chambres
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.bedrooms || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bedrooms: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.bathrooms || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bathrooms: e.target.value
                          ? Number(e.target.value)
                          : null,
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voyageurs max *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.maxGuests}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxGuests: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.instantBook || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        instantBook: e.target.checked,
                      }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Réservation instantanée
                  </span>
                </label>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Politique d'annulation
                  </label>
                  <select
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.cancellationPolicy}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cancellationPolicy: e.target.value,
                      }))
                    }
                  >
                    <option value="flexible">Flexible</option>
                    <option value="moderate">Modérée</option>
                    <option value="strict">Stricte</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Images {uploading && "(Upload en cours...)"}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto transition-all duration-300 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Sélectionner des images
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Formats supportés: JPG, PNG, WebP. Maximum 10 images, 5MB par
                image.
                {uploadedFiles.length > 0 &&
                  ` (${uploadedFiles.length} nouvelle(s) image(s) à uploader)`}
              </p>
            </div>

            {(formData.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(formData.images || []).map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      disabled={uploading}
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ville *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Note
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.rating}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rating: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre d'avis
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.reviewCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewCount: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Équipements
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={(formData.amenities || []).includes(amenity.id)}
                    onChange={(e) => {
                      const currentAmenities = formData.amenities || [];
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          amenities: [...currentAmenities, amenity.id],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          amenities: currentAmenities.filter(
                            (a) => a !== amenity.id
                          ),
                        }));
                      }
                    }}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {amenity.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.available || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
              />
              <span className="ml-2 text-sm text-gray-700">Disponible</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.featured || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    featured: e.target.checked,
                  }))
                }
              />
              <span className="ml-2 text-sm text-gray-700">
                Mettre en vedette
              </span>
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300"
            >
              {editingListing ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant DetailModal séparé
const DetailModal = ({ isOpen, onClose, selectedListing, onBook }) => {
  if (!isOpen || !selectedListing) return null;

  const isTouristicPlace = selectedListing.isTouristicPlace;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">
              {selectedListing.title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 flex items-center mt-2">
            <MapPin className="w-4 h-4 mr-1" />
            {selectedListing.city}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {selectedListing.images && selectedListing.images.length > 0 ? (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                Aucune image disponible
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h4>
            <p className="text-gray-600">{selectedListing.description}</p>
          </div>

          {isTouristicPlace ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedListing.openingHours && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-sm text-gray-600">Horaires</div>
                  <div className="font-semibold">
                    {selectedListing.openingHours}
                  </div>
                </div>
              )}
              {selectedListing.entranceFee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Star className="w-6 h-6 text-green-600 mb-2" />
                  <div className="text-sm text-gray-600">Tarif d'entrée</div>
                  <div className="font-semibold">
                    {selectedListing.entranceFee}
                  </div>
                </div>
              )}
              {selectedListing.website && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-sm text-gray-600">Site web</div>
                  <div className="font-semibold truncate">
                    {selectedListing.website}
                  </div>
                </div>
              )}
              {selectedListing.contactInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-sm text-gray-600">Contact</div>
                  <div className="font-semibold">
                    {selectedListing.contactInfo}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bed className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Chambres</div>
                <div className="font-semibold">
                  {selectedListing.bedrooms || 1}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-sm text-gray-600">Voyageurs max</div>
                <div className="font-semibold">{selectedListing.maxGuests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bath className="w-6 h-6 text-purple-600 mb-2" />
                <div className="text-sm text-gray-600">Salles de bain</div>
                <div className="font-semibold">
                  {selectedListing.bathrooms || 1}
                </div>
              </div>
              {selectedListing.area && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Square className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-sm text-gray-600">Surface</div>
                  <div className="font-semibold">{selectedListing.area}m²</div>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Équipements
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedListing.amenities.map((amenityId) => {
                const amenity = availableAmenities.find(
                  (a) => a.id === amenityId
                );
                const IconComponent = amenity?.icon || CheckCircle;
                return (
                  <div
                    key={amenityId}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <IconComponent className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {amenity?.label || amenityId}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {!isTouristicPlace && (
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Informations de réservation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Prix par nuit</span>
                    <span className="font-semibold">
                      {selectedListing.price}€
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      Réservation instantanée
                    </span>
                    <span
                      className={`font-semibold ${selectedListing.instantBook
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {selectedListing.instantBook ? "Oui" : "Non"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      Politique d'annulation
                    </span>
                    <span className="font-semibold capitalize">
                      {selectedListing.cancellationPolicy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">
                        {selectedListing.rating}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({selectedListing.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
            >
              Fermer
            </button>
            {!isTouristicPlace && (
              <button
                onClick={() => {
                  onClose();
                  onBook(selectedListing);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
              >
                Réserver maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour compagnie aérienne
const AirlineModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    country: "",
    website: "",
    logo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données compagnie aérienne:", formData);
    toast.success("Compagnie aérienne ajoutée avec succès");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Nouvelle compagnie aérienne
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Code *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.code}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, code: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pays
              </label>
              <input
                type="text"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.country}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, country: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.website}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Composant principal
export default function TourismPage() {
  const [contentType, setContentType] = useState("accommodations");
  const [listings, setListings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    minPrice: 0,
    maxPrice: 100000,
    type: [],
    category: [],
    rating: 0,
    amenities: [],
    instantBook: false,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    listingId: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: "",
    paymentMethod: "card",
  });

  // États pour les dropdowns
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showAirlineModal, setShowAirlineModal] = useState(false);

  const sliderRef = useRef(null);

  // Fonction pour réinitialiser complètement les filtres
  const resetAllFilters = () => {
    const resetFilters = {
      destination: "",
      checkIn: "",
      checkOut: "",
      guests: 2,
      adults: 2,
      children: 0,
      infants: 0,
      minPrice: 0,
      maxPrice: 100000,
      type: [],
      category: [],
      rating: 0,
      amenities: [],
      instantBook: false,
    };

    setFilters(resetFilters);
    console.log("🔄 Filtres complètement réinitialisés");
  };

  // Charger les données en fonction du type de contenu
  useEffect(() => {
    if (contentType === "accommodations") {
      loadAccommodations();
    } else if (contentType === "touristic_places") {
      loadTouristicPlaces();
    } else if (contentType === "flights") {
      loadFlights();
    } else if (contentType === "activities") {
      loadActivities();
    }
    loadStats();
  }, [contentType]);

  const loadAccommodations = async () => {
    try {
      setLoading(true);
      const response = await tourismeAPI.getAccommodations();
      console.log("🏨 Réponse API hébergements:", response.data);

      if (response.data.success) {
        const listingsData = response.data.data;
        setListings(listingsData);
        setFilteredListings(listingsData);

        const initialIndexes = {};
        listingsData.forEach((listing) => {
          initialIndexes[listing.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);

        console.log("✅ Hébergements chargés:", listingsData.length);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des hébergements:", error);
      toast.error("Erreur lors du chargement des hébergements");
    } finally {
      setLoading(false);
    }
  };

  const loadTouristicPlaces = async () => {
    try {
      setLoading(true);
      const response = await tourismeAPI.getTouristicPlaces();
      console.log("🏛️ Réponse API lieux touristiques:", response.data);

      if (response.data.success) {
        const placesData = response.data.data;
        setListings(placesData);
        setFilteredListings(placesData);

        const initialIndexes = {};
        placesData.forEach((place) => {
          initialIndexes[place.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);

        console.log("✅ Lieux touristiques chargés:", placesData.length);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des lieux touristiques:", error);
      toast.error("Erreur lors du chargement des lieux touristiques");
    } finally {
      setLoading(false);
    }
  };

  const loadFlights = async () => {
    try {
      setFlightsLoading(true);
      const response = await tourismeAPI.getFlights();
      console.log("✈️ Réponse API vols:", response.data);

      if (response.data.success) {
        const flightsData = response.data.data;
        setFlights(flightsData);
        console.log("✅ Vols chargés:", flightsData.length);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des vols:", error);
      toast.error("Erreur lors du chargement des vols");
    } finally {
      setFlightsLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      setActivitiesLoading(true);
      const response = await api.get('/ActivityCategory');
      console.log("🎯 Réponse API activités:", response.data);

      if (response.data.success) {
        setActivities(response.data.data);
        console.log("✅ Activités chargées:", response.data.data.length);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des activités:", error);
      if (error.response) {
        console.error("Détails de l'erreur:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      toast.error("Erreur lors du chargement des activités");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await tourismeAPI.getStats({
        contentType: contentType === "flights" || contentType === "activities" ? null : contentType,
      });

      console.log("📊 Réponse API stats:", response.data);

      if (response.data.success) {
        setStats(response.data.data);
        console.log(
          "✅ Stats mises à jour pour:",
          contentType,
          response.data.data
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Filtrer les résultats (pour hébergements et lieux touristiques)
  useEffect(() => {
    if (contentType === "flights" || contentType === "activities") return;

    let results = listings;

    console.log("🎯 DÉBUT FILTRAGE - Filtres actuels:", filters);
    console.log("🎯 Listings avant filtrage:", listings.length);

    if (filters.destination) {
      results = results.filter(
        (listing) =>
          listing.city
            .toLowerCase()
            .includes(filters.destination.toLowerCase()) ||
          listing.title
            .toLowerCase()
            .includes(filters.destination.toLowerCase())
      );
      console.log("🎯 Après filtre destination:", results.length);
    }

    if (contentType === "accommodations" && filters.type.length > 0) {
      results = results.filter((listing) =>
        filters.type.includes(listing.type)
      );
      console.log("🎯 Après filtre type:", results.length);
    }

    if (contentType === "touristic_places" && filters.category.length > 0) {
      results = results.filter((listing) =>
        filters.category.includes(listing.category)
      );
      console.log("🎯 Après filtre catégorie:", results.length);
    }

    if (filters.rating > 0) {
      results = results.filter((listing) => listing.rating >= filters.rating);
      console.log("🎯 Après filtre rating:", results.length);
    }

    if (filters.amenities.length > 0) {
      results = results.filter((listing) =>
        filters.amenities.every((amenity) =>
          listing.amenities.includes(amenity)
        )
      );
      console.log("🎯 Après filtre amenities:", results.length);
    }

    if (filters.instantBook) {
      results = results.filter((listing) => listing.instantBook);
      console.log("🎯 Après filtre instantBook:", results.length);
    }

    results = results.filter(
      (listing) =>
        listing.price >= filters.minPrice && listing.price <= filters.maxPrice
    );
    console.log("🎯 Après filtre prix:", results.length);

    console.log("🔍 Filtrage appliqué:", {
      total: listings.length,
      filtrés: results.length,
      filtres: filters,
    });

    setFilteredListings(results);
  }, [filters, listings, contentType]);

  // Fonction pour supprimer une activité
  const handleDeleteActivity = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      return;
    }

    try {
      console.log("🗑️ Suppression activité:", id);
      const response = await api.delete(`/ActivityCategory/${id}`);
      
      if (response.data.success) {
        toast.success("Activité supprimée avec succès");
        
        // Mettre à jour la liste des activités
        setActivities(prev => prev.filter(activity => activity.id !== id));
        
        // Si l'activité sélectionnée est celle qu'on supprime, on la retire
        if (selectedActivity?.id === id) {
          setSelectedActivity(null);
          setShowActivityDetailModal(false);
        }
        
        console.log("✅ Activité supprimée avec succès");
      }
    } catch (error) {
      console.error("❌ Erreur suppression activité:", error);
      toast.error(error.response?.data?.error || "Erreur lors de la suppression");
    }
  };

  // Fonction pour éditer une activité
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    // Si vous avez un modal spécifique pour les activités, utilisez-le
    // Sinon, vous pouvez utiliser le modal d'activités en mode édition
    setShowActivitiesModal(true);
  };

  // Fonction pour voir les détails d'une activité
  const handleViewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setShowActivityDetailModal(true);
  };

  const handleDeleteListing = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      return;
    }

    try {
      console.log("🗑️ Suppression:", id);
      await tourismeAPI.deleteListing(id);
      toast.success(
        contentType === "touristic_places"
          ? "Lieu touristique supprimé avec succès"
          : "Hébergement supprimé avec succès"
      );

      setListings((prev) => {
        const updated = prev.filter((listing) => listing.id !== id);
        console.log("📊 Listings après suppression:", updated.length);
        return updated;
      });

      resetAllFilters();
      await loadStats();
      console.log("✅ Suppression terminée");
    } catch (error) {
      const backendMessage = error.response?.data?.error;
      toast.error(backendMessage || "Erreur lors de la suppression");
      console.error("❌ Erreur suppression:", error);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      console.log("🔄 Bascule disponibilité:", id);
      const response = await tourismeAPI.toggleAvailability(id);
      console.log("📥 Réponse disponibilité:", response.data);

      if (response.data.success) {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        setFilteredListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        toast.success(response.data.message);
        await loadStats();
        console.log("✅ Disponibilité basculée");
      }
    } catch (error) {
      console.error("❌ Erreur bascule disponibilité:", error);
      toast.error(
        error.response?.data?.error ||
        "Erreur lors du changement de disponibilité"
      );
    }
  };

  const toggleFeatured = async (id) => {
    try {
      console.log("⭐ Bascule vedette:", id);
      const response = await tourismeAPI.toggleFeatured(id);
      console.log("📥 Réponse vedette:", response.data);

      if (response.data.success) {
        setListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        setFilteredListings((prev) =>
          prev.map((listing) =>
            listing.id === id ? response.data.data : listing
          )
        );

        toast.success(response.data.message);
        await loadStats();
        console.log("✅ Statut vedette basculé");
      }
    } catch (error) {
      console.error("❌ Erreur bascule vedette:", error);
      toast.error(
        error.response?.data?.error ||
        "Erreur lors du changement de statut vedette"
      );
    }
  };

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setShowAdminModal(true);
  };

  const openDetailModal = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const getTypeIcon = (type, isTouristicPlace, category) => {
    if (isTouristicPlace) {
      const categoryObj = touristicCategories.find(
        (cat) => cat.id === category
      );
      return categoryObj?.icon || Landmark;
    }

    switch (type) {
      case "hotel":
        return Building;
      case "apartment":
        return Home;
      case "villa":
        return Home;
      case "guesthouse":
        return Home;
      default:
        return Building;
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
        toast.success("Retiré des favoris");
      } else {
        newFavorites.add(id);
        toast.success("Ajouté aux favoris");
      }
      return newFavorites;
    });
  };

  const handleBooking = (listing) => {
    setSelectedListing(listing);
    setBookingForm((prev) => ({
      ...prev,
      listingId: listing.id,
      guests: listing.maxGuests || 2,
    }));
    setShowBookingModal(true);
  };

  const handleAdminSubmit = async (formData) => {
    try {
      console.log("📤 Envoi des données avec images:", formData);
      setShowAdminModal(false);
      setEditingListing(null);
      resetAllFilters();

      if (formData.isTouristicPlace) {
        await loadTouristicPlaces();
      } else {
        await loadAccommodations();
      }
      await loadStats();
      console.log("✅ Opération terminée avec succès");
    } catch (error) {
      console.error("❌ Erreur opération:", error);
      toast.error(error.response?.data?.error || "Erreur lors de l'opération");
    }
  };

  const handleCloseAdminModal = () => {
    setShowAdminModal(false);
    setEditingListing(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedListing(null);
  };

  const handleCloseActivityDetailModal = () => {
    setShowActivityDetailModal(false);
    setSelectedActivity(null);
  };

  // Composant Carte pour Hébergements et Lieux Touristiques
  const ListingCard = ({ listing }) => {
    const isTouristicPlace = listing.isTouristicPlace;
    const TypeIcon = getTypeIcon(
      listing.type,
      isTouristicPlace,
      listing.category
    );
    const isFavorite = favorites.has(listing.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <TypeIcon className="w-12 h-12 mx-auto mb-2" />
                <div>Galerie d'images</div>
                <div className="text-xs mt-1">
                  {listing.images?.length || 0} photos
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
              {isTouristicPlace ? listing.category : listing.type}
            </span>
            {listing.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Vedette
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => toggleFavorite(listing.id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
                }`}
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>
            {!isTouristicPlace && listing.instantBook && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                Instant
              </span>
            )}
          </div>

          {listing.price > 0 && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
                <span className="text-lg font-bold">{listing.price}€</span>
                {!isTouristicPlace && (
                  <span className="text-sm opacity-90">/nuit</span>
                )}
              </div>
            </div>
          )}

          {user?.role === "professional" && (
            <div className="absolute bottom-3 right-3">
              <button
                onClick={() => toggleAvailability(listing.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${listing.available
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
                  }`}
              >
                {listing.available ? "✓ Disponible" : "✗ Indisponible"}
              </button>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-gray-600 flex items-center text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.city}
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-900">
                {listing.rating}
              </span>
              <span className="text-gray-500 ml-1">
                ({listing.reviewCount} avis)
              </span>
            </div>

            {user?.role === "professional" && (
              <button
                onClick={() => toggleFeatured(listing.id)}
                className={`p-1 rounded-full transition-all duration-300 ${listing.featured
                  ? "text-yellow-500 bg-yellow-50"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                title={
                  listing.featured
                    ? "Retirer des vedettes"
                    : "Mettre en vedette"
                }
              >
                <Star
                  className={`w-4 h-4 ${listing.featured ? "fill-current" : ""
                    }`}
                />
              </button>
            )}
          </div>

          {isTouristicPlace ? (
            <div className="mb-4 space-y-2">
              {listing.entranceFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tarif d'entrée:</span>
                  <span className="font-semibold text-green-600">
                    {listing.entranceFee}
                  </span>
                </div>
              )}
              {listing.openingHours && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{listing.openingHours}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{listing.maxGuests}</span>
                </div>
                {listing.bedrooms && (
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{listing.bedrooms}</span>
                  </div>
                )}
                {listing.bathrooms && (
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{listing.bathrooms}</span>
                  </div>
                )}
                {listing.area && (
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{listing.area}m²</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {listing.amenities.slice(0, 4).map((amenityId) => {
                const amenity = availableAmenities.find(
                  (a) => a.id === amenityId
                );
                const IconComponent = amenity?.icon || CheckCircle;
                return (
                  <div
                    key={amenityId}
                    className="flex items-center p-1 bg-gray-100 rounded-lg"
                  >
                    <IconComponent className="w-3 h-3 text-blue-600 mr-1" />
                    <span className="text-xs text-gray-700">
                      {amenity?.label}
                    </span>
                  </div>
                );
              })}
              {listing.amenities.length > 4 && (
                <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-700">
                    +{listing.amenities.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => openDetailModal(listing)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </button>

            {user?.role === "professional" && (
              <>
                <button
                  onClick={() => openEditModal(listing)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteListing(listing.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Composant Carte pour Vols
  const FlightCard = ({ flight }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {flight.image ? (
            <img
              src={flight.image}
              alt={`${flight.compagnie} - ${flight.numeroVol}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <Plane className="w-12 h-12 mx-auto mb-2" />
                <div>{flight.compagnie}</div>
                <div className="text-xs mt-1">{flight.numeroVol}</div>
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-lg font-bold">{flight.prix}€</span>
              <span className="text-sm opacity-90"> par personne</span>
            </div>
          </div>

          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
              {flight.classe === "economy" && "✈️ Économique"}
              {flight.classe === "premium" && "✨ Premium"}
              {flight.classe === "business" && "💼 Affaires"}
              {flight.classe === "first" && "👑 Première"}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {flight.departVille} → {flight.arriveeVille}
              </h3>
              <p className="text-gray-600 text-sm">
                {flight.compagnie} • {flight.numeroVol}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Départ</div>
              <div className="font-semibold text-sm">
                {new Date(flight.departDateHeure).toLocaleString("fr-FR")}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Arrivée</div>
              <div className="font-semibold text-sm">
                {new Date(flight.arriveeDateHeure).toLocaleString("fr-FR")}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Durée: {flight.duree}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                {flight.escales} escale{flight.escales > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {flight.services && flight.services.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Services inclus:</p>
              <div className="flex flex-wrap gap-1">
                {flight.services.map((service) => (
                  <span
                    key={service}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                  >
                    {service === "meal" && "🍽️ Repas"}
                    {service === "baggage" && "🧳 Bagage"}
                    {service === "wifi" && "📡 Wi-Fi"}
                    {service === "entertainment" && "🎬 Divertissement"}
                    {service === "power" && "🔌 Électricité"}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {user?.role === "professional" && (
              <>
                <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Composant Carte pour Activités
  const ActivityCard = ({ activity }) => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {activity.image ? (
            <img
              src={activity.image}
              alt={activity.name || activity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <div className="text-6xl mb-2">🎯</div>
                <div>Activité</div>
              </div>
            </div>
          )}

          {activity.price > 0 && (
            <div className="absolute bottom-3 left-3">
              <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
                <span className="text-lg font-bold">{activity.price}€</span>
                <span className="text-sm opacity-90">/personne</span>
              </div>
            </div>
          )}

          {activity.category && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800">
                {activity.category}
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
              {activity.name || activity.title}
            </h3>
            
            {activity.location && (
              <p className="text-gray-600 flex items-center text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.location}
              </p>
            )}
          </div>

          {activity.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {activity.description}
            </p>
          )}

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              {activity.duration && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{activity.duration}</span>
                </div>
              )}
              {activity.capacity && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{activity.capacity} pers. max</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handleViewActivityDetails(activity)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </button>

            {user?.role === "professional" && (
              <>
                <button
                  onClick={() => handleEditActivity(activity)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal pour les détails d'activité
  const ActivityDetailModal = ({ isOpen, onClose, activity }) => {
    if (!isOpen || !activity) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {activity.name || activity.title}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {activity.location && (
              <p className="text-gray-600 flex items-center mt-2">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.location}
              </p>
            )}
          </div>

          <div className="p-6 space-y-6">
            {activity.image ? (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name || activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🎯</div>
                    <div>Activité</div>
                  </div>
                </div>
              </div>
            )}

            {activity.description && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-600">{activity.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activity.category && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Catégorie</div>
                  <div className="font-semibold">{activity.category}</div>
                </div>
              )}
              
              {activity.price > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Prix</div>
                  <div className="font-semibold text-green-600">
                    {activity.price}€ / personne
                  </div>
                </div>
              )}
              
              {activity.duration && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600 mb-2" />
                  <div className="text-sm text-gray-600">Durée</div>
                  <div className="font-semibold">{activity.duration}</div>
                </div>
              )}
              
              {activity.capacity && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mb-2" />
                  <div className="text-sm text-gray-600">Capacité</div>
                  <div className="font-semibold">
                    {activity.capacity} personnes max
                  </div>
                </div>
              )}
            </div>

            {activity.included && activity.included.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Inclus dans l'activité
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activity.included.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activity.requirements && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Prérequis
                </h4>
                <p className="text-gray-600">{activity.requirements}</p>
              </div>
            )}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Fermer
              </button>
              {user?.role === "professional" && (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      handleEditActivity(activity);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
                        handleDeleteActivity(activity.id);
                        onClose();
                      }
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Interface Admin avec cartes
  const AdminInterface = () => {
    const currentContentType = contentTypeOptions.find(
      (opt) => opt.id == contentType
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {currentContentType?.label || "Gestion du Tourisme"}
            </h1>
            <p className="text-gray-600">
              {currentContentType?.description ||
                "Administrez vos services touristiques"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 min-w-64 justify-between"
              >
                <div className="flex items-center">
                  {currentContentType?.icon && (
                    <currentContentType.icon className="w-5 h-5 mr-3" />
                  )}
                  <span>{currentContentType?.label || "Sélectionner"}</span>
                </div>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showContentTypeDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="p-2">
                    {contentTypeOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            setContentType(option.id);
                            setShowContentTypeDropdown(false);
                          }}
                          className="w-full flex items-center px-4 py-4 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300 border-b border-gray-100 last:border-b-0"
                        >
                          <IconComponent className="w-6 h-6 mr-4 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-semibold">{option.label}</div>
                            <div className="text-sm text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {user?.role === "professional" && (
              <button
                onClick={() => {
                  if (contentType === "accommodations") {
                    setEditingListing(null);
                    setShowAdminModal(true);
                  } else if (contentType === "touristic_places") {
                    setEditingListing(null);
                    setShowAdminModal(true);
                  } else if (contentType === "flights") {
                    setShowFlightModal(true);
                  } else if (contentType === "activities") {
                    setEditingActivity(null);
                    setShowActivitiesModal(true);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {contentType === "accommodations" && "Ajouter un hébergement"}
                {contentType === "touristic_places" && "Ajouter un lieu touristique"}
                {contentType === "flights" && "Ajouter un vol"}
                {contentType === "activities" && "Ajouter une activité"}
              </button>
            )}
          </div>
        </div>

        {stats && contentType !== "flights" && contentType !== "activities" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalListings || 0}
                  </div>
                  <div className="text-gray-600">
                    {contentType === "accommodations"
                      ? "Hébergements"
                      : contentType === "touristic_places"
                        ? "Lieux touristiques"
                        : "Total"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.averageRating?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-gray-600">Note moyenne</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.availableListings || 0}
                  </div>
                  <div className="text-gray-600">Disponibles</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {stats.totalBookings || 0}
                  </div>
                  <div className="text-gray-600">Réservations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {contentType === "flights" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Plane className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{flights.length}</div>
                  <div className="text-gray-600">Vols actifs</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {flights.length > 0
                      ? flights.reduce(
                        (total, flight) =>
                          total + (flight.availableSeats || 0),
                        0
                      )
                      : 0}
                  </div>
                  <div className="text-gray-600">Places disponibles</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {flights.length > 0
                      ? Math.min(...flights.map((f) => f.prix || Infinity)) ===
                        Infinity
                        ? 0
                        : Math.min(...flights.map((f) => f.prix || Infinity))
                      : 0}
                    €
                  </div>
                  <div className="text-gray-600">Prix minimum</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {flights.length > 0
                      ? flights.reduce(
                        (total, flight) => total + (flight.nbrPersonne || 0),
                        0
                      )
                      : 0}
                  </div>
                  <div className="text-gray-600">Réservations</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {contentType === "activities" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Mountain className="w-8 h-8 text-blue-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <div className="text-gray-600">Activités</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {activities.length > 0
                      ? (activities.reduce(
                        (total, activity) => total + (activity.price || 0),
                        0
                      ) / activities.length).toFixed(2)
                      : "0.00"}
                    €
                  </div>
                  <div className="text-gray-600">Prix moyen</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {activities.length > 0
                      ? Math.min(...activities.map((a) => a.price || Infinity)) ===
                        Infinity
                        ? 0
                        : Math.min(...activities.map((a) => a.price || Infinity))
                      : 0}
                    €
                  </div>
                  <div className="text-gray-600">Prix minimum</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <div className="text-2xl font-bold">
                    {activities.length > 0
                      ? activities.filter((a) => a.available !== false).length
                      : 0}
                  </div>
                  <div className="text-gray-600">Disponibles</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading || flightsLoading || activitiesLoading ? (
          <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
            <img src="/loading.gif" alt="" className='w-24 h-24' />
            <p className="mt-4 text-xl font-semibold text-gray-700">
              Chargement...
            </p>
          </div>
        ) : (
          <>
            {(contentType === "accommodations" ||
              contentType === "touristic_places") && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>

                  {filteredListings.length === 0 && (
                    <div className="text-center py-12">
                      {contentType === "accommodations" ? (
                        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      ) : (
                        <Landmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {contentType === "accommodations"
                          ? "Aucun hébergement trouvé"
                          : "Aucun lieu touristique trouvé"}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {listings.length === 0
                          ? `Commencez par ajouter votre premier ${contentType === "accommodations"
                            ? "hébergement"
                            : "lieu touristique"
                          }.`
                          : "Aucun élément ne correspond à vos critères de recherche."}
                      </p>
                      {listings.length === 0 && user?.role === "professional" && (
                        <button
                          onClick={() => {
                            setEditingListing(null);
                            setShowAdminModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 mx-auto"
                        >
                          <PlusCircle className="w-5 h-5 mr-2" />
                          {contentType === "accommodations"
                            ? "Ajouter un hébergement"
                            : "Ajouter un lieu touristique"}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}

            {contentType === "flights" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {flights.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} />
                  ))}
                </div>

                {flights.length === 0 && (
                  <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun vol trouvé
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {user?.role === "professional"
                        ? "Commencez par ajouter votre premier vol."
                        : "Aucun vol disponible pour le moment."}
                    </p>
                    {user?.role === "professional" && (
                      <button
                        onClick={() => setShowFlightModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 mx-auto"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Ajouter un vol
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

        {contentType === "activities" && (
  <div className="space-y-8">
    {/* En-tête avec statistiques */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Activités</h2>
          <p className="text-gray-600 mt-1">
            Gérez vos activités touristiques et catégories
          </p>
        </div>
        
        {user?.role === "professional" && (
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-gray-200">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-700">
                {activities.filter(a => a.isActive !== false).length} actives
              </span>
            </div>
            <button
              onClick={() => {
                setEditingActivity(null);
                setShowActivitiesModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Nouvelle activité</span>
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Cartes d'activités avec effet de vitrine */}
    {activitiesLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : activities.length > 0 ? (
      <>
        {/* Filtres rapides */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors">
            Toutes ({activities.length})
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Actives ({activities.filter(a => a.isActive !== false).length})
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Inactives ({activities.filter(a => a.isActive === false).length})
          </button>
        </div>

        {/* Grille d'activités améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* En-tête avec image et badge de statut */}
              <div className="relative h-56 overflow-hidden">
                {activity.image ? (
                  <img
                    src={activity.image}
                    alt={activity.name || activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-5xl mb-2">🎯</div>
                      <div className="font-medium">Activité</div>
                    </div>
                  </div>
                )}
                
                {/* Badge de statut */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${activity.isActive === false
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                    {activity.isActive === false ? 'Inactive' : 'Active'}
                  </span>
                </div>
                
                {/* Prix en overlay */}
                {activity.price > 0 && (
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
                      <span className="text-xl font-bold">{activity.price}€</span>
                      <span className="text-sm opacity-90">/personne</span>
                    </div>
                  </div>
                )}
                
                {/* Icône de catégorie */}
                {activity.icon && (
                  <div className="absolute top-4 right-4">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: activity.color || '#3B82F6' }}
                    >
                      <span className="font-bold">{activity.icon.charAt(0)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Titre et catégorie */}
                <div className="mb-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1">
                      {activity.name || activity.title}
                    </h3>
                    <div className="flex space-x-2">
                      {user?.role === "professional" && (
                        <>
                          <button
                            onClick={() => handleEditActivity(activity)}
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteActivity(activity.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {activity.category && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                        {activity.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {activity.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {activity.description}
                  </p>
                )}

                {/* Métadonnées */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {activity.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm truncate">{activity.location}</span>
                    </div>
                  )}
                  
                  {activity.duration && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{activity.duration}</span>
                    </div>
                  )}
                  
                  {activity.capacity && (
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{activity.capacity} pers.</span>
                    </div>
                  )}
                </div>

                {/* Inclus dans l'activité */}
                {activity.included && activity.included.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2">Inclus :</p>
                    <div className="flex flex-wrap gap-1">
                      {activity.included.slice(0, 3).map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-50 text-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {item}
                        </span>
                      ))}
                      {activity.included.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600">
                          +{activity.included.length - 3} plus
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewActivityDetails(activity)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Détails
                  </button>
                  
                  {!user?.role === "professional" && activity.price > 0 && (
                    <button className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium text-sm transition-all duration-300">
                      Réserver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination ou compteur */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          <div className="text-gray-600">
            Affichage de <span className="font-semibold text-gray-900">{activities.length}</span> activité{activities.length > 1 ? 's' : ''}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">
              ← Précédent
            </button>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">1</span>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Suivant →
            </button>
          </div>
        </div>
      </>
    ) : (
      /* État vide amélioré */
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <div className="text-4xl">🎯</div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Aucune activité disponible
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          {user?.role === "professional"
            ? "Commencez par créer votre première activité pour enrichir votre catalogue touristique."
            : "Revenez plus tard pour découvrir nos activités passionnantes."}
        </p>
        {user?.role === "professional" && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setEditingActivity(null);
                setShowActivitiesModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <PlusCircle className="w-6 h-6" />
              <span>Créer une activité</span>
            </button>
            <button
              onClick={() => loadActivities()}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Rafraîchir
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <AdminInterface />
      </div>

      <AdminModal
        isOpen={showAdminModal}
        onClose={handleCloseAdminModal}
        onSubmit={handleAdminSubmit}
        editingListing={editingListing}
        contentType={contentType}
      />

      <DetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        selectedListing={selectedListing}
        onBook={handleBooking}
      />

      <ActivityDetailModal
        isOpen={showActivityDetailModal}
        onClose={handleCloseActivityDetailModal}
        activity={selectedActivity}
      />

      {showFlightModal && (
        <AjoutVolModal
          isOpen={showFlightModal}
          onClose={() => setShowFlightModal(false)}
          onSubmit={(flightData) => {
            console.log("Nouveau vol:", flightData);
            toast.success("Vol ajouté avec succès");
            setShowFlightModal(false);
            loadFlights();
          }}
        />
      )}

      {showActivitiesModal && (
        <AjoutActivitesModal
          isOpen={showActivitiesModal}
          onClose={() => setShowActivitiesModal(false)}
          editingActivity={editingActivity}
          onSubmit={(activitesData) => {
            console.log("Nouvelle activité:", activitesData);
            toast.success(editingActivity ? "Activité modifiée avec succès" : "Activité ajoutée avec succès");
            setShowActivitiesModal(false);
            setEditingActivity(null);
            loadActivities();
          }}
        />
      )}

      <AirlineModal
        isOpen={showAirlineModal}
        onClose={() => setShowAirlineModal(false)}
      />
    </div>
  );
}