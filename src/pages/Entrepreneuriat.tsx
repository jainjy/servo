// pages/Entrepreneuriat.tsx
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TourismNavigation from "@/components/TourismNavigation";

// Interface pour les interviews
interface Interview {
  id: string;
  title: string;
  guest: string;
  role: string;
  company: string;
  duration: string;
  date: string;
  tags: string[];
  image: string;
  videoUrl?: string;
  audioUrl?: string;
  description: string;
}

// Interface pour les ressources
interface Resource {
  id: string;
  title: string;
  type: "guide" | "template" | "tool" | "checklist";
  description: string;
  icon: React.ReactNode;
  downloadUrl: string;
}

// Interface pour les événements
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  format: "webinar" | "workshop" | "networking";
  registered: number;
  maxParticipants: number;
}

const Entrepreneuriat = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>("tous");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Données d'exemple pour les interviews
  const sampleInterviews: Interview[] = [
    {
      id: "1",
      title: "De zéro à 1 million en 3 ans",
      guest: "Marie Dubois",
      role: "Fondatrice & CEO",
      company: "EcoTech Solutions",
      duration: "45 min",
      date: "15 Mars 2024",
      tags: ["startup", "tech", "croissance"],
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://example.com/video1",
      audioUrl: "https://example.com/audio1",
      description:
        "Comment Marie a transformé son idée en entreprise à succès avec peu de moyens.",
    },
    {
      id: "2",
      title: "40 ans dans l'industrie",
      guest: "Jean Martin",
      role: "Président-directeur général",
      company: "Industries Martin",
      duration: "60 min",
      date: "10 Mars 2024",
      tags: ["industrie", "transmission", "leadership"],
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://example.com/video2",
      audioUrl: "https://example.com/audio2",
      description:
        "Les leçons de leadership et de gestion d'une entreprise familiale sur plusieurs décennies.",
    },
    {
      id: "3",
      title: "Politique et Entrepreneuriat",
      guest: "Sophie Lambert",
      role: "Députée & Entrepreneure",
      company: "Assemblée Nationale",
      duration: "50 min",
      date: "5 Mars 2024",
      tags: ["politique", "innovation", "public"],
      image:
        "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://example.com/video3",
      audioUrl: "https://example.com/audio3",
      description: "Comment concilier vie politique et entrepreneuriat.",
    },
    {
      id: "4",
      title: "L'entrepreneuriat à 20 ans",
      guest: "Lucas Petit",
      role: "Fondateur",
      company: "AppGenius",
      duration: "35 min",
      date: "1 Mars 2024",
      tags: ["jeune", "tech", "mobile"],
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      videoUrl: "https://example.com/video4",
      audioUrl: "https://example.com/audio4",
      description: "Lancer sa startup en parallèle des études.",
    },
  ];

  // Données d'exemple pour les ressources
  const sampleResources: Resource[] = [
    {
      id: "r1",
      title: "Business Plan Template",
      type: "template",
      description: "Modèle complet pour structurer votre projet",
      icon: <FileText className="w-6 h-6" />,
      downloadUrl: "/templates/business-plan.pdf",
    },
    {
      id: "r2",
      title: "Guide Financement",
      type: "guide",
      description: "Toutes les aides et financements disponibles",
      icon: <BookOpen className="w-6 h-6" />,
      downloadUrl: "/guides/financement.pdf",
    },
    {
      id: "r3",
      title: "Calculateur ROI",
      type: "tool",
      description: "Estimez votre retour sur investissement",
      icon: <Calculator className="w-6 h-6" />,
      downloadUrl: "/tools/roi-calculator",
    },
    {
      id: "r4",
      title: "Checklist Lancement",
      type: "checklist",
      description: "Toutes les étapes pour un lancement réussi",
      icon: <CheckCircle className="w-6 h-6" />,
      downloadUrl: "/checklists/launch-checklist.pdf",
    },
  ];

  // Données d'exemple pour les événements
  const sampleEvents: Event[] = [
    {
      id: "e1",
      title: "Webinar: Levée de fonds",
      date: "25 Mars 2024",
      time: "18:30",
      speaker: "Sarah Chen, Venture Capitalist",
      format: "webinar",
      registered: 145,
      maxParticipants: 500,
    },
    {
      id: "e2",
      title: "Workshop: Pitch Deck",
      date: "28 Mars 2024",
      time: "14:00",
      speaker: "Marc Lefebvre, Pitch Coach",
      format: "workshop",
      registered: 25,
      maxParticipants: 30,
    },
    {
      id: "e3",
      title: "Networking Entrepreneurs",
      date: "2 Avril 2024",
      time: "19:00",
      speaker: "Communauté OLIPLUS",
      format: "networking",
      registered: 87,
      maxParticipants: 100,
    },
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setInterviews(sampleInterviews);
      setResources(sampleResources);
      setEvents(sampleEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInterviews =
    activeFilter === "tous"
      ? interviews
      : interviews.filter((interview) =>
          interview.tags.some(
            (tag) =>
              tag.includes(activeFilter) ||
              interview.description.toLowerCase().includes(activeFilter)
          )
        );

  const handlePlayInterview = (interview: Interview) => {
    if (interview.videoUrl) {
      window.open(interview.videoUrl, "_blank");
    } else if (interview.audioUrl) {
      window.open(interview.audioUrl, "_blank");
    }
  };

  const handleDownloadResource = (resource: Resource) => {
    // Simuler le téléchargement
    const link = document.createElement("a");
    link.href = resource.downloadUrl;
    link.download = `${resource.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Log l'action (à remplacer par votre système de tracking)
    console.log(`Resource downloaded: ${resource.title}`);
  };

  const handleRegisterEvent = (eventId: string) => {
    // Naviguer vers la page d'inscription
    navigate(`/evenements/${eventId}/inscription`);
  };

  const handleSuggestInterview = () => {
    navigate("/suggest-interview");
  };

  const handleSubmitProject = () => {
    navigate("/entrepreneuriat/projet");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#6B8E23] to-[#8FBC8F] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#556B2F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F5F5F5] to-[#E8E8E8]">
      {/* Hero Section avec image de fond */}
      <section
        className="relative mt-16 pt-4 pb-4 px-4 sm:px-6 lg:px-8"
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
            <Badge className="mb-4 bg-[#556B2F] hover:bg-[#556B2F]/90 text-white px-4 py-1">
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
      <section className="py-12 bg-[#6B8E23]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                value: "150+",
                label: "Interviews",
              },
              {
                icon: <Users className="w-8 h-8" />,
                value: "500+",
                label: "Entrepreneurs",
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                value: "50K+",
                label: "Écoutes",
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                value: "25+",
                label: "Guides gratuits",
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Interviews - Colonne principale */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <PlayCircle className="mr-2 text-[#556B2F]" />
                Interviews exclusives
              </h2>
              <Badge className="bg-[#556B2F] text-white">
                {filteredInterviews.length} interviews
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredInterviews.map((interview) => (
                <motion.div
                  key={interview.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-white border-[#D3D3D3] hover:border-[#556B2F] transition-all duration-300 hover:shadow-lg overflow-hidden group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={interview.image}
                        alt={interview.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#556B2F] text-white">
                          {interview.duration}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">
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
                          className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white rounded-full"
                        >
                          <PlayCircle className="w-5 h-5" />
                        </Button>
                      </div>

                      <p className="text-gray-700 text-sm mb-4">
                        {interview.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {interview.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-[#556B2F] text-[#556B2F] bg-[#556B2F]/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{interview.date}</span>
                        <div className="flex gap-4">
                          {interview.videoUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-[#556B2F]"
                              onClick={() =>
                                window.open(interview.videoUrl, "_blank")
                              }
                            >
                              <Video className="w-4 h-4 mr-1" />
                              Vidéo
                            </Button>
                          )}
                          {interview.audioUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-[#556B2F]"
                              onClick={() =>
                                window.open(interview.audioUrl, "_blank")
                              }
                            >
                              <Headphones className="w-4 h-4 mr-1" />
                              Audio
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Ressources */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="mr-2 text-[#556B2F]" />
                Ressources gratuites
              </h3>
              <div className="space-y-4">
                {resources.map((resource) => (
                  <Card
                    key={resource.id}
                    className="bg-white border-[#D3D3D3] hover:border-[#556B2F] transition-all duration-300 cursor-pointer group"
                    onClick={() => handleDownloadResource(resource)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-[#8B4513]">{resource.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-[#556B2F] transition-colors">
                            {resource.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {resource.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#556B2F] transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Événements à venir */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Calendar className="mr-2 text-[#556B2F]" />
                Événements à venir
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <Card key={event.id} className="bg-white border-[#D3D3D3]">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge
                            className={`mb-2 ${
                              event.format === "webinar"
                                ? "bg-blue-500"
                                : event.format === "workshop"
                                ? "bg-purple-500"
                                : "bg-green-500"
                            }`}
                          >
                            {event.format}
                          </Badge>
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Par {event.speaker}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-[#8B4513] font-bold">
                            {event.date}
                          </div>
                          <div className="text-sm text-gray-600">
                            {event.time}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#D3D3D3]">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {event.registered}/{event.maxParticipants} inscrits
                          </div>
                          <Button
                            onClick={() => handleRegisterEvent(event.id)}
                            size="sm"
                            className="bg-[#556B2F] hover:bg-[#556B2F]/90 text-white"
                          >
                            S'inscrire
                          </Button>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#556B2F] h-2 rounded-full"
                            style={{
                              width: `${
                                (event.registered / event.maxParticipants) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Newsletter */}
            <Card className="bg-gradient-to-br from-[#6B8E23] to-[#8FBC8F] border-0">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-white mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">
                  Restez informé
                </h4>
                <p className="text-white/90 mb-4">
                  Recevez les nouvelles interviews et ressources directement
                  dans votre boîte mail
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Votre email"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 placeholder-white/70 text-white border border-white/30 focus:outline-none focus:border-white"
                  />
                  <Button className="w-full bg-white text-[#556B2F] hover:bg-white/90">
                    S'abonner à la newsletter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

// Composant Calculator pour l'icône (à importer depuis lucide-react ou créer)
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

// Composant CheckCircle pour l'icône (à importer depuis lucide-react ou créer)
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
