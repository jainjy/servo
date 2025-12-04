import React, { useState, useEffect, useMemo, useCallback } from "react";
import { UserPlus, LogIn, Sparkles, SparklesIcon, Home, Sparkle } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import LocationPickerModal from "@/components/carte";
import {
  Search,
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
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { useImmobilierTracking } from '@/hooks/useImmobilierTracking';
import { ModalDemandeVisite } from "@/components/ModalDemandeVisite";

const styles = {
  section: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  phrase: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '24px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
};

// Données locales de fallback (garde les images existantes)
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

const localSellServices = [
  {
    id: "7",
    localImage: sellServices1,
    price: 0,
    title: "Évaluez votre bien",
    city: "Toute l'île",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Rapport détaillé • Expert",
  },
  {
    id: "8",
    localImage: sellServices2,
    price: 0,
    title: "Vendez avec SERVO",
    city: "Île de la Réunion",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Accompagnement complet",
  },
  {
    id: "9",
    localImage: sellServices3,
    price: 0,
    title: "Investissement",
    city: "Zones prisées",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Rentabilité garantie",
  },
];

// Utilitaires
const formatPrice = (price: number, _type: string, status: string) => {
  if (status === "service") return "Estimation gratuite";
  if (status === "for_rent") return `${price.toLocaleString('fr-FR')} €/mois`;
  return `${price.toLocaleString('fr-FR')} €`;
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
  if (!address) return '';
  return address
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s]/g, '') // Garde seulement lettres, chiffres et espaces
    .replace(/\s+/g, ' ') // Réduit les espaces multiples
    .trim();
};

// Fonction pour détecter si une propriété est hors de La Réunion
const isHorsDuPays = (property: any) => {
  if (!property) return false;
  
  const reunionCities = [
    'saint-denis', 'saint-paul', 'saint-pierre', 'saint-gilles-les-bains', 
    'saint-leu', 'saint-benoit', 'saint-andre', 'saint-joseph', 'saint-louis',
    'saint-philippe', 'saint-marie', 'saint-rose', 'le tampon', 'la possession', 
    'le port', 'les avirons', 'entre-deux', 'etang-sale', 'petite-ile', 
    'plaine-des-palmistes', 'plaine-des-cafres', 'salazie', 'cilaos', 'trois-bassins',
    'bras-panon', 'la plaine-des-palmistes', 'sainte-marie', 'sainte-suzanne',
    'sainte-rose'
  ];
  
  const city = normalizeAddress(property.city || '');
  const address = normalizeAddress(property.address || '');
  
  // Si la ville n'est pas dans la liste des villes de La Réunion, c'est "hors du pays"
  return !reunionCities.some(reunionCity => 
    city.includes(normalizeAddress(reunionCity)) || 
    address.includes(normalizeAddress(reunionCity))
  );
};

