// src/components/advertisementPop
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl?: string;
}

interface Props {
  refreshMinutes?: number;
  displayDuration?: number;
}

const AdvertisementPopup: React.FC<Props> = ({ refreshMinutes = 3, displayDuration = 10 }) => {
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [visible, setVisible] = useState(false);

  const fetchAdvertisements = async () => {
    try {
      const response = await api.get("/advertisements/active");
      const data = response.data;

      if (data.success && data.advertisements.length > 0) {
        const randomAd =
          data.advertisements[Math.floor(Math.random() * data.advertisements.length)];
        setAd(randomAd);
        setVisible(true);

        setTimeout(() => setVisible(false), displayDuration * 1000);
      } else {
        console.warn("Aucune publicité active trouvée");
        setVisible(false);
      }
    } catch (error) {
      console.error("Erreur chargement publicité :", error);
      setVisible(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();

    const interval = setInterval(fetchAdvertisements, refreshMinutes * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshMinutes]);

  const handleClick = async () => {
    if (ad) {
      try {
        await api.post(`/advertisements/${ad.id}/click`);
      } catch (error) {
        console.error("Erreur enregistrement clic :", error);
      }

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
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.4
          }}
          className="fixed bottom-5 right-5 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl w-80 overflow-hidden backdrop-blur-sm bg-white/95"
          style={{
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div className="relative group">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-48 object-cover cursor-pointer transition-all duration-300 group-hover:scale-105"
              onClick={handleClick}
            />
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.7)" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisible(false)}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center backdrop-blur-sm transition-all duration-200"
            >
              ✕
            </motion.button>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: displayDuration, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
          
          <div className="p-4">
            <motion.h4 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bold text-gray-900 text-lg mb-2"
            >
              {ad.title}
            </motion.h4>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-600 leading-relaxed"
            >
              {ad.description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full transition-all duration-200"
              >
                Découvrir
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvertisementPopup;