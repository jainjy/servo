// pages/Alimentation.js
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import "/fonts/Azonix.otf";
import {
  Search,
  Apple,
  Carrot,
  Wheat,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Coffee,
  Fish,
  Milk,
  Egg,
  ChefHat,
  Heart,
  Clock,
  Star,
  Leaf,
  Truck,
  ShieldCheck,
  X,
  Phone,
  Calendar,
  MapPin,
  Users,
  ShoppingCart,
  Wine,
  Utensils,
  Store,
  ShoppingBag,
  Beef,
  GlassWater,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

// Composant Skeleton Loading pour les catégories
const CategoryCardSkeleton = () => (
  <Card className="p-4 flex flex-col border-0 bg-white/90 backdrop-blur-md shadow-xl">
    <div className="w-full h-32 rounded-md mb-4 bg-gray-300 animate-pulse" />
    <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse" />
    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 animate-pulse" />
    <div className="h-10 bg-gray-300 rounded animate-pulse" />
  </Card>
);

const SectionSkeleton = () => (
  <div className="bg-white/80 p-5 pb-14 my-5 rounded-lg backdrop-blur-sm">
    <div className="flex items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4 w-full">
        <div className="p-3 rounded-2xl bg-gray-300 w-14 h-14 animate-pulse" />
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Composant Contact Modal
const ContactModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-[#D3D3D3] flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#556B2F]">
            {type === "contact" ? "Contactez-nous" : "Prendre rendez-vous"}
          </h2>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#6B8E23]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === "contact" ? (
                <Phone className="h-8 w-8 text-[#556B2F]" />
              ) : (
                <Calendar className="h-8 w-8 text-[#556B2F]" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-[#556B2F] mb-2">
              {type === "contact" ? "Service Client" : "Consultation Nutrition"}
            </h3>
            <p className="text-[#8B4513]">
              {type === "contact"
                ? "Notre équipe est disponible pour répondre à toutes vos questions."
                : "Planifiez une consultation avec nos nutritionnistes."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF]">
              <Phone className="h-5 w-5 text-[#556B2F]" />
              <div>
                <p className="font-semibold text-[#556B2F]">
                  +33 1 23 45 67 89
                </p>
                <p className="text-sm text-[#8B4513]">Lun-Sam 8h-20h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF]">
              <MapPin className="h-5 w-5 text-[#556B2F]" />
              <div>
                <p className="font-semibold text-[#556B2F]">
                  Marché Bio Paris 15
                </p>
                <p className="text-sm text-[#8B4513]">75015 Paris</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FFFFFF]">
              <Clock className="h-5 w-5 text-[#556B2F]" />
              <div>
                <p className="font-semibold text-[#556B2F]">Livraison</p>
                <p className="text-sm text-[#8B4513]">Sous 24h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("tel:+33123456789");
                }
              }}
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Alimentation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState("contact");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [sectionSearchQueries, setSectionSearchQueries] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart(user);

  // Charger les produits et catégories au montage du composant
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = null) => {
    try {
      setIsLoading(true);
      const params = { status: "active" };
      if (category) {
        params.category = category;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get("/aliments", { params });
      setProducts(response.data.products);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des produits alimentaires:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await api.get("/aliments/categories");
      setCategories(response.data);

      // Créer un objet avec les comptes par catégorie pour un accès facile
      const counts = {};
      response.data.forEach((cat) => {
        counts[cat.name] = cat.count;
      });
      setCategoryCounts(counts);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des catégories alimentaires:",
        error
      );
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchProducts();
  };

  const handleSectionSearch = (e) => {
    e.preventDefault();
    // La recherche est faite en temps réel via le filtrage dans le render
  };

  // CORRIGÉ: Fonction pour naviguer vers la catégorie
  const handleCategoryClick = (category) => {
    const categoryData = {
      name: category.name,
      description: category.description,
      image: category.image,
      foodCategory: category.foodCategory,
      iconName: category.iconName,
    };

    // Utiliser foodCategory pour la navigation
    navigate(
      `/alimentation/food-category/${encodeURIComponent(
        category.foodCategory
      )}`,
      {
        state: categoryData,
      }
    );
  };

  const handleContactClick = (type) => {
    setContactModalType(type);
    setIsContactModalOpen(true);
  };

  // Fonction pour obtenir le nombre de produits pour une catégorie
  const getProductCount = (categoryName) => {
    return categoryCounts[categoryName] || 0;
  };

  // Données pour les 4 nouvelles sections basées sur les nouvelles sections demandées
  const sections = [
    {
      id: "restaurants-snacks",
      title: "Restaurants & Snacks",
      icon: Utensils,
      description: "Découvrez les meilleurs restaurants et snacks de l'île",
      color: "#556B2F",
      subcategories: [
        {
          name: "Restaurants Traditionnels",
          foodCategory: "restaurants-traditionnels",
          iconName: "ChefHat",
          description: "Cuisine locale et spécialités créoles",
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Snacks Rapides",
          foodCategory: "snacks-rapides",
          iconName: "Coffee",
          description: "Pause déjeuner et casse-croûte",
          image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Food Trucks",
          foodCategory: "food-trucks",
          iconName: "Truck",
          description: "Cuisine de rue et spécialités locales",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Brasseries & Cafés",
          foodCategory: "brasseries-cafes",
          iconName: "GlassWater",
          description: "Terrasses et moments de détente",
          image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
      ]
    },
    {
      id: "produits-locaux",
      title: "Produits Locaux",
      icon: ShoppingBag,
      description: "Produits frais et authentiques de La Réunion",
      color: "#8B4513",
      subcategories: [
        {
          name: "Fruits Tropicaux",
          foodCategory: "fruits-tropicaux",
          iconName: "Apple",
          description: "Letchis, mangues, ananas et fruits de la passion",
          image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Épices & Saveurs",
          foodCategory: "epices-saveurs",
          iconName: "Sparkles",
          description: "Curcuma, vanille, safran et combavas",
          image: "https://images.unsplash.com/photo-1596040033221-a1f4f8a7c526?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Miels & Confitures",
          foodCategory: "miels-confitures",
          iconName: "Heart",
          description: "Produits de la ruche et confitures artisanales",
          image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Rhum Arrangé",
          foodCategory: "rhum-arrange",
          iconName: "Wine",
          description: "Rhum traditionnel et préparations maison",
          image: "https://images.unsplash.com/photo-1516456712011-4b6b2c6c40d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
      ]
    },
    {
      id: "marches-artisans",
      title: "Marchés & Artisans",
      icon: Store,
      description: "Marchés locaux et produits d'artisans réunionnais",
      color: "#D2691E",
      subcategories: [
        {
          name: "Marchés Forains",
          foodCategory: "marches-forains",
          iconName: "ShoppingCart",
          description: "Marchés hebdomadaires et produits frais",
          image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Artisans Alimentaires",
          foodCategory: "artisans-alimentaires",
          iconName: "ChefHat",
          description: "Produits transformés par nos artisans",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Boutiques de Producteurs",
          foodCategory: "boutiques-producteurs",
          iconName: "Store",
          description: "Vente directe à la ferme",
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Épiceries Créoles",
          foodCategory: "epiceries-creoles",
          iconName: "ShoppingBag",
          description: "Produits traditionnels et ingrédients locaux",
          image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
      ]
    },
    {
      id: "bien-etre-alimentation",
      title: "Bien-être & Alimentation",
      icon: Heart,
      description: "Alimentation saine et produits bien-être",
      color: "#2E8B57",
      subcategories: [
        {
          name: "Produits Bio & Naturels",
          foodCategory: "produits-bio",
          iconName: "Leaf",
          description: "Agriculture biologique et naturelle",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Super-aliments Tropicaux",
          foodCategory: "super-aliments",
          iconName: "Zap",
          description: "Baies, graines et plantes locales",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Infusions & Tisanes",
          foodCategory: "infusions-tisanes",
          iconName: "Coffee",
          description: "Plantes médicinales de l'île",
          image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Compléments Alimentaires",
          foodCategory: "complements-alimentaires",
          iconName: "Shield",
          description: "Produits naturels pour votre santé",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        },
      ]
    },
  ];

  // Fonction pour obtenir les catégories par section
  const getCategoriesForSection = (section) => {
    return section.subcategories || [];
  };

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
      Store,
      ShoppingBag,
      ShoppingCart,
      Wine,
      Utensils,
      Shield,
      GlassWater,
    };
    return icons[iconName] || Apple;
  };

  // Filtrer les sections basées sur les produits disponibles
  const filteredSections = sections
    .map((section) => {
      const categories = getCategoriesForSection(section);
      const filteredCategories = categories.filter(
        (category) => getProductCount(category.name) > 0
      );

      return {
        ...section,
        categories: filteredCategories,
      };
    })
    .filter((section) => section.categories.length > 0);

  return (
    <div className="min-h-screen relative pt-16 overflow-hidden bg-[#FFFFFF]">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#6B8E23]/20 to-[#FFFFFF]/30 z-1" />

      <div className="relative z-10">
        <section className="container mx-auto px-4 py-8">
          {/* En-tête avec animation */}
          <div className="bg-white/90 py-5 rounded-lg backdrop-blur-sm">
            <div className="text-center mb-5 animate-fade-in">
              <h1 className="tracking-widest h-full text-xl lg:text-5xl md:text-4xl font-bold mb-4 text-logo">
                Manger & Consommer
              </h1>
              <p className="text-sm px-2 lg:text-sm text-[#8B4513] max-w-2xl mx-auto leading-relaxed">
                Découvrez les saveurs authentiques de La Réunion : restaurants locaux, produits frais, marchés artisanaux et bien-être
              </p>
            </div>

            {/* Badges d'avantages */}
            <div
              className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Badge className="bg-[#556B2F] text-white hover:bg-[#6B8E23] border-0 px-4 py-2">
                <Leaf className="h-3 w-3 mr-1" />
                Produits Locaux
              </Badge>
              <Badge className="bg-[#8B4513] text-white hover:bg-[#A0522D] border-0 px-4 py-2">
                <Truck className="h-3 w-3 mr-1" />
                Fraîcheur Garantie
              </Badge>
              <Badge className="bg-[#D2691E] text-white hover:bg-[#CD853F] border-0 px-4 py-2">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Artisans Réunionnais
              </Badge>
              <Badge className="bg-[#2E8B57] text-white hover:bg-[#3CB371] border-0 px-4 py-2">
                <Star className="h-3 w-3 mr-1" />
                Bien-être Naturel
              </Badge>
            </div>
          </div>

          {/* Affichage des résultats de recherche */}
          {searchQuery && products.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">
                Résultats pour "{searchQuery}"
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products
                  .filter((product) => product.id !== 0)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      user={user}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Sections dynamiques */}
          {isCategoriesLoading ? (
            <>
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
            </>
          ) : (
            filteredSections.map((section, sectionIndex) => {
              const IconComponent = section.icon;
              const animationDelays = {
                container: `${0.2 + sectionIndex * 0.2}s`,
                cards: `${0.3 + sectionIndex * 0.2}s`,
              };

              return (
                <div
                  key={section.id}
                  className="bg-white/80 p-5 pb-14 my-5 rounded-lg backdrop-blur-sm"
                  id={section.id}
                >
                  <div
                    className="flex items-center justify-between gap-4 mb-8 animate-slide-from-left"
                    style={{ animationDelay: animationDelays.container }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="p-3 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110"
                        style={{ backgroundColor: section.color }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-black/70">
                          {section.title}
                        </h2>
                        <p className="text-xs text-[#8B4513] mt-2">
                          {section.description}
                        </p>
                        
                        {/* Sous-liens de navigation */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          {section.subcategories && section.subcategories.map((subcat) => (
                            <a
                              key={subcat.foodCategory}
                              href={`#${subcat.foodCategory}`}
                              className="text-xs text-[#556B2F] hover:text-[#6B8E23] transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `/alimentation/food-category/${encodeURIComponent(subcat.foodCategory)}`,
                                  {
                                    state: {
                                      name: subcat.name,
                                      description: subcat.description,
                                      image: subcat.image,
                                      foodCategory: subcat.foodCategory,
                                      iconName: subcat.iconName,
                                    },
                                  }
                                );
                              }}
                            >
                              {subcat.name} →
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Barre de recherche à droite */}
                    <div className="hidden md:flex items-center ml-auto">
                      <form onSubmit={handleSectionSearch} className="relative">
                        <div className="relative flex items-center">
                          <Input
                            type="text"
                            placeholder={`Chercher dans ${section.title}...`}
                            value={sectionSearchQueries[section.id] || ""}
                            onChange={(e) => {
                              setSectionSearchQueries({
                                ...sectionSearchQueries,
                                [section.id]: e.target.value,
                              });
                            }}
                            className="pl-10 pr-2 py-2 h-16 rounded-xl border-2 border-[#D3D3D3] focus:border-[#556B2F] focus:outline-none transition-all duration-300 w-32 lg:w-96 placeholder-[#8B4513]"
                          />
                          <button
                            type="submit"
                            className="absolute left-3 text-[#556B2F] hover:text-[#6B8E23] transition-colors"
                          >
                            <Search className="h-5 w-5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.categories
                      .filter((category) => {
                        const searchQuery =
                          sectionSearchQueries[section.id] || "";
                        return (
                          category.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          category.description
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        );
                      })
                      .map((category, index) => {
                        const CategoryIcon = getIconByName(category.iconName);
                        const productCount = getProductCount(category.name);

                        return (
                          <Card
                            key={category.name}
                            className="group p-4 flex flex-col border-0 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-slide-from-left-card"
                            style={{
                              animationDelay: `${
                                parseFloat(animationDelays.cards) + index * 0.1
                              }s`,
                            }}
                          >
                            <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="flex justify-end absolute rounded-full text-white bottom-2 right-2">
                                <Badge 
                                  className="text-white"
                                  style={{ backgroundColor: section.color }}
                                >
                                  {productCount} produit
                                  {productCount !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-[#556B2F] group-hover:text-[#6B8E23] transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-[#8B4513] text-sm mb-2 leading-relaxed">
                              {category.description}
                            </p>
                            <Button
                              className="w-full text-white border-0 transition-all duration-300"
                              style={{ 
                                backgroundColor: section.color,
                                hover: { backgroundColor: `${section.color}CC` }
                              }}
                              onClick={() => handleCategoryClick(category)}
                            >
                              Explorer
                              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                          </Card>
                        );
                      })}

                    {section.categories.filter((category) => {
                      const searchQuery = sectionSearchQueries[section.id] || "";
                      return (
                        category.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        category.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      );
                    }).length === 0 &&
                      sectionSearchQueries[section.id] && (
                        <div className="col-span-full text-center py-8">
                          <p className="text-gray-500 text-lg">
                            Aucune catégorie ne correspond à "
                            {sectionSearchQueries[section.id]}"
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              );
            })
          )}

          {/* Section médecine par les plantes
          <div className="text-center mt-12">
            <Card className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Découvrez la médecine par les plantes
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Explorez notre section dédiée à la phytothérapie et apprenez à
                utiliser les plantes pour prendre soin de votre santé
                naturellement.
              </p>
              <Button
                onClick={() => navigate("/medecine-plantes")}
                className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
              >
                <Leaf className="h-5 w-5 mr-2" />
                Explorer la médecine des plantes
              </Button>
            </Card>
          </div> */}
        </section>
      </div>

      {/* Modal de contact seulement */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type={contactModalType}
      />

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-from-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-from-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-from-left-card {
          from {
            opacity: 0;
            transform: translateX(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slide-from-right-card {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes scale-up-card {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse-cta {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-slide-from-left {
          animation: slide-from-left 0.8s ease-out forwards;
        }
        .animate-slide-from-right {
          animation: slide-from-right 0.8s ease-out forwards;
        }
        .animate-slide-from-left-card {
          animation: slide-from-left-card 0.6s ease-out forwards;
        }
        .animate-slide-from-right-card {
          animation: slide-from-right-card 0.6s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.7s ease-out forwards;
        }
        .animate-scale-up-card {
          animation: scale-up-card 0.6s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 1s ease-out forwards;
        }
        .animate-pulse-cta {
          animation: pulse-cta 3s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Alimentation;