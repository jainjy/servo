// hooks/useMessaging.js
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/lib/api";

export const useMessaging = (demandeId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Charger la conversation et les messages
  const loadConversation = useCallback(async () => {
    if (!demandeId) return;

    try {
      setLoading(true);

      // Charger les détails de la conversation
      const convResponse = await api.get(
        `/conversations/demande/${demandeId}/details`
      );
      setConversation(convResponse.data);

      // Charger les messages
      const messagesResponse = await api.get(
        `/conversations/${demandeId}/messages`
      );
      setMessages(messagesResponse.data || []);

      // Rejoindre la conversation via socket
      if (socket && convResponse.data.id) {
        socket.emit("join_conversation", convResponse.data.id);
      }
    } catch (error) {
      console.error("Erreur chargement conversation:", error);
      // Si la conversation n'existe pas, on la créera lors du premier message
    } finally {
      setLoading(false);
    }
  }, [demandeId, socket]);

  // Créer une conversation si elle n'existe pas
  const createConversation = async () => {
    try {
      // Pour créer une conversation, on envoie le premier message
      // La conversation sera créée automatiquement par le backend
      const response = await api.post(`/conversations/${demandeId}/messages`, {
        contenu: "Début de la conversation",
        type: "SYSTEM",
      });
      return response.data;
    } catch (error) {
      console.error("Erreur création conversation:", error);
      throw error;
    }
  };

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === conversation.id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId === conversation.id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === data.messageId ? { ...msg, lu: true } : msg
          )
        );
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_read", handleMessageRead);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_read", handleMessageRead);
    };
  }, [socket, conversation]);

  // Envoyer un message
  const sendMessage = async (contenu, type = "TEXT", fileData = null) => {
    if (!demandeId || !contenu.trim()) return;

    try {
      setSending(true);

      const messageData = {
        contenu: contenu.trim(),
        type,
        urlFichier: fileData?.url || null,
        nomFichier: fileData?.name || null,
        typeFichier: fileData?.type || null,
      };

      let response;
      try {
        response = await api.post(
          `/conversations/${demandeId}/messages`,
          messageData
        );
      } catch (error) {
        // Si la conversation n'existe pas, on essaie de la créer
        if (error.response?.status === 404) {
          await createConversation();
          // Réessayer d'envoyer le message
          response = await api.post(
            `/conversations/${demandeId}/messages`,
            messageData
          );
        } else {
          throw error;
        }
      }

      const newMessage = response.data;

      setMessages((prev) => [...prev, newMessage]);

      // Émettre l'événement socket
      if (socket) {
        socket.emit("send_message", newMessage);
      }

      // Recharger la conversation si ce n'était pas fait
      if (!conversation) {
        await loadConversation();
      }

      return newMessage;
    } catch (error) {
      console.error("Erreur envoi message:", error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Marquer les messages comme lus
  const markAsRead = async (messageIds) => {
    if (!socket || !messageIds.length || !conversation) return;

    try {
      // Cette fonctionnalité peut être implémentée si nécessaire
      // Pour l'instant, les messages sont marqués comme lus automatiquement lors du chargement
    } catch (error) {
      console.error("Erreur marquage messages lus:", error);
    }
  };

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    messages,
    conversation,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refreshMessages: loadConversation,
  };
};
