import React, { useState, useEffect } from 'react';
import {
    Plane,
    Filter,
    ArrowUpDown,
    Search,
    X,
    Wifi,
    Utensils,
    Tv,
    Luggage,
    Users,
    MapPin,
    Clock,
    Star
} from 'lucide-react';
import { flightsAPI } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

// Interfaces
interface Prestataire {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nomComplet?: string;
}

interface UserReservation {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nomComplet?: string;
}

interface Vol {
    id: string;
    idPrestataire: string;
    compagnie: string;
    numeroVol: string;
    departVille: string;
    departDateHeure: string;
    arriveeVille: string;
    arriveeDateHeure: string;
    duree: string;
    escales: number;
    prix: number;
    classe: string;
    services: string[];
    image: string;
    createdAt: string;
    updatedAt: string;
    prestataire: Prestataire | null;
    userReservation: UserReservation | null;
    
    depart: {
        ville: string;
        code: string;
        heure: string;
        date: string;
    };
    arrivee: {
        ville: string;
        code: string;
        heure: string;
        date: string;
    };
    disponibilite: number;
    rating: number;
    reviewCount: number;
    aircraft: string;
    baggage: {
        cabine: string;
        soute: string;
    };
}

interface ReservationData {
    nbrPersonne: number;
    place: string;
    idUser: string;
}

const VoyagesAeriens: React.FC = () => {
    // États principaux
    const [filtreCompagnie, setFiltreCompagnie] = useState<string>('toutes');
    const [filtreClasse, setFiltreClasse] = useState<string>('toutes');
    const [filtrePrixMax, setFiltrePrixMax] = useState<number>(2000);
    const [tri, setTri] = useState<string>('prix');
    const [vols, setVols] = useState<Vol[]>([]);
    const [volsOriginaux, setVolsOriginaux] = useState<Vol[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFiltres, setShowFiltres] = useState(false);
    const [volSelectionne, setVolSelectionne] = useState<Vol | null>(null);
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [rechercheTerm, setRechercheTerm] = useState('');
    const [reservationLoading, setReservationLoading] = useState(false);
    const [reservationError, setReservationError] = useState<string | null>(null);
    const [reservationSuccess, setReservationSuccess] = useState<string | null>(null);

    // États pour la réservation
    const [nbrPersonne, setNbrPersonne] = useState<number>(1);
    const [place, setPlace] = useState<string>('');

    // Hook d'authentification
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    // Formater les données de l'API
    const formaterVolAPI = (volAPI: any): Vol => {
        const dateDepart = new Date(volAPI.departDateHeure);
        const dateArrivee = new Date(volAPI.arriveeDateHeure);
        
        const disponibilite = Math.floor(Math.random() * 30) + 5;
        const rating = parseFloat((Math.random() * 1 + 4).toFixed(1));
        const reviewCount = Math.floor(Math.random() * 500) + 100;
        const aircrafts = ['Boeing 737', 'Airbus A320', 'Boeing 787', 'Airbus A380'];
        const aircraft = aircrafts[Math.floor(Math.random() * aircrafts.length)];
        
        const hasBaggage = volAPI.services.includes('baggage');
        const baggageCabine = hasBaggage ? '1x Bagage cabine' : 'Aucun bagage cabine';
        const baggageSoute = hasBaggage ? '1x Bagage soute' : 'Bagage supplémentaire';
        
        return {
            ...volAPI,
            depart: {
                ville: volAPI.departVille,
                code: volAPI.departVille.substring(0, 3).toUpperCase(),
                heure: dateDepart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                date: dateDepart.toLocaleDateString('fr-FR')
            },
            arrivee: {
                ville: volAPI.arriveeVille,
                code: volAPI.arriveeVille.substring(0, 3).toUpperCase(),
                heure: dateArrivee.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                date: dateArrivee.toLocaleDateString('fr-FR')
            },
            disponibilite,
            rating,
            reviewCount,
            aircraft,
            baggage: {
                cabine: baggageCabine,
                soute: baggageSoute
            }
        };
    };

    // Chargement des vols depuis l'API
    useEffect(() => {
        const loadVols = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await flightsAPI.getFlights();
                
                if (response.data.success) {
                    const volsFormates = response.data.data.map((vol: any) => formaterVolAPI(vol));
                    setVols(volsFormates);
                    setVolsOriginaux(volsFormates);
                } else {
                    throw new Error(response.data.message || 'Erreur lors du chargement des vols');
                }
            } catch (error) {
                console.error('Erreur chargement vols:', error);
                setError('Impossible de charger les vols. Veuillez réessayer.');
                setVols([]);
                setVolsOriginaux([]);
            } finally {
                setLoading(false);
            }
        };

        loadVols();
    }, []);

    // Recherche dynamique avec debounce
    useEffect(() => {
        if (!rechercheTerm.trim()) {
            setVols(volsOriginaux);
            return;
        }

        const timer = setTimeout(() => {
            const termeMinuscule = rechercheTerm.toLowerCase();
            const volsFiltres = volsOriginaux.filter(vol => 
                vol.depart.ville.toLowerCase().includes(termeMinuscule) ||
                vol.arrivee.ville.toLowerCase().includes(termeMinuscule) ||
                vol.compagnie.toLowerCase().includes(termeMinuscule) ||
                vol.numeroVol.toLowerCase().includes(termeMinuscule)
            );
            setVols(volsFiltres);
        }, 300);

        return () => clearTimeout(timer);
    }, [rechercheTerm, volsOriginaux]);

    // Données pour les filtres
    const compagnies = ['toutes', ...Array.from(new Set(volsOriginaux.map(v => v.compagnie)))];
    const classes = ['toutes', ...Array.from(new Set(volsOriginaux.map(v => v.classe)))];

    const tris = [
        { value: 'prix', label: 'Prix croissant' },
        { value: 'prix-desc', label: 'Prix décroissant' },
        { value: 'duree', label: 'Durée' },
        { value: 'depart', label: 'Heure de départ' },
        { value: 'rating', label: 'Meilleures notes' }
    ];

    // Réinitialiser la recherche
    const reinitialiserRecherche = () => {
        setRechercheTerm('');
    };

    // Fonctions de réservation dynamiques
    const demarrerReservation = (vol: Vol) => {
        if (!isAuthenticated || !user) {
            alert('Veuillez vous connecter pour réserver un vol');
            return;
        }

        setVolSelectionne(vol);
        setNbrPersonne(1);
        setPlace('');
        setReservationError(null);
        setReservationSuccess(null);
        setShowModalReservation(true);
    };

    const finaliserReservation = async () => {
        if (!volSelectionne || !user) return;

        setReservationLoading(true);
        setReservationError(null);

        try {
            const reservationData: ReservationData = {
                nbrPersonne,
                place,
                idUser: user.id
            };

            const response = await flightsAPI.createReservation(volSelectionne.id, reservationData);

            if (response.data.success) {
                setReservationSuccess(`Réservation confirmée pour ${nbrPersonne} personne(s) sur la ${place} !`);
                
                setTimeout(() => {
                    setShowModalReservation(false);
                    setReservationSuccess(null);
                    rechargerVols();
                }, 2000);

            } else {
                throw new Error(response.data.message || 'Erreur lors de la réservation');
            }
        } catch (error: any) {
            console.error('Erreur réservation:', error);
            setReservationError(
                error.response?.data?.message || 
                error.message || 
                'Erreur lors de la réservation. Veuillez réessayer.'
            );
        } finally {
            setReservationLoading(false);
        }
    };

    // Recharger les vols
    const rechargerVols = async () => {
        try {
            const response = await flightsAPI.getFlights();
            if (response.data.success) {
                const volsFormates = response.data.data.map((vol: any) => formaterVolAPI(vol));
                setVols(volsFormates);
                setVolsOriginaux(volsFormates);
            }
        } catch (error) {
            console.error('Erreur rechargement vols:', error);
        }
    };

    // Générer les options de places disponibles
    const genererPlacesDisponibles = () => {
        if (!volSelectionne) return [];
        
        const places = [];
        const placesDisponibles = Math.min(volSelectionne.disponibilite, 10);
        
        for (let i = 1; i <= placesDisponibles; i++) {
            places.push(`Place ${i}`);
        }
        return places;
    };

    // Filtrage et tri des vols
    const volsFiltres = vols
        .filter(vol => 
            (filtreCompagnie === 'toutes' || vol.compagnie === filtreCompagnie) &&
            (filtreClasse === 'toutes' || vol.classe === filtreClasse) &&
            vol.prix <= filtrePrixMax
        )
        .sort((a, b) => {
            switch (tri) {
                case 'prix':
                    return a.prix - b.prix;
                case 'prix-desc':
                    return b.prix - a.prix;
                case 'duree':
                    return a.duree.localeCompare(b.duree);
                case 'depart':
                    return a.depart.heure.localeCompare(b.depart.heure);
                case 'rating':
                    return b.rating - a.rating;
                default:
                    return 0;
            }
        });

    const renderServices = (services: string[]) => {
        return (
            <div className="flex items-center space-x-3 flex-wrap gap-2">
                {services.includes('repas') && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                        <Utensils className="w-4 h-4 mr-1" />
                        <span>Repas</span>
                    </div>
                )}
                {services.includes('divertissement') && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                        <Tv className="w-4 h-4 mr-1" />
                        <span>Divertissement</span>
                    </div>
                )}
                {services.includes('wifi') && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                        <Wifi className="w-4 h-4 mr-1" />
                        <span>Wi-Fi</span>
                    </div>
                )}
                {services.includes('baggage') && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                        <Luggage className="w-4 h-4 mr-1" />
                        <span>Bagages</span>
                    </div>
                )}
            </div>
        );
    };

    const getClasseLabel = (classe: string) => {
        const labels: { [key: string]: string } = {
            economique: 'Économique',
            affaires: 'Affaires',
            premiere: 'Première',
            first: 'Première',
            economy: 'Économique',
            business: 'Affaires'
        };
        return labels[classe] || classe;
    };

    const getClasseCouleur = (classe: string) => {
        const couleurs: { [key: string]: string } = {
            economique: 'bg-green-100 text-green-800',
            affaires: 'bg-blue-100 text-blue-800',
            premiere: 'bg-purple-100 text-purple-800',
            first: 'bg-purple-100 text-purple-800',
            economy: 'bg-green-100 text-green-800',
            business: 'bg-blue-100 text-blue-800'
        };
        return couleurs[classe] || 'bg-gray-100 text-gray-800';
    };

    if (loading && authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    <div className="text-gray-600 mt-4 text-lg">Chargement des vols en cours...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
                    <div className="text-red-500 text-4xl mb-4">❌</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
                    <div className="text-gray-600 mb-6">{error}</div>
                    <button 
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-12">
            {/* En-tête 
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Vols Disponibles</h1>
                            <p className="text-gray-600">Trouvez le vol parfait pour votre prochain voyage</p>
                        </div>
                        {user && (
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Connecté en tant que</p>
                                <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>*/}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Section Hero */}
                <div className="relative rounded-2xl overflow-hidden mb-8">
                    <div 
                        className="relative py-20 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url("https://i.pinimg.com/1200x/79/94/5c/79945cc369cdb035eadcc41efc866a4c.jpg")'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r "></div>
                        <div className="relative z-10 text-center text-white">
                            <h1 className="text-5xl font-bold mb-4">Explorer le Monde</h1>
                            <p className="text-xl max-w-2xl mx-auto">
                                Découvrez des destinations incroyables avec nos vols exclusifs
                            </p>
                        </div>
                    </div>
                </div>
               
                {/* Filtres et recherche */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={rechercheTerm}
                                    onChange={(e) => setRechercheTerm(e.target.value)}
                                    placeholder="Rechercher par compagnie, vol, ville de départ ou d'arrivée..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {rechercheTerm && (
                                    <button
                                        onClick={reinitialiserRecherche}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            
                            {/* Indicateur de recherche active */}
                            {rechercheTerm && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <span className="font-semibold">{vols.length}</span> vol(s) correspondant à "{rechercheTerm}"
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={reinitialiserRecherche}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFiltres(!showFiltres)}
                                className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filtres</span>
                                {showFiltres ? <X className="w-4 h-4" /> : null}
                            </button>
                            
                            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                                <select
                                    value={tri}
                                    onChange={(e) => setTri(e.target.value)}
                                    className="border-0 bg-transparent focus:ring-0 text-gray-700"
                                >
                                    {tris.map((triOption) => (
                                        <option key={triOption.value} value={triOption.value}>
                                            {triOption.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="font-semibold">{volsFiltres.length}</span> vol(s) trouvé(s)
                        </div>
                    </div>

                    {/* Filtres détaillés */}
                    {showFiltres && (
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Compagnie aérienne
                                </label>
                                <select
                                    value={filtreCompagnie}
                                    onChange={(e) => setFiltreCompagnie(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {compagnies.map((compagnie) => (
                                        <option key={compagnie} value={compagnie}>
                                            {compagnie === 'toutes' ? 'Toutes les compagnies' : compagnie}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Classe
                                </label>
                                <select
                                    value={filtreClasse}
                                    onChange={(e) => setFiltreClasse(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {classes.map((classe) => (
                                        <option key={classe} value={classe}>
                                            {classe === 'toutes' ? 'Toutes les classes' : getClasseLabel(classe)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Prix maximum: <span className="text-blue-600 font-semibold">{filtrePrixMax}€</span>
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="2000"
                                    step="50"
                                    value={filtrePrixMax}
                                    onChange={(e) => setFiltrePrixMax(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>50€</span>
                                    <span>2000€</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des vols */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {volsFiltres.map((vol) => (
                                <div
                                    key={vol.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* En-tête de la carte */}
                                    <div className="relative">
                                        {vol.image && (
                                            <div className="h-48 overflow-hidden">
                                                <img 
                                                    src={vol.image} 
                                                    alt={`Vol ${vol.compagnie} ${vol.numeroVol}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = 'https://i.pinimg.com/1200x/79/94/5c/79945cc369cdb035eadcc41efc866a4c.jpg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getClasseCouleur(vol.classe)}`}>
                                                {getClasseLabel(vol.classe)}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                            <div className="text-2xl font-bold text-gray-900">{vol.prix}€</div>
                                            
                                        </div>
                                    </div>
                                    
                                    <div className="p-6">
                                        {/* Informations principales */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{vol.compagnie}</h3>
                                                <p className="text-gray-600">Vol {vol.numeroVol}</p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-sm font-semibold">{vol.rating}</span>
                                                <span className="text-xs text-gray-500">({vol.reviewCount})</span>
                                            </div>
                                        </div>

                                        {/* Horaires et trajet */}
                                        <div className="mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{vol.depart.heure}</div>
                                                    <div className="text-lg font-semibold text-gray-700">{vol.depart.code}</div>
                                                    <div className="text-gray-500 text-sm flex items-center justify-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {vol.depart.ville}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-center mx-4 flex-1 max-w-32">
                                                    <div className="text-gray-600 text-sm mb-2 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {vol.duree}
                                                        </div>
                                                        {vol.escales > 0 && (
                                                            <div className="text-xs text-orange-500 mt-1">
                                                                {vol.escales} escale{vol.escales !== 1 ? 's' : ''}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="relative w-full">
                                                        <div className="h-1 bg-gray-300 rounded-full"></div>
                                                        <div className="absolute inset-0 flex items-center justify-between">
                                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                            <Plane className="w-4 h-4 text-blue-600 rotate-45" />
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{vol.arrivee.heure}</div>
                                                    <div className="text-lg font-semibold text-gray-700">{vol.arrivee.code}</div>
                                                    <div className="text-gray-500 text-sm flex items-center justify-center">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {vol.arrivee.ville}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Informations supplémentaires */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm text-gray-600">
                                                <span>Appareil: {vol.aircraft}</span>
                                               
                                            </div>

                                            {/* Services */}
                                            <div className="mb-4">
                                                {renderServices(vol.services)}
                                            </div>

                                            {/* Bagages */}
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Luggage className="w-4 h-4 mr-2" />
                                                    {vol.baggage.cabine}
                                                </div>
                                                {vol.baggage.soute && vol.baggage.soute !== 'Bagage supplémentaire' && (
                                                    <div className="flex items-center">
                                                        <Luggage className="w-4 h-4 mr-2" />
                                                        {vol.baggage.soute}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bouton de réservation */}
                                        <div className="mt-6">
                                            <button 
                                                onClick={() => demarrerReservation(vol)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                                            >
                                                <Plane className="w-5 h-5 mr-2" />
                                                Réserver maintenant
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {volsFiltres.length === 0 && (
                            <div className="text-center py-16">
                                <Plane className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold text-gray-600 mb-4">
                                    Aucun vol trouvé
                                </h3>
                                <p className="text-gray-500 max-w-md mx-auto mb-6">
                                    Aucun vol ne correspond à vos critères de recherche. Essayez de modifier vos filtres ou votre recherche.
                                </p>
                                <button
                                    onClick={reinitialiserRecherche}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Réinitialiser la recherche
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Réservation COMPACT */}
            {showModalReservation && volSelectionne && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header compact */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                            <div className="flex-1">
                                <h2 className="text-lg font-bold text-gray-900">Réservation</h2>
                                <p className="text-sm text-gray-600 truncate">
                                    {volSelectionne.compagnie} • Vol {volSelectionne.numeroVol}
                                </p>
                                {user && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        Pour: {user.firstName} {user.lastName}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowModalReservation(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2 flex-shrink-0"
                                disabled={reservationLoading}
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Contenu principal avec défilement */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Résumé du vol compact */}
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-gray-900 text-sm">{volSelectionne.compagnie}</span>
                                    <span className="text-lg font-bold text-blue-600">{volSelectionne.prix}€</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-600">
                                    <div className="text-center">
                                        <div className="font-semibold">{volSelectionne.depart.heure}</div>
                                        <div>{volSelectionne.depart.code}</div>
                                    </div>
                                    <div className="flex-1 px-2">
                                        <div className="flex items-center justify-center">
                                            <div className="h-px bg-gray-300 flex-1"></div>
                                            <Plane className="w-3 h-3 text-gray-400 mx-1" />
                                            <div className="h-px bg-gray-300 flex-1"></div>
                                        </div>
                                        <div className="text-center text-xs mt-1">{volSelectionne.duree}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{volSelectionne.arrivee.heure}</div>
                                        <div>{volSelectionne.arrivee.code}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration réservation compacte */}
                            <div className="space-y-4">
                                {/* Nombre de personnes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Voyageurs
                                    </label>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setNbrPersonne(Math.max(1, nbrPersonne - 1))}
                                                disabled={nbrPersonne <= 1 || reservationLoading}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                                            >
                                                <span className="text-sm font-semibold">-</span>
                                            </button>
                                            <span className="text-lg font-bold w-6 text-center">{nbrPersonne}</span>
                                            <button
                                                onClick={() => setNbrPersonne(Math.min(volSelectionne.disponibilite, nbrPersonne + 1))}
                                                disabled={nbrPersonne >= volSelectionne.disponibilite || reservationLoading}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-50 hover:bg-gray-200 transition-colors"
                                            >
                                                <span className="text-sm font-semibold">+</span>
                                            </button>
                                        </div>
                                      
                                    </div>
                                </div>

                                {/* Sélection place */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Place
                                    </label>
                                    <select
                                        value={place}
                                        onChange={(e) => setPlace(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        disabled={reservationLoading}
                                    >
                                        <option value="">Choisir une place</option>
                                        {genererPlacesDisponibles().map((placeOption) => (
                                            <option key={placeOption} value={placeOption}>
                                                {placeOption}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Messages d'état */}
                            {reservationError && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <p className="text-red-700 text-sm">{reservationError}</p>
                                </div>
                            )}

                            {reservationSuccess && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-700 text-sm">{reservationSuccess}</p>
                                </div>
                            )}

                            {/* Prix total */}
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 font-medium">Total:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {volSelectionne.prix * nbrPersonne}€
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions fixes en bas */}
                        <div className="border-t border-gray-200 p-4 bg-white">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setShowModalReservation(false)}
                                    disabled={reservationLoading}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 text-sm"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={finaliserReservation}
                                    disabled={!place || reservationLoading || reservationSuccess !== null}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                                >
                                    {reservationLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Traitement...
                                        </>
                                    ) : reservationSuccess ? (
                                        '✅ Réservé'
                                    ) : (
                                        'Confirmer'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoyagesAeriens;