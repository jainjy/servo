import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" }); // Défilement doux vers le haut
  }, [pathname]); // On déclenche l'effet à chaque changement de route

  return null; // Ce composant ne rend rien
};

export default ScrollToTop;
