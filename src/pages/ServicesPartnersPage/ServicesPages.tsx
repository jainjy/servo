import React, { useState, useEffect } from "react";
import { ChevronDown, Search, X, Home, Send, Mail, Star, FileText, Loader2 } from "lucide-react";

const ServicesPage = () => {
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [servicesSearchQuery, setServicesSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(8);
  const [propertyType, setPropertyType] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selectedServiceForm, setSelectedServiceForm] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le modal de devis
  const [isDevisModalOpen, setIsDevisModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const propertyTypes = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Home },
    { value: "terrain", label: "Terrain", icon: Home },
    { value: "hotel", label: "Hôtel/Gîte", icon: Home }
  ];

  // Récupérer les services depuis l'API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_BASE_URL}/api/services`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        
        // Parser les données de l'API
        const parseApiData = (data: any) => {
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (data.services && Array.isArray(data.services)) return data.services;
          if (data.data && Array.isArray(data.data)) return data.data;
          if (data.items && Array.isArray(data.items)) return data.items;
          if (data.results && Array.isArray(data.results)) return data.results;
          return [data];
        };

        const parsedServices = parseApiData(data);
        console.log('Services chargés:', parsedServices.length);
        setServices(parsedServices);
      } else {
        console.warn('Erreur services:', response.status);
        setServices([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors du chargement des services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getFilteredServices = () => {
    let filtered = services;
    
    if (servicesSearchQuery) {
      const q = servicesSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        (s.metiers && s.metiers.some(metier => 
          metier.libelle?.toLowerCase().includes(q) || 
          metier.name?.toLowerCase().includes(q)
        ))
      );
    }

    if (propertyType) {
      filtered = filtered.filter(s => {
        const typeToCategoryMap = {
          'maison': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'CONSTRUCTION', 'SECURITE'],
          'appartement': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'SECURITE'],
          'terrain': ['ESTIMATION', 'FINANCEMENT', 'JURIDIQUE', 'CONSTRUCTION'],
          'hotel': ['ESTIMATION', 'FINANCEMENT', 'ASSURANCE', 'JURIDIQUE', 'CONSTRUCTION']
        };
        
        // Adapter cette logique selon la structure de vos données API
        const serviceCategory = s.category || s.type || 'OTHER';
        return typeToCategoryMap[propertyType]?.includes(serviceCategory) || !propertyType;
      });
    }

    return filtered;
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleSendMessage = () => {
    console.log("Email:", email);
    console.log("Message:", message);
    setShowMessageCard(false);
    setEmail('');
    setMessage('');
    alert("Message envoyé avec succès!");
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/300x200/E5E7EB/374151?text=${encodeURIComponent(fallbackText)}`;
  };

  const handleDevisClick = (service: any) => {
    setCurrentService(service);
    setIsDevisModalOpen(true);
  };

  const handleDevisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler l'envoi du formulaire
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Devis pour "${currentService?.name}" envoyé !`);
      setIsDevisModalOpen(false);
      setCurrentService(null);
    } catch (error) {
      alert("Erreur lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ServicesSection = () => {
    const filteredServices = getFilteredServices();
    const displayedServices = filteredServices.slice(0, displayCount);

    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Chargement des services...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            Erreur lors du chargement des services
          </div>
          <button
            onClick={fetchServices}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-8 mt-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="RECHERCHER UN SERVICE..."
                value={servicesSearchQuery}
                onChange={(e) => setServicesSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <div className="relative">
              <button 
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              >
                <Home className="w-4 h-4" />
                {propertyType ? propertyTypes.find(p => p.value === propertyType)?.label : "Type de bien"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showPropertyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-down">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        propertyType === type.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      onClick={() => {
                        setPropertyType(type.value === propertyType ? "" : type.value);
                        setShowPropertyDropdown(false);
                      }}
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {servicesSearchQuery && (
              <button
                onClick={() => setServicesSearchQuery("")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-600">Aucun service trouvé avec ces critères.</p>
            <button 
              onClick={() => {
                setServicesSearchQuery("");
                setPropertyType("");
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
              {displayedServices.map((service, index) => (
                <div
                  key={service.id || index}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-gray-200"
                  style={{ 
                    minHeight: "320px",
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  {/* Image avec badge "Photos" comme dans l'exemple */}
                  <div className="relative">
                    <img 
                      src={service.images?.[0] || `https://via.placeholder.com/300x200/E5E7EB/374151?text=${encodeURIComponent(service.name || 'Service')}`} 
                      alt={service.name}
                      className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => handleImageError(e, service.name || 'Service')}
                    />
                    
                    {/* Badge Photos comme dans l'image */}
                    <div className="absolute top-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                      Photos ({service.images?.length || 1})
                    </div>
                    
                    {/* Note si disponible */}
                    {service.rating && (
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        {service.rating}
                      </div>
                    )}
                  </div>

                  {/* Contenu de la carte */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Titre du service */}
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 leading-tight">
                        {service.name || 'Service sans nom'}
                      </h3>
                      
                      {/* Description courte */}
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {service.description || 'Description non disponible'}
                      </p>
                      
                      {/* Catégorie/Métiers */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.metiers?.slice(0, 2).map((metier, idx) => (
                          <span 
                            key={metier.id || idx}
                            className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                          >
                            {metier.libelle || metier.name}
                          </span>
                        ))}
                        {(!service.metiers || service.metiers.length === 0) && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            {service.category || 'Général'}
                          </span>
                        )}
                      </div>
                      
                      {/* Prix et durée */}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        {service.price && (
                          <span className="font-semibold text-green-600">
                            {typeof service.price === 'number' ? service.price.toLocaleString() : service.price} €
                          </span>
                        )}
                        {service.duration && (
                          <span>Durée: {service.duration}min</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Bouton FAIRE UN DEVIS comme dans l'image */}
                    <div className="mt-4">
                      <button 
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105 shadow-md"
                        onClick={() => handleDevisClick(service)}
                      >
                        FAIRE UN DEVIS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            
            {filteredServices.length > displayCount && (
              <div className="text-center mb-16 mt-8">
                <button 
                  onClick={handleLoadMore}
                  className="inline-block px-8 py-4 bg-blue-500 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors transform hover:scale-105 shadow-lg"
                >
                  VOIR PLUS DE SERVICES
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={() => setShowMessageCard(true)}
        >
          <Send className="w-4 h-4" />
          Envoyer un message
        </button>
      </div>

      {/* Section principale des services */}
      {!showStatuses && <ServicesSection />}

      {/* Modal de devis amélioré */}
      {isDevisModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Demande de Devis
                  </h2>
                  <p className="text-gray-600 text-xs lg:text-sm">
                    {currentService?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDevisModalOpen(false)}
                className="h-8 w-8 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 flex items-center justify-center transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDevisSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input 
                    name="nom" 
                    placeholder="Votre nom" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input 
                    name="prenom" 
                    placeholder="Votre prénom" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input 
                    name="telephone" 
                    placeholder="06 12 34 56 78" 
                    required 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse du projet
                </label>
                <input 
                  name="adresse" 
                  placeholder="Adresse complète du projet" 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date souhaitée
                  </label>
                  <input 
                    name="dateSouhaitee" 
                    type="date" 
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget estimé
                  </label>
                  <select
                    name="budget"
                    required
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    <option value="">Sélectionnez un budget</option>
                    <option value="0-5000">0 - 5 000 €</option>
                    <option value="5000-15000">5 000 - 15 000 €</option>
                    <option value="15000-30000">15 000 - 30 000 €</option>
                    <option value="30000+">30 000 € et plus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message supplémentaire
                </label>
                <textarea 
                  name="message" 
                  placeholder="Décrivez votre projet en détail..." 
                  rows={4} 
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Prestation sélectionnée
                </h3>
                <p className="text-blue-800 text-sm">{currentService?.name}</p>
                {currentService?.description && (
                  <p className="text-blue-600 text-xs mt-1">{currentService?.description}</p>
                )}
              </div>

              <div className="grid lg:flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Envoi en cours..." : "Envoyer la demande"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDevisModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour envoyer un message */}
      {showMessageCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Envoyer un message</h3>
                <button 
                  onClick={() => setShowMessageCard(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Votre message..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-6">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setShowMessageCard(false)}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServicesPage;