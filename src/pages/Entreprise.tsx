import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

// Composants
import HeroSection from "./EntrepriseEtPro/components/HeroSection";
import ServicesGrid from "./EntrepriseEtPro/components/ServicesGrid";
import ServiceFilters from "./EntrepriseEtPro/components/ServiceFilters";
import PartnersSection from "./EntrepriseEtPro/components/PartnersSection";
import ContactModal from "./EntrepriseEtPro/components/ContactModal";
import MapModal from "./EntrepriseEtPro/components/MapModal";

// Données
import { colors } from "./EntrepriseEtPro/data/colors";
import {
  servicesEntreprisePro,
  serviceCategories,
} from "./EntrepriseEtPro/data/servicesData";
import { partenaires } from "./EntrepriseEtPro/data/partnersData";

// Hook personnalisé
import { useEntreprise } from "./EntrepriseEtPro/hooks/useEntreprise";

// Types
interface Service {
  id: number;
  nom: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  details?: string;
  color: string;
  features: string[];
}

interface Partenaire {
  id: number;
  nom: string;
  description: string;
  rating: number;
  projets: number;
  badge: string;
  badgeColor: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface FormData {
  nom: string;
  email: string;
  telephone: string;
  message: string;
  service: string;
  typeAvis: string;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const Entreprise: React.FC = () => {
  const { trackBusinessInteraction } = useInteractionTracking();

  const {
    isLoading,
    showMessageModal,
    showMapModal,
    selectedPartenaire,
    selectedLocation,
    selectedService,
    activeServiceCategory,
    searchTerm,
    formData,
    hoveredCard,
    setShowMessageModal,
    setShowMapModal,
    setSelectedPartenaire,
    setSelectedLocation,
    setSelectedService,
    setActiveServiceCategory,
    setSearchTerm,
    setFormData,
    setHoveredCard,
    handleServiceClick,
    handleContact,
    handleOpenMap,
    handlePartnerLocation,
    handleSubmitMessage,
    handleInputChange,
  } = useEntreprise();

  // Track l'affichage des services
  useEffect(() => {
    servicesEntreprisePro.forEach((service: Service) => {
      trackBusinessInteraction(service.id.toString(), service.nom, "view");
    });
  }, [trackBusinessInteraction]);

  // Filtrage des services
  const filteredServices = servicesEntreprisePro.filter((service: Service) => {
    const matchesCategory =
      activeServiceCategory === "tous" ||
      service.category === activeServiceCategory;
    const matchesSearch =
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.details &&
        service.details.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      <Header />

      {/* Hero Section */}
      <HeroSection
        onServicesClick={() => setActiveServiceCategory("tous")}
        onMapClick={handleOpenMap}
        trackBusinessInteraction={trackBusinessInteraction}
        colors={colors}
      />

      {/* Section Services Entreprise & Pro */}
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
          <h1
            className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6"
            style={{ color: colors.primaryDark }}
          >
            Services{" "}
            <span style={{ color: colors.secondaryText }}>
              Entreprise & Pro
            </span>
          </h1>
          <p
            className="text-sm lg:text-sm max-w-3xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Des solutions complètes pour chaque étape de la vie de votre
            entreprise : création, développement, transmission et optimisation.
          </p>
        </motion.div>

        {/* Filtres et recherche */}
        <ServiceFilters
          activeServiceCategory={activeServiceCategory}
          setActiveServiceCategory={setActiveServiceCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          serviceCategories={serviceCategories}
          trackBusinessInteraction={trackBusinessInteraction}
          colors={colors}
        />

        {/* Grille des services */}
        <ServicesGrid
          filteredServices={filteredServices}
          handleServiceClick={handleServiceClick}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          colors={colors}
        />

        {filteredServices.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: colors.textSecondary }}>
              Aucun service ne correspond à votre recherche. Essayez avec
              d'autres termes.
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Section Partenaires */}
      <PartnersSection
        handleContact={handleContact}
        handleOpenMap={handleOpenMap}
        handlePartnerLocation={handlePartnerLocation}
        trackBusinessInteraction={trackBusinessInteraction}
        colors={colors}
        partenaires={partenaires}
      />

      {/* Modals */}
      {showMapModal && (
        <MapModal
          selectedLocation={selectedLocation}
          partenaires={partenaires}
          handlePartnerLocation={handlePartnerLocation}
          onClose={() => {
            setShowMapModal(false);
            setSelectedLocation(null);
          }}
          colors={colors}
        />
      )}

      {showMessageModal && (
        <ContactModal
          selectedPartenaire={selectedPartenaire}
          selectedService={selectedService}
          formData={formData}
          isLoading={isLoading}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedPartenaire(null);
            setSelectedService(null);
          }}
          onSubmit={handleSubmitMessage}
          onInputChange={handleInputChange}
          colors={colors}
        />
      )}
    </div>
  );
};

export default Entreprise;
