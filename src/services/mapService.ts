import { MapPoint, MapApiResponse } from '../types/map';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

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
      
      const response = await fetch(`${API_BASE_URL}/map/all`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error('API returned error');
      }
      
      // Combiner utilisateurs et propriétés
      const allPoints = [
        ...(data.data.users || []),
        ...(data.data.properties || [])
      ];
      
      console.log(`✅ ${allPoints.length} points chargés (${data.data.users?.length || 0} users, ${data.data.properties?.length || 0} properties)`);
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