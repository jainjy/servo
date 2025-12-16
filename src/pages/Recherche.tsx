import React, { useState, useEffect, useRef, useCallback,useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, History, ArrowLeft, ShoppingCart, Calendar, FileText, Play, RefreshCw, Home, MapPin, Users, Loader, TreePalm, X, Mail, Phone, DollarSign, Ruler, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import api from "@/lib/api";
import start from '/run.gif';
import { DevisModal } from "@/components/TravauxSection";
import { ModalDemandeVisite } from '@/components/ModalDemandeVisite';
// Import du contexte panier  
import { useCart } from "@/components/contexts/CartContext";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { AutoSuggestInput } from "@/components/AutoSuggestInput";
import ServoLogo from "@/components/components/ServoLogo";

import GenericMap from "@/components/GenericMap";
import { MapService } from "@/services/mapService";
import { MapPoint } from "@/types/map";
import PointDetailsModal from "@/components/PointDetailsModal"; // Import du modal

interface SearchItem {
  id: string | number;
  title: string;
  image?: string;
  route: string;
  type?: string;
  price?: number;
  location?: string;
  source_table: string;
  similarity?: number;
  // Champs supplémentaires pour les différentes fonctionnalités
  libelle?: string;
  description?: string;
  name?: string;
  images?: string[];
  city?: string;
  address?: string;
}

type Stage = "idle" | "loading" | "results";

// Interfaces pour la carte
interface MapFilters {
  users: boolean;
  properties: boolean;
  searchTerm: string;
}

// SVG pour l'icône de position (remplace l'emoji 📍)
const PositionIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
      fill="currentColor"
    />
  </svg>
);

const Recherche = ({ onClick }: { onClick?: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
// en haut du composant Recherche (juste après les useState)
const defaultCenter = useMemo(() => [-21.1351, 55.2471] as [number, number], []);

  // Fonction de fermeture simplifiée qui redirige toujours vers la page d'accueil
  const handleClose = () => {
    if (typeof onClick === 'function') {
      onClick();
    }
    // Rediriger vers la page d'accueil
    navigate('/');
  };

  const [stage, setStage] = useState<Stage>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchItem[]>([]);
  const [runnerVisible, setRunnerVisible] = useState(false);
  const [runnerExit, setRunnerExit] = useState(false);
  const prevStageRef = useRef<Stage>("idle");


  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{ q: string; date: number }>>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const HISTORY_KEY = "hero-search-history";
  const inputRef = useRef<HTMLInputElement>(null);

  // États pour les modales
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null as any
  });

  const [visiteModal, setVisiteModal] = useState({
    isOpen: false,
    property: null as any
  });

  // =============== ÉTATS POUR LA CARTE ===============
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [filteredMapPoints, setFilteredMapPoints] = useState<MapPoint[]>([]);
  const [mapLoading, setMapLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapFilters, setMapFilters] = useState<MapFilters>({
    users: true,
    properties: true,
    searchTerm: "",
  });
  const [showMapModal, setShowMapModal] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [selectedMapPoint, setSelectedMapPoint] = useState<MapPoint | null>(null); // Nouvel état pour le point sélectionné
  const [nearbyPoints, setNearbyPoints] = useState<MapPoint[]>([]); // Points dans un rayon de 5km
  const [showNearbyModal, setShowNearbyModal] = useState(false); // Modal pour les points proches
  const [nearbyLoading, setNearbyLoading] = useState(false); // Loading pour la recherche 5km
  const [hasPositionBeenFetched, setHasPositionBeenFetched] = useState(false); // Nouvel état pour suivre si la position a été récupérée
  // ===================================================

  // Contexte panier
  const { addToCart } = useCart();

  // Vérification de l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Récupération auto toutes les 7 minutes quand la carte est ouverte
