import React, { useState, useEffect } from 'react';
import { Apple, Heart, Users, Leaf, Sprout, ArrowRight, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthService from '@/services/authService';

interface BienEtreCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
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

const BienEtreShowcase = () => {
  const navigate = useNavigate();
  const [displayedCards, setDisplayedCards] = useState<BienEtreCard[]>([]);
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

  const allCards: BienEtreCard[] = [
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Consultation nutrition et plans personnalisés pour votre santé.',
      icon: <Apple size={22} />,
      gradient: 'from-orange-100 via-amber-100 to-yellow-100',
      category: 'nutrition',
      link: 'Nutrition'
    },
    {
      id: 'soin',
      title: 'Soins',
      description: 'Services de soins corporels et faciaux pour votre bien-être.',
      icon: <Heart size={22} />,
      gradient: 'from-pink-100 via-rose-100 to-red-100',
      category: 'soin',
      link: 'Soin'
    },
    {
      id: 'therapeute',
      title: 'Thérapeutes',
      description: 'Consultations avec professionnels pour équilibre émotionnel.',
      icon: <Users size={22} />,
      gradient: 'from-indigo-100 via-purple-100 to-violet-100',
      category: 'therapeute',
      link: 'Therapeute'
    },
    {
      id: 'huile',
      title: 'Huiles Essentielles',
      description: 'Aromathérapie et solutions naturelles pour la détente.',
      icon: <Sprout size={22} />,
      gradient: 'from-emerald-100 via-green-100 to-teal-100',
      category: 'huile',
      link: 'HuilesEssentielles'
    },
    {
      id: 'medecine',
      title: 'Médecines Naturelles',
      description: 'Approches holistiques pour votre santé et bien-être.',
      icon: <Leaf size={22} />,
      gradient: 'from-lime-100 via-green-50 to-emerald-100',
      category: 'medecine',
      link: 'MedecinesNaturelles'
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
    navigate('/bien-etre', { state: { activeTab: link } });
  };

  // Fonction pour ouvrir le lien de la pub
  const handleAdClick = () => {
    if (AuthService.isAuthenticated()) {
      navigate('/bien-etre');
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <section className="py-16 bg-[#22ee303a] relative">
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
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&q=80"
                alt="Santé & Bien-Être"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texte */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-black mb-1.5">
                Prenez soin de votre santé
              </h2>

              <p className="text-sm text-black/80 leading-relaxed mb-3">
                Découvrez nos services de bien-être pour une vie plus équilibrée et sereine.
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

      <div className="max-w-7xl mx-auto text-center mb-4 flex lg:flex-row flex-col items-center justify-between">
        <h2 className="text-3xl lg:text-5xl font-medium font-serif text-gray-800 mb-3 tracking-tight">
          Santé & Bien-Être
        </h2>
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
            onClick={() => navigate('/bien-etre')}
          >
            Tous les services
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
                  <h3 className="font-bold text-2xl text-gray-900 font-serif leading-tight">{card.title}</h3>
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
                  <div onClick={() => handleCardClick(card.link)} className="flex bg-white shadow-lg p-4 rounded-full justify-center items-center gap-3 text-base font-semibold text-[#556B2F] group">
                    <span className="group-hover:translate-x-1 text-center transition-transform duration-300">
                      Découvrir
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
    </section>
  );
};

export default BienEtreShowcase;