import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Lottie from "lottie-react";
import loginAnimation from "@/assets/click.json"

interface HeroSectionProps {
  onLogoCLick?: () => void;
  onPartnerClick?: () => void;
}

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

export default function HeroSection({ onLogoCLick, onPartnerClick }: HeroSectionProps) {
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="relative z-10 min-h-screen h-screen w-full flex flex-col items-center px-4 snap-start overflow-hidden"
      style={{
        backgroundImage: 'url(/design/Meubles%20contemporains%20et%20design.jfif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay semi-transparent pour meilleure lisibilité */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      {/* Logo centré */}
      <div
        id='containerImg'
        ref={logoRef}
        className="flex absolute flex-col pt-10 cursor-pointer z-20"
        onClick={onLogoCLick}
      >
        <div
          className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-secondary-text shadow-lg"
          style={{
            animation: 'float 6s ease-in-out infinite',
          }}
        >
          <div className="absolute top-5 z-[9999] w-56 h-56">
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
            className="w-full h-full object-cover rounded-full z-10 transform group-hover:scale-110 transition-transform duration-700 bg-[#b4b4b4] p-8"
          />

          <div className="absolute -inset-2 rounded-full z-0 group-hover:opacity-60 transition-opacity duration-500" />
        </div>
      </div>

      {/* Partenaires en bas */}
      <div className="w-full pt-20 mt-64 pb-10 z-20">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-white text-xl uppercase tracking-widest mb-12 font-extralight drop-shadow-lg">
            Nos Partenaires de Confiance
          </h3>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-black/60 backdrop-blur-lg rounded-md hover:bg-black/80 transition-all duration-500 group border border-white/10 hover:border-white/20 shadow-lg overflow-hidden relative aspect-square cursor-pointer"
                onClick={onPartnerClick}
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500 filter grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-all duration-500">
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
  );
}
