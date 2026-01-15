import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';
import './chatbot.css';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Bonjour ! Je suis l'assistant OLIPLUS.RE. Comment puis-je vous aider pour votre projet immobilier à La Réunion ?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🔽 Auto-scroll vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔽 Ferme le chat si clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target) && isOpen) {
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

  // 🔽 Réponses OLIPLUS.RE
  const getResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('bonjour') || input.includes('salut') || input.includes('hello')) {
      return "Bonjour ! 👋 OLIPLUS.RE est votre expert immobilier à La Réunion. Je peux vous aider avec :\n• Vente de votre bien\n• Achat accompagné\n• Location & gestion\n• Estimation gratuite\n\nQue recherchez-vous ?";
    }
    
    if (input.includes('service') || input.includes('offre')) {
      return "**Services OLIPLUS.RE :**\n\n🏠 **VENTE** - Estimation gratuite, marketing personnalisé, accompagnement complet\n\n🏡 **ACHAT** - Recherche ciblée, visites, négociation\n\n🏢 **LOCATION** - Gestion locative complète\n\n📊 **ESTIMATION** - Analyse de marché gratuite\n\nPlus d'infos sur OLIPLUS.RE";
    }
    
    if (input.includes('contact') || input.includes('téléphone') || input.includes('mail')) {
      return "**Contact OLIPLUS.RE :**\n\n📞 06 92 66 77 55\n📧 contact@oliplus.re\n📍 45 Rue Alexis De Villeneuve, Saint-Denis 97400\n🌐 www.oliplus.re\n\nHoraires : Lundi-Vendredi 9h-18h";
    }
    
    if (input.includes('estimation') || input.includes('prix') || input.includes('valeur')) {
      return "OLIPLUS.RE propose une **estimation gratuite** de votre bien. Notre expert visite votre propriété, analyse le marché réunionnais et vous donne une valorisation précise. Souhaitez-vous prendre rendez-vous ?";
    }
    
    if (input.includes('location') || input.includes('louer')) {
      return "Pour la **location avec OLIPLUS.RE**, nous gérons : recherche de locataires, visites, dossiers, bail, état des lieux et suivi des loyers. Service complet pour propriétaires et locataires.";
    }
    
    if (input.includes('vente') || input.includes('vendre')) {
      return "**Vendre avec OLIPLUS.RE :**\n1. Estimation stratégique\n2. Marketing premium\n3. Visites organisées\n4. Négociation experte\n5. Suivi jusqu'au notaire\n\nNotre objectif : vendre au meilleur prix, dans les meilleurs délais.";
    }
    
    if (input.includes('site') || input.includes('web') || input.includes('internet')) {
      return "Visitez notre site **OLIPLUS.RE** pour :\n• Consulter nos annonces\n• Découvrir nos services\n• Demander une estimation\n• Nous contacter\n\n👉 www.oliplus.re";
    }
    
    if (input.includes('adresse') || input.includes('agence') || input.includes('local')) {
      return "**Agence OLIPLUS.RE :**\n45 Rue Alexis De Villeneuve\n97400 SAINT-DENIS\nLa Réunion\n\nNous recevons sur rendez-vous du lundi au vendredi.";
    }
    
    if (input.includes('bien') || input.includes('annonce') || input.includes('propriété')) {
      return "OLIPLUS.RE propose une sélection de biens sur toute La Réunion : appartements, maisons, villas, terrains. Consultez nos annonces sur www.oliplus.re ou contactez-nous pour une recherche personnalisée.";
    }
    
    if (input.includes('réunion') || input.includes('la réunion') || input.includes('974')) {
      return "OLIPLUS.RE couvre toute l'île de La Réunion : Saint-Denis, Saint-Pierre, Saint-Paul, Le Tampon, Saint-Benoît, etc. Notre expertise locale nous permet de vous conseiller au mieux.";
    }
    
    return "Merci pour votre message ! Pour une réponse personnalisée, contactez OLIPLUS.RE :\n📞 06 92 66 77 55\n📧 contact@oliplus.re\n🌐 www.oliplus.re\n\nJe reste à votre disposition pour d'autres questions sur l'immobilier à La Réunion.";
  };

  const sendMessage = () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Réponse instantanée
    setTimeout(() => {
      const reply = getResponse(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setIsLoading(false);
    }, 500);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "👋 Bonjour ! Je suis l'assistant OLIPLUS.RE. Comment puis-je vous aider pour votre projet immobilier à La Réunion ?",
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Services OLIPLUS.RE",
    "Estimation gratuite",
    "Nous contacter",
    "Visiter le site"
  ];

  return (
    <div className="chatbot-wrapper">
      {/* Bouton rond à DROITE */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`chatbot-button ${isOpen ? 'active' : ''}`}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat OLIPLUS.RE"}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000
        }}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div 
          ref={chatRef} 
          className="chatbot-window"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            zIndex: 999
          }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="header-left">
              <FaRobot className="header-icon" />
              <div>
                <h3>OLIPLUS.RE Assistant</h3>
                <p>Expert immobilier La Réunion</p>
              </div>
            </div>
            <button onClick={clearChat} className="clear-btn">
              Effacer
            </button>
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
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message bot">
                <div className="message-avatar">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Questions rapides */}
          <div className="quick-questions">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="question-btn"
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Votre message..."
                
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </div>
            <div className="input-info">
              <span>Appuyez sur <strong>Entrée</strong> pour envoyer</span>
              <a href="tel:0692667755" className="phone">📞 06 92 66 77 55</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;