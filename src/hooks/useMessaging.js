// hooks/useMessaging.js - Version corrigée
import { useState, useEffect, useCallback, useRef } from "react";
import { useSocket } from "@/Contexts/SocketContext";
import api from "@/lib/api";

export const useMessaging = (demandeId) => {
  const { socket, isConnected } = useSocket(); // Ajout de isConnected
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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Charger les messages
  const loadMessages = useCallback(async () => {
    if (!demandeId) return;

    try {
      const messagesResponse = await api.get(
        `/conversations/${demandeId}/messages`
      );
      setMessages(messagesResponse.data || []);
      shouldScrollRef.current = true;
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  }, [demandeId]);

  // Charger la conversation complète
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
      await loadMessages();

      // Rejoindre la conversation via socket
      if (socket && convResponse.data.id) {
        socket.emit("join_conversation", convResponse.data.id);
        console.log("Rejoint la conversation:", convResponse.data.id);
      }
    } catch (error) {
      console.error("Erreur chargement conversation:", error);
    } finally {
      setLoading(false);
    }
  }, [demandeId, socket, loadMessages]);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!socket || !conversation) return;

    const handleNewMessage = (newMessage) => {
      console.log("Nouveau message reçu:", newMessage);

      // Vérifier que le message appartient à cette conversation
      if (newMessage.conversationId === conversation.id) {
        setMessages((prev) => {
          // Éviter les doublons
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) return prev;

          return [...prev, newMessage];
        });
        shouldScrollRef.current = true;
      }
    };

    // Écouter l'événement pour les nouveaux messages
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, conversation]);

  // Scroller vers le bas quand les messages changent
  useEffect(() => {
    if (shouldScrollRef.current) {
      scrollToBottom();
      shouldScrollRef.current = false;
    }
  }, [messages, scrollToBottom]);

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

      const response = await api.post(
        `/conversations/${demandeId}/messages`,
        messageData
      );

      const newMessage = response.data;

      // Mettre à jour localement immédiatement
      setMessages((prev) => [...prev, newMessage]);
      shouldScrollRef.current = true;

      // Le socket émettra l'événement côté serveur, donc pas besoin de recharger

      return newMessage;
    } catch (error) {
      console.error("Erreur envoi message:", error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Recharger périodiquement pour les cas où les WebSockets échouent
  useEffect(() => {
    if (!demandeId) return;

    loadConversation();

    // Recharger toutes les 30 secondes pour s'assurer d'avoir les derniers messages
    const interval = setInterval(() => {
      loadMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, [demandeId, loadConversation, loadMessages]);

  return {
    messages,
    conversation,
    loading,
    sending,
    artisansStats,
    sendMessage,
    refreshMessages: loadMessages,
    refreshConversation: loadConversation,
    messagesEndRef,
    scrollToBottom,
  };
};
