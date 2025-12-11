import React, { useEffect, useState, Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Load from "../components/Load";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AdvertisementPopup from "@/components/AdvertisementPopup";
import CardCarte from "@/components/components/CardCarte";
import AnnoncesImmobilieres from "@/components/components/CardsOlimmo";

const Hero = lazy(() => import("@/components/Hero"));
const ServiceCards = lazy(() => import("@/components/ServiceCards"));
const TravauxPreview = lazy(() => import("@/components/TravauxPreview"));
const PropertyListings = lazy(() => import("@/components/PropertyListings"));
const Slider = lazy(() => import("@/components/Slider"));
const RecommendationsSection = lazy(
  () => import("@/components/RecommendationsSection")
);

// Thème de couleurs
const colors = {
  logo: "#556B2F" /* logo / accent - Olive green */,
  "primary-dark": "#6B8E23" /* Sruvol / fonds légers - Yellow-green */,
  "light-bg": "#FFFFFF" /* fond de page / bloc texte - White */,
  separator: "#D3D3D3" /* séparateurs / bordures, UI - Light gray */,
  "secondary-text":
    "#8B4513" /* touche premium / titres secondaires - Saddle brown */,
  // Couleurs complémentaires ajoutées
  "accent-light": "#98FB98" /* accent clair - Pale green */,
  "accent-warm": "#DEB887" /* accent chaud - Burlywood */,
  "neutral-dark": "#2F4F4F" /* texte foncé / titres - Dark slate gray */,
  "hover-primary": "#7BA05B" /* état hover primary - Medium olive green */,
  "hover-secondary": "#A0522D" /* état hover secondary - Sienna */,
};

const LoadingFallback = () => (
  <div
    className="min-h-screen bg-background flex items-center justify-center"
    style={{ backgroundColor: colors["light-bg"] }}
  >
    <div className="text-center">
      <img src="/loading.gif" alt="" className="w-24 h-24" />
      <p className="text-gray-600" style={{ color: colors["neutral-dark"] }}>
        Chargement...
      </p>
    </div>
  </div>
);

const Index = () => {
  const [isClient, setIsClient] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true);

    // Vérifier si l'utilisateur est connecté pour afficher les recommandations
    const token = localStorage.getItem("auth-token");
    const isValidToken =
      token && token !== "null" && token !== "undefined" && token.trim() !== "";

    if (isValidToken) {
      setShowRecommendations(true);
      // Vous pouvez ajouter ici une vérification pour savoir si des recommandations existent
      // Par exemple, en faisant un appel API ou en vérifiant dans le localStorage
    } else {
      setShowRecommendations(false);
    }
  }, []);

  // Fonction pour gérer l'état des recommandations (à passer au composant RecommendationsSection)
  const handleRecommendationsData = (data) => {
    setHasRecommendations(data && data.length > 0);
  };

  if (!isClient) {
    return (
      <div
        className="min-h-screen bg-background"
        style={{ backgroundColor: colors["light-bg"] }}
      >
        <LoadingFallback />
      </div>
    );
  }

  return (
    <>
      <Load />
      <div
        className="min-h-screen bg-background [scrollbar-width:none]"
        style={{ backgroundColor: colors["light-bg"] }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
          <ServiceCards />
          <AdvertisementPopup />
          <TravauxPreview homeCards />

          {/* Section de recommandations intelligentes - affichée seulement si token valide ET données disponibles */}
          {showRecommendations && (
            <RecommendationsSection
              title="Nos meilleures suggestions pour vous"
              limit={4}
              showOnlyIfAuthenticated={true}
              onDataLoaded={handleRecommendationsData}
              // Si votre composant RecommendationsSection a une prop pour gérer les données vides
              hideIfEmpty={true}
            />
          )}

          {/* <EmplacementPub /> */}

          {/* Section biens immobiliers */}
          <CardCarte />
          <>
            <div className="text-center mx-10 mt-6 grid lg:flex items-center justify-between">
              <h2
                className="text-xl lg:text-3xl font-bold ml-8 my-6"
                style={{ color: colors["neutral-dark"] }}
              >
                Nos biens immobiliers
              </h2>
              {/* Voir plus button */}

              <Button
                className="relative px-8 mx-auto py-3 mr-0 lg:mr-10 flex items-center gap-3 overflow-hidden rounded-md group transition-all duration-500 hover:scale-105"
                onClick={() => navigate("/immobilier")}
                style={{ backgroundColor: colors["primary-dark"] }}
              >
                {/* Cercle animé à droite */}
                <span
                  className="absolute inset-0 -right-3 top-12 w-36 h-32 group-hover:-top-12 transition-all duration-700 ease-out origin-bottom rounded-full transform group-hover:scale-105"
                  style={{ backgroundColor: colors["accent-light"] }}
                ></span>

                {/* Contenu */}
                <span
                  className="relative z-10 font-semibold group-hover:text-slate-900 transition-all duration-400 ease-out"
                  style={{ color: "white" }}
                >
                  Voir plus de nos b<span style={{ color: "white" }}>iens</span>
                </span>
                <ArrowRight
                  className="w-4 h-4 relative z-10 group-hover:text-slate-900 transition-all duration-400 ease-out group-hover:translate-x-1"
                  style={{ color: "white" }}
                />
              </Button>
            </div>
            <PropertyListings cardsOnly maxItems={4} />
            <Slider />
            <AnnoncesImmobilieres />
          </>
        </Suspense>
      </div>
    </>
  );
};

export default Index;
