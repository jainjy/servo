// src/pages/EntrepriseEtPro/components/ServicesGrid.tsx - CORRIGÉ
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, LucideIcon } from "lucide-react";
import { Colors } from "../data/colors";
import { EnterpriseService } from "@/services/enterpriseService";
import { useEffect, useState } from "react";

// IMPORTEZ TOUTES LES ICÔNES ICI, EN DEHORS DES COMPOSANTS
import {
  Rocket,
  Briefcase,
  Scale,
  Megaphone,
  Calculator,
  ScaleIcon as GavelIcon, // Renommez pour éviter conflit
  Brain,
  Coins,
  BarChart3,
  TargetIcon,
  Building,
  FileText,
  Globe,
  Users,
  Shield,
  Zap,
  TrendingUp,
  Lightbulb,
  MessageSquare,
  ClipboardCheck
} from "lucide-react";

interface ServicesGridProps {
  categoryId?: number;
  searchTerm?: string;
  handleServiceClick: (service: EnterpriseService) => void;
  colors: Colors;
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

const cardHoverVariants = {
  initial: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
    },
  },
};

// Mappez les icônes une fois en dehors du composant
const iconMapping: { [key: string]: LucideIcon } = {
  'création': Rocket,
  'rachat': Briefcase,
  'cession': Scale,
  'communication': Megaphone,
  'marketing': Megaphone,
  'comptabilité': Calculator,
  'fiscalité': Calculator,
  'juridique': GavelIcon,
  'droit': GavelIcon,
  'conseil': Brain,
  'accompagnement': Users,
  'coaching': Brain,
  'financement': Coins,
  'subvention': Coins,
  'digital': BarChart3,
  'transformation': BarChart3,
  'international': TargetIcon,
  'export': TargetIcon,
  'entreprise': Building,
  'pro': Users,
  'contrat': FileText,
  'stratégie': TrendingUp,
  'innovation': Lightbulb,
  'sécurité': Shield,
  'performance': Zap,
  'communication': MessageSquare,
  'qualité': ClipboardCheck
};

