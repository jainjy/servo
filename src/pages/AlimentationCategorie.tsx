// pages/AlimentationCategorie.js
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  Users,
  Phone,
  Calendar,
  ShoppingCart,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useCart } from "@/components/contexts/CartContext";

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

      // Utiliser l'API aliments avec le paramètre de catégorie
      const response = await api.get(
        `/aliments/category/${encodeURIComponent(categoryName)}`
      );
      setProducts(response.data.products);
      console.log(response.data)
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
      alert("Veuillez vous connecter pour ajouter des articles au panier");
      return;
    }

    try {
      setAddingProductId(product.id);

      // Ajouter le produit au panier
      addToCart(product);

      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Trouver l'article dans le panier pour afficher la bonne quantité
      const cartItem = cartItems.find((item) => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 1;
      const totalItems = getCartItemsCount();

      // Afficher une confirmation détaillée
      alert(
        `✅ ${product.name} ajouté au panier !\n\nQuantité: ${quantity}\nTotal dans le panier: ${totalItems} article(s)`
      );

      console.log("Cart after addition:", cartItems);
      console.log("Total items count:", totalItems);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  // Fonction pour formater le nom de la catégorie
  const formatCategoryName = (name) => {
    return decodeURIComponent(name).replace(/-/g, " ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2A8] mx-auto"></div>
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
            onClick={() => navigate("/alimentation")}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'alimentation
          </Button>

          <div className="bg-white rounded-3xl p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {category?.iconName && (
                  <div className="p-2 rounded-xl bg-[#00C2A8]/10">
                    {(() => {
                      const IconComponent = getIconByName(category.iconName);
                      return (
                        <IconComponent className="h-6 w-6 text-[#00C2A8]" />
                      );
                    })()}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#0A0A0A]">
                    {category?.name || formatCategoryName(categoryName)}
                  </h2>
                  <p className="text-[#5A6470]">
                    {category?.description ||
                      "Découvrez nos produits frais et de qualité"}
                  </p>
                </div>
              </div>

              {/* Badges d'information */}
              <div className="hidden md:flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-[#00C2A8]/10 text-[#00C2A8] border-0"
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison 24h
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-[#00C2A8]/10 text-[#00C2A8] border-0"
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Fraîcheur garantie
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Produits de la catégorie */}
        <div className="bg-white rounded-3xl p-6">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm"
                >
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
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#00C2A8]/20 to-[#00C2A8]/10 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-[#00C2A8]/40" />
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#00C2A8] transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Informations supplémentaires */}
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
                    <span>Unité: {product.unit || "pièce"}</span>
                    {product.origin && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {product.origin}
                      </span>
                    )}
                  </div>

                  {/* Allergènes */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Allergènes:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.allergens.map((allergen, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-red-50 text-red-600 border-red-200"
                          >
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-2xl font-bold text-[#00C2A8]">
                        €{product.price}
                      </span>
                      {product.unit && (
                        <span className="text-sm text-gray-500 ml-1">
                          / {product.unit}
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={product.quantity > 0 ? "default" : "destructive"}
                    >
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
                    className="w-full bg-[#00C2A8] hover:bg-[#00A890] text-white transition-all duration-300 group-hover:scale-105 shadow-md"
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      product.quantity === 0 || addingProductId === product.id
                    }
                  >
                    {addingProductId === product.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Ajout...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.quantity > 0
                          ? "Ajouter au panier"
                          : "Rupture de stock"}
                      </>
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-muted-foreground">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
              <Button
                onClick={() => navigate("/alimentation")}
                className="mt-4 bg-[#00C2A8] hover:bg-[#00A890]"
              >
                Retour à l'alimentation
              </Button>
            </div>
          )}

          {/* Section Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-[#00C2A8]/5 rounded-xl p-4 text-center">
              <Truck className="h-8 w-8 text-[#00C2A8] mx-auto mb-2" />
              <h4 className="font-semibold text-[#00C2A8]">Livraison Rapide</h4>
              <p className="text-sm text-gray-600">
                Sous 24h pour préserver la fraîcheur
              </p>
            </div>
            <div className="bg-[#00C2A8]/5 rounded-xl p-4 text-center">
              <ShieldCheck className="h-8 w-8 text-[#00C2A8] mx-auto mb-2" />
              <h4 className="font-semibold text-[#00C2A8]">Qualité Garantie</h4>
              <p className="text-sm text-gray-600">
                Produits frais contrôlés quotidiennement
              </p>
            </div>
            <div className="bg-[#00C2A8]/5 rounded-xl p-4 text-center">
              <Leaf className="h-8 w-8 text-[#00C2A8] mx-auto mb-2" />
              <h4 className="font-semibold text-[#00C2A8]">Produits Bio</h4>
              <p className="text-sm text-gray-600">
                Large sélection de produits biologiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlimentationCategorie;
