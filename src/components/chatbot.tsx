import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser, FaChevronDown, FaLightbulb } from 'react-icons/fa';
import { sendMessageToAI, ChatMessage } from '../services/chatbotService';
import './chatbot.css';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "👋 Bonjour ! Je suis l'assistant IA d'OLIPLUS.RE. Comment puis-je vous aider pour votre projet immobilier à La Réunion ?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Ferme le chat si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = async (text: string | null = null) => {
    const messageToSend = text || input;
    
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { 
      role: "user", 
      content: messageToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setShowSuggestions(false); // Cache les suggestions après envoi
    
    if (!text) {
      setInput("");
    }
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToAI(messageToSend, messages);
      
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: aiResponse.response,
        timestamp: aiResponse.timestamp
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur IA:', error);
      
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Désolé, je rencontre des difficultés techniques. Veuillez nous contacter directement au 📞 06 92 66 77 55 ou par email à contact@oliplus.re",
        timestamp: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "👋 Bonjour ! Je suis l'assistant IA d'OLIPLUS.RE. Comment puis-je vous aider pour votre projet immobilier à La Réunion ?",
      },
    ]);
    setShowSuggestions(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Quels sont vos services immobiliers ?",
    "Comment obtenir une estimation gratuite ?",
    "Pouvez-vous m'aider à trouver un bien à Saint-Denis ?",
    "Quels sont vos frais d'agence ?",
    "Comment vendre rapidement mon bien ?",
    "Proposez-vous des locations ?",
    "Dans quelles villes intervenez-vous ?",
    "Quels sont vos horaires d'ouverture ?"
  ];

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Bouton rond flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`oliplus-chatbot-button ${isOpen ? 'active' : ''}`}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat OLIPLUS.RE"}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div 
          ref={chatRef} 
          className="chatbot-window"
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-left">
              <div className="header-avatar">
                <FaRobot className="header-robot-icon" />
                <span className="online-indicator"></span>
              </div>
              <div className="header-info">
                <h3>OLIPLUS.RE Assistant</h3>
                <p className="header-subtitle">Expert immobilier La Réunion</p>
                <div className="header-status">
                  <span className="status-dot"></span>
                  <span className="status-text">En ligne</span>
                </div>
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={clearChat} 
                className="header-action-btn"
                title="Nouvelle conversation"
              >
                <span className="action-text">Effacer</span>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="header-action-btn close-btn"
                title="Fermer"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
              >
                <div className="message-avatar">
                  {msg.role === "user" ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  {msg.timestamp && (
                    <small className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  )}
                </div>
              </div>
            ))}
            
            {/* Indicateur "bot en train d'écrire" */}
            {isTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">L'assistant OLIPLUS.RE écrit...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bouton Suggestions */}
          {!showSuggestions && (
            <div className="suggestions-toggle-container">
              <button
                onClick={toggleSuggestions}
                className="suggestions-toggle-btn"
                title="Voir les questions fréquentes"
              >
                <FaLightbulb className="suggestions-icon" />
                <span>Questions suggérées</span>
                <FaChevronDown className="chevron-icon" />
              </button>
            </div>
          )}

          {/* Suggestions déroulantes */}
          {showSuggestions && (
            <div className="suggestions-dropdown">
              <div className="suggestions-header">
                <FaLightbulb className="suggestions-header-icon" />
                <span className="suggestions-title">Questions fréquentes</span>
                <button 
                  onClick={toggleSuggestions} 
                  className="suggestions-close-btn"
                  title="Fermer"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="suggestions-grid">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    disabled={isLoading}
                    className="suggestion-btn"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className="chatbot-input">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Écrivez votre message..."
                disabled={isLoading}
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="send-btn"
                title="Envoyer"
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="input-footer">
              <div className="input-hint">
                💡 <strong>Astuce</strong> : Posez des questions précises
              </div>
              <a href="tel:0692667755" className="phone-link">
                📞 06 92 66 77 55
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;