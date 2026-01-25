import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Clock,
  MapPin,
  Bed,
  Ruler,
  Wrench,
  Home,
  Car,
  Utensils,
  Search,
  Users,
  Star,
  Heart,
  Eye,
  Share2,
  Loader2,
} from "lucide-react";
import PartnersPage from "./ServicesPartnersPage/PartnersPage";
import ServicesPage from "./ServicesPartnersPage/ServicesPages";
import ResultatSearch from "../pages/ResultatSearch";
import AdvancedSearchBar from "../components/AdvancedSearchBar";
import Lottie from "lottie-react";
import search from "@/assets/search.json";
import AdvertisementPopup from "@/components/AdvertisementPopup";
import Allpub from "@/components/Allpub";

// Types pour TypeScript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  images: string[];
  metiers?: Array<{ id: string; libelle: string; name?: string }>;
  rating?: number;
  type: "service";
  category?: string;
  tags?: string[];
}

interface Property {
  id: string;
  title: string;
  name?: string;
  description: string;
  price: number;
  address?: string;
  images: string[];
  rooms?: number;
  bathrooms?: number;
  surface?: number;
  rating?: number;
  type: "property";
  propertyType?: "maison" | "appartement" | "terrain" | "commercial";
  tags?: string[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: "product";
  brand?: string;
  tags?: string[];
}

interface Aliment {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  rating?: number;
  type: "aliment";
  origin?: string;
  tags?: string[];
}

type Item = Service | Property | Product | Aliment;

// Types de filtres
interface FilterState {
  search: string;
  type: string[];
  priceRange: [number, number];
  rating: number;
  categories: string[];
}

const ServicesPartnersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Service[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState("default");
  const [services, setServices] = useState<Service[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [aliments, setAliments] = useState<Aliment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour les fonctionnalités avancées
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<
    "default" | "price-asc" | "price-desc" | "rating" | "newest"
  >("default");

  // État des filtres
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: [],
    priceRange: [0, 10000],
    rating: 0,
    categories: [],
  });

  // Fonction pour récupérer toutes les données
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3001";

