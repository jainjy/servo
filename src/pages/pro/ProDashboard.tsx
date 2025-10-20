'use client'

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Calendar,
  MapPin,
  Clock,
  Euro,
  CreditCard,
  User,
  Wrench,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  PlayCircle,
  Star,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Home,
  Sparkles,
  Zap,
  BarChart3,
  Settings,
  Users,
  FileText,
  Download,
  Upload
} from "lucide-react";
import { loadDemandes, updateDemandeStatus } from '@/lib/requestStore'

// Types conformes au modèle de données SERVO
interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar?: string;
  serviceName: string;
  startAt: string;
  endAt: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  rating?: number;
  review?: string;
  serviceImage?: string;
  commission?: number; // Commission SERVO
}

interface Service {
  id: string;
  vendorId: string; // Conforme au modèle SERVO
  name: string;
  category: string;
  priceMin: number;
  priceMax: number;
  slaHours: number;
  description: string;
  isActive: boolean;
  coverageArea?: string[]; // Zone de couverture géographique
  kycStatus: 'verified' | 'pending' | 'rejected'; // Conforme au modèle SERVO
}

interface ProStats {
  totalBookings: number;
  completedThisMonth: number;
  averageRating: number;
  totalRevenue: number;
  pendingRequests: number;
  commissionEarned: number;
  conversionRate: number;
}

interface NewBookingForm {
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceId: string;
  serviceName?: string;
  startAt: string;
  endAt: string;
  price: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
  status: 'pending' | 'confirmed';
  source: 'manuel' | 'devis' | 'demande';
}

interface AvailabilitySlot {
  id: string;
  day: number; // 0-6 (Dimanche-Samedi)
  start: string; // HH:mm
  end: string; // HH:mm
  zone?: string;
}

interface Review {
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  date: string;
  client: string;
}

