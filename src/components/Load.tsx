import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  minimumLoadingTime?: number;
}

export default function LoadingScreen({
  onLoadingComplete,
  minimumLoadingTime = 3500
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [dots, setDots] = useState('');
  const [startFadeOut, setStartFadeOut] = useState(false);
  const [showServoZoom, setShowServoZoom] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const [hideBackground, setHideBackground] = useState(false);

  // Gestion du SessionStorage (inchangé)
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(() => {
    if (typeof window !== 'undefined') {
      const played = sessionStorage.getItem('VisitAnimation') === 'true';
      if (!played) sessionStorage.setItem('VisitAnimation', 'true');
      return played;
    }
    return false;
  });

  // Palette de couleurs (inchangée)
  const colors = {
    logoAccent: '#556B2F',
    sruvol: '#6B8E23',
    pageBg: '#FFFFFF',
    separators: '#D3D3D3',
    premium: '#884513',
    darkBg: '#1A1F15',
  };

  const fullText = "Investir à La Réunion, c'est investir dans bien plus qu'un bien. C'est s'ancrer dans une terre d'authenticité, de rencontres et de dynamisme. Fort de plus de 10 ans d'expérience dans l'immobilier, Olivier Verguin a créé cette plateforme dédiée à l'investissement dans l'immobilier, à la location saisonnière, et à la mise en valeur des activités locales réunionnaises.";

  // Simulation de TypeAnimation
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (progress > 5 && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= fullText.length && !typingComplete) {
      setTypingComplete(true);
    }
  }, [currentIndex, progress, typingComplete]);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(dotsInterval);
  }, []);

  useEffect(() => {
    if (hasAnimationPlayed) {
      onLoadingComplete?.();
      return;
    }

    let startTime: number;
    let animationFrameId: number;
    let hasCompleted = false;
    let typingStarted = false;
    let typingCompletedTime: number = 0;
    let minTimeReached = false;

    const animateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;

      if (elapsedTime > 500 && !typingStarted) typingStarted = true;
      if (typingComplete && typingCompletedTime === 0) typingCompletedTime = elapsedTime;
      if (elapsedTime >= minimumLoadingTime && !minTimeReached) minTimeReached = true;

      let calculatedProgress = 0;

      if (!typingComplete) {
        calculatedProgress = Math.min(70, (elapsedTime / minimumLoadingTime) * 70);
      } else if (typingComplete && !minTimeReached) {
        calculatedProgress = 70 + ((elapsedTime - typingCompletedTime) / (minimumLoadingTime - typingCompletedTime)) * 20;
      } else if (typingComplete && minTimeReached && !forceComplete) {
        calculatedProgress = 99;
      } else if (forceComplete) {
        calculatedProgress = 100;
      }

      setProgress(Math.min(100, calculatedProgress));

      const shouldComplete = forceComplete || (typingComplete && minTimeReached && elapsedTime > minimumLoadingTime + 1000);

      if (!shouldComplete) {
        animationFrameId = requestAnimationFrame(animateProgress);
      } else if (!hasCompleted) {
        hasCompleted = true;
        // Déclenchement de la séquence de fin
        setTimeout(() => {
          setShowServoZoom(true); // Phase Zoom
          setTimeout(() => {
            setHideBackground(true); // Animation du background disparait en cercle
            setTimeout(() => {
              setStartFadeOut(true); // Fade global
              setTimeout(() => {
                setIsVisible(false); // Unmount visuel
                setTimeout(() => {
                  onLoadingComplete?.(); // Callback final
                }, 200);
              }, 600);
            }, 300);
          }, 600);
        }, 100);
      }
    };

    animationFrameId = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationFrameId);
  }, [minimumLoadingTime, onLoadingComplete, typingComplete, forceComplete, hasAnimationPlayed]);

  useEffect(() => {
    if (typingComplete && progress === 99) {
      const timer = setTimeout(() => setForceComplete(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [typingComplete, progress]);

  if (hasAnimationPlayed) return null;
  if (!isVisible) return null;

  return (
    <>
      {/* Styles globaux pour l'animation de zoom spécifique */}
      <style>{`
        @keyframes servoZoom {
          0% { transform: scale(0.8) translateZ(0); opacity: 0; }
          15% { transform: scale(1) translateZ(0); opacity: 1; }
          85% { transform: scale(1.8) translateZ(0); opacity: 1; }
          100% { transform: scale(35) translateZ(0); opacity: 0; }
        }
        @keyframes circleDisappear {
          0% { transform: scale(1) translateZ(0); opacity: 1; }
          100% { transform: scale(0.01) translateZ(0); opacity: 0; }
        }
        @keyframes scan {
          0% { transform: translateY(-50vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(50vh); opacity: 0; }
        }
        .servo-animate {
          animation: servoZoom 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .glass-panel {
          background: rgba(26, 31, 21, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 4s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin 3s linear infinite reverse;
        }
        .circle-mask {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 100vmax;
          height: 100vmax;
          transform: translate(-50%, -50%) translateZ(0);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .circle-mask.background-circle-disappear {
          animation: circleDisappear 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0s forwards;
        }
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 30px) scale(1.15); }
        }
        .orb-float-1 {
          animation: floatOrb1 8s ease-in-out infinite;
        }
        .orb-float-2 {
          animation: floatOrb2 10s ease-in-out infinite;
        }
      `}</style>

      <div 
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ease-out overflow-hidden"
        style={{ 
          background: 'transparent',
          opacity: startFadeOut ? 0 : 1,
          pointerEvents: startFadeOut ? 'none' : 'auto'
        }}
      >
        {/* ARRIÈRE-PLAN MODERNE AVEC GRILLES EN PROFONDEUR */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: hideBackground ? 0 : 1, transition: 'opacity 0.8s ease-out' }}>
          
          {/* Fond de base dégradé */}
          <div className="absolute inset-0" 
               style={{ 
                 background: 'linear-gradient(135deg, #0a0f08 0%, #1a1f15 25%, #12160f 50%, #1a1f15 75%, #0f1410 100%)',
                 zIndex: 0
               }} 
          />

          {/* Couche 1: Grille perspective lointaine (très subtile) */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(107, 142, 35, 0.06) 25%, rgba(107, 142, 35, 0.06) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.06) 75%, rgba(107, 142, 35, 0.06) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(107, 142, 35, 0.06) 25%, rgba(107, 142, 35, 0.06) 26%, transparent 27%, transparent 74%, rgba(107, 142, 35, 0.06) 75%, rgba(107, 142, 35, 0.06) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '200px 200px',
              backgroundPosition: 'center',
              transform: 'perspective(800px) rotateX(65deg) translateZ(0)',
              opacity: 0.3,
              zIndex: 1
            }}
          />

          {/* Couche 2: Grille moyenne (intermédiaire) */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 19%, rgba(136, 69, 19, 0.08) 20%, rgba(136, 69, 19, 0.08) 21%, transparent 22%, transparent 78%, rgba(136, 69, 19, 0.08) 79%, rgba(136, 69, 19, 0.08) 80%, transparent 81%, transparent),
                linear-gradient(90deg, transparent 19%, rgba(136, 69, 19, 0.08) 20%, rgba(136, 69, 19, 0.08) 21%, transparent 22%, transparent 78%, rgba(136, 69, 19, 0.08) 79%, rgba(136, 69, 19, 0.08) 80%, transparent 81%, transparent)
              `,
              backgroundSize: '120px 120px',
              backgroundPosition: 'center',
              opacity: 0.4,
              zIndex: 2
            }}
          />

          {/* Couche 3: Grille rapprochée (nette) */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(0deg, transparent 14%, rgba(255, 255, 255, 0.05) 15%, rgba(255, 255, 255, 0.05) 16%, transparent 17%, transparent 83%, rgba(255, 255, 255, 0.05) 84%, rgba(255, 255, 255, 0.05) 85%, transparent 86%, transparent),
                linear-gradient(90deg, transparent 14%, rgba(255, 255, 255, 0.05) 15%, rgba(255, 255, 255, 0.05) 16%, transparent 17%, transparent 83%, rgba(255, 255, 255, 0.05) 84%, rgba(255, 255, 255, 0.05) 85%, transparent 86%, transparent)
              `,
              backgroundSize: '60px 60px',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 3
            }}
          />

          {/* Couche 4: Lignes diagonales croisées pour effet dynamique */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 90px, rgba(107, 142, 35, 0.04) 90px, rgba(107, 142, 35, 0.04) 92px),
                repeating-linear-gradient(-45deg, transparent, transparent 90px, rgba(136, 69, 19, 0.04) 90px, rgba(136, 69, 19, 0.04) 92px)
              `,
              opacity: 0.6,
              zIndex: 4
            }}
          />

          {/* Couche 5: Accents hexagonaux subtils */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(107,142,35,0.08)'/%3E%3Cstop offset='100%25' style='stop-color:rgba(136,69,19,0.08)'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg stroke='url(%23grad1)' stroke-width='1' fill='none'%3E%3Cpath d='M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z'/%3E%3Ccircle cx='50' cy='50' r='8'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px',
              backgroundPosition: '0 0',
              opacity: 0.25,
              zIndex: 5
            }}
          />

          {/* Couche 6: Orbes radiales en arrière-plan */}
          <div 
            className="absolute orb-float-1"
            style={{
              top: '-10%',
              left: '5%',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${colors.sruvol} 0%, rgba(107, 142, 35, 0.3) 25%, transparent 70%)`,
              filter: 'blur(130px)',
              opacity: 0.2,
              zIndex: 6
            }}
          />

          <div 
            className="absolute orb-float-2"
            style={{
              bottom: '-5%',
              right: '8%',
              width: '700px',
              height: '700px',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, ${colors.premium} 0%, rgba(136, 69, 19, 0.2) 25%, transparent 70%)`,
              filter: 'blur(150px)',
              opacity: 0.15,
              zIndex: 6
            }}
          />

          {/* Couche 7: Effet de profondeur centrale */}
          <div 
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              height: '90vh',
              borderRadius: '50%',
              background: `radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, transparent 50%)`,
              filter: 'blur(100px)',
              zIndex: 7
            }}
          />

          {/* Couche 8: Points d'accent lumineux dispersés */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.5) 1.5px, transparent 1.5px),
                radial-gradient(circle at 85% 15%, rgba(107, 142, 35, 0.4) 1px, transparent 1px),
                radial-gradient(circle at 25% 60%, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 95% 70%, rgba(136, 69, 19, 0.4) 1.5px, transparent 1.5px),
                radial-gradient(circle at 10% 85%, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                radial-gradient(circle at 70% 10%, rgba(107, 142, 35, 0.3) 1.5px, transparent 1.5px),
                radial-gradient(circle at 45% 35%, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
                radial-gradient(circle at 80% 80%, rgba(136, 69, 19, 0.35) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              opacity: 0.4,
              zIndex: 8
            }}
          />

          {/* Couche 9: Vignette élégante */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 1400px 900px at center, transparent 15%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0.5) 100%)',
              zIndex: 9
            }}
          />

          {/* Couche 10: Lueur supérieure subtile */}
          <div 
            className="absolute top-0 left-0 right-0"
            style={{
              height: '45%',
              background: 'linear-gradient(to bottom, rgba(107, 142, 35, 0.1) 0%, rgba(107, 142, 35, 0.04) 30%, transparent 100%)',
              zIndex: 10
            }}
          />

          {/* Couche 11: Scan horizontal animé */}
          <div 
            className="absolute left-0 right-0 h-[2px]"
            style={{
              top: '50%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(107, 142, 35, 0.1) 50%, transparent 100%)',
              boxShadow: '0 0 20px rgba(107, 142, 35, 0.2)',
              zIndex: 11,
              animation: 'scan 6s linear infinite'
            }}
          />
        </div>

        {!showServoZoom ? (
          <div className="relative w-full max-w-5xl px-6 md:px-12 flex flex-col h-full justify-center">
            
            {/* Conteneur Principal Glassmorphism */}
            <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden transition-all duration-500">
              
              {/* Indicateur décoratif haut gauche */}
              <div className="absolute top-6 left-6 w-8 h-[1px]" style={{ background: colors.sruvol }}></div>
              <div className="absolute top-6 left-6 h-8 w-[1px]" style={{ background: colors.sruvol }}></div>

              {/* Zone de texte Typer */}
              <div className="min-h-[280px] flex items-center justify-center mb-8 relative">
                {progress > 5 ? (
                  <div className="font-serif text-sm md:text-2xl leading-relaxed text-justify tracking-wide opacity-90"
                       style={{ color: '#E5E5E5' }}>
                    <span className="text-4xl absolute -top-2 -left-2 opacity-30 font-serif">"</span>
                    <p style={{ 
                      whiteSpace: 'pre-wrap',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                      {displayedText}
                      {!typingComplete && showCursor && <span className="border-r-2 border-white ml-1 animate-pulse"></span>}
                    </p>
                    {typingComplete && <span className="text-4xl align-bottom ml-2 opacity-30 font-serif">"</span>}
                  </div>
                ) : (
                  <div className="animate-pulse flex flex-col items-center gap-4 opacity-40">
                    <div className="h-0.5 w-12 bg-white/20"></div>
                    <span className="text-xs uppercase tracking-[0.3em] text-white/40">Initialisation</span>
                  </div>
                )}
              </div>

              {/* Ligne de séparation fine */}
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

              {/* Zone Footer : Logo & Progress */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                
                {/* Logo & Status */}
                <div className="flex items-center gap-4">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 border border-white/10 rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-t border-r border-white/30 rounded-full animate-spin-reverse"></div>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.sruvol }}></div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-widest text-white">
                      SER<span style={{ color: colors.sruvol }}>VO</span>
                    </h2>
                  </div>
                </div>

                {/* Barre de progression & Pourcentage */}
                <div className="w-full md:w-1/2 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono text-white/50 mb-1">
                    <span>STATUS: {typingComplete ? 'EN COURS' : 'CHARGEMENT'}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  
                  <div className="relative h-[2px] w-full bg-white/5 overflow-hidden rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(107,142,35,0.8)]"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: colors.sruvol,
                      }}
                    >
                      <div className="absolute right-0 top-0 h-full w-[100px] bg-gradient-to-r from-transparent to-white opacity-50"></div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            
            {/* Copyright discret */}
            <div className="mt-6 text-center">
              <p className="text-[10px] azonix uppercase tracking-[0.3em] opacity-30 text-white font-light">
                © 2025 SERVO
              </p>
            </div>

          </div>
        ) : (
          /* PHASE 2: ZOOM EFFECT */
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="servo-animate relative" style={{ transformOrigin: 'center center' }}>
              <h1 className="text-8xl md:text-9xl azonix font-bold tracking-tighter text-white mix-blend-overlay select-none"
                  style={{
                    textShadow: '0 0 40px rgba(85, 107, 47, 0.6)',
                    WebkitFontSmoothing: 'antialiased',
                    WebkitTextStrokeWidth: '0.5px',
                    WebkitTextStrokeColor: 'rgba(107, 142, 35, 0.3)'
                  }}>
                SERVO
              </h1>
            </div>
          </div>
        )}
        
        {/* Masque circulaire qui disparaît */}
        {hideBackground && (
          <div className={`circle-mask ${hideBackground ? 'background-circle-disappear' : ''}`}
               style={{
                 background: 'radial-gradient(circle at center, #0a0f08 0%, #1a1f15 50%)',
                 boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.9)',
                 pointerEvents: 'none'
               }}>
          </div>
        )}
      </div>
    </>
  );
}