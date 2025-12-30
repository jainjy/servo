import { useState, useEffect, useRef } from "react";
import {
  X, Upload, Image as ImageIcon, MapPin, Calendar,
  Landmark, Tag, FileText, Star, CheckCircle,
  AlertCircle, Loader2, Map, EditIcon as Edit
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

const categoryOptions = [
  { value: "site_historique", label: "Site historique", icon: Landmark },
  { value: "monument", label: "Monument", icon: Landmark },
  { value: "patrimoine_mondial", label: "Patrimoine mondial", icon: Landmark },
  { value: "lieu_culturel", label: "Lieu culturel", icon: Landmark },
  { value: "vestige", label: "Vestige / Ruines", icon: Landmark },
];

async function reverseGeocode(lat: number, lng: number) {
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMap, setShowMap] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
      
      setFormData({
        title: editingItem.title || "",
        type: "patrimoine",
        category: editingItem.category || "",
        city: editingItem.city || "",
        description: editingItem.description || "",
        images: editingItem.images || [],
        year: editingItem.year?.toString() || "",
        rating: editingItem.rating || 4.5,
        reviewCount: editingItem.reviewCount || 0,
        featured: editingItem.featured || false,
        lat: editingLat,
        lng: editingLng,
      });
      
      // Mettre à jour la localisation avec reverse geocode
      reverseGeocode(editingLat, editingLng).then(address => {
        setLocation({
          lat: editingLat,
          lng: editingLng,
          address: address || editingItem.city || ""
        });
      });
      
      setImagePreviews(editingItem.images || []);
    }
  }, [editingItem]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title.trim()) e.title = "Titre requis";
    if (!formData.category) e.category = "Catégorie requise";
    if (!formData.city.trim()) e.city = "Localisation requise";
    if (!formData.description.trim() || formData.description.length < 20)
      e.description = "Description trop courte (minimum 20 caractères)";
    setErrors(e);
    return Object.keys(e).length === 0;
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
    if (!formData.city.trim()) return;
    
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
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const address = await reverseGeocode(lat, lng);
        
        const newLocation: Location = { lat, lng, address };
        setLocation(newLocation);
        setFormData(prev => ({
          ...prev,
          lat,
          lng,
          city: address
        }));
        
        toast.success("Position actuelle détectée !");
      },
      (error) => {
        toast.error("Impossible d'obtenir votre position");
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    if (imageFiles.length + newFiles.length > 10) {
      toast.error("Maximum 10 images");
      return;
    }

    setImageFiles(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Upload images si nouvelles
     let uploadedImageUrls: string[] = [...(formData.images || [])];


      
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const imageFormData = new FormData();
          imageFormData.append("image", file);
          
         const uploadResponse = await api.post(
  "/upload/image",   // ✅ ROUTE UPLOAD UNIQUEMENT
  imageFormData,
  {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  }
);

          
          if (uploadResponse.data?.url) {
            uploadedImageUrls.push(uploadResponse.data.url);
          }
        }
        
      }

            const payload = {
  title: formData.title.trim(),

  // ✅ AJOUT OBLIGATOIRE
  type: "patrimoine",

  category: formData.category,
  city: formData.city.trim(),
  description: formData.description.trim(),

  lat: Number(formData.lat),
  lng: Number(formData.lng),

  images: uploadedImageUrls, // déjà un tableau

  year: formData.year ? Number(formData.year) : null,
  rating: Number(formData.rating),
  reviewCount: Number(formData.reviewCount),
  featured: Boolean(formData.featured),
};


      const url = editingItem
        ? `/patrimoine/${editingItem.id || editingItem._id}`
        : "/patrimoine";

      const method = editingItem ? "PUT" : "POST";

      await api({ method, url, data: payload, headers: getAuthHeaders() });

      toast.success(editingItem ? "Patrimoine modifié avec succès" : "Patrimoine ajouté avec succès");
      onSuccess?.();
      onClose();
    } 
   catch (error: any) {
  console.error("❌ BACKEND ERROR:", error.response?.data);

  if (error.response?.data?.field) {
    toast.error(
      `Champ invalide : ${error.response.data.field} — ${error.response.data.message}`
    );
  } else {
    toast.error(error.response?.data?.message || "Erreur serveur");
  }
}

    finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {editingItem ? (
                  <Edit className="w-6 h-6" />
                ) : (
                  <Landmark className="w-6 h-6" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {editingItem ? "Modifier le Patrimoine" : "Nouveau Patrimoine Culturel"}
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {editingItem ? "Modifiez les informations" : "Ajoutez un nouveau patrimoine culturel"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-8 space-y-8">
            {/* Section 1: Informations de base */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-green-600" />
                Informations principales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titre */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span>
                    Titre du patrimoine
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value });
                      if (errors.title) setErrors({...errors, title: ""});
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Cathédrale Notre-Dame"
                  />
                  {errors.title && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.title}
                    </div>
                  )}
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span>
                    <Tag className="w-4 h-4" />
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (errors.category) setErrors({...errors, category: ""});
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <div className="flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </div>
                  )}
                </div>

                {/* Localisation */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span className="text-red-500">*</span>
                    <MapPin className="w-4 h-4" />
                    Localisation
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => {
                          setFormData({ ...formData, city: e.target.value });
                          if (errors.city) setErrors({...errors, city: ""});
                        }}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Cliquez sur la carte pour sélectionner"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="px-4 py-3 border border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors flex items-center gap-2"
                      title="Définir sur la carte"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>
                  {errors.city && (
                    <div className="flex items-center gap-1 text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city}
                    </div>
                  )}
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>Coordonnées: {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}</span>
                    </div>
                  </div>
                </div>

                {/* Année */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Année (optionnel)
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    min="1000"
                    max="2100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Année de construction ou inscription"
                  />
                </div>
              </div>
            </div>

            {/* Modal de la carte */}
            {showMap && (
              <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Map className="w-6 h-6" />
                        <div>
                          <h3 className="text-xl font-bold">Sélectionner l'emplacement sur la carte</h3>
                          <p className="text-green-100 text-sm">Cliquez sur la carte pour définir les coordonnées</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowMap(false)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Barre de recherche */}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          placeholder="Rechercher une adresse..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleSearchLocation()}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchLocation}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Rechercher
                      </button>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Ma position
                      </button>
                    </div>

                    {/* Carte */}
                    <div className="h-[400px] rounded-xl overflow-hidden border-2 border-gray-300">
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

                    {/* Informations sélectionnées */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-700 mb-2">Informations sélectionnées</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Adresse/Localisation</label>
                          <div className="bg-white p-3 rounded-lg border border-gray-300">
                            {formData.city || "Non défini"}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Latitude</label>
                            <div className="bg-white p-3 rounded-lg border border-gray-300 font-mono">
                              {formData.lat.toFixed(6)}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Longitude</label>
                            <div className="bg-white p-3 rounded-lg border border-gray-300 font-mono">
                              {formData.lng.toFixed(6)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowMap(false)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
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
                        className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                      >
                        Valider la localisation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Description */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Description détaillée
              </h3>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span>
                  Description complète
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({...errors, description: ""});
                  }}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez le patrimoine, son histoire, son importance culturelle, son architecture..."
                />
                {errors.description && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {formData.description.length} caractères • Minimum 20 caractères
                </div>
              </div>
            </div>

            {/* Section 3: Images */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-green-600" />
                  Galerie d'images ({imageFiles.length + imagePreviews.length}/10)
                </h3>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Importer des images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Images grid */}
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-gray-300 group-hover:border-green-500 transition-colors">
                        <img
                          src={preview}
                          alt={`Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl mb-6">
                  <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">Aucune image importée</p>
                  <p className="text-sm text-gray-400">Cliquez pour importer des images</p>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Formats acceptés: JPG, PNG, WebP • Max 5MB par image • Max 10 images
              </div>
            </div>

            {/* Section 4: Options */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-green-600" />
                Options et paramètres
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Note */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600"
                    />
                    <div className="flex items-center gap-1.5 min-w-[80px]">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-lg">{formData.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Nombre d'avis */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre d'avis
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviewCount}
                    onChange={(e) => setFormData({...formData, reviewCount: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Featured */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    Site en vedette
                  </label>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium hover:scale-[1.02] active:scale-95"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {editingItem ? "Mettre à jour" : "Créer le patrimoine"}
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