import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import AnnonceModal from './AnnonceModal';
import AnnonceInfo from './AnnonceInfo';
import { annonceAPI } from '../lib/api';
import DemandeAudit from './DemandeAudit';

// Interface pour le type Annonce
interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Annonce {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  zipCode: string;
  features: string[];
  images: string[];
  listingType: string;
  rentType: string;
  createdAt: string;
  owner: Owner;
}

const ImmobilierSections = () => {
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Fonction pour formater le prix
    const formatPrice = (price: number) => {
        if (!price) return 'Prix sur demande';
        return new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0 
        }).format(price);
    };

    // Fonction pour formater la surface
    const formatSurface = (surface: number) => {
        if (!surface) return 'Surface non précisée';
        return `${surface}m²`;
    };

    // Charger les annonces depuis l'API
    const fetchAnnonces = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await annonceAPI.getAnnonces();
            if (response.data.success) {
                setAnnonces(response.data.data);
            } else {
                setError('Erreur lors du chargement des annonces');
            }
        } catch (err) {
            console.error('Erreur récupération annonces:', err);
            setError('Impossible de charger les annonces');
        } finally {
            setLoading(false);
        }
    };

    // Charger les annonces au montage du composant
    useEffect(() => {
        fetchAnnonces();
    }, []);

    // Mettre à jour les annonces après ajout
    const handleAddAnnonce = (newAnnonce: Annonce) => {
        console.log("Nouvelle annonce ajoutée:", newAnnonce);
        fetchAnnonces();
    };
    
    const handleAddAudit = (newAudit: any) => {
        console.log("Nouvel audit ajouté:", newAudit);
        // Afficher un message de confirmation
        alert('Votre demande d\'audit a été soumise avec succès ! Notre équipe vous contactera sous 48h.');
    };

    const handleViewAnnonce = (annonce: Annonce) => {
        setSelectedAnnonce(annonce);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsViewModalOpen(false);
        setSelectedAnnonce(null);
    };

    const sections = [
        {
            title: "Annonces & transactions",
            description: "Vente & location de biens",
            content: (
                <div className="p-6">
                    <div className="flex justify-between mb-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold">Nos dernières annonces</h3>
                            <p className="text-gray-600">Découvrez notre sélection de biens premium</p>
                        </div>
                        {/* <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Déposer une annonce
                        </button> */}
                    </div>

                    {/* État de chargement */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                            <p className="text-gray-600 mt-4">Chargement des annonces...</p>
                        </div>
                    )}

                    {/* Message d'erreur */}
                    {error && !loading && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                            <button 
                                onClick={fetchAnnonces}
                                className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                                Réessayer
                            </button>
                        </div>
                    )}

                    {/* Aucune annonce */}
                    {!loading && !error && annonces.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-gray-600 text-lg mb-2">Aucune annonce disponible pour le moment</p>
                            <p className="text-gray-500 text-sm mb-4">Soyez le premier à déposer une annonce !</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Déposer la première annonce
                            </button>
                        </div>
                    )}

                    {/* Grille des annonces */}
                    {!loading && !error && annonces.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {annonces.map((annonce) => {
                                const typeLabel = annonce.listingType === "rent" 
                                    ? "Location" 
                                    : annonce.listingType === "sale" 
                                    ? "Vente" 
                                    : "Annonce";
                                
                                const typeColor = annonce.listingType === "rent" 
                                    ? "bg-blue-600" 
                                    : "bg-green-600";
                                
                                const mainImage = annonce.images && annonce.images.length > 0 
                                    ? annonce.images[0] 
                                    : "https://i.pinimg.com/736x/41/d8/69/41d8699229ed3bd63cf723faa543fc95.jpg";
                                
                                return (
                                    <div key={annonce.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        <div className="relative h-48">
                                            {/* Image principale */}
                                            <img
                                                src={mainImage}
                                                alt={annonce.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Prix */}
                                            <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                {formatPrice(annonce.price)}
                                            </div>

                                            {/* Type */}
                                            <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs ${typeColor} text-white font-medium`}>
                                                {typeLabel}
                                            </div>

                                            {/* +Photos */}
                                            {annonce.images && annonce.images.length > 1 && (
                                                <div className="absolute bottom-2 right-2 bg-white/90 text-gray-800 px-2 py-1 rounded text-xs">
                                                    +{annonce.images.length - 1} photos
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                                                {annonce.title}
                                            </h4>

                                            <div className="flex items-center text-gray-600 text-sm mb-3">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                {annonce.city}
                                            </div>

                                            <div className="flex justify-between text-sm text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                                        />
                                                    </svg>
                                                    {formatSurface(annonce.surface)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                        />
                                                    </svg>
                                                    {annonce.rooms
                                                        ? `${annonce.rooms} pièces`
                                                        : "Pièces non précisées"}
                                                </span>
                                            </div>

                                            {annonce.description && (
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {annonce.description}
                                                </p>
                                            )}

                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleViewAnnonce(annonce)}
                                                    className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                        />
                                                    </svg>
                                                    Voir l'annonce
                                                </button>                                              
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}  
                </div>
            )
        },
       {
            title: "Audit patrimonial & finance",
            description: "Gestion locative & syndic",
            content: (
                <div className="p-6">
                    {/* Section en-tête avec bouton aligné à droite */}
                    <div className="flex justify-between mb-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold">Optimisez votre patrimoine</h3>
                            <p className="text-gray-600">
                                Notre équipe d'experts vous accompagne dans l'analyse et l'optimisation de votre patrimoine immobilier.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsAuditModalOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Demander un audit
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <ul className="space-y-2">
                                {[
                                    "Analyse complète de votre patrimoine",
                                    "Stratégie d'investissement personnalisée",
                                    "Optimisation fiscale",
                                    "Gestion locative professionnelle",
                                    "Suivi des performances"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h4 className="font-semibold mb-4">Nos services de gestion</h4>
                                {[
                                    { name: "Gestion locative", price: "À partir de 4,9% TTC" },
                                    { name: "Syndic de copropriété", price: "Sur devis" },
                                    { name: "Assurance loyers impayés", price: "2,5% des loyers" },
                                    { name: "Garantie des risques locatifs", price: "3% des loyers" }
                                ].map((service, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                        <span>{service.name}</span>
                                        <span className="text-green-600 font-medium">{service.price}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Section informations complémentaires */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Pourquoi un audit ?</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Identifier les opportunités d'optimisation</li>
                                    <li>• Anticiper les risques fiscaux</li>
                                    <li>• Maximiser votre rendement</li>
                                    <li>• Planifier votre succession</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        if (location.hash) {
            const hash = location.hash.replace('#', '');
            const index = sections.findIndex(
                section => section.title.toLowerCase().replace(/ & | /g, '-').replace(/[()]/g, '') === hash
            );
            if (index !== -1) {
                setSelectedIndex(index);
            }
        }
    }, [location]);

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            {/* Modal d'ajout d'annonce */}
            <AnnonceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddAnnonce={handleAddAnnonce}
            />

            {/* Modal d'affichage d'annonce */}
            <AnnonceInfo 
                isOpen={isViewModalOpen}
                onClose={handleCloseModal}
                annonce={selectedAnnonce}
            />
            <DemandeAudit 
                isOpen={isAuditModalOpen}
                onClose={() => setIsAuditModalOpen(false)}
                onAddAudit={handleAddAudit}
            />

            <div className='absolute inset-0 -z-20 overflow-hidden h-80 w-full'>
                <div className='bg-black/50 absolute w-full h-full backdrop-blur-sm '></div>
                <img
                    className='h-full w-full object-cover'
                    src="https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg" 
                    alt="Bannière immobilier" 
                />
            </div>
            
            <h1 className="text-5xl text-white font-bold mb-10 text-center">Annonces & Transaction</h1>

            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex flex-wrap gap-2 mb-4">
                    {sections.map((section) => (
                        <Tab
                            key={section.title}
                            className={({ selected }) =>
                                `${selected
                                    ? 'bg-black text-white'
                                    : 'bg-white text-black hover:bg-gray-100'
                                } px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-sm`
                            }
                        >
                            {section.title}
                        </Tab>
                    ))}
                </Tab.List>

                <Tab.Panels>
                    {sections.map((section) => (
                        <Tab.Panel
                            key={section.title}
                            id={section.title.toLowerCase().replace(/ & | /g, '-').replace(/[()]/g, '')}
                            className="bg-white rounded-lg shadow-lg"
                        >
                            {section.content}
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default ImmobilierSections;