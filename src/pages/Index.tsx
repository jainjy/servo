import React, { useEffect, useState, Suspense, lazy } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Load from "../components/Load";
import EmplacementPub from '@/components/EmplacementPub';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = lazy(() => import("@/components/Hero"));
const ServiceCards = lazy(() => import("@/components/ServiceCards"));
const TravauxPreview = lazy(() => import("@/components/TravauxPreview"));
const PropertyListings = lazy(() => import("@/components/PropertyListings"));
const Slider = lazy(() => import("@/components/Slider"));
const RecommendationsSection = lazy(() => import("@/components/RecommendationsSection"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement...</p>
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
    const isValidToken = token && token !== "null" && token !== "undefined" && token.trim() !== "";

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
      <div className="min-h-screen bg-background">
        <LoadingFallback />
      </div>
    );
  }

  return (
    <>
      <Load />
      <div className="min-h-screen bg-background [scrollbar-width:none]">
        <Suspense fallback={<LoadingFallback />}>
          <Hero />
          <ServiceCards />
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

          <EmplacementPub />

          {/* Section biens immobiliers */}
          <>
            <div className="text-center mt-6 flex items-center justify-between">
              <h2 className="text-4xl font-bold ml-8 text-gray-700 my-6">Nos biens immobiliers</h2>
              {/* Voir plus button */}

              <Button
                className="relative px-8 py-3 mr-10 bg-slate-900 flex items-center gap-3 hover:bg-salte-700 overflow-hidden rounded-md group transition-all duration-500 hover:scale-105"
                onClick={() => navigate('/immobilier')}
              >
                {/* Cercle animé à droite */}
                <span className="absolute inset-0 -right-3 top-12 w-36 h-32 bg-white group-hover:-top-12 transition-all duration-700 ease-out origin-bottom rounded-full transform group-hover:scale-105"></span>

                {/* Contenu */}
                <span className="relative z-10 text-white font-semibold group-hover:text-slate-900 transition-all duration-400 ease-out">
                  Voir plus de nos b<span className='group-hover:text-white'>iens</span>
                </span>
                <ArrowRight className="w-4 h-4 relative z-10 text-white group-hover:text-slate-100 transition-all duration-400 ease-out group-hover:translate-x-1" />
              </Button>
            </div>
            <PropertyListings cardsOnly maxItems={4} />
            <Slider />
          </>
        </Suspense>
      </div>
    </>
  );
};

export default Index;