import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Ruler,
  Eye,
  Calendar,
  Home,
  Search,
  Filter,
  Navigation,
  DollarSign,
  Maximize2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import rentProperties1 from "@/assets/propertyLouer-1.jpg";
import rentProperties2 from "@/assets/propertyLouer-2.jpg";
import rentProperties3 from "@/assets/propertyLouer-3.jpeg";
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
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useImmobilierTracking } from "@/hooks/useImmobilierTracking";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";
import { AdCard } from "./Publicite";

// Données locales de fallback
const localRentProperties = [
  {
    id: "4",
    localImage: rentProperties1,
    price: 1250,
    title: "Appartement meublé",
    city: "Saint-Denis",
    surface: 75,
    type: "APPARTEMENT",
    status: "for_rent",
    rooms: 2,
    features: "2 ch • Meublé • Parking",
    latitude: -20.8823,
    longitude: 55.4504,
  },
  {
    id: "5",
    localImage: rentProperties2,
    price: 580,
    title: "Duplex T1 bis 55m² à Saint Gilles les Bains",
    city: "Saint-Gilles-les-Bains",
    surface: 55,
    type: "APPARTEMENT",
    status: "for_rent",
    rooms: 1,
    features: "Location courte durée",
    latitude: -21.0094,
    longitude: 55.2696,
  },
  {
    id: "6",
    localImage: rentProperties3,
    price: 2100,
    title: "Villa de standing",
    city: "Saint-Paul",
    surface: 200,
    type: "VILLA",
    status: "for_rent",
    rooms: 4,
    features: "4 ch • Piscine • Jardin",
    latitude: -21.3416,
    longitude: 55.4781,
  },
];

// Utilitaires
const formatPrice = (price: number, rentType: string) => {
  if (rentType === "saisonniere") {
    return `${price.toLocaleString("fr-FR")} €/semaine`;
  }
  return `${price.toLocaleString("fr-FR")} €/mois`;
};

