// src/components/AdvertisementPopup.tsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Video, Play, Pause, Volume2, VolumeX, Minimize2 } from 'lucide-react';

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

const AdvertisementPopup: React.FC<Props> = ({ refreshMinutes = 3, displayDuration = 10 }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [visible, setVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

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
        
        // Si c'est une image, on programme la fermeture après 10 secondes
        if (!isVideoAd(randomAd) && !isVideoUrl(randomAd.imageUrl)) {
          timeoutRef.current = setTimeout(() => {
            setVisible(false);
          }, displayDuration * 1000);
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
      setTimeout(() => setVisible(false), 1000);
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
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 100 }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 200,
            duration: 0.5
          }}
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-gray-300 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95 ${
            isMinimized && currentAdIsVideo 
              ? "w-80"  // Taille réduite
              : "w-96"  // Taille normale
          }`}
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 30px -5px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="relative">
            {/* Affichage conditionnel : Vidéo ou Image */}
            {currentAdIsVideo ? (
              <div className={`bg-black flex items-center justify-center cursor-pointer relative ${
                isMinimized ? "h-44" : "h-56"  // Hauteur réduite en mode minimisé
              }`}>
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
                
                {/* Overlay de contrôle */}
                {!isVideoPlaying && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 cursor-pointer"
                    onClick={handleVideoClick}
                  >
                    <div className="bg-white/30 rounded-full p-4 backdrop-blur-sm hover:bg-white/40 transition-all duration-300">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}

                {/* Indicateur de statut de lecture */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-black/80 text-white text-xs px-2 py-1">
                    <Video className="w-3 h-3 mr-1" />
                    Vidéo
                  </Badge>
                </div>

                {/* Barre de progression de la vidéo */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-700/80">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Contrôles vidéo */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  {/* Bouton minimiser */}
                  <button
                    onClick={toggleMinimize}
                    className="bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-black/80 transition-all duration-200"
                    title={isMinimized ? "Agrandir" : "Réduire"}
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>

                  {/* Bouton son */}
                  <button
                    onClick={toggleMute}
                    className="bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-black/80 transition-all duration-200"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3 h-3" />
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>

                  {/* Bouton play/pause */}
                  {isVideoPlaying && (
                    <button
                      onClick={handleVideoClick}
                      className="bg-black/60 text-white rounded-full p-1.5 backdrop-blur-sm hover:bg-black/80 transition-all duration-200"
                    >
                      <Pause className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Temps restant */}
                {!isMinimized && (
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                      {Math.round(videoProgress)}%
                    </Badge>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="h-56 relative">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={handleClick}
                  />
                  
                  {/* Indicateur pour les images */}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-black/80 text-white text-xs px-2 py-1">
                      Publicité
                    </Badge>
                  </div>

                  {/* Progress bar pour les images (10 secondes) */}
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: displayDuration, ease: "linear" }}
                    className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 z-10"
                  />

                  {/* Compte à rebours */}
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="bg-black/60 text-white text-xs">
                      {displayDuration}s
                    </Badge>
                  </div>
                </div>
              </>
            )}
            
            {/* Bouton de fermeture */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.8)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center backdrop-blur-sm transition-all duration-200 z-20 hover:bg-black/80"
            >
              ✕
            </motion.button>
          </div>
          
          {/* Contenu texte - caché en mode minimisé pour les vidéos */}
          {(!isMinimized || !currentAdIsVideo) && (
            <div className="p-4">
              <motion.h4 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-bold text-gray-900 text-lg mb-2 line-clamp-2"
              >
                {ad.title}
              </motion.h4>
              
              <motion.p 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2"
              >
                {ad.description}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center"
              >
                <div className="text-xs text-gray-500">
                  {currentAdIsVideo ? (
                    <div className="flex items-center gap-1">
                      <span>{isMinimized ? "En cours" : "Regardez jusqu'à la fin"}</span>
                    </div>
                  ) : (
                    `Disparaît dans ${displayDuration}s`
                  )}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClick}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 hover:from-blue-600 hover:to-purple-600"
                >
                  {currentAdIsVideo ? (
                    <>
                      <Play className="w-3 h-3" />
                      {isVideoPlaying ? "En cours..." : "Découvrir"}
                    </>
                  ) : (
                    "Découvrir"
                  )}
                </motion.button>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;