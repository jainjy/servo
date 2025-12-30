import React, { useState } from 'react';
import { 
  Palette, 
  User,
  Store, 
  Camera, 
  Hammer, 
  Brush, 
  Search
} from 'lucide-react';

// Import des composants
import ArtisanatPage from './ArtEtCreation/ArtisanatPage';
import MarketplaceCreateurs from './ArtEtCreation/MarketplaceCreateurs';
import PeinturePage from './ArtEtCreation/PeinturePage';
import PhotographiePage from './ArtEtCreation/PhotographiePage';
import SculpturePage from './ArtEtCreation/SculpturePage';

// Import du modal existant
import ModalDemandeVisite from '@/components/ModalDemandeVisite';

const ArtEtCreation = () => {
  const [activeTab, setActiveTab] = useState('photographie');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemandeVisite, setShowDemandeVisite] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);

  const tabs = [
    { id: 'photographie', label: 'Photographie', icon: <Camera size={18} /> },
    { id: 'sculpture', label: 'Sculpture', icon: <Hammer size={18} /> },
    { id: 'peinture', label: 'Peinture', icon: <Palette size={18} /> },
    { id: 'artisanat', label: 'Artisanat', icon: <Brush size={18} /> },
    { id: 'marketplace', label: 'Marketplace', icon: <Store size={18} /> },
  ];

  const backgroundImages = {
    artisanat:
      'https://i.pinimg.com/1200x/d0/3f/70/d03f70718ec218e0432c26ff587e3bf8.jpg',
    marketplace:
      'https://i.pinimg.com/1200x/03/e2/e4/03e2e413bf4d666133600ff2eef90bb7.jpg',
    peinture:
      'https://i.pinimg.com/1200x/3d/08/6f/3d086f097c43d22c6b074b375aed88d2.jpg',
    photographie:
      'https://i.pinimg.com/1200x/c9/87/c4/c987c4c4f4be701a27f5cdf35c078cda.jpg',
    sculpture:
      'https://i.pinimg.com/736x/52/ba/77/52ba77a48638da2e6e4a9f0f32fb31b5.jpg',
  };

  const titles = {
    artisanat: {
      main: 'Art & Création',
      subtitle:
        'Des artisans passionnés, des créations uniques, un savoir-faire à préserver',
    },
    marketplace: {
      main: 'Marketplace Créateurs',
      subtitle:
        'Des pièces uniques, des histoires authentiques, des créateurs indépendants',
    },
    peinture: {
      main: "L'univers de la peinture",
      subtitle:
        "Des artistes contemporains aux techniques traditionnelles",
    },
    photographie: {
      main: 'Trouvez le photographe idéal',
      subtitle:
        'Des professionnels pour capturer vos moments précieux',
    },
    sculpture: {
      main: "L'art de la sculpture",
      subtitle:
        'Des œuvres uniques façonnées par des sculpteurs talentueux',
    },
  };

  const placeholders = {
    artisanat: 'Rechercher un artisan, une spécialité...',
    marketplace: 'Rechercher un créateur, un produit...',
    peinture: 'Rechercher un artiste, un style...',
    photographie: 'Rechercher un photographe...',
    sculpture: 'Rechercher un sculpteur...',
  };

  // Fonction pour ouvrir le modal de demande de visite
  const handleOpenDemandeVisite = (artwork: any) => {
    setSelectedArtwork(artwork);
    setShowDemandeVisite(true);
  };

  // Fonction appelée après succès de la demande
  const handleDemandeSuccess = (artworkId: string) => {
    console.log(`Demande envoyée pour l'œuvre ${artworkId}`);
    // Vous pouvez ajouter ici des actions supplémentaires
    // comme mettre à jour l'UI ou notifier l'utilisateur
  };

  // Fonction de suivi du contact (optionnel)
  const handlePropertyContact = (property: any) => {
    console.log('Contact tracké pour:', property);
    // Ici vous pouvez ajouter du tracking analytique
  };

  const getActiveComponent = () => {
    const commonProps = {
      searchQuery,
      onContactClick: handleOpenDemandeVisite // Utiliser le nouveau handler
    };

    switch (activeTab) {
      case 'photographie':
        return <PhotographiePage {...commonProps} />;
      case 'sculpture':
        return <SculpturePage {...commonProps} />;
      case 'peinture':
        return <PeinturePage {...commonProps} />;
      case 'artisanat':
        return <ArtisanatPage {...commonProps} />;
      case 'marketplace':
        return <MarketplaceCreateurs {...commonProps} />;
      default:
        return <PhotographiePage {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white mt-12">
      {/* HERO */}
      <div
        className="relative pt-20 pb-10 px-4"
        style={{
          backgroundImage: `url('${backgroundImages[activeTab]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '320px',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {titles[activeTab].main}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            {titles[activeTab].subtitle}
          </p>

          {/* SEARCH */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2"
                color="#8B4513"
                size={20}
              />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[activeTab]}
                className="w-full pl-10 pr-28 py-4 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D3D3D3' }}
              />
              <button
                className="absolute right-2 top-2 px-4 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: '#556B2F' }}
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ONGLET PILULE */}
      <div className="sticky top-0 z-20 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2 rounded-full
                    text-sm font-medium transition-all duration-300
                    whitespace-nowrap
                    ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                  style={{
                    backgroundColor: isActive ? '#556B2F' : 'transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {getActiveComponent()}
      </div>

      {/* MODAL DE DEMANDE DE VISITE */}
      {selectedArtwork && (
        <ModalDemandeVisite
          open={showDemandeVisite}
          onClose={() => {
            setShowDemandeVisite(false);
            setSelectedArtwork(null);
          }}
          property={selectedArtwork}
          onSuccess={handleDemandeSuccess}
          onPropertyContact={handlePropertyContact}
        />
      )}
    </div>
  );
};

export default ArtEtCreation;