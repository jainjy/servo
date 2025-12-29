/**
 * Utilitaire de validation des mots de passe
 * Utilisé par le frontend pour valider les mots de passe côté client
 * 
 * IMPORTANT: Cette validation est pour l'UX uniquement.
 * La validation RÉELLE se fait toujours côté backend.
 */

// Constantes de configuration de sécurité
export const PASSWORD_CONFIG = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
};

// Erreurs de validation
export const PASSWORD_ERRORS = {
  EMPTY: "Le mot de passe ne peut pas être vide",
  TOO_SHORT: `Le mot de passe doit contenir au moins ${PASSWORD_CONFIG.MIN_LENGTH} caractères`,
  WHITESPACE_ONLY: "Le mot de passe ne peut pas contenir uniquement des espaces",
  TOO_LONG: `Le mot de passe ne peut pas dépasser ${PASSWORD_CONFIG.MAX_LENGTH} caractères`,
};

/**
 * Valide un mot de passe selon les critères minimums
 * @param password - Le mot de passe à valider
 * @returns Objet avec valid (booléen) et error (message d'erreur ou null)
 */
export const validatePassword = (
  password: string | null | undefined
): { valid: boolean; error: string | null } => {
  // Vérifier null/undefined
  if (password === null || password === undefined) {
    return {
      valid: false,
      error: PASSWORD_ERRORS.EMPTY,
    };
  }

  // Vérifier si c'est une chaîne
  if (typeof password !== "string") {
    return {
      valid: false,
      error: PASSWORD_ERRORS.EMPTY,
    };
  }

  // Vérifier les espaces uniquement
  if (password.trim().length === 0) {
    return {
      valid: false,
      error: PASSWORD_ERRORS.EMPTY,
    };
  }

  // Vérifier la longueur minimale
  if (password.length < PASSWORD_CONFIG.MIN_LENGTH) {
    return {
      valid: false,
      error: PASSWORD_ERRORS.TOO_SHORT,
    };
  }

  // Vérifier la longueur maximale
  if (password.length > PASSWORD_CONFIG.MAX_LENGTH) {
    return {
      valid: false,
      error: PASSWORD_ERRORS.TOO_LONG,
    };
  }

  return {
    valid: true,
    error: null,
  };
};

/**
 * Valide un mot de passe avec critères renforcés
 * (Optionnel - pour une sécurité accrue)
 * 
 * Critères:
 * - Entre 8 et 12 caractères
 * - Au moins 1 majuscule
 * - Au moins 1 minuscule
 * - Au moins 1 chiffre
 * - Au moins 1 caractère spécial
 * 
 * @param password - Le mot de passe à valider
 * @returns Objet avec validation breakdown et strength
 */
export const validatePasswordStrong = (
  password: string
): {
  minLength: boolean;
  maxLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  valid: boolean;
  errors: string[];
  strength: number;
} => {
  const minLength = password.length >= PASSWORD_CONFIG.MIN_LENGTH;
  const maxLength = password.length <= 12; // Limite stricte pour l'affichage
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const errors: string[] = [];

  if (!minLength) {
    errors.push("Au moins 8 caractères");
  }
  if (!maxLength) {
    errors.push("Maximum 12 caractères");
  }
  if (!hasUpperCase) {
    errors.push("Au moins une majuscule (A-Z)");
  }
  if (!hasLowerCase) {
    errors.push("Au moins une minuscule (a-z)");
  }
  if (!hasNumber) {
    errors.push("Au moins un chiffre (0-9)");
  }
  if (!hasSpecialChar) {
    errors.push(
      'Au moins un caractère spécial (!@#$%^&*()_+-=[]{};\':"|,.<>/?)'
    );
  }

  // Calculer la force du mot de passe (0-6)
  const strengthScore = [minLength, maxLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;

  return {
    minLength,
    maxLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
    valid: errors.length === 0,
    errors,
    strength: strengthScore,
  };
};

/**
 * Obtient la description de la force d'un mot de passe
 * @param strength - Score de force (0-5)
 * @returns Description textuelle
 */
export const getPasswordStrengthLabel = (
  strength: number
): {
  label: string;
  color: string;
} => {
  switch (strength) {
    case 0:
      return { label: "Très faible", color: "text-red-600" };
    case 1:
      return { label: "Faible", color: "text-orange-600" };
    case 2:
      return { label: "Moyen", color: "text-yellow-600" };
    case 3:
      return { label: "Bon", color: "text-lime-600" };
    case 4:
      return { label: "Très bon", color: "text-green-600" };
    case 5:
      return { label: "Excellent", color: "text-emerald-600" };
    default:
      return { label: "Inconnu", color: "text-gray-600" };
  }
};

/**
 * Vérifie si deux mots de passe correspondent
 * @param password - Premier mot de passe
 * @param confirmPassword - Confirmation du mot de passe
 * @returns true si identiques, false sinon
 */
export const passwordsMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};
