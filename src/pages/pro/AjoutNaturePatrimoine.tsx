import { useState, useEffect, useRef } from "react";
import {
  X, Upload, Image as ImageIcon, MapPin, Calendar,
  Landmark, Tag, FileText, Star, CheckCircle,
  AlertCircle, Loader2, Map, EditIcon as Edit,
  Trash2, Eye
} from "lucide-react";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

/* Leaflet fix */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: any;
  onSuccess?: () => void;
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface CategoryOption {
  value: string;
  label: string;
  icon: any;
}

const categoryOptions: CategoryOption[] = [
  { value: "site_historique", label: "Site historique", icon: Landmark },
  { value: "monument", label: "Monument", icon: Landmark },
  { value: "patrimoine_mondial", label: "Patrimoine mondial", icon: Landmark },
  { value: "lieu_culturel", label: "Lieu culturel", icon: Landmark },
  { value: "vestige", label: "Vestige / Ruines", icon: Landmark },
];

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch (error) {
    console.error("Erreur reverse geocode:", error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: Location) => void }) {
  const map = useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      try {
        const address = await reverseGeocode(lat, lng);
        onLocationSelect({ lat, lng, address });
      } catch (error) {
        console.error("Erreur lors du clic sur la carte:", error);
        onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
      }
    },
  });

  return null;
}

