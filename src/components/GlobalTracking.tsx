// src/components/GlobalTracking.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTracking } from '@/hooks/UserTracking';

declare global {
  interface Window {
    previousPath?: string;
  }
}

const GlobalTracking = () => {
  const location = useLocation();
  const { trackPageView, trackNavigation } = useTracking();

  useEffect(() => {
    // Track les changements de page
    const pageName = getPageNameFromPath(location.pathname);
    const category = getCategoryFromPath(location.pathname);
    
    trackPageView(pageName, category);
    
    // Track la navigation entre les pages
    if (window.previousPath && window.previousPath !== location.pathname) {
      trackNavigation(window.previousPath, location.pathname, 'route_change');
    }
    
    window.previousPath = location.pathname;
  }, [location.pathname, trackPageView, trackNavigation]);

  const getPageNameFromPath = (path: string): string => {
    const pageMap: Record<string, string> = {
      '/': 'accueil',
      '/bien-etre': 'bien-etre',
      '/immobilier': 'immobilier',
      '/tourisme': 'tourisme',
      '/travaux': 'travaux',
      '/produits': 'produits',
      '/entreprise': 'entreprise',
      '/financement': 'financement',
      '/login': 'connexion',
      '/register': 'inscription',
    };
    
    return pageMap[path] || path.replace('/', '') || 'accueil';
  };

  const getCategoryFromPath = (path: string): string => {
    const categoryMap: Record<string, string> = {
      '/': 'general',
      '/bien-etre': 'wellness',
      '/immobilier': 'real_estate',
      '/tourisme': 'tourism',
      '/travaux': 'construction',
      '/produits': 'products',
      '/entreprise': 'business',
      '/financement': 'finance',
      '/login': 'auth',
      '/register': 'auth',
    };
    
    return categoryMap[path] || 'general';
  };

  return null;
};

export default GlobalTracking;