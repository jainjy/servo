import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
  FileText,
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  Calendar,
  Share2,
  Search,
  Clock,
  HomeIcon,
  TreePalm,
  Building,
  BookCheck,
  Loader2,
  Plus,
  Wrench,
  Boxes,
  Filter,
  ArrowRight,
  Palette,
  Zap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";
import MateriauxTravauxSection from "./MateriauxTravauxSection";
import AdvertisementPopup from "./AdvertisementPopup";
import Allpub from "./Allpub";

// Images de fond pour chaque catégorie
const backgroundImages = {
  interieurs:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1916&q=80",
  exterieurs:
    "https://images.unsplash.com/photo-1586500036706-419638c4e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  constructions:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  materiaux:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "autres-services":
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
};

// Définir toutes les catégories avec leurs sections
const categories = {
  interieurs: {
    id: "interieurs",
    label: "PRESTATIONS INTÉRIEURES",
    description: "Transformez votre intérieur avec nos experts",
    sectionId: "Prestations intérieures",
  },
  exterieurs: {
    id: "exterieurs",
    label: "PRESTATIONS EXTÉRIEURES",
    description: "Aménagez vos espaces extérieurs",
    sectionId: "Prestations extérieures",
  },
  constructions: {
    id: "constructions",
    label: "CONSTRUCTIONS",
    description: "Bâtissez votre projet de A à Z",
    sectionId: "Constructions",
  },
  materiaux: {
    id: "materiaux",
    label: "MATÉRIAUX",
    description: "Matériaux de construction et fournitures",
    sectionId: "Matériaux",
  },
  "autres-services": {
    id: "autres-services",
    label: "AUTRES SERVICES TRAVAUX",
    description: "Services complémentaires et expertise",
    sectionId: "Autres services travaux",
  },
};

// Définir les icônes pour les catégories de matériaux
const materielIcons = {
  "Ciment & béton": Boxes,
  "Briques & parpaings": Building,
  "Bois & dérivés": TreePalm,
  Carrelage: HomeIcon,
  "Peinture & enduits": Palette,
  "Plomberie (tuyaux, sanitaires)": Wrench,
  "Électricité (câbles, tableaux)": Zap,
  "Isolation thermique & phonique": Home,
};

// Données statiques pour les matériaux
const materiauxData = [
  {
    id: 1,
    name: "Ciment & béton",
    description:
      "Ciments, mortiers, bétons prêts à l'emploi pour tous vos travaux de maçonnerie",
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 45,
    iconName: "Ciment & béton",
  },
  {
    id: 2,
    name: "Briques & parpaings",
    description: "Matériaux de construction pour murs porteurs et cloisons",
    image:
      "https://images.unsplash.com/photo-1586500036706-419638c4e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 32,
    iconName: "Briques & parpaings",
  },
  {
    id: 3,
    name: "Bois & dérivés",
    description:
      "Bois de charpente, lambris, panneaux et dérivés pour construction et aménagement",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 67,
    iconName: "Bois & dérivés",
  },
  {
    id: 4,
    name: "Carrelage",
    description:
      "Carrelages intérieur et extérieur, faïences, grès cérame pour sols et murs",
    image:
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 89,
    iconName: "Carrelage",
  },
  {
    id: 5,
    name: "Peinture & enduits",
    description:
      "Peintures intérieures et extérieures, enduits, primaires et accessoires",
    image:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 124,
    iconName: "Peinture & enduits",
  },
  {
    id: 6,
    name: "Plomberie (tuyaux, sanitaires)",
    description:
      "Tuyaux, raccords, sanitaires et accessoires pour installations neuves ou rénovations",
    image:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 78,
    iconName: "Plomberie (tuyaux, sanitaires)",
  },
  {
    id: 7,
    name: "Électricité (câbles, tableaux)",
    description:
      "Câbles électriques, tableaux, interrupteurs et matériel d'installation électrique",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 56,
    iconName: "Électricité (câbles, tableaux)",
  },
  {
    id: 8,
    name: "Isolation thermique & phonique",
    description:
      "Isolants pour toiture, murs, sols : laine minérale, PSE, ouate de cellulose",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    productCount: 42,
    iconName: "Isolation thermique & phonique",
  },
];

