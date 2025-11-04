import React, { useState } from "react";
import { ChevronDown, Search, X, Home, Send, Mail } from "lucide-react";


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

  const propertyTypes = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Home },
    { value: "terrain", label: "Terrain", icon: Home },
    { value: "hotel", label: "Hôtel/Gîte", icon: Home }
  ];

 
  const services = [
    { 
      action: "FAIRE UNE ESTIMATION IMMOBILIERE", 
      image: "https://i.pinimg.com/736x/3d/c0/2d/3dc02d2dc905e44c629ee57389cbe3c2.jpg",
      category: "ESTIMATION"
    },
    { 
      action: "FAIRE UNE SIMULATION DE FINANCEMENT", 
      image: "https://i.pinimg.com/736x/e2/ff/30/e2ff300d1a9013dd9c5722d4201d7a37.jpg",
      category: "FINANCEMENT"
    },
    { 
      action: "FAIRE REDIGER UN COMPROMIS DE VENTE", 
      image: "https://i.pinimg.com/1200x/ca/32/82/ca3282c4b57e67ae0d564278704b3227.jpg",
      category: "JURIDIQUE"
    },
    { 
      action: "FAIRE UN DEVIS MUR DE SOUTENNEMENT", 
      image: "https://i.pinimg.com/736x/40/01/a7/4001a7aeb9cd595fbab7d19c0bbd026e.jpg",
      category: "CONSTRUCTION"
    },
    { 
      action: "FAIRE INSTALLER UNE ALARME", 
      image: "https://i.pinimg.com/736x/c0/ab/5e/c0ab5e33a9abc0b95cdf8ab37ffbb23d.jpg",
      category: "SECURITE"
    },
    { 
      action: "FAIRE UN DEVIS CHANGEMENT DE SERRURE", 
      image: "https://i.pinimg.com/1200x/40/01/a7/4001a7aeb9cd595fbab7d19c0bbd026e.jpg",
      category: "SECURITE"
    },
    { 
      action: "SERVICE SUPPLEMENTAIRE", 
      image: "https://i.pinimg.com/736x/41/df/1d/41df1d25cd9d6b931b40af70c6f863b3.jpg",
      category: "AUTRE"
    },
  ];

  const getFilteredServices = () => {
    let filtered = services;
    
    if (servicesSearchQuery) {
      const q = servicesSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.action.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
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
        return typeToCategoryMap[propertyType]?.includes(s.category) || !propertyType;
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

  const handleStatusClick = (statusLabel: string, statusImage: string) => {
    setSelectedServiceForm(statusLabel);
    setSelectedImage(statusImage);
    setShowCard(true);
  };



  const ServicesSection = () => {
    const filteredServices = getFilteredServices();
    const displayedServices = filteredServices.slice(0, displayCount);

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
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-gray-200"
                  style={{ 
                    minHeight: "280px",
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <img 
                    src={service.image} 
                    alt={service.action}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105 card-image-radius"
                    onError={(e) => handleImageError(e, service.action)}
                  />

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">{service.action}</h3>
                      <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex-1 mr-2"
                        onClick={() => {

                            setShowCard(true)
                        }}
                      >
                        Faire un devis
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

      
      {!showStatuses && <ServicesSection />}

      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-gray-200">
            

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DATE DE SIGNATURE DU COMPROMIS
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NOTAIRES ou AVOCATS
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                  <option value="">Choisir un notaire/avocat</option>
                  <option value="notaire1">Maître Dupont</option>
                  <option value="notaire2">Maître Martin</option>
                  <option value="avocat1">Maître Durand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TYPE DU BIEN QUE VOUS SOUHAITEZ
                </label>
                <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                  <option value="">Sélectionner le type de bien</option>
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                  <option value="terrain">Terrain</option>
                  <option value="local-commercial">Local commercial</option>
                </select>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                onClick={() => setShowCard(false)}
              >
                Annuler
              </button>

              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                onClick={() => setShowCard(false)}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

    
      
    </>
  );
};

export default ServicesPage;