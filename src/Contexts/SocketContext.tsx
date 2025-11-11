// contexts/SocketContext.jsx - Version améliorée
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(
      import.meta.env.VITE_API_URL || "http://localhost:3001",
      {
        query: {
          userId: userId,
        },
        transports: ["websocket", "polling"], // Ajout pour meilleure compatibilité
      }
    );

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connecté au serveur");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket déconnecté:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Erreur de connexion socket:", error);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnecté après", attemptNumber, "tentatives");
      setIsConnected(true);
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [userId]);

  const value = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
