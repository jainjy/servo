import api from "@/lib/api";
// Rôles d'utilisateur
export const UserRole = {
  USER: "user",
  ADMIN: "admin",
  PROFESSIONAL: "professional",
};
// Stockage sécurisé avec gestion d'erreurs
class SecureStorage {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(
        "LocalStorage non disponible, utilisation de sessionStorage:",
        error
      );
      sessionStorage.setItem(key, value);
    }
  }
  static getItem(key) {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch (error) {
      console.warn("Erreur d'accès au stockage:", error);
      return null;
    }
  }
  static removeItem(key) {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn("Erreur lors de la suppression:", error);
    }
  }
}
class AuthService {
  static tokenRefreshInterval = null;
  // Connexion
  static async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;
      this.setAuthData(user, token);
      this.startTokenRefresh();
      return { user, token };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }
  // register
  static async register(userData) {
    try {
      const registerData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        userType: userData.userType,
        demandType: userData.demandType,
        role: userData.role,
        companyName: userData.companyName,
        commercialName: userData.commercialName,
        siret: userData.siret,
        address: userData.address,
        addressComplement: userData.addressComplement,
        zipCode: userData.zipCode,
        city: userData.city,
        latitude: userData.latitude,
        longitude: userData.longitude,
        metiers: userData.metiers,
      };
      const response = await api.post("/auth/signup", registerData);
      const { user, token } = response.data;
      this.setAuthData(user, token);
      this.startTokenRefresh();
      return { user, token, route: AuthService.getRoleBasedRedirect() };
    } catch (error) {
      throw this.handleError(error, "Erreur lors de l'inscription");
    }
  }
  // Inscription Pro sans paiement (avec plan sélectionné gratuit 2 mois)
  static async signupPro(userData, planId) {
    try {
      const response = await api.post("/auth/signup-pro", {
        utilisateur: {
          ...userData,
          metiers: userData.metiers || [], // AJOUT: Inclure les métiers
        },
        planId,
      });
      const { user, token } = response.data;
      if (user && token) {
        this.setAuthData(user, token);
        this.startTokenRefresh();
      }
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        "Erreur lors de l'inscription professionnelle"
      );
    }
  }
  // Confirmation du paiement (gardé pour les paiements ultérieurs)
  static async confirmPayment(paymentIntentId) {
    try {
      const response = await api.post("/auth/confirm-payment", {
        paymentIntentId,
      });
      const { user, token } = response.data;
      if (user && token) {
        this.setAuthData(user, token);
        this.startTokenRefresh();
      }
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        "Erreur lors de la confirmation du paiement"
      );
    }
  }
  // Stockage des données d'authentification
  static setAuthData(user, token) {
    SecureStorage.setItem("auth-token", token);
    SecureStorage.setItem("user-data", JSON.stringify(user));
    // Notifier les composants du changement d'authentification
    window.dispatchEvent(new Event("auth-change"));
  }
  // Déconnexion
  static logout() {
    SecureStorage.removeItem("auth-token");
    SecureStorage.removeItem("user-data");
    // Arrêter le rafraîchissement automatique
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
    // Notifier la déconnexion
    window.dispatchEvent(new Event("auth-change"));
  }
  // Rafraîchissement automatique du token
  static startTokenRefresh() {
    // Nettoyer l'intervalle existant
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
    }
    // Rafraîchir toutes les 55 minutes
    this.tokenRefreshInterval = setInterval(async () => {
      if (this.isAuthenticated()) {
        try {
          await this.refreshToken();
        } catch (error) {
          console.warn("Échec du rafraîchissement du token:", error);
          this.logout();
        }
      }
    }, 55 * 60 * 1000);
  }
  // Rafraîchir le token
  static async refreshToken() {
    try {
      const response = await api.post("/auth/refresh");
      const { token } = response.data;
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        this.setAuthData(currentUser, token);
      }
      return token;
    } catch (error) {
      throw this.handleError(error, "Impossible de rafraîchir le token");
    }
  }
  // Obtenir l'utilisateur actuel
  static getCurrentUser() {
    try {
      const userData = SecureStorage.getItem("user-data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erreur lors du parsing des données utilisateur:", error);
      return null;
    }
  }
  // Obtenir le token
  static getToken() {
    return SecureStorage.getItem("auth-token");
  }
  // Vérifier si authentifié
  static isAuthenticated() {
    return !!this.getToken();
  }
  // Headers authentifiés
  static getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
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
  // Redirection basée sur le rôle (utile pour les composants)
  static getRoleBasedRedirect() {
    const user = this.getCurrentUser();
    if (!user) return "/login/particular";
    switch (user.role) {
      case UserRole.ADMIN:
        return "/admin";
      case UserRole.PROFESSIONAL:
        return "/pro";
      case UserRole.USER:
        return "/mon-compte";
      default:
        return "/";
    }
  }
  // Mot de passe oublié
  static async forgotPassword(email) {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      // 🔥 AMÉLIORATION: Gestion spécifique des erreurs de rate limiting
      if (error.response?.status === 429) {
        const errorMessage =
          error.response?.data?.message ||
          "Trop de tentatives. Veuillez réessayer dans 1 heure.";

        // Créer une erreur spécifique pour le rate limiting
        const rateLimitError = new Error(errorMessage);
        rateLimitError.name = "RateLimitError";
        rateLimitError.status = 429;
        rateLimitError.retryAfter = 3600; // 1 heure en secondes

        throw rateLimitError;
      }

      // Pour les autres erreurs, utiliser le gestionnaire existant
      throw this.handleError(
        error,
        "Erreur lors de la demande de réinitialisation"
      );
    }
  }
  // Réinitialisation du mot de passe
  static async resetPassword(token, newPassword) {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        "Erreur lors de la réinitialisation du mot de passe"
      );
    }
  }
  // Vérification du token de réinitialisation
  static async verifyResetToken(token) {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response.data;
    } catch (error) {
      // Si le token est invalide, le backend renvoie 400
      if (error.response?.status === 400) {
        throw new Error("Token invalide ou expiré");
      }
      throw this.handleError(error, "Erreur lors de la vérification du token");
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
  // Gestion spécifique des erreurs d'authentification
  static handleAuthError(error) {
    if (error.response?.status === 401) {
      this.logout();
      return new Error("Session expirée");
    }
    if (error.response?.status === 403) {
      console.error("Accès non autorisé détecté", error);
      return new Error("Accès non autorisé");
    }
    return this.handleError(
      error,
      "Une erreur est survenue lors de l'authentification"
    );
  }
  // Dans AuthService, ajoutez cette fonction :
  static canAccess(pathname) {
    if (!this.isAuthenticated()) return false;
    const user = this.getCurrentUser();
    if (!user) return false;
    // Les admins ont accès à tout
    if (user.role === UserRole.ADMIN) return true;
    // Vérifications basées sur le chemin
    if (pathname.startsWith("/admin") && user.role !== UserRole.ADMIN) {
      return false;
    }
    if (
      pathname.startsWith("/pro") &&
      !["admin", "professional"].includes(user.role)
    ) {
      return false;
    }
    if (
      pathname.startsWith("/mon-compte") &&
      !["admin", "professional", "user"].includes(user.role)
    ) {
      return false;
    }
    return true;
  }
  // Mettre à jour les données utilisateur
  static updateUserData(updatedUser) {
    const currentToken = this.getToken();
    if (currentToken && updatedUser) {
      this.setAuthData(updatedUser, currentToken);
    }
  }
  // Dans AuthService, ajoutez ces méthodes :
  // Mettre à jour le profil utilisateur
  static async updateProfile(userData) {
    try {
      const response = await api.put("/users/update/profile", userData);
      const updatedUser = response.data;
      // Mettre à jour les données locales
      const currentToken = this.getToken();
      if (currentToken) {
        this.setAuthData(updatedUser, currentToken);
      }
      return updatedUser;
    } catch (error) {
      console.log(error);
      throw this.handleError(error, "Erreur lors de la mise à jour du profil");
    }
  }
  // Changer le mot de passe
  static async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put("/users/update/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw this.handleError(
        error,
        "Erreur lors du changement de mot de passe"
      );
    }
  }
  // Upload d'avatar
  static async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error, "Erreur lors de l'upload de l'avatar");
    }
  }
}
export default AuthService;
