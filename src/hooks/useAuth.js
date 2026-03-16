import { useState, useEffect } from "react";
import AuthService from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(AuthService.getCurrentUser());
  const [personel, setPersonel] = useState(AuthService.getCurrentPersonel()); // Nouveau
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [isPersonel, setIsPersonel] = useState(AuthService.isPersonelAuth()); // Nouveau
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    setUser(AuthService.getCurrentUser());
    setPersonel(AuthService.getCurrentPersonel());
    setIsAuthenticated(AuthService.isAuthenticated());
    setIsPersonel(AuthService.isPersonelAuth());
    setLoading(false);

    // Écouter les changements d'authentification
    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
      setPersonel(AuthService.getCurrentPersonel());
      setIsAuthenticated(AuthService.isAuthenticated());
      setIsPersonel(AuthService.isPersonelAuth());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  return {
    user,
    personel, // Nouveau
    isAuthenticated,
    isPersonel, // Nouveau
    loading,
    login: AuthService.login.bind(AuthService),
    loginPersonel: AuthService.loginPersonel.bind(AuthService), // Nouveau
    logout: AuthService.logout.bind(AuthService),
    register: AuthService.register.bind(AuthService),
    signupPro: AuthService.signupPro.bind(AuthService),
    confirmPayment: AuthService.confirmPayment.bind(AuthService),
    hasRole: AuthService.hasRole.bind(AuthService),
    refreshToken: AuthService.refreshToken.bind(AuthService),
    forgotPassword: AuthService.forgotPassword.bind(AuthService),
    resetPassword: AuthService.resetPassword.bind(AuthService),
    verifyResetToken: AuthService.verifyResetToken.bind(AuthService),
    getAuthHeaders: AuthService.getAuthHeaders.bind(AuthService),
    getRoleBasedRedirect: AuthService.getRoleBasedRedirect.bind(AuthService), // Nouveau
  };
};