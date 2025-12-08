import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Clock,
    Star,
    Calendar,
    Ticket,
    Heart,
    Camera,
    BookOpen,
    Castle,
    Church,
    Building,
    Landmark,
    GalleryVerticalEnd,
    X,
    Wifi,
    Car,
    Utensils,
    Snowflake,
    Dumbbell,
    Tv,
    CheckCircle,
    Globe,
    Phone,
    User,
    CreditCard,
    QrCode
} from 'lucide-react';
import { tourismeAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import TourismNavigation from '../TourismNavigation';

interface LieuTouristique {
    id: string;
    idUnique: string;
    title: string;
    description: string;
    type: string;
    category: string;
    city: string;
    price: number;
    rating: number;
    reviewCount: number;
    images: string[];
    amenities: string[];
    available: boolean;
    featured: boolean;
    isTouristicPlace: boolean;
    openingHours: string;
    entranceFee: string;
    website: string;
    contactInfo: string;
    coordonnees: {
        lat: number;
        lng: number;
    };
    createdAt: string;
    updatedAt: string;
    maxGuests?: number;
}

interface LieuxTouristiquesProps {
    ville?: string;
    typeFiltre?: string;
}

// Interface pour la réservation
interface ReservationData {
    placeId: string;
    visitDate: string;
    visitTime: string;
    numberOfTickets: number;
    ticketType: string;
    specialRequests?: string;
    paymentMethod: string;
}

const LieuxTouristiques: React.FC<LieuxTouristiquesProps> = ({
    ville = 'Paris',
    typeFiltre = 'tous'
}) => {
    const { user, isAuthenticated } = useAuth();
    
    const [filtreType, setFiltreType] = useState<string>('tous');
    const [tri, setTri] = useState<string>('notation');
    const [lieuSelectionne, setLieuSelectionne] = useState<LieuTouristique | null>(null);
    const [loading, setLoading] = useState(true);
    const [lieux, setLieux] = useState<LieuTouristique[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    // États pour la réservation
    const [isReservationOpen, setIsReservationOpen] = useState(false);
    const [reservationData, setReservationData] = useState<ReservationData>({
        placeId: '',
        visitDate: '',
        visitTime: '',
        numberOfTickets: 1,
        ticketType: 'adult',
        specialRequests: '',
        paymentMethod: 'card'
    });
    const [reservationLoading, setReservationLoading] = useState(false);
    const [availability, setAvailability] = useState<any>(null);

    // Images de fallback
    const fallbackImages = {
        monument: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        museum: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        park: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        mountain: 'https://images.unsplash.com/photo-1464822759844-dfa37c4d70ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        religious: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        historical: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        cultural: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        natural: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        default: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    };

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

    // Types de billets
    const ticketTypes = [
        { value: 'adult', label: 'Adulte', priceMultiplier: 1 },
        { value: 'child', label: 'Enfant', priceMultiplier: 0.5 },
        { value: 'student', label: 'Étudiant', priceMultiplier: 0.7 },
        { value: 'senior', label: 'Senior', priceMultiplier: 0.8 }
    ];

    // Horaires disponibles
    const availableTimes = [
        '09:00', '10:00', '11:00', '12:00', 
        '14:00', '15:00', '16:00', '17:00'
    ];

    // Fonction pour gérer les erreurs d'image
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, category: string = 'default') => {
        const target = e.target as HTMLImageElement;
        console.log(`❌ Erreur chargement image, utilisation fallback pour ${category}`);
        target.src = fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
        target.onerror = null; // Éviter les boucles infinies
    };

    // Fonction pour obtenir l'URL d'image sécurisée
    const getSafeImageUrl = (imageUrl: string | undefined, category: string = 'default'): string => {
        if (!imageUrl) {
            return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
        }

        // Si l'URL est valide et commence par http
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }

        // Si c'est un chemin relatif ou invalide, utiliser fallback
        return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
    };

    // Charger les lieux touristiques depuis l'API
    const loadTouristicPlaces = async () => {
        try {
            console.log('🏛️ Chargement des lieux touristiques...');
            setLoading(true);
            setError(null);

            // Essayer d'abord la route spécifique
            try {
                const response = await tourismeAPI.getTouristicPlaces();
                console.log('✅ Réponse API lieux touristiques:', response.data);

                if (response.data.success) {
                    const placesData = response.data.data;
                    console.log('📊 Lieux touristiques reçus:', placesData.length);

                    // Transformer les données pour correspondre à l'interface
                    const transformedData = placesData.map((place: any) => ({
                        id: place.id,
                        idUnique: place.idUnique,
                        title: place.title,
                        description: place.description,
                        type: place.type,
                        category: place.category,
                        city: place.city,
                        price: place.price,
                        rating: place.rating,
                        reviewCount: place.reviewCount,
                        images: place.images || [],
                        amenities: place.amenities || [],
                        available: place.available,
                        featured: place.featured,
                        isTouristicPlace: place.isTouristicPlace,
                        openingHours: place.openingHours || '',
                        entranceFee: place.entranceFee || '',
                        website: place.website || '',
                        contactInfo: place.contactInfo || '',
                        coordonnees: {
                            lat: place.lat || 48.8566,
                            lng: place.lng || 2.3522
                        },
                        maxGuests: place.maxGuests || 50,
                        createdAt: place.createdAt,
                        updatedAt: place.updatedAt
                    }));

                    setLieux(transformedData);
                    return;
                }
            } catch (specificError) {
                console.log('🔄 Route spécifique échouée, utilisation de la méthode de secours...');

                // Méthode de secours : utiliser la route principale et filtrer
                const fallbackResponse = await tourismeAPI.getListings();

                if (fallbackResponse.data.success) {
                    const allData = fallbackResponse.data.data;
                    const placesData = allData.filter((item: any) => item.isTouristicPlace);

                    // Transformer les données pour correspondre à l'interface
                    const transformedData = placesData.map((place: any) => ({
                        id: place.id,
                        idUnique: place.idUnique,
                        title: place.title,
                        description: place.description,
                        type: place.type,
                        category: place.category,
                        city: place.city,
                        price: place.price,
                        rating: place.rating,
                        reviewCount: place.reviewCount,
                        images: place.images || [],
                        amenities: place.amenities || [],
                        available: place.available,
                        featured: place.featured,
                        isTouristicPlace: place.isTouristicPlace,
                        openingHours: place.openingHours || '',
                        entranceFee: place.entranceFee || '',
                        website: place.website || '',
                        contactInfo: place.contactInfo || '',
                        coordonnees: {
                            lat: place.lat || 48.8566,
                            lng: place.lng || 2.3522
                        },
                        maxGuests: place.maxGuests || 50,
                        createdAt: place.createdAt,
                        updatedAt: place.updatedAt
                    }));

                    setLieux(transformedData);
                    return;
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors du chargement des lieux touristiques:', error);
            setError('Erreur lors du chargement des lieux touristiques');

            // Données de démonstration en cas d'erreur
            setLieux(getDemoData());
        } finally {
            setLoading(false);
        }
    };

    // Vérifier la disponibilité
    const checkAvailability = async (placeId: string, visitDate: string) => {
        try {
            const response = await tourismeAPI.checkPlaceAvailability(placeId, visitDate);
            if (response.data.success) {
                setAvailability(response.data.data);
            }
        } catch (error) {
            console.error('❌ Erreur vérification disponibilité:', error);
            setAvailability(null);
        }
    };

    // Ouvrir le modal de réservation
    const handleOpenReservation = (lieu: LieuTouristique) => {
        // Vérifier si l'utilisateur est connecté
        if (!isAuthenticated || !user) {
            alert('Veuillez vous connecter pour effectuer une réservation');
            window.location.href = '/login';
            return;
        }

        setLieuSelectionne(lieu);
        setReservationData({
            ...reservationData,
            placeId: lieu.id,
            visitDate: new Date().toISOString().split('T')[0]
        });
        setIsReservationOpen(true);
        
        // Vérifier la disponibilité pour la date du jour
        checkAvailability(lieu.id, new Date().toISOString().split('T')[0]);
    };

    // Soumettre la réservation - CORRIGÉ
    const handleSubmitReservation = async () => {
        if (!reservationData.visitDate || !reservationData.visitTime) {
            alert('Veuillez sélectionner une date et une heure de visite');
            return;
        }

        // Vérification de l'authentification
        if (!isAuthenticated || !user) {
            alert('Veuillez vous connecter pour effectuer une réservation');
            window.location.href = '/login';
            return;
        }

        setReservationLoading(true);
        try {
            // Utiliser l'ID utilisateur du contexte d'authentification
            const userId = user.id;
            
            console.log('🔄 Création réservation avec userId:', userId);
            console.log('📦 Données réservation:', reservationData);
            
            const response = await tourismeAPI.createPlaceBooking(userId, reservationData);
            
            if (response.data.success) {
                alert('🎉 Réservation créée avec succès! Votre numéro de confirmation: ' + response.data.data.confirmationNumber);
                setIsReservationOpen(false);
                setReservationData({
                    placeId: '',
                    visitDate: '',
                    visitTime: '',
                    numberOfTickets: 1,
                    ticketType: 'adult',
                    specialRequests: '',
                    paymentMethod: 'card'
                });
            } else {
                alert('❌ Erreur lors de la réservation: ' + response.data.error);
            }
        } catch (error: any) {
            console.error('❌ Erreur création réservation:', error);
            const errorMessage = error.response?.data?.error || error.message;
            alert('❌ Erreur lors de la réservation: ' + errorMessage);
            
            // Si l'erreur indique un problème d'authentification
            if (errorMessage.includes('authentifié') || errorMessage.includes('connecté') || error.response?.status === 401) {
                alert('Session expirée. Veuillez vous reconnecter.');
                window.location.href = '/login';
            }
        } finally {
            setReservationLoading(false);
        }
    };

    // Calculer le prix total
    const calculateTotalPrice = () => {
        if (!lieuSelectionne) return 0;
        
        const ticketTypeInfo = ticketTypes.find(t => t.value === reservationData.ticketType);
        const basePrice = lieuSelectionne.price || 0;
        const multiplier = ticketTypeInfo?.priceMultiplier || 1;
        
        return basePrice * multiplier * reservationData.numberOfTickets;
    };

    // Gérer le changement de date
    const handleDateChange = (date: string) => {
        setReservationData({ ...reservationData, visitDate: date });
        if (reservationData.placeId) {
            checkAvailability(reservationData.placeId, date);
        }
    };

    // Données de démonstration en cas d'échec de l'API
    const getDemoData = (): LieuTouristique[] => [
        {
            id: '1',
            idUnique: 'PL1',
            title: 'Château de Versailles',
            description: 'Ancienne résidence des rois de France, chef-d\'œuvre de l\'architecture classique et symbole de la monarchie absolue.',
            type: 'touristic_place',
            category: 'monument',
            city: 'Versailles',
            price: 20,
            rating: 4.8,
            reviewCount: 12457,
            images: ['https://images.unsplash.com/photo-1581368087046-92cc0e5a7b39?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
            amenities: ['wifi', 'parking'],
            available: true,
            featured: true,
            isTouristicPlace: true,
            openingHours: '9:00 - 18:30',
            entranceFee: '20€',
            website: 'https://www.chateauversailles.fr',
            contactInfo: '+33 1 30 83 78 00',
            coordonnees: { lat: 48.8049, lng: 2.1204 },
            maxGuests: 100,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            idUnique: 'PL2',
            title: 'Musée du Louvre',
            description: 'Le plus grand musée d\'art et d\'antiquités au monde, installé dans l\'ancien palais royal du Louvre.',
            type: 'touristic_place',
            category: 'museum',
            city: 'Paris',
            price: 17,
            rating: 4.9,
            reviewCount: 15632,
            images: ['https://images.unsplash.com/photo-1594641642923-5d5df5fe7f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
            amenities: ['wifi', 'parking'],
            available: true,
            featured: true,
            isTouristicPlace: true,
            openingHours: '9:00 - 18:00',
            entranceFee: '17€',
            website: 'https://www.louvre.fr',
            contactInfo: '+33 1 40 20 50 50',
            coordonnees: { lat: 48.8606, lng: 2.3376 },
            maxGuests: 200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    useEffect(() => {
        loadTouristicPlaces();
    }, []);

    const categories = [
        { value: 'tous', label: 'Tous les types', icon: <GalleryVerticalEnd className="w-4 h-4" /> },
        { value: 'monument', label: 'Monuments', icon: <Landmark className="w-4 h-4" /> },
        { value: 'museum', label: 'Musées', icon: <Building className="w-4 h-4" /> },
        { value: 'park', label: 'Parcs/Jardins', icon: <GalleryVerticalEnd className="w-4 h-4" /> },
        { value: 'beach', label: 'Plages', icon: <GalleryVerticalEnd className="w-4 h-4" /> },
        { value: 'mountain', label: 'Montagnes', icon: <GalleryVerticalEnd className="w-4 h-4" /> },
        { value: 'religious', label: 'Sites religieux', icon: <Church className="w-4 h-4" /> },
        { value: 'historical', label: 'Sites historiques', icon: <Castle className="w-4 h-4" /> },
        { value: 'cultural', label: 'Sites culturels', icon: <BookOpen className="w-4 h-4" /> },
        { value: 'natural', label: 'Sites naturels', icon: <GalleryVerticalEnd className="w-4 h-4" /> }
    ];

    const tris = [
        { value: 'rating', label: 'Meilleures notes' },
        { value: 'reviewCount', label: 'Plus d\'avis' },
        { value: 'price', label: 'Prix croissant' },
        { value: 'title', label: 'Ordre alphabétique' }
    ];

    const lieuxFiltres = lieux
        .filter(lieu => filtreType === 'tous' || lieu.category === filtreType)
        .sort((a, b) => {
            switch (tri) {
                case 'rating':
                    return b.rating - a.rating;
                case 'reviewCount':
                    return b.reviewCount - a.reviewCount;
                case 'price':
                    return a.price - b.price;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'monument':
                return <Landmark className="w-5 h-5 text-purple-600" />;
            case 'museum':
                return <Building className="w-5 h-5 text-blue-600" />;
            case 'park':
                return <GalleryVerticalEnd className="w-5 h-5 text-green-600" />;
            case 'beach':
                return <GalleryVerticalEnd className="w-5 h-5 text-orange-600" />;
            case 'mountain':
                return <GalleryVerticalEnd className="w-5 h-5 text-red-600" />;
            case 'religious':
                return <Church className="w-5 h-5 text-indigo-600" />;
            case 'historical':
                return <Castle className="w-5 h-5 text-cyan-600" />;
            case 'cultural':
                return <BookOpen className="w-5 h-5 text-lime-600" />;
            case 'natural':
                return <GalleryVerticalEnd className="w-5 h-5 text-emerald-600" />;
            default:
                return <GalleryVerticalEnd className="w-5 h-5 text-gray-600" />;
        }
    };

    const getCategoryLabel = (category: string) => {
        const categoryMap: { [key: string]: string } = {
            monument: 'Monument',
            museum: 'Musée',
            park: 'Parc/Jardin',
            beach: 'Plage',
            mountain: 'Montagne',
            religious: 'Site religieux',
            historical: 'Site historique',
            cultural: 'Site culturel',
            natural: 'Site naturel'
        };
        return categoryMap[category] || category;
    };

    const renderStars = (note: number) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.floor(note)
                            ? 'text-yellow-400 fill-current'
                            : star - 0.5 <= note
                                ? 'text-yellow-400 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">({note})</span>
            </div>
        );
    };

    const renderAmenities = (amenities: string[]) => {
        return (
            <div className="flex flex-wrap gap-1 mt-2">
                {amenities.slice(0, 3).map(amenityId => {
                    const amenity = availableAmenities.find(a => a.id === amenityId);
                    const IconComponent = amenity?.icon || CheckCircle;
                    return (
                        <div key={amenityId} className="flex items-center p-1 bg-gray-100 rounded-lg">
                            <IconComponent className="w-3 h-3 text-blue-600 mr-1" />
                            <span className="text-xs text-gray-700">{amenity?.label}</span>
                        </div>
                    );
                })}
                {amenities.length > 3 && (
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                        <span className="text-xs text-gray-700">+{amenities.length - 3}</span>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Chargement des lieux touristiques...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="min-h-screen mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="relative h-64 mb-12 rounded-lg overflow-hidden">
            <div className="absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50"></div>
            <img
              src="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Lieux touristiques"
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, "default")}
            />
            <TourismNavigation />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <h1 className="text-xl lg:text-4xl font-bold text-gray-100 mb-4">
                  Lieux Touristiques & Culturels
                </h1>
                <p className="text-xs lg:text-sm text-gray-200 max-w-3xl mx-auto">
                  Explorez le patrimoine local et découvrez les trésors
                  touristiques
                </p>
              </div>
            </div>
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                {error} - Affichage des données de démonstration
              </div>
            )}
          </div>

          {/* Filtres et tris */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Catégorie
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setFiltreType(category.value)}
                      className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${
                        filtreType === category.value
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {category.icon}
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Trier par
                </label>
                <select
                  value={tri}
                  onChange={(e) => setTri(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {tris.map((triOption) => (
                    <option key={triOption.value} value={triOption.value}>
                      {triOption.label}
                    </option>
                  ))}
                </select>
                <div className="mt-4 text-sm text-gray-600">
                  {lieuxFiltres.length} lieu(x) touristique(s) trouvé(s)
                </div>
              </div>
            </div>
          </div>

          {/* Grille des lieux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {lieuxFiltres.map((lieu) => (
              <div
                key={lieu.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Image de couverture */}
                <div className="h-48 bg-black relative overflow-hidden">
                  {lieu.images && lieu.images.length > 0 ? (
                    <img
                      src={getSafeImageUrl(lieu.images[0], lieu.category)}
                      alt={lieu.title}
                      className="w-full h-full object-cover flex-shrink-0 opacity-60"
                      onError={(e) => handleImageError(e, lieu.category)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Landmark className="w-12 h-12 text-white" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
                      {getCategoryIcon(lieu.category)}
                      <span className="ml-1">
                        {getCategoryLabel(lieu.category)}
                      </span>
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{lieu.title}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <MapPin className="w-4 h-4 mr-1" />
                      {lieu.city}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {lieu.description}
                  </p>

                  {/* Informations principales */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    {lieu.openingHours && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {lieu.openingHours}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {getCategoryLabel(lieu.category)}
                    </div>
                  </div>

                  {/* Horaires et prix */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          lieu.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600">
                        {lieu.available ? "Ouvert" : "Fermé"}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {lieu.price === 0 ? "Gratuit" : `${lieu.price}€`}
                      </div>
                      <div className="text-xs text-gray-500">entrée</div>
                    </div>
                  </div>

                  {/* Notation et avis */}
                  <div className="flex justify-between items-center mb-4">
                    {renderStars(lieu.rating)}
                    <div className="text-sm text-gray-600">
                      {lieu.reviewCount.toLocaleString("fr-FR")} avis
                    </div>
                  </div>

                  {/* Équipements */}
                  {lieu.amenities && lieu.amenities.length > 0 && (
                    <div className="mb-4">
                      {renderAmenities(lieu.amenities)}
                    </div>
                  )}

                  {/* Informations de contact */}
                  {(lieu.website || lieu.contactInfo) && (
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        {lieu.website && (
                          <a
                            href={lieu.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 flex items-center"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Site web
                          </a>
                        )}
                        {lieu.contactInfo && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {lieu.contactInfo}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bouton Achat billet uniquement */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOpenReservation(lieu)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      <Ticket className="w-4 h-4 inline mr-2" />
                      {lieu.price === 0 ? "Réserver visite" : "Acheter billet"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal de Réservation */}
          {isReservationOpen && lieuSelectionne && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 p-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Réservation de billet
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {lieuSelectionne.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsReservationOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                {/* Contenu */}
                <div className="p-6 space-y-6">
                  {/* Informations du lieu */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={getSafeImageUrl(
                          lieuSelectionne.images?.[0],
                          lieuSelectionne.category
                        )}
                        alt={lieuSelectionne.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) =>
                          handleImageError(e, lieuSelectionne.category)
                        }
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {lieuSelectionne.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {lieuSelectionne.city}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {lieuSelectionne.price === 0
                            ? "Gratuit"
                            : `${lieuSelectionne.price}€`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Disponibilité */}
                  {availability && (
                    <div
                      className={`p-3 rounded-lg ${
                        availability.available
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${
                            availability.available
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {availability.available
                            ? `✅ ${availability.availableSpots} places disponibles`
                            : "❌ Complet pour cette date"}
                        </span>
                        <span className="text-sm text-gray-600">
                          Capacité: {availability.totalCapacity} places
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Formulaire de réservation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date de visite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de visite
                      </label>
                      <input
                        type="date"
                        value={reservationData.visitDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Heure de visite */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Heure de visite
                      </label>
                      <select
                        value={reservationData.visitTime}
                        onChange={(e) =>
                          setReservationData({
                            ...reservationData,
                            visitTime: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner une heure</option>
                        {availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type de billet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de billet
                      </label>
                      <select
                        value={reservationData.ticketType}
                        onChange={(e) =>
                          setReservationData({
                            ...reservationData,
                            ticketType: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {ticketTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}{" "}
                            {lieuSelectionne.price > 0
                              ? `(${type.priceMultiplier * 100}%)`
                              : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nombre de billets */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de billets
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setReservationData({
                              ...reservationData,
                              numberOfTickets: Math.max(
                                1,
                                reservationData.numberOfTickets - 1
                              ),
                            })
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">
                          {reservationData.numberOfTickets}
                        </span>
                        <button
                          onClick={() =>
                            setReservationData({
                              ...reservationData,
                              numberOfTickets:
                                reservationData.numberOfTickets + 1,
                            })
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Demandes spéciales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Demandes spéciales (optionnel)
                    </label>
                    <textarea
                      value={reservationData.specialRequests}
                      onChange={(e) =>
                        setReservationData({
                          ...reservationData,
                          specialRequests: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Accessibilité, préférences particulières..."
                    />
                  </div>

                  {/* Récapitulatif et paiement */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Récapitulatif
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>
                          Billets ({reservationData.numberOfTickets}x)
                        </span>
                        <span>{calculateTotalPrice().toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de service</span>
                        <span>{(calculateTotalPrice() * 0.1).toFixed(2)}€</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{(calculateTotalPrice() * 1.1).toFixed(2)}€</span>
                      </div>
                    </div>
                  </div>

                  {/* Méthode de paiement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Méthode de paiement
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() =>
                          setReservationData({
                            ...reservationData,
                            paymentMethod: "card",
                          })
                        }
                        className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                          reservationData.paymentMethod === "card"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Carte</span>
                      </button>
                      <button
                        onClick={() =>
                          setReservationData({
                            ...reservationData,
                            paymentMethod: "cash",
                          })
                        }
                        className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                          reservationData.paymentMethod === "cash"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span>Sur place</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsReservationOpen(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitReservation}
                      disabled={
                        reservationLoading ||
                        !availability?.available ||
                        !reservationData.visitTime
                      }
                      className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                      {reservationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Réservation...
                        </>
                      ) : (
                        <>
                          <QrCode className="w-4 h-4 mr-2" />
                          {lieuSelectionne.price === 0
                            ? "Réserver gratuitement"
                            : `Payer ${(calculateTotalPrice() * 1.1).toFixed(
                                2
                              )}€`}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default LieuxTouristiques;