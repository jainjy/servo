import axios from 'axios';

// Utilisez l'URL absolue pour le développement
const API_BASE_URL = import.meta.env.VITE_API_URL || 
                     process.env.REACT_APP_API_URL || 
                     'http://localhost:3001/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

export const sendMessageToAI = async (
  message: string, 
  conversationHistory: ChatMessage[]
): Promise<ChatResponse> => {
  try {
    console.log('📤 Envoi au backend:', { message, conversationHistory });
    
    const response = await axios.post(`${API_BASE_URL}/chatbot/chat`, {
      message,
      conversationHistory
    });
    
    console.log('📥 Réponse reçue:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur API Gemini:', error);
    
    // Log détaillé de l'erreur
    if (axios.isAxiosError(error)) {
      console.error('📡 Détails HTTP:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
    }
    
    throw new Error('Impossible de contacter l\'assistant IA. Veuillez réessayer.');
  }
};