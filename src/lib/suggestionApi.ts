// src/lib/suggestionApi.ts
import { UserActivity, UserEvent, Recommendation } from '../types/suggestionTypes';

const API_URL = "http://localhost:3001/api/suggestion";

// Fonction utilitaire pour récupérer le token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Essayer plusieurs méthodes de stockage
  const token = localStorage.getItem("token") || 
                localStorage.getItem("auth-token") ||
                sessionStorage.getItem("token");
  
  return token;
};

// Queue pour les activités avec debounce
let activityQueue: any[] = [];
let activityTimeout: NodeJS.Timeout;

// Fonction principale avec gestion du rate limiting
async function apiFetch(path: string, options: RequestInit = {}, maxRetries = 3) {
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`${API_URL}${path}`, { ...options, headers });
      
      // Gérer le rate limiting (429)
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000; // 60s par défaut
        
        console.warn(`Rate limit atteint. Nouvelle tentative dans ${waitTime/1000}s`);
        
        // Attendre et retenter
        await new Promise(resolve => setTimeout(resolve, waitTime));
        const retryRes = await fetch(`${API_URL}${path}`, { ...options, headers });
        
        if (!retryRes.ok) {
          throw new Error(`Erreur HTTP après retry: ${retryRes.status}`);
        }
        return retryRes.json();
      }
      
      if (res.status === 401) {
        // Token invalide ou expiré
        console.warn("Token d'authentification invalide ou expiré");
        // Optionnel: rediriger vers la page de login
        // window.location.href = '/login';
        throw new Error("Token d'authentification invalide");
      }
      
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status} - ${await res.text()}`);
      }
      
      return res.json();
    } catch (error: any) {
      lastError = error;
      
      // Exponential backoff pour les autres erreurs
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Tentative ${attempt + 1} échouée. Nouvelle tentative dans ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      break;
    }
  }
  
  throw lastError;
}

// 📍 Enregistrer une activité avec système de queue et debounce
export async function trackUserActivity(data: {
  entityType: string;
  entityId: string;
  action: "view" | "click" | "purchase" | "long_view" | "add_to_cart" | "search" | "favorite";
  duration?: number;
  searchQuery?: string;
  metadata?: Record<string, any>;
}) {
  // Ajouter à la queue
  activityQueue.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  
  // Clear le timeout existant
  if (activityTimeout) clearTimeout(activityTimeout);
  
  // Déclencher après 2 secondes (batch les requêtes)
  activityTimeout = setTimeout(async () => {
    if (activityQueue.length > 0) {
      const activitiesToSend = [...activityQueue];
      activityQueue = []; // Vider la queue immédiatement
      
      try {
        // Envoyer toutes les activités en une seule requête
        await apiFetch("/activity/batch", {
          method: "POST",
          body: JSON.stringify({ activities: activitiesToSend }),
        });
        console.log(`✅ ${activitiesToSend.length} activités envoyées avec succès`);
      } catch (error) {
        console.error("❌ Erreur envoi batch activités:", error);
        // Re-mettre les activités dans la queue en cas d'erreur
        activityQueue = [...activitiesToSend, ...activityQueue];
        
        // Stocker en local storage pour retry plus tard
        storePendingActivities(activitiesToSend);
      }
    }
  }, 2000);
}

// 📍 Stocker les activités en attente
function storePendingActivities(activities: any[]) {
  try {
    const pendingActivities = JSON.parse(localStorage.getItem('pendingActivities') || '[]');
    const updatedActivities = [...pendingActivities, ...activities];
    
    // Garder seulement les 50 dernières activités pour éviter le stockage excessif
    const trimmedActivities = updatedActivities.slice(-50);
    
    localStorage.setItem('pendingActivities', JSON.stringify(trimmedActivities));
  } catch (error) {
    console.error('Erreur stockage activités en attente:', error);
  }
}

// 📍 Retry les activités en attente
export async function retryPendingActivities() {
  try {
    const pendingActivities = JSON.parse(localStorage.getItem('pendingActivities') || '[]');
    
    if (pendingActivities.length > 0) {
      console.log(`🔄 Retry de ${pendingActivities.length} activités en attente...`);
      
      // Filtrer les activités de plus de 24h
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      const recentActivities = pendingActivities.filter((activity: any) => 
        new Date(activity.timestamp).getTime() > twentyFourHoursAgo
      );
      
      if (recentActivities.length > 0) {
        await apiFetch("/activity/batch", {
          method: "POST",
          body: JSON.stringify({ activities: recentActivities }),
        });
        
        // Supprimer seulement celles qui ont été envoyées avec succès
        localStorage.removeItem('pendingActivities');
        console.log(`✅ ${recentActivities.length} activités en attente récupérées`);
      } else {
        localStorage.removeItem('pendingActivities');
      }
    }
  } catch (error) {
    console.error('❌ Erreur retry activités en attente:', error);
  }
}

// 📍 Enregistrer un événement (sans batch pour l'instant)
export async function trackUserEvent<T = unknown>(data: {
  eventType: string;
  eventData?: T;
}) {
  return apiFetch("/event", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 📍 Récupérer les préférences
export async function getUserPreferences() {
  return apiFetch("/preferences");
}

// 📍 Récupérer les recommandations
export async function getUserRecommendations(limit: number = 10): Promise<Recommendation[]> {
  return apiFetch(`/recommendations?limit=${limit}`);
}

// 📍 Récupérer les trending products
export async function getTrendingProducts(limit: number = 8) {
  return apiFetch(`/trending?limit=${limit}`);
}

// 📍 Vider manuellement la queue (pour les composants unmount)
export function flushActivityQueue() {
  if (activityQueue.length > 0) {
    const activitiesToSend = [...activityQueue];
    activityQueue = [];
    
    apiFetch("/activity/batch", {
      method: "POST",
      body: JSON.stringify({ activities: activitiesToSend }),
    }).catch(error => {
      console.error("Erreur flush activités:", error);
      storePendingActivities(activitiesToSend);
    });
  }
}

// Retry automatique au chargement de la page
if (typeof window !== 'undefined') {
  window.addEventListener('load', retryPendingActivities);
  
  // Retry toutes les 5 minutes
  setInterval(retryPendingActivities, 5 * 60 * 1000);
}