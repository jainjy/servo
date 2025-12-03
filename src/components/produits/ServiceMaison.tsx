import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  Star,
  Home,
  Wrench,
  Sparkles,
  Leaf,
  Droplets,
  Zap,
  Paintbrush,
  Hammer,
  Key,
  Snowflake,
  Filter,
  X,
  Menu
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

const ServicesMaison = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("Toutes");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Icônes pour chaque sous-catégorie
  const subcategoryIcons = {
    "Ménage": <Sparkles className="h-4 w-4" />,
    "Jardinage": <Leaf className="h-4 w-4" />,
    "Plomberie": <Droplets className="h-4 w-4" />,
    "Électricité": <Zap className="h-4 w-4" />,
    "Peinture": <Paintbrush className="h-4 w-4" />,
    "Bricolage": <Hammer className="h-4 w-4" />,
    "Serrurerie": <Key className="h-4 w-4" />,
    "Climatisation": <Snowflake className="h-4 w-4" />,
    "Toutes": <Home className="h-4 w-4" />
  };

  // Couleurs pour chaque sous-catégorie
  const subcategoryColors = {
    "Ménage": "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    "Jardinage": "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
    "Plomberie": "bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200",
    "Électricité": "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
    "Peinture": "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
    "Bricolage": "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200",
    "Serrurerie": "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    "Climatisation": "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
    "Toutes": "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
  };

  useEffect(() => {
    fetchServicesMaisonProducts();
  }, []);

  useEffect(() => {
    if (selectedSubcategory === "Toutes") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.subcategory === selectedSubcategory));
    }
  }, [selectedSubcategory, products]);

  const fetchServicesMaisonProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products', {
        params: {
          category: 'Services Maison',
          status: 'active'
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits Services Maison:', error);
      setProducts([]);
      toast.error("Erreur lors du chargement des produits");
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
      toast.info(`${product.name} ajouté au panier !`);

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  // Obtenir toutes les sous-catégories uniques
  const subcategories = ["Toutes", ...new Set(products.map(product => product.subcategory).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <img src="/loading.gif" alt="" />
          <p className="mt-4 text-gray-600">Chargement des services maison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay mobile pour les filtres */}
      {showMobileFilters && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        {/* En-tête de la page - Mobile */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#0052FF]/10">
                  <Home className="h-5 w-5 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0A0A0A]">
                    Services Maison
                  </h2>
                  <p className="text-[#5A6470] text-sm">
                    Tout pour votre maison
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredProducts.length}
              </Badge>
            </div>
            
            {/* Bouton filtres mobile */}
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => setShowMobileFilters(true)}
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
                {selectedSubcategory !== "Toutes" && (
                  <Badge variant="default" className="ml-2">
                    {selectedSubcategory}
                  </Badge>
                )}
              </div>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* En-tête de la page - Desktop */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#0052FF]/10">
                  <Home className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0A0A0A]">
                    Services Maison
                  </h2>
                  <p className="text-[#5A6470] text-lg">
                    Tout pour l'entretien, la réparation et l'amélioration de votre maison
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Contenu principal - Layout deux colonnes */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Colonne gauche - Filtres (Desktop) & Panneau mobile */}
          <div className={`
            ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-1/4
            bg-white lg:bg-transparent z-50 lg:z-auto
            transition-transform duration-300 lg:transition-none
            lg:block
          `}>
            {/* En-tête mobile du panneau filtres */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filtres</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Contenu des filtres */}
            <div className="p-4 lg:p-0">
              <Card className="border-0 lg:border shadow-lg lg:shadow-sm rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {subcategories.map((subcategory) => (
                      <Button
                        key={subcategory}
                        variant="ghost"
                        className={`
                          w-full justify-start text-left h-auto py-3 px-4 rounded-xl
                          ${selectedSubcategory === subcategory 
                            ? subcategoryColors[subcategory] 
                            : 'hover:bg-gray-100'
                          }
                          transition-all duration-200
                        `}
                        onClick={() => {
                          setSelectedSubcategory(subcategory);
                          setShowMobileFilters(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            {subcategoryIcons[subcategory]}
                            <span className="font-medium">{subcategory}</span>
                          </div>
                          {subcategory !== "Toutes" && (
                            <Badge 
                              variant="secondary" 
                              className={`
                                ${selectedSubcategory === subcategory 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-gray-200 text-gray-700'
                                }
                              `}
                            >
                              {products.filter(p => p.subcategory === subcategory).length}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="pt-6 border-t">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total produits</span>
                      <Badge variant="outline">{products.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sous-catégories</span>
                      <Badge variant="outline">{subcategories.length - 1}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Filtre actif</span>
                      <Badge 
                        variant={selectedSubcategory === "Toutes" ? "outline" : "default"}
                        className={selectedSubcategory !== "Toutes" ? subcategoryColors[selectedSubcategory] : ''}
                      >
                        {selectedSubcategory}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bouton reset mobile */}
                <div className="lg:hidden mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedSubcategory("Toutes");
                      setShowMobileFilters(false);
                    }}
                    disabled={selectedSubcategory === "Toutes"}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Colonne droite - Produits */}
          <div className="flex-1">
            {/* En-tête produits avec filtre actif (Desktop) */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">
                  {selectedSubcategory === "Toutes" 
                    ? "Tous les services maison" 
                    : `Services : ${selectedSubcategory}`
                  }
                </h3>
                {selectedSubcategory !== "Toutes" && (
                  <Badge 
                    variant="outline"
                    className={subcategoryColors[selectedSubcategory]}
                  >
                    {products.filter(p => p.subcategory === selectedSubcategory).length} produits
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedSubcategory !== "Toutes" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubcategory("Toutes")}
                    className="text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Effacer le filtre
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate('/produits')}
                  className="text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </div>
            </div>

            {/* Grid de produits */}
            <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm">
              {filteredProducts && filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="p-3 lg:p-4 hover:shadow-lg transition-all duration-300 group border border-gray-100 hover:border-gray-200">
                      {/* Image du produit */}
                      <div className="relative">
                        {product.images && product.images.length > 0 ? (
                          <div
                            className="w-full h-40 lg:h-48 bg-cover bg-center rounded-lg mb-3 lg:mb-4"
                            style={{ backgroundImage: `url(${product.images[0]})` }}
                          />
                        ) : (
                          <div className="w-full h-40 lg:h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-3 lg:mb-4 flex items-center justify-center">
                            <Package className="h-10 w-10 lg:h-12 lg:w-12 text-primary/40" />
                          </div>
                        )}
                        {/* Badge sous-catégorie sur image */}
                        {product.subcategory && (
                          <Badge
                            className={`
                              absolute top-2 left-2 text-xs
                              ${subcategoryColors[product.subcategory] || "bg-gray-100 text-gray-800"}
                              border-0
                            `}
                          >
                            {subcategoryIcons[product.subcategory]}
                            <span className="ml-1">{product.subcategory}</span>
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-2 right-2 bg-yellow-500 text-white border-0">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Populaire
                          </Badge>
                        )}
                      </div>

                      {/* Contenu du produit */}
                      <div className="space-y-2 lg:space-y-3">
                        <h3 className="font-semibold text-base lg:text-lg line-clamp-2 group-hover:text-[#0052FF] transition-colors">
                          {product.name}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {product.description}
                        </p>

                        {/* Prix et stock */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex flex-col">
                            <span className="text-xl lg:text-2xl font-bold text-slate-900">
                              €{product.price}
                            </span>
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                €{product.comparePrice}
                              </span>
                            )}
                          </div>
                          <Badge 
                            variant={product.quantity > 0 ? "default" : "destructive"}
                            className="text-xs lg:text-sm"
                          >
                            {product.quantity > 0 ? "En stock" : "Rupture"}
                          </Badge>
                        </div>

                        {/* Informations vendeur */}
                        {product.vendor?.companyName && (
                          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />
                            <span className="line-clamp-1">{product.vendor.companyName}</span>
                          </div>
                        )}

                        {/* Bouton Ajouter au panier */}
                        <Button
                          className="w-full bg-slate-900 hover:bg-slate-700 text-white text-sm lg:text-base transition-all duration-300 group-hover:scale-[1.02] shadow-md"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.quantity === 0 || addingProductId === product.id}
                        >
                          {addingProductId === product.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Ajout...
                            </div>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.quantity > 0 ? "Ajouter au panier" : "Rupture"}
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 lg:py-12">
                  <Wrench className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-700">
                    {selectedSubcategory === "Toutes"
                      ? "Aucun service maison trouvé"
                      : `Aucun produit dans ${selectedSubcategory}`
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {selectedSubcategory === "Toutes"
                      ? "Aucun produit de services maison disponible pour le moment."
                      : `Aucun produit disponible dans la catégorie ${selectedSubcategory}.`
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {selectedSubcategory !== "Toutes" && (
                      <Button
                        onClick={() => setSelectedSubcategory("Toutes")}
                        className="bg-[#0052FF] hover:bg-[#003EE6]"
                      >
                        Voir tous les services maison
                      </Button>
                    )}
                    <Button
                      onClick={() => navigate('/produits')}
                      variant="outline"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour aux catégories
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesMaison;