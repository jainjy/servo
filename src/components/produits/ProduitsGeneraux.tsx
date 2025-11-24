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
  Tag
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

const ProduitsGeneraux = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    fetchGeneralProducts();
  }, []);

  const fetchGeneralProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products', {
        params: {
          productType: 'general',
          status: 'active'
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits généraux:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <img src="/loading.gif" className="w-32 h-32" alt="" />
          <p className=" text-gray-600">Chargement des produits généraux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-col md:flex-row  gap-3">
                <div className="p-2 rounded-xl hidden md:block bg-[#0052FF]/10">
                  <Tag className="h-6 w-6 text-slate-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A]">
                    Produits Généraux
                  </h2>
                  <p className="text-[#5A6470]">
                    Découvrez tous nos produits généraux - une sélection variée pour tous vos besoins
                  </p>
                </div>
                 {/* Badge de comptage */}
                 <Badge variant="secondary" className="px-3 py-1 ml-0 md:ml-96">
                {products.length} produit{products.length > 1 ? 's' : ''}
              </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Produits généraux */}
        <div className="bg-white rounded-3xl  ">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {products.map((product) => (
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

                  {/* En-tête du produit avec badge */}
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

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Prix et stock */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900">
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

                  {/* Catégorie */}
                  {product.category && (
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                  )}

                  {/* Bouton Ajouter au panier */}
                  <Button
                    className="w-full bg-slate-900 hover:bg-slate-700 text-white transition-all duration-300 group-hover:scale-105 shadow-md"
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
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit général trouvé</h3>
              <p className="text-muted-foreground">
                Aucun produit de type général disponible pour le moment.
              </p>
              <Button
                onClick={() => navigate('/produits')}
                className="mt-4 bg-[#0052FF] hover:bg-[#003EE6]"
              >
                Voir toutes les catégories
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProduitsGeneraux;