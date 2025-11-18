import { useState, useEffect, useRef } from 'react';
import {
  MapPin, Users, Star, 
  Heart, Bed, Wifi, Car, Utensils, Snowflake, Dumbbell, Tv,
  CheckCircle, X, 
  Edit, Trash2, Eye, PlusCircle, Building, Bath, Square,
  TrendingUp, Home, Upload, Trash
} from 'lucide-react';
import { toast } from 'sonner';
import { tourismeAPI } from "@/lib/api";
import api from "@/lib/api";

export default function TourismPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    minPrice: 0,
    maxPrice: 100000,
    type: [],
    rating: 0,
    amenities: [],
    instantBook: false
  });
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    listingId: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    specialRequests: '',
    paymentMethod: 'card'
  });
  const sliderRef = useRef(null);

  // Amenities disponibles avec icônes
  const availableAmenities = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'breakfast', label: 'Petit-déjeuner', icon: Utensils },
    { id: 'pool', label: 'Piscine', icon: null },
    { id: 'spa', label: 'Spa', icon: null },
    { id: 'gym', label: 'Salle de sport', icon: Dumbbell },
    { id: 'ac', label: 'Climatisation', icon: Snowflake },
    { id: 'tv', label: 'Télévision', icon: Tv },
    { id: 'kitchen', label: 'Cuisine', icon: null }
  ];

  // Fonction pour réinitialiser complètement les filtres
  const resetAllFilters = () => {
    const resetFilters = {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      adults: 2,
      children: 0,
      infants: 0,
      minPrice: 0,
      maxPrice: 100000,
      type: [],
      rating: 0,
      amenities: [],
      instantBook: false
    };
    
    setFilters(resetFilters);
    console.log('🔄 Filtres complètement réinitialisés');
  };

  // Debug useEffect
  useEffect(() => {
    console.log('🔍 État actuel - Listings:', listings.length);
    console.log('🔍 État actuel - FilteredListings:', filteredListings.length);
    console.log('🔍 État actuel - Stats:', stats);
    
    // FORCER la synchronisation si incohérence
    if (listings.length !== filteredListings.length) {
      console.warn('⚠️ INCOHÉRENCE DÉTECTÉE: listings != filteredListings');
      console.warn('Forcer la synchronisation...');
      setFilteredListings(listings);
    }
  }, [listings, filteredListings, stats]);

  // Charger les données depuis l'API
  useEffect(() => {
    loadListings();
    loadStats();
  }, []);

  // Fonction pour analyser pourquoi les listings sont filtrés
  const analyzeFiltering = (listings, currentFilters) => {
    console.log('🔍 ANALYSE DES FILTRES:');
    
    let filteredCount = 0;
    
    listings.forEach(listing => {
      const matchesDestination = !currentFilters.destination || 
        listing.city.toLowerCase().includes(currentFilters.destination.toLowerCase()) ||
        listing.title.toLowerCase().includes(currentFilters.destination.toLowerCase());
      
      const matchesType = currentFilters.type.length === 0 || 
        currentFilters.type.includes(listing.type);
      
      const matchesRating = listing.rating >= currentFilters.rating;
      
      const matchesAmenities = currentFilters.amenities.length === 0 ||
        currentFilters.amenities.every(amenity => listing.amenities.includes(amenity));
      
      const matchesInstantBook = !currentFilters.instantBook || listing.instantBook;
      
      const matchesPrice = listing.price >= currentFilters.minPrice && 
        listing.price <= currentFilters.maxPrice;
      
      const isFiltered = !matchesDestination || !matchesType || !matchesRating || 
        !matchesAmenities || !matchesInstantBook || !matchesPrice;
      
      if (isFiltered) {
        filteredCount++;
        console.log(`❌ ${listing.title} est filtré car:`, {
          destination: !matchesDestination,
          type: !matchesType,
          rating: !matchesRating && `rating=${listing.rating} < filtre=${currentFilters.rating}`,
          amenities: !matchesAmenities,
          instantBook: !matchesInstantBook,
          price: !matchesPrice && `prix=${listing.price} hors [${currentFilters.minPrice}-${currentFilters.maxPrice}]`,
          prixListing: listing.price,
          prixMaxFiltre: currentFilters.maxPrice
        });
      }
    });
    
    console.log(`📊 Total filtré: ${filteredCount}/${listings.length}`);
  };

  const loadListings = async () => {
    try {
      setLoading(true);
      const response = await tourismeAPI.getListings();
      console.log('📦 Réponse API listings:', response.data);
      
      if (response.data.success) {
        const listingsData = response.data.data;
        setListings(listingsData);

        // Réinitialiser les filtres pour montrer TOUT
        resetAllFilters();
        setFilteredListings(listingsData);

        const initialIndexes = {};
        listingsData.forEach((listing) => {
          initialIndexes[listing.id] = 0;
        });
        setCurrentImageIndex(initialIndexes);
        
        console.log('✅ Listings chargés:', listingsData.length);
        console.log('✅ Filtres réinitialisés - devrait montrer tous les listings');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des hébergements:', error);
      toast.error('Erreur lors du chargement des hébergements');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const response = await tourismeAPI.getStats();
      console.log('📊 Réponse API stats:', response.data);
      
      if (response.data.success) {
        setStats(response.data.data);
        console.log('✅ Stats mises à jour:', response.data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Filtrer les résultats
  useEffect(() => {
    let results = listings;

    console.log('🎯 DÉBUT FILTRAGE - Filtres actuels:', filters);
    console.log('🎯 Listings avant filtrage:', listings.length);

    if (filters.destination) {
      results = results.filter(listing =>
        listing.city.toLowerCase().includes(filters.destination.toLowerCase()) ||
        listing.title.toLowerCase().includes(filters.destination.toLowerCase())
      );
      console.log('🎯 Après filtre destination:', results.length);
    }

    if (filters.type.length > 0) {
      results = results.filter(listing => filters.type.includes(listing.type));
      console.log('🎯 Après filtre type:', results.length);
    }

    if (filters.rating > 0) {
      results = results.filter(listing => listing.rating >= filters.rating);
      console.log('🎯 Après filtre rating:', results.length);
    }

    if (filters.amenities.length > 0) {
      results = results.filter(listing =>
        filters.amenities.every(amenity => listing.amenities.includes(amenity))
      );
      console.log('🎯 Après filtre amenities:', results.length);
    }

    if (filters.instantBook) {
      results = results.filter(listing => listing.instantBook);
      console.log('🎯 Après filtre instantBook:', results.length);
    }

    results = results.filter(listing =>
      listing.price >= filters.minPrice && listing.price <= filters.maxPrice
    );
    console.log('🎯 Après filtre prix:', results.length);

    // ANALYSE DES FILTRES
    analyzeFiltering(listings, filters);

    console.log('🔍 Filtrage appliqué:', {
      total: listings.length,
      filtrés: results.length,
      filtres: filters
    });

    setFilteredListings(results);
  }, [filters, listings]);

  // Gestion Admin - CORRIGÉE
  const handleAddListing = async (listingData) => {
    try {
      console.log('📤 Envoi des données:', listingData);
      
      const response = await tourismeAPI.createListing(listingData);
      console.log('📥 Réponse API:', response.data);
      
      if (response.data.success) {
        const newListing = response.data.data;
        
        // Réinitialiser les filtres pour montrer TOUS les listings
        resetAllFilters();
        
        setShowAdminModal(false);
        setEditingListing(null);
        toast.success('Hébergement créé avec succès');
        
        // Recharger toutes les données
        await Promise.all([
          loadListings(),
          loadStats()
        ]);
        
        console.log('✅ Ajout terminé - filtres réinitialisés et données rechargées');
      }
    } catch (error) {
      console.error('❌ Erreur création:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const handleEditListing = async (listingData) => {
    try {
      console.log('✏️ Modification hébergement:', listingData);
      
      const response = await tourismeAPI.updateListing(listingData.id, listingData);
      console.log('📥 Réponse modification:', response.data);
      
      if (response.data.success) {
        // Mise à jour optimiste
        setListings(prev => prev.map(l =>
          l.id === listingData.id ? response.data.data : l
        ));
        
        setFilteredListings(prev => prev.map(l =>
          l.id === listingData.id ? response.data.data : l
        ));
        
        setShowAdminModal(false);
        setEditingListing(null);
        toast.success('Hébergement modifié avec succès');
        
        // Recharger les données fraîches
        await loadStats();
        
        console.log('✅ Modification terminée');
      }
    } catch (error) {
      console.error('❌ Erreur modification:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet hébergement ?')) {
      return;
    }

    try {
      console.log('🗑️ Suppression hébergement:', id);
      
      await tourismeAPI.deleteListing(id);
      toast.success("Hébergement supprimé avec succès");
      
      // Mise à jour optimiste des listings
      setListings(prev => {
        const updated = prev.filter(listing => listing.id !== id);
        console.log('📊 Listings après suppression:', updated.length);
        return updated;
      });
      
      // RÉINITIALISATION COMPLÈTE DES FILTRES
      resetAllFilters();
      
      // Recharger les stats
      await loadStats();
      
      console.log('✅ Suppression terminée - filtres réinitialisés');
      
    } catch (error) {
      const backendMessage = error.response?.data?.error;

      if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error("Erreur lors de la suppression");
      }

      console.error("❌ Erreur suppression:", error);
    }
  };

  const toggleAvailability = async (id) => {
    try {
      console.log('🔄 Bascule disponibilité:', id);
      
      const response = await tourismeAPI.toggleAvailability(id);
      console.log('📥 Réponse disponibilité:', response.data);
      
      if (response.data.success) {
        // Mise à jour optimiste
        setListings(prev => prev.map(listing =>
          listing.id === id ? response.data.data : listing
        ));
        
        setFilteredListings(prev => prev.map(listing =>
          listing.id === id ? response.data.data : listing
        ));
        
        toast.success(response.data.message);
        await loadStats();
        
        console.log('✅ Disponibilité basculée');
      }
    } catch (error) {
      console.error('❌ Erreur bascule disponibilité:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du changement de disponibilité');
    }
  };

  const toggleFeatured = async (id) => {
    try {
      console.log('⭐ Bascule vedette:', id);
      
      const response = await tourismeAPI.toggleFeatured(id);
      console.log('📥 Réponse vedette:', response.data);
      
      if (response.data.success) {
        // Mise à jour optimiste
        setListings(prev => prev.map(listing =>
          listing.id === id ? response.data.data : listing
        ));
        
        setFilteredListings(prev => prev.map(listing =>
          listing.id === id ? response.data.data : listing
        ));
        
        toast.success(response.data.message);
        await loadStats();
        
        console.log('✅ Statut vedette basculé');
      }
    } catch (error) {
      console.error('❌ Erreur bascule vedette:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du changement de statut vedette');
    }
  };

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setShowAdminModal(true);
  };

  const openDetailModal = (listing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleBooking = (listing) => {
    setSelectedListing(listing);
    setBookingForm(prev => ({
      ...prev,
      listingId: listing.id,
      guests: filters.guests,
      adults: filters.adults,
      children: filters.children,
      infants: filters.infants,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut
    }));
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowBookingModal(false);
    toast.info("Réservation confirmée ! Un email de confirmation vous a été envoyé.");
  };

  const toggleFavorite = (listingId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(listingId)) {
        newFavorites.delete(listingId);
      } else {
        newFavorites.add(listingId);
      }
      return newFavorites;
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hotel': return Building;
      case 'apartment': return Home;
      case 'villa': return Home;
      case 'guesthouse': return Home;
      default: return Building;
    }
  };

  // Composant Carte d'Hébergement
  const ListingCard = ({ listing }) => {
    const TypeIcon = getTypeIcon(listing.type);
    const isFavorite = favorites.has(listing.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
              <div className="text-center">
                <TypeIcon className="w-12 h-12 mx-auto mb-2" />
                <div>Galerie d'images</div>
                <div className="text-xs mt-1">{listing.images?.length || 0} photos</div>
              </div>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
              {listing.type}
            </span>
            {listing.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Vedette
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex space-x-2">
            <button
              onClick={() => toggleFavorite(listing.id)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            {listing.instantBook && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                Instant
              </span>
            )}
          </div>

          {/* Prix */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-lg font-bold">{listing.price}€</span>
              <span className="text-sm opacity-90">/nuit</span>
            </div>
          </div>

          {/* Statut disponibilité */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => toggleAvailability(listing.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                listing.available
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {listing.available ? '✓ Disponible' : '✗ Indisponible'}
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          {/* Titre et Localisation */}
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{listing.title}</h3>
            <p className="text-gray-600 flex items-center text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.city}
            </p>
          </div>

          {/* Note et Avis */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-semibold text-gray-900">{listing.rating}</span>
              <span className="text-gray-500 ml-1">({listing.reviewCount} avis)</span>
            </div>
            <button
              onClick={() => toggleFeatured(listing.id)}
              className={`p-1 rounded-full transition-all duration-300 ${
                listing.featured
                  ? 'text-yellow-500 bg-yellow-50'
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={listing.featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
            >
              <Star className={`w-4 h-4 ${listing.featured ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Caractéristiques */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listing.maxGuests}</span>
              </div>
              {listing.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{listing.bedrooms}</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{listing.bathrooms}</span>
                </div>
              )}
              {listing.area && (
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{listing.area}m²</span>
                </div>
              )}
            </div>
          </div>

          {/* Équipements principaux */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {listing.amenities.slice(0, 4).map(amenityId => {
                const amenity = availableAmenities.find(a => a.id === amenityId);
                const IconComponent = amenity?.icon || CheckCircle;
                return (
                  <div key={amenityId} className="flex items-center p-1 bg-gray-100 rounded-lg">
                    <IconComponent className="w-3 h-3 text-blue-600 mr-1" />
                    <span className="text-xs text-gray-700">{amenity?.label}</span>
                  </div>
                );
              })}
              {listing.amenities.length > 4 && (
                <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                  <span className="text-xs text-gray-700">+{listing.amenities.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => openDetailModal(listing)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </button>
            <button
              onClick={() => openEditModal(listing)}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteListing(listing.id)}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal de détail des hébergements
  const DetailModal = () => {
    if (!selectedListing) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">{selectedListing.title}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 flex items-center mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              {selectedListing.city}
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Images */}
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={selectedListing.images[0]}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                  Aucune image disponible
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{selectedListing.description}</p>
            </div>

            {/* Caractéristiques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bed className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Chambres</div>
                <div className="font-semibold">{selectedListing.bedrooms || 1}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <div className="text-sm text-gray-600">Voyageurs max</div>
                <div className="font-semibold">{selectedListing.maxGuests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bath className="w-6 h-6 text-purple-600 mb-2" />
                <div className="text-sm text-gray-600">Salles de bain</div>
                <div className="font-semibold">{selectedListing.bathrooms || 1}</div>
              </div>
              {selectedListing.area && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Square className="w-6 h-6 text-orange-600 mb-2" />
                  <div className="text-sm text-gray-600">Surface</div>
                  <div className="font-semibold">{selectedListing.area}m²</div>
                </div>
              )}
            </div>

            {/* Équipements */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Équipements</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedListing.amenities.map(amenityId => {
                  const amenity = availableAmenities.find(a => a.id === amenityId);
                  const IconComponent = amenity?.icon || CheckCircle;
                  return (
                    <div key={amenityId} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">{amenity?.label || amenityId}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Informations de réservation */}
            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Informations de réservation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Prix par nuit</span>
                    <span className="font-semibold">{selectedListing.price}€</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Réservation instantanée</span>
                    <span className={`font-semibold ${selectedListing.instantBook ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedListing.instantBook ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Politique d'annulation</span>
                    <span className="font-semibold capitalize">{selectedListing.cancellationPolicy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Note</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{selectedListing.rating}</span>
                      <span className="text-gray-500 ml-1">({selectedListing.reviewCount} avis)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleBooking(selectedListing);
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300"
              >
                Réserver maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Interface Admin avec cartes
  const AdminInterface = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Hébergements</h1>
          <p className="text-gray-600">Administrez vos propriétés et réservations</p>
        </div>
        <button
          onClick={() => {
            setEditingListing(null);
            setShowAdminModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Ajouter un hébergement
        </button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <Building className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <div className="text-2xl font-bold">{stats.totalListings}</div>
                <div className="text-gray-600">Hébergements</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-500 mr-4" />
              <div>
                <div className="text-2xl font-bold">{stats.averageRating?.toFixed(2) || '0.00'}</div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <div className="text-2xl font-bold">{stats.availableListings}</div>
                <div className="text-gray-600">Disponibles</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <div className="text-gray-600">Réservations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grille de cartes */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement des hébergements...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun hébergement trouvé</h3>
              <p className="text-gray-600 mb-4">
                {listings.length === 0
                  ? "Commencez par ajouter votre premier hébergement."
                  : "Aucun hébergement ne correspond à vos critères de recherche."
                }
              </p>
              {listings.length === 0 && (
                <button
                  onClick={() => {
                    setEditingListing(null);
                    setShowAdminModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 mx-auto"
                >
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Ajouter un hébergement
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );

  // Modal d'administration avec upload d'images
  const AdminModal = () => {
    const [formData, setFormData] = useState(
      editingListing || {
        title: '',
        type: 'hotel',
        price: 0,
        city: '',
        lat: 0,
        lng: 0,
        images: [],
        amenities: [],
        maxGuests: 2,
        available: true,
        featured: false,
        description: '',
        bedrooms: 1,
        bathrooms: 1,
        instantBook: false,
        cancellationPolicy: 'moderate',
        rating: 0,
        reviewCount: 0
      }
    );

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (event) => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      setUploading(true);

      try {
        const uploadFormData = new FormData();
        files.forEach(file => {
          uploadFormData.append('files', file);
        });
        
        const response = await api.post(`/upload/tourism-multiple`, uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('📤 Réponse upload:', response);

        if (response.data.success) {
          const newImageUrls = response.data.results
            .filter(item => item.success)
            .map(item => item.url);

          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImageUrls]
          }));

          toast.success(`${newImageUrls.length} image(s) uploadée(s) avec succès`);
        } else {
          toast.error(response.data.error || 'Erreur lors de l\'upload des images');
        }
      } catch (error) {
        console.error('❌ Erreur upload:', error);
        toast.error('Erreur lors de l\'upload des images: ' + (error.response?.data?.error || error.message));
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    // Fonction pour supprimer une image
    const handleRemoveImage = (index) => {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('📝 Soumission formulaire:', formData);
      
      if (editingListing) {
        handleEditListing(formData);
      } else {
        handleAddListing(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingListing ? 'Modifier l\'hébergement' : 'Nouvel hébergement'}
              </h3>
              <button
                onClick={() => {
                  setShowAdminModal(false);
                  setEditingListing(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Section Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Images de l'hébergement
              </label>

              {/* Zone d'upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mx-auto transition-all duration-300 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Sélectionner des images
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Formats supportés: JPG, PNG, WebP. Maximum 10 images, 10MB par image.
                </p>
              </div>

              {/* Aperçu des images */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="hotel">Hôtel</option>
                  <option value="apartment">Appartement</option>
                  <option value="villa">Villa</option>
                  <option value="guesthouse">Maison d'hôtes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (€) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                rows={3}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chambres</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bedrooms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bathrooms || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voyageurs max *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Note</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre d'avis</label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewCount: Number(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Équipements</label>
              <div className="grid grid-cols-3 gap-2">
                {availableAmenities.map(amenity => (
                  <label key={amenity.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.amenities?.includes(amenity.id) || false}
                      onChange={(e) => {
                        const currentAmenities = formData.amenities || [];
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, amenities: [...currentAmenities, amenity.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, amenities: currentAmenities.filter(a => a !== amenity.id) }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.available || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                />
                <span className="ml-2 text-sm text-gray-700">Disponible</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                />
                <span className="ml-2 text-sm text-gray-700">Mettre en vedette</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.instantBook || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, instantBook: e.target.checked }))}
                />
                <span className="ml-2 text-sm text-gray-700">Réservation instantanée</span>
              </label>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Politique d'annulation</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.cancellationPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, cancellationPolicy: e.target.value }))}
                >
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Modérée</option>
                  <option value="strict">Stricte</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAdminModal(false);
                  setEditingListing(null);
                }}
                className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300"
              >
                {editingListing ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <AdminInterface />
      </div>

      {/* Modals */}
      {showAdminModal && <AdminModal />}
      {showDetailModal && <DetailModal />}

      {showBookingModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Finaliser votre réservation</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex-shrink-0"></div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{selectedListing.title}</h4>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedListing.city}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : 'Confirmer la réservation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}