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
import { motion, AnimatePresence, Variants } from "framer-motion";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const [heroQuery, setHeroQuery] = useState("");
  const navigate = useNavigate();

  const [targetRotation, setTargetRotation] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50, opacity: 0 });
  const requestRef = useRef<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const animate = () => {
    setCurrentRotation((prev) => {
      const lerp = 0.08;
      const newX = prev.x + (targetRotation.x - prev.x) * lerp;
      const newY = prev.y + (targetRotation.y - prev.y) * lerp;
      return { x: newX, y: newY };
    });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [targetRotation]);

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
  };

  const handleMouseLeave = () => {
    setTargetRotation({ x: 0, y: 0 });
    setLightPosition({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <>
      <section
        id="hero"
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="perspective-[500px] w-full h-screen rounded-lg bg-black overflow-hidden absolute"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={heroImage}
            alt="Background"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
            style={{
              transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) scale(1.05)`
            }}
          />
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,${lightPosition.opacity}) 0%, transparent 60%)`,
              mixBlendMode: "overlay",
            }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 lg:mt-0 -mt-2 text-2xl md:text-5xl lg:text-7xl tracking-wide font-bold text-white">
            La super-application
            <br />
            de l'habitat
          </h1>

          <p className="mb-12 text-xl text-white drop-shadow-md">
            Immobilier, services et produits — tout en un, guidé par l'IA
          </p>

          <div className="mx-auto max-w-3xl" onClick={openModal}>
            <div
              className="flex flex-col md:flex-row gap-3 bg-white rounded-2xl p-3 shadow-2xl cursor-text"
            //  onClick={openSearchPage}
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  // onFocus={openSearchPage}
                  // onKeyPress={handleKeyPress}
                  placeholder="Cliquez pour lancer une recherche avancée"
                  className="pl-12 h-12 border-0 bg-transparent text-base focus-visible:ring-0 placeholder:text-gray-500 cursor-pointer"
                />
              </div>
              <Button
                size="lg"
                className="md:w-auto bg-slate-900 hover:bg-slate-700 text-white"
              // onClick={openSearchPage}
              >
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>
      {isModalOpen && (
        <div className="fixed z-50 overflow-hidden w-full h-full backdrop-blur-md inset-0">

          <div className="h-[600px] absolute bottom-0 w-full overflow-hidden">
            <Recherche onClick={closeModal} />
          </div>
        </div>

      )}
    </>
  );
};

export default Hero;