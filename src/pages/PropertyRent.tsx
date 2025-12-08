import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Ruler,
  Eye,
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
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import LocationPickerModal from "@/components/carte";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useImmobilierTracking } from "@/hooks/useImmobilierTracking";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";

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
  },
];

// Utilitaires
const formatPrice = (price: number) => {
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
  isSeasonal?: boolean;
  onPropertyView?: (property: any) => void;
  onPropertyClick?: (property: any) => void;
  onPropertyContact?: (property: any) => void;
  onSearch?: (query: string, resultsCount?: number) => void;
  onFilter?: (filters: any) => void;
}

const PropertyRent: React.FC<PropertyRentProps> = ({
  cardsOnly = false,
  maxItems,
  isSeasonal = false,
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

  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>(undefined);
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>(undefined);
  const [pieces, setPieces] = useState<number | undefined>(undefined);
  const [chambres, setChambres] = useState<number | undefined>(undefined);
  const [exterieur, setExterieur] = useState<string | undefined>(undefined);
  const [extras, setExtras] = useState<string | undefined>(undefined);
  const [typeBienLocation, setTypeBienLocation] = useState<string | undefined>(undefined);
  const [localisation, setLocalisation] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [rentProperties, setRentProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { user, isAuthenticated } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 40px rgba(85, 107, 47, 0.15)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const badgeVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

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

  // Fetch properties
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
          (isSeasonal ? p.rentType === "saisonniere" : p.rentType === "longue_duree")
        )
        .slice(0, 8)
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
  }, [isSeasonal]);

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
    navigate(`/immobilier/location/${property.id}`);
  };

  const handlePropertyContact = (property: any) => {
    trackPropertyContact(property.id, property.title);
    if (onPropertyContact) onPropertyContact(property);
  };

  const handleSearch = (query: string) => {
    setLocalisation(query);
    const resultsCount = displayed.length;
    trackPropertySearch(query, resultsCount);
    if (onSearch) onSearch(query, resultsCount);
  };

  const handleFilterChange = () => {
    const filters = {
      type: typeBienLocation,
      priceMax,
      location: localisation,
      rooms: pieces,
      surfaceMin,
      surfaceMax,
      chambres,
      exterieur,
      extras,
    };

    trackPropertyFilter(filters);
    if (onFilter) onFilter(filters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [typeBienLocation, priceMax, localisation, pieces, surfaceMin, surfaceMax, chambres, exterieur, extras]);

  const displayed = useMemo(() => {
    const hasFeature = (p: any, token: string) => {
      if (!token) return true;
      const feats = Array.isArray(p.features)
        ? p.features.join(" ").toLowerCase()
        : String(p.features || "").toLowerCase();
      const more = `${String(p.type || "").toLowerCase()} ${String(p.title || "").toLowerCase()} ${String(p.description || "").toLowerCase()}`;
      return feats.includes(token.toLowerCase()) || more.includes(token.toLowerCase());
    };

    return rentProperties.filter((p) => {
      if (!p) return false;

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
      if (exterieur !== undefined && exterieur !== "" && !hasFeature(p, exterieur)) return false;
      if (extras !== undefined && extras !== "" && !hasFeature(p, extras)) return false;

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
  }, [rentProperties, localisation, typeBienLocation, priceMax, surfaceMin, surfaceMax, pieces, chambres, exterieur, extras]);

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

  // Mode cartes seules
  if (cardsOnly) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="animate-pulse"
                >
                  <div className="bg-[#FFFFFF0] h-64 rounded-2xl mb-4" />
                  <div className="bg-[#D3D3D3] h-6 rounded mb-2" />
                  <div className="bg-[#D3D3D3] h-4 rounded w-1/2" />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(maxItems ? displayed.slice(0, maxItems) : displayed).map((property: any, index: number) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;
                const featuresArr = normalizeFeatures(property.features);
                const priceLabel = formatPrice(property.price || 0);

                return (
                  <motion.div
                    key={property.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Card
                      data-property-id={property.id}
                      className="home-card group cursor-pointer h-full border border-[#D3D3D3] rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <motion.div className="relative" variants={imageVariants}>
                        <div className="relative rounded-lg h-52 overflow-hidden">
                          <motion.img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="home-card-image h-full w-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />

                          <motion.div
                            variants={badgeVariants}
                            className="absolute bg-[#6B8E23] rounded-full py-1 px-2 text-white font-semibold text-sm top-3 left-3 home-card-badge shadow-md"
                          >
                            {property.type}
                          </motion.div>
                          <motion.div
                            variants={badgeVariants}
                            className="absolute bg-[#556B2F] p-2 text-white font-semibold text-sm rounded-lg bottom-3 right-3 home-card-price shadow-lg"
                          >
                            {priceLabel}
                          </motion.div>
                          
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
                        </div>
                        
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-[#8B4513] text-sm flex-1 line-clamp-2 leading-tight">
                              {property.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.city}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            {property.surface && (
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3 w-3" />
                                <span>{property.surface} m²</span>
                              </div>
                            )}
                            {(property.bedrooms || property.rooms) && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{property.bedrooms || property.rooms} ch.</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3" />
                                <span>{property.bathrooms} sdb</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mb-3">
                            {featuresArr.slice(0, 2).map((feature, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="inline-flex items-center gap-1 bg-[#6B8E23]/10 text-[#556B2F] px-2 py-1 rounded-full text-xs"
                              >
                                <div className="w-1 h-1 bg-[#556B2F] rounded-full" />
                                {feature}
                              </motion.span>
                            ))}
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative w-full bg-[#556B2F] text-white p-2 rounded-md flex items-center justify-center gap-2 group overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                            onClick={() => handlePropertyClick(property)}
                          >
                            <span className="relative z-10 font-semibold text-sm">Voir details</span>
                            <Eye className="w-4 h-4 relative z-10" />
                            <motion.div
                              className="absolute inset-0 bg-[#6B8E23]"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </motion.button>
                        </div>
                      </motion.div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        <ModalDemandeVisite
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={selectedProperty}
          isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
          onSuccess={(id: string) => setSentRequests((prev) => ({ ...prev, [id]: true }))}
          onPropertyContact={handlePropertyContact}
        />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg z-50 mt-44 w-full"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header avec animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-[#8B4513] mb-2"
          >
            {isSeasonal ? "Locations Saisonnières" : "Locations Longue Durée"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            {isSeasonal 
              ? "Trouvez votre hébergement de vacances idéal" 
              : "Découvrez nos biens disponibles à la location"}
          </motion.p>
        </motion.div>

        {/* Filtres */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-[#FFFFFF0] rounded-2xl border border-[#D3D3D3] p-6 shadow-sm mb-8"
        >
          <div className="mb-5 flex items-center gap-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="h-6 bg-[#556B2F] rounded-full"
            />
            <h3 className="text-sm font-bold text-[#8B4513] uppercase tracking-wider">
              Recherche de location
            </h3>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4"
          >
            {/* Type de bien */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Type de bien
              </label>
              <Select
                onValueChange={(v) => setTypeBienLocation(v || undefined)}
                value={typeBienLocation}
              >
                <SelectTrigger 
                  className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] transition-colors rounded-xl focus:ring-2 focus:ring-[#556B2F]/20"
                >
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {isSeasonal ? (
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
                      <SelectItem value="villa">Appartement non meublé</SelectItem>
                      <SelectItem value="studio">Villa meublée</SelectItem>
                      <SelectItem value="studio">Villa non meublée</SelectItem>
                      <SelectItem value="parking">Local commercial</SelectItem>
                      <SelectItem value="parking">Local professionnel</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="cellier">Cellier</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Localisation */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Localisation
              </label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#556B2F] group-focus-within:text-[#6B8E23] transition-colors" />
                <Input
                  value={localisation}
                  onChange={(e) => handleSearch(e.target.value)}
                  onClick={() => setIsLocationModalOpen(true)}
                  placeholder="Cliquez pour choisir..."
                  className="pl-9 h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] cursor-pointer transition-colors rounded-xl"
                  readOnly
                />
              </div>
            </motion.div>

            {/* Prix max */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Prix max/mois
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Montant"
                  value={priceMax ?? ""}
                  onChange={(e) =>
                    setPriceMax(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-colors text-sm pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">€</span>
              </div>
            </motion.div>

            {/* Surface */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Surface (m²)
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  value={surfaceMin ?? ""}
                  onChange={(e) =>
                    setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-colors text-sm"
                />
                <Input
                  placeholder="Max"
                  value={surfaceMax ?? ""}
                  onChange={(e) =>
                    setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-colors text-sm"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Filtres supplémentaires */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Pièces */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Pièces
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Nombre de pièces"
                value={pieces ?? ""}
                onChange={(e) =>
                  setPieces(e.target.value ? Number(e.target.value) : undefined)
                }
                className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-colors text-sm"
              />
            </motion.div>

            {/* Chambres */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Chambres
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Nombre de chambres"
                value={chambres ?? ""}
                onChange={(e) =>
                  setChambres(e.target.value ? Number(e.target.value) : undefined)
                }
                className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-colors text-sm"
              />
            </motion.div>

            {/* Extérieur */}
            <motion.div variants={fadeInUp} className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Extérieur
              </label>
              <Select
                onValueChange={(v) => setExterieur(v || undefined)}
                value={exterieur}
              >
                <SelectTrigger 
                  className="h-10 bg-white border-2 border-[#D3D3D3] hover:border-[#556B2F] transition-colors rounded-xl focus:ring-2 focus:ring-[#556B2F]/20"
                >
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="piscine">Piscine</SelectItem>
                  <SelectItem value="jardin">Jardin</SelectItem>
                  <SelectItem value="terrasse">Terrasse</SelectItem>
                  <SelectItem value="balcon">Balcon</SelectItem>
                  <SelectItem value="garage">Garage</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Bouton de recherche */}
            <motion.div variants={fadeInUp} className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFilterChange}
                className="w-full h-10 bg-[#556B2F] text-white font-semibold rounded-xl hover:bg-[#6B8E23] hover:shadow-lg transition-all shadow-md"
              >
                Rechercher
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Résultats */}
        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="animate-pulse"
                >
                  <div className="bg-[#FFFFFF0] h-64 rounded-2xl mb-4" />
                  <div className="bg-[#D3D3D3] h-6 rounded mb-2" />
                  <div className="bg-[#D3D3D3] h-4 rounded w-1/2" />
                </motion.div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="text-[#8B4513] text-6xl mb-4"
              >
                {isSeasonal ? "🏝️" : "🏠"}
              </motion.div>
              <h3 className="text-xl font-semibold text-[#8B4513] mb-2">
                Aucune location trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {displayed.map((property: any, index: number) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;
                const featuresArr = normalizeFeatures(property.features);
                const priceLabel = formatPrice(property.price || 0);

                return (
                  <motion.div
                    key={property.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Card
                      data-property-id={property.id}
                      className="overflow-hidden border border-[#D3D3D3] hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl group cursor-pointer"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="relative">
                        {/* Image avec overlay */}
                        <div className="relative h-48 w-11/12 rounded-lg mx-3 shadow-lg my-2 overflow-hidden">
                          <motion.img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />

                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="absolute top-3 left-3 bg-[#6B8E23] rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
                          >
                            {property.type}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute bottom-3 right-3 bg-[#556B2F] rounded-lg px-3 py-2 text-xs font-semibold text-white shadow-md"
                          >
                            {priceLabel}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute top-3 right-3"
                          >
                            <div className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#8B4513] shadow-md">
                              {isSeasonal ? "SAISONNIÈRE" : "À LOUER"}
                            </div>
                          </motion.div>

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
                        </div>

                        {/* Contenu */}
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-[#8B4513] text-sm flex-1 line-clamp-2 leading-tight">
                              {property.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#556B2F]" />
                              {property.city}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            {property.surface && (
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3 w-3" />
                                <span>{property.surface} m²</span>
                              </div>
                            )}
                            {(property.bedrooms || property.rooms) && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{property.bedrooms || property.rooms} ch.</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3" />
                                <span>{property.bathrooms} sdb</span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {featuresArr.slice(0, 2).map((feature, index) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="inline-flex items-center gap-1 bg-[#6B8E23]/10 text-[#556B2F] px-2 py-1 rounded-full text-xs"
                              >
                                <div className="w-1 h-1 bg-[#556B2F] rounded-full" />
                                {feature}
                              </motion.span>
                            ))}
                          </div>

                          {/* Boutons d'action */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 bg-[#556B2F] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6B8E23] hover:shadow-lg transition-all shadow-md disabled:opacity-60"
                              onClick={(e) => handleDemanderVisite(property, e)}
                              disabled={!!sentRequests?.[property?.id]}
                            >
                              {sentRequests?.[property?.id]
                                ? "Demande envoyée"
                                : "Demander visite"}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="border-2 border-[#D3D3D3] p-2 rounded-md hover:border-[#556B2F] hover:bg-[#6B8E23]/10 transition-colors shadow-sm"
                              onClick={() => handlePropertyClick(property)}
                            >
                              <Eye className="w-4 h-4 text-[#8B4513]" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
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
        onLocationSelect={(location) => {
          setLocalisation(location.address);
          console.log("Location selected:", location);
        }}
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
    </motion.section>
  );
};

export default PropertyRent;