useEffect(() => {
  if (!showMapModal || hasPositionBeenFetched) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation([position.coords.latitude, position.coords.longitude]);
      setHasPositionBeenFetched(true);
    },
    () => {
      console.warn("Position non récupérée.");
    }
  );
}, [showMapModal]);


  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthentication();
  }, []);

  // =============== VERROUILLER LE SCROLL DU BODY QUAND LA CARTE EST OUVERTE ===============
  useEffect(() => {
    if (showMapModal) {
      // Verrouiller le scroll en ajoutant overflow-hidden
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Réactiver le scroll en supprimant overflow-hidden
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup: s'assurer que le scroll est réactivé au démontage
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showMapModal]);
  // =====================================================================================

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem("auth-token");
      const userData = localStorage.getItem("user-data");

      if (token && token !== "null" && token !== "undefined") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Erreur vérification auth:", error);
      setIsAuthenticated(false);
    }
  };

  // =============== FONCTIONS POUR LA CARTE ===============
  const loadMapData = useCallback(async () => {
    try {
      setMapLoading(true);
      const allPoints = await MapService.getAllMapPoints();
      
      // DEBUG: Vérifier les données
      // console.log("📊 Données carte chargées:", {
      //   total: allPoints.length,
      //   users: allPoints.filter(p => p.type === "user").length,
      //   properties: allPoints.filter(p => p.type === "property").length,
      //   firstPoints: allPoints.slice(0, 3).map(p => ({
      //     id: p.id,
      //     name: p.name,
      //     type: p.type,
      //     lat: p.latitude,
      //     lng: p.longitude
      //   }))
      // });
      
      setMapPoints(allPoints);
      setFilteredMapPoints(allPoints);
      setMapError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement de la carte";
      setMapError(errorMessage);
      console.error("❌ Erreur chargement carte:", err);
      setMapPoints([]);
      setFilteredMapPoints([]);
    } finally {
      setMapLoading(false);
    }
  }, []);

  // Fonction pour calculer la distance entre deux points (formule Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fonction pour filtrer les points sur la carte
  const filterMapPoints = useCallback((points: MapPoint[], filters: MapFilters, searchQuery: string = "") => {
    let filtered = points;

    // Filtre par type
    if (!filters.users && !filters.properties) {
      filtered = [];
    } else if (!filters.users || !filters.properties) {
      filtered = points.filter(
        (point) =>
          (filters.users && point.type === "user") ||
          (filters.properties && point.type === "property")
      );
    }

    // Filtre par recherche
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (point) =>
          point.name?.toLowerCase().includes(searchTerm) ||
          point.city?.toLowerCase().includes(searchTerm) ||
          point.address?.toLowerCase().includes(searchTerm) ||
          (point.type === "user" &&
            point.metiers?.some((metier) =>
              metier.toLowerCase().includes(searchTerm)
            )) ||
          (point.type === "user" &&
            point.services?.some((service) =>
              service.name?.toLowerCase().includes(searchTerm)
            ))
      );
    }

    return filtered;
  }, []);

  // Fonction pour centrer sur la Réunion
  const handleCenterToReunion = () => {
    window.dispatchEvent(new CustomEvent('centerMap', {
      detail: {
        location: [-21.1351, 55.2471],
        zoom: 10
      }
    }));
  };

  // Fonction pour gérer le clic sur un point de la carte
const handleMapPointClick = useCallback((point: MapPoint) => {
  // console.log("Point carte cliqué:", point);
  setSelectedMapPoint(point);
}, []);


  // Fonction pour fermer le modal de détail
  const handleClosePointModal = () => {
    setSelectedMapPoint(null);
  };

  // Fonction pour voir les détails complets (navigation)
  const handleViewDetails = (point: MapPoint) => {
    handleClosePointModal();

    // Navigation vers les détails selon le type
    if (point.type === "property") {
      navigate(`/immobilier/${point.id}`);
    } else if (point.type === "user") {
      navigate(`/professional/${point.id}`);
    }
  };

  // Fonction pour obtenir la géolocalisation utilisateur (MANUELLE uniquement)
  const handleGetUserLocation = () => {
    // Empêcher les appels multiples si déjà en cours
    if (geoLoading) return;
    
    if (!navigator.geolocation) {
      setMapError("La géolocalisation n'est pas supportée par votre navigateur.");
      setUserLocation([-21.1351, 55.2471]);
      handleCenterToReunion();
      return;
    }

    setGeoLoading(true);
    setMapError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setHasPositionBeenFetched(true);
        setGeoLoading(false);
        
        // Centrer la carte sur la position utilisateur
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('centerMap', { 
            detail: { 
              location: [latitude, longitude],
              zoom: 14,
              smooth: true
            } 
          }));
        }, 300);
      },
      (error) => {
        console.error("Erreur géolocalisation:", error);
        setGeoLoading(false);
        setMapError("Impossible d'obtenir votre position. Carte centrée sur la Réunion.");
        setUserLocation([-21.1351, 55.2471]);
        handleCenterToReunion();
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // Fonction pour réinitialiser la position (bouton actualiser)
  const handleRefreshLocation = () => {
    // Réinitialiser l'état pour permettre une nouvelle récupération
    setUserLocation(null);
    setHasPositionBeenFetched(false);
    setGeoLoading(false);
    
    // Forcer une nouvelle récupération immédiate
    handleGetUserLocation();
  };

  // Fonction pour ouvrir le modal de la carte SANS récupérer la position automatiquement
  const handleShowMapModal = () => {
    setShowMapModal(true);
    
    // IMPORTANT: NE PAS récupérer la position automatiquement
    // La position sera récupérée par l'interval de 7 minutes seulement
    
    // Optionnel : centrer sur la Réunion par défaut
    setTimeout(() => {
      handleCenterToReunion();
    }, 100);
  };

  // Ajoutez après l'effet de chargement des données de carte
  useEffect(() => {
    if (!mapLoading && filteredMapPoints.length > 0) {
      // Attendre que la carte soit rendue puis la centrer
      setTimeout(() => {
        handleCenterToReunion();
      }, 500);
    }
  }, [mapLoading, filteredMapPoints]);

  // Initialiser la carte au chargement
  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // ===================================================

  // Fonction pour rediriger vers la connexion
  const redirectToLogin = () => {
    toast.error("Veuillez vous connecter pour effectuer cette action");
    navigate("/login");
  };

  // Récupérer la query depuis l'URL si présente
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlQuery = searchParams.get('q');

    if (urlQuery) {
      setQuery(urlQuery);
      setStage('loading');
      runSearch(urlQuery);
    } else {
      setStage('idle');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [location.search]);

  // Fonctions utilitaires pour les images (garder les existantes)
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    const cleanUrl = url.replace(/[{}"]/g, '').trim();
    try {
      const urlObj = new URL(cleanUrl);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const extractFirstValidImage = (imagesData: any): string => {
    if (!imagesData) return "";

    if (Array.isArray(imagesData)) {
      const validImage = imagesData.find(img => {
        if (typeof img === 'string') {
          return isValidImageUrl(img);
        }
        return false;
      });
      return validImage || "";
    }

    if (typeof imagesData === 'string') {
      const cleanString = imagesData.replace(/[{}"]/g, '');
      const urls = cleanString.split(',')
        .map(url => url.trim())
        .filter(url => isValidImageUrl(url));
      return urls[0] || "";
    }

    return "";
  };

  // NOUVELLE FONCTION : Générer les initiales d'un texte - TAILLE AUGMENTÉE
  const generateInitials = (text: string): string => {
    if (!text) return "??";

    // Supprimer les caractères spéciaux et diviser en mots
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/);

    if (words.length === 0) return "??";

    if (words.length === 1) {
      // Retourner les 2 premiers caractères du mot unique
      return words[0].substring(0, 2).toUpperCase();
    }

    // Retourner la première lettre des deux premiers mots
    return words.slice(0, 2).map(word => word.charAt(0).toUpperCase()).join('');
  };

  // NOUVELLE FONCTION : Obtenir une couleur de fond uni en dark
  const getBackgroundColor = (item: SearchItem): string => {
    const colors = [
      'bg-gray-800',
      'bg-blue-800',
      'bg-green-800',
      'bg-purple-800',
      'bg-indigo-800',
      'bg-teal-800',
      'bg-cyan-800',
      'bg-emerald-800',
    ];

    // Générer un index basé sur le type ou l'ID pour une couleur cohérente
    const seed = item.source_table + item.id.toString();
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;

    return colors[index];
  };

  // Gestion de l'historique
  const addHistory = (q: string) => {
    if (!q) return;
    setSearchHistory((prev) => {
      const withoutDup = prev.filter((i) => i.q.toLowerCase() !== q.toLowerCase());
      const next = [{ q, date: Date.now() }, ...withoutDup].slice(0, 50);
      saveHistory(next);
      return next;
    });
  };

  const loadHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [] as Array<{ q: string; date: number }>;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [] as Array<{ q: string; date: number }>;
    }
  };

  const saveHistory = (list: Array<{ q: string; date: number }>) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    } catch { /* empty */ }
  };

  useEffect(() => {
    setSearchHistory(loadHistory());
  }, []);

  // Fonctions pour gérer l'expansion des éléments
  const toggleItemExpansion = (itemId: string | number, sourceTable: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const uniqueKey = `${itemId}-${sourceTable}`;
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueKey)) {
        newSet.delete(uniqueKey);
      } else {
        newSet.add(uniqueKey);
      }
      return newSet;
    });
  };

  const isItemExpanded = (itemId: string | number, sourceTable: string): boolean => {
    const uniqueKey = `${itemId}-${sourceTable}`;
    return expandedItems.has(uniqueKey);
  };

  // Normalisation des résultats - AMÉLIORÉE pour inclure plus de données
  const normalizeApiResults = (apiResults: any[]): SearchItem[] => {
    return apiResults.map((item) => {
      let title = "";
      let image = "";
      let price: number | undefined;
      let location = "";
      let route = "/";
      let type = item.source || item.source_table;

      switch (item.source || item.source_table) {
        case "Property":
          title = item.title || "Propriété";
          image = extractFirstValidImage(item.images);
          price = item.price;
          location = item.city || "";
          route = `/immobilier/${item.id}`;
          break;

        case "Product":
          title = item.name || "Produit";
          image = extractFirstValidImage(item.images);
          price = item.price;
          route = `/produits/${item.id}`;
          break;

        case "Service":
          title = item.libelle || "Service";
          image = extractFirstValidImage(item.images);
          price = item.price;
          route = `/services`;
          break;

        case "Metier":
          title = item.libelle || "Métier";
          image = extractFirstValidImage(item.images);
          route = `/professionnels`;
          break;

        default:
          title = item.title || item.name || item.libelle || "Élément";
          image = extractFirstValidImage(item.images);
          route = "/";
      }

      return {
        id: item.id,
        title,
        image,
        price,
        location,
        route,
        type: type ? type.toUpperCase() : "UNKNOWN",
        source_table: item.source || item.source_table || "unknown",
        similarity: item.similarity,
        libelle: item.libelle || title,
        description: item.description,
        name: item.name || title,
        images: Array.isArray(item.images) ? item.images : [image].filter(Boolean),
        city: item.city,
        address: item.address
      };
    });
  };

  // Fonctions de recherche existantes
  const removeDuplicates = (results: SearchItem[]): SearchItem[] => {
    const seen = new Set();

    return results.filter(item => {
      const uniqueKey = `${item.id}-${item.source_table}`;
      const titleKey = item.title.toLowerCase().trim();

      if (seen.has(uniqueKey)) {
        return false;
      }

      for (const existingKey of seen.values()) {
        if (typeof existingKey === 'string' && existingKey.includes('-')) {
          const [existingId, existingType] = existingKey.split('-');
          if (existingType === item.source_table &&
            areTitlesSimilar(item.title, existingId)) {
            return false;
          }
        }
      }

      seen.add(uniqueKey);
      return true;
    });
  };

  const areTitlesSimilar = (title1: string, title2: string): boolean => {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');
    const normalized1 = normalize(title1);
    const normalized2 = normalize(title2);

    if (normalized1 === normalized2) return true;

    const longer = Math.max(normalized1.length, normalized2.length);
    const distance = levenshteinDistance(normalized1, normalized2);

    return distance / longer < 0.2;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  const filterResults = (results: SearchItem[]): SearchItem[] => {
    const similarityFiltered = results.filter(item => {
      if (item.similarity === undefined || item.similarity === null) {
        return true;
      }
      return item.similarity;
    });

    return removeDuplicates(similarityFiltered);
  };

  // Recherche avec l'API - MODIFIÉE
  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();

    if (!q) {
      setResults([]);
      setFilteredResults([]);
      setStage("results");
      
      // 🔥 Réafficher TOUTES les données sur la carte
      setFilteredMapPoints(mapPoints);
      
      navigate('/recherche', { replace: true });
      return;
    }

    // Ajouter à l'historique local
    addHistory(q);

    // Enregistrer dans l'historique serveur (asynchrone, ne pas attendre)
    if (isAuthenticated) {
      try {
        await api.post('/suggestions/log', {
          query: q,
          userId: localStorage.getItem("user-id") || undefined,
          resultsCount: 0 // Sera mis à jour après
        });
      } catch (error) {
        console.error("Erreur enregistrement recherche:", error);
      }
    }

    // Mettre à jour la query affichée
    if (searchQuery) {
      setQuery(searchQuery);
    }

    // Afficher la carte modal si elle est cachée
    if (!showMapModal) {
      setShowMapModal(true);
    }

    await runSearch(q);
  };

  // Fonction de recherche principale - MODIFIÉE
  const runSearch = async (q: string) => {
    setStage("loading");
    setResults([]);
    setFilteredResults([]);
    setExpandedItems(new Set());

    const searchParams = new URLSearchParams();
    searchParams.set('q', q);
    navigate(`/recherche?${searchParams.toString()}`, { replace: true });

    try {
      const response = await api.post("/recherche", { prompt: q });
      // console.log("Réponse API:", response.data);

      if (response.data.success && Array.isArray(response.data.results)) {
        const normalizedResults = normalizeApiResults(response.data.results);
        setResults(normalizedResults);
        const filtered = filterResults(normalizedResults);
        setFilteredResults(filtered);
        
        // 🔥 Synchroniser la carte avec les résultats API (filtrés)
        const idsFromResults = filtered.map(r => r.id);

        // Si la table source est "Property", on filtre par id
        const mappedPoints = mapPoints.filter(mp => 
          filtered.some(r => 
            r.id === mp.id && r.source_table === "Property"
          )
        );

        // Mettre à jour les points de carte
        setFilteredMapPoints(mappedPoints);

        // 🔥 Si on a au moins un point → centrer dessus
        if (mappedPoints.length > 0) {
          const p = mappedPoints[0];
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('centerMap', {
              detail: {
                location: [p.latitude, p.longitude],
                zoom: 13,
                smooth: true
              }
            }));
          }, 300);
        }
      } else {
        setResults([]);
        setFilteredResults([]);
      }

      setStage("results");
    } catch (error) {
      console.error("Erreur recherche:", error);
      setResults([]);
      setFilteredResults([]);
      setStage("results");
    }
  };

  const handleSelect = (item: SearchItem) => {
    navigate(item.route);
  };

  // NOUVELLES FONCTIONS POUR LES ACTIONS AVEC VÉRIFICATION AUTH
  const handleDevis = (item: SearchItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    // Préparer les données pour la modale devis
    const prestationData = {
      id: item.id,
      libelle: item.libelle || item.title,
      description: item.description || "Description non disponible",
      images: item.images || [item.image].filter(Boolean)
    };

    setDevisModal({
      isOpen: true,
      prestation: prestationData
    });
  };

  const handleVisite = (item: SearchItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    // Préparer les données pour la modale visite
    const propertyData = {
      id: item.id,
      title: item.title,
      city: item.city,
      address: item.address,
      price: item.price
    };

    setVisiteModal({
      isOpen: true,
      property: propertyData
    });
  };

  const handleAddToCart = async (item: SearchItem, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }

    try {
      // Préparer les données pour le panier
      const cartItem = {
        id: item.id,
        name: item.name || item.title,
        price: item.price || 0,
        quantity: 1,
        images: item.images || [item.image].filter(Boolean)
      };

      // Utiliser la fonction addToCart du contexte
      await addToCart(cartItem);
      toast.success("Produit ajouté au panier avec succès");

    } catch (error) {
      console.error("Erreur ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  // Fonctions pour fermer les modales
  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, prestation: null });
  };

  const closeVisiteModal = () => {
    setVisiteModal({ isOpen: false, property: null });
  };

  const isLoading = stage === "loading";

  // Animation du runner
  useEffect(() => {
    const prev = prevStageRef.current;
    if (stage === "loading") {
      setRunnerVisible(true);
      setRunnerExit(false);
    }
    if (prev === "loading" && stage !== "loading") {
      setRunnerExit(true);
      const t = setTimeout(() => {
        setRunnerVisible(false);
        setRunnerExit(false);
      }, 350);
      prevStageRef.current = stage;
      return () => clearTimeout(t);
    }
    prevStageRef.current = stage;
  }, [stage]);

  const formatPrice = (price: number | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Fonction pour rendre le bouton approprié selon le type
  const renderActionButton = (item: SearchItem) => {
    switch (item.source_table) {
      case "Service":
      case "Metier":
        return (
          <Button
            size="sm"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={(e) => handleDevis(item, e)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Faire un devis
          </Button>
        );

      case "Property":
        return (
          <Button
            size="sm"
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={(e) => handleVisite(item, e)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Demande visite
          </Button>
        );

      case "Product":
        return (
          <Button
            size="sm"
            className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={(e) => handleAddToCart(item, e)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Ajouter au panier
          </Button>
        );

      case "BlogArticle":
        return (
          <Button
            size="sm"
            className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(item.route);
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            Lire l'article
          </Button>
        );

      default:
        return null;
    }
  };

  // Rendu de l'image avec fallback aux initiales
  const renderImageWithFallback = (item: SearchItem) => {
    const hasValidImage = item.image && isValidImageUrl(item.image);
    const initials = generateInitials(item.title);
    const bgColor = getBackgroundColor(item);

    if (hasValidImage && item.source_table !== "Metier") {
      return (
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.className = `w-full h-full ${bgColor} flex items-center justify-center text-white`;
                fallbackDiv.innerHTML = `
                  <div class="text-center">
                    <div class="text-4xl font-bold mb-1">${initials}</div>
                    <div class="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white text-xs p-2 text-center">
                      ${item.title}
                    </div>
                  </div>
                `;
                parent.appendChild(fallbackDiv);
              }
            }}
          />
          <div className="absolute top-2 right-2">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {item.type}
            </span>
          </div>
          {item.similarity && (
            <div className="absolute top-2 left-2">
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {Math.round(item.similarity)}%
              </span>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <div className={`w-full h-full ${bgColor} flex items-center justify-center text-white`}>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{initials}</div>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {item.type}
          </span>
        </div>
        {item.similarity && (
          <div className="absolute top-2 left-2">
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              {Math.round(item.similarity)}%
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-white p-2">
          <div className="text-xs font-medium truncate">{item.title}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen absolute z-50 w-full bg-gray-100 flex flex-col">
      <main className="flex-1 pt-1">
        <div className="container mx-auto px-4">
          {/* Barre de recherche normale (non fixe) */}
          <div className="mb-6">
            <div className="p-4 flex items-center gap-3">
              <div className="p-1 lg:block hidden">
                <ServoLogo />
              </div>

              <div className="relative bg-white rounded-lg flex-1">
                <Search className="absolute lg:block hidden left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <AutoSuggestInput
                  value={query}
                  onChange={setQuery}
                  onSearch={handleSearch}
                  placeholder="Rechercher un bien, service, article..."
                  disabled={isLoading}
                />

                {/* Bouton Rechercher - Desktop */}
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 min-w-24 bg-logo hover:bg-primary-dark overflow-hidden text-sm"
                >
                  {runnerVisible ? (
                    <span className="inline-flex items-center">
                      <img
                        src={start}
                        alt="recherche"
                        className={`w-6 transition-transform duration-300 ease-out ${runnerExit ? 'translate-x-[200%]' : 'translate-x-0'}`}
                      />
                      {isLoading ? ' Recherche...' : ''}
                    </span>
                  ) : (
                    isLoading ? "Recherche..." : "Rechercher"
                  )}
                </Button>

                {/* Icône Recherche - Mobile */}
                <Button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  size="icon"
                  variant="ghost"
                  className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-100 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-10 h-full bg-slate-900 rounded-sm grid place-items-center">
                      <Search className="h-10 w-10 z-50 rounded-sm text-slate-100" />
                    </div>
                  )}
                </Button>
              </div>

              <Button
                onClick={() => setHistoryOpen(true)}
                variant="ghost"
                size="icon"
                className="shrink-0 bg-white border-black/60 border"
              >
                <History className="h-5 w-5" />
              </Button>

              <button onClick={handleClose} className="relative w-10 h-10 group transition-all duration-300">
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 transition-all duration-500">
                  <span className="absolute h-0.5 bg-gray-600 group-hover:bg-slate-900 w-11/12 -translate-y-1 group-hover:rotate-45 group-hover:translate-y-0 group-hover:scale-125 transition-all duration-500 origin-center"></span>
                  <span className="absolute h-0.5 bg-gray-600 group-hover:bg-slate-900 w-1/2 translate-y-1 group-hover:-rotate-45 group-hover:translate-y-0 group-hover:w-11/12 group-hover:scale-125 transition-all duration-500 origin-center"></span>
                </span>
              </button>
            </div>
          </div>

          {/* Historique latéral */}
          {historyOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/10 w-screen h-screen overflow-hidden backdrop-blur-sm z-50"
                onClick={() => setHistoryOpen(false)}
              />
              <aside className="absolute z-50 h-96 w-11/12 lg:w-1/2 bg-white border border-gray-200 rounded-xl lg:rounded-b-xl left-1/2 top-0 transform -translate-x-1/2">
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-700" />
                      <span className="text-sm font-semibold text-gray-800">Historique des recherches</span>
                    </div>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => { setSearchHistory([]); saveHistory([]); }}
                    >
                      Vider
                    </button>
                  </div>
                  <div className="flex-1 grid lg:grid-cols-2 grid-cols-1 overflow-y-auto">
                    {searchHistory.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">Aucun historique.</div>
                    ) : (
                      <ul className="divide-y">
                        {searchHistory.map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 hover:bg-gray-50 hover:rounded-lg cursor-pointer"
                            onClick={() => {
                              setQuery(item.q);
                              setHistoryOpen(false);
                              setStage('loading');
                              runSearch(item.q);
                            }}
                          >
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {item.q}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(item.date).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </aside>
            </>
          )}

          {/* Contenu des résultats */}
          <div className="max-w-7xl mx-auto">
            {stage === "idle" && (
              <div className="text-center py-20">
                <div className="max-w-2xl mx-auto">
                  <h1 className="-tracking-tighter text-3xl md:text-5xl font-bold text-black/90 mb-4">
                    Recherche avancée
                  </h1>
                  <p className="text-sm text-gray-600 mb-8">
                    Trouvez des biens immobiliers, services, produits et articles
                  </p>
                </div>
              </div>
            )}

            {stage === "loading" && (
              <div className="py-20 flex flex-col items-center justify-center">
                <img src="/chatbot.gif" alt="" className="w-56 h-56" />
                <div className="text-lg text-gray-700 mt-2">
                  Recherche en cours...
                </div>
              </div>
            )}

            {stage === "results" && (
              <div className="pb-8">
                {filteredResults.length > 0 ? (
                  <div>
                    <div className="mb-6 px-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Résultats de recherche
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredResults.map((item, idx) => {
                        const isExpanded = isItemExpanded(item.id, item.source_table);

                        return (
                          <div
                            key={`${item.id}-${item.source_table}-${idx}`}
                            className={`flex flex-col bg-white rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 h-full ${isExpanded ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
                              }`}
                            onClick={(e) => toggleItemExpansion(item.id, item.source_table, e)}
                          >
                            {renderImageWithFallback(item)}

                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                                {item.title}
                              </h3>

                              {(item.price || item.location) && (
                                <div className="mt-auto space-y-1">
                                  {item.price && (
                                    <div className="text-lg font-bold text-blue-600">
                                      {formatPrice(item.price)}
                                    </div>
                                  )}
                                  {item.location && (
                                    <div className="text-sm text-gray-600 flex items-center">
                                      <PositionIcon className="w-4 h-4 mr-1" />
                                      {item.location}
                                    </div>
                                  )}
                                </div>
                              )}

                              {!item.price && !item.location && (
                                <div className="mt-2 text-sm text-gray-500">
                                  {item.source_table === 'Service' && 'Service professionnel'}
                                  {item.source_table === 'Metier' && 'Expert métier'}
                                  {item.source_table === 'BlogArticle' && 'Article de blog'}
                                </div>
                              )}

                              {isExpanded && renderActionButton(item)}

                              <div className="mt-2 text-center">
                                <div className="text-xs text-blue-600 font-medium">
                                  {isExpanded ? 'Cliquer pour réduire' : 'Cliquer pour voir les actions'}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    {query.trim() ? (
                      <>
                        <div className="text-2xl font-semibold text-gray-900 mb-4">
                          Aucun résultat trouvé
                        </div>
                        <div className="text-gray-600 max-w-2xl mx-auto">
                          {results.length > 0 ? (
                            <p>
                              {results.length} résultat(s) trouvé(s) mais aucun ne dépasse le seuil de similarité de 50% ou sont des doublons.
                              Essayez d'autres mots-clés ou vérifiez l'orthographe.
                            </p>
                          ) : (
                            <p>
                              Aucun résultat ne correspond à votre recherche. Essayez d'autres mots-clés ou vérifiez l'orthographe.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
                        <div className="text-center space-y-4">
                          <div className="text-5xl azonix font-semibold text-gray-400">
                            Veuillez saisir un terme de recherche.
                          </div>
                        </div>

                        <div className="w-full max-w-4xl">
                          <div className="relative rounded-2xl overflow-hidden drop-shadow-lg">
                            <video
                              className="w-52 h-52 mx-auto object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                            >
                              <source
                                src="/vids.webm"
                                type="video/webm"
                              />
                            </video>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* // =============== MODAL DE LA CARTE (CENTRÉ ET AGRANDI) =============== */}
      {showMapModal && (
        <div className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden
          // Mobile: prend tout l'écran sauf padding haut
          top-16 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-[calc(100vh-8rem)]
          // Tablet: taille plus grande et centrée
          md:top-20 md:w-[calc(100%-2rem)] md:h-[calc(100vh-10rem)] md:max-w-4xl
          // Desktop: taille complète avec padding
          lg:w-[90vw] lg:h-[80vh] lg:max-w-6xl"
        >
          {/* Header de la carte */}
          <div className="bg-white p-3 md:p-4 border-b flex items-center justify-between flex-wrap gap-2 z-[9999]">
            <div className="flex items-center z-50 gap-2 md:gap-3 flex-1 min-w-0">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-blue-600 flex-shrink-0" />
              <span className="font-semibold text-sm md:text-base truncate">
                Carte de la Réunion
              </span>
              <div className="hidden md:flex items-center gap-2 ml-3">
                <span className="text-xs md:text-sm bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1.5 rounded">
                  {filteredMapPoints.length} points
                </span>
                {userLocation && hasPositionBeenFetched && (
                  <span className="text-xs md:text-sm bg-green-100 text-green-800 px-2 py-1 md:px-3 md:py-1.5 rounded">
                    Position active
                  </span>
                )}
              </div>
            </div>
            
            {/* Badges mobiles */}
            <div className="flex md:hidden gap-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {filteredMapPoints.length}
              </span>
              {userLocation && hasPositionBeenFetched && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Position
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 md:gap-2">
              {/* Bouton pour obtenir la position (une seule fois) */}
              {!hasPositionBeenFetched ? (
                <button
                  onClick={handleGetUserLocation}
                  disabled={geoLoading}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 transition-colors"
                  title={geoLoading ? "Récupération..." : "Obtenir ma position"}
                >
                  {geoLoading ? (
                    <Loader className="h-4 w-4 md:h-5 md:w-5 text-purple-600 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  )}
                </button>
              ) : (
                /* Bouton pour actualiser la position manuellement */
                <button
                  onClick={handleRefreshLocation}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Actualiser ma position"
                >
                  <RefreshCw className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </button>
              )}
              
              <button
                onClick={handleCenterToReunion}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Centrer sur la Réunion"
              >
                <TreePalm className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
              </button>

              <button
                onClick={() => setShowMapModal(false)}
                className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Fermer la carte"
              >
                <X className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenu de la carte */}
          <div className="h-[calc(100%-220px)] overflow-hidden md:h-[calc(100%-130px)] bg-gray-100 relative">
            {mapLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader className="h-8 w-8 md:h-10 md:w-10 animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 md:mt-3 text-sm md:text-base text-gray-600">
                    Chargement de la carte...
                  </p>
                </div>
              </div>
            ) : mapError ? (
              <div className="h-full flex items-center justify-center p-4 md:p-6">
                <div className="text-center">
                  <p className="text-sm md:text-base text-red-600">{mapError}</p>
                  <button
                    onClick={loadMapData}
                    className="mt-2 md:mt-3 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Log de debug */}
                
                
               <GenericMap
                points={filteredMapPoints}
                userLocation={userLocation}
                center={defaultCenter}
                zoom={10}
                onPointClick={handleMapPointClick}
              />

                
                {/* Overlay de debug */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/70 text-white text-xs md:text-sm px-2 py-1 md:px-3 md:py-1.5 rounded pointer-events-none">
                  {filteredMapPoints.length} points
                </div>
              </>
            )}
          </div>

          {/* Footer avec statistiques */}
          <div className="bg-white p-2 md:p-3 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex flex-wrap gap-3 md:gap-4">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                <span className="text-xs md:text-sm text-gray-700">
                  {mapPoints.filter(p => p.type === "user").length} partenaires
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 md:gap-2">
                <Home className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                <span className="text-xs md:text-sm text-gray-700">
                  {mapPoints.filter(p => p.type === "property").length} propriétés
                </span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/carte')}
              className="text-xs md:text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors self-end sm:self-auto"
            >
              Voir carte complète →
            </button>
          </div>
        </div>
      )}

      {/* Bouton pour réafficher la carte si cachée */}
      {!showMapModal && (
        <button
          onClick={handleShowMapModal}
          className="fixed z-40 p-3 bg-logo hover:bg-primary-dark text-white rounded-full shadow-lg transition-colors
            // Mobile: plus petit
            bottom-4 right-4
            // Desktop: taille normale
            md:bottom-8 md:right-8"
          title="Afficher la carte"
        >
          <MapPin className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      )}

      {/* Modal des détails du point (comme dans MapPage) */}
      <PointDetailsModal
        point={selectedMapPoint}
        onClose={handleClosePointModal}
        onViewDetails={handleViewDetails}
      />

      {/* Modal des résultats 5km (comme dans MapPage) */}
      {showNearbyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Points à proximité</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Points dans un rayon de 5km autour de votre position
                  </p>
                </div>
                <button
                  onClick={() => setShowNearbyModal(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="flex-1 overflow-y-auto p-6">
              {nearbyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Recherche des points à proximité...</span>
                </div>
              ) : nearbyPoints.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun point trouvé dans un rayon de 5km.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearbyPoints.map((point) => (
                    <div
                      key={`${point.id}-${point.type}`}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedMapPoint(point);
                        setShowNearbyModal(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{point.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {point.type === "user" ? "👤 Partenaire" : "🏠 Propriété"}
                            {point.city && ` • ${point.city}`}
                          </p>
                        </div>
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Cliquez sur un résultat pour voir les détails
              </p>
              <button
                onClick={() => setShowNearbyModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      {devisModal.isOpen && (
        <DevisModal
          isOpen={devisModal.isOpen}
          onClose={closeDevisModal}
          prestation={devisModal.prestation}
        />
      )}

      {visiteModal.isOpen && (
        <ModalDemandeVisite
          open={visiteModal.isOpen}
          onClose={closeVisiteModal}
          property={visiteModal.property}
        />
      )}
    </div>
  );
};

export default Recherche;