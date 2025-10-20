"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Search, MapPin, Calendar, Users, Star, ChevronLeft, ChevronRight, 
  Heart, Bed, Wifi, Car, Utensils, Snowflake, Dumbbell, Tv,
  Map, Phone, Mail, Shield, Clock, CheckCircle, X, Plus, Minus,
  Edit, Trash2, Eye, PlusCircle, Building, Bath, Square
} from 'lucide-react';

// Types basés sur le modèle de données
interface TourismListing {
  id: string;
  title: string;
  type: 'hotel' | 'apartment' | 'villa' | 'guesthouse';
  price: number;
  city: string;
  geo: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  maxGuests: number;
  available: boolean;
  provider?: 'booking' | 'airbnb' | 'direct';
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  instantBook?: boolean;
  cancellationPolicy?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface SearchFilters {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  minPrice: number;
  maxPrice: number;
  type: string[];
  rating: number;
  amenities: string[];
  instantBook: boolean;
}

interface BookingForm {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  specialRequests: string;
  paymentMethod: string;
}

export default function TourismPage() {
  const [listings, setListings] = useState<TourismListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<TourismListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    adults: 2,
    children: 0,
    infants: 0,
    minPrice: 0,
    maxPrice: 1000,
    type: [],
    rating: 0,
    amenities: [],
    instantBook: false
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<TourismListing | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingListing, setEditingListing] = useState<TourismListing | null>(null);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
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
  const sliderRef = useRef<HTMLDivElement>(null);

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

  // Simulation de données
  useEffect(() => {
    const mockListings: TourismListing[] = [
      {
        id: '1',
        title: 'Hôtel de Charme Centre Ville',
        type: 'hotel',
        price: 120,
        city: 'Paris',
        geo: { lat: 48.8566, lng: 2.3522 },
        rating: 4.5,
        reviewCount: 127,
        images: ['/img/hotel-1.jpg', '/img/hotel-2.jpg', '/img/hotel-3.jpg'],
        amenities: ['wifi', 'pool', 'spa', 'breakfast', 'ac', 'tv', 'gym'],
        maxGuests: 2,
        available: true,
        provider: 'booking',
        description: 'Hôtel de charme situé en plein cœur de Paris, à proximité des monuments historiques et des transports.',
        bedrooms: 1,
        bathrooms: 1,
        instantBook: true,
        cancellationPolicy: 'flexible',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Appartement Moderne Tour Eiffel',
        type: 'apartment',
        price: 85,
        city: 'Paris',
        geo: { lat: 48.8584, lng: 2.2945 },
        rating: 4.8,
        reviewCount: 89,
        images: ['/img/apt-1.jpg', '/img/apt-2.jpg', '/img/apt-3.jpg'],
        amenities: ['wifi', 'kitchen', 'ac', 'tv', 'parking'],
        maxGuests: 4,
        available: true,
        provider: 'airbnb',
        description: 'Appartement moderne avec vue partielle sur la Tour Eiffel. Idéal pour les familles et les séjours professionnels.',
        bedrooms: 2,
        bathrooms: 1,
        area: 65,
        instantBook: true,
        cancellationPolicy: 'moderate',
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10'
      },
      {
        id: '3',
        title: 'Villa Luxueuse Bord de Mer',
        type: 'villa',
        price: 250,
        city: 'Nice',
        geo: { lat: 43.7102, lng: 7.2620 },
        rating: 4.9,
        reviewCount: 45,
        images: ['/img/villa-1.jpg', '/img/villa-2.jpg', '/img/villa-3.jpg'],
        amenities: ['wifi', 'pool', 'parking', 'ac', 'tv', 'kitchen', 'gym'],
        maxGuests: 8,
        available: true,
        provider: 'direct',
        description: 'Villa exceptionnelle avec piscine privée et vue sur la mer Méditerranée.',
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        instantBook: false,
        cancellationPolicy: 'strict',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        id: '4',
        title: 'Maison d\'Hôtes Provençale',
        type: 'guesthouse',
        price: 95,
        city: 'Aix-en-Provence',
        geo: { lat: 43.5297, lng: 5.4474 },
        rating: 4.6,
        reviewCount: 78,
        images: ['/img/guesthouse-1.jpg', '/img/guesthouse-2.jpg', '/img/guesthouse-3.jpg'],
        amenities: ['wifi', 'breakfast', 'parking', 'garden'],
        maxGuests: 6,
        available: true,
        provider: 'booking',
        description: 'Authentique maison provençale au cœur des vignobles, avec petit-déjeuner maison inclus.',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        instantBook: true,
        cancellationPolicy: 'moderate',
        createdAt: '2024-01-18',
        updatedAt: '2024-01-18'
      }
    ];
    
    setListings(mockListings);
    setFilteredListings(mockListings);
    setLoading(false);
    
    const initialIndexes: {[key: string]: number} = {};
    mockListings.forEach(listing => {
      initialIndexes[listing.id] = 0;
    });
    setCurrentImageIndex(initialIndexes);
  }, []);

