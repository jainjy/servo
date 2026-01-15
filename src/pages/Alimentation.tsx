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
  ChevronRight,
  ArrowUp,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import AdvertisementPopup from "@/components/AdvertisementPopup";

// Composant Skeleton Loading
const SectionSkeleton = () => (
  <div className="bg-white/80 p-5 pb-14 my-10 rounded-lg backdrop-blur-sm">
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
        <div key={i} className="p-4 flex flex-col border-0 bg-white/90 backdrop-blur-md shadow-xl">
          <div className="w-full h-32 rounded-md mb-4 bg-gray-300 animate-pulse" />
          <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse" />
          <div className="h-4 bg-gray-300 rounded mb-4 w-3/4 animate-pulse" />
          <div className="h-10 bg-gray-300 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

// Composant Navigation Rapide
const QuickNavigation = ({ sections, activeSection, onSectionClick }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
      <Card className="p-3 bg-white/90 backdrop-blur-md shadow-xl border-0 rounded-2xl">
        <div className="flex flex-col items-center gap-2">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionClick(section.id)}
                className={`relative p-2 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-[#556B2F] text-white'
                    : 'hover:bg-[#556B2F]/10 text-[#556B2F]'
                  }`}
                title={section.title}
              >
                <IconComponent className="h-5 w-5" />
                {isActive && (
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-[#6B8E23] rounded-full border-2 border-white"></div>
                )}
              </button>
            );
          })}

          <div className="h-px w-8 bg-[#D3D3D3] my-1"></div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 rounded-xl hover:bg-[#556B2F]/10 text-[#556B2F] transition-colors duration-300"
            title="Retour en haut"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};

const Alimentation = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [sectionSearchQueries, setSectionSearchQueries] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const sectionRefs = useRef({});
  const [isInitialized, setIsInitialized] = useState(false);

  const navigate = useNavigate();

  // Données pour les 4 sections (statiques)
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

  // Charger les données UNE SEULE FOIS au montage
  useEffect(() => {
    //console.log("useEffect de chargement des données exécuté");
    let isMounted = true;

    const loadData = async () => {
      try {
        //console.log("Début du chargement des données...");

        // Charger les catégories
        const categoriesResponse = await api.get("/aliments/categories");
        //console.log("Catégories chargées:", categoriesResponse.data);

        // Charger les produits
        const productsResponse = await api.get("/aliments", {
          params: { status: "active" }
        });
        //console.log("Produits chargés:", productsResponse.data);

        if (isMounted) {
          // Mettre à jour les états
          setCategories(categoriesResponse.data || []);

          // Calculer les comptes par catégorie
          const counts = {};
          if (categoriesResponse.data) {
            categoriesResponse.data.forEach((cat) => {
              counts[cat.name] = cat.count || 0;
            });
          }
          setCategoryCounts(counts);

          setProducts(productsResponse.data?.products || productsResponse.data || []);
          setIsInitialized(true);
          setIsCategoriesLoading(false);
          //console.log("Données initialisées avec succès");
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        if (isMounted) {
          setIsInitialized(true);
          setIsCategoriesLoading(false);
          //console.log("Initialisation malgré l'erreur");
        }
      }
    };

    loadData();

    return () => {
      //console.log("Cleanup useEffect");
      isMounted = false;
    };
  }, []); // Dépendance vide = exécuté une seule fois

  // Configuration de l'intersection observer (uniquement après initialisation)
  useEffect(() => {
    if (!isInitialized) return;

    //console.log("Configuration de l'intersection observer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0.1,
      }
    );

    // Observer toutes les sections
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      //("Cleanup observer");
      observer.disconnect();
    };
  }, [isInitialized]);

  // Fonction pour filtrer les sections
  const getFilteredSections = useCallback(() => {
    return sections
      .map((section) => {
        const categories = section.subcategories || [];
        const filteredCategories = categories.filter(
          (category) => (categoryCounts[category.name] || 0) > 0
        );

        return {
          ...section,
          categories: filteredCategories,
        };
      })
      .filter((section) => section.categories.length > 0);
  }, [categoryCounts]);

  // Recherche en temps réel avec debounce
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else if (searchQuery.length === 0) {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isInitialized]);

  const performSearch = async (query) => {
    //console.log("Recherche pour:", query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const response = await api.get("/aliments", {
        params: {
          status: "active",
          search: query,
          limit: 50
        }
      });

      const data = response.data;
      const results = data.products || data || [];
      //console.log("Résultats de recherche:", results.length);
      setSearchResults(Array.isArray(results) ? results : []);

    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCategoryClick = (category) => {
    const categoryData = {
      name: category.name,
      description: category.description,
      image: category.image,
      foodCategory: category.foodCategory,
      iconName: category.iconName,
    };

    navigate(
      `/alimentation/food-category/${encodeURIComponent(
        category.foodCategory
      )}`,
      {
        state: categoryData,
      }
    );
  };

  const handleSectionNavigation = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const getIconByName = (iconName) => {
    const icons = {
      Apple, Carrot, Wheat, Coffee, Fish, Milk, Egg, ChefHat, Heart, Leaf,
      Sparkles, Zap, Flame, Truck, Store, ShoppingBag, ShoppingCart, Wine,
      Utensils, Shield, GlassWater,
    };
    return icons[iconName] || Apple;
  };

  const filteredSections = getFilteredSections();

  // Écran de chargement initial
  if (!isInitialized) {
    //console.log("Affichage de l'écran de chargement");
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#556B2F] mx-auto"></div>
          <p className="mt-4 text-[#556B2F]">Chargement en cours...</p>
        </div>
      </div>
    );
  }
