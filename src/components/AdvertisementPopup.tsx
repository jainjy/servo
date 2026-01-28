// src/components/AdvertisementPopup.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl?: string;
  type?: string;
}

interface Props {
  refreshMinutes?: number;
  displayDuration?: number;
  listThreshold?: number;
  size?: "small" | "medium" | "large";
  position: string;
}

interface SingleAdvertisementProps {
  ad: Advertisement;
  displayDuration: number;
  index: number;
  totalCount: number;
  size: "small" | "medium" | "large";
  position?: string;
  onClose: (adId: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const SingleAdvertisement: React.FC<SingleAdvertisementProps> = ({
  ad,
  displayDuration,
  index,
  totalCount,
  size,
  position,
  onClose,
  onNext,
  onPrevious
}) => {
  const [timer, setTimer] = useState(displayDuration * 60);
  const [visible, setVisible] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          onClose(ad.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [ad.id, onClose]);

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase();
  };

  const isVideoUrl = (url: string) => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const extension = getFileExtension(url);
    return extension ? videoExtensions.includes(extension) : false;
  };

  const isVideoAd = (advertisement: Advertisement) => advertisement?.type === 'video';
  const currentAdIsVideo = ad ? (isVideoAd(ad) || isVideoUrl(ad.imageUrl)) : false;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentAdIsVideo) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => {
      setIsVideoPlaying(false);
      setTimeout(() => {
        setVisible(false);
        onClose(ad.id);
      }, 2000);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentAdIsVideo, ad.id, onClose]);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleClick = async () => {
    try {
      await api.post(`/advertisements/${ad.id}/click`);
    } catch (error) {
      console.error("Erreur enregistrement clic :", error);
    }

    if (ad.targetUrl) {
      window.open(ad.targetUrl, "_blank");
    }

    setVisible(false);
    onClose(ad.id);
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setVisible(false);
    onClose(ad.id);
  };

  const positionContainsLeftOrRight =
    position.toLowerCase().includes('left') ||
    position.toLowerCase().includes('right');

  // Styles spécifiques pour les positions left/right
  const getLeftRightStyles = () => {
    switch (size) {
      case 'small':
        return 'min-h-[250px] max-h-[350px] max-w-[200px]';
      case 'medium':
        return 'min-h-[350px] max-h-[500px] max-w-[280px]';
      case 'large':
        return 'min-h-[450px] max-h-[600px] max-w-[350px]';
      default:
        return 'min-h-[300px] max-h-[400px] max-w-[250px]';
    }
  };

  // Styles normaux (pour autres positions)
  const getNormalStyles = () => {
    switch (size) {
      case 'small':
        return 'min-h-[180px] sm:min-h-[140px] max-w-2xl';
      case 'medium':
        return 'min-h-[220px] sm:min-h-[180px] max-w-4xl';
      case 'large':
        return 'min-h-[260px] sm:min-h-[220px] max-w-7xl';
      default:
        return 'min-h-[200px] sm:min-h-[160px] max-w-2xl';
    }
  };

  if (!visible) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 250,
        duration: 0.6
      }}
      className={`relative w-full overflow-hidden ${positionContainsLeftOrRight ? getLeftRightStyles() : getNormalStyles()
        } ${positionContainsLeftOrRight ? "bg-none" : "border border-slate-200 bg-white shadow-md sm:shadow-lg rounded-xl sm:rounded-2xl"} mx-auto my-2 sm:my-3 ${positionContainsLeftOrRight ? 'advertisement-side-position' : ''
        }`}
    >
      {/* Badge et contrôles */}
      <div className={`absolute right-2 sm:right-3 top-2 sm:top-3 z-10 flex items-center space-x-1 sm:space-x-2 text-sm ${positionContainsLeftOrRight ? 'flex-col space-y-1 right-1 top-1' : ''
        }`}>
        {!positionContainsLeftOrRight && (
          <div className="relative">
            <div className="absolute inset-0 animate-ping opacity-20">
              <span className="rounded-full bg-secondary-text px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Publicité
              </span>
            </div>
            <span className="relative rounded-full bg-secondary-text px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Publicité
            </span>
          </div>
        )}
{/* 
        <div className={`flex items-center bg-gray-800 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${positionContainsLeftOrRight ? 'text-[8px] px-1.5 py-0.5' : ''
          }`}>
          <svg
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 ${positionContainsLeftOrRight ? 'w-2 h-2' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{timer}s</span>
        </div> */}

        <button
          title="Fermer la publicité"
          onClick={handleClose}
          className={`rounded-lg bg-red-600 py-0 px-2 sm:px-3 text-gray-100 hover:text-gray-200 transition-colors z-20 text-lg sm:text-xl ${positionContainsLeftOrRight ? 'px-1.5 text-base' : ''
            }`}
        >
          <span className={`${positionContainsLeftOrRight ? 'text-sm' : 'text-sm sm:text-xl'}`}>&times;</span>
        </button>
      </div>

      {/* CONTENU PRINCIPAL */}
      {positionContainsLeftOrRight ? (
        // VERSION LEFT/RIGHT - Image/Vidéo seulement avec hauteur plus grande
        <div className="w-full h-full">
          {/* Media - Image/Vidéo plein écran */}
          <div className="w-full h-full relative group">
            {currentAdIsVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={ad.imageUrl}
                  className="h-full w-full object-cover cursor-pointer"
                  muted={isMuted}
                  playsInline
                  loop={false}
                  onClick={handleClick}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(e);
                    }}
                    className="bg-white/90 text-black rounded-full p-2 sm:p-3 hover:bg-white transition-all"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
                {/* Contrôles audio */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black/90 transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="h-full w-full object-cover cursor-pointer hover:brightness-110 transition-all"
                onClick={handleClick}
              />
            )}

            {/* Overlay avec titre court au survol */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-white text-sm font-medium truncate">{ad.title}</h3>
            </div>

            {/* Indicateur de clic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Cliquez pour visiter
              </div>
            </div>
          </div>
        </div>
      ) : (
        // VERSION NORMALE - Avec texte et image
        <div className="flex flex-col sm:flex-row pt-10 sm:pt-0">
          {/* Media - Image/Vidéo */}
          <div className="w-full h-32 sm:w-40 md:w-56 lg:w-64 sm:h-40 md:h-44 flex-shrink-0 bg-slate-100 relative group">
            {currentAdIsVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={ad.imageUrl}
                  className="h-full w-full object-cover"
                  muted={isMuted}
                  playsInline
                  loop={false}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVideoClick(e);
                    }}
                    className="bg-white/90 text-black rounded-full p-2 sm:p-3 hover:bg-white transition-all"
                  >
                    {isVideoPlaying ? (
                      <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </button>
                </div>
                {/* Contrôles audio */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black/90 transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </>
            ) : (
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="h-full w-full object-cover cursor-pointer hover:brightness-110 transition-all"
                onClick={handleClick}
              />
            )}
          </div>

          {/* Contenu texte */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-center">
            <h2 className="text-sm sm:text-base font-extralight tracking-widest md:text-lg lg:text-xl text-slate-900 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
              {ad.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {ad.description}
            </p>

            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex items-center text-[10px] sm:text-xs text-gray-500 w-full sm:w-auto">
                <span>Visible pendant :</span>
                <span className="font-medium ml-1 sm:ml-2">{displayDuration} min</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                Voir plus
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        /* Styles spécifiques pour les positions left/right */
.advertisement-side-position {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.advertisement-side-position:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation d'entrée pour les positions latérales */
@keyframes slideInFromSide {
  from {
    opacity: 0;
    transform: translateX(var(--slide-distance, 20px));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.advertisement-position-left .advertisement-side-position {
  --slide-distance: -20px;
  animation: slideInFromSide 0.5s ease-out;
}

.advertisement-position-right .advertisement-side-position {
  --slide-distance: 20px;
  animation: slideInFromSide 0.5s ease-out;
}

/* Responsive pour les positions latérales */
@media (max-width: 768px) {
  .advertisement-side-position {
    max-width: 180px !important;
    min-height: 220px !important;
    max-height: 300px !important;
  }
}

@media (max-width: 640px) {
  .advertisement-side-position {
    max-width: 150px !important;
    min-height: 200px !important;
    max-height: 250px !important;
  }
  
  .advertisement-side-position .absolute {
    right: 0.5rem !important;
    top: 0.5rem !important;
  }
}
      `}
      </style>
    </motion.article>
  );
};

const AdvertisementPopup: React.FC<Props> = ({
  refreshMinutes = 3,
  displayDuration = 2,
  listThreshold = 2,
  size = "small", // "small" | "medium" | "large"
  position // "header", "sidebar", "footer", "popup", etc.
}) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [nextAdTimer, setNextAdTimer] = useState<NodeJS.Timeout | null>(null);
  const [shownAdIds, setShownAdIds] = useState<Set<string>>(new Set());
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

  const fetchAdvertisements = async () => {
    try {
      // Récupérer les pubs actives pour cette position spécifique
      const response = await api.get(`/advertisements/active?position=${position}`);
      const data = response.data;

      if (data.advertisements && data.advertisements.length > 0) {
        // Trier les publicités par priorité (1 à 10) pour cette section
        const sortedAds = data.advertisements.sort((a: Advertisement, b: Advertisement) => {
          return a.priority - b.priority; // Ordre croissant: 1, 2, 3...
        });

        setAdvertisements(sortedAds);

        // Trouver la pub avec la priorité la plus haute (1) non encore affichée
        const adsToShow = sortedAds.filter(ad => !shownAdIds.has(ad.id));

        if (adsToShow.length > 0) {
          // Prendre la première (priorité la plus haute) parmi celles non affichées
          const nextAd = adsToShow[0];
          const nextIndex = sortedAds.findIndex(ad => ad.id === nextAd.id);
          setCurrentAdIndex(nextIndex);
          setVisible(true);

          // Ajouter à la liste des pubs déjà affichées
          setShownAdIds(prev => new Set([...prev, nextAd.id]));
        } else {
          // Toutes les pubs de cette section ont été montrées
          // On pourrait soit réinitialiser, soit ne rien montrer
          setVisible(false);
        }
      } else {
        console.warn(`Aucune publicité active trouvée pour la position: ${position}`);
        setVisible(false);
      }
    } catch (error) {
      console.error("Erreur chargement publicité :", error);
      setVisible(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();

    const interval = setInterval(fetchAdvertisements, refreshMinutes * 60 * 1000);
    return () => {
      clearInterval(interval);
      if (nextAdTimer) clearTimeout(nextAdTimer);
    };
  }, [refreshMinutes, position]);

  const scheduleNextAd = () => {
    // Nettoyer tout timer existant
    if (nextAdTimer) {
      clearTimeout(nextAdTimer);
    }

    // Planifier la prochaine publicité dans 3 minutes
    const timer = setTimeout(() => {
      // Trouver la prochaine pub non affichée dans cette section
      const remainingAds = advertisements.filter(ad => !shownAdIds.has(ad.id));

      if (remainingAds.length > 0) {
        // Prendre celle avec la priorité la plus haute
        const nextAd = remainingAds[0];
        const nextIndex = advertisements.findIndex(ad => ad.id === nextAd.id);
        setCurrentAdIndex(nextIndex);
        setVisible(true);

        // Ajouter à la liste des pubs déjà affichées
        setShownAdIds(prev => new Set([...prev, nextAd.id]));
      } else {
        // Toutes les pubs de cette section ont été montrées
        // Option 1: Réinitialiser pour recommencer le cycle
        // setShownAdIds(new Set());
        // const firstAd = advertisements[0];
        // setCurrentAdIndex(0);
        // setVisible(true);
        // setShownAdIds(prev => new Set([...prev, firstAd.id]));

        // Option 2: Ne rien afficher (actuellement)
        console.log(`Toutes les pubs de la section ${position} ont été affichées`);
      }
    }, 3 * 60 * 1000); // 3 minutes

    setNextAdTimer(timer);
  };

  const handleAdClose = (adId: string, clicked: boolean = false) => {
    // Fermer la publicité courante
    setVisible(false);

    // Si l'utilisateur a cliqué ou fermé manuellement, programmer la suivante
    if (advertisements.length > shownAdIds.size) {
      scheduleNextAd();
    }

    // Mettre à jour les statistiques
    if (clicked) {
      api.post(`/advertisements/${adId}/click`);
    } else {
      api.post(`/advertisements/${adId}/impression`);
    }
  };

  const handleAdClick = (adId: string, targetUrl?: string) => {
    // Fermer la publicité immédiatement
    handleAdClose(adId, true);

    // Ouvrir l'URL cible si elle existe
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Réinitialiser les pubs affichées quand on change de section
  useEffect(() => {
    setShownAdIds(new Set());
    setCurrentAdIndex(0);
    if (nextAdTimer) clearTimeout(nextAdTimer);
  }, [position]);

  if (!visible || advertisements.length === 0 || currentAdIndex >= advertisements.length) {
    return null;
  }

  const currentAd = advertisements[currentAdIndex];
  const progress = ((shownAdIds.size) / advertisements.length) * 100;

  if (isMobile && position !== "pop-up") return null;

  return (
    <div className={`advertisement-container advertisement-${position}`}>
      <div className="space-y-2 sm:space-y-3">

        {/* Affichage de la publicité courante */}
        <SingleAdvertisement
          key={`${currentAd.id}-${position}-${currentAdIndex}`}
          ad={currentAd}
          displayDuration={displayDuration}
          index={currentAdIndex}
          totalCount={advertisements.length}
          size={size}
          shownCount={shownAdIds.size}
          position={position}
          onClose={handleAdClose}
          onClick={handleAdClick}
        />

      </div>
    </div>
  );
};

export default AdvertisementPopup;