import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Ruler,
  Eye,
  Search,
  Filter,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
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
const localBuyProperties = [
  {
    id: "1",
    localImage: property1,
    price: 350000,
    title: "Villa avec piscine",
    city: "Saint-Denis",
    surface: 180,
    type: "MAISON / VILLA",
    status: "for_sale",
    rooms: 4,
    features: "4 ch • 3 sdb • Piscine",
  },
  {
    id: "2",
    localImage: property2,
    price: 245000,
    title: "Appartement moderne",
    city: "Saint-Paul",
    surface: 95,
    type: "APPARTEMENT",
    status: "for_sale",
    rooms: 3,
    features: "3 ch • 2 sdb • Balcon",
  },
  {
    id: "3",
    localImage: property3,
    price: 285000,
    title: "Maison contemporaine",
    city: "Saint-Pierre",
    surface: 125,
    type: "MAISON",
    status: "for_sale",
    rooms: 3,
    features: "3 ch • 2 sdb • Jardin",
  },
];

// Utilitaires
const formatPrice = (price: number, _type: string, status: string) => {
  if (status === "service") return "Estimation gratuite";
  if (status === "for_rent") return `${price.toLocaleString("fr-FR")} €/mois`;
  return `${price.toLocaleString("fr-FR")} €`;
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

// Fonction pour calculer la distance entre deux points (formule de Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

interface PropertyBuyProps {
  cardsOnly?: boolean;
  maxItems?: number;
  onPropertyView?: (property: any) => void;
  onPropertyClick?: (property: any) => void;
  onPropertyContact?: (property: any) => void;
  onSearch?: (query: string, resultsCount?: number) => void;
  onFilter?: (filters: any) => void;
}

const PropertyBuy: React.FC<PropertyBuyProps> = ({
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

  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [typeBienAchat, setTypeBienAchat] = useState<string | undefined>(undefined);
  const [localisation, setLocalisation] = useState("");
  const [rayon, setRayon] = useState<number | undefined>(undefined);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const [buyProperties, setBuyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demandesLoading, setDemandesLoading] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { user, isAuthenticated } = useAuth();

  // Animation variants
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

  // Image de fond en ligne pour le titre
  const titleImageUrl = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

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
            const property = buyProperties.find((p) => p.id === propertyId);

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

    buyProperties.forEach((property) => {
      const element = document.querySelector(`[data-property-id="${property.id}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [buyProperties, trackPropertyView, onPropertyView]);

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

      const forSale = properties
        .filter((p: any) => p.status === "for_sale" && p.isActive)
        .slice(0, 8)
        .map((p: any, i: number) => ({
          ...p,
          localImage: [property1, property2, property3][i % 3],
        }));

      setBuyProperties(forSale);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Impossible de charger les propriétés. Affichage des exemples.");
      setBuyProperties(localBuyProperties as any[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Initialize image indexes
  useEffect(() => {
    const indexes: Record<string, number> = {};
    buyProperties.forEach((p: any) => {
      indexes[p.id] = indexes[p.id] ?? 0;
    });
    setCurrentImageIndexes((prev) => ({ ...indexes, ...prev }));
  }, [buyProperties]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && property.images.length > 0) return property.images as string[];
    if (property.localImage) return [property.localImage as string];
    return [property1];
  };

  // Handlers
  const handlePropertyClick = (property: any) => {
    trackPropertyClick(property.id, property.title, property.price);
    if (onPropertyClick) onPropertyClick(property);
    navigate(`/achat/${property.id}`);
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
      type: typeBienAchat,
      priceMin,
      priceMax,
      location: localisation,
      rayon,
    };

    trackPropertyFilter(filters);
    if (onFilter) onFilter(filters);
  };

  useEffect(() => {
    handleFilterChange();
  }, [typeBienAchat, priceMin, priceMax, localisation, rayon]);

  const displayed = useMemo(() => {
    return buyProperties.filter((p) => {
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

      // Rayon filter (si des coordonnées sont sélectionnées)
      if (rayon && selectedCoordinates && p.latitude && p.longitude) {
        const distance = calculateDistance(
          selectedCoordinates.lat,
          selectedCoordinates.lng,
          p.latitude,
          p.longitude
        );
        if (distance > rayon) return false;
      }

      // Price filter
      if (priceMin !== undefined && (p.price === undefined || p.price < priceMin)) return false;
      if (priceMax !== undefined && (p.price === undefined || p.price > priceMax)) return false;

      // Type filter
      if (typeBienAchat) {
        if (!String(p.type || "").toLowerCase().includes(String(typeBienAchat).toLowerCase())) return false;
      }

      return true;
    });
  }, [buyProperties, localisation, typeBienAchat, priceMin, priceMax, rayon, selectedCoordinates]);

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

  const handleLocationSelect = (location: any) => {
    setLocalisation(location.address);
    if (location.latitude && location.longitude) {
      setSelectedCoordinates({
        lat: location.latitude,
        lng: location.longitude
      });
    }
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
                const priceLabel = formatPrice(property.price || 0, property.type, property.status);

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
                            className="absolute bg-[#6B8E23] rounded-full py-1 px-2 text-white font-semibold text-sm top-3 left-3 home-card-badge"
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
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                                onClick={(e) => prevImage(property.id, totalImages, e)}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
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
              Propriétés à Vendre
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto"
            >
              Découvrez notre sélection exclusive de biens immobiliers à La Réunion
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
                  Rechercher votre bien
                </h3>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {/* Type de bien */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Type de bien
                  </label>
                  <Select
                    onValueChange={(v) => setTypeBienAchat(v || undefined)}
                    value={typeBienAchat}
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
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="commercial">Local commercial</SelectItem>
                      <SelectItem value="professionnel">Local professionnel</SelectItem>
                      <SelectItem value="fonds_de_commerce">Fonds de commerce</SelectItem>
                      <SelectItem value="villas_neuves">Villas neuves (VEFA)</SelectItem>
                      <SelectItem value="appartements_neufs">Appartement neufs (VEFA)</SelectItem>
                      <SelectItem value="scpi">SCPI</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
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

                {/* Rayon */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Rayon (km)
                  </label>
                  <div className="relative group">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#556B2F] transition-colors" />
                    <Select
                      onValueChange={(v) => setRayon(v ? parseInt(v) : undefined)}
                      value={rayon?.toString()}
                    >
                      <SelectTrigger 
                        className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] transition-all rounded-xl pl-10"
                      >
                        <SelectValue placeholder="Rayon..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                        <SelectItem value="30">30 km</SelectItem>
                        <SelectItem value="50">50 km</SelectItem>
                        <SelectItem value="100">100 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Prix */}
                <motion.div variants={slideIn} className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    Budget (€)
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Min"
                        value={priceMin ?? ""}
                        onChange={(e) =>
                          setPriceMin(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        placeholder="Max"
                        value={priceMax ?? ""}
                        onChange={(e) =>
                          setPriceMax(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="h-11 bg-white border border-[#D3D3D3] hover:border-[#556B2F] rounded-xl transition-all pl-8"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Indicateur de rayon sélectionné et bouton de recherche */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4"
              >
                {rayon && selectedCoordinates && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-[#6B8E23]/10 text-[#556B2F] px-4 py-3 rounded-xl"
                  >
                    <Navigation className="w-5 h-5" />
                    <div>
                      <p className="text-sm font-medium">
                        Rayon: {rayon} km autour de {localisation.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-600">
                        Coordonnées: {selectedCoordinates.lat.toFixed(4)}, {selectedCoordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </motion.div>
                )}

                <motion.div variants={scaleIn} className="w-full md:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFilterChange}
                    className="w-full md:w-48 h-11 bg-[#556B2F] text-white font-semibold rounded-xl hover:bg-[#6B8E23] hover:shadow-lg transition-all shadow-md flex items-center justify-center gap-2"
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
                Aucune propriété trouvée
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
                const priceLabel = formatPrice(property.price || 0, property.type, property.status);

                // Calcul de la distance si applicable
                let distanceInfo = null;
                if (selectedCoordinates && property.latitude && property.longitude) {
                  const distance = calculateDistance(
                    selectedCoordinates.lat,
                    selectedCoordinates.lng,
                    property.latitude,
                    property.longitude
                  );
                  distanceInfo = (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 text-xs font-medium text-white bg-black/60 px-2 py-1 rounded-full"
                    >
                      <Navigation className="w-3 h-3" />
                      {distance.toFixed(1)} km
                    </motion.div>
                  );
                }

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
                            className="absolute top-3 right-3 flex flex-col items-end gap-1"
                          >
                            <span className="bg-[#8B4513] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                              À VENDRE
                            </span>
                            {distanceInfo}
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
        onLocationSelect={handleLocationSelect}
        properties={buyProperties.map((p) => ({
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

export default PropertyBuy;