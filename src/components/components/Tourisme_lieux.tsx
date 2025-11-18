import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Clock,
    Star,
    Calendar,
    Ticket,
    Users,
    Camera,
    Heart,
    Share2,
    Navigation,
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
    Phone
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { tourismeAPI } from "../../lib/api";

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
}

interface LieuxTouristiquesProps {
    ville?: string;
    typeFiltre?: string;
}

const LieuxTouristiques: React.FC<LieuxTouristiquesProps> = ({
    ville = 'Paris',
    typeFiltre = 'tous'
}) => {
    const [filtreType, setFiltreType] = useState<string>('tous');
    const [tri, setTri] = useState<string>('notation');
    const [lieuSelectionne, setLieuSelectionne] = useState<LieuTouristique | null>(null);
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [lieux, setLieux] = useState<LieuTouristique[]>([]);
    const [error, setError] = useState<string | null>(null);

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
                        images: place.images,
                        amenities: place.amenities,
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
                        images: place.images,
                        amenities: place.amenities,
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
            images: ['https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg'],
            amenities: ['wifi', 'parking'],
            available: true,
            featured: true,
            isTouristicPlace: true,
            openingHours: '9:00 - 18:30',
            entranceFee: '20€',
            website: 'https://www.chateauversailles.fr',
            contactInfo: '+33 1 30 83 78 00',
            coordonnees: { lat: 48.8049, lng: 2.1204 },
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
            images: ['https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg'],
            amenities: ['wifi', 'parking'],
            available: true,
            featured: true,
            isTouristicPlace: true,
            openingHours: '9:00 - 18:00',
            entranceFee: '17€',
            website: 'https://www.louvre.fr',
            contactInfo: '+33 1 40 20 50 50',
            coordonnees: { lat: 48.8606, lng: 2.3376 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    useEffect(() => {
        loadTouristicPlaces();
    }, []);

    // Fonction pour créer les icônes personnalisées pour la carte
    const getMarkerIcon = (category: string) => {
        const colors: { [key: string]: string } = {
            monument: '#a855f7',
            museum: '#3b82f6',
            park: '#22c55e',
            beach: '#f97316',
            mountain: '#ef4444',
            religious: '#8b5cf6',
            historical: '#06b6d4',
            cultural: '#84cc16',
            natural: '#10b981'
        };

        const color = colors[category] || '#6b7280';

        return L.divIcon({
            html: `
                <div style="
                    background-color: ${color};
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">
                    📍
                </div>
            `,
            iconSize: [40, 40],
            className: 'custom-marker'
        });
    };

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
            <div className="min-h-screen mt-16 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des lieux touristiques...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* En-tête */}
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/1200x/a4/27/cf/a427cf2bd4915d03ae201f4f85285282.jpg" alt="" />
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-xl lg:text-4xl font-bold text-gray-100 mb-4">
                        Lieux Touristiques & Culturels
                    </h1>
                    <p className="text-xs lg:text-sm text-gray-200 max-w-3xl mx-auto">
                        Explorez le patrimoine local et découvrez les trésors touristiques
                    </p>
                    {error && (
                        <div className="mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
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
                                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${filtreType === category.value
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {category.icon}
                                        <span className="text-sm font-medium">{category.label}</span>
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
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                    {lieuxFiltres.map((lieu) => (
                        <div
                            key={lieu.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                            {/* Image de couverture */}
                            <div className="h-48 bg-black relative overflow-hidden">
                                {lieu.images && lieu.images.length > 0 ? (
                                    <img
                                        src={lieu.images[0]}
                                        alt={lieu.title}
                                        className="w-full h-full object-cover flex-shrink-0 opacity-60"
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
                                        <span className="ml-1">{getCategoryLabel(lieu.category)}</span>
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                                        <Heart className="w-4 h-4 text-gray-600" />
                                    </button>
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
                                        <div className={`w-2 h-2 rounded-full ${lieu.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm text-gray-600">
                                            {lieu.available ? 'Ouvert' : 'Fermé'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            {lieu.price === 0 ? 'Gratuit' : `${lieu.price}€`}
                                        </div>
                                        <div className="text-xs text-gray-500">entrée</div>
                                    </div>
                                </div>

                                {/* Notation et avis */}
                                <div className="flex justify-between items-center mb-4">
                                    {renderStars(lieu.rating)}
                                    <div className="text-sm text-gray-600">
                                        {lieu.reviewCount.toLocaleString('fr-FR')} avis
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
                                                <a href={lieu.website} target="_blank" rel="noopener noreferrer" 
                                                   className="text-blue-600 hover:text-blue-700 flex items-center">
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

                                {/* Actions */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                                        <Ticket className="w-4 h-4 inline mr-2" />
                                        {lieu.entranceFee ? 'Acheter billet' : 'Visiter'}
                                    </button>
                                    <button 
                                        onClick={() => setIsMapOpen(true)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200"
                                    >
                                        <Navigation className="w-4 h-4" />
                                    </button>
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carte interactive */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 lg:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Carte des Lieux Touristiques
                        </h2>
                        <p className="text-gray-600">
                            Localisez tous les sites touristiques sur la carte interactive
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-1 lg:p-6 border border-gray-200">
                        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">
                                    Carte interactive des lieux touristiques
                                </p>
                                <button 
                                    onClick={() => setIsMapOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200">
                                    Ouvrir la carte
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            {categories.slice(1).map((category) => (
                                <div key={category.value} className="flex items-center">
                                    {category.icon}
                                    <span className="ml-2 text-gray-700">{category.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Carte Interactive */}
                {isMapOpen && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-xl flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                                <h2 className="text-xl font-bold text-gray-900">Carte des Lieux Touristiques</h2>
                                <button
                                    onClick={() => setIsMapOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Map Container */}
                            <div className="flex-1 relative">
                                <MapContainer 
                                    center={[48.8566, 2.3522]} 
                                    zoom={12} 
                                    scrollWheelZoom={true}
                                    className="w-full h-full"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {lieux.map((lieu) => (
                                        <Marker
                                            key={lieu.id}
                                            position={[lieu.coordonnees.lat, lieu.coordonnees.lng]}
                                            icon={getMarkerIcon(lieu.category)}
                                        >
                                            <Popup>
                                                <div className="max-w-xs">
                                                    <h3 className="font-bold text-gray-900 mb-2">{lieu.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{lieu.description}</p>
                                                    <div className="text-sm space-y-1">
                                                        <p><strong>Ville:</strong> {lieu.city}</p>
                                                        <p><strong>Catégorie:</strong> {getCategoryLabel(lieu.category)}</p>
                                                        {lieu.openingHours && <p><strong>Horaires:</strong> {lieu.openingHours}</p>}
                                                        <p><strong>Entrée:</strong> {lieu.price === 0 ? 'Gratuit' : `${lieu.price}€`}</p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-sm">{lieu.rating} ({lieu.reviewCount} avis)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>

                            {/* Legend */}
                            <div className="border-t border-gray-200 p-4 bg-gray-50">
                                <p className="text-sm font-semibold text-gray-900 mb-3">Légende des marqueurs:</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                    {categories.slice(1).map((category) => (
                                        <div key={category.value} className="flex items-center gap-2">
                                            <div style={{
                                                backgroundColor: category.value === 'monument' ? '#a855f7' :
                                                    category.value === 'museum' ? '#3b82f6' :
                                                        category.value === 'park' ? '#22c55e' :
                                                            category.value === 'beach' ? '#f97316' :
                                                                category.value === 'mountain' ? '#ef4444' :
                                                                    category.value === 'religious' ? '#8b5cf6' :
                                                                        category.value === 'historical' ? '#06b6d4' :
                                                                            category.value === 'cultural' ? '#84cc16' :
                                                                                category.value === 'natural' ? '#10b981' : '#6b7280',
                                                borderRadius: '50%',
                                                width: '20px',
                                                height: '20px',
                                                border: '2px solid white',
                                                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: '10px'
                                            }}>
                                                📍
                                            </div>
                                            <span className="text-gray-700">{category.label}</span>
                                        </div>
                                    ))}
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