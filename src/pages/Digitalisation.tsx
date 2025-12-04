// pages/Digitalisation.jsx
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Globe,
  Smartphone,
  Cloud,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Palette,
  Lightbulb,
  LifeBuoy,
  User,
  Star,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { digitalisationApi } from "@/lib/api/digitalisation";
import { Link } from "react-router-dom";

const Digitalisation = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Services par défaut (si l'API échoue)
  const defaultServices = [
    {
      title: "Site E-commerce",
      icon: <ShoppingCart />,
      desc: "Boutique en ligne complète avec paiement sécurisé",
      image: "/services/ecommerce.jpg",
    },
    {
      title: "Site Vitrine",
      icon: <Globe />,
      desc: "Site web professionnel pour présenter votre activité",
      image: "/services/vitrine.jpg",
    },
    {
      title: "App Mobile",
      icon: <Smartphone />,
      desc: "Applications iOS et Android sur-mesure",
      image: "/services/mobile.jpg",
    },
    {
      title: "Solutions Cloud",
      icon: <Cloud />,
      desc: "Logiciels métier en ligne automatisés",
      image: "/services/cloud.jpg",
    },
    {
      title: "Marketing Digital",
      icon: <Target />,
      desc: "Stratégie digitale pour plus de visibilité",
      image: "/services/marketing.jpg",
    },
    {
      title: "Transformation Digitale",
      icon: <Zap />,
      desc: "Accompagnement complet pour digitaliser",
      image: "/services/transformation.jpg",
    },
    {
      title: "Design UI/UX",
      icon: <Palette />,
      desc: "Conception d'interfaces utilisateur et expérience utilisateur",
      image: "/services/design.jpg",
    },
    {
      title: "Consulting Digital",
      icon: <Lightbulb />,
      desc: "Conseil en stratégie digitale",
      image: "/services/consulting.jpg",
    },
    {
      title: "Maintenance & Support",
      icon: <LifeBuoy />,
      desc: "Maintenance et support technique",
      image: "/services/maintenance.jpg",
    },
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await digitalisationApi.getAllServices();

        if (response.success && response.data.length > 0) {
          // Transformer les données de l'API en format utilisable
          const formattedServices = response.data.map((service) => ({
            id: service.id,
            title: service.libelle,
            icon: getIconByService(service.libelle),
            desc: service.description || service.libelle,
            price: service.price,
            duration: service.duration,
            images: service.images || [],
            creator: service.createdBy,
            tags: service.tags || [],
            averageRating: service.averageRating || 0,
            reviewCount: service.reviewCount || 0,
            type: service.type,
            isCustom: service.isCustom,
          }));
          setServices(formattedServices);
        } else {
          // Utiliser les services par défaut
          setServices(defaultServices);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err);
        setError(err.message);
        // Utiliser les services par défaut en cas d'erreur
        setServices(defaultServices);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Fonction pour obtenir l'icône appropriée
  const getIconByService = (serviceName) => {
    const icons = {
      "Site E-commerce": <ShoppingCart className="h-8 w-8" />,
      "Site Vitrine": <Globe className="h-8 w-8" />,
      "App Mobile": <Smartphone className="h-8 w-8" />,
      "Solutions Cloud": <Cloud className="h-8 w-8" />,
      "Marketing Digital": <Target className="h-8 w-8" />,
      "Transformation Digitale": <Zap className="h-8 w-8" />,
      "Design UI/UX": <Palette className="h-8 w-8" />,
      "Consulting Digital": <Lightbulb className="h-8 w-8" />,
      "Maintenance & Support": <LifeBuoy className="h-8 w-8" />,
    };

    return icons[serviceName] || <Globe className="h-8 w-8" />;
  };

  // Formatteur de prix
  const formatPrice = (price) => {
    if (!price) return "Sur devis";
    return `${price.toFixed(0)}€`;
  };

  // Formatteur de durée
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
            <p className="mt-4 text-gray-600">Chargement des services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 pt-4 pb-16">
        {/* Hero avec background image */}
        <div className="relative overflow-hidden rounded-2xl mb-12">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url("/digital.jpg")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/30 to-indigo-900/40" />
          </div>

          <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Solutions Digitales pour Entreprises
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10">
              Créez votre présence en ligne avec nos services de digitalisation
              sur-mesure
            </p>

          </div>

          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl translate-x-12 translate-y-12" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* En-tête du service */}
              <div className="flex justify-between items-start mb-6">
                <div className="text-blue-600">
                  <div className="inline-block p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    {service.icon || getIconByService(service.title)}
                  </div>
                </div>

                {/* Informations prix/durée */}
                <div className="text-right">
                  {service.price && (
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(service.price)}
                    </span>
                  )}
                  {service.duration && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDuration(service.duration)}
                    </p>
                  )}
                </div>
              </div>

              {/* Titre et description */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">{service.desc}</p>

              {/* Informations du créateur */}
              {service.creator && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {service.creator.avatar ? (
                        <img
                          src={service.creator.avatar}
                          alt={
                            service.creator.companyName ||
                            `${service.creator.firstName} ${service.creator.lastName}`
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {service.creator.companyName ||
                          `${service.creator.firstName || ""} ${
                            service.creator.lastName || ""
                          }`.trim() ||
                          service.creator.email}
                      </p>
                      <div className="flex items-center mt-1">
                        {service.averageRating > 0 && (
                          <>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {service.averageRating} ({service.reviewCount})
                            </span>
                          </>
                        )}
                        {service.creator.userType && (
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {service.creator.userType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {service.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {service.tags.length > 3 && (
                      <span className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        +{service.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Caractéristiques */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Design personnalisé</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Responsive design</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>SEO optimisé</span>
                </li>
              </ul>

              {/* Bouton d'action */}
              <Button className="w-full group-hover:bg-blue-600 transition-colors">
                <Link
                  to={
                    service.id ? `/services/digitalisation/${service.id}` : "#"
                  }
                  className="flex items-center justify-center w-full"
                >
                  Découvrir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Section CTA pour les professionnels */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <Building className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Vous proposez des services de digitalisation ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et proposez vos services à des milliers
            de clients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register/professional"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md"
            >
              Devenir prestataire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Digitalisation;
