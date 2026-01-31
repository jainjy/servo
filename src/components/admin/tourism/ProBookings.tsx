// components/admin/ProBookings.tsx
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Users,
  MapPin,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Ticket,
  Building,
  User as UserIcon,
  RefreshCw,
  MessageCircle,
  Landmark,
  Castle,
  Church,
  BookOpen,
  GalleryVerticalEnd,
  QrCode,
  UserCheck,
  Home,
  Camera,
  Plane,
  MoreVertical,
  FileText,
  CreditCard,
  Banknote,
  User,
  Activity, // AJOUT: Icône pour les activités
} from "lucide-react";
import api from "../../../lib/api";
import {
  touristicPlaceBookingsAPI,
  tourismeAPI,
  flightsAPI,
  activitiesAPI, // AJOUT
} from "../../../lib/api";

// Types pour les réservations d'hébergement
interface TourismeBooking {
  id: string;
  confirmationNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "paid"
    | "failed"
    | "refunded";
  checkIn: string;
  checkOut: string;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  serviceFee: number;
  specialRequests?: string;
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

// Types pour les réservations de lieux touristiques
interface TouristicPlaceBooking {
  id: string;
  confirmationNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "paid"
    | "failed"
    | "refunded";
  visitDate: string;
  visitTime: string;
  numberOfTickets: number;
  ticketType: "adult" | "child" | "student" | "senior";
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

// Types pour les réservations de vols
interface FlightReservation {
  id: string;
  flightId: string;
  idUser: string;
  idPrestataire: string;
  nbrPersonne: number;
  place: string;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "paid"
    | "failed"
    | "refunded";
  totalAmount: number;
  serviceFee: number;
  paymentMethod: string;
  stripePaymentIntent?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  flight: {
    id: string;
    compagnie: string;
    numeroVol: string;
    departVille: string;
    departDateHeure: string;
    arriveeVille: string;
    arriveeDateHeure: string;
    duree: string;
    escales: number;
    prix: number;
    classe: string;
    services: string[];
    image: string;
    aircraft: string;
    disponibilite: number;
    rating: number;
    reviewCount: number;
  };
  userReservation?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  prestataire?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

// AJOUT: Types pour les réservations d'activités
interface ActivityBooking {
  id: string;
  activityId: string;
  userId: string;

  bookingDate: string;
  startTime?: string;
  endTime?: string;

  participants: number;
  totalAmount: number;

  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "refunded" | "failed";

  participantNames: string[];
  participantEmails: string[];
  specialRequests?: string;

  bookedAt: string;
  confirmedAt?: string;
  cancelledAt?: string;

