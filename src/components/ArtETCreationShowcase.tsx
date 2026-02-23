import React, { useState, useEffect } from 'react';
import { Palette, Camera, Hammer, Brush, ShoppingBag, ArrowRight, RefreshCw, Sparkles, Heart, Star, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import AdvertisementPopup from '@/components/AdvertisementPopup';

interface ArtCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  link: string;
  color: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose';
  image?: string;
  rating?: number;
  location?: string;
  price?: number;
  artist?: string;
}

const ArtETCreationShowcase = () => {
  const [displayedCards, setDisplayedCards] = useState<ArtCard[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // COULEURS OLIplus
  const OLI_GREEN = "#556B2F";
  const OLI_GREEN_LIGHT = "#6B8E23";
  const OLI_DARK = "#222222";
  const OLI_LIGHT = "#717171";
  const OLI_BORDER = "#DDDDDD";
  const OLI_HOVER = "#F7F7F7";

  const colorConfig = {
    blue: { bg: 'bg-[#F7F7F7]', icon: 'text-[#556B2F]', border: 'border-[#DDDDDD]', hover: 'hover:border-[#556B2F]' },
    emerald: { bg: 'bg-[#F7F7F7]', icon: 'text-[#6B8E23]', border: 'border-[#DDDDDD]', hover: 'hover:border-[#6B8E23]' },
    amber: { bg: 'bg-[#F7F7F7]', icon: 'text-[#8B7355]', border: 'border-[#DDDDDD]', hover: 'hover:border-[#8B7355]' },
    violet: { bg: 'bg-[#F7F7F7]', icon: 'text-[#6B4E71]', border: 'border-[#DDDDDD]', hover: 'hover:border-[#6B4E71]' },
    rose: { bg: 'bg-[#F7F7F7]', icon: 'text-[#B76E79]', border: 'border-[#DDDDDD]', hover: 'hover:border-[#B76E79]' },
  };

  // Images d'exemple pour les cartes (comme Airbnb)
  const categoryImages = {
    photographie: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop",
    sculpture: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&auto=format&fit=crop",
    peinture: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop",
    artisanat: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop",
    marketplace: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop"
  };

  const allCards: ArtCard[] = [
    {
      id: 'photographie',
      title: 'Photographie',
      description: 'Portraits, paysages et moments uniques capturés par des artistes locaux.',
      icon: <Camera size={20} />,
      category: 'Photographie',
      link: 'photographie',
      color: 'blue',
      image: categoryImages.photographie,
      rating: 4.92,
      location: 'Saint-Denis',
      price: 89,
      artist: 'Marie Laurent'
    },
    {
      id: 'sculpture',
      title: 'Sculpture',
      description: 'Œuvres uniques en bois, métal et pierre, entre tradition et modernité.',
      icon: <Hammer size={20} />,
      category: 'Sculpture',
      link: 'sculpture',
      color: 'amber',
      image: categoryImages.sculpture,
      rating: 4.88,
      location: 'Saint-Pierre',
      price: 150,
      artist: 'Jean-Baptiste Morel'
    },
    {
      id: 'peinture',
      title: 'Peinture',
      description: 'Toiles abstraites et figuratives qui racontent des histoires.',
      icon: <Palette size={20} />,
      category: 'Peinture',
      link: 'peinture',
      color: 'violet',
      image: categoryImages.peinture,
      rating: 4.95,
      location: 'Le Tampon',
      price: 120,
      artist: 'Sophie Chen'
    },
    {
      id: 'artisanat',
      title: 'Artisanat',
      description: 'Objets uniques façonnés à la main par des artisans d\'exception.',
      icon: <Brush size={20} />,
      category: 'Artisanat',
      link: 'artisanat',
      color: 'emerald',
      image: categoryImages.artisanat,
      rating: 4.85,
      location: 'Saint-Paul',
      price: 75,
      artist: 'Antoine Fontaine'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Découvrez et achetez des créations originales en direct des ateliers.',
      icon: <ShoppingBag size={20} />,
      category: 'Marketplace',
      link: 'marketplace',
      color: 'rose',
      image: categoryImages.marketplace,
      rating: 4.79,
      location: 'La Possession',
      price: 45,
      artist: 'Collectif Création'
    }
  ];

  const getRandomCards = () => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4); // 4 cartes comme Airbnb
  };

  useEffect(() => {
    setDisplayedCards(getRandomCards());
  }, []);

  const handleRefresh = () => {
    setDisplayedCards(getRandomCards());
  };

  const handleCardClick = (e: React.MouseEvent, link: string) => {
    e.preventDefault();

    // Vérification de l'authentification (optionnel)
    // Si vous voulez garder la logique d'auth, décommentez ces lignes
    // if (!AuthService.isAuthenticated()) {
    //   setShowAuthModal(true);
    //   return;
    // }

    // Ouvre dans un nouvel onglet
    window.open(`/art-et-creation?activeTab=${link}`, '_blank');
  };

  const toggleFavorite = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  return (
    <section className="w-full pt-9">
      <div className="pl-6 pr-5 ">
        {/* HEADER - Style Airbnb épuré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-3"
        >
          <div>
            <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
              Art & Création
            </h2>
            <p className="text-xs text-[#717171]">
              De l'esquisse à l'œuvre finale
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
              href="/art-et-creation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-[#222222] text-white rounded-full text-xs font-medium hover:bg-[#333333] transition-all flex items-center gap-1.5 no-underline"
            >
              <span>Voir plus</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>

        {/* GRILLE DES CARTES - Style Airbnb Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          <AnimatePresence mode="wait">
            {displayedCards.map((card, index) => {
              const colors = colorConfig[card.color];
              const isFavorited = favorites[card.id];

              return (
                <motion.div
                  key={`${card.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  onMouseEnter={() => setIsHovered(card.id)}
                  onMouseLeave={() => setIsHovered(null)}
                  className="group"
                >
                  {/* Lien avec target="_blank" */}
                  <a
                    href={`/art-et-creation?activeTab=${card.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      // Empêche la navigation par défaut si on veut garder la logique d'auth
                      if (!AuthService.isAuthenticated()) {
                        e.preventDefault();
                        setShowAuthModal(true);
                      }
                    }}
                    className="relative cursor-pointer block no-underline"
                  >
                    {/* CONTENEUR IMAGE - Ratio 4/3 comme Airbnb */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F7F7] mb-3">
                      {/* Image de la catégorie */}
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Overlay gradient subtil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badge "Coup de cœur" - Style Airbnb */}
                      {card.rating && card.rating > 4.9 && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-[#222222] shadow-sm flex items-center gap-1">
                            <Heart className="h-3 w-3 fill-[#FF385C] text-[#FF385C]" />
                            Coup de cœur
                          </span>
                        </div>
                      )}

                      {/* Bouton Favoris - Style Airbnb */}
                      <button
                        onClick={(e) => toggleFavorite(card.id, e)}
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${isFavorited
                              ? 'fill-[#FF385C] text-[#FF385C]'
                              : 'text-[#222222]'
                            }`}
                        />
                      </button>

                      {/* Indicateur de catégorie - Mini badge */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-[#222222] shadow-sm flex items-center gap-1">
                          <span className={colors.icon}>{card.icon}</span>
                          <span>{card.category}</span>
                        </span>
                      </div>

                      {/* Indicateur nouvel onglet (visible au survol) */}
                      <div className="absolute top-3 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                          <span>Nouvel onglet</span>
                          <span>↗</span>
                        </span>
                      </div>
                    </div>

                    {/* INFORMATIONS - Style Airbnb ultra réduit */}
                    <div className="space-y-1 px-0.5">
                      {/* Ligne 1 : Artiste + Note */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#222222]">
                          {card.artist}
                        </span>
                        <div className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-current text-[#222222]" />
                          <span className="text-xs font-medium text-[#222222]">
                            {card.rating}
                          </span>
                        </div>
                      </div>

                      {/* Ligne 2 : Titre */}
                      <h3 className="text-sm font-normal text-[#222222] line-clamp-1">
                        {card.title}
                      </h3>

                      {/* Ligne 3 : Localisation */}
                      <div className="flex items-center gap-0.5 text-xs text-[#717171]">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="line-clamp-1">
                          {card.location}
                        </span>
                      </div>

                      {/* Ligne 4 : Prix */}
                      <div className="pt-1">
                        <span className="text-sm font-semibold text-[#222222]">
                          {card.price}€
                        </span>
                        <span className="text-xs text-[#717171] ml-1">
                          par œuvre
                        </span>
                      </div>
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>

      {/* MODAL DE CONNEXION - Style Airbnb */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium text-[#222222]">
                    Connectez-vous
                  </h2>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-[#717171] hover:text-[#222222] transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#F7F7F7] rounded-xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Palette className="w-5 h-5 text-[#556B2F]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-[#222222] mb-1">
                        Accès à l'univers créatif
                      </h3>
                      <p className="text-xs text-[#717171]">
                        Connectez-vous pour découvrir l'intégralité des œuvres et contacter les artistes
                      </p>
                    </div>
                  </div>

                  <a
                    href="/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#222222] text-white hover:bg-[#333333] rounded-xl text-sm font-medium text-center no-underline"
                  >
                    Se connecter
                    <span className="ml-1 text-white/70">↗</span>
                  </a>

                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="w-full py-3 border border-[#DDDDDD] text-[#222222] hover:bg-[#F7F7F7] rounded-xl text-sm font-medium"
                  >
                    Continuer sans compte
                  </button>

                  <div className="pt-4 text-center">
                    <span className="text-xs text-[#717171]">
                      Pas encore de compte ?{' '}
                      <a
                        href="/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#222222] hover:underline font-medium inline-flex items-center gap-0.5"
                      >
                        Inscrivez-vous
                        <span className="text-[10px]">↗</span>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ArtETCreationShowcase;