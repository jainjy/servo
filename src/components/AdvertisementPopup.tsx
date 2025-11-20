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
        <motion.div
          key="advertisement"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 250,
            duration: 0.6
          }}
          className={`w-full shadow-2xl overflow-hidden backdrop-blur-xl ${isMinimized && currentAdIsVideo
              ? "max-w-md"  // Taille réduite
              : "min-h-[400px]"  // Taille normale avec hauteur minimale
            }`}
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.99) 100%)',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 8px 25px -5px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.6)'
          }}
        >
          <div className="flex flex-col lg:flex-row h-full">
            {/* Colonne de gauche - Média (Image/Video) */}
            <div className={`flex-shrink-0 ${isMinimized && currentAdIsVideo
                ? "w-full"
                : "lg:w-2/5 w-full lg:h-full"
              }`}>
              {currentAdIsVideo ? (
                <div className={`bg-gradient-to-br from-gray-900 to-black relative h-full min-h-[400px] ${isMinimized ? "min-h-[200px]" : ""
                  }`}>
                  {/* Conteneur vidéo qui remplit toute la hauteur */}
                  <div className="absolute inset-4 rounded-xl overflow-hidden">
                    <video
                      ref={videoRef}
                      src={ad.imageUrl}
                      className="w-full h-full object-cover"
                      muted={isMuted}
                      playsInline
                      autoPlay
                      loop={false}
                      onClick={handleVideoClick}
                    />
                  </div>

                  {/* Badge vidéo */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/60 text-sm px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 font-medium">
                      <Video className="w-4 h-4 mr-2 inline" />
                      Vidéo Promotionnelle
                    </div>
                  </div>

                  {/* Barre de progression */}
                  <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-800/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-200 rounded-full"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  {/* Contrôles vidéo */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-3">


                    <button
                      onClick={toggleMute}
                      className="bg-black/50 text-white rounded-xl p-3 backdrop-blur-sm hover:bg-black/70 transition-all duration-200 shadow-lg"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Bouton play/pause visible pendant la lecture */}
                    {isVideoPlaying && (
                      <button
                        onClick={handleVideoClick}
                        className="bg-black/50 text-white rounded-xl p-3 backdrop-blur-sm hover:bg-black/70 transition-all duration-200 shadow-lg"
                      >
                        <Pause className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Indicateur de progression */}
                  {!isMinimized && (
                    <div className="absolute top-6 right-6">
                      <div className="bg-black/50 text-white text-base px-4 py-2 rounded-full backdrop-blur-sm font-medium">
                        {Math.round(videoProgress)}% complété
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full min-h-96 p-4 relative bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-4 rounded-xl overflow-hidden">
                    <img
                      src={ad.imageUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={handleClick}
                    />
                  </div>

                  {/* Badge publicité */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-gradient-to-r from-emerald-600/90 to-teal-600/90 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 font-medium">
                      Publicité Exclusive
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-4 left-4 right-4 h-2 bg-gray-800/60 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: displayDuration * 60, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>

                  {/* Minuteur stylisé */}
                  <div className="absolute bottom-4 right-4">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-full backdrop-blur-sm font-mono font-bold text-lg shadow-lg flex items-center gap-2 border border-emerald-400/30"
                      animate={{
                        scale: timeLeft <= 10 ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: timeLeft <= 10 ? 1 : 0,
                        repeat: timeLeft <= 10 ? Infinity : 0,
                      }}
                    >
                      <motion.div
                        animate={{
                          scale: timeLeft <= 10 ? [1, 1.3, 1] : 1,
                        }}
                        transition={{
                          duration: timeLeft <= 10 ? 1 : 0,
                          repeat: timeLeft <= 10 ? Infinity : 0,
                        }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                      {formatTimeLeft(timeLeft)}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>

            {/* Colonne de droite - Contenu (uniquement si pas minimisé) */}
            {(!isMinimized || !currentAdIsVideo) && (
              <div className="flex-1 p-8 flex flex-col justify-between lg:h-full">
                {/* En-tête avec titre et bouton fermeture */}
                <div className="flex justify-between items-start mb-6">
                  <motion.h4
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-bold text-gray-900 text-3xl lg:text-4xl leading-tight pr-10 line-clamp-3 flex-1"
                  >
                    {ad.title}
                  </motion.h4>

                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="flex-shrink-0 bg-gray-200/80 text-gray-600 rounded-xl w-10 h-10 text-lg flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:bg-gray-300/80 ml-4"
                  >
                    ✕
                  </motion.button>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-xl leading-relaxed mb-8 line-clamp-4 flex-1"
                >
                  {ad.description}
                </motion.p>

                {/* Pied de page avec CTA et informations */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  {/* Informations de statut */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg text-gray-500 font-medium">
                      {currentAdIsVideo ? (
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isVideoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                            }`}></div>
                          <span className="text-xl">
                            {isMinimized ? "Lecture en cours..." : `${Math.round(videoProgress)}% de la vidéo visionnée`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xl">Disparaît dans {displayDuration} min</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton d'action principal */}
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 12px 30px rgba(79, 70, 229, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClick}
                    className="w-auto px-8 py-5 bg-slate-900 text-white font-bold text-lg rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-lg"
                  >
                    {currentAdIsVideo ? (
                      <>
                        <Play className="w-6 h-6" />
                        {isVideoPlaying ? "Continuer à regarder" : "Découvrir l'offre exclusive"}
                      </>
                    ) : (
                      <>
                        <span>Découvrir maintenant</span>
                        <ArrowRight className="w-6 h-6" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;