  activity: {
    id: string;
    title: string;
    description: string;
    shortDescription?: string;
    mainImage?: string;
    images: string[];
    price?: number;
    priceType?: string;
    duration?: number;
    durationType?: string;
    level?: string;
    location?: string;
    address?: string;
    meetingPoint?: string;
    category?: string;
    userId: string;
  };

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

// Types unifiés
type BookingType = "accommodation" | "touristic_place" | "flight" | "activity";
type Booking =
  | TourismeBooking
  | TouristicPlaceBooking
  | FlightReservation
  | ActivityBooking;

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  revenue: number;
  averageBooking: number;
  totalTickets?: number;
  occupancyRate?: number;
  totalPassengers?: number;
  totalParticipants?: number; // AJOUT
}

interface Filters {
  search: string;
  status: string;
  dateRange: string;
  type: string;
  provider?: string;
  ticketType?: string;
  placeId?: string;
  airline?: string;
  activityCategory?: string; // AJOUT
}

// Composants helper
const Section = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <h4 className="text-lg font-semibold text-[#8B4513] mb-4">{title}</h4>
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
  mono = false,
  badge = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  badge?: boolean;
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm font-medium text-[#8B4513]/70">{label}</span>
    <span
      className={`text-sm text-[#8B4513] ${mono ? "font-mono" : ""} ${badge ? "px-2 py-1 bg-[#6B8E23]/10 rounded-full" : ""}`}
    >
      {value}
    </span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const getColors = () => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "bg-[#6B8E23]/20 text-[#556B2F] border border-[#6B8E23]/30";
      case "pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-[#D3D3D3] text-[#8B4513] border border-[#D3D3D3]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return <CheckCircle className="w-3 h-3 mr-1 text-[#556B2F]" />;
      case "pending":
        return <Clock className="w-3 h-3 mr-1 text-amber-600" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-3 h-3 mr-1 text-red-600" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1 text-blue-600" />;
      case "refunded":
        return <DollarSign className="w-3 h-3 mr-1 text-purple-600" />;
      default:
        return <AlertCircle className="w-3 h-3 mr-1 text-[#8B4513]/70" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Payé";
      case "failed":
        return "Échec paiement";
      case "refunded":
        return "Remboursé";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColors()}`}
    >
      {getStatusIcon(status)}
      <span className="ml-1 capitalize">{getStatusLabel(status)}</span>
    </span>
  );
};

// Composant carte de réservation unifié
const BookingCard = ({
  booking,
  type,
  onViewDetails,
  onUpdateStatus,
  onGenerateQRCode,
  getTicketTypeLabel,
  getCategoryIcon,
  calculateNights,
  getAirlineColor,
  getActivityIcon, // AJOUT
}: any) => {
  const [showActions, setShowActions] = useState(false);

  const isAccommodation = type === "accommodation";
  const isTouristicPlace = type === "touristic_place";
  const isFlight = type === "flight";
  const isActivity = type === "activity"; // AJOUT

  const accommodationBooking = booking as TourismeBooking;
  const touristicPlaceBooking = booking as TouristicPlaceBooking;
  const flightReservation = booking as FlightReservation;
  const activityBooking = booking as ActivityBooking; // AJOUT

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return <CheckCircle className="w-4 h-4 text-[#6B8E23]" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case "refunded":
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#8B4513]/70" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "paid":
        return "bg-[#6B8E23]/20 text-[#556B2F] border border-[#6B8E23]/30";
      case "pending":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "refunded":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      default:
        return "bg-[#D3D3D3] text-[#8B4513] border border-[#D3D3D3]";
    }
  };

  const getBookingImage = () => {
    if (isAccommodation) return accommodationBooking.listing?.images?.[0];
    if (isTouristicPlace) return touristicPlaceBooking.place?.images?.[0];
    if (isFlight) return flightReservation.flight?.image;
    if (isActivity)
      return (
        activityBooking.activity?.mainImage ||
        activityBooking.activity?.images?.[0]
      ); // AJOUT
    return "";
  };

  const getBookingTitle = () => {
    if (isAccommodation) return accommodationBooking.listing?.title;
    if (isTouristicPlace) return touristicPlaceBooking.place?.title;
    if (isFlight)
      return `${flightReservation.flight?.compagnie} - Vol ${flightReservation.flight?.numeroVol}`;
    if (isActivity) return activityBooking.activity?.title; // AJOUT
    return "";
  };

  const getBookingLocation = () => {
    if (isAccommodation) return accommodationBooking.listing?.city;
    if (isTouristicPlace) return touristicPlaceBooking.place?.city;
    if (isFlight)
      return `${flightReservation.flight?.departVille} → ${flightReservation.flight?.arriveeVille}`;
    if (isActivity) return activityBooking.activity?.location; // AJOUT
    return "";
  };

  const getBookingDate = () => {
    if (isAccommodation)
      return new Date(accommodationBooking.checkIn).toLocaleDateString();
    if (isTouristicPlace)
      return new Date(touristicPlaceBooking.visitDate).toLocaleDateString();
    if (isFlight)
      return new Date(
        flightReservation.flight?.departDateHeure,
      ).toLocaleDateString();
    if (isActivity)
      return new Date(activityBooking.bookingDate).toLocaleDateString(); // AJOUT
    return "";
  };

  const getBookingTime = () => {
    if (isAccommodation)
      return `${calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)} nuit(s)`;
    if (isTouristicPlace) return touristicPlaceBooking.visitTime;
    if (isFlight) {
      const depart = new Date(flightReservation.flight?.departDateHeure);
      return depart.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (isActivity)
      return `${activityBooking.startTime || ""} ${activityBooking.endTime ? `- ${activityBooking.endTime}` : ""}`; // AJOUT
    return "";
  };

  const getBookingDetails = () => {
    if (isAccommodation) return `${accommodationBooking.guests} voyageur(s)`;
    if (isTouristicPlace)
      return `${touristicPlaceBooking.numberOfTickets} billet(s) - ${getTicketTypeLabel(touristicPlaceBooking.ticketType)}`;
    if (isFlight)
      return `${flightReservation.nbrPersonne} passager(s) - ${flightReservation.place}`;
    if (isActivity) return `${activityBooking.participants} participant(s)`; // AJOUT
    return "";
  };

  const getUserInfo = () => {
    if (booking.user) {
      return `${booking.user.firstName} ${booking.user.lastName}`;
    } else if (booking.userReservation) {
      return `${booking.userReservation.firstName} ${booking.userReservation.lastName}`;
    }
    return "Client non connecté";
  };

  const getUserEmail = () => {
    return booking.user?.email || booking.userReservation?.email;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#D3D3D3] overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* En-tête de la carte */}
      <div className="p-6 border-b border-[#D3D3D3]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm font-mono font-bold text-[#8B4513] bg-[#6B8E23]/10 px-3 py-1 rounded-lg">
                {isFlight
                  ? `FLIGHT-${flightReservation.id.slice(-6)}`
                  : isActivity
                    ? `ACT-${activityBooking.id.slice(-6)}` // AJOUT
                    : booking.confirmationNumber}
              </div>
              {isFlight && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAirlineColor(flightReservation.flight?.compagnie)} border`}
                >
                  <Plane className="w-3 h-3 mr-1" />
                  {flightReservation.flight?.compagnie}
                </span>
              )}
            </div>
            <div className="text-xs text-[#8B4513]/60">
              Créé le{" "}
              {new Date(
                booking.createdAt || booking.bookedAt,
              ).toLocaleDateString()}
            </div>
          </div>

          {/* Menu d'actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-[#6B8E23]/10 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-[#8B4513]" />
            </button>

            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-[#D3D3D3] py-2 z-10">
                <button
                  onClick={() => {
                    onViewDetails();
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-[#8B4513] hover:bg-[#6B8E23]/10"
                >
                  <Eye className="w-4 h-4 mr-3 text-[#556B2F]" />
                  Voir les détails
                </button>

                {isTouristicPlace &&
                  booking.status === "confirmed" &&
                  onGenerateQRCode && (
                    <button
                      onClick={() => {
                        onGenerateQRCode(booking);
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-[#6B8E23] hover:bg-[#6B8E23]/10"
                    >
                      <QrCode className="w-4 h-4 mr-3" />
                      Générer QR Code
                    </button>
                  )}

                {booking.status === "pending" && (
                  <button
                    onClick={() => {
                      onUpdateStatus(booking.id, "confirmed");
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-[#6B8E23] hover:bg-[#6B8E23]/10"
                  >
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Confirmer
                  </button>
                )}

                {booking.status !== "cancelled" &&
                  booking.status !== "completed" && (
                    <button
                      onClick={() => {
                        onUpdateStatus(booking.id, "cancelled");
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-3" />
                      Annuler
                    </button>
                  )}

                {/* Actions de paiement */}
                {(booking.status !== "paid" &&
                  booking.status !== "cancelled" &&
                  booking.status !== "failed") ||
                  (isActivity &&
                    booking.paymentStatus !== "paid" &&
                    booking.status !== "cancelled" && (
                      <button
                        onClick={() => {
                          onUpdateStatus(booking.id, "paid");
                          setShowActions(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        <DollarSign className="w-4 h-4 mr-3" />
                        Marquer payé
                      </button>
                    ))}
              </div>
            )}
          </div>
        </div>

        {/* Statut */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} border`}
          >
            {getStatusIcon(booking.status)}
            <span className="ml-1 capitalize">
              {booking.status === "paid"
                ? "Payé"
                : booking.status === "failed"
                  ? "Échec paiement"
                  : booking.status === "refunded"
                    ? "Remboursé"
                    : booking.status}
            </span>
          </span>
          {isActivity && booking.paymentStatus && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${booking.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
            >
              <DollarSign className="w-3 h-3 mr-1" />
              {booking.paymentStatus === "paid" ? "Payé" : "En attente"}
            </span>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={getBookingImage()}
            alt={getBookingTitle()}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-[#D3D3D3]"
            onError={(e) => {
              e.currentTarget.src =
                "https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg";
            }}
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[#8B4513] line-clamp-2 mb-2">
              {getBookingTitle()}
            </h3>

            <div className="flex items-center text-sm text-[#8B4513]/70 mb-1">
              {isTouristicPlace &&
                getCategoryIcon(touristicPlaceBooking.place?.category)}
              {isFlight && <Plane className="w-4 h-4 mr-1" />}
              {isActivity &&
                getActivityIcon &&
                getActivityIcon(activityBooking.activity?.category)}{" "}
              {/* AJOUT */}
              <MapPin className="w-4 h-4 mr-1" />
              {getBookingLocation()}
            </div>

            <div className="flex items-center text-sm text-[#8B4513]/70">
              <UserIcon className="w-4 h-4 mr-1" />
              <span className="mr-2">{getUserInfo()}</span>
              {getUserEmail() && (
                <a
                  href={`mailto:${getUserEmail()}`}
                  className="text-[#6B8E23] hover:text-[#556B2F] transition-colors"
                  title="Envoyer un email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center bg-[#6B8E23]/5 rounded-lg p-3 border border-[#D3D3D3]">
            <Calendar className="w-5 h-5 text-[#6B8E23] mx-auto mb-1" />
            <div className="text-sm font-medium text-[#8B4513]">
              {getBookingDate()}
            </div>
            <div className="text-xs text-[#8B4513]/60">{getBookingTime()}</div>
          </div>

          <div className="text-center bg-[#6B8E23]/5 rounded-lg p-3 border border-[#D3D3D3]">
            <Users className="w-5 h-5 text-[#6B8E23] mx-auto mb-1" />
            <div className="text-sm font-medium text-[#8B4513]">
              {getBookingDetails()}
            </div>
            {isAccommodation && (
              <div className="text-xs text-[#8B4513]/60">
                {accommodationBooking.adults}A, {accommodationBooking.children}E
                {accommodationBooking.infants > 0 &&
                  `, ${accommodationBooking.infants}B`}
              </div>
            )}
          </div>
        </div>

        {/* Montant */}
        <div className="flex justify-between items-center pt-4 border-t border-[#D3D3D3]">
          <div>
            <div className="text-2xl font-bold text-[#8B4513]">
              {booking.totalAmount}€
            </div>
            <div className="text-xs text-[#8B4513]/60">
              {booking.serviceFee
                ? `Dont ${booking.serviceFee}€ de frais`
                : "Frais inclus"}
            </div>
          </div>

          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#556B2F] transition-colors font-medium"
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de détail unifié
const BookingDetailModal = ({
  booking,
  type,
  onClose,
  onStatusUpdate,
  onSendReminder,
  onGenerateQRCode,
  getTicketTypeLabel,
  getCategoryIcon,
  calculateNights,
  getAirlineColor,
  getActivityIcon, // AJOUT
}: any) => {
  const isAccommodation = type === "accommodation";
  const isTouristicPlace = type === "touristic_place";
  const isFlight = type === "flight";
  const isActivity = type === "activity"; // AJOUT

  const accommodationBooking = booking as TourismeBooking;
  const touristicPlaceBooking = booking as TouristicPlaceBooking;
  const flightReservation = booking as FlightReservation;
  const activityBooking = booking as ActivityBooking; // AJOUT

  return (
    <div className="fixed inset-0 bg-[#8B4513]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-hidden py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto border border-[#D3D3D3]">
        {/* En-tête élégant */}
        <div className="sticky top-0 bg-gradient-to-r from-[#8B4513] to-[#556B2F] text-white rounded-t-2xl p-4 sm:p-6 lg:p-8 z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-3">
                <div className="p-1.5 sm:p-2 bg-white/10 backdrop-blur-sm rounded-lg flex-shrink-0">
                  {isFlight ? (
                    <Plane className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : isAccommodation ? (
                    <Building className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : isActivity ? ( // AJOUT
                    <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-3xl font-bold tracking-tight break-words">
                    Détails de la Réservation
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium w-fit">
                      {isFlight
                        ? `FLIGHT-${flightReservation.id.slice(-6)}`
                        : isActivity
                          ? `ACT-${activityBooking.id.slice(-6)}` // AJOUT
                          : booking.confirmationNumber}
                    </span>
                    <div className="hidden sm:flex items-center gap-3">
                      <span className="text-white/80 text-sm">•</span>
                      <span className="text-white/80 text-sm">
                        {isAccommodation
                          ? "Hébergement"
                          : isTouristicPlace
                            ? "Lieu Touristiques"
                            : isFlight
                              ? "Vol"
                              : "Activité"}{" "}
                        {/* AJOUT */}
                      </span>
                    </div>
                    <div className="sm:hidden text-white/80 text-xs">
                      {isAccommodation
                        ? "Hébergement"
                        : isTouristicPlace
                          ? "Lieu Touristiques"
                          : isFlight
                            ? "Vol"
                            : "Activité"}{" "}
                      {/* AJOUT */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-all duration-200 group self-end sm:self-auto"
            >
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche */}
            <div className="lg:col-span-2 space-y-8">
              {/* Carte : Informations principales */}
              <div className="bg-white rounded-2xl border border-[#D3D3D3] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <FileText className="w-5 h-5 text-[#6B8E23]" />
                  </div>
                  <h4 className="text-md lg:text-xl font-bold text-[#8B4513]">
                    Informations Générales
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#8B4513]/70 mb-1">
                        Numéro de confirmation
                      </span>
                      <span className="font-mono text-md lg:text-lg font-bold text-[#8B4513] bg-[#6B8E23]/10 px-1 py-2 rounded-lg">
                        {isFlight
                          ? `FLIGHT-${flightReservation.id.slice(-6)}`
                          : isActivity
                            ? `ACT-${activityBooking.id.slice(-6)}` // AJOUT
                            : booking.confirmationNumber}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#8B4513]/70 mb-1">
                        Statut
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#8B4513]/70 mb-1">
                        Date de création
                      </span>
                      <span className="font-medium text-[#8B4513]">
                        {new Date(
                          booking.createdAt || booking.bookedAt,
                        ).toLocaleString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#8B4513]/70 mb-1">
                        Méthode de paiement
                      </span>
                      <span className="font-medium text-[#8B4513] flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        {booking.paymentMethod || "Non spécifiée"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte : Détails du séjour/vol/activité */}
              <div className="bg-white rounded-2xl border border-[#D3D3D3] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-[#6B8E23]" />
                  </div>
                  <h4 className="text-md lg:text-xl font-bold text-[#8B4513]">
                    {isAccommodation
                      ? "Dates du séjour"
                      : isTouristicPlace
                        ? "Détails de la visite"
                        : isFlight
                          ? "Détails du vol"
                          : "Détails de l'activité"}{" "}
                    {/* AJOUT */}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isAccommodation ? (
                    <>
                      <div className="space-y-3">
                        <div className="bg-[#6B8E23]/10 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-[#556B2F] mb-1">
                            Arrivée
                          </span>
                          <div className="text-lg font-bold text-[#8B4513]">
                            {new Date(
                              accommodationBooking.checkIn,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-blue-700 mb-1">
                            Départ
                          </span>
                          <div className="text-lg font-bold text-blue-900">
                            {new Date(
                              accommodationBooking.checkOut,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-purple-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-purple-700 mb-1">
                            Durée du séjour
                          </span>
                          <div className="text-2xl font-bold text-purple-900">
                            {calculateNights(
                              accommodationBooking.checkIn,
                              accommodationBooking.checkOut,
                            )}{" "}
                            nuit(s)
                          </div>
                        </div>
                      </div>
                    </>
                  ) : isTouristicPlace ? (
                    <>
                      <div className="space-y-3">
                        <div className="bg-[#6B8E23]/10 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-[#556B2F] mb-1">
                            Date de visite
                          </span>
                          <div className="text-lg font-bold text-[#8B4513]">
                            {new Date(
                              touristicPlaceBooking.visitDate,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-amber-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-amber-700 mb-1">
                            Heure de visite
                          </span>
                          <div className="text-lg font-bold text-amber-900">
                            {touristicPlaceBooking.visitTime}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : isFlight ? (
                    <>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-blue-700 mb-1">
                            Départ
                          </span>
                          <div className="text-lg font-bold text-blue-900">
                            {new Date(
                              flightReservation.flight?.departDateHeure,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="text-sm text-blue-600">
                            {new Date(
                              flightReservation.flight?.departDateHeure,
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-sm font-medium text-[#8B4513] mt-2">
                            {flightReservation.flight?.departVille}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-green-700 mb-1">
                            Arrivée
                          </span>
                          <div className="text-lg font-bold text-green-900">
                            {new Date(
                              flightReservation.flight?.arriveeDateHeure,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                          <div className="text-sm text-green-600">
                            {new Date(
                              flightReservation.flight?.arriveeDateHeure,
                            ).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-sm font-medium text-[#8B4513] mt-2">
                            {flightReservation.flight?.arriveeVille}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // AJOUT: Détails pour les activités
                    <>
                      <div className="space-y-3">
                        <div className="bg-[#6B8E23]/10 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-[#556B2F] mb-1">
                            Date de l'activité
                          </span>
                          <div className="text-lg font-bold text-[#8B4513]">
                            {new Date(
                              activityBooking.bookingDate,
                            ).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-amber-50 p-4 rounded-xl border border-[#D3D3D3]">
                          <span className="text-sm font-medium text-amber-700 mb-1">
                            Horaires
                          </span>
                          <div className="text-lg font-bold text-amber-900">
                            {activityBooking.startTime}{" "}
                            {activityBooking.endTime &&
                              `- ${activityBooking.endTime}`}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Carte : Détails financiers */}
              <div className="bg-white rounded-2xl border border-[#D3D3D3] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <Banknote className="w-5 h-5 text-[#6B8E23]" />
                  </div>
                  <h4 className="text-md lg:text-xl font-bold text-[#8B4513]">
                    Détails Financiers
                  </h4>
                </div>

                <div className="bg-[#6B8E23]/5 rounded-xl p-6 border border-[#D3D3D3]">
                  <div className="space-y-4">
                    {isAccommodation ? (
                      <>
                        <div className="flex justify-between items-center py-2">
                          <div>
                            <span className="text-[#8B4513]/70">
                              Séjour (
                              {calculateNights(
                                accommodationBooking.checkIn,
                                accommodationBooking.checkOut,
                              )}{" "}
                              nuits)
                            </span>
                            <div className="text-sm text-[#8B4513]/50">
                              {(
                                (booking.totalAmount - booking.serviceFee) /
                                calculateNights(
                                  accommodationBooking.checkIn,
                                  accommodationBooking.checkOut,
                                )
                              ).toFixed(2)}
                              € par nuit
                            </div>
                          </div>
                          <span className="font-semibold text-[#8B4513]">
                            {(booking.totalAmount - booking.serviceFee).toFixed(
                              2,
                            )}
                            €
                          </span>
                        </div>
                      </>
                    ) : isTouristicPlace ? (
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-[#8B4513]/70">
                            Billets ({touristicPlaceBooking.numberOfTickets}x)
                          </span>
                          <div className="text-sm text-[#8B4513]/50">
                            {touristicPlaceBooking.place?.price || 0}€ par
                            billet
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B4513]">
                          {(booking.totalAmount - booking.serviceFee).toFixed(
                            2,
                          )}
                          €
                        </span>
                      </div>
                    ) : isFlight ? (
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-[#8B4513]/70">
                            Vol ({flightReservation.nbrPersonne}x passagers)
                          </span>
                          <div className="text-sm text-[#8B4513]/50">
                            {flightReservation.flight?.prix}€ par personne
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B4513]">
                          {(
                            flightReservation.flight?.prix *
                            flightReservation.nbrPersonne
                          ).toFixed(2)}
                          €
                        </span>
                      </div>
                    ) : (
                      // AJOUT: Détails financiers pour les activités
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="text-[#8B4513]/70">
                            Activité ({activityBooking.participants}x
                            participants)
                          </span>
                          <div className="text-sm text-[#8B4513]/50">
                            {activityBooking.activity?.price || 0}€ par personne
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B4513]">
                          {booking.totalAmount.toFixed(2)}€
                        </span>
                      </div>
                    )}

                    {booking.serviceFee > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-[#D3D3D3] pt-4">
                        <div>
                          <span className="text-[#8B4513]/70">
                            Frais de service
                          </span>
                          <div className="text-sm text-[#8B4513]/50">
                            Inclus dans le total
                          </div>
                        </div>
                        <span className="font-semibold text-[#8B4513]">
                          {booking.serviceFee}€
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-6 border-t border-[#8B4513]/30">
                      <div>
                        <span className="text-lg font-bold text-[#8B4513]">
                          Montant total
                        </span>
                        <div className="text-sm text-[#8B4513]/50">
                          TVA incluse
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-[#8B4513]">
                        {booking.totalAmount}€
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-8">
              {/* Carte : Client */}
              <div className="bg-white rounded-2xl border border-[#D3D3D3] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <User className="w-5 h-5 text-[#6B8E23]" />
                  </div>
                  <h4 className="text-md lg:text-xl font-bold text-[#8B4513]">
                    Informations Client
                  </h4>
                </div>

                {booking.user || booking.userReservation ? (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-4 border border-[#D3D3D3]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#6B8E23]/10 rounded-full">
                          <User className="w-4 h-4 text-[#6B8E23]" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-[#8B4513]">
                            {booking.user
                              ? `${booking.user.firstName} ${booking.user.lastName}`
                              : `${booking.userReservation.firstName} ${booking.userReservation.lastName}`}
                          </h5>
                          <p className="text-sm text-[#8B4513]/50">
                            Voyageur principal
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <a
                          href={`mailto:${booking.user?.email || booking.userReservation?.email}`}
                          className="flex items-center gap-2 text-[#6B8E23] hover:text-[#556B2F] transition-colors group"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">
                            {booking.user?.email ||
                              booking.userReservation?.email}
                          </span>
                        </a>

                        {(booking.user?.phone ||
                          booking.userReservation?.phone) && (
                          <a
                            href={`tel:${booking.user?.phone || booking.userReservation?.phone}`}
                            className="flex items-center gap-2 text-[#8B4513] hover:text-[#6B8E23] transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">
                              {booking.user?.phone ||
                                booking.userReservation?.phone}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <a
                        href={`mailto:${booking.user?.email || booking.userReservation?.email}?subject=Réservation ${isFlight ? `FLIGHT-${flightReservation.id.slice(-6)}` : isActivity ? `ACT-${activityBooking.id.slice(-6)}` : booking.confirmationNumber}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#6B8E23] text-white rounded-xl hover:bg-[#556B2F] transition-all font-medium"
                      >
                        <Mail className="w-4 h-4" />
                        Contacter
                      </a>
                      {(booking.status === "confirmed" ||
                        booking.status === "paid" ||
                        (isActivity &&
                          activityBooking.paymentStatus === "paid")) && (
                        <button
                          onClick={() => onSendReminder(booking.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B4513] text-white rounded-xl hover:bg-[#556B2F] transition-all font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Rappel
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <User className="w-12 h-12 text-[#D3D3D3] mx-auto mb-3" />
                    <p className="text-[#8B4513]/50 font-medium">
                      Aucune information client
                    </p>
                    <p className="text-[#8B4513]/30 text-sm mt-1">
                      Réservation sans compte
                    </p>
                  </div>
                )}
              </div>

              {/* Carte : Détails voyageurs */}
              <div className="bg-white rounded-2xl border border-[#D3D3D3] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                    <Users className="w-5 h-5 text-[#6B8E23]" />
                  </div>
                  <h4 className="text-md lg:text-xl font-bold text-[#8B4513]">
                    {isAccommodation
                      ? "Voyageurs"
                      : isTouristicPlace
                        ? "Billets"
                        : isFlight
                          ? "Passagers"
                          : "Participants"}{" "}
                    {/* AJOUT */}
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {isAccommodation ? (
                    <>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {accommodationBooking.guests}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Total
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {accommodationBooking.adults}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Adultes
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {accommodationBooking.children}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Enfants
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {accommodationBooking.infants}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Bébés
                        </div>
                      </div>
                    </>
                  ) : isTouristicPlace ? (
                    <>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {touristicPlaceBooking.numberOfTickets}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Billets
                        </div>
                      </div>
                      <div className="bg-[#6B8E23]/5 p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-lg font-bold text-[#8B4513] mb-1 capitalize">
                          {getTicketTypeLabel(touristicPlaceBooking.ticketType)}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Type
                        </div>
                      </div>
                    </>
                  ) : isFlight ? (
                    <>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {flightReservation.nbrPersonne}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Passagers
                        </div>
                      </div>
                      <div className="bg-[#6B8E23]/5 p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-lg font-bold text-[#8B4513] mb-1">
                          {flightReservation.place}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Place
                        </div>
                      </div>
                    </>
                  ) : (
                    // AJOUT: Détails pour les activités
                    <>
                      <div className="bg-white p-4 rounded-xl border border-[#D3D3D3] text-center">
                        <div className="text-2xl font-bold text-[#8B4513] mb-1">
                          {activityBooking.participants}
                        </div>
                        <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                          Participants
                        </div>
                      </div>
                      {activityBooking.participantNames.length > 0 && (
                        <div className="bg-[#6B8E23]/5 p-4 rounded-xl border border-[#D3D3D3] text-center">
                          <div className="text-lg font-bold text-[#8B4513] mb-1">
                            {activityBooking.participantNames.length}
                          </div>
                          <div className="text-xs font-medium text-[#8B4513]/50 uppercase tracking-wider">
                            Noms fournis
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Carte : Actions rapides */}
              <div className="bg-gradient-to-r from-[#8B4513] to-[#556B2F] rounded-2xl p-6">
                <h4 className="text-lg font-bold text-white mb-6">
                  Actions Rapides
                </h4>

                <div className="space-y-3">
                  {isTouristicPlace &&
                    (booking.status === "confirmed" ||
                      booking.status === "paid") &&
                    onGenerateQRCode && (
                      <button
                        onClick={() => onGenerateQRCode(booking)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all font-medium"
                      >
                        <QrCode className="w-4 h-4" />
                        Générer QR Code
                      </button>
                    )}

                  {booking.status === "pending" && (
                    <button
                      onClick={() => onStatusUpdate(booking.id, "confirmed")}
                      className="w-full px-4 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all font-medium"
                    >
                      Confirmer la réservation
                    </button>
                  )}

                  {booking.status !== "cancelled" &&
                    booking.status !== "completed" && (
                      <button
                        onClick={() => onStatusUpdate(booking.id, "cancelled")}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
                      >
                        Annuler la réservation
                      </button>
                    )}

                  {(booking.status !== "paid" &&
                    booking.status !== "cancelled" &&
                    booking.status !== "failed") ||
                    (isActivity &&
                      activityBooking.paymentStatus !== "paid" &&
                      booking.status !== "cancelled" && (
                        <button
                          onClick={() => onStatusUpdate(booking.id, "paid")}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium"
                        >
                          Marquer comme payé
                        </button>
                      ))}

                  {isActivity && booking.status === "confirmed" && (
                    <button
                      onClick={() => onStatusUpdate(booking.id, "completed")}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium"
                    >
                      Marquer comme terminé
                    </button>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="text-sm text-white/80">
                    <div className="mb-1">Dernière modification</div>
                    <div className="font-medium">
                      {new Date(
                        booking.updatedAt || booking.bookedAt,
                      ).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demandes spéciales */}
          {booking.specialRequests && (
            <div className="mt-8 bg-[#6B8E23]/5 rounded-2xl border border-[#D3D3D3] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[#6B8E23]" />
                </div>
                <h4 className="text-lg font-bold text-[#8B4513]">
                  Demandes Spéciales
                </h4>
              </div>
              <div className="bg-white/80 rounded-xl p-4">
                <p className="text-[#8B4513] italic">
                  "{booking.specialRequests}"
                </p>
                {isActivity && activityBooking.participantNames.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-[#8B4513] mb-2">
                      Participants :
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {activityBooking.participantNames.map((name, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white rounded-lg border border-[#D3D3D3] text-sm"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant principal ProBookings
export const ProBookings = () => {
  const [activeTab, setActiveTab] = useState<BookingType>("accommodation");
  const [accommodationBookings, setAccommodationBookings] = useState<
    TourismeBooking[]
  >([]);
  const [touristicPlaceBookings, setTouristicPlaceBookings] = useState<
    TouristicPlaceBooking[]
  >([]);
  const [flightReservations, setFlightReservations] = useState<
    FlightReservation[]
  >([]);
  const [activityBookings, setActivityBookings] = useState<ActivityBooking[]>(
    [],
  ); // AJOUT
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [accommodationStats, setAccommodationStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
    averageBooking: 0,
  });
  const [touristicPlaceStats, setTouristicPlaceStats] = useState<BookingStats>({
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
  const [flightStats, setFlightStats] = useState<BookingStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
    averageBooking: 0,
    totalPassengers: 0,
  });
  const [activityStats, setActivityStats] = useState<BookingStats>({
    // AJOUT
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
    averageBooking: 0,
    totalParticipants: 0,
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    dateRange: "all",
    type: "all",
  });
  const [userPlaces, setUserPlaces] = useState<any[]>([]);
  const [userFlights, setUserFlights] = useState<any[]>([]);
  const [userActivities, setUserActivities] = useState<any[]>([]); // AJOUT

  // Charger les données
  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAccommodationBookings(),
        fetchTouristicPlaceBookings(),
        fetchFlightReservations(),
        fetchActivityBookings(), // AJOUT
      ]);
    } catch (error) {
      console.error("❌ Erreur chargement des réservations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAccommodationBookings = async () => {
    try {
      const response = await api.get("/tourisme-bookings?limit=1000");
      if (response.data.success) {
        setAccommodationBookings(response.data.data);
        calculateAccommodationStats(response.data.data);
      }
    } catch (error) {
      console.error("❌ Erreur chargement réservations hébergement:", error);
      const mockData = getMockAccommodationBookings();
      setAccommodationBookings(mockData);
      calculateAccommodationStats(mockData);
    }
  };

  const fetchTouristicPlaceBookings = async () => {
    try {
      const placesResponse = await tourismeAPI.getTouristicPlaces();
      const allPlaces = placesResponse.data.data;
      const userPlacesData = allPlaces.filter(
        (place: any) => place.idPrestataire,
      );
      setUserPlaces(userPlacesData);

      if (userPlacesData.length === 0) {
        setTouristicPlaceBookings([]);
        calculateTouristicPlaceStats([], []);
        return;
      }

      const bookingsResponse = await touristicPlaceBookingsAPI.getBookings({
        limit: 1000,
      });

      if (bookingsResponse.data.success) {
        const bookingsData = bookingsResponse.data.data;
        const placeIds = userPlacesData.map((place: any) => place.id);
        const userBookings = bookingsData.filter(
          (booking: TouristicPlaceBooking) =>
            placeIds.includes(booking.place.id),
        );

        setTouristicPlaceBookings(userBookings);
        calculateTouristicPlaceStats(userBookings, userPlacesData);
      } else {
        const mockData = getMockTouristicPlaceBookings();
        setTouristicPlaceBookings(mockData);
        calculateTouristicPlaceStats(mockData, getMockPlaces());
      }
    } catch (error) {
      console.error("❌ Erreur chargement réservations lieux:", error);
      const mockData = getMockTouristicPlaceBookings();
      setTouristicPlaceBookings(mockData);
      calculateTouristicPlaceStats(mockData, getMockPlaces());
    }
  };

  const fetchFlightReservations = async () => {
    try {
      // console.log("🔄 Chargement des réservations de vols...");

      const reservationsResponse = await api.get("/Vol/reservations");
      // console.log("📡 Réponse API réservations:", reservationsResponse.data);

      if (reservationsResponse.data.success && reservationsResponse.data.data) {
        const reservationsData = reservationsResponse.data.data;
        // console.log(`✈️ ${reservationsData.length} réservation(s) de vol trouvée(s)`, reservationsData);

        setFlightReservations(reservationsData);
        calculateFlightStats(reservationsData);

        const flightsResponse = await flightsAPI.getFlights();
        if (flightsResponse.data.success) {
          setUserFlights(flightsResponse.data.data);
        }
      } else {
        console.warn("⚠️ Aucune donnée de réservation dans la réponse");
        setFlightReservations([]);
        calculateFlightStats([]);
      }
    } catch (error) {
      console.error("❌ Erreur critique chargement réservations vols:", error);

      const mockData = getMockFlightReservations();
      // console.log("🔄 Utilisation des données mockées:", mockData);
      setFlightReservations(mockData);
      calculateFlightStats(mockData);
    }
  };

  // AJOUT: Fonction pour récupérer les réservations d'activités
  const fetchActivityBookings = async () => {
    try {
      console.log("🔄 Chargement des réservations d'activités...");

      const response = await activitiesAPI.getActivityBookings({ limit: 1000 });
      console.log("📡 Réponse API activités:", response.data);

      if (response.data.success) {
        setActivityBookings(response.data.data);
        calculateActivityStats(response.data.data);

        // Récupérer aussi les activités créées par l'utilisateur
        const activitiesResponse = await api.get("/activities/my/activities");
        if (activitiesResponse.data.success) {
          setUserActivities(activitiesResponse.data.data);
        }
      } else {
        console.warn("⚠️ Aucune donnée d'activité dans la réponse");
        const mockData = getMockActivityBookings();
        setActivityBookings(mockData);
        calculateActivityStats(mockData);
      }
    } catch (error) {
      console.error("❌ Erreur chargement réservations activités:", error);
      const mockData = getMockActivityBookings();
      setActivityBookings(mockData);
      calculateActivityStats(mockData);
    }
  };

  // Données mockées
  const getMockPlaces = () => [
    {
      id: "p1",
      title: "Château de Versailles",
      type: "touristic_place",
      category: "monument",
      city: "Versailles",
      images: [
        "https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg",
      ],
      price: 20,
      openingHours: "9:00-18:30",
      maxGuests: 100,
      idPrestataire: "mock-prestataire-id",
    },
  ];

  const getMockAccommodationBookings = (): TourismeBooking[] => [
    {
      id: "a1",
      confirmationNumber: "ACC-2024-001",
      status: "confirmed",
      checkIn: "2024-12-20",
      checkOut: "2024-12-25",
      guests: 4,
      adults: 2,
      children: 2,
      infants: 0,
      totalAmount: 600,
      serviceFee: 60,
      paymentMethod: "card",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listing: {
        id: "l1",
        title: "Villa de Luxe à Paris",
        type: "villa",
        city: "Paris",
        images: [
          "https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg",
        ],
        price: 120,
        provider: "direct",
      },
      user: {
        id: "u1",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "+33123456789",
      },
    },
  ];

  const getMockTouristicPlaceBookings = (): TouristicPlaceBooking[] => [
    {
      id: "t1",
      confirmationNumber: "TPL-2024-001",
      status: "paid",
      visitDate: "2024-12-15",
      visitTime: "14:00",
      numberOfTickets: 4,
      ticketType: "adult",
      totalAmount: 80,
      serviceFee: 8,
      paymentMethod: "card",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      place: getMockPlaces()[0],
      user: {
        id: "u1",
        firstName: "Pierre",
        lastName: "Durand",
        email: "pierre.durand@email.com",
        phone: "+33112233445",
      },
    },
  ];

  const getMockFlightReservations = (): FlightReservation[] => [
    {
      id: "f1",
      flightId: "flight1",
      idUser: "u1",
      idPrestataire: "p1",
      nbrPersonne: 2,
      place: "12A, 12B",
      status: "paid",
      totalAmount: 400,
      serviceFee: 40,
      paymentMethod: "card",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flight: {
        id: "flight1",
        compagnie: "Air France",
        numeroVol: "AF123",
        departVille: "Paris",
        departDateHeure: "2024-12-20T08:00:00Z",
        arriveeVille: "New York",
        arriveeDateHeure: "2024-12-20T11:00:00Z",
        duree: "8h",
        escales: 0,
        prix: 200,
        classe: "Economy",
        services: ["repas", "divertissement", "baggage"],
        image:
          "https://i.pinimg.com/1200x/79/94/5c/79945cc369cdb035eadcc41efc866a4c.jpg",
        aircraft: "Boeing 777",
        disponibilite: 150,
        rating: 4.5,
        reviewCount: 1200,
      },
      userReservation: {
        id: "u1",
        firstName: "Marie",
        lastName: "Martin",
        email: "marie.martin@email.com",
        phone: "+33123456789",
      },
    },
  ];

  // AJOUT: Données mockées pour les activités
  const getMockActivityBookings = (): ActivityBooking[] => [
    {
      id: "act1",
      activityId: "activity1",
      userId: "u1",
      bookingDate: "2024-12-15",
      startTime: "10:00",
      endTime: "12:00",
      participants: 4,
      totalAmount: 200,
      status: "confirmed",
      paymentStatus: "paid",
      participantNames: ["Jean Dupont", "Marie Martin"],
      participantEmails: ["jean@email.com", "marie@email.com"],
      specialRequests: "Matériel pour débutants si possible",
      bookedAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      activity: {
        id: "activity1",
        title: "Randonnée guidée en montagne",
        description:
          "Découverte des paysages montagneux avec guide professionnel",
        shortDescription: "Randonnée pour tous niveaux",
        mainImage:
          "https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg",
        images: [],
        price: 50,
        priceType: "per_person",
        duration: 120,
        durationType: "minutes",
        level: "beginner",
        location: "Chamonix",
        address: "Mont Blanc",
        meetingPoint: "Office de tourisme",
        category: "sport",
        userId: "pro1",
      },
      user: {
        id: "u1",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@email.com",
        phone: "+33123456789",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    },
  ];

  const generateQRCode = (booking: TouristicPlaceBooking) => {
    const qrData = {
      confirmationNumber: booking.confirmationNumber,
      place: booking.place.title,
      date: booking.visitDate,
      time: booking.visitTime,
      tickets: booking.numberOfTickets,
      type: booking.ticketType,
    };

    const qrString = JSON.stringify(qrData);
    // console.log('🎫 QR Code data:', qrString);
    alert(
      `QR Code généré pour: ${booking.confirmationNumber}\nDonnées: ${qrString}`,
    );
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchAllBookings();
  };

  // Calcul des statistiques
  const calculateAccommodationStats = (bookingsData: TourismeBooking[]) => {
    const confirmedAndCompleted = bookingsData.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed" ||
        b.status === "paid",
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0,
    );

    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter((b) => b.status === "pending").length,
      confirmed: bookingsData.filter(
        (b) => b.status === "confirmed" || b.status === "paid",
      ).length,
      cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
      completed: bookingsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking:
        confirmedAndCompleted.length > 0
          ? totalRevenue / confirmedAndCompleted.length
          : 0,
    };
    setAccommodationStats(statsData);
  };

  const calculateTouristicPlaceStats = (
    bookingsData: TouristicPlaceBooking[],
    places: any[] = [],
  ) => {
    const confirmedAndCompleted = bookingsData.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed" ||
        b.status === "paid",
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0,
    );
    const totalTickets = bookingsData.reduce(
      (sum, b) => sum + b.numberOfTickets,
      0,
    );

    const totalCapacity = places.reduce(
      (sum, place) => sum + (place.maxGuests || 0),
      0,
    );
    const occupancyRate =
      totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter((b) => b.status === "pending").length,
      confirmed: bookingsData.filter(
        (b) => b.status === "confirmed" || b.status === "paid",
      ).length,
      cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
      completed: bookingsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking:
        confirmedAndCompleted.length > 0
          ? totalRevenue / confirmedAndCompleted.length
          : 0,
      totalTickets,
      occupancyRate,
    };
    setTouristicPlaceStats(statsData);
  };

  const calculateFlightStats = (reservationsData: FlightReservation[]) => {
    // console.log("📈 Calcul stats pour réservations vols:", reservationsData);

    const confirmedAndCompleted = reservationsData.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed" ||
        b.status === "paid",
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0,
    );
    const totalPassengers = reservationsData.reduce(
      (sum, b) => sum + b.nbrPersonne,
      0,
    );

    // console.log("📊 Stats calculées vols:", {
    //   total: reservationsData.length,
    //   totalPassengers,
    //   totalRevenue
    // });

    const statsData: BookingStats = {
      total: reservationsData.length,
      pending: reservationsData.filter((b) => b.status === "pending").length,
      confirmed: reservationsData.filter(
        (b) => b.status === "confirmed" || b.status === "paid",
      ).length,
      cancelled: reservationsData.filter((b) => b.status === "cancelled")
        .length,
      completed: reservationsData.filter((b) => b.status === "completed")
        .length,
      revenue: totalRevenue,
      averageBooking:
        confirmedAndCompleted.length > 0
          ? totalRevenue / confirmedAndCompleted.length
          : 0,
      totalPassengers,
    };

    setFlightStats(statsData);
  };

  // AJOUT: Calcul des statistiques pour les activités
  const calculateActivityStats = (bookingsData: ActivityBooking[]) => {
    console.log("📈 Calcul stats pour réservations activités:", bookingsData);

    const confirmedAndCompleted = bookingsData.filter(
      (b) =>
        b.status === "confirmed" ||
        b.status === "completed" ||
        b.paymentStatus === "paid",
    );

    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0,
    );

    const totalParticipants = bookingsData.reduce(
      (sum, b) => sum + b.participants,
      0,
    );

    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter((b) => b.status === "pending").length,
      confirmed: bookingsData.filter((b) => b.status === "confirmed").length,
      cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
      completed: bookingsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking:
        confirmedAndCompleted.length > 0
          ? totalRevenue / confirmedAndCompleted.length
          : 0,
      totalParticipants,
    };

    setActivityStats(statsData);
  };

  // Appliquer les filtres
  useEffect(() => {
    let currentBookings: Booking[] = [];

    switch (activeTab) {
      case "accommodation":
        currentBookings = accommodationBookings;
        break;
      case "touristic_place":
        currentBookings = touristicPlaceBookings;
        break;
      case "flight":
        currentBookings = flightReservations;
        break;
      case "activity": // AJOUT
        currentBookings = activityBookings;
        break;
    }

    let results = currentBookings;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter((booking: any) => {
        const isAccommodation = "listing" in booking;
        const isTouristicPlace = "place" in booking;
        const isFlight = "flight" in booking;
        const isActivity = "activity" in booking; // AJOUT

        let title = "";
        let city = "";
        let user = null;

        if (isAccommodation) {
          title = booking.listing?.title;
          city = booking.listing?.city;
          user = booking.user;
        } else if (isTouristicPlace) {
          title = booking.place?.title;
          city = booking.place?.city;
          user = booking.user;
        } else if (isFlight) {
          title = `${booking.flight?.compagnie} - Vol ${booking.flight?.numeroVol}`;
          city = `${booking.flight?.departVille} → ${booking.flight?.arriveeVille}`;
          user = booking.userReservation;
        } else if (isActivity) {
          // AJOUT
          title = booking.activity?.title;
          city = booking.activity?.location;
          user = booking.user;
        }

        const confirmationNumber = isFlight
          ? `FLIGHT-${booking.id.slice(-6)}`
          : isActivity
            ? `ACT-${booking.id.slice(-6)}` // AJOUT
            : booking.confirmationNumber;

        return (
          confirmationNumber.toLowerCase().includes(searchLower) ||
          title?.toLowerCase().includes(searchLower) ||
          user?.firstName?.toLowerCase().includes(searchLower) ||
          user?.lastName?.toLowerCase().includes(searchLower) ||
          user?.email?.toLowerCase().includes(searchLower) ||
          city?.toLowerCase().includes(searchLower) ||
          (isFlight &&
            booking.flight?.compagnie?.toLowerCase().includes(searchLower)) ||
          (isFlight &&
            booking.flight?.numeroVol?.toLowerCase().includes(searchLower))
        );
      });
    }

    if (filters.status !== "all") {
      results = results.filter((booking: any) => {
        if (activeTab === "activity" && filters.status === "paid") {
          return booking.paymentStatus === "paid";
        }
        return booking.status === filters.status;
      });
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      results = results.filter((booking: any) => {
        let date: Date;

        if ("checkIn" in booking) {
          date = new Date(booking.checkIn);
        } else if ("visitDate" in booking) {
          date = new Date(booking.visitDate);
        } else if ("flight" in booking) {
          date = new Date(booking.flight.departDateHeure);
        } else if ("activity" in booking) {
          // AJOUT
          date = new Date(booking.bookingDate);
        } else {
          return true;
        }

        switch (filters.dateRange) {
          case "today":
            return date.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= monthAgo;
          case "future":
            return date > now;
          default:
            return true;
        }
      });
    }

    setFilteredBookings(results);
  }, [
    filters,
    activeTab,
    accommodationBookings,
    touristicPlaceBookings,
    flightReservations,
    activityBookings,
  ]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      console.log(`🔄 Mise à jour statut ${activeTab}:`, bookingId, status);

      if (activeTab === "accommodation") {
        const response = await api.put(
          `/tourisme-bookings/${bookingId}/status`,
          { status },
        );
        if (response.data.success) {
          setAccommodationBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId ? response.data.data : booking,
            ),
          );
        }
      } else if (activeTab === "touristic_place") {
        const response = await touristicPlaceBookingsAPI.updateStatus(
          bookingId,
          { status },
        );
        if (response.data.success) {
          setTouristicPlaceBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId ? response.data.data : booking,
            ),
          );
        }
      } else if (activeTab === "flight") {
        const response = await flightsAPI.updateReservationStatus(
          bookingId,
          status,
        );
        if (response.data.success) {
          setFlightReservations((prev) =>
            prev.map((booking) =>
              booking.id === bookingId ? response.data.data : booking,
            ),
          );
          console.log(`✅ Statut vol mis à jour: ${bookingId} -> ${status}`);
        }
      } else if (activeTab === "activity") {
        // AJOUT
        let response;
        if (status === "cancelled") {
          response = await activitiesAPI.cancelActivityBooking(bookingId);
        } else if (status === "confirmed") {
          response = await activitiesAPI.updateActivityBookingStatus(
            bookingId,
            status,
          );
        } else if (status === "completed") {
          response = await activitiesAPI.completeActivityBooking(bookingId);
        } else if (status === "paid") {
          response = await activitiesAPI.updateActivityPaymentStatus(
            bookingId,
            "paid",
          );
        }

        if (response && response.data.success) {
          setActivityBookings((prev) =>
            prev.map((booking) =>
              booking.id === bookingId ? response.data.data : booking,
            ),
          );
          console.log(
            `✅ Statut activité mis à jour: ${bookingId} -> ${status}`,
          );
        }
      }

      setShowDetailModal(false);
    } catch (error) {
      console.error("❌ Erreur mise à jour statut:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const sendReminder = async (bookingId: string) => {
    try {
      console.log("📨 Envoi rappel pour réservation:", bookingId);

      const booking = filteredBookings.find((b) => b.id === bookingId);
      if (booking) {
        const email =
          (booking as any).user?.email ||
          (booking as any).userReservation?.email;
        if (email) {
          const subject = `Rappel: Votre réservation ${activeTab === "flight" ? `FLIGHT-${bookingId.slice(-6)}` : activeTab === "activity" ? `ACT-${bookingId.slice(-6)}` : (booking as any).confirmationNumber}`;
          const body = `Bonjour,\n\nCeci est un rappel pour votre réservation.\n\nCordialement,\nL'équipe de voyage`;

          window.open(
            `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
            "_blank",
          );
        }
      }

      alert(`Rappel envoyé pour la réservation ${bookingId}`);
    } catch (error) {
      console.error("❌ Erreur envoi rappel:", error);
      alert("Erreur lors de l'envoi du rappel");
    }
  };

  const getCurrentStats = () => {
    switch (activeTab) {
      case "accommodation":
        return accommodationStats;
      case "touristic_place":
        return touristicPlaceStats;
      case "flight":
        return flightStats;
      case "activity":
        return activityStats; // AJOUT
      default:
        return accommodationStats;
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return filteredBookings.filter((booking: any) => {
      let date: Date;

      if ("checkIn" in booking) {
        date = new Date(booking.checkIn);
      } else if ("visitDate" in booking) {
        date = new Date(booking.visitDate);
      } else if ("flight" in booking) {
        date = new Date(booking.flight.departDateHeure);
      } else if ("activity" in booking) {
        // AJOUT
        date = new Date(booking.bookingDate);
      } else {
        return false;
      }

      const timeDiff = date.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return (
        daysDiff <= 7 &&
        daysDiff >= 0 &&
        (booking.status === "confirmed" ||
          booking.status === "paid" ||
          booking.paymentStatus === "paid")
      );
    }).length;
  };

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case "adult":
        return "Adulte";
      case "child":
        return "Enfant";
      case "student":
        return "Étudiant";
      case "senior":
        return "Senior";
      default:
        return type;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "monument":
        return <Landmark className="w-4 h-4 text-[#6B8E23]" />;
      case "museum":
        return <Building className="w-4 h-4 text-[#6B8E23]" />;
      case "park":
        return <GalleryVerticalEnd className="w-4 h-4 text-[#6B8E23]" />;
      case "religious":
        return <Church className="w-4 h-4 text-[#6B8E23]" />;
      case "historical":
        return <Castle className="w-4 h-4 text-[#6B8E23]" />;
      case "cultural":
        return <BookOpen className="w-4 h-4 text-[#6B8E23]" />;
      default:
        return <GalleryVerticalEnd className="w-4 h-4 text-[#8B4513]" />;
    }
  };

  // AJOUT: Helper pour les icônes d'activités
  const getActivityIcon = (category?: string) => {
    switch (category) {
      case "sport":
        return <Activity className="w-4 h-4 text-[#6B8E23]" />;
      case "culture":
        return <BookOpen className="w-4 h-4 text-[#6B8E23]" />;
      case "nature":
        return <GalleryVerticalEnd className="w-4 h-4 text-[#6B8E23]" />;
      case "adventure":
        return <MapPin className="w-4 h-4 text-[#6B8E23]" />;
      default:
        return <Activity className="w-4 h-4 text-[#8B4513]" />;
    }
  };

  const getAirlineColor = (airline: string) => {
    const colors: { [key: string]: string } = {
      "Air France": "bg-blue-100 text-blue-800 border-blue-200",
      "Air Senegal": "bg-[#6B8E23]/20 text-[#556B2F] border-[#6B8E23]/30",
      Emirates: "bg-red-100 text-red-800 border-red-200",
      "Qatar Airways": "bg-purple-100 text-purple-800 border-purple-200",
      "Turkish Airlines": "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colors[airline] || "bg-[#D3D3D3] text-[#8B4513] border-[#D3D3D3]";
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const exportToCSV = () => {
    console.log("Export CSV pour:", activeTab);
    alert(`Export CSV pour ${activeTab} en cours...`);
  };

  const getCurrentBookingsCount = () => {
    switch (activeTab) {
      case "accommodation":
        return accommodationBookings.length;
      case "touristic_place":
        return touristicPlaceBookings.length;
      case "flight":
        return flightReservations.length;
      case "activity":
        return activityBookings.length; // AJOUT
      default:
        return 0;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case "accommodation":
        return "hébergement";
      case "touristic_place":
        return "lieu touristique";
      case "flight":
        return "vol";
      case "activity":
        return "activité"; // AJOUT
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#6B8E23]/5 pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#D3D3D3] rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-[#D3D3D3] rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-[#D3D3D3] rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6B8E23]/5 pt-0">
      <div className="container mx-auto px-4">
        {/* En-tête avec bouton rafraîchir */}
        <div className="grid gap-4 lg:flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1.5 bg-[#556B2F] rounded-full"></div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#8B4513]">
                Gestion des Réservations
              </h1>
            </div>
            <p className="text-[#8B4513]/70">
              Gérez et suivez toutes vos réservations d'hébergements, de lieux
              touristiques, de vols et d'activités
            </p>
          </div>
          <button
            onClick={refreshBookings}
            disabled={refreshing}
            className="flex w-1/2 lg:w-auto items-center px-4 py-2 bg-[#6B8E23] text-white rounded-xl hover:bg-[#556B2F] transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Rafraîchissement..." : "Rafraîchir"}
          </button>
        </div>

        {/* Onglets */}
        <div className="flex flex-col md:flex-row space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("accommodation")}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "accommodation"
                ? "bg-[#6B8E23] text-white"
                : "bg-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F]"
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Hébergements
            <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {accommodationBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("touristic_place")}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "touristic_place"
                ? "bg-[#6B8E23] text-white"
                : "bg-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F]"
            }`}
          >
            <Camera className="w-5 h-5 mr-2" />
            Lieux Touristiques
            <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {touristicPlaceBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("flight")}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "flight"
                ? "bg-[#6B8E23] text-white"
                : "bg-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F]"
            }`}
          >
            <Plane className="w-5 h-5 mr-2" />
            Vols
            <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {flightReservations.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === "activity"
                ? "bg-[#6B8E23] text-white"
                : "bg-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F]"
            }`}
          >
            <Activity className="w-5 h-5 mr-2" />
            Activités
            <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
              {activityBookings.length}
            </span>
          </button>
        </div>

        {/* Message si aucun service créé */}
        {activeTab === "touristic_place" && userPlaces.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Aucun lieu touristique créé
                </h3>
                <p className="text-amber-700 mt-1">
                  Vous devez créer des lieux touristiques pour recevoir des
                  réservations.
                </p>
                <button
                  onClick={() => (window.location.href = "/admin/tourisme")}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Créer un lieu touristique
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "flight" && userFlights.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Aucun vol créé
                </h3>
                <p className="text-amber-700 mt-1">
                  Vous devez créer des vols pour recevoir des réservations.
                </p>
                <button
                  onClick={() => (window.location.href = "/admin/flights")}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Créer un vol
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AJOUT: Message si aucune activité créée */}
        {activeTab === "activity" && userActivities.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-amber-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">
                  Aucune activité créée
                </h3>
                <p className="text-amber-700 mt-1">
                  Vous devez créer des activités pour recevoir des réservations.
                </p>
                <button
                  onClick={() => (window.location.href = "/admin/activities")}
                  className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Créer une activité
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques améliorées */}
        {getCurrentBookingsCount() > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D3D3D3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    {activeTab === "activity"
                      ? "Total Participants"
                      : activeTab === "touristic_place"
                        ? "Total Tickets"
                        : activeTab === "flight"
                          ? "Total Passagers"
                          : "Total Réservations"}
                  </p>
                  <p className="text-3xl font-bold text-[#8B4513]">
                    {activeTab === "activity"
                      ? getCurrentStats().totalParticipants || 0
                      : activeTab === "touristic_place"
                        ? getCurrentStats().totalTickets || 0
                        : activeTab === "flight"
                          ? getCurrentStats().totalPassengers || 0
                          : getCurrentStats().total}
                  </p>
                  <p className="text-sm text-[#8B4513]/50 mt-1">
                    {activeTab === "activity"
                      ? `${getCurrentStats().total} réservations`
                      : activeTab === "touristic_place"
                        ? `${getCurrentStats().totalTickets} billets vendus`
                        : activeTab === "flight"
                          ? `${getCurrentStats().totalPassengers} passagers`
                          : `${((getCurrentStats().confirmed / getCurrentStats().total) * 100 || 0).toFixed(1)}% confirmées`}
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  {activeTab === "flight" ? (
                    <Plane className="w-6 h-6 text-[#6B8E23]" />
                  ) : activeTab === "activity" ? (
                    <Users className="w-6 h-6 text-[#6B8E23]" />
                  ) : (
                    <Calendar className="w-6 h-6 text-[#6B8E23]" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D3D3D3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    En Attente
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    {getCurrentStats().pending}
                  </p>
                  <p className="text-sm text-[#8B4513]/50 mt-1">
                    {(
                      (getCurrentStats().pending / getCurrentStats().total) *
                        100 || 0
                    ).toFixed(1)}
                    % du total
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D3D3D3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    Revenu Total
                  </p>
                  <p className="text-3xl font-bold text-[#6B8E23]">
                    {getCurrentStats().revenue.toFixed(2)}€
                  </p>
                  <p className="text-sm text-[#8B4513]/50 mt-1">
                    Moyenne: {getCurrentStats().averageBooking.toFixed(2)}€
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D3D3D3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    {activeTab === "touristic_place"
                      ? "Taux d'Occupation"
                      : activeTab === "flight"
                        ? "Taux de Remplissage"
                        : activeTab === "activity"
                          ? "Taux de Confirmation"
                          : "Taux Conversion"}
                  </p>
                  <p className="text-3xl font-bold text-[#556B2F]">
                    {activeTab === "touristic_place"
                      ? `${getCurrentStats().occupancyRate?.toFixed(1)}%`
                      : activeTab === "flight"
                        ? `${(((getCurrentStats().confirmed + getCurrentStats().completed) / getCurrentStats().total) * 100 || 0).toFixed(1)}%`
                        : activeTab === "activity"
                          ? `${(((getCurrentStats().confirmed + getCurrentStats().completed) / getCurrentStats().total) * 100 || 0).toFixed(1)}%`
                          : `${(((getCurrentStats().confirmed + getCurrentStats().completed) / getCurrentStats().total) * 100 || 0).toFixed(1)}%`}
                  </p>
                  <p className="text-sm text-[#8B4513]/50 mt-1">
                    {activeTab === "touristic_place"
                      ? "Capacité utilisée"
                      : activeTab === "flight"
                        ? "Vols confirmés"
                        : activeTab === "activity"
                          ? "Activités confirmées"
                          : `${getCurrentStats().cancelled} annulations`}
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <Users className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D3D3D3]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8B4513]/70">
                    Prochaines 7j
                  </p>
                  <p className="text-3xl font-bold text-[#8B4513]">
                    {getUpcomingBookings()}
                  </p>
                  <p className="text-sm text-[#8B4513]/50 mt-1">
                    {activeTab === "accommodation"
                      ? "Arrivées à venir"
                      : activeTab === "touristic_place"
                        ? "Visites à venir"
                        : activeTab === "flight"
                          ? "Départs à venir"
                          : "Activités à venir"}
                  </p>
                </div>
                <div className="p-3 bg-[#6B8E23]/10 rounded-xl">
                  <Calendar className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres améliorée */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#D3D3D3]">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Rechercher par numéro, client, ${getTabLabel()}, ville...`}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] text-[#8B4513]"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="px-4 py-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] text-sm text-[#8B4513]"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmé</option>
                <option value="paid">Payé</option>
                <option value="cancelled">Annulé</option>
                <option value="completed">Terminé</option>
                <option value="failed">Échec paiement</option>
                <option value="refunded">Remboursé</option>
              </select>

              <select
                className="px-4 py-3 border-2 border-[#D3D3D3] rounded-xl focus:ring-2 focus:ring-[#6B8E23] focus:border-[#6B8E23] text-sm text-[#8B4513]"
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
                className="flex items-center px-4 py-3 bg-[#6B8E23] text-white rounded-xl hover:bg-[#556B2F] transition-colors text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter CSV
              </button>
            </div>
          </div>

          {/* Résultats filtres */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#D3D3D3]">
            <div className="text-sm text-[#8B4513]/70">
              {filteredBookings.length} réservation(s) trouvée(s)
              {activeTab === "touristic_place" &&
                userPlaces.length > 0 &&
                ` sur ${userPlaces.length} lieu(x)`}
              {activeTab === "flight" &&
                userFlights.length > 0 &&
                ` sur ${userFlights.length} vol(s)`}
              {activeTab === "activity" &&
                userActivities.length > 0 &&
                ` sur ${userActivities.length} activité(s)`}
            </div>
            <div className="text-sm text-[#8B4513]/50 flex items-center">
              <RefreshCw className="w-4 h-4 mr-1" />
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Grille de cartes des réservations */}
        {filteredBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                type={activeTab}
                onViewDetails={() => {
                  setSelectedBooking(booking);
                  setShowDetailModal(true);
                }}
                onUpdateStatus={updateBookingStatus}
                onGenerateQRCode={
                  activeTab === "touristic_place" ? generateQRCode : undefined
                }
                getTicketTypeLabel={getTicketTypeLabel}
                getCategoryIcon={getCategoryIcon}
                calculateNights={calculateNights}
                getAirlineColor={getAirlineColor}
                getActivityIcon={getActivityIcon} // AJOUT
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#D3D3D3]">
            <Filter className="w-16 h-16 text-[#D3D3D3] mx-auto mb-4" />
            <p className="text-[#8B4513]/50 text-lg mb-2">
              Aucune réservation trouvée
            </p>
            <p className="text-[#8B4513]/30">
              {activeTab === "touristic_place" && userPlaces.length === 0
                ? "Vous devez créer des lieux touristiques pour recevoir des réservations"
                : activeTab === "flight" && userFlights.length === 0
                  ? "Vous devez créer des vols pour recevoir des réservations"
                  : activeTab === "activity" && userActivities.length === 0
                    ? "Vous devez créer des activités pour recevoir des réservations"
                    : "Essayez de modifier vos filtres de recherche"}
            </p>
          </div>
        )}

        {/* Modal de détail unifié */}
        {showDetailModal && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            type={activeTab}
            onClose={() => setShowDetailModal(false)}
            onStatusUpdate={updateBookingStatus}
            onSendReminder={sendReminder}
            onGenerateQRCode={
              activeTab === "touristic_place" ? generateQRCode : undefined
            }
            getTicketTypeLabel={getTicketTypeLabel}
            getCategoryIcon={getCategoryIcon}
            calculateNights={calculateNights}
            getAirlineColor={getAirlineColor}
            getActivityIcon={getActivityIcon} // AJOUT
          />
        )}
      </div>
    </div>
  );
};

export default ProBookings;
