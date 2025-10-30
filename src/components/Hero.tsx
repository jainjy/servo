import { Search, Loader2, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import heroImage from "@/assets/hero-house.jpg";
import "../styles/font.css";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import start from '/run.gif'
import '../styles/font.css'
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

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
}

type Stage = "idle" | "loading" | "results";

const Hero = () => {
  const [heroQuery, setHeroQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [runnerVisible, setRunnerVisible] = useState(false);
  const [runnerExit, setRunnerExit] = useState(false);
  const prevStageRef = useRef<Stage>("idle");
  const navigate = useNavigate();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<Array<{ q: string; date: number }>>([]);
  const HISTORY_KEY = "hero-search-history";

  // Fonctions utilitaires pour les images
  const getSafeImageUrl = (images: any): string => {
    if (!images) return "";
    
    // Cas 1: Images est une string contenant des URLs séparées par des virgules
    if (typeof images === 'string' && images.includes('http')) {
      // Extraire la première URL valide
      const urls = images.split(',').map((url: string) => url.trim());
      const validUrl = urls.find(url => isValidImageUrl(url));
      return validUrl || "";
    }
    
    // Cas 2: Images est un tableau d'URLs
    if (Array.isArray(images) && images.length > 0) {
      // Prendre le premier élément valide du tableau
      const validImage = images.find(img => isValidImageUrl(img));
      return validImage || "";
    }
    
    // Cas 3: Images est une string simple (URL unique)
    if (typeof images === 'string' && isValidImageUrl(images)) {
      return images;
    }
    
    return "";
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Nettoyer l'URL des caractères problématiques
    const cleanUrl = url
      .replace(/[{}"]/g, '') // Supprimer les { } et "
      .trim();
    
    // Vérifier que c'est une URL valide
    try {
      const urlObj = new URL(cleanUrl);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const extractFirstValidImage = (imagesData: any): string => {
    if (!imagesData) return "";
    
    // Cas 1: Tableau d'URLs
    if (Array.isArray(imagesData)) {
      const validImage = imagesData.find(img => {
        if (typeof img === 'string') {
          return isValidImageUrl(img);
        }
        return false;
      });
      return validImage || "";
    }
    
    // Cas 2: String avec URLs séparées par des virgules
    if (typeof imagesData === 'string') {
      // Nettoyer la string
      const cleanString = imagesData.replace(/[{}"]/g, '');
      const urls = cleanString.split(',')
        .map(url => url.trim())
        .filter(url => isValidImageUrl(url));
      
      return urls[0] || "";
    }
    
    return "";
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
    } catch { }
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
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap
        .timeline()
        .fromTo(
          "#hero",
          { opacity: 0, y: -100 },
          { y: 0, opacity: 1, delay: 4, duration: 1.5, ease: "power2.out" }
        )
        .fromTo(
          "#hero h1",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          "-=1"
        );
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    setSearchHistory(loadHistory());
  }, []);

  const openModal = () => {
    setModalOpen(true);
    setStage("idle");
    setQuery(heroQuery || "");
    setResults([]);
  };

  // Fonction pour normaliser les résultats de l'API
  const normalizeApiResults = (apiResults: any[]): SearchItem[] => {
    return apiResults.map((item) => {
      let title = "";
      let image = "";
      let price: number | undefined;
      let location = "";
      let route = "/";
      let type = item.source_table;

      // Gestion selon la table source
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
          route = `/produits/${item.slug || item.id}`;
          break;

        case "BlogArticle":
          title = item.title || "Article";
          image = extractFirstValidImage(item.coverUrl || item.images);
          route = `/blog/${item.slug || item.id}`;
          break;

        case "Service":
          title = item.libelle || "Service";
          price = item.price;
          route = `/services`;
          break;

        case "Metier":
          title = item.libelle || "Métier";
          // Pas d'image pour les métiers
          image = "";
          route = `/professionnels`;
          break;

        default:
          title = item.title || item.name || item.libelle || "Élément";
          route = "/";
      }

      // Images de fallback pour les propriétés sans image valide (sauf pour Metier)
      if (item.source_table !== "Metier" && (!image || !isValidImageUrl(image))) {
        const fallback = [property1, property2, property3][Math.floor(Math.random() * 3)];
        image = fallback;
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
        similarity: item.similarity
      };
    });
  };

  // Recherche avec l'API
  const runSearch = async (q: string) => {
    setStage("loading");
    setResults([]);
    
    try {
      const response = await api.post("/recherche", { prompt: q });
      
      if (response.data.success && Array.isArray(response.data.results)) {
        const normalizedResults = normalizeApiResults(response.data.results);
        setResults(normalizedResults);
      } else {
        setResults([]);
      }
      
      setStage("results");
    } catch (error) {
      console.error("Erreur recherche:", error);
      setResults([]);
      setStage("results");
    }
  };

  const handleModalSearch = async () => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStage("results");
      return;
    }
    await runSearch(q);
    addHistory(q);
  };

  const handleSelect = (item: SearchItem) => {
    setModalOpen(false);
    navigate(item.route);
  };

  const isLoading = stage === "loading";

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

  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const requestRef = useRef<number | null>(null);

  const animate = () => {
    setCurrentRotation((prev) => {
      const lerp = 0.08;
      const newX = prev.x + (targetRotation.x - prev.x) * lerp;
      const newY = prev.y + (targetRotation.y - prev.y) * lerp;
      return { x: newX, y: newY };
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetRotation]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const parent = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - parent.left) / parent.width - 0.5;
    const y = (e.clientY - parent.top) / parent.height - 0.5;

    const rotateY = x * -25;
    const rotateX = y * 20;

    setTargetRotation({ x: rotateX, y: rotateY });

    const lightX = ((e.clientX - parent.left) / parent.width) * 100;
    const lightY = ((e.clientY - parent.top) / parent.height) * 100;
    setLightPosition({ x: lightX, y: lightY, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setTargetRotation({ x: 0, y: 0 });
    setLightPosition({ x: 50, y: 50, opacity: 0 });
  };

  // Fonction pour formater le prix
  const formatPrice = (price: number | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <>
      <section 
        id="hero" 
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="perspective-[500px] w-full h-screen rounded-lg bg-black overflow-hidden absolute" 
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            style={{ 
              transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) scale(1.05)` 
            }} 
          />
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,${lightPosition.opacity}) 0%, transparent 60%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 lg:mt-0 -mt-2 text-2xl md:text-5xl lg:text-7xl tracking-wide font-bold text-white">
            La super-application
            <br />
            de l'habitat
          </h1>

          <p className="mb-12 text-xl text-white drop-shadow-md">
            Immobilier, services et produits — tout en un, guidé par l'IA
          </p>

          <div className="mx-auto max-w-3xl">
            <div 
              className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl cursor-text" 
              onClick={openModal}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  onFocus={openModal}
                  readOnly
                  placeholder="Cliquez pour lancer une recherche avancée"
                  className="pl-12 h-12 border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" className="md:w-auto pointer-events-none">
                Rechercher
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="p-0 border-0 sm:max-w-[100vw] rounded-lg sm:w-[80vw] h-[80vh] lg:h-[90vh] overflow-hidden w-11/12 max-w-none bg-white">
            <div className="relative w-full h-full flex flex-col">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Fermer"
                className="group absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 shadow hover:bg-white transition"
              >
                <span className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 h-0.5 w-6 bg-gray-800 transition-all duration-300 group-hover:rotate-45 group-hover:top-1/2"></span>
                <span className="absolute left-1/2 top-[65%] -translate-x-1/2 -translate-y-1/2 h-0.5 w-4 bg-gray-800 transition-all duration-300 group-hover:-rotate-45 group-hover:w-6 group-hover:top-1/2"></span>
              </button>

              <button
                type="button"
                onClick={() => setHistoryOpen((s) => !s)}
                aria-label="Historique"
                className="group absolute top-4 left-4 z-50 w-10 h-10 rounded-full bg-white/80 backdrop-blur border border-gray-200 shadow hover:bg-white transition flex items-center justify-center"
              >
                <History className="h-5 w-5 text-gray-700" />
              </button>

              {historyOpen && (
                <div
                  className="absolute inset-0 bg-black/10 z-40"
                  onClick={() => setHistoryOpen(false)}
                />
              )}

              <aside
                className={`absolute top-0 left-0 z-50 h-full w-60 lg:w-72 bg-white border-r border-gray-200 shadow-xl transform rounded-e-2xl transition-transform duration-300 ${
                  historyOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
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

              {stage !== "idle" && (
                <div className="sticky lg:top-0 top-12 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
                  <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="pl-9 h-11"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleModalSearch();
                          }
                        }}
                      />
                    </div>
                    <Button onClick={handleModalSearch} disabled={isLoading} className="h-11 min-w-32 overflow-hidden">
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
              )}

              <div className="flex-1 overflow-auto">
                {stage === "idle" && (
                  <div className="h-full w-full flex items-center justify-center p-6">
                    <div className="w-full max-w-2xl">
                      <div className="text-center mb-6">
                        <h2 className="redhawk text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                          Recherche avancée
                        </h2>
                        <p className="text-gray-600">
                          Saisissez un mot-clé (ex: ville, type de bien, caractéristiques)
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                        <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              autoFocus
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Ex - 2 chambres, Saint-Pierre, < 300 000 €"
                              className="pl-10 h-12"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleModalSearch();
                                }
                              }}
                            />
                          </div>
                          <Button size="lg" className="h-12 min-w-32" onClick={handleModalSearch}>
                            Rechercher
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {stage === "loading" && (
                  <div className="h-full w-full flex flex-col items-center justify-center p-6">
                    <LoadingSpinner size="lg" text="Recherche en cours" />
                  </div>
                )}

                {stage === "results" && (
                  <div className="h-full flex flex-col overflow-y-auto">
                    <div>
                      <div className="max-w-6xl mx-auto p-4 flex-1 overflow-auto">
                        {results.length > 0 ? (
                          <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                            <div className="overflow-auto">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-96 gap-4 pb-4">
                                {results.map((item, idx) => (
                                  <div
                                    key={item.id ?? idx}
                                    className="flex flex-col bg-white rounded-xl border border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-200"
                                    onClick={() => handleSelect(item)}
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
                                    
                                    {/* Pour les métiers, afficher un placeholder ou rien */}
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
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center py-20 text-center text-gray-600">
                            {query.trim() ? (
                              <>
                                <div className="text-lg font-semibold mb-2">
                                  Désolé, aucun résultat ne correspond à votre demande.
                                </div>
                                <div className="text-sm">
                                  Essayez d'autres mots-clés ou vérifiez l'orthographe.
                                </div>
                              </>
                            ) : (
                              <div className="text-lg font-semibold">
                                Veuillez saisir un terme de recherche.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
};

export default Hero;