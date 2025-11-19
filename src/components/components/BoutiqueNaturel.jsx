// components/components/BoutiqueNaturel.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  Leaf,
  Sparkles,
  Zap,
  Flame,
  Truck,
  ShieldCheck,
  Star,
  ShoppingCart,
  Heart,
  Search
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

// Fonction pour obtenir l'icône par nom de catégorie
const getCategoryIcon = (categoryName) => {
  const icons = {
    "Huiles Essentielles": Sparkles,
    "Thés & Infusions": Leaf,
    "Ambiance & Relaxation": Heart,
    "Soins Bien-être": Zap,
    "Compléments Alimentaires": Flame,
    "Accessoires": Package
  };

  return icons[categoryName] || Package;
};

const BoutiqueNaturel = () => {
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
  const [selectedProductType, setSelectedProductType] = useState("tous");

  useEffect(() => {
    // Si on est sur une page de catégorie spécifique
    if (categoryName) {
      fetchCategoryProducts();
    } else {
      // Si on est sur la page principale, charger tous les produits naturels
      fetchAllNaturalProducts();
    }
  }, [categoryName]);

  const fetchAllNaturalProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/produits-naturels');

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits naturels:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/produits-naturels/food-category/${encodeURIComponent(categoryName)}`
      );

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits de la catégorie:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning("Veuillez vous connecter pour ajouter des articles au panier");
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
        description: `Quantité: ${quantity} - Total articles: ${totalItems}`,
        duration: 3000,
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  // Fonction pour extraire les bénéfices du nutritionalInfo
  const getProductBenefits = (product) => {
    if (!product.nutritionalInfo) return [];

    if (Array.isArray(product.nutritionalInfo.benefits)) {
      return product.nutritionalInfo.benefits;
    }

    // Si les bénéfices sont stockés différemment dans l'objet
    const benefits = [];
    if (product.nutritionalInfo.usage) benefits.push(product.nutritionalInfo.usage);
    if (product.nutritionalInfo.properties) benefits.push(product.nutritionalInfo.properties);

    return benefits.slice(0, 3); // Limiter à 3 bénéfices maximum
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex-col pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <img src="/loading.gif" alt="" />
        <p className="mt-4 text-gray-600">Chargement des produits naturels...</p>

      </div>
    );
  }

  // Filtrer les produits selon la recherche
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.origin && product.origin.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Obtenir les catégories uniques des produits
  const productCategories = [
    { id: 'tous', name: 'Tous les produits', count: products.length }
  ];

  // Ajouter les catégories uniques
  const uniqueCategories = [...new Set(products.map(p => p.origin))].filter(Boolean);
  uniqueCategories.forEach(cat => {
    productCategories.push({
      id: cat,
      name: cat,
      count: products.filter(p => p.origin === cat).length
    });
  });

  // Appliquer le filtre par type de produit
  const finalFilteredProducts = selectedProductType === 'tous'
    ? filteredProducts
    : filteredProducts.filter(product => product.origin === selectedProductType);

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la catégorie */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
        </div>
        <div className="mb-2">
          <div className="flex flex-col gap-5 justify-between items-center">
            <div className="flex flex-col  items-center gap-5">

              <h2 className="text-xl lg:text-5xl font-bold text-white tracking-widest">
                {category?.name || decodeURIComponent(categoryName || "Produits Naturels").replace(/-/g, " ")}
              </h2>
              <p className="text-gray-200 text-xs lg:text-sm">
                {category?.description || "Découvrez nos produits naturels et biologiques pour votre bien-être"}
              </p>

            </div>

            {/* Badges d'information */}
            <div className="hidden md:flex gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 backdrop-blur-lg border border-blue-400/40 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group">
                <Truck className="h-3 w-3 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                <span className="text-xs font-semibold text-blue-100 drop-shadow-[0_0_4px_rgba(96,165,250,0.4)]">Livraison 48h</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 backdrop-blur-lg border border-green-400/40 shadow-lg hover:shadow-green-500/25 transition-all duration-300 group">
                <ShieldCheck className="h-3 w-3 text-green-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                <span className="text-xs font-semibold text-green-100 drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]">Naturel & Bio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits naturels */}
        <div className="bg-white rounded-3xl p-6">
          {/* Barre de recherche */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Filtrage par type de produit */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedProductType(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedProductType === cat.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                >
                  {cat.name}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${selectedProductType === cat.id
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-300 text-gray-700'
                    }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {finalFilteredProducts && finalFilteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFilteredProducts.map((product) => {
                const benefits = getProductBenefits(product);

                return (
                  <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm">
                    {product.images && product.images.length > 0 ? (
                      <div className="relative">
                        <div
                          className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                          style={{ backgroundImage: `url(${product.images[0]})` }}
                        />
                        {/* Badges sur l'image */}
                        <div className="absolute top-2 left-2 flex gap-2">
                          {product.isOrganic && (
                            <Badge className="bg-green-500 text-white">
                              <Leaf className="h-3 w-3 mr-1" />
                              Bio
                            </Badge>
                          )}
                          {product.origin && (
                            <Badge
                              variant="secondary"
                              className="bg-white/90 text-gray-700"
                            >
                              {product.origin}
                            </Badge>
                          )}
                          {product.featured && (
                            <Badge className="bg-amber-500 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Vedette
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-slate-900/20 to-slate-900/10 rounded-lg mb-4 flex items-center justify-center">
                        <Package className="h-12 w-12 text-slate-900/40" />
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-slate-900 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Bénéfices du produit */}
                    {benefits.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Bénéfices:</p>
                        <div className="flex flex-wrap gap-1">
                          {benefits.map((benefit, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Informations supplémentaires */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                      <span>Unité: {product.unit || "pièce"}</span>
                      {product.origin && (
                        <span className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {product.origin}
                        </span>
                      )}
                    </div>

                    {/* Allergènes */}
                    {product.allergens && product.allergens.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Précautions:</p>
                        <div className="flex flex-wrap gap-1">
                          {product.allergens.map((allergen, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs bg-amber-50 text-amber-600 border-amber-200"
                            >
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-slate-900">
                          €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            €{product.comparePrice.toFixed(2)}
                          </span>
                        )}
                        {product.unit && (
                          <span className="text-sm text-gray-500 ml-1">
                            / {product.unit}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={product.quantity > 0 ? "default" : "destructive"}
                        className={product.quantity > 0 ? "bg-slate-900" : ""}
                      >
                        {product.quantity > 0 ? "En stock" : "Rupture"}
                      </Badge>
                    </div>

                    {product.vendor?.companyName && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        <span>{product.vendor.companyName}</span>
                      </div>
                    )}

                    {/* Bouton Ajouter au panier */}
                    <Button
                      className="w-full bg-slate-900 hover:bg-slate-700 text-white transition-all duration-300 shadow-md"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0 || addingProductId === product.id}
                    >
                      {addingProductId === product.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ajout...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
                        </>
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `Aucun produit ne correspond à "${searchQuery}"`
                  : 'Aucun produit naturel disponible pour le moment.'}
              </p>
              {searchQuery ? (
                <Button
                  onClick={() => setSearchQuery("")}
                  className="bg-slate-900 hover:bg-slate-700"
                >
                  Réinitialiser la recherche
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/bien-etre")}
                  className="bg-slate-900 hover:bg-slate-700"
                >
                  Retour au bien-être
                </Button>
              )}
            </div>
          )}

          {/* Section Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-900/5 rounded-xl p-4 text-center">
              <Leaf className="h-8 w-8 text-slate-900 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">100% Naturel</h4>
              <p className="text-sm text-gray-600">
                Produits naturels et biologiques certifiés
              </p>
            </div>
            <div className="bg-slate-900/5 rounded-xl p-4 text-center">
              <ShieldCheck className="h-8 w-8 text-slate-900 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">Qualité Premium</h4>
              <p className="text-sm text-gray-600">
                Sélection rigoureuse des meilleurs produits
              </p>
            </div>
            <div className="bg-slate-900/5 rounded-xl p-4 text-center">
              <Truck className="h-8 w-8 text-slate-900 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900">Livraison Éco</h4>
              <p className="text-sm text-gray-600">
                Emballages recyclables et écologiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueNaturel;