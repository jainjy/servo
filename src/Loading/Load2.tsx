import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger,SplitText)
interface LoadingScreenProps {
    onLoadingComplete?: () => void;
}

function Load2({ onLoadingComplete }: LoadingScreenProps) {
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate()
    const section2Ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const targetSectionRef = useRef<HTMLDivElement>(null);
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

    return (
        <>
            <div ref={containerRef} className="w-full z-[9999] relative">

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
                                <span className=' mb-4 text-[#93960b]'>{philosophyText}</span>
                                <span className='bebas mb-4'>{philosophyText0}</span>
                                <span className=' mb-4 text-[#93960b]'>{philosophyText1}</span>
                                <span className='bebas mb-4'>{philosophyText2}</span>
                                <span className=' mb-4 text-[#93960b]'>{philosophyText3}</span>
                                <span className='bebas mb-4'>{philosophyText4}</span>
                                <span className=' mb-4 text-[#93960b]'>{philosophyText5}</span>
                                <span className='bebas mb-4'>{philosophyText6}</span>
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
                </section>

            </div>
        </>
    )
}

export default Load2
