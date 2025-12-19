import { useState, useEffect, useRef } from 'react';
import '../styles/load.css';
import Home from '../../public/Home.mp4';
import vid1 from '../../public/video/vid1.mp4';
import vid2 from '../../public/video/vid2.mp4';
import vid3 from '../../public/video/vid3.mp4';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadingTime?: number;
}

// Données pour les cartes
const cardData = [
  {
    id: 1,
    type: 'video',
    src: Home,
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
    src: vid1,
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
    src: vid2,
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
    src: vid3,
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

// Variable globale pour empêcher le remontage
let globalExitInitiated = false;

export default function LoadingScreen({
  onLoadingComplete,
  minimumLoadingTime = 3500
}: LoadingScreenProps) {
  // États de base
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [fadeOutOpacity, setFadeOutOpacity] = useState(1);
  const [scaleEffect, setScaleEffect] = useState(1);
  const [blurEffect, setBlurEffect] = useState(0);
  const [brightnessEffect, setBrightnessEffect] = useState(1);

  // Références
  const exitInitiatedRef = useRef(false);
  const hasCalledCompleteRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const componentMountedRef = useRef(true);
  const hasStartedExitProcessRef = useRef(false);
  const animationRef = useRef<number>();

  // Gestion du SessionStorage - lecture SEULEMENT au montage
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(() => {
    if (typeof window !== 'undefined') {
      const played = sessionStorage.getItem('VisitAnimation') === 'true' || globalExitInitiated;
      return played;
    }
    return false;
  });

  // Palette de couleurs
  const colors = {
    logoAccent: '#556B2F',
    sruvol: '#6B8E23',
    pageBg: '#FFFFFF',
    separators: '#D3D3D3',
    premium: '#884513',
    darkBg: '#1A1F15',
  };

  const fullText = "Investir à La Réunion, c'est investir dans bien plus qu'un bien. C'est s'ancrer dans une terre d'authenticité, de rencontres et de dynamisme. Fort de plus de 10 ans d'expérience dans l'immobilier, Olivier Verguin a créé cette plateforme dédiée à l'investissement dans l'immobilier, à la location saisonnière, et à la mise en valeur des activités locales réunionnaises.";

  // États pour l'animation de texte
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);
  const [dots, setDots] = useState('');

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation des points
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  // Auto-défilement des cartes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cardData.length);
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  // Animation de texte
  useEffect(() => {
    if (progress > 5 && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= fullText.length && !typingComplete) {
      setTypingComplete(true);
    }
  }, [currentIndex, fullText.length, progress, typingComplete]);

  // LOGIQUE DE CHARGEMENT - exécutée une seule fois
  useEffect(() => {
    // Si déjà joué ou exit global, sortir immédiatement
    if (hasAnimationPlayed || globalExitInitiated) {
      if (!hasCalledCompleteRef.current && componentMountedRef.current) {
        hasCalledCompleteRef.current = true;
        onLoadingComplete?.();
      }
      if (componentMountedRef.current) {
        setIsVisible(false);
      }
      return;
    }

    let animationFrameId: number;
    let isAnimationActive = true;

    const updateProgress = () => {
      if (!isAnimationActive || !componentMountedRef.current || hasAnimationPlayed || globalExitInitiated) {
        return;
      }

      const now = Date.now();
      const elapsed = now - startTimeRef.current;

      // Phase 1: Progresser jusqu'à 70% pendant minimumLoadingTime
      let newProgress = Math.min(70, (elapsed / minimumLoadingTime) * 70);

      // Phase 2: Si le texte est terminé, continuer vers 100%
      if (typingComplete && elapsed > minimumLoadingTime) {
        const timeAfterMin = elapsed - minimumLoadingTime;
        const fadeTime = 2000;
        const extraProgress = Math.min(30, (timeAfterMin / fadeTime) * 30);
        newProgress = Math.min(100, 70 + extraProgress);
      }

      if (componentMountedRef.current) {
        setProgress(newProgress);
      }

      // Quand on atteint 100%, montrer le bouton
      if (newProgress >= 100 && !showButton && componentMountedRef.current) {
        setShowButton(true);
      }

      // Continuer l'animation
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
  }, [minimumLoadingTime, typingComplete, showButton, hasAnimationPlayed, onLoadingComplete]);

  // ANIMATION DE FADE-OUT SMOOTH
  useEffect(() => {
    if (!isExiting || !componentMountedRef.current) return;

    let startTime: number;
    const duration = 1200; // 1.2 secondes pour une animation plus fluide

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Courbe d'easing personnalisée pour un effet plus smooth
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Animation de l'opacité
      const opacity = 1 - easeOutCubic;
      setFadeOutOpacity(opacity);

      // Animation du scale (léger zoom out)
      const scale = 1 - (easeOutCubic * 0.1); // Réduction de 10%
      setScaleEffect(scale);

      // Animation du flou (augmentation progressive)
      const blur = easeOutCubic * 20; // Jusqu'à 20px de flou
      setBlurEffect(blur);

      // Animation de la luminosité (assombrissement)
      const brightness = 1 - (easeOutCubic * 0.7); // Réduction de 70%
      setBrightnessEffect(brightness);

      if (progress < 1 && componentMountedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      } else if (componentMountedRef.current) {        
        // Petit délai avant de masquer complètement
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

  // Fonction de sortie - PROTECTION MAXIMALE
  const handleExit = () => {
    // PROTECTION MULTIPLE COUCHES
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
    // MARQUER COMME DÉBUTÉ À TOUS LES NIVEAUX
    exitInitiatedRef.current = true;
    globalExitInitiated = true;
    hasStartedExitProcessRef.current = true;
    
    if (componentMountedRef.current) {
      setIsExiting(true);
    }

    // 1. Sauvegarder dans sessionStorage IMMÉDIATEMENT
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('VisitAnimation', 'true');      
      // Mettre à jour l'état local
      if (componentMountedRef.current) {
        setHasAnimationPlayed(true);
      }
    }

    // 2. Arrêter toutes les vidéos
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // 3. Arrêter l'animation des cartes
    const cardsContainer = document.getElementById('cardsContainer');
    if (cardsContainer) {
      cardsContainer.style.animationPlayState = 'paused';
    }

    // 4. Appeler le callback pour rediriger après l'animation
    setTimeout(() => {
      if (!hasCalledCompleteRef.current && componentMountedRef.current) {
        hasCalledCompleteRef.current = true;
        onLoadingComplete?.();
      }
    }, 800); // Délai correspondant à l'animation
  };

  // SI DÉJÀ JOUÉ OU EXIT GLOBAL, NE RIEN AFFICHER
  if (hasAnimationPlayed || globalExitInitiated) {
    return null;
  }

  // SI PAS VISIBLE, NE RIEN AFFICHER
  if (!isVisible) {
    return null;
  }

  // Rendu du composant
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black/50 backdrop-blur-xl"
      style={{
        opacity: fadeOutOpacity,
        transform: `scale(${scaleEffect})`,
        filter: `blur(${blurEffect}px)`,
        transition: isExiting ? 'none' : 'opacity 0.3s ease-out',
        pointerEvents: isExiting ? 'none' : 'auto',
        willChange: 'opacity, transform, filter'
      }}
    >
      {/* Background avec média */}
      <div className="absolute inset-0 overflow-hidden">
        {cardData[currentCardIndex]?.type === 'video' ? (
          <video
            key={`video-${currentCardIndex}`}
            ref={el => {
              if (el) videoRefs.current[currentCardIndex] = el;
            }}
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
            src={cardData[currentCardIndex].src}
            style={{
              filter: `brightness(${brightnessEffect})`,
              transition: isExiting ? 'none' : 'filter 0.3s ease-out'
            }}
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${cardData[currentCardIndex]?.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: `brightness(${brightnessEffect})`,
              transition: isExiting ? 'none' : 'filter 0.3s ease-out'
            }}
          />
        )}

        {/* Overlay et effets visuels */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
          style={{
            opacity: isExiting ? 0.5 : 1,
            transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: isExiting ? 0.2 : 0.3,
            backgroundImage: `
              linear-gradient(0deg, transparent 24%, rgba(107, 142, 35, 0.06) 25%, rgba(107, 142, 35, 0.06) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.06) 75%, rgba(107, 142, 35, 0.06) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(107, 142, 35, 0.06) 25%, rgba(107, 142, 35, 0.06) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.06) 75%, rgba(107, 142, 35, 0.06) 76%, transparent 77%, transparent)
            `,
            backgroundSize: '200px 200px',
            transform: 'perspective(800px) rotateX(65deg)',
            transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
          }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative w-full max-w-6xl px-6 md:px-12 pb-16 flex flex-col h-full justify-center">
        {/* Carte glassmorphism */}
        <div
          className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden border"
          style={{
            backgroundColor: isExiting ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.3)',
            borderColor: isExiting ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            opacity: isExiting ? 0.7 : 1,
            transform: isExiting ? `scale(${0.95 + (1 - scaleEffect)})` : 'scale(1)',
            backdropFilter: `blur(${isExiting ? Math.min(blurEffect / 2, 10) : 20}px)`,
            transition: isExiting ? 'none' : 'all 0.3s ease-out'
          }}
        >

          {/* Indicateurs décoratifs */}
          <div
            className="absolute top-6 left-6 w-8 h-[1px]"
            style={{ 
              background: colors.sruvol,
              opacity: isExiting ? 0.3 : 1,
              transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
            }}
          />
          <div
            className="absolute top-6 left-6 h-8 w-[1px]"
            style={{ 
              background: colors.sruvol,
              opacity: isExiting ? 0.3 : 1,
              transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
            }}
          />

          {/* Texte */}
          <div className="min-h-[280px] flex items-center justify-center mb-8 relative">
            {progress > 5 ? (
              <div
                className="font-serif text-sm md:text-2xl leading-relaxed text-justify tracking-wide"
                style={{
                  color: '#E5E5E5',
                  opacity: isExiting ? 0.5 : 0.9,
                  transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                }}
              >
                <span 
                  className="text-4xl absolute -top-2 -left-2 font-serif"
                  style={{ 
                    opacity: isExiting ? 0.1 : 0.3,
                    transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                  }}
                >"</span>
                <p style={{
                  whiteSpace: 'pre-wrap',
                  textShadow: isExiting ? '0 1px 3px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.5)',
                  transition: isExiting ? 'none' : 'text-shadow 0.3s ease-out'
                }}>
                  {displayedText}
                  {!typingComplete && currentIndex < fullText.length && !isExiting && (
                    <span className="border-r-2 border-white ml-1 animate-pulse" />
                  )}
                </p>
                {typingComplete && <span
                  className="text-4xl align-bottom ml-2 font-serif"
                  style={{ 
                    opacity: isExiting ? 0.1 : 0.3,
                    transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                  }}
                >"</span>}
              </div>
            ) : (
              <div 
                className="flex flex-col items-center gap-4"
                style={{ 
                  opacity: isExiting ? 0.2 : 0.4,
                  transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                }}
              >
                <div className="h-0.5 w-12 bg-white/20" />
                <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                  Initialisation{dots}
                </span>
              </div>
            )}
          </div>

          {/* Séparateur */}
          <div
            className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"
            style={{ 
              opacity: isExiting ? 0.2 : 1,
              transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
            }}
          />

          {/* Footer avec logo et progression */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div
                  className="absolute inset-0 border border-white/10 rounded-full"
                  style={{
                    animation: isExiting ? 'none' : 'spin 1.5s linear infinite',
                    opacity: isExiting ? 0.2 : 1,
                    transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                  }}
                />
                <div
                  className="absolute inset-2 border-t border-r border-white/30 rounded-full"
                  style={{
                    animation: isExiting ? 'none' : 'spin-reverse 2s linear infinite',
                    opacity: isExiting ? 0.1 : 1,
                    transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                  }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: colors.sruvol,
                    opacity: isExiting ? 0.3 : 1,
                    transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                  }}
                />
              </div>
              <h2
                className="text-xl font-bold tracking-widest"
                style={{
                  color: '#FFFFFF',
                  opacity: isExiting ? 0.5 : 1,
                  transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                }}
              >
                OLI<span style={{ color: colors.sruvol }}>PLUS</span>
              </h2>
            </div>

            {/* Barre de progression ou bouton */}
            <div className="w-full md:w-1/2 flex flex-col gap-2">
              {!showButton ? (
                <>
                  <div
                    className="flex justify-between text-xs font-mono mb-1"
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                      opacity: isExiting ? 0.3 : 1,
                      transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                    }}
                  >
                    <span>STATUS: {typingComplete ? 'EN COURS' : 'CHARGEMENT'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div
                    className="relative h-[2px] w-full overflow-hidden rounded-full"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      opacity: isExiting ? 0.3 : 1,
                      transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 h-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: colors.sruvol,
                        boxShadow: isExiting ? 'none' : '0 0 15px rgba(107,142,35,0.8)',
                        transition: isExiting ? 'none' : 'all 0.3s ease-out'
                      }}
                    >
                      <div
                        className="absolute right-0 top-0 h-full w-[100px] bg-gradient-to-r from-transparent to-white"
                        style={{ 
                          opacity: isExiting ? 0.1 : 0.5,
                          transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onClick={handleExit}
                  disabled={exitInitiatedRef.current || globalExitInitiated || isExiting || hasAnimationPlayed}
                  className="px-8 py-3 rounded-lg font-mono text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_25px_rgba(107,142,35,0.6)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    backgroundColor: exitInitiatedRef.current || globalExitInitiated || isExiting || hasAnimationPlayed ? '#888' : colors.sruvol,
                    border: `1px solid ${exitInitiatedRef.current || globalExitInitiated || isExiting || hasAnimationPlayed ? '#888' : colors.sruvol}`,
                    boxShadow: isExiting 
                      ? '0 0 10px rgba(136, 136, 136, 0.3)' 
                      : exitInitiatedRef.current || globalExitInitiated || hasAnimationPlayed
                      ? '0 0 5px rgba(136, 136, 136, 0.2)'
                      : '0 0 15px rgba(107,142,35,0.4)',
                    opacity: isExiting ? 0.7 : 1,
                    transform: isExiting ? 'scale(0.97)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Effet de brillance sur hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <span className="relative z-10">
                    {exitInitiatedRef.current || globalExitInitiated || isExiting ? 'REDIRECTION EN COURS...' : 'ACCÉDER AU SITE'}
                  </span>
                  
                  {/* Indicateur de statut */}
                  {(exitInitiatedRef.current || globalExitInitiated) && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse z-20">
                      !
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cartes défilantes */}
        <div className="fixed bottom-2 right-6 z-[9998]">
          <style>{`
            @keyframes scroll-cards {
              0% { transform: translateX(0); }
              100% { transform: translateX(-${cardData.length * 96}px); }
            }
          `}</style>
          <div
            className="p-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            style={{
              width: '380px',
              maxWidth: '90vw',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: isExiting ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.2)',
              opacity: isExiting ? 0.2 : 1,
              transform: isExiting ? 'translateY(30px) scale(0.95)' : 'translateY(0) scale(1)',
              backdropFilter: `blur(${isExiting ? Math.min(blurEffect / 3, 8) : 12}px)`,
              transition: isExiting ? 'none' : 'all 0.3s ease-out'
            }}
          >
            <div
              id="cardsContainer"
              className="flex gap-4"
              style={{
                animation: isExiting ? 'none' : 'scroll-cards 80s linear infinite',
              }}
            >
              {[...cardData, ...cardData].map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer relative ${index % cardData.length === currentCardIndex
                      ? 'ring-1 ring-white scale-110 shadow-xl'
                      : 'hover:opacity-75'
                    }`}
                  onClick={() => !isExiting && setCurrentCardIndex(index % cardData.length)}
                  style={{
                    opacity: isExiting ? 0.3 : 1,
                    transform: isExiting ? 'scale(0.85)' :
                      (index % cardData.length === currentCardIndex ? 'scale(1.1)' : 'scale(1)'),
                    transition: isExiting ? 'none' : 'all 0.3s ease-out'
                  }}
                >
                  {card.type === 'video' ? (
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={card.src}
                      style={{
                        filter: isExiting ? 'brightness(0.2)' : 'brightness(0.5)',
                        transition: isExiting ? 'none' : 'filter 0.3s ease-out'
                      }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${card.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  {card.type === 'video' && !isExiting && (
                    <div className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 z-10">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  {index % cardData.length === currentCardIndex && !isExiting && (
                    <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-white z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center">
          <p
            className="text-[10px] azonix uppercase tracking-[0.3em] text-white font-light"
            style={{ 
              opacity: isExiting ? 0.05 : 0.3,
              transition: isExiting ? 'none' : 'opacity 0.3s ease-out'
            }}
          >
            © 2025 OLIPLUS
          </p>
        </div>
      </div>
    </div>
  );
}