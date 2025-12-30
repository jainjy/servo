import { useState } from "react";
import { useInteractionTracking } from "@/hooks/useInteractionTracking";
import { toast } from "sonner";
import { serviceCategories } from "../data/servicesData";
import { partenaires } from "../data/partnersData";
import { EnterpriseService } from "@/services/enterpriseService";

export const useEntreprise = () => {
  const { trackBusinessInteraction } = useInteractionTracking();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<EnterpriseService | null>(null);
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
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Fonction pour générer des features à partir des tags
  const generateFeaturesFromTags = (service: EnterpriseService): string[] => {
    const featuresMap: { [key: string]: string[] } = {
      'création': [
        "Choix du statut juridique",
        "Rédaction des statuts",
        "Immatriculation",
        "Domiciliation d'entreprise"
      ],
      'rachat': [
        "Due diligence",
        "Évaluation financière",
        "Négociation",
        "Transmission juridique"
      ],
      'cession': [
        "Évaluation de l'entreprise",
        "Recherche d'acquéreurs",
        "Négociations",
        "Procédures légales"
      ],
      'communication': [
        "Stratégie digitale",
        "Branding",
        "Social Media",
        "Campagnes publicitaires"
      ],
      'comptabilité': [
        "Comptabilité générale",
        "Déclarations fiscales",
        "TVA",
        "Bilans annuels"
      ],
      'juridique': [
        "Droit des sociétés",
        "Contrats commerciaux",
        "Propriété intellectuelle",
        "Résolution de litiges"
      ],
      'financement': [
        "Analyse de faisabilité",
        "Montage de dossier",
        "Recherche de financeurs",
        "Suivi administratif"
      ],
      'international': [
        "Étude de marché",
        "Stratégie d'export",
        "Logistique internationale",
        "Conformité réglementaire"
      ]
    };
    
    // Trouve des caractéristiques basées sur les tags
    if (service.tags) {
      for (const tag of service.tags) {
        const lowerTag = tag.toLowerCase();
        if (featuresMap[lowerTag]) {
          return featuresMap[lowerTag];
        }
      }
    }
    
    // Caractéristiques par défaut
    return [
      "Accompagnement personnalisé",
      "Expertise professionnelle",
      "Solutions sur mesure",
      "Suivi continu"
    ];
  };

  const handleServiceClick = (service: EnterpriseService) => {
    trackBusinessInteraction(service.id.toString(), service.libelle, "click", {
      category: service.category?.name,
      tags: service.tags,
    });
    
    setSelectedService(service);
    
    // Générer les features à partir des tags
    const features = generateFeaturesFromTags(service);
    
    setFormData((prev) => ({
      ...prev,
      service: service.libelle,
      message: `Bonjour,\n\nJe suis intéressé par le service "${
        service.libelle
      }".\n\nPouvez-vous me renseigner sur :\n${features
        .map((f) => `• ${f}`)
        .join(
          "\n"
        )}\n\nMerci de me recontacter pour en discuter.\n\nCordialement,`,
    }));
    setShowMessageModal(true);
  };

  const handleContact = (partenaire: any) => {
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

  const handlePartnerLocation = (partenaire: any) => {
    trackBusinessInteraction(
      partenaire.id.toString(),
      partenaire.nom,
      "location_view",
      {
        address: partenaire.location?.address,
      }
    );
    setSelectedLocation(partenaire.location);
    setShowMapModal(true);
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
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
          name: selectedService.libelle,
          action: "service_request",
          category: selectedService.category?.name,
          tags: selectedService.tags,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    partenaires,
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