import { useState } from "react";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";
import { toast } from "sonner";
import { serviceCategories } from "../data/servicesData";
import { partenaires } from "../data/partnersData"; // Ajouté

export const useEntreprise = () => {
  const { trackBusinessInteraction } = useInteractionTracking();
  
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
    typeAvis: "positif",
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleServiceClick = (service) => {
    trackBusinessInteraction(service.id.toString(), service.nom, "click", {
      category: service.category,
    });
    setSelectedService(service);
    setFormData((prev) => ({
      ...prev,
      service: service.nom,
      message: `Bonjour,\n\nJe suis intéressé par le service "${
        service.nom
      }".\n\nPouvez-vous me renseigner sur :\n${service.features
        .map((f) => `• ${f}`)
        .join(
          "\n"
        )}\n\nMerci de me recontacter pour en discuter.\n\nCordialement,`,
    }));
    setShowMessageModal(true);
  };

  const handleContact = (partenaire) => {
    trackBusinessInteraction(
      partenaire.id.toString(),
      partenaire.nom,
      "contact_request",
      {
        type: "partenaire",
        rating: partenaire.rating,
      }
    );
    setSelectedPartenaire(partenaire);
    setShowMessageModal(true);
  };

  const handleOpenMap = () => {
    trackBusinessInteraction("map", "Carte partenaires", "open");
    setShowMapModal(true);
  };

  const handlePartnerLocation = (partenaire) => {
    trackBusinessInteraction(
      partenaire.id.toString(),
      partenaire.nom,
      "location_view",
      {
        address: partenaire.location.address,
      }
    );
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
          action: "contact_submit",
          type: "partenaire",
        }
      : selectedService
      ? {
          id: selectedService.id.toString(),
          name: selectedService.nom,
          action: "service_request",
          category: selectedService.category,
        }
      : {
          id: "general_contact",
          name: "Contact général",
          action: "general_contact",
        };

    trackBusinessInteraction(
      trackingData.id,
      trackingData.name,
      trackingData.action,
      trackingData
    );

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
        typeAvis: "positif",
      });
      setSelectedPartenaire(null);
      setSelectedService(null);
      toast.success(
        "Votre demande a été envoyée avec succès ! Un conseiller vous contactera dans les 24h."
      );
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return {
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
    serviceCategories,
    partenaires, // Ajouté
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
    trackBusinessInteraction,
  };
};