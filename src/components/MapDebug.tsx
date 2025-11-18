import React, { useEffect, useState } from 'react';
import { MapPoint } from '../types/map';
import { MapService } from '../services/mapService';

const MapDebug: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [rawData, setRawData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les données brutes pour inspection
        const response = await fetch('http://localhost:3001/api/map/all');
        const raw = await response.json();
        setRawData(raw);

        // Charger les points formatés
        const pointsData = await MapService.getAllMapPoints();
        setPoints(pointsData);
      } catch (error) {
        console.error('Erreur debug:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🔧 Debug Carte</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Données brutes */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">📦 Données brutes API</h2>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>

        {/* Points formatés */}
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">🎯 Points formatés</h2>
          <div className="space-y-2 max-h-96 overflow-auto">
            {points.map((point, index) => (
              <div key={point.id} className="border-b pb-2">
                <p><strong>ID:</strong> {point.id}</p>
                <p><strong>Nom:</strong> {point.name || 'NOM MANQUANT'}</p>
                <p><strong>Type:</strong> {point.type}</p>
                <p><strong>Coords:</strong> {point.latitude}, {point.longitude}</p>
                <p><strong>Popup:</strong> {point.popupContent ? '✅' : '❌ MANQUANT'}</p>
                <details className="mt-1">
                  <summary className="cursor-pointer text-sm text-blue-600">Voir popup HTML</summary>
                  <pre className="text-xs bg-gray-100 p-1 mt-1 rounded">
                    {point.popupContent || 'AUCUN CONTENU'}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDebug;