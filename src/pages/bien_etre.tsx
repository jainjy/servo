import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import api from "@/lib/api"
import { Apple, Heart, Users, Leaf, Sprout } from "lucide-react";
import { useBienEtreTracking } from '@/hooks/useBienEtreTracking';
import Nutrition from "./Nutrition";
import Soin from "./Soin";
import Therapeute from "./Therapeute";
import MedecinesNaturelles from "./MedecineNaturelle";
import HuilesEssentielles from "./HuilesEssentielles";

// Composant d'animation personnalisé
const SlideIn = ({ children, direction = "left", delay = 0 }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-700 ease-out
        ${isInView
          ? "opacity-100 translate-x-0 translate-y-0"
          : direction === "left"
            ? "opacity-0 -translate-x-10"
            : direction === "right"
              ? "opacity-0 translate-x-10"
              : direction === "up"
                ? "opacity-0 translate-y-10"
                : "opacity-0 translate-y-10"
        }
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const BienEtre = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Nutrition');

  const {
    trackBienEtreView,
    trackBienEtreTabChange
  } = useBienEtreTracking();

  useEffect(() => {
    trackBienEtreView();
  }, []);

  useEffect(() => {
    if (activeTab) {
      trackBienEtreTabChange(activeTab);
    }
  }, [activeTab]);

  const tabs = [
    {
      id: 'Nutrition',
      label: 'Nutrition',
      icon: <Apple className="w-5 h-5" />
    },
    {
      id: 'Soin',
      label: 'Soins',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'Therapeute',
      label: 'Thérapeutes',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'HuilesEssentielles',
      label: 'Huiles Essentielles',
      icon: <Sprout className="w-5 h-5" />
    },
    {
      id: 'MedecinesNaturelles',
      label: 'Médecines Naturelles',
      icon: <Leaf className="w-5 h-5" />
    }
  ];

  return (
    <div className="font-sans text-foreground min-h-screen bg-background">

      {/* HERO - Toujours visible */}
      <section
        className="relative h-80 py-16 lg:py-20 text-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(85, 107, 47, 0.8), rgba(107, 142, 35, 0.6)), url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1999&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0  bg-gradient-to-b from-logo/20 to-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10  h-full flex flex-col justify-center">
          <SlideIn direction="up">
            <h1 className="text-4xl sm:text-5xl  lg:text-6xl font-extrabold mb-4 leading-tight" style={{ color: '#8B4513' }}>
             Santé & Bien-Être 
            </h1>
          </SlideIn>
          <SlideIn direction="up" delay={200}>
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed px-4">
              Découvrez nos expériences holistiques à domicile, en visio ou en compagnie de nos experts certifiés.
            </p>
          </SlideIn>
        </div>
      </section>

      {/* MENU DE TABULATION - Toujours visible */}
      <div className="sticky top-0 z-40 bg-white  dark:bg-card shadow-lg">
        <SlideIn direction="down">
          <LayoutGroup>
            <div className=" mx-auto px-4">
              <div className=" py-4 gap-2 grid grid-cols-2 md:grid-cols-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden flex-shrink-0 ${activeTab === tab.id
                        ? 'bg-logo text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60'
                      }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-logo rounded-2xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    <motion.span
                      animate={{
                        scale: activeTab === tab.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative z-10 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      {tab.icon}
                    </motion.span>

                    <motion.span
                      animate={{
                        x: activeTab === tab.id ? 2 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-sm font-bold relative z-10 whitespace-nowrap"
                    >
                      {tab.label}
                    </motion.span>
                  </button>
                ))}
              </div>
            </div>
          </LayoutGroup>
        </SlideIn>
      </div>

      {/* CONTENU DE LA TABULATION */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {activeTab === 'Nutrition' && (
              <Nutrition />
            )}
            
            {activeTab === 'Soin' && (
              <Soin />
            )}
            
            {activeTab === 'Therapeute' && (
              <Therapeute />
            )}
            
            {activeTab === 'HuilesEssentielles' && (
              <HuilesEssentielles />
            )}
            
            {activeTab === 'MedecinesNaturelles' && (
              <MedecinesNaturelles />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default BienEtre;