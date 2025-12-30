import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Home, TrendingUp, Package, User2Icon, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import "../styles/font.css";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Recherche from "@/pages/Recherche";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(SplitText);

// Définition des couleurs
const colors = {
  logoAccent: '#556B2F',
  sruvol: '#6B8E23',
  pageBg: '#FFFFFF',
  separators: '#D3D3D3',
  premium: '#884513',
};

// URL de l'image en dessin
const sketchImageUrl = "/2em.png";

const Hero = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroQuery, setHeroQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revealRadius, setRevealRadius] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [alwaysRevealing, setAlwaysRevealing] = useState(false);
  const [waveOffset, setWaveOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const mouseInactiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const heroImage = "https://i.pinimg.com/736x/e8/45/fd/e845fddd197e23cb546f49d1a8f2b5ac.jpg"

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Animation de l'onde et du rayon de révélation
  useEffect(() => {
    const animate = () => {
      setWaveOffset(prev => prev + 0.02);

      if (isRevealing || alwaysRevealing) {
        setRevealRadius(prev => {
          if (prev < 100) {
            return prev + (100 - prev) * 0.07;
          }
          return prev;
        });
      } else if (revealRadius > 0) {
        setRevealRadius(prev => prev * 0.92);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRevealing, revealRadius, alwaysRevealing, waveOffset]);

  // Générer des révélations aléatoires
  useEffect(() => {
    const alwaysActiveTimeout = setTimeout(() => {
      setAlwaysRevealing(true);
    }, 3000);

    return () => {
      clearTimeout(alwaysActiveTimeout);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });

    setIsRevealing(true);
    setAlwaysRevealing(false);

    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
    }

    mouseInactiveTimeoutRef.current = setTimeout(() => {
      setIsRevealing(false);
      setTimeout(() => {
        setAlwaysRevealing(true);
      }, 2000);
    }, 1000);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsRevealing(false);
    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
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

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          animation: slideInLeft 0.8s ease-out;
        }

        .hero-subtitle {
          animation: slideInLeft 0.8s ease-out 0.2s both;
        }

        .hero-description {
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-cta {
          animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .hero-card {
          animation: slideInRight 0.8s ease-out 0.3s both;
        }

        .grayscale-image {
          filter: grayscale(100%) brightness(0.9) contrast(1.1);
        }
      `}</style>

      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen h-96 w-full overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image with Grayscale Effect */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={heroImage}
            alt="Background"
            className="absolute inset-0 w-full object-center  h-full"
            style={{
              transform: `translateY(${scrollProgress * 30}px)`,
            }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        </div>

        {/* Content Container */}
        <div className="relative z-20 h-full min-h-screen flex items-start pt-32 lg:items-center lg:pt-0">
          <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-16 lg:items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 lg:space-y-12"
              >

                {/* Main Title */}
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="hero-title font-serif text-4xl leading-loose md:text-5xl lg:text-7xl uppercase tracking-widest font-light text-white"
                  >
                    Votre plateforme
                    <br />
                    <span className="text-gray-500">
                      du quotidien
                    </span>
                  </motion.h1>
                </div>

                {/* Search Input Overlay */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className=" max-w-2xl w-full px-4 pointer-events-auto"
                  onClick={openModal}
                >
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                    <div className="flex-1 flex items-center">
                      <Search className="ml-4 h-5 w-5 text-white/70 flex-shrink-0" />
                      <Input
                        value={heroQuery}
                        onChange={(e) => setHeroQuery(e.target.value)}
                        placeholder="Recherche avancée..."
                        className="pl-3 pr-4 h-12 bg-transparent border-0 text-white placeholder:text-white/60 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        className="h-12 px-6 rounded-full font-medium flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                        style={{
                          backgroundColor: colors.sruvol,
                          color: 'white',
                          boxShadow: '0 4px 15px rgba(104, 142, 35, 0.4)'
                        }}
                      >
                        <span>Rechercher</span>
                        <ArrowUpRight className="h-5 w-5 transform rotate-30" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

              </motion.div>

              {/* Right Card - Service Cards */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="hero-card hidden lg:block absolute bottom-8 right-8 w-auto">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: Home, title: "Annonces Immobilières", description: "Trouver votre futur logement", href: "/immobilier" },
                    { icon: TrendingUp, title: "Services professionnels", description: "Trouver un professionnel", href: "/service" },
                    { icon: Package, title: "Décoration & Mobilier", description: "Tous les produits pour la maison", href: "/produits" },
                    { icon: User2Icon, title: "Vivre à la réunion", description: "Une douceur de vie tropicale", href: "/tourisme" },
                  ].map((service) => (
                    <Link to={service.href} key={service.title} className="no-underline">
                      <Card className="p-2 text-center flex flex-col items-center justify-center hover:shadow-2xl shadow-lg transition-all duration-500 cursor-pointer bg-transparent hover:bg-white/10 group relative overflow-hidden border-b-0 border-r-0 h-full min-h-[100px]">
                        <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-tr from-black via-transparent to-white" />
                        <div className="relative mb-1 z-10 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/10 border border-white/30 transition-all duration-500 group-hover:from-white/30 group-hover:to-white/15 group-hover:scale-110 group-hover:rotate-3">
                          <service.icon className="h-4 w-4 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="relative z-10 flex-1 w-full px-1">
                          <h3 className="font-bold text-white text-center transition-colors duration-300 text-xs leading-tight line-clamp-1 mb-0.5">{service.title}</h3>
                          <p className="text-white/70 text-center text-xs line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">{service.description}</p>
                        </div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-2/3 transition-all duration-500" />
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Reveal Bulb with Image - Behind all content */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{
            clipPath: `circle(${revealRadius}px at ${mousePosition.x}px ${mousePosition.y}px)`,
            opacity: (isRevealing || alwaysRevealing) ? 1 : 0,
            transition: 'opacity 0.4s ease-out',
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={sketchImageUrl}
            alt="Dessin architectural"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              filter: 'grayscale(70%)',
              mixBlendMode: 'multiply',
              opacity: 1,
            }}
          />
        </div>

        {/* Reveal Bulb Effect Layer */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-1"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x}px ${mousePosition.y}px,
                rgba(255, 255, 255, ${(isRevealing || alwaysRevealing) ? 0.18 : 0}) 0%,
                transparent ${(isRevealing || alwaysRevealing) ? Math.min(280, revealRadius * 1.6) + 'px' : '0px'}
              )
            `,
            mixBlendMode: "overlay",
            opacity: (isRevealing || alwaysRevealing) ? 1 : 0,
          }}
        />

      </section>

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