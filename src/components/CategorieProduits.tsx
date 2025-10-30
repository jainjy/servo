// pages/CategorieProduits.js
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Package,
  Flame, 
  Zap, 
  Sofa, 
  Palette, 
  Sprout, 
  Wrench, 
  Lock, 
  Lamp,
  Warehouse, 
  Thermometer, 
  Square, 
  TreePine, 
  DoorClosed, 
  Droplets,
  Brush, 
  Wand2, 
  PaintBucket, 
  Home, 
  Construction,
  Users,
  Phone,
  Calendar,
  ShoppingCart
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "./contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

// Fonction pour obtenir l'icône par nom
const getIconByName = (iconName) => {
  const icons = {
    Flame, Zap, Sofa, Palette, Sprout, Wrench, Lock, Lamp,
    Warehouse, Thermometer, Square, TreePine, DoorClosed, Droplets,
    Brush, Wand2, PaintBucket, Home, Construction
  };
  return icons[iconName] || Package;
};

const CategorieProduits = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);

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
      const response = await api.get('/products', {
        params: {
          category: categoryName,
          status: 'active'
        }
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits de la catégorie:', error);
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
      <div className="min-h-screen pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0052FF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F6F8FA]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la catégorie */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/produits')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux catégories
          </Button>

          <div className="bg-white rounded-3xl p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {category?.iconName && (
                  <div className="p-2 rounded-xl bg-[#0052FF]/10">
                    {(() => {
                      const IconComponent = getIconByName(category.iconName);
                      return <IconComponent className="h-6 w-6 text-[#0052FF]" />;
                    })()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A]">
                    {category?.name || decodeURIComponent(categoryName)}
                  </h2>
                  <p className="text-[#5A6470]">
                    {category?.description || "Découvrez tous nos produits dans cette catégorie"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produits de la catégorie */}
        <div className="bg-white rounded-3xl p-6">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm">
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

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#0052FF] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-[#0052FF]">
                      €{product.price}
                    </span>
                    <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                      {product.quantity > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </div>

                  {product.vendor?.companyName && (
                    <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.vendor.companyName}</span>
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
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CategorieProduits;