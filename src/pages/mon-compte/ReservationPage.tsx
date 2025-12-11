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
} from "lucide-react";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

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
  status: "pending" | "confirmed" | "cancelled" | "completed" | "paid" | "failed" | "refunded";
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

// Composants utilitaires
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function TourismStatusBadge({ status }: { status: TourismBooking["status"] }) {
  const variant =
    status === "confirmee"
      ? "default"
      : status === "en_attente"
      ? "secondary"
      : status === "terminee"
      ? "outline"
      : "destructive";
  const label =
    status === "confirmee"
      ? "Confirmée"
      : status === "en_attente"
      ? "En attente"
      : status === "terminee"
      ? "Terminée"
      : "Annulée";

  return <Badge variant={variant as any}>{label}</Badge>;
}

function ServiceStatusBadge({ status }: { status: ServiceBooking["status"] }) {
  const variant =
    status === "confirmed"
      ? "default"
      : status === "pending"
      ? "secondary"
      : status === "completed"
      ? "outline"
      : "destructive";
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
      ? "En attente"
      : status === "completed"
      ? "Terminée"
      : "Annulée";

  return <Badge variant={variant as any}>{label}</Badge>;
}

function TouristicPlaceStatusBadge({ status }: { status: TouristicPlaceBooking["status"] }) {
  const variant =
    status === "confirmed"
      ? "default"
      : status === "pending"
      ? "secondary"
      : status === "completed"
      ? "outline"
      : "destructive";
  const label =
    status === "confirmed"
      ? "Confirmée"
      : status === "pending"
      ? "En attente"
      : status === "completed"
      ? "Terminée"
      : "Annulée";

  return <Badge variant={variant as any}>{label}</Badge>;
}

function FlightStatusBadge({ status }: { status: FlightReservation["status"] }) {
  const variant =
    status === "confirmed" || status === "paid" || status === "completed"
      ? "default"
      : status === "pending"
      ? "secondary"
      : status === "refunded"
      ? "outline"
      : "destructive";
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

  return <Badge variant={variant as any}>{label}</Badge>;
}

function generateBookingCode(id: string): string {
  return `BK-${id.slice(-4).toUpperCase()}`;
}

// Composant Modal de Détails
interface DetailModalProps {
  booking: any;
  type: "tourisme" | "service" | "touristic_place" | "flight";
  isOpen: boolean;
  onClose: () => void;
}

