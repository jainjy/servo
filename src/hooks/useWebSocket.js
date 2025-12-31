// hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { toast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
import AuthService from "../services/authService";

const VITE_API_URL = import.meta.env.VITE_API_URL2 || "http://localhost:3001";

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = AuthService.getToken();
    if (!token || !user?.id) return;

    const socket = io(VITE_API_URL, {
      transports: ["websocket"],
      auth: { token }, // 🔥 CORRECTION
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      // Plus besoin d'envoyer l'ID, le serveur le connaît via le token
      socket.emit("join-user-room", user.id);
    });

    socket.on("new-notification", (data) => {
      setNotificationCount((prev) => prev + 1);
      window.dispatchEvent(new CustomEvent("notifications:reload"));
      toast({ title: "Nouvelle notification", description: data.titre });
    });

    socket.on("disconnect", () => setIsConnected(false));

    return () => socket.disconnect();
  }, [user?.id]);

  return { isConnected, notificationCount, setNotificationCount };
};
