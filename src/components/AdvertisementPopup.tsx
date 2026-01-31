import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAdvertisementForPosition } from './AdvertisementProvider';
import { ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import api from "@/lib/api";

interface Props {
  position: string;
  displayDuration?: number; // en secondes
  size?: "small" | "medium" | "large";
  showOnMobile?: boolean;
  autoRotateInterval?: number; // en minutes
  maxAdsPerSession?: number;
  onAdShow?: (adId: string) => void;
  onAdClick?: (adId: string) => void;
}

const AdvertisementPopup: React.FC<Props> = ({
  position,
  displayDuration = 30, // 30 secondes par défaut
  size = "small",
  showOnMobile = false,
  autoRotateInterval = 3,
  maxAdsPerSession = 5,
  onAdShow,
  onAdClick
}) => {
  const {
    ads,
    nextAd,
    markAsShown,
    markAsClicked,
    hasAds,
    adsCount
  } = useAdvertisementForPosition(position);

  const [currentAd, setCurrentAd] = useState(nextAd);
  const [visible, setVisible] = useState(false);
  const [rotationTimer, setRotationTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shownAdsInSession, setShownAdsInSession] = useState<Set<string>>(new Set());
  const [sessionAdCount, setSessionAdCount] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper function to check if URL is a video
  const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv'];
    const urlLower = url.toLowerCase();
    
    return videoExtensions.some(ext => urlLower.includes(ext)) || 
           urlLower.includes('/video/') || 
           urlLower.includes('.m3u8') || 
           urlLower.includes('.mpd');
  };

  // Helper function to get file extension
  const getFileExtension = (url: string): string => {
    if (!url) return '';
    const urlParts = url.split('?')[0]; // Remove query parameters
    const filename = urlParts.split('/').pop() || '';
    const extension = filename.split('.').pop() || '';
    return extension.toLowerCase();
  };

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mettre à jour la pub courante quand nextAd change
  useEffect(() => {
    if (nextAd && (!currentAd || currentAd.id !== nextAd.id)) {
      setCurrentAd(nextAd);
      // Reset video state when ad changes
      setIsVideoPlaying(false);
      setIsMuted(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [nextAd, currentAd]);

  // Contrôler la vidéo
  useEffect(() => {
    if (currentAd && currentAd.imageUrl && isVideoUrl(currentAd.imageUrl)) {
      if (visible && isVideoPlaying && videoRef.current) {
        videoRef.current.play().catch(error => {
          console.error("Erreur de lecture vidéo:", error);
          setIsVideoPlaying(false);
        });
      } else if (!isVideoPlaying && videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [visible, isVideoPlaying, currentAd]);

  // Afficher la pub courante
  useEffect(() => {
    if (currentAd && hasAds && sessionAdCount < maxAdsPerSession) {
      // Vérifier si cette pub a déjà été montrée dans cette session
      if (!shownAdsInSession.has(currentAd.id)) {
        const timer = setTimeout(() => {
          setVisible(true);
          markAsShown(currentAd.id);
          setShownAdsInSession(prev => new Set([...prev, currentAd.id]));
          setSessionAdCount(prev => prev + 1);

          // Auto-play video if it's a video ad
          if (currentAd.imageUrl && isVideoUrl(currentAd.imageUrl)) {
            setIsVideoPlaying(true);
          }

          if (onAdShow) {
            onAdShow(currentAd.id);
          }

        }, 1000); // Délai de 1 seconde avant affichage

        return () => clearTimeout(timer);
      }
    }
  }, [currentAd, hasAds, position, onAdShow, markAsShown, shownAdsInSession, sessionAdCount, maxAdsPerSession]);

  // Rotation automatique
  useEffect(() => {
    if (visible && autoRotateInterval > 0 && sessionAdCount < maxAdsPerSession) {
      const timer = setTimeout(() => {
        rotateToNextAd();
      }, autoRotateInterval * 60 * 1000);

      setRotationTimer(timer);

      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [visible, autoRotateInterval, sessionAdCount, maxAdsPerSession]);

  // Fermeture automatique après displayDuration
  useEffect(() => {
    if (visible && displayDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, displayDuration * 1000);

      return () => clearTimeout(timer);
    }
  }, [visible, displayDuration]);

  // Gérer la fin de la vidéo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !currentAd || !isVideoUrl(currentAd.imageUrl || '')) return;

    const handleVideoEnd = () => {
      setIsVideoPlaying(false);
      // Optionnel: rejouer la vidéo en boucle
      // videoElement.currentTime = 0;
      // videoElement.play();
    };

    videoElement.addEventListener('ended', handleVideoEnd);
    return () => videoElement.removeEventListener('ended', handleVideoEnd);
  }, [currentAd]);

  // Trouver la prochaine pub
  const rotateToNextAd = useCallback(() => {
    if (sessionAdCount >= maxAdsPerSession) {
      setVisible(false);
      return;
    }

    const availableAds = ads.filter(ad => !shownAdsInSession.has(ad.id));

    if (availableAds.length > 0) {
      // Prendre la pub avec la plus haute priorité (priorité la plus basse)
      const nextAd = availableAds.reduce((prev, current) =>
        (prev.priority < current.priority) ? prev : current
      );

      setCurrentAd(nextAd);
      setVisible(false); // Fermer avant d'afficher la suivante

      // Réafficher après un court délai
      setTimeout(() => {
        setVisible(true);
        markAsShown(nextAd.id);
        setShownAdsInSession(prev => new Set([...prev, nextAd.id]));
        setSessionAdCount(prev => prev + 1);
      }, 1000);
    } else {
      // Toutes les pubs ont été affichées dans cette session
      setVisible(false);
      setCurrentAd(null);

      // Réinitialiser après un délai (par exemple 30 minutes)
      setTimeout(() => {
        setShownAdsInSession(new Set());
        setSessionAdCount(0);
        if (ads.length > 0) {
          setCurrentAd(ads[0]);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }, [ads, shownAdsInSession, sessionAdCount, maxAdsPerSession, markAsShown]);
  
  const handleClose = useCallback(() => {
    setVisible(false);
    if (rotationTimer) clearTimeout(rotationTimer);

    // Pause video when closing
    if (videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }

    // Enregistrer l'impression si une publicité est affichée
    if (currentAd) {
      api.post(`/advertisements/${currentAd.id}/impression`)
        .catch(error => console.error("Erreur enregistrement impression :", error));
    }

    // Planifier la prochaine pub après un délai
    if (sessionAdCount < maxAdsPerSession) {
      setTimeout(() => {
        rotateToNextAd();
      }, 5000); // 5 secondes entre les pubs
    }
  }, [rotationTimer, rotateToNextAd, sessionAdCount, maxAdsPerSession, currentAd]);

  const handleClick = useCallback(async () => {
    if (currentAd) {
      markAsClicked(currentAd.id);

      try {
        await api.post(`/advertisements/${currentAd.id}/click`);
      } catch (error) {
        console.error("Erreur enregistrement clic :", error);
      }

      if (onAdClick) {
        onAdClick(currentAd.id);
      }

      // Ouvrir l'URL cible
      if (currentAd.targetUrl) {
        window.open(currentAd.targetUrl, '_blank', 'noopener,noreferrer');
      }

      handleClose();
    }
  }, [currentAd, onAdClick, handleClose, markAsClicked]);

  const toggleVideoPlay = () => {
    if (!currentAd?.imageUrl || !isVideoUrl(currentAd.imageUrl)) return;
    
    setIsVideoPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    // If it's a video, handle play/pause instead of immediate click
    if (currentAd?.imageUrl && isVideoUrl(currentAd.imageUrl)) {
      e.stopPropagation();
      toggleVideoPlay();
    } else {
      handleClick();
    }
  };

  // Ne pas afficher sur mobile si showOnMobile est false
  if (isMobile && !showOnMobile) {
    return null;
  }

  // Ne rien afficher si pas de pub ou limite atteinte
  if (!currentAd || !visible || sessionAdCount >= maxAdsPerSession) {
    return null;
  }

  // Calculer le temps restant
  const progress = (shownAdsInSession.size / Math.min(adsCount, maxAdsPerSession)) * 100;
  const adsRemaining = Math.max(0, maxAdsPerSession - sessionAdCount);

  const normalizedPos = position.toLowerCase();
  const isVideoAd = currentAd.imageUrl && isVideoUrl(currentAd.imageUrl);

  // true si la position force un layout "miroir"
  const shouldMirror =
    normalizedPos.includes("left") || normalizedPos.includes("right");

  const renderMedia = () => {
    if (!currentAd.imageUrl) return null;

    if (isVideoAd) {
      return (
        <div className="relative h-full w-full group">
          <video
            ref={videoRef}
            src={currentAd.imageUrl}
            className="h-full w-full object-cover cursor-pointer"
            onClick={handleVideoClick}
            muted={isMuted}
            playsInline
            loop={false}
            preload="metadata"
          />
          
          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-3 bg-black/70 rounded-full px-4 py-2">
              <button
                onClick={toggleVideoPlay}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isVideoPlaying ? "Pause" : "Play"}
              >
                {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
          
          {/* Video indicator */}
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Vidéo
          </div>
        </div>
      );
    }

    return (
      <img
        src={currentAd.imageUrl}
        alt={currentAd.title}
        className="h-full w-full object-cover cursor-pointer hover:brightness-110 transition-all"
        onClick={handleClick}
      />
    );
  };

  if (shouldMirror) {
    return (
      <div className={`w-[250px] h-auto rounded-sm bg-white`}>
        <div className="relative">
          <div className='absolute flex gap-2 right-5'>
            <span className="rounded-full bg-secondary-text px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Publicité
            </span>
            <button className="px-1 bg-gray-500/50 rounded-full" onClick={handleClose} title="Fermer">
              ×
            </button>
          </div>

          <div className='w-full h-full px-5 py-6'>
            {renderMedia()}
          </div>

          <div className="ad-text">
            <h2 className="text-sm sm:text-base tracking-widest md:text-lg lg:text-xl text-slate-900 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
              {currentAd.title}
            </h2>
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              Voir plus
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='w-full mx-auto flex justify-center'>
        <div className="relative bg-white flex flex-col sm:flex-row rounded-2xl overflow-hidden">
          <div className='absolute flex gap-2 right-5'>
            <span className="rounded-full bg-secondary-text px-2 py-0.5 text-[6px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Publicité
            </span>
            <button className="px-1 bg-gray-500/50 rounded-full" onClick={handleClose} title="Fermer">
              ×
            </button>
          </div>
          
          {/* Media - Image/Vidéo */}
          <div className="w-full h-32 sm:w-40 md:w-56 lg:w-64 sm:h-40 md:h-44 flex-shrink-0 bg-slate-100 relative group">
            {renderMedia()}
          </div>

          {/* Contenu texte */}
          <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-center">
            <h2 className="text-sm sm:text-base font-extralight tracking-widest md:text-lg lg:text-xl text-slate-900 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
              {currentAd.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
              {currentAd.description}
            </p>

            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-between flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex items-center text-[10px] sm:text-xs text-gray-500 w-full sm:w-auto">
                <span>Visible pendant :</span>
                <span className="font-medium ml-1 sm:ml-2">2 min</span>
              </div>

              <button
                onClick={handleClick}
                className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                Voir plus
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AdvertisementPopup;