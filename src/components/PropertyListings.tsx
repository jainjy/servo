import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  UserPlus,
  LogIn,
  Sparkles,
  SparklesIcon,
  Home,
  Sparkle,
  MapPin,
  ArrowRight,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Ruler,
  Eye,
  X,
  CheckCircle,
  User,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import rentProperties1 from "@/assets/propertyLouer-1.jpg";
import rentProperties2 from "@/assets/propertyLouer-2.jpg";
import rentProperties3 from "@/assets/propertyLouer-3.jpeg";
import sellServices1 from "@/assets/propertyVendre-1.jpg";
import sellServices2 from "@/assets/propertyVendre-2.jpeg";
import sellServices3 from "@/assets/propertyVendre-3.jpeg";
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
import { motion } from "framer-motion";
import LocationPickerModal from "@/components/carte";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useImmobilierTracking } from "@/hooks/useImmobilierTracking";
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";

// Thème de couleurs
const colors = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg": "#FFFFFF" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
  // Couleurs complémentaires ajoutées
  "accent-light": "#98FB98" /* accent clair - Pale green */,
  "accent-warm": "#DEB887" /* accent chaud - Burlywood */,
  "neutral-dark": "#2F4F4F" /* texte foncé / titres - Dark slate gray */,
  "hover-primary": "#7BA05B" /* état hover primary - Medium olive green */,
  "hover-secondary": "#A0522D" /* état hover secondary - Sienna */,
  "neutral-light": "#F5F5F5" /* fonds légers - Light gray */,
  success: "#556B2F" /* succès - Olive green */,
  warning: "#8B4513" /* avertissement - Saddle brown */,
  info: "#6B8E23" /* info - Primary dark */,
  danger: "#8B4513" /* danger - Saddle brown */,
  "card-bg": "#FFFFFF" /* fond des cartes */,
};

// Données locales de fallback
const localBuyProperties = [];
const localRentProperties = [];
const localSellServices = [];

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

const formatFeaturesText = (property: any) => {
  if (property.status === "service") {
    const localService = localSellServices.find((p) => p.id === property.id);
    return localService?.features || "Service professionnel";
  }
  const feats: string[] = [];
  if (property.bedrooms) feats.push(`${property.bedrooms} ch`);
  if (property.bathrooms) feats.push(`${property.bathrooms} sdb`);
  const arr = normalizeFeatures(property.features);
  if (arr.length) feats.push(...arr.slice(0, 2));
  return feats.join(" • ") || "Caractéristiques disponibles";
};

// Fonction pour normaliser les adresses (supprime accents et caractères spéciaux)
const normalizeAddress = (address: string) => {
  if (!address) return "";
  return address
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s]/g, "") // Garde seulement lettres, chiffres et espaces
    .replace(/\s+/g, " ") // Réduit les espaces multiples
    .trim();
};

// Fonction pour détecter si une propriété est hors de La Réunion
const isHorsDuPays = (property: any) => {
  if (!property) return false;

  const reunionCities = [
    "saint-denis",
    "saint-paul",
    "saint-pierre",
    "saint-gilles-les-bains",
    "saint-leu",
    "saint-benoit",
    "saint-andre",
    "saint-joseph",
    "saint-louis",
    "saint-philippe",
    "saint-marie",
    "saint-rose",
    "le tampon",
    "la possession",
    "le port",
    "les avirons",
    "entre-deux",
    "etang-sale",
    "petite-ile",
    "plaine-des-palmistes",
    "plaine-des-cafres",
    "salazie",
    "cilaos",
    "trois-bassins",
    "bras-panon",
    "la plaine-des-palmistes",
    "sainte-marie",
    "sainte-suzanne",
    "sainte-rose",
  ];

  const city = normalizeAddress(property.city || "");
  const address = normalizeAddress(property.address || "");

  // Si la ville n'est pas dans la liste des villes de La Réunion, c'est "hors du pays"
  return !reunionCities.some(
    (reunionCity) =>
      city.includes(normalizeAddress(reunionCity)) ||
      address.includes(normalizeAddress(reunionCity))
  );
};

interface PropertyListingsProps {
  cardsOnly?: boolean;
  initialTab?: "tous" | "achat" | "location" | "saisonniere" | "hors_pays";
  maxItems?: number;
  onPropertyView?: (property: any) => void;
  onPropertyClick?: (property: any) => void;
  onPropertyContact?: (property: any) => void;
  onSearch?: (query: string, resultsCount?: number) => void;
  onFilter?: (filters: any) => void;
}

