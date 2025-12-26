import React, { useState, useEffect } from "react";
import {
  MapPin,
  Home,
  Calendar,
  Heart,
  Camera,
  Users,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  CheckCircle,
  Star,
  Clock,
  Ruler,
  Bath,
  Bed,
  Eye,
  Filter,
  Search,
  Navigation,
  DollarSign,
  Maximize2,
  X,
  SlidersHorizontal,
  Bath as BathIcon,
  Wind,
  Coffee,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import TourismNavigation from "@/components/TourismNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import LocationPickerModal from "@/components/carte";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";
import AdvertisementPopup from "@/components/AdvertisementPopup";

// Données locales de fallback
const fallbackProperties = [
  {
    id: "1",
    title: "Villa avec piscine à Saint-Gilles",
    description: "Magnifique villa avec piscine privée, vue sur l'océan. Idéale pour des vacances en famille ou entre amis.",
    city: "Saint-Gilles-les-Bains",
    price: 1200,
    rating: 4.8,
    reviewCount: 47,
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    amenities: ["wifi", "parking", "piscine", "climatisation", "tv", "cuisine_equipee"],
    surface: 120,
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    type: "VILLA",
    status: "for_rent",
    available: true,
    featured: true,
    rentType: "saisonniere",
    minimumStay: 7,
    latitude: -21.0094,
    longitude: 55.2696,
  },
  {
    id: "2",
    title: "Appartement vue mer à Saint-Pierre",
    description: "Appartement moderne avec terrasse offrant une vue imprenable sur l'océan Indien.",
    city: "Saint-Pierre",
    price: 750,
    rating: 4.5,
    reviewCount: 32,
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    amenities: ["wifi", "climatisation", "tv", "balcon"],
    surface: 65,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    type: "APPARTEMENT",
    status: "for_rent",
    available: true,
    featured: false,
    rentType: "saisonniere",
    minimumStay: 3,
    latitude: -21.3416,
    longitude: 55.4781,
  },
  {
    id: "3",
    title: "Bungalow tropical dans les hauts",
    description: "Bungalow authentique au cœur de la forêt tropicale, parfait pour un séjour nature.",
    city: "Salazie",
    price: 550,
    rating: 4.9,
    reviewCount: 28,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"],
    amenities: ["wifi", "parking", "jardin", "bbq"],
    surface: 85,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    type: "BUNGALOW",
    status: "for_rent",
    available: true,
    featured: true,
    rentType: "saisonniere",
    minimumStay: 5,
    latitude: -21.0279,
    longitude: 55.5390,
  },
];

// Utilitaires
const formatPrice = (price: number) => {
  return `${price.toLocaleString("fr-FR")} €/semaine`;
};

const getSafeImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl || !imageUrl.startsWith("http")) {
    return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  }
  return imageUrl;
};

const availableAmenities = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "piscine", label: "Piscine", icon: BathIcon },
  { id: "climatisation", label: "Climatisation", icon: Snowflake },
  { id: "tv", label: "Télévision", icon: Tv },
  { id: "cuisine_equipee", label: "Cuisine équipée", icon: Utensils },
  { id: "jardin", label: "Jardin", icon: Coffee },
  { id: "bbq", label: "Barbecue", icon: Wind },
  { id: "gym", label: "Salle de sport", icon: Dumbbell },
  { id: "securite", label: "Sécurité", icon: Shield },
];

interface Property {
  id: string;
  title: string;
  description: string;
  city: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  surface: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  type: string;
  status: string;
  available: boolean;
  featured: boolean;
  rentType: string;
  minimumStay: number;
  latitude: number;
  longitude: number;
  features?: string[];
}

interface FilterState {
  type: string;
  priceMax: number | null;
  location: string;
  radiusKm: number;
  radiusEnabled: boolean;
  bedrooms: number | null;
  surfaceMin: number | null;
  surfaceMax: number | null;
  amenities: string[];
}

