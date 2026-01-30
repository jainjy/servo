import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";

// Composants
import HeroSection from "./EntrepriseEtPro/components/HeroSection";
import ServicesGrid from "./EntrepriseEtPro/components/ServicesGrid"; // Maintenant avec filtres intégrés
import PartnersSection from "./EntrepriseEtPro/components/PartnersSection";
import ContactModal from "./EntrepriseEtPro/components/ContactModal";
import MapModal from "./EntrepriseEtPro/components/MapModal";

// Données
import { colors } from "./EntrepriseEtPro/data/colors";
import { partenaires } from "./EntrepriseEtPro/data/partnersData";
import { serviceCategories } from "./EntrepriseEtPro/data/servicesData"; // IMPORT AJOUTÉ

// Hook personnalisé
import { useEntreprise } from "./EntrepriseEtPro/hooks/useEntreprise";

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
    filteredServices,
  } = useEntreprise();

  // Track l'affichage des services
  useEffect(() => {
    if (filteredServices) {
      filteredServices.forEach((service) => {
        trackBusinessInteraction(service.id.toString(), service.nom, "view");
      });
    }
  }, [filteredServices, trackBusinessInteraction]);

  // Fonction pour suivre les interactions avec les filtres
  const handleFilterInteraction = (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>
  ) => {
    trackBusinessInteraction(id, name, action, metadata);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* <Header /> */}

      {/* Hero Section */}
      <HeroSection
        onServicesClick={() => {
          setActiveServiceCategory("all");
          trackBusinessInteraction("hero_services", "Services", "click");
        }}
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
            <span className="text-slate-900">
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

        {/* Grille des services AVEC FILTRES INTÉGRÉS */}
        <ServicesGrid
          handleServiceClick={(service) => {
            handleServiceClick(service);
            trackBusinessInteraction(
              service.id.toString(),
              service.nom,
              "service_select"
            );
          }}
          colors={colors}
          serviceCategories={serviceCategories} // Passer les catégories
          trackBusinessInteraction={handleFilterInteraction} // Passer la fonction de tracking
          initialCategory={activeServiceCategory} // Optionnel : catégorie initiale
        />

        {/* Message si aucun service (maintenant géré dans ServicesGrid) */}
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