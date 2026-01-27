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
  FileText,
  Calculator,
  Scale,
  Briefcase,
  Globe,
  Target,
  Zap,
  MessageSquare,
  Users as UsersIcon,
  Award,
  CheckCircle,
  Clock,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";
import { Colors } from "../data/colors";
import { useState, useEffect } from "react";
import { EnterpriseService } from "@/services/enterpriseService";
import { PartenaireExpert } from "../types/partenaireTypes";

// Types pour les experts
interface ExpertPartenaire extends PartenaireExpert {
  secteur: string;
  secteurIcon: LucideIcon;
  rating: number;
  projets: number;
  badge: string;
  badgeColor: string;
  specialites: string[];
  experience: string;
  certification?: string;
  languages?: string[];
}

interface PartnersSectionProps {
  handleContact: (expert: ExpertPartenaire) => void;
  handleOpenMap: () => void;
  handlePartnerLocation: (expert: ExpertPartenaire) => void;
  trackBusinessInteraction: (
    id: string,
    name: string,
    action: string,
    metadata?: Record<string, any>,
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
  colors,
}) => {
  const [experts, setExperts] = useState<ExpertPartenaire[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>("tous");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filtres pour les spécialités d'experts
  const filters: FilterOption[] = [
    { label: "Spécialité", value: "specialite" },
    { label: "Type d'expertise", value: "expertise" },
    { label: "Niveau d'expérience", value: "experience" },
  ];

  // Icônes par secteur
  const secteurIcons: Record<string, LucideIcon> = {
    "Création d'entreprise": Rocket,
    Comptabilité: Calculator,
    Juridique: Scale,
    Fiscalité: Coins,
    Audit: FileText,
    Conseil: MessageSquare,
    Financement: TrendingUp,
    International: Globe,
    Marketing: Target,
    RH: UsersIcon,
    Digital: Zap,
  };

  // Données simulées d'experts (à remplacer par l'API)
  const expertCategories = [
    {
      id: "1",
      nom: "Création d'entreprise",
      description:
        "Experts en accompagnement à la création et formalités légales",
      secteur: "Création d'entreprise",
      rating: 4.8,
      projets: 150,
      specialites: ["Statuts juridiques", "Immatriculation", "Business Plan"],
      experience: "10+ années",
      certification: "Expert-comptable",
    },
    {
      id: "2",
      nom: "Expert-comptable",
      description: "Comptabilité générale, déclarations fiscales, bilan annuel",
      secteur: "Comptabilité",
      rating: 4.9,
      projets: 300,
      specialites: ["Comptabilité générale", "TVA", "Bilan"],
      experience: "15+ années",
      certification: "DEC",
    },
    {
      id: "3",
      nom: "Avocat d'affaires",
      description:
        "Droit des sociétés, contrats commerciaux, propriété intellectuelle",
      secteur: "Juridique",
      rating: 4.7,
      projets: 200,
      specialites: ["Droit des sociétés", "Contrats", "PI"],
      experience: "12+ années",
      certification: "CAPA",
    },
    {
      id: "4",
      nom: "Consultant fiscal",
      description: "Optimisation fiscale, déclarations, conseil stratégique",
      secteur: "Fiscalité",
      rating: 4.6,
      projets: 180,
      specialites: ["Optimisation fiscale", "IS", "Impôts"],
      experience: "8+ années",
    },
    {
      id: "5",
      nom: "Auditeur certifié",
      description: "Audit comptable et financier, due diligence",
      secteur: "Audit",
      rating: 4.9,
      projets: 250,
      specialites: ["Audit financier", "Due diligence", "Contrôle"],
      experience: "20+ années",
      certification: "CAC",
    },
    {
      id: "6",
      nom: "Conseil en financement",
      description: "Montage de dossiers, recherche de subventions, prêts",
      secteur: "Financement",
      rating: 4.5,
      projets: 120,
      specialites: ["Subventions", "Prêts", "Levée de fonds"],
      experience: "6+ années",
    },
    {
      id: "7",
      nom: "Expert international",
      description: "Développement à l'international, implantation étrangère",
      secteur: "International",
      rating: 4.4,
      projets: 90,
      specialites: ["Export", "Implantation", "Douanes"],
      experience: "10+ années",
      languages: ["Anglais", "Espagnol"],
    },
    {
      id: "8",
      nom: "Consultant RH",
      description: "Recrutement, contrats de travail, convention collective",
      secteur: "RH",
      rating: 4.3,
      projets: 160,
      specialites: ["Recrutement", "Paie", "Droit du travail"],
      experience: "7+ années",
    },
  ];

  // Transformer les catégories en experts
  const transformToExpert = (category: any): ExpertPartenaire => {
    const secteur = category.secteur;
    const secteurIcon = secteurIcons[secteur] || Briefcase;

    const badgeLevel =
      category.projets > 250
        ? "Expert"
        : category.projets > 100
          ? "Confirmé"
          : "Junior";

    const badgeColors = {
      Expert: "#10B981",
      Confirmé: "#3B82F6",
      Junior: "#F59E0B",
    };

    return {
      id: category.id,
      nom: category.nom,
      description: category.description,
      secteur: secteur,
      secteurIcon: secteurIcon,
      rating: category.rating,
      projets: category.projets,
      badge: badgeLevel,
      badgeColor:
        badgeColors[badgeLevel as keyof typeof badgeColors] ||
        colors.primaryDark,
      specialites: category.specialites || [],
      experience: category.experience || "5+ années",
      certification: category.certification,
      languages: category.languages,
      location: {
        address: "Paris, France",
        lat: 48.8566 + (Math.random() * 0.1 - 0.05),
        lng: 2.3522 + (Math.random() * 0.1 - 0.05),
      },
    };
  };

  // Charger les experts
  useEffect(() => {
    const loadExperts = async () => {
      try {
        setLoading(true);
        // TODO: Remplacer par l'API réelle
        // const response = await ExpertService.getAllExperts();
        const expertsFromData = expertCategories.map(transformToExpert);

        setExperts(expertsFromData);
        setError(null);

        trackBusinessInteraction(
          "experts_loaded",
          "Experts chargés",
          "data_loaded",
          { count: expertsFromData.length },
        );
      } catch (err: any) {
        console.error("Erreur lors du chargement des experts:", err);
        setError("Impossible de charger les experts. Veuillez réessayer.");

        trackBusinessInteraction(
          "experts_error",
          "Erreur chargement experts",
          "error",
          { error: err.message },
        );
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, []);

  const handleFilterChange = (filter: FilterOption, value: string) => {
    if (filter.value === "specialite") {
      setSelectedSpecialite(value);
      setCurrentPage(1);
    }

    trackBusinessInteraction("expert_filter", filter.label, "filter_select", {
      filter: filter.value,
      value: value,
    });
    toast.info(`Filtre ${filter.label} sélectionné: ${value}`);
  };

  const handleCTAClick = () => {
    trackBusinessInteraction("become_expert", "Devenir expert", "cta_click");
    // TODO: Rediriger vers formulaire d'inscription expert
  };

  // Filtrer les experts par spécialité
  const filteredExperts =
    selectedSpecialite === "tous"
      ? experts
      : experts.filter((expert) =>
          expert.specialites.some((s) =>
            s.toLowerCase().includes(selectedSpecialite.toLowerCase()),
          ),
        );

  // Logique de pagination
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const indexOfLast = safeCurrentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExperts = filteredExperts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);

    const section = document.getElementById("experts");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
      id="experts"
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
            Nos{" "}
            <span style={{ color: colors.secondaryText }}>
              Experts & Partenaires
            </span>
          </h1>
          <p
            className="text-sm lg:text-sm max-w-2xl mx-auto mb-4 lg:mb-8"
            style={{ color: colors.textSecondary }}
          >
            Des professionnels qualifiés pour accompagner chaque étape de votre
            entreprise : création, développement, gestion et optimisation
          </p>
        </motion.div>

        {/* Filtres pour experts */}
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
                  onValueChange={(value: string) =>
                    handleFilterChange(filter, value)
                  }
                >
                  <SelectTrigger className="w-[240px] border-2 rounded-xl bg-white">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {filter.value === "specialite" && (
                      <>
                        <SelectItem value="tous">Toutes spécialités</SelectItem>
                        <SelectItem value="comptabilité">
                          Comptabilité
                        </SelectItem>
                        <SelectItem value="juridique">Juridique</SelectItem>
                        <SelectItem value="fiscalité">Fiscalité</SelectItem>
                        <SelectItem value="audit">Audit</SelectItem>
                        <SelectItem value="création">
                          Création d'entreprise
                        </SelectItem>
                        <SelectItem value="financement">Financement</SelectItem>
                        <SelectItem value="international">
                          International
                        </SelectItem>
                        <SelectItem value="rh">Ressources Humaines</SelectItem>
                      </>
                    )}
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
                Voir sur la carte
                <MapPin className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* États de chargement et erreur */}
        {loading && (
          <div className="text-center py-12">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: colors.primaryDark }}
            ></div>
            <p className="mt-4" style={{ color: colors.textSecondary }}>
              Chargement des experts...
            </p>
          </div>
        )}

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

        {/* Grille d'experts + pagination */}
        {!loading && !error && (
          <>
            {filteredExperts.length > 0 ? (
              <>
                <ExpertsGrid
                  experts={currentExperts}
                  handleContact={handleContact}
                  handlePartnerLocation={handlePartnerLocation}
                  colors={colors}
                />

                <SimplePagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  colors={colors}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p style={{ color: colors.textSecondary }}>
                  Aucun expert trouvé pour cette spécialité
                </p>
              </div>
            )}
          </>
        )}

        {/* Avantages de collaborer avec nos experts */}
        <AdvantagesSection colors={colors} />

        {/* CTA pour devenir expert partenaire */}
        <CTAButton onCTAClick={handleCTAClick} colors={colors} />
      </div>
    </motion.section>
  );
};

// Sous-composant Grille d'Experts
interface ExpertsGridProps {
  experts: ExpertPartenaire[];
  handleContact: (expert: ExpertPartenaire) => void;
  handlePartnerLocation: (expert: ExpertPartenaire) => void;
  colors: Colors;
}

const ExpertsGrid: React.FC<ExpertsGridProps> = ({
  experts,
  handleContact,
  handlePartnerLocation,
  colors,
}) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
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
    {experts.map((expert) => {
      const SecteurIcon = expert.secteurIcon;

      return (
        <motion.div
          key={expert.id}
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
            className="p-6 h-full rounded-2xl overflow-hidden relative hover:shadow-2xl transition-all duration-500 group flex flex-col"
            style={{
              borderColor: colors.separator,
              backgroundColor: colors.cardBg,
            }}
          >
            {/* Badge niveau d'expertise */}
            <motion.div
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold z-10"
              style={{
                backgroundColor: expert.badgeColor,
                color: colors.lightBg,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {expert.badge}
            </motion.div>

            {/* Icône de secteur */}
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

            {/* Contenu */}
            <div className="text-center flex flex-col h-full">
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                {expert.nom}
              </h3>

              {/* Certification */}
              {expert.certification && (
                <div className="mb-3 flex items-center justify-center gap-1">
                  <Award
                    className="h-4 w-4"
                    style={{ color: colors.secondaryText }}
                  />
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.secondaryText}10`,
                      color: colors.secondaryText,
                    }}
                  >
                    {expert.certification}
                  </span>
                </div>
              )}

              <p
                className="leading-relaxed text-sm mb-4"
                style={{ color: colors.textSecondary }}
              >
                {expert.description}
              </p>

              {/* Spécialités */}
              <div className="mb-4">
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: colors.primaryDark }}
                >
                  Spécialités :
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {expert.specialites.slice(0, 2).map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${colors.primaryDark}10`,
                        color: colors.primaryDark,
                        border: `1px solid ${colors.primaryDark}20`,
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                  {expert.specialites.length > 2 && (
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: colors.separator,
                        color: colors.textSecondary,
                      }}
                    >
                      +{expert.specialites.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Clock
                    className="h-4 w-4"
                    style={{ color: colors.textSecondary }}
                  />
                  <span style={{ color: colors.textSecondary }}>
                    Expérience : {expert.experience}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-4 w-4"
                      style={{ color: colors.warning }}
                    />
                    <span
                      className="font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {expert.rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle
                      className="h-4 w-4"
                      style={{ color: colors.success }}
                    />
                    <span style={{ color: colors.textSecondary }}>
                      {expert.projets} missions
                    </span>
                  </div>
                </div>
              </div>

              {/* Bouton de contact */}
              <motion.div className="mt-auto">
                <Button
                  className="w-full font-semibold rounded-xl gap-2 border-2 transition-all duration-300 py-3"
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
                  onClick={() => handleContact(expert)}
                >
                  CONTACTER L'EXPERT
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

// Avantages de collaborer avec nos experts
interface AdvantagesSectionProps {
  colors: Colors;
}

const AdvantagesSection: React.FC<AdvantagesSectionProps> = ({ colors }) => {
  const advantages: Advantage[] = [
    {
      title: "Expertise certifiée",
      description:
        "Tous nos partenaires sont diplômés et certifiés dans leur domaine",
      icon: Award,
      color: colors.primaryDark,
    },
    {
      title: "Accompagnement sur mesure",
      description:
        "Des solutions adaptées à la taille et aux besoins de votre entreprise",
      icon: Users,
      color: colors.secondaryText,
    },
    {
      title: "Suivi personnalisé",
      description: "Un interlocuteur dédié pour chaque mission",
      icon: MessageSquare,
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
        Pourquoi choisir nos experts ?
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

// CTA pour devenir expert
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
        Devenir Expert Partenaire
      </Button>
      <p className="mt-4 text-sm" style={{ color: colors.textSecondary }}>
        Rejoignez notre réseau d'experts et proposez vos services aux
        entreprises
      </p>
    </motion.div>
  </motion.div>
);

// Pagination simple
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  colors: Colors;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  colors,
}) => (
  <motion.div
    className="flex justify-center items-center gap-4 mb-16"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <Button
      variant="outline"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className="px-4 py-2 rounded-xl border-2 text-sm"
      style={{
        borderColor: colors.primaryDark,
        color: colors.primaryDark,
        opacity: currentPage === 1 ? 0.5 : 1,
      }}
    >
      Précédent
    </Button>

    <span style={{ color: colors.textPrimary }}>
      Page {currentPage} / {totalPages}
    </span>

    <Button
      variant="outline"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className="px-4 py-2 rounded-xl border-2 text-sm"
      style={{
        borderColor: colors.primaryDark,
        color: colors.primaryDark,
        opacity: currentPage === totalPages ? 0.5 : 1,
      }}
    >
      Suivant
    </Button>
  </motion.div>
);

export default PartnersSection;
