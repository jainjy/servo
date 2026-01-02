import React, { useState, useMemo } from 'react';
import TourismNavigation from '../TourismNavigation';
import { useEventsDiscoveriesUser } from '@/hooks/useEventDiscoveriesUser';

const EventsDiscoveries = () => {
  const [activeTab, setActiveTab] = useState('events');
  const { 
    events, 
    discoveries, 
    stats, 
    loading, 
    error,
    getEventSpotsInfo,
    getDifficultyLabel,
    refreshData 
  } = useEventsDiscoveriesUser();

  // Statistiques formatées avec useMemo pour éviter les re-calculs
  const displayStats = useMemo(() => [
    { 
      label: "Événements à venir", 
      value: stats.upcomingEvents > 0 ? `${stats.upcomingEvents}+` : "0",
      description: "Prochainement"
    },
    { 
      label: "Découvertes uniques", 
      value: stats.totalDiscoveries.toString(),
      description: "Expériences disponibles"
    },
    { 
      label: "Participants actifs", 
      value: stats.totalParticipants > 1000 
        ? `${(stats.totalParticipants / 1000).toFixed(1)}k` 
        : stats.totalParticipants.toString(),
      description: "Déjà inscrits"
    },
    { 
      label: "Taux de satisfaction", 
      value: `${((stats.avgRating / 5) * 100).toFixed(0)}%`,
      description: "Basé sur les avis"
    }
  ], [stats]);

  // Données à afficher avec useMemo
  const displayEvents = useMemo(() => 
    activeTab === 'events' && events.length > 0 
      ? events.slice(0, 6)
      : [], 
    [activeTab, events]
  );

  const displayDiscoveries = useMemo(() => 
    activeTab === 'discoveries' && discoveries.length > 0 
      ? discoveries.slice(0, 8)
      : [], 
    [activeTab, discoveries]
  );

  const isLoading = loading.events || loading.discoveries;
  const hasData = displayEvents.length > 0 || displayDiscoveries.length > 0;

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl pt-10 mx-auto">
        {/* Background */}
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70' />
          <img
            src="https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg"
            className='h-full object-cover w-full'
            alt="Background"
            loading="lazy"
          />
        </div>

        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-100 mb-4">
            Événements & découvertes
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto">
            Vivez des événements uniques et faites de nouvelles découvertes dans votre région.
            Des expériences mémorables vous attendent.
          </p>
          <TourismNavigation />
        </div>

        {/* Bouton de rafraîchissement */}
        {error && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={refreshData}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            >
              Réessayer le chargement
            </button>
          </div>
        )}

        {/* Statistiques - seulement si on a des données */}
        {!isLoading && hasData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {displayStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center transition-all hover:shadow-xl"
              >
                <div className="text-3xl font-bold text-secondary-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-700 font-medium mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation par onglets */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('events')}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'events'
                  ? 'bg-secondary-text text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading && activeTab === 'events' ? 'Chargement...' : 'Événements'}
            </button>
            <button
              onClick={() => setActiveTab('discoveries')}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'discoveries'
                  ? 'bg-secondary-text text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading && activeTab === 'discoveries' ? 'Chargement...' : 'Découvertes'}
            </button>
          </div>
        </div>

        {/* Message d'erreur */}
        {error && !isLoading && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-yellow-700 text-center">
              {error}
            </p>
          </div>
        )}

        {/* Contenu */}
        {isLoading ? (
          <LoadingSkeleton activeTab={activeTab} />
        ) : activeTab === 'events' ? (
          <EventsContent 
            events={displayEvents}
            getEventSpotsInfo={getEventSpotsInfo}
            formatDate={formatDate}
          />
        ) : (
          <DiscoveriesContent 
            discoveries={displayDiscoveries}
            getDifficultyLabel={getDifficultyLabel}
          />
        )}

        {/* Section newsletter - seulement si on a des données */}
        {hasData && !isLoading && (
          <>
            <NewsletterSection />
            <CallToActionSection />
          </>
        )}
      </div>
    </div>
  );
};

