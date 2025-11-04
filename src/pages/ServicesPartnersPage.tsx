import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Camera, Star, MapPin, Clock } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les services au chargement du composant
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); // ou votre méthode d'authentification
        const response = await fetch('/api/services', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des services');
        }

        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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
            Tous nos services
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez l'ensemble de nos prestations disponibles
          </p>
        </div>
      </div>
    );
  };

  // Composant pour afficher tous les services
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
              <div className="text-red-500 text-lg mb-4">Erreur: {error}</div>
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

    if (services.length === 0) {
      return (
        <div className="py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Aucun service disponible pour le moment</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête avec statistiques */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Tous nos services ({services.length})
            </h2>
            <div className="text-sm text-gray-600">
              {services.length} services disponibles
            </div>
          </div>

          {/* Grille des services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
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
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Contenu du service */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Métiers associés */}
                  {service.metiers && service.metiers.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {service.metiers.slice(0, 3).map((metier) => (
                          <span 
                            key={metier.id}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {metier.libelle}
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
                  {service.vendors && service.vendors.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Prestataires:</span>
                        <span className="font-medium">{service.vendors.length}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex -space-x-2">
                          {service.vendors.slice(0, 3).map((vendor, index) => (
                            <div 
                              key={vendor.id}
                              className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                            >
                              {vendor.name.charAt(0)}
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
                      <span className="font-medium">{service.vendors?.[0]?.rating || '4.5'}</span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <button className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300">
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Filtres optionnels (vous pouvez les ajouter plus tard) */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Tous les services
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Les plus populaires
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Par catégorie
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