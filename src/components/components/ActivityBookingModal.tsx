import React, { useState, useEffect } from "react";
import { X, Users, Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import { api } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ActivityBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    id: string;
    title: string;
    price?: number;
    duration: string;
    location?: string;
    meetingPoint?: string;
    maxParticipants: number;
    minParticipants: number;
    availability?: Array<{
      id: string;
      date: string;
      startTime: string;
      endTime: string;
      slots: number;
      bookedSlots: number;
      price?: number;
      status: string;
    }>;
  };
  onBookingSuccess: () => void;
}

interface Availability {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  slots: number;
  bookedSlots: number;
  price?: number;
  status: string;
}

const ActivityBookingModal: React.FC<ActivityBookingModalProps> = ({
  isOpen,
  onClose,
  activity,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [participants, setParticipants] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    if (isOpen && activity.id) {
      loadAvailabilities();
    }
  }, [isOpen, activity.id]);

  const loadAvailabilities = async () => {
    try {
      const res = await api.get(
        `/activity-availability/activity/${activity.id}`,
      );
      setAvailabilities(res.data.data);
    } catch (error) {
      console.error("Error loading availabilities:", error);
      toast.error("Erreur lors du chargement des disponibilités");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      return;
    }

    if (!selectedAvailability) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    if (
      participants < activity.minParticipants ||
      participants > activity.maxParticipants
    ) {
      toast.error(
        `Nombre de participants doit être entre ${activity.minParticipants} et ${activity.maxParticipants}`,
      );
      return;
    }

    const selected = availabilities.find((a) => a.id === selectedAvailability);
    if (selected && participants > selected.slots - selected.bookedSlots) {
      toast.error("Plus assez de places disponibles pour cette date");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        activityId: activity.id,
        availabilityId: selectedAvailability,
        participants,
        specialRequests: specialRequests || undefined,
      };

      const res = await api.post("/bookings", bookingData);

      toast.success("Réservation effectuée avec succès !");
      onBookingSuccess();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la réservation",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getAvailableSlots = (availability: Availability) => {
    return availability.slots - availability.bookedSlots;
  };

  const getPriceForAvailability = (availability: Availability) => {
    return availability.price || activity.price || 0;
  };

  const calculateTotal = () => {
    if (!selectedAvailability) return 0;
    const selected = availabilities.find((a) => a.id === selectedAvailability);
    if (!selected) return 0;
    return getPriceForAvailability(selected) * participants;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Réserver : {activity.title}
              </h2>
              <p className="text-gray-600 mt-1">
                Remplissez les informations pour votre réservation
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Participants */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de participants
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg p-2">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <select
                    value={participants}
                    onChange={(e) => setParticipants(Number(e.target.value))}
                    className="bg-transparent border-none outline-none"
                  >
                    {Array.from(
                      {
                        length:
                          activity.maxParticipants -
                          activity.minParticipants +
                          1,
                      },
                      (_, i) => activity.minParticipants + i,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "personne" : "personnes"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  Min: {activity.minParticipants} - Max:{" "}
                  {activity.maxParticipants}
                </div>
              </div>
            </div>

            {/* Disponibilités */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sélectionnez une date
              </label>
              {availabilities.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Aucune disponibilité pour le moment
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availabilities
                    .filter((avail) => getAvailableSlots(avail) > 0)
                    .map((availability) => (
                      <button
                        key={availability.id}
                        type="button"
                        onClick={() => setSelectedAvailability(availability.id)}
                        className={`p-4 border rounded-lg text-left transition-all ${
                          selectedAvailability === availability.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(availability.date)}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <Clock className="w-4 h-4 inline mr-1" />
                              {availability.startTime} - {availability.endTime}
                            </p>
                          </div>
                          {selectedAvailability === availability.id && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-sm text-gray-500">
                            {getAvailableSlots(availability)} places disponibles
                          </span>
                          <span className="font-semibold text-gray-900">
                            {getPriceForAvailability(availability).toFixed(2)}
                            €/pers
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Point de rencontre */}
            {activity.meetingPoint && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-700 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Point de rencontre :</span>
                </div>
                <p className="text-gray-600">{activity.meetingPoint}</p>
              </div>
            )}

            {/* Demandes spéciales */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Demandes spéciales (optionnel)
              </label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Allergies, préférences, questions particulières..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Total estimé</p>
                  <p className="text-sm text-gray-500">
                    {participants} personne{participants > 1 ? "s" : ""} ×{" "}
                    {selectedAvailability
                      ? `${getPriceForAvailability(availabilities.find((a) => a.id === selectedAvailability)!).toFixed(2)}€`
                      : "0€"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateTotal().toFixed(2)}€
                  </p>
                  <p className="text-sm text-gray-500">TVA incluse</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !selectedAvailability}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading
                  ? "Réservation en cours..."
                  : "Confirmer la réservation"}
              </button>
            </div>

            {/* Informations */}
            <div className="text-xs text-gray-500 text-center">
              <p>
                Vous recevrez une confirmation par email. Annulation gratuite
                jusqu'à 48h avant l'activité.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActivityBookingModal;
