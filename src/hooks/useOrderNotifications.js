// hooks/useOrderNotifications.js
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export const useOrderNotifications = () => {
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    messages: 0,
    reservations: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      console.log('🔄 Chargement des notifications...');
      
      // Récupérer les commandes en attente
      const ordersResponse = await api.get('/orders/pro/stats');
      const pendingOrders = ordersResponse.data.success ? 
        (ordersResponse.data.stats?.pending || 0) : 0;

      // Récupérer les messages non lus (exemple)
      // const messagesResponse = await api.get('/messages/unread-count');
      // const messages = messagesResponse.data.count || 0;

      // Récupérer les réservations en attente (exemple)
      // const reservationsResponse = await api.get('/reservations/pending-count');
      // const reservations = reservationsResponse.data.count || 0;

      setNotifications({
        pendingOrders,
        messages: 3, // Valeur mockée pour l'exemple
        reservations: 5 // Valeur mockée pour l'exemple
      });

      console.log('✅ Notifications chargées:', {
        pendingOrders,
        messages: 3,
        reservations: 5
      });

    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
      // Valeurs par défaut en cas d'erreur
      setNotifications({
        pendingOrders: 2,
        messages: 3,
        reservations: 5
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);

    // Écouter les événements de mise à jour
    const handleOrdersUpdate = () => {
      fetchNotifications();
    };

    window.addEventListener('ordersUpdated', handleOrdersUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('ordersUpdated', handleOrdersUpdate);
    };
  }, []);

  const refreshNotifications = () => {
    fetchNotifications();
  };

  return {
    notifications,
    loading,
    refreshNotifications
  };
};