import React, { useEffect, useRef, useState } from "react";
import { Droplets, Leaf, Package, Search, Star, ShoppingCart, Flower, Shield, Zap, CheckCircle, Calendar, ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../components/contexts/CartContext";
import { toast } from "sonner";
import api from "@/lib/api";

// Composant d'animation personnalisé
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Composant de carte d'huile essentielle
const HuileEssentielleCard = ({ huile, onAddToCart, addingProductId }) => {
  // Fonction pour obtenir la couleur du badge santé
  const getHealthScoreColor = (score) => {
    if (score >= 9) return "bg-green-500 text-white";
    if (score >= 7) return "bg-green-400 text-white";
    if (score >= 5) return "bg-yellow-500 text-white";
    if (score >= 3) return "bg-orange-500 text-white";
    return "bg-red-500 text-white";
  };

  // Fonction pour obtenir le texte du badge santé
  const getHealthScoreText = (score) => {
    if (score >= 9) return "Très sain";
    if (score >= 7) return "Sain";
    if (score >= 5) return "Modéré";
    if (score >= 3) return "Occasionnel";
    return "À limiter";
  };

  const handleAddToCart = async () => {
    try {
      await onAddToCart(huile);
    } catch (error) {
      // L'erreur est déjà gérée dans onAddToCart
    }
  };

  // Extraire le volume du champ unit (ex: "flacon 10ml" → "10ml")
  const extractVolume = (unit) => {
    if (!unit) return "10ml";
    const match = unit.match(/\d+\s*ml/i);
    return match ? match[0] : "10ml";
  };

  // Extraire le type d'unité (ex: "flacon 10ml" → "flacon")
  const extractUnitType = (unit) => {
    if (!unit) return "flacon";
    return unit.split(' ')[0] || "flacon";
  };

  const volume = extractVolume(huile.unit);
  const unitType = extractUnitType(huile.unit);

  return (
    <Card key={huile.id} className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm">
      {huile.images && huile.images.length > 0 ? (
        <div className="relative">
          <img
            src={huile.images[0]}
            alt={huile.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
            }}
          />
          {/* Badges sur l'image */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-2 max-w-[70%]">
            {huile.isOrganic && (
              <Badge className="bg-green-500 text-white text-xs">
                <Leaf className="h-3 w-3 mr-1" />
                Bio
              </Badge>
            )}
            
            {/* Badges Vegan/Végétarien */}
            {huile.isVegan && (
              <Badge className="bg-green-600 text-white text-xs">
                <Leaf className="h-3 w-3 mr-1" />
                Vegan
              </Badge>
            )}
            {!huile.isVegan && huile.isVegetarian && (
              <Badge className="bg-lime-500 text-white text-xs">
                <Leaf className="h-3 w-3 mr-1" />
                Végétarien
              </Badge>
            )}
            
            {/* Badge Santé */}
            {huile.healthScore && huile.healthScore >= 7 && (
              <Badge className="bg-blue-500 text-white text-xs">
                <Flower className="h-3 w-3 mr-1" />
                Sain
              </Badge>
            )}

            {huile.origin && (
              <Badge
                variant="secondary"
                className="bg-white/90 text-gray-700 text-xs"
              >
                {huile.origin}
              </Badge>
            )}
          </div>

          {/* Badge stock en haut à droite */}
          <div className="absolute top-2 right-2">
            <Badge
              variant={huile.quantity > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              {huile.quantity > 0 ? "En stock" : "Rupture"}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-logo/20 to-primary-dark/10 rounded-lg mb-4 flex items-center justify-center">
          <Droplets className="h-12 w-12 text-logo/40" />
        </div>
      )}

      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-logo transition-colors">
        {huile.name}
      </h3>

      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
        {huile.description}
      </p>

      {/* Badges supplémentaires sous la description */}
      <div className="flex flex-wrap gap-1 mb-3">
        {/* Score santé détaillé */}
        {huile.healthScore && (
          <Badge 
            variant="outline" 
            className={`text-xs ${getHealthScoreColor(huile.healthScore)} border-0`}
          >
            <Flower className="h-3 w-3 mr-1" />
            {getHealthScoreText(huile.healthScore)} ({huile.healthScore}/10)
          </Badge>
        )}

        {/* Badge Non-végétarien si applicable 
        {!huile.isVegan && !huile.isVegetarian && (
          <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
            Non-végétarien
          </Badge>
        )}*/}
      </div>

      {/* Informations supplémentaires */}
      <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Droplets className="h-3 w-3" />
          <span>{volume}</span>
        </div>
        {huile.origin && (
          <span className="flex items-center">
            <Package className="h-3 w-3 mr-1" />
            {huile.origin}
          </span>
        )}
      </div>

      {/* Prix et stock */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-2xl font-bold text-logo">
            €{typeof huile.price === 'number' ? huile.price.toFixed(2) : '0.00'}
          </span>
          <span className="text-sm text-gray-500 ml-1">
            / {huile.unit || unitType}
          </span>
        </div>
        
        {/* Indicateur de quantité en stock */}
        {huile.quantity > 0 && huile.quantity <= 10 && (
          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
            Plus que {huile.quantity}
          </Badge>
        )}
      </div>

      {/* Bouton Ajouter au panier */}
      <Button
        className="w-full bg-logo hover:bg-primary-dark text-white transition-all duration-300 shadow-md"
        onClick={handleAddToCart}
        disabled={huile.quantity === 0 || addingProductId === huile.id}
      >
        {addingProductId === huile.id ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Ajout...
          </div>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {huile.quantity > 0 ? "Ajouter au panier" : "Rupture de stock"}
          </>
        )}
      </Button>
    </Card>
  );
};

const HuilesEssentielles = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [huiles, setHuiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState(null);
  
  const { user } = useAuth();
  const { addToCart, cartItems, getCartItemsCount } = useCart();
  const navigate = useNavigate();

  // Charger les huiles essentielles depuis le backend
  useEffect(() => {
    const fetchHuilesEssentielles = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Chargement des huiles essentielles...");
        
        // OPTION 1: Récupérer TOUS les produits puis filtrer côté client
        const response = await api.get('/products');
        console.log("📦 Réponse API:", response.data);
        
        if (response.data && response.data.products) {
          // Filtrer pour ne garder que les huiles essentielles
          const huilesFiltered = response.data.products.filter(product => 
            product.category === "Huiles Essentielles" || 
            product.foodCategory === "huiles-essentielles" ||
            product.productType === "aromatherapie" ||
            (product.name && product.name.toLowerCase().includes("huile"))
          );
          
          console.log(`✅ ${huilesFiltered.length} huiles essentielles trouvées`);
          setHuiles(huilesFiltered);
        } else if (response.data && Array.isArray(response.data)) {
          // Si l'API retourne directement un tableau
          const huilesFiltered = response.data.filter(product => 
            product.category === "Huiles Essentielles" || 
            product.foodCategory === "huiles-essentielles" ||
            product.productType === "aromatherapie" ||
            (product.name && product.name.toLowerCase().includes("huile"))
          );
          
          console.log(`✅ ${huilesFiltered.length} huiles essentielles trouvées`);
          setHuiles(huilesFiltered);
        } else {
          console.log("⚠️ Aucun produit trouvé ou format de réponse inattendu");
          setHuiles([]);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement des huiles essentielles:", error);
        
        // En cas d'erreur, utiliser des données mock pour le développement
        console.log("🔄 Utilisation de données mock pour le développement");
        setHuiles([
          {
            id: "HE001",
            name: "Lavande Vraie Bio",
            description: "Huile essentielle apaisante et relaxante, parfaite pour le sommeil et la détente.",
            price: 19.90,
            quantity: 25,
            images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            isOrganic: true,
            isVegan: true,
            isVegetarian: true,
            healthScore: 9,
            origin: "France",
            unit: "flacon 10ml",
            category: "Huiles Essentielles",
            subcategory: "Relaxation"
          },
          {
            id: "HE002",
            name: "Menthe Poivrée",
            description: "Huile essentielle stimulante et rafraîchissante, idéale pour les maux de tête et la digestion.",
            price: 14.90,
            quantity: 35,
            images: ["https://images.unsplash.com/photo-1582719471384-8d3c1f8b25c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            isOrganic: false,
            isVegan: true,
            isVegetarian: true,
            healthScore: 8,
            origin: "Inde",
            unit: "flacon 10ml",
            category: "Huiles Essentielles",
            subcategory: "Énergie"
          },
          {
            id: "HE003",
            name: "Tea Tree Bio",
            description: "Huile essentielle antiseptique puissante naturelle pour les problèmes cutanés et respiratoires.",
            price: 16.90,
            quantity: 20,
            images: ["https://images.unsplash.com/photo-1601524909163-991bd9a5fead?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
            isOrganic: true,
            isVegan: true,
            isVegetarian: true,
            healthScore: 9,
            origin: "Australie",
            unit: "flacon 15ml",
            category: "Huiles Essentielles",
            subcategory: "Santé"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHuilesEssentielles();
  }, []);

  // Créer les catégories basées sur les sous-catégories disponibles
  const categories = [
    { id: 'all', name: 'Toutes', count: huiles.length },
    ...Array.from(new Set(huiles.map(h => h.subcategory)))
      .filter(subcat => subcat)
      .map(subcat => ({
        id: subcat,
        name: subcat,
        count: huiles.filter(h => h.subcategory === subcat).length
      }))
  ];

  const filteredHuiles = huiles.filter(huile =>
    (activeCategory === 'all' || huile.subcategory === activeCategory) &&
    (huile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     huile.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.warning("Veuillez vous connecter pour ajouter des articles au panier");
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(product.id);

      // Ajouter le produit au panier
      await addToCart(product);

      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      // Trouver l'article dans le panier pour afficher la bonne quantité
      const cartItem = cartItems.find(item => item.id === product.id);
      const quantity = cartItem ? cartItem.quantity : 1;
      const totalItems = getCartItemsCount();

      // Afficher une confirmation détaillée
      toast.success(`${product.name} ajouté au panier !`, {
        description: `Quantité: ${quantity} • Total articles: ${totalItems}`,
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || "Erreur lors de l'ajout au panier");
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#F6F8FA] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-logo border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="mt-4 text-gray-600">Chargement des huiles essentielles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 bg-[#F6F8FA]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête 
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                
                <div className="p-2 rounded-xl bg-logo/10">
                  <Droplets className="h-6 w-6 text-logo" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Huiles Essentielles
                  </h2>
                  <p className="text-gray-600 text-xs">
                    Découvrez nos huiles essentielles 100% pures et naturelles
                  </p>
                </div>
              </div>

              {/* Badges d'information 
              <div className="hidden md:flex gap-2">
                <Badge
                  variant="outline"
                  className="bg-logo/10 text-logo border-0"
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison 24h
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-logo/10 text-logo border-0"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Qualité garantie
                </Badge>
              </div>
            </div>
          </div>
        </div>
        */}

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher une huile essentielle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pl-12 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-logo focus:border-logo transition-colors duration-200"
                />
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id
                        ? 'bg-logo text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category.name}
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeCategory === category.id
                        ? 'bg-white/20'
                        : 'bg-gray-200'
                      }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des huiles essentielles */}
        <div className="bg-white rounded-3xl p-6">
          {filteredHuiles && filteredHuiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHuiles.map((huile) => (
                <SlideIn key={huile.id} direction="up" delay={0}>
                  <HuileEssentielleCard 
                    huile={huile} 
                    onAddToCart={handleAddToCart}
                    addingProductId={addingProductId}
                  />
                </SlideIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Droplets className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune huile essentielle trouvée</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? `Aucun résultat pour "${searchTerm}"`
                  : "Aucune huile essentielle disponible pour le moment. Veuillez exécuter le seeder des huiles essentielles."}
              </p>
              <Button
                onClick={() => navigate("/domicile")}
                className="mt-4 bg-logo hover:bg-primary-dark"
              >
                Retour à l'accueil
              </Button>
            </div>
          )}

          {/* Section Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-logo/5 rounded-xl p-4 text-center">
              <Truck className="h-8 w-8 text-logo mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Livraison Rapide</h4>
              <p className="text-sm text-gray-600">
                Sous 24h pour préserver la qualité
              </p>
            </div>
            <div className="bg-logo/5 rounded-xl p-4 text-center">
              <Shield className="h-8 w-8 text-logo mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Qualité Garantie</h4>
              <p className="text-sm text-gray-600">
                Huiles 100% pures et naturelles
              </p>
            </div>
            <div className="bg-logo/5 rounded-xl p-4 text-center">
              <Leaf className="h-8 w-8 text-logo mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Produits Bio</h4>
              <p className="text-sm text-gray-600">
                Large sélection de produits biologiques
              </p>
            </div>
            <div className="bg-logo/5 rounded-xl p-4 text-center">
              <Flower className="h-8 w-8 text-logo mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800">Bien-être Naturel</h4>
              <p className="text-sm text-gray-600">
                Solutions naturelles pour votre santé
              </p>
            </div>
          </div>

          {/* Légende des badges
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-800 mb-3">Légende des badges :</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600 text-white text-xs">
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span className="text-sm text-gray-600">Vegan</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-lime-500 text-white text-xs">
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span className="text-sm text-gray-600">Végétarien</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white text-xs">
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span className="text-sm text-gray-600">Bio</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500 text-white text-xs">
                  <Flower className="h-3 w-3" />
                </Badge>
                <span className="text-sm text-gray-600">Sain</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white text-xs">
                  <Star className="h-3 w-3" />
                </Badge>
                <span className="text-sm text-gray-600">Populaire</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HuilesEssentielles;