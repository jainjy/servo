import React, { useState, useEffect } from 'react';
import {
    Bed,
    Bath,
    Square,
    MapPin,
    Phone,
    AlertCircle,
    Search,
    Filter,
    Home,
    Eye,
    ArrowRight
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../ui/button';

// Interface pour les propriétés depuis Supabase
interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
    surface: string;
    image_url: string;
    featured: boolean;
    status: string;
    created_at: string;
    updated_at: string;
    latitude?: number;
    longitude?: number;
    energy_rating?: string;
    images?: number;
    videos?: number;
}

// Initialiser Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const AnnonceCard = ({ property }: { property: Property }) => {
    const formatPrice = (price: number, type: string) => {
        if (type === 'location') {
            return `${price.toLocaleString('fr-FR')} €/mois`;
        }
        return `${price.toLocaleString('fr-FR')} €`;
    };

    const isAvailable = property.status === 'available';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            {/* Image avec overlay */}
            <div className="relative h-56 bg-gray-100 overflow-hidden">
                <img
                    src={property.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge type */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold ${property.type === 'location'
                    ? 'bg-blue-500 text-white'
                    : 'bg-emerald-500 text-white'
                    }`}>
                    {property.type === 'location' ? 'À louer' : 'À vendre'}
                </div>

                {/* Badge statut */}
                {!isAvailable && (
                    <div className="absolute top-4 right-12 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-500 text-white">
                        Non disponible
                    </div>
                )}

                {/* Prix */}
                <div className="absolute bottom-4 left-4  bg-white/55 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                    <span className="font-bold text-gray-950 text-xs">{formatPrice(property.price, property.type)}</span>
                </div>
            </div>

            {/* Contenu de la carte */}
            <div className="p-6">
                {/* Titre */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {property.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {property.description || 'Aucune description disponible'}
                </p>

                {/* Caractéristiques */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Bed className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{property.bedrooms || 0} ch.</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Bath className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{property.bathrooms || 0} sdb</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Square className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">{property.surface || '?'} m²</span>
                    </div>
                </div>

                {/* Localisation */}
                <div className="flex items-center text-gray-600 mb-6">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm">{property.location}</span>
                </div>

                {/* Bouton de contact */}
                <a href={`https://www.olimmoreunion.re/biens/${property.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <button
                        disabled={!isAvailable}
                        className={`w-full py-3 px-4 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center group/btn ${isAvailable
                            ? 'bg-slate-900 hover:bg-slate-700 text-white'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}>
                        <Eye className="w-4 h-4 mr-2" />
                        {isAvailable ? 'Afficher details' : 'Non disponible'}
                        {isAvailable && (
                            <div className="ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-200">
                                →
                            </div>
                        )}
                    </button>
                </a>
            </div>
        </div>
    );
};

const AnnoncesImmobilieres = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
    const [selectedType, setSelectedType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Récupérer les propriétés depuis Supabase
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data, error: supabaseError } = await supabase
                    .from('properties')
                    .select('*')
                    .eq('status', 'available')
                    .order('created_at', { ascending: false });

                if (supabaseError) {
                    throw new Error(supabaseError.message);
                }

                setProperties(data || []);
                setFilteredProperties(data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erreur lors du chargement des propriétés');
                console.error('Erreur Supabase:', err);
                // Afficher les données de secours si la connexion échoue
                setProperties([]);
                setFilteredProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    // Appliquer les filtres
    useEffect(() => {
        let filtered = properties;

        // Filtre par type
        if (selectedType !== 'all') {
            filtered = filtered.filter(p => p.type === selectedType);
        }

        // Recherche par titre ou localisation
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query)
            );
        }

        setFilteredProperties(filtered);
    }, [properties, selectedType, searchQuery]);

    return (
        <div className="w-full py-12 px-4 sm:px-2 lg:px-4 bg-gradient-to-b from-white via-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="mb-12 flex justify-between items-center">
                    <h2 className="text-xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Propriétés de nos partenaires
                    </h2>
                    <div className="text-center grid lg:flex items-center justify-between">
                        <Button
                            className="relative px-8 mx-auto py-3 bg-slate-900 flex items-center gap-3 hover:bg-salte-700 overflow-hidden rounded-md group transition-all duration-500 hover:scale-105"
                            onClick={() => window.open('https://www.olimmoreunion.re/biens', '_blank')}
                        >
                            {/* Cercle animé à droite */}
                            <span className="absolute inset-0 -right-14 top-12 w-36 h-32 bg-white group-hover:-top-12 transition-all duration-700 ease-out origin-bottom rounded-full transform group-hover:scale-105"></span>

                            {/* Contenu */}
                            <span className="relative z-10 text-white font-semibold group-hover:text-slate-900 transition-all duration-400 ease-out">
                                Voir plus 
                            </span>
                            <ArrowRight className="w-4 h-4 relative z-10 text-white group-hover:text-slate-900 transition-all duration-400 ease-out group-hover:translate-x-1" />
                        </Button>
                    </div>
                    {/* <div className='py-4 px-8 bg-slate-900 text-md text-white rounded-lg'>
                        <a href="https://www.olimmoreunion.re/biens">Voir plus</a>
                    </div> */}
                </div>


                {/* État de chargement */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <img src="/loading.gif" alt="" />                        <p className="text-gray-600 text-lg">Chargement des propriétés...</p>
                    </div>
                )}

                {/* État d'erreur */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                            <div>
                                <h3 className="font-semibold text-red-900">Erreur de chargement</h3>
                                <p className="text-red-700 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grille de propriétés */}
                {!loading && filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProperties.slice(0, 4).map((property) => (
                            <AnnonceCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : !loading && !error ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <Home className="w-16 h-16 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-600">Aucune propriété trouvée</h3>
                        <p className="text-gray-500">
                            {searchQuery || selectedType !== 'all'
                                ? 'Essayez de modifier vos critères de recherche'
                                : 'Aucune propriété disponible pour le moment'}
                        </p>
                    </div>
                ) : null}

                {/* Résultats */}
                {!loading && filteredProperties.length > 0 && (
                    <div className="mt-8 grid place-items-center  text-gray-100">
                        <p className='bg-slate-800 w-1/4 text-center text-xs font-bold rounded-full p-2'>
                            Affichage de <span className="font-semibold">{Math.min(4, filteredProperties.length)}</span> propriété{Math.min(4, filteredProperties.length) > 1 ? 's' : ''} sur <span className="font-semibold">{properties.length}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { AnnoncesImmobilieres };
export default AnnoncesImmobilieres;