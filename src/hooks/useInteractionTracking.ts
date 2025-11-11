import { useCallback } from 'react';
import { trackUserActivity, flushActivityQueue } from '@/lib/suggestionApi';
import { useAuth } from '@/hooks/useAuth';

export const useInteractionTracking = () => {
  const { user, isAuthenticated } = useAuth();

  const trackInteraction = useCallback(async (
    entityType: string,
    entityId: string,
    action: "view" | "click" | "purchase" | "long_view" | "add_to_cart" | "search" | "favorite",
    metadata: any = {},
    duration?: number
  ) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      await trackUserActivity({
        entityType,
        entityId,
        action,
        duration,
        metadata: {
          userId: user.id,
          userRole: user.role,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          language: navigator.language,
          ...metadata
        }
      });
    } catch (error) {
      console.error('Erreur tracking interaction:', error);
      // Les activités sont automatiquement sauvegardées en local storage pour retry plus tard
    }
  }, [isAuthenticated, user]);

  // Méthodes spécifiques pour chaque section avec typage amélioré

  // Construction
  const trackConstructionInteraction = useCallback((
    serviceId: string, 
    serviceName: string, 
    action: "view" | "click" | "long_view" | "search" = 'view', 
    extraData: any = {},
    duration?: number
  ) => {
    return trackInteraction('service', serviceId, action, {
      serviceName,
      category: 'construction',
      section: 'construction',
      ...extraData
    }, duration);
  }, [trackInteraction]);

  // Services aux entreprises
  const trackBusinessInteraction = useCallback((
    serviceId: string, 
    serviceName: string, 
    action: "view" | "click" | "long_view" | "search" = 'view', 
    extraData: any = {}
  ) => {
    return trackInteraction('business_service', serviceId, action, {
      serviceName,
      category: 'business',
      section: 'business_services',
      ...extraData
    });
  }, [trackInteraction]);

  // Tourisme
  const trackTourismInteraction = useCallback((
    listingId: string, 
    listingName: string, 
    action: "view" | "click" | "long_view" | "search" | "favorite" = 'view', 
    extraData: any = {},
    duration?: number
  ) => {
    return trackInteraction('hebergement', listingId, action, {
      listingName,
      category: 'tourism',
      section: 'tourism',
      ...extraData
    }, duration);
  }, [trackInteraction]);

  // Finance
  const trackFinanceInteraction = useCallback((
    productId: string, 
    productName: string, 
    action: "view" | "click" | "long_view" | "search" = 'view', 
    extraData: any = {}
  ) => {
    return trackInteraction('finance_product', productId, action, {
      productName,
      category: 'finance',
      section: 'finance',
      ...extraData
    });
  }, [trackInteraction]);

  // Immobilier
  const trackRealEstateInteraction = useCallback((
    propertyId: string,
    propertyTitle: string,
    action: "view" | "click" | "long_view" | "search" | "favorite" = 'view',
    extraData: any = {},
    duration?: number
  ) => {
    return trackInteraction('property', propertyId, action, {
      propertyTitle,
      category: 'real_estate',
      section: 'real_estate',
      ...extraData
    }, duration);
  }, [trackInteraction]);

  // Métiers/Artisans
  const trackTradeInteraction = useCallback((
    tradeId: string,
    tradeName: string,
    action: "view" | "click" | "long_view" | "search" = 'view',
    extraData: any = {}
  ) => {
    return trackInteraction('metier', tradeId, action, {
      tradeName,
      category: 'trades',
      section: 'trades',
      ...extraData
    });
  }, [trackInteraction]);

  // Produits e-commerce
  const trackProductInteraction = useCallback((
    productId: string,
    productName: string,
    action: "view" | "click" | "long_view" | "add_to_cart" | "purchase" | "favorite" = 'view',
    extraData: any = {},
    duration?: number
  ) => {
    return trackInteraction('product', productId, action, {
      productName,
      category: 'ecommerce',
      section: 'products',
      ...extraData
    }, duration);
  }, [trackInteraction]);

  // Recherche
  const trackSearchInteraction = useCallback((
    searchQuery: string,
    resultsCount: number,
    category?: string,
    extraData: any = {}
  ) => {
    return trackInteraction('search', 'global', 'search', {
      searchQuery,
      resultsCount,
      category,
      section: 'search',
      ...extraData
    });
  }, [trackInteraction]);

  // Navigation
  const trackNavigationInteraction = useCallback((
    page: string,
    section: string,
    action: "view" | "click" = 'view',
    extraData: any = {}
  ) => {
    return trackInteraction('navigation', page, action, {
      page,
      section,
      category: 'navigation',
      ...extraData
    });
  }, [trackInteraction]);

  // Flush manuel de la queue (pour les composants critiques)
  const flushInteractions = useCallback(() => {
    flushActivityQueue();
  }, []);

  return {
    // Méthode générique
    trackInteraction,
    
    // Méthodes spécifiques par section
    trackConstructionInteraction,
    trackBusinessInteraction,
    trackTourismInteraction,
    trackFinanceInteraction,
    trackRealEstateInteraction,
    trackTradeInteraction,
    trackProductInteraction,
    trackSearchInteraction,
    trackNavigationInteraction,
    
    // Utilitaires
    flushInteractions,
    
    // Informations
    isTrackingEnabled: isAuthenticated
  };
};