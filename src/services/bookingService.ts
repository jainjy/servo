// services/bookingService.ts
import api from '@/lib/api';

export interface BookingData {
  courseId: string;
  professionalId: string;
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  participants: number;
  totalPrice: number;
  status: string;
  courseTitle: string;
  professionalName: string;
  notes?: string;
}

export const BookingService = {
  async createBooking(bookingData: BookingData) {
    return await api.post('/bookings', bookingData);
  },

  async getBookings() {
    return await api.get('/bookings');
  },

  async cancelBooking(bookingId: string) {
    return await api.put(`/bookings/${bookingId}/cancel`);
  }
};