const PropertyListings: React.FC<PropertyListingsProps> = ({
  cardsOnly = false,
  initialTab,
  maxItems,
  onPropertyView,
  onPropertyClick,
  onPropertyContact,
  onSearch,
  onFilter,
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  //Fonction pour calculer la distance (Haversine)
  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Initialisation du tracking
  const {
    trackPropertyView,
    trackPropertyClick,
    trackPropertyFilter,
    trackPropertyContact,
    trackPropertySearch,
  } = useImmobilierTracking();

  const [showCard, setShowCard] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "achat" | "location" | "saisonniere" | "tous" | "hors_pays"
  >(initialTab ?? "tous");
  const [radiusKm, setRadiusKm] = useState(5);
  // AJOUT: État pour activer/désactiver le filtre par rayon
  const [radiusFilterEnabled, setRadiusFilterEnabled] = useState(false);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>(undefined);
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>(undefined);
  const [pieces, setPieces] = useState<number | undefined>(undefined);
  const [chambres, setChambres] = useState<number | undefined>(undefined);
  const [exterieur, setExterieur] = useState<string | undefined>(undefined);
  const [extras, setExtras] = useState<string | undefined>(undefined);
  const [typeBienAchat, setTypeBienAchat] = useState<string | undefined>(
    undefined
  );
  const [typeBienLocation, setTypeBienLocation] = useState<string | undefined>(
    undefined
  );
  const [typeBienSaison, setTypeBienSaison] = useState<string | undefined>(
    undefined
  );
  const [localisation, setLocalisation] = useState("");
  // const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // CHOIX 1: Utiliser la position par défaut de La Réunion
  const [userLocation, setUserLocation] = useState({
    lat: -20.882057,
    lon: 55.450675,
  });

  // AJOUT: État pour la modale de carte
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [buyProperties, setBuyProperties] = useState<any[]>([]);
  const [rentProperties, setRentProperties] = useState<any[]>([]);
  const [seasonalProperties, setSeasonalProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState({ buy: true, rent: true });
  const [error, setError] = useState<string | null>(null);

  // Loading state for user's demandes
  const [demandesLoading, setDemandesLoading] = useState(false);

  // Carousel/favorite state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState<
    Record<string, number>
  >({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Auth (to load user's demandes and mark sent requests)
  const { user, isAuthenticated } = useAuth();

  // Fonction pour vérifier l'affichage des flèches de défilement
  const checkScrollArrows = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Effet pour surveiller le défilement
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollArrows);
      // Vérification initiale après un court délai
      setTimeout(checkScrollArrows, 100);
      
      return () => container.removeEventListener('scroll', checkScrollArrows);
    }
  }, [checkScrollArrows]);

  // Fonctions de défilement
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Intersection Observer pour le tracking des vues
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const propertyId = entry.target.getAttribute("data-property-id");
            const property = [
              ...buyProperties,
              ...rentProperties,
              ...seasonalProperties,
            ].find((p) => p.id === propertyId);

            if (property) {
              // Track avec useImmobilierTracking
              trackPropertyView(property.id, property.type, property.price);

              // Callback parent si fourni
              if (onPropertyView) {
                onPropertyView(property);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    // Observer chaque propriété
    [...buyProperties, ...rentProperties, ...seasonalProperties].forEach(
      (property) => {
        const element = document.querySelector(
          `[data-property-id="${property.id}"]`
        );
        if (element) {
          observer.observe(element);
        }
      }
    );

    return () => observer.disconnect();
  }, [
    buyProperties,
    rentProperties,
    seasonalProperties,
    trackPropertyView,
    onPropertyView,
  ]);

  // Load user's demandes to persist "demande déjà envoyée" state
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

  // FILTRE PAR RAYON - SEULEMENT SI VOUS UTILISEZ userLocation = null
  useEffect(() => {
    // Si userLocation est null (version décommentée), alors on essaie d'obtenir la géolocalisation
    // Si userLocation a une valeur par défaut, on ne fait rien ici
    if (!userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
        },
        (err) => {
          console.warn("Permission localisation refusée", err);
          // Si la géolocalisation échoue, on utilise la position par défaut de La Réunion
          setUserLocation({
            lat: -20.882057,
            lon: 55.450675,
          });
        }
      );
    }
  }, [userLocation]);

  // Fonction pour gérer le changement de valeur via l'input
  const handleRadiusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setRadiusKm(0);
      return;
    }

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 30) {
      setRadiusKm(numValue);
    }
  };

  // Fonction pour gérer le blur de l'input (correction automatique)
  const handleRadiusInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setRadiusKm(0);
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setRadiusKm(0);
    } else if (numValue < 0) {
      setRadiusKm(0);
    } else if (numValue > 30) {
      setRadiusKm(30);
    } else {
      setRadiusKm(numValue);
    }
  };

  // Fetch properties from API
  const fetchProperties = async () => {
    try {
      setError(null);
      const response = await api.get("/properties");
      if (!response.data)
        throw new Error("Erreur lors de la récupération des propriétés");
      const properties = response.data.map((p) => ({
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

      // Filtrer les propriétés saisonnières en utilisant le champ rentType
      const forRent = properties
        .filter(
          (p: any) =>
            p.status === "for_rent" &&
            p.isActive &&
            p.rentType === "longue_duree"
        )
        .slice(0, 8)
        .map((p: any, i: number) => ({
          ...p,
          localImage: [rentProperties1, rentProperties2, rentProperties3][
            i % 3
          ],
        }));

      const seasonal = properties
        .filter(
          (p: any) =>
            p.status === "for_rent" &&
            p.isActive &&
            p.rentType === "saisonniere"
        )
        .slice(0, 8)
        .map((p: any, i: number) => ({
          ...p,
          localImage: [rentProperties1, rentProperties2, rentProperties3][
            i % 3
          ],
        }));

      setBuyProperties(forSale);
      setRentProperties(forRent);
      // Stockez directement les propriétés saisonnières au lieu d'utiliser useMemo
      setSeasonalProperties(seasonal);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Impossible de charger les propriétés. Affichage des exemples.");
      setBuyProperties(localBuyProperties as any[]);
      setRentProperties(localRentProperties as any[]);
      setSeasonalProperties(
        localRentProperties.filter((p) =>
          p.features.toLowerCase().includes("courte")
        ) as any[]
      );
    } finally {
      setLoading({ buy: false, rent: false });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Initialiser les index d'images pour chaque jeu de données
  useEffect(() => {
    const indexes: Record<string, number> = {};
    [...buyProperties, ...rentProperties, ...seasonalProperties].forEach(
      (p: any) => {
        indexes[p.id] = indexes[p.id] ?? 0;
      }
    );
    setCurrentImageIndexes((prev) => ({ ...indexes, ...prev }));
  }, [buyProperties, rentProperties, seasonalProperties]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && property.images.length > 0)
      return property.images as string[];
    if (property.localImage) return [property.localImage as string];
    return [property1];
  };

  // Handlers pour le tracking
  const handlePropertyClick = (property: any) => {
    // Track avec useImmobilierTracking
    trackPropertyClick(property.id, property.title, property.price);

    // Callback parent si fourni
    if (onPropertyClick) {
      onPropertyClick(property);
    }

    // Navigation
    navigate(`/immobilier/${property.id}`);
  };

  const handlePropertyContact = (property: any) => {
    // Track avec useImmobilierTracking
    trackPropertyContact(property.id, property.title);

    // Callback parent si fourni
    if (onPropertyContact) {
      onPropertyContact(property);
    }
  };

  const handleSearch = (query: string) => {
    setLocalisation(query);

    // Track avec useImmobilierTracking
    const resultsCount = displayed.length;
    trackPropertySearch(query, resultsCount);

    // Callback parent si fourni
    if (onSearch) {
      onSearch(query, resultsCount);
    }
  };

  const handleFilterChange = () => {
    const filters = {
      type:
        activeTab === "achat"
          ? typeBienAchat
          : activeTab === "location"
          ? typeBienLocation
          : activeTab === "saisonniere"
          ? typeBienSaison
          : undefined,
      priceMin,
      priceMax,
      location: localisation,
      rooms: pieces,
      radiusKm: radiusFilterEnabled ? radiusKm : undefined, // AJOUT: Inclure radiusKm seulement si activé
      surfaceMin,
      surfaceMax,
      chambres,
      exterieur,
      extras,
    };

    // Track avec useImmobilierTracking
    trackPropertyFilter(filters);

    // Callback parent si fourni
    if (onFilter) {
      onFilter(filters);
    }
  };

  // Appeler handleFilterChange quand les filtres changent
  useEffect(() => {
    handleFilterChange();
  }, [
    activeTab,
    typeBienAchat,
    typeBienLocation,
    typeBienSaison,
    priceMin,
    priceMax,
    localisation,
    pieces,
    radiusKm,
    radiusFilterEnabled,
    surfaceMin,
    surfaceMax,
    chambres,
    exterieur,
    extras,
  ]);

  const displayed = useMemo(() => {
    const hasFeature = (p: any, token: string) => {
      if (!token) return true;
      const feats = Array.isArray(p.features)
        ? p.features.join(" ").toLowerCase()
        : String(p.features || "").toLowerCase();
      const more = `${String(p.type || "").toLowerCase()} ${String(
        p.title || ""
      ).toLowerCase()} ${String(p.description || "").toLowerCase()}`;
      return (
        feats.includes(token.toLowerCase()) ||
        more.includes(token.toLowerCase())
      );
    };

    const applyFilters = (arr: any[]) =>
      arr.filter((p) => {
        if (!p) return false;

        // FILTRE HORS DU PAYS
        if (activeTab === "hors_pays") {
          if (!isHorsDuPays(p)) return false;
        } else {
          // FILTRE LOCALISATION NORMAL (uniquement pour les autres onglets)
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
        }

        // Filtres prix
        if (
          priceMin !== undefined &&
          (p.price === undefined || p.price < priceMin)
        )
          return false;
        if (
          priceMax !== undefined &&
          (p.price === undefined || p.price > priceMax)
        )
          return false;

        // Filtres surface
        if (
          surfaceMin !== undefined &&
          (p.surface === undefined || p.surface < surfaceMin)
        )
          return false;
        if (
          surfaceMax !== undefined &&
          (p.surface === undefined || p.surface > surfaceMax)
        )
          return false;

        // Filtres pièces et chambres
        if (pieces !== undefined) {
          const pcs = p.rooms ?? p.pieces ?? p.bedrooms ?? 0;
          if (pcs < pieces) return false;
        }
        if (chambres !== undefined) {
          const ch = p.bedrooms ?? p.rooms ?? 0;
          if (ch < chambres) return false;
        }

        // Filtres équipements
        if (exterieur !== undefined && exterieur !== "") {
          if (!hasFeature(p, exterieur)) return false;
        }
        if (extras !== undefined && extras !== "") {
          if (!hasFeature(p, extras)) return false;
        }

        // AJOUT: FILTRE PAR RAYON SI ACTIVÉ
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

        return true;
      });

    let base: any[] = [];
    if (activeTab === "achat") base = buyProperties;
    else if (activeTab === "location") base = rentProperties;
    else if (activeTab === "saisonniere") base = seasonalProperties;
    else if (activeTab === "hors_pays") {
      // Pour "hors du pays", on prend toutes les propriétés et on filtre
      const all = [...buyProperties, ...rentProperties, ...seasonalProperties];
      const map = new Map<string, any>();
      all.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      base = Array.from(map.values());
    } else {
      const all = [...buyProperties, ...rentProperties, ...seasonalProperties];
      const map = new Map<string, any>();
      all.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      base = Array.from(map.values());
    }

    if (activeTab === "achat" && typeBienAchat) {
      base = base.filter((p) =>
        String(p.type || "")
          .toLowerCase()
          .includes(String(typeBienAchat).toLowerCase())
      );
    } else if (activeTab === "location" && typeBienLocation) {
      base = base.filter((p) =>
        String(p.type || "")
          .toLowerCase()
          .includes(String(typeBienLocation).toLowerCase())
      );
    } else if (activeTab === "saisonniere" && typeBienSaison) {
      base = base.filter((p) =>
        String(p.type || "")
          .toLowerCase()
          .includes(String(typeBienSaison).toLowerCase())
      );
    }

    // NOTE: Le filtre par rayon a été déplacé dans applyFilters pour ne s'appliquer que si activé
    return applyFilters(base);
  }, [
    activeTab,
    buyProperties,
    rentProperties,
    seasonalProperties,
    localisation,
    typeBienAchat,
    typeBienLocation,
    typeBienSaison,
    priceMin,
    priceMax,
    surfaceMin,
    surfaceMax,
    pieces,
    chambres,
    exterieur,
    extras,
    radiusKm,
    radiusFilterEnabled, // AJOUT: Dépendance pour le filtre par rayon
    userLocation,
  ]);

  const ctaMoreRoute = activeTab === "achat" ? "/acheter" : "/louer";

  const toggleFavorite = (id: string, e?: any) => {
    e?.stopPropagation?.();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

    // Track contact action
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

// Mode cartes seules (utilisé sur la Home) - DESIGN AMÉLIORÉ
  if (cardsOnly) {
    return (
    <section className="w-full py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* En-tête avec titre et chevrons */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-serif font-medium text-gray-900 mb-2">
                Biens immobiliers
              </h2>
              <p className="text-gray-500 text-sm lg:text-base">
                Découvrez notre sélection de propriétés d'exception
              </p>
            </div>
            
            {/* Boutons de navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={scrollLeft}
                className={`p-3 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200 ${
                  showLeftArrow ? 'opacity-100 hover:bg-[#556B2F] hover:text-white hover:border-[#556B2F]' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!showLeftArrow}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className={`p-3 rounded-full bg-white shadow-md hover:shadow-lg border border-gray-100 transition-all duration-200 ${
                  showRightArrow ? 'opacity-100 hover:bg-[#556B2F] hover:text-white hover:border-[#556B2F]' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!showRightArrow}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {loading.buy && loading.rent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
                  <div className="bg-gray-200 h-5 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Carousel avec défilement horizontal */}
              <div className="relative">
                {/* Conteneur défilant sans barre de scroll */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto scroll-smooth hide-scrollbar"
                  onScroll={checkScrollArrows}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className="flex gap-6 pb-6">
                    {/* Cartes des propriétés - DESIGN AMÉLIORÉ */}
                    {(maxItems ? displayed.slice(0, maxItems) : displayed).map(
                      (property: any) => {
                        const images = getPropertyImages(property);
                        const totalImages = images.length;
                        const idx = currentImageIndexes[property.id] || 0;

                        return (
                          <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{ y: -8 }}
                            className="flex-shrink-0 w-[340px] sm:w-[360px] md:w-[400px]"
                          >
                            <Card
                              data-property-id={property.id}
                              className="group overflow-hidden border-0 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-full relative"
                              onClick={() => handlePropertyClick(property)}
                            >
                              {/* Badge "Nouveau" ou "Exclusif" (optionnel) */}
                              <div className="absolute top-4 left-4 z-10">
                                <span className="bg-[#556B2F] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                                  Exclusif
                                </span>
                              </div>

                              {/* Bouton favoris */}
                              <button
                                onClick={(e) => toggleFavorite(property.id, e)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-200"
                              >
                                <Heart 
                                  className={`w-5 h-5 transition-colors ${
                                    favorites[property.id] 
                                      ? 'fill-red-500 text-red-500' 
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>

                              {/* Image avec overlay gradient */}
                              <div className="relative h-56 w-full overflow-hidden">
                                <img
                                  src={images[idx % totalImages]}
                                  alt={property.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Overlay gradient pour meilleure lisibilité des badges */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                                
                                {/* Navigation images si plusieurs */}
                                {totalImages > 1 && (
                                  <>
                                    <button
                                      className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage(property.id, totalImages, e);
                                      }}
                                    >
                                      <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                      className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage(property.id, totalImages, e);
                                      }}
                                    >
                                      <ChevronRight className="h-5 w-5" />
                                    </button>

                                    {/* Indicateur de nombre d'images */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                      {idx + 1}/{totalImages}
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* Contenu de la carte */}
                              <div className="p-5">
                                {/* En-tête avec type et localisation */}
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                                      {property.title || `${property.type} à ${property.city}`}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <MapPin className="w-4 h-4" />
                                      <span className="line-clamp-1">{property.city}, {property.address?.split(',')[0]}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Caractéristiques */}
                                <div className="flex items-center gap-4 mb-4">
                                  {property.bedrooms && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                      <Bed className="w-4 h-4" />
                                      <span>{property.bedrooms} ch</span>
                                    </div>
                                  )}
                                  {property.bathrooms && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                      <Bath className="w-4 h-4" />
                                      <span>{property.bathrooms} sdb</span>
                                    </div>
                                  )}
                                  {property.surface && (
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                      <Ruler className="w-4 h-4" />
                                      <span>{property.surface} m²</span>
                                    </div>
                                  )}
                                </div>

                                {/* Prix et note */}
                                <div className="flex items-end justify-between border-t border-gray-100 pt-4">
                                  <div>
                                    <p className="text-xs text-gray-500 mb-1">Prix total</p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-bold text-gray-900">
                                        {property.price?.toLocaleString('fr-FR')}
                                      </span>
                                      <span className="text-sm font-medium text-gray-600">€</span>
                                    </div>
                                    {property.status === 'for_rent' && (
                                      <p className="text-xs text-gray-500">par mois</p>
                                    )}
                                  </div>
                                  
                                  {/* Note avec étoiles */}
                                  <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-1 mb-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${
                                            star <= Math.round(property.note || 4.85)
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {property.note || "4,85"} · {property.reviewsCount || 128} avis
                                    </span>
                                  </div>
                                </div>

                                {/* Type d'hôte */}
                                <div className="mt-3 flex items-center">
                                  <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                                    property.rentType === "professionnel" || property.status === "professionnel"
                                      ? 'bg-[#556B2F]/10 text-[#556B2F]'
                                      : 'bg-[#8B4513]/10 text-[#8B4513]'
                                  }`}>
                                    Hôte {property.rentType === "professionnel" || property.status === "professionnel" 
                                      ? "professionnel" 
                                      : "particulier"}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        );
                      }
                    )}

                    {/* Card "Voir plus" améliorée */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ y: -8 }}
                      className="flex-shrink-0 w-[340px] sm:w-[360px] md:w-[400px]"
                    >
                      <Card
                        className="group overflow-hidden border-2 border-dashed border-[#556B2F]/30 hover:border-solid hover:border-[#556B2F] transition-all duration-300 rounded-2xl cursor-pointer bg-gradient-to-br from-[#556B2F]/5 via-white to-[#8B4513]/5 h-full flex flex-col items-center justify-center p-8"
                        onClick={() => navigate("/immobilier")}
                      >
                        <div className="grid grid-cols-2 gap-2 mb-6 w-full">
                          <img src={property1} className="w-full h-24 object-cover rounded-l-xl shadow-md" alt="" />
                          <img src={property2} className="w-full h-24 object-cover rounded-r-xl shadow-md" alt="" />
                          <img src={property3} className="w-full h-24 object-cover rounded-bl-xl shadow-md" alt="" />
                          <img src={rentProperties1} className="w-full h-24 object-cover rounded-br-xl shadow-md" alt="" />
                        </div>
                        
                        <div className="text-center">
                          <h3 className="font-bold text-[#556B2F] text-2xl mb-3">Voir plus</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            Découvrez tous nos biens immobiliers d'exception
                          </p>
                          <div className="inline-flex items-center gap-2 text-[#556B2F] font-medium group-hover:gap-3 transition-all">
                            <span>Explorer</span>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* MODAL */}
        <ModalDemandeVisite
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={selectedProperty}
          isAlreadySent={
            selectedProperty ? !!sentRequests?.[selectedProperty.id] : false
          }
          onSuccess={(id: string) =>
            setSentRequests((prev) => ({ ...prev, [id]: true }))
          }
          onPropertyContact={handlePropertyContact}
        />

        {/* Style pour cacher la barre de scroll */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      className="bg-white rounded-lg z-50 mt-44 w-full"
      style={{ backgroundColor: colors["light-bg"] }}
    >
      <div className=" container mx-auto px-4 py-6">
        {/* Barre d'onglets + CTA */}
        <div
          className=" lg:sticky top-16 z-30 flex flex-col lg:flex-row gap-4 items-center justify-between rounded-2xl border p-4"
          style={{
            backgroundColor: colors["light-bg"],
            borderColor: colors["separator"],
          }}
        >
          <div className="grid grid-cols-2 lg:flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === "tous" ? "default" : "outline"}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${
                activeTab === "tous"
                  ? "bg-slate-900 text-primary-foreground hover:bg-transparent"
                  : "border-2"
              }`}
              style={
                activeTab === "tous"
                  ? {
                      backgroundColor: colors["primary-dark"],
                      color: colors["light-bg"],
                    }
                  : {
                      borderColor: colors["separator"],
                      color: colors["neutral-dark"],
                    }
              }
              onClick={() => setActiveTab("tous")}
            >
              TOUS
            </Button>

            <Button
              variant={activeTab === "achat" ? "default" : "outline"}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${
                activeTab === "achat"
                  ? "bg-slate-900 text-primary-foreground hover:bg-transparent"
                  : "border-2"
              }`}
              style={
                activeTab === "achat"
                  ? {
                      backgroundColor: colors["primary-dark"],
                      color: colors["light-bg"],
                    }
                  : {
                      borderColor: colors["separator"],
                      color: colors["neutral-dark"],
                    }
              }
              onClick={() => setActiveTab("achat")}
            >
              ACHAT
            </Button>
            <Button
              variant={activeTab === "location" ? "default" : "outline"}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${
                activeTab === "location"
                  ? "bg-slate-900 text-primary-foreground hover:bg-transparent"
                  : "border-2"
              }`}
              style={
                activeTab === "location"
                  ? {
                      backgroundColor: colors["primary-dark"],
                      color: colors["light-bg"],
                    }
                  : {
                      borderColor: colors["separator"],
                      color: colors["neutral-dark"],
                    }
              }
              onClick={() => setActiveTab("location")}
            >
              LOCATION LONGUE DURÉE
            </Button>
            <Button
              variant={activeTab === "saisonniere" ? "default" : "outline"}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${
                activeTab === "saisonniere"
                  ? "bg-slate-900 text-primary-foreground hover:bg-transparent"
                  : "border-2"
              }`}
              style={
                activeTab === "saisonniere"
                  ? {
                      backgroundColor: colors["primary-dark"],
                      color: colors["light-bg"],
                    }
                  : {
                      borderColor: colors["separator"],
                      color: colors["neutral-dark"],
                    }
              }
              onClick={() => setActiveTab("saisonniere")}
            >
              LOCATION SAISONNIÈRE
            </Button>
            {/* NOUVEL ONGLET HORS DU PAYS */}
            <Button
              variant={activeTab === "hors_pays" ? "default" : "outline"}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${
                activeTab === "hors_pays"
                  ? "bg-slate-900 text-primary-foreground hover:bg-transparent"
                  : "border-2"
              }`}
              style={
                activeTab === "hors_pays"
                  ? {
                      backgroundColor: colors["primary-dark"],
                      color: colors["light-bg"],
                    }
                  : {
                      borderColor: colors["separator"],
                      color: colors["neutral-dark"],
                    }
              }
              onClick={() => setActiveTab("hors_pays")}
            >
              HORS DU PAYS
            </Button>
          </div>
          <div>
            <div className="relative z-10">
              <AnimatePresence>
                {showCard && (
                  <motion.div
                    className="fixed inset-0 flex z-50 items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ y: 50, opacity: 0, scale: 0.9 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 50, opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="relative rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden border"
                      style={{
                        backgroundColor: colors["neutral-dark"],
                        borderColor: colors["separator"],
                      }}
                    >
                      {/* Bouton fermeture */}
                      <button
                        onClick={() => setShowCard(false)}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full transition-all duration-300 group shadow-lg"
                        style={{ backgroundColor: colors["secondary-text"] }}
                      >
                        <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                      </button>

                      {/* Header avec Lottie */}
                      <div
                        className="relative h-48 overflow-hidden flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${colors["primary-dark"]}50, ${colors["secondary-text"]}50)`,
                        }}
                      >
                        {/* Animation Lottie - Remplacez par votre composant Lottie */}
                        <div className="w-32 h-32 flex items-center justify-center">
                          {/* Exemple avec une div animée en attendant Lottie */}
                          <div
                            className="w-24 h-24 bg-transparent border-2 border-white ring-2 ring-white outline-dotted rounded-full animate-pulse flex items-center justify-center"
                            style={{
                              borderColor: colors["light-bg"],
                              outlineColor: colors["accent-light"],
                            }}
                          >
                            <Home
                              className="w-12 h-12"
                              style={{ color: colors["light-bg"] }}
                            />
                          </div>
                        </div>

                        {/* Overlay gradient */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${colors["neutral-dark"]}, ${colors["neutral-dark"]}70, transparent)`,
                          }}
                        ></div>
                      </div>

                      {/* Contenu */}
                      <div className="p-8">
                        {/* Message */}
                        <div className="flex items-start gap-4 mb-8">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-3 h-12 rounded-full shadow-lg"
                              style={{
                                background: `linear-gradient(to bottom, ${colors["primary-dark"]}, ${colors["secondary-text"]})`,
                                boxShadow: `0 0 10px ${colors["primary-dark"]}30`,
                              }}
                            />
                            <div
                              className="w-1 h-8 rounded-full mt-2"
                              style={{
                                background: `linear-gradient(to bottom, ${colors["secondary-text"]}80, transparent)`,
                              }}
                            ></div>
                          </div>
                          <div>
                            <h3
                              className="text-xl font-bold mb-2"
                              style={{ color: colors["light-bg"] }}
                            >
                              Publiez votre bien
                            </h3>
                            <p
                              className="text-sm leading-relaxed"
                              style={{ color: colors["light-bg"] }}
                            >
                              Merci de vous connecter à votre compte afin de
                              publier une annonce de location ou de vente de
                              votre bien.
                            </p>
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="grid lg:grid-cols-2 gap-4 mb-6">
                          {/* Bouton Créer un compte */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/register")}
                            className="relative px-6 py-2 rounded-xl font-bold overflow-hidden group transition-all duration-300 shadow-lg"
                            style={{
                              backgroundColor: colors["light-bg"],
                              color: colors["primary-dark"],
                            }}
                          >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                              <div
                                className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
                                style={{
                                  backgroundColor: `${colors["primary-dark"]}20`,
                                }}
                              >
                                <UserPlus
                                  className="w-5 h-5"
                                  style={{ color: colors["primary-dark"] }}
                                />
                              </div>
                              <span className="text-base">Créer un compte</span>
                            </div>
                          </motion.button>

                          {/* Bouton Se connecter */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate("/login")}
                            className="relative bg-transparent border-2 px-6 py-4 rounded-xl font-bold overflow-hidden group transition-all duration-300 shadow-lg"
                            style={{
                              borderColor: colors["light-bg"],
                              color: colors["light-bg"],
                            }}
                          >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                              <div
                                className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
                                style={{
                                  backgroundColor: `${colors["light-bg"]}20`,
                                }}
                              >
                                <LogIn
                                  className="w-5 h-5"
                                  style={{ color: colors["light-bg"] }}
                                />
                              </div>
                              <span className="text-base">Se connecter</span>
                            </div>
                          </motion.button>
                        </div>

                        {/* Footer */}
                        <div
                          className="pt-6 border-t"
                          style={{ borderColor: colors["separator"] }}
                        >
                          <div
                            className="flex items-center justify-center gap-2"
                            style={{ color: colors["separator"] }}
                          >
                            <Sparkle className="w-4 h-4" />
                            <p className="text-xs text-center">
                              Accédez à tous vos biens et gérez vos annonces en
                              toute simplicité
                            </p>
                            <Sparkle className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filtres - Design Moderne */}
        <div
          className="mt-4 rounded-2xl border p-6 shadow-sm"
          style={{
            backgroundColor: colors["neutral-light"],
            borderColor: colors["separator"],
          }}
        >
          {/* Titre section */}
          <div className="mb-5 flex items-center gap-2">
            <div
              className="w-1 h-6 rounded-full"
              style={{
                background: `linear-gradient(to bottom, ${colors["primary-dark"]}, ${colors["secondary-text"]})`,
              }}
            ></div>
            <h3
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: colors["neutral-dark"] }}
            >
              Affinez votre recherche
            </h3>
          </div>

          {/* Grille principale des filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* Type de bien */}
            {activeTab !== "tous" && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: colors["neutral-dark"] }}
                >
                  Type de bien
                </label>
                <Select
                  onValueChange={(v) => {
                    if (activeTab === "achat") setTypeBienAchat(v || undefined);
                    else if (activeTab === "location")
                      setTypeBienLocation(v || undefined);
                    else if (activeTab === "saisonniere")
                      setTypeBienSaison(v || undefined);
                  }}
                  value={
                    activeTab === "achat"
                      ? typeBienAchat
                      : activeTab === "location"
                      ? typeBienLocation
                      : activeTab === "saisonniere"
                      ? typeBienSaison
                      : undefined
                  }
                >
                  <SelectTrigger
                    className="h-10 border-2 hover:border-slate-900 transition-colors rounded-xl"
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                  >
                    <SelectValue placeholder="Choisir..." />
                  </SelectTrigger>

                  <SelectContent>
                    {activeTab === "achat" && (
                      <>
                        <SelectItem value="maison">Maison / Villa</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="commercial">
                          Local commercial
                        </SelectItem>
                        <SelectItem value="professionnel">
                          Local professionnel
                        </SelectItem>
                        <SelectItem value="fonds_de_commerce">
                          Fonds de commerce
                        </SelectItem>
                        <SelectItem value="villas_neuves">
                          Villas neuves (VEFA)
                        </SelectItem>
                        <SelectItem value="appartements_neufs">
                          Appartement neufs (VEFA)
                        </SelectItem>
                        <SelectItem value="scpi">SCPI</SelectItem>
                        <SelectItem value="cave">Cave</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="gite">Gite</SelectItem>
                        <SelectItem value="maison_d_hote">
                          Maison d'hote
                        </SelectItem>
                        <SelectItem value="villa_d_exception">
                          Villa d'exception
                        </SelectItem>
                        <SelectItem value="domaine">Domaine</SelectItem>
                      </>
                    )}

                    {activeTab === "location" && (
                      <>
                        <SelectItem value="appartement">
                          Appartement meublée
                        </SelectItem>
                        <SelectItem value="villa">
                          Appartement non meublée
                        </SelectItem>
                        <SelectItem value="studio">Villa meublée</SelectItem>
                        <SelectItem value="studio">
                          Villa non meublée
                        </SelectItem>
                        <SelectItem value="parking">
                          Local commercial
                        </SelectItem>
                        <SelectItem value="parking">
                          Local professionnel
                        </SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                        <SelectItem value="parking">Parking</SelectItem>
                        <SelectItem value="cellier">Cellier</SelectItem>
                        <SelectItem value="cave">Cave</SelectItem>
                      </>
                    )}

                    {activeTab === "saisonniere" && (
                      <>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison / Villa</SelectItem>
                        <SelectItem value="villa_d_exception">
                          Villa d'exception
                        </SelectItem>
                        <SelectItem value="location_journee">
                          Location à la journée
                        </SelectItem>
                        <SelectItem value="location_salle_bureau">
                          Location de salle de bureau
                        </SelectItem>
                        <SelectItem value="hotel">Hotel</SelectItem>
                        <SelectItem value="chambre_d_hote">
                          Chambre d'hote
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Localisation */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: colors["neutral-dark"] }}
              >
                Localisation
              </label>
              <div className="relative group">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors"
                  style={{ color: colors["primary-dark"] }}
                />
                <Input
                  value={localisation}
                  onChange={(e) => handleSearch(e.target.value)}
                  onClick={() => setIsLocationModalOpen(true)}
                  placeholder="Cliquez pour choisir..."
                  className="pl-9 h-10 cursor-pointer transition-colors rounded-xl"
                  style={{
                    backgroundColor: colors["light-bg"],
                    borderColor: colors["separator"],
                  }}
                  readOnly
                />
              </div>
            </div>

            {/* Rayon de recherche */}
            <div className="flex flex-col gap-2">
              <label
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: colors["neutral-dark"] }}
              >
                Rayon (km)
              </label>
              <div className="flex gap-2">
                <Button
                  variant={radiusFilterEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRadiusFilterEnabled(!radiusFilterEnabled)}
                  className={`flex-1 h-10 rounded-xl transition-all ${
                    radiusFilterEnabled
                      ? "text-white hover:shadow-lg"
                      : "border-2 hover:border-slate-900"
                  }`}
                  style={
                    radiusFilterEnabled
                      ? {
                          background: `linear-gradient(to right, ${colors["primary-dark"]}, ${colors["secondary-text"]})`,
                        }
                      : {
                          borderColor: colors["separator"],
                          color: colors["neutral-dark"],
                        }
                  }
                >
                  {radiusFilterEnabled ? "✓ Actif" : "Inactif"}
                </Button>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={radiusKm}
                    onChange={handleRadiusInputChange}
                    onBlur={handleRadiusInputBlur}
                    className={`h-10 text-center rounded-xl transition-all ${
                      !radiusFilterEnabled
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                    disabled={!radiusFilterEnabled}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    km
                  </span>
                </div>
              </div>
              <Slider
                value={[radiusKm]}
                min={0}
                max={30}
                step={1}
                onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
                className={`mt-2 ${
                  !radiusFilterEnabled ? "opacity-40 cursor-not-allowed" : ""
                }`}
                disabled={!radiusFilterEnabled}
              />
            </div>

            {/* Prix */}
            {activeTab === "achat" && (
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: colors["neutral-dark"] }}
                >
                  Budget (€)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Min"
                    value={priceMin ?? ""}
                    onChange={(e) =>
                      setPriceMin(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-10 rounded-xl transition-colors text-sm"
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                  />
                  <Input
                    placeholder="Max"
                    value={priceMax ?? ""}
                    onChange={(e) =>
                      setPriceMax(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-10 rounded-xl transition-colors text-sm"
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Filtres supplémentaires - Responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Surface (Location/Saisonnière) */}
            {(activeTab === "location" || activeTab === "saisonniere") && (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Surface (m²)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={surfaceMin ?? ""}
                      onChange={(e) =>
                        setSurfaceMin(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="h-10 rounded-xl transition-colors text-sm"
                      style={{
                        backgroundColor: colors["light-bg"],
                        borderColor: colors["separator"],
                      }}
                    />
                    <Input
                      placeholder="Max"
                      value={surfaceMax ?? ""}
                      onChange={(e) =>
                        setSurfaceMax(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="h-10 rounded-xl transition-colors text-sm"
                      style={{
                        backgroundColor: colors["light-bg"],
                        borderColor: colors["separator"],
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Pièces
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Nombre de pièces"
                    value={pieces ?? ""}
                    onChange={(e) =>
                      setPieces(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-10 rounded-xl transition-colors text-sm"
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Chambres
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Nombre de chambres"
                    value={chambres ?? ""}
                    onChange={(e) =>
                      setChambres(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="h-10 rounded-xl transition-colors text-sm"
                    style={{
                      backgroundColor: colors["light-bg"],
                      borderColor: colors["separator"],
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Prix max/mois
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="Montant"
                      value={priceMax ?? ""}
                      onChange={(e) =>
                        setPriceMax(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="h-10 rounded-xl transition-colors text-sm pr-8"
                      style={{
                        backgroundColor: colors["light-bg"],
                        borderColor: colors["separator"],
                      }}
                    />
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                      style={{ color: colors["neutral-dark"] }}
                    >
                      €
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Équipements */}
            {(activeTab === "location" || activeTab === "saisonniere") && (
              <>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Extérieur
                  </label>
                  <Select
                    onValueChange={(v) => setExterieur(v || undefined)}
                    value={exterieur}
                  >
                    <SelectTrigger
                      className="h-10 border-2 hover:border-slate-900 transition-colors rounded-xl"
                      style={{
                        backgroundColor: colors["light-bg"],
                        borderColor: colors["separator"],
                      }}
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
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    Supplémentaires
                  </label>
                  <Select
                    onValueChange={(v) => setExtras(v || undefined)}
                    value={extras}
                  >
                    <SelectTrigger
                      className="h-10 border-2 hover:border-slate-900 transition-colors rounded-xl"
                      style={{
                        backgroundColor: colors["light-bg"],
                        borderColor: colors["separator"],
                      }}
                    >
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcon">Balcon</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="ascenseur">Ascenseur</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Résultats */}
        <div className="mt-6">
          {loading.buy && loading.rent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-2xl mb-4" />
                  <div className="bg-muted h-6 rounded mb-2" />
                  <div className="bg-muted h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayed.map((property: any) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Card
                      data-property-id={property.id}
                      className="overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 rounded-lg cursor-pointer bg-white"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="p-3">
                        {/* En-tête - Type et ville */}
                        <h3 className="font-medium text-gray-900 text-sm mb-1">
                          {property.type} • {property.city}
                        </h3>

                        {/* Dates et type d'hôte */}
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <span>{property.dates || "24–26 juil."}</span>
                          <span className="mx-1">-</span>
                          <span className={property.rentType === "professionnel" || property.status === "professionnel" 
                            ? "text-[#556B2F]" 
                            : "text-[#8B4513]"}>
                            Hôte {property.rentType === "professionnel" || property.status === "professionnel" 
                              ? "professionnel" 
                              : "particulier"}
                          </span>
                        </div>

                        {/* Image */}
                        <div className="relative rounded-md overflow-hidden mb-2 h-32 w-full">
                          <img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Navigation images si plusieurs */}
                          {totalImages > 1 && (
                            <>
                              <button
                                className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  prevImage(property.id, totalImages, e);
                                }}
                              >
                                <ChevronLeft className="h-3 w-3" />
                              </button>
                              <button
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  nextImage(property.id, totalImages, e);
                                }}
                              >
                                <ChevronRight className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Prix total et note */}
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-base font-bold text-gray-900">
                              {property.price}€
                            </span>
                            <span className="text-xs text-gray-500 ml-1">
                              au total
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-700">
                              ★ {property.note || "4,85"}
                            </span>
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

      {/* Modal de demande de visite */}
      <ModalDemandeVisite
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        property={selectedProperty}
        isAlreadySent={
          selectedProperty ? !!sentRequests?.[selectedProperty.id] : false
        }
        onSuccess={(id: string) =>
          setSentRequests((prev) => ({ ...prev, [id]: true }))
        }
        onPropertyContact={handlePropertyContact}
      />

      {/* Modal de sélection de localisation */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        value={localisation}
        onChange={setLocalisation}
        onLocationSelect={(location) => {
          setLocalisation(location.address);
          // console.log("Location selected:", location);
        }}
        properties={[
          ...buyProperties,
          ...rentProperties,
          ...seasonalProperties,
        ].map((p) => ({
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
    </section>
  );
};

export default PropertyListings;