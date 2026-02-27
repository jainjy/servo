// backend/services/aiCommercialService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

class AICommercialService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY manquante dans .env");
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ Service IA Commercial initialisé');
  }

  /**
   * Analyse l'historique complet de la conversation et suggère une réponse
   */
  async analyserConversation(conversation) {
    try {
      // Construire l'historique complet
      const historique = conversation.messages.map(m => 
        `${m.expediteur?.userType === 'CLIENT' ? 'CLIENT' : 'ARTISAN'}: ${m.contenu}`
      ).join('\n');

      // Récupérer les conversations similaires pour inspiration
      const conversationsSimilaires = await this.trouverConversationsSimilaires(
        conversation.demande?.serviceId,
        conversation.messages
      );

      const prompt = `
      Tu es un assistant conversationnel pour artisans. Analyse TOUT l'historique de cette conversation et propose une réponse pertinente.

      HISTORIQUE COMPLET DE LA CONVERSATION:
      ${historique}

      CONTEXTE:
      - Service: ${conversation.demande?.service?.libelle || 'Non spécifié'}
      - Description: ${conversation.demande?.description || 'Non fournie'}
      - Statut: ${conversation.demande?.statut || 'En cours'}

      ${conversationsSimilaires.length > 0 ? `
      CONVERSATIONS SIMILAIRES (pour inspiration):
      ${conversationsSimilaires.map((c, i) => `
      Exemple ${i+1}:
      ${c.historique}
      → Réponse efficace: "${c.reponseEfficace}"
      `).join('\n')}
      ` : ''}

      Analyse:
      1. Quel est le sujet principal de la conversation ?
      2. Quelles questions restent sans réponse ?
      3. Que devrait faire l'artisan maintenant ?

      Propose une réponse adaptée au contexte actuel de la conversation.
      La réponse doit être naturelle, professionnelle et utile.

      Réponds UNIQUEMENT avec cet objet JSON:
      {
        "analyse": "brève analyse de la conversation (1 phrase)",
        "suggestion": "ta réponse suggérée ici (2-3 phrases max)",
        "typeAction": "repondre|relancer|proposer_rdv|envoyer_devis|autre",
        "confiance": 85,
        "inspireDe": "conversations_similaires|analyse_directe"
      }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return this.reponseParDefaut();
    } catch (error) {
      console.error('❌ Erreur analyse conversation:', error);
      return this.reponseParDefaut();
    }
  }

  /**
   * Trouve des conversations similaires dans l'historique
   */
  async trouverConversationsSimilaires(serviceId, messagesActuels, limite = 3) {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Récupérer les conversations terminées du même service
      const conversations = await prisma.conversation.findMany({
        where: {
          demande: {
            serviceId: serviceId,
            statut: 'terminée'
          }
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            include: {
              expediteur: {
                select: { userType: true }
              }
            }
          }
        },
        take: 10
      });

      // Extraire les conversations avec des réponses efficaces
      const similaires = [];
      
      for (const conv of conversations) {
        // Trouver les échanges client -> artisan
        const echanges = [];
        let reponseEfficace = '';

        for (let i = 0; i < conv.messages.length; i++) {
          const msg = conv.messages[i];
          if (msg.expediteur?.userType === 'CLIENT') {
            // Chercher la réponse artisan suivante
            for (let j = i + 1; j < conv.messages.length; j++) {
              if (conv.messages[j].expediteur?.userType === 'ARTISAN') {
                echanges.push({
                  client: msg.contenu,
                  artisan: conv.messages[j].contenu
                });
                if (!reponseEfficace && conv.messages[j].contenu.length > 20) {
                  reponseEfficace = conv.messages[j].contenu;
                }
                break;
              }
            }
          }
        }

        if (echanges.length > 0) {
          similaires.push({
            historique: echanges.map(e => `Client: ${e.client}\nArtisan: ${e.artisan}`).join('\n\n'),
            reponseEfficace: reponseEfficace || echanges[0]?.artisan || ''
          });
        }
      }

      await prisma.$disconnect();
      return similaires.slice(0, limite);

    } catch (error) {
      console.error('❌ Erreur recherche similarités:', error);
      return [];
    }
  }

  reponseParDefaut() {
    return {
      analyse: "Conversation en cours",
      suggestion: "Bonjour, merci pour votre message. Je fais le point sur votre demande et vous réponds dans la journée.",
      typeAction: "repondre",
      confiance: 50,
      inspireDe: "defaut"
    };
  }
}

module.exports = new AICommercialService();