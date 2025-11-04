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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Link } from "react-router-dom";

// Types
interface Booking {
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
    };
    createdAt: string;
    cancelledAt?: string;
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

function StatusBadge({ status }: { status: Booking["status"] }) {
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

export default function ReservationPage() {
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    // Charger les réservations
    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await api.get("/user/bookings", {
                    params: {
                        userId: user.id,
                        status: filter !== "all" ? filter : undefined
                    }
                });

                if (response.data.success) {
                    setBookings(response.data.data);
                } else {
                    toast({
                        title: "Erreur",
                        description: "Impossible de charger les réservations",
                        variant: "destructive"
                    });
                }
            } catch (error) {
                console.error("Erreur chargement réservations:", error);
                toast({
                    title: "Erreur",
                    description: "Erreur lors du chargement des réservations",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, user, filter, toast]);

    const filteredBookings = useMemo(() => {
        return bookings;
    }, [bookings]);

    const cancelBooking = async (id: string) => {
        try {
            const response = await api.put(`/user/bookings/${id}/cancel`, {
                userId: user?.id
            });

            if (response.data.success) {
                setBookings(prev => prev.map(b => 
                    b.id === id ? { ...b, status: "annulee" as const } : b
                ));
                toast({ title: "Réservation annulée", description: response.data.message });
            }
        } catch (error: any) {
            console.error("Erreur annulation:", error);
            toast({
                title: "Erreur",
                description: error.response?.data?.error || "Erreur lors de l'annulation",
                variant: "destructive"
            });
        }
    };

    const rescheduleBooking = async (id: string, newDate: string) => {
        try {
            // Convertir la date en format checkIn/checkOut
            const checkIn = new Date(newDate);
            const checkOut = new Date(checkIn);
            checkOut.setDate(checkOut.getDate() + 1); // +1 jour par défaut

            const response = await api.put(`/user/bookings/${id}/reschedule`, {
                userId: user?.id,
                checkIn: checkIn.toISOString(),
                checkOut: checkOut.toISOString()
            });

            if (response.data.success) {
                setBookings(prev => prev.map(b => 
                    b.id === id ? { 
                        ...b, 
                        checkIn: response.data.data.checkIn,
                        checkOut: response.data.data.checkOut,
                        amount: response.data.data.totalAmount
                    } : b
                ));
                toast({ 
                    title: "Réservation reprogrammée", 
                    description: response.data.message 
                });
            }
        } catch (error: any) {
            console.error("Erreur reprogrammation:", error);
            toast({
                title: "Erreur",
                description: error.response?.data?.error || "Erreur lors de la reprogrammation",
                variant: "destructive"
            });
        }
    };

    function RescheduleDialog({ booking }: { booking: Booking }) {
        const [open, setOpen] = useState(false);

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">Reprogrammer</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reprogrammer {booking.code}</DialogTitle>
                        <DialogDescription>Choisissez une nouvelle date d'arrivée</DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = new FormData(e.currentTarget);
                            const date = String(form.get("date") || "");
                            if (!date) return;
                            rescheduleBooking(booking.id, date);
                            setOpen(false);
                        }}
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="date">Date d'arrivée</Label>
                            <Input 
                                id="date" 
                                name="date" 
                                type="date" 
                                required 
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

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
        <>
            <div className="container mx-auto max-w-6xl py-8 mt-12">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Mes Réservations</h1>
                    <p className="text-muted-foreground">
                        {user?.firstName ? `Bonjour ${user.firstName}, ` : ""}
                        Consultez et gérez vos réservations.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Mes réservations</CardTitle>
                                <CardDescription>
                                    {bookings.length} réservation{bookings.length > 1 ? 's' : ''} trouvée{bookings.length > 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select value={filter} onValueChange={setFilter}>
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
                        {loading ? (
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
                                        {filteredBookings.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <div className="text-muted-foreground">
                                                        Aucune réservation trouvée
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredBookings.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell className="font-medium">{booking.code}</TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{booking.listing.title}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {booking.listing.city} • {booking.listing.type}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div>Arrivée: {new Date(booking.checkIn).toLocaleDateString('fr-FR')}</div>
                                                            <div>Départ: {new Date(booking.checkOut).toLocaleDateString('fr-FR')}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {booking.guests} voyageur{booking.guests > 1 ? 's' : ''}
                                                    </TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={booking.status} />
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatCurrency(booking.amount)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button variant="outline" size="sm" asChild>
                                                                <Link to={`/app/mon-compte/reservation/${booking.id}`}>
                                                                    Détails
                                                                </Link>
                                                            </Button>
                                                            {booking.status !== "annulee" && booking.status !== "terminee" && (
                                                                <>
                                                                    <RescheduleDialog booking={booking} />
                                                                    <Dialog>
                                                                        <DialogTrigger asChild>
                                                                            <Button variant="ghost" size="sm">
                                                                                Annuler
                                                                            </Button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>
                                                                                    Annuler la réservation {booking.code} ?
                                                                                </DialogTitle>
                                                                                <DialogDescription>
                                                                                    Cette action est irréversible.
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogFooter>
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    onClick={() => cancelBooking(booking.id)}
                                                                                >
                                                                                    Confirmer l'annulation
                                                                                </Button>
                                                                            </DialogFooter>
                                                                        </DialogContent>
                                                                    </Dialog>
                                                                </>
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

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                            <CardDescription>Besoin d'aide pour une réservation ?</CardDescription>
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
                            <CardDescription>Consultez les conditions d'annulation</CardDescription>
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
                            <CardDescription>Parcourez nos hébergements</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" asChild>
                                <Link to="/tourisme">Voir les hébergements</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}