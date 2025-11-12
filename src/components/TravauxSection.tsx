import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  // Ajout de Loader2 pour le spinner
  Loader2,
  Plus,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "sonner";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

// Images de fond pour chaque catégorie
const backgroundImages = {
  interieurs:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1916&q=80",
  exterieurs:
    "https://images.unsplash.com/photo-1586500036706-419638c4e6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  constructions:
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
};

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
};

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
            {/* <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Demander un devis
            </Button> */}
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
  // NOUVEL ÉTAT POUR LA SOUMISSION
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

    // Début de la soumission
    setIsSubmitting(true);

    try {
      const userId = user.id;

      const demandeData = {
        contactNom: formData.nom,
        contactPrenom: formData.prenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        lieuAdresse: formData.adresse,
        lieuAdresseCp: "75000", // À adapter avec un système de géocodage
        lieuAdresseVille: "Paris", // À adapter avec un système de géocodage
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
      // Fin de la soumission
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
            disabled={isSubmitting} // Désactiver la fermeture pendant la soumission
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
                disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
                disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
                disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
                disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
              disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
                disabled={isSubmitting} // Désactiver les inputs pendant la soumission
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
                disabled={isSubmitting} // Désactiver le select pendant la soumission
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
              disabled={isSubmitting} // Désactiver la textarea pendant la soumission
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Prestation sélectionnée
            </h3>
            <p className="text-blue-800 text-sm">{prestation.libelle}</p>
            <p className="text-blue-600 text-xs">{prestation.description}</p>
          </div>

          <div className="grid lg:flex gap-3 pt-4 border-t">
            {/* BOUTON DE SOUMISSION AVEC SPINNER ET DÉSACTIVATION */}
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
  // NOUVEL ÉTAT POUR LE CHARGEMENT DES SERVICES
  const [isLoadingServices, setIsLoadingServices] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const sections = [
    {
      id: "interieurs", label: "Intérieur", icon: HomeIcon,
      subsections: ["Rénovation", "Aménagement", "Plomberie", "Électricité", "Décoration", "Peinture"]
    },
    {
      id: "exterieurs", label: "Extérieur", icon: TreePalm,
      subsections: ["Jardinage", "Terrasse", "Piscine", "Clôture", "Toiture"]
    },
    {
      id: "constructions", label: "Construction", icon: Building,
      subsections: ["Gros œuvre", "Extension", "Maison neuve", "Garage", "Véranda"]
    },
  ];

  const currentCategory = categories[categorie];

  // Track le chargement des services
  useEffect(() => {
    if (servicesCategorie?.services) {
      servicesCategorie.services.forEach(service => {
        trackConstructionInteraction(service.id, service.libelle, 'view', {
          section: currentCategory.label
        });
      });
    }
  }, [servicesCategorie, currentCategory]);

  const fetchServicesCategorie = async (cat) => {
    // Début du chargement
    setIsLoadingServices(true);
    try {
      const response = await api.get(`/categories/name/${cat}/services`);
      console.log("Catégories de services:", response.data);
      setServicesCategorie(response.data);

      // Initialiser les index d'images pour chaque prestation
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
    } finally {
      // Fin du chargement
      setIsLoadingServices(false);
    }
  };

  // Fonction de recherche corrigée
  const search = (e) => {
    const mot = e.target.value;
    setSearchFilter(mot);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("categorie");
    const searchParam = params.get("search");

    const validIds = sections.map((s) => s.id);
    const validCategorie = validIds.includes(cat) ? cat : "interieurs";

    if (!cat || cat !== validCategorie) {
      const newParams = new URLSearchParams(location.search);
      newParams.set("categorie", validCategorie);
      navigate({ search: newParams.toString() }, { replace: true });
    }

    setCategorie(validCategorie);
    fetchServicesCategorie(categories[validCategorie].sectionId);
    
    // Appliquer le filtre de recherche si présent dans l'URL
    if (searchParam) {
      setSearchFilter(decodeURIComponent(searchParam));
    }
  }, [location.search, navigate]);

  // Filtrage des prestations basé sur la recherche et le type sélectionné
  useEffect(() => {
    const currentPrestations = servicesCategorie?.services || [];

    let filtered = currentPrestations;

    // Filtre par type
    if (selectedType !== "TOUS") {
      filtered = filtered.filter(
        (prestation) => prestation.libelle === selectedType
      );
    }

    // Filtre par recherche
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
  }, [selectedType, servicesCategorie, searchFilter, showAllPrestations]);

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
    // Track la visualisation des photos
    trackConstructionInteraction(prestation.id, prestation.libelle, 'view_photos', {
      imageCount: prestation.images?.length || 0
    });
    setPhotosModal({ isOpen: true, prestation });
  };

  const openDevisModal = (prestation) => {
    // Track la demande de devis
    trackConstructionInteraction(prestation.id, prestation.libelle, 'devis_request', {
      type: prestation.libelle,
      price: prestation.price
    });
    
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
    isAllButton = false
  }: FilterButtonProps) => {
    const baseClasses = "inline-flex items-center px-4 py-2 rounded-full text-xs border-2 transition-all duration-300";

    const selectedClasses = "bg-slate-900 text-white border-transparent shadow-lg scale-105";
    const unselectedClasses = isAllButton
      ? "bg-white text-gray-700 border-gray-300 hover:border-black hover:text-black hover:shadow-md"
      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md";

    return (
      <button
        className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );
  };

  // États pour la sélection multiple
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour basculer la sélection
  const handleToggleType = (type: string) => {
    setSelectedTypes(prev => {
      if (type === "TOUS") {
        return prev.includes("TOUS") ? [] : ["TOUS"];
      }

      if (prev.includes(type)) {
        return prev.filter(t => t !== type && t !== "TOUS");
      } else {
        const newSelection = [...prev.filter(t => t !== "TOUS"), type];
        return newSelection;
      }
    });
  };

  // Fonction pour appliquer la sélection
  const handleApplySelection = () => {
    if (selectedTypes.length === 1) {
      setSelectedType(selectedTypes[0]);
    } else if (selectedTypes.length > 1) {
      // Gérer la logique pour plusieurs sélections
      // Par exemple : setSelectedType("MULTIPLE") ou autre logique
      setSelectedType(selectedTypes[0]); // Temporaire - première sélection
    }
    setIsModalOpen(false);
  };

  // Initialiser la sélection quand le modal s'ouvre
  useEffect(() => {
    if (isModalOpen) {
      setSelectedTypes(selectedType && selectedType !== "TOUS" ? [selectedType] : []);
    }
  }, [isModalOpen, selectedType]);

  return (
    <>
      <section
        id={currentCategory.sectionId}
        className="relative min-h-screen"
      >
        <div className='absolute inset-0 -z-20 overflow-hidden h-80 w-full'>
          <div className='bg-black/50 absolute w-full h-full backdrop-blur-sm '></div>
          <img
            className='h-full w-full object-cover'
            src="https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg" alt="" />
        </div>


        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="text-center mb-0 lg:mb-12">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-100 mb-6">
              Nos Prestations
            </h1>
            <p className="text-sm lg:text-md text-gray-200 max-w-2xl mx-auto mb-8">
              Découvrez l'ensemble de nos services professionnels
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
            }}
          >
            <TabsList className="grid w-1/2 grid-cols-3 bg-white/80 backdrop-blur-sm rounded-xl h-auto mb-8">
              {sections.map((section) => (
                <TabsTrigger
                  key={section.id}
                  value={section.id}
                  className="py-3 data-[state=active]:bg-black data-[state=active]:text-white relative"
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="h-4 w-4" />
                    <span className="text-xs">{section.label}</span>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <div className="bg-white/90 backdrop-blur-md rounded-3xl px-8 py-4 mb-12 shadow-sm border border-white/20 flex flex-col gap-6">

                  {/* Section Recherche */}
                  <div className="relative flex-1 min-w-[300px] mx-auto">
                    <Input
                      placeholder="Rechercher une prestation..."
                      className="w-96 p-4 pl-12 pr-4  bg-white border-2 border-slate-800 rounded-2xl shadow-sm 
               transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
               disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchFilter}
                      onChange={search}
                      disabled={isLoadingServices}
                    />
                    <Search className="absolute top-2 left-4 transform h-5 w-5 text-slate-800" />
                  </div>

                  {/* Section Filtres par type */}
                  <div className="flex-1">
                    <div className="flex justify-center items-start gap-3 mb-3">
                      <BookCheck className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-700">
                        {section.label.toUpperCase()} :
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-hidden mx-auto justify-center ">
                      {/* Bouton TOUS */}
                      <FilterButton
                        label="TOUS"
                        isSelected={selectedType === "TOUS"}
                        onClick={() => setSelectedType("TOUS")}
                        disabled={isLoadingServices}
                        isAllButton
                      />

                      {/* Boutons des sous-sections */}
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
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold text-gray-700 mr-2 flex items-center gap-2">
              <BookCheck className="h-4 w-4" />
              LISTES :
            </span>

            {/* Bouton TOUS */}
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 transition-all duration-300 ${selectedType === "TOUS"
                ? "bg-black text-white border-transparent shadow-lg scale-105"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600 hover:shadow-md"
                } ${isLoadingServices ? "opacity-50 cursor-not-allowed" : ""}`}
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
                  ? "bg-slate-900 text-white border-transparent shadow-lg scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-slate-400 hover:text-slate-600 hover:shadow-md"
                  } ${isLoadingServices ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setSelectedType(type.libelle)}
                disabled={isLoadingServices}
              >
                {type.libelle}
              </button>
            ))}

            {/* Bouton Voir plus (si plus de 5 éléments) */}
            {servicesCategorie?.services && servicesCategorie.services.length > 5 && (
              <button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
                disabled={isLoadingServices}
              >
                <Plus className="h-4 w-4" />
                Voir plus ({servicesCategorie.services.length - 4})
              </button>
            )}
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
                {/* En-tête du modal */}
                <div className="flex items-center justify-between px-6 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <BookCheck className="h-5 w-5 text-slate-900" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Toutes les listes
                      </h3>
                      <p className="text-xs text-slate-900">
                        {servicesCategorie?.services?.length || 0} éléments disponibles
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
                        ? "bg-slate-600 text-white border-blue-500 shadow-lg"
                        : "bg-slate-800 text-slate-300 border-slate-600 hover:border-blue-400 hover:text-white"
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
                          ? "bg-blue-600 text-white border-blue-800 shadow-lg"
                          : "text-slate-900 border-slate-600 hover:border-blue-800 hover:text-blue-800"
                          }`}
                        onClick={() => handleToggleType(type.libelle)}
                      >
                        {type.libelle}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pied du modal avec sélection multiple */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
                  <div className="text-sm text-slate-400">
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
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                        }`}
                      disabled={selectedTypes.length === 0}
                    >
                      Appliquer
                    </button>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-red-700 hover:bg-red-600 transition-all duration-200"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AFFICHAGE CONDITIONNEL : SPINNER OU GRILLE DES PRESTATIONS */}
        {isLoadingServices ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
            <p className="mt-4 text-xl font-semibold text-gray-700">
              Chargement des prestations...
            </p>
          </div>
        ) : (
          <div className="sm:columns-1 md:columns-2 lg:columns-3 xl:columns-5 2xl:columns-5 mb-12">
            {displayedPrestations.map((prestation) => {
              const currentImageIndex = currentImageIndexes[prestation.id] || 0;
              const totalImages = prestation.images?.length || 0;
              const currentImage =
                prestation.images?.[currentImageIndex] ||
                "/placeholder-image.jpg";

              return (
                <Card
                  key={prestation.id}
                  className="group my-2 lg:my-4 overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-all duration-300 rounded-2xl cursor-pointer"
                >
                  <div className="relative">
                    {/* Section Image */}
                    <div
                      className="relative h-48 p-2  overflow-hidden rounded-t-2xl cursor-pointer"
                      onClick={() => openPhotosModal(prestation)}
                    >
                      <img
                        src={currentImage}
                        alt={prestation.libelle}
                        className="w-full h-full rounded-md object-cover opacity-80  transition-transform"
                      />

                      <div className="absolute top-3 left-3 bg-white/90 rounded-full px-2 py-1 text-xs font-semibold text-gray-800">
                        {prestation.libelle}
                      </div>

                      {totalImages > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            onClick={(e) => prevImage(prestation.id, totalImages, e)}
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                            onClick={(e) => nextImage(prestation.id, totalImages, e)}
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
                      <h3 className="font-semibold text-gray-900 text-sm mb-2">
                        {prestation.libelle}
                      </h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                        {prestation.description}
                      </p>

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
                          className="text-white font-medium bg-slate-900 rounded-lg text-xs hover:bg-black transition-colors duration-200 flex-1"
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
        )}

        {displayedPrestations.length === 0 && !isLoadingServices && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucune prestation trouvée pour votre recherche.
            </p>
          </div>
        )}

        <div className="flex justify-end mr-5">
          <div className="inline-flex items-center gap-3 bg-slate-900 my-5 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg animate-pulse ">
            <div className="bg-white/10 p-1.5 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                DEVIS ENVOYÉ DANS LES 48H
              </p>
              <p className="text-blue-100/80 text-xs">
                Réponse sous 2 jours ouvrés
              </p>
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