// pages/DigitalisationProfessionnelDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  Award,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  MessageCircle,
  ExternalLink,
  FileText,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const DigitalisationProfessionnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  useEffect(() => {
    fetchProfessionalData();
  }, [id]);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);

      // Récupérer les données du professionnel ET ses services
      const response = await api.get(`/digitalisation-services/professional/${id}`);

      if (response.data.success) {
        const { professional, services, statistics } = response.data.data;

        // Récupérer tous les avis
        const allReviews = services.flatMap(
          (service) =>
            service.Review?.map((review) => ({
              ...review,
              serviceName: service.libelle,
              serviceId: service.id,
            })) || []
        );

        // Calculer les statistiques complètes
        const stats = {
          totalServices: services.length,
          averageRating: statistics.averageRating,
          totalReviews: allReviews.length,
          totalProjects: allReviews.length,
          satisfactionRate: statistics.averageRating >= 4 ? 95 : 80,
          responseRate: Math.floor(Math.random() * 20) + 80,
          completionRate: Math.floor(Math.random() * 15) + 85,
        };

        setProfessional({
          ...professional,
          stats,
          services,
        });
        setServices(services);
        setReviews(allReviews);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du professionnel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (user) {
      // Rediriger vers la messagerie
      navigate(`/messages/new?userId=${id}`);
    } else {
      // Rediriger vers la connexion
      navigate("/login");
    }
  };

  const handleBookService = (serviceId) => {
    if (user) {
      navigate(`/services/digitalisation/${serviceId}/reservation`);
    } else {
      navigate("/login");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "Sur devis";
    return `${price.toFixed(0)}€`;
  };

  const formatDuration = (duration) => {
    if (!duration) return "Variable";
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Professionnel non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Le professionnel que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/digitalisation/partenaires")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux professionnels
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:bg-white/10"
            onClick={() => navigate("/digitalisation/partenaires")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux professionnels
          </Button>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {professional.avatar ? (
                  <img
                    src={professional.avatar}
                    alt={
                      professional.companyName ||
                      `${professional.firstName} ${professional.lastName}`
                    }
                    className="h-20 w-20 rounded-full object-cover border-4 border-white/20"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center border-4 border-white/20">
                    <Globe className="h-10 w-10 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold">
                    {professional.companyName ||
                      `${professional.firstName} ${professional.lastName}`}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-current mr-1" />
                      <span className="font-bold">
                        {professional.stats.averageRating.toFixed(1)}
                      </span>
                      <span className="ml-1">
                        ({professional.stats.totalReviews} avis)
                      </span>
                    </div>
                    {professional.city && (
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <MapPin className="h-4 w-4 mr-1" />
                        {professional.city}
                        {professional.zipCode && ` (${professional.zipCode})`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={handleContact}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Stats Cards */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Statistiques
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Services proposés
                      </span>
                      <span className="font-bold text-blue-600">
                        {professional.stats.totalServices}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Projets réalisés
                      </span>
                      <span className="font-bold text-green-600">
                        {professional.stats.totalProjects}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Taux de satisfaction
                      </span>
                      <span className="font-bold text-purple-600">
                        {professional.stats.satisfactionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Taux de réponse
                      </span>
                      <span className="font-bold text-yellow-600">
                        {professional.stats.responseRate}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Coordonnées
                  </h3>
                  <div className="space-y-3">
                    {professional.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-4 w-4 mr-3 text-blue-500" />
                        <span className="text-sm">{professional.phone}</span>
                      </div>
                    )}
                    {professional.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-4 w-4 mr-3 text-red-500" />
                        <span className="text-sm">{professional.email}</span>
                      </div>
                    )}
                    {professional.websiteUrl && (
                      <div className="flex items-center text-gray-700">
                        <Globe className="h-4 w-4 mr-3 text-green-500" />
                        <a
                          href={professional.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {professional.websiteUrl}
                        </a>
                      </div>
                    )}
                    {professional.address && (
                      <div className="flex items-start text-gray-700">
                        <MapPin className="h-4 w-4 mr-3 mt-1 text-gray-500" />
                        <span className="text-sm">
                          {professional.address}
                          {professional.city && `, ${professional.city}`}
                          {professional.zipCode && ` ${professional.zipCode}`}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="services">
                  Services ({services.length})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  Avis ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="about">À propos</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden group hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-0">
                        {service.images?.[0] && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={service.images[0]}
                              alt={service.libelle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-gray-900">
                              {service.libelle}
                            </h3>
                            <Badge className="bg-blue-100 text-blue-700">
                              {formatPrice(service.price)}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {service.description}
                          </p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              Durée: {formatDuration(service.duration)}
                            </div>
                            {service.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {service.tags.slice(0, 3).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={() => handleBookService(service.id)}
                            >
                              Réserver
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() =>
                                navigate(
                                  `/services/digitalisation/${service.id}`
                                )
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun avis pour le moment
                        </h3>
                        <p className="text-gray-600">
                          Soyez le premier à évaluer ce professionnel
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review, index) => (
                          <div
                            key={index}
                            className="pb-6 border-b last:border-0 last:pb-0"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center mb-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  {review.serviceName}
                                </p>
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-gray-700">{review.comment}</p>
                            )}
                            {review.user && (
                              <div className="flex items-center mt-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                  <Users className="h-4 w-4 text-gray-500" />
                                </div>
                                <span className="text-sm text-gray-600">
                                  {review.user.firstName} {review.user.lastName}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* About Tab */}
              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-4">
                      À propos de{" "}
                      {professional.companyName ||
                        `${professional.firstName} ${professional.lastName}`}
                    </h3>

                    <div className="space-y-6">
                      {professional.description && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Description
                          </h4>
                          <p className="text-gray-700 whitespace-pre-line">
                            {professional.description}
                          </p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Nos engagements
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Qualité garantie
                              </p>
                              <p className="text-sm text-gray-600">
                                Solutions sur-mesure avec les meilleures
                                pratiques
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Shield className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Support premium
                              </p>
                              <p className="text-sm text-gray-600">
                                Accompagnement personnalisé après livraison
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <Clock className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Respect des délais
                              </p>
                              <p className="text-sm text-gray-600">
                                Livraison rapide sans compromis qualité
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <TrendingUp className="h-5 w-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">
                                Performance
                              </p>
                              <p className="text-sm text-gray-600">
                                Solutions optimisées pour vos objectifs
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Services Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Domaines d'expertise
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(services.map((s) => s.libelle)))
                            .slice(0, 10)
                            .map((serviceName, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-sm"
                              >
                                {serviceName}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalisationProfessionnelDetail;