const normalizeFeatures = (features: any): string[] => {
  if (!features) return [];
  if (Array.isArray(features)) return features as string[];
  return String(features)
    .split(/[•,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const normalizeAddress = (address: string) => {
  if (!address) return "";
  return address
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

interface PropertyRentProps {
  cardsOnly?: boolean;
  maxItems?: number;
  onPropertyView?: (property: any) => void;
  onPropertyClick?: (property: any) => void;
  onPropertyContact?: (property: any) => void;
  onSearch?: (query: string, resultsCount?: number) => void;
  onFilter?: (filters: any) => void;
}

const PropertyRent: React.FC<PropertyRentProps> = ({
  cardsOnly = false,
  maxItems,
  onPropertyView,
  onPropertyClick,
  onPropertyContact,
  onSearch,
  onFilter,
}) => {
  const navigate = useNavigate();

  // Initialisation du tracking
  const {
    trackPropertyView,
    trackPropertyClick,
    trackPropertyFilter,
    trackPropertyContact,
    trackPropertySearch,
  } = useImmobilierTracking();

  // États de recherche/filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>(undefined);
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>(undefined);
  const [pieces, setPieces] = useState<number | undefined>(undefined);
  const [chambres, setChambres] = useState<number | undefined>(undefined);
  const [exterieur, setExterieur] = useState<string | undefined>(undefined);
  const [extras, setExtras] = useState<string | undefined>(undefined);
  const [typeBienLocation, setTypeBienLocation] = useState<string | undefined>(undefined);
  const [localisation, setLocalisation] = useState("");

  // État pour le filtre de rayon - TOUJOURS VISIBLE
  const [radiusKm, setRadiusKm] = useState(5);
  const [radiusFilterEnabled, setRadiusFilterEnabled] = useState(false);

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  // État pour le type de location
  const [rentType, setRentType] = useState<"longue_duree" | "saisonniere">("longue_duree");

  const [rentProperties, setRentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { user, isAuthenticated } = useAuth();

  // Position par défaut de l'utilisateur (Saint-Denis, La Réunion)
  const [userLocation] = useState({
    lat: -20.882057,
    lon: 55.450675,
  });

  // Fonction pour calculer la distance
  const getDistanceKm = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }, []);

  // Intersection Observer pour le tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const propertyId = entry.target.getAttribute("data-property-id");
            const property = rentProperties.find((p) => p.id === propertyId);

            if (property) {
              trackPropertyView(property.id, property.type, property.price);
              if (onPropertyView) {
                onPropertyView(property);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    rentProperties.forEach((property) => {
      const element = document.querySelector(`[data-property-id="${property.id}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [rentProperties, trackPropertyView, onPropertyView]);

  // Load user's demandes
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let mounted = true;
    const loadUserDemandes = async () => {
      setDemandesLoading(true);
      try {
        const resp = await api.get(`/demandes/immobilier/user/${user.id}`);
        const demandes = resp.data || [];
        const map: Record<string, boolean> = {};
        demandes.forEach((d: any) => {
          if (d && d.propertyId) map[String(d.propertyId)] = true;
        });
        if (mounted) setSentRequests((prev) => ({ ...prev, ...map }));
      } catch (err) {
        console.error("Unable to load user demandes", err);
      } finally {
        if (mounted) setDemandesLoading(false);
      }
    };

    loadUserDemandes();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, user?.id]);

  // Fetch properties basé sur le type de location
  const fetchProperties = async () => {
    try {
      setError(null);
      const response = await api.get("/properties");
      if (!response.data) throw new Error("Erreur lors de la récupération des propriétés");

      const properties = response.data.map((p: any) => ({
        ...p,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
      }));

      const forRent = properties
        .filter((p: any) =>
          p.status === "for_rent" &&
          p.isActive &&
          p.rentType === rentType
        )
        .map((p: any, i: number) => ({
          ...p,
          localImage: [rentProperties1, rentProperties2, rentProperties3][i % 3],
        }));

      setRentProperties(forRent);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Impossible de charger les propriétés. Affichage des exemples.");
      setRentProperties(localRentProperties as any[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [rentType]);

  // Initialize image indexes
  useEffect(() => {
    const indexes: Record<string, number> = {};
    rentProperties.forEach((p: any) => {
      indexes[p.id] = indexes[p.id] ?? 0;
    });
    setCurrentImageIndexes((prev) => ({ ...indexes, ...prev }));
  }, [rentProperties]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && property.images.length > 0) return property.images as string[];
    if (property.localImage) return [property.localImage as string];
    return [rentProperties1];
  };

  // Handlers
  const handlePropertyClick = (property: any) => {
    trackPropertyClick(property.id, property.title, property.price);
    if (onPropertyClick) onPropertyClick(property);
    navigate(`/location/${property.id}`);
  };

  const handlePropertyContact = (property: any) => {
    trackPropertyContact(property.id, property.title);
    if (onPropertyContact) onPropertyContact(property);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const resultsCount = displayed.length;
    trackPropertySearch(query, resultsCount);
    if (onSearch) onSearch(query, resultsCount);
  };

  const handleFilterChange = () => {
    const filters = {
      type: typeBienLocation,
      priceMax,
      location: localisation,
      radiusKm: radiusFilterEnabled ? radiusKm : undefined,
      rooms: pieces,
      surfaceMin,
      surfaceMax,
      chambres,
      exterieur,
      extras,
      rentType,
      searchQuery,
    };

    trackPropertyFilter(filters);
    if (onFilter) onFilter(filters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [typeBienLocation, priceMax, localisation, radiusKm, radiusFilterEnabled, pieces, surfaceMin, surfaceMax, chambres, exterieur, extras, rentType, searchQuery]);

  const handleLocationSelect = (location: any) => {
    setLocalisation(location.address);
    if (location.latitude && location.longitude) {
      setSelectedCoordinates({
        lat: location.latitude,
        lng: location.longitude
      });
    }
  };

  const displayed = useMemo(() => {
    return rentProperties.filter((p) => {
      if (!p) return false;

      // Recherche générale
      if (searchQuery && searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase();
        const matchesGeneral =
          (p.title || "").toLowerCase().includes(searchTerm) ||
          (p.description || "").toLowerCase().includes(searchTerm) ||
          (p.city || "").toLowerCase().includes(searchTerm) ||
          (p.address || "").toLowerCase().includes(searchTerm);

        if (!matchesGeneral) return false;
      }

      // Localisation filter
      if (localisation && localisation.trim()) {
        const searchTerm = normalizeAddress(localisation);
        const city = normalizeAddress(p.city || "");
        const address = normalizeAddress(p.address || "");
        const zipCode = normalizeAddress(p.zipCode || "");

        const matchesLocation =
          city.includes(searchTerm) ||
          address.includes(searchTerm) ||
          zipCode.includes(searchTerm) ||
          searchTerm.includes(city) ||
          searchTerm.includes(address);

        if (!matchesLocation) return false;
      }

      // Filtre par rayon si activé
      if (radiusFilterEnabled && userLocation && radiusKm > 0) {
        if (!p.latitude || !p.longitude) return false;
        const dist = getDistanceKm(
          userLocation.lat,
          userLocation.lon,
          p.latitude,
          p.longitude
        );
        if (dist > radiusKm) return false;
      }

      // Price filter
      if (priceMax !== undefined && (p.price === undefined || p.price > priceMax)) return false;

      // Surface filter
      if (surfaceMin !== undefined && (p.surface === undefined || p.surface < surfaceMin)) return false;
      if (surfaceMax !== undefined && (p.surface === undefined || p.surface > surfaceMax)) return false;

      // Type filter
      if (typeBienLocation) {
        if (!String(p.type || "").toLowerCase().includes(String(typeBienLocation).toLowerCase())) return false;
      }

      // Features filters
      const hasFeature = (token: string) => {
        if (!token) return true;
        const feats = Array.isArray(p.features)
          ? p.features.join(" ").toLowerCase()
          : String(p.features || "").toLowerCase();
        const more = `${String(p.type || "").toLowerCase()} ${String(p.title || "").toLowerCase()} ${String(p.description || "").toLowerCase()}`;
        return feats.includes(token.toLowerCase()) || more.includes(token.toLowerCase());
      };

      if (exterieur !== undefined && exterieur !== "" && !hasFeature(exterieur)) return false;
      if (extras !== undefined && extras !== "" && !hasFeature(extras)) return false;

      // Rooms filter
      if (pieces !== undefined) {
        const pcs = p.rooms ?? p.pieces ?? p.bedrooms ?? 0;
        if (pcs < pieces) return false;
      }

      if (chambres !== undefined) {
        const ch = p.bedrooms ?? p.rooms ?? 0;
        if (ch < chambres) return false;
      }

      return true;
    });
  }, [rentProperties, searchQuery, localisation, typeBienLocation, priceMax, radiusKm, radiusFilterEnabled, userLocation, surfaceMin, surfaceMax, pieces, chambres, exterieur, extras, getDistanceKm]);

  const prevImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + total) % total,
    }));
  };

  const nextImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % total,
    }));
  };

  const handleDemanderVisite = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();
    handlePropertyContact(property);

    if (sentRequests?.[property?.id]) {
      toast({
        title: "Demande déjà envoyée",
        description: "Vous avez déjà envoyé une demande pour ce bien.",
      });
      return;
    }
    setSelectedProperty(property);
    setModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceMax(undefined);
    setSurfaceMin(undefined);
    setSurfaceMax(undefined);
    setPieces(undefined);
    setChambres(undefined);
    setExterieur(undefined);
    setExtras(undefined);
    setTypeBienLocation(undefined);
    setLocalisation("");
    setRadiusFilterEnabled(false);
    setRadiusKm(5);
    setSelectedCoordinates(null);
  };

  const activeFiltersCount = [
    searchQuery,
    priceMax !== undefined,
    surfaceMin !== undefined,
    surfaceMax !== undefined,
    pieces !== undefined,
    chambres !== undefined,
    exterieur,
    extras,
    typeBienLocation,
    localisation,
    radiusFilterEnabled,
  ].filter(Boolean).length;

  // Mode cartes seules
  if (cardsOnly) {
    return (
      <div className="w-full">
        <div className="space-y-6">
          {/* Barre de recherche principale */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher une location, une ville, un quartier..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
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

            {/* Filtres rapides desktop - REMPLACEMENT DU BOUTON RECHERCHE PAR RAYON */}
            <div className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Type de bien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <Select value={typeBienLocation} onValueChange={setTypeBienLocation}>
                  <SelectTrigger>
                    <Home className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tous" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="maison">Maison/Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    value={localisation}
                    onClick={() => setIsLocationModalOpen(true)}
                    placeholder="Localisation"
                    className="pl-10 cursor-pointer"
                    readOnly
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {rentType === "saisonniere" ? "Prix max/semaine" : "Prix max/mois"}
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={rentType === "saisonniere" ? "Max €/sem" : "Max €"}
                    value={priceMax || ''}
                    onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* REMPLACEMENT: Recherche par rayon à la place du bouton Recherche */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recherche par rayon
                  </label>
                  <Button
                    type="button"
                    variant={radiusFilterEnabled ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRadiusFilterEnabled(!radiusFilterEnabled)}
                    className="h-6 px-2 text-xs"
                  >
                    {radiusFilterEnabled ? "ON" : "OFF"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-[#556B2F]" />
                    <span className="text-sm text-gray-600">
                      Rayon: <span className="text-[#556B2F] font-bold">{radiusKm} km</span>
                    </span>
                  </div>

                  <Slider
                    value={[radiusKm]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
                    className="w-full"
                  />

                  <div className="flex gap-1">
                    {[5, 10, 15, 20].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={radiusKm === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRadiusKm(value)}
                        className="flex-1 text-xs h-6 px-1"
                      >
                        {value} km
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton réinitialiser */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Réinitialiser ({activeFiltersCount})
                </Button>
              </div>
            )}
          </div>

          {/* Résultats */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Locations ({displayed.length})
              </h2>
              <div className="text-sm text-gray-600">
                {maxItems ? `Affichage de ${Math.min(maxItems, displayed.length)} sur ${displayed.length}` : ''}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
                    <div className="bg-gray-200 h-6 rounded mb-2" />
                    <div className="bg-gray-200 h-4 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucune location trouvée
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(maxItems ? displayed.slice(0, maxItems) : displayed).map((property: any, index: number) => {
                  const images = getPropertyImages(property);
                  const totalImages = images.length;
                  const idx = currentImageIndexes[property.id] || 0;
                  const featuresArr = normalizeFeatures(property.features);
                  const priceLabel = formatPrice(property.price || 0, rentType);

                  // Calcul de la distance si le filtre de rayon est activé
                  let distanceInfo = null;
                  if (radiusFilterEnabled && property.latitude && property.longitude) {
                    const distance = getDistanceKm(
                      userLocation.lat,
                      userLocation.lon,
                      property.latitude,
                      property.longitude
                    );
                    if (distance <= radiusKm) {
                      distanceInfo = (
                        <div className="flex items-center gap-1 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full">
                          <Navigation className="w-3 h-3" />
                          {distance.toFixed(1)} km
                        </div>
                      );
                    }
                  }

                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card
                        data-property-id={property.id}
                        className="home-card cursor-pointer h-full border border-gray-200 rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300 hover:border-[#556B2F]/20"
                        onClick={() => handlePropertyClick(property)}
                      >
                        <div className="relative">
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={images[idx % totalImages]}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            <div className="absolute top-3 left-3">
                              <span className="bg-[#556B2F] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {property.type}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                              <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {rentType === "saisonniere" ? "SAISONNIÈRE" : "À LOUER"}
                              </span>
                              {distanceInfo}
                            </div>

                            {totalImages > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                                  onClick={(e) => prevImage(property.id, totalImages, e)}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
                                  onClick={(e) => nextImage(property.id, totalImages, e)}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                  {idx + 1}/{totalImages}
                                </div>
                              </>
                            )}

                            <div className="absolute bottom-3 right-3">
                              <span className="bg-[#556B2F] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                                {priceLabel}
                              </span>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-[#8B4513] text-base mb-2 line-clamp-2 leading-snug">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-[#556B2F] mr-1.5" />
                                <span>{property.city}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                              {property.surface && (
                                <div className="flex items-center gap-1.5">
                                  <Ruler className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.surface} m²</span>
                                </div>
                              )}
                              {(property.bedrooms || property.rooms) && (
                                <div className="flex items-center gap-1.5">
                                  <Bed className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.bedrooms || property.rooms} ch.</span>
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className="flex items-center gap-1.5">
                                  <Bath className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.bathrooms} sdb</span>
                                </div>
                              )}
                            </div>

                            {featuresArr.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {featuresArr.slice(0, 3).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 bg-[#6B8E23]/10 text-[#556B2F] px-3 py-1 rounded-full text-xs font-medium"
                                  >
                                    <div className="w-1.5 h-1.5 bg-[#556B2F] rounded-full" />
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex gap-3">
                              <Button
                                className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                                onClick={() => handlePropertyClick(property)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                                onClick={(e) => handleDemanderVisite(property, e)}
                                disabled={!!sentRequests?.[property?.id]}
                              >
                                {sentRequests?.[property?.id] ? "Demandé" : "Visite"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
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
                    <h3 className="text-lg font-semibold">Filtres</h3>
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
                      <h4 className="font-medium text-gray-900 mb-3">Localisation et Rayon</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Localisation
                          </label>
                          <div className="relative">
                            <Input
                              value={localisation}
                              onClick={() => {
                                setIsMobileFiltersOpen(false);
                                setIsLocationModalOpen(true);
                              }}
                              placeholder="Ville, code postal..."
                              className="pl-10 cursor-pointer"
                              readOnly
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Recherche par rayon</p>
                            <p className="text-sm text-gray-500">Activer le rayon de recherche</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setRadiusFilterEnabled(!radiusFilterEnabled)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${radiusFilterEnabled ? 'bg-[#556B2F]' : 'bg-gray-200'
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${radiusFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>

                        {radiusFilterEnabled && (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Rayon: <span className="text-[#556B2F] font-bold">{radiusKm} km</span>
                              </span>
                            </div>

                            <input
                              type="range"
                              min="0"
                              max="30"
                              value={radiusKm}
                              onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#556B2F]"
                            />

                            <div className="flex gap-2">
                              {[5, 10, 15, 20, 30].map((value) => (
                                <Button
                                  key={value}
                                  type="button"
                                  variant={radiusKm === value ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setRadiusKm(value)}
                                  className="flex-1 text-xs"
                                >
                                  {value} km
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Autres filtres mobiles */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Type de bien</h4>
                        <Select value={typeBienLocation} onValueChange={setTypeBienLocation}>
                          <SelectTrigger>
                            <SelectValue placeholder="Tous les types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appartement">Appartement</SelectItem>
                            <SelectItem value="maison">Maison/Villa</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Budget ({rentType === "saisonniere" ? "€/semaine" : "€/mois"})</h4>
                        <div className="relative">
                          <Input
                            placeholder={`Max ${rentType === "saisonniere" ? "€/sem" : "€"}`}
                            value={priceMax || ''}
                            onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Surface (m²)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Input
                              placeholder="Min"
                              value={surfaceMin || ''}
                              onChange={(e) => setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Max"
                              value={surfaceMax || ''}
                              onChange={(e) => setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Caractéristiques</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Select
                              value={chambres?.toString()}
                              onValueChange={(v) => setChambres(v ? parseInt(v) : undefined)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chambres" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Select
                              value={pieces?.toString()}
                              onValueChange={(v) => setPieces(v ? parseInt(v) : undefined)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pièces" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1+</SelectItem>
                                <SelectItem value="2">2+</SelectItem>
                                <SelectItem value="3">3+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sticky bottom-0 bg-white pt-4 border-t">
                      <Button
                        onClick={() => {
                          handleFilterChange();
                          setIsMobileFiltersOpen(false);
                        }}
                        className="w-full bg-[#556B2F] hover:bg-[#6B8E23] mb-2"
                      >
                        Appliquer les filtres
                      </Button>

                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleResetFilters();
                            setIsMobileFiltersOpen(false);
                          }}
                          className="w-full text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Réinitialiser tous les filtres
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ModalDemandeVisite
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={selectedProperty}
          isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
          onSuccess={(id: string) => setSentRequests((prev) => ({ ...prev, [id]: true }))}
          onPropertyContact={handlePropertyContact}
        />

        <LocationPickerModal
          open={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          value={localisation}
          onChange={setLocalisation}
          onLocationSelect={handleLocationSelect}
          properties={rentProperties.map((p) => ({
            id: p.id,
            title: p.title,
            address: p.address || "",
            city: p.city,
            latitude: p.latitude,
            longitude: p.longitude,
            type: p.type,
            price: p.price,
            status: p.status,
          }))}
        />
      </div>
    );
  }

  // Mode page complète
  return (
    <div className="min-h-screen">
      {/* Hero Section avec margin-top */}
      <div className="mt-20 relative">
        <div className="fixed -z-10 overflow-hidden bg-black w-full h-96 top-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            className="opacity-45 object-cover w-full h-full"
            alt="Background location"
          />
        </div>

        <div className="pt-2 w-11/12 mx-auto flex flex-col">
          <span className="text-2xl lg:text-5xl text-white text-center tracking-wider font-serif font-semibold">
            Locations Immobilières
          </span>
          <span className="text-center text-xs pt-5 text-white/60">
            Trouvez le logement idéal pour votre séjour à La Réunion
          </span>
        </div>
      </div>

      <section className="container mx-auto px-4 mt-8">
        <div className="space-y-6">
          {/* Barre de recherche principale */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
              <Input
                type="text"
                placeholder="Rechercher une location, une ville, un quartier..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 h-14 text-lg border-gray-300 focus:border-[#556B2F] focus:ring-[#556B2F] rounded-xl"
              />
            </div>

            {/* Boutons de sélection du type de location */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                onClick={() => setRentType("longue_duree")}
                variant={rentType === "longue_duree" ? "default" : "outline"}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold ${rentType === "longue_duree"
                  ? "bg-[#556B2F] text-white hover:bg-[#6B8E23]"
                  : "border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                  }`}
              >
                <Home className="h-5 w-5" />
                <span>Location Longue Durée</span>
              </Button>

              <Button
                onClick={() => setRentType("saisonniere")}
                variant={rentType === "saisonniere" ? "default" : "outline"}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold ${rentType === "saisonniere"
                  ? "bg-[#556B2F] text-white hover:bg-[#6B8E23]"
                  : "border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                  }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Location Saisonnière</span>
              </Button>
            </div>

            {/* Bouton filtres mobile */}
            <div className="lg:hidden mb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12"
                onClick={() => setIsMobileFiltersOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtres avancés {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>

            {/* Grille de filtres desktop - REMPLACEMENT DU BOUTON RECHERCHE PAR RAYON */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
              {/* Type de bien */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bien
                </label>
                <Select value={typeBienLocation} onValueChange={setTypeBienLocation}>
                  <SelectTrigger className="h-12">
                    <Home className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    {rentType === "saisonniere" ? (
                      <>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison / Villa</SelectItem>
                        <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                        <SelectItem value="location_journee">Location à la journée</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="chambre_d_hote">Chambre d'hote</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="appartement">Appartement meublé</SelectItem>
                        <SelectItem value="appartement_non_meuble">Appartement non meublé</SelectItem>
                        <SelectItem value="villa_meublee">Villa meublée</SelectItem>
                        <SelectItem value="villa_non_meublee">Villa non meublée</SelectItem>
                        <SelectItem value="local_commercial">Local commercial</SelectItem>
                        <SelectItem value="local_professionnel">Local professionnel</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="cellier">Cellier</SelectItem>
                        <SelectItem value="cave">Cave</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <Input
                    value={localisation}
                    onClick={() => setIsLocationModalOpen(true)}
                    placeholder="Ville, code postal..."
                    className="pl-10 h-12 cursor-pointer"
                    readOnly
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {rentType === "saisonniere" ? "Prix max (€/semaine)" : "Prix max (€/mois)"}
                </label>
                <div className="relative">
                  <Input
                    placeholder="Montant max"
                    value={priceMax || ''}
                    onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                    className="h-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {rentType === "saisonniere" ? "€/sem" : "€"}
                  </span>
                </div>
              </div>

              {/* REMPLACEMENT: Recherche par rayon à la place du bouton Recherche */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recherche par rayon
                  </label>
                  <button
                    type="button"
                    onClick={() => setRadiusFilterEnabled(!radiusFilterEnabled)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${radiusFilterEnabled ? 'bg-[#556B2F]' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${radiusFilterEnabled ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-[#556B2F]" />
                    <span className="text-sm text-gray-600">
                      Rayon: <span className="text-[#556B2F] font-bold">{radiusKm} km</span>
                    </span>
                  </div>

                  <Slider
                    value={[radiusKm]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
                    className="w-full"
                  />

                  <div className="flex gap-1">
                    {[5, 10, 15, 20, 30].map((value) => (
                      <Button
                        key={value}
                        type="button"
                        variant={radiusKm === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setRadiusKm(value)}
                        className="flex-1 text-xs h-6 px-1"
                      >
                        {value} km
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres avancés (non-rayon) - Desktop */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (m²)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Min"
                      value={surfaceMin || ''}
                      onChange={(e) => setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)}
                      className="pl-10 h-12"
                    />
                    <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="relative flex-1">
                    <Input
                      placeholder="Max"
                      value={surfaceMax || ''}
                      onChange={(e) => setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)}
                      className="pl-10 h-12"
                    />
                    <Maximize2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chambres
                </label>
                <Select
                  value={chambres?.toString()}
                  onValueChange={(v) => setChambres(v ? parseInt(v) : undefined)}
                >
                  <SelectTrigger className="h-12">
                    <Bed className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Nombre de chambres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pièces
                </label>
                <Select
                  value={pieces?.toString()}
                  onValueChange={(v) => setPieces(v ? parseInt(v) : undefined)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Nombre de pièces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
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
                  Réinitialiser tous les filtres ({activeFiltersCount})
                </Button>
              </div>
            )}
          </div>

          <AdCard
            mediaType="image"
            imageUrl="https://i.pinimg.com/1200x/55/3a/94/553a94400adf760f4965ccd1f6395286.jpg"
            title="Découvrez notre nouvelle offre"
            description="Profitez de réductions exclusives sur une sélection de produits pendant une durée limitée.Profitez de réductions exclusives sur une sélection de produits pendant une durée limitée."
          />

          {/* Résultats */}
          <div className="mt-4 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {rentType === "saisonniere" ? "Locations Saisonnières" : "Locations Longue Durée"} ({displayed.length})
              </h2>
              {radiusFilterEnabled && (
                <div className="flex items-center gap-2 text-sm bg-[#556B2F]/10 text-[#556B2F] px-3 py-1.5 rounded-full">
                  <Navigation className="h-4 w-4" />
                  <span>Rayon de {radiusKm} km activé</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
                    <div className="bg-gray-200 h-6 rounded mb-2" />
                    <div className="bg-gray-200 h-4 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow">
                <Home className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Aucune location trouvée
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Essayez de modifier vos critères de recherche ou contactez-nous pour une recherche personnalisée.
                </p>
                <Button
                  onClick={handleResetFilters}
                  className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayed.map((property: any, index: number) => {
                  const images = getPropertyImages(property);
                  const totalImages = images.length;
                  const idx = currentImageIndexes[property.id] || 0;
                  const featuresArr = normalizeFeatures(property.features);
                  const priceLabel = formatPrice(property.price || 0, rentType);

                  // Calcul de la distance si applicable
                  let distanceInfo = null;
                  if (radiusFilterEnabled && property.latitude && property.longitude) {
                    const distance = getDistanceKm(
                      userLocation.lat,
                      userLocation.lon,
                      property.latitude,
                      property.longitude
                    );
                    if (distance <= radiusKm) {
                      distanceInfo = (
                        <div className="flex items-center gap-1 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full">
                          <Navigation className="w-3 h-3" />
                          {distance.toFixed(1)} km
                        </div>
                      );
                    }
                  }

                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Card
                        data-property-id={property.id}
                        className="overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl cursor-pointer h-full flex flex-col"
                        onClick={() => handlePropertyClick(property)}
                      >
                        <div className="relative flex-1">
                          {/* Image */}
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={images[idx % totalImages]}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Badges */}
                            <div className="absolute top-3 left-3">
                              <span className="bg-[#6B8E23] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {property.type}
                              </span>
                            </div>

                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                              <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                                {rentType === "saisonniere" ? "SAISONNIÈRE" : "À LOUER"}
                              </span>
                              {distanceInfo}
                            </div>

                            {/* Navigation d'images */}
                            {totalImages > 1 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                  onClick={(e) => prevImage(property.id, totalImages, e)}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                  onClick={(e) => nextImage(property.id, totalImages, e)}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                                  {idx + 1}/{totalImages}
                                </div>
                              </>
                            )}

                            {/* Prix */}
                            <div className="absolute bottom-3 right-3">
                              <span className="bg-[#556B2F] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                                {priceLabel}
                              </span>
                            </div>
                          </div>

                          {/* Contenu */}
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="mb-3">
                              <h3 className="font-bold text-[#8B4513] text-base mb-2 line-clamp-2 leading-snug">
                                {property.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3.5 w-3.5 text-[#556B2F] mr-1.5" />
                                <span>{property.city}</span>
                              </div>
                            </div>

                            {/* Caractéristiques */}
                            <div className="flex items-center gap-4 text-sm text-gray-700 mb-4">
                              {property.surface && (
                                <div className="flex items-center gap-1.5">
                                  <Ruler className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.surface} m²</span>
                                </div>
                              )}
                              {(property.bedrooms || property.rooms) && (
                                <div className="flex items-center gap-1.5">
                                  <Bed className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.bedrooms || property.rooms} ch.</span>
                                </div>
                              )}
                              {property.bathrooms && (
                                <div className="flex items-center gap-1.5">
                                  <Bath className="h-3.5 w-3.5" />
                                  <span className="font-medium">{property.bathrooms} sdb</span>
                                </div>
                              )}
                            </div>

                            {/* Features */}
                            {featuresArr.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-5">
                                {featuresArr.slice(0, 3).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 bg-[#6B8E23]/10 text-[#556B2F] px-3 py-1.5 rounded-full text-xs font-medium"
                                  >
                                    <div className="w-1.5 h-1.5 bg-[#556B2F] rounded-full" />
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="mt-auto pt-4 border-t border-gray-200/50">
                              <div className="flex gap-3">
                                <Button
                                  className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                                  onClick={(e) => handleDemanderVisite(property, e)}
                                  disabled={!!sentRequests?.[property?.id]}
                                >
                                  {sentRequests?.[property?.id]
                                    ? "Demande envoyée"
                                    : "Demander visite"}
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
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </section>

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
                  {/* Section Localisation et Rayon mobile */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Localisation et Rayon</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Localisation
                        </label>
                        <div className="relative">
                          <Input
                            value={localisation}
                            onClick={() => {
                              setIsMobileFiltersOpen(false);
                              setIsLocationModalOpen(true);
                            }}
                            placeholder="Ville, code postal..."
                            className="pl-10 cursor-pointer"
                            readOnly
                          />
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Recherche par rayon</p>
                          <p className="text-sm text-gray-500">Activer le rayon de recherche</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRadiusFilterEnabled(!radiusFilterEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${radiusFilterEnabled ? 'bg-[#556B2F]' : 'bg-gray-200'
                            }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${radiusFilterEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            Rayon: <span className="text-[#556B2F] font-bold">{radiusKm} km</span>
                          </span>
                        </div>

                        <Slider
                          value={[radiusKm]}
                          min={0}
                          max={30}
                          step={1}
                          onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
                          className="w-full"
                        />

                        <div className="flex gap-2">
                          {[5, 10, 15, 20, 30].map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant={radiusKm === value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setRadiusKm(value)}
                              className="flex-1 text-xs"
                            >
                              {value} km
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Autres filtres mobiles */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Type de bien</h4>
                      <Select value={typeBienLocation} onValueChange={setTypeBienLocation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                          {rentType === "saisonniere" ? (
                            <>
                              <SelectItem value="appartement">Appartement</SelectItem>
                              <SelectItem value="maison">Maison / Villa</SelectItem>
                              <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="appartement">Appartement meublé</SelectItem>
                              <SelectItem value="appartement_non_meuble">Appartement non meublé</SelectItem>
                              <SelectItem value="villa_meublee">Villa meublée</SelectItem>
                              <SelectItem value="villa_non_meublee">Villa non meublée</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {rentType === "saisonniere" ? "Prix max (€/semaine)" : "Prix max (€/mois)"}
                      </h4>
                      <div className="relative">
                        <Input
                          placeholder="Montant max"
                          value={priceMax || ''}
                          onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Surface (m²)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            placeholder="Min"
                            value={surfaceMin || ''}
                            onChange={(e) => setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Max"
                            value={surfaceMax || ''}
                            onChange={(e) => setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Caractéristiques</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Select
                            value={chambres?.toString()}
                            onValueChange={(v) => setChambres(v ? parseInt(v) : undefined)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chambres" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Select
                            value={pieces?.toString()}
                            onValueChange={(v) => setPieces(v ? parseInt(v) : undefined)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pièces" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1+</SelectItem>
                              <SelectItem value="2">2+</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="sticky bottom-0 bg-white pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleFilterChange();
                        setIsMobileFiltersOpen(false);
                      }}
                      className="w-full bg-[#556B2F] hover:bg-[#6B8E23] mb-2"
                    >
                      Appliquer les filtres
                    </Button>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleResetFilters();
                          setIsMobileFiltersOpen(false);
                        }}
                        className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Réinitialiser tous les filtres
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ModalDemandeVisite
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        property={selectedProperty}
        isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
        onSuccess={(id: string) => setSentRequests((prev) => ({ ...prev, [id]: true }))}
        onPropertyContact={handlePropertyContact}
      />

      <LocationPickerModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        value={localisation}
        onChange={setLocalisation}
        onLocationSelect={handleLocationSelect}
        properties={rentProperties.map((p) => ({
          id: p.id,
          title: p.title,
          address: p.address || "",
          city: p.city,
          latitude: p.latitude,
          longitude: p.longitude,
          type: p.type,
          price: p.price,
          status: p.status,
        }))}
      />
      <AdCard
        mediaType="image"
        imageUrl="https://i.pinimg.com/1200x/55/3a/94/553a94400adf760f4965ccd1f6395286.jpg"
        title="Découvrez notre nouvelle offre"
        description="Profitez de réductions exclusives sur une sélection de produits pendant une durée limitée.Profitez de réductions exclusives sur une sélection de produits pendant une durée limitée."
      />
    </div>
  );
};

export default PropertyRent;