import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Users,
  Clock,
  CheckSquare,
  X,
  Loader,
  Filter,
  Calendar,
  Tag,
  DollarSign,
  Package
} from "lucide-react";
import api from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.js";

// Types pour les réservations basés sur l'API
interface Service {
  id: string;
  libelle: string;
  price: number;
  duration: number;
  description?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  user: User;
  service: Service;
  createdAt: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Appointment[];
  message?: string;
}

interface ServiceApiResponse {
  success: boolean;
  count: number;
  data: Service[];
  message?: string;
}

const ReservationTable: React.FC = () => {
  const [reservations, setReservations] = useState<Appointment[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Appointment[]>([]);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Filtres
  const [filters, setFilters] = useState({
    status: "all",
    serviceId: "all",
    dateFrom: "",
    dateTo: ""
  });
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer les services de l'utilisateur
  const fetchUserServices = async () => {
    try {
      setLoadingServices(true);
      const response = await api.get<ServiceApiResponse>("/bienetre/my-services-list");

      if (response.data.success) {
        setUserServices(response.data.data);
        // console.log("📋 Services de l'utilisateur:", response.data.data);
      } else {
        setError(response.data.message || "Erreur lors de la récupération des services");
      }
    } catch (err: any) {
      console.error("Erreur récupération services:", err);
      setError(err.response?.data?.message || "Erreur lors de la récupération des services");
    } finally {
      setLoadingServices(false);
    }
  };

  // Récupérer les réservations pour les services de l'utilisateur
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse>("/bienetre/my-appointments");

      if (response.data.success) {
        setReservations(response.data.data);
        setFilteredReservations(response.data.data);
        // console.log("📋 Réservations récupérées:", response.data.data);
      } else {
        setError(
          response.data.message ||
          "Erreur lors de la récupération des réservations"
        );
      }
    } catch (err: any) {
      console.error("Erreur récupération réservations:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la récupération des réservations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserServices();
    fetchReservations();
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...reservations];

    // Filtrer par statut
    if (filters.status !== "all") {
      filtered = filtered.filter(res => res.status === filters.status);
    }

    // Filtrer par service
    if (filters.serviceId !== "all") {
      filtered = filtered.filter(res => res.service.id === filters.serviceId);
    }

    // Filtrer par date de début
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(res => new Date(res.date) >= fromDate);
    }

    // Filtrer par date de fin
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Fin de journée
      filtered = filtered.filter(res => new Date(res.date) <= toDate);
    }

    setFilteredReservations(filtered);
  }, [filters, reservations]);

  // Fonctions de gestion des actions
  const handleConfirm = async (id: string) => {
    try {
      const response = await api.put(`/bienetre/appointments/${id}`, {
        status: "confirmed"
      });

      if (response.data.success) {
        setReservations(prev =>
          prev.map(res =>
            res.id === id ? { ...res, status: "confirmed" as const } : res
          )
        );
        alert("Réservation confirmée avec succès!");
      } else {
        alert("Erreur lors de la confirmation");
      }
    } catch (err: any) {
      console.error("Erreur confirmation:", err);
      alert(err.response?.data?.message || "Erreur lors de la confirmation");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      const response = await api.put(`/bienetre/appointments/${id}`, {
        status: "cancelled"
      });

      if (response.data.success) {
        setReservations(prev =>
          prev.map(res =>
            res.id === id ? { ...res, status: "cancelled" as const } : res
          )
        );
        alert("Réservation annulée avec succès!");
      } else {
        alert("Erreur lors de l'annulation");
      }
    } catch (err: any) {
      console.error("Erreur annulation:", err);
      alert(err.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await api.put(`/bienetre/appointments/${id}`, {
        status: "completed"
      });

      if (response.data.success) {
        setReservations(prev =>
          prev.map(res =>
            res.id === id ? { ...res, status: "completed" as const } : res
          )
        );
        alert("Réservation marquée comme terminée!");
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (err: any) {
      console.error("Erreur complétion:", err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const handleShowDetails = (reservation: Appointment) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const resetFilters = () => {
    setFilters({
      status: "all",
      serviceId: "all",
      dateFrom: "",
      dateTo: ""
    });
  };

  // Calcul des statistiques
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
    completed: reservations.filter((r) => r.status === "completed").length,
  };

  // Calcul du revenu total
  const totalRevenue = reservations
    .filter(r => r.status === "confirmed" || r.status === "completed")
    .reduce((sum, res) => sum + (res.service.price || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "cancelled":
        return "Annulée";
      case "completed":
        return "Terminée";
      default:
        return "En attente";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading || loadingServices) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">
          Chargement des données...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => {
            fetchUserServices();
            fetchReservations();
          }}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec informations utilisateur */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Gestion des Réservations
          </h1>
          <p className="text-gray-600">
            {user?.firstName} {user?.lastName} - {user?.email}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {userServices.length} service{userServices.length > 1 ? 's' : ''} en ligne
            </span>
          </div>
        </div>

        {/* Section Statistiques améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {/* Carte Total Réservations */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Réservations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Pour tous vos services</p>
            </div>
          </div>

          {/* Carte En Attente */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                À confirmer
              </p>
            </div>
          </div>

          {/* Carte Confirmées */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmed}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Réservations validées
              </p>
            </div>
          </div>

          {/* Carte Terminées */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Séances effectuées
              </p>
            </div>
          </div>

          {/* Carte Revenu */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRevenue}€
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                Total des réservations payantes
              </p>
            </div>
          </div>
        </div>

        {/* Section Filtres */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre par statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="completed">Terminées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>

              {/* Filtre par service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service
                </label>
                <select
                  value={filters.serviceId}
                  onChange={(e) => setFilters({ ...filters, serviceId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les services</option>
                  {userServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.libelle} ({service.price}€)
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par date de début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  À partir du
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filtre par date de fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jusqu'au
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Boutons de contrôle des filtres */}
              <div className="col-span-full flex gap-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
          )}

          {/* Résumé des filtres */}
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.status !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Statut: {getStatusText(filters.status)}
              </span>
            )}
            {filters.serviceId !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Service: {userServices.find(s => s.id === filters.serviceId)?.libelle}
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                <Calendar className="w-3 h-3 mr-1" />
                À partir du: {new Date(filters.dateFrom).toLocaleDateString('fr-FR')}
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                <Calendar className="w-3 h-3 mr-1" />
                Jusqu'au: {new Date(filters.dateTo).toLocaleDateString('fr-FR')}
              </span>
            )}
            {filteredReservations.length !== reservations.length && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                {filteredReservations.length} résultat{filteredReservations.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Message si pas de services */}
        {userServices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucun service en ligne
            </h3>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore créé de services. Les réservations apparaîtront ici lorsque vous aurez ajouté des services.
            </p>
            <button
              onClick={() => window.location.href = '/dashboard/services'}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Tag className="w-4 h-4 mr-2" />
              Ajouter un service
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune réservation trouvée
            </h3>
            <p className="text-gray-600 mb-4">
              {filters.status !== "all" || filters.serviceId !== "all" || filters.dateFrom || filters.dateTo
                ? "Aucune réservation ne correspond à vos filtres"
                : "Aucun client n'a encore réservé vos services"}
            </p>
            {(filters.status !== "all" || filters.serviceId !== "all" || filters.dateFrom || filters.dateTo) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Tableau desktop */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.user.firstName} {reservation.user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.service.libelle}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.service.duration} min -{" "}
                          {reservation.service.price}€
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatShortDate(reservation.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(reservation.time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            reservation.status
                          )}`}
                        >
                          {getStatusText(reservation.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {reservation.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleConfirm(reservation.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Confirmer
                              </button>
                              <button
                                onClick={() => handleCancel(reservation.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Refuser
                              </button>
                            </>
                          )}
                          {reservation.status === "confirmed" && (
                            <button
                              onClick={() => handleComplete(reservation.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Terminer
                            </button>
                          )}
                          <button
                            onClick={() => handleShowDetails(reservation)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vue mobile */}
            <div className="lg:hidden space-y-4">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-lg shadow p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reservation.user.firstName} {reservation.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {reservation.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.user.phone}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-medium">Service:</span>{" "}
                      {reservation.service.libelle}
                    </div>
                    <div>
                      <span className="font-medium">Durée:</span>{" "}
                      {reservation.service.duration} min
                    </div>
                    <div>
                      <span className="font-medium">Prix:</span>{" "}
                      {reservation.service.price}€
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>{" "}
                      {formatShortDate(reservation.date)}
                    </div>
                    <div>
                      <span className="font-medium">Heure:</span>{" "}
                      {formatTime(reservation.time)}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {reservation.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirm(reservation.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Refuser
                        </button>
                      </>
                    )}
                    {reservation.status === "confirmed" && (
                      <button
                        onClick={() => handleComplete(reservation.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Terminer
                      </button>
                    )}
                    <button
                      onClick={() => handleShowDetails(reservation)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal de détails */}
        {showDetails && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Détails de la réservation</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold">Client:</span>{" "}
                  {selectedReservation.user.firstName}{" "}
                  {selectedReservation.user.lastName}
                </div>
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedReservation.user.email}
                </div>
                <div>
                  <span className="font-semibold">Téléphone:</span>{" "}
                  {selectedReservation.user.phone}
                </div>
                <div>
                  <span className="font-semibold">Service:</span>{" "}
                  {selectedReservation.service.libelle}
                </div>
                <div>
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedReservation.service.description || "Non spécifiée"}
                </div>
                <div>
                  <span className="font-semibold">Durée:</span>{" "}
                  {selectedReservation.service.duration} minutes
                </div>
                <div>
                  <span className="font-semibold">Prix:</span>{" "}
                  {selectedReservation.service.price}€
                </div>
                <div>
                  <span className="font-semibold">Date:</span>{" "}
                  {formatDate(selectedReservation.date)}
                </div>
                <div>
                  <span className="font-semibold">Heure:</span>{" "}
                  {formatTime(selectedReservation.time)}
                </div>
                <div>
                  <span className="font-semibold">Statut:</span>{" "}
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      selectedReservation.status
                    )}`}
                  >
                    {getStatusText(selectedReservation.status)}
                  </span>
                </div>
                {selectedReservation.message && (
                  <div>
                    <span className="font-semibold">Message:</span>{" "}
                    <p className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      {selectedReservation.message}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Réservation créée le:</span>{" "}
                  {new Date(selectedReservation.createdAt).toLocaleDateString(
                    "fr-FR"
                  )} à {new Date(selectedReservation.createdAt).toLocaleTimeString("fr-FR")}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2">
                {selectedReservation.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleConfirm(selectedReservation.id);
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        handleCancel(selectedReservation.id);
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      Refuser
                    </button>
                  </>
                )}
                {selectedReservation.status === "confirmed" && (
                  <button
                    onClick={() => {
                      handleComplete(selectedReservation.id);
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Marquer comme terminé
                  </button>
                )}
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationTable;