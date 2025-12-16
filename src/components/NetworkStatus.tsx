import React, { useState, useEffect } from "react";
import { WifiOff, RefreshCw, CheckCircle } from "lucide-react";

interface NetworkStatusProps {
  showOfflineMessage?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  showOfflineMessage = true,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      // Cache la notification après 3 secondes
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérification périodique de la connexion
    const interval = setInterval(async () => {
      try {
        const response = await fetch("https://www.google.com/favicon.ico", {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-cache",
        });
        if (!navigator.onLine) {
          setIsOnline(false);
          setShowNotification(true);
        }
      } catch (error) {
        setIsOnline(false);
        setShowNotification(true);
      }
    }, 30000); // Vérifie toutes les 30 secondes

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      const response = await fetch(window.location.origin, {
        method: "HEAD",
        cache: "no-cache",
      });
      if (response.ok || response.type === "opaque") {
        setIsOnline(true);
        setShowNotification(true);
        setIsRetrying(false);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      setIsRetrying(false);
      // console.log("Toujours hors ligne");
    }
  };

  if (!showNotification) return null;

  if (!isOnline && showOfflineMessage) {
    return (
      <div className="fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top duration-500 mt-16">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 shadow-2xl border-b-4 border-red-800">
          <div className="container mx-auto flex items-center justify-between gap-6">
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-12 w-12 flex items-center justify-center">
                <WifiOff className="h-10 w-10 text-white animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-lg">Hors ligne</p>
                <p className="text-sm opacity-90">
                  Votre connexion semble interrompue. Vérifiez votre réseau.
                </p>
              </div>
            </div>
            <button
              onClick={handleRetryConnection}
              disabled={isRetrying}
              className="flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <RefreshCw
                className={`h-5 w-5 ${isRetrying ? "animate-spin" : ""}`}
              />
              <span>{isRetrying ? "Reconnexion..." : "Réessayer"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isOnline && showNotification) {
    return (
      <div className="fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top duration-500 mt-16">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 shadow-2xl border-b-4 border-green-700">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/online.gif"  className="h-16 w-16 rounded-full" />
              <div>
                <p className="font-bold text-lg">Connexion rétablie</p>
                <p className="text-sm opacity-90">
                  Vous êtes de nouveau en ligne
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-white hover:text-gray-200 transition-colors text-2xl font-light"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
