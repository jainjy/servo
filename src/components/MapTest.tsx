import React, { useEffect, useState } from 'react';
import { MapService } from '../services/mapService';
import { MapPoint } from '../types/map';

const MapTest: React.FC = () => {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApis = async () => {
      try {
        setLoading(true);
        
        // Test de santé
        const isHealthy = await MapService.healthCheck();
        console.log('🏥 API Health:', isHealthy);
        
        if (!isHealthy) {
          throw new Error('API non accessible');
        }

        // Charger tous les points
        const allPoints = await MapService.getAllMapPoints();
        setPoints(allPoints);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    testApis();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-2">Test des APIs en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-bold">❌ Erreur</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Vérifiez que le backend est démarré sur le port 5000
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-bold">✅ APIs fonctionnelles</h3>
      <div className="mt-2 space-y-1">
        <p><strong>Points chargés:</strong> {points.length}</p>
        <p><strong>Utilisateurs:</strong> {points.filter(p => p.type === 'user').length}</p>
        <p><strong>Propriétés:</strong> {points.filter(p => p.type === 'property').length}</p>
      </div>
      <div className="mt-4 max-h-60 overflow-y-auto">
        <h4 className="font-semibold mb-2">Détails des points:</h4>
        {points.slice(0, 10).map(point => (
          <div key={point.id} className="text-sm p-2 border-b">
            <strong>{point.name}</strong> ({point.type}) - {point.city}
          </div>
        ))}
        {points.length > 10 && (
          <p className="text-sm text-gray-500">... et {points.length - 10} autres</p>
        )}
      </div>
    </div>
  );
};

export default MapTest;