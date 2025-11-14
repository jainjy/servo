"use client";

import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Eye, 
  EyeOff,
  Edit,
  Trash2,
  MoreVertical,
  Bell,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
  MapPin,
  Download,
  Upload,
  X,
  Save
} from "lucide-react";

// Types de rôles et permissions
const ROLES = {
  ADMIN: { 
    label: "Administrateur", 
    color: "bg-red-100 text-red-800",
    permissions: ["Tous les accès"]
  },
  AGENT: { 
    label: "Agent Immobilier", 
    color: "bg-blue-100 text-blue-800",
    permissions: ["Ventes", "Visites", "Clients", "Documents"]
  },
  GESTIONNAIRE: { 
    label: "Gestionnaire", 
    color: "bg-green-100 text-green-800",
    permissions: ["Location", "Contrats", "Maintenance", "Facturation"]
  },
  ASSISTANT: { 
    label: "Assistant", 
    color: "bg-purple-100 text-purple-800",
    permissions: ["Accueil", "Rendez-vous", "Documents simples"]
  }
};

// Types TypeScript
interface Employe {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: keyof typeof ROLES;
  dateEmbauche: string;
  statut: "active" | "inactive" | "en_conge";
  avatar: string;
  permissions: string[];
  planning: {
    [key: string]: { debut: string; fin: string };
  };
}

interface Notification {
  id: number;
  type: string;
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  destinataire: string;
}

// Données des employés
const employesInitiaux: Employe[] = [
  {
    id: 1,
    nom: "Marie Dubois",
    email: "marie.dubois@immobilier-pro.fr",
    telephone: "01 23 45 67 89",
    role: "ADMIN",
    dateEmbauche: "2020-03-15",
    statut: "active",
    avatar: "/avatars/marie.jpg",
    permissions: ["Tous les accès"],
    planning: {
      lundi: { debut: "09:00", fin: "18:00" },
      mardi: { debut: "09:00", fin: "18:00" },
      mercredi: { debut: "09:00", fin: "18:00" },
      jeudi: { debut: "09:00", fin: "18:00" },
      vendredi: { debut: "09:00", fin: "17:00" }
    }
  },
  {
    id: 2,
    nom: "Pierre Martin",
    email: "pierre.martin@immobilier-pro.fr",
    telephone: "01 23 45 67 90",
    role: "AGENT",
    dateEmbauche: "2021-06-10",
    statut: "active",
    avatar: "/avatars/pierre.jpg",
    permissions: ["Ventes", "Visites", "Clients", "Documents"],
    planning: {
      lundi: { debut: "10:00", fin: "19:00" },
      mardi: { debut: "10:00", fin: "19:00" },
      mercredi: { debut: "10:00", fin: "19:00" },
      jeudi: { debut: "10:00", fin: "19:00" },
      vendredi: { debut: "09:00", fin: "17:00" },
      samedi: { debut: "10:00", fin: "16:00" }
    }
  },
  {
    id: 3,
    nom: "Sophie Lambert",
    email: "sophie.lambert@immobilier-pro.fr",
    telephone: "01 23 45 67 91",
    role: "GESTIONNAIRE",
    dateEmbauche: "2022-01-20",
    statut: "active",
    avatar: "/avatars/sophie.jpg",
    permissions: ["Location", "Contrats", "Maintenance", "Facturation"],
    planning: {
      lundi: { debut: "08:30", fin: "17:30" },
      mardi: { debut: "08:30", fin: "17:30" },
      mercredi: { debut: "08:30", fin: "17:30" },
      jeudi: { debut: "08:30", fin: "17:30" },
      vendredi: { debut: "08:30", fin: "16:30" }
    }
  },
  {
    id: 4,
    nom: "Thomas Bernard",
    email: "thomas.bernard@immobilier-pro.fr",
    telephone: "01 23 45 67 92",
    role: "ASSISTANT",
    dateEmbauche: "2023-09-05",
    statut: "en_conge",
    avatar: "/avatars/thomas.jpg",
    permissions: ["Accueil", "Rendez-vous", "Documents simples"],
    planning: {
      lundi: { debut: "09:00", fin: "18:00" },
      mardi: { debut: "09:00", fin: "18:00" },
      mercredi: { debut: "09:00", fin: "18:00" },
      jeudi: { debut: "09:00", fin: "18:00" },
      vendredi: { debut: "09:00", fin: "17:00" }
    }
  }
];

