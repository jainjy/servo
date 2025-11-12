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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { professionalProfileService } from "@/services/professionalProfile";
import { useAuth } from "@/hooks/useAuth";

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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
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

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <Card className="p-8 bg-gray-800 border-gray-700 text-center max-w-md w-full">
          <div className="text-red-400 mb-4">
            <Award className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Profil non trouvé
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "Le professionnel demandé n'existe pas"}
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white mt-16">
      {/* Header avec navigation */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-16 z-50 ">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            <div className="flex items-center gap-3">
              {user && user.id !== profile.id && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
          <div className="lg:col-span-1 space-y-6">
            {/* Carte profil */}
            <Card className="p-6 bg-gray-800 border-gray-700">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-gray-700">
                  <AvatarImage src={profile.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl">
                    {getInitials(
                      profile.firstName || "",
                      profile.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>

                <h1 className="text-xl font-bold text-white mb-2">
                  {profile.firstName} {profile.lastName}
                </h1>

                <p className="text-gray-400 mb-4">
                  {profile.commercialName ||
                    profile.companyName ||
                    "Professionnel"}
                </p>

                {/* Note moyenne */}
                {stats && (
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(Math.round(stats.noteMoyenne))}
                    </div>
                    <span className="text-yellow-400 font-semibold">
                      {stats.noteMoyenne.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({stats.totalAvis} avis)
                    </span>
                  </div>
                )}

                {/* Badges métiers */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {profile.metiers.slice(0, 3).map(({ metier }) => (
                    <Badge
                      key={metier.id}
                      variant="secondary"
                      className="bg-blue-600/20 text-blue-400 border-blue-600/30"
                    >
                      {metier.libelle}
                    </Badge>
                  ))}
                  {profile.metiers.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-gray-400 border-gray-600"
                    >
                      +{profile.metiers.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Statut vérifié */}
                <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Profil vérifié</span>
                </div>

                {/* Informations de contact */}
                <div className="space-y-3 text-left">
                  {settings?.telephone && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{settings.telephone}</span>
                    </div>
                  )}

                  {settings?.emailContact && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-sm truncate">
                        {settings.emailContact}
                      </span>
                    </div>
                  )}

                  {settings?.adresse && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">{settings.adresse}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Statistiques rapides */}
            {stats && (
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Statistiques
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Demandes</span>
                    <span className="text-white font-semibold">
                      {stats.totalDemandes}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">
                      Taux d'acceptation
                    </span>
                    <span className="text-green-400 font-semibold">
                      {stats.tauxAcceptation}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Services</span>
                    <span className="text-white font-semibold">
                      {stats.totalServices}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Avis</span>
                    <span className="text-white font-semibold">
                      {stats.totalAvis}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-8">
            {/* Navigation par onglets */}
            <Card className="p-1 bg-gray-800 border-gray-700">
              <div className="flex space-x-1">
                {[
                  { id: "overview", label: "Aperçu", icon: Building },
                  { id: "services", label: "Services", icon: Briefcase },
                  { id: "reviews", label: "Avis", icon: Star },
                  { id: "schedule", label: "Horaires", icon: Clock },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Contenu des onglets */}
            <div className="animate-fadeIn">
              {activeTab === "overview" && (
                <OverviewTab profile={profile} stats={stats} />
              )}
              {activeTab === "services" && (
                <ServicesTab services={profile.services} />
              )}
              {activeTab === "reviews" && (
                <ReviewsTab reviews={profile.Review} />
              )}
              {activeTab === "schedule" && <ScheduleTab horaires={horaires} />}
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <Card className="p-6 bg-gray-800 border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Présentation</h2>
      <p className="text-gray-300 leading-relaxed">
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
    </Card>

    {/* Métiers et spécialités */}
    <Card className="p-6 bg-gray-800 border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Spécialités</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.metiers.map(({ metier }) => (
          <div
            key={metier.id}
            className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg"
          >
            <Award className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">{metier.libelle}</span>
          </div>
        ))}
      </div>
    </Card>

    {/* Statistiques détaillées */}
    {stats && (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <h2 className="text-xl font-bold text-white mb-6">Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">
              {stats.totalDemandes}
            </div>
            <div className="text-gray-400 text-sm">Demandes totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {stats.tauxAcceptation}%
            </div>
            <div className="text-gray-400 text-sm">Taux d'acceptation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {stats.noteMoyenne.toFixed(1)}
            </div>
            <div className="text-gray-400 text-sm">Note moyenne</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">
              {stats.totalServices}
            </div>
            <div className="text-gray-400 text-sm">Services proposés</div>
          </div>
        </div>
      </Card>
    )}
  </div>
);

// Composant pour l'onglet Services
const ServicesTab = ({
  services,
}: {
  services: ProfessionalProfile["services"];
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-white mb-6">Services proposés</h2>

    {services.length === 0 ? (
      <Card className="p-8 bg-gray-800 border-gray-700 text-center">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Aucun service disponible pour le moment</p>
      </Card>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(({ service }) => (
          <Card
            key={service.id}
            className="p-6 bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-white text-lg">
                {service.libelle}
              </h3>
              {service.price && (
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                  <Euro className="w-3 h-3 mr-1" />
                  {service.price}€
                </Badge>
              )}
            </div>

            {service.category && (
              <Badge
                variant="outline"
                className="mb-3 text-gray-400 border-gray-600"
              >
                {service.category.name}
              </Badge>
            )}

            {service.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
            )}

            {service.duration && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                {service.duration} min
              </div>
            )}
          </Card>
        ))}
      </div>
    )}
  </div>
);

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
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white mb-6">Avis clients</h2>

      {reviews.length === 0 ? (
        <Card className="p-8 bg-gray-800 border-gray-700 text-center">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Aucun avis pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6 bg-gray-800 border-gray-700">
              <div className="flex items-start gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.user.avatar || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    {getInitials(
                      review.user.firstName || "",
                      review.user.lastName || ""
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h4 className="font-semibold text-white">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  {review.comment && (
                    <p className="text-gray-300 leading-relaxed">
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
    <h2 className="text-xl font-bold text-white mb-6">Horaires d'ouverture</h2>

    {!horaires ? (
      <Card className="p-8 bg-gray-800 border-gray-700 text-center">
        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Horaires non renseignés</p>
      </Card>
    ) : (
      <Card className="p-6 bg-gray-800 border-gray-700">
        <div className="space-y-4">
          {horaires.map(({ jour, horaire }) => (
            <div
              key={jour}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0"
            >
              <span className="font-medium text-white">{jour}</span>
              <span
                className={`${
                  horaire?.ouvert ? "text-green-400" : "text-red-400"
                } font-semibold`}
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

// Composant Skeleton pour le chargement
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <div className="text-center">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-700" />
              <Skeleton className="h-6 w-32 mx-auto mb-2 bg-gray-700" />
              <Skeleton className="h-4 w-24 mx-auto mb-4 bg-gray-700" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
              <Skeleton className="h-4 w-3/4 mx-auto bg-gray-700" />
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <Skeleton className="h-6 w-24 mb-4 bg-gray-700" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-gray-700" />
                  <Skeleton className="h-4 w-10 bg-gray-700" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-3 space-y-6">
          <Skeleton className="h-12 w-full bg-gray-700 rounded-lg" />

          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 bg-gray-800 border-gray-700">
              <Skeleton className="h-6 w-32 mb-4 bg-gray-700" />
              <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
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
