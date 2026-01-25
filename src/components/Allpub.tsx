import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AllpubProps {
  title: string;
  description: string;
  image: string;
  background: string;
  textbg: string;
}

const Allpub: React.FC<AllpubProps> = ({ title, description, image, background, textbg }) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(2 * 60);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const savedState = sessionStorage.getItem("adCardState");

    if (savedState) {
      try {
        const { isVisible: savedIsVisible, timeRemaining: savedTime, startTime } = JSON.parse(savedState);
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const newTimeRemaining = Math.max(0, savedTime - elapsedTime);

        setIsVisible(savedIsVisible);
        setTimeRemaining(newTimeRemaining);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsVisible(true);
      }
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {

    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let newTime = prev - 1;
        let newIsVisible = isVisible;

        if (newTime <= 0) {
          newIsVisible = !isVisible;
          newTime = newIsVisible && 2 * 60 ;
          setIsVisible(newIsVisible);
        }

        sessionStorage.setItem("adCardState", JSON.stringify({
          isVisible: newIsVisible,
          timeRemaining: newTime,
          startTime: Date.now()
        }));

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, isMobile]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isVisible === null) {
    return <div className="w-full min-h-[140px] bg-gray-100 rounded-2xl animate-pulse" />;
  }
if (!isVisible || isMobile) {
    return null;
  }
  return (
    <motion.article
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className={`

        relative w-full max-w-2xl mx-auto
        rounded-xl border border-white/20
         ${background} shadow-lg overflow-hidden z-40 my-4`}
    >
      {/* Header */}
      <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 text-xs">
        <span className={`px-2.5 py-1 lg:block hidden rounded-full bg-white/25 ${textbg} font-semibold backdrop-blur-sm`}>
          Pub
        </span>

        <div className="hidden lg:flex items-center bg-black/35 px-2.5 py-1 rounded-full text-white backdrop-blur-sm">
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatTime(timeRemaining)}
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="p-1.5 rounded-full bg-black/35 hover:bg-black/50 text-white/75 hover:text-white transition-colors"
          aria-label="Fermer la publicité"
        >
          ✕
        </button>
      </div>

      {/* Contenu */}
      <div className="flex p-4 gap-4">
        {/* Image */}
        <div className="w-36 h-28 rounded-lg overflow-hidden border border-white/20 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Texte */}
        <div className="flex-1">
          <h2 className={`text-base font-semibold ${textbg} mb-1.5`}>
            {title}
          </h2>

          <p className={`text-xs lg:text-sm ${textbg} leading-relaxed mb-3`}>
            {description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-white/15">
            <div className={`flex items-center text-xs ${textbg}`}>
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="flex gap-2">Visible :
                 <span className={`font-medium lg:block hidden ${textbg}`}>2 minutes</span>
                 <span className={`font-medium lg:hidden block ${textbg}`}>{formatTime(timeRemaining)}</span>              
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default Allpub;