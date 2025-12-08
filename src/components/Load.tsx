import gsap from "gsap";
import { useEffect, useRef } from "react";
import "../styles/font.css";

export default function Test() {
  // Suppression des types TypeScript spécifiques (e.g., <HTMLHeadingElement | null>)
   const counterRef = useRef<HTMLHeadingElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
const hasAnimationPlayed = sessionStorage.getItem('VisitAnimation');
if (!hasAnimationPlayed) {
  // Marquer l'animation comme jouée pour cet onglet uniquement
  sessionStorage.setItem('VisitAnimation', 'true');
  const counterObj = { value: 0 };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    // Animation du compteur de 0 à 100%
    gsap.to(counterObj, {
      value: 100,
      duration: 2,
      delay: 1,
      ease: "power1.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = `${Math.round(counterObj.value)}%`;
        }
      },
    });

    // Faire disparaitre le compteur après animation
    gsap.to("#counter", {
      duration: 0.25,
      delay: 3.5,
      opacity: 0,
    });

    // Faire disparaitre le logo après animation
    gsap.to("#logo", {
      duration: 0.25,
      delay: 3.5,
      opacity: 0,
    });

    // Animation largeur barre de 0 à 1/6 puis retour à 0 et disparition
    if (barRef.current) {
      gsap.fromTo(
        barRef.current,
        { width: 0, transformOrigin: "left center" },
        {
          width: "18%", // w-1/6 exact
          duration: 1.5,
          ease: "power1.out",
          delay: 1,
          onComplete: () => {
            gsap.to(barRef.current, {
              width: 0,
              opacity: 0,
              delay: 1,
              duration: 0.25,
            });
          },
        }
      );
    }

    gsap.to(".bar", {
      delay: 3.5,
      height: 0,
      stagger: {
        each: 0.1,
        from: "center",
      },
      duration: 1.5,
    });
  });

  // Version mobile - masquer tous les contenus
  mm.add("(max-width: 767px)", () => {
    gsap.set(["#counter", "#logo", ".bar", barRef.current], {
      display: "none",
      opacity: 0
    });
  });

  return () => mm.revert();
}
}, []);

  const hasAnimationPlayed = sessionStorage.getItem('VisitAnimation');
  if (hasAnimationPlayed) {
    return null; // Ne rien afficher si l'animation a déjà été jouée dans cet onglet
  }

  return (
    <div className="pointer-events-none flex gap-5 flex-col items-center justify-center z-[9999] fixed top-0 left-0 w-full h-full overflow-hidden">
      {/* Remplacement du composant Next.js Image par une balise <img> standard */}
      <img
        id="logo"
        className=" animate-bounce z-50 rounded-full"
        src="/logo.png"
        width={200}
        height={200}
        alt="Logo de chargement"
        style={{ objectFit: "cover", width: 200, height: 200 }} // Style width/height/objectFit appliqué sur <img>
      />
      <h1
        ref={counterRef}
        id="counter"
        className="ml-5 azonix z-30 text-5xl "
      >
        0%
      </h1>
      <div
        id="progress"
        ref={barRef}
        className=" lg:w-[17.6667%] w-[400px] z-30 text-5xl h-3.5 bg-black rounded-full"
      ></div>
      <div className="fixed flex z-20 w-screen h-screen">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-[10vw] h-screen bg-[#f4f4f4] bar"></div>
        ))}
      </div>
    </div>
  );
}