import React, { useState, useEffect } from 'react';
import TourismNavigation from "@/components/TourismNavigation";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SejoursExperiences = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState('tous');
  const [isHovered, setIsHovered] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  });

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

  // Récupérer les expériences depuis l'API
  const fetchExperiences = async (filter = activeFilter, page = 1) => {
    try {
      setLoading(true);
      
      const params: Record<string, any> = {
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (filter !== 'tous') {
        params.category = filter;
      }

      const response = await axios.get(`${API_BASE_URL}/experiences`, { params });
      
      if (response.data.success) {
        setExperiences(response.data.data);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        console.warn('API returned success:false, using fallback data');
        setExperiences(getFallbackExperiences());
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching experiences:', err);
      setError('Erreur lors du chargement des expériences');
      setExperiences(getFallbackExperiences());
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/experiences/categories`);
      
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        setCategories(getFallbackCategories());
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(getFallbackCategories());
    }
  };

  // Interface pour typer les expériences
  interface Experience {
    id: number | string;
    title: string;
    category: string;
    duration: string;
    location: string;
    description: string;
    highlights: string[];
    price: number;
    rating?: number;
    reviewCount?: number;
    images?: string[];
    media?: Array<{ url: string }>;
    difficulty: string;
    groupSize: string;
    season: string;
  }

  // Interface pour typer les catégories
  interface Category {
    id: string;
    label: string;
    count?: number;
  }

  // Données de fallback en cas d'erreur API
  const getFallbackExperiences = (): Experience[] => {
    return [
      {
        id: 1,
        title: "Immersion Volcanique",
        category: "aventure",
        duration: "3 jours",
        location: "Piton de la Fournaise, Réunion",
        description: "Séjour d'immersion totale avec un vulcanologue pour comprendre et vivre le volcan.",
        highlights: ["Nuit au refuge", "Accès zones restreintes", "Rencontre scientifique", "Photos exclusives"],
        price: 890,
        rating: 4.8,
        reviewCount: 24,
        images: [
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=80"
        ],
        difficulty: "Intense",
        groupSize: "6 personnes max",
        season: "Toute l'année"
      },
      {
        id: 2,
        title: "Retraite Yogique",
        category: "bienetre",
        duration: "5 jours",
        location: "Salazie, Réunion",
        description: "Retraite spirituelle dans les cirques avec maîtres yogis et alimentation ayurvédique.",
        highlights: ["Sessions quotidiennes", "Alimentation bio", "Massages", "Méditation guidée"],
        price: 1250,
        rating: 4.9,
        reviewCount: 18,
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
        ],
        difficulty: "Douce",
        groupSize: "10 personnes max",
        season: "Printemps / Automne"
      },
      {
        id: 3,
        title: "Plongée Grand Bleu",
        category: "marine",
        duration: "4 jours",
        location: "Lagon de Mayotte",
        description: "Exploration des tombants coralliens et rencontre avec les tortues géantes.",
        highlights: ["3 plongées/jour", "Rencontre dauphins", "Photos sous-marines", "Nuit à bord"],
        price: 1450,
        rating: 4.7,
        reviewCount: 32,
        images: [
          "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80"
        ],
        difficulty: "Intermédiaire",
        groupSize: "8 personnes max",
        season: "Mai à Octobre"
      },
      {
        id: 4,
        title: "Découverte Culturelle",
        category: "culture",
        duration: "2 jours",
        location: "Saint-Denis, Réunion",
        description: "Immersion dans la culture créole avec visites historiques et ateliers culinaires.",
        highlights: ["Visite du Musée Léon Dierx", "Atelier cuisine créole", "Rencontre avec artisans", "Concert Maloya"],
        price: 450,
        rating: 4.6,
        reviewCount: 15,
        images: [
          "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=80"
        ],
        difficulty: "Facile",
        groupSize: "12 personnes max",
        season: "Toute l'année"
      },
      {
        id: 5,
        title: "Séjour Luxe Privatif",
        category: "luxe",
        duration: "7 jours",
        location: "Saint-Gilles, Réunion",
        description: "Villa exclusive avec service privé, chef personnel et excursions sur mesure.",
        highlights: ["Villa 5 étoiles", "Chef privé", "Spa quotidien", "Excursions VIP"],
        price: 3500,
        rating: 5.0,
        reviewCount: 8,
        images: [
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"
        ],
        difficulty: "Facile",
        groupSize: "4 personnes max",
        season: "Toute l'année"
      }
    ];
  };

  const getFallbackCategories = (): Category[] => {
    return [
      { id: 'tous', label: 'Toutes les expériences', count: 5 },
      { id: 'aventure', label: 'Aventure', count: 1 },
      { id: 'bienetre', label: 'Bien-être', count: 1 },
      { id: 'marine', label: 'Marine', count: 1 },
      { id: 'culture', label: 'Culture', count: 1 },
      { id: 'luxe', label: 'Luxe', count: 1 }
    ];
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchCategories();
    fetchExperiences('tous', 1);
  }, []);

  // Rafraîchir les expériences quand le filtre change
  useEffect(() => {
    if (activeFilter) {
      fetchExperiences(activeFilter, 1);
      setActiveSlide(0);
    }
  }, [activeFilter]);

  // Navigation automatique du slider
  useEffect(() => {
    if (!isHovered && experiences.length > 0) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % experiences.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered, experiences.length]);

  // Fonction pour charger plus d'expériences
  const loadMoreExperiences = () => {
    if (pagination.page < pagination.totalPages) {
      fetchExperiences(activeFilter, pagination.page + 1);
    }
  };

  // Formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Récupérer l'image principale
  const getMainImage = (experience: Experience) => {
    if (experience.images && experience.images.length > 0) {
      return experience.images[0];
    }
    if (experience.media && experience.media.length > 0) {
      return experience.media[0].url;
    }
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80';
  };

  // Récupérer les images secondaires
  const getSecondaryImages = (experience: Experience) => {
    if (experience.images && experience.images.length > 1) {
      return experience.images.slice(1);
    }
    if (experience.media && experience.media.length > 1) {
      return experience.media.slice(1).map(m => m.url);
    }
    return [];
  };

  // Formater les highlights
  const getHighlights = (experience: Experience) => {
    if (Array.isArray(experience.highlights)) {
      return experience.highlights;
    }
    return [];
  };

  // Composant Slide
  const ExperienceSlide = ({ experience, index }: { experience: Experience; index: number }) => {
    const isActive = index === activeSlide;
    const slideClass = isActive
      ? 'opacity-100 scale-100 z-20'
      : index < activeSlide
        ? 'opacity-0 translate-x-full z-10'
        : 'opacity-40 scale-90 -translate-x-full z-10';

    const mainImage = getMainImage(experience);
    const secondaryImages = getSecondaryImages(experience);
    const highlights = getHighlights(experience);

    return (
      <div
        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${slideClass}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Colonne image */}
          <div className="relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
              style={{
                backgroundImage: `url(${mainImage})`,
                transform: isActive ? 'scale(1.1)' : 'scale(1)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>

            {/* Badge catégorie */}
            <div className="absolute top-6 left-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider ${
                experience.category === 'aventure' ? 'bg-red-500 text-white' :
                experience.category === 'bienetre' ? 'bg-emerald-500 text-white' :
                experience.category === 'marine' ? 'bg-blue-500 text-white' :
                experience.category === 'culture' ? 'bg-purple-500 text-white' :
                experience.category === 'luxe' ? 'bg-amber-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {experience.category || 'Expérience'}
              </span>
            </div>

            {/* Note et avis */}
            {experience.rating && (
              <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-semibold">{experience.rating}</span>
                {experience.reviewCount && (
                  <span className="text-gray-300 text-sm">({experience.reviewCount})</span>
                )}
              </div>
            )}

            {/* Mini-galerie */}
            {secondaryImages.length > 0 && (
              <div className="absolute bottom-6 left-6 right-6 flex space-x-2">
                {secondaryImages.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="flex-1 h-20 rounded-lg overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Colonne contenu */}
          <div className="bg-white p-8 md:p-12 flex flex-col justify-center">
            <div className="">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{experience.title}</h2>
                <div className="text-right flex items-center gap-2">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    {formatPrice(experience.price)}
                  </div>
                  <div className="text-sm text-gray-500">/ personne</div>
                </div>
              </div>

              <div className="flex items-center text-sm space-x-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{experience.duration || 'Durée non spécifiée'}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{experience.location || 'Lieu non spécifié'}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {experience.description}
            </p>

            {highlights.length > 0 && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Ce qui vous attend
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {highlights.slice(0, 4).map((highlight, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Difficulté</div>
                <div className={`font-bold ${
                  experience.difficulty === 'Facile' ? 'text-green-600' :
                  experience.difficulty === 'Intermédiaire' ? 'text-yellow-600' :
                  experience.difficulty === 'Intense' ? 'text-orange-600' :
                  experience.difficulty === 'Extrême' ? 'text-red-600' :
                  'text-gray-900'
                }`}>
                  {experience.difficulty || 'Non spécifié'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Groupe</div>
                <div className="font-bold text-gray-900">{experience.groupSize || 'Non spécifié'}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">Saison</div>
                <div className="font-bold text-gray-900">{experience.season || 'Toute l\'année'}</div>
              </div>
            </div>

            {/* CTA CORRIGÉ - Utilisation de navigate() */}
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate(`/sejour-experience/${experience.id}/book`)}
                className="flex-1 bg-logo text-white font-semibold py-4 px-6 rounded-xl hover:bg-logo/90 transition-colors duration-300"
              >
                Réserver cette expérience
              </button>
              <button 
                onClick={() => navigate(`/sejour-experience/${experience.id}`)}
                className="px-6 py-4 border-2 border-logo text-logo font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300"
              >
                Voir détails
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && experiences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logo mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des expériences...</p>
        </div>
      </div>
    );
  }

  if (error && experiences.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchExperiences(activeFilter, 1)}
            className="bg-logo text-white px-6 py-3 rounded-lg hover:bg-logo/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <div className="relative pt-20 pb-10 border-b border-gray-100">
        <div 
          className="absolute inset-0 -z-20 w-full overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: `url('https://i.pinimg.com/736x/4f/fc/36/4ffc3610fc77d1ad9e92faf74bdf0c4b.jpg')`
          }}
        >
          <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Séjours & expériences
            </h1>
            <p className="text-gray-200 text-lg">
              Vivez des expériences inoubliables durant votre séjour.
            </p>
          </div>
        </div>

        <div className="relative z-20">
          <TourismNavigation page="sejour" />
        </div>
      </div>

      <div className="pt-10 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex overflow-x-auto pb-4 space-x-3 hide-scrollbar">
              {(categories as Category[]).map((filter: Category) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id);
                    setActiveSlide(0);
                  }}
                  className={`flex-shrink-0 px-6 py-3 rounded-full border transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-logo text-white"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-700 hover:text-gray-900"
                  }`}
                >
                  {filter.label} {filter.count && `(${filter.count})`}
                </button>
              ))}
            </div>
          </div>

          {experiences.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🏔️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune expérience disponible</h3>
              <p className="text-gray-600">Aucune expérience ne correspond à vos critères pour le moment.</p>
            </div>
          ) : (
            <>
              <div className="relative h-[700px] rounded-3xl overflow-hidden shadow-xl mb-16">
                {(experiences as Experience[]).map((exp, index) => (
                  <ExperienceSlide key={exp.id} experience={exp} index={index} />
                ))}

                {experiences.length > 1 && (
                  <>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                      <div className="flex space-x-3">
                        {experiences.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              activeSlide === index
                                ? "w-10 bg-gray-900"
                                : "bg-gray-400 hover:bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        setActiveSlide((prev) =>
                          prev > 0 ? prev - 1 : experiences.length - 1
                        )
                      }
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() =>
                        setActiveSlide((prev) => (prev + 1) % experiences.length)
                      }
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                    >
                      <svg
                        className="w-6 h-6 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {experiences.length > 0 && (
                  <div className="absolute top-6 right-6 z-30">
                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="font-semibold text-gray-900">
                        {activeSlide + 1} / {experiences.length}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center mb-16">
                  <button
                    onClick={loadMoreExperiences}
                    disabled={pagination.page >= pagination.totalPages}
                    className={`px-6 py-3 rounded-lg ${
                      pagination.page >= pagination.totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-logo text-white hover:bg-logo/90'
                    } transition-colors`}
                  >
                    Charger plus d'expériences
                  </button>
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Taux de satisfaction</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-gray-900 mb-2">{experiences.length}+</div>
              <div className="text-gray-600">Expériences disponibles</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>

          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Une expérience unique, de nombreuses raisons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Guides experts",
                  description: "Nos guides sont passionnés et certifiés dans leur domaine.",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                },
                {
                  title: "Petits groupes",
                  description: "Limités pour préserver l'authenticité et la qualité.",
                  icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                },
                {
                  title: "Impact positif",
                  description: "Nous reversons 5% de chaque réservation à des projets locaux.",
                  icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
                },
                {
                  title: "Flexibilité",
                  description: "Annulation gratuite jusqu'à 30 jours avant.",
                  icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
              ].map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="bg-secondary-text text-white rounded-3xl p-12 mb-8">
              <h2 className="text-3xl font-bold mb-4">Prêt à vivre l'extraordinaire ?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Contactez nos experts pour créer le séjour parfaitement adapté à vos envies.
              </p>
              <button className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                Parler à un expert
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SejoursExperiences;