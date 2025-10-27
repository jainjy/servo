import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '/fonts/Azonix.otf'
import {
  Search,
  Home,
  Construction,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Flame,
  Sofa,
  Palette,
  Sprout,
  Wrench,
  Lock,
  Lamp,
  Warehouse,
  Thermometer,
  Square,
  TreePine,
  DoorClosed,
  Droplets,
  X,
  Phone,
  Calendar,
  MapPin,
  Users,
  Clock,
  Brush,
  Wand2,
  PaintBucket,
  Package,
  ShoppingCart,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

// Composant Modal pour afficher les produits d'une catégorie
const CategoryModal = ({ isOpen, onClose, category, products }) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0052FF]/10">
              <category.icon className="h-6 w-6 text-[#0052FF]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0A0A0A]">
                {category.name}
              </h2>
              <p className="text-[#5A6470]">{category.description}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            variant="ghost"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                  {product.images && product.images.length > 0 ? (
                    <div
                      className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-primary/40" />
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      €{product.price}
                    </span>
                    <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                      {product.quantity > 0 ? "En stock" : "Rupture"}
                    </Badge>
                  </div>

                  {product.vendor?.companyName && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.vendor.companyName}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Aucun produit disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}

          <div className="bg-[#F6F8FA] rounded-2xl p-6 mt-8">
            <h3 className="text-lg font-semibold text-[#0A0A0A] mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#00C2A8]" />
              Service personnalisé
            </h3>
            <p className="text-[#5A6470] mb-4">
              Nos experts sont disponibles pour vous conseiller sur cette catégorie de produits.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 bg-[#0052FF] hover:bg-[#003EE6] text-white">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
              <Button className="flex-1 bg-[#00C2A8] hover:bg-[#00A890] text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Rendez-vous
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            <div className="w-16 h-16 bg-[#0052FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {type === "contact" ? (
                <Phone className="h-8 w-8 text-[#0052FF]" />
              ) : (
                <Calendar className="h-8 w-8 text-[#00C2A8]" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-[#0A0A0A] mb-2">
              {type === "contact" ? "Service Client" : "Consultation Expert"}
            </h3>
            <p className="text-[#5A6470]">
              {type === "contact"
                ? "Notre équipe est disponible pour répondre à toutes vos questions."
                : "Planifiez une visite avec nos experts pour votre projet."}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Phone className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  +33 1 23 45 67 89
                </p>
                <p className="text-sm text-[#5A6470]">Lun-Ven 9h-18h</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <MapPin className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">
                  123 Avenue des Champs
                </p>
                <p className="text-sm text-[#5A6470]">75008 Paris</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F6F8FA]">
              <Clock className="h-5 w-5 text-[#0052FF]" />
              <div>
                <p className="font-semibold text-[#0A0A0A]">Ouverture</p>
                <p className="text-sm text-[#5A6470]">Lun-Sam 9h-19h</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1 bg-[#0052FF] hover:bg-[#003EE6] text-white"
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

// Composant Badge
const Badge = ({ children, variant = "default" }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = {
    default: "bg-primary/10 text-primary",
    destructive: "bg-destructive/10 text-destructive",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-[#0052FF]/10 text-[#0052FF]"
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

const Produits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalType, setContactModalType] = useState("contact");
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  // Charger les produits et catégories au montage du composant
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category = null) => {
    try {
      setIsLoading(true);
      const params = { status: 'active' };
      if (category) {
        params.category = category;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await api.get('/products', { params });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data);

      // Créer un objet avec les comptes par catégorie pour un accès facile
      const counts = {};
      response.data.forEach(cat => {
        counts[cat.name] = cat.count;
      });
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchProducts();
  };

  const handleCategoryClick = async (category, section) => {
    setSelectedCategory({ ...category, section });
    try {
      const response = await api.get('/products', {
        params: {
          category: category.name,
          status: 'active'
        }
      });
      setCategoryProducts(response.data.products);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erreur lors du chargement des produits de la catégorie:', error);
      setCategoryProducts([]);
      setIsModalOpen(true);
    }
  };

  const handleContactClick = (type) => {
    setContactModalType(type);
    setIsContactModalOpen(true);
  };

  // Fonction pour obtenir le nombre de produits pour une catégorie
  const getProductCount = (categoryName) => {
    return categoryCounts[categoryName] || 0;
  };

  // Catégories basées sur les données de l'API
  const equipmentCategories = [
    {
      name: "Équipements de chauffage",
      icon: Flame,
      description: "Chauffage et climatisation",
      image: "/equipement/chauffage.jfif"
    },
    {
      name: "Électroménager",
      icon: Zap,
      description: "Appareils ménagers modernes",
      image: "/equipement/electroménager.jfif"
    },
    {
      name: "Meubles",
      icon: Sofa,
      description: "Meubles design et fonctionnels",
      image: "/equipement/Meubles.jfif"
    },
    {
      name: "Décoration",
      icon: Palette,
      description: "Décorations intérieures",
      image: "/equipement/Decoration.jfif"
    },
    {
      name: "Jardinage",
      icon: Sprout,
      description: "Équipement de jardin",
      image: "/equipement/Équipement_de_jardin.jfif"
    },
    {
      name: "Outillage",
      icon: Wrench,
      description: "Outils professionnels",
      image: "/equipement/Outils_professionnels.jfif"
    },
    {
      name: "Sécurité maison",
      icon: Lock,
      description: "Systèmes de sécurité",
      image: "/equipement/Systèmes_de_sécurité.jfif"
    },
    {
      name: "Luminaires",
      icon: Lamp,
      description: "Éclairage intérieur et extérieur",
      image: "/equipement/Éclairage_intérieur_et_extérieur.jfif"
    },
  ];

  const materialsCategories = [
    {
      name: "Matériaux de construction",
      icon: Warehouse,
      description: "Matériaux de base",
      image: "/materiaux/Matériaux_de_construction.jfif"
    },
    {
      name: "Isolation",
      icon: Thermometer,
      description: "Isolation thermique et phonique",
      image: "/materiaux/Isolation thermique et phonique.jfif"
    },
    {
      name: "Revêtements de sol",
      icon: Square,
      description: "Parquet, carrelage, moquette",
      image: "/materiaux/Parquet, carrelage, moquette.jfif"
    },
    {
      name: "Carrelage",
      icon: Square,
      description: "Carreaux et faïence",
      image: "/materiaux/Carreaux et faïence.jfif"
    },
    {
      name: "Bois et panneaux",
      icon: TreePine,
      description: "Bois massif et dérivés",
      image: "/materiaux/Bois massif et dérivés.jfif"
    },
    {
      name: "Menuiserie",
      icon: DoorClosed,
      description: "Portes et fenêtres",
      image: "/materiaux/Portes et fenêtres.jfif"
    },
    {
      name: "Plomberie",
      icon: Droplets,
      description: "Tuyauterie et sanitaires",
      image: "/materiaux/Tuyauterie et sanitaires.jfif"
    },
    {
      name: "Électricité",
      icon: Zap,
      description: "Câbles et appareillages",
      image: "/materiaux/Électricité.jfif"
    },
  ];

  const designCategories = [
    {
      name: "Peinture & Revêtements",
      icon: PaintBucket,
      description: "Peintures et finitions murales",
      image: "/design/Peinture & Revêtements.jfif"
    },
    {
      name: "Mobilier Design",
      icon: Sofa,
      description: "Meubles contemporains et design",
      image: "/design/Meubles contemporains et design.jfif"
    },
    {
      name: "Décoration Murale",
      icon: Brush,
      description: "Éléments décoratifs muraux",
      image: "/design/Éléments décoratifs muraux.jfif"
    },
    {
      name: "Luminaires Design",
      icon: Lamp,
      description: "Éclairage design et contemporain",
      image: "/design/Éclairage design et contemporain.jfif"
    },
    {
      name: "Textiles Décoratifs",
      icon: Wand2,
      description: "Tissus et textiles d'ameublement",
      image: "/design/Tissus et textiles d'ameublement.jfif"
    },
    {
      name: "Accessoires Déco",
      icon: Sparkles,
      description: "Accessoires de décoration",
      image: "/design/Accessoires de décoration.jfif"
    },
    {
      name: "Art & Tableaux",
      icon: Palette,
      description: "Œuvres d'art et reproductions",
      image: "/design/Œuvres d'art et reproductions.jfif"
    },
    {
      name: "Rangements Design",
      icon: Warehouse,
      description: "Solutions de rangement esthétiques",
      image: "/design/Solutions de rangement esthétiques.jfif"
    },
  ];

  // Filtrer les catégories basées sur la recherche
  const filteredEquipment = equipmentCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMaterials = materialsCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDesign = designCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative pt-16 overflow-hidden bg-[#F6F8FA]">
      {/* Background Image avec overlay */}
      <div className="absolute inset-0">
        {/* Image de fond */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`,
          }}
        />

        {/* Overlay par-dessus */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>




      {/* Overlay supplémentaire pour mieux lire le texte */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F6F8FA]/50 to-[#F6F8FA]/30 z-1" />

      {/* Éléments décoratifs animés */}
      <div className="absolute top-20 left-10 animate-float z-2">
        <Sparkles className="h-8 w-8 text-[#0052FF]/30" />
      </div>
      <div
        className="absolute top-40 right-20 animate-float z-2"
        style={{ animationDelay: "1s" }}
      >
        <Shield className="h-6 w-6 text-[#00C2A8]/30" />
      </div>
      <div
        className="absolute bottom-40 left-20 animate-float z-2"
        style={{ animationDelay: "2s" }}
      >
        <Zap className="h-5 w-5 text-[#0052FF]/30" />
      </div>

      <div className="relative z-10">

        <section className="container mx-auto px-4 py-8">
          {/* En-tête avec animation */}
          <div className="bg-white py-5 rounded-lg">
            <div className="text-center mb-5 animate-fade-in">
              <h1 className="azonix text-xl lg:text-5xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#0A0A0A] to-[#0052FF] bg-clip-text text-transparent">
                Produits & Accessoires
              </h1>
              <p className="text-sm px-2 lg:text-xl text-[#5A6470] max-w-2xl mx-auto leading-relaxed">
                Découvrez notre gamme complète pour équiper et embellir votre maison
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
                  className="w-full h-12 sm:h-14 lg:h-16 pl-10 sm:pl-12 lg:pl-16 pr-16 sm:pr-32 lg:pr-8 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm lg:text-lg text-start font-semibold uppercase tracking-wide transition-all duration-300 group-hover:shadow-lg border-[#0052FF]/30 bg-white/80 backdrop-blur-md focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Icône de recherche */}
                <Search className="absolute left-3 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-[#0052FF] transition-transform duration-300 group-hover:scale-110 group-focus-within:scale-110" />

                {/* Bouton de recherche */}
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 sm:h-11 lg:h-12 px-3 sm:px-4 lg:px-6 bg-[#0052FF] hover:bg-[#003EE6] text-white rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-xs sm:text-sm lg:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {/* Texte visible sur desktop/tablette */}
                      <span className="hidden sm:inline">Rechercher</span>
                      {/* Icône uniquement sur mobile */}
                      <Search className="sm:hidden h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Affichage des résultats de recherche */}
          {searchQuery && products.length > 0 && (
            <div className="mb-12 animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Résultats de recherche</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                    {product.images && product.images.length > 0 ? (
                      <div
                        className="w-full h-48 bg-cover bg-center rounded-lg mb-4"
                        style={{ backgroundImage: `url(${product.images[0]})` }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg mb-4 flex items-center justify-center">
                        <Package className="h-12 w-12 text-primary/40" />
                      </div>
                    )}

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        €{product.price}
                      </span>
                      <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
                        {product.quantity > 0 ? "En stock" : "Rupture"}
                      </Badge>
                    </div>

                    {product.vendor?.companyName && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <ShoppingCart className="h-4 w-4" />
                        <span>{product.vendor.companyName}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Section Équipement */}
          <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="equipement">
            <div
              className=" flex items-center gap-4 mb-8 animate-slide-from-left"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-3 rounded-2xl bg-[#0052FF] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <Home className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Équipement Maison
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Tout le matériel et équipement pour aménager et équiper votre intérieur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEquipment.map((category, index) => {
                const IconComponent = category.icon;
                const productCount = getProductCount(category.name);

                return (
                  <Card
                    key={category.name}
                    className=" group p-4 flex flex-col border-0 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-slide-from-left-card"
                    style={{
                      animationDelay: `${0.3 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img src={category.image} alt="" className="w-full h-full object-cover" />
                      <div className="flex justify-end absolute bg-blue-700 rounded-full text-white bottom-2 right-2">
                        <Badge variant="">
                          {productCount} produit{productCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#0052FF] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#5A6470] text-sm mb-2 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      className="w-full bg-[#0052FF]/10 hover:bg-[#0052FF] hover:text-white text-[#0052FF] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                      onClick={() => handleCategoryClick(category, "équipement")}
                      disabled={productCount === 0}
                    >
                      {productCount > 0 ? (
                        <>
                          Explorer
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      ) : (
                        "Bientôt disponible"
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section Matériaux - Animation Slide From Right */}
          <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="materiaux">
            <div
              className="flex items-center gap-4 mb-8 animate-slide-from-right"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="p-3 rounded-2xl bg-[#00C2A8] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <Construction className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Matériaux Construction
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Matériaux de construction et fournitures pour tous vos projets
                  de rénovation
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMaterials.map((category, index) => {
                const IconComponent = category.icon;
                const productCount = getProductCount(category.name);

                return (
                  <Card
                    key={category.name}
                    className="group p-6 border-0 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-slide-from-right-card"
                    style={{
                      animationDelay: `${0.5 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img src={category.image} alt="" className="w-full h-full object-cover" />
                      <div className="flex justify-end absolute bg-blue-700 rounded-full text-white bottom-2 right-2">
                        <Badge variant="">
                          {productCount} produit{productCount !== 1 ? 's' : ''}
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
                      onClick={() => handleCategoryClick(category, "matériaux")}
                      disabled={productCount === 0}
                    >
                      {productCount > 0 ? (
                        <>
                          Explorer
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      ) : (
                        "Bientôt disponible"
                      )}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Section Design & Décoration - Animation Scale Up */}
          <div className="bg-white/70 p-5 pb-14 my-5 rounded-lg" id="design">
            <div
              className="flex items-center gap-4 mb-8 animate-scale-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="p-3 rounded-2xl bg-[#0052FF] shadow-lg transform transition-transform duration-300 hover:scale-110">
                <Brush className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-4xl font-bold text-black/70">
                  Design & Décoration
                </h2>
                <p className="text-xs lg:text-sm text-[#5A6470] mt-2">
                  Solutions esthétiques pour sublimer votre intérieur
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDesign.map((category, index) => {
                const IconComponent = category.icon;
                const productCount = getProductCount(category.name);

                return (
                  <Card
                    key={category.name}
                    className="group p-6 border-0 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-white/20 text-center animate-scale-up-card"
                    style={{
                      animationDelay: `${0.7 + index * 0.1}s`,
                    }}
                  >
                    <div className="relative flex mx-auto overflow-hidden bg-black/15 w-full h-32 rounded-md mb-4">
                      <img src={category.image} alt="" className="w-full h-full object-cover" />
                      <div className="flex justify-end absolute bg-blue-700 rounded-full text-white bottom-2 right-2">
                        <Badge variant="">
                          {productCount} produit{productCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 text-[#0A0A0A] group-hover:text-[#0052FF] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-[#5A6470] text-sm mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <Button
                      className="w-full bg-[#0052FF]/10 hover:bg-[#0052FF] hover:text-white text-[#0052FF] border-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                      onClick={() => handleCategoryClick(category, "design")}
                      disabled={productCount === 0}
                    >
                      {productCount > 0 ? (
                        <>
                          Explorer
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      ) : (
                        "Bientôt disponible"
                      )}
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
                Vous ne trouvez pas ce que vous cherchez ?
              </h3>
              <p className="text-sm lg:text-xl text-[#5A6470] mb-8 max-w-2xl mx-auto">
                Notre équipe d'experts est là pour vous accompagner dans tous vos projets
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  className="bg-[#0052FF] hover:bg-[#003EE6] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  onClick={() => handleContactClick("contact")}
                >
                  Contactez-nous
                </Button>
                <Button
                  className="bg-[#00C2A8] hover:bg-[#00A890] text-white px-8 py-3 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse-cta"
                  style={{ animationDelay: "0.5s" }}
                  onClick={() => handleContactClick("rdv")}
                >
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        products={categoryProducts}
      />

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
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
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
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
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

export default Produits;