export default function ProDashboard() {

  const [activeTab, setActiveTab] = useState("demandes");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    userName: "",
    userEmail: "",
    userPhone: "",
    serviceId: "",
    serviceName: "",
    startAt: "",
    endAt: "",
    price: 0,
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    notes: "",
    status: "pending",
    source: "manuel"
  });

  // Prestataire connecté - conforme au modèle SERVO
  const currentPro = {
    id: "v1", // vendorId conforme au modèle
    userId: "uv1",
    companyName: "Artisans Parisiens",
    email: "contact@artisans-parisiens.fr",
    phone: "+33 1 45 23 89 12",
    rating: 4.8,
    completedJobs: 127,
    memberSince: "2022-03-15",
    kycStatus: "verified" as const,
    categories: ["plomberie", "electricite"],
    coverageArea: ["Paris", "Petite Couronne"]
  };

  // Demandes de réservation entrantes - workflow PRO
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([
    {
      id: "1",
      serviceId: "s1",
      userId: "u1",
      userName: "Marie Lambert",
      userEmail: "marie.lambert@example.com",
      userPhone: "+33 6 12 34 56 78",
      userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
      serviceName: "Plomberie d'urgence",
      startAt: "2024-01-15T09:00:00Z",
      endAt: "2024-01-15T12:00:00Z",
      status: "pending",
      price: 120,
      commission: 12, // 10% de commission SERVO
      address: {
        street: "123 Avenue de la République",
        city: "Paris",
        postalCode: "75011",
        country: "France"
      },
      notes: "Réparation fuite sous l'évier de la cuisine"
    },
    {
      id: "2",
      serviceId: "s2",
      userId: "u2",
      userName: "Pierre Dubois",
      userEmail: "pierre.dubois@example.com",
      userPhone: "+33 6 98 76 54 32",
      userAvatar: "https://randomuser.me/api/portraits/men/54.jpg",
      serviceName: "Nettoyage complet",
      startAt: "2024-01-16T14:00:00Z",
      endAt: "2024-01-16T16:00:00Z",
      status: "pending",
      price: 85,
      commission: 8.5,
      address: {
        street: "45 Rue du Commerce",
        city: "Paris",
        postalCode: "75015",
        country: "France"
      }
    }
  ]);

  // On mount load shared demandes from the admin (persisted in localStorage)
  useEffect(() => {
    try {
      const stored = loadDemandes()
      if (stored && stored.length > 0) {
        const mapped = stored.map(d => ({
          id: d.id,
          serviceId: d.metier || 'demande',
          userId: d.client || 'client',
          userName: d.client || 'Client',
          userEmail: '',
          userPhone: '',
          userAvatar: undefined,
          serviceName: d.titre || 'Demande',
          startAt: d.date || new Date().toISOString(),
          endAt: d.date || new Date().toISOString(),
          status: 'pending' as const,
          price: 0,
          commission: 0,
          address: {
            street: d.lieu || '',
            city: '',
            postalCode: '',
            country: ''
          },
          notes: d.description || ''
        }))
        // Prepend stored demandes so they appear first
        setIncomingBookings(prev => [...mapped, ...prev])
      }
    } catch (e) {
      console.error('Failed to load stored demandes', e)
    }
  }, [])

  // Réservations confirmées et en cours
  const [activeBookings, setActiveBookings] = useState<Booking[]>([
    {
      id: "3",
      serviceId: "s3",
      userId: "u3",
      userName: "Sophie Martin",
      userEmail: "sophie.martin@example.com",
      userPhone: "+33 6 45 67 89 01",
      userAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
      serviceName: "Électricité générale",
      startAt: "2024-01-17T10:00:00Z",
      endAt: "2024-01-17T13:00:00Z",
      status: "confirmed",
      price: 150,
      commission: 15,
      address: {
        street: "78 Boulevard Saint-Germain",
        city: "Paris",
        postalCode: "75006",
        country: "France"
      },
      notes: "Installation prises supplémentaires salon"
    }
  ]);

  // Services du prestataire - conformes au modèle SERVO
  const [proServices, setProServices] = useState<Service[]>([
    {
      id: "s1",
      vendorId: "v1",
      name: "Plomberie d'urgence",
      category: "plomberie",
      priceMin: 80,
      priceMax: 200,
      slaHours: 4,
      description: "Intervention rapide pour dépannage plomberie",
      isActive: true,
      coverageArea: ["Paris", "Hauts-de-Seine", "Seine-Saint-Denis"],
      kycStatus: "verified"
    },
    {
      id: "s2",
      vendorId: "v1",
      name: "Nettoyage complet",
      category: "nettoyage",
      priceMin: 50,
      priceMax: 150,
      slaHours: 24,
      description: "Nettoyage approfondi de votre logement",
      isActive: true,
      coverageArea: ["Paris"],
      kycStatus: "verified"
    },
    {
      id: "s3",
      vendorId: "v1",
      name: "Électricité générale",
      category: "electricite",
      priceMin: 60,
      priceMax: 180,
      slaHours: 8,
      description: "Installation et dépannage électrique",
      isActive: true,
      coverageArea: ["Paris", "Val-de-Marne"],
      kycStatus: "verified"
    }
  ]);

  // Statistiques PRO - conformes aux besoins métier
  const [stats, setStats] = useState<ProStats>({
    totalBookings: 127,
    completedThisMonth: 12,
    averageRating: 4.8,
    totalRevenue: 8450,
    pendingRequests: incomingBookings.length,
    commissionEarned: 845, // 10% du revenue total
    conversionRate: 68 // 68% des demandes converties
  });

  const statusFilters = [
    { id: "all", name: "Toutes", count: incomingBookings.length + activeBookings.length },
    { id: "pending", name: "En attente", count: incomingBookings.length },
    { id: "confirmed", name: "Confirmées", count: activeBookings.filter(b => b.status === 'confirmed').length },
    { id: "in_progress", name: "En cours", count: activeBookings.filter(b => b.status === 'in_progress').length }
  ];

 
  const filteredBookings = [...incomingBookings, ...activeBookings].filter(booking => 
    (statusFilter === "all" || booking.status === statusFilter) &&
    (booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     booking.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     booking.address.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: Booking['status']) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      confirmed: { label: "Confirmé", variant: "default" as const, color: "bg-green-100 text-green-800 border-green-200" },
      in_progress: { label: "En cours", variant: "default" as const, color: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Terminé", variant: "outline" as const, color: "bg-gray-100 text-gray-800 border-gray-200" },
      cancelled: { label: "Annulé", variant: "destructive" as const, color: "bg-red-100 text-red-800 border-red-200" }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant as any} className={`${config.color} border`}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  

  const dayNames = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { id: 'a1', day: 1, start: '09:00', end: '12:00', zone: 'Paris' },
    { id: 'a2', day: 3, start: '14:00', end: '18:00', zone: 'Paris' },
  ]);
  const [paidBookings, setPaidBookings] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Review[]>([
    { bookingId: '3', rating: 5, comment: 'Très professionnel.', date: new Date().toISOString(), client: 'Sophie Martin' }
  ]);
  const [newSlotDay, setNewSlotDay] = useState<number>(1);

  const addAvailability = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const id = `${Date.now()}`;
    setAvailability(prev => [...prev, { id, ...slot }]);
  };

  const removeAvailability = (id: string) => {
    setAvailability(prev => prev.filter(s => s.id !== id));
  };

  const togglePaid = (id: string) => {
    setPaidBookings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setRating = (bookingId: string, rating: number, comment?: string) => {
    setReviews(prev => {
      const others = prev.filter(r => r.bookingId !== bookingId);
      const client = (activeBookings.find(b => b.id === bookingId) || incomingBookings.find(b => b.id === bookingId))?.userName || 'Client';
      return [...others, { bookingId, rating, comment, date: new Date().toISOString(), client }];
    });
  };

  // Auto-rotation des slides
  
  // Actions PRO conformes au workflow métier
  const handleAcceptBooking = (bookingId: string) => {
    const booking = incomingBookings.find(b => b.id === bookingId);
    if (booking) {
      setIncomingBookings(incomingBookings.filter(b => b.id !== bookingId));
      setActiveBookings([...activeBookings, { ...booking, status: 'confirmed' as const }]);
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));
    }
  };

  const handleRejectBooking = (bookingId: string, reason: string) => {
    setIncomingBookings(incomingBookings.filter(b => b.id !== bookingId));
    setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests - 1 }));
    // Envoyer notification au client avec le motif
    console.log(`Réservation ${bookingId} refusée: ${reason}`);
  };

  const handleStartBooking = (bookingId: string) => {
    setActiveBookings(activeBookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'in_progress' as const } : booking
    ));
  };

  const handleCompleteBooking = (bookingId: string) => {
    setActiveBookings(activeBookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'completed' as const } : booking
    ));
    setStats(prev => ({ 
      ...prev, 
      completedThisMonth: prev.completedThisMonth + 1,
      totalRevenue: prev.totalRevenue + (activeBookings.find(b => b.id === bookingId)?.price || 0)
    }));
  };

  const handleContactClient = (booking: Booking) => {
    // Intégration avec le système de messagerie SERVO
    alert(`Contact client ${booking.userName} - ${booking.userPhone}`);
  };

  const handleExportData = () => {
    // Export des données pour la comptabilité
    const data = {
      bookings: [...incomingBookings, ...activeBookings],
      services: proServices,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    console.log("Export PRO:", data);
    alert("Données exportées pour la comptabilité");
  };

  const handleCreateBooking = () => {
    const svc = proServices.find(s => s.id === newBooking.serviceId);
    const id = `${Date.now()}`;
    const commission = Math.round(((newBooking.price || 0) * 0.10) * 100) / 100;
    const booking: Booking = {
      id,
      serviceId: newBooking.serviceId || (svc?.id || "manual"),
      userId: "manual",
      userName: newBooking.userName || "Client",
      userEmail: newBooking.userEmail || "",
      userPhone: newBooking.userPhone || "",
      serviceName: newBooking.serviceName || svc?.name || "Service",
      startAt: newBooking.startAt || new Date().toISOString(),
      endAt: newBooking.endAt || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      status: newBooking.status,
      price: Number(newBooking.price) || 0,
      address: {
        street: newBooking.street || "",
        city: newBooking.city || "",
        postalCode: newBooking.postalCode || "",
        country: newBooking.country || ""
      },
      notes: newBooking.notes || "",
      commission
    };

    if (newBooking.status === 'pending') {
      setIncomingBookings(prev => [...prev, booking]);
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
    } else {
      setActiveBookings(prev => [...prev, booking]);
    }

    setIsCreateOpen(false);
    setNewBooking({
      userName: "",
      userEmail: "",
      userPhone: "",
      serviceId: "",
      serviceName: "",
      startAt: "",
      endAt: "",
      price: 0,
      street: "",
      city: "",
      postalCode: "",
      country: "France",
      notes: "",
      status: "pending",
      source: "manuel"
    });
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* En-tête PRO */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Réservations
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Gérez vos réservations et développez votre activité
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
          </motion.div>
        </div>

        {/* Slides alertes PRO */}
       
        {/* Statistiques PRO */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Demandes en attente</p>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">CA ce mois</p>
                  <p className="text-2xl font-bold">{stats.totalRevenue}€</p>
                </div>
                <Euro className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Commission SERVO</p>
                  <p className="text-2xl font-bold">{stats.commissionEarned}€</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Taux conversion</p>
                  <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation principale PRO */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:max-w-5xl mx-auto">
            <TabsTrigger value="demandes" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Demandes
              {stats.pendingRequests > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {stats.pendingRequests}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Réservations
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Mes Services
            </TabsTrigger>
            <TabsTrigger value="disponibilites" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Disponibilités
            </TabsTrigger>
            <TabsTrigger value="paiements" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="avis" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Avis
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Barre de recherche et actions PRO */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex flex-1 gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher une réservation, un client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => alert("Filtres à venir") }>
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
            </div>
            <div className="flex gap-2">
              <Button className="flex items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4" />
                Nouvelle réservation
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
                <Download className="w-4 h-4" />
                Exporter
              </Button>
            </div>
          </motion.div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle réservation</DialogTitle>
                <DialogDescription>Créer une réservation manuelle ou convertir un devis.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-0">
                <div className="grid gap-2">
                  <Label>Service</Label>
                  <Select
                    value={newBooking.serviceId}
                    onValueChange={(v) => {
                      const s = proServices.find(s => s.id === v);
                      setNewBooking(prev => ({
                        ...prev,
                        serviceId: v,
                        serviceName: s?.name || prev.serviceName,
                        price: prev.price || (s ? s.priceMin : 0)
                      }));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {proServices.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Nom du client</Label>
                    <Input value={newBooking.userName} onChange={(e)=>setNewBooking(p=>({...p, userName:e.target.value}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Téléphone</Label>
                    <Input value={newBooking.userPhone} onChange={(e)=>setNewBooking(p=>({...p, userPhone:e.target.value}))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input type="email" value={newBooking.userEmail} onChange={(e)=>setNewBooking(p=>({...p, userEmail:e.target.value}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Statut</Label>
                    <Select value={newBooking.status} onValueChange={(v)=>setNewBooking(p=>({...p, status: v as 'pending'|'confirmed'}))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="confirmed">Confirmée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Début</Label>
                    <Input type="datetime-local" value={newBooking.startAt} onChange={(e)=>setNewBooking(p=>({...p, startAt:e.target.value}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fin</Label>
                    <Input type="datetime-local" value={newBooking.endAt} onChange={(e)=>setNewBooking(p=>({...p, endAt:e.target.value}))} />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Adresse</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Rue" value={newBooking.street} onChange={(e)=>setNewBooking(p=>({...p, street:e.target.value}))} />
                    <Input placeholder="Ville" value={newBooking.city} onChange={(e)=>setNewBooking(p=>({...p, city:e.target.value}))} />
                    <Input placeholder="Code postal" value={newBooking.postalCode} onChange={(e)=>setNewBooking(p=>({...p, postalCode:e.target.value}))} />
                    <Input placeholder="Pays" value={newBooking.country} onChange={(e)=>setNewBooking(p=>({...p, country:e.target.value}))} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Prix (€)</Label>
                    <Input type="number" value={Number(newBooking.price)} onChange={(e)=>setNewBooking(p=>({...p, price:Number(e.target.value)}))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Source</Label>
                    <Select value={newBooking.source} onValueChange={(v)=>setNewBooking(p=>({...p, source: v as 'manuel'|'devis'|'demande'}))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manuel">Création manuelle</SelectItem>
                        <SelectItem value="devis">Devis converti</SelectItem>
                        <SelectItem value="demande">Demande SERVO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Notes</Label>
                  <Textarea value={newBooking.notes} onChange={(e)=>setNewBooking(p=>({...p, notes:e.target.value}))} placeholder="Détails de l'intervention, accès, etc." />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={()=>setIsCreateOpen(false)}>Annuler</Button>
                <Button onClick={handleCreateBooking}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Filtres par statut */}
          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {statusFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={statusFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.id)}
                className="flex items-center gap-2"
              >
                {filter.name}
                <Badge variant="secondary" className="ml-1">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </motion.div>

          {/* Contenu des onglets PRO */}
          <TabsContent value="demandes" className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatePresence>
                {incomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-white">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-yellow-200">
                              <AvatarImage src={booking.userAvatar} alt={booking.userName} />
                              <AvatarFallback className="bg-yellow-100 text-yellow-600">
                                {booking.userName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{booking.userName}</CardTitle>
                              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{formatDate(booking.startAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span>{booking.address.street}, {booking.address.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">{booking.price}€</span>
                            <span className="text-xs text-muted-foreground">
                              (Commission SERVO: {booking.commission}€)
                            </span>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground bg-yellow-50 p-2 rounded">
                            📝 {booking.notes}
                          </p>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptBooking(booking.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accepter
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectBooking(booking.id, "Indisponible")}
                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Refuser
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {incomingBookings.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune demande en attente</h3>
                <p className="text-muted-foreground">
                  Toutes vos demandes de réservation ont été traitées.
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="reservations" className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatePresence>
                {activeBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    className="h-full"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-12 h-12 border-2 border-blue-200">
                              <AvatarImage src={booking.userAvatar} alt={booking.userName} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {booking.userName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{booking.userName}</CardTitle>
                              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                            </div>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{formatDate(booking.startAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            <span className="truncate">{booking.address.street}, {booking.address.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Euro className="w-4 h-4 text-green-600" />
                            <span className="font-semibold">{booking.price}€</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm"
                              onClick={() => handleStartBooking(booking.id)}
                              className="flex-1"
                            >
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Commencer
                            </Button>
                          )}
                          {booking.status === 'in_progress' && (
                            <Button 
                              size="sm"
                              onClick={() => handleCompleteBooking(booking.id)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Terminer
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleContactClient(booking)}>
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Contacter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {proServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  className="h-full"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden group">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                          {service.name}
                        </CardTitle>
                        <Badge variant={service.isActive ? "default" : "secondary"}>
                          {service.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Tarif:</span>
                          <span className="font-bold text-green-600">
                            {service.priceMin} - {service.priceMax}€
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Délai:</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{service.slaHours}h max</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Zone:</span>
                          <span className="text-xs text-muted-foreground">
                            {service.coverageArea?.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-1" />
                          Modifier
                        </Button>
                        <Button 
                          size="sm" 
                          variant={service.isActive ? "outline" : "default"}
                          className="flex-1"
                        >
                          {service.isActive ? "Désactiver" : "Activer"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="disponibilites" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Créneaux disponibles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="grid gap-2">
                    <Label>Jour</Label>
                    <Select value={`${newSlotDay}`} onValueChange={(v)=>setNewSlotDay(parseInt(v))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayNames.map((d,i)=> (
                          <SelectItem key={i} value={`${i}`}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Début</Label>
                    <Input id="slot-start" type="time" defaultValue="09:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Fin</Label>
                    <Input id="slot-end" type="time" defaultValue="12:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Zone</Label>
                    <Input id="slot-zone" placeholder="Paris" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={()=>{
                    const start = (document.getElementById('slot-start') as HTMLInputElement)?.value || '09:00';
                    const end = (document.getElementById('slot-end') as HTMLInputElement)?.value || '12:00';
                    const zone = (document.getElementById('slot-zone') as HTMLInputElement)?.value || 'Paris';
                    const day = newSlotDay;
                    addAvailability({ day, start, end, zone });
                  }}>
                    Ajouter le créneau
                  </Button>
                </div>
                <div className="space-y-2">
                  {availability.map(s => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg border bg-background p-3">
                      <span className="text-sm">{dayNames[s.day]} • {s.start} - {s.end} • {s.zone}</span>
                      <Button variant="outline" size="sm" onClick={()=>removeAvailability(s.id)}>Supprimer</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="paiements" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Suivi des paiements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {([...incomingBookings, ...activeBookings]).map(b => {
                  const commission = Math.round((b.price * 0.10) * 100) / 100;
                  const net = Math.round((b.price - commission) * 100) / 100;
                  const paid = !!paidBookings[b.id];
                  return (
                    <div key={b.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border bg-background p-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-foreground">{b.serviceName} • {b.userName}</div>
                          <div className="text-xs text-muted-foreground">{formatDate(b.startAt)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-foreground">{b.price}€</span>
                        <span className="text-purple-600">{commission}€</span>
                        <span className="text-green-600 font-semibold">{net}€</span>
                        <Badge variant={paid ? 'default' : 'secondary'}>{paid ? 'Payé' : 'À payer'}</Badge>
                        <Button size="sm" variant="outline" onClick={()=>togglePaid(b.id)}>
                          {paid ? 'Marquer non payé' : 'Marquer payé'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avis" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Avis clients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeBookings.filter(b=>b.status==='completed').map(b=>{
                  const existing = reviews.find(r=>r.bookingId===b.id);
                  const currentRating = existing?.rating || 0;
                  return (
                    <div key={b.id} className="rounded-lg border bg-background p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-foreground">{b.userName} • {b.serviceName}</div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(n=> (
                            <button key={n} onClick={()=>setRating(b.id, n)} className={`p-1 ${n <= currentRating ? 'text-yellow-500' : 'text-muted-foreground'}`} aria-label={`Note ${n}`}>
                              <Star className="w-4 h-4" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{existing ? `Noté ${existing.rating}/5 le ${new Date(existing.date).toLocaleDateString('fr-FR')}` : 'Pas encore noté'}</div>
                    </div>
                  )
                })}
                {activeBookings.filter(b=>b.status==='completed').length === 0 && (
                  <div className="text-sm text-muted-foreground">Aucune prestation terminée pour le moment.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Mensuelle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Réservations complétées</span>
                      <span className="font-bold">{stats.completedThisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Chiffre d'affaires</span>
                      <span className="font-bold text-green-600">{stats.totalRevenue}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de conversion</span>
                      <span className="font-bold text-blue-600">{stats.conversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Note moyenne</span>
                      <span className="font-bold text-yellow-600">{stats.averageRating}/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="w-5 h-5" />
                    Détails Commissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Commission totale SERVO</span>
                      <span className="font-bold text-purple-600">{stats.commissionEarned}€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenu net estimé</span>
                      <span className="font-bold text-green-600">
                        {stats.totalRevenue - stats.commissionEarned}€
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      *Commission SERVO: 10% sur chaque réservation
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
}

// Composant TrendingUp manquant
const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

