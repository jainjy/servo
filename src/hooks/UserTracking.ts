import { useCallback } from 'react';
import { trackUserActivity, trackUserEvent } from '@/lib/suggestionApi';

export const useTracking = () => {
  // Track les vues de pages
  const trackPageView = useCallback((pageName: string, category?: string, entityId?: string) => {
    trackUserActivity({
      entityType: "page",
      entityId: entityId || pageName,
      action: "view",
      metadata: {
        pageName,
        category,
        url: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Track les clics sur les liens de navigation
  const trackNavigation = useCallback((fromPage: string, toPage: string, linkText: string) => {
    trackUserActivity({
      entityType: "navigation",
      entityId: `nav_${fromPage}_to_${toPage}`,
      action: "click",
      metadata: {
        fromPage,
        toPage,
        linkText,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Track les recherches
  const trackSearch = useCallback((query: string, category?: string, resultsCount?: number) => {
    trackUserActivity({
      entityType: "search",
      entityId: `search_${category || 'global'}`,
      action: "search",
      searchQuery: query,
      metadata: {
        query,
        category,
        resultsCount,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Track les filtres
  const trackFilter = useCallback((filters: Record<string, any>, category: string) => {
    trackUserEvent({
      eventType: "filter",
      eventData: {
        category,
        filters,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Track les interactions produits
  const trackProductInteraction = useCallback((
    productId: string, 
    action: "view" | "click" | "add_to_cart" | "purchase", 
    productName: string,
    category?: string
  ) => {
    trackUserActivity({
      entityType: "product",
      entityId: productId,
      action,
      metadata: {
        productName,
        category,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  // Track les interactions services
  const trackServiceInteraction = useCallback((
    serviceId: string,
    action: "view" | "click" | "book",
    serviceName: string,
    category?: string
  ) => {
    trackUserActivity({
      entityType: "service",
      entityId: serviceId,
      action,
      metadata: {
        serviceName,
        category,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    });
  }, []);

  return {
    trackPageView,
    trackNavigation,
    trackSearch,
    trackFilter,
    trackProductInteraction,
    trackServiceInteraction
  };
};