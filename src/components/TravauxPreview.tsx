  import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { motion } from "framer-motion";
  import { useState, useEffect } from "react";
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

    // Ne pas afficher la pub sur mobile
    if (isMobile) {
      return (
        <section className="container mx-auto -mt-6 px-4 py-8">
          <div className="bg-white shadow-lg px-8 py-5 rounded-3xl">
            {/* ... contenu sans pub ... */}
          </div>
        </section>
      );
    }

    return (
      <section className="container mx-auto -mt-6 px-4 py-8 relative">
        {/* Publicité - Version taille intermédiaire */}
        {isAdVisible && (
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

        {/* Contenu principal des travaux */}
        <div className="bg-white shadow-lg px-8 py-5 rounded-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Nos Travaux
            </h2>
            <p className="text-gray-600 lg:text-md text-sm max-w-2xl mx-auto">
              Découvrez un aperçu de nos travaux les plus récents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayedPrestations.map((prestation) => {
              const currentImageIndex = currentImageIndexes[prestation.id] || 0;
              const totalImages = prestation.images.length;
              
              const category = Object.entries(prestationsData).find(([_, prestations]) =>
                (prestations as any[]).some((p) => p.id === prestation.id)
              )?.[0];
              const prestationType = prestationTypesByCategory[category]?.find(
                (t) => t.value === prestation.type
              );

              return (
                <Card
                  key={prestation.id}
                  className={
                    homeCards
                      ? "home-card group cursor-pointer h-full"
                      : "group overflow-hidden border-0 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 rounded-3xl cursor-pointer transform hover:-translate-y-2"
                  }
                  onClick={() => handleCardClick(prestation)}
                >
                  <div className="relative overflow-hidden">
                    <div className={homeCards ? "h-72 rounded-lg overflow-hidden" : "relative h-56 overflow-hidden rounded-t-3xl"}>
                      <img
                        src={prestation.images[currentImageIndex]}
                        alt={prestation.title}
                        className={homeCards ? "h-full w-full" : "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"}
                      />

                      <div 
                        className={homeCards ? "absolute inset-0 rounded-lg bg-gradient-to-t from-black to-transparent opacity-100" : "absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"}
                      />

                      <div 
                        className={homeCards ? "absolute top-1/2 left-1/2 text-sm -translate-x-1/2 -translate-y-1/2 font-extralight font-mono text-white bg-black/50 px-4 py-2 rounded-full" : "absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-bold text-gray-800 shadow-lg"}
                      >
                        {prestationType?.label}
                      </div>

                      {totalImages > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            onClick={(e) => prevImage(prestation.id, totalImages, e)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                            onClick={(e) => nextImage(prestation.id, totalImages, e)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>

                          <div 
                            className={homeCards ? "hidden" : "absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"}
                          >
                            {currentImageIndex + 1}/{totalImages}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Button
            variant="outline"
            className="rounded-2xl border-1 lg:w-auto w-full bg-slate-950 border-gray-300 hover:border-blue-500 hover:bg-black text-lg py-4 font-semibold transition-all duration-300 hover:shadow-lg group"
            onClick={() => navigate("/travaux?categorie=interieurs")}
          >
            <span className="text-white text-base font-mono">
              VOIR TOUS NOS TRAVAUX
            </span>
            <ArrowRight className="h-5 w-5 text-blue-600 group-hover:text-purple-600 transition-transform group-hover:translate-x-1 ml-2" />
          </Button>
        </div>
      </section>
    );
  };

  export default TravauxPreview;