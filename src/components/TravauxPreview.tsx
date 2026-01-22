import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { prestationsData, prestationTypesByCategory } from "./travauxData";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TravauxPreview = ({ homeCards }: { homeCards?: boolean }) => {
  const navigate = useNavigate();
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Prendre les 4 premiers travaux toutes catégories confondues
  const allPrestations = Object.values(prestationsData).flat();
  const displayedPrestations = allPrestations.slice(0, 4);

  useEffect(() => {
    const indexes = {};
    displayedPrestations.forEach((prestation) => {
      indexes[prestation.id] = 0;
    });
    setCurrentImageIndexes(indexes);
  }, []);

  const handleCardClick = (prestation) => {
    if (homeCards) {
      const category = Object.entries(prestationsData).find(([_, prestations]) =>
        (prestations as any[]).some((p) => p.id === prestation.id)
      )?.[0];

      if (category) {
        navigate(`/travaux?categorie=${category}&search=${encodeURIComponent(prestation.title)}`);
      }
    }
  };

  const nextImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] + 1) % totalImages,
    }));
  };

  const prevImage = (prestationId, totalImages, e) => {
    e?.stopPropagation();
    setCurrentImageIndexes((prev) => ({
      ...prev,
      [prestationId]: (prev[prestationId] - 1 + totalImages) % totalImages,
    }));
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 540;
      const newScrollPosition = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({ left: newScrollPosition, behavior: 'smooth' });

      setTimeout(() => checkScroll(), 300);
    }
  };

  const checkScroll = () => {
    if (sliderRef.current) {
      setCanScrollLeft(sliderRef.current.scrollLeft > 0);
      setCanScrollRight(
        sliderRef.current.scrollLeft < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
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

  // Auto-scroll tous les 5 secondes
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (sliderRef.current) {
        const scrollAmount = 540;
        const currentScroll = sliderRef.current.scrollLeft;
        const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;

        if (currentScroll >= maxScroll - 10) {
          // Retour au début
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Continuer le scroll
          const newPosition = currentScroll + scrollAmount;
          sliderRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
        }

        setTimeout(() => checkScroll(), 300);
      }
    }, 5000);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <section className="container mx-auto -mt-6 py-8 relative">
      {/* Publicité - Version taille intermédiaire */}
      {isAdVisible && !isMobile && (
        <motion.article
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="
              hidden sm:block
              relative w-full max-w-2xl mx-auto
              rounded-xl border border-white/20
              bg-gradient-to-br from-white/12 to-white/6
              backdrop-blur-lg shadow-lg overflow-hidden z-40 mb-4
            "
        >
          {/* Header */}
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-white/25 text-white font-semibold backdrop-blur-sm">
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
            <div className="w-36 h-28 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
                alt="Offre spéciale"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Texte */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-black mb-1.5">
                Offres spéciales
              </h2>

              <p className="text-sm text-black/80 leading-relaxed mb-3">
                Bénéficiez de réductions exclusives sur nos meilleurs services.
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/15">
                <div className="flex items-center text-xs text-white/65">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-black/70">Visible : <span className="font-medium text-black/70">2 minutes</span></span>
                </div>


              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* SECTION NOS TRAVAUX – COTE A COTE PORTFOLIO */}
<section className="bg-slate-100 py-8 sm:py-10 md:py-12 lg:py-14 px-4 sm:px-6 lg:px-10 rounded-md">
  <div className="max-w-[1400px] mx-auto">

    <div className="flex flex-col lg:grid lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start">

      {/* ===== COLONNE GAUCHE (CONTENU) ===== */}
      <div className="lg:col-span-2 lg:sticky lg:top-32">
        {/* Titre responsive */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-slate-900 mb-4 sm:mb-5 md:mb-6">
          Nos Travaux
        </h2>

        {/* Texte descriptif */}
        <p className="text-[#5c5047] text-sm sm:text-base max-w-full lg:max-w-md leading-relaxed mb-6 sm:mb-8 md:mb-10">
          Découvrez un aperçu de nos travaux les plus récents
        </p>

        {/* Bouton responsive */}
        <Button
          variant="outline"
          className="rounded-full border border-[#3a2f27] bg-transparent px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 text-slate-900 hover:bg-logo hover:text-white transition-all duration-300 group w-full sm:w-auto"
          onClick={() => navigate("/travaux?categorie=interieurs")}
        >
          <span className="font-mono text-xs sm:text-sm">
            VOIR TOUS NOS TRAVAUX
          </span>
          <ArrowRight className="ml-2 sm:ml-3 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* ===== COLONNE DROITE (PROJETS) ===== */}
      <div className="lg:col-span-3 w-full">
        <div className="relative">
          {/* Conteneur du slider */}
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12 pb-6 sm:pb-8 md:pb-10 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE/Edge
            }}
          >
            {displayedPrestations.map((prestation) => {
              const currentImageIndex = currentImageIndexes[prestation.id] || 0;
              const totalImages = prestation.images.length;

              const category = Object.entries(prestationsData).find(([_, prestations]) =>
                prestations.some((p) => p.id === prestation.id)
              )?.[0];

              const prestationType = prestationTypesByCategory[category]?.find(
                (t) => t.value === prestation.type
              );

              return (
                <Card
                  key={prestation.id}
                  onClick={() => handleCardClick(prestation)}
                  className="group relative min-w-[250px] lg:min-w-[450px] h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] rounded-xl md:rounded-2xl overflow-hidden border-0 cursor-pointer bg-transparent snap-start flex-shrink-0"
                >
                  <div className="relative w-full h-full">
                    {/* Image */}
                    <img
                      src={prestation.images[currentImageIndex]}
                      alt={prestation.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Badge catégorie */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-[#3a2f27]">
                      {prestationType?.label}
                    </div>

                    {/* Boutons de navigation d'image (seulement sur desktop) */}
                    {totalImages > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/80 backdrop-blur-sm opacity-0 lg:group-hover:opacity-100 transition hidden lg:flex"
                          onClick={(e) => prevImage(prestation.id, totalImages, e)}
                        >
                          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-[#3a2f27]" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/80 backdrop-blur-sm opacity-0 lg:group-hover:opacity-100 transition hidden lg:flex"
                          onClick={(e) => nextImage(prestation.id, totalImages, e)}
                        >
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-[#3a2f27]" />
                        </Button>
                      </>
                    )}

                    {/* Titre du projet */}
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-serif tracking-wide">
                        {prestation.title}
                      </h3>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Boutons de navigation du slider (visible sur desktop seulement) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSlider('left')}
            disabled={!canScrollLeft}
            className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-[#3a2f27] hover:bg-[#3a2f27]/80 text-white disabled:opacity-30 disabled:cursor-not-allowed z-10 hidden lg:flex"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollSlider('right')}
            disabled={!canScrollRight}
            className="absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full bg-[#3a2f27] hover:bg-[#3a2f27]/80 text-white disabled:opacity-30 disabled:cursor-not-allowed z-10 hidden lg:flex"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Indicateurs de défilement pour mobile (optionnel) */}
        <div className="flex justify-center gap-2 mt-4 lg:hidden">
          {displayedPrestations.map((_, index) => (
            <div
              key={index}
              className="h-1.5 w-1.5 rounded-full bg-[#3a2f27]/30"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</section>


    </section>
  );
};

export default TravauxPreview;