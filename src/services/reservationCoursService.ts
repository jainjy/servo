// services/reservationCoursService.ts
import api from '@/lib/api';

export interface ReservationCoursData {
  courseId: string;
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status?: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  notes?: string;
  courseTitle?: string;
  professionalName?: string;
  professionalId?: string;
}

export interface ReservationCours {
  id: string;
  courseId: string;
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: 'en_attente' | 'confirmee' | 'annulee' | 'terminee';
  notes?: string;
  raisonAnnulation?: string;
  createdAt: string;
  updatedAt: string;
  dateAnnulation?: string;
  professionalId: string;
  courseTitle: string;
  professionalName: string;
  courseCategory: string;
  courseDuration: number;
  course: {
    id: string;
    title: string;
    category: string;
    durationMinutes: number;
    professional: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface ReservationCoursStats {
  total: number;
  en_attente: number;
  confirmee: number;
  annulee: number;
  terminee: number;
  totalRevenue: number;
}

export interface ReservationCoursResponse {
  success: boolean;
  data: ReservationCours;
  message?: string;
}

export interface ReservationCoursListResponse {
  success: boolean;
  data: ReservationCours[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ReservationCoursStatsResponse {
  success: boolean;
  data: ReservationCoursStats;
}

export const ReservationCoursService = {
  async createReservation(reservationData: ReservationCoursData): Promise<ReservationCoursResponse> {
    try {
      const response = await api.post('/reservation-cours', reservationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
      throw error;
    }
  },

  async getReservations(params?: {
    professionalId?: string;
    userId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ReservationCoursListResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.professionalId) queryParams.append('professionalId', params.professionalId);
      if (params?.userId) queryParams.append('userId', params.userId);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get(`/reservation-cours?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw error;
    }
  },

  async getReservation(reservationId: string): Promise<ReservationCoursResponse> {
    try {
      const response = await api.get(`/reservation-cours/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la réservation:', error);
      throw error;
    }
  },

  async updateReservationStatus(
    reservationId: string, 
    status: 'en_attente' | 'confirmee' | 'annulee' | 'terminee', 
    raisonAnnulation?: string
  ): Promise<ReservationCoursResponse> {
    try {
      const response = await api.put(`/reservation-cours/${reservationId}/status`, { 
        status, 
        raisonAnnulation 
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  async updateReservation(
    reservationId: string, 
    data: Partial<ReservationCoursData>
  ): Promise<ReservationCoursResponse> {
    try {
      const response = await api.put(`/reservation-cours/${reservationId}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réservation:', error);
      throw error;
    }
  },

  async getProfessionalStats(professionalId: string): Promise<ReservationCoursStatsResponse> {
    try {
      const response = await api.get(`/reservation-cours/professional/${professionalId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  async deleteReservation(reservationId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/reservation-cours/${reservationId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw error;
    }
  },

  // Méthodes utilitaires
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'en_attente': '⏳ En attente',
      'confirmee': '✅ Confirmée', 
      'annulee': '❌ Annulée',
      'terminee': '🎉 Terminée'
    };
    return statusLabels[status] || status;
  },

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'en_attente': 'text-yellow-600 bg-yellow-100',
      'confirmee': 'text-green-600 bg-green-100',
      'annulee': 'text-red-600 bg-red-100',
      'terminee': 'text-blue-600 bg-blue-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  },

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  calculateTotalRevenue(reservations: ReservationCours[]): number {
    return reservations
      .filter(reservation => reservation.status === 'confirmee')
      .reduce((total, reservation) => total + reservation.totalPrice, 0);
  }
};