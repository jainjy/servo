import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrer ScrollTrigger avec GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const OnScrollMasking = () => {
  useEffect(() => {
    // Animation GSAP
    gsap.to("h2", {
      scale: 300,
      scrollTrigger: {
        trigger: ".container",
        scrub: 1,
        pin: true,
        start: "top top",
        end: "+=1000",
        ease: "none"
      },
    });

    // Nettoyage
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Chargement de la police Abril Fatface */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap');
        
        * {
          font-family: 'Abril Fatface', cursive;
        }
      `}</style>

      <div className="container min-h-screen relative">
        {/* Vidéo de fond */}
        <video 
          autoPlay 
          loop 
          muted 
          className="fixed z-[-1] inset-0 h-full w-full object-cover"
        >
          <source 
            src="https://videos.pexels.com/video-files/19026925/19026925-uhd_2560_1440_25fps.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Masque avec texte */}
        <div className="mask h-screen w-full bg-white flex justify-center items-center mix-blend-screen">
          <h2 className="text-6xl md:text-8xl">CIRCUS</h2>
        </div>
      </div>
    </div>
  );
};

export default OnScrollMasking;