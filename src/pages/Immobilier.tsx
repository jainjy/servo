import React, { useEffect, useState, Suspense, lazy } from 'react';

// Chargement dynamique avec React.lazy
const Header = lazy(() => import('@/components/layout/Header'));
const Footer = lazy(() => import('@/components/layout/Footer'));
const PropertyFilters = lazy(() => import('@/components/PropertyFilters'));
const PropertyListings = lazy(() => import('@/components/PropertyListings'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Chargement de l'immobilier...</p>
    </div>
  </div>
);

const Immobilier = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <div className="min-h-screen mt-10 ">
      <div className='fixed -z-10 overflow-hidden bg-black w-full h-64'>
        <img src="https://i.pinimg.com/1200x/c1/df/87/c1df875d53d18c0e8cd9ac21a20c035c.jpg"
          className='opacity-45 object-cover w-full' alt="" />
      </div>
      <section className="container mx-auto px-1 py-8">
        <Suspense fallback={
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        }>
          <div className='  absolute top-28 w-full h-full flex flex-col '>
            <span className='text-5xl text-white text-center tracking-wider font-serif font-semibold'>Vente et location</span>
            <span className='text-center text-xs pt-5 text-white/60 '>Vendre ou louer vos biens</span>
          </div>

          <PropertyListings />
        </Suspense>
      </section>

    </div>
  );
};

export default Immobilier;