  // Filtrer les résultats
  useEffect(() => {
    let results = listings;
    
    if (filters.destination) {
      results = results.filter(listing => 
        listing.city.toLowerCase().includes(filters.destination.toLowerCase()) ||
        listing.title.toLowerCase().includes(filters.destination.toLowerCase())
      );
    }
    
    if (filters.type.length > 0) {
      results = results.filter(listing => filters.type.includes(listing.type));
    }
    
    if (filters.rating > 0) {
      results = results.filter(listing => listing.rating >= filters.rating);
    }
    
    if (filters.amenities.length > 0) {
      results = results.filter(listing => 
        filters.amenities.every(amenity => listing.amenities.includes(amenity))
      );
    }
    
    if (filters.instantBook) {
      results = results.filter(listing => listing.instantBook);
    }
    
    results = results.filter(listing => 
      listing.price >= filters.minPrice && listing.price <= filters.maxPrice
    );
    
    setFilteredListings(results);
  }, [filters, listings]);

  // Gestion Admin
  const handleAddListing = (listing: TourismListing) => {
    const newListing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setListings(prev => [...prev, newListing]);
    setShowAdminModal(false);
  };

  const handleEditListing = (listing: TourismListing) => {
    setListings(prev => prev.map(l => 
      l.id === listing.id 
        ? { ...listing, updatedAt: new Date().toISOString() }
        : l
    ));
    setShowAdminModal(false);
    setEditingListing(null);
  };

  const handleDeleteListing = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet hébergement ?')) {
      setListings(prev => prev.filter(listing => listing.id !== id));
    }
  };

  const openEditModal = (listing: TourismListing) => {
    setEditingListing(listing);
    setShowAdminModal(true);
  };

  const openDetailModal = (listing: TourismListing) => {
    setSelectedListing(listing);
    setShowDetailModal(true);
  };

  const handleBooking = (listing: TourismListing) => {
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
    alert('Réservation confirmée ! Un email de confirmation vous a été envoyé.');
  };

  const nextImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [listingId]: (prev[listingId] + 1) % totalImages
    }));
  };

  const prevImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [listingId]: (prev[listingId] - 1 + totalImages) % totalImages
    }));
  };

  const toggleFavorite = (listingId: string) => {
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

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const updateGuestCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setFilters(prev => {
      const newValues = { ...prev };
      const current = newValues[type];
      const newValue = Math.max(0, current + delta);
      const totalGuests = newValue + 
        (type === 'adults' ? prev.children + prev.infants : 
         type === 'children' ? prev.adults + prev.infants : prev.adults + prev.children);
      
      if (totalGuests <= 16) {
        newValues[type] = newValue;
        newValues.guests = newValues.adults + newValues.children + newValues.infants;
      }
      
      return newValues;
    });
  };

  const getAmenityIcon = (amenityId: string) => {
    const amenity = availableAmenities.find(a => a.id === amenityId);
    return amenity?.icon || CheckCircle;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return Building;
      case 'apartment': return Building;
      case 'villa': return Building;
      case 'guesthouse': return Building;
      default: return Building;
    }
  };

  // Composant Carte d'Hébergement
  const ListingCard = ({ listing }: { listing: TourismListing }) => {
    const TypeIcon = getTypeIcon(listing.type);
    const isFavorite = favorites.has(listing.id);

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            <div className="text-center">
              <TypeIcon className="w-12 h-12 mx-auto mb-2" />
              <div>Galerie d'images</div>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
              {listing.type}
            </span>
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
              <span className="text-gray-500 ml-1">({listing.reviewCount})</span>
            </div>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              listing.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {listing.available ? 'Disponible' : 'Indisponible'}
            </span>
          </div>

          {/* Caractéristiques */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listing.maxGuests}</span>
              </div>
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span>{listing.bedrooms || 1}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span>{listing.bathrooms || 1}</span>
              </div>
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
            <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                Galerie d'images de l'hébergement
              </div>
            </div>

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <Building className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">{listings.length}</div>
              <div className="text-gray-600">Hébergements</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-500 mr-4" />
            <div>
              <div className="text-2xl font-bold">
                {(listings.reduce((acc, listing) => acc + listing.rating, 0) / listings.length || 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">
                {listings.filter(l => l.available).length}
              </div>
              <div className="text-gray-600">Disponibles</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <div className="text-2xl font-bold">
                {listings.reduce((acc, listing) => acc + listing.reviewCount, 0)}
              </div>
              <div className="text-gray-600">Avis total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun hébergement</h3>
          <p className="text-gray-600 mb-4">Commencez par ajouter votre premier hébergement.</p>
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
        </div>
      )}
    </div>
  );

  // Modal d'administration (identique à la version précédente)
  const AdminModal = () => {
    const [formData, setFormData] = useState<TourismListing>(editingListing || {
      id: '',
      title: '',
      type: 'hotel',
      price: 0,
      city: '',
      geo: { lat: 0, lng: 0 },
      rating: 0,
      reviewCount: 0,
      images: [],
      amenities: [],
      maxGuests: 2,
      available: true,
      description: '',
      bedrooms: 1,
      bathrooms: 1,
      instantBook: false,
      cancellationPolicy: 'flexible'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingListing) {
        handleEditListing(formData);
      } else {
        handleAddListing(formData);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Prix (€)</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
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
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bedrooms: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salles de bain</label>
                <input
                  type="number"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voyageurs max</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: Number(e.target.value) }))}
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
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenity.id] }));
                        } else {
                          setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity.id) }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                  </label>
                ))}
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