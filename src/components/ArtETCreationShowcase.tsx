import React, { useState, useEffect } from 'react';
import { Palette, Camera, Hammer, Brush, ShoppingBag, ArrowRight, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';
import { motion } from 'framer-motion';
import AdvertisementPopup from '@/components/AdvertisementPopup';

interface ArtCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  category: string;
  link: string;
}

const ArtETCreationShowcase = () => {
  const navigate = useNavigate();
  const [displayedCards, setDisplayedCards] = useState<ArtCard[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // État pour la publicité
  const [isAdVisible, setIsAdVisible] = useState(true);
  const [adTimeRemaining, setAdTimeRemaining] = useState(120); // 2 minutes en secondes
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Timer pour la publicité
  useEffect(() => {
    if (!isAdVisible || isMobile) return;

    const timer = setInterval(() => {
      setAdTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAdVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdVisible, isMobile]);

  // Formater le temps en minutes:secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const allCards: ArtCard[] = [
    {
      id: 'photographie',
      title: 'Photographie',
      description: 'Des photographes talentueux pour sublimer vos souvenirs.',
      icon: <Camera size={22} />,
      gradient: 'from-cyan-100 via-blue-100 to-indigo-100',
      category: 'photographie',
      link: 'photographie'
    },
    {
      id: 'sculpture',
      title: 'Sculpture',
      description: 'Des formes et des textures au service de la créativité.',
      icon: <Hammer size={22} />,
      gradient: 'from-amber-100 via-orange-50 to-yellow-100',
      category: 'sculpture',
      link: 'sculpture'
    },
    {
      id: 'peinture',
      title: 'Peinture',
      description: 'Couleurs, émotions et styles pour tous les goûts.',
      icon: <Palette size={22} />,
      gradient: 'from-fuchsia-100 via-pink-100 to-rose-100',
      category: 'peinture',
      link: 'peinture'
    },
    {
      id: 'artisanat',
      title: 'Artisanat',
      description: 'L\'art du fait main, élégant et durable.',
      icon: <Brush size={22} />,
      gradient: 'from-rose-100 via-pink-50 to-red-100',
      category: 'artisanat',
      link: 'artisanat'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Explorez un univers d\'objets uniques et authentiques.',
      icon: <ShoppingBag size={22} />,
      gradient: 'from-emerald-100 via-green-50 to-lime-100',
      category: 'marketplace',
      link: 'marketplace'
    }
  ];

  const getRandomCards = () => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setDisplayedCards(getRandomCards());
  }, []);

  const handleRefresh = () => setDisplayedCards(getRandomCards());

  const handleCardClick = (link: string) => {
    if (!AuthService.isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    navigate('/art-et-creation', { state: { activeTab: link } });
  };

  // Fonction pour ouvrir le lien de la pub
  const handleAdClick = () => {
    if (AuthService.isAuthenticated()) {
      navigate('/art-et-creation');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 relative">
      {/* Publicité - seulement sur desktop */}
      {false && (
        <motion.article
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="
            relative w-full max-w-2xl mx-auto mb-8
            rounded-xl border border-white/20
            bg-gradient-to-br from-white/12 to-white/6
            backdrop-blur-lg shadow-lg overflow-hidden
          "
        >
          {/* Header */}
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-white/25 text-black font-semibold backdrop-blur-sm">
              Pub
            </span>

            <div className="flex items-center bg-black/35 px-2.5 py-1 rounded-full text-white backdrop-blur-sm">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(adTimeRemaining)}
            </div>

            <button
              onClick={() => setIsAdVisible(false)}
              className="p-1.5 rounded-full bg-black/35 hover:bg-black/50 text-white/75 hover:text-white transition-colors"
              aria-label="Fermer la publicité"
            >
              ✕
            </button>
          </div>

          {/* Contenu */}
          <div className="flex p-4 gap-4">
            {/* Image */}
            <div className="w-36 h-28 rounded-lg overflow-hidden border border-black/20 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=500&q=80"
                alt="Œuvres d'art exclusives"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texte */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-black mb-1.5">
                Découvrez des artistes exclusifs
              </h2>

              <p className="text-sm text-black/80 leading-relaxed mb-3">
                Accédez à des œuvres uniques et rencontrez des créateurs talentueux.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <div className="flex items-center text-xs text-black/65">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Visible : <span className="font-medium text-black">2 minutes</span></span>
                </div>


              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* Publicité section Travevaux */}
      <AdvertisementPopup position="section-accueil-art-creation" size="medium" showOnMobile={true}/>

      <div className="max-w-7xl mx-auto text-center mb-4 flex lg:flex-row flex-col items-center justify-between">
        <h2 className="text-3xl font-serif lg:text-5xl font-medium text-gray-800 mb-3 tracking-tight">
          Art & Création
        </h2>
        {/* <p className="text-gray-500 text-sm">
          Découvrez nos univers créatifs et rencontrez les artistes de demain.
        </p> */}
        <div className="flex lg:flex-row flex-col justify-center mt-6 gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 flex items-center gap-2 text-sm font-medium text-logo bg-olive-600 border border-logo rounded-lg hover:bg-olive-700 transition-all"
          >
            <RefreshCw size={16} />
            Autres catégories
          </button>
          <Button
            className="px-4 py-2 flex items-center gap-2 text-sm rounded-lg bg-[#556B2F] text-white hover:bg-[#6B8E23] transition-all"
            onClick={() => navigate('/art-et-creation')}
          >
            Toutes les catégories
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 px-4">
        {displayedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.link)}
            className={`relative overflow-hidden rounded-2xl cursor-pointer shadow-lg transition-all duration-300 hover:shadow-2xl bg-white min-h-[420px] h-full`}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_#00000020,_transparent_70%)]"></div>
            <div className="relative flex flex-col h-full">
              {/* En-tête avec titre et icône AGRANDIE */}
              <div className="flex items-start gap-5 p-8 pb-6">
                <div className="p-5 bg-white/90 backdrop-blur-sm rounded-2xl text-gray-800 shadow-xl flex-shrink-0 transform group-hover:rotate-6 transition-transform duration-500">
                  {/* Icône agrandie avec animation */}
                  <div className="w-14 h-14 flex items-center justify-center">
                    {React.cloneElement(card.icon as React.ReactElement, {
                      size: 32,
                      strokeWidth: 1.5
                    })}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl font-serif text-gray-900 leading-tight">{card.title}</h3>
                </div>
              </div>

              {/* Contenu principal avec effet verre */}
              <div className="flex-1 flex flex-col px-8 pb-8">
                <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-white/50 flex-1 flex flex-col h-full">
                  <div className="flex-1 ">
                    <p className="text-gray-800 text-lg leading-relaxed h-full">
                      {card.description}
                    </p>
                  </div>

                 
                  {/* Bouton d'exploration */}
                  <div className="flex bg-white shadow-lg p-2 lg:p-4 rounded-full justify-center items-center gap-3 text-sm lg:text-base font-semibold text-[#556B2F] group">
                    <span className="group-hover:translate-x-1 text-center transition-transform duration-300">
                      Explorer cette catégorie
                    </span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>

              {/* Effet de bordure au hover */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de connexion */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Connexion requise</h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Veuillez vous connecter pour explorer les catégories d'art et de création.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
              >
                Fermer
              </button>
              <Button
                className="flex-1 px-4 py-2 text-sm rounded-lg bg-[#556B2F] text-white hover:bg-[#6B8E23] transition-all"
                onClick={() => {
                  navigate('/login');
                  setShowAuthModal(false);
                }}
              >
                Se connecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArtETCreationShowcase;