// Contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

// 1️⃣ Définir le type du contexte
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// 2️⃣ Fournir une valeur par défaut pour createContext
const defaultValue: SocketContextType = {
  socket: null,
  isConnected: false,
};

const SocketContext = createContext<SocketContextType>(defaultValue);

// 3️⃣ Hook personnalisé pour utiliser le contexte
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// 4️⃣ Typage des props du Provider
interface SocketProviderProps {
  children: ReactNode;
  userId: string;
}

// 5️⃣ Provider
export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || "http://localhost:3001", {
      query: { userId },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      newSocket.close();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
