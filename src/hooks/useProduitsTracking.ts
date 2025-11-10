import { useTracking } from './UserTracking';

export const useProduitsTracking = () => {
  const { trackPageView, trackProductInteraction, trackSearch, trackFilter } = useTracking();

  const trackProduitsView = () => {
    trackPageView("produits", "products");
  };

  const trackProductView = (productId: string, productName: string, category: string) => {
    trackProductInteraction(productId, "view", productName, category);
  };

  const trackProductClick = (productId: string, productName: string, category: string) => {
    trackProductInteraction(productId, "click", productName, category);
  };

  const trackAddToCart = (productId: string, productName: string, category: string) => {
    trackProductInteraction(productId, "add_to_cart", productName, category);
  };

  const trackProductSearch = (query: string, resultsCount?: number) => {
    trackSearch(query, "products", resultsCount);
  };

  const trackProductFilter = (filters: {
    category?: string;
    priceMin?: number;
    priceMax?: number;
    brand?: string;
  }) => {
    trackFilter(filters, "products");
  };

  const trackCategoryClick = (categoryName: string, section: string) => {
    trackProductInteraction(`category_${categoryName}`, "click", categoryName, section);
  };

  return {
    trackProduitsView,
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackProductSearch,
    trackProductFilter,
    trackCategoryClick
  };
};