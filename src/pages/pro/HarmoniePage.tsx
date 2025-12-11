import { ServiceModalPro } from '@/components/pro/ServiceModalPro';
import { ServicesCard } from '@/components/pro/ServicesCard';
import { Leaf, List } from 'lucide-react';
import { useState } from 'react';

// Nouvelle palette de couleurs
const COLORS = {
  LOGO: "#556B2F",           /* Olive green - accent */
  PRIMARY_DARK: "#6B8E23",   /* Yellow-green - primary */
  LIGHT_BG: "#FFFFFF",       /* White - fond clair */
  SEPARATOR: "#D3D3D3",      /* Light gray - séparateurs */
  SECONDARY_TEXT: "#8B4513", /* Saddle brown - textes secondaires */
  TEXT_BLACK: "#000000",     /* Black - petits textes */
};

const HarmonieApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0);
    
    const handleServiceUpdated = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        handleServiceUpdated();
    };

    return (
        <div className="min-h-screen p-0" style={{ backgroundColor: COLORS.LIGHT_BG }}>
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3" 
                        style={{ color: COLORS.PRIMARY_DARK }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                             style={{ backgroundColor: COLORS.LOGO }}>
                            <Leaf className="w-7 h-7" />
                        </div>
                        <span>Harmonie</span>
                    </h1>
                    <p className="text-sm lg:text-lg" style={{ color: COLORS.TEXT_BLACK }}>
                        Votre espace bien-être personnalisé - Cours, massages, thérapies, inspiration etc.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {/*stats.map((stat, i) => <StatCard key={i} stat={stat} />)*/}
                </div>

                {/* Courses */}
                <div className="rounded-xl p-7 mb-8 shadow-sm"
                     style={{ 
                       backgroundColor: COLORS.LIGHT_BG,
                       borderColor: COLORS.SEPARATOR,
                       borderWidth: '1px'
                     }}>

                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2"
                         style={{ borderColor: `${COLORS.SEPARATOR}50` }}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                                 style={{ backgroundColor: COLORS.PRIMARY_DARK }}>
                                <List className="w-5 h-5" />
                            </div>
                            <h2 className="text-md lg:text-2xl font-semibold" 
                                style={{ color: COLORS.PRIMARY_DARK }}>
                                Liste des services
                            </h2>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="rounded-lg py-2 px-5 text-sm font-semibold transition-colors flex items-center gap-1"
                            style={{ 
                              backgroundColor: COLORS.PRIMARY_DARK,
                              color: COLORS.LIGHT_BG 
                            }}
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