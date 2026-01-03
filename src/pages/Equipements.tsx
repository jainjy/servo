// components/entretien/Equipements.tsx
import React, { useEffect, useRef, useState } from "react";
import { 
  Sofa, Refrigerator, Droplets, Zap, Truck, CheckCircle, 
  Shield, Award, Clock, Star, Home, Utensils, Bed, 
  Package, Thermometer, Wind, Sparkles, Monitor,
  Search, Filter, X, ShoppingCart, Heart, Eye,
  TrendingUp, Tag, ChevronRight, Users, Calendar,
  Building, CheckSquare, Phone, Mail, MapPin
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/components/contexts/CartContext";

// Interfaces
interface EquipementProduct {
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
  createdAt: string;
}

interface EquipementCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
  description: string;
}

interface EquipementsProps {
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
  product: EquipementProduct; 
  index: number; 
  onOpenModal: (product: EquipementProduct) => void;
  onAddToWishlist: (productId: string) => void;
  onAddToCart: (product: EquipementProduct) => Promise<void>;
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
    // Générer une note aléatoire entre 4.0 et 5.0 pour l'exemple
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

  const isCustom = product.name.toLowerCase().includes("sur mesure");
  const discountPercentage = product.comparePrice 
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-logo/50 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.featured && (
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Populaire
          </div>
        )}
        {product.comparePrice && discountPercentage > 0 && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        )}
        {isCustom && (
          <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            SUR MESURE
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
          <div className="w-full h-full bg-gradient-to-br from-logo/10 to-primary-dark/10 flex items-center justify-center">
            <Package className="h-16 w-16 text-logo/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Prix */}
        <div className="absolute bottom-3 right-3 bg-logo/90 text-white px-4 py-2 rounded-full shadow-lg font-bold">
          {product.price.toFixed(2)}€
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Catégorie et marque */}
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
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-logo transition-colors line-clamp-2">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-center justify-between">
          {renderStars()}
          {viewedProducts.has(product.id) && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
              <Eye className="w-3 h-3" />
              Déjà vu
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2 min-h-[3rem]">
          {product.description}
        </p>

        {/* Prix et stock */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-logo">
                {product.price.toFixed(2)}€
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {product.comparePrice.toFixed(2)}€
                </span>
              )}
            </div>
            {product.viewCount && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {product.viewCount} vues
              </p>
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            product.quantity > 10 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              : product.quantity > 0 
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          }`}>
            {product.quantity > 10 ? "En stock" : 
             product.quantity > 0 ? `${product.quantity} restant${product.quantity > 1 ? 's' : ''}` : 
             "Épuisé"}
          </div>
        </div>

        {/* Bouton ajouter au panier */}
        <button
          onClick={handleAddToCartClick}
          disabled={product.quantity === 0 || isAddingToCart}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            product.quantity === 0
              ? 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-logo hover:bg-primary-dark text-white hover:shadow-lg'
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
              {product.quantity > 0 ? "Ajouter au panier" : "Épuisé"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Composant principal Equipements
const Equipements = ({ onOpenModal, searchTerm = "" }: EquipementsProps) => {
  const [products, setProducts] = useState<EquipementProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 8000]);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest" | "popular">("featured");
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(8000);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Données des catégories
  const categories: EquipementCategory[] = [
    { 
      id: "all", 
      name: "Tous les équipements", 
      icon: <Home className="w-4 h-4" />,
      count: 0,
      description: "Tous nos équipements maison"
    },
    { 
      id: "Électroménager", 
      name: "Électroménager", 
      icon: <Refrigerator className="w-4 h-4" />,
      count: 3,
      description: "Réfrigérateurs, lave-linge, fours"
    },
    { 
      id: "Cuisine", 
      name: "Cuisine", 
      icon: <Utensils className="w-4 h-4" />,
      count: 2,
      description: "Cuisines équipées, hottes"
    },
    { 
      id: "Salon", 
      name: "Salon", 
      icon: <Sofa className="w-4 h-4" />,
      count: 1,
      description: "Canapés, fauteuils, tables"
    },
    { 
      id: "Salle à manger", 
      name: "Salle à manger", 
      icon: <Droplets className="w-4 h-4" />,
      count: 1,
      description: "Tables, chaises, buffets"
    },
    { 
      id: "Chambre", 
      name: "Chambre", 
      icon: <Bed className="w-4 h-4" />,
      count: 1,
      description: "Lits, matelas, armoires"
    },
    { 
      id: "Climatisation", 
      name: "Climatisation", 
      icon: <Thermometer className="w-4 h-4" />,
      count: 1,
      description: "Climatiseurs, ventilateurs"
    },
    { 
      id: "Rangement", 
      name: "Rangement", 
      icon: <Package className="w-4 h-4" />,
      count: 1,
      description: "Dressings, étagères"
    },
    { 
      id: "Énergie", 
      name: "Énergie", 
      icon: <Zap className="w-4 h-4" />,
      count: 1,
      description: "Chauffe-eau, solutions économes"
    }
  ];

  // Services proposés
  const services = [
    {
      icon: Truck,
      title: "Livraison & Installation",
      description: "Livraison gratuite et installation professionnelle incluse sur tous les équipements"
    },
    {
      icon: Shield,
      title: "Garantie Étendue",
      description: "Garantie jusqu'à 5 ans selon les produits, avec assistance premium"
    },
    {
      icon: CheckCircle,
      title: "Satisfaction Garantie",
      description: "30 jours pour changer d'avis, service après-vente réactif"
    },
    {
      icon: Award,
      title: "Experts à Votre Service",
      description: "Conseils personnalisés par nos experts en équipement maison"
    }
  ];

  // Charger les équipements
  useEffect(() => {
    loadEquipements();
  }, [filter, priceRange, brandFilter, sortBy, localSearch]);

  const loadEquipements = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        limit: 50
      };
      
      if (localSearch) params.search = localSearch;
      if (filter !== "all") params.subcategory = filter;
      if (brandFilter !== "all") params.brand = brandFilter;
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];
      params.sortBy = sortBy;

      const response = await api.get('/equipements/products', { params });
      setProducts(response.data.products || []);
      
      // Mettre à jour les filtres disponibles
      if (response.data.filters) {
        setBrands(response.data.filters.brands || []);
        if (response.data.filters.priceRange?.max?._max?.price) {
          setMaxPrice(Math.ceil(response.data.filters.priceRange.max._max.price / 100) * 100);
        }
      }

      // Mettre à jour les comptes de catégories
      const categoryCounts = categories.map(cat => {
        if (cat.id === "all") {
          return { ...cat, count: response.data.products?.length || 0 };
        }
        const count = response.data.products?.filter((p: EquipementProduct) => 
          p.subcategory === cat.id
        ).length || 0;
        return { ...cat, count };
      });
      // Note: On ne met pas à jour les catégories dans cet exemple pour garder la simplicité
      
    } catch (error) {
      console.error("Erreur lors du chargement des équipements:", error);
      toast.error("Impossible de charger les équipements");
      // Fallback sur les données mock
      setProducts(getMockProducts());
      setBrands(["Samsung", "Bosch", "Siemens", "Daikin", "Dyson", "iRobot", "Atlantic"]);
    } finally {
      setIsLoading(false);
    }
  };

  // Données mock pour le développement
  const getMockProducts = (): EquipementProduct[] => {
    return [
      {
        id: "1",
        name: "Réfrigérateur Américain Samsung Family Hub",
        description: "Réfrigérateur américain 615L avec distributeur d'eau et de glaçons, écran tactile intelligent 21,5\", technologie Twin Cooling Plus.",
        price: 1899.99,
        comparePrice: 2299.99,
        images: ["https://images.unsplash.com/photo-1571175443880-49e1d1b7b3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Électroménager",
        quantity: 18,
        featured: true,
        slug: "refrigerateur-americain-samsung",
        category: "Équipement Maison",
        brand: "Samsung",
        viewCount: 156,
        purchaseCount: 45,
        clickCount: 320,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Lave-linge Séchant Bosch Heat Pump",
        description: "Lave-linge séchant 9kg/5kg avec technologie Heat Pump, 1400 tours/min, programmes intelligents EcoSilence Drive.",
        price: 899.99,
        comparePrice: 1099.99,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Électroménager",
        quantity: 25,
        featured: true,
        slug: "lave-linge-bosch-heat-pump",
        category: "Équipement Maison",
        brand: "Bosch",
        viewCount: 89,
        purchaseCount: 32,
        clickCount: 210,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        name: "Cuisine Équipée Modulaire sur Mesure",
        description: "Cuisine complète sur mesure avec électroménager intégré, plan de travail quartz 3cm, meubles haute gamme laqué mat.",
        price: 7500,
        comparePrice: 0,
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Cuisine",
        quantity: 0,
        featured: true,
        slug: "cuisine-equipee-sur-mesure",
        category: "Équipement Maison",
        brand: "Cuisines Avosoa",
        viewCount: 124,
        purchaseCount: 8,
        clickCount: 280,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "4",
        name: "Canapé Modulaire 5 Places en Tissu Velours",
        description: "Canapé modulaire en tissu velours premium, convertible en lit 140x200, mousse mémoire de forme, nombreux modules interchangeables.",
        price: 1499.99,
        comparePrice: 1899.99,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Salon",
        quantity: 12,
        featured: true,
        slug: "canape-modulaire-velours",
        category: "Équipement Maison",
        brand: "Maison du Confort",
        viewCount: 67,
        purchaseCount: 18,
        clickCount: 145,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "5",
        name: "Table à Manger Extensible en Chêne Massif",
        description: "Table en chêne massif français extensible de 6 à 10 personnes, style scandinave, finition huile naturelle écologique.",
        price: 1299.99,
        comparePrice: 1599.99,
        images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Salle à manger",
        quantity: 8,
        featured: false,
        slug: "table-manger-chene-massif",
        category: "Équipement Maison",
        brand: "Artisan Bois",
        viewCount: 92,
        purchaseCount: 15,
        clickCount: 178,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "6",
        name: "Lit 160x200 avec Tête de Lit Rembourrée",
        description: "Lit coffre en bois massif hévéa 160x200 avec tête de lit rembourrée en tissu, rangement intégré par tiroirs latéraux.",
        price: 899.99,
        comparePrice: 1149.99,
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Chambre",
        quantity: 15,
        featured: true,
        slug: "lit-160x200-tete-lit",
        category: "Équipement Maison",
        brand: "Dodo Design",
        viewCount: 145,
        purchaseCount: 22,
        clickCount: 267,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "7",
        name: "Climatiseur Réversible Daikin Inverter",
        description: "Climatiseur split réversible 9000 BTU, technologie Inverter Flash Streamer, WiFi intégré, très silencieux (19dB intérieur).",
        price: 1299.99,
        comparePrice: 1599.99,
        images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Climatisation",
        quantity: 10,
        featured: true,
        slug: "climatiseur-daikin-inverter",
        category: "Équipement Maison",
        brand: "Daikin",
        viewCount: 78,
        purchaseCount: 12,
        clickCount: 189,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "8",
        name: "Dressing sur Mesure avec Portes Coulissantes",
        description: "Dressing intégré sur mesure avec portes coulissantes miroir/laqué, éclairage LED intégré avec détecteur de mouvement.",
        price: 2200,
        comparePrice: 0,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Rangement",
        quantity: 0,
        featured: true,
        slug: "dressing-sur-mesure",
        category: "Équipement Maison",
        brand: "Avosoa Dressing",
        viewCount: 56,
        purchaseCount: 6,
        clickCount: 134,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "9",
        name: "Chauffe-eau Thermodynamique Atlantic 270L",
        description: "Chauffe-eau thermodynamique 270L, classe A, pompe à chaleur intégrée, COP 3,5, économie jusqu'à 70% sur l'eau chaude.",
        price: 2499.99,
        comparePrice: 2999.99,
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Énergie",
        quantity: 6,
        featured: true,
        slug: "chauffe-eau-atlantic",
        category: "Équipement Maison",
        brand: "Atlantic",
        viewCount: 89,
        purchaseCount: 9,
        clickCount: 167,
        productType: "equipement",
        createdAt: new Date().toISOString()
      },
      {
        id: "10",
        name: "Purificateur d'Air Dyson Pure Cool",
        description: "Purificateur d'air et ventilateur avec filtration HEPA et charbon actif, détection automatique particules et gaz.",
        price: 549.99,
        comparePrice: 649.99,
        images: ["https://images.unsplash.com/photo-1588614959060-4d144f28b207?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Qualité air",
        quantity: 20,
        featured: false,
        slug: "purificateur-dyson",
        category: "Équipement Maison",
        brand: "Dyson",
        viewCount: 112,
        purchaseCount: 28,
        clickCount: 245,
        productType: "equipement",
        createdAt: new Date().toISOString()
      }
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

  const handleAddToCart = async (product: EquipementProduct) => {
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
        quantity: 1
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
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  // Calculer le nombre de produits par catégorie
  const categoryCounts = categories.map(cat => {
    if (cat.id === "all") return { ...cat, count: products.length };
    const count = products.filter(p => p.subcategory === cat.id).length;
    return { ...cat, count };
  });

  return (
    <div className="space-y-8">
      {/* En-tête avec recherche */}
      <SlideIn direction="left">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-logo/10">
                <Home className="w-8 h-8 text-logo" />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                  Équipements Maison Neufs & Sur Mesure
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Équipez votre maison avec du matériel neuf de qualité professionnelle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <input
                  type="text"
                  placeholder="Rechercher un équipement..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-logo focus:border-transparent"
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
          <div className="bg-gradient-to-r from-logo/5 to-primary-dark/5 rounded-2xl p-6 mb-8 border border-logo/20">
            <p className="text-gray-700 dark:text-gray-300">
              Découvrez notre sélection d'équipements neufs et sur mesure pour votre maison. 
              De l'électroménager haut de gamme aux solutions de rangement optimisées, 
              nous proposons des produits de qualité avec installation professionnelle incluse 
              et des garanties étendues pour votre tranquillité d'esprit.
            </p>
          </div>
        </div>
      </SlideIn>

      {/* Services inclus */}
      <SlideIn direction="up" delay={100}>
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Services inclus avec chaque achat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 hover:border-logo/50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-logo/10">
                    <service.icon className="w-5 h-5 text-logo" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">{service.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SlideIn>

      {/* Filtres avancés */}
      {showFilters && (
        <SlideIn direction="up" delay={200}>
          <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Filtre par catégorie */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Catégories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categoryCounts.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFilter(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors duration-300 text-sm ${
                        filter === category.id
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span>{category.name}</span>
                      </div>
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
                        ? 'bg-logo text-white'
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
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtres par prix et tri */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Fourchette de prix</h3>
                    <div className="text-logo font-bold">
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
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-logo"
                    />
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-logo"
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
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      En vedette
                    </button>
                    <button
                      onClick={() => setSortBy("price-asc")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "price-asc"
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Prix croissant
                    </button>
                    <button
                      onClick={() => setSortBy("price-desc")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "price-desc"
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Prix décroissant
                    </button>
                    <button
                      onClick={() => setSortBy("popular")}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        sortBy === "popular"
                          ? 'bg-logo text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      Plus populaires
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
                Nos Équipements
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {filter !== "all" && `Filtré par : ${categories.find(c => c.id === filter)?.name}`}
                {brandFilter !== "all" && ` • Marque : ${brandFilter}`}
                {filter === "all" && brandFilter === "all" && `Prix : ${priceRange[0]}€ - ${priceRange[1]}€`}
              </p>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 animate-pulse">
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
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Aucun équipement trouvé
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {localSearch 
                  ? "Essayez avec d'autres termes de recherche" 
                  : "Aucun produit ne correspond à vos filtres"}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-logo text-white rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </SlideIn>

      {/* Section sur mesure */}
      <SlideIn direction="up" delay={500}>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-purple-600">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Solutions sur Mesure</h3>
              <p className="text-gray-600 dark:text-gray-400">Nous créons l'équipement parfait pour votre espace</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Notre processus sur mesure</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Consultation gratuite</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Visite à domicile ou consultation virtuelle pour comprendre vos besoins</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Conception personnalisée</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plans 3D et propositions adaptées à votre espace et budget</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Fabrication qualité</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Réalisation par nos artisans avec matériaux premium</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-logo text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
                  <div>
                    <h5 className="font-semibold mb-1 text-gray-800 dark:text-white">Installation complète</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Installation par nos experts et garantie sur l'ensemble</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700">
              <h4 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Domaines d'expertise sur mesure</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Cuisines</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Intégrées et optimisées</div>
                </div>
                <div className="bg-white dark:bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Dressings</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rangement maximal</div>
                </div>
                <div className="bg-white dark:bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Bibliothèques</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sur mesure murales</div>
                </div>
                <div className="bg-white dark:bg-gray-900/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">Bureaux</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Espace travail optimisé</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const customProduct = filteredProducts.find(p => 
                      p.name.toLowerCase().includes("sur mesure")
                    );
                    if (customProduct) onOpenModal(customProduct);
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-300"
                >
                  Demander un devis sur mesure
                </button>
              </div>
            </div>
          </div>
        </div>
      </SlideIn>

      {/* Section financement */}
      <SlideIn direction="up" delay={600}>
        <div className="mt-12 bg-gradient-to-r from-logo/10 to-primary-dark/10 rounded-2xl p-8 border border-logo/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-logo">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Solutions de Financement</h3>
              <p className="text-gray-600 dark:text-gray-400">Achetez maintenant, payez plus tard</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Paiement en 3x</div>
              <div className="text-2xl font-bold text-logo mb-2">Sans frais</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour tout achat supérieur à 300€
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Exemple : 999€ = 3 x 333€
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Paiement en 10x</div>
              <div className="text-2xl font-bold text-logo mb-2">1.9%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Pour tout achat supérieur à 1000€
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Exemple : 2500€ = 10 x 275€
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Location avec Option d'Achat</div>
              <div className="text-2xl font-bold text-logo mb-2">À partir de 39€/mois</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Changez d'équipement tous les 3 ans
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Option d'achat à terme réduit
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tous nos financements sont sans apport et réponse sous 24h
            </p>
          </div>
        </div>
      </SlideIn>

      {/* CTA Consultation */}
      <SlideIn direction="up" delay={700}>
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-logo to-primary-dark rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Besoin de conseils pour équiper votre maison ?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Nos experts sont à votre disposition pour vous guider dans le choix des équipements 
              les plus adaptés à votre espace, votre style de vie et votre budget.
            </p>
            <button
              onClick={() => {
                const consultationProduct = {
                  id: 'consultation-equipement',
                  name: 'Consultation Équipement Maison',
                  description: 'Consultation avec un expert pour choisir les équipements adaptés à vos besoins',
                  price: 0,
                  images: [],
                  subcategory: 'Consultation',
                  quantity: 1,
                  featured: false,
                  slug: 'consultation-equipement',
                  category: 'Service',
                  createdAt: new Date().toISOString()
                };
                onOpenModal(consultationProduct);
              }}
              className="bg-white text-logo px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Réserver une consultation gratuite
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
};

export default Equipements;