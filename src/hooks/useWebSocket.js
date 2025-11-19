// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      console.log('🚫 WebSocket: Aucun user ID, connexion annulée');
      return;
    }

    // 🔥 CORRECTION: Utiliser le port 3001
    const wsURL = process.env.NODE_ENV === 'production' 
      ? window.location.origin
      : 'http://localhost:3001';

    console.log('🔗 Tentative de connexion WebSocket vers:', wsURL);

    const connectWebSocket = () => {
      try {
        socketRef.current = io(wsURL, {
          transports: ['websocket', 'polling'],
          query: {
            userId: user.id
          },
          timeout: 10000,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        // Événement de connexion
        socketRef.current.on('connect', () => {
          console.log('🔌 Connecté au serveur WebSocket');
          setIsConnected(true);
          // Rejoindre la room de l'utilisateur
          socketRef.current.emit('join-user-room', user.id);
        });

        // Événement de déconnexion
        socketRef.current.on('disconnect', (reason) => {
          console.log('❌ Déconnecté du serveur WebSocket:', reason);
          setIsConnected(false);
        });

        // Erreur de connexion
        socketRef.current.on('connect_error', (error) => {
          console.error('❌ Erreur de connexion WebSocket:', error);
          setIsConnected(false);
        });

        // Tentative de reconnexion
        socketRef.current.on('reconnect_attempt', (attempt) => {
          console.log(`🔄 Tentative de reconnexion WebSocket: ${attempt}`);
        });

        // Reconnexion réussie
        socketRef.current.on('reconnect', (attempt) => {
          console.log(`✅ Reconnexion WebSocket réussie après ${attempt} tentatives`);
          setIsConnected(true);
          socketRef.current.emit('join-user-room', user.id);
        });

        // Nouvelle notification reçue
        socketRef.current.on('new-notification', (notification) => {
          console.log('📨 Nouvelle notification reçue:', notification);
          setNotificationCount(prev => prev + 1);
          
          toast({
            title: "Nouvelle notification",
            description: notification.titre || notification.message,
            duration: 5000,
          });
          
          window.dispatchEvent(new Event('notifications:reload'));
        });

        // Mise à jour du compteur de notifications
        socketRef.current.on('notification-count-update', (data) => {
          console.log('🔢 Mise à jour du compteur:', data.count);
          setNotificationCount(data.count);
        });

      } catch (error) {
        console.error('❌ Erreur lors de la création de la connexion WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        console.log('🧹 Nettoyage WebSocket');
        socketRef.current.disconnect();
      }
    };
  }, [user?.id]);

  return {
    isConnected,
    notificationCount,
    setNotificationCount
  };
};