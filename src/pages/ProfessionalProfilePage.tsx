// pages/professional/[id].tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  TrendingUp,
  FileText,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Building,
  Briefcase,
  Euro,
  Zap,
  Target,
  Copy,
  AlertCircle,
  Sparkles,
  BadgeCheck,
  CalendarDays,
  UserCheck,
  Rocket,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { professionalProfileService } from "@/services/professionalProfile";
import { useAuth } from "@/hooks/useAuth";
import { DemandeDevisModal } from "@/components/DemandeDevisModal";
import { ContactModal } from "@/components/ContactModal";

interface ProfessionalProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  commercialName: string;
  address: string;
  city: string;
  zipCode: string;
  avatar: string;
  userType: string;
  ProfessionalSettings: {
    nomEntreprise: string;
    emailContact: string;
    telephone: string;
    adresse: string;
    horairesLundi: any;
    horairesMardi: any;
    horairesMercredi: any;
    horairesJeudi: any;
    horairesVendredi: any;
    horairesSamedi: any;
    horairesDimanche: any;
  } | null;
  metiers: Array<{
    metier: {
      id: number;
      libelle: string;
    };
  }>;
  services: Array<{
    service: {
      id: number;
      libelle: string;
      description: string;
      price: number;
      duration: number;
      category: {
        name: string;
      };
    };
  }>;
  Review: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
  }>;
}

interface ProfessionalStats {
  totalDemandes: number;
  demandesAcceptees: number;
  tauxAcceptation: number;
  totalAvis: number;
  noteMoyenne: number;
  totalServices: number;
  revenusTotaux: number;
}

// Thème des couleurs
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

// Fonction utilitaire accessible à tous les composants
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const formatHoraires = (horaires: any) => {
  if (!horaires) return "Non renseigné";
  if (!horaires.ouvert) return "Fermé";
  return `${horaires.debut} - ${horaires.fin}`;
};

const ProfessionalProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [stats, setStats] = useState<ProfessionalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFollowing, setIsFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDemandeModalOpen, setIsDemandeModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    // Ajouter les variables CSS au DOM
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --theme-logo: ${theme.logo};
        --theme-primary-dark: ${theme.primaryDark};
        --theme-separator: ${theme.separator};
        --theme-secondary-text: ${theme.secondaryText};
      }
    `;
    document.head.appendChild(style);
    
    if (id) {
      loadProfessionalData();
    }
    
    return () => {
      document.head.removeChild(style);
    };
  }, [id]);

  const loadProfessionalData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        professionalProfileService.getProfessionalProfile(id!),
        professionalProfileService.getProfessionalStats(id!),
      ]);

      setProfile(profileResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      console.error("Erreur chargement données professionnel:", err);
      setError("Impossible de charger le profil du professionnel");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${i < rating
          ? "text-[#8B4513] fill-[#8B4513]"
          : "text-gray-300"
          }`}
      />
    ));
  };

  const getHoraires = () => {
    if (!profile?.ProfessionalSettings) return null;
    const settings = profile.ProfessionalSettings;
    return [
      { jour: "Lundi", horaire: settings.horairesLundi },
      { jour: "Mardi", horaire: settings.horairesMardi },
      { jour: "Mercredi", horaire: settings.horairesMercredi },
      { jour: "Jeudi", horaire: settings.horairesJeudi },
      { jour: "Vendredi", horaire: settings.horairesVendredi },
      { jour: "Samedi", horaire: settings.horairesSamedi },
      { jour: "Dimanche", horaire: settings.horairesDimanche },
    ];
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExperienceLevel = () => {
    if (!stats) return "Débutant";
    if (stats.totalDemandes > 100) return "Expert";
    if (stats.totalDemandes > 50) return "Confirmé";
    if (stats.totalDemandes > 10) return "Intermédiaire";
    return "Débutant";
  };

  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsDemandeModalOpen(true);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card 
          className="p-8 text-center max-w-md w-full"
          style={{ borderColor: theme.separator }}
        >
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profil non trouvé
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Le professionnel demandé n'existe pas"}
          </p>
          <Button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: theme.logo,
              color: "white",
              borderColor: theme.logo
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </Card>
      </div>
    );
  }

  const horaires = getHoraires();
  const settings = profile.ProfessionalSettings;
  const experienceLevel = getExperienceLevel();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 mt-16">
        {/* Header avec navigation */}
        <header className="border-y border-gray-200 bg-white sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                style={{
                  color: theme.secondaryText,
                  borderColor: theme.separator
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyProfileLink}
                      style={{
                        color: theme.secondaryText,
                        borderColor: theme.separator
                      }}
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" style={{ color: theme.primaryDark }} />
                      ) : (
                        <Copy className="w-4 h-4" style={{ color: theme.secondaryText }} />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Lien copié !" : "Copier le lien"}</p>
                  </TooltipContent>
                </Tooltip>

                {user && user.id !== profile.id && (
                  <Button
                    size="sm"
                    onClick={() => setIsContactModalOpen(true)}
                    style={{
                      backgroundColor: theme.logo,
                      color: "white",
                      borderColor: theme.logo
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Section principale */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="relative lg:col-span-1 space-y-6">
              {/* Carte profil */}
              <div className="sticky top-24 flex flex-col gap-2">
                <Card 
                  className="relative p-6"
                  style={{ borderColor: theme.separator }}
                >
                  <div className="absolute top-0 overflow-hidden left-0 w-11/12 h-44 my-2 mx-4 rounded-lg bg-slate-900 -z-0">
                    {/* Avec bordure glow */}
                    <div className="absolute -bottom-16 rotate-[30deg] -left-4 w-56 h-56 bg-red-500/15 rounded-lg backdrop-blur-sm 
                shadow-[0_0_35px_rgba(239,68,68,0.5)] 
                border border-red-500/30 
                hover:shadow-[0_0_50px_rgba(239,68,68,0.7)] 
                hover:border-red-500/50 
                transition-all duration-500"></div>

                    {/* Avec bordure glow */}
                    <div className="absolute -top-20 -right-10 w-56 h-56 bg-orange-500/15 rounded-full backdrop-blur-sm 
                shadow-[0_0_40px_rgba(249,115,22,0.6)] 
                border border-orange-500/30 
                hover:shadow-[0_0_55px_rgba(249,115,22,0.8)] 
                hover:border-orange-500/50 
                transition-all duration-500"></div>
                  </div>
                  <div className="text-center">
                    {/* Avatar */}
                    <div className="mt-24 relative inline-block mb-4">
                      <Avatar className="w-28 h-28 border-4 shadow-md" style={{ borderColor: theme.primaryDark }}>
                        <AvatarImage
                          src={profile.avatar || ""}
                          className="object-cover"
                        />
                        <AvatarFallback style={{ backgroundColor: theme.primaryDark, color: "white" }} className="text-2xl font-bold">
                          {getInitials(
                            profile.firstName || "",
                            profile.lastName || ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h1 className="text-2xl font-bold mb-2" style={{ color: theme.secondaryText }}>
                      {profile.firstName} {profile.lastName}
                    </h1>

                    <p className="text-gray-600 mb-4">
                      {profile.commercialName ||
                        profile.companyName ||
                        "Professionnel"}
                    </p>

                    {/* Badge niveau d'expérience */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" 
                         style={{ backgroundColor: `${theme.primaryDark}20`, borderColor: theme.primaryDark }}>
                      <Rocket className="w-3 h-3" style={{ color: theme.primaryDark }} />
                      <span className="text-sm font-medium" style={{ color: theme.primaryDark }}>
                        {experienceLevel}
                      </span>
                    </div>

                    {/* Note moyenne */}
                    {stats && (
                      <div className="flex items-center justify-center gap-3 mb-6 p-4 rounded-lg" 
                           style={{ backgroundColor: `${theme.separator}20` }}>
                        <div className="flex">
                          {renderStars(Math.round(stats.noteMoyenne), "w-5 h-5")}
                        </div>
                        <div className="text-center">
                          <span className="font-bold text-2xl block leading-none" style={{ color: theme.secondaryText }}>
                            {stats.noteMoyenne.toFixed(1)}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ({stats.totalAvis} avis)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Badges métiers */}
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {profile.metiers.slice(0, 3).map(({ metier }) => (
                        <Badge
                          key={metier.id}
                          style={{
                            backgroundColor: `${theme.logo}20`,
                            color: theme.logo,
                            borderColor: theme.logo
                          }}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {metier.libelle}
                        </Badge>
                      ))}
                      {profile.metiers.length > 3 && (
                        <Badge
                          variant="outline"
                          style={{
                            color: theme.secondaryText,
                            borderColor: theme.separator
                          }}
                        >
                          +{profile.metiers.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Statut vérifié */}
                    <div className="flex items-center justify-center gap-2 mb-6 p-3 rounded-lg" 
                         style={{ backgroundColor: `${theme.primaryDark}20`, color: theme.primaryDark }}>
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm font-semibold">
                        Profil vérifié
                      </span>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-3 text-left rounded-lg p-4" style={{ backgroundColor: `${theme.separator}20` }}>
                      {settings?.telephone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.logo}20` }}>
                            <Phone className="w-4 h-4" style={{ color: theme.logo }} />
                          </div>
                          <span className="text-sm font-medium">
                            {settings.telephone}
                          </span>
                        </div>
                      )}

                      {settings?.emailContact && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.primaryDark}20` }}>
                            <Mail className="w-4 h-4" style={{ color: theme.primaryDark }} />
                          </div>
                          <span className="text-sm font-medium truncate">
                            {settings.emailContact}
                          </span>
                        </div>
                      )}

                      {settings?.adresse && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.secondaryText}20` }}>
                            <MapPin className="w-4 h-4" style={{ color: theme.secondaryText }} />
                          </div>
                          <span className="text-sm font-medium">
                            {settings.adresse}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Statistiques rapides */}
                {stats && (
                  <Card 
                    className="p-6"
                    style={{ borderColor: theme.separator }}
                  >
                    <h3 className="font-bold mb-6 flex items-center gap-3" style={{ color: theme.secondaryText }}>
                      <BarChart3 className="w-5 h-5" style={{ color: theme.logo }} />
                      Performance
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          icon: Target,
                          label: "Demandes",
                          value: stats.totalDemandes,
                          color: theme.logo,
                          bgColor: `${theme.logo}20`
                        },
                        {
                          icon: UserCheck,
                          label: "Acceptation",
                          value: `${stats.tauxAcceptation}%`,
                          color: theme.primaryDark,
                          bgColor: `${theme.primaryDark}20`
                        },
                        {
                          icon: Briefcase,
                          label: "Services",
                          value: stats.totalServices,
                          color: theme.secondaryText,
                          bgColor: `${theme.secondaryText}20`
                        },
                        {
                          icon: Star,
                          label: "Avis",
                          value: stats.totalAvis,
                          color: theme.logo,
                          bgColor: `${theme.logo}20`
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 rounded-lg"
                          style={{
                            backgroundColor: item.bgColor,
                            borderColor: theme.separator,
                            borderWidth: "1px"
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                              <item.icon className="w-4 h-4" style={{ color: item.color }} />
                            </div>
                            <span className="text-xs lg:text-sm font-medium" style={{ color: theme.secondaryText }}>
                              {item.label}
                            </span>
                          </div>
                          <span className="font-bold" style={{ color: item.color }}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Navigation par onglets */}
              <Card 
                className="p-2"
                style={{ borderColor: theme.separator }}
              >
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 p-1" style={{ backgroundColor: `${theme.separator}20` }}>
                    {[
                      { id: "overview", label: "Aperçu", icon: Building },
                      { id: "services", label: "Services", icon: Briefcase },
                      { id: "reviews", label: "Avis", icon: Star },
                      { id: "schedule", label: "Horaires", icon: CalendarDays },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          style={{
                            color: activeTab === tab.id ? theme.logo : theme.secondaryText,
                            backgroundColor: activeTab === tab.id ? "white" : "transparent",
                            borderColor: activeTab === tab.id ? theme.separator : "transparent"
                          }}
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="mt-6">
                    <TabsContent value="overview">
                      <OverviewTab profile={profile} stats={stats} />
                    </TabsContent>
                    <TabsContent value="services">
                      <ServicesTab
                        services={profile.services}
                        onServiceClick={handleServiceClick}
                      />
                    </TabsContent>
                    <TabsContent value="reviews">
                      <ReviewsTab reviews={profile.Review} />
                    </TabsContent>
                    <TabsContent value="schedule">
                      <ScheduleTab horaires={horaires} />
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedService && (
          <DemandeDevisModal
            isOpen={isDemandeModalOpen}
            onClose={() => {
              setIsDemandeModalOpen(false);
              setSelectedService(null);
            }}
            prestation={selectedService}
            artisanId={profile.id}
          />
        )}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          professional={profile}
        />
      </div>
    </TooltipProvider>
  );
};

// Composant pour l'onglet Aperçu
const OverviewTab = ({
  profile,
  stats,
}: {
  profile: ProfessionalProfile;
  stats: ProfessionalStats | null;
}) => (
  <div className="space-y-6">
    {/* Présentation */}
    <Card 
      className="p-8"
      style={{ borderColor: theme.separator }}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl" style={{ backgroundColor: `${theme.logo}20` }}>
          <Lightbulb className="w-6 h-6" style={{ color: theme.logo }} />
        </div>
        <div className="flex-1">
          <h2 className="text-md lg:text-2xl font-bold mb-4" style={{ color: theme.secondaryText }}>
            Présentation
          </h2>
          <p className="text-gray-700 lg:text-sm text-xs leading-relaxed">
            {profile.companyName
              ? `Expert en ${profile.metiers
                .map((m) => m.metier.libelle)
                .join(", ")} chez ${profile.companyName}. 
              Fort de ${stats?.totalDemandes || 0
              } demandes traitées avec un taux de satisfaction de ${stats?.tauxAcceptation || 0
              }%.`
              : `Professionnel spécialisé en ${profile.metiers
                .map((m) => m.metier.libelle)
                .join(", ")}. 
              Expérience éprouvée avec ${stats?.totalDemandes || 0
              } projets réalisés.`}
          </p>
        </div>
      </div>
    </Card>

    {/* Métiers et spécialités */}
    <Card 
      className="p-8"
      style={{ borderColor: theme.separator }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${theme.secondaryText}20` }}>
          <Award className="w-6 h-6" style={{ color: theme.secondaryText }} />
        </div>
        <h2 className="text-md lg:text-2xl font-bold" style={{ color: theme.secondaryText }}>
          Spécialités
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.metiers.map(({ metier }, index) => (
          <div
            key={metier.id}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-colors"
            style={{ 
              backgroundColor: `${theme.separator}20`,
              borderColor: theme.separator,
              borderWidth: "1px"
            }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.logo}20` }}>
              <Zap className="w-5 h-5" style={{ color: theme.logo }} />
            </div>
            <span className="lg:text-sm text-xs font-semibold" style={{ color: theme.secondaryText }}>
              {metier.libelle}
            </span>
          </div>
        ))}
      </div>
    </Card>

    {/* Statistiques détaillées */}
    {stats && (
      <Card 
        className="p-8"
        style={{ borderColor: theme.separator }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl" style={{ backgroundColor: `${theme.primaryDark}20` }}>
            <TrendingUp className="w-6 h-6" style={{ color: theme.primaryDark }} />
          </div>
          <h2 className="text-md lg:text-2xl font-bold" style={{ color: theme.secondaryText }}>
            Performance Détaillée
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: stats.totalDemandes,
              label: "Demandes",
              color: theme.logo,
              bgColor: `${theme.logo}20`,
              icon: Target,
            },
            {
              value: `${stats.tauxAcceptation}%`,
              label: "Acceptation",
              color: theme.primaryDark,
              bgColor: `${theme.primaryDark}20`,
              icon: UserCheck,
            },
            {
              value: stats.noteMoyenne.toFixed(1),
              label: "Note",
              color: theme.secondaryText,
              bgColor: `${theme.secondaryText}20`,
              icon: Star,
            },
            {
              value: stats.totalServices,
              label: "Services",
              color: theme.logo,
              bgColor: `${theme.logo}20`,
              icon: Briefcase,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: stat.bgColor,
                borderColor: theme.separator,
                borderWidth: "1px"
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div
                className="text-lg lg:text-3xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium" style={{ color: theme.secondaryText }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// Composant pour l'onglet Services
interface ServicesTabProps {
  services: ProfessionalProfile["services"];
  onServiceClick: (service: any) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onServiceClick,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${theme.logo}20` }}>
          <Briefcase className="w-6 h-6" style={{ color: theme.logo }} />
        </div>
        <h2 className="text-2xl font-bold" style={{ color: theme.secondaryText }}>
          Services Proposés
        </h2>
      </div>

      {services.length === 0 ? (
        <Card 
          className="p-12 text-center"
          style={{ borderColor: theme.separator }}
        >
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: theme.separator }} />
          <p style={{ color: theme.secondaryText }}>
            Aucun service disponible pour le moment
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ service }, index) => (
            <Card
              key={service.id}
              className="p-6 hover:shadow-md transition-shadow"
              style={{ borderColor: theme.separator }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-sm lg:text-xl" style={{ color: theme.secondaryText }}>
                  {service.libelle}
                </h3>
                {service.price && (
                  <Badge style={{
                    backgroundColor: `${theme.primaryDark}20`,
                    color: theme.primaryDark,
                    borderColor: theme.primaryDark
                  }}>
                    <Euro className="w-3 h-3 mr-1" />
                    {service.price}€
                  </Badge>
                )}
              </div>

              {service.category && (
                <Badge
                  variant="outline"
                  className="mb-4"
                  style={{
                    color: theme.secondaryText,
                    borderColor: theme.separator
                  }}
                >
                  {service.category.name}
                </Badge>
              )}

              {service.description && (
                <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              )}

              {service.duration && (
                <div className="flex items-center gap-2 text-sm rounded-lg p-2 mb-4" 
                     style={{ backgroundColor: `${theme.separator}20`, color: theme.secondaryText }}>
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {service.duration} minutes
                  </span>
                </div>
              )}

              <Button
                onClick={() => onServiceClick(service)}
                style={{
                  backgroundColor: theme.logo,
                  color: "white",
                  borderColor: theme.logo,
                  width: "100%"
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Demander un devis
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour l'onglet Avis
const ReviewsTab = ({
  reviews,
}: {
  reviews: ProfessionalProfile["Review"];
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating
          ? "text-[#8B4513] fill-[#8B4513]"
          : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${theme.secondaryText}20` }}>
          <Star className="w-6 h-6" style={{ color: theme.secondaryText }} />
        </div>
        <h2 className="text-md lg:text-2xl font-bold" style={{ color: theme.secondaryText }}>
          Avis Clients
        </h2>
      </div>

      {reviews.length === 0 ? (
        <Card 
          className="p-12 text-center"
          style={{ borderColor: theme.separator }}
        >
          <Star className="w-16 h-16 mx-auto mb-4" style={{ color: theme.separator }} />
          <p style={{ color: theme.secondaryText }}>Aucun avis pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card
              key={review.id}
              className="p-6"
              style={{ borderColor: theme.separator }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border-2" style={{ borderColor: theme.separator }}>
                  <AvatarImage src={review.user.avatar || ""} />
                  <AvatarFallback style={{ 
                    backgroundColor: theme.primaryDark, 
                    color: "white" 
                  }} className="font-semibold">
                    {getInitials(
                      review.user.firstName || "",
                      review.user.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h4 className="font-bold" style={{ color: theme.secondaryText }}>
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm rounded-full px-3 py-1" 
                          style={{ 
                            backgroundColor: `${theme.separator}20`, 
                            color: theme.secondaryText 
                          }}>
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="leading-relaxed rounded-2xl p-4" 
                       style={{ backgroundColor: `${theme.separator}20`, color: theme.secondaryText }}>
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour l'onglet Horaires
const ScheduleTab = ({ horaires }: { horaires: any[] | null }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${theme.primaryDark}20` }}>
        <CalendarDays className="w-6 h-6" style={{ color: theme.primaryDark }} />
      </div>
      <h2 className="text-md lg:text-2xl font-bold" style={{ color: theme.secondaryText }}>
        Horaires d'Ouverture
      </h2>
    </div>

    {!horaires ? (
      <Card 
        className="p-12 text-center"
        style={{ borderColor: theme.separator }}
      >
        <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: theme.separator }} />
        <p style={{ color: theme.secondaryText }}>Horaires non renseignés</p>
      </Card>
    ) : (
      <Card 
        className="p-8"
        style={{ borderColor: theme.separator }}
      >
        <div className="space-y-3">
          {horaires.map(({ jour, horaire }, index) => (
            <div
              key={jour}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 transition-colors"
              style={{ 
                backgroundColor: `${theme.separator}20`,
                borderColor: theme.separator,
                borderWidth: "1px"
              }}
            >
              <span className="font-semibold flex items-center gap-3" style={{ color: theme.secondaryText }}>
                <CalendarDays className="w-4 h-4" style={{ color: theme.secondaryText }} />
                {jour}
              </span>
              <span
                className="font-bold px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: horaire?.ouvert ? `${theme.primaryDark}20` : `${theme.logo}20`,
                  color: horaire?.ouvert ? theme.primaryDark : theme.logo,
                  borderColor: horaire?.ouvert ? theme.primaryDark : theme.logo,
                  borderWidth: "1px"
                }}
              >
                {formatHoraires(horaire)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// Composant Skeleton
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 text-gray-900 mt-20">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6" style={{ borderColor: theme.separator }}>
            <div className="text-center">
              <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-8 w-40 mx-auto mb-3" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-6 w-32 mx-auto mb-4" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-6 w-full mb-2 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-6 w-3/4 mx-auto mb-4 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-12 w-full mb-4 rounded-xl" style={{ backgroundColor: `${theme.separator}50` }} />
            </div>
          </Card>

          <Card className="p-6" style={{ borderColor: theme.separator }}>
            <Skeleton className="h-7 w-32 mb-6 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-xl"
                  style={{ backgroundColor: `${theme.separator}20` }}
                >
                  <Skeleton className="h-5 w-24 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
                  <Skeleton className="h-6 w-12 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-14 w-full rounded-2xl" style={{ backgroundColor: `${theme.separator}50` }} />

          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="p-8"
              style={{ borderColor: theme.separator }}
            >
              <Skeleton className="h-8 w-48 mb-6 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-6 w-full mb-3 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
              <Skeleton className="h-6 w-3/4 rounded-full" style={{ backgroundColor: `${theme.separator}50` }} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfessionalProfilePage;