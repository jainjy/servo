import React, { useState, useEffect } from 'react';
import { Apple, Heart, Users, Leaf, Sprout, ArrowRight, RefreshCw, Sparkles, Star, MapPin, Clock, Shield, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthService from '@/services/authService';

interface BienEtreCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  link: string;
  color: 'green' | 'pink' | 'purple' | 'emerald' | 'lime';
  image?: string;
  rating?: number;
  location?: string;
  price?: number;
  practitioner?: string;
  duration?: string;
}

const BienEtreShowcase = () => {
  const [displayedCards, setDisplayedCards] = useState<BienEtreCard[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // COULEURS - Palette professionnelle unifiée
  const COLORS = {
    primary: "#0A2F1F",
    primaryLight: "#1E4C2F",
    primarySoft: "#556B2F",
    accent: "#C6A43F",
    dark: "#1A1E24",
    medium: "#4B5565",
    light: "#9CA3AF",
    background: "#F9FAFB",
    white: "#FFFFFF",
    border: "#E5E7EB",
    hover: "#F3F4F6",
    success: "#10B981",
    pink: "#B76E79",
    purple: "#6B4E71",
    lime: "#6B8E23"
  };

  const colorConfig = {
    green: { bg: 'bg-[#F0F3E8]', icon: 'text-[#0A2F1F]', border: 'border-[#DDDDDD]' },
    pink: { bg: 'bg-[#F9F0F0]', icon: 'text-[#B76E79]', border: 'border-[#DDDDDD]' },
    purple: { bg: 'bg-[#F3F0F5]', icon: 'text-[#6B4E71]', border: 'border-[#DDDDDD]' },
    emerald: { bg: 'bg-[#E8F3E8]', icon: 'text-[#1E4C2F]', border: 'border-[#DDDDDD]' },
    lime: { bg: 'bg-[#F0F5E8]', icon: 'text-[#6B8E23]', border: 'border-[#DDDDDD]' },
  };

  // Images d'exemple
  const categoryImages = {
    nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    soin: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop",
    therapeute: "https://images.unsplash.com/photo-1556760544-74068565f05c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    huile: "https://images.unsplash.com/photo-1608571423853-2c158115a7f0?w=800&auto=format&fit=crop",
    medecine: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop"
  };

  const allCards: BienEtreCard[] = [
    {
      id: 'nutrition',
      title: 'Nutrition',
      description: 'Consultation nutrition et plans personnalisés',
      icon: <Apple size={16} />,
      category: 'nutrition',
      link: 'Nutrition',
      color: 'green',
      image: categoryImages.nutrition,
      rating: 4.95,
      location: 'Saint-Denis',
      price: 65,
      practitioner: 'Sophie Mercier',
      duration: '60 min'
    },
    {
      id: 'soin',
      title: 'Soins',
      description: 'Soins corporels et faciaux pour votre bien-être',
      icon: <Heart size={16} />,
      category: 'soin',
      link: 'Soin',
      color: 'pink',
      image: categoryImages.soin,
      rating: 4.88,
      location: 'Saint-Pierre',
      price: 80,
      practitioner: 'Marie Fontaine',
      duration: '90 min'
    },
    {
      id: 'therapeute',
      title: 'Thérapeutes',
      description: 'Équilibre émotionnel et bien-être mental',
      icon: <Users size={16} />,
      category: 'therapeute',
      link: 'Therapeute',
      color: 'purple',
      image: categoryImages.therapeute,
      rating: 4.92,
      location: 'Le Tampon',
      price: 70,
      practitioner: 'Dr. Laurent Dubois',
      duration: '50 min'
    },
    {
      id: 'huile',
      title: 'Huiles Essentielles',
      description: 'Aromathérapie et solutions naturelles',
      icon: <Sprout size={16} />,
      category: 'huile',
      link: 'HuilesEssentielles',
      color: 'emerald',
      image: categoryImages.huile,
      rating: 4.85,
      location: 'Saint-Paul',
      price: 45,
      practitioner: 'Claire Martin',
      duration: '45 min'
    },
    {
      id: 'medecine',
      title: 'Médecines Naturelles',
      description: 'Approches holistiques pour votre santé',
      icon: <Leaf size={16} />,
      category: 'medecine',
      link: 'MedecinesNaturelles',
      color: 'lime',
      image: categoryImages.medecine,
      rating: 4.90,
      location: 'La Possession',
      price: 85,
      practitioner: 'Dr. Antoine Petit',
      duration: '60 min'
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

  const handleCardClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    window.open(`/bien-etre`, '_blank');
  };

  const toggleFavorite = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <section className="w-full py-10 lg:py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* HEADER - Compact et professionnel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8"
        >
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-medium text-[#222222] tracking-tight">
              Santé & Bien-Être
            </h2>
            <p className="text-sm text-[#717171]">
              Praticiens et thérapeutes d'exception
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-3 sm:mt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className="px-3 py-1.5 text-xs font-medium text-[#717171] hover:text-[#222222] border border-[#DDDDDD] rounded-full hover:border-[#222222] transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={12} />
              <span>Actualiser</span>
            </motion.button>
            
            <a
              href="/bien-etre"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#222222] text-white rounded-full text-xs font-medium hover:bg-[#333333] transition-all flex items-center gap-1.5 no-underline"
            >
              <span>Tous les services</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>

        {/* GRILLE DES CARTES - Format compact */}
        <div className="grid md:grid-cols-3 gap-4 lg:gap-5">
          <AnimatePresence mode="wait">
            {displayedCards.map((card, index) => {
              const colors = colorConfig[card.color];
              const isFavorited = favorites[card.id];
              
              return (
                <motion.div
                  key={`${card.id}-${index}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                  onMouseEnter={() => setIsHovered(card.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="group"
                >
                  <a
                    href="/bien-etre"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative cursor-pointer block no-underline"
                  >
                    {/* CONTENEUR IMAGE - Ratio 4/3 compact */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F7F7] mb-2">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Overlay gradient subtil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge "Coup de cœur" */}
                      {card.rating && card.rating > 4.9 && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[9px] font-medium text-[#222222] shadow-sm flex items-center gap-1">
                            <Heart className="h-2.5 w-2.5 fill-[#FF385C] text-[#FF385C]" />
                            Coup de cœur
                          </span>
                        </div>
                      )}
                      
                      {/* Bouton Favoris */}
                      <button
                        onClick={(e) => toggleFavorite(card.id, e)}
                        className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-all"
                      >
                        <Heart
                          className={`h-3 w-3 transition-all ${
                            isFavorited 
                              ? 'fill-[#FF385C] text-[#FF385C]' 
                              : 'text-[#222222]'
                          }`}
                        />
                      </button>
                      
                      {/* Badge catégorie */}
                      <div className="absolute bottom-2 left-2 z-10">
                        <span className={`px-2 py-0.5 ${colors.bg} rounded-full text-[9px] font-medium text-[#222222] shadow-sm flex items-center gap-1`}>
                          <span className={colors.icon}>{card.icon}</span>
                          <span>{card.category}</span>
                        </span>
                      </div>

                      {/* Badge durée */}
                      {card.duration && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <span className="px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-full text-[9px] font-medium text-white flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {card.duration}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INFORMATIONS - Compactes */}
                    <div className="space-y-1 px-0.5">
                      {/* Ligne 1 : Praticien + Note */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-[#222222]">
                          {card.practitioner}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-2.5 w-2.5 fill-current text-[#222222]" />
                          <span className="text-[9px] font-medium text-[#222222]">
                            {card.rating}
                          </span>
                        </div>
                      </div>
                      
                      {/* Ligne 2 : Titre */}
                      <h3 className="text-xs font-normal text-[#222222] line-clamp-1">
                        {card.title}
                      </h3>
                      
                      {/* Ligne 3 : Localisation */}
                      <div className="flex items-center gap-0.5 text-[9px] text-[#717171]">
                        <MapPin className="h-2 w-2" />
                        <span className="line-clamp-1">{card.location}</span>
                      </div>
                      
                      {/* Ligne 4 : Prix */}
                      <div className="pt-0.5">
                        <span className="text-xs font-semibold text-[#222222]">
                          {card.price}€
                        </span>
                        <span className="text-[8px] text-[#717171] ml-1">
                          / séance
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* SECTION CATÉGORIES - Compacte */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 pt-6 border-t border-[#DDDDDD]"
        >
          {/* Section vide ou à compléter */}
        </motion.div>
      </div>

      {/* MODAL DE CONNEXION (optionnelle) */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden"
            >
              <div className="p-5">
                <h3 className="text-base font-medium text-[#222222] mb-3">
                  Connexion requise
                </h3>
                <p className="text-xs text-[#717171] mb-4">
                  Connectez-vous pour accéder à tous les services bien-être
                </p>
                <div className="flex gap-2">
                  <a
                    href="/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 bg-[#222222] text-white rounded-lg text-xs font-medium text-center no-underline"
                  >
                    Se connecter
                  </a>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 py-2 border border-[#DDDDDD] text-[#222222] rounded-lg text-xs font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BienEtreShowcase;