import React, { useEffect, useState, Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Load from "../components/Load";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, RefreshCw } from "lucide-react";
import AdvertisementPopup from "@/components/AdvertisementPopup";
import CardCarte from "@/components/components/CardCarte";
import AnnoncesImmobilieres from "@/components/components/CardsOlimmo";
import { motion } from "framer-motion";

const Hero = lazy(() => import("@/components/Hero"));
const ServiceCards = lazy(() => import("@/components/ServiceCards"));
const TravauxPreview = lazy(() => import("@/components/TravauxPreview"));
const PropertyListings = lazy(() => import("@/components/PropertyListings"));
const Slider = lazy(() => import("@/components/Slider"));
const RecommendationsSection = lazy(
  () => import("@/components/RecommendationsSection")
);
const ArtETCreationShowcase = lazy(
  () => import("@/components/ArtETCreationShowcase")
);
const BienEtreShowcase = lazy(
  () => import("@/components/BienEtreShowcase")
);

// Thème de couleurs
const colors = {
  logo: "#556B2F",
  "primary-dark": "#6B8E23",
  "light-bg": "#FFFFFF",
  separator: "#D3D3D3",
  "secondary-text": "#8B4513",
  "accent-light": "#98FB98",
  "accent-warm": "#DEB887",
  "neutral-dark": "#2F4F4F",
  "hover-primary": "#7BA05B",
  "hover-secondary": "#A0522D",
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

    const token = localStorage.getItem("auth-token");
    const isValidToken =
      token && token !== "null" && token !== "undefined" && token.trim() !== "";

    if (isValidToken) {
      setShowRecommendations(true);
    } else {
      setShowRecommendations(false);
    }
  }, []);

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
      <div
        className="min-h-screen bg-background"
        style={{ backgroundColor: colors["light-bg"] }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Popup publicitaire fixe */}
          <div className="fixed w-1/2 bottom-0 right-4 z-50">
            <AdvertisementPopup
              size="small"
              position="pop-up"
              showOnMobile={true}
            />
          </div>

          {/* Hero Section - Pleine largeur */}
          <Hero />
          
          {/* Section Slider */}
          <section className="w-full mt-5">
            <Slider />
          </section>

          {/* Section Services */}
          {/* <section className="w-full"> */}
            {/* <ServiceCards /> */}
          {/* </section> */}

          {/* Section Travaux Preview */}
          <section className="w-full">
            <TravauxPreview homeCards />
          </section>

          {/* Section Recommandations (conditionnelle) */}
          {/* {showRecommendations && (
            <section className="w-full">
              <RecommendationsSection
                title="Nos meilleures suggestions pour vous"
                limit={4}
                showOnlyIfAuthenticated={true}
                onDataLoaded={handleRecommendationsData}
                hideIfEmpty={true}
              />
            </section>
          )} */}

          {/* Section Art & Création */}
          <section className="w-full">
            <ArtETCreationShowcase />
          </section>

          {/* Section Immobilier avec en-tête */}
          <section className="w-full">
            <PropertyListings cardsOnly maxItems={4} />
          </section>

          {/* Section Bien-Être */}
          <section className="w-full">
            <BienEtreShowcase />
          </section>

          {/* Section Annonces Immobilières */}
          <section className="w-full">
            <AnnoncesImmobilieres />
          </section>

          {/* Section Carte */}
          <section className="w-full">
            <CardCarte />
          </section>

        </Suspense>
      </div>
    </>
  );
};

export default Index;