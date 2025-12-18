// components/components/MedecineNaturelle.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Leaf,
  ShieldCheck,
  Truck,
  Star,
  ShoppingCart,
  Search,
  Package,
  Sparkles,
  Zap,
  Flame,
  Droplets,
  Flower2,
  Thermometer,
  Brain,
  Moon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

const MedecineNaturelle = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");

  useEffect(() => {
    if (categoryName) {
      fetchCategoryProducts();
    } else {
      fetchAllProducts();
    }
  }, [categoryName]);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/medecine-naturelle');

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/medecine-naturelle/category/${encodeURIComponent(categoryName)}`
      );

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
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
      addToCart(product);
      
      const cartItem = cartItems.find(item => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 1;
      const totalItems = getCartItemsCount();

      toast.success(`${product.name} ajouté au panier !`, {
        description: `Quantité: ${quantity} - Total articles: ${totalItems}`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error("Erreur lors de l'ajout au panier");
    }
  };

  // Catégories de médecine naturelle
  const categories = [
    { id: 'tous', name: 'Tous les produits', icon: Leaf, count: products.length },
    { id: 'plantes', name: 'Plantes Médicinales', icon: Flower2, count: products.filter(p => p.category === 'plantes').length },
    { id: 'huiles', name: 'Huiles Essentielles', icon: Droplets, count: products.filter(p => p.category === 'huiles').length },
    { id: 'infusions', name: 'Infusions & Tisanes', icon: Flame, count: products.filter(p => p.category === 'infusions').length },
    { id: 'complements', name: 'Compléments', icon: Package, count: products.filter(p => p.category === 'complements').length },
    { id: 'soins', name: 'Soins Externes', icon: Heart, count: products.filter(p => p.category === 'soins').length }
  ];

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.benefits && product.benefits.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'tous' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex-col pt-16 bg-white flex items-center justify-center">
        <img src="/loading.gif" alt="Chargement" />
        <p className="mt-4 text-black">Chargement des produits de médecine naturelle...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-[#556B2F]"></div>
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/736x/20/5a/8d/205a8d8d2e988763c7513ecab5bdfe6a.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            MÉDECINE NATURELLE
          </h1>
          <p className="text-white text-lg max-w-2xl">
            Redécouvrez les bienfaits des plantes et des remèdes naturels pour votre santé et bien-être
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-6 border border-[#D3D3D3]">
          {/* Barre de recherche */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8B4513]" />
              <input
                type="text"
                placeholder="Rechercher un remède, une plante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#D3D3D3] focus:outline-none focus:ring-2 focus:ring-[#556B2F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-[#8B4513] mb-4">Catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${selectedCategory === cat.id
                      ? 'bg-[#556B2F] text-white border-[#556B2F]'
                      : 'bg-white text-black border-[#D3D3D3] hover:border-[#8B4513]'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium text-center">{cat.name}</span>
                    <span className={`text-xs mt-1 px-2 py-0.5 rounded-full ${selectedCategory === cat.id
                      ? 'bg-[#6B8E23] text-white'
                      : 'bg-[#D3D3D3] text-black'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liste des produits */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-4 hover:shadow-md transition-shadow border border-[#D3D3D3]">
                  {/* Image du produit */}
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#6B8E23]/10 flex items-center justify-center">
                        <Leaf className="h-12 w-12 text-[#556B2F]/40" />
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {product.isOrganic && (
                        <Badge className="bg-[#556B2F] text-white">
                          <Leaf className="h-3 w-3 mr-1" />
                          Bio
                        </Badge>
                      )}
                      {product.category === 'plantes' && (
                        <Badge className="bg-[#8B4513] text-white">
                          Plante
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Informations produit */}
                  <h3 className="font-semibold text-lg mb-2 text-[#8B4513]">{product.name}</h3>
                  <p className="text-black text-sm mb-3 line-clamp-2">{product.description}</p>

                  {/* Indications */}
                  {product.indications && product.indications.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-black mb-1">Indications:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.indications.slice(0, 3).map((indication, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-[#6B8E23]/10 text-black border border-[#6B8E23]/20"
                          >
                            {indication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mode d'utilisation */}
                  {product.usage && (
                    <div className="mb-3">
                      <p className="text-xs text-black mb-1">Utilisation: {product.usage}</p>
                    </div>
                  )}

                  {/* Prix et stock */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-[#556B2F]">
                        €{product.price?.toFixed(2) || '0.00'}
                      </span>
                      {product.unit && (
                        <span className="text-sm text-black ml-1">/ {product.unit}</span>
                      )}
                    </div>
                    <Badge className={`${product.stock > 0 ? 'bg-[#556B2F]' : 'bg-red-500'} text-white`}>
                      {product.stock > 0 ? 'En stock' : 'Rupture'}
                    </Badge>
                  </div>

                  {/* Bouton d'action */}
                  <Button
                    className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-[#8B4513] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-[#8B4513]">Aucun produit trouvé</h3>
              <p className="text-black mb-6">
                Aucun produit ne correspond à votre recherche.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('tous');
                }}
                className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              >
                Voir tous les produits
              </Button>
            </div>
          )}

          {/* Section informations */}
          <div className="mt-12 pt-8 border-t border-[#D3D3D3]">
            <h2 className="text-xl font-bold text-[#8B4513] mb-6">La Médecine Naturelle</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-[#556B2F] mb-3">Nos engagements</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Leaf className="h-5 w-5 text-[#556B2F] mr-2 mt-0.5" />
                    <span className="text-black">Produits 100% naturels et biologiques</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-[#556B2F] mr-2 mt-0.5" />
                    <span className="text-black">Qualité certifiée et contrôlée</span>
                  </li>
                  <li className="flex items-start">
                    <Truck className="h-5 w-5 text-[#556B2F] mr-2 mt-0.5" />
                    <span className="text-black">Livraison écologique et responsable</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#556B2F] mb-3">Précautions d'usage</h3>
                <p className="text-black text-sm">
                  Les produits de médecine naturelle sont des compléments et ne remplacent pas un traitement médical.
                  Consultez toujours un professionnel de santé avant utilisation, surtout en cas de grossesse,
                  allaitement ou traitement médical en cours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecineNaturelle;