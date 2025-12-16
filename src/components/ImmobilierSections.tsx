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
    role?: string;
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
                // Filtrer pour afficher uniquement les annonces des professionnels
                const professionalAnnonces = response.data.data.filter(
                    (annonce: Annonce) => annonce.owner?.role === 'professional'
                );
                setAnnonces(professionalAnnonces);

                // Si aucune annonce de pro n'est trouvée, afficher un message
                if (professionalAnnonces.length === 0 && response.data.data.length > 0) {
                    setError('Aucune annonce de professionnels disponible pour le moment');
                }
            } else {
                setError('Erreur lors du chargement des annonces');
            }
        } catch (err) {
            console.error('Erreur récupération annonces:', err);
            setError('Vous devez vous connecter pour voir les annonces.');
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
        // console.log("Nouvelle annonce ajoutée:", newAnnonce);
        fetchAnnonces();
    };

    const handleAddAudit = (newAudit: any) => {
        // console.log("Nouvel audit ajouté:", newAudit);
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
            title: "",
            description: "Notre expertise transforme votre patrimoine en opportunités d'avenir",
            content: (
                <div className="p-6">
                    {/* Section en-tête avec bouton aligné à droite */}
                    <div className="flex justify-between flex-col md:flex-row mb-8">
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
            <div className='flex flex-col gap-4 items-center mb-10'>
                <h1 className="text-xl lg:text-5xl text-white font-bold  text-center">Audit patrimonial et finance</h1>
                <span className='lg:text-md text-sm text-gray-300'>Notre expertise transforme votre patrimoine en opportunités d'avenir</span>
            </div>
            <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                <Tab.List className="flex flex-wrap gap-2 mb-4">
                    {sections.map((section) => (
                        <Tab
                            key={section.title}
                            className={({ selected }) =>
                                `${selected
                                    ? ''
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