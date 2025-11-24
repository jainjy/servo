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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";

// Composant Contact Modal
const ContactModal = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#0A0A0A]">
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
            <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === "contact" ? (
                <Phone className="h-8 w-8 text-slate-900" />
              ) : (
                <Calendar className="h-8 w-8 text-slate-900" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
              {type === "contact" ? "Service Client" : "Consultation Nutrition"}
            </h3>
            <p className="text-[#5A6470]">
              {type === "contact"
                ? "Notre équipe est disponible pour répondre à toutes vos questions."
                : "Planifiez une consultation avec nos nutritionnistes."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Phone className="h-5 w-5 text-slate-900" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  +33 1 23 45 67 89
                </p>
                <p className="text-sm text-[#5A6470]">Lun-Sam 8h-20h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <MapPin className="h-5 w-5 text-slate-900" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  Marché Bio Paris 15
                </p>
                <p className="text-sm text-[#5A6470]">75015 Paris</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Clock className="h-5 w-5 text-slate-900" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">Livraison</p>
                <p className="text-sm text-[#5A6470]">Sous 24h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-slate-900 hover:bg-slate-700 text-white"
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
    console.log("🟢 Catégorie cliquée:", category);

    const categoryData = {
      name: category.name,
      description: category.description,
      image: category.image,
      foodCategory: category.foodCategory,
      iconName: category.iconName
    };

    // DEBUG: Vérifier les données avant navigation
    console.log("📋 Données de navigation:", categoryData);
    console.log("🔗 URL de navigation:", `/alimentation/food-category/${encodeURIComponent(category.foodCategory)}`);

    // Utiliser foodCategory pour la navigation
    navigate(`/alimentation/food-category/${encodeURIComponent(category.foodCategory)}`, {
      state: categoryData,
    });
  };

  const handleContactClick = (type) => {
    setContactModalType(type);
    setIsContactModalOpen(true);
  };

  // Fonction pour obtenir le nombre de produits pour une catégorie
  const getProductCount = (categoryName) => {
    return categoryCounts[categoryName] || 0;
  };

  // Données pour les 4 nouvelles sections basées sur foodCategory
  const sections = [
    {
      id: "cours-epicerie",
      title: "Cours & Epicerie",
      icon: ShoppingCart,
      description: "Produits frais et essentiels du quotidien",
    },
    {
      id: "boulangerie-charcuterie",
      title: "Boulangerie & Charcuterie",
      icon: ChefHat,
      description: "Pains, charcuteries et fromages artisanaux",
    },
    {
      id: "cave-vins",
      title: "Cave & Vins",
      icon: Wine,
      description: "Vins, spiritueux et champagnes sélectionnés",
    },
    {
      id: "restaurant",
      title: "Restaurant",
      icon: Utensils,
      description: "Plats préparés et spécialités maison",
    }
  ];

  // Fonction pour obtenir les catégories par section
  const getCategoriesForSection = (section) => {
    const categoryMapping = {
      "cours-epicerie": [
        {
          name: "Fruits Frais",
          foodCategory: "fruits",
          iconName: "Apple",
          description: "Fruits de saison bio et locaux",
          image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Légumes Frais",
          foodCategory: "legumes",
          iconName: "Carrot",
          description: "Légumes de saison bio et locaux",
          image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Épicerie Bio",
          foodCategory: "epicerie",
          iconName: "Wheat",
          description: "Pâtes, riz, céréales bio",
          image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Produits Laitiers",
          foodCategory: "produits-laitiers",
          iconName: "Milk",
          description: "Lait, fromages, yaourts bio",
          image: "https://images.unsplash.com/photo-1566772940196-0e2e789813d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      ],
      "boulangerie-charcuterie": [
        {
          name: "Boulangerie",
          foodCategory: "boulangerie",
          iconName: "Wheat",
          description: "Pains artisanaux et viennoiseries",
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Pâtisserie",
          foodCategory: "patisseries",
          iconName: "Sparkles",
          description: "Gâteaux et desserts artisanaux",
          image: "https://images.unsplash.com/photo-1555507036-ab794f27d2e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Charcuterie",
          foodCategory: "charcuterie",
          iconName: "ChefHat",
          description: "Saucissons, jambons, pâtés",
          image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Fromagerie",
          foodCategory: "fromages",
          iconName: "Milk",
          description: "Fromages affinés et frais",
          image: "https://images.unsplash.com/photo-1486297678162-eb2a1b331e84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      ],
      "cave-vins": [
        {
          name: "Vins Rouges",
          foodCategory: "vins-rouges",
          iconName: "Heart",
          description: "Cépages français et internationaux",
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Vins Blancs",
          foodCategory: "vins-blancs",
          iconName: "Sparkles",
          description: "Vins frais et fruités",
          image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Champagnes",
          foodCategory: "champagnes",
          iconName: "Zap",
          description: "Champagnes et vins effervescents",
          image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Spiritueux",
          foodCategory: "spiritueux",
          iconName: "Flame",
          description: "Whisky, vodka, gin et rhum",
          image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      ],
      "restaurant": [
        {
          name: "Plats Préparés",
          foodCategory: "plats-prepares",
          iconName: "ChefHat",
          description: "Plats frais préparés par nos chefs",
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Sandwichs & Salades",
          foodCategory: "sandwichs",
          iconName: "Leaf",
          description: "Préparations fraîches du jour",
          image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Pâtisseries Maison",
          foodCategory: "patisseries",
          iconName: "Heart",
          description: "Desserts et pâtisseries fraîches",
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        },
        {
          name: "Boissons Chaudes",
          foodCategory: "boissons-chaudes",
          iconName: "Coffee",
          description: "Cafés, thés et chocolats chauds",
          image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        }
      ]
    };

    return categoryMapping[section.id] || [];
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
    };
    return icons[iconName] || Apple;
  };

  // Filtrer les sections basées sur les produits disponibles
  const filteredSections = sections.map(section => {
    const categories = getCategoriesForSection(section);
    const filteredCategories = categories.filter(
      category => getProductCount(category.name) > 0
    );

    return {
      ...section,
      categories: filteredCategories
    };
  }).filter(section => section.categories.length > 0);

  return (
    <div className="min-h-screen relative pt-16 overflow-hidden bg-[#F6F8FA]">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
            backgroundAttachment: "fixed"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#00C2A8]/20 to-[#F6F8FA]/30 z-1" />



      <div className="relative z-10">
        <section className="container mx-auto px-4 py-8">
          {/* En-tête avec animation */}
          <div className="bg-white/90 py-5 rounded-lg backdrop-blur-sm">
            <div className="text-center mb-5 animate-fade-in">
              <h1 className="tracking-widest  text-xl lg:text-5xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#0A0A0A] to-slate-900 bg-clip-text text-transparent">
                Alimentation & Épicerie
              </h1>
              <p className="text-sm px-2 lg:text-sm text-[#5A6470] max-w-2xl mx-auto leading-relaxed">
                Découvrez nos produits frais, bio et locaux pour une
                alimentation saine et savoureuse
              </p>
            </div>


            {/* Badges d'avantages */}
            <div
              className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-0 px-4 py-2">
                <Leaf className="h-3 w-3 mr-1" />
                Produits Bio
              </Badge>
              <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-0 px-4 py-2">
                <Truck className="h-3 w-3 mr-1" />
                Livraison 24h
              </Badge>
              <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-0 px-4 py-2">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Qualité Garantie
              </Badge>
              <Badge className="bg-slate-900 text-white hover:bg-slate-800 border-0 px-4 py-2">
                <Star className="h-3 w-3 mr-1" />
                Producteurs Locaux
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
          {filteredSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            const animationDelays = {
              container: `${0.2 + sectionIndex * 0.2}s`,
              cards: `${0.3 + sectionIndex * 0.2}s`
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
                    <div className="p-3 rounded-2xl bg-slate-900 shadow-lg transform transition-transform duration-300 hover:scale-110">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-black/70">
                        {section.title}
                      </h2>
                      <p className="text-xs text-[#5A6470] mt-2">
                        {section.description}
                      </p>
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
                              [section.id]: e.target.value
                            });
                          }}
                          className="pl-10 pr-2 py-2 h-16 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-none transition-all duration-300 w-32 lg:w-96 placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          className="absolute left-3 text-slate-900 hover:text-slate-600 transition-colors"
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
                      const searchQuery = sectionSearchQueries[section.id] || "";
                      return (
                        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                            animationDelay: `${parseFloat(animationDelays.cards) + index * 0.1}s`,
                          }}
                        >
                          <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="flex justify-end absolute rounded-full text-white bottom-2 right-2">
                              <Badge className="bg-black text-white">
                                {productCount} produit{productCount !== 1 ? "s" : ""}
                              </Badge>
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-blue-600 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-[#5A6470] text-sm mb-2 leading-relaxed">
                            {category.description}
                          </p>
                          <Button
                            className="w-full bg-slate-900 hover:bg-slate-700 hover:text-white text-white border-0 transition-all duration-300"
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
                      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      category.description.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                  }).length === 0 && sectionSearchQueries[section.id] && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-gray-500 text-lg">
                          Aucune catégorie ne correspond à "{sectionSearchQueries[section.id]}"
                        </p>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
          <div className="text-center mt-12">
            <Card className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Découvrez la médecine par les plantes
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Explorez notre section dédiée à la phytothérapie et apprenez à utiliser les plantes
                pour prendre soin de votre santé naturellement.
              </p>
              <Button
                onClick={() => navigate('/medecine-plantes')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Leaf className="h-5 w-5 mr-2" />
                Explorer la médecine des plantes
              </Button>
            </Card>
          </div>
          {/* Section CTA 
          <div
            className="text-center animate-bounce-in "
            style={{ animationDelay: "0.8s" }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 lg:p-12 border border-white/20 shadow-2xl">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-700 mb-4">
                Livraison de produits frais à domicile
              </h3>
              <p className="text-sm lg:text-md text-[#5A6470] mb-8 max-w-2xl mx-auto">
                Commandez vos produits alimentaires frais et recevez-les sous
                24h. Qualité garantie, producteurs locaux et service
                personnalisé.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  className="bg-slate-900 hover:bg-slate-700 text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  onClick={() => handleContactClick("contact")}
                >
                  Commander maintenant
                </Button>
                <Button
                  className="bg-white hover:bg-gray-50 text-slate-900 border-2 border-slate-900 px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => handleContactClick("rdv")}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Conseil Nutrition
                </Button>
              </div>
            </div>
          </div>*/}
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