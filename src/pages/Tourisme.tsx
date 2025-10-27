import { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Calendar, Users, Star, Filter, ChevronLeft, ChevronRight,
  Heart, Share2, Bed, Wifi, Car, Utensils, Snowflake, Dumbbell, Tv,
  Map, Phone, Mail, Shield, Clock, CheckCircle, X, Plus, Minus
} from 'lucide-react';
import '../styles/animationSlider.css'

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

export const TourismSection = () => {
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
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [selectedListing, setSelectedListing] = useState<TourismListing | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
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

  // Simulation de données - en production, viendrait de l'API
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
        images: ['https://i.pinimg.com/736x/27/cd/20/27cd20b21771ec82936e1edfe34c179e.jpg', 'https://i.pinimg.com/736x/e3/5b/ae/e35bae95c6700d23c3f02eaa11e2c213.jpg', 'https://i.pinimg.com/736x/4c/fa/82/4cfa8249306b071cf5347b7da38a1c9b.jpg'],
        amenities: ['wifi', 'pool', 'spa', 'breakfast', 'ac', 'tv', 'gym'],
        maxGuests: 2,
        available: true,
        provider: 'booking',
        description: 'Hôtel de charme situé en plein cœur de Paris, à proximité des monuments historiques et des transports.',
        bedrooms: 1,
        bathrooms: 1,
        instantBook: true,
        cancellationPolicy: 'flexible'
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
        images: ['https://i.pinimg.com/736x/c1/df/24/c1df246f31ff14bb2be9528561ba722a.jpg', 'https://i.pinimg.com/736x/ad/08/05/ad080556218bd17798f19005faeeae3a.jpg', 'https://i.pinimg.com/736x/cd/94/ca/cd94cacef4e8f25f74a5b1883c1ea27f.jpg'],
        amenities: ['wifi', 'kitchen', 'ac', 'tv'],
        maxGuests: 4,
        available: true,
        provider: 'airbnb',
        description: 'Appartement moderne avec vue partielle sur la Tour Eiffel. Idéal pour les familles et les séjours professionnels.',
        bedrooms: 2,
        bathrooms: 1,
        area: 65,
        instantBook: true,
        cancellationPolicy: 'moderate'
      },
      {
        id: '3',
        title: 'Villa Luxueuse avec Piscine',
        type: 'villa',
        price: 250,
        city: 'Nice',
        geo: { lat: 43.7102, lng: 7.2620 },
        rating: 4.9,
        reviewCount: 45,
        images: ['https://i.pinimg.com/736x/61/dd/43/61dd439fe0cc2c357b4d414ca9b97448.jpg', 'https://i.pinimg.com/736x/df/b6/ff/dfb6ff103a06e478e1dc32941f86e45e.jpg', 'https://i.pinimg.com/1200x/c4/b9/6b/c4b96b2fd74779249b9f66499ca9b21f.jpg'],
        amenities: ['wifi', 'pool', 'parking', 'garden', 'ac', 'tv', 'kitchen'],
        maxGuests: 6,
        available: true,
        provider: 'direct',
        description: 'Magnifique villa avec piscine privée et jardin, à quelques minutes des plages de la Côte d\'Azur.',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        instantBook: false,
        cancellationPolicy: 'strict'
      },
      {
        id: '4',
        title: 'Maison d\'Hôtes Provençale',
        type: 'guesthouse',
        price: 95,
        city: 'Avignon',
        geo: { lat: 43.9493, lng: 4.8059 },
        rating: 4.6,
        reviewCount: 67,
        images: ['https://i.pinimg.com/1200x/ef/c0/70/efc070efd7bb3716bda3d990a1908c32.jpg', 'https://i.pinimg.com/736x/54/cb/c3/54cbc3c145c748a9befe1382eea6b158.jpg', 'https://i.pinimg.com/736x/e0/e8/2c/e0e82c8370634e3d4936e6eeac08d5ed.jpg'],
        amenities: ['wifi', 'breakfast', 'parking', 'garden'],
        maxGuests: 2,
        available: true,
        provider: 'booking',
        description: 'Authentique maison d\'hôtes au cœur de la Provence, avec petit-déjeuner maison inclus.',
        bedrooms: 1,
        bathrooms: 1,
        instantBook: true,
        cancellationPolicy: 'flexible'
      }
    ];

    setListings(mockListings);
    setFilteredListings(mockListings);
    setLoading(false);

    // Initialiser les index d'images
    const initialIndexes: { [key: string]: number } = {};
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation de délai de recherche
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
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
    // Simulation de traitement de réservation
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
  const slider = sliderRef.current;
  if (!slider) return;

  // Pause l'animation pendant le défilement manuel
  slider.style.animationPlayState = 'paused';
  
  const scrollAmount = 300; // Ajustez cette valeur selon vos besoins
  const currentScroll = slider.scrollLeft;
  
  if (direction === 'left') {
    slider.scrollLeft = currentScroll - scrollAmount;
  } else {
    slider.scrollLeft = currentScroll + scrollAmount;
  }

  // Reprend l'animation après 3 secondes
  setTimeout(() => {
    if (slider) {
      slider.style.animationPlayState = 'running';
    }
  }, 3000);
};

  const updateGuestCount = (type: 'adults' | 'children' | 'infants', delta: number) => {
    setFilters(prev => {
      const newValues = { ...prev };
      const current = newValues[type];
      const newValue = Math.max(0, current + delta);
      const totalGuests = newValue +
        (type === 'adults' ? prev.children + prev.infants :
          type === 'children' ? prev.adults + prev.infants : prev.adults + prev.children);

      if (totalGuests <= 16) { // Limite raisonnable
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

  return (
    <section className=" min-h-screen">

      <div className="container mx-auto px-4 pt-24">
        {/* En-tête avec animation */}
        <div className='-z-10 absolute inset-0 w-full h-96 overflow-hidden bg-black'>
          <div className="absolute inset-0 bg-gradient-to-t backdrop-blur-sm from-black/80 via-black/40 to-transparent z-10"></div>          <img
            src="https://i.pinimg.com/1200x/19/f3/34/19f334c7d66cf3393f146a9bcfe911f4.jpg"
            alt=""
            className='w-full h-full object-cover opacity-90'
          />
        </div>

        <div className="text-center mb-16">
          <h2
            className="md:text-5xl  text-3xl font-bold  mb-6 text-slate-100 tracking-wider"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Tourisme & Hébergements
          </h2>
          <p
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            Découvrez nos hébergements partenaires et réservez votre séjour en toute simplicité
          </p>
        </div>

        {/* Formulaire de recherche avec animations */}
        <div
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100 transform hover:shadow-2xl transition-all duration-500"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-3" data-aos="fade-right" data-aos-delay="100">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Destination
              </label>
              <input
                type="text"
                placeholder="Où allez-vous ?"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              />
            </div>

            <div className="space-y-3" data-aos="fade-right" data-aos-delay="200">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Dates
              </label>
              <div className="flex space-x-3">
                <input
                  type="date"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
                  value={filters.checkIn}
                  onChange={(e) => setFilters({ ...filters, checkIn: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3" data-aos="fade-right" data-aos-delay="300">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Voyageurs
              </label>
              <div
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-300 cursor-pointer"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex justify-between items-center">
                  <span>{filters.guests} {filters.guests === 1 ? 'voyageur' : 'voyageurs'}</span>
                  <ChevronLeft className={`w-4 h-4 transition-transform ${showFilters ? '-rotate-90' : 'rotate-90'}`} />
                </div>
              </div>
            </div>

            <div className="flex items-end" data-aos="fade-left" data-aos-delay="400">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-slate-900 to-slate-600  text-white p-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Search className="w-5 h-5 mr-3" />
                {loading ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>
          </form>

          {/* Filtres avancés dépliants */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200" data-aos="fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Types d'hébergement */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Type d'hébergement</label>
                  <div className="space-y-2">
                    {['hotel', 'apartment', 'villa', 'guesthouse'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.type.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, type: [...prev.type, type] }));
                            } else {
                              setFilters(prev => ({ ...prev, type: prev.type.filter(t => t !== type) }));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Nombre de voyageurs détaillé */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Détail voyageurs</label>
                  <div className="space-y-3">
                    {[
                      { label: 'Adultes', key: 'adults' as const, description: '13 ans et plus' },
                      { label: 'Enfants', key: 'children' as const, description: '2-12 ans' },
                      { label: 'Bébés', key: 'infants' as const, description: 'Moins de 2 ans' }
                    ].map(({ label, key, description }) => (
                      <div key={key} className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-700">{label}</div>
                          <div className="text-xs text-gray-500">{description}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => updateGuestCount(key, -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{filters[key]}</span>
                          <button
                            type="button"
                            onClick={() => updateGuestCount(key, 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Équipements */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Équipements</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableAmenities.map(amenity => (
                      <label key={amenity.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity.id] }));
                            } else {
                              setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity.id) }));
                            }
                          }}
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Autres filtres */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Options</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={filters.instantBook}
                        onChange={(e) => setFilters(prev => ({ ...prev, instantBook: e.target.checked }))}
                      />
                      <span className="ml-2 text-sm text-gray-700">Réservation instantanée</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Note minimum: {filters.rating > 0 ? `${filters.rating}+` : 'Toutes'}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={filters.rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Toutes</span>
                        <span>5★</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setFilters({
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
                  })}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Réinitialiser les filtres
                </button>

                <div className="text-sm text-gray-600 font-medium">
                  {filteredListings.length} hébergements trouvés
                </div>
              </div>
            </div>
          )}

          {/* Filtres rapides */}
          {!showFilters && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 group"
              >
                <Filter className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Plus de filtres
              </button>

              <div className="text-sm text-gray-500 font-medium">
                {filteredListings.length} hébergements trouvés
              </div>
            </div>
          )}
        </div>

        {/* Slider des destinations populaires */}
        <div className="relative mb-12" data-aos="fade-up">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-2xl font-bold text-gray-900">Destinations populaires</h3>
    <div className="flex space-x-3">
      <button
        onClick={() => scrollSlider('left')}
        className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scrollSlider('right')}
        className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* Conteneur avec animation infinie */}
  <div className="relative overflow-hidden">
    <div
      ref={sliderRef}
      className="flex space-x-6 scrollbar-hide py-4"
      style={{
        animation: 'infinite-scroll 40s linear infinite',
        width: 'max-content'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.animationPlayState = 'paused';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.animationPlayState = 'running';
      }}
    >
      {[
        { city: 'Paris', price: 85, image: 'https://i.pinimg.com/736x/d0/a9/ee/d0a9eedeb877f0ffb5d0e58c23e5fa7c.jpg' },
        { city: 'Nice', price: 95, image: 'https://i.pinimg.com/1200x/74/4b/10/744b1079a9927e3e239d77f9d71bc35b.jpg' },
        { city: 'Lyon', price: 75, image: 'https://i.pinimg.com/1200x/bf/31/6a/bf316aba664f037dbd9ecfa3f98ff458.jpg' },
        { city: 'Marseille', price: 70, image: 'https://i.pinimg.com/1200x/2a/56/86/2a56867db8955117fffa2d270d013c78.jpg' },
        { city: 'Bordeaux', price: 80, image: 'https://i.pinimg.com/1200x/4f/b1/01/4fb101e13cf7f9bb55b3f4507dc0e8d5.jpg' },
        { city: 'Toulouse', price: 65, image: 'https://i.pinimg.com/736x/50/b8/18/50b81828e8623577eee54e12ca0b353c.jpg' },
        // Duplication pour l'effet infini
        { city: 'Paris', price: 85, image: 'https://i.pinimg.com/736x/d0/a9/ee/d0a9eedeb877f0ffb5d0e58c23e5fa7c.jpg' },
        { city: 'Nice', price: 95, image: 'https://i.pinimg.com/1200x/74/4b/10/744b1079a9927e3e239d77f9d71bc35b.jpg' },
        { city: 'Lyon', price: 75, image: 'https://i.pinimg.com/1200x/bf/31/6a/bf316aba664f037dbd9ecfa3f98ff458.jpg' },
        { city: 'Marseille', price: 70, image: 'https://i.pinimg.com/1200x/2a/56/86/2a56867db8955117fffa2d270d013c78.jpg' },
        { city: 'Bordeaux', price: 80, image: 'https://i.pinimg.com/1200x/4f/b1/01/4fb101e13cf7f9bb55b3f4507dc0e8d5.jpg' },
        { city: 'Toulouse', price: 65, image: 'https://i.pinimg.com/736x/50/b8/18/50b81828e8623577eee54e12ca0b353c.jpg' }
      ].map((destination, index) => (
        <div
          key={`${destination.city}-${index}`}
          className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 cursor-pointer group"
          data-aos="zoom-in"
          data-aos-delay={index * 100}
        >
          <div
            className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl relative overflow-hidden"
            style={{
              backgroundImage: `url(${destination.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="font-bold text-lg">{destination.city}</h4>
              <p className="text-xs rounded-full px-2 opacity-90 bg-white/20 backdrop-blur-sm p-1">À partir de {destination.price}€</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Résultats avec animations améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Squelettes de chargement animés
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="h-60 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-200 animate-shimmer"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            filteredListings.map((listing, index) => (
              <div
                key={listing.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                {/* Carousel d'images */}
                <div className="h-60 bg-gray-200 relative overflow-hidden">
                  <div
                    className="flex h-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex[listing.id] * 100}%)` }}
                  >
                    {listing.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="w-full h-full flex-shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-white font-bold">
                          <img src={image} alt="" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Badge provider */}
                  {listing.provider && (
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {listing.provider.toUpperCase()}
                    </div>
                  )}

                  {/* Badge réservation instantanée */}
                  {listing.instantBook && (
                    <div className="absolute top-4 right-20 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Instant
                    </div>
                  )}

                  {/* Boutons favori et partage */}
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => toggleFavorite(listing.id)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favorites.has(listing.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(listing.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Contrôles du carousel */}
                  {listing.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(listing.id, listing.images.length)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => nextImage(listing.id, listing.images.length)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Indicateurs de slide */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {listing.images.map((_, dotIndex) => (
                          <button
                            key={dotIndex}
                            onClick={() => setCurrentImageIndex(prev => ({
                              ...prev,
                              [listing.id]: dotIndex
                            }))}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentImageIndex[listing.id] === dotIndex
                              ? 'bg-white scale-125'
                              : 'bg-white bg-opacity-50'
                              }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {listing.rating} ({listing.reviewCount})
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    {listing.city}
                    {listing.area && ` • ${listing.area}m²`}
                    {listing.bedrooms && ` • ${listing.bedrooms} chambre${listing.bedrooms > 1 ? 's' : ''}`}
                    {listing.bathrooms && ` • ${listing.bathrooms} salle${listing.bathrooms > 1 ? 's' : ''} de bain`}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {listing.amenities.slice(0, 3).map(amenity => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <span
                          key={amenity}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:bg-blue-100 hover:scale-105 flex items-center"
                        >
                          <IconComponent className="w-3 h-3 mr-1" />
                          {availableAmenities.find(a => a.id === amenity)?.label || amenity}
                        </span>
                      );
                    })}
                    {listing.amenities.length > 3 && (
                      <span className="text-gray-500 text-xs font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                        +{listing.amenities.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        {listing.price}€
                      </span>
                      <span className="text-gray-600 text-sm"> / nuit</span>
                      {listing.cancellationPolicy && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Politique {listing.cancellationPolicy}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleBooking(listing)}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {listing.instantBook ? 'Réserver' : 'Vérifier disponibilité'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de réservation */}
        {showBookingModal && selectedListing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              data-aos="zoom-in"
            >
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
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex-shrink-0">
                    {selectedListing.images[0] ? <img src={selectedListing.images[0]} alt="" className="w-full h-full object-cover rounded-xl" /> :
                    <img  alt="" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{selectedListing.title}</h4>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedListing.city}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {selectedListing.rating} ({selectedListing.reviewCount} avis)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Arrivée</label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={bookingForm.checkIn}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, checkIn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Départ</label>
                    <input
                      type="date"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={bookingForm.checkOut}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, checkOut: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Voyageurs</label>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-medium">Adultes</div>
                        <div className="text-sm text-gray-500">13 ans et plus</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateGuestCount('adults', -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{bookingForm.adults}</span>
                        <button
                          onClick={() => updateGuestCount('adults', 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="font-medium">Enfants</div>
                        <div className="text-sm text-gray-500">2-12 ans</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateGuestCount('children', -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{bookingForm.children}</span>
                        <button
                          onClick={() => updateGuestCount('children', 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Bébés</div>
                        <div className="text-sm text-gray-500">Moins de 2 ans</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateGuestCount('infants', -1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{bookingForm.infants}</span>
                        <button
                          onClick={() => updateGuestCount('infants', 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Demandes spéciales</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Informations supplémentaires..."
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-xl mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Prix par nuit</span>
                    <span className="font-semibold">{selectedListing.price}€</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Frais de service</span>
                    <span className="font-semibold">15€</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-blue-200">
                    <span>Total</span>
                    <span>{selectedListing.price + 15}€</span>
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
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Traitement...' : 'Confirmer la réservation'}
                  </button>
                </div>

                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  Paiement sécurisé • Annulation gratuite sous conditions
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Intégration IA - Suggestions personnalisées avec animations */}
        <div
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 border border-blue-100"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              💡 Suggestions intelligentes
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Notre IA analyse vos préférences pour des recommandations sur mesure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Proximité géographique",
                desc: "Prestataires dans votre zone",
                color: "blue",
                icon: "📍"
              },
              {
                title: "Rapport qualité-prix",
                desc: "Meilleures offres selon votre budget",
                color: "green",
                icon: "💰"
              },
              {
                title: "Disponibilité temps réel",
                desc: "Calendriers synchronisés instantanément",
                color: "purple",
                icon: "⚡"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 border-l-4 ${feature.color === 'blue' ? 'border-blue-500' :
                  feature.color === 'green' ? 'border-green-500' : 'border-purple-500'
                  }`}
                data-aos="zoom-in"
                data-aos-delay={index * 200}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <div className={`font-bold ${feature.color === 'blue' ? 'text-blue-900' :
                  feature.color === 'green' ? 'text-green-900' : 'text-purple-900'
                  } text-lg mb-2`}>
                  {feature.title}
                </div>
                <div className={`${feature.color === 'blue' ? 'text-blue-700' :
                  feature.color === 'green' ? 'text-green-700' : 'text-purple-700'
                  }`}>{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS pour animations supplémentaires */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
          background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
          background-size: 200px 100%;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .bg-size-200 {
          background-size: 200% 200%;
        }
      `}</style>

    </section>
  );
};

export default TourismSection;