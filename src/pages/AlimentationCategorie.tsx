// pages/AlimentationCategorie.jsx
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
  ShoppingCart,
  Utensils,
  Store,
  ShoppingBag,
  GlassWater,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "../components/contexts/CartContext";
import api from "@/lib/api";
import { toast } from "sonner";

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
    ShoppingCart,
    Utensils,
    Store,
    ShoppingBag,
    GlassWater,
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

  // Couleurs de la palette
  const colors = {
    logo: "#556B2F",
    primary: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

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

      // Utiliser l'API aliments avec le paramètre foodCategory
      const response = await api.get(
        `/aliments/food-category/${encodeURIComponent(categoryName)}`
      );

      if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }

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

  // Fonction pour obtenir la couleur du badge santé selon la nouvelle palette
  const getHealthScoreColor = (score) => {
    if (score >= 9) return "bg-green-600 text-white"; // Vert plus foncé
    if (score >= 7) return "bg-green-500 text-white"; // Vert
    if (score >= 5) return "bg-yellow-500 text-[#8B4513]"; // Jaune avec texte marron
    if (score >= 3) return "bg-orange-500 text-white"; // Orange
    return "bg-red-500 text-white"; // Rouge
  };

  // Fonction pour obtenir le texte du badge santé
  const getHealthScoreText = (score) => {
    if (score >= 9) return "Très sain";
    if (score >= 7) return "Sain";
    if (score >= 5) return "Modéré";
    if (score >= 3) return "Occasionnel";
    return "À limiter";
  };

  // Fonction pour déterminer la couleur de la section basée sur la catégorie
  const getSectionColor = () => {
    const sectionColors = {
      // Restaurants & Snacks
      'restaurants-traditionnels': '#556B2F',
      'snacks-rapides': '#556B2F',
      'food-trucks': '#556B2F',
      'brasseries-cafes': '#556B2F',
      
      // Produits Locaux
      'fruits-tropicaux': '#8B4513',
      'epices-saveurs': '#8B4513',
      'miels-confitures': '#8B4513',
      'rhum-arrange': '#8B4513',
      
      // Marchés & Artisans
      'marches-forains': '#D2691E',
      'artisans-alimentaires': '#D2691E',
      'boutiques-producteurs': '#D2691E',
      'epiceries-creoles': '#D2691E',
      
      // Bien-être & Alimentation
      'produits-bio': '#2E8B57',
      'super-aliments': '#2E8B57',
      'infusions-tisanes': '#2E8B57',
      'complements-alimentaires': '#2E8B57',
    };
    
    return sectionColors[categoryName] || colors.logo;
  };

  const sectionColor = getSectionColor();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 bg-[#F9F9F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#6B8E23]/20 to-[#556B2F]/20 flex items-center justify-center mx-auto mb-4">
            <Package className="h-16 w-16 text-[#556B2F]/40 animate-pulse" />
          </div>
          <p className="mt-4 text-[#8B4513]">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-[#F9F9F9]">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la catégorie */}
        <div className="mb-8">
          <div 
            className="bg-white rounded-3xl p-6 border-b shadow-sm"
            style={{ borderColor: colors.separator }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/alimentation')}
                  className="flex items-center gap-2 text-[#8B4513] hover:text-[#556B2F] hover:bg-[#6B8E23]/10"
                  style={{ borderColor: colors.separator }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Button>
                {category?.iconName && (
                  <div 
                    className="p-2 rounded-xl"
                    style={{ backgroundColor: `${sectionColor}10` }}
                  >
                    {(() => {
                      const IconComponent = getIconByName(category.iconName);
                      return (
                        <IconComponent 
                          className="h-6 w-6" 
                          style={{ color: sectionColor }}
                        />
                      );
                    })()}
                  </div>
                )}

                <div>
                  <h2 
                    className="text-2xl font-bold"
                    style={{ color: colors.logo }}
                  >
                    {category?.name || decodeURIComponent(categoryName).replace(/-/g, " ")}
                  </h2>
                  <p 
                    className="text-xs mt-1"
                    style={{ color: colors.secondaryText }}
                  >
                    {category?.description || "Découvrez tous nos produits dans cette catégorie"}
                  </p>
                </div>
              </div>

              {/* Badges d'information */}
              <div className="hidden md:flex gap-2">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${colors.logo}10`, 
                    color: colors.logo,
                    borderColor: colors.separator
                  }}
                >
                  <Truck className="h-3 w-3 mr-1" />
                  Livraison 24h
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{ 
                    backgroundColor: `${colors.primary}10`, 
                    color: colors.primary,
                    borderColor: colors.separator
                  }}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Fraîcheur garantie
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Produits de la catégorie */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="p-4 hover:shadow-lg transition-shadow group border-0 shadow-sm"
                  style={{ borderColor: colors.separator }}
                >
                  {product.images && product.images.length > 0 ? (
                    <div className="relative">
                      <div
                        className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                        style={{ backgroundImage: `url(${product.images[0]})` }}
                      />
                      {/* Badges sur l'image */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-2 max-w-[70%]">
                        {product.isOrganic && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: colors.primary,
                              color: 'white'
                            }}
                          >
                            <Leaf className="h-3 w-3 mr-1" />
                            Bio
                          </Badge>
                        )}
                        
                        {/* Badges Vegan/Végétarien */}
                        {product.isVegan && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: '#2E8B57',
                              color: 'white'
                            }}
                          >
                            <Leaf className="h-3 w-3 mr-1" />
                            Vegan
                          </Badge>
                        )}
                        {!product.isVegan && product.isVegetarian && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: '#6B8E23',
                              color: 'white'
                            }}
                          >
                            <Leaf className="h-3 w-3 mr-1" />
                            Végétarien
                          </Badge>
                        )}
                        
                        {/* Badge Santé */}
                        {product.healthScore && product.healthScore >= 7 && (
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: '#556B2F',
                              color: 'white'
                            }}
                          >
                            <Heart className="h-3 w-3 mr-1" />
                            Sain
                          </Badge>
                        )}

                        {product.origin && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              color: colors.secondaryText,
                              borderColor: colors.separator
                            }}
                          >
                            {product.origin}
                          </Badge>
                        )}
                      </div>

                      {/* Badge stock en haut à droite */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={product.quantity > 0 ? "default" : "destructive"}
                          className="text-xs"
                          style={product.quantity > 0 ? { 
                            backgroundColor: colors.primary,
                            color: 'white'
                          } : {}}
                        >
                          {product.quantity > 0 ? "En stock" : "Rupture"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="w-full h-48 rounded-lg mb-4 flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${colors.logo}10, ${colors.primary}10)` 
                      }}
                    >
                      <Package 
                        className="h-12 w-12" 
                        style={{ color: `${colors.logo}40` }}
                      />
                    </div>
                  )}

                  <h3 
                    className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#556B2F] transition-colors"
                    style={{ color: colors.logo }}
                  >
                    {product.name}
                  </h3>

                  <p 
                    className="text-sm mb-3 line-clamp-2"
                    style={{ color: colors.secondaryText }}
                  >
                    {product.description}
                  </p>

                  {/* Badges supplémentaires sous la description */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {/* Score santé détaillé */}
                    {product.healthScore && (
                      <Badge 
                        className={`text-xs ${getHealthScoreColor(product.healthScore)}`}
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        {getHealthScoreText(product.healthScore)} ({product.healthScore}/10)
                      </Badge>
                    )}

                    {/* Badge Non-végétarien si applicable */}
                    {!product.isVegan && !product.isVegetarian && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          color: colors.secondaryText,
                          borderColor: colors.separator
                        }}
                      >
                        Non-végétarien
                      </Badge>
                    )}
                  </div>

                  {/* Informations supplémentaires */}
                  <div 
                    className="flex items-center justify-between mb-3 text-sm"
                    style={{ color: colors.secondaryText }}
                  >
                    <span>Unité: {product.unit || "pièce"}</span>
                    {product.origin && (
                      <span className="flex items-center">
                        <Package className="h-3 w-3 mr-1" />
                        {product.origin}
                      </span>
                    )}
                  </div>

                  {/* Allergènes */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="mb-3">
                      <p 
                        className="text-xs mb-1"
                        style={{ color: colors.secondaryText }}
                      >
                        Allergènes:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {product.allergens.map((allergen, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              borderColor: '#FCA5A5'
                            }}
                          >
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prix et stock */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: colors.logo }}
                      >
                        €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </span>
                      {product.unit && (
                        <span 
                          className="text-sm ml-1"
                          style={{ color: colors.secondaryText }}
                        >
                          / {product.unit}
                        </span>
                      )}
                    </div>
                    
                    {/* Indicateur de quantité en stock */}
                    {product.quantity > 0 && product.quantity <= 10 && (
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: '#FFEDD5',
                          color: '#C2410C',
                          borderColor: '#FDBA74'
                        }}
                      >
                        Plus que {product.quantity}
                      </Badge>
                    )}
                  </div>

                  {product.vendor?.companyName && (
                    <div 
                      className="flex items-center gap-2 mb-4 text-sm"
                      style={{ color: colors.secondaryText }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.vendor.companyName}</span>
                    </div>
                  )}

                  {/* Bouton Ajouter au panier */}
                  <Button
                    className="w-full text-white transition-all duration-300 shadow-md"
                    style={{ 
                      backgroundColor: sectionColor,
                      hover: { 
                        backgroundColor: `${sectionColor}E6`,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0 || addingProductId === product.id}
                  >
                    {addingProductId === product.id ? (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" 
                        />
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
              <Package 
                className="h-16 w-16 mx-auto mb-4" 
                style={{ color: `${colors.logo}40` }}
              />
              <h3 
                className="text-xl font-semibold mb-2"
                style={{ color: colors.logo }}
              >
                Aucun produit trouvé
              </h3>
              <p 
                className="mb-4"
                style={{ color: colors.secondaryText }}
              >
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
              <Button
                onClick={() => navigate("/alimentation")}
                style={{ 
                  backgroundColor: colors.primary,
                  color: 'white'
                }}
              >
                Retour à l'alimentation
              </Button>
            </div>
          )}

          {/* Section Informations importantes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div 
              className="rounded-xl p-4 text-center"
              style={{ 
                backgroundColor: `${colors.logo}08`,
                border: `1px solid ${colors.separator}`
              }}
            >
              <Truck 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: colors.logo }}
              />
              <h4 
                className="font-semibold mb-1"
                style={{ color: colors.logo }}
              >
                Livraison Rapide
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Sous 24h pour préserver la fraîcheur
              </p>
            </div>
            <div 
              className="rounded-xl p-4 text-center"
              style={{ 
                backgroundColor: `${colors.primary}08`,
                border: `1px solid ${colors.separator}`
              }}
            >
              <ShieldCheck 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: colors.primary }}
              />
              <h4 
                className="font-semibold mb-1"
                style={{ color: colors.primary }}
              >
                Qualité Garantie
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Produits frais contrôlés quotidiennement
              </p>
            </div>
            <div 
              className="rounded-xl p-4 text-center"
              style={{ 
                backgroundColor: `${colors.logo}08`,
                border: `1px solid ${colors.separator}`
              }}
            >
              <Leaf 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: colors.logo }}
              />
              <h4 
                className="font-semibold mb-1"
                style={{ color: colors.logo }}
              >
                Produits Bio
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Large sélection de produits biologiques
              </p>
            </div>
            <div 
              className="rounded-xl p-4 text-center"
              style={{ 
                backgroundColor: `${colors.secondaryText}08`,
                border: `1px solid ${colors.separator}`
              }}
            >
              <Heart 
                className="h-8 w-8 mx-auto mb-2" 
                style={{ color: colors.secondaryText }}
              />
              <h4 
                className="font-semibold mb-1"
                style={{ color: colors.secondaryText }}
              >
                Alimentation Saine
              </h4>
              <p 
                className="text-sm"
                style={{ color: colors.secondaryText }}
              >
                Produits vegan et végétariens identifiés
              </p>
            </div>
          </div>

          {/* Légende des badges */}
          <div 
            className="mt-8 p-4 rounded-xl"
            style={{ 
              backgroundColor: `${colors.logo}05`,
              border: `1px solid ${colors.separator}`
            }}
          >
            <h4 
              className="font-semibold mb-3"
              style={{ color: colors.logo }}
            >
              Légende des badges :
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: '#2E8B57',
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Vegan
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Végétarien
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: colors.logo,
                    color: 'white'
                  }}
                >
                  <Leaf className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Bio
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: '#556B2F',
                    color: 'white'
                  }}
                >
                  <Heart className="h-3 w-3" />
                </Badge>
                <span 
                  className="text-sm"
                  style={{ color: colors.secondaryText }}
                >
                  Sain
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlimentationCategorie;