import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Snowflake
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
    "Ménage": "bg-blue-100 text-blue-800 border-blue-200",
    "Jardinage": "bg-green-100 text-green-800 border-green-200",
    "Plomberie": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "Électricité": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Peinture": "bg-purple-100 text-purple-800 border-purple-200",
    "Bricolage": "bg-orange-100 text-orange-800 border-orange-200",
    "Serrurerie": "bg-gray-100 text-gray-800 border-gray-200",
    "Climatisation": "bg-indigo-100 text-indigo-800 border-indigo-200"
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
      <div className="min-h-screen pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052FF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des services maison...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F6F8FA]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#0052FF]/10">
                  <Home className="h-6 w-6 text-[#0052FF]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A]">
                    Services Maison
                  </h2>
                  <p className="text-[#5A6470]">
                    Tout pour l'entretien, la réparation et l'amélioration de votre maison
                  </p>
                </div>
              </div>
              
              {/* Badge de comptage */}
              <Badge variant="secondary" className="px-3 py-1">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filtres par sous-catégorie */}
        <div className="mb-6 bg-white rounded-3xl p-4">
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory}
                variant={selectedSubcategory === subcategory ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  selectedSubcategory === subcategory 
                    ? "bg-[#0052FF] text-white" 
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                {subcategoryIcons[subcategory]}
                {subcategory}
                {subcategory !== "Toutes" && (
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-white">
                    {products.filter(p => p.subcategory === subcategory).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Produits Services Maison */}
        <div className="bg-white rounded-3xl p-6">
          {filteredProducts && filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm">
                  {/* Image du produit */}
                  {product.images && product.images.length > 0 ? (
                    <div
                      className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-primary/40" />
                    </div>
                  )}

                  {/* En-tête du produit avec badge de sous-catégorie */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-[#0052FF] transition-colors flex-1 mr-2">
                      {product.name}
                    </h3>
                    {product.featured && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800 border-0">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Populaire
                      </Badge>
                    )}
                  </div>

                  {/* Badge de sous-catégorie */}
                  {product.subcategory && (
                    <div className="mb-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs flex items-center gap-1 w-fit ${
                          subcategoryColors[product.subcategory] || "bg-gray-100 text-gray-800 border-gray-200"
                        }`}
                      >
                        {subcategoryIcons[product.subcategory]}
                        {product.subcategory}
                      </Badge>
                    </div>
                  )}

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Prix et stock */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-[#0052FF]">
                        €{product.price}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          €{product.comparePrice}
                        </span>
                      )}
                    </div>
                    <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                      {product.quantity > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </div>

                  {/* Informations vendeur */}
                  {product.vendor?.companyName && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="line-clamp-1">{product.vendor.companyName}</span>
                    </div>
                  )}

                  {/* Bouton Ajouter au panier */}
                  <Button
                    className="w-full bg-[#0052FF] hover:bg-[#003EE6] text-white transition-all duration-300 group-hover:scale-105 shadow-md"
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {selectedSubcategory === "Toutes" 
                  ? "Aucun service maison trouvé" 
                  : `Aucun produit dans ${selectedSubcategory}`
                }
              </h3>
              <p className="text-muted-foreground">
                {selectedSubcategory === "Toutes"
                  ? "Aucun produit de services maison disponible pour le moment."
                  : `Aucun produit disponible dans la catégorie ${selectedSubcategory}.`
                }
              </p>
              {selectedSubcategory !== "Toutes" && (
                <Button 
                  onClick={() => setSelectedSubcategory("Toutes")} 
                  className="mt-4 bg-[#0052FF] hover:bg-[#003EE6]"
                >
                  Voir tous les services maison
                </Button>
              )}
              <Button 
                onClick={() => navigate('/produits')} 
                variant="outline"
                className="mt-4 ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux catégories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicesMaison;