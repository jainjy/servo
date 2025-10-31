import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    performance: false,
  });

  // 🔹 Au chargement, lire les préférences et la localisation depuis Local Storage
  useEffect(() => {
    const pref = localStorage.getItem("cookie_preferences");
    if (!pref) {
      setVisible(true);
    } else {
      try {
        setPreferences(JSON.parse(pref));
      } catch {
        localStorage.removeItem("cookie_preferences");
        setVisible(true);
      }
    }
  }, []);

  // 🔹 Sauvegarder les préférences dans Local Storage
  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem("cookie_preferences", JSON.stringify(prefs));
    setVisible(false);
  };

  // 🔹 Accepter tous les cookies + récupérer géolocalisation
  const handleAcceptAll = () => {
    const prefs = { necessary: true, performance: true };
    savePreferences(prefs);

    // Récupérer la géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          localStorage.setItem("user_location", JSON.stringify(location));
          console.log("🌍 Localisation sauvegardée :", location);
        },
        (err) => console.error("Erreur géolocalisation :", err),
        { enableHighAccuracy: true }
      );
    }
  };

  const handleAcceptNecessary = () => savePreferences({ necessary: true, performance: false });
  const handleSavePreferences = () => savePreferences(preferences);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/90 backdrop-blur-lg shadow-lg border-t border-gray-200 dark:bg-gray-900/90 dark:border-gray-700"
          >
            <div className="max-w-3xl mx-auto px-6 py-5">
              <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                Préférences de cookies 
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Nous utilisons des cookies pour personnaliser le contenu et analyser notre trafic. 
                Vous pouvez choisir les types de cookies que vous acceptez.
              </p>

              {/* Options */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Cookies nécessaires
                  </span>
                  <Switch checked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Cookies de performance
                  </span>
                  <Switch
                    checked={preferences.performance}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, performance: checked })
                    }
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2 justify-end">
                <Button variant="secondary" onClick={handleAcceptNecessary}>
                  Accepter nécessaires
                </Button>
                <Button variant="outline" onClick={handleSavePreferences}>
                  Enregistrer
                </Button>
                <Button onClick={handleAcceptAll}>Tout accepter</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
