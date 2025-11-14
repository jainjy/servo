import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  Phone,
  Edit,
  Trash2,
  Archive,
  Calendar,
  MapPin,
  Euro,
  Ruler,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Upload,
  Star,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";

// Types et statuts alignés avec le backend
const STATUT_ANNONCE = {
  draft: { label: "Brouillon", color: "bg-blue-100 text-blue-800" },
  for_sale: { label: "À vendre", color: "bg-green-100 text-green-800" },
  for_rent: { label: "À louer", color: "bg-purple-100 text-purple-800" },
  sold: { label: "Vendu", color: "bg-gray-100 text-gray-800" },
  rented: { label: "Loué", color: "bg-gray-100 text-gray-800" },
};

const TYPE_BIEN = {
  house: "Maison",
  apartment: "Appartement",
  villa: "Villa",
  land: "Terrain",
  studio: "Studio",
};

const LISTING_TYPE = {
  sale: "Vente",
  rent: "Location",
  both: "Les deux",
};

const TYPE_LOCATION = {
  longue_duree: "Longue durée",
  saisonniere: "Saisonnière",
};

// Composant Modal
const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn ${sizeClasses[size]}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90"
            style={{ color: "#5A6470" }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Composant Modal Création Annonce (Étapes)
const ModalCreationAnnonce = ({ isOpen, onClose, onSave, annonce }) => {
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [user, setUser] = useState(null);
  // Ajout du state pour le modal de sélection de position
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Étape 1 - Informations générales
    title: "",
    type: "apartment",
    description: "",
    price: "",
    // Étape 2 - Caractéristiques
    surface: "",
    rooms: "",
    bedrooms: "",
    bathrooms: "",
    address: "",
    city: "",
    // Étape 3 - Options
    listingType: "sale",
    rentType: "longue_duree",
    features: [],
    // Étape 4 - Médias
    images: [],
    // Étape 5 - Publication
    status: "draft",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // Initialiser les données existantes lors de l'édition
  useEffect(() => {
    if (annonce) {
      const existingImages = annonce.images
        ? annonce.images.map((url) => ({
            url,
            preview: url,
            isNew: false,
          }))
        : [];

      setFormData({
        title: annonce.title || "",
        type: annonce.type || "apartment",
        description: annonce.description || "",
        price: annonce.price || "",
        surface: annonce.surface || "",
        rooms: annonce.rooms || "",
        bedrooms: annonce.bedrooms || "",
        bathrooms: annonce.bathrooms || "",
        address: annonce.address || "",
        city: annonce.city || "",
        listingType: annonce.listingType || "sale",
        rentType: annonce.rentType || "longue_duree",
        features: annonce.features || [],
        images: existingImages,
        status: annonce.status || "draft",
        latitude: annonce.latitude ?? null,
        longitude: annonce.longitude ?? null,
      });
    } else {
      // Réinitialiser pour une nouvelle annonce
      setFormData({
        title: "",
        type: "apartment",
        description: "",
        price: "",
        surface: "",
        rooms: "",
        bedrooms: "",
        bathrooms: "",
        address: "",
        city: "",
        listingType: "sale",
        rentType: "longue_duree",
        features: [],
        images: [],
        status: "draft",
        latitude: null,
        longitude: null,
      });
    }
  }, [annonce]);

  // Nettoyer les URLs d'object à la fermeture
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img.isNew && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const etapes = [
    { numero: 1, titre: "Informations générales" },
    { numero: 2, titre: "Caractéristiques" },
    { numero: 3, titre: "Options" },
    { numero: 4, titre: "Médias" },
    { numero: 5, titre: "Publication" },
  ];

  // Fonction pour uploader les images
  const handleImageUpload = async (files) => {
    setUploadingImages(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await api.post("/upload/property-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Erreur lors de l'upload des images");
    } finally {
      setUploadingImages(false);
    }

    return uploadedUrls;
  };

  // Gestion du changement de fichiers - stockage temporaire
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Stocker les fichiers temporairement
      const fileObjects = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true, // Marquer comme nouvelle image
      }));

      setFormData({
        ...formData,
        images: [...formData.images, ...fileObjects],
      });

      // Réinitialiser l'input file
      e.target.value = "";
    }
  };

  // Supprimer une image
  const removeImage = (index) => {
    const imageToRemove = formData.images[index];

    // Si c'est une nouvelle image (fichier), libérer l'URL d'object
    if (imageToRemove.isNew && imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  // Fonction pour uploader toutes les images avant soumission
  const uploadAllImages = async () => {
    const newImages = formData.images.filter((img) => img.isNew);
    const existingImages = formData.images.filter((img) => !img.isNew);

    if (newImages.length === 0) {
      return existingImages.map((img) => img.url || img);
    }

    const files = newImages.map((img) => img.file);
    const uploadedUrls = await handleImageUpload(files);

    // Libérer les URLs d'object
    newImages.forEach((img) => {
      if (img.preview) {
        URL.revokeObjectURL(img.preview);
      }
    });

    return [...existingImages.map((img) => img.url || img), ...uploadedUrls];
  };

  // Callback pour la sélection de position
  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Uploader toutes les images d'abord
      const finalImageUrls = await uploadAllImages();

      const payload = {
        ...formData,
        images: finalImageUrls,
        price: formData.price ? parseFloat(formData.price) : null,
        surface: formData.surface ? parseInt(formData.surface) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        ownerId: user.id,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      // Supprimer les propriétés temporaires des images
      delete payload.images;

      if (annonce) {
        await api.put(`/properties/${annonce.id}`, {
          ...payload,
          images: finalImageUrls,
        });
        toast.success("Annonce modifiée avec succès");
      } else {
        await api.post("/properties", { ...payload, images: finalImageUrls });
        toast.success("Annonce créée avec succès");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const etapeSuivante = () => {
    if (etape < 5) setEtape(etape + 1);
  };

  const etapePrecedente = () => {
    if (etape > 1) setEtape(etape - 1);
  };

  const equipementsDisponibles = [
    "pool",
    "garden",
    "parking",
    "terrace",
    "balcony",
    "elevator",
    "fireplace",
    "air_conditioning",
    "fiber_optic",
  ];

  return (
    <>
      {/* Modal de sélection de position */}
      <LocationPickerModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={handleLocationChange}
      />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={annonce ? "Modifier l'annonce" : "Nouvelle annonce"}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {etapes.map((step, index) => (
                <div key={step.numero} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      etape >= step.numero
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.numero}
                  </div>
                  {index < etapes.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        etape > step.numero ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center font-medium" style={{ color: "#0A0A0A" }}>
              {etapes.find((s) => s.numero === etape)?.titre}
            </div>
          </div>

          {/* Étape 1 - Informations générales */}
          {etape === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <Label className="block mb-2">Titre de l'annonce *</Label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Superbe appartement vue panoramique..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block mb-2">Type de bien *</Label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  >
                    {Object.entries(TYPE_BIEN).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="block mb-2">Prix *</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="Ex: 450000"
                      className="pl-8"
                    />
                    <Euro
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="block mb-2">Description *</Label>
                <Textarea
                  required
                  rows={6}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez votre bien en détail..."
                />
              </div>
            </div>
          )}

          {/* Étape 2 - Caractéristiques */}
          {etape === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="block mb-2">Surface (m²) *</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      required
                      value={formData.surface}
                      onChange={(e) =>
                        setFormData({ ...formData, surface: e.target.value })
                      }
                      placeholder="Ex: 75"
                      className="pl-8"
                    />
                    <Ruler
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block mb-2">Nombre de pièces *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.rooms}
                    onChange={(e) =>
                      setFormData({ ...formData, rooms: e.target.value })
                    }
                    placeholder="Ex: 3"
                  />
                </div>

                <div>
                  <Label className="block mb-2">Nombre de chambres *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    placeholder="Ex: 2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block mb-2">Salles de bain</Label>
                  <Input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    placeholder="Ex: 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label className="block mb-2">Adresse complète *</Label>
                  <div className="relative">
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Ex: 123 Avenue des Champs-Élysées"
                      className="pl-8"
                    />
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                  </div>
                </div>

                <div>
                  <Label className="block mb-2">Ville *</Label>
                  <Input
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Ex: Paris"
                  />
                </div>
              </div>

              {/* Sélection de la position */}
              <div>
                <Label className="block mb-2">Position sur la carte</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocationModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <MapPin size={16} />
                    Sélectionner sur la carte
                  </Button>
                  {formData.latitude && formData.longitude && (
                    <span className="text-xs text-gray-600 ml-2">
                      <strong>Lat:</strong> {formData.latitude.toFixed(6)},{" "}
                      <strong>Lng:</strong> {formData.longitude.toFixed(6)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Permet d'afficher le bien sur la carte.
                </div>
              </div>
            </div>
          )}

          {/* Étape 3 - Options */}
          {etape === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <Label className="block mb-2">Type d'annonce *</Label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={formData.listingType}
                  onChange={(e) =>
                    setFormData({ ...formData, listingType: e.target.value })
                  }
                  required
                >
                  {Object.entries(LISTING_TYPE).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ajouter le champ rentType si le type est location */}
              {(formData.listingType === "rent" ||
                formData.listingType === "both") && (
                <div className="mt-4">
                  <Label className="block mb-2">Type de location *</Label>
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={formData.rentType}
                    onChange={(e) =>
                      setFormData({ ...formData, rentType: e.target.value })
                    }
                    required
                  >
                    {Object.entries(TYPE_LOCATION).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label className="block mb-4">Équipements et commodités</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {equipementsDisponibles.map((equipement) => (
                    <div key={equipement} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        checked={formData.features.includes(equipement)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              features: [...formData.features, equipement],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              features: formData.features.filter(
                                (e) => e !== equipement
                              ),
                            });
                          }
                        }}
                      />
                      <Label className="text-sm capitalize">
                        {equipement.replace("_", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Étape 4 - Médias */}
          {etape === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <Label className="block mb-2">Photos du bien</Label>
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors ${
                    uploadingImages ? "opacity-50" : "hover:border-blue-400"
                  }`}
                >
                  <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                  <div
                    className="text-lg font-semibold mb-2"
                    style={{ color: "#0A0A0A" }}
                  >
                    {uploadingImages
                      ? "Upload en cours..."
                      : "Ajouter des photos"}
                  </div>
                  <div className="text-sm mb-4" style={{ color: "#5A6470" }}>
                    Glissez-déposez vos photos ou cliquez pour parcourir
                    <br />
                    <span className="text-xs">
                      Formats supportés: JPG, PNG, WEBP (max 5MB par image)
                    </span>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="property-images"
                    disabled={uploadingImages}
                  />
                  <Label
                    htmlFor="property-images"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white transition-colors ${
                      uploadingImages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-gray-50"
                    }`}
                  >
                    {uploadingImages ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2" size={16} />
                    )}
                    {uploadingImages ? "Upload..." : "Choisir des fichiers"}
                  </Label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Images sélectionnées ({formData.images.length})</Label>
                    {formData.images.some((img) => img.isNew) && (
                      <span className="text-sm text-blue-600">
                        {formData.images.filter((img) => img.isNew).length}{" "}
                        nouvelle(s) image(s) à uploader
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview || image.url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100 duration-300"
                            onClick={() => removeImage(index)}
                            disabled={uploadingImages}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {image.isNew && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-green-500 text-white text-xs">
                              Nouveau
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length === 0 && !uploadingImages && (
                <div className="text-center py-8 text-gray-500">
                  <Home className="mx-auto mb-3 text-gray-300" size={48} />
                  <p>Aucune image sélectionnée</p>
                  <p className="text-sm">
                    Ajoutez au moins une photo pour rendre votre annonce plus
                    attractive
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Étape 5 - Publication */}
          {etape === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <Label className="block mb-2">Statut de publication</Label>
                <select
                  className="w-full p-3 border rounded-lg"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  {Object.entries(STATUT_ANNONCE).map(([key, statut]) => (
                    <option key={key} value={key}>
                      {statut.label}
                    </option>
                  ))}
                </select>
              </div>

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="text-blue-600" size={20} />
                  Récapitulatif
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Titre:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {formData.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Type:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {TYPE_BIEN[formData.type]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Prix:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {formData.price} €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Surface:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {formData.surface} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Type d'annonce:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {LISTING_TYPE[formData.listingType]}
                    </span>
                  </div>
                  {(formData.listingType === "rent" ||
                    formData.listingType === "both") && (
                    <div className="flex justify-between">
                      <span style={{ color: "#5A6470" }}>Type de location:</span>
                      <span className="font-medium" style={{ color: "#0A0A0A" }}>
                        {TYPE_LOCATION[formData.rentType]}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "#5A6470" }}>Images:</span>
                    <span className="font-medium" style={{ color: "#0A0A0A" }}>
                      {formData.images.length} image(s)
                      {formData.images.some((img) => img.isNew) &&
                        ` (${
                          formData.images.filter((img) => img.isNew).length
                        } nouvelle(s))`}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation entre étapes */}
          <div className="flex justify-between pt-6 mt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={etapePrecedente}
              disabled={etape === 1 || loading || uploadingImages}
            >
              <ChevronLeft className="mr-2" size={16} />
              Précédent
            </Button>

            {etape < 5 ? (
              <Button
                type="button"
                onClick={etapeSuivante}
                style={{ backgroundColor: "#0052FF", color: "white" }}
                disabled={loading || uploadingImages}
              >
                {uploadingImages ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="ml-2" size={16} />
                )}
                {uploadingImages ? "Upload..." : "Suivant"}
              </Button>
            ) : (
              <Button
                type="submit"
                style={{ backgroundColor: "#0052FF", color: "white" }}
                disabled={loading || uploadingImages}
              >
                {loading || uploadingImages ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                {loading || uploadingImages
                  ? uploadingImages
                    ? "Upload..."
                    : "Sauvegarde..."
                  : annonce
                  ? "Modifier"
                  : "Publier"}{" "}
                l'annonce
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

// Composant Modal Statistiques
const ModalStatistiques = ({ isOpen, onClose, annonce }) => {
  if (!annonce) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Statistiques de l'annonce"
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Eye className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
              {annonce.views || 0}
            </div>
            <div className="text-sm" style={{ color: "#5A6470" }}>
              Vues
            </div>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-600" size={24} />
            <div className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
              {annonce.favorites?.length || 0}
            </div>
            <div className="text-sm" style={{ color: "#5A6470" }}>
              Favoris
            </div>
          </Card>
        </div>

        <div>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0A0A" }}>
            Informations de publication
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#5A6470" }}>Statut:</span>
              <Badge className={STATUT_ANNONCE[annonce.status]?.color}>
                {STATUT_ANNONCE[annonce.status]?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#5A6470" }}>Créée le:</span>
              <span style={{ color: "#0A0A0A" }}>
                {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {annonce.publishedAt && (
              <div className="flex justify-between">
                <span style={{ color: "#5A6470" }}>Publiée le:</span>
                <span style={{ color: "#0A0A0A" }}>
                  {new Date(annonce.publishedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ListingsPage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [filtres, setFiltres] = useState({
    recherche: "",
    statut: "",
    type: "",
  });
  const [showModalCreation, setShowModalCreation] = useState(false);
  const [showModalStatistiques, setShowModalStatistiques] = useState(false);
  const [annonceSelectionnee, setAnnonceSelectionnee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [statsGlobales, setStatsGlobales] = useState({
    total: 0,
    published: 0,
    pending: 0,
    archived: 0,
    totalViews: 0,
    avgViews: 0,
  });

  // Charger les données
  useEffect(() => {
    const init = async () => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser?.id) {
        // Vérifier que l'ID existe
        setUser(currentUser);
        await fetchAnnonces(currentUser.id);
        await fetchStats(currentUser.id);
      }
    };
    init();
  }, []);

  const fetchAnnonces = async (userId) => {
    if (!userId) return; // Ne pas faire la requête si pas d'ID

    try {
      setLoading(true);
      const response = await api.get(`/properties/user/${userId}`);
      setAnnonces(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId) => {
    if (!userId) return; // Ne pas faire la requête si pas d'ID

    try {
      const response = await api.get(`/properties/stats?userId=${userId}`);
      setStatsGlobales(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Filtrer les annonces
  const annoncesFiltrees = annonces.filter((annonce) => {
    const matchRecherche =
      !filtres.recherche ||
      annonce.title.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      annonce.address.toLowerCase().includes(filtres.recherche.toLowerCase());
    const matchStatut = !filtres.statut || annonce.status === filtres.statut;
    const matchType = !filtres.type || annonce.type === filtres.type;

    return matchRecherche && matchStatut && matchType;
  });

  // Gestion des annonces
  const sauvegarderAnnonce = () => {
    fetchAnnonces(user?.id);
    fetchStats(user?.id);
  };

  const supprimerAnnonce = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);
      fetchAnnonces(user?.id);
      fetchStats(user?.id);
      toast.success("Annonce supprimée avec succès");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await api.patch(`/properties/${id}`, {
        status: nouveauStatut,
        publishedAt:
          nouveauStatut === "draft" ? null : new Date().toISOString(),
      });
      await fetchAnnonces(user?.id);
      await fetchStats(user?.id);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const getListingType = (annonce) => {
    if (annonce.listingType === "both") return { vente: true, location: true };
    if (annonce.listingType === "rent") return { vente: false, location: true };
    return { vente: true, location: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Home size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: "#0A0A0A" }}>
                Gestion des Annonces
              </h1>
              <p className="text-lg" style={{ color: "#5A6470" }}>
                Gérez vos biens immobiliers et suivez leurs performances
              </p>
            </div>
          </div>

          <Button
            style={{ backgroundColor: "#0052FF", color: "white" }}
            onClick={() => {
              setAnnonceSelectionnee(null);
              setShowModalCreation(true);
            }}
          >
            <Plus className="mr-2" size={16} />
            Nouvelle annonce
          </Button>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {statsGlobales.total}
                </div>
                <div style={{ color: "#5A6470" }}>Total annonces</div>
              </div>
              <Home className="text-blue-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {statsGlobales.published}
                </div>
                <div style={{ color: "#5A6470" }}>Publiées</div>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {statsGlobales.pending}
                </div>
                <div style={{ color: "#5A6470" }}>En attente</div>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600 mb-2">
                  {statsGlobales.archived}
                </div>
                <div style={{ color: "#5A6470" }}>Archivées</div>
              </div>
              <Archive className="text-gray-600" size={24} />
            </div>
          </Card>
        </div>

        {/* Barre de filtres */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Rechercher une annonce..."
                className="pl-10"
                value={filtres.recherche}
                onChange={(e) =>
                  setFiltres({ ...filtres, recherche: e.target.value })
                }
              />
            </div>

            <select
              className="p-2 border rounded-lg"
              value={filtres.statut}
              onChange={(e) =>
                setFiltres({ ...filtres, statut: e.target.value })
              }
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUT_ANNONCE).map(([key, statut]) => (
                <option key={key} value={key}>
                  {statut.label}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg"
              value={filtres.type}
              onChange={(e) => setFiltres({ ...filtres, type: e.target.value })}
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_BIEN).map(([key, type]) => (
                <option key={key} value={key}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Liste des annonces */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {annoncesFiltrees.map((annonce) => {
            const disponibilite = getListingType(annonce);

            return (
              <Card
                key={annonce.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image et badge statut */}
                <div className="relative">
                  {annonce.images && annonce.images.length > 0 ? (
                    <img
                      src={annonce.images[0]}
                      alt={annonce.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Home className="text-gray-400" size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className={STATUT_ANNONCE[annonce.status]?.color}>
                      {STATUT_ANNONCE[annonce.status]?.label}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                    {disponibilite.vente && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        Vente
                      </Badge>
                    )}
                    {disponibilite.location && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                      >
                        Location
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-bold text-lg line-clamp-2 flex-1 mr-3"
                      style={{ color: "#0A0A0A" }}
                    >
                      {annonce.title}
                    </h3>
                    <div className="text-xl font-bold text-blue-600 whitespace-nowrap">
                      {annonce.price?.toLocaleString()} €
                      {disponibilite.location &&
                        !disponibilite.vente &&
                        "/mois"}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 mb-3 text-sm"
                    style={{ color: "#5A6470" }}
                  >
                    <MapPin size={14} />
                    <span className="line-clamp-1">
                      {annonce.address}, {annonce.city}
                    </span>
                  </div>

                  <div
                    className="flex items-center gap-4 mb-4 text-sm"
                    style={{ color: "#5A6470" }}
                  >
                    <div className="flex items-center gap-1">
                      <Ruler size={14} />
                      <span>{annonce.surface} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home size={14} />
                      <span>{annonce.rooms} pièces</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{annonce.bedrooms} chambres</span>
                    </div>
                  </div>

                  {/* Statistiques rapides */}
                  <div className="flex justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div
                        className="font-bold text-sm"
                        style={{ color: "#0A0A0A" }}
                      >
                        {annonce.views || 0}
                      </div>
                      <div className="text-xs" style={{ color: "#5A6470" }}>
                        Vues
                      </div>
                    </div>
                    <div className="text-center">
                      <div
                        className="font-bold text-sm"
                        style={{ color: "#0A0A0A" }}
                      >
                        {annonce.favorites?.length || 0}
                      </div>
                      <div className="text-xs" style={{ color: "#5A6470" }}>
                        Favoris
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnnonceSelectionnee(annonce);
                        setShowModalStatistiques(true);
                      }}
                    >
                      <TrendingUp size={14} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnnonceSelectionnee(annonce);
                        setShowModalCreation(true);
                      }}
                    >
                      <Edit size={14} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => supprimerAnnonce(annonce.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>

                    {/* Actions statut */}
                    {annonce.status === "for_sale" ||
                    annonce.status === "for_rent" ? (
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => changerStatut(annonce.id, "draft")}
                          className="flex-1"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Dépublier
                        </Button>
                        {annonce.listingType === "sale" ||
                        annonce.listingType === "both" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changerStatut(annonce.id, "sold")}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Vendu
                          </Button>
                        ) : null}
                        {annonce.listingType === "rent" ||
                        annonce.listingType === "both" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => changerStatut(annonce.id, "rented")}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Loué
                          </Button>
                        ) : null}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() =>
                          changerStatut(
                            annonce.id,
                            annonce.listingType === "rent"
                              ? "for_rent"
                              : "for_sale"
                          )
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white mt-2"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Publier
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {annoncesFiltrees.length === 0 && (
          <Card className="p-12 text-center">
            <Home className="mx-auto mb-4 text-gray-400" size={48} />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#0A0A0A" }}
            >
              Aucune annonce trouvée
            </h3>
            <p style={{ color: "#5A6470" }}>
              {filtres.recherche || filtres.statut || filtres.type
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par créer votre première annonce"}
            </p>
          </Card>
        )}
      </div>

      {/* Modales */}
      <ModalCreationAnnonce
        isOpen={showModalCreation}
        onClose={() => {
          setShowModalCreation(false);
          setAnnonceSelectionnee(null);
        }}
        onSave={sauvegarderAnnonce}
        annonce={annonceSelectionnee}
      />

      <ModalStatistiques
        isOpen={showModalStatistiques}
        onClose={() => setShowModalStatistiques(false)}
        annonce={annonceSelectionnee}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ListingsPage;
