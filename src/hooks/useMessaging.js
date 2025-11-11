// hooks/useMessaging.js
import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/Contexts/SocketContext";
import api from "@/lib/api";

export const useMessaging = (demandeId) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [artisansStats, setArtisansStats] = useState([]);
  const messagesEndRef = useRef(null);
  const shouldScrollRef = useRef(true);

  // Fonction pour scroller vers le bas
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, []);

  // Charger les statistiques des artisans
  const loadArtisansStats = useCallback(async () => {
    if (!demandeId) return;

    try {
      const response = await api.get(`/demandes/${demandeId}/artisans-stats`);
      setArtisansStats(response.data);
    } catch (error) {
      console.error("Erreur chargement stats artisans:", error);
      setArtisansStats([]);
    }
  }, [demandeId]);

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

      // Charger les statistiques des artisans
      await loadArtisansStats();

      // Rejoindre la conversation via socket
      if (socket && convResponse.data.id) {
        socket.emit("join_conversation", convResponse.data.id);
      }

      // Scroller vers le bas après chargement
      shouldScrollRef.current = true;
    } catch (error) {
      console.error("Erreur chargement conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [demandeId, socket, loadArtisansStats]);

  // Scroller vers le bas quand les messages changent
  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages, scrollToBottom]);

  // Scroller vers le bas au premier chargement
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [loading, messages.length, scrollToBottom]);

  // Écouter les nouveaux messages
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.conversationId === conversation.id) {
        setMessages((prev) => [...prev, newMessage]);
        shouldScrollRef.current = true;

        // Rafraîchir les stats si c'est un message système (événement important)
        if (newMessage.type === "SYSTEM" || newMessage.evenementType) {
          loadArtisansStats();
        }
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
  }, [socket, conversation, loadArtisansStats]);

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
        console.log("Message envoyé avec succès", messageData);
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
      shouldScrollRef.current = true;

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

  // Effet principal
  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  return {
    messages,
    conversation,
    loading,
    sending,
    artisansStats,
    sendMessage,
    refreshMessages: loadConversation,
    refreshArtisansStats: loadArtisansStats,
    messagesEndRef,
    scrollToBottom,
  };
};
