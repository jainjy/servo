// pages/DigitalisationProfessionnelDetail.jsx (version simplifiée)
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Award,
  Shield,
  Clock,
  CheckCircle,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import ContactServiceModal from "@/components/modals/ContactServiceModal";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

const DigitalisationProfessionnelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [professional, setProfessional] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");

  // États pour les modals
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchProfessionalData();
  }, [id]);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/digitalisation-services/professional/${id}`
      );

      if (response.data.success) {
        const { professional, services } = response.data.data;
        setProfessional(professional);
        setServices(services);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du professionnel:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (service = null) => {
    setSelectedService(service);
    setShowContactModal(true);
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
    return <LoadingSpinner text="Chargement des informations" />;
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
                      <span className="font-bold">4.8</span>
                      <span className="ml-1">(42 avis)</span>
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

            <Button
              onClick={() => handleContact()}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Contacter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
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
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="services">
                  Services ({services.length})
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
                              onClick={() => handleContact(service)}
                            >
                              Contacter
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

              {/* About Tab */}
              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    {/* ... (contenu existant) ... */}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactServiceModal
        isOpen={showContactModal}
        onClose={() => {
          setShowContactModal(false);
          setSelectedService(null);
        }}
        service={selectedService}
        professional={professional}
        messageType={selectedService ? "service" : "professional"}
      />
    </div>
  );
};

export default DigitalisationProfessionnelDetail;
