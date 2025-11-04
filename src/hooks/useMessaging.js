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
      const url = `/conversations/${demandeId}/messages`;
      // Charger les messages
      const messagesResponse = await api.get(url);
      setMessages(messagesResponse.data || []);

      // Rejoindre la conversation via socket
      if (socket && convResponse.data.id) {
        socket.emit("join_conversation", convResponse.data.id);
      }
    } catch (error) {
      console.error("Erreur chargement conversation:", error);
      // Si la conversation n'existe pas, on ne la crée pas automatiquement
      // Elle sera créée lors du premier message
    } finally {
      setLoading(false);
    }
  }, [demandeId, socket]);

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
        console.log("Message envoyé avec succès",messageData);
      } catch (error) {
        // Si la conversation n'existe pas (404), on essaie de créer un message système d'abord
        if (error.response?.status === 404) {
          // Pour créer la conversation, on envoie d'abord un message système
          await api.post(`/conversations/${demandeId}/messages`, {
            contenu: "Début de la conversation",
            type: "SYSTEM",
          });
          // Puis on renvoie le vrai message
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

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    messages,
    conversation,
    loading,
    sending,
    sendMessage,
    refreshMessages: loadConversation,
  };
};
