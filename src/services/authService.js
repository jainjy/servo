import api from "@/lib/api";

// Rôles d'utilisateur
export const UserRole = {
  USER: "user",
  ADMIN: "admin",
  PROFESSIONAL: "professional",
};

// Validation des mots de passe - Constantes de sécurité
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_VALIDATION_ERRORS = {
  EMPTY: "Le mot de passe ne peut pas être vide",
  TOO_SHORT: `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`,
  WHITESPACE_ONLY: "Le mot de passe ne peut pas contenir uniquement des espaces",
};

// Fonction de validation des mots de passe
const validatePassword = (password) => {
  // Vérifier null/undefined
  if (password === null || password === undefined) {
    return {
      valid: false,
      error: PASSWORD_VALIDATION_ERRORS.EMPTY,
    };
  }

  // Vérifier les espaces uniquement
  if (typeof password === "string" && password.trim().length === 0) {
    return {
      valid: false,
      error: PASSWORD_VALIDATION_ERRORS.EMPTY,
    };
  }

  // Vérifier la longueur minimale
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: PASSWORD_VALIDATION_ERRORS.TOO_SHORT,
    };
  }

  return {
    valid: true,
    error: null,
  };
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
      const { user, token, refreshToken } = response.data;
      // On stocke les deux tokens
      this.setAuthData(user, token, refreshToken);
      return { user, token };
    } catch (error) {
      // Juste extraire le message d'erreur
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Erreur lors de la connexion");
      }
    }
  }
  // register
  static async register(userData) {
    try {
      // Valider le mot de passe avant d'envoyer
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }

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
      const { user, token, refreshToken } = response.data;
      this.setAuthData(user, token, refreshToken);

      return { user, token, route: AuthService.getRoleBasedRedirect() };
    } catch (error) {
      throw this.handleError(error, "Erreur lors de l'inscription");
    }
  }
  // Inscription Pro sans paiement (avec plan sélectionné gratuit 2 mois)
  static async signupPro(userData, planId, visibilityOption) {
    try {
      // Valider le mot de passe avant d'envoyer
      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }

      const response = await api.post("/auth/signup-pro", {
        utilisateur: {
          ...userData,
          metiers: userData.metiers || [], // AJOUT: Inclure les métiers
        },
        planId,
        visibilityOption
      });
      const { user, token, refreshToken } = response.data;
      if (user && token) {
        this.setAuthData(user, token, refreshToken);
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
      const { user, token, refreshToken } = response.data;
      if (user && token) {
        this.setAuthData(user, token, refreshToken);
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
  static setAuthData(user, token, refreshToken) {
    SecureStorage.setItem("auth-token", token);
    if (refreshToken) {
      SecureStorage.setItem("refresh-token", refreshToken);
    }
    SecureStorage.setItem("user-data", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-change"));
  }
  // Déconnexion
  static logout() {
    const refreshToken = SecureStorage.getItem("refresh-token");
    // Optionnel : Appeler l'API logout pour révoquer le token en base
    if (refreshToken)
      api.post("/auth/logout", { refreshToken }).catch(() => {});

    SecureStorage.removeItem("auth-token");
    SecureStorage.removeItem("refresh-token");
    SecureStorage.removeItem("user-data");
    window.dispatchEvent(new Event("auth-change"));

    // Rediriger vers le login
    window.location.href = "/login/particular";
  }

  // Rafraîchir le token
  static async refreshToken() {
    try {
      const refreshToken = SecureStorage.getItem("refresh-token");
      if (!refreshToken) throw new Error("No refresh token");

      // Envoi du refresh token dans le body comme attendu par le backend corrigé
      const response = await api.post("/auth/refresh", { refreshToken });
      const { token } = response.data;

      // On ne met à jour que l'access token
      SecureStorage.setItem("auth-token", token);
      return token;
    } catch (error) {
      this.logout();
      throw error;
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
  static getRefreshToken() {
    return SecureStorage.getItem("refresh-token");
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
      // Valider le nouveau mot de passe avant d'envoyer
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }

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
    const currentRefreshToken = this.getRefreshToken();
    if (currentToken && updatedUser) {
      this.setAuthData(updatedUser, currentToken, currentRefreshToken);
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
      const currentRefreshToken = this.getRefreshToken();
      if (currentToken) {
        this.setAuthData(updatedUser, currentToken, currentRefreshToken);
      }
      return updatedUser;
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la mise à jour du profil");
    }
  }
  // Changer le mot de passe
  static async changePassword(currentPassword, newPassword) {
    try {
      // Valider le nouveau mot de passe avant d'envoyer
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.error);
      }

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