// Notifications internes
const notificationsInitiaux: Notification[] = [
  {
    id: 1,
    type: "info",
    titre: "Nouvelle mission assignée",
    message: "Vous avez été assigné à la visite du bien 123 Avenue de Paris",
    date: "2024-01-15 10:30",
    lue: false,
    destinataire: "AGENT"
  },
  {
    id: 2,
    type: "urgence",
    titre: "Rappel rendez-vous",
    message: "Rendez-vous signature aujourd'hui à 15h00",
    date: "2024-01-15 09:15",
    lue: true,
    destinataire: "TOUS"
  },
  {
    id: 3,
    type: "success",
    titre: "Contrat signé",
    message: "Félicitations ! Le contrat pour l'appartement du 56 Rue Mozart a été signé",
    date: "2024-01-14 16:45",
    lue: true,
    destinataire: "ADMIN"
  }
];

// Composant Modal pour éditer/créer un employé
const EmployeModal = ({ 
  isOpen, 
  onClose, 
  employe, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  employe: Employe | null; 
  onSave: (employe: Employe) => void; 
}) => {
  const [formData, setFormData] = useState<Employe>({
    id: 0,
    nom: "",
    email: "",
    telephone: "",
    role: "ASSISTANT",
    dateEmbauche: new Date().toISOString().split('T')[0],
    statut: "active",
    avatar: "",
    permissions: [],
    planning: {
      lundi: { debut: "09:00", fin: "18:00" },
      mardi: { debut: "09:00", fin: "18:00" },
      mercredi: { debut: "09:00", fin: "18:00" },
      jeudi: { debut: "09:00", fin: "18:00" },
      vendredi: { debut: "09:00", fin: "17:00" }
    }
  });

  useEffect(() => {
    if (employe) {
      setFormData(employe);
    } else {
      // Réinitialiser le formulaire pour un nouvel employé
      setFormData({
        id: 0,
        nom: "",
        email: "",
        telephone: "",
        role: "ASSISTANT",
        dateEmbauche: new Date().toISOString().split('T')[0],
        statut: "active",
        avatar: "",
        permissions: ROLES.ASSISTANT.permissions,
        planning: {
          lundi: { debut: "09:00", fin: "18:00" },
          mardi: { debut: "09:00", fin: "18:00" },
          mercredi: { debut: "09:00", fin: "18:00" },
          jeudi: { debut: "09:00", fin: "18:00" },
          vendredi: { debut: "09:00", fin: "17:00" }
        }
      });
    }
  }, [employe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanningChange = (jour: string, field: 'debut' | 'fin', value: string) => {
    setFormData(prev => ({
      ...prev,
      planning: {
        ...prev.planning,
        [jour]: {
          ...prev.planning[jour],
          [field]: value
        }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold">
            {employe ? "Modifier l'employé" : "Nouvel employé"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
              
              <div>
                <Label htmlFor="nom">Nom complet *</Label>
                <Input
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="Marie Dubois"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="marie.dubois@immobilier-pro.fr"
                />
              </div>

              <div>
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>

              <div>
                <Label htmlFor="dateEmbauche">Date d'embauche</Label>
                <Input
                  id="dateEmbauche"
                  
                  type="date"
                  value={formData.dateEmbauche}
                  onChange={(e) => handleChange('dateEmbauche', e.target.value)}
                />
              </div>
            </div>

            {/* Rôle et statut */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rôle et statut</h3>
              
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <select
                  id="role"
                  className="w-full p-3 border rounded-lg"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {Object.entries(ROLES).map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="statut">Statut *</Label>
                <select
                  id="statut"
                  className="w-full p-3 border rounded-lg"
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="en_conge">En congé</option>
                </select>
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  placeholder="/avatars/marie.jpg"
                />
              </div>
            </div>
          </div>

          {/* Planning */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Planning hebdomadaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(formData.planning).map(([jour, horaire]) => (
                <div key={jour} className="border rounded-lg p-4">
                  <Label className="block mb-2 capitalize font-medium">{jour}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`${jour}-debut`} className="text-xs">Début</Label>
                      <Input
                        id={`${jour}-debut`}
                        type="time"
                        value={horaire.debut}
                        onChange={(e) => handlePlanningChange(jour, 'debut', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${jour}-fin`} className="text-xs">Fin</Label>
                      <Input
                        id={`${jour}-fin`}
                        type="time"
                        value={horaire.fin}
                        onChange={(e) => handlePlanningChange(jour, 'fin', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-8 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="mr-2" size={16} />
              {employe ? "Modifier" : "Créer"} l'employé
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeamPage = () => {
  const [employes, setEmployes] = useState<Employe[]>(employesInitiaux);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsInitiaux);
  const [filtres, setFiltres] = useState({
    recherche: "",
    role: "",
    statut: ""
  });
  const [vue, setVue] = useState<"liste" | "planning">("liste");
  const [employeSelectionne, setEmployeSelectionne] = useState<Employe | null>(null);
  const [showModalEmploye, setShowModalEmploye] = useState(false);

  // Filtrer les employés
  const employesFiltres = employes.filter(employe => {
    const matchRecherche = !filtres.recherche || 
      employe.nom.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      employe.email.toLowerCase().includes(filtres.recherche.toLowerCase());
    
    const matchRole = !filtres.role || employe.role === filtres.role;
    const matchStatut = !filtres.statut || employe.statut === filtres.statut;
    
    return matchRecherche && matchRole && matchStatut;
  });

  const ajouterEmploye = () => {
    setEmployeSelectionne(null);
    setShowModalEmploye(true);
  };

  const modifierEmploye = (employe: Employe) => {
    setEmployeSelectionne(employe);
    setShowModalEmploye(true);
  };

  const supprimerEmploye = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      setEmployes(employes.filter(emp => emp.id !== id));
    }
  };

  const sauvegarderEmploye = (employeData: Employe) => {
    if (employeData.id === 0) {
      // Nouvel employé
      const nouvelEmploye = {
        ...employeData,
        id: Math.max(...employes.map(e => e.id)) + 1,
        permissions: ROLES[employeData.role].permissions
      };
      setEmployes([...employes, nouvelEmploye]);
    } else {
      // Modification d'un employé existant
      setEmployes(employes.map(emp => 
        emp.id === employeData.id 
          ? { ...employeData, permissions: ROLES[employeData.role].permissions }
          : emp
      ));
    }
  };

  const marquerNotificationLue = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, lue: true } : notif
    ));
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getStatutColor = (statut: string) => {
    switch(statut) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "en_conge": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch(statut) {
      case "active": return "Actif";
      case "inactive": return "Inactif";
      case "en_conge": return "En congé";
      default: return statut;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: '#0A0A0A' }}>
                Gestion d'Équipe
              </h1>
              <p className="text-lg" style={{ color: '#5A6470' }}>
                Gérez vos employés, permissions et planning
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setVue(vue === "liste" ? "planning" : "liste")}
            >
              <Calendar className="mr-2" size={16} />
              {vue === "liste" ? "Vue Planning" : "Vue Liste"}
            </Button>
            <Button
              onClick={ajouterEmploye}
              style={{ backgroundColor: '#0052FF', color: 'white' }}
            >
              <UserPlus className="mr-2" size={16} />
              Nouvel employé
            </Button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{employes.length}</div>
            <div style={{ color: '#5A6470' }}>Employés total</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {employes.filter(e => e.statut === "active").length}
            </div>
            <div style={{ color: '#5A6470' }}>Actifs</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {employes.filter(e => e.role === "AGENT").length}
            </div>
            <div style={{ color: '#5A6470' }}>Agents</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {notifications.filter(n => !n.lue).length}
            </div>
            <div style={{ color: '#5A6470' }}>Notifications</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Colonne principale */}
          <div className="xl:col-span-3 space-y-8">
            {/* Barre de recherche et filtres */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Rechercher un employé..."
                    className="pl-10"
                    value={filtres.recherche}
                    onChange={(e) => setFiltres({ ...filtres, recherche: e.target.value })}
                  />
                </div>
                
                <select
                  className="p-2 border rounded-lg"
                  value={filtres.role}
                  onChange={(e) => setFiltres({ ...filtres, role: e.target.value })}
                >
                  <option value="">Tous les rôles</option>
                  {Object.entries(ROLES).map(([key, role]) => (
                    <option key={key} value={key}>{role.label}</option>
                  ))}
                </select>
                
                <select
                  className="p-2 border rounded-lg"
                  value={filtres.statut}
                  onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="en_conge">En congé</option>
                </select>
              </div>
            </Card>

            {/* Vue Liste des employés */}
            {vue === "liste" && (
              <div className="space-y-4">
                {employesFiltres.map((employe) => (
                  <Card key={employe.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employe.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getInitials(employe.nom)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-lg" style={{ color: '#0A0A0A' }}>
                              {employe.nom}
                            </h3>
                            <Badge className={ROLES[employe.role].color}>
                              {ROLES[employe.role].label}
                            </Badge>
                            <Badge className={getStatutColor(employe.statut)}>
                              {getStatutLabel(employe.statut)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm" style={{ color: '#5A6470' }}>
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              {employe.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              {employe.telephone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Embauche: {new Date(employe.dateEmbauche).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => modifierEmploye(employe)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => supprimerEmploye(employe.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Planning réduit */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={16} />
                        <span className="text-sm font-medium" style={{ color: '#0A0A0A' }}>
                          Planning hebdomadaire
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs" style={{ color: '#5A6470' }}>
                        {Object.entries(employe.planning).slice(0, 3).map(([jour, horaire]) => (
                          <div key={jour} className="capitalize">
                            {jour.substring(0, 3)}: {horaire.debut}-{horaire.fin}
                          </div>
                        ))}
                        {Object.entries(employe.planning).length > 3 && (
                          <div>+{Object.entries(employe.planning).length - 3} jours</div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Vue Planning */}
            {vue === "planning" && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6" style={{ color: '#0A0A0A' }}>
                  Planning de l'équipe
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium" style={{ color: '#0A0A0A' }}>
                          Employé
                        </th>
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
                          <th key={jour} className="p-3 font-medium text-center" style={{ color: '#0A0A0A' }}>
                            {jour}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employesFiltres.map((employe) => (
                        <tr key={employe.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employe.avatar} />
                                <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                                  {getInitials(employe.nom)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium" style={{ color: '#0A0A0A' }}>
                                  {employe.nom}
                                </div>
                                <div className="text-xs" style={{ color: '#5A6470' }}>
                                  {ROLES[employe.role].label}
                                </div>
                              </div>
                            </div>
                          </td>
                          
                          {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((jour) => {
                            const horaire = employe.planning[jour];
                            return (
                              <td key={jour} className="p-3 text-center">
                                {horaire ? (
                                  <div className="text-sm bg-green-50 text-green-700 rounded py-1 px-2">
                                    {horaire.debut}-{horaire.fin}
                                  </div>
                                ) : (
                                  <div className="text-sm bg-gray-100 text-gray-500 rounded py-1 px-2">
                                    Repos
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Colonne latérale - Notifications */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#0A0A0A' }}>
                  <Bell size={20} />
                  Notifications
                </h3>
                <Badge variant="secondary">
                  {notifications.filter(n => !n.lue).length} non lues
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                      notification.lue ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                    onClick={() => marquerNotificationLue(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${
                        notification.type === 'urgence' ? 'bg-red-100 text-red-600' :
                        notification.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {notification.type === 'urgence' ? <XCircle size={16} /> :
                         notification.type === 'success' ? <CheckCircle size={16} /> :
                         <MessageSquare size={16} />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`font-medium text-sm ${
                            notification.lue ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                            {notification.titre}
                          </div>
                          {!notification.lue && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.date).toLocaleString()}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {notification.destinataire === 'TOUS' ? 'Tous' : ROLES[notification.destinataire as keyof typeof ROLES]?.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les notifications
              </Button>
            </Card>

            {/* Statistiques des rôles */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0A0A0A' }}>
                Répartition des rôles
              </h3>
              
              <div className="space-y-3">
                {Object.entries(ROLES).map(([key, role]) => {
                  const count = employes.filter(e => e.role === key).length;
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${role.color.split(' ')[0]}`}></div>
                        <span className="text-sm" style={{ color: '#5A6470' }}>
                          {role.label}
                        </span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Actions rapides */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0A0A0A' }}>
                Actions rapides
              </h3>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2" size={16} />
                  Exporter l'équipe
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="mr-2" size={16} />
                  Importer planning
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2" size={16} />
                  Email groupé
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2" size={16} />
                  Planning mensuel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal pour créer/modifier un employé */}
      <EmployeModal
        isOpen={showModalEmploye}
        onClose={() => setShowModalEmploye(false)}
        employe={employeSelectionne}
        onSave={sauvegarderEmploye}
      />

      <style>{`
        .bg-red-100 { background-color: #FEE2E2; }
        .text-red-800 { color: #991B1B; }
        .bg-blue-100 { background-color: #DBEAFE; }
        .text-blue-800 { color: #1E40AF; }
        .bg-green-100 { background-color: #DCFCE7; }
        .text-green-800 { color: #166534; }
        .bg-purple-100 { background-color: #F3E8FF; }
        .text-purple-800 { color: #7C3AED; }
        .bg-yellow-100 { background-color: #FEF3C7; }
        .text-yellow-800 { color: #92400E; }
      `}</style>
    </div>
  );
};

export default TeamPage;