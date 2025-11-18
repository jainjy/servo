import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Filter,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Video,
  Phone,
  Mail,
  CheckCircle,
  Clock4,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Star,
  X,
  User,
  Home,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  PhoneCall,
  Mail as MailIcon,
  Navigation
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const formatDateLocal = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}; 

// Types de rendez-vous
const STATUT_RENDEZ_VOUS = {
  CONFIRME: { label: "Confirmé", color: "bg-green-100 text-green-800" },
  EN_ATTENTE: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  ANNULE: { label: "Annulé", color: "bg-red-100 text-red-800" },
  TERMINE: { label: "Terminé", color: "bg-blue-100 text-blue-800" }
};

const TYPES_RENDEZ_VOUS = {
  VISITE: { label: "Visite", color: "bg-purple-100 text-purple-800", icon: MapPin },
  VIDEO: { label: "Visio", color: "bg-blue-100 text-blue-800", icon: Video },
  TELEPHONE: { label: "Téléphone", color: "bg-green-100 text-green-800", icon: Phone },
  SIGNATURE: { label: "Signature", color: "bg-orange-100 text-orange-800", icon: Users },
  AUDIT: { label: "Audit", color: "bg-red-100 text-red-800", icon: Users },
  TOURISME: { label: "Tourisme", color: "bg-indigo-100 text-indigo-800", icon: MapPin },
  DEMANDE: { label: "Demande", color: "bg-pink-100 text-pink-800", icon: Users }
};

// Données initiales pour les créneaux récurrents
const creneauxRecurrentsInitiaux = [
  { id: 1, jour: "lundi", debut: "09:00", fin: "12:00", type: "VISITE", actif: true },
  { id: 2, jour: "lundi", debut: "14:00", fin: "18:00", type: "VISITE", actif: true },
  { id: 3, jour: "mardi", debut: "09:00", fin: "12:00", type: "VISITE", actif: true },
  { id: 4, jour: "mardi", debut: "14:00", fin: "18:00", type: "VISITE", actif: true },
  { id: 5, jour: "mercredi", debut: "10:00", fin: "12:00", type: "TELEPHONE", actif: true },
  { id: 6, jour: "jeudi", debut: "09:00", fin: "12:00", type: "VISITE", actif: true },
  { id: 7, jour: "jeudi", debut: "14:00", fin: "18:00", type: "VISITE", actif: true },
  { id: 8, jour: "vendredi", debut: "09:00", fin: "12:00", type: "ADMINISTRATIF", actif: true }
];

// Fonction pour transformer les données de l'API en format de rendez-vous
const transformerDonneesAPI = (apiData) => {
  if (!apiData || !apiData.data || !Array.isArray(apiData.data.events)) {
    console.warn("Données de planning invalides:", apiData);
    return [];
  }

  console.log("Transformation des données API:", apiData.data.events);

  return apiData.data.events
    .filter(event => {
      if (!event.start) {
        console.warn("Événement sans date ignoré:", event);
        return false;
      }
      return true;
    })
    .map((event, index) => {
      // Formater la date correctement
      let dateFormatee;
      let heureDebut = "09:00";
      let heureFin = "10:00";
      
      try {
        const startDate = new Date(event.start);
          dateFormatee = formatDateLocal(startDate);
        // Extraire l'heure du start
        if (event.start.includes('T')) {
          const timePart = event.start.split('T')[1];
          heureDebut = timePart.substring(0, 5); // HH:MM
        }
        
        // Calculer l'heure de fin
        if (event.end && event.end.includes('T')) {
          const endTimePart = event.end.split('T')[1];
          heureFin = endTimePart.substring(0, 5);
        } else {
          // Si pas d'heure de fin, calculer +1h
          const [heures, minutes] = heureDebut.split(':');
          const heureFinNum = parseInt(heures) + 1;
          heureFin = `${heureFinNum.toString().padStart(2, '0')}:${minutes}`;
        }
      } catch (error) {
        console.warn("Erreur format date:", event.start, error);
        dateFormatee = formatDateLocal(new Date());
      }

      // Déterminer le type basé sur le type de l'API
      let type = "DEMANDE";
      let statut = "CONFIRME";
      let couleur = event.backgroundColor || "#8B5CF6";
      let icone = Users;
      
      switch(event.type) {
        case "appointment":
          type = "VISITE";
          couleur = "#3B82F6";
          icone = MapPin;
          break;
        case "tourisme":
          type = "TOURISME";
          couleur = "#6366F1";
          icone = MapPin;
          break;
        case "demande":
          type = "DEMANDE";
          couleur = "#8B5CF6";
          icone = Users;
          break;
        case "demande_artisan":
          type = "AUDIT";
          couleur = "#EF4444";
          icone = Users;
          break;
        default:
          type = "DEMANDE";
          icone = Clock;
      }

      // Créer un titre significatif
      let titre = event.title || "Rendez-vous sans titre";
      if (titre.length > 50) {
        titre = titre.substring(0, 50) + "...";
      }

      const rendezVous = {
        id: event.id || `event_${index}`,
        titre: titre,
        client: event.client || event.createdBy || { 
          nom: event.createdBy?.firstName || "Client", 
          email: event.createdBy?.email || "", 
          telephone: "" 
        },
        bien: event.property || { 
          adresse: event.property?.address || event.property?.adresse || "", 
          reference: "",
          ville: event.property?.city || ""
        },
        date: dateFormatee,
        heureDebut: heureDebut,
        heureFin: heureFin,
        type: type,
        statut: statut,
        agent: event.agent || "Utilisateur",
        notes: event.description || event.notes || "",
        couleur: couleur,
        icone: icone,
        sourceData: event // Garder les données originales
      };

      console.log("Rendez-vous transformé:", rendezVous);
      return rendezVous;
    });
};

// Composant Modal
const Modal = ({ isOpen, onClose, children, title, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className={`bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn ${sizeClasses[size]}`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: '#0A0A0A' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90"
            style={{ color: '#5A6470' }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Composant Modal Détails Rendez-vous (Lecture seule)
const ModalDetailsRendezVous = ({ isOpen, onClose, rendezVous, onEdit, onDelete, onRefresh }) => {
  if (!rendezVous) return null;

  const TypeIcon = rendezVous.icone || TYPES_RENDEZ_VOUS[rendezVous.type]?.icon || Clock;
  const StatutBadge = STATUT_RENDEZ_VOUS[rendezVous.statut];

  const formaterDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    onEdit(rendezVous);
    onClose();
  };

  const handleDelete = async () => {
    if (!rendezVous?.id || rendezVous.id.startsWith('event_')) {
      onDelete(rendezVous.id);
      onClose();
      return;
    }

    try {
      await api.delete(`/planning/${rendezVous.id}`);
      onDelete(rendezVous.id);
      toast.success("Rendez-vous supprimé avec succès");
      
      if (onRefresh) {
        onRefresh();
      }
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du rendez-vous");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails du rendez-vous"
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête avec type et statut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${rendezVous.couleur}20` }}
            >
              <TypeIcon size={24} style={{ color: rendezVous.couleur }} />
            </div>
            <div>
              <h3 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
                {rendezVous.titre}
              </h3>
              <Badge className={`mt-1 ${StatutBadge.color}`}>
                {StatutBadge.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Informations date et heure */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                  {formaterDate(rendezVous.date)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Horaire</div>
                <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                  {rendezVous.heureDebut} - {rendezVous.heureFin}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Informations client */}
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Informations client
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {rendezVous.client.nom ? rendezVous.client.nom.charAt(0).toUpperCase() : 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                  {rendezVous.client.nom || "Non spécifié"}
                </div>
                <div className="text-sm text-gray-500">Client</div>
              </div>
            </div>
            
            {(rendezVous.client.email || rendezVous.client.telephone) && (
              <div className="flex gap-4">
                {rendezVous.client.telephone && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <PhoneCall size={16} />
                    {rendezVous.client.telephone}
                  </Button>
                )}
                {rendezVous.client.email && (
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <MailIcon size={16} />
                    {rendezVous.client.email}
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Informations bien */}
        {rendezVous.bien && rendezVous.bien.adresse && (
          <Card className="p-4">
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home size={20} />
              Informations bien
            </h4>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Navigation size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                  {rendezVous.bien.adresse}
                </div>
                {rendezVous.bien.ville && (
                  <div className="text-sm text-gray-500">{rendezVous.bien.ville}</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Informations supplémentaires */}
        <Card className="p-4">
          <h4 className="text-lg font-semibold mb-3">Informations supplémentaires</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Type de rendez-vous</div>
              <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                {TYPES_RENDEZ_VOUS[rendezVous.type]?.label || rendezVous.type}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Agent assigné</div>
              <div className="font-semibold" style={{ color: '#0A0A0A' }}>
                {rendezVous.agent}
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
       
        
          <div className=" grid place-items-center  ">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} className="mx-auto  w-50 hover:bg-red-400 hover:text-white"
            >
              Fermer
            </Button>
          
          </div>
        </div>
     
    </Modal>
  );
};

// Composant Modal Rendez-vous (Édition)
const ModalRendezVous = ({ isOpen, onClose, rendezVous, onSave, onDelete, onRefresh }) => {
  const [formData, setFormData] = useState({
    titre: "",
    client: { nom: "", email: "", telephone: "" },
    bien: { adresse: "", reference: "", ville: "" },
    date: formatDateLocal(new Date()),
    heureDebut: "10:00",
    heureFin: "11:00",
    type: "VISITE",
    statut: "EN_ATTENTE",
    agent: "Utilisateur",
    notes: "",
    couleur: "#8B5CF6",
    serviceId: 1
  });

  const [enregistrement, setEnregistrement] = useState(false);

  useEffect(() => {
    if (rendezVous) {
      setFormData(rendezVous);
    } else {
      setFormData({
        titre: "",
        client: { nom: "", email: "", telephone: "" },
        bien: { adresse: "", reference: "", ville: "" },
        date: formatDateLocal(new Date()),
        heureDebut: "10:00",
        heureFin: "11:00",
        type: "VISITE",
        statut: "EN_ATTENTE",
        agent: "Utilisateur",
        notes: "",
        couleur: "#8B5CF6",
        serviceId: 1
      });
    }
  }, [rendezVous]);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation des champs requis
  if (!formData.heureDebut) {
    toast.error("L'heure de début est requise");
    return;
  }
  
  if (!formData.date) {
    toast.error("La date est requise");
    return;
  }

  setEnregistrement(true);

  try {
    // Préparer les données pour l'API
    const appointmentData = {
      titre: formData.titre,
      date: formData.date,
      heureDebut: formData.heureDebut, // Assurez-vous que ce champ est envoyé
      heureFin: formData.heureFin,
      type: formData.type,
      statut: formData.statut,
      agent: formData.agent,
      client: formData.client,
      bien: formData.bien,
      notes: formData.notes,
      serviceId: formData.serviceId || 1
    };

    console.log("Données envoyées:", appointmentData); // Pour debug

    if (rendezVous?.id && !rendezVous.id.startsWith('event_')) {
      await api.put(`/planning/${rendezVous.id}`, appointmentData);
      toast.success("Rendez-vous modifié avec succès");
    } else {
      await api.post('/planning', appointmentData);
      toast.success("Rendez-vous créé avec succès");
    }

    onSave({
      ...formData,
      id: rendezVous?.id || Date.now().toString()
    });

    if (onRefresh) {
      onRefresh();
    }

    onClose();
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    
    // Message d'erreur plus détaillé
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        "Erreur lors de la sauvegarde du rendez-vous";
    
    toast.error(errorMessage);
  } finally {
    setEnregistrement(false);
  }
};

  const handleDelete = async () => {
    if (!rendezVous?.id || rendezVous.id.startsWith('event_')) {
      // Ne pas supprimer les événements générés automatiquement
      onDelete(rendezVous.id);
      onClose();
      return;
    }

    try {
      setEnregistrement(true);
      await api.delete(`/planning/${rendezVous.id}`);
      
      onDelete(rendezVous.id);
      toast.success("Rendez-vous supprimé avec succès");
      
      if (onRefresh) {
        onRefresh();
      }
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(error.response?.data?.message || "Erreur lors de la suppression du rendez-vous");
    } finally {
      setEnregistrement(false);
    }
  };

  const couleursDisponibles = [
    "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"
  ];

  const servicesOptions = [
    { id: 1, libelle: "Service Immobilier" },
    { id: 2, libelle: "Service Audit" },
    { id: 3, libelle: "Service Tourisme" },
    { id: 4, libelle: "Service Général" }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={rendezVous ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Titre du rendez-vous *</Label>
              <Input
                required
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                placeholder="Ex: Visite appartement..."
                disabled={enregistrement}
              />
            </div>

            <div>
              <Label className="block mb-2">Date *</Label>
              <Input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                disabled={enregistrement}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2">Heure début *</Label>
                <Input
                  type="time"
                  required
                  value={formData.heureDebut}
                  onChange={(e) =>
                    setFormData({ ...formData, heureDebut: e.target.value })
                  }
                  disabled={enregistrement}
                />
              </div>
              <div>
                <Label className="block mb-2">Heure fin *</Label>
                <Input
                  type="time"
                  required
                  value={formData.heureFin}
                  onChange={(e) =>
                    setFormData({ ...formData, heureFin: e.target.value })
                  }
                  disabled={enregistrement}
                />
              </div>
            </div>

            <div>
              <Label className="block mb-2">Service associé</Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({ ...formData, serviceId: parseInt(e.target.value) })
                }
                disabled={enregistrement}
              >
                {servicesOptions.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.libelle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Type et statut */}
          <div className="space-y-4">
            <div>
              <Label className="block mb-2">Type de rendez-vous</Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                disabled={enregistrement}
              >
                {Object.entries(TYPES_RENDEZ_VOUS).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block mb-2">Statut</Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                disabled={enregistrement}
              >
                {Object.entries(STATUT_RENDEZ_VOUS).map(([key, statut]) => (
                  <option key={key} value={key}>
                    {statut.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block mb-2">Agent</Label>
              <Input
                value={formData.agent}
                onChange={(e) =>
                  setFormData({ ...formData, agent: e.target.value })
                }
                placeholder="Nom de l'agent"
                disabled={enregistrement}
              />
            </div>

            <div>
              <Label className="block mb-2">Couleur</Label>
              <div className="flex gap-2">
                {couleursDisponibles.map((couleur) => (
                  <button
                    key={couleur}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.couleur === couleur
                        ? "border-gray-800"
                        : "border-gray-300"
                    } ${enregistrement ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: couleur }}
                    onClick={() => !enregistrement && setFormData({ ...formData, couleur })}
                    disabled={enregistrement}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Informations client
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Nom du client *"
              required
              value={formData.client.nom}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: { ...formData.client, nom: e.target.value },
                })
              }
              disabled={enregistrement}
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.client.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: { ...formData.client, email: e.target.value },
                })
              }
              disabled={enregistrement}
            />
            <Input
              type="tel"
              placeholder="Téléphone"
              value={formData.client.telephone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  client: { ...formData.client, telephone: e.target.value },
                })
              }
              disabled={enregistrement}
            />
          </div>
        </div>

        {/* Informations bien */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Home size={20} />
            Informations bien
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Adresse du bien"
              value={formData.bien.adresse}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bien: { ...formData.bien, adresse: e.target.value },
                })
              }
              disabled={enregistrement}
            />
            <Input
              placeholder="Ville"
              value={formData.bien.ville}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bien: { ...formData.bien, ville: e.target.value },
                })
              }
              disabled={enregistrement}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="block mb-2">Notes</Label>
          <Textarea
            rows={4}
            placeholder="Notes supplémentaires..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            disabled={enregistrement}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          {rendezVous && (
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 border-red-200 hover:bg-red-50"
              disabled={enregistrement}
            >
              {enregistrement ? (
                <RefreshCw className="mr-2 animate-spin" size={16} />
              ) : (
                <Trash2 className="mr-2" size={16} />
              )}
              {enregistrement ? "Suppression..." : "Supprimer"}
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={enregistrement}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#0052FF", color: "white" }}
              disabled={enregistrement}
            >
              {enregistrement ? (
                <RefreshCw className="mr-2 animate-spin" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              {enregistrement 
                ? "Enregistrement..." 
                : (rendezVous ? "Modifier" : "Créer") + " le rendez-vous"
              }
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// Composant Modal Créneaux
const ModalCreneaux = ({ isOpen, onClose, creneaux, onSaveCreneaux }) => {
  const [creneauxLocaux, setCreneauxLocaux] = useState(creneaux);
  const [nouveauCreneau, setNouveauCreneau] = useState({
    jour: "lundi",
    debut: "09:00",
    fin: "12:00",
    type: "VISITE",
    actif: true
  });

  useEffect(() => {
    setCreneauxLocaux(creneaux);
  }, [creneaux]);

  const joursSemaine = [
    { value: "lundi", label: "Lundi" },
    { value: "mardi", label: "Mardi" },
    { value: "mercredi", label: "Mercredi" },
    { value: "jeudi", label: "Jeudi" },
    { value: "vendredi", label: "Vendredi" },
    { value: "samedi", label: "Samedi" },
    { value: "dimanche", label: "Dimanche" }
  ];

  const ajouterCreneau = () => {
    const creneau = {
      ...nouveauCreneau,
      id: Date.now()
    };
    setCreneauxLocaux([...creneauxLocaux, creneau]);
    setNouveauCreneau({
      jour: "lundi",
      debut: "09:00",
      fin: "12:00",
      type: "VISITE",
      actif: true
    });
  };

  const supprimerCreneau = (id) => {
    setCreneauxLocaux(creneauxLocaux.filter(c => c.id !== id));
  };

  const toggleCreneau = (id) => {
    setCreneauxLocaux(creneauxLocaux.map(c => 
      c.id === id ? { ...c, actif: !c.actif } : c
    ));
  };

  const sauvegarder = () => {
    onSaveCreneaux(creneauxLocaux);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestion des créneaux récurrents" size="lg">
      <div className="space-y-6">
        {/* Ajout nouveau créneau */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Ajouter un créneau récurrent</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              className="p-2 border rounded"
              value={nouveauCreneau.jour}
              onChange={(e) => setNouveauCreneau({ ...nouveauCreneau, jour: e.target.value })}
            >
              {joursSemaine.map(jour => (
                <option key={jour.value} value={jour.value}>{jour.label}</option>
              ))}
            </select>
            
            <Input
              type="time"
              value={nouveauCreneau.debut}
              onChange={(e) => setNouveauCreneau({ ...nouveauCreneau, debut: e.target.value })}
            />
            
            <Input
              type="time"
              value={nouveauCreneau.fin}
              onChange={(e) => setNouveauCreneau({ ...nouveauCreneau, fin: e.target.value })}
            />
            
            <select
              className="p-2 border rounded"
              value={nouveauCreneau.type}
              onChange={(e) => setNouveauCreneau({ ...nouveauCreneau, type: e.target.value })}
            >
              {Object.entries(TYPES_RENDEZ_VOUS).map(([key, type]) => (
                <option key={key} value={key}>{type.label}</option>
              ))}
            </select>
            
            <Button onClick={ajouterCreneau} className="whitespace-nowrap">
              <Plus size={16} className="mr-1" />
              Ajouter
            </Button>
          </div>
        </Card>

        {/* Liste des créneaux */}
        <div className="space-y-3">
          <h3 className="font-semibold">Créneaux configurés</h3>
          {creneauxLocaux.map((creneau) => (
            <div key={creneau.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-4 flex-1">
                <Switch
                  checked={creneau.actif}
                  onCheckedChange={() => toggleCreneau(creneau.id)}
                />
                
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <span className="capitalize font-medium">{creneau.jour}</span>
                  <span>{creneau.debut} - {creneau.fin}</span>
                  <Badge variant="outline">
                    {TYPES_RENDEZ_VOUS[creneau.type]?.label || creneau.type}
                  </Badge>
                  <Badge className={creneau.actif ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {creneau.actif ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => supprimerCreneau(creneau.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={sauvegarder} style={{ backgroundColor: '#0052FF', color: 'white' }}>
            <Save className="mr-2" size={16} />
            Sauvegarder
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Composant principal CalendarPage
const CalendarPage = () => {
  const [vue, setVue] = useState("semaine");
  const [dateCourante, setDateCourante] = useState(new Date());
  const [rendezVous, setRendezVous] = useState([]);
  const [creneauxRecurrents, setCreneauxRecurrents] = useState(creneauxRecurrentsInitiaux);
  const [filtres, setFiltres] = useState({
    statut: "",
    type: "",
    agent: ""
  });
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [showModalRendezVous, setShowModalRendezVous] = useState(false);
  const [showModalCreneaux, setShowModalCreneaux] = useState(false);
  const [rendezVousSelectionne, setRendezVousSelectionne] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
 
  // Charger les rendez-vous depuis l'API
  useEffect(() => {
    chargerRendezVous();
  }, []);

  const chargerRendezVous = async () => {
    try {
      setChargement(true);
      setErreur(null);
      
      console.log("Début du chargement des rendez-vous...");
      const response = await api.get('/planning');
      
      console.log("Réponse API reçue:", response.data);
      
      if (response.data.success) {
        const rendezVousTransformes = transformerDonneesAPI(response.data);
        console.log("Rendez-vous transformés:", rendezVousTransformes);
        setRendezVous(rendezVousTransformes);
        toast.success(`${rendezVousTransformes.length} rendez-vous chargés`);
      } else {
        throw new Error(response.data.message || "Erreur lors du chargement des rendez-vous");
      }
    } catch (error) {
      console.error("Erreur détaillée lors du chargement:", error);
      setErreur(error.response?.data?.message || error.message || "Erreur de chargement des rendez-vous");
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setChargement(false);
    }
  };

  // Génération des jours de la semaine
  const getJoursSemaine = () => {
    const debutSemaine = new Date(dateCourante);
    debutSemaine.setDate(dateCourante.getDate() - dateCourante.getDay() + 1);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(debutSemaine);
      date.setDate(debutSemaine.getDate() + i);
      return date;
    });
  };

  const heuresJournee = Array.from({ length: 13 }, (_, i) => i + 8);

  // Filtrer les rendez-vous
  const rendezVousFiltres = rendezVous.filter(rdv => {
    const matchStatut = !filtres.statut || rdv.statut === filtres.statut;
    const matchType = !filtres.type || rdv.type === filtres.type;
    const matchAgent = !filtres.agent || rdv.agent === filtres.agent;
    
    return matchStatut && matchType && matchAgent;
  });

  // Navigation
  const precedenteSemaine = () => {
    const newDate = new Date(dateCourante);
    newDate.setDate(dateCourante.getDate() - 7);
    setDateCourante(newDate);
  };

  const semaineSuivante = () => {
    const newDate = new Date(dateCourante);
    newDate.setDate(dateCourante.getDate() + 7);
    setDateCourante(newDate);
  };

  const aujourdhui = () => {
    setDateCourante(new Date());
  };

  // Gestion des rendez-vous
  const sauvegarderRendezVous = (rdv) => {
    if (rdv.id && rendezVous.find(r => r.id === rdv.id)) {
      setRendezVous(rendezVous.map(r => r.id === rdv.id ? rdv : r));
    } else {
      setRendezVous([...rendezVous, rdv]);
    }
  };

  const supprimerRendezVous = (id) => {
    setRendezVous(rendezVous.filter(r => r.id !== id));
  };

  const nouveauRendezVous = () => {
    setRendezVousSelectionne(null);
    setShowModalRendezVous(true);
  };

  const ouvrirDetailsRendezVous = (rdv) => {
    setRendezVousSelectionne(rdv);
    setShowModalDetails(true);
  };

  const ouvrirEditionRendezVous = (rdv) => {
    setRendezVousSelectionne(rdv);
    setShowModalRendezVous(true);
  };

  // Gestion des créneaux
  const sauvegarderCreneaux = (nouveauxCreneaux) => {
    setCreneauxRecurrents(nouveauxCreneaux);
    toast.success("Créneaux sauvegardés avec succès");
  };

  // Export/Import
  const exporterCalendrier = () => {
    const data = {
      rendezVous,
      creneauxRecurrents,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier-immobilier-${formatDateLocal(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calendrier exporté avec succès");
  };

  const importerCalendrier = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.rendezVous) setRendezVous(data.rendezVous);
            if (data.creneauxRecurrents) setCreneauxRecurrents(data.creneauxRecurrents);
            toast.success("Calendrier importé avec succès !");
          } catch (error) {
            toast.error("Erreur lors de l'import du fichier");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formaterHeure = (heure) => {
    return heure.toString().padStart(2, '0') + ':00';
  };

  const getRendezVousPourJourHeure = (date, heure) => {
   const dateStr = formatDateLocal(date);

    
    return rendezVousFiltres.filter(rdv => {
      if (rdv.date !== dateStr) return false;
      
      const heureDebutRdv = parseInt(rdv.heureDebut.split(':')[0]);
      return heureDebutRdv === heure;
    });
  };

  const getStyleRendezVous = (rdv) => {
    const debutMinutes = parseInt(rdv.heureDebut.split(':')[0]) * 60 + parseInt(rdv.heureDebut.split(':')[1]);
    const finMinutes = parseInt(rdv.heureFin.split(':')[0]) * 60 + parseInt(rdv.heureFin.split(':')[1]);
    const dureeMinutes = finMinutes - debutMinutes;
    
    return {
      top: `${(debutMinutes - 8 * 60) * 0.8}px`,
      height: `${dureeMinutes * 0.8}px`
    };
  };

  const joursSemaine = getJoursSemaine();

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
          <p>Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="text-red-500 mx-auto mb-4" size={32} />
          <p className="text-red-500 mb-4">{erreur}</p>
          <Button onClick={chargerRendezVous}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <CalendarIcon size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: '#0A0A0A' }}>
                Calendrier & Réservations
              </h1>
              <p className="text-lg" style={{ color: '#5A6470' }}>
                {rendezVous.length} rendez-vous chargés
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={aujourdhui}>
              Aujourd'hui
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={precedenteSemaine}>
                <ChevronLeft size={16} />
              </Button>
              <Button variant="outline" size="icon" onClick={semaineSuivante}>
                <ChevronRight size={16} />
              </Button>
            </div>
            <select 
              className="p-2 border rounded-lg"
              value={vue}
              onChange={(e) => setVue(e.target.value)}
            >
              <option value="semaine">Vue Semaine</option>
              <option value="mois">Vue Mois</option>
            </select>
            <Button
              style={{ backgroundColor: '#0052FF', color: 'white' }}
              onClick={nouveauRendezVous} className="left-5"
            >
              <Plus className="mr-2" size={16} />
              Nouveau rendez-vous
            </Button>
          </div>
        </div>
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {rendezVous.filter(rdv => rdv.statut === 'CONFIRME').length}
                </div>
                <div style={{ color: '#5A6470' }}>Confirmés</div>
              </div>
              <CheckCircle className="text-blue-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {rendezVous.filter(rdv => rdv.statut === 'EN_ATTENTE').length}
                </div>
                <div style={{ color: '#5A6470' }}>En attente</div>
              </div>
              <Clock4 className="text-yellow-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {rendezVous.filter(rdv => rdv.type === 'VISITE').length}
                </div>
                <div style={{ color: '#5A6470' }}>Visites cette semaine</div>
              </div>
              <MapPin className="text-green-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {creneauxRecurrents.filter(c => c.actif).length}
                </div>
                <div style={{ color: '#5A6470' }}>Créneaux actifs</div>
              </div>
              <Settings className="text-purple-600" size={24} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Colonne principale - Calendrier */}
          <div className="xl:col-span-3">
            {/* Calendrier Semaine */}
            {vue === "semaine" && (
              <Card className="p-6">
                {/* En-tête des jours */}
                <div className="grid grid-cols-8 gap-1 mb-4">
                  <div className="p-3"></div>
                  {joursSemaine.map((date, index) => {
                    const estAujourdhui = date.toDateString() === new Date().toDateString();
                    return (
                      <div key={index} className={`p-3 text-center rounded-lg ${
                        estAujourdhui ? 'bg-blue-100 border border-blue-200' : 'bg-gray-50'
                      }`}>
                        <div className="font-semibold capitalize" style={{ color: '#0A0A0A' }}>
                          {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className={`text-lg font-bold ${estAujourdhui ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grille horaire */}
                <div className="relative">
                  {heuresJournee.map(heure => (
                    <div key={heure} className="flex border-t border-gray-200 min-h-16">
                      <div className="w-20 py-2 pr-4 text-right text-sm text-gray-500">
                        {formaterHeure(heure)}
                      </div>
                      
                      {joursSemaine.map((date, jourIndex) => {
                        const rdvs = getRendezVousPourJourHeure(date, heure);
                        return (
                          <div 
                            key={jourIndex} 
                            className="flex-1 min-h-16 border-l border-gray-200 relative"
                          >
                            {rdvs.map((rdv, rdvIndex) => {
                              const TypeIcon = rdv.icone || TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                              const styleRendezVous = getStyleRendezVous(rdv);
                              
                              return (
                                <div
                                  key={rdv.id}
                                  className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs cursor-pointer hover:shadow-lg transition-all duration-200 border border-white border-opacity-30"
                                  style={{
                                    ...styleRendezVous,
                                    backgroundColor: rdv.couleur,
                                    zIndex: 10 + rdvIndex
                                  }}
                                  onClick={() => ouvrirDetailsRendezVous(rdv)}
                                >
                                  <div className="font-semibold truncate mb-1">
                                    {rdv.titre}
                                  </div>
                                  <div className="flex items-center gap-1 opacity-90">
                                    <TypeIcon size={10} />
                                    <span>{rdv.heureDebut}</span>
                                  </div>
                                  <div className="mt-1">
                                    <Badge 
                                      className={`text-xs ${STATUT_RENDEZ_VOUS[rdv.statut].color} border-0`}
                                    >
                                      {STATUT_RENDEZ_VOUS[rdv.statut].label}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Vue Mois */}
            {vue === "mois" && (
              <Card className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
                    {dateCourante.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
                    <div key={jour} className="p-2 text-center font-semibold text-sm" style={{ color: '#5A6470' }}>
                      {jour}
                    </div>
                  ))}
                  
                  {Array.from({ length: 42 }, (_, i) => {
                    // Premier jour du mois courant
                    const premierJourMois = new Date(dateCourante.getFullYear(), dateCourante.getMonth(), 1);
                    // Dernier jour du mois précédent
                    const dernierJourMoisPrecedent = new Date(dateCourante.getFullYear(), dateCourante.getMonth(), 0);
                    
                    // Calculer le premier jour à afficher (lundi de la semaine contenant le 1er du mois)
                    const premierJourAffiche = new Date(premierJourMois);
                    const decalageLundi = premierJourMois.getDay() === 0 ? -6 : 1 - premierJourMois.getDay();
                    premierJourAffiche.setDate(premierJourMois.getDate() + decalageLundi);
                    
                    // Date pour cette cellule
                    const dateCellule = new Date(premierJourAffiche);
                    dateCellule.setDate(premierJourAffiche.getDate() + i);
                    
                    const estCeMois = dateCellule.getMonth() === dateCourante.getMonth();
                    const estAujourdhui = dateCellule.toDateString() === new Date().toDateString();
                   const dateStr = formatDateLocal(dateCellule);
                    const rdvsDuJour = rendezVousFiltres.filter(rdv => rdv.date === dateStr);
                    
                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 border rounded-lg ${
                          estCeMois 
                            ? estAujourdhui 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-white'
                            : 'bg-gray-50 text-gray-400'
                        }`}
                      >
                        <div className={`text-sm font-semibold mb-1 ${
                          estAujourdhui ? 'text-blue-600' : estCeMois ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {dateCellule.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {rdvsDuJour.slice(0, 2).map(rdv => {
                            const TypeIcon = rdv.icone || TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                            return (
                              <div
                                key={rdv.id}
                                className="text-xs p-1 rounded text-white truncate cursor-pointer flex items-center gap-1"
                                style={{ backgroundColor: rdv.couleur }}
                                onClick={() => ouvrirDetailsRendezVous(rdv)}
                              >
                                <TypeIcon size={10} />
                                <span>{rdv.heureDebut} {rdv.titre}</span>
                              </div>
                            );
                          })}
                          
                          {rdvsDuJour.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{rdvsDuJour.length - 2} autres
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Rendez-vous du jour */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0A0A0A' }}>
                <Star size={20} />
                Aujourd'hui
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rendezVousFiltres
                  .filter(rdv => rdv.date === formatDateLocal(new Date()))
                  .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
                  .map(rdv => {
                    const TypeIcon = rdv.icone || TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                    return (
                      <div
                        key={rdv.id}
                        className="p-3 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => ouvrirDetailsRendezVous(rdv)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} className="text-blue-600" />
                            <span className="font-semibold text-sm" style={{ color: '#0A0A0A' }}>
                              {rdv.heureDebut}
                            </span>
                          </div>
                          <Badge className={STATUT_RENDEZ_VOUS[rdv.statut].color}>
                            {STATUT_RENDEZ_VOUS[rdv.statut].label}
                          </Badge>
                        </div>
                        
                        <div className="text-sm font-medium mb-1" style={{ color: '#0A0A0A' }}>
                          {rdv.titre}
                        </div>
                        
                        <div className="text-xs" style={{ color: '#5A6470' }}>
                          {rdv.client.nom}
                        </div>
                      </div>
                    );
                  })}
                
                {rendezVousFiltres.filter(rdv => rdv.date === formatDateLocal(new Date())).length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    Aucun rendez-vous aujourd'hui
                  </div>
                )}
              </div>
            </Card>

            {/* Créneaux récurrents */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: '#0A0A0A' }}>
                  Créneaux récurrents
                </h3>
                <Badge variant="secondary">
                  {creneauxRecurrents.filter(c => c.actif).length} actifs
                </Badge>
              </div>
              
              <div className="space-y-2">
                {creneauxRecurrents.slice(0, 5).map(creneau => (
                  <div key={creneau.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-medium text-sm capitalize" style={{ color: '#0A0A0A' }}>
                        {creneau.jour}
                      </div>
                      <div className="text-xs" style={{ color: '#5A6470' }}>
                        {creneau.debut} - {creneau.fin}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {TYPES_RENDEZ_VOUS[creneau.type]?.label || creneau.type}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => setShowModalCreneaux(true)}
              >
                Gérer les créneaux
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalDetailsRendezVous
        isOpen={showModalDetails}
        onClose={() => {
          setShowModalDetails(false);
          setRendezVousSelectionne(null);
        }}
        rendezVous={rendezVousSelectionne}
        onEdit={ouvrirEditionRendezVous}
        onDelete={supprimerRendezVous}
        onRefresh={chargerRendezVous}
      />

      <ModalRendezVous
        isOpen={showModalRendezVous}
        onClose={() => {
          setShowModalRendezVous(false);
          setRendezVousSelectionne(null);
        }}
        rendezVous={rendezVousSelectionne}
        onSave={sauvegarderRendezVous}
        onDelete={supprimerRendezVous}
        onRefresh={chargerRendezVous}
      />

      <ModalCreneaux
        isOpen={showModalCreneaux}
        onClose={() => setShowModalCreneaux(false)}
        creneaux={creneauxRecurrents}
        onSaveCreneaux={sauvegarderCreneaux}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;