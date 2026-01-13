import { MapPoint, MapApiResponse } from '../types/map';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export class MapService {
  static async getUsersWithCoordinates(): Promise<MapPoint[]> {
    try {
     
      const response = await fetch(`${API_BASE_URL}/map/users`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: MapApiResponse = await response.json();

      if (!data.success) {
        throw new Error("API returned error");
      }

      return data.data;
    } catch (error) {
      console.error("❌ Erreur lors du chargement des utilisateurs:", error);
      throw error;
    }
  }

  static async getPropertiesWithCoordinates(): Promise<MapPoint[]> {
    try {
    
      const response = await fetch(`${API_BASE_URL}/map/properties`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: MapApiResponse = await response.json();

      if (!data.success) {
        throw new Error("API returned error");
      }

     
      return data.data;
    } catch (error) {
      console.error("❌ Erreur lors du chargement des propriétés:", error);
      throw error;
    }
  }
  
  static async getAllMapPoints(): Promise<MapPoint[]> {
    try {
     
      // 🔥 SOLUTION : Utiliser les APIs séparées MAIS avec les données complètes
      const [usersResponse, propertiesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/map/users`).catch(err => {
          console.warn("Erreur utilisateurs:", err);
          return new Response(JSON.stringify({ success: false, data: [], count: 0 }), { 
            status: 500 
          });
        }),
        fetch(`${API_BASE_URL}/map/properties`).catch(err => {
          console.warn("Erreur propriétés:", err);
          return new Response(JSON.stringify({ success: false, data: [], count: 0 }), { 
            status: 500 
          });
        }),
      ]);

      // Continuer même si une des requêtes échoue
      const usersData = usersResponse.ok ? await usersResponse.json() : { success: false, data: [], count: 0 };
      const propertiesData = propertiesResponse.ok ? await propertiesResponse.json() : { success: false, data: [], count: 0 };

      if (!usersData.success && !propertiesData.success) {
        throw new Error("Impossible de charger les données de la carte. Le serveur ne répond pas.");
      }

      // 🔥 CORRECTION COMPLÈTE :
      // - Garder TOUTES les données des APIs séparées (qui ont les popups)
      // - S'assurer que le type est correct pour les icônes
      const allPoints: MapPoint[] = [
        // Utilisateurs : s'assurer que le type est 'user'
        ...(usersData.data || []).map((user: any) => ({
          ...user,
          type: "user" as const, // 🔥 Forcer le type user
        })),

        // Propriétés : s'assurer que le type est 'property' et ajouter le nom
        ...(propertiesData.data || []).map((property: any) => ({
          ...property,
          name: property.title || "Propriété sans nom", // 🔥 Ajouter le nom manquant
          type: "property" as const, // 🔥 Forcer le type property
        })),
      ];


      return allPoints;
    } catch (error) {
      console.error("❌ Erreur lors du chargement des points:", error);
      // Retourner un tableau vide au lieu de lever une erreur
      console.warn("⚠️ Retour vide pour la carte");
      return [];
    }
  }

  // Vérifier si l'API est accessible
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/map/health`);
      return response.ok;
    } catch (error) {
      console.error("❌ API non accessible:", error);
      return false;
    }     
  }
}
