// Contexts/SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import AuthService from "../services/authService"; // Importez votre service de token

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
    const token = AuthService.getToken(); // Récupérer le JWT
    if (!token) return;

    // 🔥 CORRECTION: On envoie le token dans 'auth', pas l'ID dans 'query'
    const newSocket = io(VITE_API_URL, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));

    // Gérer l'erreur d'authentification envoyée par le serveur
    newSocket.on("connect_error", (err) => {
      console.error("❌ Erreur connexion Socket:", err.message);
    });

    return () => {
      newSocket.close();
    };
  }, []); // Se reconnecte si le token change

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
