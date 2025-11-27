// components/admin/ProTouristicPlaceBookings.tsx
import { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, Users, MapPin, DollarSign,
  CheckCircle, XCircle, Clock, AlertCircle, Download,
  Eye, ChevronDown, ChevronUp, Mail, Phone, Ticket,
  Building, User as UserIcon, RefreshCw, MessageCircle,
  Star, Landmark, Castle, Church, BookOpen, GalleryVerticalEnd,
  QrCode, CreditCard, UserCheck
} from 'lucide-react';
import { touristicPlaceBookingsAPI, tourismeAPI } from '../../lib/api';

interface TouristicPlaceBooking {
  id: string;
  confirmationNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  visitDate: string;
  visitTime: string;
  numberOfTickets: number;
  ticketType: 'adult' | 'child' | 'student' | 'senior';
  totalAmount: number;
  serviceFee: number;
  specialRequests?: string;
  paymentMethod: string;
  stripePaymentIntent?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  place: {
    id: string;
    title: string;
    type: string;
    category: string;
    city: string;
    images: string[];
    price: number;
    openingHours: string;
    maxGuests: number;
    idPrestataire: string;
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
  totalTickets: number;
  occupancyRate: number;
}

export const ProTouristicPlaceBookings = () => {
  const [bookings, setBookings] = useState<TouristicPlaceBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<TouristicPlaceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
    averageBooking: 0,
    totalTickets: 0,
    occupancyRate: 0,
  });
  const [selectedBooking, setSelectedBooking] = useState<TouristicPlaceBooking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    paymentStatus: "all",
    dateRange: "all",
    ticketType: "all",
    placeId: "all",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TouristicPlaceBooking;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [userPlaces, setUserPlaces] = useState<any[]>([]);

  // Charger les lieux du prestataire et les réservations
  useEffect(() => {
    fetchUserPlacesAndBookings();
  }, []);

  const fetchUserPlacesAndBookings = async () => {
    try {
      setLoading(true);
      
      const prestataireId = localStorage.getItem('userId');
      
      if (!prestataireId) {
        console.error('❌ Aucun ID prestataire trouvé');
        return;
      }

      // 1. Charger les lieux touristiques du prestataire
      const placesResponse = await tourismeAPI.getTouristicPlaces();
      const userPlacesData = placesResponse.data.data.filter(
        (place: any) => place.idPrestataire === prestataireId
      );
      
      setUserPlaces(userPlacesData);

      if (userPlacesData.length === 0) {
        setBookings([]);
        setFilteredBookings([]);
        calculateStats([]);
        return;
      }

      // 2. Charger les réservations pour ces lieux
      const placeIds = userPlacesData.map((place: any) => place.id);
      const bookingsResponse = await touristicPlaceBookingsAPI.getBookings({
        prestataireId,
        limit: 1000
      });

      if (bookingsResponse.data.success) {
        const bookingsData = bookingsResponse.data.data;
        const userBookings = bookingsData.filter((booking: TouristicPlaceBooking) => 
          placeIds.includes(booking.place.id)
        );
        
        setBookings(userBookings);
        setFilteredBookings(userBookings);
        calculateStats(userBookings, userPlacesData);
      }
    } catch (error) {
      console.error("❌ Erreur chargement réservations:", error);
      // Données mockées pour le développement
      const mockData = getMockBookings();
      setBookings(mockData);
      setFilteredBookings(mockData);
      calculateStats(mockData, getMockPlaces());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Données mockées pour le développement
  const getMockPlaces = () => [
    {
      id: 'p1',
      title: 'Château de Versailles',
      type: 'touristic_place',
      category: 'monument',
      city: 'Versailles',
      images: ['https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg'],
      price: 20,
      openingHours: '9:00-18:30',
      maxGuests: 100,
      idPrestataire: localStorage.getItem('userId') || 'prestataire-1'
    },
    {
      id: 'p2',
      title: 'Musée du Louvre',
      type: 'touristic_place',
      category: 'museum',
      city: 'Paris',
      images: ['https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg'],
      price: 17,
      openingHours: '9:00-18:00',
      maxGuests: 200,
      idPrestataire: localStorage.getItem('userId') || 'prestataire-1'
    }
  ];

  const getMockBookings = (): TouristicPlaceBooking[] => [
    {
      id: '1',
      confirmationNumber: 'TPL-2024-001',
      status: 'confirmed',
      paymentStatus: 'paid',
      visitDate: '2024-12-15',
      visitTime: '14:00',
      numberOfTickets: 4,
      ticketType: 'adult',
      totalAmount: 80,
      serviceFee: 8,
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      place: getMockPlaces()[0],
      user: {
        id: 'u1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33123456789'
      }
    },
    {
      id: '2',
      confirmationNumber: 'TPL-2024-002',
      status: 'pending',
      paymentStatus: 'pending',
      visitDate: '2024-12-20',
      visitTime: '10:00',
      numberOfTickets: 2,
      ticketType: 'student',
      totalAmount: 28,
      serviceFee: 2.8,
      paymentMethod: 'cash',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      place: getMockPlaces()[1],
      user: {
        id: 'u2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '+33987654321'
      }
    }
  ];

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchUserPlacesAndBookings();
  };

  const calculateStats = (bookingsData: TouristicPlaceBooking[], places: any[] = []) => {
    const confirmedAndCompleted = bookingsData.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );
    const totalTickets = bookingsData.reduce(
      (sum, b) => sum + b.numberOfTickets,
      0
    );

    const totalCapacity = places.reduce((sum, place) => sum + (place.maxGuests || 0), 0);
    const occupancyRate = totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter((b) => b.status === "pending").length,
      confirmed: bookingsData.filter((b) => b.status === "confirmed").length,
      cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
      completed: bookingsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking: confirmedAndCompleted.length > 0 ? totalRevenue / confirmedAndCompleted.length : 0,
      totalTickets,
      occupancyRate
    };
    setStats(statsData);
  };

  // Appliquer les filtres
  useEffect(() => {
    let results = bookings;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(
        (booking) =>
          booking.confirmationNumber.toLowerCase().includes(searchLower) ||
          booking.place?.title?.toLowerCase().includes(searchLower) ||
          booking.user?.firstName?.toLowerCase().includes(searchLower) ||
          booking.user?.lastName?.toLowerCase().includes(searchLower) ||
          booking.user?.email?.toLowerCase().includes(searchLower) ||
          booking.place?.city?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status !== "all") {
      results = results.filter((booking) => booking.status === filters.status);
    }

    if (filters.paymentStatus !== "all") {
      results = results.filter(
        (booking) => booking.paymentStatus === filters.paymentStatus
      );
    }

    if (filters.ticketType !== "all") {
      results = results.filter(
        (booking) => booking.ticketType === filters.ticketType
      );
    }

    if (filters.placeId !== "all") {
      results = results.filter(
        (booking) => booking.place.id === filters.placeId
      );
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      results = results.filter((booking) => {
        const visitDate = new Date(booking.visitDate);
        switch (filters.dateRange) {
          case "today":
            return visitDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return visitDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return visitDate >= monthAgo;
          case "future":
            return visitDate > now;
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
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: keyof TouristicPlaceBooking) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: TouristicPlaceBooking["status"]
  ) => {
    try {
      const response = await touristicPlaceBookingsAPI.updateStatus(bookingId, {
        status,
      });

      if (response.data.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? response.data.data : booking
          )
        );
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(response.data.data);
        }
        calculateStats(
          bookings.map((b) => (b.id === bookingId ? response.data.data : b)),
          userPlaces
        );
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour statut:", error);
    }
  };

  const updatePaymentStatus = async (
    bookingId: string,
    paymentStatus: TouristicPlaceBooking["paymentStatus"]
  ) => {
    try {
      const response = await touristicPlaceBookingsAPI.updateStatus(bookingId, {
        paymentStatus,
      });

      if (response.data.success) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? response.data.data : booking
          )
        );
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(response.data.data);
        }
      }
    } catch (error) {
      console.error("❌ Erreur mise à jour paiement:", error);
    }
  };

  const sendReminder = async (bookingId: string) => {
    try {
      console.log('📨 Envoi rappel pour réservation:', bookingId);
    } catch (error) {
      console.error("❌ Erreur envoi rappel:", error);
    }
  };

  const generateQRCode = (booking: TouristicPlaceBooking) => {
    const qrData = {
      confirmationNumber: booking.confirmationNumber,
      place: booking.place.title,
      date: booking.visitDate,
      time: booking.visitTime,
      tickets: booking.numberOfTickets,
      type: booking.ticketType
    };
    
    const qrString = JSON.stringify(qrData);
    console.log('🎫 QR Code data:', qrString);
  };

  const getStatusIcon = (status: TouristicPlaceBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TouristicPlaceBooking["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: TouristicPlaceBooking["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case 'adult': return 'Adulte';
      case 'child': return 'Enfant';
      case 'student': return 'Étudiant';
      case 'senior': return 'Senior';
      default: return type;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monument':
        return <Landmark className="w-4 h-4 text-purple-600" />;
      case 'museum':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'park':
        return <GalleryVerticalEnd className="w-4 h-4 text-green-600" />;
      case 'religious':
        return <Church className="w-4 h-4 text-indigo-600" />;
      case 'historical':
        return <Castle className="w-4 h-4 text-cyan-600" />;
      case 'cultural':
        return <BookOpen className="w-4 h-4 text-lime-600" />;
      default:
        return <GalleryVerticalEnd className="w-4 h-4 text-gray-600" />;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Numéro Confirmation",
      "Client",
      "Email",
      "Téléphone",
      "Lieu Touristiques",
      "Catégorie",
      "Ville",
      "Date Visite",
      "Heure Visite",
      "Nombre Billets",
      "Type Billet",
      "Montant Total",
      "Frais Service",
      "Statut",
      "Paiement",
      "Méthode Paiement",
      "Date Réservation",
    ];

    const csvData = sortedBookings.map((booking) => [
      booking.confirmationNumber,
      booking.user
        ? `${booking.user.firstName} ${booking.user.lastName}`
        : "Non renseigné",
      booking.user?.email || "",
      booking.user?.phone || "",
      booking.place?.title || "Non spécifié",
      booking.place?.category || "Non spécifié",
      booking.place?.city || "Non spécifié",
      new Date(booking.visitDate).toLocaleDateString(),
      booking.visitTime,
      booking.numberOfTickets,
      getTicketTypeLabel(booking.ticketType),
      `${booking.totalAmount}€`,
      `${booking.serviceFee}€`,
      booking.status,
      booking.paymentStatus,
      booking.paymentMethod,
      new Date(booking.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations-mes-lieux-touristiques-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return sortedBookings.filter((booking) => {
      const visitDate = new Date(booking.visitDate);
      const timeDiff = visitDate.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 7 && daysDiff >= 0 && booking.status === "confirmed";
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
              Réservations de mes Lieux Touristiques
            </h1>
            <p className="text-gray-600">
              Gérez les réservations de billets pour vos lieux touristiques créés
            </p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <UserCheck className="w-4 h-4 mr-2" />
              {userPlaces.length} lieu(x) touristique(s) créé(s)
            </div>
          </div>
          <button
            onClick={refreshBookings}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Rafraîchissement..." : "Rafraîchir"}
          </button>
        </div>

        {/* Message si aucun lieu créé */}
        {userPlaces.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Aucun lieu touristique créé
                </h3>
                <p className="text-yellow-700 mt-1">
                  Vous devez créer des lieux touristiques pour recevoir des réservations.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/tourisme'}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Créer un lieu touristique
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques améliorées pour lieux touristiques */}
        {userPlaces.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Réservations
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.total}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {stats.totalTickets} billets vendus
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">En Attente</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Revenu Total
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.revenue.toFixed(2)}€
                    </p>
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
                    <p className="text-sm font-medium text-gray-600">
                      Taux d'Occupation
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {stats.occupancyRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Capacité utilisée
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Prochaines 7j
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {getUpcomingBookings()}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Visites à venir</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par numéro, client, lieu touristique, ville..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.placeId}
                    onChange={(e) =>
                      setFilters({ ...filters, placeId: e.target.value })
                    }
                  >
                    <option value="all">Tous les lieux</option>
                    {userPlaces.map((place) => (
                      <option key={place.id} value={place.id}>
                        {place.title}
                      </option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFilters({ ...filters, paymentStatus: e.target.value })
                    }
                  >
                    <option value="all">Tous paiements</option>
                    <option value="pending">En attente</option>
                    <option value="paid">Payé</option>
                    <option value="failed">Échoué</option>
                    <option value="refunded">Remboursé</option>
                  </select>

                  <select
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.ticketType}
                    onChange={(e) =>
                      setFilters({ ...filters, ticketType: e.target.value })
                    }
                  >
                    <option value="all">Tous types</option>
                    <option value="adult">Adulte</option>
                    <option value="child">Enfant</option>
                    <option value="student">Étudiant</option>
                    <option value="senior">Senior</option>
                  </select>

                  <select
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
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
                  {filteredBookings.length} réservation(s) trouvée(s) sur {userPlaces.length} lieu(x)
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Dernière mise à jour: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Tableau des réservations */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("confirmationNumber")}
                      >
                        <div className="flex items-center">
                          N° Confirmation
                          {sortConfig.key === "confirmationNumber" &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Client / Lieu
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("visitDate")}
                      >
                        <div className="flex items-center">
                          Date & Heure
                          {sortConfig.key === "visitDate" &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Billets
                      </th>
                      <th
                        className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort("totalAmount")}
                      >
                        <div className="flex items-center">
                          Montant
                          {sortConfig.key === "totalAmount" &&
                            (sortConfig.direction === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
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
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-bold text-gray-900">
                            {booking.confirmationNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            {booking.place?.images?.[0] && (
                              <img
                                src={booking.place.images[0]}
                                alt={booking.place.title}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                {booking.place?.title || "Titre non disponible"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center mt-1">
                                {getCategoryIcon(booking.place?.category)}
                                <span className="ml-1 capitalize">{booking.place?.category}</span>
                                <MapPin className="w-3 h-3 ml-2 mr-1" />
                                {booking.place?.city || "Ville non spécifiée"}
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
                            {new Date(booking.visitDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.visitTime}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.place?.openingHours}
                          </div>
                          {new Date(booking.visitDate) <=
                            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
                            new Date(booking.visitDate) >= new Date() &&
                            booking.status === "confirmed" && (
                              <div className="text-xs text-orange-600 font-medium mt-1">
                                ⚠️ Visite prochaine
                              </div>
                            )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.numberOfTickets} billet(s)
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {getTicketTypeLabel(booking.ticketType)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.place?.maxGuests} places max
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
                            {booking.paymentMethod === "card"
                              ? "💳 Carte"
                              : "💵 Sur place"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )} border`}
                            >
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">
                                {booking.status}
                              </span>
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                booking.paymentStatus
                              )} border`}
                            >
                              <span className="capitalize">
                                {booking.paymentStatus}
                              </span>
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
                            
                            {booking.status === "confirmed" && (
                              <button
                                onClick={() => generateQRCode(booking)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Générer QR Code"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>
                            )}
                            
                            {booking.status === "pending" && (
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking.id, "confirmed")
                                }
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Confirmer"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            {booking.status !== "cancelled" && booking.status !== "completed" && (
                              <button
                                onClick={() =>
                                  updateBookingStatus(booking.id, "cancelled")
                                }
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Annuler"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            {booking.user?.email &&
                              booking.status === "confirmed" && (
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

              {sortedBookings.length === 0 && userPlaces.length > 0 && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    Aucune réservation trouvée pour vos lieux
                  </p>
                  <p className="text-gray-400">
                    Les réservations de vos clients apparaîtront ici
                  </p>
                </div>
              )}
            </div>

            {/* Modal de détail */}
            {showDetailModal && selectedBooking && (
              <TouristicPlaceBookingDetailModal
                booking={selectedBooking}
                onClose={() => setShowDetailModal(false)}
                onStatusUpdate={updateBookingStatus}
                onPaymentUpdate={updatePaymentStatus}
                onSendReminder={sendReminder}
                onGenerateQRCode={generateQRCode}
                getTicketTypeLabel={getTicketTypeLabel}
                getCategoryIcon={getCategoryIcon}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Composant Modal de Détail
const TouristicPlaceBookingDetailModal = ({ 
  booking, 
  onClose, 
  onStatusUpdate, 
  onPaymentUpdate,
  onSendReminder,
  onGenerateQRCode,
  getTicketTypeLabel,
  getCategoryIcon
}: {
  booking: TouristicPlaceBooking;
  onClose: () => void;
  onStatusUpdate: (id: string, status: TouristicPlaceBooking['status']) => void;
  onPaymentUpdate: (id: string, paymentStatus: TouristicPlaceBooking['paymentStatus']) => void;
  onSendReminder: (id: string) => void;
  onGenerateQRCode: (booking: TouristicPlaceBooking) => void;
  getTicketTypeLabel: (type: string) => string;
  getCategoryIcon: (category: string) => JSX.Element;
}) => {
  const isUpcoming = new Date(booking.visitDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
                    new Date(booking.visitDate) >= new Date();

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

              <Section title="Détails de la visite">
                <div className="space-y-2">
                  <InfoRow label="Date de visite" value={new Date(booking.visitDate).toLocaleDateString()} />
                  <InfoRow label="Heure de visite" value={booking.visitTime} />
                  <InfoRow label="Horaires d'ouverture" value={booking.place?.openingHours || 'Non spécifié'} />
                  {isUpcoming && booking.status === 'confirmed' && (
                    <div className="bg-orange-50 p-3 rounded-lg mt-2">
                      <div className="flex items-center text-orange-800 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Visite prévue dans moins de 7 jours
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </div>

            {/* Informations client et lieu */}
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

              <Section title="Lieu Touristiques">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(booking.place?.category)}
                    <InfoRow label="Nom" value={booking.place?.title || 'Non spécifié'} />
                  </div>
                  <InfoRow label="Catégorie" value={booking.place?.category || 'Non spécifié'} />
                  <InfoRow label="Ville" value={booking.place?.city || 'Non spécifié'} />
                  <InfoRow label="Prix billet adulte" value={`${booking.place?.price || 0}€`} />
                  <InfoRow label="Capacité maximale" value={`${booking.place?.maxGuests || 0} personnes`} />
                </div>
              </Section>

              <Section title="Détails Financiers">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prix des billets ({booking.numberOfTickets}x)</span>
                    <span className="font-medium">
                      {(booking.totalAmount - booking.serviceFee).toFixed(2)}€
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

          {/* Détails billets */}
          <Section title="Détails des Billets" className="mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{booking.numberOfTickets}</div>
                  <div className="text-sm text-gray-600">Total billets</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 capitalize">
                    {getTicketTypeLabel(booking.ticketType)}
                  </div>
                  <div className="text-sm text-gray-600">Type de billet</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {booking.place?.price || 0}€
                  </div>
                  <div className="text-sm text-gray-600">Prix unitaire</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {(booking.totalAmount - booking.serviceFee).toFixed(2)}€
                  </div>
                  <div className="text-sm text-gray-600">Sous-total</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="text-sm text-gray-500">
                <div>Dernière modification: {new Date(booking.updatedAt).toLocaleString()}</div>
                {booking.cancelledAt && (
                  <div>Annulée le: {new Date(booking.cancelledAt).toLocaleString()}</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => onGenerateQRCode(booking)}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Générer QR Code
                  </button>
                )}
                {booking.status === 'pending' && (
                  <button
                    onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Confirmer la réservation
                  </button>
                )}
                {booking.status !== 'cancelled' && booking.status !== 'completed' && (
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

export default ProTouristicPlaceBookings;