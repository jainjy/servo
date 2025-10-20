import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, ChevronDown, Search, X, Filter, Send, Mail } from "lucide-react";
import architecteImg from "@/assets/propertyLouer-1.jpg";
import constructeurImg from "@/assets/propertyLouer-2.jpg";
import electricienImg from "@/assets/propertyLouer-3.jpeg";
import assuranceImg from "@/assets/propertyVendre-1.jpg";

export default function ServicesPartnersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("default");
  const [showPartners, setShowPartners] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [selectedServiceForm, setSelectedServiceForm] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [displayCount, setDisplayCount] = useState(8);

  // Auto-selection de la section depuis l'URL
  useEffect(() => {
    if (section) {
      if (section === "partenaires") setView("partenaires");
      if (section === "prestations") setView("services");
      if (section === "aides") alert("Section Aides sélectionnée !");
    }
  }, [section]);

  const sectors = ["Secteur Nord", "Secteur Ouest", "Secteur Est", "Secteur Sud"];
  
  const handleStatusClick = (statusLabel: string, statusImage: string) => {
    setSelectedServiceForm(statusLabel);
    setSelectedImage(statusImage);
    setShowCard(true);
  };

  const statuses = [
    { 
      label: "EN RECHERCHE DE TERRAIN",
      image: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Recherche+Terrain",
      description: "Trouvez le terrain idéal pour votre projet"
    },
    { 
      label: "OFFRE ACCEPTEE", 
      image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Offre+Acceptée",
      description: "Votre offre est acceptée, poursuivons ensemble"
    },
    { 
      label: "TERRAIN SOUS COMPROMIS", 
      image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Terrain+Compromis",
      description: "Finalisez votre acquisition en toute sérénité"
    },
    { 
      label: "AUTRES ?", 
      image: "https://via.placeholder.com/300x200/6B7280/FFFFFF?text=Autres+Services",
      description: "Besoin d'autres services ? Contactez-nous"
    }
  ];

  const services = [
    { 
      action: "FAIRE UNE ESTIMATION IMMOBILIERE", 
      counter: "1/9",
      image: architecteImg 
    },
    { 
      action: "FAIRE UN DEVIS DE CONSTRUCTION", 
      counter: "1/9",
      image: constructeurImg 
    },
    { 
      action: "FAIRE UNE SIMULATION DE FINANCEMENT", 
      counter: "1/9",
      image: electricienImg 
    },
    { 
      action: "FAIRE UN DEVIS D'ASSURANCE", 
      counter: "1/9",
      image: assuranceImg 
    },
    { 
      action: "FAIRE REDIGER UN COMPROMIS DE VENTE", 
      counter: "1/9",
      image: architecteImg 
    },
    { 
      action: "FAIRE UN DEVIS MUR DE SOUTENNEMENT", 
      counter: "1/9",
      image: constructeurImg 
    },
    { 
      action: "FAIRE INSTALLER UNE ALARME", 
      counter: "1/9",
      image: electricienImg 
    },
    { 
      action: "FAIRE UN DEVIS CHANGEMENT DE SERRURE", 
      counter: "1/9",
      image: assuranceImg 
    },
    { 
      action: "SERVICE SUPPLEMENTAIRE 1", 
      counter: "1/9",
      image: architecteImg 
    },
    { 
      action: "SERVICE SUPPLEMENTAIRE 2", 
      counter: "1/9",
      image: constructeurImg 
    },
  ];

  const defaultCategories = [
    { title: "ARCHITECTES", action: "Présentation", counter: "1/12", image: architecteImg },
    { title: "CONSTRUCTEUR", action: "FAIRE UN DEVIS", counter: "1/4", image: constructeurImg },
    { title: "ELECTRICIEN", action: "DEMANDE D'INTERVENTION", counter: "1/3", image: electricienImg },
    { title: "ASSURANCE", action: "FAIRE UN DEVIS", counter: "1/3", image: assuranceImg },
  ];

  const adesCategories = [
    { title: "AGENTS MANGIBLER", action: "VOIR", counter: "14", image: architecteImg },
    { title: "AVOCATS", action: "VOIR", counter: "14", image: constructeurImg },
    { title: "ARCHITECTES", action: "VOIR", counter: "14", image: electricienImg },
    { title: "AMENAGEUR", action: "VOIR", counter: "14", image: assuranceImg },
  ];

  const partners = [
    { name: "SARL", sector: "Secteur Nord", action: "PROJETS REALISES", counter: "AVIS 1/4", image: architecteImg, category: "ARCHITECTES" },
    { name: "MR OL", sector: "Secteur Nord", action: "PROJETS REALISES", counter: "AVIS 1/4", image: constructeurImg, category: "AVOCATS" },
    { name: "MR VER", sector: "Secteur Nord", action: "PROJETS REALISES", counter: "AVIS 1/4", image: electricienImg, category: "ARCHITECTES" },
    { name: "MR M", sector: "Secteur Ouest", action: "PROJETS REALISES", counter: "AVIS 1/4", image: assuranceImg, category: "AMENAGEUR" },
    { name: "MIC P", sector: "Secteur Ouest", action: "PROJETS REALISES", counter: "AVIS 1/4", image: architecteImg, category: "AGENTS MANGIBLER" },
    { name: "SAREL", sector: "Secteur Ouest", action: "PROJETS REALISES", counter: "AVIS 1/4", image: constructeurImg, category: "AVOCATS" },
    { name: "SAS", sector: "Secteur Est", action: "PROJETS REALISES", counter: "AVIS 1/4", image: electricienImg, category: "ARCHITECTES" },
    { name: "MR X", sector: "Secteur Est", action: "PROJETS REALISES", counter: "AVIS 1/4", image: assuranceImg, category: "AMENAGEUR" },
    { name: "PARTENAIRE SUPP 1", sector: "Secteur Sud", action: "PROJETS REALISES", counter: "AVIS 1/4", image: architecteImg, category: "ARCHITECTES" },
    { name: "PARTENAIRE SUPP 2", sector: "Secteur Sud", action: "PROJETS REALISES", counter: "AVIS 1/4", image: constructeurImg, category: "AVOCATS" },
  ];

  const categories = view === "partenaires" ? adesCategories : defaultCategories;

  const getFilteredPartners = (category: string) => {
    let filtered = partners.filter(p => p.category === category);
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(p => selectedSectors.includes(p.sector));
    }
    
    return filtered;
  };

  const getFilteredServices = () => {
    return services.filter(s => 
      s.action.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % categories.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + categories.length) % categories.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSearchQuery("");
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 8);
  };

  const handleSendMessage = () => {
    // Ici vous pouvez ajouter la logique pour envoyer le message
    console.log("Email:", email);
    console.log("Message:", message);
    setShowMessageCard(false);
    setEmail('');
    setMessage('');
    alert("Message envoyé avec succès!");
  };

  // Fonction pour gérer les erreurs d'image
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackText: string) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://via.placeholder.com/300x200/6B7280/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
  };

  const StatusesSection = () => (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 animate-fade-in">
      {statuses.map((status, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slide-from-top relative"
          style={{ 
            minHeight: "280px",
            animationDelay: `${index * 100}ms`
          }}
          onClick={() => handleStatusClick(status.label, status.image)}
        >
          {/* Image de la carte avec bouton flottant */}
          <div className="h-40 bg-gradient-to-br from-blue-100 to-gray-100 overflow-hidden relative">
            <img
              src={status.image}
              alt={status.label}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => handleImageError(e, status.label)}
            />
            <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors duration-300" />
            <button className="absolute bottom-3 right-3 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors transform hover:scale-105">
              Sélectionner
            </button>
          </div>
          
          {/* Contenu de la carte */}
          <div className="p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Service</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-semibold text-gray-900">{status.label}</span>
              <p className="text-sm text-gray-600 mt-2">{status.description}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );

  const PartnersSection = ({ category }: { category: string }) => {
    const filteredPartners = getFilteredPartners(category);
    const displayedPartners = filteredPartners.slice(0, displayCount);

    return (
      <>
        <div className="mb-8 mt-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="RECHERCHER UN PARTENAIRE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-white text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
            
            <button 
              className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-3 text-sm font-medium bg-white hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {selectedSectors.length > 0 && (
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {selectedSectors.length}
                </span>
              )}
            </button>

            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-3 text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
              <MapPin className="w-5 h-5" />
              Localisation
            </button>

            {(searchQuery || selectedSectors.length > 0) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl animate-slide-down">
              <h4 className="text-sm font-semibold mb-3">Filtrer par secteur :</h4>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSectors.includes(sector)
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredPartners.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-500">Aucun partenaire trouvé avec ces critères.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:underline"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 animate-fade-in">
              {displayedPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up relative"
                  style={{ 
                    minHeight: "300px",
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src={partner.image} 
                      alt={partner.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => handleImageError(e, partner.name)}
                    />
                    <button className="absolute bottom-3 right-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors transform hover:scale-105">
                      {partner.action}
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{partner.sector}</p>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-3 mt-auto">
                      <span className="text-sm text-gray-500 font-medium">{partner.counter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            
            {filteredPartners.length > displayCount && (
              <div className="text-center mb-16 mt-8">
                <button 
                  onClick={handleLoadMore}
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors transform hover:scale-105"
                >
                  VOIR PLUS
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
        <div className="mb-8 mt-6 animate-fade-in">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="RECHERCHER UN SERVICE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-white text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-3 text-sm font-medium bg-white hover:bg-gray-50 transition-colors">
              <MapPin className="w-5 h-5" />
              Localisation
            </button>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-gray-500">Aucun service trouvé avec ces critères.</p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
              {displayedServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up relative"
                  style={{ 
                    minHeight: "280px",
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                    <img 
                      src={service.image} 
                      alt={service.action}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      onError={(e) => handleImageError(e, service.action)}
                    />
                    <button 
                      className="absolute bottom-3 right-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors transform hover:scale-105"
                      onClick={() => {
                        setSelectedService(service.action); 
                        setShowStatuses(true);              
                      }}
                    >
                      {service.action}
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1 justify-center">
                    <div className="text-center">
                      <span className="text-sm text-gray-500 font-medium">{service.counter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {filteredServices.length > displayCount && (
              <div className="text-center mb-16">
                <button 
                  onClick={handleLoadMore}
                  className="inline-block px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors transform hover:scale-105"
                >
                  VOIR PLUS
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderHeaderTitles = () => {
    if (showStatuses) {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-900">PRÉSENTATION PARTENAIRES</h1>
          <h2 className="text-xl font-semibold text-blue-600">{selectedService}</h2>
          <h3 className="text-lg text-gray-500">TERRAIN SOUS COMPROMIS - Saint-Denis</h3>
        </>
      );
    }
    if (showPartners) {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-900">PRÉSENTATION PARTENAIRES</h1>
          <h2 className="text-xl font-semibold text-blue-600">{selectedCategory}</h2>
        </>
      );
    }
    if (view === "partenaires") {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-900">PRÉSENTATION PARTENAIRES</h1>
          <h2 className="text-xl font-semibold text-blue-600">DEMANDES DE PRESTATIONS</h2>
        </>
      );
    }
    if (view === "services") {
      return (
        <>
          <h1 className="text-2xl font-bold text-gray-900">PRÉSENTATION PARTENAIRES</h1>
          <h2 className="text-xl font-semibold text-blue-600">DEMANDES DE PRESTATIONS</h2>
        </>
      );
    }
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900">PRÉSENTATION PARTENAIRES</h1>
        <h2 className="text-xl font-semibold text-blue-600">DEMANDES DE PRESTATIONS</h2>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <header className="pt-8 px-8 pb-6 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">{renderHeaderTitles()}</div>

          <div className="flex flex-wrap gap-4">
            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 ${
                view === "partenaires" ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => {
                setView("partenaires");
                setShowPartners(false);
                setShowStatuses(false);
                setSearchQuery("");
                setSelectedSectors([]);
                setDisplayCount(8);
              }}
            >
              PRÉSENTATION PARTENAIRES
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-300 ${
                view === "services" ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => {
                setView("services");
                setShowPartners(false);
                setShowStatuses(false);
                setSearchQuery("");
                setDisplayCount(8);
              }}
            >
              DEMANDES DE PRESTATIONS
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-colors transform hover:scale-105">
              AIDES
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-8"><hr className="border-gray-200 my-4" /></div>

      <main className="max-w-[1200px] mx-auto px-8 pb-20">
        {/* Bouton Envoyer un message en bas à gauche */}
        <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
          <button 
            className="px-6 py-3 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            onClick={() => setShowMessageCard(true)}
          >
            <Send className="w-4 h-4" />
            Envoyer un message
          </button>
        </div>
        
        {showStatuses && <StatusesSection />}
        
        {view === "services" && !showStatuses && <ServicesSection />}
        {view === "partenaires" && !showPartners && !showStatuses && (
          <>
            <div className="flex justify-end mb-4 animate-fade-in">
              <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md overflow-hidden transition-all duration-300 w-48 hover:w-64 px-2 py-1">
                <Search className="w-5 h-5 text-gray-400 transition-all duration-300" />
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 ml-2 text-sm text-gray-700 focus:outline-none placeholder-gray-400 transition-all duration-300"
                />
              </div>
            </div>

            <div className="lg:hidden mt-10 relative animate-fade-in">
              <div className="relative overflow-hidden rounded-3xl" style={{ height: "400px" }}>
                <div
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                    isAnimating ? "opacity-0" : "opacity-100"
                  }`}
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={categories[currentSlide].image}
                      alt={categories[currentSlide].title}
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, categories[currentSlide].title)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent text-white flex flex-col justify-between p-6">
                      <h4 className="text-sm font-semibold tracking-wide">{categories[currentSlide].title}</h4>
                      <div className="flex items-center justify-between mt-auto">
                        <button
                          className="px-4 py-2 rounded-xl border border-white bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors transform hover:scale-105"
                          onClick={() => {
                            setSelectedCategory(categories[currentSlide].title);
                            setShowPartners(true);
                            setDisplayCount(8);
                          }}
                        >
                          {categories[currentSlide].action}
                        </button>
                        <span className="text-sm">{categories[currentSlide].counter}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronDown className="w-6 h-6 rotate-90" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronDown className="w-6 h-6 -rotate-90" />
              </button>

              <div className="flex justify-center mt-4 space-x-2">
                {categories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <section className="hidden lg:grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
              {categories.map((cat, index) => (
                <article
                  key={cat.title}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-from-top"
                  style={{
                    height: 300,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => handleImageError(e, cat.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent text-white flex flex-col justify-between p-6">
                    <h4 className="text-sm font-semibold tracking-wide">{cat.title}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        className="px-4 py-2 rounded-xl border border-white bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors transform hover:scale-105"
                        onClick={() => {
                          setSelectedCategory(cat.title);
                          setShowPartners(true);
                          setDisplayCount(8);
                        }}
                      >
                        {cat.action}
                      </button>
                      <span className="text-sm">{cat.counter}</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
        
        {showPartners && !showStatuses && <PartnersSection category={selectedCategory} />}
        
        {view === "default" && !showStatuses && (
          <section className="mt-10 relative animate-fade-in">
            <div className="absolute -top-12 right-0 left-0 z-50 flex justify-between px-8">
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  Filtre
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  onClick={() => alert("Localisation activée !")}
                >
                  <MapPin className="w-4 h-4" />
                  Localisation
                </button>
              </div>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                onClick={() => alert("Déposer un avis activé !")}
              >
                DEPOSER UN AVIS
              </button>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {defaultCategories.map((cat, index) => (
                <article
                  key={cat.title}
                  className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-from-top"
                  style={{ 
                    height: 300,
                    animationDelay: `${index * 100}ms` 
                  }}
                >
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" 
                    onError={(e) => handleImageError(e, cat.title)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent text-white flex flex-col justify-between p-6">
                    <h4 className="text-sm font-semibold tracking-wide">{cat.title}</h4>
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        className="px-4 py-2 rounded-xl border border-white bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors transform hover:scale-105"
                        onClick={() => alert(`Action sur ${cat.title}`)}
                      >
                        {cat.action}
                      </button>
                      <span className="text-sm">{cat.counter}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        

        {/* Modal du formulaire de statut */}
        {showCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 animate-slide-smooth">
              
              {/* En-tête avec image */}
              <div className="mb-6">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedImage}
                    alt={selectedServiceForm}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, selectedServiceForm)}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center">
                  {selectedServiceForm}
                </h2>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
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

              {/* Footer avec boutons */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setShowCard(false)}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105"
                  onClick={() => setShowCard(false)}
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Carte d'envoi de message */}
        {showMessageCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 animate-fade-in">
            <div className="bg-white border border-gray-300 rounded-r-2xl shadow-2xl p-6 w-full max-w-md h-full ml-0 animate-slide-from-left">
              
              {/* En-tête */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Nouveau Message
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setShowMessageCard(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Formulaire de message */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => {
                    setShowMessageCard(false);
                    setEmail('');
                    setMessage('');
                  }}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-from-top {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-smooth {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slide-from-left {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animate-slide-from-top {
          animation: slide-from-top 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-smooth {
          animation: slide-smooth 0.4s ease-out forwards;
        }
        .animate-slide-from-left {
          animation: slide-from-left 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}