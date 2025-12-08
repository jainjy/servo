import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-house.jpg";
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
const sketchImageUrl = "/image.png";

// Fonction pour générer un masque SVG polygonal organique avec pourcentages
const generateBlobPolygon = (centerX: number, centerY: number, radius: number, shapePoints: number[], viewportWidth: number, viewportHeight: number) => {
  if (shapePoints.length === 0) return '';
  
  const points = shapePoints.map((scale, idx) => {
    const angle = (idx / shapePoints.length) * Math.PI * 2;
    const distance = radius * scale;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // Convertir en pourcentage
    const xPercent = (x / viewportWidth) * 100;
    const yPercent = (y / viewportHeight) * 100;
    
    return `${xPercent}% ${yPercent}%`;
  }).join(', ');
  
  return `polygon(${points})`;
};

const Hero = () => {
  const [heroQuery, setHeroQuery] = useState("");
  const navigate = useNavigate();

  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [revealPosition, setRevealPosition] = useState({ x: 0, y: 0, radius: 0 });
  const [isRevealing, setIsRevealing] = useState(false);
  const [mouseInactive, setMouseInactive] = useState(false);
  const [liquidWave, setLiquidWave] = useState(0);
  const [blobShape, setBlobShape] = useState<number[]>([]);
  const mouseInactiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const waveAnimationRef = useRef<number | null>(null);
  
  const requestRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const sketchCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Particules effet
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
  }>>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const animate = () => {
    setCurrentRotation((prev) => {
      const lerp = 0.08;
      const newX = prev.x + (targetRotation.x - prev.x) * lerp;
      const newY = prev.y + (targetRotation.y - prev.y) * lerp;
      return { x: newX, y: newY };
    });
    
    // Animation du rayon du blob - réduit à 250px max
    if (isRevealing && revealPosition.radius < 250) {
      setRevealPosition(prev => ({
        ...prev,
        radius: prev.radius + (250 - prev.radius) * 0.12
      }));
    } else if (!isRevealing && revealPosition.radius > 0) {
      setRevealPosition(prev => ({
        ...prev,
        radius: prev.radius * 0.92
      }));
    }
    
    requestRef.current = requestAnimationFrame(animate);
  };

  // Initialisation des particules
  useEffect(() => {
    particlesRef.current = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.7 ? colors.sruvol : colors.logoAccent,
    }));
    
    // Initialiser la forme du blob avec des valeurs aléatoires
    const shapePoints = Array.from({ length: 12 }, () => 0.8 + Math.random() * 0.4);
    setBlobShape(shapePoints);
  }, []);

  // Préchargement de l'image de dessin
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = sketchImageUrl;
    
    img.onload = () => {
      const canvas = sketchCanvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Redimensionner le canvas à la taille de l'écran
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Dessiner l'image de dessin
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Appliquer un filtre pour renforcer l'effet dessin
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Améliorer le contraste pour l'effet dessin
      for (let i = 0; i < data.length; i += 4) {
        // Convertir en niveau de gris
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Créer un effet de dessin au trait
        const threshold = 150;
        const value = avg > threshold ? 255 : 0;
        
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 255;   // Alpha
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
  }, []);

  // Animer les points du blob avec la vague
  useEffect(() => {
    if (isRevealing && blobShape.length > 0) {
      setBlobShape(prev => 
        prev.map((_, idx) => {
          return 0.75 + Math.sin(liquidWave * 0.03 + idx * Math.PI / 6) * 0.35;
        })
      );
    }
  }, [liquidWave, isRevealing]);

  // Animation des particules
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Mise à jour position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebond sur les bords
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Effet de suivie de souris
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
          const force = 0.02;
          particle.speedX += (dx / distance) * force;
          particle.speedY += (dy / distance) * force;
        }

        // Limiter la vitesse
        const maxSpeed = 1;
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed;
          particle.speedY = (particle.speedY / speed) * maxSpeed;
        }

        // Dessiner la particule
        ctx.beginPath();
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Dessiner des lignes entre particules proches
        particlesRef.current.forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `${colors.logoAccent}20`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mousePosition]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetRotation, isRevealing]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const parent = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - parent.left) / parent.width - 0.5;
    const y = (e.clientY - parent.top) / parent.height - 0.5;

    const rotateY = x * -25;
    const rotateX = y * 20;

    setTargetRotation({ x: rotateX, y: rotateY });

    const lightX = ((e.clientX - parent.left) / parent.width) * 100;
    const lightY = ((e.clientY - parent.top) / parent.height) * 100;
    setLightPosition({ x: lightX, y: lightY, opacity: 0.25 });

    // Mettre à jour la position de la souris pour les particules
    setMousePosition({ x: e.clientX, y: e.clientY });

    // Activer l'effet de révélation et les vagues
    setIsRevealing(true);
    setMouseInactive(false);
    
    // Réinitialiser le timer d'inactivité
    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
    }
    
    // Mettre à jour la position du blob avec l'effet liquide
    setRevealPosition(prev => ({
      x: e.clientX,
      y: e.clientY,
      radius: prev.radius
    }));
    
    // Lancer l'animation des vagues
    if (waveAnimationRef.current) {
      cancelAnimationFrame(waveAnimationRef.current);
    }
    
    let waveProgress = 0;
    const waveAnimate = () => {
      waveProgress += 0.15;
      setLiquidWave(waveProgress % 100);
      
      if (isRevealing) {
        waveAnimationRef.current = requestAnimationFrame(waveAnimate);
      }
    };
    waveAnimationRef.current = requestAnimationFrame(waveAnimate);
    
    // Activer l'inactivité après 1.5 secondes sans mouvement
    mouseInactiveTimeoutRef.current = setTimeout(() => {
      setMouseInactive(true);
      setIsRevealing(false);
      if (waveAnimationRef.current) {
        cancelAnimationFrame(waveAnimationRef.current);
      }
    }, 1500);
  };

  const handleMouseLeave = () => {
    setTargetRotation({ x: 0, y: 0 });
    setLightPosition({ x: 50, y: 50, opacity: 0 });
    setIsRevealing(false);
    setMouseInactive(false);
    if (mouseInactiveTimeoutRef.current) {
      clearTimeout(mouseInactiveTimeoutRef.current);
    }
    if (waveAnimationRef.current) {
      cancelAnimationFrame(waveAnimationRef.current);
    }
  };

  // Effet de parallaxe au scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = heroRef.current?.offsetHeight || 600;
      const progress = Math.min(scrollY / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Filtre SVG pour l'effet liquide */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="liquidWave">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency={`0.02`} 
              numOctaves="4" 
              result="noise"
              seed={liquidWave}
            />
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={`${isRevealing ? 50 : 0}`}
              xChannelSelector="R" 
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Canvas pour les particules */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        />

        {/* Canvas pour l'image de dessin */}
        <canvas
          ref={sketchCanvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-5"
          style={{
            mixBlendMode: 'multiply',
            opacity: 0.7
          }}
        />

        {/* Conteneur pour les images superposées */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: `translateY(${scrollProgress * 50}px) scale(${1 + scrollProgress * 0.1})`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Image principale (photo) */}
          <img
            src={heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
            style={{
              filter: 'brightness(0.8) contrast(1.1) saturate(1.1)',
              transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) scale(1.1)`,
              transition: 'transform 0.1s ease-out',
            }}
          />

          {/* Image de dessin avec masque de révélation liquide organique */}
          <div 
            className="absolute top-0 left-0 w-full h-full transition-opacity duration-500"
            style={{
              opacity: isRevealing ? 1 : 0,
              clipPath: generateBlobPolygon(revealPosition.x, revealPosition.y, Math.max(0, revealPosition.radius), blobShape, window.innerWidth, window.innerHeight),
              transition: 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              pointerEvents: isRevealing ? 'auto' : 'none',
            }}
          >
            <img
              src={sketchImageUrl}
              alt="Dessin architectural"
              className="absolute top-0 left-0 w-full h-full object-cover"
              style={{
                filter: 'grayscale(100%) brightness(1.5) contrast(1.2)',
                mixBlendMode: 'multiply',
                opacity: 0.9
              }}
            />
          </div>

          {/* Effet de bordure liquide animée avec forme organique */}
          {isRevealing && (
            <svg
              className="absolute pointer-events-none overflow-visible"
              style={{
                left: revealPosition.x - Math.max(0, revealPosition.radius) - 20,
                top: revealPosition.y - Math.max(0, revealPosition.radius) - 20,
                width: Math.max(0, revealPosition.radius) * 2 + 40,
                height: Math.max(0, revealPosition.radius) * 2 + 40,
              }}
            >
              <g>
                {blobShape.map((scale, idx) => {
                  const angle = (idx / blobShape.length) * Math.PI * 2;
                  const nextAngle = ((idx + 1) / blobShape.length) * Math.PI * 2;
                  const distance = Math.max(0, revealPosition.radius) * scale;
                  const nextDistance = Math.max(0, revealPosition.radius) * blobShape[(idx + 1) % blobShape.length];
                  
                  const x = Math.max(0, revealPosition.radius) + Math.cos(angle) * distance + 20;
                  const y = Math.max(0, revealPosition.radius) + Math.sin(angle) * distance + 20;
                  
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={`rgba(107, 142, 35, ${0.5 + Math.sin(liquidWave * Math.PI / 100) * 0.3})`}
                      style={{
                        filter: `blur(${1 + Math.sin(liquidWave * Math.PI / 100)}px)`,
                      }}
                    />
                  );
                })}
              </g>
            </svg>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </div>

        {/* Effet de lumière interactive */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500 z-10"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,${lightPosition.opacity}) 0%, transparent 50%)`,
            mixBlendMode: "overlay",
          }}
        />

        {/* Contenu principal */}
        <div className="container relative z-20 mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-6 text-4xl md:text-6xl lg:text-8xl tracking-tight font-bold text-white"
          >
            <span className="block">La super-application</span>
            <span 
              className="block mt-4"
              style={{ 
                color: colors.sruvol,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              de l'habitat
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-12 text-lg lg:text-2xl text-white/90 font-light tracking-wide"
            style={{ textShadow: '0 1px 5px rgba(0,0,0,0.3)' }}
          >
            Immobilier, services et produits — tout en un, guidé par l'IA
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto max-w-3xl"
            onClick={openModal}
          >
            <div
              className="flex flex-col md:flex-row gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 shadow-2xl cursor-text hover:bg-white/15 transition-all duration-300"
              style={{ backdropFilter: 'blur(10px)' }}
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
                className="md:w-auto h-14 lg:h-16 px-8 text-lg font-medium rounded-xl hover:scale-105 transition-transform duration-200"
                style={{
                  backgroundColor: colors.sruvol,
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(104, 142, 35, 0.3)'
                }}
              >
                Rechercher
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Indicateur d'interaction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: (isRevealing && !mouseInactive) ? 0 : 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 text-center"
        >
          <p className="text-white/60 text-sm tracking-wider mb-2">
            SURVOLEZ POUR RÉVÉLER LE DESSIN
          </p>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-6 mx-auto border-2 border-white/40 rounded-full flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-white/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 overflow-hidden"
          >
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