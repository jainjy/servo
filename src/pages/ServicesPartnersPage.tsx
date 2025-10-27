import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, ChevronDown, Search, X, Filter, Send, Mail, Home, Building, Warehouse, Hotel } from "lucide-react";
import fond from "/public/fond.jpeg";

const ServicesPartnersPage = () => { 
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const section = params.get("section");

  const [view, setView] = useState("default");
  const [showPartners, setShowPartners] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // Separate search queries per section to avoid conflicts when switching views
  const [partnersSearchQuery, setPartnersSearchQuery] = useState("");
  const [servicesSearchQuery, setServicesSearchQuery] = useState("");
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
  const [propertyType, setPropertyType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [surfaceArea, setSurfaceArea] = useState([0, 500]);
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

  const sectors = ["Secteur Nord", "Secteur Ouest", "Secteur Est", "Secteur Sud"];
  
  const propertyTypes = [
    { value: "maison", label: "Maison/Villa", icon: Home },
    { value: "appartement", label: "Appartement", icon: Building },
    { value: "terrain", label: "Terrain", icon: Warehouse },
    { value: "hotel", label: "Hôtel/Gîte", icon: Hotel }
  ];

  const locations = [
    "Paris",
    "Lyon", 
    "Marseille",
    "Bordeaux",
    "Toulouse",
    "Lille",
    "Nice",
    "Nantes"
  ];

  const handleStatusClick = (statusLabel: string, statusImage: string) => {
    setSelectedServiceForm(statusLabel);
    setSelectedImage(statusImage);
    setShowCard(true);
  };

  const statuses = [
    { 
      label: "EN RECHERCHE DE TERRAIN",
      image: "/propertyLouer-1.jpg",
      description: "Trouvez le terrain idéal pour votre projet"
    },
    { 
      label: "OFFRE ACCEPTEE", 
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
      description: "Votre offre est acceptée, poursuivons ensemble"
    },
    { 
      label: "TERRAIN SOUS COMPROMIS", 
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
      description: "Finalisez votre acquisition en toute sérénité"
    },
    { 
      label: "AUTRES ?", 
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop",
      description: "Besoin d'autres services ? Contactez-nous"
    }
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

  const defaultCategories = [
    { title: "ARCHITECTES", action: "Présentation", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=60", description: "Conception et plans sur mesure" },
    { title: "CONSTRUCTEUR", action: "FAIRE UN DEVIS", image: "https://i.pinimg.com/1200x/bc/5e/a7/bc5ea764c3ea92a4986534e1ba6c00b0.jpg", description: "Construction clé en main" },
    { title: "ELECTRICIEN", action: "DEMANDE D'INTERVENTION", image: "https://i.pinimg.com/736x/a9/04/aa/a904aafbbdfb95cc39875c2b51a68a61.jpg", description: "Installation et dépannage électrique" },
    { title: "ASSURANCE", action: "FAIRE UN DEVIS", image: "https://i.pinimg.com/736x/51/fa/63/51fa63dbb21a989093c62aec9e00d4cb.jpg", description: "Couverture et conseils adaptés" },
  ];

  const adesCategories = [
    { title: "AGENTS IMMOBILIERS", action: "VOIR", image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=60", description: "Achat / vente / estimation" },
    { title: "AVOCATS", action: "VOIR", image: "https://i.pinimg.com/736x/db/8a/fb/db8afbf7468560fd21309f0e95c57aef.jpg", description: "Conseil juridique et contrats" },
    { title: "ARCHITECTES", action: "VOIR", image: "https://i.pinimg.com/736x/88/dc/49/88dc49dbcfc2ebc7837c72510e1f36ce.jpg", description: "Design et plans techniques" },
    { title: "AMENAGEUR", action: "VOIR",image: "https://i.pinimg.com/736x/4b/c1/97/4bc197be95dbea9cb9f5d24ac6ed4c72.jpg", description: "Aménagement intérieur/exterieur" },
  ];

  const partners = [
    { name: "SARL Studio", action: "Projets réalisés", image: "https://i.pinimg.com/736x/07/e9/ae/07e9ae27c9b9d4582cab297a63968db5.jpg", category: "ARCHITECTES", location: "Paris", type: "maison" },
    { name: "Olivia Avocats", action: "Conseils", image: "https://i.pinimg.com/736x/db/9d/11/db9d1190dfd0c254804b50a135d73622.jpg", category: "AVOCATS", location: "Lyon", type: "appartement" },
    { name: "Ver Designs", action: "Projets réalisés", image: "https://i.pinimg.com/736x/f2/8d/0d/f28d0d3a25580e5022eaab4d123b1c4f.jpg", category: "ARCHITECTES", location: "Marseille", type: "terrain" },
    { name: "M Construction", action: "Chantiers", image: "https://i.pinimg.com/736x/cc/3e/de/cc3ede7fa74ef97f47dfb4fbbd9be62b.jpg", category: "AMENAGEUR", location: "Bordeaux", type: "maison" },
    { name: "Micro Properties", action: "Ventes", image: "https://i.pinimg.com/736x/9e/d9/7e/9ed97e4b1513fba0e17a01d0ae4a50d5.jpg", category: "AGENTS IMMOBILIERS", location: "Paris", type: "appartement" },
    { name: "SAS Créa", action: "Projets réalisés", image: "https://i.pinimg.com/736x/83/c5/3c/83c53c8490a44d4956a1cfddf196422c.jpg", category: "ARCHITECTES", location: "Lille", type: "hotel" },
    { name: "X Aménagement", action: "Conception", image: "https://i.pinimg.com/736x/2f/8b/66/2f8b6620db78c9f63a744f9c9888c14d.jpg", category: "AMENAGEUR", location: "Nice", type: "terrain" },
    { name: "Partenaire 1", action: "Projets", image: "https://i.pinimg.com/736x/8f/77/b2/8f77b281f45c7fc1a06ba327f6454ca0.jpg", category: "ARCHITECTES", location: "Toulouse", type: "maison" },
  ];

  const categories = view === "partenaires" ? adesCategories : defaultCategories;

  const getFilteredPartners = (category: string) => {
    // If a category is provided, filter by it; otherwise start with all partners
    let filtered = category ? partners.filter(p => p.category === category) : partners.slice();
    
    // Filtre par recherche (partenaires)
    if (partnersSearchQuery) {
      const q = partnersSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    
    // Filtre par secteur
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(p => 
        selectedSectors.some(sector => p.location.includes(sector.replace("Secteur ", "")))
      );
    }

    // Filtre par type de propriété
    if (propertyType) {
      filtered = filtered.filter(p => p.type === propertyType);
    }

    // Filtre par localisation
    if (locationFilter) {
      filtered = filtered.filter(p => p.location === locationFilter);
    }
    
    return filtered;
  };

  const getFilteredServices = () => {
    let filtered = services;
    
    // Filtre par recherche (services)
    if (servicesSearchQuery) {
      const q = servicesSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.action.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    // Filtre par type de propriété
    if (propertyType) {
      filtered = filtered.filter(s => {
        // Logique de correspondance entre type de propriété et catégorie de service
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
    setPartnersSearchQuery("");
    setPropertyType("");
    setLocationFilter("");
    setPriceRange([0, 1000000]);
    setSurfaceArea([0, 500]);
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
    target.src = `https://via.placeholder.com/300x200/374151/FFFFFF?text=${encodeURIComponent(fallbackText)}`;
  };

  const StatusesSection = () => (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 animate-fade-in">
      {statuses.map((status, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slide-from-top border border-white/20"
          style={{ 
            minHeight: "280px",
            animationDelay: `${index * 100}ms`
          }}
          onClick={() => handleStatusClick(status.label, status.image)}
        >
          <img
            src={status.image}
            alt={status.label}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => handleImageError(e, status.label)}
          />
          
          <div className="absolute inset-0 bg-black/30 hover:bg-black/20 transition-colors duration-300" />
          
          <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center">
            <div className="mb-3">
              <span className="text-sm font-medium text-white drop-shadow-md">Service</span>
            </div>
            <div className="mt-2">
              <span className="text-base font-semibold text-white drop-shadow-md">{status.label}</span>
              <p className="text-sm text-white drop-shadow-md mt-2">{status.description}</p>
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
                value={partnersSearchQuery}
                onChange={(e) => setPartnersSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-golden-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>
            
            

            {/* Dropdown Type de propriété */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-3 text-sm font-medium bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              >
                <Home className="w-4 h-4" />
                {propertyType ? propertyTypes.find(p => p.value === propertyType)?.label : "Type de bien"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showPropertyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 z-50 animate-slide-down">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`w-full text-left px-4 py-3 hover:bg-white/20 transition-colors flex items-center gap-3 ${
                        propertyType === type.value ? 'bg-golden-500/20 text-golden-300' : 'text-white'
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

            {/* Dropdown Localisation */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-3 text-sm font-medium bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <MapPin className="w-4 h-4" />
                {locationFilter || "Localisation"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 z-50 animate-slide-down max-h-60 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location}
                      className={`w-full text-left px-4 py-3 hover:bg-white/20 transition-colors ${
                        locationFilter === location ? 'bg-golden-500/20 text-golden-300' : 'text-white'
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

            {(partnersSearchQuery || selectedSectors.length > 0 || propertyType || locationFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-lg rounded-2xl animate-slide-down border border-white/20">
              <h4 className="text-sm font-semibold text-white mb-3">Filtrer par secteur :</h4>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSectors.includes(sector)
                        ? "bg-golden-500 text-white"
                        : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
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
            <p className="text-white/70">Aucun partenaire trouvé avec ces critères.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-golden-300 hover:text-golden-200 font-medium"
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
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-white/20 bg-white/10 backdrop-blur-lg"
                  style={{ 
                    minHeight: "300px",
                    animationDelay: `${index * 0.1}s` 
                  }}
                >
                  <img 
                    src={partner.image} 
                    alt={partner.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => handleImageError(e, partner.name)}
                  />

                  <div className="absolute left-4 right-4 -bottom-4">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-lg flex items-start gap-3 border border-white/20">
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-white/30">
                        <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" onError={(e) => handleImageError(e, partner.name)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{partner.name}</h3>
                        <p className="text-xs text-white/70 mt-1">{partner.location} • {propertyTypes.find(p => p.value === partner.type)?.label}</p>
                      </div>
                      <div className="flex items-center">
                        <button className="px-3 py-2 bg-golden-500 text-white rounded-lg text-xs font-medium hover:bg-golden-600 transition-colors whitespace-nowrap backdrop-blur-sm">
                          {partner.action}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            
            {filteredPartners.length > displayCount && (
              <div className="text-center mb-16 mt-8">
                <button 
                  onClick={handleLoadMore}
                  className="inline-block px-8 py-4 bg-golden-500 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-golden-600 transition-colors transform hover:scale-105 shadow-lg backdrop-blur-sm"
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
                value={servicesSearchQuery}
                onChange={(e) => setServicesSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-golden-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
            </div>

            {/* Dropdown Type de propriété pour services */}
            <div className="relative">
              <button 
                className="flex items-center gap-2 border border-white/30 rounded-full px-4 py-3 text-sm font-medium bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
              >
                <Home className="w-4 h-4" />
                {propertyType ? propertyTypes.find(p => p.value === propertyType)?.label : "Type de bien"}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showPropertyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 z-50 animate-slide-down">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`w-full text-left px-4 py-3 hover:bg-white/20 transition-colors flex items-center gap-3 ${
                        propertyType === type.value ? 'bg-golden-500/20 text-golden-300' : 'text-white'
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
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>
        </div>

        {filteredServices.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-white/70">Aucun service trouvé avec ces critères.</p>
            <button 
              onClick={() => {
                setServicesSearchQuery("");
                setPropertyType("");
              }}
              className="mt-4 text-golden-300 hover:text-golden-200 font-medium"
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
                  className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-white/20"
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
                      <h3 className="text-sm font-semibold text-white mb-2">{service.action}</h3>
                      <span className="inline-block px-2 py-1 bg-golden-500/20 text-golden-300 rounded-full text-xs font-medium backdrop-blur-sm">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <button 
                        className="px-4 py-2 bg-golden-500 text-white rounded-lg text-xs font-medium hover:bg-golden-600 transition-colors flex-1 mr-2 backdrop-blur-sm"
                        onClick={() => {
                          setSelectedService(service.action); 
                          setShowStatuses(true);              
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
                  className="inline-block px-8 py-4 bg-golden-500 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-golden-600 transition-colors transform hover:scale-105 shadow-lg backdrop-blur-sm"
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

  const AidesSection = () => (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in">
      <div className="bg-transparent backdrop-blur-lg rounded-2xl shadow-lg p-8 ">
        <h2 className="text-2xl font-bold text-white mb-6">Centre d'Aide et Support</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-golden-500/20 backdrop-blur-md rounded-xl p-6 border border-golden-300/30">
            <h3 className="text-lg font-semibold text-white mb-3">📞 Contactez-nous</h3>
            <p className="text-white/80 mb-4">Notre équipe est disponible pour vous aider</p>
            <button className="bg-golden-500 text-white px-4 py-2 rounded-lg hover:bg-golden-600 transition-colors font-medium backdrop-blur-sm"
            onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth',
              });
            }}
            >
              Appeler le support
            </button>
          </div>
          
          <div className="bg-transparent backdrop-blur-md rounded-xl p-6 border border-white/30">
            <h3 className="text-lg font-semibold text-white mb-3">Email</h3>
            <p className="text-white/80 mb-4">Envoyez-nous un message</p>
            <button 
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors font-medium backdrop-blur-sm"
              onClick={() => setShowMessageCard(true)}
            >
              Envoyer un email
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeaderTitles = () => {
    return (
      <div className="text-center py-12">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #ff9a00 0%, #ff6a00 50%, #ff3d00 100%)' }}
          >
            Consultations & aides
          </h1>
          <h2
            className="text-2xl md:text-3xl font-semibold mb-2 drop-shadow-lg bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #ffd38a 0%, #ff9a3d 100%)' }}
          >
            {selectedService}
          </h2>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative text-white antialiased mt-15" style={{ backgroundColor: '#050507' }}>
      {/* Image de fond — positionnée derrière le contenu. léger flou et ajustement de couleurs */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${fond})`,
          /* assombrir légèrement et conserver un léger flou */
          filter: 'blur(1.2px) brightness(0.72) saturate(1.05)',
          transform: 'scale(1.02)'
        }}
      />

      {/* Voile sombre professionnel pour harmoniser le fond avec les couleurs de texte */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(4,4,6,0.92) 0%, rgba(6,6,8,0.94) 35%, rgba(4,4,6,0.96) 100%)'
        }}
      />

      <header
        className="relative pt-12 px-8 pb-8 border-b border-white/10 backdrop-blur-sm"
        style={{ background: 'linear-gradient(180deg, rgba(6,6,8,0.9) 0%, rgba(8,8,10,0.9) 40%, rgba(4,4,6,0.96) 100%)' }}
      >
        <div className="max-w-[1200px] mx-auto flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-2">{renderHeaderTitles()}</div>

          <div className="flex flex-wrap gap-4 justify-center">
              <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "partenaires" ? "border-golden-500 bg-golden-500 text-white shadow-lg" : "border-white/30 bg-white/10 text-white hover:bg-white/20 shadow-md backdrop-blur-sm"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => {
                setView("partenaires");
                setShowPartners(false);
                setShowStatuses(false);
                setSelectedSectors([]);
                setPropertyType("");
                setLocationFilter("");
                setDisplayCount(8);
              }}
            >
              PRÉSENTATION PARTENAIRES
              <ChevronDown className="w-4 h-4" />
            </button>
            
              <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "services" ? "border-golden-500 bg-golden-500 text-white shadow-lg" : "border-white/30 bg-white/10 text-white hover:bg-white/20 shadow-md backdrop-blur-sm"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => {
                setView("services");
                setShowPartners(false);
                setShowStatuses(false);
                setPropertyType("");
                setDisplayCount(8);
              }}
            >
              DEMANDES DE PRESTATIONS
              <ChevronDown className="w-4 h-4" />
            </button>
            
              <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                view === "aides" ? "border-golden-500 bg-golden-500 text-white shadow-lg" : "border-white/30 bg-white/10 text-white hover:bg-white/20 shadow-md backdrop-blur-sm"
              } text-sm font-semibold transform hover:scale-105`}
              onClick={() => {
                setView("aides");
                setShowPartners(false);
                setShowStatuses(false);
                setDisplayCount(8);
              }}
            >
              AIDES
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-8 pb-20 relative z-10">
        {/* Bouton Envoyer un message en bas à gauche */}
        <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
          <button 
            className="px-6 py-3 bg-golden-500 text-white rounded-full text-sm font-semibold hover:bg-golden-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
            onClick={() => setShowMessageCard(true)}
          >
            <Send className="w-4 h-4" />
            Envoyer un message
          </button>
        </div>

        {showStatuses && <StatusesSection />}
        
        {view === "services" && !showStatuses && <ServicesSection />}
        
        {view === "aides" && <AidesSection />}
        
        {view === "partenaires" && !showPartners && !showStatuses && (
          <>
            <div className="flex justify-end mb-4 animate-fade-in">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Rechercher un partenaire..."
                  value={partnersSearchQuery}
                  onChange={(e) => setPartnersSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-golden-500 transition-colors"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
              </div>
            </div>

            {/* If user typed a partners search, show the partners list filtered (global search) */}
            {partnersSearchQuery ? (
              <PartnersSection category={selectedCategory} />
            ) : (
              <>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent text-white flex flex-col justify-between p-6">
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <ChevronDown className="w-6 h-6 rotate-90" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <ChevronDown className="w-6 h-6 -rotate-90" />
                  </button>

                  <div className="flex justify-center mt-4 space-x-2">
                    {categories.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentSlide ? "bg-golden-500" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <section className="hidden lg:grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                  {categories.map((cat, index) => (
                    <article
                      key={cat.title}
                      className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-from-top border border-white/20"
                      style={{
                        height: 300,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                          onError={(e) => handleImageError(e, cat.title)}
                        />
                        <div className="absolute left-4 right-4 bottom-4 bg-gradient-to-t from-black/70 to-transparent rounded-xl p-4 text-white">
                          <h4 className="text-sm font-semibold tracking-wide">{cat.title}</h4>
                          {cat.description && <p className="text-xs text-white/80 mt-1">{cat.description}</p>}
                          <div className="mt-3 flex justify-between items-center">
                            <button
                              className="px-3 py-2 rounded-lg bg-golden-500 text-white text-xs font-medium hover:bg-golden-600 transition-colors backdrop-blur-sm"
                              onClick={() => {
                                setSelectedCategory(cat.title);
                                setShowPartners(true);
                                setDisplayCount(8);
                              }}
                            >
                              {cat.action}
                            </button>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">{cat.title.split(' ')[0]}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </section>
              </>
            )}
          </>
        )}
        
        {showPartners && !showStatuses && <PartnersSection category={selectedCategory} />}
        
        {view === "default" && !showStatuses && (
          <section className="mt-10 relative animate-fade-in">
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {defaultCategories.map((cat, index) => (
                <article
                  key={cat.title}
                  className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-from-top border border-white/20"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent text-white flex flex-col justify-end p-6">
                    <h4 className="text-sm font-semibold tracking-wide">{cat.title}</h4>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Modal du formulaire de statut */}
        {showCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slide-smooth overflow-hidden border border-white/20">
              
              {/* En-tête avec image */}
              <div className="w-full">
                <img
                  src={selectedImage}
                  alt={selectedServiceForm}
                  className="w-full h-60 sm:h-72 object-cover"
                  onError={(e) => handleImageError(e, selectedServiceForm)}
                />
              </div>
              <h2 className="text-xl font-bold text-white text-center mt-4 mb-6">
                {selectedServiceForm}
              </h2>

              {/* Formulaire */}
              <div className="px-6 pb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    DATE DE SIGNATURE DU COMPROMIS
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    NOTAIRES ou AVOCATS
                  </label>
                  <select className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors backdrop-blur-sm">
                    <option value="" className="bg-gray-800">Choisir un notaire/avocat</option>
                    <option value="notaire1" className="bg-gray-800">Maître Dupont</option>
                    <option value="notaire2" className="bg-gray-800">Maître Martin</option>
                    <option value="avocat1" className="bg-gray-800">Maître Durand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    TYPE DU BIEN QUE VOUS SOUHAITEZ
                  </label>
                  <select className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors backdrop-blur-sm">
                    <option value="" className="bg-gray-800">Sélectionner le type de bien</option>
                    <option value="maison" className="bg-gray-800">Maison</option>
                    <option value="appartement" className="bg-gray-800">Appartement</option>
                    <option value="terrain" className="bg-gray-800">Terrain</option>
                    <option value="local-commercial" className="bg-gray-800">Local commercial</option>
                  </select>
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                  onClick={() => setShowCard(false)}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-golden-500 text-white rounded-lg text-sm font-medium hover:bg-golden-600 transition-colors duration-200 transform hover:scale-105 backdrop-blur-sm"
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
            {/* Panneau totalement transparent au-dessus de l'overlay */}
            <div className="bg-transparent border-transparent rounded-r-2xl p-6 w-full max-w-md h-full ml-0 animate-slide-from-left">
              
              {/* En-tête */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Nouveau Message
                </h2>
                <button
                  className="text-white/70 hover:text-white transition-colors"
                  onClick={() => setShowMessageCard(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Formulaire de message */}
              <div className="space-y-4 bg-transparent">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Entrez votre email"
                    className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message..."
                    rows={6}
                    className="w-full p-3 border border-white/30 rounded-lg bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-golden-500 focus:border-transparent transition-colors resize-none backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Footer avec boutons */}
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition-colors duration-200 backdrop-blur-sm"
                  onClick={() => {
                    setShowMessageCard(false);
                    setEmail('');
                    setMessage('');
                  }}
                >
                  Annuler
                </button>

                <button
                  className="px-6 py-2 bg-golden-500 text-white rounded-lg text-sm font-medium hover:bg-golden-600 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
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
        .card-image-radius {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }

        /* Darken common light utility backgrounds across this page for a uniform dark theme */
        .bg-white\/10 { background-color: rgba(255,255,255,0.03) !important; }
        .bg-white\/20 { background-color: rgba(255,255,255,0.04) !important; }
        .bg-white\/30 { background-color: rgba(255,255,255,0.05) !important; }
        .bg-golden-500 { background-color: #7a3f07; }

  /* Styles pour la couleur or professionnelle (darker gold for buttons) */
  /* Updated to a deeper gold for a more professional / dark gold look */
  .bg-golden-500 { background-color: #b45309; }
  .hover\:bg-golden-600:hover { background-color: #92400e; }
  .text-golden-300 { color: #92400e; }
  .border-golden-500 { border-color: #b45309; }
  .focus\:ring-golden-500:focus { --tw-ring-color: #b45309; }
      `}</style>
    </div>
  );
}

export default ServicesPartnersPage;