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
    duration?: number;
    durationType?: string;
    location?: string;
    meetingPoint?: string;
    maxParticipants?: number;
    minParticipants: number;
  };
  onBookingSuccess: () => void;
}

const ActivityBookingModal: React.FC<ActivityBookingModalProps> = ({
  isOpen,
  onClose,
  activity,
  onBookingSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setParticipants] = useState(activity.minParticipants);
  const [specialRequests, setSpecialRequests] = useState("");
  const [participantNames, setParticipantNames] = useState<string[]>([""]);
  const [participantEmails, setParticipantEmails] = useState<string[]>([""]);

  useEffect(() => {
    if (isOpen) {
      setParticipants(activity.minParticipants);
      setParticipantNames(Array(activity.minParticipants).fill(""));
      setParticipantEmails(Array(activity.minParticipants).fill(""));

      // Initialiser la date à aujourd'hui
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setBookingDate(formattedDate);

      // Heures par défaut
      setStartTime("09:00");
      setEndTime("12:00");
    }
  }, [isOpen, activity.minParticipants]);

  const handleParticipantChange = (
    index: number,
    value: string,
    type: "name" | "email",
  ) => {
    if (type === "name") {
      const newNames = [...participantNames];
      newNames[index] = value;
      setParticipantNames(newNames);
    } else {
      const newEmails = [...participantEmails];
      newEmails[index] = value;
      setParticipantEmails(newEmails);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Veuillez vous connecter pour réserver");
      return;
    }

    if (!bookingDate) {
      toast.error("Veuillez sélectionner une date");
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Veuillez indiquer les heures de début et de fin");
      return;
    }

    if (
      participants < activity.minParticipants ||
      (activity.maxParticipants && participants > activity.maxParticipants)
    ) {
      toast.error(
        `Nombre de participants doit être entre ${activity.minParticipants} et ${activity.maxParticipants || 10}`,
      );
      return;
    }

    // Vérifier que tous les noms sont remplis
    const allNamesFilled = participantNames
      .slice(0, participants)
      .every((name) => name.trim() !== "");
    if (!allNamesFilled) {
      toast.error("Veuillez remplir le nom de tous les participants");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        activityId: activity.id,
        bookingDate,
        startTime,
        endTime,
        participants,
        specialRequests: specialRequests.trim() || undefined,
        participantNames: participantNames
          .slice(0, participants)
          .filter((name) => name.trim() !== ""),
        participantEmails: participantEmails
          .slice(0, participants)
          .filter((email) => email.trim() !== ""),
      };

      const res = await api.post("/activity-bookings", bookingData);

      if (res.data.success) {
        toast.success("Réservation effectuée avec succès !");
        onBookingSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la réservation",
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration?: number, durationType?: string) => {
    if (!duration) return "Durée variable";

    if (durationType === "minutes") {
      if (duration < 60) return `${duration}min`;
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (minutes === 0) return `${hours}h`;
      return `${hours}h${minutes}`;
    } else if (durationType === "hours") {
      return `${duration}h`;
    } else if (durationType === "days") {
      return `${duration} jour${duration > 1 ? "s" : ""}`;
    }

    return `${duration} min`;
  };

  const calculateTotal = () => {
    return (activity.price || 0) * participants;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b">
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
                    onChange={(e) => {
                      const newCount = Number(e.target.value);
                      setParticipants(newCount);
                      // Ajuster les tableaux de noms et emails
                      if (newCount > participantNames.length) {
                        setParticipantNames([
                          ...participantNames,
                          ...Array(newCount - participantNames.length).fill(""),
                        ]);
                        setParticipantEmails([
                          ...participantEmails,
                          ...Array(newCount - participantEmails.length).fill(
                            "",
                          ),
                        ]);
                      } else {
                        setParticipantNames(
                          participantNames.slice(0, newCount),
                        );
                        setParticipantEmails(
                          participantEmails.slice(0, newCount),
                        );
                      }
                    }}
                    className="bg-transparent border-none outline-none"
                  >
                    {Array.from(
                      {
                        length:
                          (activity.maxParticipants || 10) -
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
                  {activity.maxParticipants || 10}
                </div>
              </div>
            </div>

            {/* Date et heures */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="bg-transparent border-none outline-none w-full"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heure de début
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-transparent border-none outline-none w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Heure de fin
                </label>
                <div className="flex items-center border rounded-lg p-2">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-transparent border-none outline-none w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informations des participants */}
            {participants > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Informations des participants
                </label>
                <div className="space-y-3">
                  {Array.from({ length: participants }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    >
                      <div>
                        <input
                          type="text"
                          placeholder={`Nom du participant ${index + 1}`}
                          value={participantNames[index] || ""}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              e.target.value,
                              "name",
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder={`Email (optionnel)`}
                          value={participantEmails[index] || ""}
                          onChange={(e) =>
                            handleParticipantChange(
                              index,
                              e.target.value,
                              "email",
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Durée et point de rencontre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activity.duration && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Durée estimée :</span>
                  </div>
                  <p className="text-gray-600">
                    {formatDuration(activity.duration, activity.durationType)}
                  </p>
                </div>
              )}

              {activity.meetingPoint && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Point de rencontre :</span>
                  </div>
                  <p className="text-gray-600">{activity.meetingPoint}</p>
                </div>
              )}
            </div>

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
                    {activity.price?.toFixed(2) || "0"}€
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
                disabled={loading || !bookingDate}
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