      // Récupérer tous les services en parallèle
      const [servicesRes, propertiesRes, productsRes, alimentsRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/api/services`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/properties`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/products`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/aliments`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }),
        ]);

      // Traitement des réponses
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(
          Array.isArray(servicesData)
            ? servicesData.map((s: any) => ({ ...s, type: "service" }))
            : []
        );
      }
      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json();
        setProperties(
          Array.isArray(propertiesData)
            ? propertiesData.map((p: any) => ({ ...p, type: "property" }))
            : []
        );
      }
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(
          Array.isArray(productsData)
            ? productsData.map((p: any) => ({ ...p, type: "product" }))
            : []
        );
      }
      if (alimentsRes.ok) {
        const alimentsData = await alimentsRes.json();
        setAliments(
          Array.isArray(alimentsData)
            ? alimentsData.map((a: any) => ({ ...a, type: "aliment" }))
            : []
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les données au chargement
  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync local `searchQuery` to `filters.search` with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchQuery }));
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Gestion de la section URL
  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
    } else {
      setView("services");
    }
  }, [section]);

  const allItems: Item[] = useMemo(() => {
    if (searchResults) {
      return searchResults;
    }
    return [...services, ...properties, ...products, ...aliments];
  }, [services, properties, products, aliments, searchResults]);

  const handleSearch = async (queryParam?: string) => {
    const query = (queryParam ?? searchQuery).trim();

    if (!query) {
      // Si la recherche est vide, réinitialiser aux données d'origine
      setSearchResults(null);
      // Optionnel : vider aussi l'input
      // setSearchQuery('');
      return;
    }

    try {
      setSearchLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

      const response = await fetch(`${API_BASE_URL}/searchservice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.services.map((s: any) => ({
          ...s,
          type: "service",
          name: s.libelle || s.name || "",
          images: s.images || [],
          price: s.price || 0,
          metiers: s.metiers ? (typeof s.metiers === 'string' ? s.metiers.split(", ").map((m: string) => ({ libelle: m })) : s.metiers) : []
        })));
      }
    } catch (error) {
      console.error("Erreur recherche:", error);
      setError("Erreur lors de la recherche");
    } finally {
      setSearchLoading(false);
    }
  };

  // Optionnel : Ajouter une recherche automatique avec debounce
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults(null);
      return;
    }

  }, [searchQuery]);


  // Appliquer les filtres et la recherche
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Recherche par texte
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          (item as any).name?.toLowerCase().includes(searchLower) ||
          (item as any).title?.toLowerCase().includes(searchLower) ||
          (item as any).description?.toLowerCase().includes(searchLower) ||
          (item as any).address?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Filtre par type
      if (filters.type.length > 0 && !filters.type.includes(item.type)) {
        return false;
      }

      // Filtre par prix
      const price = (item as any).price || 0;
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Filtre par rating
      const rating = (item as any).rating || 0;
      if (rating < filters.rating) {
        return false;
      }

      // Filtre par catégories
      if (filters.categories.length > 0) {
        const itemCategory =
          (item as any).category || (item as any).propertyType;
        if (!itemCategory || !filters.categories.includes(itemCategory)) {
          return false;
        }
      }

      return true;
    });
  }, [allItems, filters]);

  // Trier les items
  const sortedItems = useMemo(() => {
    const items = [...filteredItems];
    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return items.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "rating":
        return items.sort(
          (a, b) => ((b as any).rating || 0) - ((a as any).rating || 0)
        );
      case "newest":
        return items.reverse();
      default:
        return items;
    }
  }, [filteredItems, sortBy]);

  // Statistiques
  const stats = useMemo(
    () => ({
      services: services.length,
      properties: properties.length,
      products: products.length,
      aliments: aliments.length,
      total: allItems.length,
      filtered: filteredItems.length,
    }),
    [services, properties, products, aliments, allItems, filteredItems]
  );

  // Configuration des couleurs par type
  const getTypeConfig = (type: string) => {
    const configs = {
      service: {
        color: "#10B981",
        lightColor: "#D1FAE5",
        icon: Wrench,
        label: "Service",
        gradient: "from-emerald-50 to-emerald-100",
        border: "border-emerald-200",
        badge: "bg-emerald-100 text-emerald-800",
      },
      property: {
        color: "#8B5CF6",
        lightColor: "#EDE9FE",
        icon: Home,
        label: "Immobilier",
        gradient: "from-violet-50 to-violet-100",
        border: "border-violet-200",
        badge: "bg-violet-100 text-violet-800",
      },
      product: {
        color: "#3B82F6",
        lightColor: "#DBEAFE",
        icon: Car,
        label: "Produit",
        gradient: "from-blue-50 to-blue-100",
        border: "border-blue-200",
        badge: "bg-blue-100 text-blue-800",
      },
      aliment: {
        color: "#EF4444",
        lightColor: "#FEE2E2",
        icon: Utensils,
        label: "Aliment",
        gradient: "from-red-50 to-red-100",
        border: "border-red-200",
        badge: "bg-red-100 text-red-800",
      },
    };
    return configs[type as keyof typeof configs] || configs.service;
  };

  // NOTE: Search bar handled by shared component `AdvancedSearchBar` (imported)
  // We keep search state `searchQuery`, `searchResults`, `searchLoading` here and pass handlers as needed.
  // No local function component to avoid remounting the input and losing focus.

  // Generate categories and metiers lists for AdvancedSearchBar props
  const categoriesList = useMemo(() => {
    const setC = new Set<string>();
    services.forEach((s) => s.category && setC.add(s.category));
    products.forEach((p) => p.category && setC.add(p.category));
    aliments.forEach((a) => a.category && setC.add(a.category));
    properties.forEach((p) => p.propertyType && setC.add(p.propertyType));
    return Array.from(setC);
  }, [services, products, aliments, properties]);

  const metiersList = useMemo(() => {
    const setM = new Set<string>();
    services.forEach((s) =>
      s.metiers?.forEach((m) => {
        if (m.libelle) setM.add(m.libelle);
        else if (m.name) setM.add(m.name);
      })
    );
    return Array.from(setM);
  }, [services]);


  // Composant de carte d'item
  const ItemCard = ({ item, index }: { item: Item; index: number }) => {
    const config = getTypeConfig(item.type);
    const IconComponent = config.icon;
    const displayName =
      (item as any).name || (item as any).title || config.label;
    const displayPrice = item.price;
    const displayDescription =
      (item as any).description || "Aucune description disponible";
    const images = (item as any).images || [];
    const isFavorite = favorites.has(item.id);

    return (
      <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
        {/* Badge de type */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge} flex items-center gap-1`}
          >
            <IconComponent className="w-3 h-3" />
            {config.label}
          </span>
        </div>

        {/* Bouton favori */}
        <button
          onClick={() => {
            const newFavorites = new Set(favorites);
            if (isFavorite) {
              newFavorites.delete(item.id);
            } else {
              newFavorites.add(item.id);
            }
            setFavorites(newFavorites);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
          />
        </button>

        {/* Image avec overlay */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {images.length > 0 ? (
            <>
              <img
                src={images[0]}
                alt={displayName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Prix overlay */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <span className="font-bold text-xl text-gray-900">
                {typeof displayPrice === "number"
                  ? displayPrice.toLocaleString()
                  : displayPrice}{" "}
                €
              </span>
              {item.type === "service" && (item as Service).duration && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {(item as Service).duration} min
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {displayName}
          </h3>

          {/* Adresse pour les propriétés */}
          {(item as Property).address && (
            <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{(item as Property).address}</span>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {displayDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.type === "service" &&
              (item as Service).metiers?.slice(0, 2).map((metier, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                >
                  {metier.libelle || metier.name}
                </span>
              ))}
            {(item as Property).propertyType && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                {(item as Property).propertyType}
              </span>
            )}
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Services */}
            {(item as Service).duration && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>{(item as Service).duration} min</span>
              </div>
            )}

            {/* Immobilier */}
            {(item as Property).rooms && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bed className="w-4 h-4 text-violet-500" />
                <span>{(item as Property).rooms} chambres</span>
              </div>
            )}
            {(item as Property).surface && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Ruler className="w-4 h-4 text-violet-500" />
                <span>{(item as Property).surface}m²</span>
              </div>
            )}

            {/* Rating */}
            {(item as any).rating && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{(item as any).rating}/5</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
              onClick={() => {
                navigate(`/item/${item.type}/${item.id}`);
              }}
            >
              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Voir détails
            </button>
            <button
              className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Lien copié !");
              }}
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 antialiased">
      {/* Header amélioré */}
      <header className="relative overflow-hidden">
        {/* Background avec gradient */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1920')] opacity-10 bg-cover bg-center"></div>
          <div className="absolute inset-0 backdrop-blur-md"></div>
        </div>

        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4 pt-20 pb-10">
            {/* Titres */}
            <div className="text-center mb-12">
              <h1 className="text-xl lg:text-3xl font-medium uppercase text-white mb-4 leading-tight">
                {view === "default"
                  ? "Découvrez Notre Univers"
                  : view === "partenaires"
                    ? "Trouvers nos Partenaires d'Excellence par leur metiers"
                    : view === "services"
                      ? "Tous nos Services"
                      : "Centre d'Aide"}
              </h1>
              <p className="text-sm text-emerald-100 max-w-2xl mx-auto">
                {view === "default"
                  ? "L'excellence à portée de clic : services, biens, produits et plus encore"
                  : view === "partenaires"
                    ? "Des experts sélectionnés pour votre réussite"
                    : view === "services"
                      ? "Des prestations de qualité pour tous vos besoins"
                      : "Nous sommes là pour vous accompagner"}
              </p>
            </div>

            {/* Boutons de navigation */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() =>
                  navigate("/services-partners?section=prestations")
                }
                className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${view === "services"
                  ? "bg-white text-emerald-700 shadow-2xl transform scale-105"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
              >
                <Wrench className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Tous nos services
                {view === "services"}
              </button>

              <button
                onClick={() =>
                  navigate("/services-partners?section=partenaires")
                }
                className={`group px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${view === "partenaires"
                  ? "bg-white text-violet-700 shadow-2xl transform scale-105"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                  }`}
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Tous les metiers
                {view === "partenaires" && <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <Allpub
            title="Offres spéciales"
            description="Bénéficiez de réductions exclusives sur nos meilleurs services."
            image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
            background="bg-white"
            textbg="text-slate-900"
          />

      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="fixed w-1/2 bottom-0 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Barre de recherche toujours montée : évite le démontage lors de l'affichage des résultats */}

        <AdvancedSearchBar
          onSearch={(filters: any) => {
            const q = (filters && (filters.query || "")) || "";
            setSearchQuery(q);
            // return the promise from handleSearch so AdvancedSearchBar can await it
            return handleSearch(q);
          }}
          categories={categoriesList}
          metiers={metiersList}
        />
        <div className="bg-white mt-5 rounded-lg shadow-lg py-5">
          {searchLoading ? (
            <div className="py-20 flex flex-col items-center justify-center w-full">
              <Lottie animationData={search} loop autoplay className="w-32 lg:w-52" />
              <p className="mt-4 text-gray-600">Recherche en cours...</p>
            </div>
          ) : searchResults !== null ? (
            <ResultatSearch
              searchQuery={searchQuery}
              searchResults={searchResults}
              favorites={favorites}
              setFavorites={setFavorites}
            />

          ) : (
            <>
              {view === "partenaires" && (
                <PartnersPage
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              )}
              {view === "services" && (
                <ServicesPage
                  filters={filters}
                  setFilters={setFilters}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ServicesPartnersPage;