interface PropertyListingsProps {
  cardsOnly?: boolean;
  initialTab?: 'tous' | 'achat' | 'location' | 'saisonniere' | 'hors_pays';
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
  onFilter
}) => {
  const navigate = useNavigate();
//Fonction pour calculer la distance (Haversine)
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


  // Initialisation du tracking
  const {
    trackPropertyView,
    trackPropertyClick,
    trackPropertyFilter,
    trackPropertyContact,
    trackPropertySearch
  } = useImmobilierTracking();

  const [showCard, setShowCard] = useState(false);
  const [activeTab, setActiveTab] = useState<'achat' | 'location' | 'saisonniere' | 'tous' | 'hors_pays'>(initialTab ?? 'tous');
  const [radiusKm, setRadiusKm] = useState(5);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>(undefined);
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>(undefined);
  const [pieces, setPieces] = useState<number | undefined>(undefined);
  const [chambres, setChambres] = useState<number | undefined>(undefined);
  const [exterieur, setExterieur] = useState<string | undefined>(undefined);
  const [extras, setExtras] = useState<string | undefined>(undefined);
  const [typeBienAchat, setTypeBienAchat] = useState<string | undefined>(undefined);
  const [typeBienLocation, setTypeBienLocation] = useState<string | undefined>(undefined);
  const [typeBienSaison, setTypeBienSaison] = useState<string | undefined>(undefined);
  const [localisation, setLocalisation] = useState("");
  // const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // CHOIX 1: Utiliser la position par défaut de La Réunion
  const [userLocation, setUserLocation] = useState({
    lat: -20.882057,
    lon: 55.450675
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
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Auth (to load user's demandes and mark sent requests)
  const { user, isAuthenticated } = useAuth();

  // Intersection Observer pour le tracking des vues
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const propertyId = entry.target.getAttribute('data-property-id');
          const property = [...buyProperties, ...rentProperties, ...seasonalProperties]
            .find(p => p.id === propertyId);

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
    }, { threshold: 0.5 });

    // Observer chaque propriété
    [...buyProperties, ...rentProperties, ...seasonalProperties].forEach(property => {
      const element = document.querySelector(`[data-property-id="${property.id}"]`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [buyProperties, rentProperties, seasonalProperties, trackPropertyView, onPropertyView]);

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
        if (mounted) setSentRequests(prev => ({ ...prev, ...map }));
      } catch (err) {
        console.error('Unable to load user demandes', err);
      } finally {
        if (mounted) setDemandesLoading(false);
      }
    };

    loadUserDemandes();
    return () => { mounted = false; };
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
            lon: pos.coords.longitude
          });
        },
        (err) => {
          console.warn("Permission localisation refusée", err);
          // Si la géolocalisation échoue, on utilise la position par défaut de La Réunion
          setUserLocation({
            lat: -20.882057,
            lon: 55.450675
          });
        }
      );
    }
  }, [userLocation]);

  // Fonction pour gérer le changement de valeur via l'input
  const handleRadiusInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
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
    if (value === '') {
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
      const response = await api.get('/properties');
      if (!response.data) throw new Error('Erreur lors de la récupération des propriétés');
      const properties = response.data.map(p => ({
        ...p,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
      }));

      const forSale = properties
        .filter((p: any) => p.status === 'for_sale' && p.isActive)
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [property1, property2, property3][i % 3] }));

      // Filtrer les propriétés saisonnières en utilisant le champ rentType
      const forRent = properties
        .filter((p: any) => p.status === 'for_rent' && p.isActive && p.rentType === 'longue_duree')
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [rentProperties1, rentProperties2, rentProperties3][i % 3] }));

      const seasonal = properties
        .filter((p: any) => p.status === 'for_rent' && p.isActive && p.rentType === 'saisonniere')
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [rentProperties1, rentProperties2, rentProperties3][i % 3] }));

      setBuyProperties(forSale);
      setRentProperties(forRent);
      // Stockez directement les propriétés saisonnières au lieu d'utiliser useMemo
      setSeasonalProperties(seasonal);

    } catch (err) {
      console.error('Error fetching properties:', err);
      setError("Impossible de charger les propriétés. Affichage des exemples.");
      setBuyProperties(localBuyProperties as any[]);
      setRentProperties(localRentProperties as any[]);
      setSeasonalProperties(localRentProperties.filter(p => p.features.toLowerCase().includes('courte')) as any[]);
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
    [...buyProperties, ...rentProperties, ...seasonalProperties].forEach((p: any) => {
      indexes[p.id] = indexes[p.id] ?? 0;
    });
    setCurrentImageIndexes((prev) => ({ ...indexes, ...prev }));
  }, [buyProperties, rentProperties, seasonalProperties]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && property.images.length > 0) return property.images as string[];
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
      type: activeTab === 'achat' ? typeBienAchat :
        activeTab === 'location' ? typeBienLocation :
          activeTab === 'saisonniere' ? typeBienSaison : undefined,
      priceMin,
      priceMax,
      location: localisation,
      rooms: pieces,
      radiusKm,
      surfaceMin,
      surfaceMax,
      chambres,
      exterieur,
      extras
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
  }, [activeTab, typeBienAchat, typeBienLocation, typeBienSaison, priceMin, priceMax, localisation, pieces, radiusKm, surfaceMin, surfaceMax, chambres, exterieur, extras]);

  const displayed = useMemo(() => {
    const hasFeature = (p: any, token: string) => {
      if (!token) return true;
      const feats = Array.isArray(p.features) ? p.features.join(' ').toLowerCase() : String(p.features || '').toLowerCase();
      const more = `${String(p.type || '').toLowerCase()} ${String(p.title || '').toLowerCase()} ${String(p.description || '').toLowerCase()}`;
      return feats.includes(token.toLowerCase()) || more.includes(token.toLowerCase());
    };

    
    const applyFilters = (arr: any[]) =>
      arr.filter((p) => {
        if (!p) return false;

        // FILTRE HORS DU PAYS
        if (activeTab === 'hors_pays') {
          if (!isHorsDuPays(p)) return false;
        } else {
          // FILTRE LOCALISATION NORMAL (uniquement pour les autres onglets)
          if (localisation && localisation.trim()) {
            const searchTerm = normalizeAddress(localisation);
            const city = normalizeAddress(p.city || '');
            const address = normalizeAddress(p.address || '');
            const zipCode = normalizeAddress(p.zipCode || '');

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
        if (priceMin !== undefined && (p.price === undefined || p.price < priceMin)) return false;
        if (priceMax !== undefined && (p.price === undefined || p.price > priceMax)) return false;

        // Filtres surface
        if (surfaceMin !== undefined && (p.surface === undefined || p.surface < surfaceMin)) return false;
        if (surfaceMax !== undefined && (p.surface === undefined || p.surface > surfaceMax)) return false;

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
        if (exterieur !== undefined && exterieur !== '') {
          if (!hasFeature(p, exterieur)) return false;
        }
        if (extras !== undefined && extras !== '') {
          if (!hasFeature(p, extras)) return false;
        }

        return true;
      });

    let base: any[] = [];
    if (activeTab === 'achat') base = buyProperties;
    else if (activeTab === 'location') base = rentProperties;
    else if (activeTab === 'saisonniere') base = seasonalProperties;
    else if (activeTab === 'hors_pays') {
      // Pour "hors du pays", on prend toutes les propriétés et on filtre
      const all = [...buyProperties, ...rentProperties, ...seasonalProperties];
      const map = new Map<string, any>();
      all.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      base = Array.from(map.values());
    }
    else {
      const all = [...buyProperties, ...rentProperties, ...seasonalProperties];
      const map = new Map<string, any>();
      all.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      base = Array.from(map.values());
    }

    if (activeTab === 'achat' && typeBienAchat) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienAchat).toLowerCase()));
    } else if (activeTab === 'location' && typeBienLocation) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienLocation).toLowerCase()));
    } else if (activeTab === 'saisonniere' && typeBienSaison) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienSaison).toLowerCase()));
    }

    // FILTRE PAR RAYON SI POSITION DISPONIBLE
    // Note: userLocation peut être soit un objet {lat, lon} soit null
    if (userLocation && radiusKm > 0) {
      base = base.filter((p) => {
        if (!p.latitude || !p.longitude) return false;  

        const dist = getDistanceKm(
          userLocation.lat,
          userLocation.lon,
          p.latitude,
          p.longitude
        );

        return dist <= radiusKm;
      });
    }

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
    userLocation, // Ajouté ici pour déclencher le recalcul quand userLocation change
  ]);

  const ctaMoreRoute = activeTab === 'achat' ? '/acheter' : '/louer';

  const toggleFavorite = (id: string, e?: any) => {
    e?.stopPropagation?.();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const prevImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({ ...prev, [id]: (prev[id] - 1 + total) % total }));
  };

  const nextImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({ ...prev, [id]: (prev[id] + 1) % total }));
  };

  const handleDemanderVisite = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();

    // Track contact action
    handlePropertyContact(property);

    if (sentRequests?.[property?.id]) {
      toast({ title: "Demande déjà envoyée", description: "Vous avez déjà envoyé une demande pour ce bien." });
      return;
    }
    setSelectedProperty(property);
    setModalOpen(true);
  };

  // Mode cartes seules (utilisé sur la Home)
  if (cardsOnly) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-6">
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(maxItems ? displayed.slice(0, maxItems) : displayed).map((property: any) => {
                  const images = getPropertyImages(property);
                  const totalImages = images.length;
                  const idx = currentImageIndexes[property.id] || 0;
                  const featuresArr = normalizeFeatures(property.features);
                  const priceLabel = formatPrice(property.price || 0, property.type, property.status);

                  return (
                    <Card
                      key={property.id}
                      data-property-id={property.id}
                      className="home-card group cursor-pointer h-full"
                      onClick={() => handlePropertyClick(property)}
                    >
                      <div className="relative">
                        <div className="relative rounded-lg h-52 overflow-hidden">
                          <img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="home-card-image h-full w-full group-hover:scale-110"
                          />

                          <div className="absolute bg-gray-700 rounded-full py-1 px-2 text-white font-semibold text-sm top-3 left-3 home-card-badge">
                            {property.type}
                          </div>
                          <div className="absolute bg-green-950 p-1 text-white font-semibold text-sm rounded-full bottom-3 right-3 home-card-price">
                            {priceLabel}
                          </div>
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
                            <h3 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2 leading-tight">
                              {property.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
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
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                              >
                                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                                {feature}
                              </span>
                            ))}
                          </div>
                          {/* Boutons d'action */}
                          <div className="flex gap-1">
                            <button
                              className="relative border-2 p-2 mx-auto border-slate-900 flex items-center gap-2 overflow-hidden rounded-md group transition-all duration-500 hover:shadow-lg"
                              onClick={() => handlePropertyClick(property)}
                            >
                              {/* Background animé avec effet smooth */}
                              <span className="absolute inset-0 -left-2 top-10 w-36 h-32 bg-slate-900 group-hover:-top-12 transition-all duration-700 ease-out origin-bottom rounded-full transform scale-95 group-hover:scale-100"></span>

                              {/* Contenu */}
                              <span className="relative z-10 text-slate-900 font-semibold group-hover:text-white transition-all duration-500 ease-out group-hover:translate-x-1">
                                Voir details
                              </span>
                              <Eye className="w-4 h-4 relative z-10 text-slate-900 group-hover:text-white transition-all duration-500 ease-out group-hover:scale-110 group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* MODAL AJOUTÉ ICI POUR LE MODE CARDS ONLY */}
        <ModalDemandeVisite
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={selectedProperty}
          isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
          onSuccess={(id: string) => setSentRequests(prev => ({ ...prev, [id]: true }))}
          onPropertyContact={handlePropertyContact}
        />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg z-50 mt-44 w-full">
      <div className=" container mx-auto px-4 py-6">
        {/* Barre d'onglets + CTA */}
        <div className=" lg:sticky top-16 z-30 bg-white flex flex-col lg:flex-row gap-4 items-center justify-between rounded-2xl border border-border/50 p-4">
          <div className="grid grid-cols-2 lg:flex flex-wrap items-center gap-2">
            <Button
              variant={activeTab === 'tous' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${activeTab === 'tous' ? 'bg-slate-900 text-primary-foreground hover:bg-transparent' : 'border-2'}`}
              onClick={() => setActiveTab('tous')}
            >
              TOUS
            </Button>

            <Button
              variant={activeTab === 'achat' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${activeTab === 'achat' ? 'bg-slate-900 text-primary-foreground hover:bg-transparent' : 'border-2'}`}
              onClick={() => setActiveTab('achat')}
            >
              ACHAT
            </Button>
            <Button
              variant={activeTab === 'location' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${activeTab === 'location' ? 'bg-slate-900 text-primary-foreground hover:bg-transparent' : 'border-2'}`}
              onClick={() => setActiveTab('location')}
            >
              LOCATION LONGUE DURÉE
            </Button>
            <Button
              variant={activeTab === 'saisonniere' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${activeTab === 'saisonniere' ? 'bg-slate-900 text-primary-foreground hover:bg-transparent' : 'border-2'}`}
              onClick={() => setActiveTab('saisonniere')}
            >
              LOCATION SAISONNIÈRE
            </Button>
            {/* NOUVEL ONGLET HORS DU PAYS */}
            <Button
              variant={activeTab === 'hors_pays' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 hover:border-slate-900 hover:text-slate-900 lg:text-sm ${activeTab === 'hors_pays' ? 'bg-slate-900 text-primary-foreground hover:bg-transparent' : 'border-2'}`}
              onClick={() => setActiveTab('hors_pays')}
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
                      className="bg-gray-900 relative rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden bg-opacity-95 border border-gray-700"
                    >
                      {/* Bouton fermeture */}
                      <button
                        onClick={() => setShowCard(false)}
                        className="absolute top-4 right-4 z-50 p-2 bg-red-600 hover:bg-red-700 rounded-full transition-all duration-300 group shadow-lg"
                      >
                        <X className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                      </button>

                      {/* Header avec Lottie */}
                      <div className="relative h-48 bg-gradient-to-br from-blue-900/50 to-purple-900/50 overflow-hidden flex items-center justify-center">
                        {/* Animation Lottie - Remplacez par votre composant Lottie */}
                        <div className="w-32 h-32 flex items-center justify-center">
                          {/* Exemple avec une div animée en attendant Lottie */}
                          <div className="w-24 h-24 bg-transparent border-2 border-white ring-2 ring-white outline-dotted rounded-full animate-pulse flex items-center justify-center">
                            <Home className="w-12 h-12 text-white" />
                          </div>
                        </div>

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                      </div>

                      {/* Contenu */}
                      <div className="p-8">
                        {/* Message */}
                        <div className="flex items-start gap-4 mb-8">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/30" />
                            <div className="w-1 h-8 bg-gradient-to-b from-purple-500/50 to-transparent rounded-full mt-2"></div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">Publiez votre bien</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Merci de vous connecter à votre compte afin de publier une annonce de location ou de vente de votre bien.
                            </p>
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="grid lg:grid-cols-2 gap-4 mb-6">
                          {/* Bouton Créer un compte */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/register')}
                            className="relative bg-white text-slate-900 px-6 py-2 rounded-xl font-bold overflow-hidden group transition-all duration-300 shadow-lg"
                          >
                            <div className="relative z-10 flex items-center justify-center gap-3">
                              <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                <UserPlus className="w-5 h-5 text-slate-900" />
                              </div>
                              <span className="text-base">Créer un compte</span>
                            </div>
                          </motion.button>

                          {/* Bouton Se connecter */}
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/login')}
                            className="relative bg-transparent text-white border-2 border-white px-6 py-4 rounded-xl font-bold overflow-hidden group transition-all duration-300 shadow-lg"
                          >

                            <div className="relative z-10 flex items-center justify-center gap-3">
                              <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                                <LogIn className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-base">Se connecter</span>
                            </div>
                          </motion.button>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-gray-700">
                          <div className="flex items-center justify-center gap-2 text-gray-400">
                            <Sparkle className="w-4 h-4" />
                            <p className="text-xs text-center">
                              Accédez à tous vos biens et gérez vos annonces en toute simplicité
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

        {/* Filtres */}
        <div className=" mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-full">
              <Select
                onValueChange={(v) => {
                  if (activeTab === 'achat') setTypeBienAchat(v || undefined);
                  else if (activeTab === 'location') setTypeBienLocation(v || undefined);
                  else if (activeTab === 'saisonniere') setTypeBienSaison(v || undefined);
                }}
                value={
                  activeTab === 'achat'
                    ? typeBienAchat
                    : activeTab === 'location'
                      ? typeBienLocation
                      : activeTab === 'saisonniere'
                        ? typeBienSaison
                        : undefined
                }
              >
                <SelectTrigger className="h-11 border-2">
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === 'tous' && (
                    <>
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="professionnel">Local professionnel</SelectItem>
                      <SelectItem value="fonds_de_commerce">Fonds de commerce</SelectItem>
                      <SelectItem value="appartements_neufs">Appartement neufs (VEFA)</SelectItem>
                      <SelectItem value="scpi">SCPI</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="villas_neuves">Villas neuves (VEFA)</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="gite">Gite</SelectItem>
                      <SelectItem value="maison_d_hote">Maison d'hote</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="domaine">Domaine</SelectItem>
                      <SelectItem value="appartement">Appartement meublée</SelectItem>
                      <SelectItem value="villa">Appartement non meublée</SelectItem>
                      <SelectItem value="studio">Villa meublée</SelectItem>
                      <SelectItem value="studio">Villa non meublée</SelectItem>
                      <SelectItem value="parking">Local commercial</SelectItem>
                      <SelectItem value="parking">Local professionnel</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="cellier">Cellier</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </>
                  )}
                  {activeTab === 'achat' && (
                    <>
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
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="gite">Gite</SelectItem>
                      <SelectItem value="maison_d_hote">Maison d'hote</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="domaine">Domaine</SelectItem>
                    </>
                  )}

                  {activeTab === 'location' && (
                    <>
                      <SelectItem value="appartement">Appartement meublée</SelectItem>
                      <SelectItem value="villa">Appartement non meublée</SelectItem>
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

                  {activeTab === 'saisonniere' && (
                    <>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="location_journee">Location à la journée</SelectItem>
                      <SelectItem value="location_salle_bureau">Location de salle de bureau</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="chambre_d_hote">Chambre d'hote</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={localisation}
              onChange={(e) => handleSearch(e.target.value)}
              onClick={() => setIsLocationModalOpen(true)}
              placeholder="Cliquez pour choisir sur la carte"
              className="pl-9 h-11 border-2 cursor-pointer bg-white"
              readOnly
            />
          </div>
          
          {/* FILTRE RAYON MODIFIÉ AVEC INPUT */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm text-muted-foreground">RAYON</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="30"
                  value={radiusKm}
                  onChange={handleRadiusInputChange}
                  onBlur={handleRadiusInputBlur}
                  className="h-8 w-16 text-center border-2"
                />
                <span className="font-medium text-sm">Km</span>
              </div>
            </div>
            <Slider
              value={[radiusKm]}
              min={0}
              max={30}
              step={1}
              onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
              className="mt-1"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 Km</span>
              <span>30 Km</span>
            </div>
          </div>

          {/* Filtres supplémentaires */}
          <div className="col-span-1 lg:col-span-3 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeTab === 'achat' && (
              <>
                <div className="flex items-center gap-2">
                  <Input placeholder="Prix min (€)" value={priceMin ?? ''} onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)} className="h-10" />
                  <Input placeholder="Prix max (€)" value={priceMax ?? ''} onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10" />
                </div>
              </>
            )}
            {(activeTab === 'location' || activeTab === 'saisonniere') && (
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Prix MAX / mois (€)" value={priceMax ?? ''} onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Surface min (m²)" value={surfaceMin ?? ''} onChange={(e) => setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Surface max (m²)" value={surfaceMax ?? ''} onChange={(e) => setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                </div>

                <div className="flex items-center gap-2">
                  <Input placeholder="Pièces" value={pieces ?? ''} onChange={(e) => setPieces(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Chambres" value={chambres ?? ''} onChange={(e) => setChambres(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Select onValueChange={(v) => setExterieur(v || undefined)} value={exterieur}>
                    <SelectTrigger className="h-10 border-2 w-40">
                      <SelectValue placeholder="Exterieur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piscine">Piscine</SelectItem>
                      <SelectItem value="jardin">Jardin</SelectItem>
                      <SelectItem value="terrasse">Terrasse</SelectItem>
                      <SelectItem value="balcon">Balcon</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(v) => setExtras(v || undefined)} value={extras}>
                    <SelectTrigger className="h-10 border-2 w-40">
                      <SelectValue placeholder="En plus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcon">Balcon</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="ascenseur">Ascenseur</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Indicateur de filtre actif */}
        {localisation && (
          <div></div>
        )}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayed.map((property: any) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;
                const isFav = !!favorites[property.id];
                const featuresArr = normalizeFeatures(property.features);
                const priceLabel = formatPrice(property.price || 0, property.type, property.status);

                return (
                  <Card
                    key={property.id}
                    data-property-id={property.id}
                    className="overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl group cursor-pointer"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <div className="relative">
                      {/* Zone image avec navigation */}
                      <div className="relative h-48 w-11/12 rounded-lg mx-3 shadow-lg my-2 overflow-hidden">

                        <img
                          src={images[idx % totalImages]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />


                        {/* Badge type */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                          {property.type}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-green-200 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                          {priceLabel}
                        </div>

                        {/* Badge + Actions */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          {(() => {
                            const badgeLabel = property.status === 'for_sale' ? 'ACHAT' : property.status === 'for_rent' ? 'LOCATION' : 'SAISONNIÈRE';
                            const badgeColor = property.status === 'for_sale' ? 'bg-blue-600' : property.status === 'for_rent' ? 'bg-green-600' : 'bg-orange-600';
                            return (
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badgeColor}`}>
                                {badgeLabel}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Navigation images */}
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

                            {/* Compteur */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                              {idx + 1}/{totalImages}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2 leading-tight">
                            {property.title}
                          </h3>
                        </div>

                        {/* Prix et localisation */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.city}
                          </span>
                        </div>

                        {/* Caractéristiques */}
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

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {featuresArr.slice(0, 2).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              <div className="w-1 h-1 bg-blue-600 rounded-full" />
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-1">
                          <button
                            className="w-full bg-slate-900 text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-slate-900/90 transition disabled:opacity-60 disabled:bg-orange-600"
                            onClick={(e) => handleDemanderVisite(property, e)}
                            disabled={!!sentRequests?.[property?.id]}
                          >
                            {sentRequests?.[property?.id] ? 'Demande déjà envoyée' : 'Demander visite'}
                          </button>
                          <button
                            className="border-2 p-2 rounded-md"
                            onClick={() => handlePropertyClick(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
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
        isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
        onSuccess={(id: string) => setSentRequests(prev => ({ ...prev, [id]: true }))}
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
          console.log('Location selected:', location);
        }}
        properties={[
          ...buyProperties,
          ...rentProperties,
          ...seasonalProperties
        ].map(p => ({
          id: p.id,
          title: p.title,
          address: p.address || '',
          city: p.city,
          latitude: p.latitude,
          longitude: p.longitude,
          type: p.type,
          price: p.price,
          status: p.status
        }))}
      />
    </section>
  );
};

export default PropertyListings;