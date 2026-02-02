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


const DevenirPartenaire: React.FC = () => {
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

            <div className="relative pt-16 mb-2">
                <div
                    className="absolute inset-0 bg-cover bg-center overflow-hidden"
                    style={{
                        backgroundImage:
                            'url("https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg")',
                    }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                </div>

                <div className="relative text-center py-10 px-0">
                    <h1 className="text-3xl md:text-5xl font-medium uppercase text-white mb-4 drop-shadow-lg">
                        Devenir partenaire
                    </h1>
                    <p className="text-sm md:text-md text-gray-100 max-w-3xl mx-auto drop-shadow-md">
                        Votre projet rencontre notre savoir-faire : donnons naissance à une réussite.
                    </p>
                </div>
            </div>

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

export default DevenirPartenaire;