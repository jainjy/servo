export interface Colors {
  logo: string;
  primaryDark: string;
  lightBg: string;
  separator: string;
  secondaryText: string;
  primaryLight: string;
  secondaryLight: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  accentGold: string;
}

export const colors: Colors = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  primaryDark: "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  lightBg: "#FFFFF0" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  secondaryText: "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
  primaryLight: "#8FBC8F", // Version plus claire du primary
  secondaryLight: "#A0522D", // Version plus claire du secondary
  cardBg: "#FFFFFF", // Blanc pur pour les cartes
  textPrimary: "#2C3E50", // Texte principal foncé
  textSecondary: "#5D6D7E", // Texte secondaire
  success: "#27AE60", // Vert pour succès
  warning: "#F39C12", // Orange pour avertissements
  error: "#E74C3C", // Rouge pour erreurs
  accentGold: "#D4AF37", // Or pour éléments premium
};