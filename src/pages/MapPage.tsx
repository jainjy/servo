import React, { useEffect, useState } from 'react';
import GenericMap from '../components/GenericMap';
import { MapPoint } from '../types/map';
import { MapService } from '../services/mapService';

const MapPage: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMapData = async () => {
      try {
        setLoading(true);
        const allPoints = await MapService.getAllMapPoints();
        setPoints(allPoints);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur chargement carte:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMapData();
  }, []);

  const handlePointClick = (point: MapPoint) => {
    console.log('Point cliqué:', point);
    // Vous pouvez ajouter des actions ici (navigation, modal, etc.)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold">❌ Erreur</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Carte des utilisateurs et propriétés</h1>
        <div className="flex gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Utilisateurs: {points.filter(p => p.type === 'user').length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            Propriétés: {points.filter(p => p.type === 'property').length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            Total: {points.length} points
          </div>
        </div>
      </div>

      <GenericMap 
        points={points}
        height="600px"
        className="rounded-lg shadow-lg border"
        onPointClick={handlePointClick}
      />
    </div>
  );
};

export default MapPage;