function DetailModal({ booking, type, isOpen, onClose }: DetailModalProps) {
  if (!booking) return null;

  const renderTourismDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Date d'arrivée</h4>
          <p>{new Date(booking.checkIn).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Date de départ</h4>
          <p>{new Date(booking.checkOut).toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Voyageurs</h4>
          <p>{booking.guests} personne(s)</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Méthode de paiement</h4>
          <p>{booking.paymentMethod}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Demandes spéciales</h4>
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
          <h4 className="font-semibold text-sm text-gray-500">Date de visite</h4>
          <p>{new Date(booking.visitDate).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Heure de visite</h4>
          <p>{booking.visitTime}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Nombre de billets</h4>
          <p>{booking.numberOfTickets}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Type de billet</h4>
          <p>{booking.ticketType}</p>
        </div>
      </div>
      {booking.specialRequests && (
        <div>
          <h4 className="font-semibold text-sm text-gray-500">Demandes spéciales</h4>
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
        <p>{booking.flight.compagnie} - Vol {booking.flight.numeroVol}</p>
      </div>
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
      default:
        return "Détails de la réservation";
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
                src={
                  type === "tourisme" 
                    ? booking.listing.images?.[0] 
                    : type === "service"
                    ? "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    : type === "touristic_place"
                    ? booking.place.images?.[0]
                    : booking.flight.image
                }
                alt="Image"
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="font-semibold text-lg">
                {type === "tourisme" 
                  ? booking.listing.title
                  : type === "service"
                  ? booking.service.libelle
                  : type === "touristic_place"
                  ? booking.place.title
                  : `${booking.flight.compagnie} - Vol ${booking.flight.numeroVol}`
                }
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {type === "tourisme" 
                  ? `${booking.listing.city} • ${booking.listing.type}`
                  : type === "service"
                  ? booking.service.description
                  : type === "touristic_place"
                  ? `${booking.place.city} • ${booking.place.type}`
                  : `${booking.flight.departVille} → ${booking.flight.arriveeVille}`
                }
              </p>
              <div className="flex items-center gap-2 mt-2">
                {type === "tourisme" && <TourismStatusBadge status={booking.status} />}
                {type === "service" && <ServiceStatusBadge status={booking.status} />}
                {type === "touristic_place" && <TouristicPlaceStatusBadge status={booking.status} />}
                {type === "flight" && <FlightStatusBadge status={booking.status} />}
                <Badge variant="outline" className="text-xs">
                  {type === "tourisme" ? "🏠 Hébergement" : 
                   type === "service" ? "💆 Service" : 
                   type === "touristic_place" ? "🎫 Billet" : "✈️ Vol"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Détails spécifiques */}
          <div className="border-t pt-4">
            {type === "tourisme" && renderTourismDetails()}
            {type === "service" && renderServiceDetails()}
            {type === "touristic_place" && renderTouristicPlaceDetails()}
            {type === "flight" && renderFlightDetails()}
          </div>

          {/* Informations de paiement */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-gray-500 mb-2">Informations de paiement</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Montant total</h4>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    type === "tourisme" ? booking.amount :
                    type === "service" ? booking.service.price :
                    type === "touristic_place" ? booking.totalAmount :
                    booking.flight.prix * booking.nbrPersonne
                  )}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-500">Référence</h4>
                <p>
                  {type === "tourisme" ? booking.code :
                   type === "touristic_place" ? booking.confirmationNumber :
                   type === "flight" ? `Vol ${booking.flight.numeroVol}` :
                   booking.id}
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
  type: "tourisme" | "service" | "touristic_place" | "flight";
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
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Layout pour mobile : image en haut */}
      <div className="block md:hidden">
        {/* Image en haut pour mobile */}
        <div className="w-full h-40">
          <img
            src={getBookingImage()}
            alt={getBookingTitle()}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        {/* Contenu sous l'image pour mobile */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(booking.status)}
                <Badge variant="outline" className="text-xs">
                  {type === "tourisme" ? "🏠 Hébergement" : 
                   type === "service" ? "💆 Service" : 
                   type === "touristic_place" ? "🎫 Billet" : "✈️ Vol"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {getBookingTitle()}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
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
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-xs">{getBookingDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs">{getBookingDetails()}</span>
            </div>
          </div>

          {/* Montant et actions pour mobile */}
          <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(getBookingAmount())}
              </div>
              <div className="text-xs text-gray-500">
                {type === "touristic_place" && booking.confirmationNumber && (
                  <span>Ref: {booking.confirmationNumber}</span>
                )}
                {type === "tourisme" && booking.code && (
                  <span>Ref: {booking.code}</span>
                )}
                {type === "flight" && (
                  <span>Vol: {booking.flight?.numeroVol}</span>
                )}
              </div>
            </div>
            
            {/* Boutons d'action pour mobile */}
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" size="sm" onClick={onViewDetails} className="w-full">
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
              e.currentTarget.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
            }}
          />
        </div>

        {/* Contenu à droite pour desktop */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {getStatusBadge(booking.status)}
                <Badge variant="outline" className="text-xs">
                  {type === "tourisme" ? "🏠 Hébergement" : 
                   type === "service" ? "💆 Service" : 
                   type === "touristic_place" ? "🎫 Billet" : "✈️ Vol"}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {getBookingTitle()}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
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
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{getBookingDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{getBookingDetails()}</span>
            </div>
          </div>

          {/* Montant et actions pour desktop */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                {formatCurrency(getBookingAmount())}
              </div>
              <div className="text-sm text-gray-500">
                {type === "touristic_place" && booking.confirmationNumber && (
                  <span>Ref: {booking.confirmationNumber}</span>
                )}
                {type === "tourisme" && booking.code && (
                  <span>Ref: {booking.code}</span>
                )}
                {type === "flight" && (
                  <span>Vol: {booking.flight?.numeroVol}</span>
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
  const [touristicPlaceBookings, setTouristicPlaceBookings] = useState<TouristicPlaceBooking[]>([]);
  const [flightReservations, setFlightReservations] = useState<FlightReservation[]>([]);
  
  const [tourismLoading, setTourismLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [touristicPlaceLoading, setTouristicPlaceLoading] = useState(true);
  const [flightLoading, setFlightLoading] = useState(true);
  
  const [tourismFilter, setTourismFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [touristicPlaceFilter, setTouristicPlaceFilter] = useState<string>("all");
  const [flightFilter, setFlightFilter] = useState<string>("all");

  const [selectedTourismBooking, setSelectedTourismBooking] = useState<TourismBooking | null>(null);
  const [selectedServiceBooking, setSelectedServiceBooking] = useState<ServiceBooking | null>(null);
  const [selectedTouristicPlaceBooking, setSelectedTouristicPlaceBooking] = useState<TouristicPlaceBooking | null>(null);
  const [selectedFlightReservation, setSelectedFlightReservation] = useState<FlightReservation | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [currentBookingType, setCurrentBookingType] = useState<"tourisme" | "service" | "touristic_place" | "flight">("tourisme");

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
            status: touristicPlaceFilter !== "all" ? touristicPlaceFilter : undefined,
          },
        });

        if (response.data.success) {
          setTouristicPlaceBookings(response.data.data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les réservations de lieux touristiques",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur chargement réservations lieux touristiques:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des réservations de lieux touristiques",
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

  // Fonctions d'annulation
  const cancelTourismBooking = async (id: string) => {
    try {
      const response = await api.put(`/user/bookings/${id}/cancel`, {
        userId: user?.id,
      });

      if (response.data.success) {
        setTourismBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "annulee" as const } : b
          )
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
        description: error.response?.data?.error || "Erreur lors de l'annulation",
        variant: "destructive",
      });
    }
  };

  const cancelServiceBooking = async (id: string) => {
    try {
      await api.patch(`/appointment/${id}/cancel`);
      setServiceBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
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
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
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
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
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
    image: booking.listing.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.listing.title,
    subtitle: `${booking.listing.city} • ${booking.listing.type}`,
    date: `${new Date(booking.checkIn).toLocaleDateString("fr-FR")} - ${new Date(booking.checkOut).toLocaleDateString("fr-FR")}`,
    details: `${booking.guests} voyageur${booking.guests > 1 ? "s" : ""}`,
    amount: booking.amount,
    canCancel: booking.status !== "annulee" && booking.status !== "terminee",
  });

  const getServiceCardData = (booking: ServiceBooking) => ({
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.service.libelle,
    subtitle: booking.service.description,
    date: new Date(booking.date).toLocaleDateString("fr-FR"),
    details: booking.time,
    amount: booking.service.price,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  const getTouristicPlaceCardData = (booking: TouristicPlaceBooking) => ({
    image: booking.place.images?.[0] || "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: booking.place.title,
    subtitle: `${booking.place.city} • ${booking.place.type}`,
    date: new Date(booking.visitDate).toLocaleDateString("fr-FR"),
    details: `${booking.numberOfTickets} billet${booking.numberOfTickets > 1 ? "s" : ""} • ${booking.visitTime}`,
    amount: booking.totalAmount,
    canCancel: booking.status !== "cancelled" && booking.status !== "completed",
  });

  const getFlightCardData = (booking: FlightReservation) => ({
    image: booking.flight.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    title: `${booking.flight.compagnie} - Vol ${booking.flight.numeroVol}`,
    subtitle: `${booking.flight.departVille} → ${booking.flight.arriveeVille}`,
    date: new Date(booking.flight.departDateHeure).toLocaleDateString("fr-FR"),
    details: `${booking.nbrPersonne} passager${booking.nbrPersonne > 1 ? "s" : ""} • ${booking.flight.classe}`,
    amount: booking.flight.prix * booking.nbrPersonne,
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

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedTourismBooking(null);
    setSelectedServiceBooking(null);
    setSelectedTouristicPlaceBooking(null);
    setSelectedFlightReservation(null);
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
      default:
        return null;
    }
  };

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
    <div className="container mx-auto max-w-6xl py-8 mt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Réservations
        </h1>
        <p className="text-gray-600">
          {user?.firstName ? `Bonjour ${user.firstName}, ` : ""}
          Consultez et gérez toutes vos réservations.
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 p-2 h-auto gap-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Services
            <Badge variant="secondary" className="ml-2">
              {serviceBookings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tourisme" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Hébergements
            <Badge variant="secondary" className="ml-2">
              {tourismBookings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="lieux-touristiques" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Billets
            <Badge variant="secondary" className="ml-2">
              {touristicPlaceBookings.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="vols" className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Vols
            <Badge variant="secondary" className="ml-2">
              {flightReservations.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Hébergements */}
        <TabsContent value="tourisme">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes réservations d'hébergements</CardTitle>
                  <CardDescription>
                    {tourismBookings.length} réservation
                    {tourismBookings.length > 1 ? "s" : ""} trouvée
                    {tourismBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select value={tourismFilter} onValueChange={setTourismFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <Button asChild>
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
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes réservations de services</CardTitle>
                  <CardDescription>
                    Historique et réservations à venir
                  </CardDescription>
                </div>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <Button asChild>
                    <Link to="/app/services">Découvrir les services</Link>
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
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes billets de lieux touristiques</CardTitle>
                  <CardDescription>
                    {touristicPlaceBookings.length} billet
                    {touristicPlaceBookings.length > 1 ? "s" : ""} trouvé
                    {touristicPlaceBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select
                  value={touristicPlaceFilter}
                  onValueChange={setTouristicPlaceFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <Button asChild>
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
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Mes réservations de vols</CardTitle>
                  <CardDescription>
                    {flightReservations.length} réservation
                    {flightReservations.length > 1 ? "s" : ""} trouvée
                    {flightReservations.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <Select value={flightFilter} onValueChange={setFlightFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
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
                  <Button asChild>
                    <Link to="/vols">Découvrir les vols</Link>
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
      </Tabs>

      {/* Modal de détails */}
      <DetailModal
        booking={getCurrentBooking()}
        type={currentBookingType}
        isOpen={detailModalOpen}
        onClose={closeDetailModal}
      />

      {/* Section d'actions communes 
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Support</CardTitle>
            <CardDescription>
              Besoin d'aide pour une réservation ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/app/messages">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter le support
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Politique d'annulation</CardTitle>
            <CardDescription>
              Consultez les conditions d'annulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to="/app/conditions-annulation">
                Voir les conditions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Lieux touristiques</CardTitle>
            <CardDescription>Découvrez nos sites</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <Link to="/tourisme?type=touristic">
                <Ticket className="w-4 h-4 mr-2" />
                Voir les lieux
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Vols</CardTitle>
            <CardDescription>Réservez votre vol</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <Link to="/vols">
                <Plane className="w-4 h-4 mr-2" />
                Voir les vols
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>*/}
    </div>
  );
}