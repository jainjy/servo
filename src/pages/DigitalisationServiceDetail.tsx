// pages/DigitalisationServiceDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Users,
  MessageCircle,
  Heart,
  Share2,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { digitalisationApi } from "@/lib/api/digitalisation";
import ContactServiceModal from "@/components/modals/ContactServiceModal";
import { formatPrice, formatDuration } from "@/lib/utils";

const DigitalisationServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // États pour les modals
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchServiceData();
  }, [id]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await digitalisationApi.getServiceById(id);
      const serviceData = response.data;

      if (serviceData.createdBy) {
        setProfessional(serviceData.createdBy);
      }

      setService(serviceData);
    } catch (error) {
      console.error("Erreur lors du chargement du service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (user) {
      setShowContactModal(true);
    } else {
      navigate("/login");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.libelle,
        text: service.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papier !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement du service...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Service non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Le service que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/digitalisation")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux services
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
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate("/digitalisation")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux services
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{service.libelle}</h1>
              <p className="text-xl opacity-90 mb-6">{service.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                {service.price && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-bold text-lg">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                )}
                {service.duration && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formatDuration(service.duration)}</span>
                  </div>
                )}
                {service.tags?.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                {professional?.avatar ? (
                  <img
                    src={professional.avatar}
                    alt={
                      professional.companyName ||
                      `${professional.firstName} ${professional.lastName}`
                    }
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold">
                    {professional?.companyName ||
                      `${professional?.firstName} ${professional?.lastName}`}
                  </h3>
                  <div className="flex items-center text-sm opacity-80">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    <span>4.8 (42 avis)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                  onClick={handleContact}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contacter le professionnel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="details">Détails</TabsTrigger>
                <TabsTrigger value="reviews">Avis (24)</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardContent className="p-6">
                    {/* ... (contenu existant) ... */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    {/* ... (contenu existant) ... */}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq">
                <Card>
                  <CardContent className="p-6">
                    {/* ... (contenu existant) ... */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Professional Card */}
            {professional && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {professional.avatar ? (
                      <img
                        src={professional.avatar}
                        alt={
                          professional.companyName ||
                          `${professional.firstName} ${professional.lastName}`
                        }
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        <Link
                          to={`/digitalisation/professionnel/${professional.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {professional.companyName ||
                            `${professional.firstName} ${professional.lastName}`}
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                        <span>4.8 • 42 avis</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
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
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/digitalisation/professionnel/${professional.id}`
                      )
                    }
                  >
                    Voir tous les services
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {formatPrice(service.price)}
                    </div>
                    {service.duration && (
                      <div className="flex items-center justify-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-sm text-gray-700">
                        Garantie satisfaction
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3" />
                      <span className="text-sm text-gray-700">
                        Support inclus
                      </span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleContact}>
                    Contacter maintenant
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Services */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Services similaires
                </h3>
                <div className="space-y-3">
                  {/* ... (contenu existant) ... */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactServiceModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        service={service}
        professional={professional}
        messageType="service"
      />
    </div>
  );
};

export default DigitalisationServiceDetail;
