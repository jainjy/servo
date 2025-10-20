import React, { useMemo, useState } from "react";
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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";  // Ajouter si tu utilises react-router

// Types
interface Booking {
    id: string;
    code: string;
    service: string;
    date: string;
    status: "confirmee" | "en_attente" | "annulee" | "terminee";
    amount: number;
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

    const [bookings, setBookings] = useState<Booking[]>([
        { id: "b1", code: "BK-3942", service: "Location appartement", date: "2025-05-12", status: "confirmee", amount: 120 },
        { id: "b2", code: "BK-3810", service: "Visite guidée", date: "2025-05-04", status: "terminee", amount: 50 },
        { id: "b3", code: "BK-3721", service: "Nettoyage", date: "2025-05-22", status: "en_attente", amount: 90.5 },
        { id: "b4", code: "BK-3605", service: "Location maison", date: "2025-06-02", status: "annulee", amount: 210 },
    ]);

    const [filter, setFilter] = useState<string>("all");

    const filteredBookings = useMemo(() => {
        if (filter === "all") return bookings;
        return bookings.filter((b) => b.status === filter);
    }, [bookings, filter]);

    function cancelBooking(id: string) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "annulee" } : b)));
        toast({ title: "Réservation annulée" });
    }

    function rescheduleBooking(id: string, newDate: string) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, date: newDate } : b)));
        toast({ title: "Réservation reprogrammée", description: new Date(newDate).toLocaleString("fr-FR") });
    }

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
                        <DialogDescription>Choisissez une nouvelle date et heure</DialogDescription>
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
                            <Label htmlFor="date">Date et heure</Label>
                            <Input id="date" name="date" type="datetime-local" required />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
    
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                        <TableHead className="w-[1%]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.map((b) => (
                                        <TableRow key={b.id}>
                                            <TableCell className="font-medium">{b.code}</TableCell>
                                            <TableCell>{b.service}</TableCell>
                                            <TableCell>{new Date(b.date).toLocaleString("fr-FR")}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={b.status} />
                                            </TableCell>
                                            <TableCell className="text-right">{formatCurrency(b.amount)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link to={`/app/mon-compte/reservation/${b.id}`}>Détails</Link>
                                                    </Button>
                                                    {b.status !== "annulee" && b.status !== "terminee" && (
                                                        <>
                                                            <RescheduleDialog booking={b} />
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm">Annuler</Button>
                                                                </DialogTrigger>
                                                                <DialogContent>
                                                                    <DialogHeader>
                                                                        <DialogTitle>Annuler la réservation {b.code} ?</DialogTitle>
                                                                        <DialogDescription>Cette action est irréversible.</DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => cancelBooking(b.id)}
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
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
         
        </>
    );
}
