import { trackUserActivity } from '@/lib/suggestionApi';
import { useTracking } from './UserTracking';

export const useImmobilierTracking = () => {
  const { trackPageView, trackNavigation, trackSearch, trackFilter } = useTracking();

  const trackImmobilierView = () => {
    trackPageView("immobilier", "real_estate");
  };

  const trackPropertyView = (propertyId: string, propertyType: string, price: number) => {
    trackUserActivity({
      entityType: "property",
      entityId: propertyId,
      action: "view",
      metadata: {
        propertyType,
        price,
        category: "real_estate",
        page: "immobilier"
      }
    });
  };

  const trackPropertyClick = (propertyId: string, propertyName: string, price: number) => {
    trackUserActivity({
      entityType: "property",
      entityId: propertyId,
      action: "click",
      metadata: {
        propertyName,
        price,
        category: "real_estate",
        page: "immobilier"
      }
    });
  };

  const trackPropertyFilter = (filters: {
    type?: string;
    priceMin?: number;
    priceMax?: number;
    location?: string;
    rooms?: number;
  }) => {
    trackFilter(filters, "real_estate");
  };

  const trackPropertyContact = (propertyId: string, propertyName: string) => {
    trackUserActivity({
      entityType: "property",
      entityId: propertyId,
      action: "contact",
      metadata: {
        propertyName,
        action: "contact_agent",
        page: "immobilier"
      }
    });
  };

  const trackPropertySearch = (query: string, resultsCount?: number) => {
    trackSearch(query, "real_estate", resultsCount);
  };

  return {
    trackImmobilierView,
    trackPropertyView,
    trackPropertyClick,
    trackPropertyFilter,
    trackPropertyContact,
    trackPropertySearch
  };
};