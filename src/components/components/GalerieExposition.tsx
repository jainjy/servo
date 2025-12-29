import React, { useState, useEffect, useRef } from 'react';

const GaleriesExpositions = () => {
  const [activeFilter, setActiveFilter] = useState('toutes');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('jour');
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Données des galeries
  const galleries = [
    {
      id: 1,
      name: "Galerie Volcanique",
      type: "Art contemporain",
      location: "Piton de la Fournaise",
      description: "Architecture intégrée dans la roche volcanique avec vue panoramique sur le cratère.",
      architect: "Kengo Kuma",
      year: 2021,
      area: "2400 m²",
      style: "Architecture organique",
      color: "red",
      featured: true,
      visitors: "45k/an",
      opening: "10h-18h",
      entry: "15€",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b",
      layout: "spiral",
      material: "Basalte local"
    },
    {
      id: 2,
      name: "Musée des Lumières",
      type: "Art numérique",
      location: "Saint-Gilles",
      description: "Ancienne centrale électrique transformée en espace d'art immersif et lumineux.",
      architect: "Olafur Eliasson",
      year: 2019,
      area: "3200 m²",
      style: "Industriel réhabilité",
      color: "blue",
      featured: true,
      visitors: "68k/an",
      opening: "14h-22h",
      entry: "18€",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      layout: "open-space",
      material: "Acier et verre"
    },
    {
      id: 3,
      name: "Villa Créole",
      type: "Patrimoine",
      location: "Saint-Denis",
      description: "Maison coloniale du 18ème siècle restaurée, dédiée aux arts traditionnels créoles.",
      architect: "Auguste de Chazal",
      year: 1974,
      area: "1200 m²",
      style: "Colonial français",
      color: "amber",
      featured: false,
      visitors: "32k/an",
      opening: "9h30-17h30",
      entry: "8€",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      layout: "enfilade",
      material: "Bois précieux"
    },
    {
      id: 4,
      name: "Cube de Cristal",
      type: "Design",
      location: "Saint-Pierre",
      description: "Structure transparente flottant sur le lagon, dédiée au design contemporain.",
      architect: "Sou Fujimoto",
      year: 2022,
      area: "1800 m²",
      style: "Minimaliste",
      color: "cyan",
      featured: true,
      visitors: "52k/an",
      opening: "11h-19h",
      entry: "12€",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
      layout: "modulaire",
      material: "Verre structurel"
    },
    {
      id: 5,
      name: "Atelier du Cirque",
      type: "Artisanat",
      location: "Salazie",
      description: "Atelier suspendu dans les cirques, spécialisé dans les techniques traditionnelles.",
      architect: "Collectif local",
      year: 2018,
      area: "800 m²",
      style: "Écologique",
      color: "emerald",
      featured: false,
      visitors: "18k/an",
      opening: "10h-16h",
      entry: "6€",
      image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b",
      layout: "niches",
      material: "Bambou et terre"
    },
    {
      id: 6,
      name: "Nef Digitale",
      type: "Art génératif",
      location: "Saint-Paul",
      description: "Cathédrale numérique avec projections 360° et installations interactives.",
      architect: "Refik Anadol",
      year: 2023,
      area: "2800 m²",
      style: "Futuriste",
      color: "purple",
      featured: true,
      visitors: "75k/an",
      opening: "12h-20h",
      entry: "20€",
      image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd",
      layout: "cathédrale",
      material: "LED et miroirs"
    }
  ];

  // Données des expositions
  const exhibitions = [
    {
      id: 1,
      title: "Terres Brûlantes",
      galleryId: 1,
      artist: "Sophie Lenoir",
      type: "Peinture",
      dates: "12 Mar - 15 Juin 2024",
      status: "en cours",
      description: "Exploration chromatique des paysages volcaniques à travers 50 toiles monumentales.",
      visitors: "12k",
      duration: "3 mois",
      guided: true,
      color: "red",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      technique: "Acrylique et pigments volcaniques"
    },
    {
      id: 2,
      title: "Algorithmes Marins",
      galleryId: 2,
      artist: "Toussaint Merle",
      type: "Art génératif",
      dates: "15 Mar - 30 Juin 2024",
      status: "en cours",
      description: "Installation algorithmique générée en temps réel à partir des données océaniques.",
      visitors: "25k",
      duration: "3.5 mois",
      guided: false,
      color: "blue",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      technique: "IA et projections 3D"
    },
    {
      id: 3,
      title: "Mémoire des Fibres",
      galleryId: 3,
      artist: "Fatima Ben",
      type: "Textile",
      dates: "1 Fév - 30 Avr 2024",
      status: "en cours",
      description: "Tissage traditionnel réinterprété avec des fibres végétales endémiques.",
      visitors: "8k",
      duration: "3 mois",
      guided: true,
      color: "amber",
      image: "https://images.unsplash.com/photo-1605001011156-cbf0a0b7a88f",
      technique: "Tissage vacoa et soie"
    },
    {
      id: 4,
      title: "Design Insulaire",
      galleryId: 4,
      artist: "Collectif Design",
      type: "Design",
      dates: "10 Avr - 10 Juil 2024",
      status: "à venir",
      description: "Objets du quotidien réinventés par 30 designers de l'océan Indien.",
      visitors: "0",
      duration: "3 mois",
      guided: true,
      color: "cyan",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      technique: "Multi-matériaux"
    },
    {
      id: 5,
      title: "Murmures Végétaux",
      galleryId: 5,
      artist: "Collectif Artisans",
      type: "Installation",
      dates: "20 Mai - 20 Août 2024",
      status: "à venir",
      description: "Installation sonore et olfactive dans un jardin de plantes médicinales.",
      visitors: "0",
      duration: "3 mois",
      guided: true,
      color: "emerald",
      image: "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6",
      technique: "Sculpture végétale"
    },
    {
      id: 6,
      title: "Réseaux Neuronaux",
      galleryId: 6,
      artist: "AI Collective",
      type: "IA Art",
      dates: "25 Nov 2024 - 25 Fév 2025",
      status: "à venir",
      description: "Première exposition d'art généré par intelligence artificielle dans l'océan Indien.",
      visitors: "0",
      duration: "3 mois",
      guided: false,
      color: "purple",
      image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031",
      technique: "Réseaux neuronaux"
    },
    {
      id: 7,
      title: "Échos Urbains",
      galleryId: 6,
      artist: "Marcus Rivera",
      type: "Street Art",
      dates: "En cours",
      status: "permanent",
      description: "Fresque monumentale interactive évoluant avec les passages des visiteurs.",
      visitors: "40k",
      duration: "Permanent",
      guided: false,
      color: "orange",
      image: "https://images.unsplash.com/photo-1543857778-c4a1a569e388",
      technique: "Aérosol interactif"
    },
    {
      id: 8,
      title: "Lumière des Cirques",
      galleryId: 2,
      artist: "Léa Chen",
      type: "Photographie",
      dates: "20 Fév - 20 Mai 2024",
      status: "terminée",
      description: "Série photographique capturant la magie des brumes matinales dans les cirques.",
      visitors: "18k",
      duration: "3 mois",
      guided: true,
      color: "violet",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
      technique: "Pose longue argentique"
    }
  ];

  // Filtres
  const filters = [
    { id: 'toutes', label: 'Tout voir' },
    { id: 'galeries', label: 'Galeries' },
    { id: 'expositions', label: 'Expositions' },
    { id: 'en cours', label: 'En cours' },
    { id: 'à venir', label: 'À venir' },
    { id: 'permanent', label: 'Permanent' }
  ];

  // Éléments filtrés
  const filteredItems = activeFilter === 'galeries' 
    ? galleries 
    : activeFilter === 'expositions' 
      ? exhibitions 
      : [...galleries, ...exhibitions];

  // Effet parallaxe au mouvement de la souris
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        setParallaxOffset({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Effet heure de la journée
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      setTimeOfDay('jour');
    } else if (hour >= 18 && hour < 21) {
      setTimeOfDay('soir');
    } else {
      setTimeOfDay('nuit');
    }
  }, []);

  // Composant Carte Galerie
  const GalleryCard = ({ gallery }) => (
    <div 
      className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] group border-2 border-transparent hover:border-${gallery.color}-200`}
      onMouseEnter={() => setHoveredCard(gallery.id)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        transform: `translate(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px)`
      }}
    >
      {/* Image avec overlay */}
      <div className="relative p-2 h-64 overflow-hidden">
        <img
          src={`${gallery.image}?auto=format&fit=crop&w=800&h=400&q=80`}
          alt={gallery.name}
          className="w-full h-full rounded-sm object-cover transition-transform duration-1000"
        />
        
        {/* Overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-${gallery.color}-900/70 via-transparent to-transparent`}></div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          {gallery.featured && (
            <div className={`bg-${gallery.color}-500 text-white px-3 py-1 rounded-full text-xs font-bold`}>
              ★ Étoilée
            </div>
          )}
          <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs">
            {gallery.type}
          </div>
        </div>
        
        {/* Année d'ouverture */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
          <div className="text-xs text-gray-500">Ouvert en</div>
          <div className="text-sm font-bold text-gray-900">{gallery.year}</div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Titre et localisation */}
        <div className="mb-4">
          <h3 className="text-md font-bold text-gray-900 mb-2">{gallery.name}</h3>
          <div className="flex items-center text-gray-600">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className='text-xs'>{gallery.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 text-sm line-clamp-2">{gallery.description}</p>

        {/* Caractéristiques architecturales */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Style</div>
            <div className="font-medium text-gray-900 truncate text-sm">{gallery.style}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Architecte</div>
            <div className="font-medium text-gray-900 truncate text-sm">{gallery.architect}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Surface</div>
            <div className="font-medium text-gray-900 text-sm">{gallery.area}</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-1">Visiteurs</div>
            <div className="font-medium text-gray-900 text-sm">{gallery.visitors}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-gray-100 bg-secondary-text px-4 py-1 rounded-full font-bold text-sm">{gallery.entry}</div>
            <div className="text-gray-100 text-sm bg-secondary-text px-4 py-1 rounded-full">{gallery.opening}</div>
          </div>
          <button className={`bg-${gallery.color}-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-${gallery.color}-700 transition-colors`}>
            Visiter
          </button>
        </div>
      </div>

      {/* Effet de bordure animée */}
      <div className={`absolute inset-0 rounded-3xl border-2 border-${gallery.color}-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
    </div>
  );

  // Composant Carte Exposition
  const ExhibitionCard = ({ exhibition }) => {
    const statusColors = {
      'en cours': 'green',
      'à venir': 'blue',
      'terminée': 'gray',
      'permanent': 'purple'
    };

    const statusLabels = {
      'en cours': 'Maintenant',
      'à venir': 'Bientôt',
      'terminée': 'Passée',
      'permanent': 'Permanent'
    };

    const gallery = galleries.find(g => g.id === exhibition.galleryId);

    return (
      <div 
        className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-3xl hover:scale-[1.02] group border-2 border-transparent hover:border-${exhibition.color}-200`}
        onMouseEnter={() => setHoveredCard(`expo-${exhibition.id}`)}
        onMouseLeave={() => setHoveredCard(null)}
        style={{
          transform: `translate(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px)`
        }}
      >
        {/* Image avec overlay */}
        <div className="relative h-56 p-2 overflow-hidden">
          <img
            src={`${exhibition.image}?auto=format&fit=crop&w=800&h=400&q=80`}
            alt={exhibition.title}
            className="w-full h-full rounded-sm object-cover transition-transform duration-1000"
          />
          
          {/* Overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t from-${exhibition.color}-900/70 via-transparent to-transparent`}></div>
          
          {/* Badge de statut */}
          <div className={`absolute top-4 left-4 bg-${statusColors[exhibition.status]}-500 text-white px-3 py-1.5 rounded-lg font-bold`}>
            {statusLabels[exhibition.status]}
          </div>
          
          {/* Type d'art */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg">
            {exhibition.type}
          </div>
          
          {/* Dates */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-white font-bold text-lg">{exhibition.dates}</div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre et artiste */}
          <div className="mb-4">
            <h3 className="text-md font-bold text-gray-900 mb-2 line-clamp-1">{exhibition.title}</h3>
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className='text-sm'>{exhibition.artist}</span>
              {gallery && (
                <>
                  <span className="mx-2">•</span>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 text-sm">{gallery.name}</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6 line-clamp-2 text-sm">{exhibition.description}</p>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Technique</div>
              <div className="font-medium text-gray-900 truncate text-sm">{exhibition.technique}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Durée</div>
              <div className="font-medium text-gray-900 text-sm">{exhibition.duration}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Visiteurs</div>
              <div className="font-medium text-gray-900 text-sm">{exhibition.visitors}</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-xs text-gray-500 mb-1">Visite guidée</div>
              <div className="font-medium text-gray-900 text-sm">{exhibition.guided ? 'Disponible' : 'Libre'}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xs bg-secondary-text text-gray-100 px-4 py-1 rounded-full">
              {gallery ? `${gallery.location} • ${gallery.opening}` : 'Horaires variables'}
            </div>
            <button className={`bg-${exhibition.color}-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-${exhibition.color}-700 transition-colors`}>
              {exhibition.status === 'à venir' ? 'Réserver' : 'Visiter'}
            </button>
          </div>
        </div>

        {/* Timeline en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
      </div>
    );
  };

  // Statistiques
  const stats = [
    { label: "Galeries actives", value: galleries.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { label: "Expositions en cours", value: exhibitions.filter(e => e.status === 'en cours').length, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Visiteurs mensuels", value: "15k+", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { label: "Œuvres exposées", value: "850+", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden" ref={containerRef}>
      {/* Header avec effet temps de la journée */}
      <div className={`relative pt-20 pb-16 px-4 transition-all duration-1000 ${
        timeOfDay === 'jour' ? 'bg-gradient-to-br from-blue-50/30 to-amber-50/30' :
        timeOfDay === 'soir' ? 'bg-gradient-to-br from-purple-50/30 to-pink-50/30' :
        'bg-gradient-to-br from-indigo-50/30 to-gray-900/10'
      }`}>
        {/* Effet de lumière */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
            timeOfDay === 'jour' ? 'bg-yellow-300 top-20 left-20' :
            timeOfDay === 'soir' ? 'bg-purple-400 top-10 right-20' :
            'bg-blue-400 bottom-10 left-1/2'
          }`}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <h1 className="text-xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Galeries & expositions
          </h1>
          <p className="text-sm text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explorez des galeries et expositions riches en art et culture. 
            Des espaces architecturaux uniques dédiés à la création contemporaine.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-text rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border ${
                  activeFilter === filter.id
                    ? 'bg-secondary-text text-white transform scale-105'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredItems.map((item) => (
            item.galleryId ? 
              <ExhibitionCard key={`expo-${item.id}`} exhibition={item} /> : 
              <GalleryCard key={`gallery-${item.id}`} gallery={item} />
          ))}
        </div>

        {/* Cartes spéciales - Galeries étoilées */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Galeries étoilées
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {galleries
              .filter(g => g.featured)
              .slice(0, 2)
              .map(gallery => (
                <div key={gallery.id} className={`relative rounded-3xl overflow-hidden shadow-2xl border-2 border-${gallery.color}-200`}>
                  <div className="absolute inset-0">
                    <img
                      src={`${gallery.image}?auto=format&fit=crop&w=1200&h=600&q=80`}
                      alt={gallery.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r from-${gallery.color}-900/80 to-transparent`}></div>
                  </div>
                  
                  <div className="relative z-10 p-8 text-white">
                    <div className="mb-6">
                      <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        <span className="font-bold">GALERIE ÉTOILÉE</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{gallery.name}</h3>
                      <p className="text-white/90">{gallery.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm opacity-80">Architecte</div>
                        <div className="text-lg font-bold">{gallery.architect}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Style</div>
                        <div className="text-lg font-bold">{gallery.style}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Ouverture</div>
                        <div className="text-lg font-bold">{gallery.year}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Surface</div>
                        <div className="text-lg font-bold">{gallery.area}</div>
                      </div>
                    </div>
                    
                    <button className={`bg-white text-${gallery.color}-700 font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors`}>
                      Découvrir cette galerie
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Cartes spéciales - Expositions phares */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Expositions phares du moment
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {exhibitions
              .filter(e => e.status === 'en cours')
              .slice(0, 2)
              .map(expo => {
                const gallery = galleries.find(g => g.id === expo.galleryId);
                return (
                  <div key={expo.id} className={`bg-gradient-to-br from-${expo.color}-50 to-white rounded-3xl overflow-hidden shadow-2xl border-2 border-${expo.color}-100`}>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{expo.title}</h3>
                          <div className="text-gray-600 text-sm mb-4">{expo.artist}</div>
                        </div>
                        <div className={`bg-${expo.color}-100 text-${expo.color}-800 px-4 py-2 text-sm rounded-full font-bold`}>
                          EN COURS
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6 text-sm">{expo.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Galeries</div>
                          <div className="font-bold text-gray-900">{gallery?.name}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Dates</div>
                          <div className="font-bold text-gray-900">{expo.dates}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Technique</div>
                          <div className="font-bold text-gray-900">{expo.technique}</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Visiteurs</div>
                          <div className="font-bold text-gray-900">{expo.visitors}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                        <button className={`flex-1 bg-${expo.color}-600 text-white font-semibold py-3.5 rounded-xl hover:bg-${expo.color}-700 transition-colors`}>
                          Réserver une visite
                        </button>
                        <button className="px-8 py-3.5 border-2 border-gray-900 text-gray-900 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                          Voir les œuvres
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* CTA final */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-secondary-text"></div>
          <div className="relative z-10 p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              Programmez votre parcours culturel
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8">
              Créez votre visite personnalisée à travers les galeries et expositions. 
              Réservez vos billets, visites guidées et ateliers en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-gray-900 font-bold px-10 py-4 rounded-xl hover:bg-gray-100 transition-colors">
                Créer mon parcours
              </button>
              <button className="bg-transparent border-2 border-white text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors">
                Voir toutes les expositions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaleriesExpositions;