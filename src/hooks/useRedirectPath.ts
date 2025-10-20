import { useLocation } from 'react-router-dom';

export const useRedirectPath = () => {
  const location = useLocation();
  
  // Récupérer le chemin de redirection depuis les query params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect');
  
  // Valider et nettoyer le chemin de redirection
  const isValidRedirectPath = (path: string | null): boolean => {
    if (!path) return false;
    // Empêcher les redirections vers des sites externes
    if (path.startsWith('http')) return false;
    // Empêcher les redirections vers login/register
    if (path.startsWith('/login') || path.startsWith('/register')) return false;
    return true;
  };

  return isValidRedirectPath(redirectPath) ? redirectPath : null;
};