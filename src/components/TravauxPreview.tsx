import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { prestationsData, prestationTypesByCategory } from "./travauxData";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  Star,
  MapPin,
} from "lucide-react";
import AdvertisementPopup from '@/components/AdvertisementPopup';

const TravauxPreview = ({ homeCards }: { homeCards?: boolean }) => {
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [favorites, setFavorites] = useState({});
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // COULEURS OLIplus
  const OLI_GREEN = "#556B2F";
  const OLI_GREEN_LIGHT = "#6B8E23";

  // Prendre les 8 premiers travaux
  const allPrestations = Object.values(prestationsData).flat();
  const displayedPrestations = allPrestations.slice(0, 8);

  useEffect(() => {
    const indexes = {};
    displayedPrestations.forEach((prestation) => {
      indexes[prestation.id] = 0;
    });
    setCurrentImageIndexes(indexes);
  }, []);

  const toggleFavorite = (prestationId, e) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites((prev) => ({
      ...prev,
      [prestationId]: !prev[prestationId],
    }));
  };

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    e?.preventDefault();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] - 1 + totalImages) % totalImages,
    }));
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth < 768 ? sliderRef.current.clientWidth - 32 : 540;
      const newScrollPosition = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });
      setTimeout(() => checkScroll(), 300);
    }
  };

  const checkScroll = () => {
    if (sliderRef.current) {
      setCanScrollLeft(sliderRef.current.scrollLeft > 10);
      setCanScrollRight(
        sliderRef.current.scrollLeft < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 20
      );
    }
  };

  useEffect(() => {
    checkScroll();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        slider.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Construction de l'URL pour chaque prestation
  const getPrestationUrl = (prestation) => {
    if (!homeCards) return "#";
    const category = Object.entries(prestationsData).find(([_, prestations]) =>
      (prestations as any[]).some((p) => p.id === prestation.id)
    )?.[0];
    return category ? `/travaux?categorie=${category}&search=${encodeURIComponent(prestation.title)}` : "#";
  };

  return (
    <section className="w-full pt-8 bg-white">
      <div className="pl-6 pr-5 ">
        {/* HEADER - Style Airbnb minimaliste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-3"
        >
          <div>
            <h2 className="ext-xl font-medium text-[#222222] tracking-tight">
              Inspirations pour vos travaux
            </h2>
            <p className="text-xs text-[#717171]">
              Concepts et modèles à explorer
            </p>
          </div>

          {/* Lien vers la page travaux - Ouvre dans un nouvel onglet */}
          {/* {homeCards && (
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <a
                href="/travaux"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 bg-[#222222] text-white rounded-full text-xs font-medium hover:bg-[#333333] transition-all flex items-center gap-1.5 no-underline"
              >
                <span>Tous voir</span>
                <ArrowRight size={12} />
              </a>
            </div>
          )} */}
        </motion.div>

        {/* SLIDER - Cartes style Airbnb */}
        <div className="relative group/slider">
          {/* Boutons navigation - Discrets */}
          <div className="hidden lg:block">
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scrollSlider('left')}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white shadow-md border border-[#DDDDDD] hover:shadow-lg transition-all opacity-0 group-hover/slider:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4 text-[#222222] mx-auto" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => scrollSlider('right')}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-white shadow-md border border-[#DDDDDD] hover:shadow-lg transition-all opacity-0 group-hover/slider:opacity-100"
                >
                  <ChevronRight className="h-4 w-4 text-[#222222] mx-auto" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* GRILLE DES CARTES - Style Airbnb exact */}
          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayedPrestations.map((prestation) => {
              const currentImageIndex = currentImageIndexes[prestation.id] || 0;
              const totalImages = prestation.images.length;
              const isHovered = hoveredCard === prestation.id;
              const isFavorite = favorites[prestation.id];
              const prestationUrl = getPrestationUrl(prestation);

              const category = Object.entries(prestationsData).find(([_, prestations]) =>
                prestations.some((p) => p.id === prestation.id)
              )?.[0];

              const prestationType = prestationTypesByCategory[category]?.find(
                (t) => t.value === prestation.type
              );

              return (
                <motion.div
                  key={prestation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onMouseEnter={() => setHoveredCard(prestation.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="flex-shrink-0 w-[260px] sm:w-[280px] lg:w-[300px] xl:w-[320px]"
                >
                  {/* Utilisation d'une balise <a> avec target="_blank" */}
                  <a
                    href={prestationUrl}
                    target={homeCards ? "_blank" : undefined}
                    rel={homeCards ? "noopener noreferrer" : undefined}
                    className="block no-underline group relative cursor-pointer"
                    onClick={(e) => {
                      if (!homeCards || prestationUrl === "#") {
                        e.preventDefault();
                      }
                    }}
                  >
                    {/* CONTENEUR IMAGE - Ratio 4/3 exact comme Airbnb */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F7F7] mb-2">
                      {/* Image */}
                      <img
                        src={prestation.images[currentImageIndex]}
                        alt={prestation.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Bouton Favoris - Position Airbnb */}
                      <button
                        onClick={(e) => toggleFavorite(prestation.id, e)}
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all"
                      >
                        <Heart
                          className={`h-4 w-4 transition-all ${isFavorite
                            ? 'fill-[#FF385C] text-[#FF385C]'
                            : 'text-[#222222]'
                            }`}
                        />
                      </button>

                      {/* Badge "Coup de cœur" - Style Airbnb */}
                      {prestation.featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-[#222222] shadow-sm">
                            ⭐ Coup de cœur
                          </span>
                        </div>
                      )}

                      {/* Navigation images - Apparaît au hover */}
                      {totalImages > 1 && (
                        <>
                          <button
                            onClick={(e) => prevImage(prestation.id, totalImages, e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <ChevronLeft className="h-3.5 w-3.5 text-[#222222]" />
                          </button>
                          <button
                            onClick={(e) => nextImage(prestation.id, totalImages, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-[#222222]" />
                          </button>
                        </>
                      )}

                      {/* Indicateur d'images - Points minimalistes */}
                      {totalImages > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {Array.from({ length: Math.min(3, totalImages) }).map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 w-1 rounded-full transition-all ${idx === (currentImageIndex % 3)
                                ? 'bg-white w-2'
                                : 'bg-white/60'
                                }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Indicateur nouvel onglet (visible au survol) */}
                      {homeCards && (
                        <div className="absolute top-3 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <span>Nouvel onglet</span>
                            <span>↗</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INFORMATIONS - Style Airbnb ultra réduit */}
                    <div className="space-y-0.5 px-0.5">
                      {/* Ligne 1 : Type et note */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#222222] uppercase tracking-tight">
                          {prestationType?.label || prestation.category || 'Travaux'}
                        </span>
                        {prestation.rating && (
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-current text-[#222222]" />
                            <span className="text-xs font-medium text-[#222222]">
                              {prestation.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Ligne 2 : Titre (une ligne) */}
                      <h3 className="text-sm font-normal text-[#222222] line-clamp-1">
                        {prestation.title}
                      </h3>

                      {/* Ligne 3 : Localisation */}
                      <div className="flex items-center gap-0.5 text-xs text-[#717171]">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="line-clamp-1">
                          {prestation.location || 'France'}
                        </span>
                      </div>

                      {/* Ligne 4 : Dates fictives (comme Airbnb) */}
                      <div className="text-xs text-[#717171]">
                        15–20 mars · pour 5 nuits
                      </div>

                      {/* Ligne 5 : Prix */}
                      {prestation.price && (
                        <div className="pt-1">
                          <span className="text-sm font-semibold text-[#222222]">
                            {prestation.price}€
                          </span>
                          <span className="text-xs text-[#717171] ml-1">
                            par intervention
                          </span>
                        </div>
                      )}
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* INDICATEURS MOBILE - Style Airbnb */}
        <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
          {displayedPrestations.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (sliderRef.current) {
                  const scrollAmount = sliderRef.current.clientWidth - 32;
                  sliderRef.current.scrollTo({ left: scrollAmount * index, behavior: 'smooth' });
                }
              }}
              className="h-1 w-6 rounded-full bg-[#DDDDDD] transition-all hover:bg-[#556B2F]/50"
            />
          ))}
        </div>
      </div>

      <AdvertisementPopup position="section-accueil-travaux" />
    </section>
  );
};

export default TravauxPreview;