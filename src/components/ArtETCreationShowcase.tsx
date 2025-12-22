import React, { useState, useEffect } from 'react';
import { Palette, Camera, Hammer, Brush, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArtCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  category: string;
  link: string;
}

const colors = {
  logo: "#556B2F",
  "primary-dark": "#6B8E23",
  "light-bg": "#FFFFFF",
  separator: "#D3D3D3",
  "secondary-text": "#8B4513",
  "neutral-dark": "#2F4F4F",
};

const ArtETCreationShowcase = () => {
  const navigate = useNavigate();
  const [displayedCards, setDisplayedCards] = useState<ArtCard[]>([]);

  const allCards: ArtCard[] = [
    {
      id: 'photographie',
      title: 'Photographie',
      description: 'Trouvez des photographes professionnels pour capturer vos moments précieux',
      icon: <Camera size={20} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      category: 'photographie',
      link: 'photographie'
    },
    {
      id: 'sculpture',
      title: 'Sculpture',
      description: 'Découvrez des œuvres uniques façonnées par des sculpteurs talentueux',
      icon: <Hammer size={20} />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      category: 'sculpture',
      link: 'sculpture'
    },
    {
      id: 'peinture',
      title: 'Peinture',
      description: "Explorez l'univers des artistes contemporains et techniques traditionnelles",
      icon: <Palette size={20} />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      category: 'peinture',
      link: 'peinture'
    },
    {
      id: 'artisanat',
      title: 'Artisanat',
      description: 'Des artisans passionnés et créations uniques avec un savoir-faire à préserver',
      icon: <Brush size={20} />,
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      category: 'artisanat',
      link: 'artisanat'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Pièces uniques, histoires authentiques et créateurs indépendants',
      icon: <ShoppingBag size={20} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
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

  const handleRefresh = () => {
    setDisplayedCards(getRandomCards());
  };

  const handleCardClick = (link: string) => {
    navigate('/art-et-creation', { state: { activeTab: link } });
  };

  return (
    <div className="py-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête compact */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: colors["neutral-dark"] }}
          >
            Art & Création
          </h2>
          <p
            className="text-sm mb-6"
            style={{ color: colors["secondary-text"] }}
          >
            Découvrez nos catégories d'art et création
          </p>

          {/* Boutons côte à côte */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 p-4 text-sm rounded-lg font-semibold transition-all duration-300 hover:shadow-md"
              style={{
                backgroundColor: colors["primary-dark"],
                color: 'white'
              }}
            >
              <RefreshCw size={14} />
              Autres catégories
            </button>
            
            <Button
              className="px-4 flex items-center gap-2 py-2 text-sm rounded-lg transition-all duration-300 hover:shadow-md"
              onClick={() => navigate('/art-et-creation')}
              style={{ backgroundColor: colors["logo"] }}
            >
              <span className="font-semibold">
                Toutes les catégories
              </span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* Grille de cartes compacte */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {displayedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.link)}
              className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
            >
              {/* En-tête carte */}
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="p-2 rounded-md flex-shrink-0"
                  style={{ backgroundColor: colors["primary-dark"] + "20" }}
                >
                  <div style={{ color: colors["primary-dark"] }}>
                    {card.icon}
                  </div>
                </div>
                
                <div>
                  <h3
                    className="font-bold text-base mb-1"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-xs text-gray-600 leading-snug"
                  >
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Lien */}
              <div
                className="flex items-center gap-1 text-sm font-semibold mt-2 group"
                style={{ color: colors["primary-dark"] }}
              >
                <span>Explorer</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtETCreationShowcase;