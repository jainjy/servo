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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
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
            <div className="w-16 h-16 bg-[#00C2A8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === "contact" ? (
                <Phone className="h-8 w-8 text-[#00C2A8]" />
              ) : (
                <Calendar className="h-8 w-8 text-[#00C2A8]" />
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
              <Phone className="h-5 w-5 text-[#00C2A8]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  +33 1 23 45 67 89
                </p>
                <p className="text-sm text-[#5A6470]">Lun-Sam 8h-20h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <MapPin className="h-5 w-5 text-[#00C2A8]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  Marché Bio Paris 15
                </p>
                <p className="text-sm text-[#5A6470]">75015 Paris</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Clock className="h-5 w-5 text-[#00C2A8]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">Livraison</p>
                <p className="text-sm text-[#5A6470]">Sous 24h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-[#00C2A8] hover:bg-[#00A890] text-white"
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

      const response = await api.get("/products", { params });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/products/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchProducts();
  };

  const handleCategoryClick = (category, section) => {
    const categoryData = {
      name: category.name,
      description: category.description,
      image: category.image,
      section: section,
    };

    navigate(`/alimentation/categorie/${encodeURIComponent(category.name)}`, {
      state: categoryData,
    });
  };

  const handleContactClick = (type) => {
    setContactModalType(type);
    setIsContactModalOpen(true);
  };

  // Données statiques pour les catégories alimentaires
  const fruitsCategories = [
    {
      name: "Fruits Frais",
      iconName: "Apple",
      description: "Fruits de saison bio et locaux",
      image:
        "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 45,
    },
    {
      name: "Fruits Exotiques",
      iconName: "Sparkles",
      description: "Mangues, ananas, fruits de la passion",
      image:
        "https://images.unsplash.com/photo-1550253006-0754c2af5a4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 28,
    },
    {
      name: "Fruits Rouges",
      iconName: "Heart",
      description: "Fraises, framboises, myrtilles",
      image:
        "https://images.unsplash.com/photo-1577069861033-55d04ce4b9c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 32,
    },
    {
      name: "Agrumes",
      iconName: "Zap",
      description: "Oranges, citrons, pamplemousses",
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 25,
    },
  ];

  const legumesCategories = [
    {
      name: "Légumes Frais",
      iconName: "Carrot",
      description: "Légumes de saison bio et locaux",
      image:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 52,
    },
    {
      name: "Légumes Racines",
      iconName: "Carrot",
      description: "Carottes, pommes de terre, betteraves",
      image:
        "https://images.unsplash.com/photo-1598171707953-eb0be8d8b8e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 38,
    },
    {
      name: "Salades & Herbes",
      iconName: "Leaf",
      description: "Laitues, basilic, persil, coriandre",
      image:
        "https://images.unsplash.com/photo-1595535873420-a5991951dbeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 41,
    },
    {
      name: "Légumes Anciens",
      iconName: "Sparkles",
      description: "Variétés rares et oubliées",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 19,
    },
  ];

  const autresCategories = [
    {
      name: "Produits Laitiers",
      iconName: "Milk",
      description: "Lait, fromages, yaourts bio",
      image:
        "https://images.unsplash.com/photo-1566772940196-0e2e789813d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 67,
    },
    {
      name: "Boucherie",
      iconName: "ChefHat",
      description: "Viandes fraîches et volailles",
      image:
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 48,
    },
    {
      name: "Poissonnerie",
      iconName: "Fish",
      description: "Poissons et fruits de mer frais",
      image:
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 35,
    },
    {
      name: "Épicerie Bio",
      iconName: "Wheat",
      description: "Pâtes, riz, céréales bio",
      image:
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 89,
    },
    {
      name: "Boulangerie",
      iconName: "Wheat",
      description: "Pains artisanaux et viennoiseries",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 42,
    },
    {
      name: "Boissons",
      iconName: "Coffee",
      description: "Jus, vins, boissons healthy",
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      count: 76,
    },
  ];

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

  // Filtrer les catégories basées sur la recherche
  const filteredFruits = fruitsCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLegumes = legumesCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAutres = autresCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative pt-16 overflow-hidden bg-[#F6F8FA]">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-[#00C2A8]/20 to-[#F6F8FA]/30 z-1" />

      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-10 animate-float z-2">
        <Apple className="h-8 w-8 text-[#00C2A8]/40" />
      </div>
      <div
        className="absolute top-40 right-20 animate-float z-2"
        style={{ animationDelay: "1s" }}
      >
        <Leaf className="h-6 w-6 text-[#00C2A8]/40" />
      </div>
      <div
        className="absolute bottom-40 left-20 animate-float z-2"
        style={{ animationDelay: "2s" }}
      >
        <Carrot className="h-5 w-5 text-[#00C2A8]/40" />
      </div>

      <div className="relative z-10">
        <section className="container mx-auto px-4 py-8">
          {/* En-tête avec animation */}
          <div className="bg-white/90 py-5 rounded-lg backdrop-blur-sm">
            <div className="text-center mb-5 animate-fade-in">
              <h1 className="azonix text-xl lg:text-5xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#0A0A0A] to-[#00C2A8] bg-clip-text text-transparent">
                Alimentation & Épicerie
              </h1>
              <p className="text-sm px-2 lg:text-xl text-[#5A6470] max-w-2xl mx-auto leading-relaxed">
                Découvrez nos produits frais, bio et locaux pour une
                alimentation saine et savoureuse
              </p>
            </div>

            {/* Barre de recherche améliorée */}
            <form
              onSubmit={handleSearch}
              className="relative mb-5 w-full max-w-2xl mx-auto animate-slide-up px-4 sm:px-6 lg:px-2"
            >
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="RECHERCHER UN PRODUIT, UNE CATÉGORIE..."
                  className="w-full h-12 sm:h-14 lg:h-16 pl-10 sm:pl-12 lg:pl-16 pr-16 sm:pr-32 lg:pr-8 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm lg:text-lg text-start font-semibold uppercase tracking-wide transition-all duration-300 group-hover:shadow-lg border-[#00C2A8]/30 bg-white/80 backdrop-blur-md focus:border-[#00C2A8] focus:ring-2 focus:ring-[#00C2A8]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Search className="absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#00C2A8] transition-transform duration-300 group-hover:scale-110 group-focus-within:scale-110" />

                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 sm:h-11 lg:h-12 px-3 sm:px-4 lg:px-6 bg-[#00C2A8] hover:bg-[#00A890] text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Rechercher</span>
                      <Search className="sm:hidden h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Badges d'avantages */}
            <div
              className="flex flex-wrap justify-center gap-4 mb-6 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-0 px-4 py-2">
                <Leaf className="h-3 w-3 mr-1" />
                Produits Bio
              </Badge>
              <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-0 px-4 py-2">
                <Truck className="h-3 w-3 mr-1" />
                Livraison 24h
              </Badge>
              <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-0 px-4 py-2">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Qualité Garantie
              </Badge>
              <Badge className="bg-[#00C2A8]/10 text-[#00C2A8] border-0 px-4 py-2">
                <Star className="h-3 w-3 mr-1" />
                Producteurs Locaux
              </Badge>
            </div>
          </div>

          {/* Section Fruits */}
          <div
            className="bg-white/80 p-5 pb-14 my-5 rounded-lg backdrop-blur-sm"
            id="fruits"
          >
            <div
              className="flex items-center gap-4 mb-8 animate-slide-from-left"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-3 rounded-2xl bg-[#00C2A8] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <Apple className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Fruits Frais
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Sélection des meilleurs fruits de saison, bio et locaux
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFruits.map((category, index) => {
                const IconComponent = getIconByName(category.iconName);

                return (
                  <Card
                    key={category.name}
                    className="group p-4 flex flex-col border-0 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-slide-from-left-card"
                    style={{
                      animationDelay: `${0.3 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex justify-end absolute bg-[#00C2A8] rounded-full text-white bottom-2 right-2">
                        <Badge className="bg-[#00C2A8] text-white">
                          {category.count} produit
                          {category.count !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#00C2A8] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#5A6470] text-sm mb-2 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      className="w-full bg-[#00C2A8]/10 hover:bg-[#00C2A8] hover:text-white text-[#00C2A8] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                      onClick={() => handleCategoryClick(category, "fruits")}
                    >
                      <>
                        Explorer
                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section Légumes */}
          <div
            className="bg-white/80 p-5 pb-14 my-5 rounded-lg backdrop-blur-sm"
            id="legumes"
          >
            <div
              className="flex items-center gap-4 mb-8 animate-slide-from-right"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="p-3 rounded-2xl bg-[#00C2A8] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <Carrot className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Légumes & Herbes
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Légumes frais, herbes aromatiques et produits du potager
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLegumes.map((category, index) => {
                const IconComponent = getIconByName(category.iconName);

                return (
                  <Card
                    key={category.name}
                    className="group p-6 border-0 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-slide-from-right-card"
                    style={{
                      animationDelay: `${0.5 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex justify-end absolute bg-[#00C2A8] rounded-full text-white bottom-2 right-2">
                        <Badge className="bg-[#00C2A8] text-white">
                          {category.count} produit
                          {category.count !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#00C2A8] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#5A6470] text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      className="w-full bg-[#00C2A8]/10 hover:bg-[#00C2A8] hover:text-white text-[#00C2A8] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                      onClick={() => handleCategoryClick(category, "légumes")}
                    >
                      <>
                        Explorer
                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section Autres Produits */}
          <div
            className="bg-white/80 p-5 pb-14 my-5 rounded-lg backdrop-blur-sm"
            id="autres"
          >
            <div
              className="flex items-center gap-4 mb-8 animate-scale-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="p-3 rounded-2xl bg-[#00C2A8] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Épicerie & Autres
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Produits laitiers, boucherie, poissonnerie et épicerie fine
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAutres.map((category, index) => {
                const IconComponent = getIconByName(category.iconName);

                return (
                  <Card
                    key={category.name}
                    className="group p-6 border-0 bg-white/90 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-scale-up-card"
                    style={{
                      animationDelay: `${0.7 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="flex justify-end absolute bg-[#00C2A8] rounded-full text-white bottom-2 right-2">
                        <Badge className="bg-[#00C2A8] text-white">
                          {category.count} produit
                          {category.count !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#00C2A8] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#5A6470] text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      className="w-full bg-[#00C2A8]/10 hover:bg-[#00C2A8] hover:text-white text-[#00C2A8] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                      onClick={() => handleCategoryClick(category, "autres")}
                    >
                      <>
                        Explorer
                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section CTA */}
          <div
            className="text-center animate-bounce-in"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 lg:p-12 border border-white/20 shadow-2xl">
              <h3 className="text-xl lg:text-3xl font-bold text-gray-700 mb-4">
                Livraison de produits frais à domicile
              </h3>
              <p className="text-sm lg:text-xl text-[#5A6470] mb-8 max-w-2xl mx-auto">
                Commandez vos produits alimentaires frais et recevez-les sous
                24h. Qualité garantie, producteurs locaux et service
                personnalisé.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  className="bg-[#00C2A8] hover:bg-[#00A890] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  onClick={() => handleContactClick("contact")}
                >
                  Commander maintenant
                </Button>
                <Button
                  className="bg-white hover:bg-gray-50 text-[#00C2A8] border-2 border-[#00C2A8] px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => handleContactClick("rdv")}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Conseil Nutrition
                </Button>
              </div>
            </div>
          </div>
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
