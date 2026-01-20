import InteractivePortrait from "@/components/animation/Liquide";
import Lottie from "lottie-react";
import React, { useRef, useState, useEffect } from "react";
import loginAnimation from "@/assets/click.json";
import TopographicPage from "@/components/animation/Line";
import { useNavigate } from "react-router-dom";

function Load1() {
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Simuler un délai de chargement de 2.5 secondes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Données pour les partenaires
  const partners = [
    { id: 1, name: "Olimmo", logo: "olimmo.png" },
    { id: 2, name: "Guy hoquet Réunion", logo: "Reunion.png" },
  ];
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const handleClick0 = () => {
    const heroElement = document.getElementById("section2");
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: "smooth" });
    }
    navigate("/about");
  };

  return (
    <>
      {/* Spinner de chargement */}
      {isLoading && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-6">
            {/* Spinner animé */}
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary-text border-r-secondary-text animate-spin"></div>
              <div
                className="absolute inset-2 rounded-full border-4 border-transparent border-b-logo animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            {/* Texte de chargement */}
            <div className="text-center">
              <p className="text-white text-lg font-light tracking-widest">
                <span className="inline-block w-6 text-left">
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse animation-delay-200">.</span>
                  <span className="animate-pulse animation-delay-400">.</span>
                </span>
              </p>
            </div>
          </div>

          {/* CSS pour les délais d'animation */}
          <style>{`
                        @keyframes pulse {
                            0%, 100% { opacity: 0.3; }
                            50% { opacity: 1; }
                        }
                        .animation-delay-200 {
                            animation-delay: 200ms;
                        }
                        .animation-delay-400 {
                            animation-delay: 400ms;
                        }
                    `}</style>
        </div>
      )}

      <div className=" h-[100vh] absolute z-[999]">
        <TopographicPage />
      </div>
      <div ref={containerRef} className="w-full z-[9999] relative">
        {/* SECTION 1: Grand logo au centre + Partenaires en bas */}
        <section
          ref={section1Ref}
          className="relative z-10 min-h-screen h-screen w-full flex flex-col items-center px-4 snap-start"
        >
          <div className="-z-10 lg:block hidden cursor-pointer">
            <InteractivePortrait />
          </div>
          {/* Logo centré */}

          <div
            id="containerImg"
            ref={logoRef}
            className="flex absolute flex-col pt-10 cursor-pointer"
            onClick={handleClick0}
          >
            <div
              className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-logo shadow-lg"
              // style={{
              //   animation: 'float 6s ease-in-out infinite',
              // }}
            >
              <div className="absolute inset-0 flex items-center justify-center z-[99999]">
                <Lottie animationData={loginAnimation} loop autoplay />
              </div>
              <div className="absolute inset-0 z-0" />

              <div className="absolute inset-0 rounded-full border-4 border-logo" />
              <img
                src="golo.png"
                alt="Logo Oliplus"
                className="absolute inset-0 w-full h-full object-cover rounded-full z-10 transform group-hover:scale-110 transition-transform duration-700 bg-[#ffffff]"
              />

              <div className="absolute -inset-2 rounded-full z-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
          </div>

          {/* Partenaires en bas */}
          <div className="w-full pt-72 pointer-events-none">
            <div className="container mx-auto px-4">
              <h3 className="text-center text text-white text-xl uppercase tracking-widest mb-4 font-extralight">
                Nos Partenaires de Confiance
              </h3>

              <div className="flex justify-center items-center gap-10">
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
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="bg-black/40 h-32 w-32 lg:h-52 lg:w-52 backdrop-blur-lg rounded-md hover:bg-black/60 transition-all duration-500 group border border-white/20 hover:border-white/40 shadow-lg overflow-hidden relative aspect-square">
                      {/* Animation de surbrillance */}
                      <div className="absolute inset-0 overflow-hidden rounded-md">
                        <div
                          className="absolute -left-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                          style={{
                            animation: "shine 3s infinite",
                          }}
                        ></div>
                      </div>

                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100 z-10"
                      />
                    </div>
                    <p className="text-white text-sm lg:text-base font-bold text-center">
                      {partner.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Load1;
