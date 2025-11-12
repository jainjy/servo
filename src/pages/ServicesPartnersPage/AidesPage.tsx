import React, { useState } from "react";
import { Send, Mail, X, Phone, AlertCircle, Pencil, MailIcon } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-l-4 border-l-slate-900 rounded-r-2xl shadow-2xl p-6 w-full max-w-md h-11/12 mt-10 animate-slide-from-left flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Nouveau Message</h2>
              <p className="text-sm text-gray-500 mt-1">Envoyez-nous votre message</p>
            </div>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
            onClick={() => setShowMessageCard(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Adresse email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white transition-all duration-200"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <MailIcon />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Votre message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez-nous votre projet ou posez-nous vos questions..."
                rows={5}
                className="w-full p-3 pl-10 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 focus:bg-white transition-all duration-200 resize-none custom-scrollbar"
              />
              <div className="absolute left-3 top-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 text-xs font-bold"><Pencil /></span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {message.length}/500 caractères
              </span>
              {message.length > 400 && (
                <span className="text-xs text-orange-500 font-medium">
                  <AlertCircle /> Approche de la limite
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-end pt-4 border-t border-gray-100">
          <button
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
            onClick={() => {
              setShowMessageCard(false);
              setEmail('');
              setMessage('');
            }}
          >
            <X className="w-4 h-4" />
            Annuler
          </button>

          <button
            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 transform shadow-lg hover:shadow-xl flex items-center gap-2 group"
            onClick={handleSendMessage}
            disabled={!email || !message}
          >
            <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
              <Send className="w-4 h-4" />
            </div>
            Envoyer le message
          </button>
        </div>
      </div>
      <style >{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`}</style>
    </div>


  );

  return (
    <>
      <div className="fixed bottom-6 left-6 z-40 animate-fade-in">
        <button
          className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-900 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex gap-4 items-center">
                <Phone />
                Contactez-nous
              </h3>
              <p className="text-gray-600 mb-4">Notre équipe est disponible pour vous aider</p>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors font-medium"
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
                className="bg-transparent border-2 border-slate-900 text-slate-900 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors font-medium"
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