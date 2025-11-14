import React, { useMemo, useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

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

function generateBookingCode(id: string): string {
  return `BK-${id.slice(-4).toUpperCase()}`;
}

// Modal pour les détails des réservations tourisme
function TourismBookingDetailsModal({
  booking,
  open,
  onOpenChange,
}: {
  booking: TourismBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Détails de la réservation {booking.code}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur votre réservation d'hébergement
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* En-tête avec statut */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <TourismStatusBadge status={booking.status} />
                <span className="text-sm text-muted-foreground">
                  Créée le{" "}
                  {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatCurrency(booking.amount)}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Informations de l'hébergement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Hébergement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{booking.listing.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {booking.listing.city}
                  </p>
                </div>

                {booking.listing.images &&
                  booking.listing.images.length > 0 && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={booking.listing.images[0]}
                        alt={booking.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{booking.listing.rating}</span>
                    <span className="text-muted-foreground">
                      ({booking.listing.reviewCount} avis)
                    </span>
                  </div>
                  <div className="text-muted-foreground capitalize">
                    {booking.listing.type}
                  </div>
                </div>

                {booking.listing.description && (
                  <p className="text-sm text-muted-foreground">
                    {booking.listing.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  {booking.listing.bedrooms && (
                    <div>🛏️ {booking.listing.bedrooms} chambre(s)</div>
                  )}
                  {booking.listing.bathrooms && (
                    <div>🚿 {booking.listing.bathrooms} salle(s) de bain</div>
                  )}
                  {booking.listing.area && (
                    <div>📐 {booking.listing.area}m²</div>
                  )}
                  <div>👥 Jusqu'à {booking.listing.maxGuests} voyageurs</div>
                </div>

                {booking.listing.amenities &&
                  booking.listing.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">
                        Équipements :
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {booking.listing.amenities
                          .slice(0, 5)
                          .map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        {booking.listing.amenities.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{booking.listing.amenities.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>

            {/* Informations de réservation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Dates et voyageurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Arrivée</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(booking.checkIn).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Départ</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(booking.checkOut).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Durée du séjour
                    </Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {nights} nuit{nights > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Voyageurs</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {booking.guests} personne{booking.guests > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1 ml-6">
                      {booking.adults} adulte{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0 &&
                        `, ${booking.children} enfant${
                          booking.children > 1 ? "s" : ""
                        }`}
                      {booking.infants > 0 &&
                        `, ${booking.infants} bébé${
                          booking.infants > 1 ? "s" : ""
                        }`}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Méthode de paiement :</span>
                    <span className="font-medium capitalize">
                      {booking.paymentMethod === "card"
                        ? "Carte bancaire"
                        : booking.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut du paiement :</span>
                    <Badge
                      variant={
                        booking.paymentStatus === "paid"
                          ? "default"
                          : booking.paymentStatus === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {booking.paymentStatus === "paid"
                        ? "Payé"
                        : booking.paymentStatus === "pending"
                        ? "En attente"
                        : "Échoué"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {booking.specialRequests && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4" />
                      Demandes spéciales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {booking.specialRequests}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Détails du prix */}
          <Card>
            <CardHeader>
              <CardTitle>Détail du prix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    {booking.listing.price}€ × {nights} nuit
                    {nights > 1 ? "s" : ""}
                  </span>
                  <span>{formatCurrency(booking.listing.price * nights)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Frais de service</span>
                  <span>
                    {formatCurrency(
                      booking.amount - booking.listing.price * nights
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(booking.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          {booking.status !== "annulee" && booking.status !== "terminee" && (
            <Button asChild>
              <Link to={`/app/messages?booking=${booking.code}`}>
                Contacter le support
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Modal pour les détails des réservations services
function ServiceBookingDetailsModal({
  booking,
  open,
  onOpenChange,
}: {
  booking: ServiceBooking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Détails de la réservation {generateBookingCode(booking.id)}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur votre réservation de service
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Service</Label>
              <p className="mt-1">{booking.service.libelle}</p>
            </div>
            <div>
              <Label className="font-semibold">Statut</Label>
              <div className="mt-1">
                <ServiceStatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold">Date</Label>
              <p className="mt-1">
                {new Date(booking.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <Label className="font-semibold">Heure</Label>
              <p className="mt-1">{booking.time}</p>
            </div>
          </div>

          <div>
            <Label className="font-semibold">Prix</Label>
            <p className="mt-1 text-lg font-semibold">
              {formatCurrency(booking.service.price)}
            </p>
          </div>

          {booking.message && (
            <div>
              <Label className="font-semibold">Message</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm">{booking.message}</p>
              </div>
            </div>
          )}

          <div>
            <Label className="font-semibold">Description du service</Label>
            <p className="mt-1 text-sm text-muted-foreground">
              {booking.service.description}
            </p>
          </div>

          <div>
            <Label className="font-semibold">Date de création</Label>
            <p className="mt-1">
              {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Composant principal
export default function UnifiedReservationPage() {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // États pour les réservations tourisme
  const [tourismBookings, setTourismBookings] = useState<TourismBooking[]>([]);
  const [tourismLoading, setTourismLoading] = useState(true);
  const [tourismFilter, setTourismFilter] = useState<string>("all");
  const [selectedTourismBooking, setSelectedTourismBooking] =
    useState<TourismBooking | null>(null);
  const [tourismDetailsModalOpen, setTourismDetailsModalOpen] = useState(false);

  // États pour les réservations services
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedServiceBooking, setSelectedServiceBooking] =
    useState<ServiceBooking | null>(null);
  const [serviceDetailsModalOpen, setServiceDetailsModalOpen] = useState(false);

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

        // Mapper les statuts
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

  // Fonctions pour les réservations tourisme
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
        description:
          error.response?.data?.error || "Erreur lors de l'annulation",
        variant: "destructive",
      });
    }
  };

  const handleShowTourismDetails = (booking: TourismBooking) => {
    setSelectedTourismBooking(booking);
    setTourismDetailsModalOpen(true);
  };

  // Fonctions pour les réservations services
  const mapServiceStatus = (status: string): ServiceBooking["status"] => {
    const statusMap: Record<string, ServiceBooking["status"]> = {
      pending: "pending",
      confirmed: "confirmed",
      cancelled: "cancelled",
      completed: "completed",
    };
    return statusMap[status] || "pending";
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

  const handleShowServiceDetails = async (id: string) => {
    try {
      const response = await api.get(`/appointment/${id}`);
      setSelectedServiceBooking(response.data);
      setServiceDetailsModalOpen(true);
    } catch (error) {
      console.error("Erreur chargement détails service:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la réservation",
        variant: "destructive",
      });
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mes Réservations</h1>
        <p className="text-muted-foreground">
          {user?.firstName ? `Bonjour ${user.firstName}, ` : ""}
          Consultez et gérez toutes vos réservations.
        </p>
      </div>

      <Tabs defaultValue="tourisme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tourisme" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Hébergements
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Services
          </TabsTrigger>
        </TabsList>

        {/* Onglet Réservations Tourisme */}
        <TabsContent value="tourisme">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes réservations d'hébergements</CardTitle>
                  <CardDescription>
                    {tourismBookings.length} réservation
                    {tourismBookings.length > 1 ? "s" : ""} trouvée
                    {tourismBookings.length > 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={tourismFilter}
                    onValueChange={setTourismFilter}
                  >
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
              </div>
            </CardHeader>
            <CardContent>
              {tourismLoading ? (
                <div className="text-center py-8">
                  <p>Chargement de vos réservations...</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Hébergement</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Voyageurs</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead className="w-[1%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tourismBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="text-muted-foreground">
                              Aucune réservation d'hébergement trouvée
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        tourismBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.code}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {booking.listing.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {booking.listing.city} •{" "}
                                  {booking.listing.type}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>
                                  Arrivée:{" "}
                                  {new Date(booking.checkIn).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </div>
                                <div>
                                  Départ:{" "}
                                  {new Date(
                                    booking.checkOut
                                  ).toLocaleDateString("fr-FR")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {booking.guests} voyageur
                              {booking.guests > 1 ? "s" : ""}
                            </TableCell>
                            <TableCell>
                              <TourismStatusBadge status={booking.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(booking.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleShowTourismDetails(booking)
                                  }
                                >
                                  Détails
                                </Button>
                                {booking.status !== "annulee" &&
                                  booking.status !== "terminee" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          Annuler
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            Annuler la réservation{" "}
                                            {booking.code} ?
                                          </DialogTitle>
                                          <DialogDescription>
                                            Cette action est irréversible.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                          <Button
                                            variant="destructive"
                                            onClick={() =>
                                              cancelTourismBooking(booking.id)
                                            }
                                          >
                                            Confirmer l'annulation
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Réservations Services */}
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mes réservations de services de bien etre</CardTitle>
                  <CardDescription>
                    Historique et réservations à venir
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    defaultValue="all"
                    onValueChange={(v) => setServiceFilter(v)}
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
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead className="w-[1%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {serviceBookings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Aucune réservation de service trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      serviceBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {generateBookingCode(booking.id)}
                          </TableCell>
                          <TableCell>{booking.service.libelle}</TableCell>
                          <TableCell>
                            {new Date(booking.date).toLocaleDateString("fr-FR")}
                          </TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>
                            <ServiceStatusBadge status={booking.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(booking.service.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleShowServiceDetails(booking.id)
                                }
                              >
                                Détails
                              </Button>
                              {booking.status !== "cancelled" &&
                                booking.status !== "completed" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        Annuler
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Annuler la réservation{" "}
                                          {generateBookingCode(booking.id)} ?
                                        </DialogTitle>
                                        <DialogDescription>
                                          Cette action est irréversible.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button
                                          variant="destructive"
                                          onClick={() =>
                                            cancelServiceBooking(booking.id)
                                          }
                                        >
                                          Confirmer l'annulation
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Section d'actions communes */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>
              Besoin d'aide pour une réservation ?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/app/messages">Contacter le support</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Politique d'annulation</CardTitle>
            <CardDescription>
              Consultez les conditions d'annulation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="/app/conditions-annulation">Voir les conditions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle réservation</CardTitle>
            <CardDescription>Parcourez nos services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" asChild className="w-full">
              <Link to="/tourisme">Hébergements</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link to="/app/services">Services</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Modals des détails */}
      {selectedTourismBooking && (
        <TourismBookingDetailsModal
          booking={selectedTourismBooking}
          open={tourismDetailsModalOpen}
          onOpenChange={setTourismDetailsModalOpen}
        />
      )}

      {selectedServiceBooking && (
        <ServiceBookingDetailsModal
          booking={selectedServiceBooking}
          open={serviceDetailsModalOpen}
          onOpenChange={setServiceDetailsModalOpen}
        />
      )}
    </div>
  );
}
