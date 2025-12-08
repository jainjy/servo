import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ShoppingCart, Star, Tag } from "lucide-react";
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
      const response = await api.get("/products/all", {
        params: { productType: "general", status: "active" },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Erreur chargement produits généraux:", error);
      setProducts([]);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning("Veuillez vous connecter pour ajouter au panier");
      return;
    }
    try {
      setAddingProductId(product.id);
      addToCart(product);
      await new Promise((r) => setTimeout(r, 100));
      toast.success(`${product.name} ajouté au panier !`);
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <img src="/loading.gif" className="w-32 h-32" alt="chargement" />
          <p className="text-gray-600 mt-4">
            Chargement des produits généraux...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#556B2F]/10">
                  <Tag className="h-7 w-7 text-[#556B2F]" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-[#0A0A0A]">
                    Produits Généraux
                  </h2>
                  <p className="text-[#5A6470]">
                    Une sélection variée pour tous vos besoins
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {products.length} produit{products.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>

        {/* Grid produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Image */}
                <div className="relative">
                  {product.images?.[0] ? (
                    <div
                      className="h-56 bg-cover bg-center"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10 flex items-center justify-center">
                      <Package className="h-16 w-16 text-[#556B2F]/40" />
                    </div>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Populaire
                    </Badge>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-[#556B2F] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-bold text-[#556B2F]">
                        €{product.price}
                      </span>
                      {product.comparePrice > product.price && (
                        <span className="block text-sm text-gray-500 line-through">
                          €{product.comparePrice}
                        </span>
                      )}
                    </div>
                    <Badge
                      variant={product.quantity > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {product.quantity > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </div>

                  {product.vendor?.companyName && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.vendor.companyName}</span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-medium"
                    onClick={() => handleAddToCart(product)}
                    disabled={
                      product.quantity === 0 || addingProductId === product.id
                    }
                  >
                    {addingProductId === product.id ? (
                      <>Ajout en cours...</>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.quantity > 0
                          ? "Ajouter au panier"
                          : "Rupture de stock"}
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Package className="h-20 w-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-700">
                Aucun produit général trouvé
              </h3>
              <Button
                onClick={() => navigate("/produits")}
                className="mt-6 bg-[#556B2F] hover:bg-[#6B8E23]"
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
