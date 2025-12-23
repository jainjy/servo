// src/services/userMetierService.ts
import api from "../lib/api";

export interface Metier {
  id: number;
  libelle: string;
  _count?: {
    services: number;
    users: number;
    demandes: number;
    ContactMessage: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class UserMetierService {
  /**
   * Récupère tous les métiers pour l'interface utilisateur
   */
  async getAllMetiers(): Promise<Metier[]> {
    try {
      const response = await api.get<Metier[]>("/user/metiers");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des métiers"
      );
    }
  }

  /**
   * Recherche des métiers par libellé
   */
  async searchMetiers(query: string): Promise<Metier[]> {
    try {
      const response = await api.get<Metier[]>(
        `/user/metiers/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la recherche des métiers"
      );
    }
  }

  /**
   * Récupère un métier par son ID
   */
  async getMetierById(id: number | string): Promise<Metier> {
    try {
      const response = await api.get<Metier>(`/user/metiers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération du métier"
      );
    }
  }

  /**
   * Méthode combinée qui gère à la fois l'affichage de tous les métiers et la recherche
   */
  async getMetiers(searchTerm?: string): Promise<Metier[]> {
    try {
      if (searchTerm && searchTerm.trim().length >= 2) {
        return await this.searchMetiers(searchTerm.trim());
      } else {
        return await this.getAllMetiers();
      }
    } catch (error: any) {
      throw new Error(
        error.message || "Erreur lors de la récupération des métiers"
      );
    }
  }

  /**
   * Récupère les métiers avec pagination
   */
  async getMetiersPaginated(
    page: number = 1,
    limit: number = 20,
    search: string = ""
  ): Promise<PaginatedResponse<Metier>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search.trim()) {
        params.append("search", search.trim());
      }
      
      const response = await api.get<PaginatedResponse<Metier>>(
        `/user/metiers?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Erreur lors de la récupération des métiers paginés"
      );
    }
  }

  /**
   * Récupère les métiers populaires
   */
  async getPopularMetiers(limit: number = 10): Promise<Metier[]> {
    try {
      const allMetiers = await this.getAllMetiers();
      
      return allMetiers
        .sort((a, b) => {
          const countA = a._count?.services || 0;
          const countB = b._count?.services || 0;
          return countB - countA;
        })
        .slice(0, limit);
    } catch (error: any) {
      throw new Error(
        error.message || "Erreur lors de la récupération des métiers populaires"
      );
    }
  }
}

// Exportez une instance unique
export default new UserMetierService();