const ServicesGrid: React.FC<ServicesGridProps> = ({ 
  categoryId,
  searchTerm,
  handleServiceClick, 
  colors 
}) => {
  const [services, setServices] = useState<EnterpriseService[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    loadServices();
  }, [categoryId, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      let response;
      
      // Importez le service ici
      const enterpriseServiceAPI = (await import("@/services/enterpriseService")).default;
      
      if (searchTerm) {
        // Si recherche
        response = await enterpriseServiceAPI.searchServices(searchTerm, {
          categoryId,
          type: 'entreprise',
          limit: 20
        });
      } else if (categoryId) {
        // Si filtre par catégorie
        response = await enterpriseServiceAPI.getServicesByCategory(categoryId, {
          type: 'entreprise',
          isActive: true
        });
      } else {
        // Tous les services entreprise
        response = await enterpriseServiceAPI.getAllServices({
          type: 'entreprise',
          isActive: true,
          limit: 20
        });
      }
      
      setServices(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      // Gérer l'erreur
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir une couleur basée sur l'ID ou les tags
  const getServiceColor = (service: EnterpriseService): string => {
    const colorMap: { [key: string]: string } = {
      'création': '#6B8E23',
      'rachat': '#8B4513',
      'cession': '#F39C12',
      'communication': '#9B59B6',
      'marketing': '#9B59B6',
      'comptabilité': '#2C3E50',
      'fiscalité': '#2C3E50',
      'juridique': '#E74C3C',
      'droit': '#E74C3C',
      'conseil': '#3498DB',
      'accompagnement': '#3498DB',
      'financement': '#27AE60',
      'subvention': '#27AE60',
      'digital': '#556B2F',
      'transformation': '#556B2F',
      'international': '#D35400',
      'export': '#D35400'
    };
    
    // Cherche une correspondance dans les tags
    for (const tag of service.tags || []) {
      const lowerTag = tag.toLowerCase();
      if (colorMap[lowerTag]) {
        return colorMap[lowerTag];
      }
    }
    
    // Cherche dans le libellé
    const lowerLibelle = service.libelle.toLowerCase();
    for (const [key, color] of Object.entries(colorMap)) {
      if (lowerLibelle.includes(key)) {
        return color;
      }
    }
    
    // Couleur par défaut basée sur l'ID
    const defaultColors = [
      '#6B8E23', '#8B4513', '#F39C12', '#9B59B6', '#2C3E50',
      '#E74C3C', '#3498DB', '#27AE60', '#556B2F', '#D35400'
    ];
    return defaultColors[service.id % defaultColors.length];
  };

  // Fonction pour obtenir une icône basée sur le libellé
  const getServiceIcon = (service: EnterpriseService): LucideIcon => {
    const lowerLibelle = service.libelle.toLowerCase();
    
    // Cherche d'abord une correspondance exacte dans les tags
    for (const tag of service.tags || []) {
      const lowerTag = tag.toLowerCase();
      if (iconMapping[lowerTag]) {
        return iconMapping[lowerTag];
      }
    }
    
    // Cherche dans le libellé
    for (const [key, icon] of Object.entries(iconMapping)) {
      if (lowerLibelle.includes(key)) {
        return icon;
      }
    }
    
    // Icône par défaut
    return Briefcase;
  };

  // Génère des caractéristiques basées sur les tags
  const getServiceFeatures = (service: EnterpriseService): string[] => {
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
      ]
    };
    
    // Trouve des caractéristiques basées sur les tags
    for (const tag of service.tags || []) {
      const lowerTag = tag.toLowerCase();
      if (featuresMap[lowerTag]) {
        return featuresMap[lowerTag];
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <Card 
            key={index} 
            className="p-6 h-64 animate-pulse bg-gray-100 rounded-2xl" 
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: colors.textSecondary }}>
          Aucun service trouvé
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {services.map((service) => {
        const ServiceIcon = getServiceIcon(service);
        const serviceColor = getServiceColor(service);
        const serviceFeatures = getServiceFeatures(service);
        
        return (
          <motion.div
            key={service.id}
            variants={itemVariants}
            whileHover="hover"
            initial="initial"
            onMouseEnter={() => setHoveredCard(service.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.div variants={cardHoverVariants} className="h-full">
              <Card
                className="p-6 h-full rounded-2xl cursor-pointer hover:shadow-2xl transition-all duration-500 group border"
                style={{
                  borderColor: colors.separator,
                  backgroundColor: colors.cardBg,
                }}
                onClick={() => handleServiceClick(service)}
              >
                {/* Icône du service */}
                <motion.div
                  className="w-14 h-14 mb-5 rounded-xl flex items-center justify-center transition-all duration-300 mx-auto"
                  style={{
                    backgroundColor:
                      hoveredCard === service.id
                        ? colors.primaryDark
                        : `${serviceColor}15`,
                    transform:
                      hoveredCard === service.id
                        ? "rotate(5deg) scale(1.1)"
                        : "none",
                  }}
                >
                  <ServiceIcon
                    className="h-7 w-7 transition-colors duration-300"
                    style={{
                      color:
                        hoveredCard === service.id
                          ? colors.lightBg
                          : serviceColor,
                    }}
                  />
                </motion.div>

                {/* Contenu */}
                <h3
                  className="text-lg font-bold mb-3 text-center line-clamp-2"
                  style={{ color: colors.textPrimary }}
                >
                  {service.libelle}
                </h3>

                <p
                  className="text-sm mb-4 leading-relaxed line-clamp-3"
                  style={{ color: colors.textSecondary }}
                >
                  {service.description}
                </p>

                {/* Caractéristiques */}
                <div className="mb-5">
                  <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: colors.primaryDark }}
                  >
                    Ce service comprend :
                  </p>
                  <ul className="space-y-1">
                    {serviceFeatures.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle
                          className="h-3 w-3 mt-0.5 flex-shrink-0"
                          style={{ color: colors.success }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: colors.textSecondary }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                    {serviceFeatures.length > 3 && (
                      <li
                        className="text-xs italic"
                        style={{ color: colors.textSecondary, opacity: 0.7 }}
                      >
                        + {serviceFeatures.length - 3} autres services
                      </li>
                    )}
                  </ul>
                </div>

                {/* Prix et durée */}
                <div className="flex justify-between items-center mb-4">
                  {service.price && (
                    <span
                      className="font-bold"
                      style={{ color: colors.primaryDark }}
                    >
                      {service.price} €
                    </span>
                  )}
                  {service.duration && (
                    <span
                      className="text-sm"
                      style={{ color: colors.textSecondary }}
                    >
                      {service.duration} min
                    </span>
                  )}
                </div>

                {/* BOUTON D'ACTION */}
                <motion.div>
                  <Button
                    className="w-full font-semibold rounded-xl gap-2 py-3 border-2 transition-all duration-300 text-sm"
                    variant="outline"
                    style={{
                      borderColor:
                        hoveredCard === service.id
                          ? colors.primaryDark
                          : colors.primaryDark,
                      color:
                        hoveredCard === service.id
                          ? colors.lightBg
                          : colors.primaryDark,
                      backgroundColor:
                        hoveredCard === service.id
                          ? colors.primaryDark
                          : "transparent",
                    }}
                  >
                    Demander un devis
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ServicesGrid;