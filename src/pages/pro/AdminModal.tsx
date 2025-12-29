import { useState, useEffect, useRef } from "react";
import {
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Snowflake,
  Tv,
  CheckCircle,
  X,
  Upload,
  Trash,
  Landmark,
  Building,
  Mountain,
  Camera,
} from "lucide-react";
import { toast } from "sonner";
import { tourismeAPI } from "../../lib/api";

// Constantes de couleur
const COLORS = {
  logo: "#556B2F",
  primary: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  smallText: "#000000",
};

// Amenities disponibles
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
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    setUploading(true);

    try {
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

      if (response.data.success) {
        onSubmit(response.data.data);
        toast.success(
          editingListing
            ? `${
                formData.isTouristicPlace ? "Lieu touristique" : "Hébergement"
              } modifié avec succès ✅`
            : `${
                formData.isTouristicPlace ? "Lieu touristique" : "Hébergement"
              } créé avec succès ✅`
        );
      }
    } catch (error) {
      console.error("❌ Erreur soumission:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la soumission"
      );
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }
    setFormData(defaultForm);
    setUploadedFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b" style={{ borderColor: COLORS.separator }}>
          <div className="flex justify-between items-center">
            <h3
              className="text-2xl font-bold"
              style={{ color: COLORS.secondaryText }}
            >
              {editingListing
                ? `Modifier ${
                    formData.isTouristicPlace
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
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Type de contenu *
              </label>
              <select
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                }}
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
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.secondaryText }}
                >
                  Catégorie *
                </label>
                <select
                  className="w-full p-3 border-2 rounded-xl focus:ring-2"
                  style={{
                    borderColor: COLORS.separator,
                    color: COLORS.smallText,
                  }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Tarif d'entrée
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Site web
                  </label>
                  <input
                    type="url"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Contact
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Type d'hébergement *
                  </label>
                  <select
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Prix (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Chambres
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Salles de bain
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Voyageurs max *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
                  <span
                    className="ml-2 text-sm"
                    style={{ color: COLORS.smallText }}
                  >
                    Réservation instantanée
                  </span>
                </label>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.secondaryText }}
                  >
                    Politique d'annulation
                  </label>
                  <select
                    className="w-full p-3 border-2 rounded-xl focus:ring-2"
                    style={{
                      borderColor: COLORS.separator,
                      color: COLORS.smallText,
                    }}
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
            <label
              className="block text-sm font-semibold mb-4"
              style={{ color: COLORS.secondaryText }}
            >
              Images {uploading && "(Upload en cours...)"}
            </label>
            <div
              className="border-2 border-dashed rounded-xl p-6 text-center mb-4"
              style={{ borderColor: COLORS.separator }}
            >
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
                className="text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: COLORS.primary }}
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
              <p className="text-sm mt-2" style={{ color: COLORS.logo }}>
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
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Titre *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                }}
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Ville *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                }}
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: COLORS.secondaryText }}
            >
              Description
            </label>
            <textarea
              rows={3}
              className="w-full p-3 border-2 rounded-xl focus:ring-2"
              style={{
                borderColor: COLORS.separator,
                color: COLORS.smallText,
              }}
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
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Note
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                }}
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
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: COLORS.secondaryText }}
              >
                Nombre d'avis
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 border-2 rounded-xl focus:ring-2"
                style={{
                  borderColor: COLORS.separator,
                  color: COLORS.smallText,
                }}
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
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: COLORS.secondaryText }}
            >
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
                  <span
                    className="ml-2 text-sm"
                    style={{ color: COLORS.smallText }}
                  >
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
              <span
                className="ml-2 text-sm"
                style={{ color: COLORS.smallText }}
              >
                Disponible
              </span>
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
              <span
                className="ml-2 text-sm"
                style={{ color: COLORS.smallText }}
              >
                Mettre en vedette
              </span>
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 px-6 border-2 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              style={{ borderColor: COLORS.separator }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300"
              style={{ backgroundColor: COLORS.primary }}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  {editingListing ? "Modification..." : "Création..."}
                </>
              ) : editingListing ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;