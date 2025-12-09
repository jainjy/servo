// components/LoadingScreen.tsx
import { useState, useEffect } from 'react';
import { TypeAnimation } from 'react-type-animation';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadingTime?: number; // Temps minimum d'affichage en ms
}

export default function LoadingScreen({
  onLoadingComplete,
  minimumLoadingTime = 3500 // Augmenté pour laisser le temps de lire
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dots, setDots] = useState('');
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [showServoZoom, setShowServoZoom] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);

  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem('VisitAnimation');
    if (!hasAnimationPlayed) {
      // Marquer l'animation comme jouée pour cet onglet uniquement
      sessionStorage.setItem('VisitAnimation', 'true');
    }
  }, []);

  
  const hasAnimationPlayed = sessionStorage.getItem('VisitAnimation');
  if (hasAnimationPlayed) {
    return null; // Ne rien afficher si l'animation a déjà été jouée dans cet onglet
  }

  // Couleurs depuis la palette fournie
  const colors = {
    logoAccent: '#556B2F', // Logo / accent - vert foncé
    sruvol: '#6B8E23',     // Sruvol / fonds lagers - vert olive
    pageBg: '#FFFFFF',     // Fond de page / bloc texte - blanc
    separators: '#D3D3D3', // Séparateurs / bordures, UI - gris clair
    premium: '#884513',    // Touche premium / titres secondaires - marron
    darkBg: '#1A1F15',     // Fond principal - très foncé pour contraste
  };

  // Texte à afficher avec animation
  const fullText = "Investir à La Réunion, c'est investir dans bien plus qu'un bien. C'est s'ancrer dans une terre d'authenticité, de rencontres et de dynamisme. Fort de plus de 10 ans d'expérience dans l'immobilier, Olivier Verguin a créé cette plateforme dédiée à l'investissement dans l'immobilier, à la location saisonnière, et à la mise en valeur des activités locales réunionnaises.";

  useEffect(() => {
    // Animation des points
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);

    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;
    let hasCompleted = false;
    let typingStarted = false;
    let typingCompletedTime: number = 0;
    let minTimeReached = false;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      // Démarrer la dactylographie après un court délai
      if (elapsedTime > 500 && !typingStarted) {
        typingStarted = true;
      }

      // Marquer quand la dactylographie est terminée
      if (typingComplete && typingCompletedTime === 0) {
        typingCompletedTime = elapsedTime;
      }

      // Vérifier si le temps minimum est atteint
      if (elapsedTime >= minimumLoadingTime && !minTimeReached) {
        minTimeReached = true;
      }

      // Logique de progression basée sur la complétion du texte
      let calculatedProgress = 0;

      if (!typingComplete) {
        // Pendant la dactylographie, progression lente jusqu'à 70%
        calculatedProgress = Math.min(70, (elapsedTime / minimumLoadingTime) * 70);
      } else if (typingComplete && !minTimeReached) {
        // Dactylographie terminée mais temps minimum pas atteint
        calculatedProgress = 70 + ((elapsedTime - typingCompletedTime) / (minimumLoadingTime - typingCompletedTime)) * 20;
      } else if (typingComplete && minTimeReached && !forceComplete) {
        // Tout est terminé mais on maintient à 99% pour laisser le temps de lire
        calculatedProgress = 99;
      } else if (forceComplete) {
        // Forcer la complétion à 100%
        calculatedProgress = 100;
      }

      setProgress(Math.min(100, calculatedProgress));

      // Conditions pour compléter le chargement
      const shouldComplete = forceComplete ||
        (typingComplete && minTimeReached && elapsedTime > minimumLoadingTime + 1000);

      if (!shouldComplete) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else if (!hasCompleted) {
        // Marquer comme complété
        hasCompleted = true;

        // Phase 1: Afficher l'écran de zoom SERVO
        setTimeout(() => {
          setShowServoZoom(true);

          // Phase 2: Disparaître avec le zoom
          setTimeout(() => {
            setStartFadeOut(true);
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(() => {
                onLoadingComplete?.();
              }, 300);
            }, 800); // Durée du zoom
          }, 500); // Délai avant début du zoom
        }, 200);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [minimumLoadingTime, onLoadingComplete, typingComplete, forceComplete]);

  // Forcer la complétion après un délai supplémentaire
  useEffect(() => {
    if (typingComplete && progress === 99) {
      const timer = setTimeout(() => {
        setForceComplete(true);
      }, 2000); // Attendre 2 secondes supplémentaires après la fin du texte

      return () => clearTimeout(timer);
    }
  }, [typingComplete, progress]);

  if (!isVisible) return null;

  return (
    <div className={`
      fixed lg:flex hidden inset-0 z-50 flex-col items-center justify-center 
      transition-opacity duration-500
      ${startFadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
    `}
      style={{
        background: `linear-gradient(135deg, ${colors.darkBg} 0%, #2a2f20 100%)`
      }}
    >
      {!showServoZoom ? (
        <div className="relative w-full max-w-4xl px-6">

          {/* Texte de description avec typing animation - PLACÉ EN HAUT */}
          <div className="mb-12 px-4 w-full max-w-4xl">
            <div
              className="rounded-lg p-8 backdrop-blur-sm h-[400px] overflow-hidden"
              style={{
                background: 'transparent',
                borderColor: 'transparent',
              }}
            >
              <div className="h-full overflow-y-auto pr-4">
                <div
                  className="text-2xl text-justify leading-relaxed font-sans"
                  style={{ color: colors.logoAccent }}
                >
                  {progress > 10 ? (
                    <TypeAnimation
                      sequence={[
                        fullText,
                        () => {
                          setTypingComplete(true);
                        }
                      ]}
                      wrapper="p"
                      speed={85} // Vitesse mot par mot
                      deletionSpeed={50}
                      cursor={true}
                      repeat={0}
                      style={{
                        fontSize: '1.5rem',
                        lineHeight: '3rem',
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        letterSpacing: '0.02em',

                        color: colors.logoAccent
                      }}
                    />
                  ) : (
                    <span style={{ opacity: 0.5, color: colors.logoAccent }}>
                      Préparation du contenu...
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ligne de progression */}
          <div
            className="relative h-[2px] w-full overflow-hidden rounded-full"
            style={{ backgroundColor: colors.separators }}
          >
            <div
              className="absolute top-0 left-0 h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(to right, ${colors.logoAccent}, ${colors.sruvol})`
              }}
            />
          </div>

          {/* Texte de chargement */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              {/* Logo KPR-like */}
              <div className="relative">
                <div
                  className="w-6 h-6 border-2 rounded-full animate-pulse"
                  style={{ borderColor: colors.sruvol }}
                />
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.sruvol }}
                />
              </div>

              <span
                className="font-medium text-lg tracking-wider"
                style={{ color: colors.logoAccent }}
              >
                SER<span style={{ color: colors.sruvol }}>VO</span>
              </span>
            </div>

            <div className="text-right">
              <div
                className="text-sm tracking-wider"
                style={{ color: colors.logoAccent }}
              >
                CHARGEMENT{dots}
              </div>
              <div
                className="font-mono text-xl font-bold tracking-tighter"
                style={{ color: colors.premium }}
              >
                {Math.round(progress)}%
              </div>
            </div>
          </div>

          {/* Éléments décoratifs */}
          <div
            className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.logoAccent}30` }}
          />
          <div
            className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.sruvol}30` }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full blur-3xl"
            style={{ backgroundColor: `${colors.premium}20` }}
          />

          {/* Particules flottantes */}
          <div
            className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: colors.logoAccent }}
          />
          <div
            className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full animate-pulse delay-300"
            style={{ backgroundColor: colors.sruvol }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full animate-pulse delay-700"
            style={{ backgroundColor: colors.premium }}
          />
        </div>
      ) : (
        /* Phase 2: Écran de zoom SERVO */
        <div className="servo-zoom-container">
          {/* Copie du contenu principal pour l'effet de loupe */}
          <div className="servo-zoom-text-window">
            <div className="servo-zoom-content">
              <div
                className="servo-zoom-text"

              >
                SER<span style={{ color: colors.sruvol }}>VO</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Copyright - visible seulement en phase 1 */}
      {!showServoZoom && (
        <div className="absolute bottom-8 text-center">
          <p
            className="azonix text-xs tracking-widest"
            style={{ color: colors.logoAccent }}
          >
            © 2025 SERVO
          </p>
        </div>
      )}

    </div>
  )
}