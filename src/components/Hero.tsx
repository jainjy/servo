import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-house.jpg";
import "../styles/font.css";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Recherche from "@/pages/Recherche";
import { motion } from "framer-motion";
import AdvertisementPopup from "./AdvertisementPopup";
gsap.registerPlugin(SplitText);

// Définition des couleurs
const colors = {
  logoAccent: "#556B2F",
  sruvol: "#6B8E23",
  pageBg: "#FFFFFF",
  separators: "#D3D3D3",
  premium: "#884513",
};

// URL de l'image en dessin
const sketchImageUrl = "/2em.png";

// // Composant AdCard local
// const LocalAdCard = () => {
//   const [isVisible, setIsVisible] = useState<boolean | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState<number>(2 * 60);
//   const [isMobile, setIsMobile] = useState(false);

//   // Détection mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     if (isMobile) {
//       setIsVisible(false);
//       return;
//     }

//     const savedState = sessionStorage.getItem("adCardState");
    
//     if (savedState) {
//       try {
//         const { isVisible: savedIsVisible, timeRemaining: savedTime, startTime } = JSON.parse(savedState);
//         const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
//         const newTimeRemaining = Math.max(0, savedTime - elapsedTime);
        
//         setIsVisible(savedIsVisible);
//         setTimeRemaining(newTimeRemaining);
//       } catch (error) {
//         console.error("Erreur lors du chargement:", error);
//         setIsVisible(true);
//       }
//     } else {
//       setIsVisible(true);
//     }
//   }, [isMobile]);

//   useEffect(() => {
//     if (isVisible === null || isMobile) return;

//     const timer = setInterval(() => {
//       setTimeRemaining(prev => {
//         let newTime = prev - 1;
//         let newIsVisible = isVisible;

//         if (newTime <= 0) {
//           newIsVisible = !isVisible;
//           newTime = newIsVisible ? 2 * 60 : 8 * 60;
//           setIsVisible(newIsVisible);
//         }

//         sessionStorage.setItem("adCardState", JSON.stringify({
//           isVisible: newIsVisible,
//           timeRemaining: newTime,
//           startTime: Date.now()
//         }));

