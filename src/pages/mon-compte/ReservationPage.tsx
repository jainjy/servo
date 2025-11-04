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
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import api from "@/lib/api";

// Types
interface Service {
    id: number;
    libelle: string;
    price: number;
    description: string;
}

interface Booking {
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

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

function generateBookingCode(id: string): string {
    return `BK-${id.slice(-4).toUpperCase()}`;
}

function StatusBadge({ status }: { status: Booking["status"] }) {
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

// Composant pour afficher les détails d'une réservation
function BookingDetailsDialog({ booking, onClose }: { booking: Booking; onClose: () => void }) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Détails de la réservation {generateBookingCode(booking.id)}</DialogTitle>
                    <DialogDescription>
                        Informations complètes sur votre réservation
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
                                <StatusBadge status={booking.status} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="font-semibold">Date</Label>
                            <p className="mt-1">
                                {new Date(booking.date).toLocaleDateString("fr-FR", {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
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
                    <Button onClick={onClose}>Fermer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Composant pour reprogrammer une réservation
function RescheduleDialog({ booking, onReschedule }: { booking: Booking; onReschedule: (id: string, newDate: string, newTime: string) => void }) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(booking.date.split(' ')[0]);
    const [time, setTime] = useState(booking.time);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !time) return;
        
        onReschedule(booking.id, date, time);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Reprogrammer</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reprogrammer {generateBookingCode(booking.id)}</DialogTitle>
                    <DialogDescription>Choisissez une nouvelle date et heure</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input 
                            id="date" 
                            type="date" 
                            required 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="time">Heure</Label>
                        <Input 
                            id="time" 
                            type="time" 
                            required 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
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

// Composant pour annuler une réservation
function CancelBookingDialog({ booking, onCancel }: { booking: Booking; onCancel: (id: string) => void }) {
    const [open, setOpen] = useState(false);

    const handleCancel = () => {
        onCancel(booking.id);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">Annuler</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Annuler la réservation {generateBookingCode(booking.id)} ?
                    </DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Êtes-vous sûr de vouloir annuler cette réservation ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Retour
                    </Button>
                    <Button variant="destructive" onClick={handleCancel}>
                        Confirmer l'annulation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function ReservationPage() {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Récupération des données depuis l'API
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await api.get('/appointment/appointment');
                setBookings(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des rendez-vous:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les réservations",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [toast]);

    // Fonction pour mapper les statuts de l'API vers les statuts de l'interface
    const mapStatus = (status: string): Booking["status"] => {
        const statusMap: Record<string, Booking["status"]> = {
            'pending': 'pending',
            'confirmed': 'confirmed',
            'cancelled': 'cancelled',
            'completed': 'completed'
        };
        return statusMap[status] || 'pending';
    };

    // Fonction pour récupérer les détails d'une réservation
    const fetchBookingDetails = async (id: string) => {
        try {
            const response = await api.get(`/appointment/${id}`);
            setSelectedBooking(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger les détails de la réservation",
                variant: "destructive"
            });
        }
    };

    const filteredBookings = useMemo(() => {
        if (filter === "all") return bookings;
        return bookings.filter((b) => b.status === filter);
    }, [bookings, filter]);

    const cancelBooking = async (id: string) => {
        try {
            await api.patch(`/appointment/${id}/cancel`);
            setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
            toast({ 
                title: "Réservation annulée",
                description: "Votre réservation a été annulée avec succès"
            });
        } catch (error) {
            console.error("Erreur annulation:", error);
            toast({
                title: "Erreur",
                description: "Impossible d'annuler la réservation",
                variant: "destructive"
            });
        }
    };

    const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
        try {
            const response = await api.patch(`/appointment/${id}/reschedule`, { 
                date: newDate, 
                time: newTime 
            });

            setBookings((prev) =>
                prev.map((b) =>
                    b.id === id ? { ...b, date: newDate, time: newTime } : b
                )
            );

            toast({
                title: "Réservation reprogrammée",
                description: `Nouvelle date: ${new Date(newDate).toLocaleDateString("fr-FR")} à ${newTime}`,
            });
        } catch (error) {
            console.error("Erreur reprogrammation:", error);
            toast({
                title: "Erreur",
                description: "Impossible de reprogrammer la réservation",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto max-w-6xl py-8 mt-12">
                <div className="flex justify-center items-center h-64">
                    <p>Chargement des réservations...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="container mx-auto max-w-6xl py-8 mt-12">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Réservations</h1>
                    <p className="text-muted-foreground">Consultez et gérez vos réservations.</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Mes réservations</CardTitle>
                                <CardDescription>Historique et réservations à venir</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select defaultValue="all" onValueChange={(v) => setFilter(v)}>
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
                                    {filteredBookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                Aucune réservation trouvée
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBookings.map((b) => (
                                            <TableRow key={b.id}>
                                                <TableCell className="font-medium">
                                                    {generateBookingCode(b.id)}
                                                </TableCell>
                                                <TableCell>{b.service.libelle}</TableCell>
                                                <TableCell>
                                                    {new Date(b.date).toLocaleDateString("fr-FR")}
                                                </TableCell>
                                                <TableCell>
                                                    {b.time}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={mapStatus(b.status)} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(b.service.price)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            onClick={() => fetchBookingDetails(b.id)}
                                                        >
                                                            Détails
                                                        </Button>
                                                        {b.status !== "cancelled" && b.status !== "completed" && (
                                                            <>
                                                                <RescheduleDialog 
                                                                    booking={b} 
                                                                    onReschedule={rescheduleBooking}
                                                                />
                                                                <CancelBookingDialog 
                                                                    booking={b} 
                                                                    onCancel={cancelBooking}
                                                                />
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
                    </CardContent>
                </Card>

                {/* Modale des détails */}
                {selectedBooking && (
                    <BookingDetailsDialog 
                        booking={selectedBooking} 
                        onClose={() => setSelectedBooking(null)} 
                    />
                )}

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
                            <CardTitle>Créer une nouvelle réservation</CardTitle>
                            <CardDescription>Parcourez nos services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" asChild>
                                <Link to="/app/services">Voir les services</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    );
}