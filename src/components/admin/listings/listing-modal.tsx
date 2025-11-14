import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Upload,
  CheckCircle,
  Euro,
  Ruler,
  MapPin,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
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

interface ListingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: {
    id: string;
    title: string;
    type: string;
    price: number;
    address: string;
    city: string;
    surface: number;
    rooms: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    status: string;
    images: string[];
    features: string[];
    listingType: string;
    ownerId: string;
    longitude: number | null;
    latitude: number | null;
  };
  mode: "create" | "edit";
  onSuccess?: () => void;
}

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
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90 text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Interface pour les images temporaires
interface TemporaryImage {
  file: File;
  previewUrl: string;
  id: string;
}

export function ListingModal({
  open,
  onOpenChange,
  listing,
  mode,
  onSuccess,
}: ListingModalProps) {
  const [etape, setEtape] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState<TemporaryImage[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
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
    features: [],
    // Étape 4 - Médias
    images: [],
    // Étape 5 - Publication
    status: "draft",
    latitude: null,
    longitude: null,
  });

  const etapes = [
    { numero: 1, titre: "Informations générales" },
    { numero: 2, titre: "Caractéristiques" },
    { numero: 3, titre: "Options" },
    { numero: 4, titre: "Médias" },
    { numero: 5, titre: "Publication" },
  ];

  useEffect(() => {
    if (open && listing) {
      setFormData({
        title: listing.title || "",
        type: listing.type || "apartment",
        description: listing.description || "",
        price: listing.price?.toString() || "",
        surface: listing.surface?.toString() || "",
        rooms: listing.rooms?.toString() || "",
        bedrooms: listing.bedrooms?.toString() || "",
        bathrooms: listing.bathrooms?.toString() || "",
        address: listing.address || "",
        city: listing.city || "",
        listingType: listing.listingType || "sale",
        features: listing.features || [],
        images: listing.images || [],
        status: listing.status || "draft",
        latitude: listing.latitude ?? null,
        longitude: listing.longitude ?? null,
      });
      setExistingImages(listing.images || []);
      setTemporaryImages([]);
      setImagesToDelete([]);
    } else if (!open && mode === "create") {
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
        features: [],
        images: [],
        status: "draft",
        latitude: null,
        longitude: null,
      });
      setExistingImages([]);
      setTemporaryImages([]);
      setImagesToDelete([]);
      setEtape(1);
    }
  }, [open, listing, mode]);

  // Nettoyer les URLs temporaires
  useEffect(() => {
    return () => {
      temporaryImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, [temporaryImages]);

  const handleImageUpload = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await api.post("/upload/property-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.url) {
          uploadedUrls.push(response.data.url);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Erreur lors de l'upload des images");
      }
    }

    return uploadedUrls;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newTemporaryImages: TemporaryImage[] = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));

      setTemporaryImages((prev) => [...prev, ...newTemporaryImages]);

      // Réinitialiser l'input file
      e.target.value = "";
    }
  };

  const removeTemporaryImage = (id: string) => {
    const imageToRemove = temporaryImages.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    setTemporaryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const uploadAllImages = async (): Promise<string[]> => {
    if (temporaryImages.length === 0) return [];

    setUploadingImages(true);
    try {
      const files = temporaryImages.map((img) => img.file);
      const uploadedUrls = await handleImageUpload(files);
      return uploadedUrls;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Uploader toutes les nouvelles images
      const newImageUrls = await uploadAllImages();

      // Combiner les images existantes (sans celles supprimées) avec les nouvelles
      const finalImages = [
        ...existingImages.filter((img) => !imagesToDelete.includes(img)),
        ...newImageUrls,
      ];

      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        surface: formData.surface ? parseInt(formData.surface) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        images: finalImages,
        ownerId: listing?.ownerId || "default-owner-id",
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (mode === "create") {
        await api.post("/properties", payload);
        toast.success("Annonce créée avec succès");
      } else {
        await api.put(`/properties/${listing?.id}`, payload);
        toast.success("Annonce modifiée avec succès");
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Une erreur est survenue lors de la sauvegarde");
      }
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

  const allImages = [
    ...existingImages.map((url) => ({
      type: "existing" as const,
      url,
      id: url,
    })),
    ...temporaryImages.map((img) => ({
      type: "temporary" as const,
      url: img.previewUrl,
      id: img.id,
    })),
  ];

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={mode === "create" ? "Nouvelle annonce" : "Modifier l'annonce"}
      size="xl"
    >
      {/* Modal de sélection de position */}
      <LocationPickerModal
        open={locationModalOpen}
        onOpenChange={setLocationModalOpen}
        latitude={formData.latitude}
        longitude={formData.longitude}
        onLocationChange={handleLocationChange}
      />

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
          <div className="text-center font-medium">
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                <div className="text-lg font-semibold mb-2">
                  Ajouter des photos
                </div>
                <div className="text-sm mb-4 text-gray-600">
                  Glissez-déposez vos photos ou cliquez pour parcourir
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="property-images"
                />
                <Label
                  htmlFor="property-images"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Upload className="mr-2" size={16} />
                  Choisir des fichiers
                </Label>
              </div>
            </div>

            {allImages.length > 0 && (
              <div>
                <Label className="block mb-2">
                  Images{" "}
                  {mode === "edit"
                    ? "existantes et nouvelles"
                    : "sélectionnées"}
                  {temporaryImages.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({temporaryImages.length} nouvelle(s) image(s) à uploader)
                    </span>
                  )}
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={`Image ${image.id}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          if (image.type === "temporary") {
                            removeTemporaryImage(image.id);
                          } else {
                            removeExistingImage(image.url);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                      {image.type === "temporary" && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Nouvelle
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                  <span className="text-gray-600">Titre:</span>
                  <span className="font-medium">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {TYPE_BIEN[formData.type]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix:</span>
                  <span className="font-medium">{formData.price} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Surface:</span>
                  <span className="font-medium">{formData.surface} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type d'annonce:</span>
                  <span className="font-medium">
                    {LISTING_TYPE[formData.listingType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Images:</span>
                  <span className="font-medium">
                    {allImages.length} image(s)
                    {temporaryImages.length > 0 &&
                      ` (dont ${temporaryImages.length} nouvelle(s))`}
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
            disabled={etape === 1 || loading}
          >
            <ChevronLeft className="mr-2" size={16} />
            Précédent
          </Button>

          {etape < 5 ? (
            <Button
              type="button"
              onClick={etapeSuivante}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              Suivant
              <ChevronRight className="ml-2" size={16} />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || uploadingImages}
            >
              {loading || uploadingImages ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              {mode === "create" ? "Créer" : "Enregistrer"} l'annonce
              {uploadingImages && " (upload des images...)"}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
}
