import React, { useEffect, useState, Suspense, lazy } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Load from "../components/Load";

const Hero = lazy(() => import("@/components/Hero"));
const ServiceCards = lazy(() => import("@/components/ServiceCards"));
const TravauxPreview = lazy(() => import("@/components/TravauxPreview"));
const PropertyListings = lazy(() => import("@/components/PropertyListings"));
const Slider = lazy(() => import("@/components/Slider"));

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

  useEffect(() => {
    setIsClient(true);
  }, []);

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
          <TravauxPreview />
          <Slider />
          {/* Show property listings on the home page in cards-only mode (no filters) */}
          <>
          <h2 className="text-4xl font-bold ml-8 text-gray-700 my-6">Nos immobiliers</h2>
          <PropertyListings cardsOnly maxItems={4} />
          </>
        </Suspense>
       
      </div>
    </>
  );
};

export default Index;
