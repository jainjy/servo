import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // 1. Fonction helper pour scroller un élément
      const scrollElementToTop = (element: HTMLElement | Window) => {
        try {
          if (element === window) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          } else if (element && 'scrollTo' in element) {
            (element as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' });
          }
        } catch (error) {
          // Fallback si smooth n'est pas supporté
          if (element === window) {
            window.scrollTo(0, 0);
          } else {
            (element as HTMLElement).scrollTop = 0;
          }
        }
      };

      // 2. Scroller la fenêtre principale
      scrollElementToTop(window);

      // 3. Scroller le conteneur AppPullToRefresh
      const appContainer = document.querySelector('.app-pull-to-refresh') as HTMLElement;
      if (appContainer && appContainer.scrollTop > 0) {
        scrollElementToTop(appContainer);
      }

      // 4. Scroller d'autres éléments potentiellement scrollables
      const scrollableSelectors = [
        '.app-pull-to-refresh',
        '[class*="scroll"]',
        'main',
        '[role="main"]',
        '[data-scrollable]',
        '.scrollable',
        '.scroll-container',
        '.scroll-area'
      ];

      scrollableSelectors.forEach(selector => {
        if (selector === '.app-pull-to-refresh') return; // Déjà géré
        
        const elements = document.querySelectorAll(selector);
        elements.forEach((element: Element) => {
          const el = element as HTMLElement;
          if (el.scrollTop > 0 && el !== appContainer) {
            scrollElementToTop(el);
          }
        });
      });
    };

    // Attendre que la page soit prête
    const timer = setTimeout(scrollToTop, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;