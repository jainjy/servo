import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, ChevronRight, Users, Building2, MessageCircle, X, Send, Navigation, Clock, Shield, Target, CheckCircle, Plus, TrendingUp, Coins, Handshake, Scale, Heart, FileText, BadgeDollarSign, ClipboardList, Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";
import CreationReprise from "@/components/components/CreationReprise";
import AuditMediation from "@/components/components/AuditMediation";
import AidesLeveesFonds from "@/components/components/AideFonds";
import JuridiqueLiquidation from "@/components/components/JuridiqueLiquidation";
import PodcastsServices from "@/components/components/Podcast_services";
import { Link } from "react-router-dom";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

const colors = {
  primary: "#0f172a", // slate-900
  primaryHover: "#1e293b", // slate-800
  primaryPress: "#334155", // slate-700
  secondary: "#00C2A8",
  accent: "#FFB800",
  textPrimary: "#0A0A0A",
  textSecondary: "#5A6470",
  background: "#F6F8FA",
  card: "rgba(255, 255, 255, 0.95)",
  overlay: "rgba(255, 255, 255, 0.85)",
  success: "#16A34A",
  warning: "#D97706",
  error: "#DC2626"
};

const partenaires = [
  {
    id: 1,
    nom: "ARCHITECTES",
    description: "Conception et plans de construction",
    rating: 4.8,
    projets: 127,
    badge: "Premium",
    location: { lat: 48.8566, lng: 2.3522, address: "Paris, France" }
  },
  {
    id: 2,
    nom: "CONSTRUCTEUR",
    description: "Construction de maisons neuves",
    rating: 4.6,
    projets: 89,
    badge: "Recommandé",
    location: { lat: 45.7640, lng: 4.8357, address: "Lyon, France" }
  },
  {
    id: 3,
    nom: "ÉLECTRICIEN",
    description: "Installation et dépannage électrique",
    rating: 4.9,
    projets: 203,
    badge: "Expert",
    location: { lat: 43.7102, lng: 7.2620, address: "Nice, France" }
  },
  {
    id: 4,
    nom: "ASSURANCE",
    description: "Assurance habitation et prêt",
    rating: 4.7,
    projets: 156,
    badge: "Partenaire Or",
    location: { lat: 44.8378, lng: -0.5792, address: "Bordeaux, France" }
  },
];

// Nouvelles données pour les services d'entreprise
const servicesEntreprise = [
  {
    id: 1,
    nom: "Création d'entreprise",
    description: "Accompagnement complet pour la création de votre entreprise",
    icon: Plus,
    category: "creation",
    details: "Formalités juridiques, choix du statut, immatriculation"
  },
  {
    id: 2,
    nom: "Demande de subventions",
    description: "Aide à l'obtention de financements et subventions",
    icon: BadgeDollarSign,
    category: "financement",
    details: "Aides régionales, nationales et européennes"
  },
  {
    id: 3,
    nom: "Aides démarches administratives",
    description: "Assistance pour toutes vos démarches administratives",
    icon: ClipboardList,
    category: "administratif",
    details: "Accompagnement dans vos obligations légales"
  },
  {
    id: 4,
    nom: "Cession d'entreprise",
    description: "Conseil et accompagnement pour la cession d'entreprise",
    icon: Handshake,
    category: "transmission",
    details: "Évaluation, recherche d'acquéreurs, négociation"
  },
  {
    id: 5,
    nom: "Entreprise à reprendre",
    description: "Portfolio d'entreprises disponibles à la reprise",
    icon: Search,
    category: "transmission",
    details: "Opportunités de reprise vérifiées et qualifiées"
  },
  {
    id: 6,
    nom: "Liquidation d'entreprise",
    description: "Accompagnement dans les procédures de liquidation",
    icon: Scale,
    category: "juridique",
    details: "Procédures légales et accompagnement juridique"
  },
  {
    id: 7,
    nom: "Entreprises partenaires",
    description: "Réseau d'entreprises partenaires de la plateforme",
    icon: Users,
    category: "reseau",
    details: "Mise en relation avec nos partenaires certifiés"
  },
  {
    id: 8,
    nom: "Expertises comptables",
    description: "Services d'expertise comptable professionnelle",
    icon: FileText,
    category: "comptabilite",
    details: "Tenue de comptabilité, déclarations fiscales"
  },
  {
    id: 9,
    nom: "Commissariat aux comptes",
    description: "Audit et certification des comptes",
    icon: CheckCircle,
    category: "comptabilite",
    details: "Audit légal et certification des états financiers"
  },
  {
    id: 10,
    nom: "Service de médiation",
    description: "Résolution amiable des conflits d'entreprise",
    icon: Shield,
    category: "juridique",
    details: "Médiation commerciale et conflits internes"
  }
];

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardHoverVariants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

const mapModalVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.3
    }
  }
};

const Entreprise = () => {
  const { trackBusinessInteraction } = useInteractionTracking();
  
  // Track l'affichage des services
  useEffect(() => {
    servicesEntreprise.forEach(service => {
      trackBusinessInteraction(service.id.toString(), service.nom, 'view');
    });
  }, [trackBusinessInteraction]);

  const [isLoading, setIsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [activeServiceCategory, setActiveServiceCategory] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    service: "",
    typeAvis: "positif"
  });

  const handleServiceClick = (service) => {
    trackBusinessInteraction(service.id.toString(), service.nom, 'click', {
      category: service.category
    });
    setSelectedService(service);
    setFormData(prev => ({
      ...prev,
      service: service.nom,
      message: `Bonjour, je suis intéressé par le service "${service.nom}". ${service.details}`
    }));
    setShowMessageModal(true);
  };

  const handleContact = (partenaire) => {
    trackBusinessInteraction(partenaire.id.toString(), partenaire.nom, 'contact_request', {
      type: 'partenaire',
      rating: partenaire.rating
    });
    setSelectedPartenaire(partenaire);
    setShowMessageModal(true);
  };

  const handleOpenMap = () => {
    trackBusinessInteraction('map', 'Carte partenaires', 'open');
    setShowMapModal(true);
  };

  const handlePartnerLocation = (partenaire) => {
    trackBusinessInteraction(partenaire.id.toString(), partenaire.nom, 'location_view', {
      address: partenaire.location.address
    });
    setSelectedLocation(partenaire.location);
    setShowMapModal(true);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Tracking de l'envoi du message
    const trackingData = selectedPartenaire 
      ? {
          id: selectedPartenaire.id.toString(),
          name: selectedPartenaire.nom,
          action: 'contact_submit',
          type: 'partenaire'
        }
      : selectedService
      ? {
          id: selectedService.id.toString(),
          name: selectedService.nom,
          action: 'service_request',
          category: selectedService.category
        }
      : {
          id: 'general_contact',
          name: 'Contact général',
          action: 'general_contact'
        };

    trackBusinessInteraction(trackingData.id, trackingData.name, trackingData.action, trackingData);

    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false);
      setShowMessageModal(false);
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: "",
        service: "",
        typeAvis: "positif"
      });
      setSelectedPartenaire(null);
      setSelectedService(null);
      toast.info("Message envoyé avec succès !");
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Filtrage des services
  const filteredServices = servicesEntreprise.filter(service => {
    const matchesCategory = activeServiceCategory === "tous" || service.category === activeServiceCategory;
    const matchesSearch = service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Catégories uniques pour les filtres
  const serviceCategories = [
    { value: "tous", label: "Tous les services" },
    { value: "creation", label: "Création" },
    { value: "financement", label: "Financement" },
    { value: "administratif", label: "Administratif" },
    { value: "transmission", label: "Transmission" },
    { value: "juridique", label: "Juridique" },
    { value: "comptabilite", label: "Comptabilité" },
    { value: "reseau", label: "Réseau" }
  ];

  // Composant pour la carte Google Maps intégrée
  const MapComponent = ({ location }) => {
    const mapUrl = location
      ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.lat},${location.lng}&zoom=15&center=${location.lat},${location.lng}`
      : `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=46.603354,1.888334&zoom=6&maptype=roadmap`;

    return (
      <div className="w-full h-96 rounded-xl overflow-hidden border border-slate-200">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl.replace('YOUR_API_KEY', 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8')}
          allowFullScreen
          title="Carte des partenaires"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Hero Section avec background image */}
      <section className="relative py-8 pt-24 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-xl lg:text-5xl md:text-6xl font-bold mb-6 text-white">
              Solutions <span className="text-blue-400">Professionnelles</span>
            </h1>
            <p className="text-sm lg:text-xl text-slate-200 mb-10 leading-relaxed">
              Des services sur mesure pour répondre aux besoins spécifiques de
              votre entreprise. Accompagnement personnalisé de A à Z.
            </p>

            <div className="flex flex-wrap gap-2 lg:gap-5 justify-center">
              <motion.div>
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-slate-700 hover:border-slate-600 transition-all duration-300"
                  onClick={() => {
                    trackBusinessInteraction('services_section', 'Services', 'navigate');
                    setActiveServiceCategory("tous");
                  }}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <a href="#services">
                    Découvrir nos services
                  </a>
                </Button>
              </motion.div>

              <motion.div>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-5 text-lg font-semibold border-2 border-blue-500 hover:border-blue-400 transition-all duration-300"
                  onClick={handleOpenMap}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  <a href="#partenaire">
                    Voir nos partenaires
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Services d'entreprise */}
      <motion.section
        className="container mx-auto px-4 py-8 lg:py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="services"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-0 lg:mb-8"
        >
          <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6 text-slate-900">
            Services <span className="text-slate-900">d'Entreprise</span>
          </h1>
          <p className="text-sm lg:text-sm text-slate-600 max-w-2xl mx-auto mb-8">
            Tous les services essentiels pour le développement et la gestion de
            votre entreprise
          </p>
        </motion.div>

        {/* Barre de recherche unifiée */}
        <motion.div
          className="max-w-2xl mx-auto grid place-items-center lg:flex gap-4 mb-8 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex-1 relative">
            <Input
              placeholder="Rechercher un service..."
              className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-300 bg-white focus:border-slate-900 transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          </div>
          <motion.div>
            <Button 
              className="rounded-xl px-8 py-3 text-white font-semibold bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300"
              onClick={() => {
                trackBusinessInteraction('search', 'Recherche services', 'search', {
                  term: searchTerm,
                  category: activeServiceCategory
                });
              }}
            >
              Rechercher
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Filtres des services */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-3 place-items-center lg:flex flex-wrap gap-3 mb-4 lg:mb-8 justify-center">
            {serviceCategories.map((category, index) => (
              <motion.div key={index}>
                <Button
                  variant={
                    activeServiceCategory === category.value
                      ? "default"
                      : "outline"
                  }
                  className={`rounded-xl font-semibold px-4 lg:px-6 py-3 ${activeServiceCategory === category.value
                    ? "text-white"
                    : "border-2 border-slate-300 text-slate-700 hover:border-slate-900 hover:text-slate-900"
                    }`}
                  style={{
                    backgroundColor:
                      activeServiceCategory === category.value
                        ? colors.primary
                        : "transparent",
                  }}
                  onClick={() => {
                    trackBusinessInteraction('filter_category', category.label, 'filter_select', {
                      category: category.value
                    });
                    setActiveServiceCategory(category.value);
                  }}
                >
                  {category.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Grille des services */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
        >
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card
                  className="p-8 h-full border border-slate-200 rounded-2xl bg-white cursor-pointer hover:shadow-2xl transition-all duration-500 group"
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Icône du service */}
                  <motion.div
                    className="w-16 h-16 mb-6 rounded-xl mx-auto flex items-center justify-center bg-slate-100 group-hover:bg-slate-900 transition-colors duration-300"
                  >
                    <service.icon className="h-8 w-8 text-slate-600  group-hover:text-white transition-colors duration-300" />
                  </motion.div>

                  {/* Contenu */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {service.nom}
                  </h3>

                  <p className="text-slate-600 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <p className="text-sm text-slate-500 mb-6">
                    {service.details}
                  </p>

                  {/* Bouton d'action */}
                  <motion.div>
                    <Button
                      className="w-full font-semibold rounded-xl gap-3 py-4 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
                      variant="outline"
                    >
                      En savoir plus
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {filteredServices.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-500 text-lg">
              Aucun service trouvé pour votre recherche.
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Section Devenir partenaire */}
      <motion.section
        className="py-0 lg:py-8 bg-slate-50"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="partenaire"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-4 lg:mb-8"
          >
            <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6 text-slate-900">
              Devenir <span className="text-slate-900">Partenaire</span>
            </h1>
            <p className="text-sm lg:text-sm text-slate-600 max-w-2xl mx-auto mb-4 lg:mb-8">
              Rejoignez notre réseau d'experts et développez votre activité
            </p>
          </motion.div>

          {/* Filtres et actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {[
                { label: "Présentation partenaires", value: "presentation" },
                { label: "Demandes de prestations", value: "prestations" },
                { label: "Aides disponibles", value: "aides" },
              ].map((filter, index) => (
                <motion.div key={index}>
                  <Select
                    onValueChange={(value) => {
                      trackBusinessInteraction('partner_filter', filter.label, 'filter_select', {
                        filter: filter.value,
                        value: value
                      });
                      toast.info(`Filtre ${filter.label} sélectionné: ${value}`);
                    }}
                  >
                    <SelectTrigger className="w-[240px] border-2 border-slate-300 rounded-xl bg-white focus:border-slate-900">
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="tous">Tous les partenaires</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              ))}

              <motion.div>
                <Button
                  variant="outline"
                  className="gap-2 border-2 border-slate-900 text-slate-900 font-semibold rounded-xl bg-white hover:bg-slate-900 hover:text-white transition-all duration-300 px-6 py-3"
                  onClick={handleOpenMap}
                >
                  Localisation
                  <MapPin className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Grille des partenaires avec images spécifiques */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            variants={containerVariants}
          >
            {/* Architectes */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card className="p-6 h-full border border-slate-200 rounded-2xl overflow-hidden relative bg-white hover:shadow-2xl transition-all duration-500 group">
                  {/* Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 text-white bg-orange-700"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Premium
                  </motion.div>

                  {/* Image spécifique pour Architectes */}
                  <motion.div
                    className="w-full h-32 rounded-xl bg-slate-100 relative overflow-hidden group-hover:bg-slate-900 transition-colors duration-300"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                      alt="Architectes - Conception et plans"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/40 transition-colors duration-300" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      ARCHITECTES
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                      Conception et plans de construction
                    </p>

                    {/* Localisation */}
                    <motion.div
                      className="flex items-center gap-2 cursor-pointer group mb-4"
                      onClick={() => handlePartnerLocation(partenaires[0])}
                    >
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        Paris, France
                      </span>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-slate-900">
                            4.8
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-600">127 projets</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de contact */}
                    <motion.div>
                      <Button
                        className="w-full font-semibold rounded-xl gap-2 text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 py-3"
                        onClick={() => handleContact(partenaires[0])}
                      >
                        REJOINDRE
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Constructeur */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card className="p-6 h-full border border-slate-200 rounded-2xl overflow-hidden relative bg-white hover:shadow-2xl transition-all duration-500 group">
                  {/* Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 text-white bg-slate-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Recommandé
                  </motion.div>

                  {/* Image spécifique pour Constructeur */}
                  <motion.div
                    className="w-full h-32 rounded-xl bg-slate-100 relative overflow-hidden group-hover:bg-slate-900 transition-colors duration-300"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                      alt="Constructeur - Maisons neuves"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-orange-900/20 group-hover:bg-orange-900/40 transition-colors duration-300" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      CONSTRUCTEUR
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                      Construction de maisons neuves
                    </p>

                    {/* Localisation */}
                    <motion.div
                      className="flex items-center gap-2 cursor-pointer group mb-4"
                      onClick={() => handlePartnerLocation(partenaires[1])}
                    >
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        Lyon, France
                      </span>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-slate-900">
                            4.6
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-600">89 projets</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de contact */}
                    <motion.div>
                      <Button
                        className="w-full font-semibold rounded-xl gap-2 text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 py-3"
                        onClick={() => handleContact(partenaires[1])}
                      >
                        REJOINDRE
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Électricien */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card className="p-6 h-full border border-slate-200 rounded-2xl overflow-hidden relative bg-white hover:shadow-2xl transition-all duration-500 group">
                  {/* Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 text-white bg-slate-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Expert
                  </motion.div>

                  {/* Image spécifique pour Électricien */}
                  <motion.div
                    className="w-full h-32 rounded-xl bg-slate-100 relative overflow-hidden group-hover:bg-slate-900 transition-colors duration-300"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                      alt="Électricien - Installation électrique"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-yellow-900/20 group-hover:bg-yellow-900/40 transition-colors duration-300" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      ÉLECTRICIEN
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                      Installation et dépannage électrique
                    </p>

                    {/* Localisation */}
                    <motion.div
                      className="flex items-center gap-2 cursor-pointer group mb-4"
                      onClick={() => handlePartnerLocation(partenaires[2])}
                    >
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        Nice, France
                      </span>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-slate-900">
                            4.9
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-600">203 projets</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de contact */}
                    <motion.div>
                      <Button
                        className="w-full font-semibold rounded-xl gap-2 text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 py-3"
                        onClick={() => handleContact(partenaires[2])}
                      >
                        REJOINDRE
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Assurance */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants} className="h-full">
                <Card className="p-6 h-full border border-slate-200 rounded-2xl overflow-hidden relative bg-white hover:shadow-2xl transition-all duration-500 group">
                  {/* Badge */}
                  <motion.div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10 text-white bg-slate-900"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Partenaire Or
                  </motion.div>

                  {/* Image spécifique pour Assurance */}
                  <motion.div
                    className="w-full h-32 rounded-xl bg-slate-100 relative overflow-hidden group-hover:bg-slate-900 transition-colors duration-300"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                      alt="Assurance - Protection habitation"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-green-900/20 group-hover:bg-green-900/40 transition-colors duration-300" />
                  </motion.div>

                  {/* Contenu */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      ASSURANCE
                    </h3>

                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                      Assurance habitation et prêt
                    </p>

                    {/* Localisation */}
                    <motion.div
                      className="flex items-center gap-2 cursor-pointer group mb-4"
                      onClick={() => handlePartnerLocation(partenaires[3])}
                    >
                      <MapPin className="h-4 w-4 text-slate-600" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                        Bordeaux, France
                      </span>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-slate-900">
                            4.7
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-600" />
                          <span className="text-slate-600">156 projets</span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de contact */}
                    <motion.div>
                      <Button
                        className="w-full font-semibold rounded-xl gap-2 text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 py-3"
                        onClick={() => handleContact(partenaires[3])}
                      >
                        REJOINDRE
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Section Avantages partenariat avec images spécifiques */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12 text-slate-900">
              Avantages du partenariat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Visibilité accrue */}
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                    alt="Visibilité accrue - Analytics et données"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  Visibilité accrue
                </h3>
                <p className="text-slate-600">
                  Bénéficiez d'une exposition privilégiée auprès de notre
                  communauté
                </p>
              </motion.div>

              {/* Opportunités business */}
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                    alt="Opportunités business - Réunion d'affaires"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  Opportunités business
                </h3>
                <p className="text-slate-600">
                  Accédez à de nouveaux marchés et développez votre chiffre
                  d'affaires
                </p>
              </motion.div>

              {/* Support dédié */}
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-full h-48 mb-6 rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80&w=400&h=200&fit=crop"
                    alt="Support dédié - Assistance client"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  Support dédié
                </h3>
                <p className="text-slate-600">
                  Un accompagnement personnalisé pour maximiser votre réussite
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA pour devenir partenaire */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-12 py-6 text-lg font-semibold border-2 border-slate-900 hover:border-slate-800 transition-all duration-300"
                onClick={() => {
                  trackBusinessInteraction('become_partner', 'Devenir partenaire', 'cta_click');
                  setShowMessageModal(true);
                }}
              >
                <Handshake className="h-6 w-6 mr-3" />
                Devenir Partenaire
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Final Section */}
      <section className="py-8 lg:py-20 bg-white shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-6 text-slate-900">
              Prêt à développer votre entreprise ?
            </h2>
            <p className="text-sm text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Nos experts sont à votre écoute pour vous accompagner dans tous
              vos projets d'entreprise
            </p>
            <motion.div>
              <Button
                className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-10 py-5 text-lg font-semibold border-2 border-white hover:border-slate-100 transition-all duration-300"
                onClick={() => {
                  trackBusinessInteraction('general_contact', 'Contact général', 'cta_click');
                  setShowMessageModal(true);
                }}
              >
                <MessageCircle className="h-5 w-5 mr-3" />
                Contactez-nous
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {showMapModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={mapModalVariants}
            className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedLocation
                  ? `Localisation - ${selectedLocation.address}`
                  : "Carte des partenaires"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedLocation(null);
                }}
                className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <MapComponent location={selectedLocation} />

            {!selectedLocation && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">
                  Nos partenaires sur la carte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partenaires.map((partenaire) => (
                    <motion.div
                      key={partenaire.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePartnerLocation(partenaire)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100">
                        <Building2 className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {partenaire.nom}
                        </p>
                        <p className="text-sm flex items-center gap-1 text-slate-600">
                          <MapPin className="h-3 w-3" />
                          {partenaire.location.address}
                        </p>
                      </div>
                      <Navigation className="h-4 w-4 text-slate-600" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-600" />
                {selectedLocation
                  ? "Cliquez sur les marqueurs pour voir les détails des partenaires"
                  : "Cliquez sur un partenaire pour voir sa localisation précise"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showMessageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalVariants}
            className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedPartenaire
                  ? `Contacter ${selectedPartenaire.nom}`
                  : selectedService
                    ? `Demander ${selectedService.nom}`
                    : "Envoyer un message"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedPartenaire(null);
                  setSelectedService(null);
                }}
                className="h-10 w-10 p-0 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border-slate-300 focus:border-slate-900"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border-slate-300 focus:border-slate-900"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">
                  Téléphone
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-slate-300 focus:border-slate-900"
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-slate-900">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 resize-none"
                  placeholder={
                    selectedService
                      ? `Je souhaite en savoir plus sur ${selectedService.nom}...`
                      : selectedPartenaire
                        ? `Je souhaite rejoindre ${selectedPartenaire.nom}...`
                        : "Votre message..."
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold gap-2 text-white bg-slate-900 hover:bg-slate-800 border-2 border-slate-900 hover:border-slate-800 transition-all duration-300 py-4 rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {selectedService
                      ? "DEMANDER LE SERVICE"
                      : "ENVOYER LE MESSAGE"}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Entreprise;