import { trackUserActivity } from '@/lib/suggestionApi';
import { useTracking } from './UserTracking';

export const useBienEtreTracking = () => {
  const { trackPageView, trackNavigation, trackSearch } = useTracking();

  const trackBienEtreView = () => {
    trackPageView("bien-etre", "wellness");
  };

  const trackBienEtreServiceClick = (serviceId: string, serviceName: string, category: string) => {
    trackUserActivity({
      entityType: "service",
      entityId: serviceId,
      action: "click",
      metadata: {
        serviceName,
        category,
        page: "bien-etre"
      }
    });
  };

  const trackBienEtreServiceBook = (serviceId: string, serviceName: string, category: string) => {
    trackUserActivity({
      entityType: "service",
      entityId: serviceId,
      action: "book",
      metadata: {
        serviceName,
        category,
        page: "bien-etre"
      }
    });
  };

  const trackBienEtreSearch = (query: string, resultsCount?: number) => {
    trackSearch(query, "wellness", resultsCount);
  };

  const trackBienEtreTabChange = (tabName: string) => {
    trackUserActivity({
      entityType: "tab",
      entityId: `bienetre_${tabName}`,
      action: "click",
      metadata: {
        tabName,
        page: "bien-etre"
      }
    });
  };

  return {
    trackBienEtreView,
    trackBienEtreServiceClick,
    trackBienEtreServiceBook,
    trackBienEtreSearch,
    trackBienEtreTabChange
  };
};