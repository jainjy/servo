// components/admin/AdminBookings.tsx
import { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, Users, MapPin, DollarSign,
  CheckCircle, XCircle, Clock, AlertCircle, Download,
  Eye, ChevronDown, ChevronUp, Mail, Phone,
  Building, User as UserIcon, RefreshCw, MessageCircle
} from 'lucide-react';
import api from '../../../lib/api';

interface TourismeBooking {
  id: string;
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  serviceFee: number;
  specialRequests: string;
  paymentMethod: string;
  stripePaymentIntent?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  listing: {
    id: string;
    title: string;
    type: string;
    city: string;
    images: string[];
    price: number;
    provider: string;
    rating?: number;
    reviewCount?: number;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  revenue: number;
  averageBooking: number;
}

export const AdminBookings = () => {
  const [bookings, setBookings] = useState<TourismeBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<TourismeBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
    averageBooking: 0
  });
  const [selectedBooking, setSelectedBooking] = useState<TourismeBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    provider: 'all'
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TourismeBooking;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });

  // Charger les réservations
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tourisme-bookings?limit=1000');
      
      if (response.data.success) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement réservations:', error);
      alert('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchBookings();
  };

  const calculateStats = (bookingsData: TourismeBooking[]) => {
    const confirmedAndCompleted = bookingsData.filter(
      b => b.status === 'confirmed' || b.status === 'completed'
    );
    const totalRevenue = confirmedAndCompleted.reduce((sum, b) => sum + b.totalAmount, 0);
    
    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter(b => b.status === 'pending').length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
      completed: bookingsData.filter(b => b.status === 'completed').length,
      revenue: totalRevenue,
      averageBooking: confirmedAndCompleted.length > 0 ? totalRevenue / confirmedAndCompleted.length : 0
    };
    setStats(statsData);
  };

  // Appliquer les filtres
  useEffect(() => {
    let results = bookings;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(booking =>
        booking.confirmationNumber.toLowerCase().includes(searchLower) ||
        booking.listing?.title?.toLowerCase().includes(searchLower) ||
        booking.user?.firstName?.toLowerCase().includes(searchLower) ||
        booking.user?.lastName?.toLowerCase().includes(searchLower) ||
        booking.user?.email?.toLowerCase().includes(searchLower) ||
        booking.listing?.city?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== 'all') {
      results = results.filter(booking => booking.status === filters.status);
    }

    if (filters.paymentStatus !== 'all') {
      results = results.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }

    if (filters.provider !== 'all') {
      results = results.filter(booking => booking.listing?.provider === filters.provider);
    }

    // Filtrer par date
    if (filters.dateRange !== 'all') {
      const now = new Date();
      results = results.filter(booking => {
        const checkIn = new Date(booking.checkIn);
        switch (filters.dateRange) {
          case 'today':
            return checkIn.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return checkIn >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return checkIn >= monthAgo;
          case 'future':
            return checkIn > now;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(results);
  }, [filters, bookings]);

  // Trier les résultats
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof TourismeBooking) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const updateBookingStatus = async (bookingId: string, status: TourismeBooking['status']) => {
    try {
      const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { status });
      
      if (response.data.success) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? response.data.data : booking
        ));
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(response.data.data);
        }
        // Recalculer les stats sans recharger toutes les données
        calculateStats(bookings.map(b => b.id === bookingId ? response.data.data : b));
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const updatePaymentStatus = async (bookingId: string, paymentStatus: TourismeBooking['paymentStatus']) => {
    try {
      const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { paymentStatus });
      
      if (response.data.success) {
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId ? response.data.data : booking
        ));
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(response.data.data);
        }
      }
    } catch (error) {
      console.error('Erreur mise à jour paiement:', error);
      alert('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const sendReminder = async (bookingId: string) => {
    try {
      const response = await api.post(`/tourisme-bookings/${bookingId}/reminder`);
      if (response.data.success) {
        alert('Rappel envoyé avec succès');
      }
    } catch (error) {
      console.error('Erreur envoi rappel:', error);
      alert('Erreur lors de l\'envoi du rappel');
    }
  };

  const getStatusIcon = (status: TourismeBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TourismeBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: TourismeBooking['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'direct':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'airbnb':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'booking':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const exportToCSV = () => {
    const headers = [
      'Numéro Confirmation',
      'Client',
      'Email',
      'Téléphone',
      'Hébergement',
      'Type',
      'Destination',
      'Provider',
      'Arrivée',
      'Départ',
      'Nuits',
      'Adultes',
      'Enfants',
      'Bébés',
      'Total Voyageurs',
      'Montant Total',
      'Frais Service',
      'Statut',
      'Paiement',
      'Méthode Paiement',
      'Date Réservation'
    ];

    const csvData = sortedBookings.map(booking => [
      booking.confirmationNumber,
      booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Non renseigné',
      booking.user?.email || '',
      booking.user?.phone || '',
      booking.listing?.title || 'Non spécifié',
      booking.listing?.type || 'Non spécifié',
      booking.listing?.city || 'Non spécifié',
      booking.listing?.provider || 'Non spécifié',
      new Date(booking.checkIn).toLocaleDateString(),
      new Date(booking.checkOut).toLocaleDateString(),
      calculateNights(booking.checkIn, booking.checkOut),
      booking.adults,
      booking.children,
      booking.infants,
      booking.guests,
      `${booking.totalAmount}€`,
      `${booking.serviceFee}€`,
      booking.status,
      booking.paymentStatus,
      booking.paymentMethod,
      new Date(booking.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations-tourisme-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUniqueProviders = () => {
    const providers = bookings
      .map(b => b.listing?.provider)
      .filter(provider => provider !== undefined && provider !== null);
    
    return ['all', ...Array.from(new Set(providers))];
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return sortedBookings.filter(booking => {
      const checkIn = new Date(booking.checkIn);
      const timeDiff = checkIn.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 7 && daysDiff >= 0 && booking.status === 'confirmed';
    }).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4">
        {/* En-tête avec bouton rafraîchir */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Réservations Tourisme
            </h1>
            <p className="text-gray-600">
              Gérez et suivez toutes les réservations d'hébergements touristiques
            </p>
          </div>
          <button
            onClick={refreshBookings}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
          </button>
        </div>

        {/* Statistiques améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Réservations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((stats.confirmed / stats.total) * 100 || 0).toFixed(1)}% confirmées
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {((stats.pending / stats.total) * 100 || 0).toFixed(1)}% du total
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenu Total</p>
                <p className="text-3xl font-bold text-green-600">{stats.revenue.toFixed(2)}€</p>
                <p className="text-sm text-gray-500 mt-1">
                  Moyenne: {stats.averageBooking.toFixed(2)}€
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                <p className="text-3xl font-bold text-blue-600">
                  {(((stats.confirmed + stats.completed) / stats.total) * 100 || 0).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.cancelled} annulations
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prochaines 7j</p>
                <p className="text-3xl font-bold text-purple-600">{getUpcomingBookings()}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Arrivées à venir
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres améliorée */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par numéro, client, hébergement, ville..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
              </select>

              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              >
                <option value="all">Tous paiements</option>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="failed">Échoué</option>
                <option value="refunded">Remboursé</option>
              </select>

              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filters.provider}
                onChange={(e) => setFilters({ ...filters, provider: e.target.value })}
              >
                <option value="all">Tous providers</option>
                {getUniqueProviders().filter(p => p !== 'all').map(provider => (
                  <option key={provider} value={provider}>
                    {provider && provider.charAt ? provider.charAt(0).toUpperCase() + provider.slice(1) : 'Inconnu'}
                  </option>
                ))}
              </select>

              <select
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">Toutes dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="future">Futures</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </button>
            </div>
          </div>

          {/* Résultats filtres */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {filteredBookings.length} réservation(s) trouvée(s)
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Tableau des réservations amélioré */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('confirmationNumber')}
                  >
                    <div className="flex items-center">
                      N° Confirmation
                      {sortConfig.key === 'confirmationNumber' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client / Hébergement
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('checkIn')}
                  >
                    <div className="flex items-center">
                      Séjour
                      {sortConfig.key === 'checkIn' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Voyageurs
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('totalAmount')}
                  >
                    <div className="flex items-center">
                      Montant
                      {sortConfig.key === 'totalAmount' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Statuts
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900">
                        {booking.confirmationNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(booking.listing?.provider || 'unknown')} border`}>
                          <Building className="w-3 h-3 mr-1" />
                          {booking.listing?.provider || 'inconnu'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        {booking.listing?.images?.[0] && (
                          <img
                            src={booking.listing.images[0]}
                            alt={booking.listing.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">
                            {booking.listing?.title || 'Titre non disponible'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {booking.listing?.city || 'Ville non spécifiée'}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {booking.listing?.type || 'Non spécifié'}
                          </div>
                          {booking.user ? (
                            <div className="flex items-center mt-2 text-xs text-gray-600">
                              <UserIcon className="w-3 h-3 mr-1" />
                              {booking.user.firstName} {booking.user.lastName}
                              {booking.user.email && (
                                <a 
                                  href={`mailto:${booking.user.email}`}
                                  className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                                  title="Envoyer un email"
                                >
                                  <Mail className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 mt-1">
                              Client non connecté
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(booking.checkIn).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {calculateNights(booking.checkIn, booking.checkOut)} nuit(s)
                      </div>
                      {new Date(booking.checkIn) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                       new Date(booking.checkIn) >= new Date() && 
                       booking.status === 'confirmed' && (
                        <div className="text-xs text-orange-600 font-medium mt-1">
                          ⚠️ Arrive bientôt
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.guests} {booking.guests > 1 ? 'voyageurs' : 'voyageur'}
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>👤 {booking.adults} adulte(s)</div>
                        <div>🧒 {booking.children} enfant(s)</div>
                        {booking.infants > 0 && <div>👶 {booking.infants} bébé(s)</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-gray-900">
                        {booking.totalAmount}€
                      </div>
                      <div className="text-xs text-gray-500">
                        Dont {booking.serviceFee}€ de frais
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.paymentMethod === 'card' ? '💳 Carte' : '📱 PayPal'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)} border`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)} border`}>
                          <span className="capitalize">{booking.paymentStatus}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Confirmer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        {booking.user?.email && booking.status === 'confirmed' && (
                          <button
                            onClick={() => sendReminder(booking.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Envoyer un rappel"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedBookings.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
              <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </div>

        {/* Modal de détail */}
        {showDetailModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={() => setShowDetailModal(false)}
            onStatusUpdate={updateBookingStatus}
            onPaymentUpdate={updatePaymentStatus}
            calculateNights={calculateNights}
            onSendReminder={sendReminder}
          />
        )}
      </div>
    </div>
  );
};

// Composant Modal de Détail amélioré
const BookingDetailModal = ({ 
  booking, 
  onClose, 
  onStatusUpdate, 
  onPaymentUpdate,
  calculateNights,
  onSendReminder
}: {
  booking: TourismeBooking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: TourismeBooking['status']) => void;
  onPaymentUpdate: (id: string, paymentStatus: TourismeBooking['paymentStatus']) => void;
  calculateNights: (checkIn: string, checkOut: string) => number;
  onSendReminder: (id: string) => void;
}) => {
  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const isUpcoming = new Date(booking.checkIn) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                    new Date(booking.checkIn) >= new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Détails de la Réservation
              </h3>
              <p className="text-gray-600 mt-1">
                {booking.confirmationNumber} • Créée le {new Date(booking.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations réservation */}
            <div className="space-y-6">
              <Section title="Informations Réservation">
                <InfoRow label="Numéro de confirmation" value={booking.confirmationNumber} mono />
                <InfoRow label="Date de création" value={new Date(booking.createdAt).toLocaleString()} />
                <InfoRow label="Provider" value={booking.listing?.provider || 'Non spécifié'} badge />
                <InfoRow label="Méthode de paiement" value={booking.paymentMethod} />
                {booking.stripePaymentIntent && (
                  <InfoRow label="Stripe Payment Intent" value={booking.stripePaymentIntent} mono />
                )}
              </Section>

              <Section title="Statuts">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Statut réservation</span>
                    <StatusBadge status={booking.status} type="booking" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Statut paiement</span>
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                  </div>
                </div>
              </Section>

              <Section title="Dates du séjour">
                <div className="space-y-2">
                  <InfoRow label="Arrivée" value={new Date(booking.checkIn).toLocaleDateString()} />
                  <InfoRow label="Départ" value={new Date(booking.checkOut).toLocaleDateString()} />
                  <InfoRow label="Nombre de nuits" value={nights.toString()} />
                  <InfoRow label="Durée totale" value={`${nights} nuit(s)`} />
                  {isUpcoming && booking.status === 'confirmed' && (
                    <div className="bg-orange-50 p-3 rounded-lg mt-2">
                      <div className="flex items-center text-orange-800 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Arrivée prévue dans moins de 7 jours
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </div>

            {/* Informations client et hébergement */}
            <div className="space-y-6">
              <Section title="Informations Client">
                {booking.user ? (
                  <div className="space-y-3">
                    <InfoRow label="Nom complet" value={`${booking.user.firstName} ${booking.user.lastName}`} />
                    <InfoRow label="Email" value={
                      <a href={`mailto:${booking.user.email}`} className="text-blue-600 hover:text-blue-800">
                        {booking.user.email}
                      </a>
                    } />
                    {booking.user.phone && (
                      <InfoRow label="Téléphone" value={
                        <a href={`tel:${booking.user.phone}`} className="text-blue-600 hover:text-blue-800">
                          {booking.user.phone}
                        </a>
                      } />
                    )}
                    <InfoRow label="ID Utilisateur" value={booking.user.id} mono />
                    <div className="flex space-x-2 pt-2">
                      <a
                        href={`mailto:${booking.user.email}?subject=Réservation ${booking.confirmationNumber}`}
                        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Contacter
                      </a>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => onSendReminder(booking.id)}
                          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Rappel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Aucune information client disponible</p>
                    <p className="text-gray-400 text-xs">Réservation effectuée sans compte</p>
                  </div>
                )}
              </Section>

              <Section title="Hébergement">
                <div className="space-y-3">
                  <InfoRow label="Nom" value={booking.listing?.title || 'Non spécifié'} />
                  <InfoRow label="Type" value={booking.listing?.type || 'Non spécifié'} />
                  <InfoRow label="Destination" value={booking.listing?.city || 'Non spécifié'} />
                  <InfoRow label="Prix par nuit" value={`${booking.listing?.price || 0}€`} />
                  <InfoRow 
                    label="Note" 
                    value={booking.listing?.rating ? 
                      `${booking.listing.rating} ⭐ (${booking.listing.reviewCount || 0} avis)` : 
                      'Aucune note'} 
                  />
                </div>
              </Section>

              <Section title="Détails Financiers">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix du séjour ({nights} nuits)</span>
                    <span className="font-medium">
                      {((booking.totalAmount - booking.serviceFee) / nights).toFixed(2)}€ × {nights} = {(booking.totalAmount - booking.serviceFee).toFixed(2)}€
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="font-medium">{booking.serviceFee}€</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200 text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{booking.totalAmount}€</span>
                  </div>
                </div>
              </Section>
            </div>
          </div>

          {/* Demandes spéciales */}
          {booking.specialRequests && (
            <Section title="Demandes Spéciales" className="mt-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm">{booking.specialRequests}</p>
              </div>
            </Section>
          )}

          {/* Détails voyageurs */}
          <Section title="Détails des Voyageurs" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{booking.guests}</div>
                <div className="text-sm text-gray-600">Total voyageurs</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{booking.adults}</div>
                <div className="text-sm text-gray-600">Adultes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{booking.children}</div>
                <div className="text-sm text-gray-600">Enfants</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-900">{booking.infants}</div>
                <div className="text-sm text-gray-600">Bébés</div>
              </div>
            </div>
          </Section>

          {/* Actions améliorées */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-sm text-gray-500">
                <div>Dernière modification: {new Date(booking.updatedAt).toLocaleString()}</div>
                {booking.cancelledAt && (
                  <div>Annulée le: {new Date(booking.cancelledAt).toLocaleString()}</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {booking.status === 'pending' && (
                  <button
                    onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Confirmer la réservation
                  </button>
                )}
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                  >
                    Annuler la réservation
                  </button>
                )}
                {booking.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => onPaymentUpdate(booking.id, 'paid')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Marquer comme payé
                  </button>
                )}
                {booking.user?.email && booking.status === 'confirmed' && (
                  <button
                    onClick={() => onSendReminder(booking.id)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                  >
                    Envoyer un rappel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composants helper
const Section = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={className}>
    <h4 className="text-lg font-semibold text-gray-900 mb-4">{title}</h4>
    {children}
  </div>
);

const InfoRow = ({ label, value, mono = false, badge = false }: { label: string; value: React.ReactNode; mono?: boolean; badge?: boolean }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm font-medium text-gray-600">{label}</span>
    <span className={`text-sm text-gray-900 ${mono ? 'font-mono' : ''} ${badge ? 'px-2 py-1 bg-gray-100 rounded-full' : ''}`}>
      {value}
    </span>
  </div>
);

const StatusBadge = ({ status, type }: { status: string; type: 'booking' | 'payment' }) => {
  const getColors = () => {
    if (type === 'booking') {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800 border-green-200';
        case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'failed': return 'bg-red-100 text-red-800 border-red-200';
        case 'refunded': return 'bg-purple-100 text-purple-800 border-purple-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColors()}`}>
      {type === 'booking' && getStatusIcon(status)}
      <span className="ml-1 capitalize">{status}</span>
    </span>
  );
};

export default AdminBookings;