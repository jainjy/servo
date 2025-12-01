import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, History, ArrowLeft, ShoppingCart, Calendar, FileText, Play, RefreshCw, Home } from "lucide-react";
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

  // Contexte panier
  const { addToCart } = useCart();

  // Vérification de l'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuthentication();
  }, []);

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
      'bg-gray-800', // Gris foncé
      'bg-blue-800', // Bleu foncé
      'bg-green-800', // Vert foncé
      'bg-purple-800', // Violet foncé
      'bg-indigo-800', // Indigo foncé
      'bg-teal-800', // Teal foncé
      'bg-cyan-800', // Cyan foncé
      'bg-emerald-800', // Émeraude foncé
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

  // Gestion de l'historique (garder les fonctions existantes)
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

  const addHistory = (q: string) => {
    if (!q) return;
    setSearchHistory((prev) => {
      const withoutDup = prev.filter((i) => i.q.toLowerCase() !== q.toLowerCase());
      const next = [{ q, date: Date.now() }, ...withoutDup].slice(0, 50);
      saveHistory(next);
      return next;
    });
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
        // CORRECTION : utiliser item.source au lieu de item.source_table
        let type = item.source || item.source_table;

        // CORRECTION : utiliser item.source dans le switch
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

          // case "BlogArticle":
          //   title = item.title || "Article";
          //   image = extractFirstValidImage(item.coverUrl || item.images);
          //   route = `/blog/${item.slug || item.id}`;
          //   break;

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
          type: type ? type.toUpperCase() : "UNKNOWN", // ← Ajouter une vérification
          // CORRECTION : utiliser source au lieu de source_table
          source_table: item.source || item.source_table || "unknown",
          similarity: item.similarity,
          // Données supplémentaires pour les modales
          libelle: item.libelle || title,
          description: item.description,
          name: item.name || title,
          images: Array.isArray(item.images) ? item.images : [image].filter(Boolean),
          city: item.city,
          address: item.address
        };
      });
    };

  // Fonctions de recherche existantes (garder removeDuplicates, areTitlesSimilar, levenshteinDistance, filterResults)

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

  // Recherche avec l'API
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
   console.log("Réponse API:", response.data);

      if (response.data.success && Array.isArray(response.data.results)) {
        const normalizedResults = normalizeApiResults(response.data.results);
        setResults(normalizedResults);
        const filtered = filterResults(normalizedResults);
        setFilteredResults(filtered);
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

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setFilteredResults([]);
      setStage("results");
      navigate('/recherche', { replace: true });
      return;
    }
    await runSearch(q);
    addHistory(q);
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

  // Animation du runner (garder existant)
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
      // Utilisez source_table qui a été corrigé dans normalizeApiResults
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

        // Ajoutez d'autres cas si nécessaire
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

  // NOUVELLE FONCTION : Rendu de l'image avec fallback aux initiales - MODIFIÉE
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
              // Si l'image échoue au chargement, on la remplace par les initiales
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

    // Afficher les initiales si pas d'image valide ou si c'est un métier
    return (
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <div className={`w-full h-full ${bgColor} flex items-center justify-center text-white`}>
          <div className="text-center">
            {/* TAILLE DE L'INITIALE AUGMENTÉE - text-4xl au lieu de text-3xl */}
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
        {/* BACKGROUND COLOR UNI EN DARK AU-DESSOUS DE L'ÉCRITURE */}
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
              <div className="p-1 lg:block hidden rounded-full bg-white border-black border-2">
                <img
                  src={logo}
                  alt="Servo Logo"
                  className="w-10 h-10 rounded-full"
                />
              </div>

              <div className="relative bg-white rounded-lg flex-1">
                <Search className="absolute lg:block hidden left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                <Input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher un bien, service, article..."
                  className="pl-2 lg:pl-10 pr-12 lg:pr-10 h-12 text-lg border-0 bg-transparent focus-visible:ring-0"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />

                {/* Bouton Rechercher - Desktop */}
                <Button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 h-10 min-w-24 bg-black/90 hover:bg-black overflow-hidden text-sm"
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
                  onClick={handleSearch}
                  disabled={isLoading}
                  size="icon"
                  variant="ghost"
                  className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-100 hover:text-gray-900 hover:bg-gray-100"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-10 h-full bg-slate-900 rounded-sm grid place-items-center"> 
                      <Search className="h-10 w-10  z-50 rounded-sm text-slate-100" />
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
              <aside className="absolute z-50 h-96 w-11/12  lg:w-1/2 bg-white border border-gray-200 rounded-xl lg:rounded-b-xl  left-1/2 top-0 transform -translate-x-1/2">
                <div className="h-full flex flex-col">
                  <div className="px-4 py-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-700" />
                      <span className="text-sm font-semibold text-gray-800">Historique</span>
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
                {/* <LoadingSpinner size="lg" text="Recherche en cours" /> */}
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
                            {/* Image avec fallback aux initiales */}
                            {renderImageWithFallback(item)}

                            {/* Contenu */}
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
                                      {/* REMPLACEMENT DE L'EMOJI 📍 PAR LE SVG */}
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

                              {/* Bouton d'action spécifique - affiché seulement si l'élément est étendu */}
                              {isExpanded && renderActionButton(item)}

                              {/* Indicateur d'expansion */}
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
                        {/* Message de recherche */}
                        <div className="text-center space-y-4">
                          <div className="text-5xl azonix font-semibold text-gray-400">
                            Veuillez saisir un terme de recherche.
                          </div>
                        </div>

                        {/* Section Vidéo Autoloop WebM */}
                        <div className="w-full max-w-4xl">

                          {/* Conteneur vidéo autoloop WebM */}
                          <div className="relative rounded-2xl overflow-hidden drop-shadow-lg">
                            {/* Vidéo WebM en autoloop */}
                            <video
                              className="w-52 h-52 mx-auto object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="auto"
                            >
                              {/* Source WebM - Format optimisé pour le web */}
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