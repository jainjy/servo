// src/pages/EntrepriseEtPro/components/ServicesGrid.tsx - VERSION CORRIGÉE
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ChevronRight, Search, ArrowRight, LucideIcon } from "lucide-react";
import { Colors } from "../data/colors";
import { EnterpriseService } from "@/services/enterpriseService";
import { useEffect, useState, ChangeEvent, useMemo } from "react";
import { ServiceCategory } from "../data/servicesData";

// IMPORTEZ TOUTES LES ICÔNES ICI, EN DEHORS DES COMPOSANTS
import {
  Rocket,
  Briefcase,
  Scale,
  Megaphone,
  Calculator,
  ScaleIcon as GavelIcon,
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
  ClipboardCheck,
  Tag
} from "lucide-react";

interface ServicesGridProps {
  handleServiceClick: (service: EnterpriseService) => void;
  colors: Colors;
  serviceCategories: ServiceCategory[];
  trackBusinessInteraction: (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;
  initialTag?: string;
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
  handleServiceClick, 
  colors,
  serviceCategories,
  trackBusinessInteraction,
  initialTag = "all"
}) => {
  const [services, setServices] = useState<EnterpriseService[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState(initialTag);
  const [searchTerm, setSearchTerm] = useState("");

  // Extraire tous les tags uniques des services
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    services.forEach(service => {
      service.tags?.forEach(tag => {
        if (tag && typeof tag === 'string') {
          tagsSet.add(tag.toLowerCase());
        }
      });
    });
    return Array.from(tagsSet);
  }, [services]);

  useEffect(() => {
    loadServices();
  }, [activeTag, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      let response;
      
      const enterpriseServiceAPI = (await import("@/services/enterpriseService")).default;
      
      if (searchTerm) {
        // Si recherche
        response = await enterpriseServiceAPI.searchServices(searchTerm, {
          type: 'entreprise',
          limit: 50
        });
      } else {
        // Tous les services entreprise
        response = await enterpriseServiceAPI.getAllServices({
          type: 'entreprise',
          isActive: true,
          limit: 50
        });
      }
      
      setServices(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les services par tag côté client
  const filteredServices = useMemo(() => {
    let result = services;
    
    // Filtrer par tag
    if (activeTag !== "all") {
      result = result.filter(service => 
        service.tags?.some(tag => 
          tag.toLowerCase() === activeTag.toLowerCase()
        )
      );
    }
    
    // Filtrer par recherche
    if (searchTerm && searchTerm.trim() !== "") {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(service => 
        service.libelle.toLowerCase().includes(lowerSearchTerm) ||
        service.description.toLowerCase().includes(lowerSearchTerm) ||
        service.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    return result;
  }, [services, activeTag, searchTerm]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    trackBusinessInteraction(
      "search",
      "Recherche services",
      "search",
      {
        term: searchTerm,
        tag: activeTag,
      }
    );
  };

  const handleTagClick = (tag: string) => {
    trackBusinessInteraction(
      "filter_tag",
      tag,
      "filter_select",
      {
        tag: tag,
      }
    );
    setActiveTag(tag);
  };

  // Fonction pour obtenir une couleur basée sur le tag
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
      'export': '#D35400',
      'entreprise': '#7D3C98',
      'pro': '#2874A6'
    };
    
    // Cherche une correspondance dans les tags
    if (service.tags) {
      for (const tag of service.tags) {
        const lowerTag = tag.toLowerCase();
        if (colorMap[lowerTag]) {
          return colorMap[lowerTag];
        }
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

  // Fonction pour obtenir une icône basée sur le libellé ou les tags
  const getServiceIcon = (service: EnterpriseService): LucideIcon => {
    const lowerLibelle = service.libelle.toLowerCase();
    
    // Cherche d'abord une correspondance exacte dans les tags
    if (service.tags) {
      for (const tag of service.tags) {
        const lowerTag = tag.toLowerCase();
        if (iconMapping[lowerTag]) {
          return iconMapping[lowerTag];
        }
      }
    }
    
    // Cherche dans le libellé
    for (const [key, icon] of Object.entries(iconMapping)) {
      if (lowerLibelle.includes(key)) {
        return icon;
      }
    }
    
    // Si le service a des tags, utilise le premier tag
    if (service.tags && service.tags.length > 0) {
      return Tag; // Icône générique pour les tags
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

  if (loading && services.length === 0) {
    return (
      <div className="py-8">
        {/* Barre de recherche unifiée */}
        <motion.div
          className="max-w-2xl mx-auto grid place-items-center lg:flex gap-4 mb-8 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex-1 relative">
            <Input
              placeholder="Rechercher un service (création, comptabilité, juridique...)"
              className="pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all duration-300"
              style={{
                borderColor: colors.separator,
                backgroundColor: colors.cardBg,
              }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              className="absolute left-4 top-3.5 h-5 w-5"
              style={{ color: colors.textSecondary }}
            />
          </div>
          <motion.div>
            <Button
              className="rounded-xl px-8 py-3 font-semibold border-2 transition-all duration-300"
              style={{
                backgroundColor: colors.primaryDark,
                color: colors.lightBg,
                borderColor: colors.primaryDark,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryLight;
                e.currentTarget.style.borderColor = colors.primaryLight;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryDark;
                e.currentTarget.style.borderColor = colors.primaryDark;
              }}
              onClick={handleSearchClick}
            >
              Rechercher
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Filtres par tags */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: {
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 100,
              },
            },
          }}
          className="mb-12"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex flex-wrap gap-3 mb-4 lg:mb-8 justify-center">
            {/* Tag "Tous" */}
            <motion.div>
              <Button
                variant={activeTag === "all" ? "default" : "outline"}
                className="rounded-xl font-semibold px-4 lg:px-6 py-3 transition-all duration-300 flex items-center gap-2"
                style={
                  activeTag === "all"
                    ? {
                        backgroundColor: colors.primaryDark,
                        color: colors.lightBg,
                        borderColor: colors.primaryDark,
                      }
                    : {
                        borderColor: colors.separator,
                        color: colors.textPrimary,
                        backgroundColor: "transparent",
                      }
                }
                onClick={() => handleTagClick("all")}
              >
                <Tag className="h-4 w-4" />
                <span>Tous</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Squelette de chargement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card 
              key={index} 
              className="p-6 h-64 animate-pulse bg-gray-100 rounded-2xl" 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Barre de recherche unifiée */}
      <motion.div
        className="max-w-2xl mx-auto grid place-items-center lg:flex gap-4 mb-8 lg:mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex-1 relative">
          <Input
            placeholder="Rechercher un service (création, comptabilité, juridique...)"
            className="pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all duration-300"
            style={{
              borderColor: colors.separator,
              backgroundColor: colors.cardBg,
            }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search
            className="absolute left-4 top-3.5 h-5 w-5"
            style={{ color: colors.textSecondary }}
          />
        </div>
        <motion.div>
          <Button
            className="rounded-xl px-8 py-3 font-semibold border-2 transition-all duration-300"
            style={{
              backgroundColor: colors.primaryDark,
              color: colors.lightBg,
              borderColor: colors.primaryDark,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryLight;
              e.currentTarget.style.borderColor = colors.primaryLight;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.primaryDark;
              e.currentTarget.style.borderColor = colors.primaryDark;
            }}
            onClick={handleSearchClick}
          >
            Rechercher
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Filtres par tags */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 100,
            },
          },
        }}
        className="mb-12"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex flex-wrap gap-3 mb-4 lg:mb-8 justify-center">
          {/* Tag "Tous" */}
          <motion.div>
            <Button
              variant={activeTag === "all" ? "default" : "outline"}
              className="rounded-xl font-semibold px-4 lg:px-6 py-3 transition-all duration-300 flex items-center gap-2"
              style={
                activeTag === "all"
                  ? {
                      backgroundColor: colors.primaryDark,
                      color: colors.lightBg,
                      borderColor: colors.primaryDark,
                    }
                  : {
                      borderColor: colors.separator,
                      color: colors.textPrimary,
                      backgroundColor: "transparent",
                    }
              }
              onClick={() => handleTagClick("all")}
            >
              <Tag className="h-4 w-4" />
              <span>Tous</span>
            </Button>
          </motion.div>

          {/* Tags extraits des services */}
          {allTags.slice(0, 10).map((tag, index) => {
            const IconComponent = iconMapping[tag] || Tag;
            return (
              <motion.div key={index}>
                <Button
                  variant={activeTag === tag ? "default" : "outline"}
                  className="rounded-xl font-semibold px-4 lg:px-6 py-3 transition-all duration-300 flex items-center gap-2"
                  style={
                    activeTag === tag
                      ? {
                          backgroundColor: colors.primaryDark,
                          color: colors.lightBg,
                          borderColor: colors.primaryDark,
                        }
                      : {
                          borderColor: colors.separator,
                          color: colors.textPrimary,
                          backgroundColor: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (activeTag !== tag) {
                      e.currentTarget.style.borderColor = colors.primaryDark;
                      e.currentTarget.style.color = colors.primaryDark;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTag !== tag) {
                      e.currentTarget.style.borderColor = colors.separator;
                      e.currentTarget.style.color = colors.textPrimary;
                    }
                  }}
                  onClick={() => handleTagClick(tag)}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="capitalize">{tag}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Grille de services */}
      {filteredServices.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p style={{ color: colors.textSecondary }}>
            Aucun service trouvé {searchTerm ? `pour "${searchTerm}"` : ""}
            {activeTag !== "all" && ` avec le tag "${activeTag}"`}
          </p>
          <Button
            className="mt-4 rounded-xl font-semibold"
            style={{
              backgroundColor: colors.primaryDark,
              color: colors.lightBg,
            }}
            onClick={() => {
              setSearchTerm("");
              setActiveTag("all");
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredServices.map((service) => {
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

                    {/* Tags du service */}
                    {service.tags && service.tags.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1 justify-center">
                        {service.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${serviceColor}20`,
                              color: serviceColor,
                              border: `1px solid ${serviceColor}40`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {service.tags.length > 3 && (
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: colors.separator,
                              color: colors.textSecondary,
                            }}
                          >
                            +{service.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

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
                      {service.price !== null && service.price !== undefined && (
                        <span
                          className="font-bold"
                          style={{ color: colors.primaryDark }}
                        >
                          {service.price.toFixed(2)} €
                        </span>
                      )}
                      {service.duration !== null && service.duration !== undefined && (
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
      )}
    </div>
  );
};

export default ServicesGrid;