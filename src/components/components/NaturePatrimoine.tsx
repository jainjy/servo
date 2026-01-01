import React, { useState, useEffect, useRef } from 'react';
import TourismNavigation from '../TourismNavigation';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/api';
import Lottie from "lottie-react";
import loginAnimation from "@/assets/Data.json"

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
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated } = useAuth();



  // Récupérer les patrimoines depuis l'API
  const fetchPatrimoines = async (page = 1, category = null) => {
    try {
      setLoading(true);
      setError(null);

      // Construire les paramètres de requête
      const params = {
        page,
        limit: 12,
        featured: true
      };

      // Ajouter le filtre de catégorie si spécifié
      if (category && category !== 'tous') {
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
          params.type = category;
        }
      }

      // CHOISIR LA ROUTE EN FONCTION DE L'AUTHENTIFICATION
      const endpoint = isAuthenticated ? '/patrimoine/test' : '/patrimoine/all';
      console.log(`Utilisation de l'endpoint: ${endpoint} (authentifié: ${isAuthenticated})`);

      // Appeler l'endpoint approprié
      const response = await api.get(endpoint, { params });

      // ADAPTER LE TRAITEMENT EN FONCTION DU FORMAT DE RÉPONSE
      if (isAuthenticated) {
        // Format de /test
        if (response.data.success) {
          setPlaces(response.data.data);
          setPagination(response.data.pagination || {
            page: 1,
            limit: response.data.data.length,
            total: response.data.data.length,
            totalPages: 1
          });
        } else {
          throw new Error(response.data.message || 'Erreur API');
        }
      }


    } catch (err) {
      console.error('Erreur API:', err);
      setError(err.response?.data?.message || 'Erreur de connexion au serveur');

      // Charger les données statiques en cas d'erreur
      console.log('Chargement des données statiques de fallback');

    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    fetchPatrimoines(1, activeCategory);
  }, [activeCategory, isAuthenticated]);

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

  // Ouvrir la modal avec le lieu sélectionné
  const handleOpenModal = (place) => {
    setSelectedPlace(place);
    setShowModal(true);
    // Empêcher le défilement du body lorsque la modal est ouverte
    document.body.style.overflow = 'hidden';
  };

  // Fermer la modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlace(null);
    // Restaurer le défilement du body
    document.body.style.overflow = 'auto';
  };

  // Filtrage des lieux côté client
  const filteredPlaces = activeCategory === 'tous'
    ? places
    : places.filter(place => {
      if (activeCategory === 'nature') return place.type === 'nature';
      if (activeCategory === 'patrimoine') return place.type === 'patrimoine';
      return place.category === activeCategory;
    });

  // Fonction pour obtenir le nom de l'utilisateur formaté
  const getUserDisplayName = () => {
    if (!user) return '';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.name) {
      return user.name;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.email) {
      return user.email.split('@')[0];
    }
    return '';
  };

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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Badge type */}
          <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full font-semibold text-sm ${place.type === 'nature'
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

          {/* Bouton - SEULEMENT SI CONNECTÉ */}
          {isAuthenticated ? (
            <button
              onClick={() => handleOpenModal(place)}
              className="w-full bg-secondary-text text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-secondary-text/80 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Découvrir ce lieu
            </button>
          ) : (
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-sm">
                Veuillez vous connecter pour accéder à ce lieu.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Composant Modal
  const PlaceModal = () => {
    if (!selectedPlace || !showModal) return null;

    const images = Array.isArray(selectedPlace.images)
      ? selectedPlace.images
      : selectedPlace.image
        ? [selectedPlace.image]
        : ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4'];

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

    const protection = selectedPlace.protection || getProtection(selectedPlace.category);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div
          className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton de fermeture */}
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image principale */}
          <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl">
            <img
              src={`${images[0]}?auto=format&fit=crop&w=1200&h=600&q=80`}
              alt={selectedPlace.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Titre et localisation */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">{selectedPlace.title}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-lg">
                    {selectedPlace.city || selectedPlace.location || 'Localisation inconnue'}
                  </span>
                </div>
                <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedPlace.type === 'nature' ? 'Nature' : 'Patrimoine'}
                </span>
              </div>
            </div>
          </div>

          {/* Contenu de la modal */}
          <div className="p-6 md:p-8">
            {/* En-tête infos */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm text-gray-600">Localisation</div>
                  <div className="font-medium">{selectedPlace.city || selectedPlace.location || 'Non spécifié'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm text-gray-600">Année</div>
                  <div className="font-medium">{selectedPlace.year || 'Non daté'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <div>
                  <div className="text-sm text-gray-600">Protection</div>
                  <div className="font-medium">{protection}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedPlace.description || 'Aucune description disponible pour ce lieu.'}
              </p>
            </div>

            {/* Détails supplémentaires */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3">Caractéristiques</h4>
                <ul className="space-y-2">
                  {selectedPlace.altitude && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Altitude</span>
                      <span className="font-medium">{selectedPlace.altitude}m</span>
                    </li>
                  )}
                  {selectedPlace.surface && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Surface</span>
                      <span className="font-medium">{selectedPlace.surface} ha</span>
                    </li>
                  )}
                  {selectedPlace.climate && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Climat</span>
                      <span className="font-medium">{selectedPlace.climate}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-gray-900 mb-3">Accès et visite</h4>
                <ul className="space-y-2">
                  {selectedPlace.access && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Accès</span>
                      <span className="font-medium">{selectedPlace.access}</span>
                    </li>
                  )}
                  {selectedPlace.visiting_hours && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Horaires</span>
                      <span className="font-medium">{selectedPlace.visiting_hours}</span>
                    </li>
                  )}
                  {selectedPlace.entrance_fee && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">Tarif</span>
                      <span className="font-medium">{selectedPlace.entrance_fee}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Galerie d'images */}
            {images.length > 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Galerie</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.slice(0, 6).map((img, index) => (
                    <img
                      key={index}
                      src={`${img}?auto=format&fit=crop&w=400&h=300&q=80`}
                      alt={`${selectedPlace.title} - Image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(img, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedPlace.city || selectedPlace.location}`, '_blank')}
                className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Voir sur Google Maps
              </button>
            </div>
          </div>
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
  const userDisplayName = getUserDisplayName();

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto pt-10">
        {/* Modal */}
        <PlaceModal />

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
            {isAuthenticated && userDisplayName
              ? `Bienvenue ${userDisplayName}, explorez une nature préservée et un patrimoine authentique.`
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
              {(places.length > 0 ? places : [
                { title: 'Découverte Nature', images: ['https://i.pinimg.com/1200x/5a/cb/46/5acb4680585a8962184e1d96c2a3f9ba.jpg'] },
                { title: 'Patrimoine Historique', images: ['https://i.pinimg.com/1200x/17/d2/5e/17d25e4edd5fc383662aa6beeb27aed0.jpg'] },
                { title: 'Paysages Majestueux', images: ['https://i.pinimg.com/736x/90/30/98/903098b7ef3597130e4a5fa313e90b7b.jpg'] },
                { title: 'Réserves Naturelles', images: ['https://i.pinimg.com/1200x/5b/e5/40/5be540b82f8745b2f468f1d6ea46b9a7.jpg'] },
                { title: 'Sites Archéologiques', images: ['https://i.pinimg.com/736x/02/59/69/0259699a168aea21ba838cd4873a1fdc.jpg'] },
                { title: 'Monuments Classés', images: ['https://i.pinimg.com/736x/4b/90/0a/4b900aa8b4ede5e17a63c1ba67b78784.jpg'] },
              ]).slice(0, 6).map((place, index) => (
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
              {(places.length > 0 ? places : [
                { title: 'Découverte Nature', images: ['https://i.pinimg.com/1200x/5a/cb/46/5acb4680585a8962184e1d96c2a3f9ba.jpg'] },
                { title: 'Patrimoine Historique', images: ['https://i.pinimg.com/1200x/17/d2/5e/17d25e4edd5fc383662aa6beeb27aed0.jpg'] },
                { title: 'Paysages Majestueux', images: ['https://i.pinimg.com/736x/90/30/98/903098b7ef3597130e4a5fa313e90b7b.jpg'] },
                { title: 'Réserves Naturelles', images: ['https://i.pinimg.com/1200x/5b/e5/40/5be540b82f8745b2f468f1d6ea46b9a7.jpg'] },
                { title: 'Sites Archéologiques', images: ['https://i.pinimg.com/736x/02/59/69/0259699a168aea21ba838cd4873a1fdc.jpg'] },
                { title: 'Monuments Classés', images: ['https://i.pinimg.com/736x/4b/90/0a/4b900aa8b4ede5e17a63c1ba67b78784.jpg'] },
              ]).slice(0, 6).map((place, index) => (
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
        <div className="flex justify-center ">
          {/* <div className="inline-flex flex-wrap justify-center gap-3">
            <p>voici toute notre site </p>
          </div> */}
        </div>

        {/* Chargement/Erreur */}
        {loading && (
          <div className="text-center py-1">
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
        {/* Message si aucune donnée n'est disponible */}
        {!loading && places.length === 0 && (
          <div className="bg-white rounded-2xl p-8 md:p-12 mb-16 shadow-sm backdrop-blur-sm mx-auto max-w-6xl">
            <div className="text-center">
              <div className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-8 flex items-center justify-center">
                <Lottie animationData={loginAnimation} loop autoplay />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 px-4 md:px-0">
                Collection en cours
              </h2>
              <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed px-6 md:px-12 max-w-2xl mx-auto">
                Notre collection de sites naturels et patrimoniaux se construit jour après jour.
                De nouvelles destinations exceptionnelles arrivent bientôt.
              </p>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 md:p-7 shadow-md inline-block border border-white/50 max-w-md mx-auto">
                <div className="text-sm font-semibold text-gray-800 mb-4">À venir :</div>
                <div className="grid grid-cols-1 gap-2.5 text-sm text-gray-700">
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex-shrink-0" />
                    Paysages naturels époustouflants
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex-shrink-0" />
                    Patrimoine historique authentique
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex-shrink-0" />
                    Réserves naturelles préservées
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex-shrink-0" />
                    Destinations uniques à explorer
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille des lieux */}
        {!loading && places.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun lieu trouvé pour cette catégorie.</p>
                  <button
                    onClick={() => fetchPatrimoines(1, 'tous')}
                    className="mt-4 px-4 py-2 bg-secondary-text text-white rounded-lg hover:bg-secondary-text/80"
                  >
                    Recharger les données
                  </button>
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

            {/* Section statistiques - Affichée seulement si données */}
            {places.length > 0 && (
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
            )}

            {/* Carte interactive dynamique - Affichée seulement si données */}
            {places.length > 0 && (
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
            )}
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