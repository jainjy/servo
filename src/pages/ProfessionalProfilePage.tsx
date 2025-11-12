// pages/professional/[id].tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Award,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  ArrowLeft,
  Share2,
  MessageCircle,
  Building,
  Briefcase,
  Euro,
  Zap,
  Target,
  Heart,
  Send,
  ExternalLink,
  Copy,
  ThumbsUp,
  AlertCircle,
  Shield,
  Clock4,
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
import { DemandeDevisModal } from "@/components/DemandeDevis";
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
    if (id) {
      loadProfessionalData();
    }
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating
            ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
            : "text-gray-600"
        } transition-all duration-300`}
      />
    ));
  };

  const formatHoraires = (horaires: any) => {
    if (!horaires) return "Non renseigné";
    if (!horaires.ouvert) return "Fermé";
    return `${horaires.debut} - ${horaires.fin}`;
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

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-800/80 backdrop-blur-xl border-gray-700/50 text-center max-w-md w-full shadow-2xl transform hover:scale-105 transition-all duration-300">
          <div className="text-red-400/80 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto drop-shadow-lg" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Profil non trouvé
          </h2>
          <p className="text-gray-300 mb-6">
            {error || "Le professionnel demandé n'existe pas"}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white mt-16">
        {/* Header avec navigation amélioré */}
        <header className="border-b border-gray-700/50 bg-gray-900/90 backdrop-blur-xl sticky top-16 z-50 shadow-2xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-gray-300 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour
              </Button>

              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyProfileLink}
                      className="text-gray-300 hover:text-white hover:bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-300"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Contacter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Section principale avec design amélioré */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar améliorée */}
            <div className="lg:col-span-1 space-y-6">
              {/* Carte profil avec glassmorphism */}
              <Card className="p-6 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="text-center">
                  {/* Avatar avec effet de halo */}
                  <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    <Avatar className="w-28 h-28 border-4 border-gray-800/50 relative z-10 transform hover:scale-105 transition-transform duration-300">
                      <AvatarImage
                        src={profile.avatar || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold">
                        {getInitials(
                          profile.firstName || "",
                          profile.lastName || ""
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    {profile.firstName} {profile.lastName}
                  </h1>

                  <p className="text-gray-300 mb-4 text-lg">
                    {profile.commercialName ||
                      profile.companyName ||
                      "Professionnel"}
                  </p>

                  {/* Badge niveau d'expérience */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4">
                    <Rocket className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-sm font-medium">
                      {experienceLevel}
                    </span>
                  </div>

                  {/* Note moyenne améliorée */}
                  {stats && (
                    <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-gray-700/30 rounded-2xl backdrop-blur-sm">
                      <div className="flex">
                        {renderStars(Math.round(stats.noteMoyenne), "w-5 h-5")}
                      </div>
                      <div className="text-center">
                        <span className="text-yellow-400 font-bold text-2xl block leading-none">
                          {stats.noteMoyenne.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-sm">
                          ({stats.totalAvis} avis)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Badges métiers améliorés */}
                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {profile.metiers.slice(0, 3).map(({ metier }) => (
                      <Badge
                        key={metier.id}
                        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        {metier.libelle}
                      </Badge>
                    ))}
                    {profile.metiers.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-gray-400 border-gray-600 backdrop-blur-sm"
                      >
                        +{profile.metiers.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Statut vérifié amélioré */}
                  <div className="flex items-center justify-center gap-2 text-green-400/90 mb-6 p-3 bg-green-500/10 rounded-xl backdrop-blur-sm">
                    <BadgeCheck className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      Profil vérifié
                    </span>
                  </div>

                  {/* Informations de contact améliorées */}
                  <div className="space-y-3 text-left bg-gray-700/20 rounded-2xl p-4 backdrop-blur-sm">
                    {settings?.telephone && (
                      <div className="flex items-center gap-3 text-gray-200 group hover:text-white transition-colors duration-200">
                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                          <Phone className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium">
                          {settings.telephone}
                        </span>
                      </div>
                    )}

                    {settings?.emailContact && (
                      <div className="flex items-center gap-3 text-gray-200 group hover:text-white transition-colors duration-200">
                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                          <Mail className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {settings.emailContact}
                        </span>
                      </div>
                    )}

                    {settings?.adresse && (
                      <div className="flex items-center gap-3 text-gray-200 group hover:text-white transition-colors duration-200">
                        <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                          <MapPin className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm font-medium">
                          {settings.adresse}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Statistiques rapides améliorées */}
              {stats && (
                <Card className="p-6 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-lg">
                    <BarChart3 className="w-5 h-5 text-blue-400" />
                    Performance
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        icon: Target,
                        label: "Demandes",
                        value: stats.totalDemandes,
                        color: "text-blue-400",
                      },
                      {
                        icon: UserCheck,
                        label: "Acceptation",
                        value: `${stats.tauxAcceptation}%`,
                        color: "text-green-400",
                      },
                      {
                        icon: Briefcase,
                        label: "Services",
                        value: stats.totalServices,
                        color: "text-purple-400",
                      },
                      {
                        icon: Star,
                        label: "Avis",
                        value: stats.totalAvis,
                        color: "text-yellow-400",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-xl backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-600/50 rounded-lg group-hover:scale-110 transition-transform">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <span className="text-gray-300 text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        <span className={`font-bold ${item.color}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Contenu principal amélioré */}
            <div className="lg:col-span-3 space-y-8">
              {/* Navigation par onglets améliorée */}
              <Card className="p-2 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 bg-gray-700/30 backdrop-blur-sm p-1">
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
                          className="flex items-center gap-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white data-[state=inactive]:hover:bg-gray-700/50"
                        >
                          <Icon className="w-4 h-4" />
                          {tab.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="mt-6 animate-in fade-in duration-500">
                    <TabsContent value="overview">
                      <OverviewTab profile={profile} stats={stats} />
                    </TabsContent>
                    <TabsContent value="services">
                      <ServicesTab services={profile.services} setSelectedService={setSelectedService} setIsDemandeModalOpen={setIsDemandeModalOpen} />
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
        />
      )}

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        professional={profile}
      />
    </TooltipProvider>
  );
};

// Composant pour l'onglet Aperçu amélioré
const OverviewTab = ({
  profile,
  stats,
}: {
  profile: ProfessionalProfile;
  stats: ProfessionalStats | null;
}) => (
  <div className="space-y-6">
    {/* Présentation améliorée */}
    <Card className="p-8 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl">
          <Lightbulb className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Présentation
          </h2>
          <p className="text-gray-300 leading-relaxed text-lg">
            {profile.companyName
              ? `Expert en ${profile.metiers
                  .map((m) => m.metier.libelle)
                  .join(", ")} chez ${profile.companyName}. 
              Fort de ${
                stats?.totalDemandes || 0
              } demandes traitées avec un taux de satisfaction de ${
                  stats?.tauxAcceptation || 0
                }%.`
              : `Professionnel spécialisé en ${profile.metiers
                  .map((m) => m.metier.libelle)
                  .join(", ")}. 
              Expérience éprouvée avec ${
                stats?.totalDemandes || 0
              } projets réalisés.`}
          </p>
        </div>
      </div>
    </Card>

    {/* Métiers et spécialités améliorés */}
    <Card className="p-8 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
          <Award className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Spécialités
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.metiers.map(({ metier }, index) => (
          <div
            key={metier.id}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-700/50 to-gray-600/30 rounded-xl backdrop-blur-sm hover:from-gray-700/70 hover:to-gray-600/50 transition-all duration-300 group hover:scale-105 border border-gray-600/30"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-white font-semibold text-lg">
              {metier.libelle}
            </span>
          </div>
        ))}
      </div>
    </Card>

    {/* Statistiques détaillées améliorées */}
    {stats && (
      <Card className="p-8 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Performance Détaillée
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: stats.totalDemandes,
              label: "Demandes",
              color: "from-blue-500 to-cyan-500",
              icon: Target,
            },
            {
              value: `${stats.tauxAcceptation}%`,
              label: "Acceptation",
              color: "from-green-500 to-emerald-500",
              icon: UserCheck,
            },
            {
              value: stats.noteMoyenne.toFixed(1),
              label: "Note",
              color: "from-yellow-500 to-orange-500",
              icon: Star,
            },
            {
              value: stats.totalServices,
              label: "Services",
              color: "from-purple-500 to-pink-500",
              icon: Briefcase,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-gradient-to-br from-gray-700/50 to-gray-600/30 rounded-2xl backdrop-blur-sm hover:scale-105 transition-all duration-500 border border-gray-600/30 group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              >
                {stat.value}
              </div>
              <div className="text-gray-300 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// Composant pour l'onglet Services amélioré
// Composant pour l'onglet Services amélioré
const ServicesTab = ({
  services,
  setSelectedService,
  setIsDemandeModalOpen,
}: {
  services: ProfessionalProfile["services"];
  setSelectedService;
  setIsDemandeModalOpen;
}) => {
  const handleServiceClick = (service: any) => {
    setSelectedService(service.service);
    setIsDemandeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
          <Briefcase className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Services Proposés
        </h2>
      </div>

      {services.length === 0 ? (
        <Card className="p-12 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 text-center shadow-2xl">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            Aucun service disponible pour le moment
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ service }, index) => (
            <Card
              key={service.id}
              className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-white text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                  {service.libelle}
                </h3>
                {service.price && (
                  <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                    <Euro className="w-3 h-3 mr-1" />
                    {service.price}€
                  </Badge>
                )}
              </div>

              {service.category && (
                <Badge
                  variant="outline"
                  className="mb-4 text-gray-400 border-gray-600 backdrop-blur-sm"
                >
                  {service.category.name}
                </Badge>
              )}

              {service.description && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              )}

              {service.duration && (
                <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-700/30 rounded-lg p-2 backdrop-blur-sm mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {service.duration} minutes
                  </span>
                </div>
              )}

              {/* Bouton pour ouvrir le modal de demande */}
              <Button
                onClick={() => handleServiceClick(service)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Demander un devis
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant pour l'onglet Avis amélioré
const ReviewsTab = ({
  reviews,
}: {
  reviews: ProfessionalProfile["Review"];
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
            : "text-gray-600"
        } transition-all duration-300`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
          <Star className="w-6 h-6 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Avis Clients
        </h2>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 text-center shadow-2xl">
          <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucun avis pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card
              key={review.id}
              className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border-2 border-gray-600/50">
                  <AvatarImage src={review.user.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                    {getInitials(
                      review.user.firstName || "",
                      review.user.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h4 className="font-bold text-white text-lg">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-400 text-sm bg-gray-700/30 rounded-full px-3 py-1 backdrop-blur-sm">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-gray-300 leading-relaxed text-lg bg-gray-700/20 rounded-2xl p-4 backdrop-blur-sm">
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

// Composant pour l'onglet Horaires amélioré
const ScheduleTab = ({ horaires }: { horaires: any[] | null }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-8">
      <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
        <CalendarDays className="w-6 h-6 text-cyan-400" />
      </div>
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
        Horaires d'Ouverture
      </h2>
    </div>

    {!horaires ? (
      <Card className="p-12 bg-gray-800/60 backdrop-blur-xl border-gray-700/50 text-center shadow-2xl">
        <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Horaires non renseignés</p>
      </Card>
    ) : (
      <Card className="p-8 bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl border-gray-700/50 shadow-2xl">
        <div className="space-y-3">
          {horaires.map(({ jour, horaire }, index) => (
            <div
              key={jour}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 group border border-gray-600/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="font-semibold text-white text-lg flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                {jour}
              </span>
              <span
                className={`font-bold text-lg px-4 py-2 rounded-lg backdrop-blur-sm ${
                  horaire?.ouvert
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                } transition-all duration-300 group-hover:scale-105`}
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

// Composant Skeleton amélioré
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton amélioré */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-gray-800/60 backdrop-blur-xl border-gray-700/50">
            <div className="text-center">
              <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4 bg-gray-700/50" />
              <Skeleton className="h-8 w-40 mx-auto mb-3 bg-gray-700/50" />
              <Skeleton className="h-6 w-32 mx-auto mb-4 bg-gray-700/50" />
              <Skeleton className="h-6 w-full mb-2 bg-gray-700/50 rounded-full" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-4 bg-gray-700/50 rounded-full" />
              <Skeleton className="h-12 w-full mb-4 bg-gray-700/50 rounded-xl" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800/60 backdrop-blur-xl border-gray-700/50">
            <Skeleton className="h-7 w-32 mb-6 bg-gray-700/50 rounded-full" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl"
                >
                  <Skeleton className="h-5 w-24 bg-gray-700/50 rounded-full" />
                  <Skeleton className="h-6 w-12 bg-gray-700/50 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton amélioré */}
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-14 w-full bg-gray-700/50 rounded-2xl" />

          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="p-8 bg-gray-800/60 backdrop-blur-xl border-gray-700/50"
            >
              <Skeleton className="h-8 w-48 mb-6 bg-gray-700/50 rounded-full" />
              <Skeleton className="h-6 w-full mb-3 bg-gray-700/50 rounded-full" />
              <Skeleton className="h-6 w-3/4 bg-gray-700/50 rounded-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Fonction utilitaire pour les initiales
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

// Fonction utilitaire pour formater les horaires
const formatHoraires = (horaires: any) => {
  if (!horaires) return "Non renseigné";
  if (!horaires.ouvert) return "Fermé";
  return `${horaires.debut} - ${horaires.fin}`;
};

export default ProfessionalProfilePage;
