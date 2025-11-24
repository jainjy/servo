import React, { useState, useEffect } from 'react';
import {
    Plane,
    MapPin,
    Clock,
    Calendar,
    Users,
    Filter,
    ArrowUpDown,
    Heart,
    Share2,
    Navigation,
    Wifi,
    Utensils,
    Tv,
    Luggage,
    Snowflake,
    CheckCircle,
    X,
    Search,
    ChevronDown,
    Globe,
    CreditCard,
    User,
    Mail,
    Phone,
    Shield,
    Download,
    Printer,
    Eye
} from 'lucide-react';

interface Vol {
    id: string;
    compagnie: string;
    numeroVol: string;
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
    duree: string;
    escales: number;
    prix: number;
    classe: 'economique' | 'affaires' | 'premiere';
    disponibilite: number;
    rating: number;
    reviewCount: number;
    services: string[];
    aircraft: string;
    baggage: {
        cabine: string;
        soute: string;
    };
}

interface ReservationData {
    vol: Vol;
    passagers: number;
    classe: string;
    informations: {
        nom: string;
        prenom: string;
        email: string;
        telephone: string;
    };
    paiement: {
        numeroCarte: string;
        dateExpiration: string;
        cvv: string;
        titulaire: string;
    };
}

const VoyagesAeriens: React.FC = () => {
    // États principaux
    const [filtreCompagnie, setFiltreCompagnie] = useState<string>('toutes');
    const [filtreClasse, setFiltreClasse] = useState<string>('toutes');
    const [filtrePrixMax, setFiltrePrixMax] = useState<number>(2000);
    const [tri, setTri] = useState<string>('prix');
    const [vols, setVols] = useState<Vol[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFiltres, setShowFiltres] = useState(false);
    const [favoris, setFavoris] = useState<string[]>([]);
    const [volSelectionne, setVolSelectionne] = useState<Vol | null>(null);
    const [showModalReservation, setShowModalReservation] = useState(false);
    const [etapeReservation, setEtapeReservation] = useState(1);
    const [donneesReservation, setDonneesReservation] = useState<ReservationData | null>(null);
    const [rechercheTerm, setRechercheTerm] = useState('');

    // État de recherche étendu
    const [recherche, setRecherche] = useState({
        depart: 'Paris',
        arrivee: 'New York',
        dateAller: '2024-06-15',
        dateRetour: '',
        passagers: 1,
        classe: 'economique'
    });

    // Données de démonstration - Plus de vols pour remplir la grille
    const volsDemo: Vol[] = [
        {
            id: '1',
            compagnie: 'Air France',
            numeroVol: 'AF345',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '07:30',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'New York',
                code: 'JFK',
                heure: '10:00',
                date: '2024-06-15'
            },
            duree: '2h 30m',
            escales: 0,
            prix: 280,
            classe: 'economique',
            disponibilite: 12,
            rating: 4.5,
            reviewCount: 245,
            services: ['repas', 'divertissement', 'bagage-cabine', 'bagage-soute'],
            aircraft: 'Boeing 787',
            baggage: {
                cabine: '1x Carry-on',
                soute: '1x Checked Bag'
            }
        },
        {
            id: '2',
            compagnie: 'Delta Air Lines',
            numeroVol: 'DL 789',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '11:20',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Atlanta',
                code: 'ATL',
                heure: '14:45',
                date: '2024-06-15'
            },
            duree: '9h 25m',
            escales: 1,
            prix: 520,
            classe: 'economique',
            disponibilite: 25,
            rating: 4.2,
            reviewCount: 756,
            services: ['repas', 'divertissement', 'bagage-cabine'],
            aircraft: 'Boeing 767',
            baggage: {
                cabine: '1 bagage + 1 accessoire',
                soute: 'Bagage supplémentaire'
            }
        },
        {
            id: '3',
            compagnie: 'Emirates',
            numeroVol: 'EK 456',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '14:30',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Dubai',
                code: 'DXB',
                heure: '23:15',
                date: '2024-06-15'
            },
            duree: '6h 45m',
            escales: 0,
            prix: 780,
            classe: 'affaires',
            disponibilite: 8,
            rating: 4.8,
            reviewCount: 892,
            services: ['wifi', 'repas', 'divertissement', 'bagage-soute', 'siège-lit'],
            aircraft: 'Airbus A380',
            baggage: {
                cabine: '2 bagages + 1 accessoire',
                soute: '2 bagages inclus'
            }
        },
        {
            id: '4',
            compagnie: 'British Airways',
            numeroVol: 'BA 123',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '09:15',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Londres',
                code: 'LHR',
                heure: '10:30',
                date: '2024-06-15'
            },
            duree: '1h 15m',
            escales: 0,
            prix: 180,
            classe: 'economique',
            disponibilite: 18,
            rating: 4.3,
            reviewCount: 345,
            services: ['repas', 'bagage-cabine'],
            aircraft: 'Airbus A320',
            baggage: {
                cabine: '1x Carry-on',
                soute: '1x Checked Bag'
            }
        },
        {
            id: '5',
            compagnie: 'Qatar Airways',
            numeroVol: 'QR 789',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '16:45',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Doha',
                code: 'DOH',
                heure: '23:30',
                date: '2024-06-15'
            },
            duree: '6h 45m',
            escales: 0,
            prix: 620,
            classe: 'affaires',
            disponibilite: 6,
            rating: 4.9,
            reviewCount: 567,
            services: ['wifi', 'repas', 'divertissement', 'bagage-soute', 'siège-lit'],
            aircraft: 'Boeing 777',
            baggage: {
                cabine: '2x Carry-on',
                soute: '2x Checked Bag'
            }
        },
        {
            id: '6',
            compagnie: 'Lufthansa',
            numeroVol: 'LH 456',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '13:20',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Francfort',
                code: 'FRA',
                heure: '14:45',
                date: '2024-06-15'
            },
            duree: '1h 25m',
            escales: 0,
            prix: 220,
            classe: 'economique',
            disponibilite: 15,
            rating: 4.1,
            reviewCount: 234,
            services: ['repas', 'bagage-cabine'],
            aircraft: 'Airbus A319',
            baggage: {
                cabine: '1x Carry-on',
                soute: '1x Checked Bag'
            }
        },
        {
            id: '7',
            compagnie: 'KLM',
            numeroVol: 'KL 1234',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '08:00',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Amsterdam',
                code: 'AMS',
                heure: '09:20',
                date: '2024-06-15'
            },
            duree: '1h 20m',
            escales: 0,
            prix: 190,
            classe: 'economique',
            disponibilite: 22,
            rating: 4.4,
            reviewCount: 189,
            services: ['repas', 'bagage-cabine', 'bagage-soute'],
            aircraft: 'Boeing 737',
            baggage: {
                cabine: '1x Carry-on',
                soute: '1x Checked Bag'
            }
        },
        {
            id: '8',
            compagnie: 'Turkish Airlines',
            numeroVol: 'TK 567',
            depart: {
                ville: 'Paris',
                code: 'CDG',
                heure: '12:30',
                date: '2024-06-15'
            },
            arrivee: {
                ville: 'Istanbul',
                code: 'IST',
                heure: '16:45',
                date: '2024-06-15'
            },
            duree: '3h 15m',
            escales: 0,
            prix: 350,
            classe: 'economique',
            disponibilite: 14,
            rating: 4.6,
            reviewCount: 432,
            services: ['wifi', 'repas', 'divertissement', 'bagage-cabine', 'bagage-soute'],
            aircraft: 'Airbus A330',
            baggage: {
                cabine: '1x Carry-on',
                soute: '1x Checked Bag'
            }
        }
    ];

    useEffect(() => {
        const loadVols = async () => {
            setLoading(true);
            try {
                setTimeout(() => {
                    setVols(volsDemo);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error('Erreur chargement vols:', error);
                setVols(volsDemo);
                setLoading(false);
            }
        };

        loadVols();
    }, []);

    // Données pour les filtres
    const compagnies = ['toutes', 'Air France', 'Emirates', 'Delta Air Lines', 'Qatar Airways', 'British Airways', 'Lufthansa', 'KLM', 'Turkish Airlines'];
    const classes = ['toutes', 'economique', 'affaires', 'premiere'];

    const servicesDisponibles = [
        { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
        { id: 'repas', label: 'Repas', icon: Utensils },
        { id: 'divertissement', label: 'Divertissement', icon: Tv },
        { id: 'bagage-cabine', label: 'Bagage cabine', icon: Luggage },
        { id: 'bagage-soute', label: 'Bagage soute', icon: Luggage },
        { id: 'climatisation', label: 'Climatisation', icon: Snowflake },
        { id: 'siège-lit', label: 'Siège-lit', icon: null }
    ];

    const tris = [
        { value: 'prix', label: 'Prix croissant' },
        { value: 'duree', label: 'Durée' },
        { value: 'depart', label: 'Heure de départ' },
        { value: 'rating', label: 'Meilleures notes' }
    ];

    // Fonctions de gestion des favoris
    const toggleFavori = (volId: string) => {
        setFavoris(prev => 
            prev.includes(volId) 
                ? prev.filter(id => id !== volId)
                : [...prev, volId]
        );
    };

    const isFavori = (volId: string) => favoris.includes(volId);

    // Fonction de partage
    const partagerVol = (vol: Vol) => {
        const texte = `Vol ${vol.compagnie} ${vol.numeroVol} de ${vol.depart.ville} à ${vol.arrivee.ville} pour ${vol.prix}€`;
        if (navigator.share) {
            navigator.share({
                title: `Vol ${vol.compagnie}`,
                text: texte,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(texte);
            alert('Lien du vol copié dans le presse-papier !');
        }
    };

    // Fonction de recherche
    const effectuerRecherche = () => {
        setLoading(true);
        setTimeout(() => {
            const volsFiltres = volsDemo.filter(vol => 
                vol.depart.ville.toLowerCase().includes(recherche.depart.toLowerCase()) ||
                vol.arrivee.ville.toLowerCase().includes(recherche.arrivee.toLowerCase()) ||
                vol.compagnie.toLowerCase().includes(rechercheTerm.toLowerCase())
            );
            setVols(volsFiltres);
            setLoading(false);
        }, 500);
    };

    // Fonctions de réservation
    const demarrerReservation = (vol: Vol) => {
        setVolSelectionne(vol);
        setDonneesReservation({
            vol: vol,
            passagers: recherche.passagers,
            classe: recherche.classe,
            informations: {
                nom: '',
                prenom: '',
                email: '',
                telephone: ''
            },
            paiement: {
                numeroCarte: '',
                dateExpiration: '',
                cvv: '',
                titulaire: ''
            }
        });
        setShowModalReservation(true);
        setEtapeReservation(1);
    };

    const suivantEtape = () => {
        if (etapeReservation < 3) {
            setEtapeReservation(etapeReservation + 1);
        } else {
            finaliserReservation();
        }
    };

    const precedantEtape = () => {
        if (etapeReservation > 1) {
            setEtapeReservation(etapeReservation - 1);
        }
    };

    const finaliserReservation = () => {
        // Simulation de réservation
        console.log('Réservation finalisée:', donneesReservation);
        alert('Réservation confirmée ! Un email de confirmation vous a été envoyé.');
        setShowModalReservation(false);
        setEtapeReservation(1);
    };

    // Filtrage et tri des vols
    const volsFiltres = vols
        .filter(vol => 
            (filtreCompagnie === 'toutes' || vol.compagnie === filtreCompagnie) &&
            (filtreClasse === 'toutes' || vol.classe === filtreClasse) &&
            vol.prix <= filtrePrixMax &&
            (vol.compagnie.toLowerCase().includes(rechercheTerm.toLowerCase()) ||
             vol.depart.ville.toLowerCase().includes(rechercheTerm.toLowerCase()) ||
             vol.arrivee.ville.toLowerCase().includes(rechercheTerm.toLowerCase()))
        )
        .sort((a, b) => {
            switch (tri) {
                case 'prix':
                    return a.prix - b.prix;
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
            <div className="flex items-center space-x-3">
                {services.includes('repas') && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Utensils className="w-4 h-4 mr-1" />
                        <span>Meal</span>
                    </div>
                )}
                {services.includes('divertissement') && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Tv className="w-4 h-4 mr-1" />
                        <span>Entertainment</span>
                    </div>
                )}
                {services.includes('wifi') && (
                    <div className="flex items-center text-sm text-gray-600">
                        <Wifi className="w-4 h-4 mr-1" />
                        <span>Wi-Fi</span>
                    </div>
                )}
            </div>
        );
    };

    const getClasseLabel = (classe: string) => {
    const labels: { [key: string]: string } = {
        economique: 'Economy Class',
        affaires: 'Business Class',
        premiere: 'First Class'
    };
    return labels[classe] || classe;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col justify-center items-center h-64">
                    <img src="/loading.gif" alt="" />
                    <div className="text-gray-600">cherche des vols en cours...</div>
                </div>
                </div>
            </div>
        );
    }

    return (
        
        <div className="min-h-screen mt-10 py-8 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative shadow-xl rounded-lg overflow-hidden mt-10">
      {/* Conteneur principal avec bordure blanche */}
      <div 
        className="relative py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://i.pinimg.com/736x/22/95/e4/2295e42a259c2a69564f9c58cf9c60d2.jpg")'
        }}
      >
        {/* Overlay sombre pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        
        {/* Contenu principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Services de voyages destinés aux compagnies aériennes
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Solutions complètes de gestion de voyages pour les professionnels de l'aviation
          </p>
        </div>
        
       
      </div>
    </div>
               
                {/* Filtres et tris */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                      {/* Barre de recherche positionnée en bas */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Barre de recherche texte */}
                        <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                            type="text"
                            value={rechercheTerm}
                            onChange={(e) => setRechercheTerm(e.target.value)}
                            placeholder="Rechercher par compagnie, ville de départ ou d'arrivée..."
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        </div>
                        <button
                        onClick={effectuerRecherche}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                        >
                        <Search className="w-5 h-5 mr-2" />
                        Rechercher
                        </button>
                    
                    </div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFiltres(!showFiltres)}
                                className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                <span>Filtres</span>
                            </button>
                            
                            <div className="flex items-center space-x-2">
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

                        <div className="text-sm text-gray-600">
                            {volsFiltres.length} vol(s) trouvé(s)
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
                                    Prix maximum: {filtrePrixMax}€
                                </label>
                                <input
                                    type="range"
                                    min="100"
                                    max="2000"
                                    step="50"
                                    value={filtrePrixMax}
                                    onChange={(e) => setFiltrePrixMax(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>100€</span>
                                    <span>2000€</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Liste des vols - STYLE EXACT PHOTO */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {volsFiltres.map((vol) => (
                    <div
                    key={vol.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full max-w-md mx-auto"
                    >
                    {/* Header - Compagnie et prix sur même ligne */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-bold text-gray-900">{vol.compagnie}</h3>
                        <p className="text-gray-600 text-lg">{vol.numeroVol}</p>
                        </div>
                        <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{vol.prix}€</div>
                        </div>
                    </div>

                    {/* Classe et disponibilité */}
                    <div className="mb-6">
                        <div className="text-lg font-semibold text-gray-700 mb-1">
                        {getClasseLabel(vol.classe)}
                        </div>
                        <div className="text-green-600 font-medium text-sm">
                        {vol.disponibilite} places restantes
                        </div>
                    </div>

                    {/* Horaires et trajet - Ligne unique */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{vol.depart.heure}</div>
                        <div className="text-lg font-semibold text-gray-700">{vol.depart.code}</div>
                        <div className="text-gray-500 text-sm">{vol.depart.ville}</div>
                        </div>

                        <div className="flex flex-col items-center mx-4">
                        <div className="text-gray-600 text-sm mb-2">
                            {vol.duree} • {vol.escales} escale{vol.escales !== 1 ? 's' : ''}
                        </div>
                        <div className="relative w-24">
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
                        <div className="text-gray-500 text-sm">{vol.arrivee.ville}</div>
                        </div>
                    </div>

                   

                    {/* Services - Icônes et texte inline */}
                    <div className="flex items-center space-x-4 mb-4">
                        {vol.services.includes('repas') && (
                        <div className="flex items-center text-gray-600">
                            <Utensils className="w-4 h-4 mr-1" />
                            <span className="text-sm">Meal</span>
                        </div>
                        )}
                        {vol.services.includes('divertissement') && (
                        <div className="flex items-center text-gray-600">
                            <Tv className="w-4 h-4 mr-1" />
                            <span className="text-sm">Entertainment</span>
                        </div>
                        )}
                    </div>

                    {/* Bagages */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                        <div className="flex items-center">
                        <Luggage className="w-4 h-4 mr-2" />
                        {vol.baggage.cabine}
                        </div>
                        {vol.baggage.soute && (
                        <div className="flex items-center">
                            <Luggage className="w-4 h-4 mr-2" />
                            {vol.baggage.soute}
                        </div>
                        )}
                    </div>

                    {/* Bouton de réservation centré */}
                    <div className="text-center">
                        
                        <button 
                        onClick={() => demarrerReservation(vol)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                        >
                        Reserver
                        </button>
                        
                    </div>
                    </div>
                ))}
                </div>
                {volsFiltres.length === 0 && (
                    <div className="text-center py-12">
                        <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            Aucun vol trouvé
                        </h3>
                        <p className="text-gray-500">
                            Essayez de modifier vos critères de recherche
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Réservation */}
            {showModalReservation && volSelectionne && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 p-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Réservation de Vol</h2>
                                <p className="text-gray-600 mt-1">
                                    {volSelectionne.compagnie} • {volSelectionne.numeroVol}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModalReservation(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Contenu principal */}
                        <div className="flex-1 overflow-hidden flex">
                            {/* Étapes de réservation */}
                            <div className="w-3/4 p-6 overflow-y-auto">
                                <div className="max-w-4xl mx-auto">
                                    {/* Barre de progression */}
                                    <div className="flex items-center justify-between mb-8">
                                        {[1, 2, 3].map((etape) => (
                                            <div key={etape} className="flex items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                    etape === etapeReservation 
                                                        ? 'bg-blue-600 text-white' 
                                                        : etape < etapeReservation
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    {etape}
                                                </div>
                                                {etape < 3 && (
                                                    <div className={`w-20 h-1 mx-2 ${
                                                        etape < etapeReservation ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Étape 1: Informations vol */}
                                    {etapeReservation === 1 && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Détails du Vol</h3>
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Plane className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{volSelectionne.compagnie}</h4>
                                                            <p className="text-gray-600">{volSelectionne.numeroVol}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-gray-900">{volSelectionne.prix}€</div>
                                                        <div className="text-sm text-gray-600">{getClasseLabel(volSelectionne.classe)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <div className="text-center">
                                                        <div className="text-lg font-semibold">{volSelectionne.depart.heure}</div>
                                                        <div className="text-sm text-gray-600">{volSelectionne.depart.code}</div>
                                                        <div className="text-xs text-gray-500">{volSelectionne.depart.ville}</div>
                                                    </div>
                                                    <div className="flex-1 mx-4 text-center">
                                                        <div className="text-sm text-gray-600">{volSelectionne.duree}</div>
                                                        <div className="h-1 bg-gray-200 rounded-full mt-2"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-lg font-semibold">{volSelectionne.arrivee.heure}</div>
                                                        <div className="text-sm text-gray-600">{volSelectionne.arrivee.code}</div>
                                                        <div className="text-xs text-gray-500">{volSelectionne.arrivee.ville}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Étape 2: Informations personnelles */}
                                    {etapeReservation === 2 && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Informations Personnelles</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Votre nom"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                                    <input
                                                        type="text"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Votre prénom"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                    <input
                                                        type="email"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="votre@email.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="+33 1 23 45 67 89"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Étape 3: Paiement */}
                                    {etapeReservation === 3 && (
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Paiement Sécurisé</h3>
                                            <div className="bg-gray-50 rounded-lg p-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                                                        <div className="relative">
                                                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                            <input
                                                                type="text"
                                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                placeholder="1234 5678 9012 3456"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="MM/AA"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="123"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Titulaire de la carte</label>
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Nom comme sur la carte"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-4 text-sm text-gray-600">
                                                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                                                    Paiement sécurisé SSL 256-bit
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Récapitulatif */}
                            <div className="w-1/4 bg-gray-50 border-l border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Vol</span>
                                        <span className="font-medium">{volSelectionne.prix}€</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Frais de service</span>
                                        <span className="font-medium">15€</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Taxes</span>
                                        <span className="font-medium">32€</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2">
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span>{volSelectionne.prix + 15 + 32}€</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <button
                                        onClick={suivantEtape}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                                    >
                                        {etapeReservation === 3 ? 'Confirmer et Payer' : 'Continuer'}
                                    </button>
                                    {etapeReservation > 1 && (
                                        <button
                                            onClick={precedantEtape}
                                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200"
                                        >
                                            Retour
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoyagesAeriens;