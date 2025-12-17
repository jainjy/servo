// src/components/AdvertisementPopup.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Pause, Volume2, VolumeX, Minimize2, ArrowRight } from 'lucide-react';

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
}

const AdvertisementPopup: React.FC<Props> = ({ refreshMinutes = 3, displayDuration = 2 }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [visible, setVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(displayDuration * 60); // en secondes
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  // Fonction pour formater le temps restant
  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/advertisements/active");
      const data = response.data;

      if (data.advertisements && data.advertisements.length > 0) {
        const randomAd = data.advertisements[Math.floor(Math.random() * data.advertisements.length)];
        setAd(randomAd);
        setVisible(true);

        // Réinitialiser l'état vidéo
        setIsVideoPlaying(false);
        setVideoProgress(0);
        setIsMuted(true);
        setIsMinimized(false);

        // Si c'est une image, on programme la fermeture après displayDuration minutes
        if (!isVideoAd(randomAd) && !isVideoUrl(randomAd.imageUrl)) {
          timeoutRef.current = setTimeout(() => {
            setVisible(false);
          }, displayDuration * 60 * 1000);
        }
      } else {
        console.warn("Aucune publicité active trouvée");
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [refreshMinutes]);

  // Lecture automatique de la vidéo
  useEffect(() => {
    if (visible && ad && currentAdIsVideo && videoRef.current) {
      const playVideo = async () => {
        try {
          await videoRef.current?.play();
          setIsVideoPlaying(true);
        } catch (error) {
          console.warn("Lecture automatique bloquée:", error);
        }
      };

      const timer = setTimeout(playVideo, 300);
      return () => clearTimeout(timer);
    }
  }, [visible, ad]);

  // Fonction pour déterminer si c'est une vidéo
  const isVideoAd = (advertisement: Advertisement) => advertisement?.type === 'video';

  // Fonction pour obtenir l'extension du fichier
  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase();
  };

  // Fonction pour vérifier si l'URL est une vidéo
  const isVideoUrl = (url: string) => {
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
    const extension = getFileExtension(url);
    return extension ? videoExtensions.includes(extension) : false;
  };

  // Vérifier si l'annonce actuelle est une vidéo
  const currentAdIsVideo = ad ? (isVideoAd(ad) || isVideoUrl(ad.imageUrl)) : false;

  // Compte à rebours du minuteur
  useEffect(() => {
    if (visible && !currentAdIsVideo) {
      setTimeLeft(displayDuration * 60);
      
      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setVisible(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      };
    }
  }, [visible, currentAdIsVideo, displayDuration]);

  // Gestion des événements vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentAdIsVideo) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => {
      setIsVideoPlaying(false);
      // Fermer le popup quand la vidéo se termine
      setTimeout(() => setVisible(false), 10000);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentAdIsVideo]);

  // Gestion du clic sur la vidéo
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  // Gestion du son
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Minimiser la vidéo
  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleClick = async () => {
    if (ad) {
      try {
        await api.post(`/advertisements/${ad.id}/click`);
      } catch (error) {
        console.error("Erreur enregistrement clic :", error);
      }

      if (ad.targetUrl) {
        window.open(ad.targetUrl, "_blank");
      }

      setVisible(false);
    }
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && ad && (
        <motion.article
          key="advertisement"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 250,
            duration: 0.6
          }}
          className="relative w-full overflow-hidden min-h-[140px] max-w-7xl mx-auto rounded-2xl border border-slate-200 my-5 bg-white shadow-lg"
        >
          {/* Badge Publicité avec compteur */}
          <div className="absolute right-3 top-3 z-10 flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <span className="rounded-full bg-secondary-text px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                  Publicité
                </span>
              </div>
              <span className="relative rounded-full bg-secondary-text px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Publicité
              </span>
            </div>
            
            {/* Compteur */}
            <div className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
              <svg 
                className="w-3 h-3 mr-1" 
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
              <span>{formatTimeLeft(timeLeft)}</span>
            </div>
            {/* Bouton fermeture */}
            <button
              title="Fermer la publicité"
              onClick={handleClose}
              className="rounded-lg bg-red-600 py-0 px-3 text-gray-100 hover:text-gray-200 transition-colors z-20"
            >
              <span className="text-xl">&times;</span>
            </button>
          </div>

          <div className="flex flex-row">
            {/* Media - Image/Vidéo */}
            <div className="w-40 sm:w-56 md:w-64 h-32 sm:h-40 md:h-44 flex-shrink-0 bg-slate-100 relative group">
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
                  {/* Contrôles vidéo au survol */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoClick(e);
                      }}
                      className="bg-white/90 text-black rounded-full p-3 hover:bg-white transition-all"
                    >
                      {isVideoPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>
                  </div>
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
            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
              <h2 className="text-base font-extralight tracking-widest sm:text-lg md:text-xl text-slate-900 mb-1 sm:mb-2">
                {ad.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-sm text-slate-600 leading-relaxed line-clamp-3">
                {ad.description}
              </p>
              
              {/* Indicateur de durée en bas */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <span>Visible pendant :</span>
                  <span className="font-medium ml-2">{displayDuration} min</span>
                </div>

                {/* Bouton CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
                >
                  Voir plus
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            
          </div>
        </motion.article>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;