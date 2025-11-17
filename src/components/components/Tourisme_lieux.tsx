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
    X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LieuHistorique {
    id: string;
    nom: string;
    description: string;
    type: 'chateau' | 'eglise' | 'musee' | 'site-archeologique' | 'monument';
    adresse: string;
    ville: string;
    prixEntree: number;
    horaires: {
        ouvert: boolean;
        heures: string;
    };
    notation: number;
    avis: number;
    images: string[];
    periodeHistorique: string;
    dureeVisite: string;
    accesHandicape: boolean;
    visitesGuidees: boolean;
    siteWeb?: string;
    coordonnees: {
        lat: number;
        lng: number;
    };

}

interface LieuxHistoriquesProps {
    ville?: string;
    typeFiltre?: string;
}

const LieuxHistoriques: React.FC<LieuxHistoriquesProps> = ({
    ville = 'Paris',
    typeFiltre = 'tous'
}) => {
    const [filtreType, setFiltreType] = useState<string>('tous');
    const [tri, setTri] = useState<string>('notation');
    const [lieuSelectionne, setLieuSelectionne] = useState<LieuHistorique | null>(null);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const lieux: LieuHistorique[] = [
        {
            id: '1',
            nom: 'Château de Versailles',
            description: 'Ancienne résidence des rois de France, chef-d\'œuvre de l\'architecture classique et symbole de la monarchie absolue.',
            type: 'chateau',
            adresse: 'Place d\'Armes',
            ville: 'Versailles',
            prixEntree: 20,
            horaires: {
                ouvert: true,
                heures: '9:00 - 18:30'
            },
            notation: 4.8,
            avis: 12457,
            images: ['https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg'],
            periodeHistorique: 'XVIIe-XVIIIe siècle',
            dureeVisite: '3-4 heures',
            accesHandicape: true,
            visitesGuidees: true,
            siteWeb: 'https://www.chateauversailles.fr',
            coordonnees: { lat: 48.8049, lng: 2.1204 }
        },
        {
            id: '2',
            nom: 'Cathédrale Notre-Dame de Paris',
            description: 'Cathédrale gothique emblématique située sur l\'île de la Cité, chef-d\'œuvre de l\'architecture médiévale.',
            type: 'eglise',
            adresse: '6 Parvis Notre-Dame - Pl. Jean-Paul II',
            ville: 'Paris',
            prixEntree: 0,
            horaires: {
                ouvert: true,
                heures: '7:45 - 18:45'
            },
            notation: 4.7,
            avis: 8934,
            images: ['https://i.pinimg.com/736x/61/20/e5/6120e51550c76f08b7a9f4f0f81c112c.jpg'],
            periodeHistorique: 'Moyen Âge',
            dureeVisite: '1-2 heures',
            accesHandicape: true,
            visitesGuidees: true,
            siteWeb: 'https://www.notredamedeparis.fr',
            coordonnees: { lat: 48.8530, lng: 2.3499 }
        },
        {
            id: '3',
            nom: 'Musée du Louvre',
            description: 'Le plus grand musée d\'art et d\'antiquités au monde, installé dans l\'ancien palais royal du Louvre.',
            type: 'musee',
            adresse: 'Rue de Rivoli',
            ville: 'Paris',
            prixEntree: 17,
            horaires: {
                ouvert: true,
                heures: '9:00 - 18:00'
            },
            notation: 4.9,
            avis: 15632,
            images: ['https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg'],
            periodeHistorique: 'Multiples périodes',
            dureeVisite: '4-6 heures',
            accesHandicape: true,
            visitesGuidees: true,
            siteWeb: 'https://www.louvre.fr',
            coordonnees: { lat: 48.8606, lng: 2.3376 }
        },
        {
            id: '4',
            nom: 'Arc de Triomphe',
            description: 'Monument emblématique commandé par Napoléon pour célébrer les victoires militaires de la France.',
            type: 'monument',
            adresse: 'Place Charles de Gaulle',
            ville: 'Paris',
            prixEntree: 13,
            horaires: {
                ouvert: true,
                heures: '10:00 - 23:00'
            },
            notation: 4.6,
            avis: 6721,
            images: ['https://i.pinimg.com/1200x/35/86/b0/3586b0d2f65afcf735f9c02c4bd4168b.jpg'],
            periodeHistorique: 'XIXe siècle',
            dureeVisite: '1 heure',
            accesHandicape: false,
            visitesGuidees: true,
            siteWeb: 'https://www.paris-arc-de-triomphe.fr',
            coordonnees: { lat: 48.8738, lng: 2.2950 }
        },
        {
            id: '5',
            nom: 'Sainte-Chapelle',
            description: 'Chapelle palatine gothique renommée pour ses vitraux exceptionnels datant du XIIIe siècle.',
            type: 'eglise',
            adresse: '10 Boulevard du Palais',
            ville: 'Paris',
            prixEntree: 11,
            horaires: {
                ouvert: true,
                heures: '9:00 - 17:00'
            },
            notation: 4.7,
            avis: 5432,
            images: ['https://i.pinimg.com/1200x/e4/a7/5e/e4a75e03878009936c31e275bbceca17.jpg'],
            periodeHistorique: 'Moyen Âge',
            dureeVisite: '1 heure',
            accesHandicape: false,
            visitesGuidees: true,
            siteWeb: 'https://www.sainte-chapelle.fr',
            coordonnees: { lat: 48.8554, lng: 2.3450 }
        },
        {
            id: '6',
            nom: 'Musée d\'Orsay',
            description: 'Musée national installé dans une ancienne gare, consacré à l\'art occidental de 1848 à 1914.',
            type: 'musee',
            adresse: '1 Rue de la Légion d\'Honneur',
            ville: 'Paris',
            prixEntree: 16,
            horaires: {
                ouvert: true,
                heures: '9:30 - 18:00'
            },
            notation: 4.8,
            avis: 8921,
            images: ['https://i.pinimg.com/1200x/b2/cb/3b/b2cb3bb604a05f82b35014ab8686fd44.jpg'],
            periodeHistorique: 'XIXe-XXe siècle',
            dureeVisite: '2-3 heures',
            accesHandicape: true,
            visitesGuidees: true,
            siteWeb: 'https://www.musee-orsay.fr',
            coordonnees: { lat: 48.8600, lng: 2.3266 }
        }
    ];

    // Fonction pour créer les icônes personnalisées pour la carte
    const getMarkerIcon = (type: string) => {
        const colors: { [key: string]: string } = {
            chateau: '#a855f7',
            eglise: '#3b82f6',
            musee: '#22c55e',
            monument: '#f97316',
            'site-archeologique': '#ef4444'
        };

        const color = colors[type] || '#6b7280';

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

    const types = [
        { value: 'tous', label: 'Tous les types', icon: <GalleryVerticalEnd className="w-4 h-4" /> },
        { value: 'chateau', label: 'Châteaux', icon: <Castle className="w-4 h-4" /> },
        { value: 'eglise', label: 'Églises', icon: <Church className="w-4 h-4" /> },
        { value: 'musee', label: 'Musées', icon: <Building className="w-4 h-4" /> },
        { value: 'monument', label: 'Monuments', icon: <Landmark className="w-4 h-4" /> },
        { value: 'site-archeologique', label: 'Sites archéologiques', icon: <BookOpen className="w-4 h-4" /> }
    ];

    const tris = [
        { value: 'notation', label: 'Meilleures notes' },
        { value: 'avis', label: 'Plus d\'avis' },
        { value: 'prix', label: 'Prix croissant' },
        { value: 'nom', label: 'Ordre alphabétique' }
    ];

    const lieuxFiltres = lieux
        .filter(lieu => filtreType === 'tous' || lieu.type === filtreType)
        .sort((a, b) => {
            switch (tri) {
                case 'notation':
                    return b.notation - a.notation;
                case 'avis':
                    return b.avis - a.avis;
                case 'prix':
                    return a.prixEntree - b.prixEntree;
                case 'nom':
                    return a.nom.localeCompare(b.nom);
                default:
                    return 0;
            }
        });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'chateau':
                return <Castle className="w-5 h-5 text-purple-600" />;
            case 'eglise':
                return <Church className="w-5 h-5 text-blue-600" />;
            case 'musee':
                return <Building className="w-5 h-5 text-green-600" />;
            case 'monument':
                return <Landmark className="w-5 h-5 text-orange-600" />;
            case 'site-archeologique':
                return <BookOpen className="w-5 h-5 text-red-600" />;
            default:
                return <GalleryVerticalEnd className="w-5 h-5 text-gray-600" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'chateau':
                return 'Château';
            case 'eglise':
                return 'Église';
            case 'musee':
                return 'Musée';
            case 'monument':
                return 'Monument';
            case 'site-archeologique':
                return 'Site archéologique';
            default:
                return type;
        }
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
                        Lieux Historiques & Culturels
                    </h1>
                    <p className="text-xs lg:text-sm text-gray-200 max-w-3xl mx-auto">
                        Explorez le patrimoine local et découvrez les trésors historiques de {ville}
                    </p>
                </div>

                {/* Filtres et tris */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Type de lieu
                            </label>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                {types.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFiltreType(type.value)}
                                        className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-all duration-200 ${filtreType === type.value
                                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {type.icon}
                                        <span className="text-sm font-medium">{type.label}</span>
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
                                {lieuxFiltres.length} lieu(x) historique(s) trouvé(s)
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
                                {lieu.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${lieu.nom} - Image ${index + 1}`}
                                        className="w-full h-full object-cover flex-shrink-0 opacity-60"
                                    />
                                ))}
                                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
                                        {getTypeIcon(lieu.type)}
                                        <span className="ml-1">{getTypeLabel(lieu.type)}</span>
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                                        <Heart className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{lieu.nom}</h3>
                                    <div className="flex items-center text-sm opacity-90">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {lieu.ville}
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
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {lieu.dureeVisite}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {lieu.periodeHistorique}
                                    </div>
                                </div>

                                {/* Horaires et prix */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${lieu.horaires.ouvert ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm text-gray-600">{lieu.horaires.heures}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-900">
                                            {lieu.prixEntree === 0 ? 'Gratuit' : `${lieu.prixEntree}€`}
                                        </div>
                                        <div className="text-xs text-gray-500">par personne</div>
                                    </div>
                                </div>

                                {/* Notation et avis */}
                                <div className="flex justify-between items-center mb-4">
                                    {renderStars(lieu.notation)}
                                    <div className="text-sm text-gray-600">
                                        {lieu.avis.toLocaleString('fr-FR')} avis
                                    </div>
                                </div>

                                {/* Accessibilité */}
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                    <div className="flex items-center space-x-4">
                                        {lieu.accesHandicape && (
                                            <span className="text-green-100 bg-green-500 p-1 rounded-full"> Accessible</span>
                                        )}
                                        {lieu.visitesGuidees && (
                                            <span className="text-blue-100 bg-blue-500 py-1 px-2 rounded-full"> Visites guidées</span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">
                                        <Ticket className="w-4 h-4 inline mr-2" />
                                        Réserver
                                    </button>
                                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors duration-200">
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

                {/* Section informations pratiques */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Informations Pratiques
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Tout ce que vous devez savoir pour préparer votre visite des sites historiques
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Ticket className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Billets et réservations</h3>
                            <p className="text-gray-600 text-sm">
                                Réservez en ligne pour éviter les files d'attente et bénéficier de tarifs préférentiels
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Horaires conseillés</h3>
                            <p className="text-gray-600 text-sm">
                                Visitez tôt le matin ou en fin d'après-midi pour profiter des sites avec moins de monde
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Visites guidées</h3>
                            <p className="text-gray-600 text-sm">
                                Optez pour une visite guidée pour découvrir les anecdotes et secrets historiques
                            </p>
                        </div>
                    </div>
                </div>

                {/* Carte interactive */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 lg:p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Carte des Lieux Historiques
                        </h2>
                        <p className="text-gray-600">
                            Localisez tous les sites historiques sur la carte interactive
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-1 lg:p-6 border border-gray-200">
                        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">
                                    Carte interactive des lieux historiques de {ville}
                                </p>
                                <button 
                                    onClick={() => setIsMapOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors duration-200">
                                    Ouvrir la carte
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {types.slice(1).map((type) => (
                                <div key={type.value} className="flex items-center">
                                    {type.icon}
                                    <span className="ml-2 text-gray-700">{type.label}</span>
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
                                <h2 className="text-xl font-bold text-gray-900">Carte des Lieux Historiques</h2>
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
                                            icon={getMarkerIcon(lieu.type)}
                                        >
                                            <Popup>
                                                <div className="max-w-xs">
                                                    <h3 className="font-bold text-gray-900 mb-2">{lieu.nom}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{lieu.description}</p>
                                                    <div className="text-sm space-y-1">
                                                        <p><strong>Adresse:</strong> {lieu.adresse}</p>
                                                        <p><strong>Horaires:</strong> {lieu.horaires.heures}</p>
                                                        <p><strong>Entrée:</strong> {lieu.prixEntree === 0 ? 'Gratuit' : `${lieu.prixEntree}€`}</p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                            <span className="text-sm">{lieu.notation} ({lieu.avis} avis)</span>
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
                                    {types.slice(1).map((type) => (
                                        <div key={type.value} className="flex items-center gap-2">
                                            <div style={{
                                                backgroundColor: type.value === 'chateau' ? '#a855f7' :
                                                    type.value === 'eglise' ? '#3b82f6' :
                                                        type.value === 'musee' ? '#22c55e' :
                                                            type.value === 'monument' ? '#f97316' :
                                                                type.value === 'site-archeologique' ? '#ef4444' : '#6b7280',
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
                                            <span className="text-gray-700">{type.label}</span>
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

export default LieuxHistoriques;