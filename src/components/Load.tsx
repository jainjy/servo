import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ServoLogo from './components/ServoLogo';
import TopographicPage from './animation/Line';
import Lottie from "lottie-react";
import loginAnimation from "@/assets/click.json"
import { SplitText } from 'gsap/all';
import '@/styles/font.css'
import InteractivePortrait from './animation/Liquide';
import vid from '/111.mp4'

// Enregistrer les plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}


// Données pour les partenaires
const partners = [
  { id: 1, name: 'Olimmo', logo: 'olimmo.png' },
  { id: 2, name: 'Partenaire 2', logo: 'https://i.pinimg.com/736x/cc/3c/db/cc3cdb8498f8d4135b87f8501f3faa31.jpg' },
  { id: 3, name: 'Partenaire 3', logo: 'https://i.pinimg.com/1200x/9d/1b/af/9d1baf24622b6c568ed6f41f826c7105.jpg' },
  { id: 4, name: 'Partenaire 4', logo: 'https://i.pinimg.com/1200x/4d/7a/ec/4d7aecb5e539968fec979b35f5618527.jpg' },
  { id: 5, name: 'Partenaire 5', logo: 'https://i.pinimg.com/736x/f0/64/d7/f064d7192801ed944991351e99efdbf2.jpg' },
  { id: 6, name: 'Partenaire 6', logo: 'https://i.pinimg.com/736x/bb/d6/2a/bbd62ab19fe388ef4dac11d2f21be3f7.jpg' },
  { id: 7, name: 'Partenaire 7', logo: 'https://i.pinimg.com/1200x/83/5d/9d/835d9d7c0f06a49b079418cd59914762.jpg' },
  { id: 8, name: 'Partenaire 8', logo: 'https://i.pinimg.com/736x/52/52/5c/52525c7b87e0600a27bf66a9ec1e04f2.jpg' },
];

// Texte de la philosophie
const philosophyText = "L'innovation naît de la collaboration ";
const philosophyText0 = "et de la passion partagée. Chaque projet est une nouvelle aventure, ";
const philosophyText1 = "chaque succès ";
const philosophyText2 = "une victoire collective. Notre force réside dans notre diversité et notre unité d'action.";
const philosophyText3 = " Ensemble, ";
const philosophyText4 = "nous transformons les défis en opportunités extraordinaires. ";
const philosophyText5 = "La confiance ";
const philosophyText6 = "de nos clients est notre plus grande récompense.";


const currentYear = new Date().getFullYear();

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const targetSectionRef = useRef<HTMLDivElement>(null);
  const text = "EN SAVOIR PLUS";

  const handleClick = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  const handleClick0 = () => {
    const heroElement = document.getElementById('section2');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const scrollDisabledRef = useRef<boolean>(true);

  useEffect(() => {
    // Marquer que l'animation a été complétée
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('VisitAnimation', 'true');
    }

    // Vérifier quand atteindre le Hero
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // Si le Hero est visible à l'écran, activer le scroll
        if (rect.top <= window.innerHeight) {
          scrollDisabledRef.current = false;
          if (containerRef.current) {
            containerRef.current.style.overflowY = 'visible';
          }
          document.body.style.overflowY = 'auto';
          document.documentElement.style.overflowY = 'auto';
        }
      }
    };

    // Initiale: bloquer le scroll
    if (containerRef.current) {
      containerRef.current.style.overflowY = 'hidden';
    }
    document.body.style.overflowY = 'hidden';
    document.documentElement.style.overflowY = 'hidden';

    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      // Animation de la section 1 - Logo au centre
      gsap.fromTo(
        logoRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'back.out(1.7)',
        }
      );
      // ScrollTrigger pour la section 2 - Philosophie
      gsap.fromTo(
        philosophyRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section2Ref.current,
            start: 'top center+=100',
            end: 'center center',
            scrub: 1,
            onEnter: () => {
              onLoadingComplete?.();
            },
          },
        }
      );

      // ScrollTrigger pour la section 3 - Page d'accueil
      gsap.fromTo(
        componentsRef.current,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section3Ref.current,
            start: 'top center+=100',
            end: 'center center',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflowY = 'auto';
    };
  }, [onLoadingComplete]);

  useEffect(() => {



    let split = SplitText.create("#text", { type: "chars,words" });
    gsap.from(split.chars, {
      duration: 2,
      opacity: 0.1,
      stagger: 0.04,
      ease: "power2.out",
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <>
      {/* <div className='z-40'>
            <InteractivePortrait />
          </div> */}
      <div className=' h-[200vh] absolute z-[999]'>
        <TopographicPage />
      </div >
      <div ref={containerRef} className="w-full z-[9999] relative">

        {/* SECTION 1: Grand logo au centre + Partenaires en bas */}
        <section
          ref={section1Ref}
          className="relative z-10 min-h-screen h-screen w-full flex flex-col items-center px-4 snap-start"
        >

          <div className='-z-10 lg:block hidden cursor-pointer'>
            <InteractivePortrait />
          </div>
          {/* Logo centré */}

          <div
            id='containerImg'
            ref={logoRef}
            className="flex absolute flex-col pt-10 cursor-pointer"
            onClick={handleClick0}
          >

            <div
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-secondary-text shadow-lg"
            // style={{
            //   animation: 'float 6s ease-in-out infinite',
            // }}
            >
              <div className="absolute top-5 z-[99999] w-40 h-40 lg:w-56 lg:h-56">
                <Lottie
                  animationData={loginAnimation}
                  loop
                  autoplay
                />
              </div>
              <div className="absolute inset-0 z-0" />

              <div className="absolute inset-0 rounded-full border-4 border-logo" />
              <img
                src="golo.png"
                alt="Logo Oliplus"
                className="w-full h-full object-cover rounded-full z-10 transform group-hover:scale-110 transition-transform duration-700 bg-[#ffffff] p-8"
              />

              <div className="absolute -inset-2 rounded-full z-0 group-hover:opacity-60 transition-opacity duration-500" />

            </div>
          </div>

          {/* Partenaires en bas */}
          <div className="w-full pt-20 mt-64 pb-10 pointer-events-none">
            <div className="container mx-auto px-4">
              <h3 className="text-center text-white text-xl uppercase tracking-widest mb-12 font-extralight">
                Nos Partenaires de Confiance
              </h3>

              <div className="grid grid-cols-3 md:grid-cols-8 gap-3">
                <style>{`
    @keyframes shine {
      0% { left: -100%; }
      100% { left: 200%; }
    }
    @keyframes grayscalePulse {
      0%, 100% { filter: grayscale(100%); }
      45%, 55% { filter: grayscale(0%); }
    }
  `}</style>

                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-black/60 backdrop-blur-lg rounded-md hover:bg-black/80 transition-all duration-500 group border border-white/10 hover:border-white/20 shadow-lg overflow-hidden relative aspect-square"
                  >
                    {/* Animation de surbrillance */}
                    <div className="absolute inset-0 overflow-hidden rounded-md">
                      <div
                        className="absolute -left-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                        style={{
                          animation: 'shine 3s infinite',
                        }}
                      ></div>
                    </div>

                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 opacity-70 group-hover:opacity-100 z-10"
                      style={{
                        animation: 'grayscalePulse 3s infinite',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-all duration-500 z-20">
                      <p className="text-white text-xs font-light text-center tracking-wide whitespace-nowrap px-2">
                        {partner.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Lettre de philosophe très grande */}
        <section
          ref={targetSectionRef}
          id='section2'
          className="relative z-[9999] overflow-hidden min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#252c1d] pb-10 snap-start"
        >

          {/* Double cercle décoratif animé */}
          <div className="pointer-events-none absolute top-0 right-28 flex items-center justify-center z-50">
            <style>{`
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes spinFast {
      from { transform: rotate(360deg); }
      to   { transform: rotate(0deg); }
    }
  `}</style>

            {/* Cercle externe – lent */}
            <svg
              width="760"
              height="760"
              viewBox="0 0 460 460"
              className="absolute opacity-60"
              style={{
                animation: "spinSlow 88s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="230"
                cy="230"
                r="180"
                fill="none"
                stroke="#93960b"
                strokeWidth="1"
                strokeDasharray="1 3"
                strokeLinecap="round"
                transform="rotate(-90 230 230)"
              />
            </svg>

            {/* Cercle interne – plus rapide */}
            <svg
              width="600"
              height="600"
              viewBox="0 0 400 400"
              className="absolute opacity-80"
              style={{
                animation: "spinFast 93s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#93960b"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeLinecap="round"
                transform="rotate(-90 200 200)"
              />
            </svg>
          </div>

{/* Double cercle décoratif animé */}
          <div className="pointer-events-none absolute bottom-0 left-28 flex items-center justify-center z-50">
            <style>{`
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }

    @keyframes spinFast {
      from { transform: rotate(360deg); }
      to   { transform: rotate(0deg); }
    }
  `}</style>

            {/* Cercle externe – lent */}
            <svg
              width="760"
              height="760"
              viewBox="0 0 460 460"
              className="absolute opacity-60"
              style={{
                animation: "spinSlow 88s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="230"
                cy="230"
                r="180"
                fill="none"
                stroke="#93960b"
                strokeWidth="1"
                strokeDasharray="1 3"
                strokeLinecap="round"
                transform="rotate(-90 230 230)"
              />
            </svg>

            {/* Cercle interne – plus rapide */}
            <svg
              width="600"
              height="600"
              viewBox="0 0 400 400"
              className="absolute opacity-80"
              style={{
                animation: "spinFast 93s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#93960b"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeLinecap="round"
                transform="rotate(-90 200 200)"
              />
            </svg>
          </div>

          {/* Double cercle décoratif animé */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
            <style>{`
    @keyframes spinFast {
      from { transform: rotate(360deg); }
      to   { transform: rotate(0deg); }
    }
  `}</style>

            {/* Cercle interne – plus rapide */}
            <svg
              width="600"
              height="600"
              viewBox="0 0 400 400"
              className="absolute opacity-80"
              style={{
                animation: "spinFast 93s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#93960b"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeLinecap="round"
                transform="rotate(-90 200 200)"
              />
            </svg>
          </div>

           {/* Double cercle décoratif animé */}
          <div className="pointer-events-none absolute mr-44 inset-0 flex items-center justify-center z-30">
            <style>{`
    @keyframes spinFast {
      from { transform: rotate(360deg); }
      to   { transform: rotate(0deg); }
    }
  `}</style>

            {/* Cercle interne – plus rapide */}
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="absolute opacity-80"
              style={{
                animation: "spinFast 93s linear infinite",
                transformOrigin: "50% 50%",
              }}
            >
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#93960a"
                strokeWidth="1"
                strokeDasharray="1 1"
                strokeLinecap="round"
                transform="rotate(-90 200 200)"
              />
            </svg>
          </div>

          {/* Overlay semi-transparent pour la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#252c1d]/90 to-[#252c1d]/90 backdrop-blur-md z-10" />

          <div className='absolute top-10 overflow-hidden w-full z-10'>
            <svg width="1194" height="660" viewBox="0 0 2194 1300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M422.501 146.649C422.501 146.649 331.784 228.083 302.582 294.604C259.866 391.908 302.582 562.523 302.582 562.523C302.582 562.523 417.345 716.168 373.645 806.449C319.484 918.342 107.347 788.218 40.5348 894.423C-55.2534 1046.69 263.671 1139.35 458.033 1138.35C549.764 1137.88 593.104 1075.83 684.548 1082.37C815.466 1091.73 839.206 1214.48 964.36 1250.31C1215.48 1322.21 1416.69 1240.81 1612.82 1082.37C1690.04 1019.98 1694.21 950.543 1777.15 894.423C1902.92 809.319 2131 944.13 2168 806.449C2209.43 652.248 1809.21 810.603 1746.06 662.493C1698.11 550.046 1959.35 372.35 1826.01 362.583C1743.53 356.542 1730.96 470.746 1648.35 466.552C1519.63 460.017 1627.99 269.147 1537.31 186.637C1398.91 60.7116 936.653 299.865 1035.42 146.649C1093.45 56.6322 1297.47 22.6863 1297.47 22.6863" stroke="#4C4616" stroke-width="46" />
            </svg>
          </div>
          <div
            ref={philosophyRef}
            className="max-w-5xl w-full text-center z-50 relative"
          >

            <div className="relative">
              <div className="text-7xl md:text-9xl text-[#87a96b]/30 font-serif absolute top-0 left-0 -ml-8">
                "
              </div>

              <h2 id='text' className="uppercase text-xl md:text-2xl lg:text-5xl leading-relaxed tracking-wide font-extralight lg:font-extrabold text-white px-8">
                <span className='redhawk text-xl md:text-2xl lg:text-4xl mb-4 text-[#93960b]'>{philosophyText}</span>
                <span className='bebas mb-4'>{philosophyText0}</span>
                <span className='redhawk  text-xl md:text-2xl lg:text-4xl mb-4 text-[#93960b]'>{philosophyText1}</span>
                <span className='bebas mb-4'>{philosophyText2}</span>
                <span className='redhawk  text-xl md:text-2xl lg:text-4xl mb-4 text-[#93960b]'>{philosophyText3}</span>
                <span className='bebas mb-4'>{philosophyText4}</span>
                <span className='redhawk  text-xl md:text-2xl lg:text-4xl mb-4 text-[#93960b]'>{philosophyText5}</span>
                <span className='bebas mb-4'>{philosophyText6}</span>
              </h2>

              <div className="text-7xl md:text-9xl text-[#87a96b]/30 font-serif absolute top-0 right-0 -mr-8">
                "
              </div>
            </div>
          </div>
          <button onClick={handleClick} className="group relative mt-10 px-8 py-4 border-2 border-[#93960b] rounded-full h-14 overflow-hidden hover:shadow-[0_0_25px_rgba(147,150,11,0.2)] transition-shadow z-20">
            <span className="flex text-[#93960b] font-bold gap-2">
              {text.split(" ").map((word, wordIndex) => (
                <span key={wordIndex} className="flex">
                  {word.split("").map((letter, letterIndex) => {
                    const globalIndex = text.substring(0, text.indexOf(word) + letterIndex).length;
                    return (
                      <span key={letterIndex} className="relative inline-block h-6 overflow-hidden">
                        <span
                          className="block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6"
                          style={{ transitionDelay: `${globalIndex * 45}ms` }}
                        >
                          {letter}
                        </span>
                        <span
                          className="absolute left-0 top-6 block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-6"
                          style={{ transitionDelay: `${globalIndex * 45}ms` }}
                        >
                          {letter}
                        </span>
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          </button>
        </section>

      </div>
    </>
  );

}