import React, { useState, useEffect } from 'react';
import {
    Home,
    Shield,
    BadgeCheck,
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Heart,
    Eye,
    Calendar,
    Euro,
    Target,
    FileText,
    CheckCircle2,
    Landmark,
    Loader,
    AlertTriangle
} from 'lucide-react';
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ModalDemandeVisite } from '@/components/ModalDemandeVisite';

// Types TypeScript
interface Caracteristiques {
    chambres: number;
    sdb: number;
    surface: string;
    parking: number;
    annee: number;
    etage: number;
    balcon: boolean;
    cave: boolean;
}

interface Logement {
    id: number;
    image: string;
    type: string;
    categorie: string;
    prix: string;
    titre: string;
    lieu: string;
    description: string;
    caracteristiques: Caracteristiques;
    promoteur: string;
    dateDispo: string;
    vues: number;
    favori: boolean;
    address?: string;
    energyClass?: string;
    isPSLA?: boolean;
    images?: string[];
    city?: string;
    bedrooms?: number;
    bathrooms?: number;
    surface?: number;
    price?: number;
    rooms?: number;
}

const LogementsSHLMR = () => {
    const [activeTab, setActiveTab] = useState('logements');
    const [favoris, setFavoris] = useState<number[]>([]);
    const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logements, setLogements] = useState<Logement[]>([]);
    
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const mapPropertyTypeToCategory = (type) => {
      const typeMap = {
        house: "maison",
        apartment: "appartement",
        villa: "villa",
        studio: "appartement",
      };
      return typeMap[type] || "maison";
    };

    const fetchSHLMRProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/properties/shlmr");
            console.log("Réponse API SHLMR:", response.data);

            if (response.data.success) {
                const transformedProperties = response.data.data.map((property) => ({
                    id: property.id,
                    image: property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
                    type: property.listingType === "rent" ? "location" : "achat",
                    categorie: mapPropertyTypeToCategory(property.type),
                    prix: property.listingType === "rent" 
                        ? `${property.price?.toLocaleString("fr-FR")} €/mois`
                        : `${property.price?.toLocaleString("fr-FR")} €`,
                    titre: property.title,
                    lieu: `${property.city}${property.zipCode ? `, ${property.zipCode}` : ""}`,
                    description: property.description || "Logement SHLMR disponible",
                    caracteristiques: {
                        chambres: property.bedrooms || 0,
                        sdb: property.bathrooms || 0,
                        surface: `${property.surface || 0} m²`,
                        parking: 0,
                        annee: new Date().getFullYear(),
                        etage: 0,
                        balcon: true,
                        cave: false
                    },
                    promoteur: property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : "Propriétaire SHLMR",
                    dateDispo: new Date().toISOString().split('T')[0],
                    vues: property.views || 0,
                    favori: false,
                    energyClass: property.energyClass,
                    address: property.address,
                    isSHLMR: property.isSHLMR,
                    images: property.images || [],
                    city: property.city,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    surface: property.surface,
                    price: property.price,
                    rooms: property.rooms
                }));

                setLogements(transformedProperties);
            }
        } catch (err) {
            console.error("Error fetching SHLMR properties:", err);
            setError("Erreur lors du chargement des propriétés SHLMR");
        } finally {
            setLoading(false);
        }
    };

    const dispositifs = [
        {
            nom: "SHLMR",
            description: "Sociétés d'Habitation à Loyer Modéré de Réinsertion",
            loyerMax: "Loyers encadrés par l'État",
            public: "Ménages en réinsertion et situations spécifiques",
            financement: "État + Collectivités locales",
            icon: <Home className="w-6 h-6" />
        }
    ];

    const avantages = [
        {
            icon: <Euro className="w-8 h-8" />,
            titre: "Loyers encadrés",
            description: "Des loyers inférieurs de 20 à 50% au marché libre, spécifiques au SHLMR"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            titre: "Sécurité locative",
            description: "Contrats stables avec des garanties pour locataires et bailleurs"
        },
        {
            icon: <Target className="w-8 h-8" />,
            titre: "Public ciblé",
            description: "Accès réservé aux ménages éligibles selon des plafonds de ressources"
        },
        {
            icon: <Landmark className="w-8 h-8" />,
            titre: "Aides financières",
            description: "Éligibilité aux APL et autres aides au logement"
        }
    ];

    const conditionsEligibilite = [
        {
            critere: "Ressources mensuelles",
            details: "Plafonds variables selon composition familiale et zone géographique"
        },
        {
            critere: "Situation professionnelle",
            details: "CDI, CDD, fonctionnaire, indépendant, retraité, étudiant..."
        },
        {
            critere: "Résidence principale",
            details: "Destiné exclusivement à la résidence principale"
        },
        {
            critere: "Ancienneté dans la région",
            details: "Variable selon les dispositifs et collectivités"
        }
    ];

    const stats = [
        {
            valeur: "-40%",
            label: "Économie moyenne de loyer",
            description: "Par rapport au marché libre"
        },
        {
            valeur: "6-18 mois",
            label: "Durée moyenne d'attente",
            description: "Selon la zone géographique"
        },
        {
            valeur: "90%",
            label: "Taux de satisfaction",
            description: "Des locataires en logement SHLMR"
        },
        {
            valeur: "10K+",
            label: "Logements SHLMR",
            description: "Disponibles en France"
        }
    ];

    useEffect(() => {
        fetchSHLMRProperties();
    }, []);

    const toggleFavori = (id: number) => {
        setFavoris(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const handlePostuler = (logement: Logement) => {
        if (sentRequests?.[logement.id]) {
            toast({
                title: "Visite déjà demandée",
                description: "Vous avez déjà demandé une visite pour ce logement.",
            });
            return;
        }
        
        const propertyForModal = {
            id: String(logement.id),
            title: logement.titre,
            description: logement.description,
            address: logement.lieu,
            city: logement.city || logement.lieu,
            images: logement.images || [logement.image],
            price: logement.price || 0,
            surface: logement.surface || 0,
            bedrooms: logement.caracteristiques?.chambres || 0,
            bathrooms: logement.caracteristiques?.sdb || 0,
            type: logement.type,
            listingType: "rent",
            owner: {
                firstName: logement.promoteur?.split(' ')[0] || "Propriétaire",
                lastName: logement.promoteur?.split(' ')[1] || "SHLMR",
                email: "contact@shlmr.fr",
                phone: "01 23 45 67 89"
            }
        };
        
        setSelectedProperty(propertyForModal);
        setModalOpen(true);
    };

    const handleDemandeSuccess = (propertyId: string) => {
        setSentRequests(prev => ({ 
            ...prev, 
            [parseInt(propertyId)]: true 
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mt-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des logements SHLMR...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="text-white pb-8 pt-20">
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/e1/71/1e/e1711e4da6287dedb35a90a6523b4380.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-xl lg:text-4xl font-bold mb-6">Logements SHLMR</h1>
                        <p className="lg:text-md text-sm opacity-90 mb-8 max-w-2xl mx-auto">
                            Découvrez les logements SHLMR (Sociétés d'Habitation à Loyer Modéré de Réinsertion) 
                            pour un parcours résidentiel sécurisé avec des loyers encadrés
                        </p>
                        {error && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ {error}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Navigation par onglets */}
            <section className="py-8 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { id: 'logements', label: 'Logements', icon: <Home className="w-4 h-4" /> },
                            { id: 'avantages', label: 'Avantages', icon: <BadgeCheck className="w-4 h-4" /> },
                            { id: 'dispositifs', label: 'Dispositifs', icon: <FileText className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            {activeTab === 'avantages' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Les avantages du logement SHLMR
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {avantages.map((avantage, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg inline-flex mb-4">
                                        {avantage.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {avantage.titre}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {avantage.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Statistiques */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
                            <h3 className="text-3xl font-bold text-center mb-12">
                                Chiffres clés du logement SHLMR
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-4xl font-bold text-orange-300 mb-2">
                                            {stat.valeur}
                                        </div>
                                        <div className="text-lg font-semibold mb-2">
                                            {stat.label}
                                        </div>
                                        <div className="text-sm opacity-90">
                                            {stat.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Dispositifs */}
            {activeTab === 'dispositifs' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Le dispositif SHLMR
                        </h2>

                        <div className="max-w-2xl mx-auto mb-16">
                            {dispositifs.map((dispositif, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                            {dispositif.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {dispositif.nom}
                                            </h3>
                                            <p className="text-gray-600">{dispositif.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Loyer max:</span>
                                            <span>{dispositif.loyerMax}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Public:</span>
                                            <span>{dispositif.public}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Financement:</span>
                                            <span>{dispositif.financement}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Conditions d'éligibilité */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                                Conditions d'éligibilité principales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {conditionsEligibilite.map((condition, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="bg-blue-600 text-white p-2 rounded-full mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {condition.critere}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {condition.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Logements */}
            {activeTab === 'logements' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        {error && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 inline mr-2" />
                                <span className="text-yellow-800">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {logements.map((logement) => {
                                const isDejaPostule = sentRequests?.[logement.id];
                                
                                return (
                                    <div
                                        key={logement.id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        {/* Image avec badges */}
                                        <div className="relative">
                                            <img
                                                src={logement.image}
                                                alt={logement.titre}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Badges superposés */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
                                                    SHLMR
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-600 text-white">
                                                    {logement.categorie}
                                                </span>
                                            </div>

                                            {/* Badge prix */}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-gray-900 shadow-lg">
                                                    {logement.prix}
                                                </span>
                                            </div>

                                            {/* Badge classe énergie */}
                                            {logement.energyClass && (
                                                <div className="absolute bottom-4 left-4">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-semibold ${
                                                            logement.energyClass === "A"
                                                                ? "bg-green-500 text-white"
                                                                : logement.energyClass === "B"
                                                                ? "bg-lime-500 text-white"
                                                                : logement.energyClass === "C"
                                                                ? "bg-yellow-500 text-white"
                                                                : "bg-gray-500 text-white"
                                                        }`}
                                                    >
                                                        Classe {logement.energyClass}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Bouton favori */}
                                            <button
                                                onClick={() => toggleFavori(logement.id)}
                                                className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favoris.includes(logement.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                                                    }`}
                                            >
                                                <Heart className="w-4 h-4" fill={favoris.includes(logement.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        {/* Contenu de la carte */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                                {logement.titre}
                                            </h3>

                                            <div className="flex items-center text-gray-600 mb-3">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{logement.lieu}</span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {logement.description}
                                            </p>

                                            {/* Caractéristiques */}
                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Bed className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.chambres} chambre{logement.caracteristiques.chambres > 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Bath className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.sdb} salle{logement.caracteristiques.sdb > 1 ? 's' : ''} de bain
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Square className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.surface}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Car className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.parking} place{logement.caracteristiques.parking > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Informations supplémentaires */}
                                            <div className="flex justify-between items-center pt-4">
                                                <div className="text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Dispo: {new Date(logement.dateDispo).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Eye className="w-4 h-4" />
                                                    <span>{logement.vues} vues</span>
                                                </div>
                                            </div>

                                            {/* Boutons d'action */}
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handlePostuler(logement)}
                                                    disabled={isDejaPostule}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:bg-blue-400 flex items-center justify-center gap-2"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                    {isDejaPostule ? "Visite déjà demandée" : "Demander une visite"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message si aucun résultat */}
                        {logements.length === 0 && (
                            <div className="text-center py-12">
                                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Aucun logement SHLMR disponible
                                </h3>
                                <p className="text-gray-500">
                                    Aucun logement SHLMR ne correspond à vos critères pour le moment.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <ModalDemandeVisite
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                property={selectedProperty}
                onSuccess={handleDemandeSuccess}
                isAlreadySent={selectedProperty ? !!sentRequests?.[parseInt(selectedProperty.id)] : false}
            />
        </div>
    );
};

export default LogementsSHLMR;