"use client";

import { useState, useEffect } from "react";

type AdCardProps = {
  title: string;
  description: string;
  mediaType?: "image" | "video";
  imageUrl?: string;
  videoUrl?: string;
};

export function AdCard({
  title,
  description,
  mediaType = "image",
  imageUrl,
  videoUrl,
}: AdCardProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(2 * 60);
  const [totalCycleTime, setTotalCycleTime] = useState<number>(2 * 60);

  // Initialiser depuis sessionStorage une seule fois au montage
  useEffect(() => {
    const savedState = sessionStorage.getItem("adCardState");
    
    if (savedState) {
      try {
        const { isVisible: savedIsVisible, timeRemaining: savedTime, startTime } = JSON.parse(savedState);
        
        // Calculer le temps écoulé depuis la dernière sauvegarde
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const newTimeRemaining = Math.max(0, savedTime - elapsedTime);
        
       
        setIsVisible(savedIsVisible);
        setTimeRemaining(newTimeRemaining);
        setTotalCycleTime(savedIsVisible ? 2 * 60 : 8 * 60);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setIsVisible(true);
      }
    } else {
      // console.log("🆕 Nouveau state - pas de sessionStorage");
      setIsVisible(true);
    }
  }, []);

  // Timer principal - gère le décompte et le changement de phase
  useEffect(() => {
    // Ne pas démarrer le timer si le state n'est pas encore initialisé
    if (isVisible === null) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let newTime = prev - 1;
        let newIsVisible = isVisible;
        let newTotal = isVisible ? 2 * 60 : 8 * 60;

        // Si le temps est écoulé, changer de phase
        if (newTime <= 0) {
          newIsVisible = !isVisible;
          newTime = newIsVisible ? 2 * 60 : 8 * 60;
          newTotal = newTime;
          
          setIsVisible(newIsVisible);
          setTotalCycleTime(newTotal);
          // console.log("🔄 Phase changée vers:", newIsVisible ? "visible" : "hidden");
        } else {
          setTotalCycleTime(newTotal);
        }

        // Sauvegarder l'état dans sessionStorage
        sessionStorage.setItem("adCardState", JSON.stringify({
          isVisible: newIsVisible,
          timeRemaining: newTime,
          startTime: Date.now()
        }));

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Formater le temps en minutes:secondes
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculer le pourcentage de progression
  const progressPercentage = (timeRemaining / totalCycleTime) * 100;

  // Attendre l'initialisation depuis sessionStorage
  if (isVisible === null) {
    return <div className="w-full min-h-[140px] bg-gray-100 rounded-2xl animate-pulse" />;
  }

  if (!isVisible) {
    // Mode caché avec compte à rebours
    return (
      <>
      </>
    );
  }

  // Mode visible (publicité normale)
  return (
    <article className="relative w-full min-h-[140px] max-w-7xl mx-auto rounded-2xl border border-slate-200 my-5 bg-white shadow-lg overflow-hidden">
      {/* Badge Publicité avec compteur */}
      <div className="absolute right-3 top-3 z-10 flex items-center space-x-2">
        <div className="relative">
          <div className="absolute inset-0 animate-ping opacity-20">
            <span className="rounded-full bg-secondary-text px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
              Publicité
            </span>
          </div>
          <span className="relative rounded-full bg-secondary-text px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            Publicité
          </span>
        </div>
        
        {/* Compteur pour la phase visible */}
        <div className="flex items-center bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
          <svg 
            className="w-3 h-3 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{formatTime(timeRemaining)}</span>
        </div>
      </div>

      <div className="flex flex-row">
        {/* Media fixe, responsive */}
        <div className="w-40 sm:w-56 md:w-64 h-32 sm:h-40 md:h-44 flex-shrink-0 bg-slate-100">
          {mediaType === "video" && videoUrl ? (
            <video
              src={videoUrl}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            imageUrl && (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            )
          )}
        </div>

        {/* Contenu texte */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-center">
          <h2 className="text-base font-extralight tracking-widest sm:text-lg md:text-xl text-slate-900 mb-1 sm:mb-2">
            {title}
          </h2>
          <p className="text-xs sm:text-sm md:text-sm text-slate-600 leading-relaxed line-clamp-3">
            {description}
          </p>
          
          {/* Indicateur de durée en bas */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <span>Visible pendant :</span>
                <span className="font-medium ml-2">2 min</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}