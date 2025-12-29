import React, { useState, useEffect } from 'react';

const ExplorerVivre = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [detectedZone, setDetectedZone] = useState(null);
  
  // Zones disponibles avec leurs chemins
  const zones = [
    { id: 'reunion', name: 'Réunion', path: '/reunion' },
    { id: 'maurice', name: 'Maurice', path: '/maurice' },
    { id: 'mayotte', name: 'Mayotte', path: '/mayotte' },
    { id: 'france', name: 'France', path: '/france' }
  ];

  // Simuler la détection de zone et le chargement
  useEffect(() => {
    // Simuler un temps de chargement
    const timer = setTimeout(() => {
      // Ici, normalement, vous détecteriez la zone basée sur:
      // 1. Le chemin d'URL (window.location.pathname)
      // 2. La géolocalisation IP
      // 3. Les préférences utilisateur
      
      const path = window.location.pathname;
      const detected = zones.find(zone => 
        path.includes(zone.path) || path === zone.path || path === `${zone.path}/`
      );
      
      if (detected) {
        setDetectedZone(detected);
        setSelectedZone(detected);
        // Rediriger automatiquement si zone détectée via URL
        // window.location.href = `https://oliplus.com${detected.path}`;
      }
      
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
    
    // Ici, vous redirigeriez normalement vers la bonne plateforme
    console.log(`Redirection vers: https://oliplus.com${zone.path}`);
    // window.location.href = `https://oliplus.com${zone.path}`;
  };

  const handleConfirmSelection = () => {
    if (selectedZone) {
      // Redirection vers la plateforme adaptée
      window.location.href = `https://oliplus.com${selectedZone.path}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">OliPlus</h1>
          <p className="text-gray-600">Chargement de votre plateforme...</p>
        </div>

        {/* Indicateur de chargement */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-8"></div>

        {/* Section sélection de zone */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Sélectionnez votre zone
            </h2>
            <p className="text-gray-600">
              Pendant le chargement, vous pouvez choisir votre zone géographique
            </p>
          </div>

          {/* Liste des zones */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => handleZoneSelect(zone)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedZone?.id === zone.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="font-medium">{zone.name}</div>
                <div className="text-sm text-gray-500 mt-1">oliplus.com{zone.path}</div>
              </button>
            ))}
          </div>

          {/* Bouton de confirmation */}
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedZone}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              selectedZone
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedZone 
              ? `Accéder à OliPlus ${selectedZone.name}` 
              : 'Sélectionnez une zone'}
          </button>

          {/* Détection automatique */}
          {detectedZone && (
            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                Zone détectée : <span className="font-semibold">{detectedZone.name}</span>
              </p>
              <p className="text-xs text-green-600 text-center mt-1">
                Redirection automatique dans quelques secondes...
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-md">
          <p>
            La plateforme s'adaptera automatiquement en fonction de votre zone géographique
            pour vous offrir la meilleure expérience.
          </p>
        </div>
      </div>
    );
  }

  // Écran après chargement (normalement redirigé avant d'arriver ici)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Redirection vers OliPlus {selectedZone?.name}
        </h2>
        <p className="text-gray-600">
          Vous serez redirigé dans quelques instants...
        </p>
      </div>
    </div>
  );
};

export default ExplorerVivre;