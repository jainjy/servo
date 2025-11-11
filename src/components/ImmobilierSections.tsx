import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import AnnonceModal from './AnnonceModal';

const ImmobilierSections = () => {
    const location = useLocation();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sections = [
        {
            title: "Annonces & transactions",
            description: "Vente & location de biens",
            content: <div className="p-6">
                <div className="flex justify-between mb-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-semibold">Nos dernières annonces</h3>
                        <p className="text-gray-600">Découvrez notre sélection de biens premium</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Déposer une annonce
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Villa contemporaine",
                            price: "850 000 €",
                            location: "Bordeaux Centre",
                            surface: "220m²",
                            rooms: "6 pièces",
                            image: "https://i.pinimg.com/736x/41/d8/69/41d8699229ed3bd63cf723faa543fc95.jpg"
                        },
                        {
                            title: "Appartement haussmannien",
                            price: "595 000 €",
                            location: "Paris 16ème",
                            surface: "85m²",
                            rooms: "3 pièces",
                            image: "https://i.pinimg.com/736x/a1/91/eb/a191ebeb94928180470add7e2e1284e2.jpg"
                        },
                        {
                            title: "Maison de ville",
                            price: "420 000 €",
                            location: "Lyon 6ème",
                            surface: "140m²",
                            rooms: "5 pièces",
                            image: "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg"
                        }
                    ].map((item, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-48">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-sm">
                                    {item.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                                <p className="text-gray-600 text-sm mb-3">{item.location}</p>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        {item.surface}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        {item.rooms}
                                    </span>
                                </div>
                                <button className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Voir le bien
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        },
        {
            title: "Audit patrimonial & finance",
            description: "Gestion locative & syndic",
            content: <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold">Optimisez votre patrimoine</h3>
                        <p className="text-gray-600">
                            Notre équipe d'experts vous accompagne dans l'analyse et l'optimisation de votre patrimoine immobilier.
                        </p>
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
                        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors mt-4">
                            Demander un audit
                        </button>
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
                    </div>
                </div>
            </div>
        }
    ];

    const handleAddAnnonce = (newAnnonce) => {
        // Ici vous pouvez ajouter la logique pour sauvegarder l'annonce
        console.log("Nouvelle annonce ajoutée:", newAnnonce);
        // Ajouter à votre état ou envoyer à une API
    };

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

            <div className='absolute inset-0 -z-20 overflow-hidden h-80 w-full'>
                <div className='bg-black/50 absolute w-full h-full backdrop-blur-sm '></div>
                <img
                    className='h-full w-full object-cover'
                    src="https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg" alt="" />
            </div>
            <h1 className="text-5xl text-white font-bold mb-10 text-center">Bâtiments & Construction</h1>

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