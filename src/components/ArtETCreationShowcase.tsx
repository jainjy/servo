import React, { useState, useEffect } from 'react';
import { Palette, Camera, Hammer, Brush, ShoppingBag, ArrowRight, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/authService';

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
      description: 'L’art du fait main, élégant et durable.',
      icon: <Brush size={22} />,
      gradient: 'from-rose-100 via-pink-50 to-red-100',
      category: 'artisanat',
      link: 'artisanat'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Explorez un univers d’objets uniques et authentiques.',
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

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-3 tracking-tight">
          Art & Création
        </h2>
        <p className="text-gray-500 text-sm">
          Découvrez nos univers créatifs et rencontrez les artistes de demain.
        </p>
        <div className="flex justify-center mt-6 gap-3">
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

      <div className="grid md:grid-cols-3 gap-6 px-4">
        {displayedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.link)}
            className={`relative overflow-hidden rounded-xl p-6 cursor-pointer shadow-md transition-transform transform hover:scale-[1.01] hover:shadow-xl bg-gradient-to-tr ${card.gradient}`}
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_#00000020,_transparent_70%)]"></div>
            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-white/80 backdrop-blur-sm rounded-md text-gray-700">
                {card.icon}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-snug">{card.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium mt-4 text-[#556B2F] group">
              Explorer
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
