import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api"
interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl?: string;
}

interface Props {
  refreshMinutes?: number; // ex: 3 = refresh toutes les 3 minutes
}

const AdvertisementPopup: React.FC<Props> = ({ refreshMinutes = 3 }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [visible, setVisible] = useState(false);

  // Fonction pour récupérer les pubs actives
  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/advertisements/active");
      if (!response.ok) throw new Error("Erreur réseau lors du chargement des pubs");
      const data = await response.json();

      if (data.success && data.advertisements.length > 0) {
        const randomAd =
          data.advertisements[Math.floor(Math.random() * data.advertisements.length)];
        setAd(randomAd);
        setVisible(true);
      } else {
        console.warn("Aucune publicité active trouvée");
      }
    } catch (error) {
      console.error("Erreur chargement publicité :", error);
    }
  };

  useEffect(() => {
    fetchAdvertisements();

    // Rafraîchir automatiquement toutes les X minutes
    const interval = setInterval(fetchAdvertisements, refreshMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshMinutes]);

//   const handleClick = () => {
//     if (ad?.targetUrl) {
//       window.open(ad.targetUrl, "_blank");
//     }
//     setVisible(false);
//   };
const handleClick = async () => {
  if (ad) {
    try {
      // Enregistrer le clic côté backend
      await api.post(`/advertisements/${ad.id}/click`);
    } catch (error) {
      console.error("Erreur enregistrement clic :", error);
    }

    // Ouvrir le lien dans un nouvel onglet si défini
    if (ad.targetUrl) {
      window.open(ad.targetUrl, "_blank");
    }

    setVisible(false);
  }
};

  return (
    <AnimatePresence>
      {visible && ad && (
        <motion.div
          key="advertisement"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-5 right-5 z-50 bg-white border border-gray-300 rounded-2xl shadow-xl w-80 overflow-hidden"
        >
          <div className="relative">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-48 object-cover cursor-pointer"
              onClick={handleClick}
            />
            <button
              onClick={() => setVisible(false)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-gray-800">{ad.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {ad.description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;
