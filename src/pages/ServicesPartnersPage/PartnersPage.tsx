import React, { useState } from "react";
import { MapPin, ChevronDown, Search, X, Home, Building, Warehouse, Hotel, Send, Mail } from "lucide-react";

const PartnersPage = () => {
  const [showPartners, setShowPartners] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [partnersSearchQuery, setPartnersSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayCount, setDisplayCount] = useState(8);
  const [propertyType, setPropertyType] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

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

  const getFilteredPartners = (category: string) => {
    let filtered = category ? partners.filter(p => p.category === category) : partners.slice();
    
    if (partnersSearchQuery) {
      const q = partnersSearchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    }
    
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(p => 
        selectedSectors.some(sector => p.location.includes(sector.replace("Secteur ", "")))
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

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % adesCategories.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + adesCategories.length) % adesCategories.length);
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
                placeholder="Rechercher un partenaires..."
                value={partnersSearchQuery}
                onChange={(e) => setPartnersSearchQuery(e.target.value)}
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

            <div className="relative">
              <button 
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-3 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <MapPin className="w-4 h-4" />
                {locationFilter || "Localisation"}
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

            {(partnersSearchQuery || selectedSectors.length > 0 || propertyType || locationFilter) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Effacer
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-2xl animate-slide-down border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Filtrer par secteur :</h4>
              <div className="flex flex-wrap gap-2">
                {sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSectors.includes(sector)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
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
            <p className="text-gray-600">Aucun partenaire trouvé avec ces critères.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
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
                  className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-gray-200 bg-white"
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
                    <div className="bg-white rounded-xl p-4 shadow-lg flex items-start gap-3 border border-gray-200">
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300">
                        <img src={partner.image} alt={partner.name} className="w-full h-full object-cover" onError={(e) => handleImageError(e, partner.name)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{partner.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{partner.location} • {propertyTypes.find(p => p.value === partner.type)?.label}</p>
                      </div>
                      <div className="flex items-center">
                        <button className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors whitespace-nowrap">
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
                  className="inline-block px-8 py-4 bg-blue-500 text-white rounded-full text-sm font-semibold cursor-pointer hover:bg-blue-600 transition-colors transform hover:scale-105 shadow-lg"
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

      {!showPartners && (
        <>
          <div className="flex justify-end mb-4 animate-fade-in">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Rechercher un partenaire..."
                value={partnersSearchQuery}
                onChange={(e) => setPartnersSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

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
                        src={adesCategories[currentSlide].image}
                        alt={adesCategories[currentSlide].title}
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, adesCategories[currentSlide].title)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent text-white flex flex-col justify-between p-6">
                        <h4 className="text-sm font-semibold tracking-wide">{adesCategories[currentSlide].title}</h4>
                        <div className="flex items-center justify-between mt-auto">
                          <button
                            className="px-4 py-2 rounded-xl border border-white bg-white/20 text-sm font-medium hover:bg-white/30 transition-colors transform hover:scale-105"
                            onClick={() => {
                              setSelectedCategory(adesCategories[currentSlide].title);
                              setShowPartners(true);
                              setDisplayCount(8);
                            }}
                          >
                            {adesCategories[currentSlide].action}
                          </button>
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
                  {adesCategories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? "bg-blue-500" : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <section className="hidden lg:grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                {adesCategories.map((cat, index) => (
                  <article
                    key={cat.title}
                    className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer animate-slide-from-top border border-gray-200"
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
                            className="px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors"
                            onClick={() => {
                              setSelectedCategory(cat.title);
                              setShowPartners(true);
                              setDisplayCount(8);
                            }}
                          >
                            {cat.action}
                          </button>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{cat.title.split(' ')[0]}</span>
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
      
      {showPartners && <PartnersSection category={selectedCategory} />}

      
    </>
  );
};

export default PartnersPage;