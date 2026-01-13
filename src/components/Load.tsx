import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadingTime?: number;
}

// Données pour les cartes (VOTRE CODE ORIGINAL)
const cardData = [
  {
    id: 1,
    type: 'image',
    src:"https://i.pinimg.com/1200x/ce/0c/29/ce0c29e8773ca7ce123f1d705677c8cd.jpg",
    title: 'Plages paradisiaques',
    color: '#3A7CA5',
  },
  {
    id: 2,
    type: 'image',
    src: 'https://i.pinimg.com/736x/fd/8c/53/fd8c53667cb821937c526bcb55e63271.jpg',
    title: 'Montagnes verdoyantes',
    color: '#2E933C',
  },
  {
    id: 3,
    type: 'video',
    src: 'vid1.mp4',
    title: 'Océan Indien',
    color: '#0B5563',
  },
  {
    id: 4,
    type: 'image',
    src: 'https://i.pinimg.com/1200x/49/10/51/4910519781331bda9add8a091379e426.jpg',
    title: 'Culture locale',
    color: '#7D4E57',
  },
  {
    id: 5,
    type: 'video',
    src: 'vid2.mp4',
    title: 'Couchers de soleil',
    color: '#E28413',
  },
  {
    id: 6,
    type: 'image',
    src: 'https://i.pinimg.com/736x/5c/10/24/5c102464cb7cd9ade5028239fb746a6f.jpg',
    title: 'Plages paradisiaques',
    color: '#3A7CA5',
  },
  {
    id: 7,
    type: 'image',
    src: 'https://i.pinimg.com/736x/9b/09/40/9b094085219de8b43227a154e934d3ed.jpg',
    title: 'Montagnes verdoyantes',
    color: '#2E933C',
  },
  {
    id: 8,
    type: 'video',
    src: 'vid3.mp4',
    title: 'Océan Indien',
    color: '#0B5563',
  },
  {
    id: 9,
    type: 'image',
    src: 'https://i.pinimg.com/736x/b1/0d/5b/b10d5bf8e83151e3e73546d7ee4c6811.jpg',
    title: 'Culture locale',
    color: '#7D4E57',
  },
  {
    id: 10,
    type: 'image',
    src: 'https://i.pinimg.com/736x/ac/35/aa/ac35aa6ed326403db1758183a49e6f34.jpg',
    title: 'Couchers de soleil',
    color: '#E28413',
  },
];

const currentYear = new Date().getFullYear();

// Données pour les partenaires - LOGOS PLUS GRANDS
const partners = [
  { 
    id: 1, 
    name: 'Olimmo', 
    logo: 'olimmo.png',
  },
  { 
    id: 2, 
    name: 'Partner 2', 
    logo: 'https://i.pinimg.com/736x/cc/3c/db/cc3cdb8498f8d4135b87f8501f3faa31.jpg',
  },
  { 
    id: 3, 
    name: 'Partner 3', 
    logo: 'https://i.pinimg.com/1200x/9d/1b/af/9d1baf24622b6c568ed6f41f826c7105.jpg',
  },
  { 
    id: 4, 
    name: 'Partner 4', 
    logo: 'https://i.pinimg.com/1200x/4d/7a/ec/4d7aecb5e539968fec979b35f5618527.jpg',
  },
  { 
    id: 5, 
    name: 'Partner 5', 
    logo: 'https://i.pinimg.com/736x/f0/64/d7/f064d7192801ed944991351e99efdbf2.jpg',
  },
  { 
    id: 6, 
    name: 'Partner 6', 
    logo: 'https://i.pinimg.com/736x/bb/d6/2a/bbd62ab19fe388ef4dac11d2f21be3f7.jpg',
  },
  { 
    id: 7, 
    name: 'Partner 7', 
    logo: 'https://i.pinimg.com/1200x/83/5d/9d/835d9d7c0f06a49b079418cd59914762.jpg',
  },
  { 
    id: 8, 
    name: 'Partner 8', 
    logo: 'https://i.pinimg.com/736x/52/52/5c/52525c7b87e0600a27bf66a9ec1e04f2.jpg',
  },
];

