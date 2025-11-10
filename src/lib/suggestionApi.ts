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

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    
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
  } catch (error) {
    console.error("Erreur API suggestion:", error);
    throw error;
  }
}

// 📍 Enregistrer une activité avec durée
export async function trackUserActivity(data: {
  entityType: string;
  entityId: string;
  action: "view" | "click" | "purchase" | "long_view" | "add_to_cart" | "search" | "favorite";
  duration?: number;
  searchQuery?: string;
  metadata?: Record<string, any>;
}) {
  return apiFetch("/activity", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 📍 Enregistrer un événement
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