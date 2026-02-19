import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, TrendingUp, Package, User2, Search } from "lucide-react"; // Ajout des icônes
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "/hero2-1.jpg";
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
const sketchImageUrl = "/hero2-2.jpg";

// Services à afficher
const services = [
  {
    icon: Home,
    title: "Annonces Immobilières",
    description: "Trouver votre futur logement",
    color: "text-[#556B2F]",
    href: "/immobilier"
  },
  {
    icon: TrendingUp,
    title: "Services professionnels",
    description: "Trouver un professionnel",
    color: "text-[#6B8E23]",
    href: "/service"
  },
  {
    icon: Package,
    title: "Décoration & Mobilier",
    description: "Tous les produits pour la maison",
    color: "text-[#8B4513]",
    href: "/produits"
  },
  {
    icon: User2,
    title: "Explorer et vivre",
    description: "Une douceur de vie tropicale",
    color: "text-[#2F4F4F]",
    href: "/tourisme"
  },
];

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
  const [alwaysRevealing, setAlwaysRevealing] = useState(false);
  
  // Nouvel état pour le switch
  const [showSketch, setShowSketch] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation de l'onde et du rayon de révélation
  useEffect(() => {
    let mounted = true;

    const animate = () => {
      if (!mounted) return;
      setWaveOffset((prev) => prev + 0.02);

      if (isRevealing || alwaysRevealing) {
        setRevealRadius((prev) => {
          if (prev < 100) return prev + (100 - prev) * 0.07;
          return prev;
        });
      } else if (revealRadius > 0) {
        setRevealRadius((prev) => prev * 0.92);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRevealing, alwaysRevealing, revealRadius]);

  // Gestionnaire d'inactivité
  useEffect(() => {
    const alwaysActiveTimeout = setTimeout(() => {
      setAlwaysRevealing(true);
    }, 3000);

    return () => clearTimeout(alwaysActiveTimeout);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });
    setIsRevealing(true);
    setMouseInactive(false);
    setAlwaysRevealing(false);

    if (mouseInactiveTimeoutRef.current) clearTimeout(mouseInactiveTimeoutRef.current);

    mouseInactiveTimeoutRef.current = setTimeout(() => {
      setMouseInactive(true);
      setIsRevealing(false);
      setTimeout(() => setAlwaysRevealing(true), 2000);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsRevealing(false);
    setMouseInactive(false);
    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
      mouseInactiveTimeoutRef.current = null;
    }
    setTimeout(() => setAlwaysRevealing(true), 500);
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

  return (
    <>
      <style>{`
        .wave-distortion {
          filter: url(#wave-filter);
          transition: filter 0.3s ease-out;
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

        /* Styles pour le switch - Position bas droite */
        .switch-container {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          padding: 8px 16px;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .switch-container:hover {
          transform: scale(1.05);
          background: rgba(0, 0, 0, 0.4);
        }

        .switch-label {
          color: white;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.3);
          transition: 0.3s;
          border-radius: 34px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 2px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }

        input:checked + .slider {
          background-color: #6B8E23;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }

        .switch-icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: white;
          pointer-events: none;
        }

        .switch-icon.real {
          left: 6px;
          opacity: ${!showSketch ? 1 : 0.5};
        }

        .switch-icon.sketch {
          right: 6px;
          opacity: ${showSketch ? 1 : 0.5};
        }

        /* Media query pour mobile */
        @media (max-width: 768px) {
          .switch-container {
            bottom: 10px;
            right: 10px;
            padding: 6px 12px;
          }
          
          .switch-label {
            font-size: 12px;
          }
          
          .switch {
            width: 46px;
            height: 24px;
          }
          
          .slider:before {
            height: 18px;
            width: 18px;
          }
          
          input:checked + .slider:before {
            transform: translateX(20px);
          }
        }
      `}</style>

      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-[460px] flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Bouton Switch - Positionné en bas à droite */}
        {/* <div className="switch-container">
          <span className="switch-label">Mode</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={showSketch}
              onChange={(e) => setShowSketch(e.target.checked)}
            />
            <span className="slider">
              <span className="switch-icon real">📷</span>
              <span className="switch-icon sketch">✏️</span>
            </span>
          </label>
        </div> */}

        {/* Filtre SVG pour l'effet d'onde */}
        <svg style={{ display: "none" }}>
          <defs>
            <filter id="wave-filter" x="-20%" y="-20%" width="140%" height="140%">
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

        {/* Image de fond avec effet de parallaxe */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: `translateY(${scrollProgress * 20}px)`,
            transition: "transform 0.2s ease-out",
          }}
        >
          <motion.img
            src={showSketch ? sketchImageUrl : heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{ 
              filter: showSketch ? "brightness(0.9) contrast(1.1)" : "brightness(0.7) contrast(1.1)",
              transition: "filter 0.4s ease-out"
            }}
            animate={{
              x: (mousePosition.x - window.innerWidth / 2) * 0.003,
              y: (mousePosition.y - window.innerHeight / 2) * 0.003,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 40 }}
          />

          {/* Calque de révélation avec l'image de dessin (conditionnel) */}
          {!showSketch && (
            <div
              className="absolute top-0 left-0 w-full h-full wave-distortion reveal-mask"
              style={{
                opacity: isRevealing || alwaysRevealing ? 1 : 0,
                pointerEvents: "none",
                transition: "opacity 0.4s ease-out",
                "--mouse-x": `${mousePosition.x}px`,
                "--mouse-y": `${mousePosition.y}px`,
                "--reveal-radius": `${revealRadius}px`,
              } as React.CSSProperties}
            >
              <img
                src={sketchImageUrl}
                alt="Dessin architectural"
                className="absolute top-0 left-0 w-full h-full object-cover"
                style={{
                  mixBlendMode: "multiply",
                  opacity: 1,
                  transform: `
                    translateX(${getWaveDistortion(mousePosition.x, mousePosition.y, waveOffset)}px)
                    translateY(${getWaveDistortion(mousePosition.y, mousePosition.x, waveOffset + 1)}px)
                  `,
                  transition: "transform 0.1s linear",
                }}
              />
              <div
                className="reveal-overlay"
                style={{
                  "--mouse-x": `${mousePosition.x}px`,
                  "--mouse-y": `${mousePosition.y}px`,
                  "--reveal-opacity": isRevealing || alwaysRevealing ? 1 : 0,
                } as React.CSSProperties}
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
        </div>

        {/* Contenu Hero MINI - POLICE LATO/SANS */}
        <div className="container relative z-30 mx-auto px-4">

          {/* Publicités */}
          <div className="absolute left-0 h-full flex flex-row items-center ">
            <AdvertisementPopup position="hero-left" />
          </div>

          <div className="absolute right-0 h-full flex flex-row items-center ">
            <AdvertisementPopup position="hero-right" />
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-3"
            >
              <span className="block text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-2 tracking-tight">
                La super-application
              </span>
              <span
                className="block text-3xl md:text-4xl lg:text-5xl font-serif font-light"
                style={{
                  color: "#6B8E23",
                  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                du quotidien
              </span>
            </motion.h1>

            {/* Barre de recherche compacte */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-xl mt-6 font-sans px-7"
              onClick={openModal}
            >
              <div className="flex flex-col sm:flex-row gap-2 bg-white/15 backdrop-blur-md rounded-xl sm:rounded-full p-1.5 border border-white/40 shadow-xl cursor-text hover:bg-white/20 transition-all duration-300">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/80" />
                  <Input
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="pl-9 h-11 bg-transparent border-0 text-white placeholder:text-white/70 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                  />
                </div>
                <Button
                  size="default"
                  className="sm:w-auto bg-[#6B8E23] h-11 px-6 text-sm font-medium rounded-lg sm:rounded-full hover:bg-[#556B2F] transition-all duration-200 shadow-md font-sans"
                >
                  Rechercher
                </Button>
              </div>
            </motion.div>

            {/* Services section - ajoutée ici */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6 font-sans"
            >
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(service.href)}
                    className="group flex flex-col items-center w-24 md:w-28 p-2 cursor-pointer"
                  >
                    <div className="group flex flex-col items-center w-24 md:w-28 p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300">
                      <Icon className={`w-6 h-6 md:w-7 md:h-7 mb-1 text-white`} />
                    </div>
                    <span className="text-[10px] md:text-xs text-white/70 text-center">
                      {service.description}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            <AdvertisementPopup position="hero-bottom" showOnMobile={true} />
          </div>
        </div>
      </section>

      {/* Modal de recherche */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative h-full w-full">
            <Recherche onClick={closeModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;