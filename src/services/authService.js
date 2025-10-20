import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types d'utilisateur
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  PROFESSIONAL: 'professional'
};

// Stockage sécurisé
class SecureStorage {
  static setItem(key, value) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('LocalStorage non disponible:', error);
        // Fallback vers sessionStorage
        sessionStorage.setItem(key, value);
      }
    }
  }

  static getItem(key) {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('LocalStorage non disponible:', error);
        return sessionStorage.getItem(key);
      }
    }
    return null;
  }

  static removeItem(key) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('LocalStorage non disponible:', error);
      }
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn('SessionStorage non disponible:', error);
      }
    }
  }

  static clear() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear();
      } catch (error) {
        console.warn('LocalStorage non disponible:', error);
      }
      try {
        sessionStorage.clear();
      } catch (error) {
        console.warn('SessionStorage non disponible:', error);
      }
    }
  }
}

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les tokens expirés
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await AuthService.refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        AuthService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  // Vérifie si on est côté client
  static isClient() {
    return typeof window !== 'undefined';
  }

  // Connexion
  static async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      this.setAuthData(user, token);
      this.startTokenRefresh();
      
      return { user, token };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Inscription
  static async register(userData) {
    try {
      const registerData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        userType: userData.userType,
        companyName: userData.companyName,
        metiers: userData.metiers,
        demandType: userData.demandType
      };

      const response = await api.post('/auth/signup', registerData);
      const { user, token } = response.data;
      
      this.setAuthData(user, token);
      this.startTokenRefresh();
      
      return { user, token };
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'inscription');
    }
  }

  // Stockage des données d'authentification
  static setAuthData(user, token) {
    SecureStorage.setItem('auth-token', token);
    SecureStorage.setItem('user-data', JSON.stringify(user));
    SecureStorage.setItem('user-role', user.role);
    
    // Cookies pour compatibilité
    if (this.isClient() && typeof document !== 'undefined') {
      document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `user-role=${user.role}; path=/; max-age=86400; SameSite=Strict`;
    }

    // Événement pour notifier les composants React
    if (this.isClient() && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  }

  // Déconnexion
  static logout() {
    SecureStorage.removeItem('auth-token');
    SecureStorage.removeItem('user-data');
    SecureStorage.removeItem('user-role');
    
    // Nettoyer les cookies
    if (this.isClient() && typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    // Arrêter le rafraîchissement automatique
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }

    // Événement de déconnexion
    if (this.isClient() && typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
      
      // Redirection
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/pro')) {
        window.location.href = '/login';
      } else {
        window.location.href = '/';
      }
    }
  }

  // Rafraîchissement automatique du token
  static startTokenRefresh() {
    // Rafraîchir toutes les 55 minutes
    this.tokenRefreshInterval = setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.warn('Échec du rafraîchissement du token:', error);
          this.logout();
        }
      }
    }, 55 * 60 * 1000);
  }

  // Rafraîchir le token
  static async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        this.setAuthData(currentUser, token);
      }
      
      return token;
    } catch (error) {
      throw this.handleError(error, 'Impossible de rafraîchir le token');
    }
  }

  // Obtenir l'utilisateur actuel
  static getCurrentUser() {
    try {
      const userData = SecureStorage.getItem('user-data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Obtenir le token
  static getToken() {
    return SecureStorage.getItem('auth-token');
  }

  // Vérifier si authentifié
  static isAuthenticated() {
    return this.getToken() !== null;
  }

  // Headers authentifiés (pour fetch traditionnel)
  static getAuthHeaders() {
    const token = this.getToken();
    
    if (!token) {
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // Vérifier les rôles
  static hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Les admins ont tous les accès
    if (user.role === UserRole.ADMIN) return true;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  }

  // Redirection basée sur le rôle
  static redirectBasedOnRole() {
    const user = this.getCurrentUser();
    if (!user) return '/login';

    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.PROFESSIONAL:
        return '/pro';
      case UserRole.USER:
        return '/mon-compte';
      default:
        return '/';
    }
  }

  // Mot de passe oublié
  static async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la demande de réinitialisation');
    }
  }

  // Réinitialisation du mot de passe
  static async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la réinitialisation du mot de passe');
    }
  }

  // Vérification du token de réinitialisation
  static async verifyResetToken(token) {
    try {
      const response = await api.get('/auth/verify-reset-token', {
        params: { token }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, 'Token invalide ou expiré');
    }
  }

  // Gestion des erreurs
  static handleError(error, defaultMessage) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error(defaultMessage);
    }
  }

  static handleAuthError(error) {
    if (error.response?.status === 401) {
      this.logout();
      return new Error('Session expirée');
    }
    
    if (error.response?.status === 403) {
      return new Error('Accès non autorisé');
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    return new Error('Une erreur est survenue');
  }

  // Vérifier l'accès aux routes
  static canAccess(path) {
    const user = this.getCurrentUser();
    if (!user) return false;

    // Routes publiques
    const publicRoutes = ['/', '/login', '/register', '/actualites', '/immobilier', '/services', '/produits', '/tourisme'];
    if (publicRoutes.includes(path)) return true;

    // Routes protégées
    if (path.startsWith('/admin')) {
      return user.role === UserRole.ADMIN;
    }

    if (path.startsWith('/pro')) {
      return user.role === UserRole.PROFESSIONAL || user.role === UserRole.ADMIN;
    }

    if (path.startsWith('/mon-compte')) {
      return [UserRole.USER, UserRole.PROFESSIONAL, UserRole.ADMIN].includes(user.role);
    }

    return true;
  }

  // Nettoyage du stockage
  static clearStorage() {
    SecureStorage.clear();
  }
}

export { api };

export default AuthService;