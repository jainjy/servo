// frontend/src/constants/socialTypes.js
// Types de logements sociaux
export const SOCIAL_TYPES = {
  PSLA: 'PSLA',
  SHLMR: 'SHLMR',
  SHUR: 'SHUR',
  SIDR: 'SIDR',
  SODIAC: 'SODIAC',
  SEDRE: 'SEDRE',
  SEMAC: 'SEMAC'
};

// Types qui sont stockés dans le champ "features" de la propriété
export const SOCIAL_TYPE_FEATURES = [
  SOCIAL_TYPES.SHUR,
  SOCIAL_TYPES.SIDR,
  SOCIAL_TYPES.SODIAC,
  SOCIAL_TYPES.SEDRE,
  SOCIAL_TYPES.SEMAC
];

// Types qui ont des champs dédiés dans la base de données
export const DEDICATED_SOCIAL_TYPES = [
  SOCIAL_TYPES.PSLA,
  SOCIAL_TYPES.SHLMR
];

// Libellés complets pour l'affichage
export const SOCIAL_TYPE_LABELS = {
  [SOCIAL_TYPES.PSLA]: 'PSLA (Prêt Social Location Accession)',
  [SOCIAL_TYPES.SHLMR]: 'SHLMR (Société Immobilière)',
  [SOCIAL_TYPES.SHUR]: 'SHUR (Société HLM de la Réunion)',
  [SOCIAL_TYPES.SIDR]: 'SIDR (Société Immobilière Départementale de la Réunion)',
  [SOCIAL_TYPES.SODIAC]: 'SODIAC (Société pour le Développement Immobilier)',
  [SOCIAL_TYPES.SEDRE]: 'SEDRE (Société pour l\'Équipement et le Développement)',
  [SOCIAL_TYPES.SEMAC]: 'SEMAC (Société d\'Économie Mixte d\'Aménagement et de Construction)'
};

// Couleurs pour les badges
export const SOCIAL_TYPE_COLORS = {
  [SOCIAL_TYPES.PSLA]: '#EA580C',    // Orange
  [SOCIAL_TYPES.SHLMR]: '#4F46E5',   // Indigo
  [SOCIAL_TYPES.SHUR]: '#10B981',    // Émeraude
  [SOCIAL_TYPES.SIDR]: '#3B82F6',    // Bleu
  [SOCIAL_TYPES.SODIAC]: '#8B5CF6',  // Violet
  [SOCIAL_TYPES.SEDRE]: '#EC4899',   // Rose
  [SOCIAL_TYPES.SEMAC]: '#F59E0B'    // Jaune
};

// Tous les types sociaux
export const ALL_SOCIAL_TYPES = Object.values(SOCIAL_TYPES);

// Fonction utilitaire pour obtenir la couleur d'un type social
export const getSocialTypeColor = (type) => {
  return SOCIAL_TYPE_COLORS[type] || '#6B7280';
};

// Fonction utilitaire pour obtenir le libellé d'un type social
export const getSocialTypeLabel = (type) => {
  return SOCIAL_TYPE_LABELS[type] || type;
};

// Fonction pour vérifier si un type est dans les features
export const isSocialTypeFeature = (type) => {
  return SOCIAL_TYPE_FEATURES.includes(type);
};

// Fonction pour vérifier si un type est dédié
export const isSocialTypeDedicated = (type) => {
  return DEDICATED_SOCIAL_TYPES.includes(type);
};

// /**
//  * IMPORTANT : Architecture du backend
//  * - PSLA et SHLMR : champs dédiés (isPSLA, isSHLMR)
//  * - SHUR, SIDR, SODIAC, SEDRE, SEMAC : stockés dans le tableau "features"
//  * - Le backend a une fonction determineSocialType() qui détecte automatiquement
//  */