// Textes avec guillemets
const teamTexts = [
  "« L'innovation naît de la collaboration et de la passion partagée. »",
  "« Chaque projet est une nouvelle aventure, chaque succès une victoire collective. »",
  "« Notre force réside dans notre diversité et notre unité d'action. »",
  "« Ensemble, nous transformons les défis en opportunités extraordinaires. »",
  "« La confiance de nos clients est notre plus grande récompense. »"
];

// Variable globale pour empêcher le remontage
let globalExitInitiated = false;

// Timer pour le passage automatique (10 secondes)
const AUTO_EXIT_TIME = 10000; // 10 secondes

// ServoLogo component simple
const ServoLogo = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="#6B8E23" strokeWidth="3" fill="none" opacity="0.3"/>
    <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="#6B8E23" opacity="0.8"/>
    <circle cx="50" cy="50" r="8" fill="#fff"/>
  </svg>
);

export default function LoadingScreen({
  onLoadingComplete,
  minimumLoadingTime = 7500
}: LoadingScreenProps) {
  // États de base
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [fadeOutOpacity, setFadeOutOpacity] = useState(1);
  const [scaleEffect, setScaleEffect] = useState(1);
  const [blurEffect, setBlurEffect] = useState(0);
  const [brightnessEffect, setBrightnessEffect] = useState(1);
  const [showInitialLogo, setShowInitialLogo] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(new Set<number>());
  
  // État pour le texte animé
  const [textIndex, setTextIndex] = useState(0);
  
  // État pour le timer de sortie automatique
  const [timeLeft, setTimeLeft] = useState(AUTO_EXIT_TIME / 1000);
  const [autoExitTriggered, setAutoExitTriggered] = useState(false);

  // Références
  const exitInitiatedRef = useRef(false);
  const hasCalledCompleteRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const componentMountedRef = useRef(true);
  const hasStartedExitProcessRef = useRef(false);
  const animationRef = useRef<number>();
  const autoExitTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Références GSAP
  const bigLogoContainerRef = useRef<HTMLDivElement>(null);
  const bigServoLogoRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mainServoLogoRef = useRef<HTMLDivElement>(null);

  // Référence pour la section d'équipe
  const teamSectionRef = useRef<HTMLDivElement>(null);

  // Gestion du SessionStorage
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(() => {
    if (typeof window !== 'undefined') {
      const played = sessionStorage.getItem('VisitAnimation') === 'true' || globalExitInitiated;
      return played;
    }
    return false;
  });

  // Timer de sortie automatique (10 secondes)
  useEffect(() => {
    if (hasAnimationPlayed || globalExitInitiated || !initialLoadComplete || showInitialLogo) {
      return;
    }

    // Démarrer le compte à rebours
    const startTime = Date.now();
    const endTime = startTime + AUTO_EXIT_TIME;

    const updateTimer = () => {
      if (!componentMountedRef.current || hasAnimationPlayed || globalExitInitiated) {
        return;
      }

      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const secondsLeft = Math.ceil(remaining / 1000);
      
      if (componentMountedRef.current) {
        setTimeLeft(secondsLeft);
      }

      if (remaining <= 0 && !autoExitTriggered) {
        setAutoExitTriggered(true);
        handleExit(); // Déclencher la sortie automatique
      } else if (remaining > 0 && !autoExitTriggered) {
        autoExitTimerRef.current = setTimeout(updateTimer, 100);
      }
    };

    autoExitTimerRef.current = setTimeout(updateTimer, 100);

    return () => {
      if (autoExitTimerRef.current) {
        clearTimeout(autoExitTimerRef.current);
      }
    };
  }, [initialLoadComplete, showInitialLogo, hasAnimationPlayed, autoExitTriggered]);

  // Animation du texte qui change
  useEffect(() => {
    if (!initialLoadComplete || isExiting || hasAnimationPlayed) return;
    
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % teamTexts.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [initialLoadComplete, isExiting, hasAnimationPlayed]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (autoExitTimerRef.current) {
        clearTimeout(autoExitTimerRef.current);
      }
    };
  }, []);

  // SUIVI DU CHARGEMENT DES VIDÉOS
  useEffect(() => {
    if (hasAnimationPlayed || globalExitInitiated || !initialLoadComplete) {
      return;
    }

    const videoElements = videoRefs.current;
    
    const handleCanPlayThrough = (index: number) => {
      setVideosLoaded(prev => new Set(prev).add(index));
    };

    videoElements.forEach((video, index) => {
      if (video && cardData[index]?.type === 'video') {
        video.addEventListener('canplaythrough', () => handleCanPlayThrough(index));
      }
    });

    return () => {
      videoElements.forEach((video) => {
        if (video) {
          video.removeEventListener('canplaythrough', () => {});
        }
      });
    };
  }, [initialLoadComplete]);

  // Auto-défilement des cartes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cardData.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  // ANIMATION INITIALE GSAP
  useEffect(() => {
    if (hasAnimationPlayed || globalExitInitiated) {
      setShowInitialLogo(false);
      setInitialLoadComplete(true);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setShowInitialLogo(false);
        setInitialLoadComplete(true);
      }
    });

    tl.fromTo(bigLogoContainerRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1.2, opacity: 1, rotation: 0, duration: 1.5, ease: "back.out(1.7)" }
    );

    if (bigServoLogoRef.current) {
      tl.fromTo(bigServoLogoRef.current,
        { scale: 0.5, opacity: 0 },
        { scale: 1.3, opacity: 1, rotation: 0, duration: 1.2, ease: "power3.out" },
        "-=0.5"
      );

      tl.to(bigServoLogoRef.current,
        { scale: 1.4, duration: 0.3, ease: "power2.inOut", repeat: 2, yoyo: true },
        "-=0.3"
      );
    }

    tl.to(".loading-text",
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.5"
    );

    tl.to(bigLogoContainerRef.current,
      { scale: 0.8, y: -30, duration: 0.8, ease: "power2.inOut" }
    );

    tl.to(bigLogoContainerRef.current,
      { opacity: 0, scale: 0.6, duration: 0.5, ease: "power2.in" }
    );

    return () => {
      tl.kill();
    };
  }, [hasAnimationPlayed]);

  // Animation d'entrée de la section équipe
  useEffect(() => {
    if (!initialLoadComplete || showInitialLogo || hasAnimationPlayed || !teamSectionRef.current) return;

    gsap.fromTo(teamSectionRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      }
    );
  }, [initialLoadComplete, showInitialLogo, hasAnimationPlayed]);

  // LOGIQUE DE CHARGEMENT
  useEffect(() => {
    if (hasAnimationPlayed || globalExitInitiated || !initialLoadComplete) {
      return;
    }

    let animationFrameId: number;
    let isAnimationActive = true;

    const updateProgress = () => {
      if (!isAnimationActive || !componentMountedRef.current || hasAnimationPlayed || globalExitInitiated || !initialLoadComplete) {
        return;
      }

      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      const videosLoadedCount = videosLoaded.size;
      const videosInCardData = cardData.filter(card => card.type === 'video').length;
      
      let timeProgress = (elapsed / minimumLoadingTime) * 100;
      let videoProgress = videosLoadedCount > 0 
        ? (videosLoadedCount / videosInCardData) * 50 
        : 0;
      
      let newProgress = Math.min(100, timeProgress * 0.5 + videoProgress);

      if (componentMountedRef.current) {
        setProgress(newProgress);
      }

      if (newProgress < 100 && isAnimationActive && componentMountedRef.current) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      isAnimationActive = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minimumLoadingTime, hasAnimationPlayed, onLoadingComplete, initialLoadComplete, videosLoaded]);

  // ANIMATION DE FADE-OUT SMOOTH
  useEffect(() => {
    if (!isExiting || !componentMountedRef.current) return;

    let startTime: number;
    const duration = 1200;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const opacity = 1 - easeOutCubic;
      setFadeOutOpacity(opacity);

      const scale = 1 - (easeOutCubic * 0.1);
      setScaleEffect(scale);

      const blur = easeOutCubic * 20;
      setBlurEffect(blur);

      const brightness = 1 - (easeOutCubic * 0.7);
      setBrightnessEffect(brightness);

      if (progress < 1 && componentMountedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (componentMountedRef.current) {
        setTimeout(() => {
          if (componentMountedRef.current) {
            setIsVisible(false);
          }
        }, 100);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isExiting]);

  // Fonction de sortie
  const handleExit = () => {
    if (
      exitInitiatedRef.current ||
      globalExitInitiated ||
      isExiting ||
      !isVisible ||
      hasStartedExitProcessRef.current ||
      hasAnimationPlayed
    ) {
      return;
    }

    exitInitiatedRef.current = true;
    globalExitInitiated = true;
    hasStartedExitProcessRef.current = true;

    if (componentMountedRef.current) {
      setIsExiting(true);
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('VisitAnimation', 'true');
      if (componentMountedRef.current) {
        setHasAnimationPlayed(true);
      }
    }

    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
      cardsContainer.style.animationPlayState = 'paused';
    }

    setTimeout(() => {
      if (!hasCalledCompleteRef.current && componentMountedRef.current) {
        hasCalledCompleteRef.current = true;
        onLoadingComplete?.();
      }
    }, 800);
  };

  // SI DÉJÀ JOUÉ OU EXIT GLOBAL, NE RIEN AFFICHER
  if (hasAnimationPlayed || globalExitInitiated) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{
        opacity: fadeOutOpacity,
        transform: `scale(${scaleEffect})`,
        filter: `blur(${blurEffect}px)`,
        transition: isExiting ? 'none' : 'opacity 0.3s ease-out',
        pointerEvents: isExiting ? 'none' : 'auto',
        willChange: 'opacity, transform, filter'
      }}
    >
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPartners {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(107, 142, 35, 0.5); }
          50% { text-shadow: 0 0 30px rgba(107, 142, 35, 0.8); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Effets de fond animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          style={{ animation: 'scaleIn 4s ease-in-out infinite alternate' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          style={{ animation: 'scaleIn 6s ease-in-out infinite alternate', animationDelay: '1s' }}
        />
      </div>

      {/* Logo initial grand avec chargement */}
      {showInitialLogo && (
        <div className="absolute inset-0 flex items-center justify-center z-[10000]">
          <div
            ref={bigLogoContainerRef}
            className="flex flex-col items-center justify-center"
          >
            <div ref={bigServoLogoRef} className="transform scale-150">
              <ServoLogo />
            </div>
            <div className="loader"></div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {initialLoadComplete && !showInitialLogo && (
        <div className="relative h-full flex flex-col">
          {/* Logo en haut à gauche */}
          <div 
            className="absolute top-8 left-8 z-20"
            style={{
              animation: 'fadeInDown 0.8s ease-out 0.2s both',
              opacity: isExiting ? 0 : 1,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <div className="transform hover:scale-110 transition-transform duration-300">
              <img 
                src="golo.png" 
                alt="Logo" 
                className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 20px rgba(107, 142, 35, 0.3))' }}
              />
            </div>
          </div>

          {/* Timer de sortie automatique - en haut à droite */}
          <div 
            className="absolute top-8 right-8 z-30"
            style={{
              animation: 'fadeInDown 0.8s ease-out 0.4s both',
              opacity: isExiting ? 0 : 1,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <div className="relative w-8 h-8">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#6B8E23"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (timeLeft / (AUTO_EXIT_TIME / 1000)))}
                    transform="rotate(-90 50 50)"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(107, 142, 35, 0.2)"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{timeLeft}</span>
                </div>
              </div>
              <span className="text-white/70 text-sm font-medium">
                Auto-skip in {timeLeft}s
              </span>
            </div>
          </div>

          {/* Section centrale avec photo d'équipe en cercle et texte à droite */}
          <div className="flex-1 flex items-center justify-center px-6 py-12 md:py-20">
            <div 
              ref={teamSectionRef}
              className="relative max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
              style={{
                opacity: isExiting ? 0 : 1,
                transform: isExiting ? 'scale(0.95) translateY(20px)' : 'scale(1) translateY(0)',
                transition: 'all 0.8s ease-out'
              }}
            >
              {/* Photo en cercle */}
              <div className="relative group flex-shrink-0">
                <div 
                  className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-white/10 shadow-2xl"
                  style={{
                    animation: 'float 6s ease-in-out infinite',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 z-0" />
                  
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=1200&fit=crop&crop=face" 
                    alt="Notre équipe" 
                    className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-500/30 to-blue-500/30 blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                </div>

                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500/30 rounded-full blur-sm" />
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-blue-500/30 rounded-full blur-sm" />
                <div className="absolute top-1/2 -right-4 w-6 h-6 bg-yellow-500/20 rounded-full blur-sm" />
              </div>

              {/* Section texte avec guillemets */}
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <div className="absolute -top-8 -left-4 text-6xl md:text-7xl text-green-500/30 font-serif">
                    "
                  </div>
                  
                  <div className="relative z-10">
                    <h2 className="text-white/80 text-sm uppercase tracking-widest mb-6 font-semibold">
                      Notre Philosophie
                    </h2>
                    
                    <div className="relative h-48 md:h-56 flex items-center">
                      {teamTexts.map((text, index) => (
                        <div
                          key={index}
                          className="absolute inset-0 flex items-center"
                          style={{
                            opacity: textIndex === index ? 1 : 0,
                            transform: textIndex === index ? 'translateX(0)' : 'translateX(30px)',
                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          <p 
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed"
                            style={{
                              animation: textIndex === index ? 'textGlow 2s ease-in-out infinite' : 'none',
                            }}
                          >
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pl-8 border-l-4 border-green-500/50">
                      <p className="text-green-400/80 text-lg font-medium">
                        L'Équipe OLIPLUS
                      </p>
                      <p className="text-white/50 text-sm mt-1">
                        Directrice Générale
                      </p>
                    </div>
                  </div>

                  <div className="absolute -bottom-8 -right-4 text-6xl md:text-7xl text-green-500/30 font-serif">
                    "
                  </div>
                </div>

                <div className="flex justify-start gap-3 mt-12">
                  {teamTexts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setTextIndex(index)}
                      className="relative group"
                    >
                      <div
                        className="w-3 h-3 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: textIndex === index ? '#6B8E23' : 'rgba(255, 255, 255, 0.2)',
                          transform: textIndex === index ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Citation {index + 1}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section Partenaires - IMAGES QUI COUVRENT TOUT LE CARD */}
          <div 
            className="relative bg-black/30 backdrop-blur-md border-t border-white/10 py-5"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.6s both',
              opacity: isExiting ? 0 : 1,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <div className="container mx-auto px-6">
              <h3 className="text-center text-white/60 text-sm uppercase tracking-widest mb-8 font-semibold">
                Nos Partenaires de Confiance
              </h3>
              
              <div className="relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-900 to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-900 to-transparent z-10" />
                
                <div className="flex">
                  <div 
                    className="flex gap-8 items-center"
                    style={{ animation: isExiting ? 'none' : 'scrollPartners 40s linear infinite' }}
                  >
                    {[...partners, ...partners].map((partner, index) => (
                      <div
                        key={`${partner.id}-${index}`}
                        className="flex-shrink-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl hover:from-white/20 hover:to-white/15 transition-all duration-500 group border border-white/10 hover:border-white/20 shadow-xl hover:shadow-2xl overflow-hidden relative"
                        style={{ 
                          width: '150px',
                          height: '100px',
                          animation: `pulse ${3 + index * 0.5}s ease-in-out infinite`
                        }}
                      >
                        <div className="absolute inset-0">
                          {/* Effet de brillance */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ animation: 'shimmer 2s ease-in-out infinite' }}
                          />
                          
                          {/* Image qui couvre tout le card */}
                          <img 
                            src={partner.logo}
                            alt={partner.name}
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 filter grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                          />
                          
                          {/* Overlay pour améliorer la lisibilité */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Nom du partenaire (optionnel) */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <p className="text-white text-xs font-medium text-center truncate">
                              {partner.name}
                            </p>
                          </div>
                        </div>
                        
                        {/* Bordure animée */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Mentions légales */}
          <div 
            className="relative bg-black/40 backdrop-blur-sm border-t border-white/5 py-6"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.8s both',
              opacity: isExiting ? 0 : 1,
              transition: 'opacity 0.5s ease-out'
            }}
          >
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs">
                <p className="text-center md:text-left">
                  &copy; {currentYear} OLIPLUS. Tous droits réservés.
                </p>
                
                <div className="flex gap-6">
                  <button className="hover:text-white/80 transition-colors duration-300 hover:underline">
                    Mentions légales
                  </button>
                  <button className="hover:text-white/80 transition-colors duration-300 hover:underline">
                    Politique de confidentialité
                  </button>
                  <button className="hover:text-white/80 transition-colors duration-300 hover:underline">
                    CGU
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}