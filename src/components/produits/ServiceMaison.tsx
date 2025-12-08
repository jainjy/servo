import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
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
  Menu,
  ShoppingCart,
  Star,
  Package,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const ServicesMaison = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("Toutes");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const subcategoryIcons = {
    Ménage: <Sparkles className="h-5 w-5" />,
    Jardinage: <Leaf className="h-5 w-5" />,
    Plomberie: <Droplets className="h-5 w-5" />,
    Électricité: <Zap className="h-5 w-5" />,
    Peinture: <Paintbrush className="h-5 w-5" />,
    Bricolage: <Hammer className="h-5 w-5" />,
    Serrurerie: <Key className="h-5 w-5" />,
    Climatisation: <Snowflake className="h-5 w-5" />,
    Toutes: <Home className="h-5 w-5" />,
  };

  const subcategoryColors = {
    Ménage: "bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]/30",
    Jardinage: "bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30",
    Plomberie: "bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513]/30",
    Électricité: "bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]/30",
    Peinture: "bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30",
    Bricolage: "bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513]/30",
    Serrurerie: "bg-[#D3D3D3]/20 text-[#556B2F] border-[#D3D3D3]/40",
    Climatisation: "bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/30",
    Toutes: "bg-[#556B2F] text-white hover:bg-[#6B8E23]",
  };

  useEffect(() => {
    fetchServicesMaisonProducts();
  }, []);

  useEffect(() => {
    const filtered =
      selectedSubcategory === "Toutes"
        ? products
        : products.filter((p) => p.subcategory === selectedSubcategory);
    setFilteredProducts(filtered);
  }, [selectedSubcategory, products]);

  const fetchServicesMaisonProducts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/products", {
        params: { category: "Services Maison", status: "active" },
      });
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Erreur chargement des services maison");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) return toast.warning("Connectez-vous pour ajouter au panier");
    setAddingProductId(product.id);
    addToCart(product);
    toast.success(`${product.name} ajouté !`);
    setAddingProductId(null);
  };

  const subcategories = [
    "Toutes",
    ...new Set(products.map((p) => p.subcategory).filter(Boolean)),
  ];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/loading.gif" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMobileFilters(false)}
        />
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Header mobile */}
        <div className="lg:hidden mb-6 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#556B2F]/10">
                <Home className="h-6 w-6 text-[#556B2F]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Services Maison</h2>
                <p className="text-sm text-gray-600">Tout pour votre maison</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg">
              {filteredProducts.length}
            </Badge>
          </div>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setShowMobileFilters(true)}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filtres
            </span>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Header desktop */}
        <div className="hidden lg:block mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-[#556B2F]/10">
                  <Home className="h-10 w-10 text-[#556B2F]" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-[#0A0A0A]">
                    Services Maison
                  </h2>
                  <p className="text-xl text-gray-600">
                    Entretien, réparation et amélioration de votre domicile
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xl px-5 py-3">
                {filteredProducts.length} service
                {filteredProducts.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres */}
          <aside
            className={`${
              showMobileFilters ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white lg:bg-transparent transition-transform duration-300`}
          >
            <div className="p-6">
              <Card className="border-0 shadow-lg">
                <div className="p-6 space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <Filter className="h-6 w-6 text-[#556B2F]" /> Catégories
                  </h3>
                  <div className="space-y-3">
                    {subcategories.map((cat) => (
                      <Button
                        key={cat}
                        variant="ghost"
                        className={`w-full justify-start text-left py-4 px-5 rounded-xl font-medium transition-all
                          ${
                            selectedSubcategory === cat
                              ? subcategoryColors[cat]
                              : "hover:bg-gray-50"
                          }`}
                        onClick={() => {
                          setSelectedSubcategory(cat);
                          setShowMobileFilters(false);
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-4">
                            {subcategoryIcons[cat]}
                            <span>{cat}</span>
                          </div>
                          {cat !== "Toutes" && (
                            <Badge variant="secondary">
                              {
                                products.filter((p) => p.subcategory === cat)
                                  .length
                              }
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </aside>

          {/* Produits */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-xl transition-all border border-gray-200"
                    >
                      <div className="relative">
                        {product.images?.[0] ? (
                          <div
                            className="h-56 bg-cover bg-center"
                            style={{
                              backgroundImage: `url(${product.images[0]})`,
                            }}
                          />
                        ) : (
                          <div className="h-56 bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10 flex items-center justify-center">
                            <Package className="h-16 w-16 text-[#556B2F]/40" />
                          </div>
                        )}
                        {product.subcategory && (
                          <Badge
                            className={`absolute top-3 left-3 ${
                              subcategoryColors[product.subcategory] || ""
                            }`}
                          >
                            {subcategoryIcons[product.subcategory]}{" "}
                            <span className="ml-1">{product.subcategory}</span>
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                            <Star className="h-3 w-3 mr-1 fill-current" />{" "}
                            Populaire
                          </Badge>
                        )}
                      </div>

                      <div className="p-5 space-y-4">
                        <h3 className="font-bold text-lg line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex justify-between items-end">
                          <span className="text-2xl font-bold text-[#556B2F]">
                            €{product.price}
                          </span>
                          <Badge
                            variant={
                              product.quantity > 0 ? "default" : "destructive"
                            }
                          >
                            {product.quantity > 0
                              ? "Disponible"
                              : "Indisponible"}
                          </Badge>
                        </div>

                        <Button
                          className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-medium"
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            product.quantity === 0 ||
                            addingProductId === product.id
                          }
                        >
                          {addingProductId === product.id ? (
                            "Ajout..."
                          ) : (
                            <>
                              <ShoppingCart className="h-5 w-5 mr-2" /> Réserver
                              ce service
                            </>
                          )}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Home className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">
                    Aucun service{" "}
                    {selectedSubcategory !== "Toutes"
                      ? selectedSubcategory.toLowerCase()
                      : "maison"}{" "}
                    trouvé
                  </h3>
                  <Button
                    onClick={() => setSelectedSubcategory("Toutes")}
                    className="bg-[#556B2F] hover:bg-[#6B8E23]"
                  >
                    Voir tous les services
                  </Button>
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
