import React, { useState, useEffect, useRef } from 'react';

const BienEtreAlimentation = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  // Données des expériences bien-être
  const experiences = [
    {
      id: 1,
      title: "Retraite Ayurvédique",
      category: "bienetre",
      type: "Séjour",
      duration: "7 jours",
      location: "Salazie, Réunion",
      description: "Cure complète basée sur la médecine ayurvédique avec massages, yoga et alimentation personnalisée selon votre dosha.",
      highlights: ["Diagnostic ayurvédique", "Massages quotidiens", "Yoga personnalisé", "Alimentation dosha"],
      price: 1890,
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
      ],
      color: "emerald",
      elements: ["Eau", "Terre"],
      intensity: "Doux"
    },
    {
      id: 2,
      title: "Atelier Cuisine Vivante",
      category: "alimentation",
      type: "Atelier",
      duration: "1 jour",
      location: "Saint-Paul, Réunion",
      description: "Découverte de la cuisine crue et vivante avec des produits locaux et bio. Initiation à la fermentation et germination.",
      highlights: ["Cuisine crue", "Produits 100% bio", "Techniques fermentation", "Dégustation"],
      price: 120,
      images: [
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d",
        "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
      ],
      color: "amber",
      elements: ["Feu", "Air"],
      intensity: "Modéré"
    },
    {
      id: 3,
      title: "Thalasso Océan Indien",
      category: "bienetre",
      type: "Cure",
      duration: "5 jours",
      location: "Saint-Gilles, Réunion",
      description: "Cure thalassothérapie utilisant les bienfaits de l'océan : algues, boues marines et eau de mer chauffée.",
      highlights: ["Bains algues", "Douches jets", "Enveloppements boue", "Piscine marine"],
      price: 1450,
      images: [
        "https://images.unsplash.com/photo-1540202403-a2c2908e9c5e",
        "https://images.unsplash.com/photo-1514894780887-121968d00567",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
      ],
      color: "blue",
      elements: ["Eau"],
      intensity: "Relaxant"
    },
    {
      id: 4,
      title: "Jardin Thérapeutique",
      category: "nature",
      type: "Expérience",
      duration: "3 jours",
      location: "Hell-Bourg, Réunion",
      description: "Immersion dans un jardin de plantes médicinales avec ateliers de phytothérapie et aromathérapie.",
      highlights: ["Cueillette plantes", "Distillation huiles", "Création baumes", "Marche sensorielle"],
      price: 450,
      images: [
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
        "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6",
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
      ],
      color: "green",
      elements: ["Terre", "Air"],
      intensity: "Doux"
    },
    {
      id: 5,
      title: "Jeûne & Randonnée",
      category: "detox",
      type: "Séjour",
      duration: "4 jours",
      location: "Cilaos, Réunion",
      description: "Programme combinant jeûne intermittent, randonnées légères et méditation en altitude.",
      highlights: ["Jeûne guidé", "Randonnées douces", "Méditation", "Reconnexion"],
      price: 780,
      images: [
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71",
        "https://images.unsplash.com/photo-1474487548417-781cb71495f3",
        "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1"
      ],
      color: "purple",
      elements: ["Air", "Espace"],
      intensity: "Intense"
    },
    {
      id: 6,
      title: "Chocolat Thérapie",
      category: "alimentation",
      type: "Atelier",
      duration: "1/2 journée",
      location: "Saint-Pierre, Réunion",
      description: "Découverte des vertus thérapeutiques du cacao et atelier de création de chocolats santé.",
      highlights: ["Cacao cru", "Atelier fabrication", "Dégustation", "Recettes santé"],
      price: 85,
      images: [
        "https://images.unsplash.com/photo-1511381939415-e44015466834",
        "https://images.unsplash.com/photo-1570913199992-91d07c140e7a",
        "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3"
      ],
      color: "rose",
      elements: ["Terre", "Feu"],
      intensity: "Doux"
    }
  ];

  // Couleurs associées
  const colorClasses = {
    emerald: 'from-emerald-400 to-emerald-600',
    amber: 'from-amber-400 to-amber-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    rose: 'from-rose-400 to-rose-600'
  };

  // Rotation automatique du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Suivi de la souris pour effet parallaxe
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => (prev + 1) % experiences.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(prev => prev === 0 ? experiences.length - 1 : prev - 1);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Composant point orbital amélioré
  const OrbitalPoint = ({ experience, index }) => {
    const isActive = index === activeIndex;
    const angle = (index / experiences.length) * Math.PI * 2;
    const radius = 240;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
          transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: isActive ? 20 : 10,
        }}
      >
        <button
          onClick={() => goToSlide(index)}
          className={`relative group cursor-pointer transition-all duration-500 ${
            isActive 
              ? 'scale-100' 
              : 'scale-75 opacity-60 hover:opacity-80 hover:scale-85'
          }`}
        >
          {/* Halo actif */}
          {isActive && (
            <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-r from-logo/30 to-logo/10 blur-lg animate-pulse"></div>
          )}

          {/* Carte point */}
          <div className={`w-32 h-32 rounded-2xl p-3 flex flex-col justify-between shadow-lg transition-all duration-300 
            ${isActive 
              ? 'bg-white border-2 border-logo shadow-2xl' 
              : 'bg-white/80 border border-gray-200 group-hover:bg-white'
            }`}
          >
            {/* Header coloré */}
            <div className={`w-full h-8 rounded-lg bg-gradient-to-br ${colorClasses[experience.color]} 
              flex items-center justify-center text-white font-bold text-xs transition-all duration-300
              ${isActive ? 'shadow-md' : ''}`}>
              {experience.type}
            </div>

            {/* Contenu */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className={`text-xs font-bold transition-colors duration-300 ${
                  isActive ? 'text-gray-900' : 'text-gray-700'
                } line-clamp-2`}>
                  {experience.title}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="font-semibold">{experience.price}€</span>
                <span className="text-gray-400">{experience.duration}</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  };

  const activeExp = experiences[activeIndex];

  return (
    <div className="min-h-screen overflow-hidden" ref={containerRef}>
      {/* Header organique */}
      <div className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/736x/82/e0/36/82e036e6857e01a627594c85b60fcb61.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        {/* Formes organiques en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -right-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto pt-5">
          <h1 className="text-xl md:text-4xl font-light text-gray-100 mb-6 leading-tight">
            Bien-être & alimentation
          </h1>
          <p className="text-sm text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Prenez soin de votre corps et de vos sens. Des expériences holistiques pour se ressourcer pleinement.
          </p>
        </div>
      </div>

      <div className="max-w-7xl pt-10 mx-auto px-4">
        {/* Carousel orbital compact */}
        <div className="relative h-[500px] flex items-center justify-center mb-16">
          {/* Cercle de points en orbite */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Cercle guide (subtle) */}
            <div className="absolute w-96 h-96 rounded-full border border-dashed border-gray-200/50"></div>

            {/* Points en orbite */}
            {experiences.map((exp, index) => (
              <OrbitalPoint key={exp.id} experience={exp} index={index} />
            ))}

            {/* Centre avec info */}
            <div className="absolute w-56 h-56 rounded-full bg-white shadow-2xl border-4 border-logo/10 
              flex flex-col items-center justify-center z-30 transition-all duration-700 p-6">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Sélection</div>
                <div className="text-lg font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
                  {activeExp.title}
                </div>
                <div className="flex justify-center gap-1 flex-wrap">
                  {activeExp.elements.map((el, idx) => (
                    <span key={idx} className="px-2 py-1 bg-logo/10 rounded-full text-xs text-gray-700 font-medium">
                      {el}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-2xl font-bold text-logo">{activeExp.price}€</div>
              </div>
            </div>
          </div>

          {/* Navigation latérale */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 
              bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center 
              hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 group"
          >
            <svg className="w-5 h-5 text-gray-700 group-hover:text-logo transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-40 w-12 h-12 
              bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center 
              hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110 group"
          >
            <svg className="w-5 h-5 text-gray-700 group-hover:text-logo transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Slide actif détaillé */}
        <div className={` rounded-3xl overflow-hidden 
          shadow-2xl mb-20 transform transition-all duration-1000 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Galerie d'images */}
            <div className="p-8">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <img
                  src={`${activeExp.images[0]}?auto=format&fit=crop&w=800&h=600&q=80`}
                  alt={activeExp.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                  {activeExp.images.slice(1).map((img, idx) => (
                    <div key={idx} className="flex-1 h-16 rounded-lg overflow-hidden">
                      <img
                        src={`${img}?auto=format&fit=crop&w=200&h=100&q=70`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-8 bg-white/90">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{activeExp.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex text-sm items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{activeExp.location}</span>
                    </div>
                    <div className="flex text-xs items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{activeExp.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <div className="text-xl font-bold text-gray-900">{activeExp.price} €</div>
                  <div className="text-sm text-gray-500">/ par personne</div>
                </div>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {activeExp.description}
              </p>

              {/* Highlights */}
              <div className="">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Au programme
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {activeExp.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-current mr-3 opacity-60"></div>
                      <span className="text-gray-700 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caractéristiques */}
              <div className="flex space-x-4 mb-8">
                <div className="flex-1 bg-white/50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Intensité</div>
                  <div className="text-sm bg-secondary-text w-auto text-center font-semibold text-gray-100 rounded-full py-2">{activeExp.intensity}</div>
                </div>
                <div className="flex-1 bg-white/50 rounded-xl p-4">
                  <div className="text-sm text-gray-500 mb-1">Éléments</div>
                  <div className="flex space-x-2">
                    {activeExp.elements.map((el, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white rounded-full text-sm">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-logo text-white font-semibold py-3.5 px-6 rounded-xl 
                hover:bg-logo/90 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                Réserver cette expérience
              </button>
            </div>
          </div>
        </div>

        {/* Navigation par points */}
        <div className="flex justify-center space-x-3 mb-20">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${activeIndex === index
                ? `w-8 bg-gradient-to-r ${colorClasses[activeExp.color]}`
                : 'bg-gray-300 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>

        {/* Section éléments */}
        <div className="mb-10 bg-white shadow-lg py-10 rounded-sm">
          <h2 className="text-3xl font-light text-gray-800 mb-12 text-center">
            Les 5 éléments du bien-être
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: "Terre", icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3", color: "emerald" },
              { name: "Eau", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", color: "blue" },
              { name: "Feu", icon: "M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z", color: "amber" },
              { name: "Air", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8", color: "gray" },
              { name: "Espace", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9", color: "purple" }
            ].map((element) => (
              <div key={element.name} className="text-center group">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-${element.color}-100 to-${element.color}-300 
                  flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                  <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={element.icon} />
                  </svg>
                </div>
                <div className="text-lg font-semibold text-gray-800">{element.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final organique */}
        <div className="relative rounded-3xl overflow-hidden mb-20">
          <div className="absolute inset-0 bg-secondary-text"></div>
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl font-light text-gray-100 mb-6">
              Écoutez votre corps, nourrissez vos sens
            </h2>
            <p className="text-gray-200 max-w-2xl mx-auto mb-8">
              Nos experts en bien-être holistique vous accompagnent vers l'équilibre parfait.
            </p>
            <button className="bg-gray-100 text-black font-semibold px-8 py-4 rounded-xl 
              hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-0.5">
              Trouver mon équilibre
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BienEtreAlimentation;