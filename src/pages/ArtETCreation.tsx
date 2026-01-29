import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  User,
  Store, 
  Camera, 
  Hammer, 
  Brush, 
  Search,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Import des composants
import ArtisanatPage from './ArtEtCreation/ArtisanatPage';
import MarketplaceCreateurs from './ArtEtCreation/MarketplaceCreateurs';
import PeinturePage from './ArtEtCreation/PeinturePage';
import PhotographiePage from './ArtEtCreation/PhotographiePage';
import SculpturePage from './ArtEtCreation/SculpturePage';

// Import du modal existant
import ModalDemandeVisite from '@/components/ModalDemandeVisite';
import Allpub from '@/components/Allpub';
import AdvertisementPopup from '@/components/AdvertisementPopup';

const ArtEtCreation = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDemandeVisite, setShowDemandeVisite] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Afficher le modal automatiquement si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

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
    //console.log(`Demande envoyée pour l'œuvre ${artworkId}`);
    
  };

  // Fonction de suivi du contact (optionnel)
  const handlePropertyContact = (property: any) => {
    //console.log('Contact tracké pour:', property);
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
        return <MarketplaceCreateurs {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <div
        className="relative pt-20 px-4"
        style={{
          backgroundImage: `url('${backgroundImages[activeTab]}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '250px',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-medium uppercase text-white mb-4">
            {titles[activeTab].main}
          </h1>
          <p className="text-sm text-white/90 max-w-3xl mx-auto mb-8">
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

      <AdvertisementPopup position="page-explorer-art" showOnMobile={true}/>

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

      {/* MODAL D'AUTHENTIFICATION */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-fade-in-up">
            {/* Icon decorative */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <div className="mb-8 pt-4">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-2 tracking-tight">
                Connexion requise
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#556B2F] to-[#6B8E23] mx-auto rounded-full"></div>
            </div>
            
            <div className="mb-10">
              <p className="text-gray-600 text-base text-center leading-relaxed px-4">
                Connectez-vous pour explorer nos créateurs et services d'art et de création.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  navigate('/');
                  setShowAuthModal(false);
                }}
                className="flex-1 px-6 py-4 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                annuler
              </button>
              <button
                onClick={() => {
                  navigate('/login');
                  setShowAuthModal(false);
                }}
                className="flex-1 px-6 py-4 text-sm font-semibold text-white bg-gradient-to-r from-[#556B2F] to-[#6B8E23] rounded-xl hover:from-[#6B8E23] hover:to-[#7aa028] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl transform"
              >
                Continuer
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 -inset-0.5 bg-gradient-to-r from-[#556B2F]/20 to-[#6B8E23]/20 rounded-2xl blur opacity-30"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtEtCreation;