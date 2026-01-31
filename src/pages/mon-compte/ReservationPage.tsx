import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  CreditCard,
  FileText,
  Home,
  Clock,
  Building,
  Scissors,
  Plane,
  Ticket,
  Eye,
  X,
  MessageCircle,
  User,
  Phone,
  Mail,
  QrCode,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Activity, // AJOUT: Icône pour les activités
} from "lucide-react";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// --- Couleurs du thème ---
const theme = {
  logo: "#556B2F", // Olive green
  primaryDark: "#6B8E23", // Yellow-green
  lightBg: "#F8F8F0", // Blanc cassé
  separator: "#D3D3D3", // Light gray
  secondaryText: "#8B4513", // Saddle brown
  accent: "#BDB76B", // Dark khaki
  success: "#228B22", // Forest green
  info: "#C0C0A0", // Olive silver
  error: "#CD5C5C", // Indian red
  warning: "#FFD700", // Gold
};

// Types pour les réservations tourisme
interface TourismBooking {
  id: string;
  code: string;
  service: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "confirmee" | "en_attente" | "annulee" | "terminee";
  amount: number;
  guests: number;
  adults: number;
  children: number;
  infants: number;
  specialRequests?: string;
  paymentMethod: string;
  paymentStatus: string;
  listing: {
    id: string;
    title: string;
    type: string;
    city: string;
    images: string[];
    price: number;
    provider?: string;
    rating: number;
    reviewCount: number;
    amenities: string[];
    description?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    maxGuests: number;
    instantBook?: boolean;
    cancellationPolicy?: string;
  };
  createdAt: string;
  cancelledAt?: string;
}

// Types pour les réservations services
interface Service {
  id: number;
  libelle: string;
  price: number;
  description: string;
}

interface ServiceBooking {
  id: string;
  userId: string;
  serviceId: number;
  service: Service;
  date: string;
  time: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
}

// Types pour les réservations de lieux touristiques
interface TouristicPlaceBooking {
  id: string;
  placeId: string;
  userId: string;
  visitDate: string;
  visitTime: string;
  numberOfTickets: number;
  ticketType: string;
  totalAmount: number;
  serviceFee: number;
  specialRequests?: string;
  paymentMethod: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  confirmationNumber: string;
  createdAt: string;
  cancelledAt?: string;
  place: {
    id: string;
    title: string;
    type: string;
    city: string;
    images: string[];
    price: number;
    openingHours?: string;
    maxGuests: number;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
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
  createdAt: string;
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
    image?: string;
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

// Composants utilitaires
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function TourismStatusBadge({ status }: { status: TourismBooking["status"] }) {
  const colorMap: Record<TourismBooking["status"], string> = {
    confirmee: theme.success,
    en_attente: theme.accent,
    terminee: theme.info,
    annulee: theme.error,
  };
  const label =
    status === "confirmee"
      ? "Confirmée"
      : status === "en_attente"
        ? "En attente"
        : status === "terminee"
          ? "Terminée"
          : "Annulée";

  return (
    <Badge
      className="text-white"
      style={{
        backgroundColor: colorMap[status],
        color: status === "annulee" ? "#fff" : theme.logo,
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}

function ServiceStatusBadge({ status }: { status: ServiceBooking["status"] }) {
  const colorMap: Record<ServiceBooking["status"], string> = {
    confirmed: theme.success,
    pending: theme.accent,
    completed: theme.info,
    cancelled: theme.error,
  };
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
        ? "En attente"
        : status === "completed"
          ? "Terminée"
          : "Annulée";

  return (
    <Badge
      className="text-white"
      style={{
        backgroundColor: colorMap[status],
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}

function TouristicPlaceStatusBadge({
  status,
}: {
  status: TouristicPlaceBooking["status"];
}) {
  const colorMap: Record<TouristicPlaceBooking["status"], string> = {
    confirmed: theme.success,
    pending: theme.accent,
    completed: theme.info,
    cancelled: theme.error,
  };
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
        ? "En attente"
        : status === "completed"
          ? "Terminée"
          : "Annulée";

  return (
    <Badge
      className="text-white"
      style={{
        backgroundColor: colorMap[status],
        color: status === "cancelled" ? "#fff" : theme.logo,
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}

function FlightStatusBadge({
  status,
}: {
  status: FlightReservation["status"];
}) {
  const colorMap: Record<FlightReservation["status"], string> = {
    confirmed: theme.success,
    paid: theme.success,
    completed: theme.info,
    pending: theme.accent,
    refunded: theme.warning,
    cancelled: theme.error,
    failed: theme.error,
  };
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
        ? "En attente"
        : status === "paid"
          ? "Payée"
          : status === "completed"
            ? "Terminée"
            : status === "refunded"
              ? "Remboursée"
              : "Annulée";

  return (
    <Badge
      className="text-white"
      style={{
        backgroundColor: colorMap[status] || theme.info,
        color: ["cancelled", "failed"].includes(status) ? "#fff" : theme.logo,
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}

// AJOUT: Badge pour les activités
function ActivityStatusBadge({
  status,
}: {
  status: ActivityBooking["status"];
}) {
  const colorMap: Record<ActivityBooking["status"], string> = {
    confirmed: theme.success,
    pending: theme.accent,
    completed: theme.info,
    cancelled: theme.error,
  };
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
        ? "En attente"
        : status === "completed"
          ? "Terminée"
          : "Annulée";

  return (
    <Badge
      className="text-white"
      style={{
        backgroundColor: colorMap[status],
        color: status === "cancelled" ? "#fff" : theme.logo,
        border: "none",
      }}
    >
      {label}
    </Badge>
  );
}

function generateBookingCode(id: string): string {
  return `BK-${id.slice(-4).toUpperCase()}`;
}

// Composant Modal de Détails
interface DetailModalProps {
  booking: any;
  type: "tourisme" | "service" | "touristic_place" | "flight" | "activity";
  isOpen: boolean;
  onClose: () => void;
}

function DetailModal({ booking, type, isOpen, onClose }: DetailModalProps) {
  if (!booking) return null;

  const renderTourismDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Date d'arrivée
          </h4>
          <p>{new Date(booking.checkIn).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Date de départ
          </h4>
          <p>{new Date(booking.checkOut).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Voyageurs</h4>
          <p>{booking.guests} personne(s)</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Méthode de paiement
          </h4>
          <p>{booking.paymentMethod}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Demandes spéciales
          </h4>
          <p>{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );

  const renderServiceDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Date</h4>
          <p>{new Date(booking.date).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Heure</h4>
          <p>{booking.time}</p>
        </div>
      </div>
      {booking.message && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Message</h4>
          <p>{booking.message}</p>
        </div>
      )}
    </div>
  );

  const renderTouristicPlaceDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Date de visite
          </h4>
          <p>{new Date(booking.visitDate).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Heure de visite
          </h4>
          <p>{booking.visitTime}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Nombre de billets
          </h4>
          <p>{booking.numberOfTickets}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Type de billet
          </h4>
          <p>{booking.ticketType}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Demandes spéciales
          </h4>
          <p>{booking.specialRequests}</p>
        </div>
      )}
    </div>
  );

  const renderFlightDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Départ</h4>
          <p>{booking.flight.departVille}</p>
          <p className="text-sm text-gray-500">
            {new Date(booking.flight.departDateHeure).toLocaleString("fr-FR")}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Arrivée</h4>
          <p>{booking.flight.arriveeVille}</p>
          <p className="text-sm text-gray-500">
            {new Date(booking.flight.arriveeDateHeure).toLocaleString("fr-FR")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Passagers</h4>
          <p>{booking.nbrPersonne}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Classe</h4>
          <p>{booking.flight.classe}</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-sm text-gray-500">Compagnie</h4>
        <p>
          {booking.flight.compagnie} - Vol {booking.flight.numeroVol}
        </p>
      </div>
    </div>
  );

  // AJOUT: Détails pour les activités
  const renderActivityDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Date de l'activité
          </h4>
          <p>{new Date(booking.bookingDate).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Horaires</h4>
          <p>
            {booking.startTime} {booking.endTime && `- ${booking.endTime}`}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Participants</h4>
          <p>{booking.participants} personne(s)</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Niveau</h4>
          <p>{booking.activity?.level || "Tous niveaux"}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Demandes spéciales
          </h4>
          <p>{booking.specialRequests}</p>
        </div>
      )}
      {booking.participantNames.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">
            Participants inscrits
          </h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {booking.participantNames.map((name: string, index: number) => (
              <Badge key={index} variant="outline">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const getModalTitle = () => {
    switch (type) {
      case "tourisme":
        return "Détails de la réservation d'hébergement";
      case "service":
        return "Détails de la réservation de service";
      case "touristic_place":
        return "Détails de la réservation de billet";
      case "flight":
        return "Détails de la réservation de vol";
      case "activity":
        return "Détails de la réservation d'activité";
      default:
        return "Détails de la réservation";
    }
  };

  const getBookingImage = () => {
    switch (type) {
      case "tourisme":
        return booking.listing.images?.[0];
      case "service":
        return "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
      case "touristic_place":
        return booking.place.images?.[0];
      case "flight":
        return booking.flight.image;
      case "activity":
        return booking.activity?.mainImage || booking.activity?.images?.[0];
      default:
        return "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
    }
  };

  const getBookingTitle = () => {
    switch (type) {
      case "tourisme":
        return booking.listing.title;
      case "service":
        return booking.service.libelle;
      case "touristic_place":
        return booking.place.title;
      case "flight":
        return `${booking.flight.compagnie} - Vol ${booking.flight.numeroVol}`;
      case "activity":
        return booking.activity?.title;
      default:
        return "Réservation";
    }
  };

  const getBookingDescription = () => {
    switch (type) {
      case "tourisme":
        return `${booking.listing.city} • ${booking.listing.type}`;
      case "service":
        return booking.service.description;
      case "touristic_place":
        return `${booking.place.city} • ${booking.place.type}`;
      case "flight":
        return `${booking.flight.departVille} → ${booking.flight.arriveeVille}`;
      case "activity":
        return `${booking.activity?.location} • ${booking.activity?.category || "Activité"}`;
      default:
        return "";
    }
  };

  const getStatusBadge = () => {
    switch (type) {
      case "tourisme":
        return <TourismStatusBadge status={booking.status} />;
      case "service":
        return <ServiceStatusBadge status={booking.status} />;
      case "touristic_place":
        return <TouristicPlaceStatusBadge status={booking.status} />;
      case "flight":
        return <FlightStatusBadge status={booking.status} />;
      case "activity":
        return <ActivityStatusBadge status={booking.status} />;
      default:
        return null;
    }
  };

  const getTypeBadge = () => {
    const typeLabels = {
      tourisme: "Hébergement",
      service: "Service",
      touristic_place: "Billet",
      flight: "Vol",
      activity: "Activité",
    };
    return (
      <Badge variant="outline" className="text-xs">
        {typeLabels[type] || "Réservation"}
      </Badge>
    );
  };

  const getAmount = () => {
    switch (type) {
      case "tourisme":
        return booking.amount;
      case "service":
        return booking.service.price;
      case "touristic_place":
        return booking.totalAmount;
      case "flight":
        return booking.flight.prix * booking.nbrPersonne;
      case "activity":
        return booking.totalAmount;
      default:
        return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img
                src={getBookingImage()}
                alt="Image"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg">{getBookingTitle()}</h3>
              <p className="text-gray-600 text-sm mt-1">
                {getBookingDescription()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge()}
                {getTypeBadge()}
              </div>
            </div>
          </div>

          {/* Détails spécifiques */}
          <div className="border-t pt-4">
            {type === "tourisme" && renderTourismDetails()}
            {type === "service" && renderServiceDetails()}
            {type === "touristic_place" && renderTouristicPlaceDetails()}
            {type === "flight" && renderFlightDetails()}
            {type === "activity" && renderActivityDetails()}
          </div>

          {/* Informations de paiement */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-500 mb-2">
              Informations de paiement
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Montant total
                </h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(getAmount())}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">
                  Référence
                </h4>
                <p>
                  {type === "tourisme"
                    ? booking.code
                    : type === "touristic_place"
                      ? booking.confirmationNumber
                      : type === "flight"
                        ? `Vol ${booking.flight.numeroVol}`
                        : type === "activity"
                          ? `ACT-${booking.id.slice(-6)}`
                          : booking.id}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant Carte de Réservation Générique
interface BookingCardProps {
  booking: any;
  type: "tourisme" | "service" | "touristic_place" | "flight" | "activity";
  onViewDetails: () => void;
  onCancel?: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  getBookingImage: () => string;
  getBookingTitle: () => string;
  getBookingSubtitle: () => string;
  getBookingDate: () => string;
  getBookingDetails: () => string;
  getBookingAmount: () => number;
  canCancel?: boolean;
}

function BookingCard({
  booking,
  type,
  onViewDetails,
  onCancel,
  getStatusBadge,
  getBookingImage,
  getBookingTitle,
  getBookingSubtitle,
  getBookingDate,
  getBookingDetails,
  getBookingAmount,
  canCancel = true,
}: BookingCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300"
      style={{ borderColor: theme.separator, background: theme.lightBg }}
    >
      {/* Layout pour mobile : image en haut */}
      <div className="block md:hidden">
        {/* Image en haut pour mobile */}
        <div className="w-full h-40">
          <img
            src={getBookingImage()}
            alt={getBookingTitle()}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        {/* Contenu sous l'image pour mobile */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(booking.status)}
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: theme.logo,
                    color: theme.logo,
                    background: theme.accent,
                  }}
                >
                  {type === "tourisme"
                    ? " Hébergement"
                    : type === "service"
                      ? " Service"
                      : type === "touristic_place"
                        ? " Billet"
                        : type === "flight"
                          ? " Vol"
                          : " Activité"}
                </Badge>
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: theme.logo }}
              >
                {getBookingTitle()}
              </h3>
              <p
                className="text-sm mb-2"
                style={{ color: theme.secondaryText }}
              >
                {getBookingSubtitle()}
              </p>
            </div>

            {/* Menu d'actions pour mobile */}
            <div className="relative inline-block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      onViewDetails();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir les détails
                  </button>

                  {canCancel && onCancel && (
                    <button
                      onClick={() => {
                        onCancel();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informations détaillées pour mobile */}
          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar
                className="w-4 h-4"
                style={{ color: theme.primaryDark }}
              />
              <span className="text-xs">{getBookingDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: theme.primaryDark }} />
              <span className="text-xs">{getBookingDetails()}</span>
            </div>
          </div>

          {/* Montant et actions pour mobile */}
          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold" style={{ color: theme.logo }}>
                {formatCurrency(getBookingAmount())}
              </div>
              <div className="text-xs" style={{ color: theme.secondaryText }}>
                {type === "touristic_place" && booking.confirmationNumber && (
                  <span>Ref: {booking.confirmationNumber}</span>
                )}
                {type === "tourisme" && booking.code && (
                  <span>Ref: {booking.code}</span>
                )}
                {type === "flight" && (
                  <span>Vol: {booking.flight?.numeroVol}</span>
                )}
                {type === "activity" && (
                  <span>Ref: ACT-{booking.id.slice(-6)}</span>
                )}
              </div>
            </div>

            {/* Boutons d'action pour mobile */}
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onViewDetails}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Layout pour desktop : image à gauche */}
      <div className="hidden md:flex">
        {/* Image à gauche pour desktop */}
        <div className="w-24 flex-shrink-0">
          <img
            src={getBookingImage()}
            alt={getBookingTitle()}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        {/* Contenu à droite pour desktop */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(booking.status)}
                <Badge
                  variant="outline"
                  className="text-xs bg-secondary-text text-white"
                  style={{
                    borderColor: theme.logo,
                  }}
                >
                  {type === "tourisme"
                    ? " Hébergement"
                    : type === "service"
                      ? " Service"
                      : type === "touristic_place"
                        ? " Billet"
                        : type === "flight"
                          ? " Vol"
                          : " Activité"}
                </Badge>
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: theme.logo }}
              >
                {getBookingTitle()}
              </h3>
              <p
                className="text-sm mb-2"
                style={{ color: theme.secondaryText }}
              >
                {getBookingSubtitle()}
              </p>
            </div>

            {/* Menu d'actions pour desktop */}
            <div className="relative inline-block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActions(!showActions)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showActions && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      onViewDetails();
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir les détails
                  </button>

                  {canCancel && onCancel && (
                    <button
                      onClick={() => {
                        onCancel();
                        setShowActions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Informations détaillées pour desktop */}
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar
                className="w-4 h-4"
                style={{ color: theme.primaryDark }}
              />
              <span>{getBookingDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: theme.primaryDark }} />
              <span>{getBookingDetails()}</span>
            </div>
          </div>

          {/* Montant et actions pour desktop */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-right">
              <div className="text-xl font-bold" style={{ color: theme.logo }}>
                {formatCurrency(getBookingAmount())}
              </div>
              <div className="text-sm" style={{ color: theme.secondaryText }}>
                {type === "touristic_place" && booking.confirmationNumber && (
                  <span>Ref: {booking.confirmationNumber}</span>
                )}
                {type === "tourisme" && booking.code && (
                  <span>Ref: {booking.code}</span>
                )}
                {type === "flight" && (
                  <span>Vol: {booking.flight?.numeroVol}</span>
                )}
                {type === "activity" && (
                  <span>Ref: ACT-{booking.id.slice(-6)}</span>
                )}
              </div>
            </div>

            {/* Boutons d'action pour desktop */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onViewDetails}>
                <Eye className="w-4 h-4 mr-1" />
                Détails
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Composant principal
export default function UnifiedReservationPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // États pour les réservations
  const [tourismBookings, setTourismBookings] = useState<TourismBooking[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [touristicPlaceBookings, setTouristicPlaceBookings] = useState<
    TouristicPlaceBooking[]
  >([]);
  const [flightReservations, setFlightReservations] = useState<
    FlightReservation[]
  >([]);
  const [activityBookings, setActivityBookings] = useState<ActivityBooking[]>(
    [],
  ); // AJOUT

  const [tourismLoading, setTourismLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [touristicPlaceLoading, setTouristicPlaceLoading] = useState(true);
  const [flightLoading, setFlightLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true); // AJOUT

  const [tourismFilter, setTourismFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [touristicPlaceFilter, setTouristicPlaceFilter] =
    useState<string>("all");
  const [flightFilter, setFlightFilter] = useState<string>("all");
  const [activityFilter, setActivityFilter] = useState<string>("all"); // AJOUT

  const [selectedTourismBooking, setSelectedTourismBooking] =
    useState<TourismBooking | null>(null);
  const [selectedServiceBooking, setSelectedServiceBooking] =
    useState<ServiceBooking | null>(null);
  const [selectedTouristicPlaceBooking, setSelectedTouristicPlaceBooking] =
    useState<TouristicPlaceBooking | null>(null);
  const [selectedFlightReservation, setSelectedFlightReservation] =
    useState<FlightReservation | null>(null);
  const [selectedActivityBooking, setSelectedActivityBooking] =
    useState<ActivityBooking | null>(null); // AJOUT

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentBookingType, setCurrentBookingType] = useState<
    "tourisme" | "service" | "touristic_place" | "flight" | "activity"
  >("tourisme");

  // Charger les réservations tourisme
  useEffect(() => {
    const fetchTourismBookings = async () => {
      if (!isAuthenticated || !user) {
        setTourismLoading(false);
        return;
      }

      try {
        setTourismLoading(true);
        const response = await api.get("/user/bookings", {
          params: {
            userId: user.id,
            status: tourismFilter !== "all" ? tourismFilter : undefined,
          },
        });

        if (response.data.success) {
          setTourismBookings(response.data.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations tourisme",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur chargement réservations tourisme:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des réservations tourisme",
          variant: "destructive",
        });
      } finally {
        setTourismLoading(false);
      }
    };

    fetchTourismBookings();
  }, [isAuthenticated, user, tourismFilter, toast]);

  // Charger les réservations services
  useEffect(() => {
    const fetchServiceBookings = async () => {
      if (!isAuthenticated || !user) {
        setServiceLoading(false);
        return;
      }

      try {
        setServiceLoading(true);
        const response = await api.get("/appointment/appointment");

        const mappedBookings = response.data.map((booking: any) => ({
          ...booking,
          status: mapServiceStatus(booking.status),
        }));

        setServiceBookings(mappedBookings);
      } catch (error) {
        console.error("Erreur chargement réservations services:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des réservations services",
          variant: "destructive",
        });
      } finally {
        setServiceLoading(false);
      }
    };

    fetchServiceBookings();
  }, [isAuthenticated, user, serviceFilter, toast]);

  // Charger les réservations de lieux touristiques
  useEffect(() => {
    const fetchTouristicPlaceBookings = async () => {
      if (!isAuthenticated || !user) {
        setTouristicPlaceLoading(false);
        return;
      }

      try {
        setTouristicPlaceLoading(true);
        const response = await api.get("/touristic-place-bookings", {
          params: {
            userId: user.id,
            status:
              touristicPlaceFilter !== "all" ? touristicPlaceFilter : undefined,
          },
        });

        if (response.data.success) {
          setTouristicPlaceBookings(response.data.data);
        } else {
          toast({
            title: "Erreur",
            description:
              "Impossible de charger les réservations de lieux touristiques",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error(
          "Erreur chargement réservations lieux touristiques:",
          error,
        );
        toast({
          title: "Erreur",
          description:
            "Erreur lors du chargement des réservations de lieux touristiques",
          variant: "destructive",
        });
      } finally {
        setTouristicPlaceLoading(false);
      }
    };

    fetchTouristicPlaceBookings();
  }, [isAuthenticated, user, touristicPlaceFilter, toast]);

  // Charger les réservations de vols
  useEffect(() => {
    const fetchFlightReservations = async () => {
      if (!isAuthenticated || !user) {
        setFlightLoading(false);
        return;
      }

      try {
        setFlightLoading(true);
        const response = await api.get("/Vol/reservations");

        if (response.data.success) {
          setFlightReservations(response.data.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations de vols",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur chargement réservations vols:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des réservations de vols",
          variant: "destructive",
        });
      } finally {
        setFlightLoading(false);
      }
    };

    fetchFlightReservations();
  }, [isAuthenticated, user, flightFilter, toast]);

  // AJOUT: Charger les réservations d'activités
  useEffect(() => {
    const fetchActivityBookings = async () => {
      if (!isAuthenticated || !user) {
        setActivityLoading(false);
        return;
      }

      try {
        setActivityLoading(true);
        const response = await api.get("/activity-bookings/my-bookings", {
          params: {
            userId: user.id,
            status: activityFilter !== "all" ? activityFilter : undefined,
          },
        });

        if (response.data.success) {
          setActivityBookings(response.data.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations d'activités",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur chargement réservations activités:", error);
        // Si l'API n'est pas disponible, utiliser des données mockées
        const mockData = getMockActivityBookings();
        setActivityBookings(mockData);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityBookings();
  }, [isAuthenticated, user, activityFilter, toast]);

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
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
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
    {
      id: "act2",
      activityId: "activity2",
      userId: "u1",
      bookingDate: "2024-12-20",
      startTime: "14:00",
      endTime: "16:00",
      participants: 2,
      totalAmount: 120,
      status: "pending",
      paymentStatus: "pending",
      participantNames: ["Sophie Leroy"],
      participantEmails: ["sophie@email.com"],
      specialRequests: "Cours particulier",
      bookedAt: new Date().toISOString(),
      activity: {
        id: "activity2",
        title: "Cours de surf à Biarritz",
        description: "Apprenez à surfer avec des moniteurs certifiés",
        shortDescription: "Cours de surf tous niveaux",
        mainImage:
          "https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        images: [],
        price: 60,
        priceType: "per_person",
        duration: 120,
        durationType: "minutes",
        level: "beginner",
        location: "Biarritz",
        address: "Plage de la Côte des Basques",
        meetingPoint: "École de surf",
        category: "sport",
        userId: "pro2",
      },
      user: {
        id: "u1",
        firstName: "Sophie",
        lastName: "Leroy",
        email: "sophie.leroy@email.com",
        phone: "+33123456790",
      },
    },
  ];

  // Fonctions d'annulation
  const cancelTourismBooking = async (id: string) => {
    try {
      const response = await api.put(`/user/bookings/${id}/cancel`, {
        userId: user?.id,
      });

      if (response.data.success) {
        setTourismBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "annulee" as const } : b,
          ),
        );
        toast({
          title: "Réservation annulée",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      console.error("Erreur annulation tourisme:", error);
      toast({
        title: "Erreur",
        description:
          error.response?.data?.error || "Erreur lors de l'annulation",
        variant: "destructive",
      });
    }
  };

  const cancelServiceBooking = async (id: string) => {
    try {
      await api.patch(`/appointment/${id}/cancel`);
      setServiceBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulée avec succès",
      });
    } catch (error) {
      console.error("Erreur annulation service:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    }
  };

  const cancelTouristicPlaceBooking = async (id: string) => {
    try {
      await api.delete(`/touristic-place-bookings/${id}`);
      setTouristicPlaceBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast({
        title: "Réservation annulée",
        description: "Votre réservation de lieu touristique a été annulée",
      });
    } catch (error) {
      console.error("Erreur annulation lieu touristique:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    }
  };

  const cancelFlightReservation = async (id: string) => {
    try {
      await api.put(`/Vol/reservations/${id}/status`, { status: "cancelled" });
      setFlightReservations((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast({
        title: "Réservation annulée",
        description: "Votre réservation de vol a été annulée",
      });
    } catch (error) {
      console.error("Erreur annulation vol:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    }
  };

  // AJOUT: Annuler une réservation d'activité
  const cancelActivityBooking = async (id: string) => {
    try {
      await api.put(`/activity-bookings/${id}/cancel`);
      setActivityBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
      );
      toast({
        title: "Réservation annulée",
        description: "Votre réservation d'activité a été annulée",
      });
    } catch (error) {
      console.error("Erreur annulation activité:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'annuler la réservation",
        variant: "destructive",
      });
    }
  };

  // Fonctions de mapping des statuts
  const mapServiceStatus = (status: string): ServiceBooking["status"] => {
    const statusMap: Record<string, ServiceBooking["status"]> = {
      pending: "pending",
      confirmed: "confirmed",
      cancelled: "cancelled",
      completed: "completed",
    };
    return statusMap[status] || "pending";
  };

  // Fonctions utilitaires pour les cartes
  const getTourismCardData = (booking: TourismBooking) => ({
    image:
      booking.listing.images?.[0] ||
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.listing.title,
    subtitle: `${booking.listing.city} • ${booking.listing.type}`,
    date: `${new Date(booking.checkIn).toLocaleDateString("fr-FR")} - ${new Date(booking.checkOut).toLocaleDateString("fr-FR")}`,
    details: `${booking.guests} voyageur${booking.guests > 1 ? "s" : ""}`,
    amount: booking.amount,
    canCancel: booking.status !== "annulee" && booking.status !== "terminee",
  });

  const getServiceCardData = (booking: ServiceBooking) => ({
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.service.libelle,
    subtitle: booking.service.description,
    date: new Date(booking.date).toLocaleDateString("fr-FR"),
    details: booking.time,
    amount: booking.service.price,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  const getTouristicPlaceCardData = (booking: TouristicPlaceBooking) => ({
    image:
      booking.place.images?.[0] ||
      "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.place.title,
    subtitle: `${booking.place.city} • ${booking.place.type}`,
    date: new Date(booking.visitDate).toLocaleDateString("fr-FR"),
    details: `${booking.numberOfTickets} billet${booking.numberOfTickets > 1 ? "s" : ""} • ${booking.visitTime}`,
    amount: booking.totalAmount,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  const getFlightCardData = (booking: FlightReservation) => ({
    image:
      booking.flight.image ||
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: `${booking.flight.compagnie} - Vol ${booking.flight.numeroVol}`,
    subtitle: `${booking.flight.departVille} → ${booking.flight.arriveeVille}`,
    date: new Date(booking.flight.departDateHeure).toLocaleDateString("fr-FR"),
    details: `${booking.nbrPersonne} passager${booking.nbrPersonne > 1 ? "s" : ""} • ${booking.flight.classe}`,
    amount: booking.flight.prix * booking.nbrPersonne,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  // AJOUT: Fonctions utilitaires pour les cartes d'activités
  const getActivityCardData = (booking: ActivityBooking) => ({
    image:
      booking.activity?.mainImage ||
      booking.activity?.images?.[0] ||
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.activity?.title || "Activité",
    subtitle: `${booking.activity?.location || "Lieu non spécifié"} • ${booking.activity?.category || "Activité"}`,
    date: new Date(booking.bookingDate).toLocaleDateString("fr-FR"),
    details: `${booking.participants} participant${booking.participants > 1 ? "s" : ""} • ${booking.startTime || ""}`,
    amount: booking.totalAmount,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  // Fonctions pour ouvrir les modals de détails
  const openTourismDetails = (booking: TourismBooking) => {
    setSelectedTourismBooking(booking);
    setCurrentBookingType("tourisme");
    setDetailModalOpen(true);
  };

  const openServiceDetails = (booking: ServiceBooking) => {
    setSelectedServiceBooking(booking);
    setCurrentBookingType("service");
    setDetailModalOpen(true);
  };

  const openTouristicPlaceDetails = (booking: TouristicPlaceBooking) => {
    setSelectedTouristicPlaceBooking(booking);
    setCurrentBookingType("touristic_place");
    setDetailModalOpen(true);
  };

  const openFlightDetails = (booking: FlightReservation) => {
    setSelectedFlightReservation(booking);
    setCurrentBookingType("flight");
    setDetailModalOpen(true);
  };

  // AJOUT: Ouvrir les détails d'une activité
  const openActivityDetails = (booking: ActivityBooking) => {
    setSelectedActivityBooking(booking);
    setCurrentBookingType("activity");
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTourismBooking(null);
    setSelectedServiceBooking(null);
    setSelectedTouristicPlaceBooking(null);
    setSelectedFlightReservation(null);
    setSelectedActivityBooking(null); // AJOUT
  };

  const getCurrentBooking = () => {
    switch (currentBookingType) {
      case "tourisme":
        return selectedTourismBooking;
      case "service":
        return selectedServiceBooking;
      case "touristic_place":
        return selectedTouristicPlaceBooking;
      case "flight":
        return selectedFlightReservation;
      case "activity": // AJOUT
        return selectedActivityBooking;
      default:
        return null;
    }
  };

  // AJOUT: Mettre à jour les TabsList pour inclure les activités
  const tabItems = [
    {
      value: "services",
      icon: Scissors,
      label: "Services de bien-être",
      count: serviceBookings.length,
    },
    {
      value: "tourisme",
      icon: Building,
      label: "Hébergements",
      count: tourismBookings.length,
    },
    {
      value: "lieux-touristiques",
      icon: Ticket,
      label: "Billets",
      count: touristicPlaceBookings.length,
    },
    {
      value: "vols",
      icon: Plane,
      label: "Vols",
      count: flightReservations.length,
    },
    {
      value: "activites",
      icon: Activity,
      label: "Activités",
      count: activityBookings.length,
    }, // AJOUT
  ];

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-6xl py-8 mt-12">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Connectez-vous</h2>
              <p className="text-muted-foreground mb-4">
                Vous devez être connecté pour voir vos réservations
              </p>
              <Button asChild>
                <Link to="/login">Se connecter</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-5 py-8 mt-12" style={{ background: theme.lightBg }}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: theme.logo }}>
          Mes Réservations tourisme et Bien-être
        </h1>
        <p style={{ color: theme.secondaryText }}>
          {user?.firstName ? `Bonjour ${user.firstName}, ` : ""}
          Consultez et gérez toutes vos réservations.
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList
          className="grid w-full grid-cols-1 md:grid-cols-5 p-2 h-auto gap-2"
          style={{
            background: theme.primaryDark,
            borderColor: theme.separator,
          }}
        >
          {tabItems.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 text-white"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <Badge variant="secondary" className="ml-2">
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Onglet Hébergements */}
        <TabsContent value="tourisme">
          <Card style={{ borderColor: theme.separator }}>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle style={{ color: theme.logo }}>
                    Mes réservations d'hébergements
                  </CardTitle>
                  <CardDescription style={{ color: theme.secondaryText }}>
                    {tourismBookings.length} réservation
                    {tourismBookings.length > 1 ? "s" : ""} trouvée
                    {tourismBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select value={tourismFilter} onValueChange={setTourismFilter}>
                  <SelectTrigger
                    className="w-48"
                    style={{ background: theme.accent, color: theme.logo }}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent style={{ background: theme.lightBg }}>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="confirmee">Confirmées</SelectItem>
                    <SelectItem value="terminee">Terminées</SelectItem>
                    <SelectItem value="annulee">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {tourismLoading ? (
                <LoadingSpinner text="Chargement de vos réservations" />
              ) : tourismBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation d'hébergement
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de réservation d'hébergement.
                  </p>
                  <Button asChild className="text-white bg-[#556B2F]">
                    <Link to="/tourisme">Découvrir les hébergements</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tourismBookings.map((booking) => {
                    const cardData = getTourismCardData(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="tourisme"
                        onViewDetails={() => openTourismDetails(booking)}
                        onCancel={() => cancelTourismBooking(booking.id)}
                        getStatusBadge={() => (
                          <TourismStatusBadge status={booking.status} />
                        )}
                        getBookingImage={() => cardData.image}
                        getBookingTitle={() => cardData.title}
                        getBookingSubtitle={() => cardData.subtitle}
                        getBookingDate={() => cardData.date}
                        getBookingDetails={() => cardData.details}
                        getBookingAmount={() => cardData.amount}
                        canCancel={cardData.canCancel}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Services */}
        <TabsContent value="services">
          <Card style={{ borderColor: theme.separator }}>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle style={{ color: theme.logo }}>
                    Mes réservations de services bien-être
                  </CardTitle>
                  <CardDescription style={{ color: theme.secondaryText }}>
                    Historique et réservations à venir
                  </CardDescription>
                </div>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-48 bg-logo text-white">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent
                    className=""
                    style={{ background: theme.lightBg }}
                  >
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {serviceLoading ? (
                <LoadingSpinner text="Chargement de vos réservations" />
              ) : serviceBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation de service
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de réservation de service.
                  </p>
                  <Button asChild className="text-white bg-[#556B2F]">
                    <Link to="/services-partners">Découvrir les services</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceBookings.map((booking) => {
                    const cardData = getServiceCardData(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="service"
                        onViewDetails={() => openServiceDetails(booking)}
                        onCancel={() => cancelServiceBooking(booking.id)}
                        getStatusBadge={() => (
                          <ServiceStatusBadge status={booking.status} />
                        )}
                        getBookingImage={() => cardData.image}
                        getBookingTitle={() => cardData.title}
                        getBookingSubtitle={() => cardData.subtitle}
                        getBookingDate={() => cardData.date}
                        getBookingDetails={() => cardData.details}
                        getBookingAmount={() => cardData.amount}
                        canCancel={cardData.canCancel}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Lieux Touristiques */}
        <TabsContent value="lieux-touristiques">
          <Card style={{ borderColor: theme.separator }}>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle style={{ color: theme.logo }}>
                    Mes billets de lieux touristiques
                  </CardTitle>
                  <CardDescription style={{ color: theme.secondaryText }}>
                    {touristicPlaceBookings.length} billet
                    {touristicPlaceBookings.length > 1 ? "s" : ""} trouvé
                    {touristicPlaceBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select
                  value={touristicPlaceFilter}
                  onValueChange={setTouristicPlaceFilter}
                >
                  <SelectTrigger
                    className="w-48"
                    style={{ background: theme.accent, color: theme.logo }}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent style={{ background: theme.lightBg }}>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {touristicPlaceLoading ? (
                <div className="text-center py-8">
                  <p>Chargement de vos billets...</p>
                </div>
              ) : touristicPlaceBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun billet de lieu touristique
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de billet pour un lieu touristique.
                  </p>
                  <Button asChild className="text-white bg-[#556B2F]">
                    <Link to="/tourisme?type=touristic">
                      Découvrir les lieux
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {touristicPlaceBookings.map((booking) => {
                    const cardData = getTouristicPlaceCardData(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="touristic_place"
                        onViewDetails={() => openTouristicPlaceDetails(booking)}
                        onCancel={() => cancelTouristicPlaceBooking(booking.id)}
                        getStatusBadge={() => (
                          <TouristicPlaceStatusBadge status={booking.status} />
                        )}
                        getBookingImage={() => cardData.image}
                        getBookingTitle={() => cardData.title}
                        getBookingSubtitle={() => cardData.subtitle}
                        getBookingDate={() => cardData.date}
                        getBookingDetails={() => cardData.details}
                        getBookingAmount={() => cardData.amount}
                        canCancel={cardData.canCancel}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Vols */}
        <TabsContent value="vols">
          <Card style={{ borderColor: theme.separator }}>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle style={{ color: theme.logo }}>
                    Mes réservations de vols
                  </CardTitle>
                  <CardDescription style={{ color: theme.secondaryText }}>
                    {flightReservations.length} réservation
                    {flightReservations.length > 1 ? "s" : ""} trouvée
                    {flightReservations.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select value={flightFilter} onValueChange={setFlightFilter}>
                  <SelectTrigger
                    className="w-48"
                    style={{ background: theme.accent, color: theme.logo }}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent style={{ background: theme.lightBg }}>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="paid">Payées</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {flightLoading ? (
                <LoadingSpinner text="Chargement de vos réservations" />
              ) : flightReservations.length === 0 ? (
                <div className="text-center py-12">
                  <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation de vol
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore de réservation de vol.
                  </p>
                  <Button asChild className="text-white bg-[#556B2F]">
                    <Link to="/voyages">Découvrir les vols</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {flightReservations.map((booking) => {
                    const cardData = getFlightCardData(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="flight"
                        onViewDetails={() => openFlightDetails(booking)}
                        onCancel={() => cancelFlightReservation(booking.id)}
                        getStatusBadge={() => (
                          <FlightStatusBadge status={booking.status} />
                        )}
                        getBookingImage={() => cardData.image}
                        getBookingTitle={() => cardData.title}
                        getBookingSubtitle={() => cardData.subtitle}
                        getBookingDate={() => cardData.date}
                        getBookingDetails={() => cardData.details}
                        getBookingAmount={() => cardData.amount}
                        canCancel={cardData.canCancel}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AJOUT: Onglet Activités */}
        <TabsContent value="activites">
          <Card style={{ borderColor: theme.separator }}>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle style={{ color: theme.logo }}>
                    Mes réservations d'activités
                  </CardTitle>
                  <CardDescription style={{ color: theme.secondaryText }}>
                    {activityBookings.length} activité
                    {activityBookings.length > 1 ? "s" : ""} réservée
                    {activityBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select
                  value={activityFilter}
                  onValueChange={setActivityFilter}
                >
                  <SelectTrigger
                    className="w-48"
                    style={{ background: theme.accent, color: theme.logo }}
                  >
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent style={{ background: theme.lightBg }}>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmées</SelectItem>
                    <SelectItem value="completed">Terminées</SelectItem>
                    <SelectItem value="cancelled">Annulées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <LoadingSpinner text="Chargement de vos activités" />
              ) : activityBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune réservation d'activité
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vous n'avez pas encore réservé d'activité.
                  </p>
                  <Button asChild className="text-white bg-[#556B2F]">
                    <Link to="/activities">Découvrir les activités</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activityBookings.map((booking) => {
                    const cardData = getActivityCardData(booking);
                    return (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        type="activity"
                        onViewDetails={() => openActivityDetails(booking)}
                        onCancel={() => cancelActivityBooking(booking.id)}
                        getStatusBadge={() => (
                          <ActivityStatusBadge status={booking.status} />
                        )}
                        getBookingImage={() => cardData.image}
                        getBookingTitle={() => cardData.title}
                        getBookingSubtitle={() => cardData.subtitle}
                        getBookingDate={() => cardData.date}
                        getBookingDetails={() => cardData.details}
                        getBookingAmount={() => cardData.amount}
                        canCancel={cardData.canCancel}
                      />
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de détails */}
      <DetailModal
        booking={getCurrentBooking()}
        type={currentBookingType}
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
      />
    </div>
  );
}