// Composant Squelette de chargement
const LoadingSkeleton = ({ activeTab }: { activeTab: string }) => {
  const isEvents = activeTab === 'events';
  const cols = isEvents ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  const count = isEvents ? 6 : 8;
  
  return (
    <div className={`grid ${cols} gap-8`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200" />
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="mt-6 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant Événements
const EventsContent = ({ events, getEventSpotsInfo, formatDate }: any) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucun événement disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event: any) => {
        const spotsInfo = getEventSpotsInfo(event);
        const formattedDate = formatDate(event.date);
        
        return (
          <div
            key={event.id}
            className={`bg-white relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
              event.featured ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            {/* Image */}
            <div className="relative p-2 z-10 h-64 overflow-hidden">
              <img
                src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800'}
                alt={event.title}
                className="w-full h-full rounded-sm object-cover transition-transform duration-500 hover:scale-110"
                loading="lazy"
              />
              {event.featured && (
                <div className="absolute top-4 left-4 bg-logo text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Événement spécial
                </div>
              )}
              <div className="absolute top-4 right-4 border-t border-l border-white backdrop-blur-md px-3 py-1 rounded-lg">
                <span className="font-semibold text-gray-900">{event.category || 'Événement'}</span>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <h3 className={`${
                !event.featured && 'text-sm'
              } text-lg font-bold text-gray-900 mb-2 line-clamp-1`}>
                {event.title}
              </h3>
              <p className={`${
                !event.featured && 'text-xs'
              } text-gray-600 text-sm mb-4 line-clamp-2`}>
                {event.description || 'Pas de description disponible'}
              </p>

              {/* Informations */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-xs text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-logo" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{formattedDate}</span>
                  {event.time && <span className="ml-2">• {event.time}</span>}
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-logo" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1">{event.location || 'Lieu non spécifié'}</span>
                </div>
              </div>

              {/* Places disponibles */}
              {spotsInfo.total > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Places disponibles</span>
                    <span>{spotsInfo.booked}/{spotsInfo.total} réservées</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary-text h-2 rounded-full transition-all duration-500"
                      style={{ width: `${spotsInfo.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Prix et bouton */}
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-secondary-text">
                  {event.price > 0 ? `${event.price} ${event.currency || 'EUR'}` : 'Gratuit'}
                </div>
                <button className="bg-logo text-white font-semibold py-2 px-6 rounded-xl hover:bg-logo/70 transition-all duration-300">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Composant Découvertes
const DiscoveriesContent = ({ discoveries, getDifficultyLabel }: any) => {
  if (discoveries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aucune découverte disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {discoveries.map((discovery: any) => (
        <div
          key={discovery.id}
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          {/* Image */}
          <div className="relative h-48 p-2 overflow-hidden">
            <img
              src={discovery.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800'}
              alt={discovery.title}
              className="w-full h-full object-cover rounded-sm transition-transform duration-500 hover:scale-110"
              loading="lazy"
            />
            <div className="absolute top-4 left-4 bg-logo text-white px-3 py-1 rounded-full text-sm font-semibold">
              {discovery.type || 'Découverte'}
            </div>
            <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-md px-3 py-1 rounded-lg flex items-center">
              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-slate-900">
                {(discovery.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-4">
            <h3 className="text-md font-bold text-gray-900 mb-2 line-clamp-1">
              {discovery.title}
            </h3>
            <p className="text-gray-600 text-xs mb-4 line-clamp-2">
              {discovery.description || 'Pas de description disponible'}
            </p>

            {/* Informations */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex text-xs items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{discovery.duration || 'Non spécifié'}</span>
              </div>
              <div className="flex text-xs items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
                <span>{getDifficultyLabel(discovery.difficulty)}</span>
              </div>
              <div className="col-span-2 text-xs flex items-center text-gray-700">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="line-clamp-1">{discovery.location || 'Lieu non spécifié'}</span>
              </div>
            </div>

            {/* Prix et bouton */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-secondary-text">
                {discovery.price > 0 ? `${discovery.price} ${discovery.currency || 'EUR'}` : 'Gratuit'}
              </div>
              <button className="bg-logo text-white font-semibold py-2 px-4 rounded-xl hover:bg-logo/70 transition-all duration-300">
                Découvrir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Sections supplémentaires
const NewsletterSection = () => (
  <div className="mt-20 bg-gradient-to-r from-secondary-text to-secondary-text/50 rounded-3xl p-8 md:p-12 text-white">
    <div className="max-w-2xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ne manquez aucune découverte
      </h2>
      <p className="text-blue-100 mb-8">
        Inscrivez-vous à notre newsletter pour recevoir en avant-première les nouveaux événements et découvertes.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Votre adresse email"
          className="flex-grow px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <button className="bg-white text-secondary-text font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300">
          S'abonner
        </button>
      </div>
    </div>
  </div>
);

const CallToActionSection = () => (
  <div className="text-center mt-16">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Vous organisez un événement ou avez une découverte à partager ?
    </h3>
    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
      Rejoignez notre communauté de passionnés et faites découvrir vos expériences uniques.
    </p>
    <button className="inline-flex items-center bg-secondary-text text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5">
      Proposer une expérience
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </div>
);

export default EventsDiscoveries;