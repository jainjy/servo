// pages/professionalProfilePage.tsx
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
  Map,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
import ProjectsTab from "@/components/components/ProjetProfessionnal";

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

  const renderStars = (rating: number, size = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
        <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] text-center max-w-md w-full shadow-sm">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Profil non trouvé
          </h2>
          <p className="text-[#8B4513] mb-6">
            {error || "Le professionnel demandé n'existe pas"}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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
      <div className="min-h-screen bg-[#FFFFFF] text-gray-900 mt-16">
        {/* Header avec navigation */}
        <header className=" border-y border-[#D3D3D3] bg-[#FFFFFF] sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-[#8B4513] hover:text-gray-900 hover:bg-[#6B8E23]/10"
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
                      className="text-[#8B4513] hover:text-gray-900 hover:bg-[#6B8E23]/10"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-[#556B2F]" />
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
                    className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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
        <div className=" container mx-auto px-4 py-8">
          <div className=" grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="relative lg:col-span-1 space-y-6">
              {/* Carte profil */}
              <div className="sticky top-24 flex flex-col gap-2">
                <Card className="relative p-6 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
                  <div className="absolute top-0 overflow-hidden left-0 w-11/12 h-44 my-2 mx-4 rounded-lg bg-[#556B2F]/20 -z-0">
                    {/* Avec bordure glow */}
                    <div
                      className="absolute -bottom-16 rotate-[30deg] -left-4 w-56 h-56 bg-[#6B8E23]/15 rounded-lg backdrop-blur-sm 
                shadow-[0_0_35px_rgba(107,142,35,0.5)] 
                border border-[#6B8E23]/30 
                hover:shadow-[0_0_50px_rgba(107,142,35,0.7)] 
                hover:border-[#6B8E23]/50 
                transition-all duration-500"
                    ></div>

                    {/* Avec bordure glow */}
                    <div
                      className="absolute -top-20 -right-10 w-56 h-56 bg-[#556B2F]/15 rounded-full backdrop-blur-sm 
                shadow-[0_0_40px_rgba(85,107,47,0.6)] 
                border border-[#556B2F]/30 
                hover:shadow-[0_0_55px_rgba(85,107,47,0.8)] 
                hover:border-[#556B2F]/50 
                transition-all duration-500"
                    ></div>
                  </div>
                  <div className=" text-center">
                    {/* Avatar */}
                    <div className="mt-24 relative inline-block mb-4">
                      <Avatar className="w-28 h-28 border-2 bg-white p-4 border-[#6B8E23] shadow-md">
                        <AvatarImage
                          src={profile.avatar || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-[#556B2F] text-white text-2xl font-bold">
                          {getInitials(
                            profile.firstName || "",
                            profile.lastName || ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {profile.firstName} {profile.lastName}
                    </h1>

                    <p className="text-[#8B4513] mb-4">
                      {profile.commercialName ||
                        profile.companyName ||
                        "Professionnel"}
                    </p>

                    {/* Badge niveau d'expérience */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B8E23]/10 border border-[#6B8E23]/20 mb-4">
                      <Rocket className="w-3 h-3 text-[#556B2F]" />
                      <span className="text-[#556B2F] text-sm font-medium">
                        {experienceLevel}
                      </span>
                    </div>

                    {/* Note moyenne */}
                    {stats && (
                      <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-[#6B8E23]/5 rounded-lg">
                        <div className="flex">
                          {renderStars(
                            Math.round(stats.noteMoyenne),
                            "w-5 h-5"
                          )}
                        </div>
                        <div className="text-center">
                          <span className="text-yellow-600 font-bold text-2xl block leading-none">
                            {stats.noteMoyenne.toFixed(1)}
                          </span>
                          <span className="text-[#8B4513] text-sm">
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
                          className="bg-[#6B8E23]/10 text-[#556B2F] border-[#6B8E23]/20"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {metier.libelle}
                        </Badge>
                      ))}
                      {profile.metiers.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[#8B4513] border-[#D3D3D3]"
                        >
                          +{profile.metiers.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Statut vérifié */}
                    <div className="flex items-center justify-center gap-2 text-[#556B2F] mb-6 p-3 bg-[#6B8E23]/5 rounded-lg">
                      <BadgeCheck className="w-5 h-5" />
                      <span className="text-sm font-semibold">
                        Profil vérifié
                      </span>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-3 text-left bg-[#6B8E23]/5 rounded-lg p-4">
                      {settings?.telephone && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                            <Phone className="w-4 h-4 text-[#556B2F]" />
                          </div>
                          <span className="text-sm font-medium">
                            {settings.telephone}
                          </span>
                        </div>
                      )}

                      {settings?.emailContact && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                            <Mail className="w-4 h-4 text-[#556B2F]" />
                          </div>
                          <span className="text-sm font-medium truncate">
                            {settings.emailContact}
                          </span>
                        </div>
                      )}

                      {settings?.adresse && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                            <MapPin className="w-4 h-4 text-[#556B2F]" />
                          </div>
                          <span className="text-xs font-medium">
                            {settings.adresse}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Statistiques rapides */}
                {stats && (
                  <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-[#556B2F]" />
                      Performance
                    </h3>

                    <div className="space-y-4">
                      {[
                        {
                          icon: Target,
                          label: "Demandes",
                          value: stats.totalDemandes,
                          color: "text-[#556B2F]",
                        },
                        {
                          icon: UserCheck,
                          label: "Acceptation",
                          value: `${stats.tauxAcceptation}%`,
                          color: "text-[#556B2F]",
                        },
                        {
                          icon: Briefcase,
                          label: "Services",
                          value: stats.totalServices,
                          color: "text-[#556B2F]",
                        },
                        {
                          icon: Star,
                          label: "Avis",
                          value: stats.totalAvis,
                          color: "text-[#556B2F]",
                        },
                      ].map((item, index) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-3 bg-[#6B8E23]/5 rounded-lg hover:bg-[#6B8E23]/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <span className="text-gray-700 text-xs lg:text-sm font-medium">
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
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-3 space-y-8">
              {/* Navigation par onglets */}
              <Card className="p-2 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-6 bg-[#6B8E23]/5 p-1">
                    {[
                      { id: "overview", label: "Aperçu", icon: Building },
                      { id: "services", label: "Services", icon: Briefcase },
                      { id: "projects", label: "Nos projets", icon: ImageIcon },
                      { id: "reviews", label: "Avis", icon: Star },
                      { id: "schedule", label: "Horaires", icon: CalendarDays },
                      { id: "location", label: "Localisation", icon: MapPin },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-[#FFFFFF] data-[state=active]:text-[#556B2F] data-[state=active]:shadow-sm data-[state=inactive]:text-[#8B4513] data-[state=inactive]:hover:text-gray-900"
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
                    <TabsContent value="projects">
                      <ProjectsTab professional={profile} />
                    </TabsContent>
                    <TabsContent value="reviews">
                      <ReviewsTab reviews={profile.Review} />
                    </TabsContent>
                    <TabsContent value="schedule">
                      <ScheduleTab horaires={horaires} />
                    </TabsContent>
                    <TabsContent value="location">
                      <LocationTab profile={profile} />
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
    <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-[#6B8E23]/10 rounded-2xl">
          <Lightbulb className="w-6 h-6 text-[#556B2F]" />
        </div>
        <div className="flex-1">
          <h2 className="text-md lg:text-2xl font-bold text-gray-900 mb-4">
            Présentation
          </h2>
          <p className="text-[#8B4513] lg:text-sm text-xs leading-relaxed">
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

    {/* Métiers et spécialités */}
    <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
          <Award className="w-6 h-6 text-[#556B2F]" />
        </div>
        <h2 className="text-md lg:text-2xl font-bold text-gray-900">
          Spécialités
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.metiers.map(({ metier }, index) => (
          <div
            key={metier.id}
            className="flex items-center gap-4 p-4 bg-[#6B8E23]/5 rounded-xl hover:bg-[#6B8E23]/10 transition-colors border border-[#D3D3D3]"
          >
            <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
              <Zap className="w-5 h-5 text-[#556B2F]" />
            </div>
            <span className="text-gray-900 lg:text-sm text-xs font-semibold">
              {metier.libelle}
            </span>
          </div>
        ))}
      </div>
    </Card>

    {/* Statistiques détaillées */}
    {stats && (
      <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
            <TrendingUp className="w-6 h-6 text-[#556B2F]" />
          </div>
          <h2 className="text-md lg:text-2xl font-bold text-gray-900">
            Performance Détaillée
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              value: stats.totalDemandes,
              label: "Demandes",
              color: "text-[#556B2F]",
              icon: Target,
            },
            {
              value: `${stats.tauxAcceptation}%`,
              label: "Acceptation",
              color: "text-[#556B2F]",
              icon: UserCheck,
            },
            {
              value: stats.noteMoyenne.toFixed(1),
              label: "Note",
              color: "text-[#556B2F]",
              icon: Star,
            },
            {
              value: stats.totalServices,
              label: "Services",
              color: "text-[#556B2F]",
              icon: Briefcase,
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-[#6B8E23]/5 rounded-2xl border border-[#D3D3D3] hover:bg-[#6B8E23]/10 transition-colors"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 bg-${
                  stat.color.split("-")[1]
                }-100 rounded-xl mb-3`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div
                className={`text-lg lg:text-3xl font-bold ${stat.color} mb-2`}
              >
                {stat.value}
              </div>
              <div className="text-[#8B4513] text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Card>
    )}
  </div>
);

// Composant pour la section Localisation avec Map
const LocationTab = ({ profile }: { profile: ProfessionalProfile }) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [loadingMap, setLoadingMap] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const geocodeAddress = async () => {
      try {
        setLoadingMap(true);
        setMapError(null);

        const address = profile.ProfessionalSettings?.adresse || profile.address;
        const city = profile.city;
        const fullAddress = `${address}, ${city}`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress
          )}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setCoordinates([parseFloat(lat), parseFloat(lon)]);
        } else {
          setMapError("Adresse non trouvée");
        }
      } catch (error) {
        console.error("Erreur géocodage:", error);
        setMapError("Impossible de charger la localisation");
      } finally {
        setLoadingMap(false);
      }
    };

    if (profile.ProfessionalSettings?.adresse || profile.address) {
      geocodeAddress();
    } else {
      setMapError("Adresse non disponible");
      setLoadingMap(false);
    }
  }, [profile]);

  // Fix pour les icones Leaflet
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  const address = profile.ProfessionalSettings?.adresse || profile.address;
  const zipCode = profile.zipCode;

  return (
    <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
          <MapPin className="w-6 h-6 text-[#556B2F]" />
        </div>
        <h2 className="text-md lg:text-2xl font-bold text-gray-900">
          Localisation
        </h2>
      </div>

      {loadingMap ? (
        <div className="p-12 bg-[#FFFFFF] border border-[#D3D3D3] text-center rounded-lg">
          <Skeleton className="h-96 w-full bg-[#6B8E23]/10 rounded-lg" />
          <p className="text-[#8B4513] mt-4">Chargement de la carte...</p>
        </div>
      ) : mapError || !coordinates ? (
        <div className="p-12 bg-[#FFFFFF] border border-[#D3D3D3] text-center rounded-lg">
          <MapPin className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
          <p className="text-[#8B4513]">{mapError || "Impossible de charger la carte"}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Information d'adresse */}
          <div className="flex items-start gap-4 p-6 bg-[#6B8E23]/5 rounded-lg border border-[#D3D3D3]">
            <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
              <MapPin className="w-5 h-5 text-[#556B2F]" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Adresse</h3>
              <p className="text-[#8B4513] text-sm font-medium">{address}</p>
              {zipCode && (
                <p className="text-[#8B4513]">{zipCode}</p>
              )}
            </div>
          </div>

          {/* Carte */}
          <div className="w-full h-96 rounded-lg overflow-hidden border border-[#D3D3D3] shadow-md">
            <MapContainer
              center={coordinates}
              zoom={15}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={coordinates}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold text-sm">{profile.firstName} {profile.lastName}</p>
                    <p className="text-xs text-gray-600">{address}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </Card>
  );
};

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
        <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
          <Briefcase className="w-6 h-6 text-[#556B2F]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Services Proposés</h2>
      </div>

      {services.length === 0 ? (
        <Card className="p-12 bg-[#FFFFFF] border border-[#D3D3D3] text-center shadow-sm">
          <FileText className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
          <p className="text-[#8B4513]">
            Aucun service disponible pour le moment
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ service }, index) => (
            <Card
              key={service.id}
              className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-sm lg:text-xl">
                  {service.libelle}
                </h3>
                {service.price && (
                  <Badge className="bg-[#6B8E23]/10 text-[#556B2F] border-[#6B8E23]/20">
                    <Euro className="w-3 h-3 mr-1" />
                    {service.price}€
                  </Badge>
                )}
              </div>

              {service.category && (
                <Badge
                  variant="outline"
                  className="mb-4 text-[#8B4513] border-[#D3D3D3]"
                >
                  {service.category.name}
                </Badge>
              )}

              {service.description && (
                <p className="text-[#8B4513] text-sm mb-4 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>
              )}

              {service.duration && (
                <div className="flex items-center gap-2 text-[#8B4513] text-sm bg-[#6B8E23]/5 rounded-lg p-2 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">
                    {service.duration} minutes
                  </span>
                </div>
              )}

              <Button
                onClick={() => onServiceClick(service)}
                className="w-full bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
          <Star className="w-6 h-6 text-[#556B2F]" />
        </div>
        <h2 className="text-md lg:text-2xl font-bold text-gray-900">
          Avis Clients
        </h2>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-12 bg-[#FFFFFF] border border-[#D3D3D3] text-center shadow-sm">
          <Star className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
          <p className="text-[#8B4513]">Aucun avis pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card
              key={review.id}
              className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm"
            >
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border-2 border-[#D3D3D3]">
                  <AvatarImage src={review.user.avatar || ""} />
                  <AvatarFallback className="bg-[#556B2F] text-white font-semibold">
                    {getInitials(
                      review.user.firstName || "",
                      review.user.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h4 className="font-bold text-gray-900">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-[#8B4513] text-sm bg-[#6B8E23]/5 rounded-full px-3 py-1">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-[#8B4513] leading-relaxed bg-[#6B8E23]/5 rounded-2xl p-4">
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
      <div className="p-2 bg-[#6B8E23]/10 rounded-xl">
        <CalendarDays className="w-6 h-6 text-[#556B2F]" />
      </div>
      <h2 className="text-md lg:text-2xl font-bold text-gray-900">
        Horaires d'Ouverture
      </h2>
    </div>

    {!horaires ? (
      <Card className="p-12 bg-[#FFFFFF] border border-[#D3D3D3] text-center shadow-sm">
        <Clock className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
        <p className="text-[#8B4513]">Horaires non renseignés</p>
      </Card>
    ) : (
      <Card className="p-8 bg-[#FFFFFF] border border-[#D3D3D3] shadow-sm">
        <div className="space-y-3">
          {horaires.map(({ jour, horaire }, index) => (
            <div
              key={jour}
              className="flex items-center justify-between p-4 bg-[#6B8E23]/5 rounded-xl hover:bg-[#6B8E23]/10 transition-colors border border-[#D3D3D3]"
            >
              <span className="font-semibold text-gray-900 flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-[#8B4513]" />
                {jour}
              </span>
              <span
                className={`font-bold px-4 py-2 rounded-lg ${
                  horaire?.ouvert
                    ? "bg-[#6B8E23]/10 text-[#556B2F] border border-[#6B8E23]/20"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
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
  <div className="min-h-screen bg-[#FFFFFF] text-gray-900 mt-20">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3]">
            <div className="text-center">
              <Skeleton className="w-28 h-28 rounded-full mx-auto mb-4 bg-[#6B8E23]/10" />
              <Skeleton className="h-8 w-40 mx-auto mb-3 bg-[#6B8E23]/10" />
              <Skeleton className="h-6 w-32 mx-auto mb-4 bg-[#6B8E23]/10" />
              <Skeleton className="h-6 w-full mb-2 bg-[#6B8E23]/10 rounded-full" />
              <Skeleton className="h-6 w-3/4 mx-auto mb-4 bg-[#6B8E23]/10 rounded-full" />
              <Skeleton className="h-12 w-full mb-4 bg-[#6B8E23]/10 rounded-xl" />
            </div>
          </Card>

          <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3]">
            <Skeleton className="h-7 w-32 mb-6 bg-[#6B8E23]/10 rounded-full" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-[#6B8E23]/5 rounded-xl"
                >
                  <Skeleton className="h-5 w-24 bg-[#6B8E23]/10 rounded-full" />
                  <Skeleton className="h-6 w-12 bg-[#6B8E23]/10 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-14 w-full bg-[#6B8E23]/10 rounded-2xl" />

          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-8 bg-[#FFFFFF] border border-[#D3D3D3]">
              <Skeleton className="h-8 w-48 mb-6 bg-[#6B8E23]/10 rounded-full" />
              <Skeleton className="h-6 w-full mb-3 bg-[#6B8E23]/10 rounded-full" />
              <Skeleton className="h-6 w-3/4 bg-[#6B8E23]/10 rounded-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfessionalProfilePage;
