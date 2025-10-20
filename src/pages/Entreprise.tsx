import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, ChevronRight, Users, Building2, MessageCircle, X, Send, Navigation, Clock, Shield, Target, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/layout/Footer";

const colors = {
  primary: "#0052FF",
  primaryHover: "#003EE6",
  primaryPress: "#002FC2",
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
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
    partenaire: "",
    typeAvis: "positif"
  });

  const handleContact = (partenaire) => {
    setSelectedPartenaire(partenaire);
    setShowMessageModal(true);
  };

  const handleOpenMap = () => {
    setShowMapModal(true);
  };

  const handlePartnerLocation = (partenaire) => {
    setSelectedLocation(partenaire.location);
    setShowMapModal(true);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false);
      setShowMessageModal(false);
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        message: "",
        partenaire: "",
        typeAvis: "positif"
      });
      setSelectedPartenaire(null);
      alert("Message envoyé avec succès !");
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Composant pour la carte Google Maps intégrée
  const MapComponent = ({ location }) => {
    const mapUrl = location 
      ? `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.lat},${location.lng}&zoom=15&center=${location.lat},${location.lng}`
      : `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=46.603354,1.888334&zoom=6&maptype=roadmap`;

    return (
      <div className="w-full h-96 rounded-xl overflow-hidden">
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
    <div className="min-h-screen relative">
      {/* Background Image avec overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-1"
        style={{
          backgroundColor: colors.overlay,
          backdropFilter: 'blur(1px)'
        }}
      />
      
      <div className="relative z-10">
        <Header />
        
        {/* Section 1: Solution professionnelle */}
        <motion.section 
          className="container mx-auto px-4 py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          id="solution"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h1 
              className="md:text-5xl font-bold mb-6 text-4xl text-black"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Solutions <span style={{ color: colors.primary }}> <br /> Professionnelles</span>
            </motion.h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto mb-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Des services sur mesure pour répondre aux besoins spécifiques de votre entreprise
            </motion.p>
          </motion.div>

          {/* Barre de recherche unifiée */}
          <motion.div 
            className="max-w-2xl mx-auto flex gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-1 relative">
              <Input 
                placeholder="Rechercher un service..."
                className="pl-10 pr-4 py-3 rounded-full border-2 bg-white"
                style={{ 
                  borderColor: `${colors.primary}40`,
                }}
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5" style={{ color: colors.primary }} />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="rounded-full px-8 py-3 text-white font-semibold"
                style={{ backgroundColor: colors.primary }}
                onClick={() => alert("Fonctionnalité de recherche à implémenter")}
              >
                Rechercher
              </Button>
            </motion.div>
          </motion.div>

          {/* Services professionnels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="p-8 h-full border-2 rounded-2xl bg-white text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                    <Building2 className="h-10 w-10" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Solutions Entreprise</h3>
                  <p className="text-gray-600 mb-6">Services personnalisés pour les professionnels avec accompagnement dédié et tarifs préférentiels</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Conseiller dédié</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Tarifs entreprises</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Support prioritaire</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full font-semibold rounded-xl gap-2 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Découvrir
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="p-8 h-full border-2 rounded-2xl bg-white text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                    <Users className="h-10 w-10" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Support Prioritaire</h3>
                  <p className="text-gray-600 mb-6">Accès à un conseiller dédié 7j/7 pour vos projets d'entreprise urgents</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Support 7j/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Réponse sous 2h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Expert dédié</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full font-semibold rounded-xl gap-2 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Contacter
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover="hover"
              initial="initial"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="p-8 h-full border-2 rounded-2xl bg-white text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                    <Shield className="h-10 w-10" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Services Premium</h3>
                  <p className="text-gray-600 mb-6">Des solutions avancées avec garantie étendue pour les besoins complexes</p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Garantie 5 ans</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Audit gratuit</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" style={{ color: colors.success }} />
                      <span>Solutions sur mesure</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full font-semibold rounded-xl gap-2 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    En savoir plus
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Section 2: Devenir partenaire */}
        <motion.section 
          className="container mx-auto px-4 py-20 bg-white bg-opacity-90 rounded-3xl mx-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          id="partenaire"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h1 
              className="text-5xl font-bold mb-6 text-black"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Devenir <span style={{ color: colors.primary }}>Partenaire</span>
            </motion.h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto mb-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Rejoignez notre réseau d'experts et développez votre activité
            </motion.p>
          </motion.div>

          {/* Filtres et actions */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex flex-wrap gap-4 mb-8 justify-center">
              {[
                { label: "Présentation partenaires", value: "presentation" },
                { label: "Demandes de prestations", value: "prestations" },
                { label: "Aides disponibles", value: "aides" },
              ].map((filter, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Select onValueChange={(value) => alert(`Filtre ${filter.label} sélectionné: ${value}`)}>
                    <SelectTrigger 
                      className="w-[240px] border-2 rounded-xl bg-white"
                      style={{ 
                        borderColor: `${colors.primary}40`,
                      }}
                    >
                      <SelectValue placeholder={filter.label} />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'white' }}>
                      <SelectItem value="tous">Tous les partenaires</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              ))}

              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  className="gap-2 border-2 font-semibold rounded-xl bg-white"
                  style={{ 
                    borderColor: colors.primary,
                    color: colors.primary,
                  }}
                  onClick={handleOpenMap}
                >
                  Localisation
                  <MapPin className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Grille des partenaires */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            variants={containerVariants}
          >
            {partenaires.map((partenaire) => (
              <motion.div
                key={partenaire.id}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="h-full"
                >
                  <Card 
                    className="p-2 h-full border-2 rounded-2xl overflow-hidden relative bg-white"
                    style={{ 
                      borderColor: `${colors.primary}20`,
                      boxShadow: '0 8px 32px rgba(0, 82, 255, 0.1)'
                    }}
                  >
                    {/* Badge */}
                    <motion.div 
                      className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: colors.primary }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {partenaire.badge}
                    </motion.div>

                    {/* Avatar */}
                    <motion.div 
                      className="w-full h-32 rounded-xl  flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: `${colors.primary}10` }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Building2 
                        className="h-12 w-12" 
                        style={{ color: colors.primary }}
                      />
                    </motion.div>

                    {/* Contenu */}
                    <h3 
                      className="text-lg font-bold "
                      style={{ color: colors.textPrimary }}
                    >
                      {partenaire.nom}
                    </h3>
                    
                    <p 
                      className="text-sm  leading-relaxed"
                      style={{ color: colors.textSecondary }}
                    >
                      {partenaire.description}
                    </p>

                    {/* Localisation */}
                    <motion.div 
                      className="flex items-center gap-2 cursor-pointer group"
                      onClick={() => handlePartnerLocation(partenaire)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                      <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                        {partenaire.location.address}
                      </span>
                    </motion.div>

                    {/* Stats */}
                    <div className="flex items-center justify-between  text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" style={{ color: colors.primary }} />
                          <span style={{ color: colors.textPrimary }} className="font-semibold">
                            {partenaire.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" style={{ color: colors.primary }} />
                          <span style={{ color: colors.textSecondary }}>
                            {partenaire.projets}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de contact */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full font-semibold rounded-xl gap-2 text-white"
                        style={{ 
                          backgroundColor: colors.primary,
                        }}
                        onClick={() => handleContact(partenaire)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            REJOINDRE
                            <ChevronRight className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA pour devenir partenaire */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 15px 30px ${colors.primary}20`
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="rounded-full font-bold px-8 py-4 gap-2 text-white"
                style={{ 
                  backgroundColor: colors.primary,
                }}
                onClick={() => setShowMessageModal(true)}
              >
                <MessageCircle className="h-5 w-5" />
                DEVENIR PARTENAIRE
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Section 3: Gestion de projet */}
        <motion.section 
          className="container mx-auto px-4 py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          id="gestion"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.h1 
              className="text-5xl font-bold mb-6 text-black"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Gestion de <span style={{ color: colors.primary }}>Projet</span>
            </motion.h1>
            <motion.p 
              className="text-xl max-w-2xl mx-auto mb-8 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Accompagnement de A à Z pour la réussite de vos projets
            </motion.p>
          </motion.div>

          {/* Étapes de gestion de projet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { step: "1", title: "Conception", desc: "Étude et planification de votre projet", icon: Target },
              { step: "2", title: "Expertise", desc: "Mise en relation avec les bons experts", icon: Users },
              { step: "3", title: "Réalisation", desc: "Suivi et coordination des travaux", icon: Clock },
              { step: "4", title: "Livraison", desc: "Reception et garantie de votre projet", icon: CheckCircle }
            ].map((etape, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                initial="initial"
              >
                <motion.div variants={cardHoverVariants}>
                  <Card className="p-6 text-center border-2 rounded-2xl bg-white h-full">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
                         style={{ backgroundColor: colors.primary }}>
                      <etape.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{etape.title}</h3>
                    <p className="text-gray-600">{etape.desc}</p>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Barre de recherche pour la gestion de projet */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-2xl p-8 border-2" style={{ borderColor: `${colors.primary}20` }}>
              <h3 className="text-2xl font-bold mb-6 text-center">Démarrer votre projet</h3>
              
              <div className="flex flex-wrap gap-4 mb-6 justify-center">
                {[
                  { label: "Type de projet", value: "type" },
                  { label: "Budget estimé", value: "budget" },
                  { label: "Délai souhaité", value: "delai" },
                ].map((filter, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Select onValueChange={(value) => alert(`Option ${filter.label} sélectionnée: ${value}`)}>
                      <SelectTrigger 
                        className="w-[200px] border-2 rounded-xl bg-white"
                        style={{ 
                          borderColor: `${colors.primary}40`,
                        }}
                      >
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: 'white' }}>
                        <SelectItem value="tous">Toutes options</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  className="font-bold text-white px-2 py-4 rounded-full shadow-lg border-0"
                  style={{ 
                    backgroundColor: colors.primary,
                  }}
                  onClick={() => setShowMessageModal(true)}
                >
                  <MessageCircle className="h-5 w-5 -mr-2" />
                  DEMANDER UN ACCOMPAGNEMENT
                </Button>
              </motion.div>
            </div>
          </motion.div>

        </motion.section>



      </div>

      {/* Modals (commun à toutes les sections) */}
      {showMapModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 bg-opacity-50"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={mapModalVariants}
            className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedLocation ? `Localisation - ${selectedLocation.address}` : "Carte des partenaires"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMapModal(false);
                  setSelectedLocation(null);
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
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handlePartnerLocation(partenaire)}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10` }}>
                        <Building2 className="h-5 w-5" style={{ color: colors.primary }} />
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
                      <Navigation className="h-4 w-4" style={{ color: colors.primary }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.primary}05` }}>
              <p className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" style={{ color: colors.primary }} />
                <span style={{ color: colors.textSecondary }}>
                  {selectedLocation 
                    ? "Cliquez sur les marqueurs pour voir les détails des partenaires" 
                    : "Cliquez sur un partenaire pour voir sa localisation précise"
                  }
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showMessageModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={modalVariants}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                {selectedPartenaire ? `Contacter ${selectedPartenaire.nom}` : "Envoyer un message"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMessageModal(false);
                  setSelectedPartenaire(null);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Nom complet *
                </label>
                <Input
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Email *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Téléphone
                </label>
                <Input
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder="Votre numéro"
                />
              </div>

              {!selectedPartenaire && (
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                    Partenaire concerné
                  </label>
                  <Select name="partenaire" onValueChange={(value) => setFormData({...formData, partenaire: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un partenaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {partenaires.map((p) => (
                        <SelectItem key={p.id} value={p.nom}>{p.nom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre message..."
                />
              </div>

              <Button
                type="submit"
                className="w-full font-semibold gap-2 text-white"
                style={{ backgroundColor: colors.primary }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    ENVOYER LE MESSAGE
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