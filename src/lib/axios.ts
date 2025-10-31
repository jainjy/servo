import axios from 'axios';

// Création de l'instance axios avec la configuration de base
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Intercepteur - Token trouvé:', token ? 'Oui' : 'Non');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Headers de la requête:', config.headers);
  }
  return config;
}, (error) => {
  console.error('Erreur dans l\'intercepteur de requête:', error);
  return Promise.reject(error);
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('Réponse reçue:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method
    });
    return response;
  },
  (error) => {
    console.error('Erreur de réponse:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    if (error.response?.status === 401) {
      // Ne pas rediriger automatiquement, mais plutôt émettre un événement
      const event = new CustomEvent('auth-error', {
        detail: { message: 'Session expirée' }
      });
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);