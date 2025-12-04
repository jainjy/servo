// utils/networkErrorHandler.ts
export const handleNetworkError = (error: any): string => {
  if (!navigator.onLine) {
    return "Vous êtes actuellement hors ligne. Vérifiez votre connexion Internet.";
  }

  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error")
  ) {
    return "Problème de connexion réseau. Vérifiez votre Internet et réessayez.";
  }

  if (error?.response?.status === 0) {
    return "Impossible de contacter le serveur. Vérifiez votre connexion.";
  }

  return "Une erreur est survenue. Veuillez réessayer.";
};

// Utilisation dans vos composants
// import { handleNetworkError } from '@/utils/networkErrorHandler';
// toast.error(handleNetworkError(error));
