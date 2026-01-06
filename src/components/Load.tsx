import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/load.css';
import HomeImage from '../../public/fam.jfif';
import vid1 from '../../public/video/vid1.mp4';
import vid2 from '../../public/video/vid2.mp4';
import vid3 from '../../public/video/vid3.mp4';
import ServoLogo from './components/ServoLogo';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadingTime?: number;
}

// Variable globale pour empêcher le remontage
let globalExitInitiated = false;

export default function LoadingScreen({
  onLoadingComplete,
  minimumLoadingTime = 9000
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
  const [showInitialLogo, setShowInitialLogo] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(new Set<number>());

  // Références
  const exitInitiatedRef = useRef(false);
  const hasCalledCompleteRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const componentMountedRef = useRef(true);
  const hasStartedExitProcessRef = useRef(false);
  const animationRef = useRef<number>();

  // Références GSAP
  const bigLogoContainerRef = useRef<HTMLDivElement>(null);
  const bigServoLogoRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mainServoLogoRef = useRef<HTMLDivElement>(null);
  const loadingScreenRef = useRef<HTMLDivElement>(null);

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

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      componentMountedRef.current = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // SUIVI DU CHARGEMENT DES VIDÉOS - pour une vraie progression
  useEffect(() => {
    if (hasAnimationPlayed || globalExitInitiated || !initialLoadComplete) {
      return;
    }

    const videoElements = videoRefs.current;
    

    return () => {
      videoElements.forEach((video) => {
        if (video) {
          video.removeEventListener('canplaythrough', () => {});
        }
      });
    };
  }, [initialLoadComplete]);

  // ANIMATION INITIALE GSAP - exécutée une seule fois
  useEffect(() => {
    // Si déjà joué ou exit global, passer directement
    if (hasAnimationPlayed || globalExitInitiated) {
      setShowInitialLogo(false);
      setInitialLoadComplete(true);
      return;
    }

    // Animation du logo grand au centre
    const tl = gsap.timeline({
      onComplete: () => {
        // Quand l'animation initiale est terminée, passer au contenu principal
        setShowInitialLogo(false);
        setInitialLoadComplete(true);
      }
    });

    // Étape 1: Animation d'entrée du logo (grand)
    tl.fromTo(bigLogoContainerRef.current,
      {
        scale: 0,
        opacity: 0,
        
      },
      {
        scale: 1.2, // Plus grand pour l'effet initial
        opacity: 1,
        rotation: 0,
        duration: 2,
        ease: "back.out(1.3)"
      }
    );

    // Étape 2: Animation du ServoLogo (rotation et effet de pulsing)
    if (bigServoLogoRef.current) {
      tl.fromTo(bigServoLogoRef.current,
        {
          scale: 0.5,
          
          
        },
        {
          scale: 1.3, // Taille agrandie pour l'animation initiale
          opacity: 1,
          rotation: 0,
          duration: 1.5,
          ease: "power3.out"
        },
        "-=0.8"
      );

      // Animation de pulse sur le logo
      tl.to(bigServoLogoRef.current,
        {
          scale: 1.4,
          duration: 0.4,
          ease: "power2.inOut",
          repeat: 2,
          yoyo: true
        },
        "-=0.3"
      );
    }

    // Attendre avant de finir l'animation du logo
    tl.to({}, { duration: 1.5 });

    // Nettoyer l'animation si le composant est démonté
    return () => {
      tl.kill();
    };
  }, [hasAnimationPlayed]);

  // AUTO-DÉPLACEMENT DU CONTENEUR NOIR VERS LE HAUT APRÈS L'ANIMATION DU LOGO
  useEffect(() => {
    if (!initialLoadComplete || isExiting || hasAnimationPlayed || globalExitInitiated || !loadingScreenRef.current) {
      return;
    }

    // Animation GSAP pour faire remonter le conteneur noir comme un rideau
    gsap.to(loadingScreenRef.current,
      {
        y: -window.innerHeight,
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          handleExit();
        }
      }
    );

  }, [initialLoadComplete, isExiting, hasAnimationPlayed]);

  // LOGIQUE DE CHARGEMENT - exécutée après l'animation initiale
  useEffect(() => {
    // Si déjà joué ou exit global, sortir immédiatement
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

      // Compter le nombre de vidéos chargées
      const videosLoadedCount = videosLoaded.size;
      
      // Progresser jusqu'à 100% pendant minimumLoadingTime
      let timeProgress = (elapsed / minimumLoadingTime) * 100;
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
  ref={loadingScreenRef}
  className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-black backdrop-blur-xl"
  style={{
    opacity: fadeOutOpacity,
    transform: `scale(${scaleEffect}) translateZ(0)`,
    backfaceVisibility: 'hidden',
    perspective: 1000,
    filter: `blur(${blurEffect}px)`,
    transition: isExiting ? 'none' : 'opacity 0.4s ease-out',
    pointerEvents: isExiting ? 'none' : 'auto',
    willChange: isExiting ? 'opacity, transform, filter' : 'auto'
  }}
>
  {/* Fond de grilles avec effet de profondeur */}
  <div className="absolute inset-0 overflow-hidden opacity-20">
    {/* Première couche de grille (plus proche) */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 165, 0, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 165, 0, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        backgroundPosition: 'center center',
        transform: 'translateZ(0px)',
        animation: 'gridFloat 20s ease-in-out infinite'
      }}
    />
    
    {/* Deuxième couche de grille (intermédiaire) */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
        backgroundPosition: 'center center',
        transform: 'translateZ(-100px) scale(1.2)',
        animation: 'gridFloat 25s ease-in-out infinite reverse'
      }}
    />
    
    {/* Troisième couche de grille (plus éloignée) */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '150px 150px',
        backgroundPosition: 'center center',
        transform: 'translateZ(-200px) scale(1.5)',
        animation: 'gridFloat 30s ease-in-out infinite'
      }}
    />
    
    {/* Élément central pour créer un effet de vortex/3D */}
    <div 
      className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(20px)',
        transform: 'translateZ(50px)'
      }}
    />
  </div>

  {/* Logo initial avec animation */}
  {showInitialLogo && (
    <div className="absolute inset-0 flex items-center justify-center z-[10000]">
      <div
        ref={bigLogoContainerRef}
        className="flex flex-col items-center justify-center"
      >
        {/* ServoLogo agrandi pour l'animation initiale */}
        <div ref={bigServoLogoRef} className="transform">
          <ServoLogo />
        </div>
      </div>
    </div>
  )}
</div>
  );
}