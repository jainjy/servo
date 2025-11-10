// hooks/useInteractionTracking.ts
import { useCallback } from 'react';
import { trackUserActivity } from '@/lib/suggestionApi';
import { useAuth } from '@/hooks/useAuth';

export const useInteractionTracking = () => {
  const { user, isAuthenticated } = useAuth();

  const trackInteraction = useCallback(async (
    entityType: string,
    entityId: string,
    action: string,
    metadata: any = {}
  ) => {
    if (!isAuthenticated) return;

    try {
      await trackUserActivity({
        entityType,
        entityId,
        action,
        metadata: {
          userId: user?.id,
          timestamp: new Date().toISOString(),
          ...metadata
        }
      });
    } catch (error) {
      console.error('Erreur tracking interaction:', error);
    }
  }, [isAuthenticated, user]);

  // Méthodes spécifiques pour chaque section
  const trackConstructionInteraction = useCallback((serviceId: string, serviceName: string, action: string = 'view', extraData: any = {}) => {
    return trackInteraction('service', serviceId, action, {
      serviceName,
      category: 'construction',
      ...extraData
    });
  }, [trackInteraction]);

  const trackBusinessInteraction = useCallback((serviceId: string, serviceName: string, action: string = 'view', extraData: any = {}) => {
    return trackInteraction('business_service', serviceId, action, {
      serviceName,
      category: 'business',
      ...extraData
    });
  }, [trackInteraction]);

  const trackTourismInteraction = useCallback((listingId: string, listingName: string, action: string = 'view', extraData: any = {}) => {
    return trackInteraction('hebergement', listingId, action, {
      listingName,
      category: 'tourism',
      ...extraData
    });
  }, [trackInteraction]);

  const trackFinanceInteraction = useCallback((productId: string, productName: string, action: string = 'view', extraData: any = {}) => {
    return trackInteraction('finance_product', productId, action, {
      productName,
      category: 'finance',
      ...extraData
    });
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackConstructionInteraction,
    trackBusinessInteraction,
    trackTourismInteraction,
    trackFinanceInteraction
  };
};