import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Camera, Star, Clock, MapPin, Bed, Bath, Ruler } from "lucide-react";
import PartnersPage from "@/pages/ServicesPartenersPage/PartnersPage";
import ServicesPage from "@/pages/ServicesPartenersPage/ServicesPages";
import AidesPage from "@/pages/ServicesPartenersPage/AidesPage";

const ServicesPartnersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("default");
  const [services, setServices] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les services et les propriétés au chargement du composant
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Récupérer les services
        const servicesResponse = await fetch('/api/services', { headers });

        if (!servicesResponse.ok) {
          throw new Error(`Erreur lors de la récupération des services: ${servicesResponse.status}`);
        }

        const servicesText = await servicesResponse.text();
        let servicesData;
        try {
          servicesData = JSON.parse(servicesText);
        } catch (parseError) {
          console.error('Erreur de parsing JSON services:', parseError);
          servicesData = [];
        }

        // S'assurer que servicesData est un tableau
        let parsedServices = [];
        if (servicesData && Array.isArray(servicesData)) {
          parsedServices = servicesData;
        } else if (servicesData && typeof servicesData === 'object') {
          const possibleArrays = ['services', 'data', 'items', 'results'];
          for (const key of possibleArrays) {
            if (servicesData[key] && Array.isArray(servicesData[key])) {
              parsedServices = servicesData[key];
              break;
            }
          }
          if (parsedServices.length === 0) {
            parsedServices = [servicesData];
          }
        }
        setServices(parsedServices);

        // Récupérer les propriétés
        const propertiesResponse = await fetch('/api/properties', { headers });

        if (!propertiesResponse.ok) {
          console.warn(`Avertissement: Erreur lors de la récupération des propriétés: ${propertiesResponse.status}`);
          setProperties([]);
        } else {
          const propertiesText = await propertiesResponse.text();
          let propertiesData;
          try {
            propertiesData = JSON.parse(propertiesText);
          } catch (parseError) {
            console.error('Erreur de parsing JSON propriétés:', parseError);
            propertiesData = [];
          }

          // S'assurer que propertiesData est un tableau
          let parsedProperties = [];
          if (propertiesData && Array.isArray(propertiesData)) {
            parsedProperties = propertiesData;
          } else if (propertiesData && typeof propertiesData === 'object') {
            const possibleArrays = ['properties', 'data', 'items', 'results'];
            for (const key of possibleArrays) {
              if (propertiesData[key] && Array.isArray(propertiesData[key])) {
                parsedProperties = propertiesData[key];
                break;
              }
            }
            if (parsedProperties.length === 0) {
              parsedProperties = [propertiesData];
            }
          }
          setProperties(parsedProperties);
        }

      } catch (err) {
        setError(err.message);
        console.error('Erreur détaillée:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
      if (section === "aides") setView("aides");
    } else {
      setView("default");
    }
  }, [section]);

  const renderHeaderTitles = () => {
    return (
      <div className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl lg:text-4xl md:text-5xl font-bold mb-2 lg:mb-6 text-gray-900">
            {view === "default" ? "Tous nos services et biens" :
             view === "partenaires" ? "Nos Partenaires" :
             view === "services" ? "Demandes de Prestations" : "Aides"}
          </h1>
          <p className="text-lg text-gray-600">
            {view === "default" ? "Découvrez l'ensemble de nos prestations et propriétés disponibles" :
             view === "partenaires" ? "Trouvez les meilleurs experts pour votre projet" :
             view === "services" ? "Soumettez vos demandes de services" : "Obtenez de l'aide et des conseils"}
          </p>
        </div>
      </div>
    );
  };

  // Composant pour afficher tous les services et biens
  const ServicesGridView = () => {
    if (loading) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">
                Erreur lors du chargement
              </div>
              <div className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                {error}
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Vérifier que services et properties sont des tableaux
    const servicesToDisplay = Array.isArray(services) ? services : [];
    const propertiesToDisplay = Array.isArray(properties) ? properties : [];
    const totalItems = servicesToDisplay.length + propertiesToDisplay.length;

    if (totalItems === 0) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Aucun service ou bien disponible pour le moment</div>
              <div className="text-gray-400 text-sm mt-2">
                Les services et biens apparaîtront ici une fois disponibles
              </div>
            </div>
          </div>
        </div>
      );
    }

    const renderServiceCard = (service, index) => (
      <div key={service.id || `service-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image du service */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 relative">
          {service.images && service.images.length > 0 ? (
            <img
              src={service.images[0]}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-blue-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Service
            </span>
          </div>
        </div>

        {/* Contenu du service */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {service.name || 'Service sans nom'}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description || 'Aucune description disponible'}
          </p>

          {/* Métiers associés */}
          {service.metiers && Array.isArray(service.metiers) && service.metiers.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {service.metiers.slice(0, 3).map((metier, idx) => (
                  <span
                    key={metier.id || `metier-${idx}`}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {metier.libelle || metier.name || 'Métier'}
                  </span>
                ))}
                {service.metiers.length > 3 && (
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    +{service.metiers.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Vendeurs */}
          {service.vendors && Array.isArray(service.vendors) && service.vendors.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Prestataires:</span>
                <span className="font-medium">{service.vendors.length}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex -space-x-2">
                  {service.vendors.slice(0, 3).map((vendor, vendorIndex) => (
                    <div
                      key={vendor.id || `vendor-${vendorIndex}`}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                      title={vendor.name || 'Utilisateur'}
                    >
                      {vendor.name ? vendor.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  ))}
                </div>
                {service.vendors.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{service.vendors.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
            <div className="flex items-center gap-4">
              {service.price && (
                <div className="flex items-center gap-1">
                  <span className="font-bold text-green-600">
                    {service.price}€
                  </span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}min</span>
                </div>
              )}
            </div>

            {/* Note moyenne */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="font-medium">{service.rating || service.vendors?.[0]?.rating || '4.5'}</span>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
            onClick={() => {
              console.log('Voir détails du service:', service.id || service._id);
            }}
          >
            Voir les détails
          </button>
        </div>
      </div>
    );

    const renderPropertyCard = (property, index) => (
      <div key={property.id || `property-${index}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image du bien */}
        <div className="aspect-video bg-gradient-to-br from-green-50 to-green-100 relative">
          {property.images && property.images.length > 0 ? (
            <img
              src={property.images[0]}
              alt={property.title || property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-green-300" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Bien
            </span>
          </div>
          {property.price && (
            <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-1 shadow-md">
              <span className="font-bold text-green-600 text-sm">
                {property.price.toLocaleString()} €
              </span>
            </div>
          )}
        </div>

        {/* Contenu du bien */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {property.title || property.name || 'Bien sans titre'}
          </h3>

          {property.address && (
            <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{property.address}</span>
            </div>
          )}

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {property.description || 'Aucune description disponible'}
          </p>

          {/* Caractéristiques du bien */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            {property.rooms && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-gray-700">
                  <Bed className="w-4 h-4" />
                  <span className="text-sm font-medium">{property.rooms}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Chambres</div>
              </div>
            )}
            {property.bathrooms && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-gray-700">
                  <Bath className="w-4 h-4" />
                  <span className="text-sm font-medium">{property.bathrooms}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Salles</div>
              </div>
            )}
            {property.surface && (
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-gray-700">
                  <Ruler className="w-4 h-4" />
                  <span className="text-sm font-medium">{property.surface}m²</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">Surface</div>
              </div>
            )}
          </div>

          {/* Type de bien */}
          {property.type && (
            <div className="mb-4">
              <span className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                {property.type}
              </span>
            </div>
          )}

          {/* Bouton d'action */}
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300"
            onClick={() => {
              navigate(`/immobilier/${property.id}`);
            }}
          >
            Voir le détail
          </button>
        </div>
      </div>
    );

    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec statistiques */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Services et biens ({totalItems})
            </h2>
            <div className="text-sm text-gray-600">
              {servicesToDisplay.length} service{servicesToDisplay.length > 1 ? 's' : ''} • {propertiesToDisplay.length} bien{propertiesToDisplay.length > 1 ? 's' : ''}
            </div>
          </div>

          {/* Grille des services et biens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesToDisplay.map((service, index) => renderServiceCard(service, index))}
            {propertiesToDisplay.map((property, index) => renderPropertyCard(property, `property-${index}`))}
          </div>

          {/* Filtres optionnels */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Tous
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Services
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Biens
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased mt-15">
      <header
        className="relative pt-12 px-8 pb-8 border-b border-gray-200 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">{renderHeaderTitles()}</div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "default" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners')}
            >
              TOUS LES SERVICES
              <ChevronDown className="w-4 h-4" />
            </button>

            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "partenaires" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=partenaires')}
            >
              PRÉSENTATION PARTENAIRES
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "services" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=prestations')}
            >
              DEMANDES DE PRESTATIONS
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "aides" ? "border-blue-500 bg-blue-500 text-white shadow-lg" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => navigate('/services-partners?section=aides')}
            >
              AIDES
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 pb-20 relative z-10">
        {view === "default" && <ServicesGridView />}
        {view === "partenaires" && <PartnersPage />}
        {view === "services" && <ServicesPage />}
        {view === "aides" && <AidesPage />}
      </main>
    </div>
  );
}

export default ServicesPartnersPage;