//console.log("Rendu de la page principale, filteredSections:", filteredSections.length);

  return (
    <div className="min-h-screen relative pt-16 bg-[#FFFFFF]">
      {/* Background Image avec overlay */}
      {/* Advertisement Popup - Absolute Position */}
      <div className="absolute top-12 left-4 right-4 z-50">
        <AdvertisementPopup />
      </div>

      <div className="fixed w-1/2 bottom-0 right-4 z-50">
        <AdvertisementPopup />
      </div>
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#6B8E23]/20 to-[#FFFFFF]/30 z-1" />

      {/* Navigation Rapide */}
      {filteredSections.length > 0 && (
        <QuickNavigation
          sections={filteredSections}
          activeSection={activeSection}
          onSectionClick={handleSectionNavigation}
        />
      )}

      <div className="relative z-10">
        <section className="container mx-auto px-4 pt-10 pb-20">
          {/* En-tête */}
          <div className="bg-white/90 py-5 rounded-b-lg backdrop-blur-sm">
            <div className="text-center mb-5">
              <h1 className="tracking-widest h-full text-xl lg:text-5xl md:text-4xl font-bold mb-4 text-logo">
                Manger & Consommer
              </h1>
              <p className="text-sm px-2 lg:text-sm text-[#8B4513] max-w-2xl mx-auto leading-relaxed">
                Découvrez les saveurs authentiques de La Réunion : restaurants locaux, produits frais, marchés artisanaux et bien-être
              </p>
            </div>
            {/* Badges d'avantages */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
              <Badge className="bg-[#556B2F] text-white hover:bg-[#6B8E23] border-0 px-5 py-2.5 rounded-full shadow-md">
                <Leaf className="h-4 w-4 mr-2" />
                Produits Locaux
              </Badge>
              <Badge className="bg-[#8B4513] text-white hover:bg-[#A0522D] border-0 px-5 py-2.5 rounded-full shadow-md">
                <Truck className="h-4 w-4 mr-2" />
                Fraîcheur Garantie
              </Badge>
              <Badge className="bg-[#D2691E] text-white hover:bg-[#CD853F] border-0 px-5 py-2.5 rounded-full shadow-md">
                <ShieldCheck className="h-4 w-4 mr-2" />
                Artisans Réunionnais
              </Badge>
              <Badge className="bg-[#2E8B57] text-white hover:bg-[#3CB371] border-0 px-5 py-2.5 rounded-full shadow-md">
                <Star className="h-4 w-4 mr-2" />
                Bien-être Naturel
              </Badge>
            </div>
          </div>



          {/* Sections */}
          {isCategoriesLoading ? (
            <>
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
              <SectionSkeleton />
            </>
          ) : (
            filteredSections.map((section, sectionIndex) => {
              const IconComponent = section.icon;

              return (
                <div
                  key={section.id}
                  ref={(el) => {
                    if (el) sectionRefs.current[section.id] = el;
                  }}
                  className="bg-white/90 py-15 pb-14 px-4 mt-10 rounded-2xl backdrop-blur-sm shadow-sm border border-[#D3D3D3]/30"
                  id={section.id}
                >
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-2xl shadow-lg"
                        style={{ backgroundColor: section.color }}
                      >
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl lg:text-2xl font-bold text-black/70">
                            {section.title}
                          </h2>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{
                              color: section.color,
                              borderColor: section.color
                            }}
                          >
                            {section.categories.length} catégories
                          </Badge>
                        </div>
                        <p className="text-xs text-[#8B4513] mt-2">
                          {section.description}
                        </p>

                        {/* Sous-liens de navigation */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          {section.subcategories && section.subcategories.map((subcat) => (
                            <button
                              key={subcat.foodCategory}
                              onClick={() => navigate(
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
                              )}
                              className="text-xs text-[#556B2F] hover:text-[#6B8E23] transition-colors bg-[#556B2F]/5 hover:bg-[#556B2F]/10 px-3 py-1 rounded-full"
                            >
                              {subcat.name} →
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.categories
                      .map((category, index) => {
                        const CategoryIcon = getIconByName(category.iconName);
                        const productCount = categoryCounts[category.name] || 0;

                        return (
                          <Card
                            key={`${category.name}-${index}`}
                            className="group p-5 flex flex-col border border-[#D3D3D3]/50 bg-white/95 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer text-center rounded-xl"
                          >
                            <div className="relative flex mx-auto overflow-hidden bg-black/10 w-full h-40 rounded-lg mb-4">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                              <div className="flex justify-end absolute rounded-full text-white bottom-3 right-3">
                                <Badge
                                  className="text-white shadow-md"
                                  style={{ backgroundColor: section.color }}
                                >
                                  {productCount} produit
                                  {productCount !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-center mb-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${section.color}15` }}
                              >
                                <CategoryIcon
                                  className="h-5 w-5"
                                  style={{ color: section.color }}
                                />
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-[#556B2F] group-hover:text-[#6B8E23] transition-colors duration-300 px-2">
                              {category.name}
                            </h3>
                            <p className="text-[#8B4513] text-sm mb-4 leading-relaxed px-2">
                              {category.description}
                            </p>
                            <Button
                              className="w-full text-white border-0 transition-all duration-300 shadow-md hover:shadow-lg mt-auto"
                              style={{
                                backgroundColor: section.color,
                              }}
                              onClick={() => handleCategoryClick(category)}
                            >
                              Explorer
                              <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

export default Alimentation;