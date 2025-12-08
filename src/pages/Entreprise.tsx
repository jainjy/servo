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
import PodcastsServices from "@/components/Podcast_services";
import { Link } from "react-router-dom";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

// Palette de couleurs basée sur vos spécifications exactes
const colors = {
  logo: "#556B2F",           /* logo / accent - Olive green */
  primaryDark: "#6B8E23",    /* Sruvol / fonds légers - Yellow-green */
  lightBg: "#FFFFF0",        /* fond de page / bloc texte - White */
  separator: "#D3D3D3",      /* séparateurs / bordures, UI - Light gray */
  secondaryText: "#8B4513",  /* touche premium / titres secondaires - Saddle brown */
  
  // Couleurs supplémentaires pour compléter la palette
  primaryLight: "#8FBC8F",   // Version plus claire du primary
  secondaryLight: "#A0522D", // Version plus claire du secondary
  cardBg: "#FFFFFF",         // Blanc pur pour les cartes
  textPrimary: "#2C3E50",    // Texte principal foncé
  textSecondary: "#5D6D7E",  // Texte secondaire
  success: "#27AE60",        // Vert pour succès
  warning: "#F39C12",        // Orange pour avertissements
  error: "#E74C3C",          // Rouge pour erreurs
  accentGold: "#D4AF37",     // Or pour éléments premium
};

