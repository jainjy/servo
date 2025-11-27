// src/pages/ServicesIBRPage.tsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Building2,
  FileText,
  Users,
  X,
  Clock,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Award,
  Target,
  BarChart3,
  Shield,
  Settings,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface Service {
  id: number;
  libelle: string;
  description: string;
  categoryId: number;
  images: string[];
  duration: number | null;
  price: number | null;
  category: {
    id: number;
    name: string;
  } | null;
  metiers: Array<{
    metier: {
      id: number;
      libelle: string;
    };
  }>;
}

interface Category {
  id: number;
  name: string;
  services: Service[];
}

interface IBRCategoryTab {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
}

// Modal pour le devis
export const DevisModalIBR = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    message: "",
    dateSouhaitee: "",
    budget: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        message: "",
        dateSouhaitee: "",
        budget: "",
      });
    }
  }, [isOpen]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userId = user.id;

      const demandeData = {
        contactNom: formData.nom,
        contactPrenom: formData.prenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        lieuAdresse: formData.adresse,
        lieuAdresseCp: "75000",
        lieuAdresseVille: "Paris",
        optionAssurance: false,
        description: formData.message,
        devis: `Budget estimé: ${formData.budget}, Date souhaitée: ${formData.dateSouhaitee}`,
        serviceId: service.id,
        nombreArtisans: "UNIQUE",
        createdById: userId,
      };

      const response = await api.post("/demandes/immobilier", demandeData);

      if (response.status === 201) {
        toast.success("Votre demande a été créée avec succès !");
        onClose();
      }
    } catch (error) {
      console.error("Erreur création demande:", error);
      toast.error("Erreur lors de la création de la demande");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Demande de Devis IBR
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                {service.libelle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Nom *
              </label>
              <Input
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Prénom *
              </label>
              <Input
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Votre prénom"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email *
              </label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Téléphone *
              </label>
              <Input
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                placeholder="06 12 34 56 78"
                required
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="h-4 w-4 inline mr-1" />
              Adresse du projet
            </label>
            <Input
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Adresse complète du projet"
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date souhaitée
              </label>
              <Input
                name="dateSouhaitee"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.dateSouhaitee}
                onChange={handleChange}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget estimé
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3"
                required
                disabled={isSubmitting}
              >
                <option value="">Sélectionnez un budget</option>
                <option value="0-5000">0 - 5 000 €</option>
                <option value="5000-15000">5 000 - 15 000 €</option>
                <option value="15000-30000">15 000 - 30 000 €</option>
                <option value="30000+">30 000 € et plus</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message supplémentaire
            </label>
            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Décrivez votre projet en détail..."
              rows={4}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Service sélectionné
            </h3>
            <p className="text-blue-800 text-sm">{service.libelle}</p>
            <p className="text-blue-600 text-xs">{service.description}</p>
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ServicesIBRPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    service: null,
  });
  const { isAuthenticated } = useAuth();

  // Mapping des catégories IBR pour les onglets
  const ibrCategoryMapping: Record<string, string> = {
    "Études préalables & faisabilité": "etudes",
    "Études architecturales": "architecture",
    "Études structurelles": "structure",
    "Économie de la construction": "economie",
    "Ingénierie environnementale & performance": "environnement",
    "Suivi de chantier & direction de travaux": "chantier",
    "Spécialités selon BET": "specialites",
  };

  // Données des catégories IBR pour les onglets
  const ibrCategories: IBRCategoryTab[] = [
    {
      id: "etudes",
      name: "Études",
      icon: BookOpen,
      description: "Analyses préalables et études de faisabilité",
    },
    {
      id: "architecture",
      name: "Architecture",
      icon: Building2,
      description: "Conception architecturale et plans",
    },
    {
      id: "structure",
      name: "Structure",
      icon: Shield,
      description: "Calculs et études structurelles",
    },
    {
      id: "economie",
      name: "Économie",
      icon: BarChart3,
      description: "Économie de la construction",
    },
    {
      id: "environnement",
      name: "Environnement",
      icon: Award,
      description: "Performance environnementale",
    },
    {
      id: "chantier",
      name: "Chantier",
      icon: Settings,
      description: "Suivi de chantier et direction",
    },
  ];

  useEffect(() => {
    fetchIBRData();
  }, []);

  const fetchIBRData = async () => {
    try {
      setLoading(true);

      // Récupérer les services IBR
      const servicesResponse = await api.get("/services-ibr");
      setServices(servicesResponse.data);

      // Récupérer les catégories IBR
      const categoriesResponse = await api.get("/services-ibr/categories");
      setCategories(categoriesResponse.data);

      console.log("✅ Services IBR:", servicesResponse.data.length);
      console.log("✅ Catégories IBR:", categoriesResponse.data.length);
    } catch (error) {
      console.error("Erreur lors du chargement des données IBR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les services
  const filteredServices = services.filter((service) => {
    // Recherche
    const matchesSearch =
      searchTerm === "" ||
      service.libelle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Catégorie
    const matchesCategory =
      selectedCategory === "all" || service.category?.name === selectedCategory;

    // Onglet actif
    let matchesTab = activeTab === "all";
    if (!matchesTab && service.category?.name) {
      const tabKey = ibrCategoryMapping[service.category.name];
      matchesTab = tabKey === activeTab;
    }

    return matchesSearch && matchesCategory && matchesTab;
  });

  // Compter les services par onglet
  const getTabCount = (tabId: string) => {
    if (tabId === "all") return services.length;

    return services.filter((service) => {
      if (!service.category?.name) return false;
      const tabKey = ibrCategoryMapping[service.category.name];
      return tabKey === tabId;
    }).length;
  };

  // Obtenir l'icône de catégorie
  const getCategoryIcon = (categoryName: string) => {
    if (!categoryName) return Building2;

    for (const [fullName, tabId] of Object.entries(ibrCategoryMapping)) {
      if (categoryName === fullName) {
        const category = ibrCategories.find((cat) => cat.id === tabId);
        return category?.icon || Building2;
      }
    }

    return Building2;
  };

  // Compter les services IBR
  const ibrServicesCount = services.length;
  const totalCategories = categories.length;

  const openDevisModal = (service) => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour faire une demande de devis.");
      return;
    }
    setDevisModal({ isOpen: true, service });
  };

  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, service: null });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Chargement des services IBR...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">IBR</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Ingénierie Bâtiment et Rénovation - Des solutions complètes pour
              vos projets de construction et rénovation
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {ibrServicesCount}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Services IBR
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {totalCategories}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Catégories
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-600 font-medium">
                  Experts IBR
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600 font-medium">Qualité</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation par onglets */}
      <section className="py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 bg-transparent h-auto">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-auto py-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Tous</span>
                <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {services.length}
                </span>
              </TabsTrigger>
              {ibrCategories.map((category) => {
                const Icon = category.icon;
                const count = getTabCount(category.id);
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white h-auto py-3"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{category.name}</span>
                    <span className="lg:hidden">{category.name}</span>
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Barre de recherche et filtres */}
            <div className="mt-8">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                <div className="relative flex-1 max-w-2xl w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Rechercher un service IBR..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="flex-1 lg:flex-none px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-sm"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name} ({category.services?.length || 0})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Résultats */}
              <TabsContent value={activeTab} className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {filteredServices.length} service
                    {filteredServices.length !== 1 ? "s" : ""} trouvé
                    {filteredServices.length !== 1 ? "s" : ""}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === "all"
                      ? "Tous les services IBR disponibles"
                      : `Services de ${
                          ibrCategories.find((cat) => cat.id === activeTab)
                            ?.description || ""
                        }`}
                  </p>
                </motion.div>

                {/* Grille des services */}
                {filteredServices.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service, index) => {
                      const CategoryIcon = getCategoryIcon(
                        service.category?.name || ""
                      );
                      return (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="h-full border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden">
                            <CardHeader className="pb-3 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-300">
                              <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                                  <CategoryIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 font-semibold"
                                >
                                  IBR
                                </Badge>
                              </div>
                              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                                {service.libelle}
                              </CardTitle>
                              {service.category && (
                                <CardDescription className="text-sm text-blue-600 font-medium">
                                  {service.category.name}
                                </CardDescription>
                              )}
                            </CardHeader>
                            <CardContent className="pt-4">
                              <p className="text-gray-600 mb-4 leading-relaxed text-sm line-clamp-3">
                                {service.description ||
                                  "Service professionnel IBR spécialisé pour accompagner vos projets de construction et rénovation."}
                              </p>

                              {/* Métiers associés */}
                              {service.metiers &&
                                service.metiers.length > 0 && (
                                  <div className="mb-4">
                                    <div className="flex flex-wrap gap-1">
                                      {service.metiers
                                        .slice(0, 3)
                                        .map((metierService, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="text-xs bg-blue-50 text-blue-700"
                                          >
                                            {metierService.metier?.libelle ||
                                              "Métier"}
                                          </Badge>
                                        ))}
                                      {service.metiers.length > 3 && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-gray-100"
                                        >
                                          +{service.metiers.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Informations supplémentaires */}
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                                {service.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                    <span>{service.duration} min</span>
                                  </div>
                                )}
                                {service.price && (
                                  <div className="font-semibold text-green-600">
                                    À partir de {service.price}€
                                  </div>
                                )}
                                {!service.duration && !service.price && (
                                  <div className="text-gray-400 text-xs">
                                    Sur devis
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                  onClick={() => openDevisModal(service)}
                                >
                                  <FileText className="h-4 w-4 mr-2" />
                                  Demander un devis
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                      <Building2 className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Aucun service trouvé
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Essayez de modifier vos critères de recherche ou de
                        changer de catégorie
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                          setActiveTab("all");
                        }}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        Réinitialiser les filtres
                      </Button>
                    </div>
                  </motion.div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Section Expert IBR */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Expertise <span className="text-blue-400">IBR</span> Certifiée
              </h2>
              <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                Nos ingénieurs et architectes spécialisés en Bâtiment et
                Rénovation vous accompagnent de l'étude de faisabilité à la
                réception des travaux.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="p-3 bg-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Précision</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Calculs et études techniques rigoureuses conformes aux normes
                  en vigueur
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="p-3 bg-green-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Qualité</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Normes et réglementations respectées pour garantir la
                  pérennité de vos projets
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300"
              >
                <div className="p-3 bg-purple-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-xl mb-3">Accompagnement</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Suivi personnalisé de votre projet du début à la fin avec un
                  expert dédié
                </p>
              </motion.div>
            </div>

         
          </div>
        </div>
      </section>

      {/* Section avantages supplémentaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir nos services IBR ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une expertise reconnue dans le domaine du bâtiment et de la
              rénovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl"
            >
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Certifications</h3>
              <p className="text-sm text-gray-600">
                Ingénieurs et architectes certifiés et qualifiés
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl"
            >
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Assurances</h3>
              <p className="text-sm text-gray-600">
                Garantie décennale et responsabilité civile professionnelle
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl"
            >
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Réactivité</h3>
              <p className="text-sm text-gray-600">
                Réponse sous 24h et disponibilité de nos équipes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-xl"
            >
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Transparence</h3>
              <p className="text-sm text-gray-600">
                Devis détaillés et suivi en temps réel de votre projet
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Devis Modal */}
      <DevisModalIBR
        isOpen={devisModal.isOpen}
        onClose={closeDevisModal}
        service={devisModal.service}
      />
    </div>
  );
}
