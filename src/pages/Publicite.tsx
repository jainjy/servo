"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";


interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  duration: number;
  isActive: boolean;
  priority: number;
  targetPage?: string; // Page cible spécifique
}

export function AdvertisementPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");

  // Détection mobile et path actuel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    setCurrentPath(window.location.pathname);
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Simuler le fetch des publicités avec ciblage
  const fetchAdvertisements = () => {
    try {
      const mockAds: Advertisement[] = [
        {
          id: "1",
          title: "Découvrez nos offres exclusives",
          description: "Profitez de réductions exceptionnelles sur nos services premium.",
          imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          link: "https://exemple.com/offre",
          duration: 120,
          isActive: true,
          priority: 1,
          targetPage: "/" // Page d'accueil
        },
        {
          id: "2",
          title: "Nouveauté : Service Premium",
          description: "Accédez à des fonctionnalités avancées pour optimiser votre expérience.",
          imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          link: "https://exemple.com/premium",
          duration: 90,
          isActive: true,
          priority: 2,
          targetPage: "/services" // Page services
        },
        // Pub pour travaux
        {
          id: "3",
          title: "Travaux de rénovation",
          description: "Transformez votre espace avec nos experts en travaux.",
          imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          link: "/travaux",
          duration: 120,
          isActive: true,
          priority: 3,
          targetPage: "/travaux"
        },
        // Pub pour art et création
        {
          id: "4",
          title: "Découvrez des artistes exclusifs",
          description: "Accédez à des œuvres uniques et rencontrez des créateurs talentueux.",
          imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
          link: "/art-et-creation",
          duration: 120,
          isActive: true,
          priority: 4,
          targetPage: "/art-et-creation"
        }
      ];

      // Filtrer selon la page actuelle ou prendre une pub générale
      let filteredAds = mockAds.filter(ad => {
        if (!ad.isActive) return false;
        // Si la pub a une page cible et qu'on est sur cette page, l'afficher
        if (ad.targetPage && currentPath.startsWith(ad.targetPage)) {
          return true;
        }
        // Sinon, prendre les pubs sans ciblage spécifique
        return !ad.targetPage;
      });

      if (filteredAds.length === 0) {
        // Fallback: prendre n'importe quelle pub active
        filteredAds = mockAds.filter(ad => ad.isActive && !ad.targetPage);
      }

      if (filteredAds.length === 0) {
        console.warn("Aucune publicité active trouvée");
        setCurrentAd(null);
        return;
      }

      // Trier par priorité
      const sortedAds = filteredAds.sort((a, b) => b.priority - a.priority);
      const selectedAd = sortedAds[0];
      
      setCurrentAd(selectedAd);
      setShowPopup(true);
      
    } catch (error) {
      console.error("Erreur lors de la récupération des publicités:", error);
      setCurrentAd(null);
    }
  };

  // Vérifier si l'utilisateur a déjà fermé une pub aujourd'hui
  const shouldShowPopup = () => {
    if (isMobile) return false;
    
    const today = new Date().toDateString();
    const lastClosed = localStorage.getItem("adLastClosed");
    
    if (lastClosed === today) {
      return false;
    }
    
    const lastShown = localStorage.getItem("adLastShown");
    if (lastShown) {
      const lastShownTime = parseInt(lastShown, 10);
      const now = Date.now();
      const fourHours = 4 * 60 * 60 * 1000;
      
      if (now - lastShownTime < fourHours) {
        return false;
      }
    }
    
    return true;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shouldShowPopup()) {
        fetchAdvertisements();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isMobile, currentPath]);

  const handleClose = () => {
    setShowPopup(false);
    
    const today = new Date().toDateString();
    localStorage.setItem("adLastClosed", today);
    localStorage.setItem("adLastShown", Date.now().toString());
  };

  // Si pas de pub ou sur mobile, ne rien afficher
  if (!currentAd || isMobile || !showPopup) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPopup && currentAd && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-[9999] w-full max-w-md"
        >
          <AdvertisementCard
            title={currentAd.title}
            description={currentAd.description}
            imageUrl={currentAd.imageUrl}
            link={currentAd.link}
            duration={currentAd.duration}
            showCloseButton={true}
            isMobile={isMobile}
            variant="medium"
            className="!max-w-md !mx-0"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}