const partenaires = [
  {
    id: 1,
    nom: "ARCHITECTES",
    description: "Conception et plans de construction",
    rating: 4.8,
    projets: 127,
    badge: "Premium",
    badgeColor: "#D4AF37", // Gold
    location: { lat: 48.8566, lng: 2.3522, address: "Paris, France" }
  },
  {
    id: 2,
    nom: "CONSTRUCTEUR",
    description: "Construction de maisons neuves",
    rating: 4.6,
    projets: 89,
    badge: "Recommandé",
    badgeColor: "#6B8E23", // primaryDark (Sruvol)
    location: { lat: 45.7640, lng: 4.8357, address: "Lyon, France" }
  },
  {
    id: 3,
    nom: "ÉLECTRICIEN",
    description: "Installation et dépannage électrique",
    rating: 4.9,
    projets: 203,
    badge: "Expert",
    badgeColor: "#8B4513", // secondaryText (Saddle brown)
    location: { lat: 43.7102, lng: 7.2620, address: "Nice, France" }
  },
  {
    id: 4,
    nom: "ASSURANCE",
    description: "Assurance habitation et prêt",
    rating: 4.7,
    projets: 156,
    badge: "Partenaire Or",
    badgeColor: "#D4AF37", // Gold
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
    details: "Formalités juridiques, choix du statut, immatriculation",
    color: "#6B8E23" // primaryDark
  },
  {
    id: 2,
    nom: "Demande de subventions",
    description: "Aide à l'obtention de financements et subventions",
    icon: BadgeDollarSign,
    category: "financement",
    details: "Aides régionales, nationales et européennes",
    color: "#27AE60" // success
  },
  {
    id: 3,
    nom: "Aides démarches administratives",
    description: "Assistance pour toutes vos démarches administratives",
    icon: ClipboardList,
    category: "administratif",
    details: "Accompagnement dans vos obligations légales",
    color: "#556B2F" // logo
  },
  {
    id: 4,
    nom: "Cession d'entreprise",
    description: "Conseil et accompagnement pour la cession d'entreprise",
    icon: Handshake,
    category: "transmission",
    details: "Évaluation, recherche d'acquéreurs, négociation",
    color: "#8B4513" // secondaryText
  },
  {
    id: 5,
    nom: "Entreprise à reprendre",
    description: "Portfolio d'entreprises disponibles à la reprise",
    icon: Search,
    category: "transmission",
    details: "Opportunités de reprise vérifiées et qualifiées",
    color: "#A0522D" // secondaryLight
  },
  {
    id: 6,
    nom: "Liquidation d'entreprise",
    description: "Accompagnement dans les procédures de liquidation",
    icon: Scale,
    category: "juridique",
    details: "Procédures légales et accompagnement juridique",
    color: "#F39C12" // warning
  },
  {
    id: 7,
    nom: "Entreprises partenaires",
    description: "Réseau d'entreprises partenaires de la plateforme",
    icon: Users,
    category: "reseau",
    details: "Mise en relation avec nos partenaires certifiés",
    color: "#556B2F" // logo
  },
  {
    id: 8,
    nom: "Expertises comptables",
    description: "Services d'expertise comptable professionnelle",
    icon: FileText,
    category: "comptabilite",
    details: "Tenue de comptabilité, déclarations fiscales",
    color: "#2C3E50" // textPrimary
  },
  {
    id: 9,
    nom: "Commissariat aux comptes",
    description: "Audit et certification des comptes",
    icon: CheckCircle,
    category: "comptabilite",
    details: "Audit légal et certification des états financiers",
    color: "#27AE60" // success
  },
  {
    id: 10,
    nom: "Service de médiation",
    description: "Résolution amiable des conflits d'entreprise",
    icon: Shield,
    category: "juridique",
    details: "Médiation commerciale et conflits internes",
    color: "#F39C12" // warning
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
    { value: "tous", label: "Tous les services", color: "#6B8E23" }, // primaryDark
    { value: "creation", label: "Création", color: "#6B8E23" }, // primaryDark
    { value: "financement", label: "Financement", color: "#27AE60" }, // success
    { value: "administratif", label: "Administratif", color: "#556B2F" }, // logo
    { value: "transmission", label: "Transmission", color: "#8B4513" }, // secondaryText
    { value: "juridique", label: "Juridique", color: "#F39C12" }, // warning
    { value: "comptabilite", label: "Comptabilité", color: "#2C3E50" }, // textPrimary
    { value: "reseau", label: "Réseau", color: "#556B2F" } // logo
  ];

  // Composant pour la carte Google Maps intégrée
  const MapComponent = ({ location }) => {
    const mapUrl = location
      ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.lat},${location.lng}&zoom=15&center=${location.lat},${location.lng}`
      : `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=46.603354,1.888334&zoom=6&maptype=roadmap`;

    return (
      <div className="w-full h-96 rounded-xl overflow-hidden border" style={{ borderColor: colors.separator }}>
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
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      <Header />

      {/* Hero Section avec background image */}
      <section className="relative py-8 pt-24 lg:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(107, 142, 35, 0.9), rgba(107, 142, 35, 0.8)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
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
              Solutions <span style={{ color: colors.lightBg }}>Professionnelles</span>
            </h1>
            <p className="text-sm lg:text-xl" style={{ color: colors.lightBg, opacity: 0.9 }}> 
              Des services sur mesure pour répondre aux besoins spécifiques de
              votre entreprise. Accompagnement personnalisé de A à Z.
            </p>

            <div className="flex flex-wrap gap-2 lg:gap-5 justify-center mt-10">
              {/* BOUTON 1 - Utilise #6B8E23 (primaryDark/Sruvol) */}
              <motion.div>
                <Button
                  className="rounded-xl px-8 py-5 text-lg font-semibold border-2 transition-all duration-300"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                    borderColor: colors.primaryDark
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryLight;
                    e.currentTarget.style.borderColor = colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.borderColor = colors.primaryDark;
                  }}
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

              {/* BOUTON 2 - Utilise #6B8E23 (primaryDark/Sruvol) */}
              <motion.div>
                <Button
                  className="rounded-xl px-8 py-5 text-lg font-semibold border-2 transition-all duration-300"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                    borderColor: colors.primaryDark
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryLight;
                    e.currentTarget.style.borderColor = colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.borderColor = colors.primaryDark;
                  }}
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
          <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6" style={{ color: colors.primaryDark }}>
            Services <span style={{ color: colors.secondaryText }}>d'Entreprise</span>
          </h1>
          <p className="text-sm lg:text-sm" style={{ color: colors.textSecondary }}>
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
              className="pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all duration-300"
              style={{
                borderColor: colors.separator,
                backgroundColor: colors.cardBg
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5" style={{ color: colors.textSecondary }} />
          </div>
          {/* BOUTON RECHERCHE - Utilise #6B8E23 */}
          <motion.div>
            <Button 
              className="rounded-xl px-8 py-3 font-semibold border-2 transition-all duration-300"
              style={{
                backgroundColor: colors.primaryDark,
                color: colors.lightBg,
                borderColor: colors.primaryDark
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryLight;
                e.currentTarget.style.borderColor = colors.primaryLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.borderColor = colors.primaryDark;
              }}
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
                  variant={activeServiceCategory === category.value ? "default" : "outline"}
                  className="rounded-xl font-semibold px-4 lg:px-6 py-3 transition-all duration-300"
                  style={activeServiceCategory === category.value ? {
                    backgroundColor: colors.primaryDark, // TOUS LES FILTRES ACTIFS utilisent #6B8E23
                    color: colors.lightBg,
                    borderColor: colors.primaryDark
                  } : {
                    borderColor: colors.separator,
                    color: colors.textPrimary,
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeServiceCategory !== category.value) {
                      e.currentTarget.style.borderColor = colors.primaryDark;
                      e.currentTarget.style.color = colors.primaryDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeServiceCategory !== category.value) {
                      e.currentTarget.style.borderColor = colors.separator;
                      e.currentTarget.style.color = colors.textPrimary;
                    }
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
                  className="p-8 h-full rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-500 group"
                  style={{
                    borderColor: colors.separator,
                    backgroundColor: colors.cardBg
                  }}
                  onClick={() => handleServiceClick(service)}
                >
                  {/* Icône du service */}
                  <motion.div
                    className="w-16 h-16 mb-6 rounded-xl mx-auto flex items-center justify-center transition-colors duration-300"
                    style={{
                      backgroundColor: `${service.color}15`
                    }}
                  >
                    <service.icon className="h-8 w-8 transition-colors duration-300" style={{ color: service.color }} />
                  </motion.div>

                  {/* Contenu */}
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                    {service.nom}
                  </h3>

                  <p className="leading-relaxed mb-4" style={{ color: colors.textSecondary }}>
                    {service.description}
                  </p>

                  <p className="text-sm mb-6" style={{ color: colors.textSecondary, opacity: 0.8 }}>
                    {service.details}
                  </p>

                  {/* BOUTON D'ACTION - Utilise #6B8E23 */}
                  <motion.div>
                    <Button
                      className="w-full font-semibold rounded-xl gap-3 py-4 border-2 transition-all duration-300"
                      variant="outline"
                      style={{
                        borderColor: colors.primaryDark,
                        color: colors.primaryDark,
                        backgroundColor: 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.primaryDark;
                        e.currentTarget.style.color = colors.lightBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = colors.primaryDark;
                      }}
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
            <p style={{ color: colors.textSecondary }}>
              Aucun service trouvé pour votre recherche.
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Section Devenir partenaire */}
      <motion.section
        className="py-0 lg:py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        id="partenaire"
        style={{ backgroundColor: colors.lightBg }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={itemVariants}
            className="text-center mb-4 lg:mb-8"
          >
            <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6" style={{ color: colors.primaryDark }}>
              Devenir <span style={{ color: colors.secondaryText }}>Partenaire</span>
            </h1>
            <p className="text-sm lg:text-sm max-w-2xl mx-auto mb-4 lg:mb-8" style={{ color: colors.textSecondary }}>
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
                    <SelectTrigger className="w-[240px] border-2 rounded-xl bg-white">
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

              {/* BOUTON LOCALISATION - Utilise #6B8E23 */}
              <motion.div>
                <Button
                  variant="outline"
                  className="gap-2 border-2 font-semibold rounded-xl bg-white transition-all duration-300 px-6 py-3"
                  style={{
                    borderColor: colors.primaryDark,
                    color: colors.primaryDark
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primaryDark;
                    e.currentTarget.style.color = colors.lightBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.cardBg;
                    e.currentTarget.style.color = colors.primaryDark;
                  }}
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
            {partenaires.map((partenaire) => (
              <motion.div
                key={partenaire.id}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div variants={cardHoverVariants} className="h-full">
                  <Card className="p-6 h-full rounded-2xl overflow-hidden relative hover:shadow-2xl transition-all duration-500 group"
                    style={{
                      borderColor: colors.separator,
                      backgroundColor: colors.cardBg
                    }}
                  >
                    {/* Badge */}
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10"
                      style={{
                        backgroundColor: partenaire.badgeColor,
                        color: colors.lightBg
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {partenaire.badge}
                    </motion.div>

                    {/* Image spécifique */}
                    <motion.div
                      className="w-full h-32 rounded-xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30 group-hover:to-black/50 transition-colors duration-300" />
                    </motion.div>

                    {/* Contenu */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                        {partenaire.nom}
                      </h3>

                      <p className="leading-relaxed text-sm mb-4" style={{ color: colors.textSecondary }}>
                        {partenaire.description}
                      </p>

                      {/* Localisation */}
                      <motion.div
                        className="flex items-center gap-2 cursor-pointer group mb-4"
                        onClick={() => handlePartnerLocation(partenaire)}
                      >
                        <MapPin className="h-4 w-4" style={{ color: colors.textSecondary }} />
                        <span className="text-sm transition-colors" style={{ color: colors.textSecondary }}>
                          {partenaire.location.address}
                        </span>
                      </motion.div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" style={{ color: colors.warning }} />
                            <span className="font-semibold" style={{ color: colors.textPrimary }}>
                              {partenaire.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" style={{ color: colors.textSecondary }} />
                            <span style={{ color: colors.textSecondary }}>{partenaire.projets} projets</span>
                          </div>
                        </div>
                      </div>

                      {/* BOUTON DE CONTACT - Utilise #6B8E23 */}
                      <motion.div>
                        <Button
                          className="w-full font-semibold rounded-xl gap-2 border-2 transition-all duration-300 py-3"
                          style={{
                            backgroundColor: colors.primaryDark,
                            color: colors.lightBg,
                            borderColor: colors.primaryDark
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryLight;
                            e.currentTarget.style.borderColor = colors.primaryLight;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = colors.primaryDark;
                            e.currentTarget.style.borderColor = colors.primaryDark;
                          }}
                          onClick={() => handleContact(partenaire)}
                        >
                          REJOINDRE
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Section Avantages partenariat */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12" style={{ color: colors.primaryDark }}>
              Avantages du partenariat
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Visibilité accrue */}
              <motion.div
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.separator}`
                }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primaryDark}15` }}>
                  <TrendingUp className="h-8 w-8" style={{ color: colors.primaryDark }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  Visibilité accrue
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Bénéficiez d'une exposition privilégiée auprès de notre communauté
                </p>
              </motion.div>

              {/* Opportunités business */}
              <motion.div
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.separator}`
                }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.secondaryText}15` }}>
                  <Coins className="h-8 w-8" style={{ color: colors.secondaryText }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  Opportunités business
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Accédez à de nouveaux marchés et développez votre chiffre d'affaires
                </p>
              </motion.div>

              {/* Support dédié */}
              <motion.div
                className="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.separator}`
                }}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${colors.logo}15` }}>
                  <Shield className="h-8 w-8" style={{ color: colors.logo }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
                  Support dédié
                </h3>
                <p style={{ color: colors.textSecondary }}>
                  Un accompagnement personnalisé pour maximiser votre réussite
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* CTA pour devenir partenaire - Utilise #6B8E23 */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div>
              <Button
                className="rounded-xl px-12 py-6 text-lg font-semibold border-2 transition-all duration-300"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryLight;
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
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
      <section className="py-8 lg:py-20 shadow-inner"
        style={{ backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl lg:text-4xl font-bold mb-6" style={{ color: colors.primaryDark }}>
              Prêt à développer votre entreprise ?
            </h2>
            <p className="text-sm mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: colors.textSecondary }}>
              Nos experts sont à votre écoute pour vous accompagner dans tous
              vos projets d'entreprise
            </p>
            {/* BOUTON FINAL - Utilise #6B8E23 */}
            <motion.div>
              <Button
                className="rounded-xl px-10 py-5 text-lg font-semibold border-2 transition-all duration-300"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryLight;
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={mapModalVariants}
            className="rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.separator}`
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
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
                className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
                style={{
                  color: colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <MapComponent location={selectedLocation} />

            {!selectedLocation && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                  Nos partenaires sur la carte
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partenaires.map((partenaire) => (
                    <motion.div
                      key={partenaire.id}
                      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                      style={{
                        border: `1px solid ${colors.separator}`,
                        color: colors.textPrimary
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${colors.primaryDark}10`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePartnerLocation(partenaire)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primaryDark}15` }}>
                        <Building2 className="h-5 w-5" style={{ color: colors.primaryDark }} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: colors.textPrimary }}>
                          {partenaire.nom}
                        </p>
                        <p className="text-sm flex items-center gap-1" style={{ color: colors.textSecondary }}>
                          <MapPin className="h-3 w-3" />
                          {partenaire.location.address}
                        </p>
                      </div>
                      <Navigation className="h-4 w-4" style={{ color: colors.textSecondary }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg" style={{
              backgroundColor: `${colors.primaryDark}08`,
              border: `1px solid ${colors.separator}`
            }}>
              <p className="text-sm flex items-center gap-2" style={{ color: colors.textSecondary }}>
                <MapPin className="h-4 w-4" style={{ color: colors.primaryDark }} />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalVariants}
            className="rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.separator}`
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
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
                className="h-10 w-10 p-0 rounded-xl transition-all duration-300"
                style={{
                  color: colors.textSecondary
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryDark}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Téléphone
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full rounded-xl"
                  style={{
                    borderColor: colors.separator
                  }}
                  placeholder="Votre numéro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3" style={{ color: colors.textPrimary }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl resize-none transition-all duration-300"
                  style={{
                    border: `1px solid ${colors.separator}`,
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.primaryDark;
                    e.target.style.boxShadow = `0 0 0 2px ${colors.primaryDark}20`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.separator;
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder={
                    selectedService
                      ? `Je souhaite en savoir plus sur ${selectedService.nom}...`
                      : selectedPartenaire
                        ? `Je souhaite rejoindre ${selectedPartenaire.nom}...`
                        : "Votre message..."
                  }
                />
              </div>

              {/* BOUTON ENVOYER - Utilise #6B8E23 */}
              <Button
                type="submit"
                className="w-full font-semibold gap-2 border-2 transition-all duration-300 py-4 rounded-xl"
                style={{
                  backgroundColor: colors.primaryDark,
                  color: colors.lightBg,
                  borderColor: colors.primaryDark
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryLight;
                  e.currentTarget.style.borderColor = colors.primaryLight;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.primaryDark;
                  e.currentTarget.style.borderColor = colors.primaryDark;
                }}
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
                    className="w-4 h-4 border-2 rounded-full"
                    style={{
                      borderColor: colors.lightBg,
                      borderTopColor: 'transparent'
                    }}
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