//         return newTime;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [isVisible, isMobile]);

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   if (isVisible === null) {
//     return <div className="w-full min-h-[140px] bg-gray-100 rounded-2xl animate-pulse" />;
//   }

//   if (!isVisible || isMobile) {
//     return null;
//   }

//   return (
//     <motion.article
//       initial={{ opacity: 0, y: -8 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -8 }}
//       transition={{ duration: 0.25 }}
//       className="
//         relative w-full max-w-2xl mx-auto
//         rounded-xl border border-white/20
//         bg-gradient-to-br from-white/12 to-white/6
//         backdrop-blur-lg shadow-lg overflow-hidden z-40 mb-4
//       "
//     >
//       {/* Header */}
//       <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 text-xs">
//         <span className="px-2.5 py-1 rounded-full bg-white/25 text-white font-semibold backdrop-blur-sm">
//           Pub
//         </span>

//         <div className="flex items-center bg-black/35 px-2.5 py-1 rounded-full text-white backdrop-blur-sm">
//           <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//               d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           {formatTime(timeRemaining)}
//         </div>

//         <button
//           onClick={() => setIsVisible(false)}
//           className="p-1.5 rounded-full bg-black/35 hover:bg-black/50 text-white/75 hover:text-white transition-colors"
//           aria-label="Fermer la publicité"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Contenu */}
//       <div className="flex p-4 gap-4">
//         {/* Image */}
//         <div className="w-36 h-28 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
//           <img
//             src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=80"
//             alt="Offre spéciale"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Texte */}
//         <div className="flex-1">
//           <h2 className="text-base text-start font-semibold text-white mb-1.5">
//             Offres spéciales
//           </h2>

//           <p className="text-sm text-start text-white/80 leading-relaxed mb-3">
//             Bénéficiez de réductions exclusives sur nos meilleurs services.
//           </p>

//           <div className="flex items-center justify-between pt-3 border-t border-white/15">
//             <div className="flex items-center text-xs text-white/65">
//               <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                   d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span>Visible : <span className="font-medium text-white">2 minutes</span></span>
//             </div>

        
//           </div>
//         </div>
//       </div>
//     </motion.article>
//   );
// };

const Hero = () => {
  const [heroQuery, setHeroQuery] = useState("");
  const navigate = useNavigate();

  const [isRevealing, setIsRevealing] = useState(false);
  const [mouseInactive, setMouseInactive] = useState(false);
  const mouseInactiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [waveOffset, setWaveOffset] = useState(0);
  const [revealRadius, setRevealRadius] = useState(0);
  const animationRef = useRef<number | null>(null);
  const [mouseTrail, setMouseTrail] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      life: number;
      timestamp: number;
      offsetX: number;
      offsetY: number;
    }>
  >([]);
  const [randomReveals, setRandomReveals] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      life: number;
      createdAt: number;
    }>
  >([]);

  const trailIdRef = useRef(0);
  const randomIdRef = useRef(0);
  const lastMouseMoveTime = useRef(Date.now());
  const [alwaysRevealing, setAlwaysRevealing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation de l'onde, des traces et du rayon de révélation
  useEffect(() => {
    let mounted = true;

    const animate = () => {
      if (!mounted) return;

      setWaveOffset((prev) => prev + 0.02);

      if (isRevealing || alwaysRevealing) {
        setRevealRadius((prev) => {
          if (prev < 100) {
            return prev + (100 - prev) * 0.07;
          }
          return prev;
        });
      } else if (revealRadius > 0) {
        setRevealRadius((prev) => prev * 0.92);
      }

      setMouseTrail((prev) =>
        prev
          .map((trail) => ({
            ...trail,
            life: trail.life - 0.018,
            size: trail.size * 0.985,
            x: trail.x + Math.sin(waveOffset + trail.id) * 0.5,
            y: trail.y + Math.cos(waveOffset + trail.id) * 0.3,
          }))
          .filter((trail) => trail.life > 0)
      );

      setRandomReveals((prev) =>
        prev
          .map((reveal) => ({
            ...reveal,
            life: reveal.life - 0.009,
            size: reveal.size * 1.008,
          }))
          .filter((reveal) => reveal.life > 0)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    isRevealing,
    mouseTrail.length,
    randomReveals.length,
    revealRadius,
    alwaysRevealing,
    waveOffset,
  ]);

  // Ajouter une trace au déplacement de la souris
  const addTrailPoint = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastMouseMoveTime.current < 50) return;

    lastMouseMoveTime.current = now;

    trailIdRef.current += 1;
    setMouseTrail((prev) => {
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 60;

      const newTrail = {
        id: trailIdRef.current,
        x: x + offsetX,
        y: y + offsetY,
        size: 90 + Math.random() * 70,
        life: 1,
        timestamp: now,
        offsetX,
        offsetY,
      };

      return [...prev.slice(-14), newTrail];
    });
  }, []);

  // Créer une révélation aléatoire
  const createRandomReveal = useCallback(() => {
    randomIdRef.current += 1;
    setRandomReveals((prev) => {
      const newReveal = {
        id: randomIdRef.current,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 70 + Math.random() * 100,
        life: 1,
        createdAt: Date.now(),
      };

      return [...prev.slice(-7), newReveal];
    });
  }, []);

  // Générer des révélations aléatoires
  useEffect(() => {
    const alwaysActiveTimeout = setTimeout(() => {
      setAlwaysRevealing(true);
    }, 3000);

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        createRandomReveal();
      }
    }, 800);

    return () => {
      clearTimeout(alwaysActiveTimeout);
      clearInterval(interval);
    };
  }, [createRandomReveal]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      setMousePosition({ x, y });

      setIsRevealing(true);
      setMouseInactive(false);
      setAlwaysRevealing(false);

      addTrailPoint(x, y);

      if (mouseInactiveTimeoutRef.current) {
        clearTimeout(mouseInactiveTimeoutRef.current);
      }

      mouseInactiveTimeoutRef.current = setTimeout(() => {
        setMouseInactive(true);
        setIsRevealing(false);
        setTimeout(() => {
          setAlwaysRevealing(true);
        }, 2000);
      }, 1000);
    },
    [addTrailPoint]
  );

  const handleMouseLeave = useCallback(() => {
    setIsRevealing(false);
    setMouseInactive(false);
    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
      mouseInactiveTimeoutRef.current = null;
    }
    setTimeout(() => {
      setAlwaysRevealing(true);
    }, 500);
  }, []);

  // Effet de parallaxe
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = heroRef.current?.offsetHeight || 600;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calcul de l'onde
  const getWaveDistortion = (x: number, y: number, time: number) => {
    const amplitude = isRevealing || alwaysRevealing ? 12 : 0;
    const frequency = 0.007;
    return Math.sin(x * frequency + y * frequency + time) * amplitude;
  };

  // Effet GSAP pour éviter l'erreur
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const loadingText = document.querySelector(".loading-text");
        if (loadingText) {
          gsap.to(loadingText, {
            duration: 1,
            opacity: 0.3,
            yoyo: true,
            repeat: -1,
            ease: "power1.inOut"
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes wave-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes trail-fade {
          0% {
            opacity: 0.95;
            transform: scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.25) rotate(5deg);
          }
        }

        @keyframes random-reveal {
          0% {
            opacity: 0;
            transform: scale(0.4) rotate(0deg);
          }
          15% {
            opacity: 0.9;
            transform: scale(1) rotate(180deg);
          }
          85% {
            opacity: 0.9;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(1.4) rotate(360deg);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(1deg);
          }
        }

        .wave-distortion {
          filter: url(#wave-filter);
          transition: filter 0.3s ease-out;
        }

        .trail-point {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: trail-fade linear forwards, float 3s ease-in-out infinite;
          mix-blend-mode: multiply;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.75) 20%,
            rgba(255, 255, 255, 0.5) 50%,
            transparent 80%
          );
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          overflow: hidden;
          box-shadow: 
            0 0 25px rgba(255, 255, 255, 0.5),
            0 0 50px rgba(255, 255, 255, 0.3),
            inset 0 0 30px rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .random-reveal {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: random-reveal linear forwards, float 4s ease-in-out infinite;
          mix-blend-mode: multiply;
          overflow: hidden;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.6) 40%,
            transparent 80%
          );
          box-shadow: 
            0 0 30px rgba(255, 255, 255, 0.6),
            0 0 60px rgba(255, 255, 255, 0.4);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
        }

        .reveal-mask {
          clip-path: circle(var(--reveal-radius, 0px) at var(--mouse-x, 50%) var(--mouse-y, 50%));
          transition: clip-path 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .reveal-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.2) 40%,
            transparent 80%
          );
          mix-blend-mode: overlay;
          opacity: var(--reveal-opacity, 0);
          transition: opacity 0.3s ease-out;
        }
      `}</style>

      <section
        id="hero"
        ref={heroRef}
        className="relative h-auto lg:min-h-screen flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Filtre SVG pour l'effet d'onde */}
        <svg style={{ display: "none" }}>
          <defs>
            <filter
              id="wave-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.007 0.007"
                numOctaves="3"
                seed={Math.floor(waveOffset * 10)}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={isRevealing || alwaysRevealing ? 7 : 0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
              <feGaussianBlur stdDeviation="0.5" />
            </filter>
          </defs>
        </svg>
        
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: `translateY(${scrollProgress * 20}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <motion.img
            src={heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              filter: "brightness(0.8) contrast(1.1) saturate(1.1)",
            }}
            animate={{
              x: (mousePosition.x - window.innerWidth / 2) * 0.003,
              y: (mousePosition.y - window.innerHeight / 2) * 0.003,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
            }}
          />

          <div
            className="absolute top-0 left-0 w-full h-full wave-distortion reveal-mask"
            style={
              {
                opacity: isRevealing || alwaysRevealing ? 1 : 0,
                pointerEvents: "none",
                transition: "opacity 0.4s ease-out",
                "--mouse-x": `${mousePosition.x}px`,
                "--mouse-y": `${mousePosition.y}px`,
                "--reveal-radius": `${revealRadius}px`,
              } as React.CSSProperties
            }
          >
            <img
              src={sketchImageUrl}
              alt="Dessin architectural"
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{
                mixBlendMode: "multiply",
                opacity: 1,
                transform: `
                  translateX(${getWaveDistortion(
                    mousePosition.x,
                    mousePosition.y,
                    waveOffset
                  )}px)
                  translateY(${getWaveDistortion(
                    mousePosition.y,
                    mousePosition.x,
                    waveOffset + 1
                  )}px)
                `,
                transition: "transform 0.1s linear",
              }}
            />

            <div
              className="reveal-overlay"
              style={
                {
                  "--mouse-x": `${mousePosition.x}px`,
                  "--mouse-y": `${mousePosition.y}px`,
                  "--reveal-opacity": isRevealing || alwaysRevealing ? 1 : 0,
                } as React.CSSProperties
              }
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/8 to-black/35" />
        </div>

        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none transition-all duration-300 z-10"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(255, 255, 255, ${
                  isRevealing || alwaysRevealing ? 0.18 : 0
                }) 0%,
                transparent ${
                  isRevealing || alwaysRevealing
                    ? Math.min(280, revealRadius * 1.6) + "px"
                    : "0px"
                }
              )
            `,
            mixBlendMode: "overlay",
            opacity: isRevealing || alwaysRevealing ? 1 : 0,
          }}
        />

        {(isRevealing || alwaysRevealing) && (
          <div className="absolute inset-0 pointer-events-none z-15">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full bg-white/40"
                style={{
                  left:
                    mousePosition.x +
                    Math.sin(waveOffset + i * 1) * (revealRadius * 0.9),
                  top:
                    mousePosition.y +
                    Math.cos(waveOffset + i * 1) * (revealRadius * 0.9),
                  opacity: 0.6 + Math.sin(waveOffset + i * 2) * 0.3,
                  transform: `scale(${
                    0.7 + Math.sin(waveOffset + i * 1.5) * 0.7
                  })`,
                  filter: "blur(2px)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.9)",
                  animation: `float ${3 + i}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div className="container relative z-25 mx-auto px-1 lg:px-4 py-5 lg:py-20 text-center">
           {/* Publicité en avant-plan, en haut */}
          <AdvertisementPopup position="hero-top" />
          
          <div className="absolute">
            <AdvertisementPopup position="hero-left"/>
          </div>
          <div className="absolute right-0">
            <AdvertisementPopup position="hero-right"/>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="mb-2 lg:mb-16 text-4xl md:text-6xl lg:text-8xl tracking-tight font-medium text-white"
          >
            <span className="block font-serif">La super-application</span>
            <span
              className="block text-secondary-text lg:text-logo mt-1 lg:mt-4 font-serif"
              style={{
                // color: colors.sruvol,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              du quotidien
            </span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto max-w-3xl my-0 lg:my-5"
            onClick={openModal}
          >
            <div
              className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-sm rounded-lg lg:rounded-full p-2 border-t border-l border-white/50 shadow-2xl cursor-text hover:bg-white/15 transition-all duration-300"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <Input
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Cliquez pour lancer une recherche avancée"
                  className="pl-12 h-14 lg:h-16 bg-transparent border-0 text-white placeholder:text-white/60 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-lg"
                />
              </div>
              <Button
                size="lg"
                className="md:w-auto bg-logo h-14 lg:h-16 px-8 text-md font-medium rounded-md lg:rounded-full hover:bg-logo/50 transition-transform duration-200"
                style={{
                  boxShadow: "0 4px 20px rgba(104, 142, 35, 0.3)",
                }}
              >
                Rechercher
              </Button>
            </div>
          </motion.div>
          <AdvertisementPopup position="hero-bottom" />
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative h-full w-full">
            <Recherche onClick={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;