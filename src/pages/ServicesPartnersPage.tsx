import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  MapPin, ChevronDown, Search, X, Send, Mail, Home, 
  Building, Warehouse, Hotel, Users, FileText, HelpCircle,
  Phone, Star, Shield, Clock, ArrowRight, Eye, MessageCircle
} from "lucide-react";
import { toast } from "sonner";

const ServicesPartnersPage = () => { 
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("services");
  const [showPartners, setShowPartners] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [partnersSearchQuery, setPartnersSearchQuery] = useState("");
  const [servicesSearchQuery, setServicesSearchQuery] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [showCard, setShowCard] = useState(false);
  const [selectedServiceForm, setSelectedServiceForm] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [propertyType, setPropertyType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Auto-selection de la section depuis l'URL
  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
      if (section === "aides") setView("aides");
    }
  }, [section]);

  // Navigation handlers
  const handleNavigation = (newView) => {
    setView(newView);
    setShowPartners(false);
    setShowStatuses(false);
    setDisplayCount(6);
    navigate(`?section=${newView === "services" ? "prestations" : newView}`, { replace: true });
  };

  const sectors = ["Nord", "Ouest", "Est", "Sud"];
  
  const propertyTypes = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Building },
    { value: "terrain", label: "Terrain", icon: Warehouse },
    { value: "hotel", label: "Hôtel/Gîte", icon: Hotel }
  ];

  const locations = [
    "Paris", "Lyon", "Marseille", "Bordeaux", 
    "Toulouse", "Lille", "Nice", "Nantes"
  ];

  // Handlers pour les actions
  const handleStatusClick = (statusLabel, statusImage) => {
    setSelectedServiceForm(statusLabel);
    setSelectedImage(statusImage);
    setShowCard(true);
  };

  const handleContactPartner = (partner) => {
    setShowMessageCard(true);
    setMessage(`Bonjour, je suis intéressé(e) par vos services en tant que ${partner.category}. Pouvez-vous me recontacter ?`);
  };

  const handleRequestQuote = (service) => {
    setSelectedService(service.action);
    setShowStatuses(true);
  };

  const handleCallSupport = () => {
    window.open('tel:+33123456789');
  };

  const handleDownloadBrochure = (partner) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `brochure-${partner.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

  const handleViewAllPartners = () => {
    setShowPartners(true);
    setSelectedCategory("");
  };

  const handleSendMessage = () => {
    console.log("Email:", email);
    console.log("Message:", message);
    setShowMessageCard(false);
    setEmail('');
    setMessage('');
    toast.info("Message envoyé avec succès!");
  };

  const statuses = [
    { 
      label: "EN RECHERCHE DE TERRAIN",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      description: "Trouvez le terrain idéal pour votre projet",
      icon: MapPin
    },
    { 
      label: "OFFRE ACCEPTEE", 
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=250&fit=crop",
      description: "Votre offre est acceptée, poursuivons ensemble",
      icon: FileText
    },
    { 
      label: "TERRAIN SOUS COMPROMIS", 
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      description: "Finalisez votre acquisition en toute sérénité",
      icon: Shield
    }
  ];

  const services = [
    { 
      action: "ESTIMATION IMMOBILIÈRE", 
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      category: "ESTIMATION",
      description: "Évaluation précise de votre bien immobilier par des experts",
      time: "24h",
      rating: 4.8,
      price: "Gratuit"
    },
    { 
      action: "SIMULATION DE FINANCEMENT", 
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      category: "FINANCEMENT",
      description: "Calcul de votre capacité d'emprunt et meilleures offres",
      time: "2h",
      rating: 4.6,
      price: "Gratuit"
    },
    { 
      action: "COMPROMIS DE VENTE", 
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
      category: "JURIDIQUE",
      description: "Rédaction sécurisée de vos documents par des notaires",
      time: "48h",
      rating: 4.9,
      price: "À partir de 500€"
    },
    { 
      action: "DEVIS MUR DE SOUTÈNEMENT", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop",
      category: "CONSTRUCTION",
      description: "Devis détaillé pour vos travaux de construction",
      time: "24h",
      rating: 4.7,
      price: "Gratuit"
    },
    { 
      action: "INSTALLATION ALARME", 
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      category: "SÉCURITÉ",
      description: "Sécurisez votre habitat avec nos experts",
      time: "4h",
      rating: 4.8,
      price: "À partir de 300€"
    },
    { 
      action: "CHANGEMENT DE SERRURE", 
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=250&fit=crop",
      category: "SÉCURITÉ",
      description: "Remplacement rapide et sécurisé de vos serrures",
      time: "1h",
      rating: 4.5,
      price: "À partir de 80€"
    }
  ];

  const partnerCategories = [
    { 
      title: "ARCHITECTES", 
      action: "Découvrir", 
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=250&fit=crop", 
      description: "Conception et plans sur mesure",
      count: "24 experts"
    },
    { 
      title: "CONSTRUCTEURS", 
      action: "Découvrir", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop", 
      description: "Construction clé en main",
      count: "18 entreprises"
    },
    { 
      title: "ÉLECTRICIENS", 
      action: "Découvrir", 
      image: "https://images.unsplash.com/photo-1586210576191-2ec54cb58e14?w=400&h=250&fit=crop", 
      description: "Installation et dépannage électrique",
      count: "32 techniciens"
    },
    { 
      title: "NOTAIRES", 
      action: "Découvrir", 
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop", 
      description: "Conseil juridique et authentification",
      count: "15 notaires"
    },
  ];

  const partners = [
    { 
      name: "Studio Architecture", 
      action: "Voir projets", 
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=250&fit=crop", 
      category: "ARCHITECTES", 
      location: "Paris", 
      type: "maison",
      rating: 4.9,
      projects: 127,
      verified: true,
      experience: "15 ans"
    },
    { 
      name: "Construct Pro", 
      action: "Voir réalisations", 
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=250&fit=crop", 
      category: "CONSTRUCTEURS", 
      location: "Lyon", 
      type: "appartement",
      rating: 4.8,
      projects: 89,
      verified: true,
      experience: "12 ans"
    },
    { 
      name: "Elec Services", 
      action: "Demander devis", 
      image: "https://images.unsplash.com/photo-1586210576191-2ec54cb58e14?w=400&h=250&fit=crop", 
      category: "ÉLECTRICIENS", 
      location: "Marseille", 
      type: "maison",
      rating: 4.7,
      projects: 203,
      verified: true,
      experience: "8 ans"
    },
  ];

  const getFilteredPartners = (category) => {
    let filtered = category ? partners.filter(p => p.category === category) : partners.slice();
    
    if (partnersSearchQuery) {
      const q = partnersSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }

    if (propertyType) {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    if (locationFilter) {
      filtered = filtered.filter(p => p.location === locationFilter);
    }
    
    return filtered;
  };

  const getFilteredServices = () => {
    let filtered = services;
    
    if (servicesSearchQuery) {
      const q = servicesSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.action.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  };

  const toggleSector = (sector) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setPartnersSearchQuery("");
    setPropertyType("");
    setLocationFilter("");
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  const handleImageError = (e, fallbackText) => {
    const target = e.target;
    target.src = `https://via.placeholder.com/400x250/f8fafc/64748b?text=${encodeURIComponent(fallbackText)}`;
  };

  const StatusesSection = () => (
    <section className="py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre situation</h2>
        <p className="text-gray-600">Sélectionnez le service correspondant à votre besoin</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statuses.map((status, index) => {
          const IconComponent = status.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group border border-gray-200"
              onClick={() => handleStatusClick(status.label, status.image)}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={status.image}
                  alt={status.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => handleImageError(e, status.label)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                  {status.label}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {status.description}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Choisir cette option</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const PartnersSection = ({ category }) => {
    const filteredPartners = getFilteredPartners(category);
    const displayedPartners = filteredPartners.slice(0, displayCount);

    return (
      <>
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={partnersSearchQuery}
                onChange={(e) => setPartnersSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <button 
                  className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors min-w-[160px] justify-between"
                  onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    {propertyType ? propertyTypes.find(p => p.value === propertyType)?.label : "Type de bien"}
                  </div>
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

              <div className="relative">
                <button 
                  className="flex items-center gap-2 border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors min-w-[160px] justify-between"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {locationFilter || "Localisation"}
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-slide-down max-h-60 overflow-y-auto">
                    {locations.map((location) => (
                      <button
                        key={location}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                          locationFilter === location ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                        onClick={() => {
                          setLocationFilter(location === locationFilter ? "" : location);
                          setShowLocationDropdown(false);
                        }}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(partnersSearchQuery || selectedSectors.length > 0 || propertyType || locationFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer les filtres
              </button>
            )}
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucun partenaire trouvé avec ces critères.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 animate-fade-in">
              {displayedPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={partner.image} 
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => handleImageError(e, partner.name)}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">{partner.rating}</span>
                    </div>
                    {partner.verified && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full p-1">
                        <Shield className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{partner.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{partner.location} • {propertyTypes.find(p => p.value === partner.type)?.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {partner.projects} projets
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {partner.experience}
                        </span>
                      </div>
                      <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                        {partner.category}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center text-sm">
                        {partner.action}
                      </button>
                      <button 
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => handleContactPartner(partner)}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => handleDownloadBrochure(partner)}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            
            {filteredPartners.length > displayCount && (
              <div className="text-center mb-8">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105 shadow-lg"
                >
                  Voir plus de partenaires
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const ServicesSection = () => {
    const filteredServices = getFilteredServices();
    const displayedServices = filteredServices.slice(0, displayCount);

    return (
      <>
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Rechercher un service..."
                value={servicesSearchQuery}
                onChange={(e) => setServicesSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucun service trouvé avec ces critères.</p>
              <button 
                onClick={() => setServicesSearchQuery("")}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-fade-in">
              {displayedServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-200"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={service.action}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => handleImageError(e, service.action)}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold text-gray-900">{service.rating}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                      {service.time}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{service.action}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {service.category}
                      </span>
                      <span className="text-sm font-semibold text-green-600">{service.price}</span>
                    </div>
                    
                    <button 
                      className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center"
                      onClick={() => handleRequestQuote(service)}
                    >
                      Demander un devis
                    </button>
                  </div>
                </div>
              ))}
            </section>
            
            {filteredServices.length > displayCount && (
              <div className="text-center mb-8">
                <button 
                  onClick={handleLoadMore}
                  className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors transform hover:scale-105 shadow-lg"
                >
                  Voir plus de services
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const AidesSection = () => (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Centre d'Aide et Support</h2>
        <p className="text-gray-600 mb-8">Notre équipe est à votre disposition pour vous accompagner</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 rounded-full p-2">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Contactez-nous</h3>
            </div>
            <p className="text-gray-600 mb-4">Notre équipe est disponible pour vous aider</p>
            <button 
              onClick={handleCallSupport}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium w-full"
            >
              Appeler le support
            </button>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-600 rounded-full p-2">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Envoyez-nous un email</h3>
            </div>
            <p className="text-gray-600 mb-4">Nous répondons sous 24 heures</p>
            <button 
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium w-full"
              onClick={() => setShowMessageCard(true)}
            >
              Envoyer un email
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
          <div className="space-y-4">
            {[
              "Comment choisir le bon partenaire ?",
              "Quels documents préparer pour une estimation ?",
              "Délais moyens pour les prestations",
              "Comment modifier une demande ?"
            ].map((question, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <span className="text-gray-700">{question}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative">
      {/* Image de fond subtile pour toute la page */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
        }}
      />

      <div className="relative z-10">
        {/* Hero Section avec belle image de fond pour le bleu */}
        <section className="relative bg-black  text-white py-16 mt-12 overflow-hidden">
          {/* Image de fond pour la section bleue */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80")`
            }}
          />
          
          {/* Overlay gradient pour améliorer la lisibilité */}
          <div className="absolute inset-0 " />
          
          <div className="relative h-36 z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-xl md:text-4xl font-bold mb-4">
              {view === "services" && "Services Immobiliers Professionnels"}
              {view === "partenaires" && "Nos Partenaires de Confiance"}
              {view === "aides" && "Centre d'Aide & Support"}
            </h1>
            <p className="text-sm text-blue-100 mb-8 max-w-3xl mx-auto">
              {view === "services" && "Des solutions complètes pour tous vos projets immobiliers, de l'estimation à la réalisation."}
              {view === "partenaires" && "Découvrez notre réseau d'experts immobiliers qualifiés et vérifiés."}
              {view === "aides" && "Notre équipe est là pour vous accompagner à chaque étape de votre projet."}
            </p>
            
            {/* Navigation améliorée */}
            <nav className="inline-flex gap-1 items-center justify-center rounded-2xl p-1 mt-2 bg-white/20 backdrop-blur-sm border border-white/30">
              <button
                onClick={() => handleNavigation("services")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  view === "services"
                    ? "bg-white text-blue-600 shadow-sm font-semibold"
                    : "text-blue-100 hover:text-white hover:bg-white/20"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Services</span>
              </button>
              
              <button
                onClick={() => handleNavigation("partenaires")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  view === "partenaires"
                    ? "bg-white text-blue-600 shadow-sm font-semibold"
                    : "text-blue-100 hover:text-white hover:bg-white/20"
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Partenaires</span>
              </button>
              
              <button
                onClick={() => handleNavigation("aides")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                  view === "aides"
                    ? "bg-white text-blue-600 shadow-sm font-semibold"
                    : "text-blue-100 hover:text-white hover:bg-white/20"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span>Aide</span>
              </button>
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Bouton Envoyer un message flottant */}
          <div className="fixed bottom-6 right-6 z-40 animate-fade-in">
            <button 
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
              onClick={() => setShowMessageCard(true)}
            >
              <Send className="w-4 h-4" />
              Nous contacter
            </button>
          </div>

          {showStatuses && <StatusesSection />}
          
          {view === "services" && !showStatuses && <ServicesSection />}
          
          {view === "aides" && <AidesSection />}
          
          {view === "partenaires" && !showPartners && !showStatuses && (
            <section className="py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Catégories de Partenaires</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Découvrez notre réseau d'experts immobiliers triés sur le volet pour vous accompagner dans tous vos projets
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {partnerCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-gray-200 group"
                    onClick={() => {
                      setSelectedCategory(category.title);
                      setShowPartners(true);
                      setDisplayCount(6);
                    }}
                  >
                    <div className="text-center mb-4">
                      <div className="bg-blue-100 rounded-xl p-3 inline-flex group-hover:bg-blue-500 transition-colors">
                        <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg text-center mb-2">{category.title}</h3>
                    <p className="text-gray-600 text-sm text-center mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{category.count}</span>
                      <div className="flex items-center text-blue-600 font-medium text-sm">
                        {category.action}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Partenaires en vedette */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Partenaires en Vedette</h3>
                    <p className="text-gray-600">Découvrez quelques-uns de nos meilleurs partenaires</p>
                  </div>
                  <button 
                    onClick={handleViewAllPartners}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Voir tous les partenaires
                  </button>
                </div>
                <PartnersSection category="" />
              </div>
            </section>
          )}
          
          {showPartners && !showStatuses && <PartnersSection category={selectedCategory} />}
        </main>
      </div>

      {/* Modals */}
      {showCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
                {selectedServiceForm}
              </h2>
              <p className="text-gray-600 text-center text-sm mb-6">
                Remplissez les informations nécessaires pour continuer
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de signature du compromis
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notaires ou Avocats
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
                    <option value="">Choisir un notaire/avocat</option>
                    <option value="notaire1">Maître Dupont</option>
                    <option value="notaire2">Maître Martin</option>
                    <option value="avocat1">Maître Durand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type du bien que vous souhaitez
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

              <div className="flex gap-3 justify-end mt-6">
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => setShowCard(false)}
                >
                  Annuler
                </button>
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105"
                  onClick={() => setShowCard(false)}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMessageCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Nous Contacter
                </h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowMessageCard(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Décrivez votre projet ou votre question..."
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => {
                    setShowMessageCard(false);
                    setEmail('');
                    setMessage('');
                  }}
                >
                  Annuler
                </button>
                <button
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
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
    </div>
  );
}

export default ServicesPartnersPage;