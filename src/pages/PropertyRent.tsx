import React, { useState, useEffect, useMemo } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
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
  const [showFilters, setShowFilters] = useState(false);

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

  // Animation variants améliorées
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      y: -6,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const cardHover = {
    hover: {
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(85, 107, 47, 0.25)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const imageHover = {
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const slideIn = {
    hidden: { 
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const scaleIn = {
    hidden: { 
      opacity: 0,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Image de fond en ligne pour le titre (hauteur réduite)
  const titleImageUrl = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

  const titleBgStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)), url('${titleImageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '50vh',
    display: 'flex',
    alignItems: 'center'
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
      rentType,
    };

    trackPropertyFilter(filters);
    if (onFilter) onFilter(filters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [typeBienLocation, priceMax, localisation, pieces, surfaceMin, surfaceMax, chambres, exterieur, extras, rentType]);

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
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="animate-pulse"
                >
                  <div className="bg-[#FFFFFF0] h-64 rounded-2xl mb-4" />
                  <div className="bg-[#D3D3D3] h-6 rounded mb-2" />
                  <div className="bg-[#D3D3D3] h-4 rounded w-1/2" />
                </motion.div>
              ))}
            </motion.div>
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
                const priceLabel = formatPrice(property.price || 0, rentType);

                return (
                  <motion.div
                    key={property.id}
                    variants={fadeInUp}
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
                      <motion.div className="relative" variants={imageHover}>
                        <div className="relative rounded-lg h-52 overflow-hidden">
                          <motion.img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="home-card-image h-full w-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />

                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="absolute bg-[#6B8E23] rounded-full py-1 px-2 text-white font-semibold text-sm top-3 left-3 home-card-badge shadow-md"
                          >
                            {property.type}
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
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
      initial="hidden"
      animate="visible"
      variants={pageTransition}
      className="relative z-30 w-full"
      // Ajout d'un margin-top pour laisser apparaître le header
      style={{ marginTop: "10px" }}
    >
      {/* Header avec image de hauteur réduite */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
        style={titleBgStyle}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto text-center pt-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Locations Immobilières
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto"
            >
              Trouvez le logement idéal pour votre séjour à La Réunion
            </motion.p>
            
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
              className="h-1 bg-white/30 mx-auto mb-2 origin-left"
              style={{ maxWidth: "180px" }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
              className="h-1 bg-white mx-auto origin-left"
              style={{ maxWidth: "80px" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        {/* Bouton filtre mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:hidden mb-4"
        >
          <Button
            variant="outline"
            className="w-full bg-white border-[#D3D3D3] hover:border-[#556B2F] hover:bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
          </Button>
        </motion.div>

        {/* Boutons de sélection du type de location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRentType("longue_duree")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${rentType === "longue_duree"
              ? "bg-[#556B2F] text-white"
              : "bg-white text-[#556B2F] border-2 border-[#D3D3D3] hover:border-[#556B2F]"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Location Longue Durée</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRentType("saisonniere")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all shadow-md ${rentType === "saisonniere"
              ? "bg-[#556B2F] text-white"
              : "bg-white text-[#556B2F] border-2 border-[#D3D3D3] hover:border-[#556B2F]"
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Location Saisonnière</span>
          </motion.button>
        </motion.div>

        {/* Filtres */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#D3D3D3] p-6 shadow-lg mb-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 flex items-center gap-3"
              >
                <div className="h-6 w-1 bg-[#556B2F] rounded-full"></div>
                <h3 className="text-sm font-bold text-[#8B4513] uppercase tracking-wider">
                  Recherche de {rentType === "longue_duree" ? "location longue durée" : "location saisonnière"}
                </h3>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4"
              >
                {/* Type de bien */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Type de bien
                  </label>
                  <Select
                    onValueChange={(v) => setTypeBienLocation(v || undefined)}
                    value={typeBienLocation}
                  >
                    <SelectTrigger 
                      className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] transition-all rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-[#8B4513]" />
                        <SelectValue placeholder="Choisir..." />
                      </div>
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
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Localisation
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#556B2F] transition-colors" />
                    <Input
                      value={localisation}
                      onChange={(e) => handleSearch(e.target.value)}
                      onClick={() => setIsLocationModalOpen(true)}
                      placeholder="Ville, code postal..."
                      className="pl-10 h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] cursor-pointer transition-all rounded-xl"
                      readOnly
                    />
                  </div>
                </motion.div>

                {/* Prix max */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {rentType === "saisonniere" ? "Prix max/semaine" : "Prix max/mois"}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Montant"
                      value={priceMax ?? ""}
                      onChange={(e) =>
                        setPriceMax(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">
                      {rentType === "saisonniere" ? "€/sem" : "€"}
                    </span>
                  </div>
                </motion.div>

                {/* Surface */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Surface (m²)
                  </label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Min"
                      value={surfaceMin ?? ""}
                      onChange={(e) =>
                        setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all"
                    />
                    <Input
                      placeholder="Max"
                      value={surfaceMax ?? ""}
                      onChange={(e) =>
                        setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)
                      }
                      className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Filtres supplémentaires */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {/* Pièces */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
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
                    className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all"
                  />
                </motion.div>

                {/* Chambres */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
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
                    className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all"
                  />
                </motion.div>

                {/* Extérieur */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Extérieur
                  </label>
                  <Select
                    onValueChange={(v) => setExterieur(v || undefined)}
                    value={exterieur}
                  >
                    <SelectTrigger 
                      className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] transition-all rounded-xl"
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
                <motion.div variants={scaleIn} className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFilterChange}
                    className="w-full h-11 bg-[#556B2F] text-white font-semibold rounded-xl hover:bg-[#6B8E23] hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Rechercher
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats */}
        <div className="mt-6">
          {loading ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="animate-pulse"
                >
                  <div className="bg-[#FFFFFF0] h-64 rounded-2xl mb-4" />
                  <div className="bg-[#D3D3D3] h-6 rounded mb-2" />
                  <div className="bg-[#D3D3D3] h-4 rounded w-1/2" />
                </motion.div>
              ))}
            </motion.div>
          ) : displayed.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-[#6B8E23]/10 rounded-full mb-6"
              >
                <Home className="w-12 h-12 text-[#8B4513]" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-semibold text-[#8B4513] mb-3"
              >
                Aucune location trouvée
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 max-w-md mx-auto"
              >
                Essayez de modifier vos critères de recherche ou contactez-nous pour une recherche personnalisée.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {displayed.map((property: any, index: number) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;
                const featuresArr = normalizeFeatures(property.features);
                const priceLabel = formatPrice(property.price || 0, rentType);

                return (
                  <motion.div
                    key={property.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Card
                      data-property-id={property.id}
                      className="overflow-hidden border border-[#D3D3D3] hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl group cursor-pointer h-full flex flex-col"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <motion.div
                        className="relative flex-1"
                        variants={cardHover}
                      >
                        {/* Image */}
                        <motion.div 
                          className="relative h-56 overflow-hidden"
                          variants={imageHover}
                        >
                          <img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Badges overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="absolute top-3 left-3"
                          >
                            <span className="bg-[#6B8E23] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              {property.type}
                            </span>
                          </motion.div>
                          
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-3 right-3"
                          >
                            <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              {rentType === "saisonniere" ? "SAISONNIÈRE" : "À LOUER"}
                            </span>
                          </motion.div>

                          {/* Navigation d'images */}
                          {totalImages > 1 && (
                            <>
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center"
                                onClick={(e) => prevImage(property.id, totalImages, e)}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.1 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center"
                                onClick={(e) => nextImage(property.id, totalImages, e)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </motion.button>
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                                {idx + 1}/{totalImages}
                              </div>
                            </>
                          )}

                          {/* Prix */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-3 right-3"
                          >
                            <span className="bg-[#556B2F] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">
                              {priceLabel}
                            </span>
                          </motion.div>
                        </motion.div>

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
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="inline-flex items-center gap-1.5 bg-[#6B8E23]/10 text-[#556B2F] px-3 py-1.5 rounded-full text-xs font-medium"
                                >
                                  <div className="w-1.5 h-1.5 bg-[#556B2F] rounded-full" />
                                  {feature}
                                </motion.span>
                              ))}
                            </div>
                          )}

                          {/* Boutons d'action */}
                          <div className="mt-auto pt-4 border-t border-[#D3D3D3]/50">
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 bg-[#556B2F] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#6B8E23] transition-all shadow-md disabled:opacity-60 text-sm"
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
                                className="border border-[#D3D3D3] p-3 rounded-lg hover:border-[#556B2F] hover:bg-[#6B8E23]/5 transition-all shadow-sm"
                                onClick={() => handlePropertyClick(property)}
                              >
                                <Eye className="w-4 h-4 text-[#8B4513]" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
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