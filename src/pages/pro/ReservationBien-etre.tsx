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
} from "lucide-react";
import api from "../../lib/api.js";
import { useAuth } from "../../hooks/useAuth.js";

// Types pour les réservations basés sur l'API
interface Service {
  id: string;
  libelle: string;
  price: number;
  duration: number;
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
  status: "pending" | "confirmed" | "cancelled";
  user: User;
  service: Service;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: Appointment[];
  message?: string;
}

const ReservationTable: React.FC = () => {
  const [reservations, setReservations] = useState<Appointment[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<Appointment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Récupérer les réservations depuis l'API
  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse>("/bienetre/my-services");

      if (response.data.success) {
        setReservations(response.data.data);
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
    fetchReservations();
  }, []);

  // Fonctions de gestion des actions
  const handleConfirm = async (id: string) => {
    try {
      // Ici vous devriez appeler votre API pour confirmer la réservation
      // Pour l'instant, on met à jour localement
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "confirmed" as const } : res
        )
      );

      // Exemple d'appel API pour confirmer :
      // await api.put(`/bienetre/appointments/${id}/confirm`);
    } catch (err: any) {
      console.error("Erreur confirmation:", err);
      setError("Erreur lors de la confirmation de la réservation");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      // Ici vous devriez appeler votre API pour annuler la réservation
      // Pour l'instant, on met à jour localement
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: "cancelled" as const } : res
        )
      );

      // Exemple d'appel API pour annuler :
      // await api.put(`/bienetre/appointments/${id}/cancel`);
    } catch (err: any) {
      console.error("Erreur annulation:", err);
      setError("Erreur lors de l'annulation de la réservation");
    }
  };

  const handleShowDetails = (reservation: Appointment) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  // Calcul des statistiques
  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
      default:
        return "En attente";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">
          Chargement des réservations...
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
          onClick={fetchReservations}
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Gestion des Réservations
        </h1>

        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Carte Total Réservations */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Réservations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Toutes vos réservations</p>
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
                {stats.pending > 0
                  ? `${stats.pending} à confirmer`
                  : "Aucune en attente"}
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
                {stats.confirmed > 0
                  ? `${Math.round(
                      (stats.confirmed / stats.total) * 100
                    )}% du total`
                  : "Aucune confirmée"}
              </p>
            </div>
          </div>

          {/* Carte Annulées */}
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annulées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.cancelled}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                {stats.cancelled > 0
                  ? `${Math.round(
                      (stats.cancelled / stats.total) * 100
                    )}% du total`
                  : "Aucune annulée"}
              </p>
            </div>
          </div>
        </div>

        {/* Tableau desktop */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          {reservations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Aucune réservation trouvée
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Les réservations de vos services apparaîtront ici
              </p>
            </div>
          ) : (
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
                {reservations.map((reservation) => (
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
                        {formatDate(reservation.date)}
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
                          <button
                            onClick={() => handleConfirm(reservation.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => handleShowDetails(reservation)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Détails
                        </button>
                        {reservation.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Vue mobile */}
        <div className="lg:hidden space-y-4">
          {reservations.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Aucune réservation trouvée
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Les réservations de vos services apparaîtront ici
              </p>
            </div>
          ) : (
            reservations.map((reservation) => (
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
                    {formatDate(reservation.date)}
                  </div>
                  <div>
                    <span className="font-medium">Heure:</span>{" "}
                    {formatTime(reservation.time)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {reservation.status === "pending" && (
                    <button
                      onClick={() => handleConfirm(reservation.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Confirmer
                    </button>
                  )}
                  <button
                    onClick={() => handleShowDetails(reservation)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Détails
                  </button>
                  {reservation.status !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(reservation.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de détails */}
        {showDetails && selectedReservation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
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
                <div>
                  <span className="font-semibold">Réservation créée le:</span>{" "}
                  {new Date(selectedReservation.createdAt).toLocaleDateString(
                    "fr-FR"
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
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
