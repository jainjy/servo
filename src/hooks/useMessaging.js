// hooks/useMessaging.js
import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/lib/api";

export const useMessaging = (conversationId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Charger les messages existants
  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const response = await api.get(
        `/conversations/${conversationId}/messages`
      );
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!socket || !conversationId) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === conversationId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId === conversationId) {
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
  }, [socket, conversationId]);

  // Envoyer un message
  const sendMessage = async (contenu, type = "TEXT", fileData = null) => {
    if (!conversationId || !contenu.trim()) return;

    try {
      setSending(true);

      const messageData = {
        conversationId,
        contenu: contenu.trim(),
        type,
        urlFichier: fileData?.url || null,
        nomFichier: fileData?.name || null,
        typeFichier: fileData?.type || null,
      };

      const response = await api.post("/messages", messageData);
      const newMessage = response.data.message;

      setMessages((prev) => [...prev, newMessage]);

      // Émettre l'événement socket
      if (socket) {
        socket.emit("send_message", newMessage);
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
    if (!socket || !messageIds.length) return;

    try {
      await api.patch("/messages/mark-read", { messageIds });
      socket.emit("mark_messages_read", {
        messageIds,
        conversationId,
      });
    } catch (error) {
      console.error("Erreur marquage messages lus:", error);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    markAsRead,
    refreshMessages: loadMessages,
  };
};
