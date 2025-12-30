// pages/AlimentationCategorie.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Package,
  Apple,
  Carrot,
  Wheat,
  Coffee,
  Fish,
  Milk,
  Egg,
  ChefHat,
  Heart,
  Leaf,
  Sparkles,
  Zap,
  Flame,
  Truck,
  ShieldCheck,
  Star,
  ShoppingCart,
  Utensils,
  Store,
  ShoppingBag,
  GlassWater,
  Search,
  Filter,
  SortAsc,
  ChevronDown,
  Info,
  Clock,
  Users,
  MapPin,
  Tag,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

// Fonction pour obtenir l'icône par nom
const getIconByName = (iconName) => {
  const icons = {
    Apple,
    Carrot,
    Wheat,
    Coffee,
    Fish,
    Milk,
    Egg,
    ChefHat,
    Heart,
    Leaf,
    Sparkles,
    Zap,
    Flame,
    Truck,
    ShieldCheck,
    Star,
    ShoppingCart,
    Utensils,
    Store,
    ShoppingBag,
    GlassWater,
  };
  return icons[iconName] || Package;
};

const AlimentationCategorie = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [filters, setFilters] = useState({
    organic: false,
    vegan: false,
    vegetarian: false,
    highHealthScore: false,
    inStock: true,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Couleurs de la palette améliorées
  const colors = {
    logo: "#556B2F",
    primary: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
    accent: "#D2691E",
    success: "#2E8B57",
    warning: "#F59E0B",
    danger: "#DC2626",
  };

  useEffect(() => {
    const categoryData = location.state;
    if (categoryData) {
      setCategory(categoryData);
    }
  }, [location.state]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryName]);

  const fetchCategoryProducts = async () => {
    try {
      setIsLoading(true);

      // Utiliser l'API aliments avec le paramètre foodCategory
      const response = await api.get(
        `/aliments/food-category/${encodeURIComponent(categoryName)}`
      );

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }

    } catch (error) {
      console.error(
        "Erreur lors du chargement des produits de la catégorie:",
        error
      );
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning(
        "Veuillez vous connecter pour ajouter des articles au panier"
      );
      return;
    }

    try {
      setAddingProductId(product.id);

      // Ajouter le produit au panier
      addToCart(product);

      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trouver l'article dans le panier pour afficher la bonne quantité
      const cartItem = cartItems.find(item => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 1;
      const totalItems = getCartItemsCount();

      // Afficher une confirmation détaillée
      toast.success(`${product.name} ajouté au panier !`, {
        description: `Quantité: ${quantity} | Total panier: ${totalItems} articles`,
        action: {
          label: 'Voir le panier',
          onClick: () => navigate('/cart'),
        },
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  // Fonction pour obtenir la couleur du badge santé
  const getHealthScoreColor = (score) => {
    if (score >= 9) return { bg: colors.success, text: 'white' };
    if (score >= 7) return { bg: "#22C55E", text: 'white' };
    if (score >= 5) return { bg: colors.warning, text: colors.secondaryText };
    if (score >= 3) return { bg: "#F97316", text: 'white' };
    return { bg: colors.danger, text: 'white' };
  };

  // Fonction pour obtenir le texte du badge santé
  const getHealthScoreText = (score) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Très sain";
    if (score >= 5) return "Modéré";
    if (score >= 3) return "Occasionnel";
    return "À limiter";
  };

  // Fonction pour déterminer la couleur de la section
  const getSectionColor = () => {
    const sectionColors = {
      // Restaurants & Snacks
      'restaurants-traditionnels': colors.logo,
      'snacks-rapides': colors.logo,
      'food-trucks': colors.logo,
      'brasseries-cafes': colors.logo,
      
      // Produits Locaux
      'fruits-tropicaux': colors.secondaryText,
      'epices-saveurs': colors.secondaryText,
      'miels-confitures': colors.secondaryText,
      'rhum-arrange': colors.secondaryText,
      
      // Marchés & Artisans
      'marches-forains': colors.accent,
      'artisans-alimentaires': colors.accent,
      'boutiques-producteurs': colors.accent,
      'epiceries-creoles': colors.accent,
      
      // Bien-être & Alimentation
      'produits-bio': colors.success,
      'super-aliments': colors.success,
      'infusions-tisanes': colors.success,
      'complements-alimentaires': colors.success,
    };
    
    return sectionColors[categoryName] || colors.logo;
  };

  // Filtrer et trier les produits
  const filteredAndSortedProducts = products
    .filter(product => {
      // Filtre de recherche
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filtre bio
      if (filters.organic && !product.isOrganic) return false;
      
      // Filtre vegan
      if (filters.vegan && !product.isVegan) return false;
      
      // Filtre végétarien
      if (filters.vegetarian && !product.isVegetarian) return false;
      
      // Filtre score santé élevé
      if (filters.highHealthScore && (!product.healthScore || product.healthScore < 7)) return false;
      
      // Filtre en stock
      if (filters.inStock && product.quantity === 0) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'health-score':
          return (b.healthScore || 0) - (a.healthScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const sectionColor = getSectionColor();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
            <div className="relative">
              <Package className="h-16 w-16 text-[#556B2F]/40 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/50 rounded-full"></div>
            </div>
          </div>
          <p className="mt-4 text-[#8B4513] font-medium">Chargement des produits...</p>
          <div className="w-48 h-1 bg-[#556B2F]/20 rounded-full overflow-hidden mt-2 mx-auto">
            <div className="h-full bg-[#556B2F] animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F9F9F9]">
      {/* En-tête fixe */}
      <div className="sticky top-16 z-20 bg-white shadow-sm border-b border-[#D3D3D3]">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/alimentation')}
                className="flex items-center gap-2 text-[#8B4513] hover:text-[#556B2F] hover:bg-[#6B8E23]/10 px-3 py-2 rounded-xl"
                style={{ borderColor: colors.separator }}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Retour</span>
              </Button>
              
              <div className="flex items-center gap-2">
                {category?.iconName && (
                  <div 
                    className="p-2 rounded-lg shadow-sm"
                    style={{ backgroundColor: `${sectionColor}15` }}
                  >
                    {(() => {
                      const IconComponent = getIconByName(category.iconName);
                      return (
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: sectionColor }}
                        />
                      );
                    })()}
                  </div>
                )}

                <div>
                  <h2 
                    className="text-lg font-bold truncate max-w-[200px] sm:max-w-none"
                    style={{ color: colors.logo }}
                  >
                    {category?.name || decodeURIComponent(categoryName).replace(/-/g, " ")}
                  </h2>
                  <p 
                    className="text-xs truncate max-w-[180px] sm:max-w-none"
                    style={{ color: colors.secondaryText }}
                  >
                    {products.length} produit{products.length !== 1 ? 's' : ''} disponibles
                  </p>
                </div>
              </div>
            </div>

            {/* Badges d'information */}
            <div className="hidden md:flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-xs"
                style={{ 
                  backgroundColor: `${colors.logo}08`, 
                  color: colors.logo,
                  borderColor: `${colors.logo}30`
                }}
              >
                <Truck className="h-3 w-3 mr-1" />
                Livraison 24h
              </Badge>
              <Badge
                variant="outline"
                className="text-xs"
                style={{ 
                  backgroundColor: `${colors.primary}08`, 
                  color: colors.primary,
                  borderColor: `${colors.primary}30`
                }}
              >
                <ShieldCheck className="h-3 w-3 mr-1" />
                Fraîcheur garantie
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Barre de recherche et filtres */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Barre de recherche */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={`Rechercher dans cette catégorie...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 h-14 rounded-xl border border-[#D3D3D3] focus:border-[#556B2F] focus:outline-none shadow-sm w-full"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8B4513]/60" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-5 w-5 text-[#8B4513]/40 hover:text-[#8B4513]" />
                  </button>
                )}
              </div>
            </div>

            {/* Tri et filtres */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 h-14 rounded-xl border border-[#D3D3D3] focus:border-[#556B2F] focus:outline-none appearance-none shadow-sm bg-white"
                  style={{ color: colors.secondaryText }}
                >
                  <option value="default">Trier par</option>
                  <option value="name">Nom (A-Z)</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="health-score">Score santé</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513]/60 pointer-events-none" />
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="px-4 h-14 rounded-xl border border-[#D3D3D3] hover:border-[#556B2F] shadow-sm"
                style={{ 
                  backgroundColor: showFilters ? `${sectionColor}15` : 'white',
                  color: showFilters ? sectionColor : colors.secondaryText
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {/* Panneau de filtres détaillés */}
          {showFilters && (
            <div className="mt-4 p-5 bg-white rounded-2xl shadow-sm border border-[#D3D3D3]/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: colors.logo }}>
                  Filtres
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="organic"
                    checked={filters.organic}
                    onChange={(e) => setFilters({...filters, organic: e.target.checked})}
                    className="h-5 w-5 rounded border-[#D3D3D3] text-[#556B2F] focus:ring-[#556B2F]"
                  />
                  <label htmlFor="organic" className="flex items-center gap-1 cursor-pointer">
                    <Leaf className="h-4 w-4" style={{ color: colors.primary }} />
                    <span style={{ color: colors.secondaryText }}>Bio uniquement</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vegan"
                    checked={filters.vegan}
                    onChange={(e) => setFilters({...filters, vegan: e.target.checked})}
                    className="h-5 w-5 rounded border-[#D3D3D3] text-[#2E8B57] focus:ring-[#2E8B57]"
                  />
                  <label htmlFor="vegan" className="flex items-center gap-1 cursor-pointer">
                    <Leaf className="h-4 w-4" style={{ color: '#2E8B57' }} />
                    <span style={{ color: colors.secondaryText }}>Vegan</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="vegetarian"
                    checked={filters.vegetarian}
                    onChange={(e) => setFilters({...filters, vegetarian: e.target.checked})}
                    className="h-5 w-5 rounded border-[#D3D3D3] text-[#6B8E23] focus:ring-[#6B8E23]"
                  />
                  <label htmlFor="vegetarian" className="flex items-center gap-1 cursor-pointer">
                    <Leaf className="h-4 w-4" style={{ color: '#6B8E23' }} />
                    <span style={{ color: colors.secondaryText }}>Végétarien</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="highHealthScore"
                    checked={filters.highHealthScore}
                    onChange={(e) => setFilters({...filters, highHealthScore: e.target.checked})}
                    className="h-5 w-5 rounded border-[#D3D3D3] text-[#22C55E] focus:ring-[#22C55E]"
                  />
                  <label htmlFor="highHealthScore" className="flex items-center gap-1 cursor-pointer">
                    <Heart className="h-4 w-4" style={{ color: '#22C55E' }} />
                    <span style={{ color: colors.secondaryText }}>Score santé ≥ 7</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                    className="h-5 w-5 rounded border-[#D3D3D3] text-[#556B2F] focus:ring-[#556B2F]"
                  />
                  <label htmlFor="inStock" className="flex items-center gap-1 cursor-pointer">
                    <CheckCircle className="h-4 w-4" style={{ color: colors.logo }} />
                    <span style={{ color: colors.secondaryText }}>En stock uniquement</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D3D3D3]/30">
                <Button
                  variant="ghost"
                  onClick={() => setFilters({
                    organic: false,
                    vegan: false,
                    vegetarian: false,
                    highHealthScore: false,
                    inStock: true,
                  })}
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Réinitialiser
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="text-sm"
                  style={{ 
                    backgroundColor: sectionColor,
                    color: 'white'
                  }}
                >
                  Appliquer les filtres
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Produits de la catégorie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {filteredAndSortedProducts.length > 0 ? (
            <>
              {/* Résumé des filtres */}
              {searchQuery || Object.values(filters).some(v => v === true) ? (
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: colors.logo }}>
                      Résultats filtrés :
                    </span>
                    {searchQuery && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${colors.logo}08`,
                          color: colors.logo,
                          borderColor: `${colors.logo}30`
                        }}
                      >
                        Recherche: "{searchQuery}"
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="ml-1 p-0.5 hover:bg-[#556B2F]/20 rounded"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {filters.organic && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${colors.primary}08`,
                          color: colors.primary,
                          borderColor: `${colors.primary}30`
                        }}
                      >
                        Bio
                      </Badge>
                    )}
                    {filters.vegan && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: '#2E8B5708',
                          color: '#2E8B57',
                          borderColor: '#2E8B5730'
                        }}
                      >
                        Vegan
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({
                          organic: false,
                          vegan: false,
                          vegetarian: false,
                          highHealthScore: false,
                          inStock: true,
                        });
                      }}
                      className="text-xs h-6 px-2"
                      style={{ color: colors.secondaryText }}
                    >
                      Tout effacer
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="p-5 hover:shadow-xl transition-all duration-300 group border border-[#D3D3D3]/50 rounded-2xl overflow-hidden"
                  >
                    {/* Image du produit */}
                    <div className="relative mb-4">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative">
                          <div
                            className="w-full h-48 bg-cover bg-center rounded-xl mb-4"
                            style={{ backgroundImage: `url(${product.images[0]})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                          
                          {/* Badges sur l'image */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.isOrganic && (
                              <Badge 
                                className="text-xs shadow-md"
                                style={{ 
                                  backgroundColor: colors.primary,
                                  color: 'white'
                                }}
                              >
                                <Leaf className="h-3 w-3 mr-1" />
                                Bio
                              </Badge>
                            )}
                            
                            {product.isVegan && (
                              <Badge 
                                className="text-xs shadow-md"
                                style={{ 
                                  backgroundColor: '#2E8B57',
                                  color: 'white'
                                }}
                              >
                                <Leaf className="h-3 w-3 mr-1" />
                                Vegan
                              </Badge>
                            )}
                            {!product.isVegan && product.isVegetarian && (
                              <Badge 
                                className="text-xs shadow-md"
                                style={{ 
                                  backgroundColor: '#6B8E23',
                                  color: 'white'
                                }}
                              >
                                <Leaf className="h-3 w-3 mr-1" />
                                Végétarien
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-48 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                          style={{ 
                            background: `linear-gradient(135deg, ${sectionColor}15, ${sectionColor}08)` 
                          }}
                        >
                          <Package 
                            className="h-12 w-12" 
                            style={{ color: `${sectionColor}40` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/30"></div>
                        </div>
                      )}

                      {/* Badge stock en haut à droite */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={product.quantity > 0 ? "default" : "destructive"}
                          className="text-xs shadow-md"
                          style={product.quantity > 0 ? { 
                            backgroundColor: colors.primary,
                            color: 'white'
                          } : {}}
                        >
                          {product.quantity > 0 ? "En stock" : "Rupture"}
                        </Badge>
                      </div>

                      {/* Score santé en bas à gauche */}
                      {product.healthScore && (
                        <div className="absolute bottom-3 left-3">
                          <Badge 
                            className="text-xs shadow-md"
                            style={{ 
                              backgroundColor: getHealthScoreColor(product.healthScore).bg,
                              color: getHealthScoreColor(product.healthScore).text
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            {product.healthScore}/10
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Informations produit */}
                    <div className="space-y-3">
                      <div>
                        <h3 
                          className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#556B2F] transition-colors"
                          style={{ color: colors.logo }}
                        >
                          {product.name}
                        </h3>
                        <p 
                          className="text-sm mb-3 line-clamp-2"
                          style={{ color: colors.secondaryText }}
                        >
                          {product.description}
                        </p>
                      </div>

                      {/* Badges supplémentaires */}
                      <div className="flex flex-wrap gap-2">
                        {product.origin && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: colors.secondaryText,
                              borderColor: colors.separator
                            }}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {product.origin}
                          </Badge>
                        )}
                        
                        {product.allergens && product.allergens.length > 0 && (
                          <div className="relative group/allergens">
                            <Badge
                              variant="outline"
                              className="text-xs cursor-help"
                              style={{ 
                                backgroundColor: '#FEE2E208',
                                color: colors.danger,
                                borderColor: '#FCA5A5'
                              }}
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Allergènes
                            </Badge>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/allergens:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                              <div className="bg-white p-3 rounded-lg shadow-xl border border-[#D3D3D3] min-w-[200px]">
                                <p className="text-xs font-semibold mb-2" style={{ color: colors.logo }}>
                                  Allergènes :
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {product.allergens.map((allergen, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                      style={{ 
                                        backgroundColor: '#FEE2E2',
                                        color: colors.danger,
                                        borderColor: '#FCA5A5'
                                      }}
                                    >
                                      {allergen}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Indicateur de quantité en stock */}
                      {product.quantity > 0 && product.quantity <= 10 && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${(product.quantity / 10) * 100}%`,
                                backgroundColor: product.quantity <= 3 ? colors.danger : 
                                              product.quantity <= 5 ? colors.warning : colors.success
                              }}
                            ></div>
                          </div>
                          <span 
                            className="text-xs font-medium whitespace-nowrap"
                            style={{ 
                              color: product.quantity <= 3 ? colors.danger : 
                                    product.quantity <= 5 ? colors.warning : colors.success
                            }}
                          >
                            {product.quantity} restant{product.quantity > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}

                      {/* Prix et vendeur */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span 
                              className="text-2xl font-bold"
                              style={{ color: colors.logo }}
                            >
                              €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                            </span>
                            {product.unit && (
                              <span 
                                className="text-sm ml-1"
                                style={{ color: colors.secondaryText }}
                              >
                                / {product.unit}
                              </span>
                            )}
                          </div>
                          {product.vendor?.companyName && (
                            <div 
                              className="flex items-center gap-1 text-xs mt-1"
                              style={{ color: colors.secondaryText }}
                            >
                              <Store className="h-3 w-3" />
                              <span className="truncate">{product.vendor.companyName}</span>
                            </div>
                          )}
                        </div>

                        {/* Bouton Ajouter au panier */}
                        <Button
                          className="text-white transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                          style={{ 
                            backgroundColor: sectionColor,
                          }}
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity === 0 || addingProductId === product.id}
                        >
                          {addingProductId === product.id ? (
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                              />
                              <span className="hidden sm:inline">Ajout...</span>
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                              <span className="hidden sm:inline">
                                {product.quantity > 0 ? "Ajouter" : "Rupture"}
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center">
                <Search 
                  className="h-12 w-12" 
                  style={{ color: `${colors.logo}40` }}
                />
              </div>
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: colors.logo }}
              >
                Aucun produit trouvé
              </h3>
              <p 
                className="mb-6 max-w-md mx-auto"
                style={{ color: colors.secondaryText }}
              >
                Aucun produit ne correspond à vos critères de recherche et filtres.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      organic: false,
                      vegan: false,
                      vegetarian: false,
                      highHealthScore: false,
                      inStock: true,
                    });
                  }}
                  variant="outline"
                  style={{ 
                    color: colors.secondaryText,
                    borderColor: colors.separator
                  }}
                >
                  Réinitialiser les filtres
                </Button>
                <Button
                  onClick={() => navigate("/alimentation")}
                  style={{ 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }}
                >
                  Retour à l'alimentation
                </Button>
              </div>
            </div>
          )}

          {/* Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            <div 
              className="rounded-xl p-5 text-center border border-[#D3D3D3]/50 bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.logo}15` }}>
                <Truck 
                  className="h-6 w-6" 
                  style={{ color: colors.logo }}
                />
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: colors.logo }}
              >
                Livraison Rapide
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Sous 24h pour préserver la fraîcheur
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5 text-center border border-[#D3D3D3]/50 bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                <ShieldCheck 
                  className="h-6 w-6" 
                  style={{ color: colors.primary }}
                />
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Qualité Garantie
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Produits frais contrôlés quotidiennement
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5 text-center border border-[#D3D3D3]/50 bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.success}15` }}>
                <Leaf 
                  className="h-6 w-6" 
                  style={{ color: colors.success }}
                />
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: colors.success }}
              >
                Produits Bio
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Large sélection de produits biologiques
              </p>
            </div>
            
            <div 
              className="rounded-xl p-5 text-center border border-[#D3D3D3]/50 bg-white hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.secondaryText}15` }}>
                <Heart 
                  className="h-6 w-6" 
                  style={{ color: colors.secondaryText }}
                />
              </div>
              <h4 
                className="font-semibold mb-2"
                style={{ color: colors.secondaryText }}
              >
                Alimentation Saine
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Produits vegan et végétariens identifiés
              </p>
            </div>
          </div>

          {/* Légende des badges */}
          <div 
            className="mt-8 p-5 rounded-xl border border-[#D3D3D3]/50"
            style={{ backgroundColor: `${colors.logo}03` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5" style={{ color: colors.logo }} />
              <h4 
                className="font-semibold"
                style={{ color: colors.logo }}
              >
                Légende des badges :
              </h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Produit Bio
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: '#2E8B57',
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Vegan
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: '#6B8E23',
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Végétarien
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: colors.success,
                    color: 'white'
                  }}
                >
                  <Heart className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Score santé élevé
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlimentationCategorie;