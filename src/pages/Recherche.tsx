import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, History, ArrowLeft, ShoppingCart, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import api from "@/lib/api";
import start from '/run.gif';
import { DevisModal } from "@/components/TravauxSection";
import { ModalDemandeVisite } from "@/components/PropertyListings";
// Import du contexte panier  
import { useCart } from "@/components/contexts/CartContext";
import { toast } from "sonner";

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

const Recherche = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
      let type = item.source_table;

      switch (item.source_table) {
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

        case "BlogArticle":
          title = item.title || "Article";
          image = extractFirstValidImage(item.coverUrl || item.images);
          route = `/blog/${item.slug || item.id}`;
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
        type: type.toUpperCase(),
        source_table: item.source_table,
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
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Barre de recherche fixe */}
        {/* Barre de recherche normale (non fixe) */}
<div className="bg-white border border-gray-200 rounded-2xl shadow-lg mb-6">
  <div className="p-4 flex items-center gap-3">
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(-1)}
      className="shrink-0"
    >
      <ArrowLeft className="h-5 w-5" />
    </Button>
    
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher un bien, service, article..."
        className="pl-10 h-12 text-lg border-0 bg-transparent focus-visible:ring-0"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
      />
    </div>
    
    <Button
      onClick={() => setHistoryOpen(true)}
      variant="ghost"
      size="icon"
      className="shrink-0"
    >
      <History className="h-5 w-5" />
    </Button>
    
    <Button 
      onClick={handleSearch} 
      disabled={isLoading} 
      className="h-12 min-w-32 overflow-hidden"
    >
      {runnerVisible ? (
        <span className="inline-flex items-center">
          <img
            src={start}
            alt="recherche"
            className={`w-10 transition-transform duration-300 ease-out ${
              runnerExit ? 'translate-x-[200%]' : 'translate-x-0'
            }`}
          />
          {isLoading ? ' Recherche...' : ''}
        </span>
      ) : (
        isLoading ? "Recherche..." : "Rechercher"
      )}
    </Button>
  </div>
</div>

          {/* Historique latéral */}
          {historyOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-40 mt-20"
                onClick={() => setHistoryOpen(false)}
              />
              <aside className="fixed top-20 left-0 z-50 h-[calc(100vh-5rem)] w-80 bg-white border-r border-gray-200 shadow-xl">
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
                  <div className="flex-1 overflow-y-auto">
                    {searchHistory.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">Aucun historique.</div>
                    ) : (
                      <ul className="divide-y">
                        {searchHistory.map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 hover:bg-gray-50 cursor-pointer"
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
                  <h1 className="redhawk text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                    Recherche avancée
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    Trouvez des biens immobiliers, services, produits et articles
                  </p>
                </div>
              </div>
            )}

            {stage === "loading" && (
              <div className="py-20 flex flex-col items-center justify-center">
                <LoadingSpinner size="lg" text="Recherche en cours" />
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
                            className={`flex flex-col bg-white rounded-xl border border-gray-200 cursor-pointer transition-all duration-200 h-full ${
                              isExpanded ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
                            }`}
                            onClick={(e) => toggleItemExpansion(item.id, item.source_table, e)}
                          >
                            {/* Image - Ne pas afficher pour les métiers */}
                            {item.image && item.source_table !== "Metier" && (
                              <div className="relative h-48 overflow-hidden rounded-t-xl">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                  loading="lazy"
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
                            )}
                            
                            {/* Pour les métiers, afficher un placeholder */}
                            {item.source_table === "Metier" && (
                              <div className="relative h-24 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-t-xl flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl mb-1">👨‍💼</div>
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
                              </div>
                            )}
                            
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
                                      📍 {item.location}
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
                      <div className="text-2xl font-semibold text-gray-900">
                        Veuillez saisir un terme de recherche.
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