import { ServiceModalPro } from '@/components/pro/ServiceModalPro';
import { ServicesCard } from '@/components/pro/ServicesCard';
import { Leaf, List } from 'lucide-react';
import { useState } from 'react';

const HarmonieApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0);
    
    const handleServiceUpdated = () => {
        setRefreshKey((prev) => prev + 1); // Force le rechargement des composants
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        handleServiceUpdated(); // Actualise les données après fermeture
    };

    return (
        <div className="min-h-screen p-0">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                            <Leaf className="w-7 h-7" />
                        </div>
                        <span>Harmonie</span>
                    </h1>
                    <p className="text-gray-600 text-sm lg:text-lg">Votre espace bien-être personnalisé - Cours, massages, thérapies, inspiration etc .</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/*stats.map((stat, i) => <StatCard key={i} stat={stat} />)*/}
                </div>

                {/* Courses */}
                <div className="bg-white rounded-xl p-7 mb-8 border border-gray-100 shadow-sm">

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                                <List className="w-5 h-5" />
                            </div>
                            <h2 className="text-md lg:text-2xl font-semibold text-gray-800">Liste des services</h2>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-100 bg-blue-700 rounded-lg py-2 px-5 text-sm font-semibold hover:text-blue-100 transition-colors flex items-center gap-1"
                        >
                            Ajouter
                            <span>+</span>
                        </button>
                    </div>

                    {/* Passez la refreshKey et la fonction de callback */}
                    <ServicesCard 
                        key={refreshKey} 
                        onServiceUpdated={handleServiceUpdated}
                    />

                </div>

            </div>

            {/* Modal de création de service */}
            <ServiceModalPro
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                mode="create"
                onServiceUpdated={handleServiceUpdated}
            />
        </div>
    );
};

export default HarmonieApp;