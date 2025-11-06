import React, { useState } from "react";
import { Send, Mail, X } from "lucide-react";

const AidesPage = () => {
  const [showMessageCard, setShowMessageCard] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    console.log("Email:", email);
    console.log("Message:", message);
    setShowMessageCard(false);
    setEmail('');
    setMessage('');
    alert("Message envoyé avec succès!");
  };

  const MessageCard = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-start bg-black/50 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-r-2xl p-6 w-full max-w-md h-full ml-0 animate-slide-from-left">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Nouveau Message
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setShowMessageCard(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Entrez votre email"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              rows={6}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
            onClick={() => {
              setShowMessageCard(false);
              setEmail('');
              setMessage('');
            }}
          >
            Annuler
          </button>

          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 transform hover:scale-105 flex items-center gap-2"
            onClick={handleSendMessage}
          >
            <Send className="w-4 h-4" />
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
        <button 
          className="px-6 py-3 bg-blue-500 text-white rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
          onClick={() => setShowMessageCard(true)}
        >
          <Send className="w-4 h-4" />
          Envoyer un message
        </button>
      </div>

      <div className="max-w-4xl mx-auto py-8 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Centre d'Aide et Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📞 Contactez-nous</h3>
              <p className="text-gray-600 mb-4">Notre équipe est disponible pour vous aider</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              onClick={() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: 'smooth',
                });
              }}
              >
                Appeler le support
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 mb-4">Envoyez-nous un message</p>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                onClick={() => setShowMessageCard(true)}
              >
                Envoyer un email
              </button>
            </div>
          </div>
        </div>
      </div>

      {showMessageCard && <MessageCard />}
    </>
  );
};

export default AidesPage;