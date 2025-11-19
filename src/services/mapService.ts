import { MapPoint, MapApiResponse } from '../types/map';

const API_BASE_URL = 'http://localhost:3001/api';

export class MapService {
  static async getUsersWithCoordinates(): Promise<MapPoint[]> {
    try {
      console.log('🔄 Récupération des utilisateurs...');
      
      const response = await fetch(`${API_BASE_URL}/map/users`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: MapApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned error');
      }
      
      console.log(`✅ ${data.count} utilisateurs chargés`);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      throw error;
    }
  }

  static async getPropertiesWithCoordinates(): Promise<MapPoint[]> {
    try {
      console.log('🔄 Récupération des propriétés...');
      
      const response = await fetch(`${API_BASE_URL}/map/properties`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: MapApiResponse = await response.json();
      
      if (!data.success) {
        throw new Error('API returned error');
      }
      
      console.log(`✅ ${data.count} propriétés chargées`);
      return data.data;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des propriétés:', error);
      throw error;
    }
  }

  static async getAllMapPoints(): Promise<MapPoint[]> {
    try {
      console.log('🔄 Récupération de tous les points...');
      
      // 🔥 SOLUTION : Utiliser les APIs séparées MAIS avec les données complètes
      const [usersResponse, propertiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/map/users`),
        fetch(`${API_BASE_URL}/map/properties`)
      ]);

      if (!usersResponse.ok || !propertiesResponse.ok) {
        throw new Error('Erreur HTTP');
      }

      const usersData = await usersResponse.json();
      const propertiesData = await propertiesResponse.json();

      if (!usersData.success || !propertiesData.success) {
        throw new Error('API returned error');
      }

      // 🔥 CORRECTION COMPLÈTE : 
      // - Garder TOUTES les données des APIs séparées (qui ont les popups)
      // - S'assurer que le type est correct pour les icônes
      const allPoints: MapPoint[] = [
        // Utilisateurs : s'assurer que le type est 'user'
        ...(usersData.data || []).map((user: any) => ({
          ...user,
          type: 'user' as const // 🔥 Forcer le type user
        })),
        
        // Propriétés : s'assurer que le type est 'property' et ajouter le nom
        ...(propertiesData.data || []).map((property: any) => ({
          ...property,
          name: property.title || 'Propriété sans nom', // 🔥 Ajouter le nom manquant
          type: 'property' as const // 🔥 Forcer le type property
        }))
      ];

      // 🔥 DEBUG : Vérifier les données finales
      console.log('🗺️ Points finaux:', allPoints.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        hasPopup: !!p.popupContent,
        coords: [p.latitude, p.longitude]
      })));

      console.log(`✅ ${allPoints.length} points chargés (${usersData.data?.length || 0} users, ${propertiesData.data?.length || 0} properties)`);
      return allPoints;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des points:', error);
      throw error;
    }
  }

  // Vérifier si l'API est accessible
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/map/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ API non accessible:', error);
      return false;
    }     
  }
}
