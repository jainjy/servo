import React, { useState, useEffect } from 'react';
import { Apple, Heart, Users, Leaf, Sprout, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BienEtreCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  category: string;
  link: string;
}

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  cards: BienEtreCard[];
}

const colors = {
  logo: "#556B2F",
  "primary-dark": "#6B8E23",
  "light-bg": "#FFFFFF",
  separator: "#D3D3D3",
  "secondary-text": "#8B4513",
  "neutral-dark": "#2F4F4F",
};

const BienEtreShowcase = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Nutrition');
  const [displayedCards, setDisplayedCards] = useState<BienEtreCard[]>([]);

  const tabsData: TabData[] = [
    {
      id: 'Nutrition',
      label: 'Nutrition',
      icon: <Apple size={14} />,
      cards: [
        {
          id: 'nutrition-1',
          title: 'Consultation Nutrition',
          description: 'Bilan complet et plan nutritionnel personnalisé.',
          icon: <Apple size={16} />,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          category: 'nutrition',
          link: 'Nutrition'
        },
        {
          id: 'nutrition-2',
          title: 'Suivi Mensuel',
          description: 'Séances de suivi et ajustement de programme.',
          icon: <Heart size={16} />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          category: 'nutrition',
          link: 'Nutrition'
        },
        {
          id: 'nutrition-3',
          title: 'Perte de Poids',
          description: 'Accompagnement complet sur 3 mois.',
          icon: <Leaf size={16} />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          category: 'nutrition',
          link: 'Nutrition'
        }
      ]
    },
    {
      id: 'Soin',
      label: 'Soins',
      icon: <Heart size={14} />,
      cards: [
        {
          id: 'soin-1',
          title: 'Soin du Visage',
          description: 'Soin facial complet avec produits naturels.',
          icon: <Heart size={16} />,
          bgColor: 'bg-pink-50',
          borderColor: 'border-pink-200',
          category: 'soin',
          link: 'Soin'
        },
        {
          id: 'soin-2',
          title: 'Massage Thérapeutique',
          description: 'Massage relaxant pour soulager les tensions.',
          icon: <Heart size={16} />,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          category: 'soin',
          link: 'Soin'
        },
        {
          id: 'soin-3',
          title: 'Soins Corporels',
          description: 'Traitements corps complets et hydratants.',
          icon: <Leaf size={16} />,
          bgColor: 'bg-teal-50',
          borderColor: 'border-teal-200',
          category: 'soin',
          link: 'Soin'
        }
      ]
    },
    {
      id: 'Therapeute',
      label: 'Thérapeutes',
      icon: <Users size={14} />,
      cards: [
        {
          id: 'therapie-1',
          title: 'Psychothérapie',
          description: 'Consultations avec thérapeutes expérimentés.',
          icon: <Users size={16} />,
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          category: 'therapeute',
          link: 'Therapeute'
        },
        {
          id: 'therapie-2',
          title: 'Coaching Personnel',
          description: 'Accompagnement pour objectifs de vie.',
          icon: <Heart size={16} />,
          bgColor: 'bg-violet-50',
          borderColor: 'border-violet-200',
          category: 'therapeute',
          link: 'Therapeute'
        },
        {
          id: 'therapie-3',
          title: 'Gestion du Stress',
          description: 'Techniques pour stress et anxiété.',
          icon: <Leaf size={16} />,
          bgColor: 'bg-lime-50',
          borderColor: 'border-lime-200',
          category: 'therapeute',
          link: 'Therapeute'
        }
      ]
    },
    {
      id: 'HuilesEssentielles',
      label: 'Huiles',
      icon: <Sprout size={14} />,
      cards: [
        {
          id: 'huile-1',
          title: 'Aromathérapie',
          description: 'Séances pour détente et bien-être émotionnel.',
          icon: <Sprout size={16} />,
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          category: 'huile',
          link: 'HuilesEssentielles'
        },
        {
          id: 'huile-2',
          title: 'Consultation',
          description: 'Conseil personnalisé en huiles essentielles.',
          icon: <Leaf size={16} />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          category: 'huile',
          link: 'HuilesEssentielles'
        }
      ]
    },
    {
      id: 'MedecinesNaturelles',
      label: 'Naturelles',
      icon: <Leaf size={14} />,
      cards: [
        {
          id: 'medecine-1',
          title: 'Phytothérapie',
          description: 'Traitement par les plantes pour la santé.',
          icon: <Leaf size={16} />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          category: 'medecine',
          link: 'MedecinesNaturelles'
        },
        {
          id: 'medecine-2',
          title: 'Acupuncture',
          description: 'Pratique pour équilibrer votre énergie.',
          icon: <Heart size={16} />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          category: 'medecine',
          link: 'MedecinesNaturelles'
        }
      ]
    }
  ];

  useEffect(() => {
    const currentTab = tabsData.find(tab => tab.id === activeTab);
    if (currentTab) {
      setDisplayedCards(currentTab.cards);
    }
  }, [activeTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleCardClick = (link: string) => {
    navigate('/bien-etre', { state: { activeTab: link } });
  };

  return (
    <div className="py-8 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête compact */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: colors["neutral-dark"] }}
          >
            Santé & Bien-Être
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: colors["secondary-text"] }}
          >
            Services pour votre santé et bien-être
          </p>
        </div>

        {/* Onglets compacts */}
        <div className="flex flex-wrap gap-1 mb-6 justify-center">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? colors["primary-dark"] : 'transparent'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grille de cartes compacte */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {displayedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.link)}
              className={`${card.bgColor} border ${card.borderColor} rounded-md p-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-2">
                <div
                  className="p-1.5 rounded flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: colors["primary-dark"] + "20" }}
                >
                  <div style={{ color: colors["primary-dark"] }}>
                    {card.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3
                    className="font-bold text-sm mb-1"
                    style={{ color: colors["neutral-dark"] }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-xs text-gray-600 mb-2 leading-snug line-clamp-2"
                  >
                    {card.description}
                  </p>
                  
                  <div
                    className="flex items-center gap-1 font-medium text-xs"
                    style={{ color: colors["primary-dark"] }}
                  >
                    <span>Voir plus</span>
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton compact */}
        <div className="text-center">
          <Button
            className="px-4 py-2 flex items-center gap-2 text-sm rounded-md transition-all duration-300 hover:shadow-md mx-auto"
            onClick={() => navigate('/bien-etre')}
            style={{ backgroundColor: colors["primary-dark"] }}
          >
            <span className="font-semibold">
              Tous les services
            </span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BienEtreShowcase;