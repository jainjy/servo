// components/admin/ProBookings.tsx
import { useState, useEffect } from 'react';
import {
  Search, Filter, Calendar, Users, MapPin, DollarSign,
  CheckCircle, XCircle, Clock, AlertCircle, Download,
  Eye, ChevronDown, ChevronUp, Mail, Phone, Ticket,
  Building, User as UserIcon, RefreshCw, MessageCircle,
  Landmark, Castle, Church, BookOpen, GalleryVerticalEnd,
  QrCode, UserCheck, Home, Camera, Plane, MoreVertical
} from 'lucide-react';
import api from '../../../lib/api';
import { touristicPlaceBookingsAPI, tourismeAPI, flightsAPI } from '../../../lib/api';

// Types pour les réservations d'hébergement
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

// Types pour les réservations de vols
interface FlightReservation {
  id: string;
  flightId: string;
  idUser: string;
  idPrestataire: string;
  nbrPersonne: number;
  place: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
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

// Types unifiés
type BookingType = 'accommodation' | 'touristic_place' | 'flight';
type Booking = TourismeBooking | TouristicPlaceBooking | FlightReservation;

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
}

interface Filters {
  search: string;
  status: string;
  paymentStatus: string;
  dateRange: string;
  type: string;
  provider?: string;
  ticketType?: string;
  placeId?: string;
  airline?: string;
}

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
  getAirlineColor 
}: any) => {
  const [showActions, setShowActions] = useState(false);
  
  const isAccommodation = type === 'accommodation';
  const isTouristicPlace = type === 'touristic_place';
  const isFlight = type === 'flight';
  
  const accommodationBooking = booking as TourismeBooking;
  const touristicPlaceBooking = booking as TouristicPlaceBooking;
  const flightReservation = booking as FlightReservation;

  const getStatusIcon = (status: string) => {
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

  const getStatusColor = (status: string) => {
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

  const getPaymentStatusColor = (status: string) => {
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

  const getBookingImage = () => {
    if (isAccommodation) return accommodationBooking.listing?.images?.[0];
    if (isTouristicPlace) return touristicPlaceBooking.place?.images?.[0];
    if (isFlight) return flightReservation.flight?.image;
    return '';
  };

  const getBookingTitle = () => {
    if (isAccommodation) return accommodationBooking.listing?.title;
    if (isTouristicPlace) return touristicPlaceBooking.place?.title;
    if (isFlight) return `${flightReservation.flight?.compagnie} - Vol ${flightReservation.flight?.numeroVol}`;
    return '';
  };

  const getBookingLocation = () => {
    if (isAccommodation) return accommodationBooking.listing?.city;
    if (isTouristicPlace) return touristicPlaceBooking.place?.city;
    if (isFlight) return `${flightReservation.flight?.departVille} → ${flightReservation.flight?.arriveeVille}`;
    return '';
  };

  const getBookingDate = () => {
    if (isAccommodation) return new Date(accommodationBooking.checkIn).toLocaleDateString();
    if (isTouristicPlace) return new Date(touristicPlaceBooking.visitDate).toLocaleDateString();
    if (isFlight) return new Date(flightReservation.flight?.departDateHeure).toLocaleDateString();
    return '';
  };

  const getBookingTime = () => {
    if (isAccommodation) return `${calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)} nuit(s)`;
    if (isTouristicPlace) return touristicPlaceBooking.visitTime;
    if (isFlight) {
      const depart = new Date(flightReservation.flight?.departDateHeure);
      return depart.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return '';
  };

  const getBookingDetails = () => {
    if (isAccommodation) return `${accommodationBooking.guests} voyageur(s)`;
    if (isTouristicPlace) return `${touristicPlaceBooking.numberOfTickets} billet(s) - ${getTicketTypeLabel(touristicPlaceBooking.ticketType)}`;
    if (isFlight) return `${flightReservation.nbrPersonne} passager(s) - ${flightReservation.place}`;
    return '';
  };

  const getUserInfo = () => {
    if (booking.user) {
      return `${booking.user.firstName} ${booking.user.lastName}`;
    } else if (booking.userReservation) {
      return `${booking.userReservation.firstName} ${booking.userReservation.lastName}`;
    }
    return 'Client non connecté';
  };

  const getUserEmail = () => {
    return booking.user?.email || booking.userReservation?.email;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* En-tête de la carte */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-sm font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                {isFlight ? `FLIGHT-${flightReservation.id.slice(-6)}` : booking.confirmationNumber}
              </div>
              {isFlight && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAirlineColor(flightReservation.flight?.compagnie)} border`}>
                  <Plane className="w-3 h-3 mr-1" />
                  {flightReservation.flight?.compagnie}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Créé le {new Date(booking.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {/* Menu d'actions */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    onViewDetails();
                    setShowActions(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  Voir les détails
                </button>
                
                {isTouristicPlace && booking.status === "confirmed" && onGenerateQRCode && (
                  <button
                    onClick={() => {
                      onGenerateQRCode(booking);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
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
                    className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-3" />
                    Confirmer
                  </button>
                )}
                
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <button
                    onClick={() => {
                      onUpdateStatus(booking.id, "cancelled");
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-3" />
                    Annuler
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Statuts */}
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} border`}>
            {getStatusIcon(booking.status)}
            <span className="ml-1 capitalize">{booking.status}</span>
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(booking.paymentStatus)} border`}>
            <span className="capitalize">{booking.paymentStatus}</span>
          </span>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={getBookingImage()}
            alt={getBookingTitle()}
            className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = 'https://i.pinimg.com/736x/a8/15/50/a81550a6d4c9ffd633e56200a25f8f9b.jpg';
            }}
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {getBookingTitle()}
            </h3>
            
            <div className="flex items-center text-sm text-gray-600 mb-1">
              {isTouristicPlace && getCategoryIcon(touristicPlaceBooking.place?.category)}
              {isFlight && <Plane className="w-4 h-4 mr-1" />}
              <MapPin className="w-4 h-4 mr-1" />
              {getBookingLocation()}
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <UserIcon className="w-4 h-4 mr-1" />
              <span className="mr-2">{getUserInfo()}</span>
              {getUserEmail() && (
                <a
                  href={`mailto:${getUserEmail()}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
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
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">{getBookingDate()}</div>
            <div className="text-xs text-gray-600">{getBookingTime()}</div>
          </div>
          
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-gray-900">{getBookingDetails()}</div>
            {isAccommodation && (
              <div className="text-xs text-gray-600">
                {accommodationBooking.adults}A, {accommodationBooking.children}E
                {accommodationBooking.infants > 0 && `, ${accommodationBooking.infants}B`}
              </div>
            )}
          </div>
        </div>

        {/* Montant */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {booking.totalAmount}€
            </div>
            <div className="text-xs text-gray-500">
              {booking.serviceFee ? `Dont ${booking.serviceFee}€ de frais` : 'Frais inclus'}
            </div>
          </div>
          
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voir détails
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de détail unifié (inchangé)
const BookingDetailModal = ({ 
  booking, 
  type,
  onClose, 
  onStatusUpdate, 
  onPaymentUpdate,
  onSendReminder,
  onGenerateQRCode,
  getTicketTypeLabel,
  getCategoryIcon,
  calculateNights,
  getAirlineColor 
}: any) => {
  const isAccommodation = type === 'accommodation';
  const isTouristicPlace = type === 'touristic_place';
  const isFlight = type === 'flight';
  
  const accommodationBooking = booking as TourismeBooking;
  const touristicPlaceBooking = booking as TouristicPlaceBooking;
  const flightReservation = booking as FlightReservation;

  const isUpcoming = () => {
    if (isAccommodation) {
      return new Date(accommodationBooking.checkIn) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
             new Date(accommodationBooking.checkIn) >= new Date();
    } else if (isTouristicPlace) {
      return new Date(touristicPlaceBooking.visitDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
             new Date(touristicPlaceBooking.visitDate) >= new Date();
    } else if (isFlight) {
      return new Date(flightReservation.flight?.departDateHeure) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && 
             new Date(flightReservation.flight?.departDateHeure) >= new Date();
    }
    return false;
  };

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
                {isFlight ? `FLIGHT-${flightReservation.id.slice(-6)}` : booking.confirmationNumber} • 
                {isAccommodation ? ' Hébergement' : isTouristicPlace ? ' Lieu Touristiques' : ' Vol'}
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
                <InfoRow 
                  label="Numéro de confirmation" 
                  value={isFlight ? `FLIGHT-${flightReservation.id.slice(-6)}` : booking.confirmationNumber} 
                  mono 
                />
                <InfoRow label="Date de création" value={new Date(booking.createdAt).toLocaleString()} />
                <InfoRow label="Méthode de paiement" value={booking.paymentMethod || 'Non spécifiée'} />
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

              <Section title={
                isAccommodation ? "Dates du séjour" : 
                isTouristicPlace ? "Détails de la visite" : 
                "Détails du vol"
              }>
                <div className="space-y-2">
                  {isAccommodation ? (
                    <>
                      <InfoRow label="Arrivée" value={new Date(accommodationBooking.checkIn).toLocaleDateString()} />
                      <InfoRow label="Départ" value={new Date(accommodationBooking.checkOut).toLocaleDateString()} />
                      <InfoRow label="Nombre de nuits" value={calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut).toString()} />
                      <InfoRow label="Durée totale" value={`${calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)} nuit(s)`} />
                    </>
                  ) : isTouristicPlace ? (
                    <>
                      <InfoRow label="Date de visite" value={new Date(touristicPlaceBooking.visitDate).toLocaleDateString()} />
                      <InfoRow label="Heure de visite" value={touristicPlaceBooking.visitTime} />
                      <InfoRow label="Horaires d'ouverture" value={touristicPlaceBooking.place?.openingHours || 'Non spécifié'} />
                    </>
                  ) : (
                    <>
                      <InfoRow label="Date de départ" value={new Date(flightReservation.flight?.departDateHeure).toLocaleDateString()} />
                      <InfoRow label="Heure de départ" value={new Date(flightReservation.flight?.departDateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} />
                      <InfoRow label="Date d'arrivée" value={new Date(flightReservation.flight?.arriveeDateHeure).toLocaleDateString()} />
                      <InfoRow label="Heure d'arrivée" value={new Date(flightReservation.flight?.arriveeDateHeure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} />
                      <InfoRow label="Durée" value={flightReservation.flight?.duree} />
                      <InfoRow label="Escales" value={flightReservation.flight?.escales || 0} />
                    </>
                  )}
                  {isUpcoming() && booking.status === 'confirmed' && (
                    <div className="bg-orange-50 p-3 rounded-lg mt-2">
                      <div className="flex items-center text-orange-800 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {isAccommodation ? 'Arrivée prévue dans moins de 7 jours' : 
                         isTouristicPlace ? 'Visite prévue dans moins de 7 jours' : 
                         'Départ prévu dans moins de 7 jours'}
                      </div>
                    </div>
                  )}
                </div>
              </Section>
            </div>

            {/* Informations client et service */}
            <div className="space-y-6">
              <Section title="Informations Client">
                {booking.user || booking.userReservation ? (
                  <div className="space-y-3">
                    <InfoRow 
                      label="Nom complet" 
                      value={booking.user ? 
                        `${booking.user.firstName} ${booking.user.lastName}` : 
                        `${booking.userReservation.firstName} ${booking.userReservation.lastName}`
                      } 
                    />
                    <InfoRow label="Email" value={
                      <a 
                        href={`mailto:${booking.user?.email || booking.userReservation?.email}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {booking.user?.email || booking.userReservation?.email}
                      </a>
                    } />
                    {(booking.user?.phone || booking.userReservation?.phone) && (
                      <InfoRow label="Téléphone" value={
                        <a 
                          href={`tel:${booking.user?.phone || booking.userReservation?.phone}`} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {booking.user?.phone || booking.userReservation?.phone}
                        </a>
                      } />
                    )}
                    <InfoRow 
                      label="ID Utilisateur" 
                      value={booking.user?.id || booking.userReservation?.id} 
                      mono 
                    />
                    <div className="flex space-x-2 pt-2">
                      <a
                        href={`mailto:${booking.user?.email || booking.userReservation?.email}?subject=Réservation ${isFlight ? `FLIGHT-${flightReservation.id.slice(-6)}` : booking.confirmationNumber}`}
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

              <Section title={
                isAccommodation ? "Hébergement" : 
                isTouristicPlace ? "Lieu Touristiques" : 
                "Détails du vol"
              }>
                <div className="space-y-3">
                  {isAccommodation ? (
                    <>
                      <InfoRow label="Nom" value={accommodationBooking.listing?.title || 'Non spécifié'} />
                      <InfoRow label="Type" value={accommodationBooking.listing?.type || 'Non spécifié'} />
                      <InfoRow label="Destination" value={accommodationBooking.listing?.city || 'Non spécifié'} />
                      <InfoRow label="Prix par nuit" value={`${accommodationBooking.listing?.price || 0}€`} />
                      <InfoRow 
                        label="Note" 
                        value={accommodationBooking.listing?.rating ? 
                          `${accommodationBooking.listing.rating} ⭐ (${accommodationBooking.listing.reviewCount || 0} avis)` : 
                          'Aucune note'} 
                      />
                    </>
                  ) : isTouristicPlace ? (
                    <>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(touristicPlaceBooking.place?.category)}
                        <InfoRow label="Nom" value={touristicPlaceBooking.place?.title || 'Non spécifié'} />
                      </div>
                      <InfoRow label="Catégorie" value={touristicPlaceBooking.place?.category || 'Non spécifié'} />
                      <InfoRow label="Ville" value={touristicPlaceBooking.place?.city || 'Non spécifié'} />
                      <InfoRow label="Prix billet adulte" value={`${touristicPlaceBooking.place?.price || 0}€`} />
                      <InfoRow label="Capacité maximale" value={`${touristicPlaceBooking.place?.maxGuests || 0} personnes`} />
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAirlineColor(flightReservation.flight?.compagnie)} border`}>
                          <Plane className="w-3 h-3 mr-1" />
                          {flightReservation.flight?.compagnie}
                        </span>
                        <InfoRow label="Vol" value={flightReservation.flight?.numeroVol || 'Non spécifié'} />
                      </div>
                      <InfoRow label="Trajet" value={`${flightReservation.flight?.departVille} → ${flightReservation.flight?.arriveeVille}`} />
                      <InfoRow label="Classe" value={flightReservation.flight?.classe || 'Non spécifié'} />
                      <InfoRow label="Appareil" value={flightReservation.flight?.aircraft || 'Non spécifié'} />
                      <InfoRow 
                        label="Note" 
                        value={flightReservation.flight?.rating ? 
                          `${flightReservation.flight.rating} ⭐ (${flightReservation.flight.reviewCount || 0} avis)` : 
                          'Aucune note'} 
                      />
                    </>
                  )}
                </div>
              </Section>

              <Section title="Détails Financiers">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  {isAccommodation ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prix du séjour ({calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)} nuits)</span>
                        <span className="font-medium">
                          {((booking.totalAmount - booking.serviceFee) / calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)).toFixed(2)}€ × {calculateNights(accommodationBooking.checkIn, accommodationBooking.checkOut)} = {(booking.totalAmount - booking.serviceFee).toFixed(2)}€
                        </span>
                      </div>
                    </>
                  ) : isTouristicPlace ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prix des billets ({touristicPlaceBooking.numberOfTickets}x)</span>
                        <span className="font-medium">
                          {(booking.totalAmount - booking.serviceFee).toFixed(2)}€
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prix du vol ({flightReservation.nbrPersonne}x)</span>
                        <span className="font-medium">
                          {flightReservation.flight?.prix}€ × {flightReservation.nbrPersonne} = {(flightReservation.flight?.prix * flightReservation.nbrPersonne).toFixed(2)}€
                        </span>
                      </div>
                    </>
                  )}
                  {booking.serviceFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de service</span>
                      <span className="font-medium">{booking.serviceFee}€</span>
                    </div>
                  )}
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

          {/* Détails voyageurs/billets */}
          <Section title={
            isAccommodation ? "Détails des Voyageurs" : 
            isTouristicPlace ? "Détails des Billets" : 
            "Détails des Passagers"
          } className="mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              {isAccommodation ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{accommodationBooking.guests}</div>
                    <div className="text-sm text-gray-600">Total voyageurs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{accommodationBooking.adults}</div>
                    <div className="text-sm text-gray-600">Adultes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{accommodationBooking.children}</div>
                    <div className="text-sm text-gray-600">Enfants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{accommodationBooking.infants}</div>
                    <div className="text-sm text-gray-600">Bébés</div>
                  </div>
                </div>
              ) : isTouristicPlace ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{touristicPlaceBooking.numberOfTickets}</div>
                    <div className="text-sm text-gray-600">Total billets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 capitalize">
                      {getTicketTypeLabel(touristicPlaceBooking.ticketType)}
                    </div>
                    <div className="text-sm text-gray-600">Type de billet</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {touristicPlaceBooking.place?.price || 0}€
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
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{flightReservation.nbrPersonne}</div>
                    <div className="text-sm text-gray-600">Passagers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {flightReservation.place}
                    </div>
                    <div className="text-sm text-gray-600">Place réservée</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {flightReservation.flight?.prix || 0}€
                    </div>
                    <div className="text-sm text-gray-600">Prix unitaire</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {(flightReservation.flight?.prix * flightReservation.nbrPersonne).toFixed(2)}€
                    </div>
                    <div className="text-sm text-gray-600">Sous-total</div>
                  </div>
                </div>
              )}
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
                {isTouristicPlace && booking.status === 'confirmed' && onGenerateQRCode && (
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
                {(booking.user?.email || booking.userReservation?.email) && booking.status === 'confirmed' && (
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

// Composant principal ProBookings
export const ProBookings = () => {
  const [activeTab, setActiveTab] = useState<BookingType>('accommodation');
  const [accommodationBookings, setAccommodationBookings] = useState<TourismeBooking[]>([]);
  const [touristicPlaceBookings, setTouristicPlaceBookings] = useState<TouristicPlaceBooking[]>([]);
  const [flightReservations, setFlightReservations] = useState<FlightReservation[]>([]);
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    paymentStatus: "all",
    dateRange: "all",
    type: "all",
  });
  const [userPlaces, setUserPlaces] = useState<any[]>([]);
  const [userFlights, setUserFlights] = useState<any[]>([]);

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
        fetchFlightReservations()
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
      const userPlacesData = allPlaces.filter((place: any) => place.idPrestataire);
      setUserPlaces(userPlacesData);

      if (userPlacesData.length === 0) {
        setTouristicPlaceBookings([]);
        calculateTouristicPlaceStats([], []);
        return;
      }

      const bookingsResponse = await touristicPlaceBookingsAPI.getBookings({ limit: 1000 });
      
      if (bookingsResponse.data.success) {
        const bookingsData = bookingsResponse.data.data;
        const placeIds = userPlacesData.map((place: any) => place.id);
        const userBookings = bookingsData.filter((booking: TouristicPlaceBooking) => 
          placeIds.includes(booking.place.id)
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
      console.log("🔄 Chargement des réservations de vols...");
      
      const reservationsResponse = await api.get("/Vol/reservations");
      console.log("📡 Réponse API réservations:", reservationsResponse.data);
      
      if (reservationsResponse.data.success && reservationsResponse.data.data) {
        const reservationsData = reservationsResponse.data.data;
        console.log(`✈️ ${reservationsData.length} réservation(s) de vol trouvée(s)`, reservationsData);
        
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
      console.log("🔄 Utilisation des données mockées:", mockData);
      setFlightReservations(mockData);
      calculateFlightStats(mockData);
    }
  };

  // Données mockées
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
      idPrestataire: 'mock-prestataire-id'
    }
  ];

  const getMockAccommodationBookings = (): TourismeBooking[] => [
    {
      id: 'a1',
      confirmationNumber: 'ACC-2024-001',
      status: 'confirmed',
      paymentStatus: 'paid',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      guests: 4,
      adults: 2,
      children: 2,
      infants: 0,
      totalAmount: 600,
      serviceFee: 60,
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      listing: {
        id: 'l1',
        title: 'Villa de Luxe à Paris',
        type: 'villa',
        city: 'Paris',
        images: ['https://i.pinimg.com/736x/15/bc/33/15bc33b809d57965e06769b6a96a69f7.jpg'],
        price: 120,
        provider: 'direct'
      },
      user: {
        id: 'u1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33123456789'
      }
    }
  ];

  const getMockTouristicPlaceBookings = (): TouristicPlaceBooking[] => [
    {
      id: 't1',
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
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@email.com',
        phone: '+33112233445'
      }
    }
  ];

  const getMockFlightReservations = (): FlightReservation[] => [
    {
      id: 'f1',
      flightId: 'flight1',
      idUser: 'u1',
      idPrestataire: 'p1',
      nbrPersonne: 2,
      place: '12A, 12B',
      status: 'confirmed',
      paymentStatus: 'paid',
      totalAmount: 400,
      serviceFee: 40,
      paymentMethod: 'card',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flight: {
        id: 'flight1',
        compagnie: 'Air France',
        numeroVol: 'AF123',
        departVille: 'Paris',
        departDateHeure: '2024-12-20T08:00:00Z',
        arriveeVille: 'New York',
        arriveeDateHeure: '2024-12-20T11:00:00Z',
        duree: '8h',
        escales: 0,
        prix: 200,
        classe: 'Economy',
        services: ['repas', 'divertissement', 'baggage'],
        image: 'https://i.pinimg.com/1200x/79/94/5c/79945cc369cdb035eadcc41efc866a4c.jpg',
        aircraft: 'Boeing 777',
        disponibilite: 150,
        rating: 4.5,
        reviewCount: 1200
      },
      userReservation: {
        id: 'u1',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '+33123456789'
      }
    }
  ];

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
    alert(`QR Code généré pour: ${booking.confirmationNumber}\nDonnées: ${qrString}`);
  };

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchAllBookings();
  };

  // Calcul des statistiques
  const calculateAccommodationStats = (bookingsData: TourismeBooking[]) => {
    const confirmedAndCompleted = bookingsData.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );

    const statsData: BookingStats = {
      total: bookingsData.length,
      pending: bookingsData.filter((b) => b.status === "pending").length,
      confirmed: bookingsData.filter((b) => b.status === "confirmed").length,
      cancelled: bookingsData.filter((b) => b.status === "cancelled").length,
      completed: bookingsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking: confirmedAndCompleted.length > 0 ? totalRevenue / confirmedAndCompleted.length : 0,
    };
    setAccommodationStats(statsData);
  };

  const calculateTouristicPlaceStats = (bookingsData: TouristicPlaceBooking[], places: any[] = []) => {
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
    setTouristicPlaceStats(statsData);
  };

  const calculateFlightStats = (reservationsData: FlightReservation[]) => {
    console.log("📈 Calcul stats pour réservations vols:", reservationsData);
    
    const confirmedAndCompleted = reservationsData.filter(
      (b) => b.status === "confirmed" || b.status === "completed"
    );
    const totalRevenue = confirmedAndCompleted.reduce(
      (sum, b) => sum + b.totalAmount,
      0
    );
    const totalPassengers = reservationsData.reduce(
      (sum, b) => sum + b.nbrPersonne,
      0
    );

    console.log("📊 Stats calculées vols:", {
      total: reservationsData.length,
      totalPassengers,
      totalRevenue
    });

    const statsData: BookingStats = {
      total: reservationsData.length,
      pending: reservationsData.filter((b) => b.status === "pending").length,
      confirmed: reservationsData.filter((b) => b.status === "confirmed").length,
      cancelled: reservationsData.filter((b) => b.status === "cancelled").length,
      completed: reservationsData.filter((b) => b.status === "completed").length,
      revenue: totalRevenue,
      averageBooking: confirmedAndCompleted.length > 0 ? totalRevenue / confirmedAndCompleted.length : 0,
      totalPassengers
    };
    
    setFlightStats(statsData);
  };

  // Appliquer les filtres
  useEffect(() => {
    let currentBookings: Booking[] = [];
    
    switch (activeTab) {
      case 'accommodation':
        currentBookings = accommodationBookings;
        break;
      case 'touristic_place':
        currentBookings = touristicPlaceBookings;
        break;
      case 'flight':
        currentBookings = flightReservations;
        break;
    }

    let results = currentBookings;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter((booking: any) => {
        const isAccommodation = 'listing' in booking;
        const isTouristicPlace = 'place' in booking;
        const isFlight = 'flight' in booking;

        let title = '';
        let city = '';
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
        }

        const confirmationNumber = isFlight ? `FLIGHT-${booking.id.slice(-6)}` : booking.confirmationNumber;

        return (
          confirmationNumber.toLowerCase().includes(searchLower) ||
          title?.toLowerCase().includes(searchLower) ||
          user?.firstName?.toLowerCase().includes(searchLower) ||
          user?.lastName?.toLowerCase().includes(searchLower) ||
          user?.email?.toLowerCase().includes(searchLower) ||
          city?.toLowerCase().includes(searchLower) ||
          (isFlight && booking.flight?.compagnie?.toLowerCase().includes(searchLower)) ||
          (isFlight && booking.flight?.numeroVol?.toLowerCase().includes(searchLower))
        );
      });
    }

    if (filters.status !== "all") {
      results = results.filter((booking: any) => booking.status === filters.status);
    }

    if (filters.paymentStatus !== "all") {
      results = results.filter((booking: any) => booking.paymentStatus === filters.paymentStatus);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      results = results.filter((booking: any) => {
        let date: Date;
        
        if ('checkIn' in booking) {
          date = new Date(booking.checkIn);
        } else if ('visitDate' in booking) {
          date = new Date(booking.visitDate);
        } else if ('flight' in booking) {
          date = new Date(booking.flight.departDateHeure);
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
  }, [filters, activeTab, accommodationBookings, touristicPlaceBookings, flightReservations]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      console.log(`🔄 Mise à jour statut ${activeTab}:`, bookingId, status);
      
      if (activeTab === 'accommodation') {
        const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { status });
        if (response.data.success) {
          setAccommodationBookings(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
        }
      } else if (activeTab === 'touristic_place') {
        const response = await touristicPlaceBookingsAPI.updateStatus(bookingId, { status });
        if (response.data.success) {
          setTouristicPlaceBookings(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
        }
      } else if (activeTab === 'flight') {
        const response = await flightsAPI.updateReservationStatus(bookingId, status);
        if (response.data.success) {
          setFlightReservations(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
          console.log(`✅ Statut vol mis à jour: ${bookingId} -> ${status}`);
        }
      }
      
      setShowDetailModal(false);
      
    } catch (error) {
      console.error("❌ Erreur mise à jour statut:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const updatePaymentStatus = async (bookingId: string, paymentStatus: string) => {
    try {
      console.log(`🔄 Mise à jour paiement ${activeTab}:`, bookingId, paymentStatus);
      
      if (activeTab === 'accommodation') {
        const response = await api.put(`/tourisme-bookings/${bookingId}/status`, { paymentStatus });
        if (response.data.success) {
          setAccommodationBookings(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
        }
      } else if (activeTab === 'touristic_place') {
        const response = await touristicPlaceBookingsAPI.updateStatus(bookingId, { paymentStatus });
        if (response.data.success) {
          setTouristicPlaceBookings(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
        }
      } else if (activeTab === 'flight') {
        const response = await flightsAPI.updateReservationPaymentStatus(bookingId, paymentStatus);
        if (response.data.success) {
          setFlightReservations(prev => prev.map(booking => 
            booking.id === bookingId ? response.data.data : booking
          ));
          console.log(`✅ Paiement vol mis à jour: ${bookingId} -> ${paymentStatus}`);
        }
      }
      
      setShowDetailModal(false);
      
    } catch (error) {
      console.error("❌ Erreur mise à jour paiement:", error);
      alert("Erreur lors de la mise à jour du paiement");
    }
  };

  const sendReminder = async (bookingId: string) => {
    try {
      console.log('📨 Envoi rappel pour réservation:', bookingId);
      
      const booking = filteredBookings.find(b => b.id === bookingId);
      if (booking) {
        const email = (booking as any).user?.email || (booking as any).userReservation?.email;
        if (email) {
          const subject = `Rappel: Votre réservation ${activeTab === 'flight' ? `FLIGHT-${bookingId.slice(-6)}` : (booking as any).confirmationNumber}`;
          const body = `Bonjour,\n\nCeci est un rappel pour votre réservation.\n\nCordialement,\nL'équipe de voyage`;
          
          window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
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
      case 'accommodation': return accommodationStats;
      case 'touristic_place': return touristicPlaceStats;
      case 'flight': return flightStats;
      default: return accommodationStats;
    }
  };

  const getUpcomingBookings = () => {
    const today = new Date();
    return filteredBookings.filter((booking: any) => {
      let date: Date;
      
      if ('checkIn' in booking) {
        date = new Date(booking.checkIn);
      } else if ('visitDate' in booking) {
        date = new Date(booking.visitDate);
      } else if ('flight' in booking) {
        date = new Date(booking.flight.departDateHeure);
      } else {
        return false;
      }

      const timeDiff = date.getTime() - today.getTime();
      const daysDiff = timeDiff / (1000 * 3600 * 24);
      return daysDiff <= 7 && daysDiff >= 0 && booking.status === "confirmed";
    }).length;
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

  const getAirlineColor = (airline: string) => {
    const colors: { [key: string]: string } = {
      'Air France': 'bg-blue-100 text-blue-800 border-blue-200',
      'Air Senegal': 'bg-green-100 text-green-800 border-green-200',
      'Emirates': 'bg-red-100 text-red-800 border-red-200',
      'Qatar Airways': 'bg-purple-100 text-purple-800 border-purple-200',
      'Turkish Airlines': 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[airline] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const exportToCSV = () => {
    console.log('Export CSV pour:', activeTab);
    alert(`Export CSV pour ${activeTab} en cours...`);
  };

  const getCurrentBookingsCount = () => {
    switch (activeTab) {
      case 'accommodation': return accommodationBookings.length;
      case 'touristic_place': return touristicPlaceBookings.length;
      case 'flight': return flightReservations.length;
      default: return 0;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'accommodation': return 'hébergement';
      case 'touristic_place': return 'lieu touristique';
      case 'flight': return 'vol';
      default: return '';
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
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
              Gestion des Réservations
            </h1>
            <p className="text-gray-600">
              Gérez et suivez toutes vos réservations d'hébergements, de lieux touristiques et de vols
            </p>
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

        {/* Onglets */}
        <div className="flex flex-col md:flex-row space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('accommodation')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'accommodation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Home className="w-5 h-5 mr-2" />
            Hébergements
            <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {accommodationBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('touristic_place')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'touristic_place'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Camera className="w-5 h-5 mr-2" />
            Lieux Touristiques
            <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
              {touristicPlaceBookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('flight')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'flight'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Plane className="w-5 h-5 mr-2" />
            Vols
            <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
              {flightReservations.length}
            </span>
          </button>
        </div>

        {/* Message si aucun service créé */}
        {activeTab === 'touristic_place' && userPlaces.length === 0 && (
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

        {activeTab === 'flight' && userFlights.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Aucun vol créé
                </h3>
                <p className="text-yellow-700 mt-1">
                  Vous devez créer des vols pour recevoir des réservations.
                </p>
                <button
                  onClick={() => window.location.href = '/admin/flights'}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Créer un vol
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques améliorées */}
        {getCurrentBookingsCount() > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Réservations
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {getCurrentStats().total}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'touristic_place' 
                      ? `${getCurrentStats().totalTickets} billets vendus`
                      : activeTab === 'flight'
                      ? `${getCurrentStats().totalPassengers} passagers`
                      : `${((getCurrentStats().confirmed / getCurrentStats().total) * 100 || 0).toFixed(1)}% confirmées`
                    }
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  {activeTab === 'flight' ? (
                    <Plane className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Calendar className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {getCurrentStats().pending}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {((getCurrentStats().pending / getCurrentStats().total) * 100 || 0).toFixed(1)}% du total
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
                    {getCurrentStats().revenue.toFixed(2)}€
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Moyenne: {getCurrentStats().averageBooking.toFixed(2)}€
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
                    {activeTab === 'touristic_place' ? "Taux d'Occupation" : 
                     activeTab === 'flight' ? "Taux de Remplissage" : "Taux Conversion"}
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    {activeTab === 'touristic_place' 
                      ? `${getCurrentStats().occupancyRate?.toFixed(1)}%`
                      : activeTab === 'flight'
                      ? `${(((getCurrentStats().confirmed + getCurrentStats().completed) / getCurrentStats().total) * 100 || 0).toFixed(1)}%`
                      : `${(((getCurrentStats().confirmed + getCurrentStats().completed) / getCurrentStats().total) * 100 || 0).toFixed(1)}%`
                    }
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'touristic_place' ? "Capacité utilisée" : 
                     activeTab === 'flight' ? "Vols confirmés" : `${getCurrentStats().cancelled} annulations`}
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
                  <p className="text-sm text-gray-500 mt-1">
                    {activeTab === 'accommodation' ? "Arrivées à venir" : 
                     activeTab === 'touristic_place' ? "Visites à venir" : 
                     "Départs à venir"}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres améliorée */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Rechercher par numéro, client, ${getTabLabel()}, ville...`}
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
              {filteredBookings.length} réservation(s) trouvée(s)
              {activeTab === 'touristic_place' && userPlaces.length > 0 && ` sur ${userPlaces.length} lieu(x)`}
              {activeTab === 'flight' && userFlights.length > 0 && ` sur ${userFlights.length} vol(s)`}
            </div>
            <div className="text-sm text-gray-500 flex items-center">
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
                onGenerateQRCode={activeTab === 'touristic_place' ? generateQRCode : undefined}
                getTicketTypeLabel={getTicketTypeLabel}
                getCategoryIcon={getCategoryIcon}
                calculateNights={calculateNights}
                getAirlineColor={getAirlineColor}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              Aucune réservation trouvée
            </p>
            <p className="text-gray-400">
              {activeTab === 'touristic_place' && userPlaces.length === 0 
                ? "Vous devez créer des lieux touristiques pour recevoir des réservations"
                : activeTab === 'flight' && userFlights.length === 0
                ? "Vous devez créer des vols pour recevoir des réservations"
                : "Essayez de modifier vos filtres de recherche"
              }
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
            onPaymentUpdate={updatePaymentStatus}
            onSendReminder={sendReminder}
            onGenerateQRCode={activeTab === 'touristic_place' ? generateQRCode : undefined}
            getTicketTypeLabel={getTicketTypeLabel}
            getCategoryIcon={getCategoryIcon}
            calculateNights={calculateNights}
            getAirlineColor={getAirlineColor}
          />
        )}
      </div>
    </div>
  );
};

export default ProBookings;