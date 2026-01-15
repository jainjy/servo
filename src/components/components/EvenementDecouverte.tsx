import React, { useState, useMemo } from 'react';
import TourismNavigation from '../TourismNavigation';
import { useEventsDiscoveriesUser } from '@/hooks/useEventDiscoveriesUser';

const EventsDiscoveries = () => {
  const [activeTab, setActiveTab] = useState('events');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedDiscovery, setSelectedDiscovery] = useState<any>(null);
  
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

  // Fonction pour fermer la modal
  const closeModal = () => {
    setSelectedEvent(null);
    setSelectedDiscovery(null);
  };

  // Empêcher la propagation du clic dans la modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            onEventClick={setSelectedEvent}
          />
        ) : (
          <DiscoveriesContent 
            discoveries={displayDiscoveries}
            getDifficultyLabel={getDifficultyLabel}
            onDiscoveryClick={setSelectedDiscovery}
          />
        )}

        {/* Modal pour événement agrandi */}
        {(selectedEvent || selectedDiscovery) && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={handleModalClick}
            >
              {selectedEvent ? (
                <ExpandedEvent 
                  event={selectedEvent}
                  getEventSpotsInfo={getEventSpotsInfo}
                  formatDate={formatDate}
                  onClose={closeModal}
                />
              ) : (
                <ExpandedDiscovery 
                  discovery={selectedDiscovery}
                  getDifficultyLabel={getDifficultyLabel}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
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
const EventsContent = ({ events, getEventSpotsInfo, formatDate, onEventClick }: any) => {
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
            className={`bg-white relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer ${
              event.featured ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
            onClick={() => onEventClick(event)}
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
              
              {/* Indicateur de clic */}
              <div className="text-xs text-gray-500 text-center mt-4">
                Cliquez pour voir les détails
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Composant Découvertes
const DiscoveriesContent = ({ discoveries, getDifficultyLabel, onDiscoveryClick }: any) => {
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
          className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
          onClick={() => onDiscoveryClick(discovery)}
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
            
            {/* Indicateur de clic */}
            <div className="text-xs text-gray-500 text-center">
              Cliquez pour voir les détails
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant Événement agrandi
const ExpandedEvent = ({ event, getEventSpotsInfo, formatDate, onClose }: any) => {
  const spotsInfo = getEventSpotsInfo(event);
  const formattedDate = formatDate(event.date);
  
  return (
    <>
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Image en tête */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          {event.featured && (
            <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
              ⭐ Événement spécial
            </span>
          )}
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center space-x-4 text-white/90">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
              {event.category || 'Événement'}
            </span>
            <span>•</span>
            <span>Organisé par {event.organizer || 'Non spécifié'}</span>
          </div>
        </div>
      </div>
      
      {/* Contenu détaillé */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {event.description || 'Pas de description disponible'}
            </p>
            
            {/* Informations détaillées */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📅 Date et heure</h4>
                  <p className="text-gray-600">
                    {formattedDate}
                    {event.time && <span className="block">⏰ {event.time}</span>}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📍 Lieu</h4>
                  <p className="text-gray-600">
                    {event.location}
                    {event.address && <span className="block">{event.address}</span>}
                    {event.city && <span className="block">{event.city} {event.postalCode}</span>}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🎯 Niveau de difficulté</h4>
                  <p className="text-gray-600">
                    {event.difficulty ? 
                      event.difficulty.charAt(0).toUpperCase() + event.difficulty.slice(1) : 
                      'Non spécifié'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">⏱️ Durée</h4>
                  <p className="text-gray-600">{event.duration || 'Non spécifié'}</p>
                </div>
              </div>
            </div>
            
            {/* Inclus / Non inclus */}
            {(event.includes?.length > 0 || event.notIncludes?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {event.includes?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Ce qui est inclus</h3>
                    <ul className="space-y-2">
                      {event.includes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {event.notIncludes?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">❌ Ce qui n'est pas inclus</h3>
                    <ul className="space-y-2">
                      {event.notIncludes.map((item: string, index: number) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Colonne latérale (réservation) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Réservation</h3>
              
              {/* Prix */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-logo mb-2">
                  {event.price > 0 ? `${event.price} ${event.currency || 'EUR'}` : 'Gratuit'}
                </div>
                {event.discountPrice && (
                  <div className="text-gray-500 line-through">
                    {event.discountPrice} {event.currency || 'EUR'}
                  </div>
                )}
              </div>
              
              {/* Places disponibles */}
              {spotsInfo.total > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Places disponibles</span>
                    <span className="font-semibold">{spotsInfo.available} / {spotsInfo.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${spotsInfo.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {spotsInfo.booked} personnes déjà inscrites
                  </div>
                </div>
              )}
              
              {/* Informations complémentaires */}
              <div className="mt-6 space-y-4 text-sm text-gray-600">
                {event.contactEmail && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {event.contactEmail}
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {event.contactPhone}
                  </div>
                )}
                {event.website && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Composant Découverte agrandie
const ExpandedDiscovery = ({ discovery, getDifficultyLabel, onClose }: any) => {
  return (
    <>
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Image en tête */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={discovery.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600'}
          alt={discovery.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-2 inline-block">
            {discovery.type || 'Découverte'}
          </span>
          <h1 className="text-3xl font-bold mb-2">{discovery.title}</h1>
          <div className="flex items-center space-x-4 text-white/90">
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{(discovery.rating || 0).toFixed(1)}</span>
            </div>
            <span>•</span>
            <span>{discovery.visits || 0} visites</span>
          </div>
        </div>
      </div>
      
      {/* Contenu détaillé */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-line">
              {discovery.description || 'Pas de description disponible'}
            </p>
            
            {/* Caractéristiques */}
            {discovery.highlights?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Points forts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {discovery.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Informations détaillées */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📍 Localisation</h4>
                  <p className="text-gray-600">{discovery.location || 'Non spécifié'}</p>
                  {discovery.coordinates && (
                    <p className="text-gray-500 text-sm mt-1">
                      Coordonnées: {discovery.coordinates.lat}, {discovery.coordinates.lng}
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🎯 Niveau de difficulté</h4>
                  <p className="text-gray-600">{getDifficultyLabel(discovery.difficulty)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">⏱️ Durée estimée</h4>
                  <p className="text-gray-600">{discovery.duration || 'Non spécifié'}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">👥 Recommandé pour</h4>
                  <p className="text-gray-600">Tous les âges</p>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {discovery.tags?.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thématiques</h3>
                <div className="flex flex-wrap gap-2">
                  {discovery.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Colonne latérale (réservation) */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg sticky top-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Découvrir</h3>
              
              {/* Prix */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-logo mb-2">
                  {discovery.price > 0 ? `${discovery.price} ${discovery.currency || 'EUR'}` : 'Gratuit'}
                </div>
              </div>
              
              {/* Statistiques */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Note moyenne</span>
                  <span className="font-semibold">{(discovery.rating || 0).toFixed(1)}/5</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Nombre de visites</span>
                  <span className="font-semibold">{discovery.visits || 0}</span>
                </div>
                {discovery.organizer && (
                  <div className="flex justify-between text-gray-700">
                    <span>Organisateur</span>
                    <span className="font-semibold">{discovery.organizer}</span>
                  </div>
                )}
              </div>
              
              {/* Conseils */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Conseil</h4>
                <p className="text-blue-700 text-sm">
                  Pensez à prévoir de l'eau et des chaussures confortables pour profiter pleinement de cette découverte.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsDiscoveries;