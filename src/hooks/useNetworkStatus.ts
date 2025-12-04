import { useState, useEffect } from "react";

interface NetworkStatus {
  isOnline: boolean;
  isOffline: boolean;
  lastOnline?: Date;
  lastOffline?: Date;
}

const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: true,
        isOffline: false,
        lastOnline: new Date(),
      }));
    };

    const handleOffline = () => {
      setStatus((prev) => ({
        ...prev,
        isOnline: false,
        isOffline: true,
        lastOffline: new Date(),
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérification API supplémentaire
    const checkConnection = async () => {
      try {
        await fetch("https://www.google.com/favicon.ico", {
          method: "HEAD",
          mode: "no-cors",
          cache: "no-cache",
        });
      } catch {
        if (navigator.onLine) {
          handleOffline();
        }
      }
    };

    const interval = setInterval(checkConnection, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  return status;
};

export default useNetworkStatus;
