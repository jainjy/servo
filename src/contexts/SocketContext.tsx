// Contexts/SocketContext.tsx - VERSION AVEC DEBUG
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import AuthService from "../services/authService";

const VITE_API_URL = import.meta.env.VITE_API_URL2 || "http://localhost:3001";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const defaultValue: SocketContextType = {
  socket: null,
  isConnected: false,
};

const SocketContext = createContext<SocketContextType>(defaultValue);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocket must be used within a SocketProvider");
  return context;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = AuthService.getToken();
    
    console.log("🔌 Tentative de connexion Socket...");
    console.log("🌐 URL:", VITE_API_URL);
    console.log("🔑 Token présent:", !!token);
    
    if (!token) {
      console.error("❌ Pas de token - impossible de connecter le socket");
      return;
    }

    console.log("🔑 Token (début):", token.substring(0, 20) + "...");

    const newSocket = io(VITE_API_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connecté avec succès! ID:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket déconnecté. Raison:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Erreur connexion Socket:", err.message);
    });

    newSocket.on("ai-suggestion", (data) => {
      console.log("💡 Suggestion IA reçue:", data);
    });

    return () => {
      console.log("👋 Fermeture du socket");
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};