// Modal pour les photos
export const PhotosModal = ({ isOpen, onClose, prestation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && prestation) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, prestation]);

  if (!isOpen || !prestation) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % prestation.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + prestation.images.length) % prestation.images.length
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {prestation.libelle}
            </h2>
            <p className="text-gray-600 text-sm">{prestation.description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img
              src={prestation.images[currentImageIndex]}
              alt={`${prestation.libelle} - Image ${currentImageIndex + 1}`}
              className="w-full h-96 object-cover"
            />

            {prestation.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {prestation.images.length}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <Button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal pour le devis
export const DevisModal = ({ isOpen, onClose, prestation }) => {
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

  if (!isOpen || !prestation) return null;

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
        serviceId: prestation.id,
        nombreArtisans: "UNIQUE",
        createdById: userId,
      };

      const response = await api.post("/demandes/immobilier", demandeData);

      if (response.status === 201) {
        toast.info("Votre demande a été créée avec succès !");
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
            <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
              <FileText className="h-6 w-6 text-[#6B8E23]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Demande de Devis
              </h2>
              <p className="text-gray-600 text-xs lg:text-sm">
                {prestation.libelle}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute lg:relative right-2 top-2 h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-gray-100"
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

          <div className="bg-[#6B8E23]/10 rounded-lg p-4">
            <h3 className="font-semibold text-[#8B4513] mb-2">
              Prestation sélectionnée
            </h3>
            <p className="text-[#8B4513] text-sm">{prestation.libelle}</p>
            <p className="text-[#6B8E23] text-xs">{prestation.description}</p>
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              className="flex-1 bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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

// Composant pour la section matériaux
const MateriauxSection = () => {
  const [localSearch, setLocalSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les catégories
  const filteredCategories = materiauxData.filter(
    (category) =>
      category.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      category.description.toLowerCase().includes(localSearch.toLowerCase())
  );

  // Trier les catégories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return b.productCount - a.productCount;
    }
  });

  const clearSearch = () => {
    setLocalSearch("");
  };

  const handleCategoryClick = (category: (typeof materiauxData)[0]) => {
    toast.info(
      `Catégorie "${category.name}" sélectionnée - ${category.productCount} produits disponibles`
    );
  };

  return (
    <div
      id="materiaux-section"
      className="bg-white/70 p-6 pb-14 my-8 rounded-2xl border border-[#D3D3D3] shadow-lg"
    >
      {/* En-tête avec recherche */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div
          className="flex items-center gap-4 animate-slide-from-left flex-1"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="p-3 rounded-xl bg-[#556B2F] shadow-lg transform transition-transform duration-300 hover:scale-110">
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-[#556B2F]">
              Matériaux de Construction
            </h2>
            <p className="text-xs lg:text-sm text-[#8B4513] mt-1">
              Tous les matériaux et fournitures pour vos chantiers et travaux
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Input
              placeholder="Rechercher un matériau..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10 rounded-xl border-[#D3D3D3] focus:border-[#556B2F]"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513]" />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8B4513] hover:text-[#556B2F]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border-[#D3D3D3]"
          >
            <Filter className="h-4 w-4" />
            Trier
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="bg-white/50 p-4 rounded-lg mb-6 border border-[#D3D3D3] animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-[#8B4513]">
              Trier par :
            </span>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "name" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("name")}
                className={
                  sortBy === "name"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                Nom A-Z
              </Button>
              <Button
                variant={sortBy === "count" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("count")}
                className={
                  sortBy === "count"
                    ? "bg-[#556B2F] text-white"
                    : "border-[#D3D3D3]"
                }
              >
                Plus de produits
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Résultats de recherche */}
      {localSearch && (
        <div className="mb-6 animate-fade-in">
          <p className="text-[#8B4513]">
            {sortedCategories.length > 0
              ? `${sortedCategories.length} résultat(s) pour "${localSearch}"`
              : `Aucun résultat pour "${localSearch}"`}
          </p>
        </div>
      )}

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedCategories.map((category, index) => {
          const IconComponent =
            materielIcons[category.iconName as keyof typeof materielIcons] ||
            Boxes;

          return (
            <Card
              key={category.id}
              className="group p-4 flex flex-col border border-[#D3D3D3]/20 bg-white/90 backdrop-blur-md shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-xl text-center"
              style={{
                animationDelay: `${0.3 + index * 0.1}s`,
              }}
            >
              <div className="relative flex mx-auto overflow-hidden bg-gray-100 w-full h-40 rounded-lg mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-[#556B2F] text-white">
                    {category.productCount} produit
                    {category.productCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                  <IconComponent className="h-6 w-6 text-[#6B8E23]" />
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-[#556B2F] group-hover:text-[#6B8E23] transition-colors duration-300">
                {category.name}
              </h3>

              <p className="text-gray-600 text-xs mb-4 leading-relaxed flex-grow">
                {category.description}
              </p>

              <Button
                className="w-full border border-[#556B2F] bg-transparent hover:bg-[#556B2F] hover:text-white text-[#556B2F] transition-all duration-300 rounded-lg"
                onClick={() => handleCategoryClick(category)}
              >
                Voir les produits
                <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Message aucun résultat */}
      {sortedCategories.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <Boxes className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Aucun matériau trouvé
          </h3>
          <p className="text-gray-400">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

// Composant principal combiné
const IntelligibleSection = ({ showAllPrestations }) => {
  const { trackConstructionInteraction } = useInteractionTracking();
  const location = useLocation();
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState("interieurs");
  const [servicesCategorie, setServicesCategorie] = useState([]);
  const [displayedPrestations, setDisplayedPrestations] = useState([]);
  const [selectedType, setSelectedType] = useState("TOUS");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [photosModal, setPhotosModal] = useState({
    isOpen: false,
    prestation: null,
  });
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null,
  });
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [metierFilter, setMetierFilter] = useState("TOUS");

  const { user, isAuthenticated } = useAuth();

  const sections = [
    {
      id: "interieurs",
      label: "Intérieur",
      icon: HomeIcon,
      subsections: [
        "Rénovation",
        "Aménagement",
        "Plomberie",
        "Électricité",
        "Décoration",
        "Peinture",
        "Revêtement sol & mur",
        "Menuiserie intérieure",
        "Isolation",
      ],
    },
    {
      id: "exterieurs",
      label: "Extérieur",
      icon: TreePalm,
      subsections: [
        "Jardinage",
        "Terrasse",
        "Piscine",
        "Clôture",
        "Toiture",
        "Façade",
        "Portail & clôture",
        "Allée & pavage",
      ],
    },
    {
      id: "constructions",
      label: "Construction",
      icon: Building,
      subsections: [
        "Gros œuvre",
        "Extension",
        "Maison neuve",
        "Garage",
        "Véranda",
        "Fondations",
        "Maçonnerie",
        "Charpente",
      ],
    },
    {
      id: "materiaux",
      label: "Matériaux",
      icon: Boxes,
      subsections: [
        "Ciment & béton",
        "Briques & parpaings",
        "Bois & dérivés",
        "Carrelage",
        "Peinture & enduits",
        "Plomberie (tuyaux, sanitaires)",
        "Électricité (câbles, tableaux)",
        "Isolation thermique & phonique",
      ],
    },
    {
      id: "autres-services",
      label: "Autres services travaux",
      icon: Wrench,
      subsections: [
        "Devis & expertise",
        "Diagnostic bâtiment",
        "Démolition",
        "Déblaiement",
        "Nettoyage de fin de chantier",
        "Maintenance & réparation",
        "Rénovation énergétique",
        "Assistance chantier",
      ],
    },
  ];

  // Utiliser directement l'objet categories qui contient toutes les catégories
  const currentCategory = categories[categorie] || categories.interieurs;

  useEffect(() => {
    if (servicesCategorie?.services) {
      servicesCategorie.services.forEach((service) => {
        trackConstructionInteraction(service.id, service.libelle, "view", {
          section: currentCategory.label,
        });
      });
    }
  }, [servicesCategorie, currentCategory]);

  const fetchServicesCategorie = async (cat) => {
    setIsLoadingServices(true);
    try {
      const response = await api.get(
        `/categories/name/${encodeURIComponent(cat)}/services`
      );
      // console.log("Réponse API pour", cat, ":", response.data);
      setServicesCategorie(response.data);

      const initialIndexes = {};
      response.data.services?.forEach((service) => {
        initialIndexes[service.id] = 0;
      });
      setCurrentImageIndexes(initialIndexes);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des catégories de services:",
        error
      );
      // Gérer l'erreur gracieusement
      setServicesCategorie({ services: [] });
      toast.error("Impossible de charger les services pour cette catégorie");
    } finally {
      setIsLoadingServices(false);
    }
  };

  const search = (e) => {
    const mot = e.target.value;
    setSearchFilter(mot);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("categorie");
    const searchParam = params.get("search");

    // Utiliser les IDs des sections comme référence
    const validIds = sections.map((s) => s.id);
    const validCategorie = validIds.includes(cat) ? cat : "interieurs";

    if (!cat || cat !== validCategorie) {
      const newParams = new URLSearchParams(location.search);
      newParams.set("categorie", validCategorie);
      navigate({ search: newParams.toString() }, { replace: true });
    }

    setCategorie(validCategorie);

    // Utiliser la sectionId de la catégorie correspondante
    const categoryToFetch = categories[validCategorie];
    if (categoryToFetch) {
      fetchServicesCategorie(categoryToFetch.sectionId);
    } else {
      // Fallback à interieurs si la catégorie n'existe pas
      fetchServicesCategorie(categories.interieurs.sectionId);
    }

    if (searchParam) {
      setSearchFilter(decodeURIComponent(searchParam));
    }
  }, [location.search, navigate]);

  useEffect(() => {
    const currentPrestations = servicesCategorie?.services || [];

    let filtered = currentPrestations;

    if (selectedType !== "TOUS") {
      filtered = filtered.filter(
        (prestation) => prestation.libelle === selectedType
      );
    }

    if (metierFilter === "AVEC_METIERS") {
      filtered = filtered.filter(
        (prestation) => prestation.metiers && prestation.metiers.length > 0
      );
    } else if (metierFilter === "SANS_METIERS") {
      filtered = filtered.filter(
        (prestation) => !prestation.metiers || prestation.metiers.length === 0
      );
    }

    if (searchFilter) {
      filtered = filtered.filter(
        (prestation) =>
          prestation.libelle
            .toLowerCase()
            .includes(searchFilter.toLowerCase()) ||
          prestation.description
            ?.toLowerCase()
            .includes(searchFilter.toLowerCase())
      );
    }

    setDisplayedPrestations(
      showAllPrestations ? filtered : filtered.slice(0, 8)
    );
  }, [
    selectedType,
    servicesCategorie,
    searchFilter,
    showAllPrestations,
    metierFilter,
  ]);

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: ((prev[prestationId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]:
        ((prev[prestationId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const openPhotosModal = (prestation) => {
    trackConstructionInteraction(
      prestation.id,
      prestation.libelle,
      "view_photos",
      {
        imageCount: prestation.images?.length || 0,
      }
    );
    setPhotosModal({ isOpen: true, prestation });
  };

  const openDevisModal = (prestation) => {
    trackConstructionInteraction(
      prestation.id,
      prestation.libelle,
      "devis_request",
      {
        type: prestation.libelle,
        price: prestation.price,
      }
    );

    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour faire une demande de devis.");
      return;
    }
    setDevisModal({ isOpen: true, prestation });
  };

  const closePhotosModal = () => {
    setPhotosModal({ isOpen: false, prestation: null });
  };

  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, prestation: null });
  };

  interface FilterButtonProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
    isAllButton?: boolean;
  }

  const FilterButton = ({
    label,
    isSelected,
    onClick,
    disabled = false,
    isAllButton = false,
  }: FilterButtonProps) => {
    const baseClasses =
      "inline-flex items-center px-4 py-2 rounded-full text-xs border-2 transition-all duration-300";

    const selectedClasses =
      "bg-[#556B2F] text-white border-transparent shadow-lg scale-105";
    const unselectedClasses = isAllButton
      ? "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black hover:shadow-md"
      : "bg-white text-gray-700 border-gray-300 hover:border-[#6B8E23] hover:text-[#6B8E23] hover:shadow-md";

    return (
      <button
        className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );
  };

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) => {
      if (type === "TOUS") {
        return prev.includes("TOUS") ? [] : ["TOUS"];
      }

      if (prev.includes(type)) {
        return prev.filter((t) => t !== type && t !== "TOUS");
      } else {
        const newSelection = [...prev.filter((t) => t !== "TOUS"), type];
        return newSelection;
      }
    });
  };

  const handleApplySelection = () => {
    if (selectedTypes.length === 1) {
      setSelectedType(selectedTypes[0]);
    } else if (selectedTypes.length > 1) {
      setSelectedType(selectedTypes[0]);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      setSelectedTypes(
        selectedType && selectedType !== "TOUS" ? [selectedType] : []
      );
    }
  }, [isModalOpen, selectedType]);

  return (
    <>
      <section id={currentCategory.sectionId} className="relative min-h-screen">
        {/* Advertisement Popup - Absolute Position */}
        <div className="absolute top-12 left-4 right-4 z-50">
          <AdvertisementPopup />
        </div>

        <div className="fixed w-1/2 bottom-0 right-4 z-50">
          <AdvertisementPopup />
        </div>
        <div className="absolute inset-0 -z-20 overflow-hidden h-80 w-full">
          <div className="bg-black/50 absolute w-full h-full backdrop-blur-sm "></div>
          <img
            className="h-full w-full object-cover"
            src={backgroundImages[categorie] || backgroundImages.interieurs}
            alt={currentCategory.label}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-0 lg:mb-12">
            <h1 className="text-4xl md:text-4xl font-medium text-gray-100 mb-6">
              {currentCategory.label}
            </h1>
            <p className="text-sm lg:text-md text-gray-200 max-w-2xl mx-auto mb-8">
              {currentCategory.description}
            </p>
          </div>

          <Tabs
            defaultValue={categorie}
            className="w-full"
            onValueChange={(value) => {
              setCategorie(value);
              const currentParams = new URLSearchParams(location.search);
              currentParams.set("categorie", value);
              navigate({ search: currentParams.toString() }, { replace: true });

              // Charger les services pour la nouvelle catégorie
              const categoryToFetch = categories[value];
              if (categoryToFetch) {
                fetchServicesCategorie(categoryToFetch.sectionId);
              }
            }}
          >
            <TabsList className="grid md:w-1/2 w-full md:grid-cols-3 grid-cols-1 bg-white/80 backdrop-blur-sm rounded-xl h-auto mb-8 mx-auto shadow-md border border-[#D3D3D3]">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="py-3 data-[state=active]:bg-[#556B2F] data-[state=active]:text-white relative"
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span className="text-xs">{section.label}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map(
              (section) =>
                categorie !=
                "materiaux" && (
                  <TabsContent key={section.id} value={section.id}>
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl px-8 py-4 mb-12 shadow-sm border border-[#D3D3D3] flex flex-col gap-6">
                      {/* Section Recherche */}
                      <div className="relative flex-1 md:min-w-[300px] w-24 mx-auto">
                        <Input
                          placeholder="Rechercher une prestation..."
                          className="md:w-96 w-60 p-4 pl-12 pr-4 md:ml-0 -ml-12 bg-white border-2 border-[#556B2F] rounded-2xl shadow-sm 
               transition-all duration-300 focus:border-[#6B8E23] focus:ring-2 focus:ring-[#6B8E23]/20
               disabled:opacity-50 disabled:cursor-not-allowed"
                          value={searchFilter}
                          onChange={search}
                          disabled={isLoadingServices}
                        />
                        <Search className="absolute top-2 md:left-4 -left-8 transform h-5 w-5 text-[#556B2F]" />
                      </div>

                      {/* Section Filtres par type */}
                      <div className="flex-1">
                        <div className="flex justify-center items-start gap-3 mb-3">
                          <BookCheck className="h-4 w-4 text-slate-900 mt-0.5 flex-shrink-0" />
                          <span className="text-xs font-semibold text-slate-900">
                            {section.label.toUpperCase()} :
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-hidden mx-auto justify-center ">
                          <FilterButton
                            label="TOUS"
                            isSelected={selectedType === "TOUS"}
                            onClick={() => setSelectedType("TOUS")}
                            disabled={isLoadingServices}
                            isAllButton
                          />

                          {section.subsections.map((subsection) => (
                            <FilterButton
                              key={subsection}
                              label={subsection}
                              isSelected={selectedType === subsection}
                              onClick={() => setSelectedType(subsection)}
                              disabled={isLoadingServices}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Filtre Métiers */}
                      <div className="flex-1 border-t pt-4">
                        <div className="flex justify-center items-start gap-3 mb-3">
                          <BookCheck className="h-4 w-4 text-slate-900 mt-0.5 flex-shrink-0" />
                          <span className="text-xs font-semibold text-slate-900">
                            MÉTIERS :
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mx-auto justify-center">
                          <FilterButton
                            label="TOUS"
                            isSelected={metierFilter === "TOUS"}
                            onClick={() => setMetierFilter("TOUS")}
                            disabled={isLoadingServices}
                            isAllButton
                          />
                          <FilterButton
                            label="Avec Métiers"
                            isSelected={metierFilter === "AVEC_METIERS"}
                            onClick={() => setMetierFilter("AVEC_METIERS")}
                            disabled={isLoadingServices}
                          />
                          <FilterButton
                            label="Sans Métiers"
                            isSelected={metierFilter === "SANS_METIERS"}
                            onClick={() => setMetierFilter("SANS_METIERS")}
                            disabled={isLoadingServices}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                )
            )}
          </Tabs>

          <Allpub
        title="Offres spéciales"
        description="Bénéficiez de réductions exclusives sur nos meilleurs services."
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
        background="bg-white"
        textbg="text-slate-900"
      />

          {/* AFFICHAGE CONDITIONNEL : SPINNER OU CONTENU DE LA CATÉGORIE */}
          {isLoadingServices ? (
            <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
              <img src="/loading.gif" alt="" className="w-24 h-24" />
              <p className="mt-4 text-xl font-semibold text-gray-700">
                Chargement des prestations...
              </p>
            </div>
          ) : (
            <>
              {/* Si c'est l'onglet "Matériaux", afficher la section spéciale */}
              {categorie === "materiaux" ? (
                <MateriauxTravauxSection />
              ) : (
                <>
                  {/* Filtres pour les autres catégories */}
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-semibold text-logo mr-2 flex items-center gap-2">
                      <BookCheck className="h-4 w-4" />
                      LISTES :
                    </span>

                    {/* Bouton TOUS */}
                    <button
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all duration-300 ${selectedType === "TOUS"
                          ? "bg-[#556B2F] text-white border-transparent shadow-lg scale-105"
                          : "bg-white text-gray-700 border-[#D3D3D3] hover:border-[#6B8E23] hover:text-[#6B8E23] hover:shadow-md"
                        } ${isLoadingServices ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      onClick={() => setSelectedType("TOUS")}
                      disabled={isLoadingServices}
                    >
                      TOUS
                    </button>

                    {/* 5 premiers éléments */}
                    {servicesCategorie?.services?.slice(0, 4).map((type) => (
                      <button
                        key={type.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all duration-300 ${selectedType === type.libelle
                            ? "bg-[#556B2F] text-white border-transparent shadow-lg scale-105"
                            : "bg-white text-gray-700 border-[#D3D3D3] hover:border-[#6B8E23] hover:text-[#6B8E23] hover:shadow-md"
                          } ${isLoadingServices
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        onClick={() => setSelectedType(type.libelle)}
                        disabled={isLoadingServices}
                      >
                        {type.libelle}
                      </button>
                    ))}

                    {/* Bouton Voir plus (si plus de 5 éléments) */}
                    {servicesCategorie?.services &&
                      servicesCategorie.services.length > 5 && (
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 border-dashed border-[#D3D3D3] text-gray-600 hover:border-[#6B8E23] hover:text-[#6B8E23] transition-all duration-300"
                          onClick={() => setIsModalOpen(true)}
                          disabled={isLoadingServices}
                        >
                          <Plus className="h-4 w-4" />
                          Voir plus ({servicesCategorie.services.length - 4})
                        </button>
                      )}
                  </div>

                  {/* Modal de sélection */}
                  {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
                        {/* En-tête du modal */}
                        <div className="flex items-center justify-between px-6 py-2 border-b border-[#D3D3D3]">
                          <div className="flex items-center gap-3">
                            <BookCheck className="h-5 w-5 text-[#8B4513]" />
                            <div>
                              <h3 className="text-lg font-semibold text-[#8B4513]">
                                Toutes les listes
                              </h3>
                              <p className="text-xs text-[#8B4513]">
                                {servicesCategorie?.services?.length || 0}{" "}
                                éléments disponibles
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className=""
                          >
                            <X className="h-5 w-5 text-red-600" />
                          </button>
                        </div>

                        {/* Contenu du modal */}
                        <div className="p-6 overflow-y-auto max-h-[55vh]">
                          <div className="flex flex-wrap gap-2">
                            {/* Bouton TOUS dans le modal */}
                            <button
                              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${selectedTypes.includes("TOUS")
                                  ? "bg-[#556B2F] text-white border-[#6B8E23] shadow-lg"
                                  : "bg-gray-50 text-gray-700 border-[#D3D3D3] hover:border-[#6B8E23] hover:text-[#6B8E23]"
                                }`}
                              onClick={() => handleToggleType("TOUS")}
                            >
                              TOUS
                            </button>

                            {/* Tous les éléments dans le modal */}
                            {servicesCategorie?.services?.map((type) => (
                              <button
                                key={type.id}
                                className={`inline-flex items-center px-3 py-2 rounded-full text-sm border transition-all duration-200 ${selectedTypes.includes(type.libelle)
                                    ? "bg-[#6B8E23] text-white border-[#556B2F] shadow-lg"
                                    : "text-gray-700 border-[#D3D3D3] hover:border-[#556B2F] hover:text-[#556B2F]"
                                  }`}
                                onClick={() => handleToggleType(type.libelle)}
                              >
                                {type.libelle}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Pied du modal avec sélection multiple */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[#D3D3D3] bg-white">
                          <div className="text-sm text-gray-500">
                            {selectedTypes.length > 0 ? (
                              <span>
                                {selectedTypes.length} élément(s) sélectionné(s)
                              </span>
                            ) : (
                              <span>Aucune sélection</span>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={handleApplySelection}
                              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTypes.length > 0
                                  ? "bg-[#556B2F] text-white hover:bg-[#6B8E23] shadow-lg"
                                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                              disabled={selectedTypes.length === 0}
                            >
                              Appliquer
                            </button>

                            <button
                              onClick={() => setIsModalOpen(false)}
                              className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-white bg-red-600 hover:bg-red-700 transition-all duration-200"
                            >
                              Fermer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Grille des prestations pour les autres catégories */}
                  <div className="sm:columns-1 md:columns-2 lg:columns-3 xl:columns-5 2xl:columns-5 mb-12">
                    {displayedPrestations.map((prestation) => {
                      const currentImageIndex =
                        currentImageIndexes[prestation.id] || 0;
                      const totalImages = prestation.images?.length || 0;
                      const currentImage =
                        prestation.images?.[currentImageIndex] ||
                        "/placeholder-image.jpg";

                      return (
                        <Card
                          key={prestation.id}
                          className="group my-2 lg:my-4 overflow-hidden border border-[#D3D3D3] bg-white hover:shadow-md transition-all duration-300 rounded-2xl cursor-pointer"
                        >
                          <div className="relative">
                            {/* Section Image */}
                            <div
                              className="relative h-48 p-2 overflow-hidden rounded-t-2xl cursor-pointer"
                              onClick={() => openPhotosModal(prestation)}
                            >
                              <img
                                src={currentImage}
                                alt={prestation.libelle}
                                className="w-full h-full rounded-md object-cover opacity-80 transition-transform"
                              />

                              <div className="absolute top-3 left-3 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-[#8B4513]">
                                {prestation.libelle}
                              </div>

                              {totalImages > 1 && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    onClick={(e) =>
                                      prevImage(prestation.id, totalImages, e)
                                    }
                                  >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    onClick={(e) =>
                                      nextImage(prestation.id, totalImages, e)
                                    }
                                  >
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </Button>

                                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                                    {currentImageIndex + 1}/{totalImages}
                                  </div>
                                </>
                              )}
                            </div>

                            {/* Section Contenu */}
                            <div className="p-4">
                              <h3 className="font-semibold text-[#8B4513] text-sm mb-2">
                                {prestation.libelle}
                              </h3>
                              <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                                {prestation.description}
                              </p>

                              {/* Métiers liés en badges */}
                              {prestation.metiers &&
                                prestation.metiers.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {prestation.metiers.map((metierService) => (
                                      <span
                                        key={metierService.metier.id}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#6B8E23]/10 text-[#556B2F] border border-[#6B8E23]/20"
                                      >
                                        {metierService.metier.libelle}
                                      </span>
                                    ))}
                                  </div>
                                )}

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {totalImages > 0 && (
                                  <Button
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-xs transition-colors duration-200"
                                    onClick={() => openPhotosModal(prestation)}
                                  >
                                    <Camera className="h-3 w-3 mr-1" />
                                    Photos
                                  </Button>
                                )}
                                <Button
                                  className="text-white font-medium bg-[#556B2F] rounded-lg text-xs hover:bg-[#6B8E23] transition-colors duration-200 flex-1"
                                  onClick={() => openDevisModal(prestation)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  DEVIS
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {displayedPrestations.length === 0 && !isLoadingServices && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">
                        Aucune prestation trouvée pour votre recherche.
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Bannière "DEVIS ENVOYÉ DANS LES 48H" */}
          <div className="flex justify-end mr-5">
            <div className="inline-flex items-center gap-3 bg-[#556B2F] my-5 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg animate-pulse">
              <div className="bg-white/10 p-1.5 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  DEVIS ENVOYÉ DANS LES 48H
                </p>
                <p className="text-white/80 text-xs">
                  Réponse sous 2 jours ouvrés
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PhotosModal
        isOpen={photosModal.isOpen}
        onClose={closePhotosModal}
        prestation={photosModal.prestation}
      />
      <DevisModal
        isOpen={devisModal.isOpen}
        onClose={closeDevisModal}
        prestation={devisModal.prestation}
      />
    </>
  );
};

export default IntelligibleSection;
