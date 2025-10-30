"use client";

import { useState } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Users, 
  UserPlus, 
  BarChart2, 
  Phone, 
  MapPin, 
  Mail, 
  Edit, 
  Trash2,
  MoreVertical,
  Filter,
  Download,
  Upload
} from "lucide-react";
import { easeInOut } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define the client type for better type safety
interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: "active" | "inactive" | "premium";
  joinedAt: string;
}

export default function ClientSection() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Léa Martin",
      email: "lea.martin@example.com",
      phone: "+33 6 45 23 89 12",
      location: "Paris, France",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "active",
      joinedAt: "2024-11-05",
    },
    {
      id: 2,
      name: "Ahmed Souleiman",
      email: "ahmed.s@example.com",
      phone: "+33 7 22 15 09 88",
      location: "Lyon, France",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "inactive",
      joinedAt: "2023-05-19",
    },
    {
      id: 3,
      name: "Camille Dupont",
      email: "camille.dupont@example.com",
      phone: "+33 6 77 44 90 12",
      location: "Marseille, France",
      avatar: "https://randomuser.me/api/portraits/women/43.jpg",
      status: "premium",
      joinedAt: "2022-09-10",
    },
  ]);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("list");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean; clientId: number | null}>({
    isOpen: false,
    clientId: null
  });

  // Modal & formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClientId, setEditingClientId] = useState<number | null>(null);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "active" as "active" | "inactive" | "premium",
    avatar: "",
  });

  // Filtrer les clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
                         client.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditClick = (client: Client) => {
    setEditingClientId(client.id);
    setNewClient({
      name: client.name,
      email: client.email,
      phone: client.phone,
      location: client.location,
      status: client.status,
      avatar: client.avatar,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (clientId: number) => {
    setDeleteConfirm({ isOpen: true, clientId });
  };

  const confirmDelete = () => {
    if (deleteConfirm.clientId) {
      setClients(prev => prev.filter(client => client.id !== deleteConfirm.clientId));
      setDeleteConfirm({ isOpen: false, clientId: null });
    }
  };

  const handleSaveClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Le nom et l'email sont obligatoires !");
      return;
    }

    if (editingClientId) {
      // Modifier un client existant
      setClients((prev) =>
        prev.map((c) => {
          if (c.id === editingClientId) {
            const existingClient = prev.find((x) => x.id === editingClientId);
            return {
              id: editingClientId,
              name: newClient.name,
              email: newClient.email,
              phone: newClient.phone,
              location: newClient.location,
              status: newClient.status,
              avatar: newClient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.name)}`,
              joinedAt: existingClient ? existingClient.joinedAt : new Date().toISOString().split('T')[0]
            };
          }
          return c;
        })
      );
    } else {
      // Ajouter nouveau client
      const id = Math.max(...clients.map(c => c.id), 0) + 1;
      const newClientData: Client = {
        ...newClient,
        id,
        joinedAt: new Date().toISOString().split('T')[0],
        avatar: newClient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.name)}`,
      };
      setClients([...clients, newClientData]);
    }

    setEditingClientId(null);
    setNewClient({ name: "", email: "", phone: "", location: "", status: "active", avatar: "" });
    setIsModalOpen(false);
  };

  // Statistiques
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    inactive: clients.filter(c => c.status === "inactive").length,
    premium: clients.filter(c => c.status === "premium").length,
  };

  const tabMotion = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.5, ease: easeInOut as unknown as Easing },
  };

  return (
    <section className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Espace Clients</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Gestion centralisée des profils clients SERVO - {clients.length} client(s) au total
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            <Button
              className="gap-2 shadow-md bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingClientId(null);
                setNewClient({
                  name: "",
                  email: "",
                  phone: "",
                  location: "",
                  status: "active",
                  avatar: "",
                });
                setIsModalOpen(true);
              }}
            >
              <UserPlus className="w-4 h-4" /> Nouveau Client
            </Button>
          </div>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-white rounded-lg border shadow-sm"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="list" value={tab} onValueChange={setTab}>
          <TabsList className="bg-white border rounded-lg p-1">
            <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <Users className="w-4 h-4" /> Liste des Clients
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              <BarChart2 className="w-4 h-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* LISTE CLIENTS */}
              {tab === "list" && (
                <motion.div key="list" {...tabMotion}>
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600">Aucun client trouvé</h3>
                      <p className="text-gray-500 mt-1">
                        {search || statusFilter !== "all" 
                          ? "Aucun client ne correspond à vos critères de recherche." 
                          : "Commencez par ajouter votre premier client."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredClients.map((client, index) => (
                        <motion.div
                          key={client.id}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <Card className="rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                                  <AvatarImage src={client.avatar} alt={client.name} />
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <CardTitle className="text-lg">{client.name}</CardTitle>
                                  <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {client.email}
                                  </p>
                                </div>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditClick(client)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteClick(client.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardHeader>
                            
                            <CardContent className="space-y-3 pt-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" /> 
                                <span className="font-medium">{client.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" /> 
                                <span>{client.location}</span>
                              </div>
                              
                              <div className="flex items-center justify-between pt-2">
                                <Badge
                                  variant={
                                    client.status === "active"
                                      ? "default"
                                      : client.status === "premium"
                                      ? "secondary"
                                      : "outline"
                                  }
                                  className={
                                    client.status === "premium" 
                                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0" 
                                      : ""
                                  }
                                >
                                  {client.status === "active"
                                    ? "Actif"
                                    : client.status === "premium"
                                    ? "Premium"
                                    : "Inactif"}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  Inscrit le {new Date(client.joinedAt).toLocaleDateString("fr-FR")}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ANALYTICS */}
              {tab === "analytics" && (
                <motion.div key="analytics" {...tabMotion}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="rounded-xl border-0 shadow-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm font-medium">Total Clients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats.total}</p>
                        <p className="text-blue-100 text-sm mt-1">Clients enregistrés</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm font-medium">Clients Actifs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats.active}</p>
                        <p className="text-green-100 text-sm mt-1">{Math.round((stats.active / stats.total) * 100)}% du total</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-0 shadow-sm bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm font-medium">Clients Premium</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats.premium}</p>
                        <p className="text-amber-100 text-sm mt-1">Clients VIP</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border-0 shadow-sm bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-sm font-medium">Clients Inactifs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold">{stats.inactive}</p>
                        <p className="text-gray-100 text-sm mt-1">Nécessitent un suivi</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-xl border shadow-sm">
                    <CardHeader>
                      <CardTitle>Répartition des Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {["active", "premium", "inactive"].map((status) => {
                          const count = clients.filter(c => c.status === status).length;
                          const percentage = Math.round((count / stats.total) * 100);
                          return (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  status === "active" ? "bg-green-500" :
                                  status === "premium" ? "bg-amber-500" : "bg-gray-400"
                                }`} />
                                <span className="capitalize">
                                  {status === "active" ? "Actifs" : 
                                   status === "premium" ? "Premium" : "Inactifs"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      status === "active" ? "bg-green-500" :
                                      status === "premium" ? "bg-amber-500" : "bg-gray-400"
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>

        {/* MODAL AJOUT/MODIF CLIENT */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl w-full max-w-md shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingClientId ? "Modifier le client" : "Nouveau client"}
                  </h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={newClient.name}
                      onChange={(e) =>
                        setNewClient({ ...newClient, name: e.target.value })
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        placeholder="+33 6 12 34 56 78"
                        value={newClient.phone}
                        onChange={(e) =>
                          setNewClient({ ...newClient, phone: e.target.value })
                        }
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newClient.status}
                        onChange={(e) =>
                          setNewClient({ ...newClient, status: e.target.value as "active" | "inactive" | "premium" })
                        }
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <Input
                      placeholder="Paris, France"
                      value={newClient.location}
                      onChange={(e) =>
                        setNewClient({ ...newClient, location: e.target.value })
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL de l'avatar
                    </label>
                    <Input
                      placeholder="https://..."
                      value={newClient.avatar}
                      onChange={(e) =>
                        setNewClient({ ...newClient, avatar: e.target.value })
                      }
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="border-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSaveClient}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {editingClientId ? "Enregistrer" : "Créer le client"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
        <AnimatePresence>
          {deleteConfirm.isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl w-full max-w-md shadow-xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    Confirmer la suppression
                  </h2>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600">
                    Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
                  </p>
                </div>
                
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                  <Button 
                    variant="outline" 
                    onClick={() => setDeleteConfirm({ isOpen: false, clientId: null })}
                    className="border-gray-300"
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Supprimer définitivement
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}