const LocationSaisonniere: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // États
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtreType, setFiltreType] = useState<string>("all");
  const [tri, setTri] = useState<string>("rating");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // États de filtres
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    priceMax: null,
    location: "",
    radiusKm: 5,
    radiusEnabled: false,
    bedrooms: null,
    surfaceMin: null,
    surfaceMax: null,
    amenities: [],
  });

  // === PALETTE DE COULEURS ===
  const colors = {
    logo: "#556B2F", // Olive green
    primaryDark: "#6B8E23", // Yellow-green
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513", // Saddle brown
  };

  const categories = [
    {
      value: "all",
      label: "Tous les types",
      icon: <Home className="w-5 h-5" />,
    },
    {
      value: "VILLA",
      label: "Villas",
      icon: <Home className="w-5 h-5" />,
    },
    {
      value: "APPARTEMENT",
      label: "Appartements",
      icon: <Home className="w-5 h-5" />,
    },
    {
      value: "BUNGALOW",
      label: "Bungalows",
      icon: <Home className="w-5 h-5" />,
    },
    {
      value: "MAISON",
      label: "Maisons",
      icon: <Home className="w-5 h-5" />,
    },
    {
      value: "STUDIO",
      label: "Studios",
      icon: <Home className="w-5 h-5" />,
    },
  ];

  const tris = [
    { value: "rating", label: "Meilleures notes" },
    { value: "reviewCount", label: "Plus d'avis" },
    { value: "price", label: "Prix croissant" },
    { value: "price_desc", label: "Prix décroissant" },
    { value: "title", label: "Ordre alphabétique" },
  ];

  // Chargement des propriétés
  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/properties");
      if (response.data) {
        // Filtrer pour les locations saisonnières
        const saisonnierProperties = response.data
          .filter((p: any) => 
            p.status === "for_rent" && 
            p.isActive && 
            p.rentType === "saisonniere"
          )
          .map((p: any) => ({
            id: p.id,
            title: p.title || "Location sans titre",
            description: p.description || "Description non disponible",
            city: p.city || "Localisation non précisée",
            price: p.price || 0,
            rating: p.rating || 4.0,
            reviewCount: p.reviewCount || 0,
            images: p.images || [],
            amenities: p.amenities || [],
            surface: p.surface || 0,
            bedrooms: p.bedrooms || p.rooms || 0,
            bathrooms: p.bathrooms || 1,
            maxGuests: p.maxGuests || 2,
            type: p.type || "APPARTEMENT",
            status: p.status,
            available: p.available !== false,
            featured: p.featured || false,
            rentType: p.rentType,
            minimumStay: p.minimumStay || 7,
            latitude: Number(p.latitude) || -20.8823,
            longitude: Number(p.longitude) || 55.4504,
            features: p.features || [],
          }));
        
        if (saisonnierProperties.length > 0) {
          setProperties(saisonnierProperties);
        } else {
          setProperties(fallbackProperties);
        }
      }
    } catch (err) {
      console.error("Erreur chargement propriétés:", err);
      setError("Impossible de charger les locations saisonnières");
      setProperties(fallbackProperties);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Gestion des favoris
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
    
    toast({
      title: favorites[propertyId] ? "Retiré des favoris" : "Ajouté aux favoris",
      description: favorites[propertyId] 
        ? "Cette location a été retirée de vos favoris" 
        : "Cette location a été ajoutée à vos favoris",
    });
  };

  const handlePropertyClick = (property: Property) => {
    navigate(`/location/${property.id}`);
  };

  const handleOpenReservation = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour réserver cette location",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (sentRequests[property.id]) {
      toast({
        title: "Déjà réservé",
        description: "Vous avez déjà une réservation pour cette location",
      });
      return;
    }

    setSelectedProperty(property);
    setIsReservationOpen(true);
  };

  const handleDemanderVisite = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour demander une visite",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setSelectedProperty(property);
    // Ici, vous pourriez ouvrir un modal de demande de visite
    toast({
      title: "Demande envoyée",
      description: "Votre demande de visite a été enregistrée",
    });
    
    setSentRequests(prev => ({ ...prev, [property.id]: true }));
  };

  const handleResetFilters = () => {
    setFilters({
      type: "all",
      priceMax: null,
      location: "",
      radiusKm: 5,
      radiusEnabled: false,
      bedrooms: null,
      surfaceMin: null,
      surfaceMax: null,
      amenities: [],
    });
    setFiltreType("all");
  };

  const activeFiltersCount = [
    filters.type !== "all",
    filters.priceMax !== null,
    filters.location,
    filters.radiusEnabled,
    filters.bedrooms !== null,
    filters.surfaceMin !== null,
    filters.surfaceMax !== null,
    filters.amenities.length > 0,
  ].filter(Boolean).length;

  const handleLocationSelect = (location: any) => {
    setFilters(prev => ({
      ...prev,
      location: location.address || ""
    }));
  };

  // Filtrer et trier les propriétés
  const propertiesFiltres = properties
    .filter((property) => {
      // Filtre par type
      if (filtreType !== "all" && property.type !== filtreType) return false;
      
      // Filtre par localisation
      if (filters.location && !property.city.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Filtre par prix
      if (filters.priceMax !== null && property.price > filters.priceMax) return false;
      
      // Filtre par chambres
      if (filters.bedrooms !== null && property.bedrooms < filters.bedrooms) return false;
      
      // Filtre par surface
      if (filters.surfaceMin !== null && property.surface < filters.surfaceMin) return false;
      if (filters.surfaceMax !== null && property.surface > filters.surfaceMax) return false;
      
      // Filtre par équipements
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (tri) {
        case "rating":
          return b.rating - a.rating;
        case "reviewCount":
          return b.reviewCount - a.reviewCount;
        case "price":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const renderStars = (rating: number) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.floor(rating)
              ? "text-yellow-400 fill-current"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>
  );

  const renderAmenities = (amenities: string[]) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {amenities.slice(0, 4).map((id) => {
        const amenity = availableAmenities.find((a) => a.id === id);
        const Icon = amenity?.icon || CheckCircle;
        return (
          <div
            key={id}
            className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-xs"
            title={amenity?.label}
          >
            <Icon className="w-3 h-3 mr-1" style={{ color: colors.logo }} />
            <span className="hidden sm:inline">{amenity?.label || id}</span>
          </div>
        );
      })}
      {amenities.length > 4 && (
        <div className="px-2 py-1 bg-gray-100 rounded-lg text-xs" title={`+${amenities.length - 4} autres`}>
          +{amenities.length - 4}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.lightBg }}
      >
        <div className="text-center flex justify-center items-center flex-col">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4 mb-4"
            style={{ borderBottomColor: colors.logo }}
          ></div>
          <p className="text-gray-600">Chargement des locations saisonnières...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: colors.lightBg }}
    >
      {/* Advertisement Popup */}
      <div className="absolute top-12 left-4 right-4 z-40">
        <AdvertisementPopup />
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div
          className="relative pt-24 pb-8 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center text-white">
            <h1 className="text-3xl lg:text-5xl font-bold mb-3">
              Locations Saisonnières à La Réunion
            </h1>
            <p className="text-lg max-w-2xl mb-5 mx-auto opacity-90">
              Trouvez votre hébergement de vacances idéal pour un séjour inoubliable
            </p>
            <TourismNavigation />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barre de recherche et filtres */}
        <div
          className="bg-white rounded-xl shadow-lg border mb-8 p-6"
          style={{ borderColor: colors.separator }}
        >
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher une location, une ville..."
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="pl-12 h-12 text-lg border-gray-300 focus:border-[#556B2F] focus:ring-[#556B2F]"
            />
          </div>

          {/* Bouton filtres mobile */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>

          {/* Grille de filtres desktop */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
            {/* Type de bien */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bien
              </label>
              <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="h-12">
                  <Home className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="VILLA">Villa</SelectItem>
                  <SelectItem value="APPARTEMENT">Appartement</SelectItem>
                  <SelectItem value="MAISON">Maison</SelectItem>
                  <SelectItem value="BUNGALOW">Bungalow</SelectItem>
                  <SelectItem value="STUDIO">Studio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prix max (€/semaine)
              </label>
              <div className="relative">
                <Input
                  placeholder="Montant max"
                  value={filters.priceMax || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value ? Number(e.target.value) : null }))}
                  className="h-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  €/sem
                </span>
              </div>
            </div>

            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chambres
              </label>
              <Select
                value={filters.bedrooms?.toString() || "all"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value === "all" ? null : parseInt(value) }))}
              >
                <SelectTrigger className="h-12">
                  <Bed className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Nombre de chambres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (m²)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Min"
                    value={filters.surfaceMin || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, surfaceMin: e.target.value ? Number(e.target.value) : null }))}
                    className="pl-10 h-12"
                  />
                  <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="relative flex-1">
                  <Input
                    placeholder="Max"
                    value={filters.surfaceMax || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, surfaceMax: e.target.value ? Number(e.target.value) : null }))}
                    className="pl-10 h-12"
                  />
                  <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filtres avancés supplémentaires */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Recherche par rayon */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Recherche par rayon
                </label>
                <button
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, radiusEnabled: !prev.radiusEnabled }))}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${filters.radiusEnabled ? 'bg-[#556B2F]' : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${filters.radiusEnabled ? 'translate-x-8' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              {filters.radiusEnabled && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-[#556B2F]" />
                    <span className="text-sm text-gray-600">
                      Rayon: <span className="text-[#556B2F] font-bold">{filters.radiusKm} km</span>
                    </span>
                  </div>

                  <Slider
                    value={[filters.radiusKm]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(v) => setFilters(prev => ({ ...prev, radiusKm: v[0] ?? 0 }))}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Équipements */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Équipements
              </label>
              <div className="flex flex-wrap gap-2">
                {availableAmenities.slice(0, 6).map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        amenities: prev.amenities.includes(amenity.id)
                          ? prev.amenities.filter(id => id !== amenity.id)
                          : [...prev.amenities, amenity.id]
                      }));
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      filters.amenities.includes(amenity.id)
                        ? 'border-[#556B2F] bg-[#556B2F]/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <amenity.icon className="h-4 w-4" />
                    <span>{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bouton réinitialiser */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser ({activeFiltersCount})
              </Button>
            </div>
          )}
        </div>

        {/* En-tête résultats */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Locations disponibles ({propertiesFiltres.length})
            </h2>
            <p className="text-gray-600 mt-1">
              Trouvez votre hébergement de rêve pour vos vacances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={tri} onValueChange={setTri}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trier par" />
              </SelectTrigger>
              <SelectContent>
                {tris.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grille des propriétés */}
        {error ? (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={loadProperties}
              className="mt-4"
              style={{ backgroundColor: colors.logo }}
            >
              Réessayer
            </Button>
          </div>
        ) : propertiesFiltres.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow">
            <Home className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Aucune location trouvée
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button
              onClick={handleResetFilters}
              className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
            >
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {propertiesFiltres.map((property) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group"
              >
                <Card
                  className="overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl cursor-pointer h-full flex flex-col"
                  onClick={() => handlePropertyClick(property)}
                >
                  <div className="relative flex-1">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={getSafeImageUrl(property.images[0])}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <span className="bg-[#6B8E23] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                          {property.type}
                        </span>
                        {property.featured && (
                          <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                            COUP DE CŒUR
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => toggleFavorite(property.id, e)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites[property.id]
                                ? "fill-red-500 text-red-500"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Prix */}
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-[#556B2F] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                          {formatPrice(property.price)}
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="mb-3">
                        <h3 className="font-bold text-[#8B4513] text-lg mb-2 line-clamp-2 leading-snug">
                          {property.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-3.5 w-3.5 text-[#556B2F] mr-1.5" />
                          <span>{property.city}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>

                      {/* Caractéristiques */}
                      <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Ruler className="h-3.5 w-3.5" />
                          <span className="font-medium">{property.surface} m²</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bed className="h-3.5 w-3.5" />
                          <span className="font-medium">{property.bedrooms} ch.</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="h-3.5 w-3.5" />
                          <span className="font-medium">{property.bathrooms} sdb</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          <span className="font-medium">{property.maxGuests} pers.</span>
                        </div>
                      </div>

                      {/* Note et avis */}
                      <div className="flex justify-between items-center mb-4">
                        {renderStars(property.rating)}
                        <span className="text-sm text-gray-500">
                          {property.reviewCount} avis
                        </span>
                      </div>

                      {/* Équipements */}
                      {property.amenities.length > 0 && renderAmenities(property.amenities)}

                      {/* Séjour minimum */}
                      <div className="flex items-center text-sm text-gray-600 mt-4">
                        <Calendar className="h-3.5 w-3.5 text-[#556B2F] mr-1.5" />
                        <span>Séjour minimum: {property.minimumStay} nuits</span>
                      </div>

                      {/* Boutons d'action */}
                      <div className="mt-auto pt-4 border-t border-gray-200/50">
                        <div className="flex gap-3">
                          <Button
                            className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                            onClick={(e) => handleOpenReservation(property, e)}
                            disabled={sentRequests[property.id]}
                          >
                            {sentRequests[property.id]
                              ? "Réservation en cours"
                              : "Réserver maintenant"}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                            onClick={() => handlePropertyClick(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal filtres mobile */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filtres avancés</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="p-4 space-y-6">
                  {/* Filtres mobiles */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Type de bien</h4>
                    <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="VILLA">Villa</SelectItem>
                        <SelectItem value="APPARTEMENT">Appartement</SelectItem>
                        <SelectItem value="MAISON">Maison</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Budget (€/semaine)</h4>
                    <Input
                      placeholder="Prix maximum"
                      value={filters.priceMax || ''}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value ? Number(e.target.value) : null }))}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Surface (m²)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Min"
                        value={filters.surfaceMin || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, surfaceMin: e.target.value ? Number(e.target.value) : null }))}
                      />
                      <Input
                        placeholder="Max"
                        value={filters.surfaceMax || ''}
                        onChange={(e) => setFilters(prev => ({ ...prev, surfaceMax: e.target.value ? Number(e.target.value) : null }))}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Chambres</h4>
                    <Select
                      value={filters.bedrooms?.toString() || "all"}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value === "all" ? null : parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nombre de chambres" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Recherche par rayon</h4>
                      <button
                        type="button"
                        onClick={() => setFilters(prev => ({ ...prev, radiusEnabled: !prev.radiusEnabled }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${filters.radiusEnabled ? 'bg-[#556B2F]' : 'bg-gray-200'
                          }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${filters.radiusEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                      </button>
                    </div>

                    {filters.radiusEnabled && (
                      <div className="space-y-3">
                        <Slider
                          value={[filters.radiusKm]}
                          min={0}
                          max={30}
                          step={1}
                          onValueChange={(v) => setFilters(prev => ({ ...prev, radiusKm: v[0] ?? 0 }))}
                          className="w-full"
                        />
                        <div className="text-center">
                          <span className="text-sm text-gray-600">
                            Rayon: <span className="text-[#556B2F] font-bold">{filters.radiusKm} km</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Équipements</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {availableAmenities.slice(0, 6).map((amenity) => (
                        <button
                          key={amenity.id}
                          type="button"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              amenities: prev.amenities.includes(amenity.id)
                                ? prev.amenities.filter(id => id !== amenity.id)
                                : [...prev.amenities, amenity.id]
                            }));
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
                            filters.amenities.includes(amenity.id)
                              ? 'border-[#556B2F] bg-[#556B2F]/10'
                              : 'border-gray-300'
                          }`}
                        >
                          <amenity.icon className="h-4 w-4" />
                          <span>{amenity.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white pt-4 border-t">
                  <Button
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="w-full bg-[#556B2F] hover:bg-[#6B8E23] mb-2"
                  >
                    Appliquer les filtres
                  </Button>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Réinitialiser tous les filtres
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Location Picker */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        value={filters.location}
        onChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
        onLocationSelect={handleLocationSelect}
        properties={properties.map((p) => ({
          id: p.id,
          title: p.title,
          address: p.city,
          city: p.city,
          latitude: p.latitude,
          longitude: p.longitude,
          type: p.type,
          price: p.price,
          status: p.status,
        }))}
      />

      {/* Modal de réservation */}
      {isReservationOpen && selectedProperty && (
        <ModalDemandeVisite
          open={isReservationOpen}
          onClose={() => setIsReservationOpen(false)}
          property={selectedProperty}
          isAlreadySent={!!sentRequests[selectedProperty.id]}
          onSuccess={(id: string) => {
            setSentRequests(prev => ({ ...prev, [id]: true }));
            toast({
              title: "Réservation confirmée",
              description: "Votre réservation a été enregistrée avec succès",
            });
          }}
          onPropertyContact={() => {}}
        />
      )}
    </div>
  );
};

export default LocationSaisonniere;