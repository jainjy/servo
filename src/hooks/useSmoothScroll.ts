
import { useCallback } from "react";

export const useSmoothScroll = () => {
  const scrollToSection = useCallback((sectionId: string) => {
    // ✅ Vérification que nous sommes côté client
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  return { scrollToSection };
};