import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useImmobilierTracking } from '@/hooks/useImmobilierTracking';

// Chargement dynamique avec React.lazy
const Header = lazy(() => import('@/components/layout/Header'));
const Footer = lazy(() => import('@/components/layout/Footer'));
const PropertyFilters = lazy(() => import('@/components/PropertyFilters'));
const PropertyListings = lazy(() => import('@/components/PropertyListings'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <img src="/loading.gif" alt="" className='w-24 h-24' />
      <p className="text-gray-600">Chargement de l'immobilier...</p>
    </div>
  </div>
);

// Props pour PropertyListings avec tracking
interface PropertyListingsWithTrackingProps {
  onPropertyView: (property: any) => void;
  onPropertyClick: (property: any) => void;
  onPropertyContact: (property: any) => void;
  onSearch: (query: string, resultsCount?: number) => void;
  onFilter: (filters: any) => void;
}

const Immobilier = () => {
  const [mounted, setMounted] = useState(false);

  // Initialisation du tracking
  const {
    trackImmobilierView,
    trackPropertyView,
    trackPropertyClick,
    trackPropertyFilter,
    trackPropertyContact,
    trackPropertySearch
  } = useImmobilierTracking();

  useEffect(() => {
    setMounted(true);
    trackImmobilierView();
  }, []);

  // Handlers pour le tracking
  const handlePropertyView = (property: any) => {
    trackPropertyView(property.id, property.type, property.price);
  };

  const handlePropertyClick = (property: any) => {
    trackPropertyClick(property.id, property.title, property.price);
  };

  const handlePropertyContact = (property: any) => {
    trackPropertyContact(property.id, property.title);
  };

  const handlePropertySearch = (query: string, resultsCount?: number) => {
    trackPropertySearch(query, resultsCount);
  };

  const handlePropertyFilter = (filters: any) => {
    trackPropertyFilter(filters);
  };

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
          <div className='absolute top-28 w-11/12 h-full flex flex-col'>
            <span className='text-2xl lg:text-5xl text-white text-center tracking-wider font-serif font-semibold'>Nos annonces immobilières</span>
            <span className='text-center text-xs pt-5 text-white/60'>Trouvez la perle rare parmi nos annonces immobilières exclusives</span>
          </div>

          {/* PropertyListings avec props de tracking */}
          <PropertyListings
            onPropertyView={handlePropertyView}
            onPropertyClick={handlePropertyClick}
            onPropertyContact={handlePropertyContact}
            onSearch={handlePropertySearch}
            onFilter={handlePropertyFilter}
          />

        </Suspense>
      </section>

    </div>
  );
};

export default Immobilier;