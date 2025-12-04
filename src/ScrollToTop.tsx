import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Solution multi-navigateur pour le scroll to top
    setTimeout(() => {
      // Essayer window.scrollTo d'abord (desktop/modern browsers)
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      
      // Fallback pour iOS Safari et certains navigateurs mobiles
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Forcer le reflow sur mobile
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
