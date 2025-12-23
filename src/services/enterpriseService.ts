// services/enterpriseService.ts
import api from "../lib/api";

export interface EnterpriseService {
  id: number;
  libelle: string;
  description: string;
  images: string[];
  duration: number | null;
  price: number | null;
  type: string;
  tags: string[];
  isCustom: boolean;
  isActive: boolean;
  categoryId: number | null;
  category?: {
    id: number;
    name: string;
  };
}

export interface ServiceResponse {
  success: boolean;
  count: number;
  data: EnterpriseService[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface CategoryWithServices {
  id: number;
  name: string;
  services: EnterpriseService[];
}

class EnterpriseServiceAPI {
  private baseUrl = "/user/enterprise-services";

  /**
   * Récupère tous les services entreprise
   */
  async getAllServices(params?: {
    page?: number;
    limit?: number;
    type?: string;
    categoryId?: number;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ServiceResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.type) queryParams.append('type', params.type);
      if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.tags?.length) queryParams.append('tags', params.tags.join(','));
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
      
      const response = await api.get<ServiceResponse>(
        `${this.baseUrl}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de la récupération des services"
      );
    }
  }

  /**
   * Récupère un service par son ID
   */
  async getServiceById(id: number | string): Promise<EnterpriseService> {
    try {
      const response = await api.get<{ success: boolean; data: EnterpriseService }>(
        `${this.baseUrl}/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de la récupération du service"
      );
    }
  }

  /**
   * Recherche des services
   */
  async searchServices(query: string, params?: {
    limit?: number;
    categoryId?: number;
    type?: string;
  }): Promise<ServiceResponse> {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('q', query);
      
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.categoryId) searchParams.append('categoryId', params.categoryId.toString());
      if (params?.type) searchParams.append('type', params.type);
      
      const response = await api.get<ServiceResponse>(
        `${this.baseUrl}/search?${searchParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de la recherche des services"
      );
    }
  }

  /**
   * Récupère les services par catégorie
   */
  async getServicesByCategory(categoryId: number, params?: {
    type?: string;
    isActive?: boolean;
  }): Promise<ServiceResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) queryParams.append('type', params.type);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      
      const response = await api.get<ServiceResponse>(
        `${this.baseUrl}/category/${categoryId}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        `Erreur lors de la récupération des services par catégorie ${categoryId}`
      );
    }
  }

  /**
   * Récupère les services par type
   */
  async getServicesByType(type: string, params?: {
    isActive?: boolean;
    limit?: number;
  }): Promise<ServiceResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get<ServiceResponse>(
        `${this.baseUrl}/type/${type}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        `Erreur lors de la récupération des services par type ${type}`
      );
    }
  }

  /**
   * Récupère les services recommandés
   */
  async getRecommendedServices(serviceId: number, limit: number = 4): Promise<ServiceResponse> {
    try {
      const response = await api.get<ServiceResponse>(
        `${this.baseUrl}/recommended?serviceId=${serviceId}&limit=${limit}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de la récupération des services recommandés"
      );
    }
  }

  /**
   * Récupère les catégories avec leurs services
   */
  async getCategoriesWithServices(params?: {
    type?: string;
    isActive?: boolean;
  }): Promise<{ success: boolean; count: number; data: CategoryWithServices[] }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.type) queryParams.append('type', params.type);
      if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
      
      const response = await api.get<{ success: boolean; count: number; data: CategoryWithServices[] }>(
        `${this.baseUrl}/categories/list?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de la récupération des catégories"
      );
    }
  }

  /**
   * Méthode combinée pour récupérer ou rechercher des services
   */
  async getServices(searchTerm?: string, params?: {
    page?: number;
    limit?: number;
    type?: string;
    categoryId?: number;
  }): Promise<ServiceResponse> {
    try {
      if (searchTerm && searchTerm.trim().length >= 2) {
        return await this.searchServices(searchTerm.trim(), params);
      } else {
        return await this.getAllServices(params);
      }
    } catch (error: any) {
      throw new Error(
        error.message || "Erreur lors de la récupération des services"
      );
    }
  }
}

// Exportez une instance unique
export default new EnterpriseServiceAPI();