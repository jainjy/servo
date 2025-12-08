import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Zap, Droplets, Wifi, Flame, Gauge, Sun, Recycle, Battery, Package, ShoppingCart, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

const UtilitiesProduits = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("Toutes");

  const icons = {
    "Électricité": <Zap className="h-5 w-5" />,
    "Eau": <Droplets className="h-5 w-5" />,
    "Internet": <Wifi className="h-5 w-5" />,
    "Gaz": <Flame className="h-5 w-5" />,
    "Smart Meter": <Gauge className="h-5 w-5" />,
    "Solar Energy": <Sun className="h-5 w-5" />,
    "Waste Management": <Recycle className="h-5 w-5" />,
    "Home Battery": <Battery className="h-5 w-5" />,
    "Toutes": <Package className="h-5 w-5" />
  };

  useEffect(() => { fetchUtilities(); }, []);

  useEffect(() => {
    const filtered = selectedSubcategory === "Toutes"
      ? products
      : products.filter(p => p.subcategory === selectedSubcategory);
    setFilteredProducts(filtered);
  }, [selectedSubcategory, products]);

  const fetchUtilities = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/products', { params: { category: 'Utilities', status: 'active' } });
      setProducts(res.data.products);
    } catch (err) {
      toast.error("Erreur chargement utilities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) return toast.warning("Connectez-vous pour ajouter");
    setAddingProductId(product.id);
    addToCart(product);
    toast.success(`${product.name} ajouté !`);
    setAddingProductId(null);
  };

  const subcategories = ["Toutes", ...new Set(products.map(p => p.subcategory).filter(Boolean))];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><img src="/loading.gif" alt="chargement" /></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-5">
                <div className="p-4 rounded-xl bg-[#556B2F]/10">
                  <Zap className="h-10 w-10 text-[#556B2F]" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-[#0A0A0A]">Utilities & Énergie</h2>
                  <p className="text-xl text-gray-600">Gestion complète de vos consommations</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xl px-5 py-3">
                {filteredProducts.length} solution{filteredProducts.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-8 flex flex-wrap gap-3">
          {subcategories.map(cat => (
            <Button
              key={cat}
              variant={selectedSubcategory === cat ? "default" : "outline"}
              className={`font-medium ${selectedSubcategory === cat ? 'bg-[#556B2F] hover:bg-[#6B8E23]' : ''}`}
              onClick={() => setSelectedSubcategory(cat)}
            >
              {icons[cat]} <span className="ml-2">{cat}</span>
              {cat !== "Toutes" && (
                <Badge variant="secondary" className="ml-2">
                  {products.filter(p => p.subcategory === cat).length}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all border border-gray-200">
              <div className="relative">
                {product.images?.[0] ? (
                  <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${product.images[0]})` }} />
                ) : (
                  <div className="h-56 bg-gradient-to-br from-[#556B2F]/10 to-[#6B8E23]/10 flex items-center justify-center">
                    <Package className="h-16 w-16 text-[#556B2F]/40" />
                  </div>
                )}
                {product.subcategory && (
                  <Badge className="absolute top-3 left-3 bg-[#556B2F]/10 text-[#556B2F] border-[#556B2F]/30">
                    {icons[product.subcategory]} <span className="ml-1">{product.subcategory}</span>
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1 fill-current" /> Populaire
                  </Badge>
                )}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-bold text-xl">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-[#556B2F]">€{product.price}</span>
                  <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                    {product.quantity > 0 ? "Disponible" : "Épuisé"}
                  </Badge>
                </div>

                <Button
                  className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white font-medium"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Souscrire
                </Button>
              </div>
            </Card>
          )) : (
            <div className="col-span-full text-center py-20">
              <Zap className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700">Aucune solution trouvée</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilitiesProduits;