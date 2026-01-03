// components/entretien/Marketplace.tsx
import React, { useEffect, useRef, useState } from "react";
import { 
  ShoppingCart, Shield, CheckCircle, Truck, Star, 
  RefreshCw, ShieldCheck, ThumbsUp, Filter, Search, X,
  TrendingUp, Tag, ChevronRight, Package, Eye, Heart
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/contexts/CartContext";

// Interfaces
interface MarketplaceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  subcategory: string;
  quantity: number;
  featured: boolean;
  slug: string;
  brand?: string;
  viewCount?: number;
  purchaseCount?: number;
  clickCount?: number;
  productType?: string;
  category: string;
  condition?: string;
  warrantyMonths?: number;
  usageYears?: number;
  originalPrice?: number;
  createdAt: string;
}

interface MarketplaceCategory {
  id: string;
  name: string;
  count: number;
  description: string;
}

interface MarketplaceProps {
  onOpenModal: (product: any) => void;
  searchTerm?: string;
}

// Composant SlideIn
const SlideIn = ({ children, direction = "left", delay = 0 }: { 
  children: React.ReactNode; 
  direction?: "left" | "right" | "up" | "down"; 
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant ProductCard
const ProductCard = ({ 
  product, 
  index, 
  onOpenModal,
  onAddToWishlist,
  onAddToCart,
  isInWishlist,
  isAddingToCart,
  viewedProducts
}: { 
  product: MarketplaceProduct; 
  index: number; 
  onOpenModal: (product: MarketplaceProduct) => void;
  onAddToWishlist: (productId: string) => void;
  onAddToCart: (product: MarketplaceProduct) => Promise<void>;
  isInWishlist: boolean;
  isAddingToCart: boolean;
  viewedProducts: Set<string>;
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    onOpenModal(product);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist(product.id);
  };

  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await onAddToCart(product);
  };

  const renderStars = () => {
    // Générer une note aléatoire entre 4.0 et 5.0
    const rating = 4.0 + Math.random() * 1.0;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const discountPercentage = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  const getConditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'comme neuf':
      case 'parfait état':
        return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
      case 'très bon état':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'bon état':
        return 'bg-yellow-100 text-[#556B2F] dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'état vintage':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[#556B2F]  transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          OCCASION
        </div>
        {discountPercentage > 0 && (
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Bouton wishlist */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 shadow-md rounded-full h-8 w-8 flex items-center justify-center transition-all duration-300"
      >
        <Heart 
          className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
        />
      </button>

      {/* Image du produit */}
      <div className="relative h-56 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 flex items-center justify-center">
            <Package className="h-16 w-16 text-yellow-500/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Garantie */}
        <div className="absolute bottom-3 left-3 bg-gray-800/90 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Garantie {product.warrantyMonths || 6} mois
        </div>

        {/* Prix */}
        <div className="absolute bottom-3 right-3 bg-[#556B2F] text-white px-4 py-2 rounded-full shadow-lg font-bold">
          {product.price.toFixed(2)}€
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Catégorie et condition */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                {product.subcategory}
              </span>
              {product.brand && (
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {product.brand}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-[#556B2F] transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Note et condition */}
        <div className="flex items-center justify-between">
          {renderStars()}
          {product.condition && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${getConditionColor(product.condition)}`}>
              {product.condition}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[3rem]">
          {product.description}
        </p>

        {/* Prix et économie */}
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-[#556B2F]">
                  {product.price.toFixed(2)}€
                </span>
                {product.comparePrice && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {product.comparePrice.toFixed(2)}€
                  </span>
                )}
              </div>
              {product.usageYears && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {product.usageYears} an{product.usageYears > 1 ? 's' : ''} d'utilisation
                </p>
              )}
            </div>
            {viewedProducts.has(product.id) && (
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <Eye className="w-3 h-3" />
                Déjà vu
              </div>
            )}
          </div>
          
          {discountPercentage > 0 && (
            <div className="text-sm text-green-600 dark:text-green-400 font-medium">
              Économisez {discountPercentage}% par rapport au neuf
            </div>
          )}
        </div>

        {/* Bouton ajouter au panier */}
        <button
          onClick={handleAddToCartClick}
          disabled={product.quantity === 0 || isAddingToCart}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            product.quantity === 0
              ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-[#556B2F] hover:bg-yellow-700 text-white hover:shadow-lg'
          }`}
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Ajout en cours...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {product.quantity > 0 ? "Acheter ce produit" : "Épuisé"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Composant principal Marketplace
const Marketplace = ({ onOpenModal, searchTerm = "" }: MarketplaceProps) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest" | "popular" | "economy">("featured");
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [stats, setStats] = useState<any>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Données des catégories
  const categories: MarketplaceCategory[] = [
    { 
      id: "all", 
      name: "Toutes catégories", 
      count: 0,
      description: "Tous nos produits d'occasion"
    },
    { 
      id: "Électroménager", 
      name: "Électroménager", 
      count: 2,
      description: "Réfrigérateurs, lave-linge, fours"
    },
    { 
      id: "Ameublement", 
      name: "Ameublement", 
      count: 3,
      description: "Canapés, tables, armoires"
    },
    { 
      id: "Outils", 
      name: "Outils", 
      count: 2,
      description: "Perceuses, scies, visseuses"
    },
    { 
      id: "Jardinage", 
      name: "Jardinage", 
      count: 1,
      description: "Tondeuses, taille-haies"
    },
    { 
      id: "Décoration", 
      name: "Décoration", 
      count: 1,
      description: "Lustres, miroirs, tableaux"
    },
    { 
      id: "High-tech", 
      name: "High-tech", 
      count: 0,
      description: "Tablettes, téléphones, ordinateurs"
    },
    { 
      id: "Bricolage", 
      name: "Bricolage", 
      count: 0,
      description: "Aspirateurs, ponceuses"
    },
    { 
      id: "Cuisine", 
      name: "Cuisine", 
      count: 0,
      description: "Hottes, robots, ustensiles"
    },
    { 
      id: "Bureau", 
      name: "Bureau", 
      count: 0,
      description: "Chaises, bureaux, rangements"
    }
  ];

  // Statistiques
  const defaultStats = [
    { label: "Produits vérifiés", value: "100%", icon: ShieldCheck },
    { label: "Garantie incluse", value: "6 mois", icon: Shield },
    { label: "Livraison possible", value: "90%", icon: Truck },
    { label: "Satisfaction clients", value: "4.7/5", icon: ThumbsUp }
  ];

  // Charger les produits
  useEffect(() => {
    loadMarketplaceProducts();
    loadMarketplaceStats();
  }, [filter, priceRange, brandFilter, conditionFilter, sortBy, localSearch]);

  const loadMarketplaceProducts = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        limit: 50
      };
      
      if (localSearch) params.search = localSearch;
      if (filter !== "all") params.subcategory = filter;
      if (brandFilter !== "all") params.brand = brandFilter;
      if (conditionFilter !== "all") params.condition = conditionFilter;
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
      params.sortBy = sortBy;

      const response = await api.get('/marketplace/products', { params });
      setProducts(response.data.products || []);
      
      // Mettre à jour les filtres disponibles
      if (response.data.filters) {
        setBrands(response.data.filters.brands || []);
        setConditions(response.data.filters.conditions || []);
        if (response.data.filters.priceRange?.max?._max?.price) {
          setMaxPrice(Math.ceil(response.data.filters.priceRange.max._max.price / 100) * 100);
        }
      }
      
    } catch (error) {
      console.error("Erreur lors du chargement des produits marketplace:", error);
      toast.error("Impossible de charger les produits d'occasion");
      setProducts(getMockProducts());
      setBrands(["Samsung", "Bosch", "Makita", "Whirlpool", "Apple", "Stihl"]);
      setConditions(["Comme neuf", "Très bon état", "Bon état", "État vintage"]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMarketplaceStats = async () => {
    try {
      const response = await api.get('/marketplace/stats');
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };

  // Données mock pour le développement
  const getMockProducts = (): MarketplaceProduct[] => {
    return [
      {
        id: "1",
        name: "Lave-linge Samsung 8kg - WW80J5355MW",
        description: "Lave-linge frontal 8kg, technologie EcoBubble, programme Rapide 15 minutes, classe A+++, excellent état, seulement 2 ans d'utilisation.",
        price: 250.00,
        comparePrice: 450.00,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Électroménager",
        quantity: 3,
        featured: true,
        slug: "lave-linge-samsung-8kg",
        category: "Marketplace Occasion",
        brand: "Samsung",
        condition: "Très bon état",
        warrantyMonths: 6,
        usageYears: 2,
        viewCount: 156,
        createdAt: new Date().toISOString()
      },
      // ... (garder vos autres produits mock existants)
    ];
  };

  // Gestion des interactions
  const handleAddToWishlist = (productId: string) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
        toast.info("Produit retiré de votre wishlist");
      } else {
        newSet.add(productId);
        toast.success("Produit ajouté à votre wishlist");
      }
      return newSet;
    });
  };

  const handleAddToCart = async (product: MarketplaceProduct) => {
    if (!user) {
      toast.warning("Connectez-vous pour ajouter des articles au panier");
      navigate('/login');
      return;
    }

    if (product.quantity === 0) {
      toast.error("Ce produit est actuellement épuisé");
      return;
    }

    setAddingToCart(product.id);
    
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        quantity: 1,
        isUsed: true
      });
      
      toast.success(`${product.name} a été ajouté au panier !`, {

      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleProductView = (productId: string) => {
    setViewedProducts(prev => new Set([...prev, productId]));
  };

  const handleClearSearch = () => {
    setLocalSearch("");
  };

  const handleResetFilters = () => {
    setFilter("all");
    setBrandFilter("all");
    setConditionFilter("all");
    setPriceRange([0, maxPrice]);
    setSortBy("featured");
    setLocalSearch("");
  };

  // Filtrer les produits (pour la recherche locale)
  const filteredProducts = products.filter(product => {
    const matchesSearch = localSearch === "" || 
      product.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      product.brand?.toLowerCase().includes(localSearch.toLowerCase());
    
    const matchesCategory = filter === "all" || product.subcategory === filter;
    const matchesBrand = brandFilter === "all" || product.brand === brandFilter;
    const matchesCondition = conditionFilter === "all" || product.condition === conditionFilter;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesBrand && matchesCondition && matchesPrice;
  });

  return (
    <div className="space-y-8">
      {/* En-tête avec recherche */}
      <SlideIn direction="left">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <ShoppingCart className="w-8 h-8 text-[#556B2F]" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                  Marketplace d'Occasion
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Des bonnes affaires en produits d'occasion vérifiés et garantis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <input
                  type="text"
                  placeholder="Rechercher un produit d'occasion..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                {localSearch && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filtres
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-r from-yellow-500/5 to-yellow-600/5 rounded-2xl p-6 mb-8 border border-yellow-400/20">
            <p className="text-gray-700 dark:text-gray-300">
              Découvrez notre sélection de produits d'occasion de qualité, tous vérifiés par nos experts. 
              Économisez jusqu'à 70% sur des équipements en parfait état, bénéficiez de notre garantie 
              et faites un geste pour la planète en choisissant la seconde main.
            </p>
          </div>

          {/* Statistiques */}
          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats ? (
                <>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {stats.summary?.averageDiscount || "70%"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Économie moyenne</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                      {stats.summary?.totalProducts || "150+"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Produits disponibles</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">6 mois</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Garantie incluse</div>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">4.7/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction clients</div>
                  </div>
                </>
              ) : (
                defaultStats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-lg bg-yellow-500/10">
                        <stat.icon className="w-6 h-6 text-[#556B2F]" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Filtres avancés */}
      {showFilters && (
        <SlideIn direction="up" delay={200}>
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filtre par catégorie */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Catégories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                        filter === category.id
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par marque */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Marques</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <button
                    onClick={() => setBrandFilter("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                      brandFilter === "all"
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>Toutes les marques</span>
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setBrandFilter(brand)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                        brandFilter === brand
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par condition */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">État</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <button
                    onClick={() => setConditionFilter("all")}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                      conditionFilter === "all"
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>Tous les états</span>
                  </button>
                  {conditions.map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setConditionFilter(condition)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                        conditionFilter === condition
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    >
                      <span>{condition}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtres par prix et tri */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Fourchette de prix</h3>
                    <div className="text-[#556B2F] font-bold">
                      {priceRange[0]}€ - {priceRange[1]}€
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>0€</span>
                      <span>{maxPrice}€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Trier par</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSortBy("featured")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "featured"
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      En vedette
                    </button>
                    <button
                      onClick={() => setSortBy("price-asc")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "price-asc"
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Prix croissant
                    </button>
                    <button
                      onClick={() => setSortBy("price-desc")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "price-desc"
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Prix décroissant
                    </button>
                    <button
                      onClick={() => setSortBy("economy")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "economy"
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Meilleure économie
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleResetFilters}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          </div>
        </SlideIn>
      )}

      {/* Résultats de recherche */}
      {localSearch && (
        <SlideIn direction="up" delay={300}>
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredProducts.length > 0
                ? `${filteredProducts.length} produit(s) trouvé(s) pour "${localSearch}"`
                : `Aucun produit trouvé pour "${localSearch}"`}
            </p>
          </div>
        </SlideIn>
      )}

      {/* Liste des produits */}
      <SlideIn direction="up" delay={400}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Nos Produits d'Occasion
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {filter !== "all" && `Filtré par : ${categories.find(c => c.id === filter)?.name}`}
                {brandFilter !== "all" && ` • Marque : ${brandFilter}`}
                {conditionFilter !== "all" && ` • État : ${conditionFilter}`}
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-yellow-400 animate-pulse">
                  <div className="h-56 bg-gray-300 dark:bg-gray-800"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-2/3"></div>
                    <div className="h-20 bg-gray-300 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onOpenModal={(p) => {
                    handleProductView(p.id);
                    onOpenModal(p);
                  }}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCart={handleAddToCart}
                  isInWishlist={wishlist.has(product.id)}
                  isAddingToCart={addingToCart === product.id}
                  viewedProducts={viewedProducts}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aucun produit trouvé
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {localSearch 
                  ? "Essayez avec d'autres termes de recherche" 
                  : "Aucun produit disponible dans cette catégorie"}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#556B2F] text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300"
              >
                Voir tous les produits
              </button>
            </div>
          )}
        </div>
      </SlideIn>

      {/* Section garanties */}
      <SlideIn direction="up" delay={500}>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-[#556B2F]">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Nos Garanties Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-400">Achetez en toute confiance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white">Produits Vérifiés</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Chaque produit passe par notre processus de vérification en 3 étapes : 
                inspection physique, test fonctionnel et nettoyage professionnel.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white">Garantie 6 Mois</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Tous nos produits bénéficient d'une garantie de 6 mois. En cas de problème, 
                nous réparons, remplaçons ou remboursons.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                  <Truck className="w-6 h-6 text-[#556B2F] dark:text-yellow-400" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white">Livraison & Installation</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Option livraison et installation disponible. Nos équipes s'occupent de tout, 
                du transport à la mise en service.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white">Reprise Possible</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Nous reprenons vos anciens appareils ou meubles lors de la livraison de votre nouvel achat.
              </p>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Comment vendre */}
      <SlideIn direction="up" delay={600}>
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 rounded-2xl p-8 border border-yellow-400/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Vous avez des produits à vendre ?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Nous rachetons vos équipements en bon état ou nous les vendons pour vous sur commission.
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Estimation gratuite en ligne ou à domicile</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Rachat immédiat ou vente sur commission</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Enlèvement gratuit à votre domicile</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <span>Paiement sécurisé sous 48h</span>
                </li>
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg inline-block">
                <div className="text-4xl font-bold text-[#556B2F] mb-2">70%</div>
                <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">d'économie moyenne</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">par rapport au neuf</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Nos clients économisent en moyenne 70% en choisissant l'occasion vérifiée
              </p>
            </div>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};

export default Marketplace;