import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Brush, 
  Search, 
  Filter, 
  X,
  ShoppingCart,
  Star,
  Package,
  Eye,
  Heart,
  Zap,
  Tag,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

interface DesignProduct {
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
  category: string;
  tags?: string[];
  viewCount?: number;
}

interface DesignSectionProps {
  searchQuery?: string;
}

const DesignSection = ({
  searchQuery,
}: DesignSectionProps) => {
  const [products, setProducts] = useState<DesignProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "newest">("popular");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Toutes");
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [viewedProducts, setViewedProducts] = useState<Set<string>>(new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (localSearch) {
      loadProducts();
    }
  }, [localSearch]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/design/products', {
        params: { 
          search: localSearch,
          limit: 50
        }
      });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts(getMockProducts());
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data pour le développement
  const getMockProducts = (): DesignProduct[] => {
    return [
      {
        id: "1",
        name: "Tableau abstrait moderne 'Harmonie'",
        description: "Tableau d'art abstrait aux couleurs vives, parfait pour donner une touche contemporaine à votre intérieur. Encadrement en bois naturel.",
        price: 189.99,
        comparePrice: 229.99,
        images: ["https://images.unsplash.com/photo-1579762594264-d83c8fb8678e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Tableaux",
        quantity: 18,
        featured: true,
        slug: "tableau-abstrait-moderne-harmonie",
        category: "Design & Décoration",
        tags: ["art", "moderne", "décoration"],
        viewCount: 156
      },
      {
        id: "2",
        name: "Vase en céramique artisanale",
        description: "Vase haut en céramique émaillée, finition mate avec motifs géométriques. Pièce unique artisanale.",
        price: 79.99,
        comparePrice: 99.99,
        images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Vases",
        quantity: 25,
        featured: true,
        slug: "vase-en-ceramique-artisanale",
        category: "Design & Décoration",
        tags: ["céramique", "artisanal", "décoration"],
        viewCount: 89
      },
      {
        id: "3",
        name: "Lampe de sol design arc",
        description: "Lampe de sol avec structure en arc métallique, abat-jour en tissu. Hauteur réglable, éclairage d'ambiance chaleureux.",
        price: 249.00,
        comparePrice: 299.00,
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Luminaires",
        quantity: 8,
        featured: true,
        slug: "lampe-de-sol-design-arc",
        category: "Design & Décoration",
        tags: ["lampe", "design", "éclairage"],
        viewCount: 124
      },
      {
        id: "4",
        name: "Coussin velours côtelé",
        description: "Coussin décoratif en velours côtelé de qualité. Remplissage plumes. 45x45cm. Doux et confortable.",
        price: 34.99,
        comparePrice: 44.99,
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Coussins",
        quantity: 40,
        featured: false,
        slug: "coussin-velours-cotile",
        category: "Design & Décoration",
        tags: ["coussin", "velours", "décoration"],
        viewCount: 67
      },
      {
        id: "5",
        name: "Bougie parfumée vanille",
        description: "Bougie artisanale parfum vanille bourbon. 300g, brûlée environ 50 heures. Ambiance chaleureuse garantie.",
        price: 29.99,
        comparePrice: 39.99,
        images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Bougies",
        quantity: 50,
        featured: false,
        slug: "bougie-parfumee-vanille",
        category: "Design & Décoration",
        tags: ["bougie", "parfum", "ambiance"],
        viewCount: 92
      },
      {
        id: "6",
        name: "Tapis shaggy haute qualité",
        description: "Tapis moelleux en fibres synthétiques. 160x230cm, lavable en machine. Confort et élégance pour votre salon.",
        price: 129.00,
        comparePrice: 169.00,
        images: ["https://images.unsplash.com/photo-1575414003591-ece6b6c7cb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Tapis",
        quantity: 10,
        featured: true,
        slug: "tapis-shaggy-haute-qualite",
        category: "Design & Décoration",
        tags: ["tapis", "moelleux", "salon"],
        viewCount: 145
      },
      {
        id: "7",
        name: "Miroir soleil doré",
        description: "Miroir décoratif forme soleil avec rayons dorés. Diamètre 80cm. Cadre en résine dorée de haute qualité.",
        price: 199.00,
        comparePrice: 249.00,
        images: ["https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Miroirs",
        quantity: 7,
        featured: true,
        slug: "miroir-soleil-dore",
        category: "Design & Décoration",
        tags: ["miroir", "doré", "décoration"],
        viewCount: 78
      },
      {
        id: "8",
        name: "Set de 3 vases en verre soufflé",
        description: "Collection de 3 vases en verre soufflé à la main, tailles assorties. Parfait pour centre de table ou étagère.",
        price: 129.00,
        comparePrice: 159.00,
        images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        subcategory: "Vases",
        quantity: 15,
        featured: false,
        slug: "set-de-3-vases-en-verre-souffle",
        category: "Design & Décoration",
        tags: ["vase", "verre", "collection"],
        viewCount: 56
      }
    ];
  };

  // Filtrer et trier les produits
  const filteredProducts = products.filter(product => {
    if (selectedSubcategory === "Toutes") return true;
    return product.subcategory === selectedSubcategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return (b.viewCount || 0) - (a.viewCount || 0);
      case "popular":
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.viewCount || 0) - (a.viewCount || 0);
    }
  });

  const handleProductClick = (product: DesignProduct) => {
    setViewedProducts(prev => new Set([...prev, product.id]));
    navigate(`/produits/${product.slug}`, {
      state: { product }
    });
  };

  const handleAddToCart = async (product: DesignProduct, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la navigation
    
    if (!user) {
      toast.warning("Connectez-vous pour ajouter des articles au panier");
      navigate('/login');
      return;
    }

    if (product.quantity === 0) {
      toast.error("Ce produit est actuellement épuisé");
      return;
    }

    setAddingProductId(product.id);
    
    try {
      await addToCart({
        ...product,
        quantity: 1
      });
      
      toast.success(`${product.name} a été ajouté au panier !`, {
        action: {
          label: "Voir le panier",
          onClick: () => navigate('/cart')
        }
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  const handleAddToWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const clearSearch = () => {
    setLocalSearch("");
  };

  const subcategories = ["Toutes", ...new Set(products.map(p => p.subcategory).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="bg-[#FFFFFF]/70 p-5 pb-14 my-5 rounded-lg" id="design">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-[#556B2F] shadow-lg">
            <Brush className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl lg:text-4xl font-bold text-[#556B2F]">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#8B4513] mt-2">
              Chargement des produits...
            </p>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <img src="/loading.gif" alt="Chargement" className="w-24 h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF]/70 p-5 pb-14 my-5 rounded-lg" id="design">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-3 rounded-xl bg-[#556B2F] shadow-lg">
            <Brush className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl lg:text-4xl font-bold text-[#556B2F]">
              Design & Décoration
            </h2>
            <p className="text-xs lg:text-sm text-[#8B4513] mt-2">
              Découvrez nos produits design pour sublimer votre intérieur
            </p>
          </div>
          <Badge className="text-lg px-4 py-2 bg-[#556B2F]">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Input
              placeholder="Rechercher un produit design..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10 rounded-xl border-[#D3D3D3] focus:border-[#556B2F] h-12"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8B4513]" />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8B4513] hover:text-[#556B2F]"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-[#D3D3D3] h-12"
          >
            <Filter className="h-5 w-5" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-[#FFFFFF]/50 p-4 rounded-lg mb-6 border border-[#D3D3D3] animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className="text-sm font-medium text-[#8B4513]">
              Trier par :
            </span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("popular")}
                className={
                  sortBy === "popular"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Populaire
              </Button>
              <Button
                variant={sortBy === "newest" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("newest")}
                className={
                  sortBy === "newest"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                <Zap className="h-4 w-4 mr-2" />
                Nouveautés
              </Button>
              <Button
                variant={sortBy === "price-asc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("price-asc")}
                className={
                  sortBy === "price-asc"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                Prix croissant
              </Button>
              <Button
                variant={sortBy === "price-desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("price-desc")}
                className={
                  sortBy === "price-desc"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                Prix décroissant
              </Button>
            </div>
          </div>

          {/* Filtre par sous-catégorie */}
          <div>
            <span className="text-sm font-medium text-[#8B4513] mb-2 block">
              Catégorie :
            </span>
            <div className="flex flex-wrap gap-2">
              {subcategories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedSubcategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubcategory(cat)}
                  className={
                    selectedSubcategory === cat
                      ? "bg-[#556B2F] text-white"
                      : "border-[#D3D3D3]"
                  }
                >
                  <Tag className="h-3 w-3 mr-2" />
                  {cat}
                  {cat !== "Toutes" && (
                    <Badge variant="secondary" className="ml-2">
                      {products.filter(p => p.subcategory === cat).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      {localSearch && (
        <div className="mb-6 animate-fade-in">
          <p className="text-[#8B4513]">
            {sortedProducts.length > 0
              ? `${sortedProducts.length} produit(s) trouvé(s) pour "${localSearch}"`
              : `Aucun produit trouvé pour "${localSearch}"`}
          </p>
        </div>
      )}

      {/* Grid des produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? sortedProducts.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-[#556B2F]/30 cursor-pointer relative bg-white"
            onClick={() => handleProductClick(product)}
          >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {product.featured && (
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0 shadow-lg">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Populaire
                </Badge>
              )}
              {product.comparePrice && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg">
                  -{Math.round((1 - product.price / product.comparePrice) * 100)}%
                </Badge>
              )}
            </div>

            {/* Bouton wishlist */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white shadow-md rounded-full h-8 w-8"
              onClick={(e) => handleAddToWishlist(product.id, e)}
            >
              <Heart 
                className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>

            {/* Image du produit */}
            <div className="relative h-56 overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10 flex items-center justify-center">
                  <Package className="h-16 w-16 text-[#556B2F]/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Overlay avec bouton rapide */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                <Button
                  className="bg-white text-[#556B2F] hover:bg-[#556B2F] hover:text-white shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={product.quantity === 0 || addingProductId === product.id}
                >
                  {addingProductId === product.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#556B2F] mr-2"></div>
                      Ajout...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter au panier
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Infos du produit */}
            <div className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs border-[#D3D3D3] text-gray-600">
                    {product.subcategory}
                  </Badge>
                  {viewedProducts.has(product.id) && (
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                      <Eye className="h-3 w-3 mr-1" />
                      Déjà vu
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#556B2F] transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1 min-h-[40px]">
                  {product.description}
                </p>
              </div>

              {/* Prix et stock */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#556B2F]">
                      €{product.price.toFixed(2)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        €{product.comparePrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.viewCount && (
                    <p className="text-xs text-gray-500">
                      {product.viewCount} vues
                    </p>
                  )}
                </div>
                <Badge 
                  variant={product.quantity > 10 ? "default" : product.quantity > 0 ? "secondary" : "destructive"}
                  className="bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]/20 hover:bg-[#556B2F]/20"
                >
                  {product.quantity > 10 ? "En stock" : product.quantity > 0 ? `${product.quantity} restant${product.quantity > 1 ? 's' : ''}` : "Épuisé"}
                </Badge>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
                  {product.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bouton principal */}
              <Button
                className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-medium h-11"
                onClick={(e) => handleAddToCart(product, e)}
                disabled={product.quantity === 0 || addingProductId === product.id}
              >
                {addingProductId === product.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.quantity > 0 ? "Ajouter au panier" : "Épuisé"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        )) : (
          <div className="col-span-full text-center py-20 animate-fade-in">
            <div className="bg-white/80 p-8 rounded-2xl border border-[#D3D3D3] max-w-md mx-auto">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {localSearch ? "Aucun produit trouvé" : "Aucun produit disponible"}
              </h3>
              <p className="text-gray-600 mb-6">
                {localSearch 
                  ? "Essayez de modifier vos critères de recherche" 
                  : "Revenez bientôt pour découvrir nos nouvelles collections"
                }
              </p>
              {(localSearch || selectedSubcategory !== "Toutes") && (
                <Button
                  onClick={() => {
                    setLocalSearch("");
                    setSelectedSubcategory("Toutes");
                  }}
                  className="bg-[#556B2F] hover:bg-[#6B8E23]"
                >
                  Voir tous les produits
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination (si nécessaire) */}
      {sortedProducts.length > 0 && sortedProducts.length >= 50 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="border-[#D3D3D3]">
            Charger plus de produits
          </Button>
        </div>
      )}
    </div>
  );
};

export default DesignSection;