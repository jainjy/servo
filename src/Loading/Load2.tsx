import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger, SplitText)
interface LoadingScreenProps {
    onLoadingComplete?: () => void;
}

function Load2({ onLoadingComplete }: LoadingScreenProps) {
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate()
    const section2Ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const targetSectionRef = useRef<HTMLDivElement>(null);
    const sliderRef1 = useRef<HTMLDivElement>(null);
    const sliderRef2 = useRef<HTMLDivElement>(null);
    const text = "EN SAVOIR PLUS";
    const philosophyRef = useRef<HTMLDivElement>(null);

    // Texte de la philosophie
    const philosophyText = "L'innovation naît de la collaboration ";
    const philosophyText0 = "et de la passion partagée. Chaque projet est une nouvelle aventure, ";
    const philosophyText1 = "chaque succès ";
    const philosophyText2 = "une victoire collective. Notre force réside dans notre diversité et notre unité d'action.";
    const philosophyText3 = " Ensemble, ";
    const philosophyText4 = "nous transformons les défis en opportunités extraordinaires. ";
    const philosophyText5 = "La confiance ";
    const philosophyText6 = "de nos clients est notre plus grande récompense.";

    // Tableau d'images pour les sliders (réduit à 3 images chaque pour plus d'espace)
    const sliderImages1 = [
        "/W1.jpeg",
        "/W2.jpeg",
        "/W5.jpeg",
    ];

    const sliderImages2 = [
        "/W3.jpeg",
        "/W4.jpeg",
    ];

    const handleClick = () => {
        setIsNavigating(true);
        setTimeout(() => {
            const heroElement = document.getElementById('section2');
            if (heroElement) {
                heroElement.scrollIntoView({ behavior: 'smooth' });
            }
            navigate('/home');
        }, 1500);
    }

    useEffect(() => {
        // Vérifier que l'élément existe avant d'appliquer l'animation
        const textElement = document.getElementById("text");
        if (!textElement || isNavigating) return;

        try {
            let split = SplitText.create("#text", { type: "chars,words" });
            gsap.from(split.chars, {
                duration: 2,
                opacity: 0.2,
                stagger: 0.06,
                ease: "power2.out",
            });

            return () => {
                split.revert();
            };
        } catch (error) {
            console.error("", error);
        }
    }, [isNavigating]);

    useEffect(() => {
        // Animation des sliders verticaux
        if (sliderRef1.current && sliderRef2.current) {
            const slider1 = sliderRef1.current;
            const slider2 = sliderRef2.current;

            // Créer les clones pour l'effet infini
            const slider1Content = slider1.innerHTML;
            const slider2Content = slider2.innerHTML;

            slider1.innerHTML += slider1Content;
            slider2.innerHTML += slider2Content;

            // Animation GSAP pour les sliders
            gsap.to(slider1, {
                y: '-50%',
                duration: 30,
                ease: "none",
                repeat: -1
            });

            gsap.to(slider2, {
                y: '50%',
                duration: 35,
                ease: "none",
                repeat: -1
            });

            // Pause l'animation au hover
            slider1.addEventListener('mouseenter', () => {
                gsap.to(slider1, { timeScale: 0 });
            });
            slider1.addEventListener('mouseleave', () => {
                gsap.to(slider1, { timeScale: 1 });
            });

            slider2.addEventListener('mouseenter', () => {
                gsap.to(slider2, { timeScale: 0 });
            });
            slider2.addEventListener('mouseleave', () => {
                gsap.to(slider2, { timeScale: 1 });
            });
        }
    }, []);

    return (
        <>
            <div ref={containerRef} className="w-full z-[9999] relative">
                {/* SECTION 2: Lettre de philosophe très grande */}
                <section
                    ref={targetSectionRef}
                    id='section2'
                    className="relative z-[9999] overflow-hidden min-h-screen h-screen w-full flex flex-col items-center justify-center bg-[#252c1d] pb-10 snap-start"
                >

                    {/* Sliders verticaux dans la partie droite - Container réduit à la moitié */}
                    <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 flex z-0 pointer-events-auto">
                        {/* Premier slider - défilement vers le haut */}
                        <div className="w-1/2 h-full overflow-hidden relative">
                            {/* Overlay très réduit */}
                            <div
                                ref={sliderRef1}
                                className="absolute top-0 left-0 w-full h-[200%] flex flex-col gap-2 p-2"
                            >
                                {sliderImages1.map((image, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-[50rem] rounded-md overflow-hidden shadow-2xl group-hover:shadow-2xl transition-all duration-500 opacity-80 hover:opacity-100"
                                    >
                                        <img
                                            src={image}
                                            alt={`Slide 1-${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://picsum.photos/800/1200?random=${index + 10}`;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deuxième slider - défilement vers le bas */}
                        <div className="w-1/2 h-full overflow-hidden relative">
                            {/* Overlay très réduit */}
                            <div
                                ref={sliderRef2}
                                className="absolute top-[-100%] left-0 w-full h-[200%] flex flex-col gap-2 p-1"
                            >
                                {sliderImages2.map((image, index) => (
                                    <div
                                        key={index}
                                        className="w-full h-[32rem] rounded-sm overflow-hidden shadow-2xl group-hover:shadow-2xl transition-all duration-500 opacity-80 hover:opacity-100"
                                    >
                                        <img
                                            src={image}
                                            alt={`Slide 2-${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://picsum.photos/800/1200?random=${index + 20}`;
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
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

                    <div className=' p-2 rounded-sm backdrop-blur-md mx-1 lg:backdrop-blur-[2px] flex flex-col justify-center items-center'>
                        <div
                            ref={philosophyRef}
                            className="max-w-5xl w-full text-center z-50 relative"
                        >
                            <div className="relative">
                                <div className="text-3xl md:text-9xl text-[#87a96b]/30 font-serif absolute top-0 left-0 -ml-8">
                                    "
                                </div>

                                <h2 id='text' className="font-serif uppercase text-xl md:text-2xl lg:text-4xl leading-relaxed tracking-wide font-extralight lg:font-extrabold text-white px-8">
                                    <span className='mb-4 text-[#93960b]'>{philosophyText}</span>
                                    <span className='mb-4'>{philosophyText0}</span>
                                    <span className='mb-4 text-[#93960b]'>{philosophyText1}</span>
                                    <span className='mb-4'>{philosophyText2}</span>
                                    <span className='mb-4 text-[#93960b]'>{philosophyText3}</span>
                                    <span className='mb-4'>{philosophyText4}</span>
                                    <span className='mb-4 text-[#93960b]'>{philosophyText5}</span>
                                    <span className='mb-4'>{philosophyText6}</span>
                                </h2>

                                <div className="text-7xl md:text-9xl text-[#87a96b]/30 font-serif absolute top-0 right-0 -mr-8">
                                    "
                                </div>
                            </div>
                        </div>

                        <button onClick={handleClick} disabled={isNavigating} className="group relative mt-10 px-8 py-4 border-2 border-[#93960b] rounded-full h-14 overflow-hidden hover:shadow-[0_0_25px_rgba(147,150,11,0.2)] transition-shadow z-20 disabled:opacity-70">
                            {isNavigating ? (
                                <div className="flex items-center justify-center gap-3 h-full">
                                    {/* Spinner animé */}
                                    <div className="relative w-5 h-5">
                                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#93960b] border-r-[#93960b] animate-spin"></div>
                                    </div>
                                    <span className="text-[#93960b] font-bold">Redirection...</span>
                                </div>
                            ) : (
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
                            )}
                        </button>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Load2