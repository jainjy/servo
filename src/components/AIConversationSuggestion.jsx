import { useState, useEffect } from "react";
import { Sparkles, X, Send, ChevronDown, ChevronUp } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function AIConversationSuggestion({ 
  conversationId, 
  onUseSuggestion,
  messageCount
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Récupération analyse pour conversation #${conversationId}...`);
        
        const response = await api.get(`/ai-commercial/analyse/${conversationId}`);

        if (isMounted) {
          console.log("✅ Analyse reçue:", response.data);
          
          if (response.data && response.data.confiance > 40) {
            setAnalysis(response.data);
          } else {
            setAnalysis(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("❌ Erreur:", err);
          setError("Impossible d'analyser la conversation");
          setAnalysis(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (conversationId) {
      fetchAnalysis();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [conversationId, messageCount]);

  if (loading) {
    return (
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">Analyse de la conversation en cours...</span>
        </div>
      </div>
    );
  }

  if (error || !analysis || analysis.confiance < 40) {
    return null;
  }

  return (
    <div className="mb-4 bg-white rounded-xl border-2 border-green-200 shadow-lg overflow-hidden">
      {/* En-tête */}
      <div 
        className="px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 cursor-pointer flex items-center justify-between border-b border-green-200"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-800">Assistant conversation</span>
          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
            {analysis.confiance}% pertinent
          </span>
        </div>
        <div className="text-green-600">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Contenu détaillé */}
      {expanded && (
        <div className="p-4">
          {/* Analyse */}
          {analysis.analyse && (
            <div className="mb-3 text-sm text-gray-600 italic border-l-3 border-green-400 pl-3">
              {analysis.analyse}
            </div>
          )}

          {/* Suggestion de réponse */}
          {analysis.suggestion && (
            <div className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">💡 Suggestion de réponse :</p>
              <p className="text-base text-gray-800">"{analysis.suggestion}"</p>
            </div>
          )}

          {/* Type d'action suggéré */}
          {analysis.typeAction && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-gray-500">Action suggérée :</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {analysis.typeAction === "repondre" && "✅ Répondre maintenant"}
                {analysis.typeAction === "relancer" && "🔄 Relancer le client"}
                {analysis.typeAction === "proposer_rdv" && "📅 Proposer rendez-vous"}
                {analysis.typeAction === "envoyer_devis" && "📄 Envoyer un devis"}
                {analysis.typeAction === "autre" && "💬 Poursuivre conversation"}
              </span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                onUseSuggestion(analysis.suggestion);
                toast.success("✅ Suggestion appliquée dans le champ de saisie");
                setExpanded(false);
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Utiliser cette réponse
            </button>
            <button
              onClick={() => setExpanded(false)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            L'IA analyse l'historique complet pour vous suggérer la réponse la plus pertinente
          </p>
        </div>
      )}
    </div>
  );
}