import React, { useState, useEffect, useRef } from 'react';
import TourismNavigation from '../TourismNavigation';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';

const NaturePatrimoine = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });
  const { user, isAuthenticated } = useAuth();

  // Catégories pour le filtrage
  const categories = [
    { id: 'tous', label: 'Tout voir' },
    { id: 'nature', label: 'Nature' },
    { id: 'patrimoine', label: 'Patrimoine' },
    { id: 'site_naturel', label: 'Sites Naturels' },
    { id: 'foret', label: 'Forêts' },
    { id: 'volcan', label: 'Volcans' },
    { id: 'marine', label: 'Marin' },
    { id: 'historique', label: 'Historique' },
    { id: 'architecture', label: 'Architecture' }
  ];

  // Récupérer les patrimoines depuis l'API
  const fetchPatrimoines = async (page = 1, category = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construire les paramètres de requête
      const params = {
        page,
        limit: 12, // Limiter à 12 éléments pour une meilleure performance
        featured: true // Récupérer d'abord les patrimoines en vedette
      };

      // Ajouter le filtre de catégorie si spécifié
      if (category && category !== 'tous') {
        // Mapper les catégories de l'interface aux catégories de l'API
        const categoryMap = {
          'nature': 'site_naturel',
          'patrimoine': 'historique',
          'site_naturel': 'site_naturel',
          'foret': 'foret',
          'volcan': 'volcan',
          'marine': 'marine',
          'historique': 'historique',
          'architecture': 'architecture'
        };
        
        if (categoryMap[category]) {
          params.category = categoryMap[category];
        } else if (['nature', 'patrimoine'].includes(category)) {
          // Pour les filtres "nature" et "patrimoine", on filtre par type
          params.type = category;
        }
      }

      // Faire l'appel API
      const response = await api.get('/patrimoine/user-patrimoines', { params });
      
      if (response.data.success) {
        setPlaces(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Erreur lors du chargement des données');
      }
    } catch (err) {
      console.error('Erreur API:', err);
      setError(err.response?.data?.message || 'Erreur de connexion au serveur');
      
      // Charger les données statiques en cas d'erreur
      loadStaticData();
    } finally {
      setLoading(false);
    }
  };

  // Données statiques de secours
  const loadStaticData = () => {
    const staticPlaces = [
      {
        id: 1,
        title: "Cirque de Mafate",
        type: "nature",
        category: "site_naturel",
        location: "Réunion",
        description: "Cirque inaccessible par la route, préservé de l'urbanisation, classé au patrimoine mondial de l'UNESCO.",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
        ],
        altitude: "1600m",
        difficulty: "Difficile",
        protection: "Parc National",
        year: 2010,
        price: 0,
        city: "Réunion",
        rating: 4.8,
        reviewCount: 124,
        featured: true,
        available: true
      },
      {
        id: 2,
        title: "Piton de la Fournaise",
        type: "nature",
        category: "volcan",
        location: "Réunion",
        description: "L'un des volcans les plus actifs au monde, offrant des paysages lunaires uniques.",
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
        ],
        altitude: "2631m",
        difficulty: "Moyen",
        protection: "Réserve Naturelle",
        year: 2007,
        price: 0,
        city: "Réunion",
        rating: 4.9,
        reviewCount: 89,
        featured: true,
        available: true
      },
      {
        id: 3,
        title: "Habitation La Grivelière",
        type: "patrimoine",
        category: "historique",
        location: "Guadeloupe",
        description: "Ancienne plantation de café et de cacao restaurée, témoin de l'histoire coloniale.",
        images: [
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90"
        ],
        altitude: "450m",
        difficulty: "Facile",
        protection: "Monument Historique",
        year: 1998,
        price: 12,
        city: "Guadeloupe",
        rating: 4.5,
        reviewCount: 67,
        featured: true,
        available: true
      },
      {
        id: 4,
        title: "Forêt de Bélouve",
        type: "nature",
        category: "foret",
        location: "Réunion",
        description: "Forêt primaire de tamarins, véritable cathédrale végétale aux arbres centenaires.",
        images: [
          "https://images.unsplash.com/photo-1448375240586-882707db888b",
          "https://images.unsplash.com/photo-1500479694472-551d1fb6258d",
          "https://images.unsplash.com/photo-1473448912268-2022ce9509d8"
        ],
        altitude: "1500m",
        difficulty: "Moyen",
        protection: "Réserve Biologique",
        year: 1994,
        price: 0,
        city: "Réunion",
        rating: 4.7,
        reviewCount: 45,
        featured: true,
        available: true
      },
      {
        id: 5,
        title: "Cases Créoles de Hell-Bourg",
        type: "patrimoine",
        category: "architecture",
        location: "Réunion",
        description: "Village aux maisons créoles colorées classé parmi les plus beaux villages de France.",
        images: [
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90",
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
          "https://images.unsplash.com/photo-1518837695005-2083093ee35b"
        ],
        altitude: "975m",
        difficulty: "Facile",
        protection: "Site Patrimonial",
        year: 1998,
        price: 8,
        city: "Réunion",
        rating: 4.6,
        reviewCount: 78,
        featured: true,
        available: true
      },
      {
        id: 6,
        title: "Lagon de Mayotte",
        type: "nature",
        category: "marine",
        location: "Mayotte",
        description: "Plus grand lagon fermé du monde, abritant une biodiversité marine exceptionnelle.",
        images: [
          "https://images.unsplash.com/photo-1506929562872-bb421503ef21",
          "https://images.unsplash.com/photo-1439066615861-d1af74d74000",
          "https://images.unsplash.com/photo-1505142468610-359e7d316be0"
        ],
        altitude: "0m",
        difficulty: "Facile",
        protection: "Parc Naturel Marin",
        year: 2010,
        price: 0,
        city: "Mayotte",
        rating: 4.9,
        reviewCount: 112,
        featured: true,
        available: true
      }
    ];
    
    // Filtrer selon la catégorie active
    const filtered = activeCategory === 'tous' 
      ? staticPlaces 
      : staticPlaces.filter(place => {
          if (activeCategory === 'nature') return place.type === 'nature';
          if (activeCategory === 'patrimoine') return place.type === 'patrimoine';
          return place.category === activeCategory;
        });
    
    setPlaces(filtered);
    setPagination({
      page: 1,
      limit: 12,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / 12)
    });
  };

  // Charger les données au montage
  useEffect(() => {
    fetchPatrimoines(1, activeCategory);
  }, [activeCategory]);

  // Gérer le changement de catégorie
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPatrimoines(newPage, activeCategory);
    }
  };

  // Filtrage des lieux côté client (fallback)
  const filteredPlaces = activeCategory === 'tous'
    ? places
    : places.filter(place => {
        if (activeCategory === 'nature') return place.type === 'nature';
        if (activeCategory === 'patrimoine') return place.type === 'patrimoine';
        return place.category === activeCategory;
      });

  // Composant de carte de lieu
  const PlaceCard = ({ place }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // S'assurer que place.images est un tableau
    const images = Array.isArray(place.images) 
      ? place.images 
      : place.image 
        ? [place.image] 
        : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'];

    useEffect(() => {
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [images.length]);

    // Formater le type pour l'affichage
    const formatType = (type) => {
      if (type === 'nature') return 'Nature';
      if (type === 'patrimoine') return 'Patrimoine';
      return type?.charAt(0).toUpperCase() + type?.slice(1) || 'Nature';
    };

    // Déterminer la difficulté à partir de l'altitude
    const getDifficulty = (altitude) => {
      if (!altitude) return 'Facile';
      const altNum = parseInt(altitude);
      if (altNum > 2000) return 'Difficile';
      if (altNum > 1000) return 'Moyen';
      return 'Facile';
    };

    // Déterminer la protection
    const getProtection = (category) => {
      const protectionMap = {
        'site_naturel': 'Parc National',
        'volcan': 'Réserve Naturelle',
        'foret': 'Réserve Biologique',
        'marine': 'Parc Marin',
        'historique': 'Monument Historique',
        'architecture': 'Site Patrimonial'
      };
      return protectionMap[category] || 'Site Protégé';
    };

    const difficulty = place.difficulty || getDifficulty(place.altitude);
    const protection = place.protection || getProtection(place.category);

    return (
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
        {/* Image avec diaporama */}
        <div className="relative h-64 p-2 overflow-hidden">
          <img
            src={`${images[currentImageIndex]}?auto=format&fit=crop&w=800&h=400&q=80`}
            alt={place.title}
            className="w-full h-full rounded-sm object-cover transition-transform duration-700"
          />

          {/* Indicateurs d'images */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badge type */}
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full font-semibold text-sm ${
              place.type === 'nature'
                ? 'bg-emerald-500/90 text-white'
                : 'bg-amber-600/90 text-white'
            }`}>
            {formatType(place.type)}
          </div>

          {/* Badge protection */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium">
            {protection}
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-md font-bold text-gray-900">{place.title}</h3>
            <span className="text-xs bg-logo px-4 py-1 rounded-full text-gray-100 font-medium">
              {place.year || 'Non daté'}
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-sm">
              {place.city || place.location || 'Localisation inconnue'}
            </span>
          </div>

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {place.description || 'Aucune description disponible.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-sm text-gray-500 mb-1">Altitude</div>
              <div className="text-md font-bold text-gray-900">
                {place.altitude || 'Non spécifiée'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="text-sm text-gray-500 mb-1">Difficulté</div>
              <div className={`text-md font-bold ${
                difficulty === 'Facile' ? 'text-emerald-600' :
                difficulty === 'Moyen' ? 'text-amber-600' :
                'text-red-600'
              }`}>
                {difficulty}
              </div>
            </div>
          </div>

          {/* Bouton */}
          <button 
            onClick={() => window.location.href = `/patrimoine/${place.id}`}
            className="w-full bg-secondary-text text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-secondary-text/80 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Découvrir ce lieu
          </button>
        </div>
      </div>
    );
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const totalSites = places.length;
    const natureSites = places.filter(p => p.type === 'nature').length;
    const patrimoineSites = places.filter(p => p.type === 'patrimoine').length;
    
    return {
      totalSites,
      natureSites,
      patrimoineSites,
      territoryPreserved: Math.round((natureSites / totalSites) * 100) || 92
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto pt-10">
        {/* En-tête avec image de fond */}
        <div
          className="absolute inset-0 h-[300px] -z-20 w-full overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/02/59/69/0259699a168aea21ba838cd4873a1fdc.jpg')`,
          }}
        >
          <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70" />
        </div>
        
        {/* En-tête minimaliste */}
        <div className="text-center mb-20">
          <h1 className="text-xl md:text-4xl font-light text-gray-100 mb-6 tracking-tight">
            Nature & patrimoine
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
            {user 
              ? `Bienvenue ${user.firstName}, explorez une nature préservée et un patrimoine authentique.`
              : 'Explorez une nature préservée et un patrimoine authentique. Des lieux exceptionnels qui racontent notre histoire et protègent notre avenir.'
            }
          </p>
          <TourismNavigation />
        </div>

        {/* Bandeau défilant infini */}
        <div className="relative mb-20">
          <div className="absolute -top-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/70 to-transparent opacity-80 z-10"></div>
          <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/70 to-transparent opacity-80 z-10"></div>

          <div
            className="
              relative
              w-11/12 flex h-48 mx-auto overflow-hidden
              [scrollbar-width:none]
              [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
              group
              rounded-2xl
              backdrop-blur-xl
              bg-gradient-to-br from-emerald-50/20 to-amber-50/20
              border border-emerald-200/30
              shadow-lg shadow-emerald-500/10
            "
          >
            {/* Utiliser les images des lieux pour le bandeau */}
            <div className="flex w-max gap-4 pr-4 animate-[move_25s_linear_infinite] animation-pausable">
              {places.slice(0, 6).map((place, index) => (
                <div key={index} className="flex-none h-48 w-64 flex-shrink-0">
                  <img
                    src={`${place.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}?auto=format&fit=crop&w=400&h=200&q=80`}
                    alt={place.title}
                    className="h-full w-full object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500 brightness-105"
                  />
                </div>
              ))}
            </div>

            {/* Second set d'images (pour l'effet infini) */}
            <div
              aria-hidden
              className="flex w-max gap-4 pr-4 animate-[move_25s_linear_infinite] animation-pausable"
            >
              {places.slice(0, 6).map((place, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-none h-48 w-64 flex-shrink-0"
                >
                  <img
                    src={`${place.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}?auto=format&fit=crop&w=400&h=200&q=80`}
                    alt={place.title}
                    className="h-full w-full object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500 brightness-105"
                  />
                </div>
              ))}
            </div>

            <style>{`
              @keyframes move {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
              .group:hover .animation-pausable {
                animation-play-state: paused !important;
              }
            `}</style>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={loading}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 border ${
                  activeCategory === category.id
                    ? "bg-secondary-text text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chargement/Erreur */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-text"></div>
            <p className="mt-4 text-gray-600">Chargement des lieux...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-center">
            <p className="text-red-700 mb-2">{error}</p>
            <p className="text-gray-600 text-sm">Affichage des données statiques</p>
          </div>
        )}

        {/* Grille des lieux */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun lieu trouvé pour cette catégorie.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mb-12">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  Précédent
                </button>
                <span className="text-gray-700">
                  Page {pagination.page} sur {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || loading}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Section statistiques */}
            <div className="bg-gray-50 rounded-3xl mb-8">
              <div className="grid grid-cols-1 bg-white py-8 rounded-sm md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-light text-gray-900 mb-3">
                    {stats.totalSites}
                  </div>
                  <div className="text-gray-600 font-medium">Sites protégés</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-light text-gray-900 mb-3">
                    {stats.natureSites}
                  </div>
                  <div className="text-gray-600 font-medium">
                    Sites naturels
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-light text-gray-900 mb-3">
                    {stats.territoryPreserved}%
                  </div>
                  <div className="text-gray-600 font-medium">
                    Territoire préservé
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-light text-gray-900 mb-3">
                    {stats.patrimoineSites}
                  </div>
                  <div className="text-gray-600 font-medium">Monuments classés</div>
                </div>
              </div>
            </div>

            {/* Carte interactive dynamique */}
            <div className="mb-20 relative">
              <h3 className="text-3xl font-light text-gray-900 mb-4 text-center">
                Exploration géographique
              </h3>
              <p className="text-gray-600 text-center mb-4">
                Découvrez nos {places.length} sites naturels et patrimoniaux
                répartis à travers les territoires ultramarins
              </p>
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-200">
                {/* Conteneur SVG pour la carte */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 600"
                >
                  {/* Dégradé de fond */}
                  <defs>
                    <linearGradient
                      id="mapGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        style={{ stopColor: "#f0fdf4", stopOpacity: 1 }}
                      />
                      <stop
                        offset="100%"
                        style={{ stopColor: "#fffbeb", stopOpacity: 1 }}
                      />
                    </linearGradient>
                  </defs>
                  <rect width="1000" height="600" fill="url(#mapGradient)" />

                  {/* Formes géométriques de continents/îles */}
                  <circle
                    cx="200"
                    cy="250"
                    r="80"
                    fill="#d1fae5"
                    opacity="0.6"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <circle
                    cx="600"
                    cy="180"
                    r="70"
                    fill="#d1fae5"
                    opacity="0.5"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="350"
                    cy="400"
                    rx="60"
                    ry="50"
                    fill="#d1fae5"
                    opacity="0.5"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="40"
                    fill="#d1fae5"
                    opacity="0.6"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                </svg>

                {/* Points interactifs sur la carte */}
                <div className="absolute inset-0">
                  {places.slice(0, 6).map((place) => {
                    // Déterminer la position sur la carte
                    const getPosition = (location) => {
                      const positions = {
                        'Réunion': { top: "42%", left: "25%" },
                        'Guadeloupe': { top: "35%", left: "15%" },
                        'Mayotte': { top: "58%", left: "37%" },
                        'France': { top: "15%", left: "8%" },
                      };
                      return positions[location] || { top: "50%", left: "50%" };
                    };

                    const pos = getPosition(place.location || place.city);

                    return (
                      <div
                        key={place.id}
                        className="absolute group"
                        style={{
                          top: pos.top,
                          left: pos.left,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        {/* Cercle pulsant */}
                        <div className="relative w-8 h-8">
                          <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-emerald-600 rounded-full shadow-lg"></div>
                          </div>
                        </div>

                        {/* Popup au survol */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                          <div className="bg-gray-900 text-white px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap shadow-2xl">
                            <div className="font-bold text-emerald-400">
                              {place.location || place.city}
                            </div>
                            <div className="text-gray-300 text-xs mt-1">
                              {place.title}
                            </div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Légende */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-50 absolute"></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      Sites disponibles
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Survolez pour plus de détails
                  </div>
                </div>

                {/* Compteur de sites par région */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="text-xs font-semibold text-gray-600 mb-3">
                    Sites par région
                  </div>
                  <div className="space-y-2">
                    {Array.from(new Set(places.map(p => p.location || p.city))).slice(0, 3).map((location) => (
                      <div
                        key={location}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">{location}</span>
                        <span className="inline-flex items-center justify-center bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 text-xs font-bold">
                          {places.filter((p) => (p.location || p.city) === location).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Appel à l'action */}
            <div className="text-center bg-secondary-text py-8 rounded-md shadow-lg">
              <h2 className="text-4xl font-light text-gray-100 mb-6">
                Contribuez à la préservation
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                {isAuthenticated
                  ? `Bonjour ${user?.firstName}, partagez vos découvertes ou signalez des sites à protéger.`
                  : 'Connectez-vous pour partager vos découvertes, signalez des sites à protéger, ou participez à nos programmes de conservation du patrimoine.'
                }
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => window.location.href = isAuthenticated ? '/signaler-site' : '/login'}
                  className="px-8 py-4 bg-gray-100 text-slate-900 font-medium rounded-xl transition-colors duration-300"
                >
                  Signaler un site
                </button>
                <button 
                  onClick={() => window.location.href = '/devenir-guide'}
                  className="px-8 py-4 border-2 border-gray-100 text-gray-100 font-medium rounded-xl hover:bg-gray-50 hover:text-slate-900 transition-colors duration-300"
                >
                  Devenir guide
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .hover\\:shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default NaturePatrimoine;