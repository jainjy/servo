import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Star,
  ChevronRight,
  Users,
  TrendingUp,
  Coins,
  Shield,
  Handshake,
  LucideIcon,
  Building,
  Wrench,
  Cpu,
  Palette,
  Briefcase,
  HeartHandshake,
  Rocket,
  Target,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { Partenaire } from "../data/partnersData";
import { Colors } from "../data/colors";
import { useState, useEffect } from "react";
import UserMetierService from "@/services/userMetierService";

// Interface pour les métiers depuis l'API
interface MetierFromAPI {
  id: number;
  libelle: string;
  _count?: {
    services: number;
    users: number;
    demandes: number;
    ContactMessage: number;
  };
}

interface PartnersSectionProps {
  handleContact: (partenaire: Partenaire) => void;
  handleOpenMap: () => void;
  handlePartnerLocation: (partenaire: Partenaire) => void;
  trackBusinessInteraction: (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>
  ) => void;
  colors: Colors;
}

interface FilterOption {
  label: string;
  value: string;
}

interface Advantage {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({
  handleContact,
  handleOpenMap,
  handlePartnerLocation,
  trackBusinessInteraction,
  colors
}) => {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSecteur, setSelectedSecteur] = useState<string>("tous");

  const filters: FilterOption[] = [
    { label: "Présentation partenaires", value: "presentation" },
    { label: "Demandes de prestations", value: "prestations" },
    { label: "Aides disponibles", value: "aides" },
  ];

  // Icônes pour différents secteurs
  const secteurIcons: Record<string, LucideIcon> = {
    "Construction": Building,
    "Services": Briefcase,
    "Artisanat": Wrench,
    "Technique": Cpu,
    "Général": Users,
    "Design": Palette,
    "Santé": HeartHandshake,
    "Technologie": Cpu,
    "Finance": Coins,
    "Marketing": Rocket,
    "Consulting": Target,
    "Énergie": Zap
  };

  // Fonction pour transformer les données de l'API en Partenaire
  const transformMetierToPartenaire = (metier: MetierFromAPI): Partenaire => {
    // Catégories basées sur le libellé du métier
    const getSecteurFromLibelle = (libelle: string): string => {
      const libelleLower = libelle.toLowerCase();
      if (libelleLower.includes('plombier') || libelleLower.includes('électricien') || 
          libelleLower.includes('maçon') || libelleLower.includes('construction')) {
        return "Construction";
      } else if (libelleLower.includes('consultant') || libelleLower.includes('conseil') || 
                 libelleLower.includes('formation') || libelleLower.includes('expert')) {
        return "Services";
      } else if (libelleLower.includes('artisan') || libelleLower.includes('menuiserie') || 
                 libelleLower.includes('ébéniste') || libelleLower.includes('design')) {
        return "Artisanat";
      } else if (libelleLower.includes('technicien') || libelleLower.includes('ingénieur') || 
                 libelleLower.includes('informatique') || libelleLower.includes('développeur')) {
        return "Technique";
      } else if (libelleLower.includes('médecin') || libelleLower.includes('infirmier') || 
                 libelleLower.includes('thérapeute')) {
        return "Santé";
      } else if (libelleLower.includes('comptable') || libelleLower.includes('financier') || 
                 libelleLower.includes('banquier')) {
        return "Finance";
      } else if (libelleLower.includes('marketing') || libelleLower.includes('communication') || 
                 libelleLower.includes('publicité')) {
        return "Marketing";
      }
      return "Général";
    };

    // Obtenir l'icône du secteur
    const secteur = getSecteurFromLibelle(metier.libelle);
    const secteurIcon = secteurIcons[secteur] || Briefcase;

    // Générer des données réalistes basées sur le métier
    const nombreProjets = (metier._count?.services || 0) * 5 + 10;
    const rating = 3.5 + Math.random() * 1.5; // Note entre 3.5 et 5
    const badgeLevel = nombreProjets > 50 ? "Expert" : nombreProjets > 20 ? "Confirmé" : "Débutant";
    const badgeColors = {
      "Expert": "#10B981", // Vert
      "Confirmé": "#3B82F6", // Bleu
      "Débutant": "#F59E0B" // Orange
    };

    return {
      id: metier.id.toString(),
      nom: metier.libelle,
      description: `Spécialiste en ${metier.libelle.toLowerCase()}. ${metier._count?.services || 0} services proposés.`,
      secteur: secteur,
      secteurIcon: secteurIcon, // Ajout de l'icône
      rating: parseFloat(rating.toFixed(1)),
      projets: nombreProjets,
      badge: badgeLevel,
      badgeColor: badgeColors[badgeLevel as keyof typeof badgeColors] || colors.primaryDark,
      location: {
        address: "Paris, France",
        lat: 48.8566 + (Math.random() * 0.1 - 0.05),
        lng: 2.3522 + (Math.random() * 0.1 - 0.05)
      }
    };
  };

  // Charger les métiers depuis l'API
  useEffect(() => {
    const fetchMetiers = async () => {
      try {
        setLoading(true);
        // Utiliser le nouveau service utilisateur
        const response = await UserMetierService.getAllMetiers();
        
        // Transformer les données API en partenaires
        const partenairesFromAPI: Partenaire[] = response.map((metier: MetierFromAPI) => 
          transformMetierToPartenaire(metier)
        );
        
        setPartenaires(partenairesFromAPI);
        setError(null);
        
        // Track successful data loading
        trackBusinessInteraction(
          "metiers_loaded",
          "Métiers chargés",
          "data_loaded",
          { count: partenairesFromAPI.length }
        );
      } catch (err: any) {
        console.error("Erreur lors du chargement des métiers:", err);
        setError("Impossible de charger les métiers. Veuillez réessayer.");
        
        // Track error
        trackBusinessInteraction(
          "metiers_error",
          "Erreur chargement métiers",
          "error",
          { error: err.message }
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetiers();
  }, []);

  const handleFilterChange = (filter: FilterOption, value: string) => {
    if (filter.value === "presentation") {
      setSelectedSecteur(value);
    }
    
    trackBusinessInteraction(
      "partner_filter",
      filter.label,
      "filter_select",
      {
        filter: filter.value,
        value: value,
      }
    );
    toast.info(`Filtre ${filter.label} sélectionné: ${value}`);
  };

  const handleCTAClick = () => {
    trackBusinessInteraction(
      "become_partner",
      "Devenir partenaire",
      "cta_click"
    );
  };

  // Filtrer les partenaires par secteur
  const filteredPartenaires = selectedSecteur === "tous" 
    ? partenaires 
    : partenaires.filter(p => 
        p.secteur.toLowerCase().includes(selectedSecteur.toLowerCase())
      );

  return (
    <motion.section
      className="py-0 lg:py-8"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      id="partenaire"
      style={{ backgroundColor: colors.lightBg }}
    >
      <div className="container mx-auto px-4">
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
          className="text-center mb-4 lg:mb-8"
        >
          <h1
            className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6"
            style={{ color: colors.primaryDark }}
          >
            Devenir{" "}
            <span style={{ color: colors.secondaryText }}>Partenaire</span>
          </h1>
          <p
            className="text-sm lg:text-sm max-w-2xl mx-auto mb-4 lg:mb-8"
            style={{ color: colors.textSecondary }}
          >
            Rejoignez notre réseau d'experts et développez votre activité
          </p>
        </motion.div>

        {/* Filtres et actions */}
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
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            {filters.map((filter, index) => (
              <motion.div key={index}>
                <Select
                  onValueChange={(value: string) => handleFilterChange(filter, value)}
                >
                  <SelectTrigger className="w-[240px] border-2 rounded-xl bg-white">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="tous">Tous les métiers</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="artisanat">Artisanat</SelectItem>
                    <SelectItem value="technique">Technique</SelectItem>
                    <SelectItem value="santé">Santé</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            ))}

            <motion.div>
              <Button
                variant="outline"
                className="gap-2 border-2 font-semibold rounded-xl bg-white transition-all duration-300 px-6 py-3"
                style={{
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
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

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" 
                 style={{ borderColor: colors.primaryDark }}></div>
            <p className="mt-4" style={{ color: colors.textSecondary }}>
              Chargement des métiers...
            </p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              style={{ backgroundColor: colors.primaryDark }}
            >
              Réessayer
            </Button>
          </div>
        )}

        {/* Grille des partenaires */}
        {!loading && !error && (
          <>
            {filteredPartenaires.length > 0 ? (
              <PartnersGrid 
                partenaires={filteredPartenaires}
                handleContact={handleContact}
                handlePartnerLocation={handlePartnerLocation}
                colors={colors}
              />
            ) : (
              <div className="text-center py-12">
                <p style={{ color: colors.textSecondary }}>
                  Aucun métier trouvé pour ce filtre
                </p>
              </div>
            )}
          </>
        )}

        {/* Avantages partenariat */}
        <AdvantagesSection colors={colors} />

        {/* CTA devenir partenaire */}
        <CTAButton 
          onCTAClick={handleCTAClick}
          colors={colors}
        />
      </div>
    </motion.section>
  );
};

interface PartnersGridProps {
  partenaires: Partenaire[];
  handleContact: (partenaire: Partenaire) => void;
  handlePartnerLocation: (partenaire: Partenaire) => void;
  colors: Colors;
}

const PartnersGrid: React.FC<PartnersGridProps> = ({ 
  partenaires, 
  handleContact, 
  handlePartnerLocation, 
  colors 
}) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
  >
    {partenaires.map((partenaire) => {
      const SecteurIcon = partenaire.secteurIcon;
      
      return (
        <motion.div
          key={partenaire.id}
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
          whileHover={{ y: -8, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="h-full"
        >
          <Card
            className="p-6 h-full rounded-2xl overflow-hidden relative hover:shadow-2xl transition-all duration-500 group"
            style={{
              borderColor: colors.separator,
              backgroundColor: colors.cardBg,
            }}
          >
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10"
              style={{
                backgroundColor: partenaire.badgeColor,
                color: colors.lightBg,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {partenaire.badge}
            </motion.div>

            {/* Icône du secteur au lieu de l'image */}
            <motion.div
              className="w-16 h-16 mb-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 mx-auto"
              style={{
                backgroundColor: `${colors.primaryDark}15`,
              }}
            >
              <SecteurIcon
                className="h-8 w-8 transition-colors duration-300"
                style={{
                  color: colors.primaryDark,
                }}
              />
            </motion.div>

            <div className="text-center">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                {partenaire.nom}
              </h3>

              <p
                className="text-sm mb-3 px-2 py-1 rounded-full inline-block"
                style={{
                  backgroundColor: `${colors.primaryDark}10`,
                  color: colors.primaryDark,
                  border: `1px solid ${colors.primaryDark}20`
                }}
              >
                {partenaire.secteur}
              </p>

              <p
                className="leading-relaxed text-sm mb-4"
                style={{ color: colors.textSecondary }}
              >
                {partenaire.description}
              </p>

              {/* Localisation */}
              <motion.div
                className="flex items-center justify-center gap-2 cursor-pointer group mb-4"
                onClick={() => handlePartnerLocation(partenaire)}
              >
                <MapPin
                  className="h-4 w-4"
                  style={{ color: colors.textSecondary }}
                />
                <span
                  className="text-sm transition-colors"
                  style={{ color: colors.textSecondary }}
                >
                  {partenaire.location.address}
                </span>
              </motion.div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Star
                    className="h-4 w-4"
                    style={{ color: colors.warning }}
                  />
                  <span
                    className="font-semibold"
                    style={{ color: colors.textPrimary }}
                  >
                    {partenaire.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users
                    className="h-4 w-4"
                    style={{ color: colors.textSecondary }}
                  />
                  <span style={{ color: colors.textSecondary }}>
                    {partenaire.projets} projets
                  </span>
                </div>
              </div>

              {/* BOUTON DE CONTACT */}
              <motion.div>
                <Button
                  className="w-full font-semibold rounded-xl gap-2 border-2 transition-all duration-300 py-3"
                  style={{
                    backgroundColor: colors.primaryDark,
                    color: colors.lightBg,
                    borderColor: colors.primaryDark,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.primaryLight;
                    e.currentTarget.style.borderColor =
                      colors.primaryLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.primaryDark;
                    e.currentTarget.style.borderColor =
                      colors.primaryDark;
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
      );
    })}
  </motion.div>
);

interface AdvantagesSectionProps {
  colors: Colors;
}

const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({ colors }) => {
  const advantages: Advantage[] = [
    {
      title: "Visibilité accrue",
      description: "Bénéficiez d'une exposition privilégiée auprès de notre communauté",
      icon: TrendingUp,
      color: colors.primaryDark,
    },
    {
      title: "Opportunités business",
      description: "Accédez à de nouveaux marchés et développez votre chiffre d'affaires",
      icon: Coins,
      color: colors.secondaryText,
    },
    {
      title: "Support dédié",
      description: "Un accompagnement personnalisé pour maximiser votre réussite",
      icon: Shield,
      color: colors.logo,
    },
  ];

  return (
    <motion.div
      className="mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <h2
        className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12"
        style={{ color: colors.primaryDark }}
      >
        Avantages du partenariat
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {advantages.map((advantage, index) => {
          const AdvantageIcon = advantage.icon;
          
          return (
            <motion.div
              key={index}
              className="text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.separator}`,
              }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${advantage.color}15` }}
              >
                <AdvantageIcon
                  className="h-8 w-8"
                  style={{ color: advantage.color }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.textPrimary }}
              >
                {advantage.title}
              </h3>
              <p style={{ color: colors.textSecondary }}>
                {advantage.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

interface CTAButtonProps {
  onCTAClick: () => void;
  colors: Colors;
}

const CTAButton: React.FC<CTAButtonProps> = ({ onCTAClick, colors }) => (
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
        onClick={onCTAClick}
      >
        <Handshake className="h-6 w-6 mr-3" />
        Devenir Partenaire
      </Button>
    </motion.div>
  </motion.div>
);

export default PartnersSection;