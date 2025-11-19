// hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";
import { io } from "socket.io-client";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      console.log("🚫 WebSocket: user ID manquant");
      return;
    }

    const wsURL =
      process.env.NODE_ENV === "production"
        ? window.location.origin
        : "http://localhost:3001";

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    console.log("🔗 Connexion WebSocket vers", wsURL);

    const socket = io(wsURL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      query: { userId: user.id },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔥 WebSocket connecté");
      setIsConnected(true);
      socket.emit("join-user-room", user.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket déconnecté");
      setIsConnected(false);
    });

    socket.on("new-notification", (data) => {
      console.log("📨 Notification temps réel reçue :", data);

      // 🔥 Mise à jour instantanée du compteur
      setNotificationCount((prev) => prev + 1);

      // Préviens le Header.js de recharger la LISTE si elle est ouverte
      window.dispatchEvent(new CustomEvent("notifications:reload"));

      // Affichage toast
      toast({
        title: "Nouvelle notification",
        description: data.titre || data.message,
        duration: 4000,
      });
    });

    socket.on("notification-count-update", (payload) => {
      console.log("🔢 Mise à jour compteur :", payload.count);
      setNotificationCount(payload.count);
    });

    return () => {
      console.log("🧹 Fermeture WebSocket");
      socket.disconnect();
    };
  }, [user?.id]);

  return {
    isConnected,
    notificationCount,
    setNotificationCount,
  };
};
