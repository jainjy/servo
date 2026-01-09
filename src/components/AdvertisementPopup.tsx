// src/components/AdvertisementPopup.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Pause, Volume2, VolumeX, Minimize2, ArrowRight, Grid, List } from 'lucide-react';

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
}

// Composant pour une publicité individuelle
const SingleAdvertisement: React.FC<{
  ad: Advertisement;
  displayDuration: number;
  index: number;
  onClose: (id: string) => void;
}> = ({ ad, displayDuration, index, onClose }) => {
  const [visible, setVisible] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [timeLeft, setTimeLeft] = useState(displayDuration * 60);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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
  }, [visible, ad, currentAdIsVideo]);

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

  useEffect(() => {
    if (visible && !currentAdIsVideo) {
      setTimeLeft(displayDuration * 60);

      countdownRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setVisible(false);
            onClose(ad.id);
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
  }, [visible, currentAdIsVideo, displayDuration, ad.id, onClose]);

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
    setVisible(false);
    onClose(ad.id);
  };

  return (
    <AnimatePresence>
      {visible && (
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
          className="relative w-full overflow-hidden min-h-[180px] sm:min-h-[140px] max-w-7xl mx-auto rounded-xl sm:rounded-2xl border border-slate-200 my-2 sm:my-3 bg-white shadow-md sm:shadow-lg"
        >
          {/* Badge et contrôles */}
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 z-10 flex items-center space-x-1 sm:space-x-2">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <span className="rounded-full bg-secondary-text px-2 py-0.5 text-[8px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                  Publicité
                </span>
              </div>
              <span className="relative rounded-full bg-secondary-text px-2 py-0.5 text-[8px] sm:px-3 sm:py-1 sm:text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
                Publicité
              </span>
            </div>

            {!currentAdIsVideo && (
              <div className="flex items-center bg-gray-800 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium">
                <svg
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1"
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
            )}
            <button
              title="Fermer la publicité"
              onClick={handleClose}
              className="rounded-lg bg-red-600 py-0 px-2 sm:px-3 text-gray-100 hover:text-gray-200 transition-colors z-20 text-lg sm:text-xl"
            >
              <span className="text-lg sm:text-xl">&times;</span>
            </button>
          </div>

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
        </motion.article>
      )}
    </AnimatePresence>
  );
};

const AdvertisementPopup: React.FC<Props> = ({
  refreshMinutes = 3,
  displayDuration = 2,
  listThreshold = 2
}) => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [visibleAds, setVisibleAds] = useState<Set<string>>(new Set());
  const [useListView, setUseListView] = useState(false);
  const [visible, setVisible] = useState(false);

  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/advertisements/active");
      const data = response.data;

      if (data.advertisements && data.advertisements.length > 0) {
        setAdvertisements(data.advertisements);
        setUseListView(data.advertisements.length > listThreshold);

        // Initialiser tous les ads comme visibles
        const allAdIds = new Set<string>(data.advertisements.map(ad => ad.id));
        setVisibleAds(allAdIds);
        setVisible(true);
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
    };
  }, [refreshMinutes]);

  const handleAdClose = (adId: string) => {
    setVisibleAds(prev => {
      const newSet = new Set(prev);
      newSet.delete(adId);
      if (newSet.size === 0) {
        setVisible(false);
      }
      return newSet;
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {useListView ? (
            // Mode liste : afficher tous les AdvertisementPopup
            <div className="w-full">
              {advertisements.map((ad, index) => (
                <SingleAdvertisement
                  key={ad.id}
                  ad={ad}
                  displayDuration={displayDuration}
                  index={index}
                  onClose={handleAdClose}
                />
              ))}
            </div>
          ) : (
            // Mode popup classique : afficher chaque publicité individuellement
            <div className="w-full">
              {advertisements.map((ad, index) => (
                <SingleAdvertisement
                  key={ad.id}
                  ad={ad}
                  displayDuration={displayDuration}
                  index={index}
                  onClose={handleAdClose}
                />
              ))}
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;