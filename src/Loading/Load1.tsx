import InteractivePortrait from '@/components/animation/Liquide';
import Lottie from 'lottie-react';
import React, { useRef, useState, useEffect } from 'react'
import loginAnimation from "@/assets/click.json"
import TopographicPage from '@/components/animation/Line';
import { useNavigate } from 'react-router-dom';

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
        { id: 1, name: 'Olimmo', logo: 'olimmo.png' },
        { id: 2, name: 'Partenaire 2', logo: 'https://i.pinimg.com/736x/cc/3c/db/cc3cdb8498f8d4135b87f8501f3faa31.jpg' },
        { id: 3, name: 'Partenaire 3', logo: 'https://i.pinimg.com/1200x/9d/1b/af/9d1baf24622b6c568ed6f41f826c7105.jpg' },
        { id: 4, name: 'Partenaire 4', logo: 'https://i.pinimg.com/1200x/4d/7a/ec/4d7aecb5e539968fec979b35f5618527.jpg' },
        { id: 5, name: 'Partenaire 5', logo: 'https://i.pinimg.com/736x/f0/64/d7/f064d7192801ed944991351e99efdbf2.jpg' },
        { id: 6, name: 'Partenaire 6', logo: 'https://i.pinimg.com/736x/bb/d6/2a/bbd62ab19fe388ef4dac11d2f21be3f7.jpg' },
        { id: 7, name: 'Partenaire 7', logo: 'https://i.pinimg.com/1200x/83/5d/9d/835d9d7c0f06a49b079418cd59914762.jpg' },
        { id: 8, name: 'Partenaire 8', logo: 'https://i.pinimg.com/736x/52/52/5c/52525c7b87e0600a27bf66a9ec1e04f2.jpg' },
    ];
const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null);
    const section1Ref = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const handleClick0 = () => {
        const heroElement = document.getElementById('section2');
        if (heroElement) {
            heroElement.scrollIntoView({ behavior: 'smooth' });
        }
        navigate('/about')
    }

    

    return (
        <>
            {/* Spinner de chargement */}
            {isLoading && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-xl">
                    <div className="flex flex-col items-center gap-6">
                        {/* Spinner animé */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-secondary-text border-r-secondary-text animate-spin"></div>
                            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-logo animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
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

            <div className=' h-[100vh] absolute z-[999]'>
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
            </div>
        </>
    )
}

export default Load1