export default function AjoutPatrimoineModal({
  isOpen,
  onClose,
  editingItem,
  onSuccess,
}: Props) {
  const { getAuthHeaders } = useAuth();
  const mapRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "patrimoine",
    category: "",
    city: "",
    description: "",
    images: [] as string[],
    year: "",
    rating: 4.5,
    reviewCount: 0,
    featured: false,
    lat: -12.78,
    lng: 45.22,
  });

  const [location, setLocation] = useState<Location>({
    lat: -12.78,
    lng: 45.22,
    address: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  // Initialiser la localisation au premier rendu
  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeLocation();
      setIsInitialized(true);
    }
  }, [isOpen]);

  // Réinitialiser quand on ferme
  useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  const initializeLocation = async () => {
    try {
      const address = await reverseGeocode(formData.lat, formData.lng);
      setLocation({
        lat: formData.lat,
        lng: formData.lng,
        address
      });
      setFormData(prev => ({
        ...prev,
        city: address
      }));
    } catch (error) {
      console.error("Erreur initialisation location:", error);
    }
  };

  useEffect(() => {
    if (editingItem) {
      const editingLat = editingItem.lat || -12.78;
      const editingLng = editingItem.lng || 45.22;
      
      // S'assurer que les images sont un tableau
      const editingImages = Array.isArray(editingItem.images) 
        ? editingItem.images 
        : (editingItem.images ? [editingItem.images] : []);
      
      setFormData({
        title: editingItem.title || "",
        type: "patrimoine",
        category: editingItem.category || "",
        city: editingItem.city || "",
        description: editingItem.description || "",
        images: editingImages,
        year: editingItem.year?.toString() || "",
        rating: editingItem.rating || 4.5,
        reviewCount: editingItem.reviewCount || 0,
        featured: editingItem.featured || false,
        lat: editingLat,
        lng: editingLng,
      });
      
      setExistingImages(editingImages);
      setImagePreviews(editingImages);
      
      // Mettre à jour la localisation avec reverse geocode
      reverseGeocode(editingLat, editingLng).then(address => {
        setLocation({
          lat: editingLat,
          lng: editingLng,
          address: address || editingItem.city || ""
        });
      });
    } else {
      // Réinitialiser le formulaire pour une nouvelle création
      setFormData({
        title: "",
        type: "patrimoine",
        category: "",
        city: "",
        description: "",
        images: [],
        year: "",
        rating: 4.5,
        reviewCount: 0,
        featured: false,
        lat: -12.78,
        lng: 45.22,
      });
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setLocation({
        lat: -12.78,
        lng: 45.22,
        address: ""
      });
      setErrors({});
    }
  }, [editingItem, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Titre requis";
    }
    
    if (!formData.category) {
      newErrors.category = "Catégorie requise";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "Localisation requise";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description requise";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description trop courte (minimum 20 caractères)";
    }
    
    if (imageFiles.length === 0 && existingImages.length === 0) {
      newErrors.images = "Au moins une image est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationSelect = async (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setFormData(prev => ({
      ...prev,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      city: selectedLocation.address || ""
    }));
  };

  const handleSearchLocation = async () => {
    if (!formData.city.trim()) {
      toast.error("Veuillez saisir une adresse de recherche");
      return;
    }
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.city)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        const address = await reverseGeocode(lat, lng);
        const newLocation: Location = {
          lat,
          lng,
          address
        };
        
        setLocation(newLocation);
        setFormData(prev => ({
          ...prev,
          lat,
          lng,
          city: address
        }));
        
        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 13);
        }
        
        toast.success("Localisation trouvée !");
      } else {
        toast.error("Localisation non trouvée");
      }
    } catch (error) {
      console.error("Erreur recherche location:", error);
      toast.error("Erreur lors de la recherche");
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }
    
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const address = await reverseGeocode(lat, lng);
          
          const newLocation: Location = { lat, lng, address };
          setLocation(newLocation);
          setFormData(prev => ({
            ...prev,
            lat,
            lng,
            city: address
          }));
          
          if (mapRef.current) {
            mapRef.current.setView([lat, lng], 13);
          }
          
          toast.success("Position actuelle détectée !");
        } catch (error) {
          toast.error("Erreur lors de la récupération de l'adresse");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        console.error("Erreur géolocalisation:", error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Permission de géolocalisation refusée");
        } else if (error.code === error.TIMEOUT) {
          toast.error("Timeout de géolocalisation");
        } else {
          toast.error("Impossible d'obtenir votre position");
        }
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // Vérifier le nombre total d'images
    const totalImages = imageFiles.length + imagePreviews.length + newFiles.length;
    if (totalImages > 10) {
      toast.error("Maximum 10 images autorisées");
      return;
    }
    
    // Vérifier la taille des fichiers
    const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024); // 10MB
    if (oversizedFiles.length > 0) {
      toast.error("Certains fichiers dépassent 10MB");
      return;
    }
    
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Créer des previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.onerror = () => {
        console.error("Erreur lors de la lecture du fichier:", file.name);
      };
      reader.readAsDataURL(file);
    });
    
    // Réinitialiser l'input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    // Si c'est une image existante
    if (index < existingImages.length) {
      const newExistingImages = [...existingImages];
      newExistingImages.splice(index, 1);
      setExistingImages(newExistingImages);
      
      const newImagePreviews = [...imagePreviews];
      newImagePreviews.splice(index, 1);
      setImagePreviews(newImagePreviews);
      
      setFormData(prev => ({
        ...prev,
        images: newExistingImages
      }));
    } else {
      // Si c'est une nouvelle image
      const adjustedIndex = index - existingImages.length;
      const newImageFiles = [...imageFiles];
      newImageFiles.splice(adjustedIndex, 1);
      setImageFiles(newImageFiles);
      
      const newImagePreviews = [...imagePreviews];
      newImagePreviews.splice(index, 1);
      setImagePreviews(newImagePreviews);
    }
    
    // Effacer l'erreur d'images si nécessaire
    if (errors.images) {
      const newErrors = { ...errors };
      delete newErrors.images;
      setErrors(newErrors);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return existingImages;
    
    setUploadingImages(true);
    const uploadedUrls: string[] = [...existingImages];
    
    try {
      for (const file of imageFiles) {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        
        const uploadResponse = await api.post(
          "/patrimoine/upload/image",
          imageFormData,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        if (uploadResponse.data?.success && uploadResponse.data?.url) {
          uploadedUrls.push(uploadResponse.data.url);
          toast.success(`Image "${file.name}" uploadée`);
        } else {
          throw new Error(uploadResponse.data?.message || "Échec de l'upload");
        }
      }
      
      return uploadedUrls;
    } catch (error: any) {
      console.error("❌ Erreur upload images:", error);
      toast.error(error.response?.data?.message || "Erreur lors de l'upload des images");
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Upload des images
      let finalImageUrls = existingImages;
      if (imageFiles.length > 0) {
        finalImageUrls = await uploadImages();
      }
      
      // 2. Préparer les données pour l'API
      const payload = {
        title: formData.title.trim(),
        type: "patrimoine",
        category: formData.category,
        city: formData.city.trim(),
        description: formData.description.trim(),
        lat: Number(formData.lat),
        lng: Number(formData.lng),
        images: finalImageUrls,
        year: formData.year ? Number(formData.year) : null,
        rating: Number(formData.rating),
        reviewCount: Number(formData.reviewCount),
        featured: Boolean(formData.featured),
      };
      
      // 3. Envoyer à l'API
      const url = editingItem
        ? `/patrimoine/${editingItem.id || editingItem._id}`
        : "/patrimoine";
      
      const method = editingItem ? "PUT" : "POST";
      
      const response = await api({
        method,
        url,
        data: payload,
        headers: getAuthHeaders(),
      });
      
      if (response.data.success) {
        toast.success(
          editingItem 
            ? "Patrimoine modifié avec succès" 
            : "Patrimoine ajouté avec succès"
        );
        
        // Réinitialiser le formulaire
        setFormData({
          title: "",
          type: "patrimoine",
          category: "",
          city: "",
          description: "",
          images: [],
          year: "",
          rating: 4.5,
          reviewCount: 0,
          featured: false,
          lat: -12.78,
          lng: 45.22,
        });
        setImageFiles([]);
        setImagePreviews([]);
        setExistingImages([]);
        setErrors({});
        
        onSuccess?.();
        onClose();
      } else {
        throw new Error(response.data.message || "Erreur serveur");
      }
      
    } catch (error: any) {
      console.error("❌ Erreur lors de la soumission:", error);
      
      // Gestion des erreurs détaillées
      if (error.response?.data) {
        const errorData = error.response.data;
        
        if (errorData.errors) {
          // Afficher la première erreur
          const firstError = Object.values(errorData.errors)[0];
          toast.error(`Erreur: ${firstError}`);
          
          // Mettre à jour les erreurs du formulaire
          setErrors(errorData.errors);
        } else if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error("Erreur serveur");
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur inattendue est survenue");
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
  <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
    {/* Header compact */}
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            {editingItem ? (
              <Edit className="w-5 h-5" />
            ) : (
              <Landmark className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingItem ? "Modifier le Patrimoine" : "Nouveau Patrimoine"}
            </h2>
            <p className="text-gray-500 text-sm">
              {editingItem ? "Modifiez les informations" : "Ajoutez un nouveau patrimoine"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
          disabled={loading || uploadingImages}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>

    <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
      <div className="p-6 space-y-6">
        {/* Section 1: Informations de base */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" />
            Informations principales
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Titre du patrimoine <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) {
                    const newErrors = { ...errors };
                    delete newErrors.title;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Cathédrale Notre-Dame"
                disabled={loading || uploadingImages}
              />
              {errors.title && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.title}
                </p>
              )}
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  setFormData({ ...formData, category: e.target.value });
                  if (errors.category) {
                    const newErrors = { ...errors };
                    delete newErrors.category;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading || uploadingImages}
              >
                <option value="">Sélectionner une catégorie</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Localisation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Localisation <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({ ...formData, city: e.target.value });
                      if (errors.city) {
                        const newErrors = { ...errors };
                        delete newErrors.city;
                        setErrors(newErrors);
                      }
                    }}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Cliquez sur la carte pour sélectionner"
                    disabled={loading || uploadingImages}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="px-3 py-2.5 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
                  disabled={loading || uploadingImages}
                  title="Définir sur la carte"
                >
                  <Map className="w-4 h-4" />
                </button>
              </div>
              {errors.city && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.city}
                </p>
              )}
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>Coordonnées: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* Année */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Année (optionnel)
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                min="50"
                max="2100"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Année de construction"
                disabled={loading || uploadingImages}
              />
            </div>
          </div>
        </div>

        {/* Modal de la carte - Conservée telle quelle */}
        {showMap && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="bg-green-600 px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Map className="w-5 h-5" />
                    <div>
                      <h3 className="font-semibold">Sélectionner l'emplacement</h3>
                      <p className="text-green-100 text-sm">Cliquez sur la carte pour définir les coordonnées</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowMap(false)}
                    className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Rechercher une adresse..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchLocation}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Rechercher
                  </button>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    disabled={loading}
                  >
                    <MapPin className="w-4 h-4" />
                    {loading ? "Chargement..." : "Position"}
                  </button>
                </div>

                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-300">
                  <MapContainer
                    center={[location.lat, location.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[location.lat, location.lng]} />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                  </MapContainer>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Informations sélectionnées</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Adresse</label>
                      <div className="bg-white p-2.5 rounded border border-gray-300 min-h-[42px]">
                        {formData.city || "Non défini"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                        <div className="bg-white p-2.5 rounded border border-gray-300 font-mono text-sm">
                          {formData.lat.toFixed(6)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                        <div className="bg-white p-2.5 rounded border border-gray-300 font-mono text-sm">
                          {formData.lng.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowMap(false)}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.city.trim()) {
                        toast.error("Veuillez cliquer sur la carte pour définir une localisation");
                        return;
                      }
                      toast.success("Localisation enregistrée !");
                      setShowMap(false);
                    }}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Description */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            Description
          </h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  const newErrors = { ...errors };
                  delete newErrors.description;
                  setErrors(newErrors);
                }
              }}
              rows={4}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Décrivez le patrimoine, son histoire, son importance..."
              disabled={loading || uploadingImages}
            />
            {errors.description && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
            <div className="text-xs text-gray-500 flex justify-between">
              <span>{formData.description.length} caractères</span>
              <span className={formData.description.length < 20 ? "text-red-500" : "text-green-500"}>
                Minimum 20 caractères
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Images */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-green-600" />
              Galerie d'images ({imagePreviews.length}/10)
              {uploadingImages && (
                <span className="text-sm font-normal text-green-600 ml-2">
                  <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
                  Upload...
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={imagePreviews.length >= 10 || loading || uploadingImages}
            >
              <Upload className="w-4 h-4" />
              Ajouter
            </button>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={loading || uploadingImages}
            />
          </div>

          {/* Images grid */}
          {imagePreviews.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div 
                    className="aspect-square overflow-hidden rounded-md border border-gray-300 group-hover:border-green-500 transition-colors cursor-pointer"
                    onClick={() => setSelectedPreview(preview)}
                  >
                    <img
                      src={preview}
                      alt={`Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setSelectedPreview(preview)}
                      className="p-1 bg-black/70 text-white rounded hover:bg-black/90"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      disabled={loading || uploadingImages}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg mb-3">
              <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Aucune image importée</p>
            </div>
          )}

          {errors.images && (
            <p className="text-red-600 text-sm flex items-center gap-1 mb-2">
              <AlertCircle className="w-3 h-3" />
              {errors.images}
            </p>
          )}

          <div className="text-xs text-gray-500">
            Formats: JPG, PNG, WebP, GIF, SVG • Max 10MB • Max 10 images
          </div>
        </div>

        {/* Modal de preview d'image */}
        {selectedPreview && (
          <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
            <div className="relative">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute -top-8 right-0 p-1 text-white hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedPreview}
                alt="Preview"
                className="max-w-full max-h-[80vh] object-contain rounded"
              />
            </div>
          </div>
        )}

        {/* Section 4: Options */}
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-green-600" />
            Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Note (1-5)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600"
                  disabled={loading || uploadingImages}
                />
                <div className="flex items-center gap-1 min-w-[60px]">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{formData.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Nombre d'avis
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewCount}
                onChange={(e) => setFormData({...formData, reviewCount: parseInt(e.target.value) || 0})}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={loading || uploadingImages}
              />
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || uploadingImages}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : uploadingImages ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Upload...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {editingItem ? "Mettre à jour" : "Créer"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
  );
}