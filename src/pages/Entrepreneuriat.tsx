// pages/Entrepreneuriat.tsx - VERSION MISE À JOUR
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayCircle,
  Users,
  TrendingUp,
  Briefcase,
  DollarSign,
  Lightbulb,
  ChevronRight,
  Calendar,
  User,
  Building,
  Target,
  FileText,
  Video,
  Headphones,
  BookOpen,
  Globe,
  Coffee,
  Award,
  Rocket,
  Download,
  ExternalLink,
  Clock,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TourismNavigation from "@/components/TourismNavigation";
import EntrepreneuriatService from "@/services/entrepreneuriatService";

// Interfaces mises à jour
interface Interview {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  excerpt?: string;
  guest: string;
  role: string;
  company: string;
  duration: string;
  date: string;
  tags: string[];
  category: string;
  imageUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  status: string;
  isFeatured: boolean;
  views: number;
  listens: number;
  shares: number;
  likes: number;
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "tool" | "checklist";
  category: string;
  fileUrl: string;
  fileSize?: string;
  fileType?: string;
  thumbnailUrl?: string;
  tags: string[];
  downloads: number;
  isFree: boolean;
  status: string;
  isFeatured: boolean;
  author?: {
    id: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  format: "webinar" | "workshop" | "networking" | "conference";
  date: string;
  time: string;
  duration?: string;
  speakers: string[];
  speakerRoles: string[];
  registered: number;
  maxParticipants?: number;
  isRegistrationOpen: boolean;
  location?: string;
  onlineLink?: string;
  recordingUrl?: string;
  status: string;
  organizer?: {
    id: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    avatar?: string;
  };
}

interface Stats {
  interviews: number;
  entrepreneurs: number;
  resources: number;
  events: number;
  downloads: number;
  featuredInterviews: Interview[];
  recentEvents: Event[];
}

const Entrepreneuriat = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("tous");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtres disponibles
  const filters = [
    { id: "tous", label: "Tous", icon: <Globe className="w-4 h-4" /> },
    {
      id: "jeunes",
      label: "Jeunes entrepreneurs",
      icon: <Rocket className="w-4 h-4" />,
    },
    {
      id: "experimentes",
      label: "Patrons expérimentés",
      icon: <Award className="w-4 h-4" />,
    },
    {
      id: "politiques",
      label: "Politiques",
      icon: <Building className="w-4 h-4" />,
    },
    {
      id: "success",
      label: "Success stories",
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    loadPageData();
  }, [activeFilter]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les données en parallèle
      const [interviewsRes, resourcesRes, eventsRes, statsRes] =
        await Promise.all([
          EntrepreneuriatService.getInterviews({
            category: activeFilter !== "tous" ? activeFilter : undefined,
            limit: 12,
          }),
          EntrepreneuriatService.getResources({ limit: 8 }),
          EntrepreneuriatService.getEvents({ upcoming: "true", limit: 6 }),
          EntrepreneuriatService.getStats(),
        ]);

      setInterviews(interviewsRes.data);
      setResources(resourcesRes.data);
      setEvents(eventsRes.data);
      setStats(statsRes.data);
    } catch (err: any) {
      console.error("Erreur chargement données:", err);
      setError(err.response?.data?.error || "Erreur de chargement des données");

      // Données de secours
      setInterviews([]);
      setResources([]);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews =
    activeFilter === "tous"
      ? interviews
      : interviews.filter((interview) => interview.category === activeFilter);

  const handlePlayInterview = async (interview: Interview) => {
    try {
      // Enregistrer l'interaction "view"
      if (interview.videoUrl) {
        await EntrepreneuriatService.trackInteraction(interview.id, "view");
        window.open(interview.videoUrl, "_blank");
      } else if (interview.audioUrl) {
        await EntrepreneuriatService.trackInteraction(
          interview.id,
          "listen",
          0
        );
        window.open(interview.audioUrl, "_blank");
      }
    } catch (error) {
      console.error("Erreur ouverture interview:", error);
    }
  };

  const handleDownloadResource = async (resource: Resource) => {
    try {
      const downloadData = await EntrepreneuriatService.downloadResource(
        resource.id
      );

      // Simuler le téléchargement
      const link = document.createElement("a");
      link.href = downloadData.data.downloadUrl;
      link.download = downloadData.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur téléchargement ressource:", error);
      alert("Erreur lors du téléchargement");
    }
  };

  const handleRegisterEvent = async (event: Event) => {
    try {
      const result = await EntrepreneuriatService.registerToEvent(event.id);

      if (result.success) {
        alert("Inscription enregistrée avec succès !");
        // Recharger les événements pour mettre à jour le compteur
        const eventsRes = await EntrepreneuriatService.getEvents();
        setEvents(eventsRes.data);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  const handleSuggestInterview = () => {
    navigate("/suggest-interview");
  };

  const handleSubmitProject = () => {
    navigate("/entrepreneuriat/projet");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    return `Il y a ${Math.floor(diffDays / 365)} ans`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5F5F5] to-[#E8E8E8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#556B2F] mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des interviews...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-[#F5F5F5] to-[#E8E8E8] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={loadPageData}
            className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5F5F5] to-[#E8E8E8]">
      {/* Hero Section */}
      <section
        className="relative mt-16 pt-20 pb-16 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(107, 142, 35, 0.85)",
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-[#556B2F] hover:bg-[#556B2F]/90 text-white px-4 py-1 text-sm font-medium">
              L'esprit d'entreprendre
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Entrepreneuriat
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Découvrez les parcours inspirants, les conseils pratiques et les
              ressources pour lancer et développer votre entreprise
            </p>
          </motion.div>
          <TourismNavigation page="inspirer" />
        </div>
      </section>

      {/* Statistiques */}
      {stats && (
        <section className="py-12 bg-[#6B8E23]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  icon: <Video className="w-8 h-8" />,
                  value: `${stats.interviews}+`,
                  label: "Interviews",
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  value: `${stats.entrepreneurs}+`,
                  label: "Entrepreneurs",
                },
                {
                  icon: <Headphones className="w-8 h-8" />,
                  value: `${Math.floor(stats.downloads / 1000)}K+`,
                  label: "Téléchargements",
                },
                {
                  icon: <BookOpen className="w-8 h-8" />,
                  value: `${stats.resources}+`,
                  label: "Ressources gratuites",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-[#8B4513] mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-[#556B2F]">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filtres */}
      <section className="py-8 sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-[#D3D3D3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  activeFilter === filter.id
                    ? "bg-[#556B2F] text-white hover:bg-[#556B2F]/90"
                    : "border-[#D3D3D3] text-gray-700 hover:bg-[#6B8E23]/10 hover:text-[#556B2F]"
                }`}
              >
                {filter.icon}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Interviews */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <PlayCircle className="mr-2 text-[#556B2F]" />
              Interviews exclusives
            </h2>
            <Badge className="bg-[#556B2F] text-white">
              {filteredInterviews.length} interviews
            </Badge>
          </div>

          {filteredInterviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Video className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucune interview disponible
              </h3>
              <p className="text-gray-500 mb-4">
                Aucune interview trouvée pour cette catégorie.
              </p>
              <Button
                onClick={() => setActiveFilter("tous")}
                className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white"
              >
                Voir toutes les interviews
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInterviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-[#D3D3D3] hover:border-[#556B2F] transition-all duration-300 hover:shadow-lg overflow-hidden group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={interview.imageUrl}
                        alt={interview.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#556B2F] text-white">
                          {interview.duration}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm"
                        >
                          {interview.category === "jeunes" &&
                            "Jeune entrepreneur"}
                          {interview.category === "experimentes" &&
                            "Patron expérimenté"}
                          {interview.category === "politiques" && "Politique"}
                          {interview.category === "success" && "Success story"}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-grow">
                          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2">
                            {interview.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {interview.guest}
                          </p>
                          <p className="text-[#8B4513] text-sm">
                            {interview.role} • {interview.company}
                          </p>
                        </div>
                        <Button
                          onClick={() => handlePlayInterview(interview)}
                          size="icon"
                          className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white rounded-full flex-shrink-0"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </Button>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3 flex-grow">
                        {interview.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {interview.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-[#556B2F] text-[#556B2F] bg-[#556B2F]/10 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500 mt-auto pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {interview.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Headphones className="w-3 h-3" />
                            {interview.listens}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {interview.likes}
                          </span>
                        </div>
                        <span>{getTimeAgo(interview.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Ressources et Événements en colonnes */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ressources */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FileText className="mr-2 text-[#556B2F]" />
                Ressources gratuites
              </h2>
              <Badge className="bg-[#556B2F] text-white">
                {resources.length} ressources
              </Badge>
            </div>

            <div className="space-y-4">
              {resources.slice(0, 4).map((resource) => (
                <Card
                  key={resource.id}
                  className="bg-white border-[#D3D3D3] hover:border-[#556B2F] transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#6B8E23]/10 p-3 rounded-lg">
                        {resource.type === "guide" && (
                          <BookOpen className="w-6 h-6 text-[#556B2F]" />
                        )}
                        {resource.type === "template" && (
                          <FileText className="w-6 h-6 text-[#556B2F]" />
                        )}
                        {resource.type === "tool" && (
                          <Calculator className="w-6 h-6 text-[#556B2F]" />
                        )}
                        {resource.type === "checklist" && (
                          <CheckCircle className="w-6 h-6 text-[#556B2F]" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {resource.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {resource.downloads} téléchargements
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownloadResource(resource)}
                        size="sm"
                        className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {resources.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                  onClick={() => navigate("/entrepreneuriat/ressources")}
                >
                  Voir toutes les ressources
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Événements */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Calendar className="mr-2 text-[#556B2F]" />
                Prochains événements
              </h2>
              <Badge className="bg-[#556B2F] text-white">
                {events.length} événements
              </Badge>
            </div>

            <div className="space-y-4">
              {events.slice(0, 4).map((event) => (
                <Card
                  key={event.id}
                  className="bg-white border-[#D3D3D3] hover:border-[#556B2F] transition-all duration-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="bg-[#6B8E23]/10 text-[#556B2F] font-bold px-3 py-1 rounded-lg">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(event.date).toLocaleDateString("fr-FR", {
                            month: "short",
                          })}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              event.format === "webinar"
                                ? "border-blue-500 text-blue-500"
                                : event.format === "workshop"
                                ? "border-green-500 text-green-500"
                                : "border-purple-500 text-purple-500"
                            }`}
                          >
                            {event.format === "webinar" && "Webinaire"}
                            {event.format === "workshop" && "Atelier"}
                            {event.format === "networking" && "Networking"}
                            {event.format === "conference" && "Conférence"}
                          </Badge>
                          {event.location && (
                            <Badge variant="outline" className="text-xs">
                              {event.location}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {event.registered} inscrits
                            {event.maxParticipants &&
                              ` / ${event.maxParticipants}`}
                          </span>
                          <span className="text-xs font-medium">
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRegisterEvent(event)}
                        size="sm"
                        disabled={
                          !event.isRegistrationOpen ||
                          (event.maxParticipants &&
                            event.registered >= event.maxParticipants)
                        }
                        className={`${
                          !event.isRegistrationOpen ||
                          (event.maxParticipants &&
                            event.registered >= event.maxParticipants)
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-[#556B2F] hover:bg-[#556B2F]/90 text-white"
                        }`}
                      >
                        S'inscrire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {events.length > 4 && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10"
                  onClick={() => navigate("/entrepreneuriat/evenements")}
                >
                  Voir tous les événements
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// Composant Calculator pour l'icône
const Calculator = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="16" y2="18" />
  </svg>
);

// Composant CheckCircle pour l'icône
const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Entrepreneuriat;
