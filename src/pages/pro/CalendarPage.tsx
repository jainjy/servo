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
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// Nouvelle palette de couleurs
const COLORS = {
  LOGO: "#556B2F",           /* Olive green - accent */
  PRIMARY_DARK: "#6B8E23",   /* Yellow-green - primary */
  LIGHT_BG: "#FFFFFF",       /* White - fond clair */
  SEPARATOR: "#D3D3D3",      /* Light gray - séparateurs */
  SECONDARY_TEXT: "#8B4513", /* Saddle brown - textes secondaires */
  TEXT_BLACK: "#000000",     /* Black - petits textes */
};

const formatDateLocal = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Types de rendez-vous
const STATUT_RENDEZ_VOUS = {
  CONFIRME: { 
    label: "Confirmé", 
    color: "bg-green-100 text-green-800" 
  },
  EN_ATTENTE: { 
    label: "En attente", 
    color: "bg-yellow-100 text-yellow-800" 
  },
  ANNULE: { 
    label: "Annulé", 
    color: "bg-red-100 text-red-800" 
  },
  TERMINE: { 
    label: "Terminé", 
    color: "bg-blue-100 text-blue-800" 
  },
};

const TYPES_RENDEZ_VOUS = {
  VISITE: {
    label: "Visite",
    color: `bg-[${COLORS.LOGO}20] text-[${COLORS.LOGO}]`,
    icon: MapPin,
  },
  VIDEO: { 
    label: "Visio", 
    color: "bg-blue-100 text-blue-800", 
    icon: Video 
  },
  TELEPHONE: {
    label: "Téléphone",
    color: "bg-green-100 text-green-800",
    icon: Phone,
  },
  SIGNATURE: {
    label: "Signature",
    color: "bg-orange-100 text-orange-800",
    icon: Users,
  },
  AUDIT: { 
    label: "Audit", 
    color: "bg-red-100 text-red-800", 
    icon: Users 
  },
  TOURISME: {
    label: "Tourisme",
    color: "bg-indigo-100 text-indigo-800",
    icon: MapPin,
  },
  DEMANDE: {
    label: "Demande",
    color: "bg-pink-100 text-pink-800",
    icon: Users,
  },
};

// Données initiales pour les créneaux récurrents
const creneauxRecurrentsInitiaux = [
  {
    id: 1,
    jour: "lundi",
    debut: "09:00",
    fin: "12:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 2,
    jour: "lundi",
    debut: "14:00",
    fin: "18:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 3,
    jour: "mardi",
    debut: "09:00",
    fin: "12:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 4,
    jour: "mardi",
    debut: "14:00",
    fin: "18:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 5,
    jour: "mercredi",
    debut: "10:00",
    fin: "12:00",
    type: "TELEPHONE",
    actif: true,
  },
  {
    id: 6,
    jour: "jeudi",
    debut: "09:00",
    fin: "12:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 7,
    jour: "jeudi",
    debut: "14:00",
    fin: "18:00",
    type: "VISITE",
    actif: true,
  },
  {
    id: 8,
    jour: "vendredi",
    debut: "09:00",
    fin: "12:00",
    type: "ADMINISTRATIF",
    actif: true,
  },
];

// Fonction pour transformer les données de l'API en format de rendez-vous
const transformerDonneesAPI = (apiData) => {
  if (!apiData || !apiData.data || !Array.isArray(apiData.data.events)) {
    console.warn("Données de planning invalides:", apiData);
    return [];
  }

  // console.log("Transformation des données API:", apiData.data.events);

  return apiData.data.events
    .filter((event) => {
      if (!event.start) {
        console.warn("Événement sans date ignoré:", event);
        return false;
      }
      return true;
    })
    .map((event, index) => {
      let dateFormatee;
      let heureDebut = "09:00";
      let heureFin = "10:00";

      try {
        const startDate = new Date(event.start);
        dateFormatee = formatDateLocal(startDate);
        if (event.start.includes("T")) {
          const timePart = event.start.split("T")[1];
          heureDebut = timePart.substring(0, 5);
        }

        if (event.end && event.end.includes("T")) {
          const endTimePart = event.end.split("T")[1];
          heureFin = endTimePart.substring(0, 5);
        } else {
          const [heures, minutes] = heureDebut.split(":");
          const heureFinNum = parseInt(heures) + 1;
          heureFin = `${heureFinNum.toString().padStart(2, "0")}:${minutes}`;
        }
      } catch (error) {
        console.warn("Erreur format date:", event.start, error);
        dateFormatee = formatDateLocal(new Date());
      }

      let type = "DEMANDE";
      let statut = "CONFIRME";
      let couleur = event.backgroundColor || COLORS.LOGO;
      let icone = Users;

      switch (event.type) {
        case "appointment":
          type = "VISITE";
          couleur = COLORS.PRIMARY_DARK;
          icone = MapPin;
          break;
        case "tourisme":
          type = "TOURISME";
          couleur = "#6366F1";
          icone = MapPin;
          break;
        case "demande":
          type = "DEMANDE";
          couleur = COLORS.LOGO;
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

      let titre = event.title || "Rendez-vous sans titre";
      if (titre.length > 50) {
        titre = titre.substring(0, 50) + "...";
      }

      const rendezVous = {
        id: event.id || `event_${index}`,
        titre: titre,
        client: event.client ||
          event.createdBy || {
            nom: event.createdBy?.firstName || "Client",
            email: event.createdBy?.email || "",
            telephone: "",
          },
        bien: event.property || {
          adresse: event.property?.address || event.property?.adresse || "",
          reference: "",
          ville: event.property?.city || "",
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
        sourceData: event,
      };

      // console.log("Rendez-vous transformé:", rendezVous);
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
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn ${sizeClasses[size]}`}
      >
        <div className="flex justify-between items-center p-6 border-b" 
             style={{ borderColor: COLORS.SEPARATOR }}>
          <h2 className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90"
            style={{ color: COLORS.SECONDARY_TEXT }}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Composant Modal Détails Rendez-vous (Lecture seule)
const ModalDetailsRendezVous = ({
  isOpen,
  onClose,
  rendezVous,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  if (!rendezVous) return null;

  const TypeIcon =
    rendezVous.icone || TYPES_RENDEZ_VOUS[rendezVous.type]?.icon || Clock;
  const StatutBadge = STATUT_RENDEZ_VOUS[rendezVous.statut];

  const formaterDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    onEdit(rendezVous);
    onClose();
  };

  const handleDelete = async () => {
    if (!rendezVous?.id || rendezVous.id.startsWith("event_")) {
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
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression du rendez-vous"
      );
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
              <h3 className="text-xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                {rendezVous.titre}
              </h3>
              <Badge className={`mt-1 ${StatutBadge.color}`}>
                {StatutBadge.label}
              </Badge>
            </div>
          </div>
        </div>

        {/* Informations date et heure */}
        <Card className="p-4" style={{ borderColor: COLORS.SEPARATOR }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" 
                   style={{ 
                     backgroundColor: `${COLORS.LOGO}20`,
                     color: COLORS.LOGO 
                   }}>
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
                  Date
                </div>
                <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                  {formaterDate(rendezVous.date)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" 
                   style={{ 
                     backgroundColor: `${COLORS.PRIMARY_DARK}20`,
                     color: COLORS.PRIMARY_DARK 
                   }}>
                <Clock size={20} />
              </div>
              <div>
                <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
                  Horaire
                </div>
                <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                  {rendezVous.heureDebut} - {rendezVous.heureFin}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Informations client */}
        <Card className="p-4" style={{ borderColor: COLORS.SEPARATOR }}>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" 
              style={{ color: COLORS.PRIMARY_DARK }}>
            <User size={20} />
            Informations client
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {rendezVous.client.nom
                    ? rendezVous.client.nom.charAt(0).toUpperCase()
                    : "C"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                  {rendezVous.client.nom || "Non spécifié"}
                </div>
                <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
                  Client
                </div>
              </div>
            </div>

            {(rendezVous.client.email || rendezVous.client.telephone) && (
              <div className="flex gap-4">
                {rendezVous.client.telephone && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    style={{ 
                      borderColor: COLORS.SEPARATOR,
                      color: COLORS.SECONDARY_TEXT 
                    }}
                  >
                    <PhoneCall size={16} />
                    {rendezVous.client.telephone}
                  </Button>
                )}
                {rendezVous.client.email && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    style={{ 
                      borderColor: COLORS.SEPARATOR,
                      color: COLORS.SECONDARY_TEXT 
                    }}
                  >
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
          <Card className="p-4" style={{ borderColor: COLORS.SEPARATOR }}>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: COLORS.PRIMARY_DARK }}>
              <Home size={20} />
              Informations bien
            </h4>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" 
                   style={{ 
                     backgroundColor: `${COLORS.LOGO}20`,
                     color: COLORS.LOGO 
                   }}>
                <Navigation size={20} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                  {rendezVous.bien.adresse}
                </div>
                {rendezVous.bien.ville && (
                  <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
                    {rendezVous.bien.ville}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Informations supplémentaires */}
        <Card className="p-4" style={{ borderColor: COLORS.SEPARATOR }}>
          <h4 className="text-lg font-semibold mb-3" 
              style={{ color: COLORS.PRIMARY_DARK }}>
            Informations supplémentaires
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div style={{ color: COLORS.SECONDARY_TEXT }}>Type de rendez-vous</div>
              <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                {TYPES_RENDEZ_VOUS[rendezVous.type]?.label || rendezVous.type}
              </div>
            </div>
            <div>
              <div style={{ color: COLORS.SECONDARY_TEXT }}>Agent assigné</div>
              <div className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
                {rendezVous.agent}
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="grid place-items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="mx-auto w-50"
            style={{ 
              borderColor: COLORS.SEPARATOR,
              color: COLORS.SECONDARY_TEXT 
            }}
          >
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Composant Modal Rendez-vous (Édition)
const ModalRendezVous = ({
  isOpen,
  onClose,
  rendezVous,
  onSave,
  onDelete,
  onRefresh,
}) => {
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
    couleur: COLORS.LOGO,
    serviceId: 1,
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
        couleur: COLORS.LOGO,
        serviceId: 1,
      });
    }
  }, [rendezVous]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const appointmentData = {
        titre: formData.titre,
        date: formData.date,
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        type: formData.type,
        statut: formData.statut,
        agent: formData.agent,
        client: formData.client,
        bien: formData.bien,
        notes: formData.notes,
        serviceId: formData.serviceId || 1,
      };

      // console.log("Données envoyées:", appointmentData);

      if (rendezVous?.id && !rendezVous.id.startsWith("event_")) {
        await api.put(`/planning/${rendezVous.id}`, appointmentData);
        toast.success("Rendez-vous modifié avec succès");
      } else {
        await api.post("/planning", appointmentData);
        toast.success("Rendez-vous créé avec succès");
      }

      onSave({
        ...formData,
        id: rendezVous?.id || Date.now().toString(),
      });

      if (onRefresh) {
        onRefresh();
      }

      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de la sauvegarde du rendez-vous";
      toast.error(errorMessage);
    } finally {
      setEnregistrement(false);
    }
  };

  const handleDelete = async () => {
    if (!rendezVous?.id || rendezVous.id.startsWith("event_")) {
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
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de la suppression du rendez-vous"
      );
    } finally {
      setEnregistrement(false);
    }
  };

  const couleursDisponibles = [
    COLORS.LOGO,
    COLORS.PRIMARY_DARK,
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
  ];

  const servicesOptions = [
    { id: 1, libelle: "Service Immobilier" },
    { id: 2, libelle: "Service Audit" },
    { id: 3, libelle: "Service Tourisme" },
    { id: 4, libelle: "Service Général" },
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
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Titre du rendez-vous *
              </Label>
              <Input
                required
                value={formData.titre}
                onChange={(e) =>
                  setFormData({ ...formData, titre: e.target.value })
                }
                placeholder="Ex: Visite appartement..."
                disabled={enregistrement}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.TEXT_BLACK 
                }}
              />
            </div>

            <div>
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Date *
              </Label>
              <Input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                disabled={enregistrement}
                style={{ borderColor: COLORS.SEPARATOR }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  Heure début *
                </Label>
                <Input
                  type="time"
                  required
                  value={formData.heureDebut}
                  onChange={(e) =>
                    setFormData({ ...formData, heureDebut: e.target.value })
                  }
                  disabled={enregistrement}
                  style={{ borderColor: COLORS.SEPARATOR }}
                />
              </div>
              <div>
                <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  Heure fin *
                </Label>
                <Input
                  type="time"
                  required
                  value={formData.heureFin}
                  onChange={(e) =>
                    setFormData({ ...formData, heureFin: e.target.value })
                  }
                  disabled={enregistrement}
                  style={{ borderColor: COLORS.SEPARATOR }}
                />
              </div>
            </div>

            <div>
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Service associé
              </Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.serviceId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    serviceId: parseInt(e.target.value),
                  })
                }
                disabled={enregistrement}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.TEXT_BLACK 
                }}
              >
                {servicesOptions.map((service) => (
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
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Type de rendez-vous
              </Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                disabled={enregistrement}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.TEXT_BLACK 
                }}
              >
                {Object.entries(TYPES_RENDEZ_VOUS).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Statut
              </Label>
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.statut}
                onChange={(e) =>
                  setFormData({ ...formData, statut: e.target.value })
                }
                disabled={enregistrement}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.TEXT_BLACK 
                }}
              >
                {Object.entries(STATUT_RENDEZ_VOUS).map(([key, statut]) => (
                  <option key={key} value={key}>
                    {statut.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Agent
              </Label>
              <Input
                value={formData.agent}
                onChange={(e) =>
                  setFormData({ ...formData, agent: e.target.value })
                }
                placeholder="Nom de l'agent"
                disabled={enregistrement}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.TEXT_BLACK 
                }}
              />
            </div>

            <div>
              <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                Couleur
              </Label>
              <div className="flex gap-2">
                {couleursDisponibles.map((couleur) => (
                  <button
                    key={couleur}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.couleur === couleur
                        ? "border-gray-800"
                        : "border-gray-300"
                    } ${enregistrement ? "opacity-50" : ""}`}
                    style={{ backgroundColor: couleur }}
                    onClick={() =>
                      !enregistrement && setFormData({ ...formData, couleur })
                    }
                    disabled={enregistrement}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="border-t pt-6" style={{ borderColor: COLORS.SEPARATOR }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: COLORS.PRIMARY_DARK }}>
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            />
          </div>
        </div>

        {/* Informations bien */}
        <div className="border-t pt-6" style={{ borderColor: COLORS.SEPARATOR }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: COLORS.PRIMARY_DARK }}>
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="block mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
            Notes
          </Label>
          <Textarea
            rows={4}
            placeholder="Notes supplémentaires..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            disabled={enregistrement}
            style={{ 
              borderColor: COLORS.SEPARATOR,
              color: COLORS.TEXT_BLACK 
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t" style={{ borderColor: COLORS.SEPARATOR }}>
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
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.SECONDARY_TEXT 
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={enregistrement}
              style={{ 
                backgroundColor: COLORS.PRIMARY_DARK,
                color: COLORS.LIGHT_BG 
              }}
            >
              {enregistrement ? (
                <RefreshCw className="mr-2 animate-spin" size={16} />
              ) : (
                <Save className="mr-2" size={16} />
              )}
              {enregistrement
                ? "Enregistrement..."
                : (rendezVous ? "Modifier" : "Créer") + " le rendez-vous"}
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
    actif: true,
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
    { value: "dimanche", label: "Dimanche" },
  ];

  const ajouterCreneau = () => {
    const creneau = {
      ...nouveauCreneau,
      id: Date.now(),
    };
    setCreneauxLocaux([...creneauxLocaux, creneau]);
    setNouveauCreneau({
      jour: "lundi",
      debut: "09:00",
      fin: "12:00",
      type: "VISITE",
      actif: true,
    });
  };

  const supprimerCreneau = (id) => {
    setCreneauxLocaux(creneauxLocaux.filter((c) => c.id !== id));
  };

  const toggleCreneau = (id) => {
    setCreneauxLocaux(
      creneauxLocaux.map((c) => (c.id === id ? { ...c, actif: !c.actif } : c))
    );
  };

  const sauvegarder = () => {
    onSaveCreneaux(creneauxLocaux);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gestion des créneaux récurrents"
      size="lg"
    >
      <div className="space-y-6">
        {/* Ajout nouveau créneau */}
        <Card className="p-4" style={{ borderColor: COLORS.SEPARATOR }}>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
            Ajouter un créneau récurrent
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <select
              className="p-2 border rounded"
              value={nouveauCreneau.jour}
              onChange={(e) =>
                setNouveauCreneau({ ...nouveauCreneau, jour: e.target.value })
              }
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            >
              {joursSemaine.map((jour) => (
                <option key={jour.value} value={jour.value}>
                  {jour.label}
                </option>
              ))}
            </select>

            <Input
              type="time"
              value={nouveauCreneau.debut}
              onChange={(e) =>
                setNouveauCreneau({ ...nouveauCreneau, debut: e.target.value })
              }
              style={{ borderColor: COLORS.SEPARATOR }}
            />

            <Input
              type="time"
              value={nouveauCreneau.fin}
              onChange={(e) =>
                setNouveauCreneau({ ...nouveauCreneau, fin: e.target.value })
              }
              style={{ borderColor: COLORS.SEPARATOR }}
            />

            <select
              className="p-2 border rounded"
              value={nouveauCreneau.type}
              onChange={(e) =>
                setNouveauCreneau({ ...nouveauCreneau, type: e.target.value })
              }
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            >
              {Object.entries(TYPES_RENDEZ_VOUS).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.label}
                </option>
              ))}
            </select>

            <Button 
              onClick={ajouterCreneau} 
              className="whitespace-nowrap"
              style={{ 
                backgroundColor: COLORS.PRIMARY_DARK,
                color: COLORS.LIGHT_BG 
              }}
            >
              <Plus size={16} className="mr-1" />
              Ajouter
            </Button>
          </div>
        </Card>

        {/* Liste des créneaux */}
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: COLORS.PRIMARY_DARK }}>
            Créneaux configurés
          </h3>
          {creneauxLocaux.map((creneau) => (
            <div
              key={creneau.id}
              className="flex items-center justify-between p-3 border rounded-lg"
              style={{ borderColor: COLORS.SEPARATOR }}
            >
              <div className="flex items-center gap-4 flex-1">
                <Switch
                  checked={creneau.actif}
                  onCheckedChange={() => toggleCreneau(creneau.id)}
                />

                <div className="flex-1 grid grid-cols-4 gap-4">
                  <span className="capitalize font-medium" style={{ color: COLORS.PRIMARY_DARK }}>
                    {creneau.jour}
                  </span>
                  <span style={{ color: COLORS.TEXT_BLACK }}>
                    {creneau.debut} - {creneau.fin}
                  </span>
                  <Badge 
                    variant="outline"
                    style={{ 
                      borderColor: COLORS.SEPARATOR,
                      color: COLORS.SECONDARY_TEXT 
                    }}
                  >
                    {TYPES_RENDEZ_VOUS[creneau.type]?.label || creneau.type}
                  </Badge>
                  <Badge
                    className={
                      creneau.actif
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
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
        <div className="flex justify-between pt-6 border-t" style={{ borderColor: COLORS.SEPARATOR }}>
          <Button 
            variant="outline" 
            onClick={onClose}
            style={{ 
              borderColor: COLORS.SEPARATOR,
              color: COLORS.SECONDARY_TEXT 
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={sauvegarder}
            style={{ 
              backgroundColor: COLORS.PRIMARY_DARK,
              color: COLORS.LIGHT_BG 
            }}
          >
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
  const [creneauxRecurrents, setCreneauxRecurrents] = useState(
    creneauxRecurrentsInitiaux
  );
  const [filtres, setFiltres] = useState({
    statut: "",
    type: "",
    agent: "",
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

      // console.log("Début du chargement des rendez-vous...");
      const response = await api.get("/planning");

      // console.log("Réponse API reçue:", response.data);

      if (response.data.success) {
        const rendezVousTransformes = transformerDonneesAPI(response.data);
        // console.log("Rendez-vous transformés:", rendezVousTransformes);
        setRendezVous(rendezVousTransformes);
        toast.success(`${rendezVousTransformes.length} rendez-vous chargés`);
      } else {
        throw new Error(
          response.data.message || "Erreur lors du chargement des rendez-vous"
        );
      }
    } catch (error) {
      console.error("Erreur détaillée lors du chargement:", error);
      setErreur(
        error.response?.data?.message ||
          error.message ||
          "Erreur de chargement des rendez-vous"
      );
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
  const rendezVousFiltres = rendezVous.filter((rdv) => {
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
    if (rdv.id && rendezVous.find((r) => r.id === rdv.id)) {
      setRendezVous(rendezVous.map((r) => (r.id === rdv.id ? rdv : r)));
    } else {
      setRendezVous([...rendezVous, rdv]);
    }
  };

  const supprimerRendezVous = (id) => {
    setRendezVous(rendezVous.filter((r) => r.id !== id));
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
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `calendrier-immobilier-${formatDateLocal(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calendrier exporté avec succès");
  };

  const importerCalendrier = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.rendezVous) setRendezVous(data.rendezVous);
            if (data.creneauxRecurrents)
              setCreneauxRecurrents(data.creneauxRecurrents);
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
    return heure.toString().padStart(2, "0") + ":00";
  };

  const getRendezVousPourJourHeure = (date, heure) => {
    const dateStr = formatDateLocal(date);

    return rendezVousFiltres.filter((rdv) => {
      if (rdv.date !== dateStr) return false;

      const heureDebutRdv = parseInt(rdv.heureDebut.split(":")[0]);
      return heureDebutRdv === heure;
    });
  };

  const getStyleRendezVous = (rdv) => {
    const debutMinutes =
      parseInt(rdv.heureDebut.split(":")[0]) * 60 +
      parseInt(rdv.heureDebut.split(":")[1]);
    const finMinutes =
      parseInt(rdv.heureFin.split(":")[0]) * 60 +
      parseInt(rdv.heureFin.split(":")[1]);
    const dureeMinutes = finMinutes - debutMinutes;

    return {
      top: `${(debutMinutes - 8 * 60) * 0.8}px`,
      height: `${dureeMinutes * 0.8}px`,
    };
  };

  const joursSemaine = getJoursSemaine();

  if (chargement) {
    return <LoadingSpinner text="Chargement des rendez-vous" />;
  }

  if (erreur) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: COLORS.LIGHT_BG }}>
        <div className="text-center">
          <XCircle className="mx-auto mb-4" size={32} style={{ color: "#DC2626" }} />
          <p className="mb-4" style={{ color: "#DC2626" }}>{erreur}</p>
          <Button 
            onClick={chargerRendezVous}
            style={{ 
              backgroundColor: COLORS.PRIMARY_DARK,
              color: COLORS.LIGHT_BG 
            }}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.LIGHT_BG }}>
      <div className="container mx-auto px-4 lg:py-6 py-2">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl" 
                 style={{ 
                   backgroundColor: `${COLORS.PRIMARY_DARK}20`,
                   color: COLORS.PRIMARY_DARK 
                 }}>
              <CalendarIcon size={32} />
            </div>
            <div>
              <h1 className="text-lg lg:text-4xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                Calendrier & Réservations
              </h1>
              <p className="text-lg" style={{ color: COLORS.TEXT_BLACK }}>
                {rendezVous.length} rendez-vous chargés
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={aujourdhui}
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.SECONDARY_TEXT 
              }}
            >
              Aujourd'hui
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={precedenteSemaine}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.SECONDARY_TEXT 
                }}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={semaineSuivante}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.SECONDARY_TEXT 
                }}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            <select
              className="p-2 border rounded-lg"
              value={vue}
              onChange={(e) => setVue(e.target.value)}
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.TEXT_BLACK 
              }}
            >
              <option value="semaine">Vue Semaine</option>
              <option value="mois">Vue Mois</option>
            </select>
            <Button
              style={{ 
                backgroundColor: COLORS.PRIMARY_DARK, 
                color: COLORS.LIGHT_BG 
              }}
              onClick={nouveauRendezVous}
              className="left-5"
            >
              <Plus className="mr-2" size={16} />
              Nouveau rendez-vous
            </Button>
          </div>
        </div>
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  {rendezVous.filter((rdv) => rdv.statut === "CONFIRME").length}
                </div>
                <div style={{ color: COLORS.TEXT_BLACK }}>Confirmés</div>
              </div>
              <CheckCircle size={24} style={{ color: COLORS.PRIMARY_DARK }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: "#D97706" }}>
                  {
                    rendezVous.filter((rdv) => rdv.statut === "EN_ATTENTE")
                      .length
                  }
                </div>
                <div style={{ color: COLORS.TEXT_BLACK }}>En attente</div>
              </div>
              <Clock4 size={24} style={{ color: "#D97706" }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: COLORS.LOGO }}>
                  {rendezVous.filter((rdv) => rdv.type === "VISITE").length}
                </div>
                <div style={{ color: COLORS.TEXT_BLACK }}>Visites cette semaine</div>
              </div>
              <MapPin size={24} style={{ color: COLORS.LOGO }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: COLORS.SECONDARY_TEXT }}>
                  {creneauxRecurrents.filter((c) => c.actif).length}
                </div>
                <div style={{ color: COLORS.TEXT_BLACK }}>Créneaux actifs</div>
              </div>
              <Settings size={24} style={{ color: COLORS.SECONDARY_TEXT }} />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Colonne principale - Calendrier */}
          <div className="xl:col-span-3">
            {/* Calendrier Semaine */}
            {vue === "semaine" && (
              <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
                {/* En-tête des jours */}
                <div className="grid grid-cols-8 gap-1 mb-4">
                  <div className="p-3"></div>
                  {joursSemaine.map((date, index) => {
                    const estAujourdhui =
                      date.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={index}
                        className={`p-3 text-center rounded-lg ${
                          estAujourdhui
                            ? "border"
                            : ""
                        }`}
                        style={{ 
                          backgroundColor: estAujourdhui ? `${COLORS.PRIMARY_DARK}20` : `${COLORS.SEPARATOR}30`,
                          borderColor: estAujourdhui ? COLORS.PRIMARY_DARK : COLORS.SEPARATOR
                        }}
                      >
                        <div
                          className="font-semibold capitalize"
                          style={{ color: COLORS.PRIMARY_DARK }}
                        >
                          {date.toLocaleDateString("fr-FR", {
                            weekday: "short",
                          })}
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            estAujourdhui ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grille horaire */}
                <div className="relative">
                  {heuresJournee.map((heure) => (
                    <div
                      key={heure}
                      className="flex border-t min-h-16"
                      style={{ borderColor: COLORS.SEPARATOR }}
                    >
                      <div className="w-20 py-2 pr-4 text-right text-sm" 
                           style={{ color: COLORS.SECONDARY_TEXT }}>
                        {formaterHeure(heure)}
                      </div>

                      {joursSemaine.map((date, jourIndex) => {
                        const rdvs = getRendezVousPourJourHeure(date, heure);
                        return (
                          <div
                            key={jourIndex}
                            className="flex-1 min-h-16 border-l relative"
                            style={{ borderColor: COLORS.SEPARATOR }}
                          >
                            {rdvs.map((rdv, rdvIndex) => {
                              const TypeIcon =
                                rdv.icone ||
                                TYPES_RENDEZ_VOUS[rdv.type]?.icon ||
                                Clock;
                              const styleRendezVous = getStyleRendezVous(rdv);

                              return (
                                <div
                                  key={rdv.id}
                                  className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs cursor-pointer hover:shadow-lg transition-all duration-200 border border-white border-opacity-30"
                                  style={{
                                    ...styleRendezVous,
                                    backgroundColor: rdv.couleur,
                                    zIndex: 10 + rdvIndex,
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
                                      className={`text-xs ${
                                        STATUT_RENDEZ_VOUS[rdv.statut].color
                                      } border-0`}
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
              <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
                <div className="text-center mb-6">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: COLORS.PRIMARY_DARK }}
                  >
                    {dateCourante.toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                    (jour) => (
                      <div
                        key={jour}
                        className="p-2 text-center font-semibold text-sm"
                        style={{ color: COLORS.SECONDARY_TEXT }}
                      >
                        {jour}
                      </div>
                    )
                  )}

                  {Array.from({ length: 42 }, (_, i) => {
                    const premierJourMois = new Date(
                      dateCourante.getFullYear(),
                      dateCourante.getMonth(),
                      1
                    );
                    const dernierJourMoisPrecedent = new Date(
                      dateCourante.getFullYear(),
                      dateCourante.getMonth(),
                      0
                    );

                    const premierJourAffiche = new Date(premierJourMois);
                    const decalageLundi =
                      premierJourMois.getDay() === 0
                        ? -6
                        : 1 - premierJourMois.getDay();
                    premierJourAffiche.setDate(
                      premierJourMois.getDate() + decalageLundi
                    );

                    const dateCellule = new Date(premierJourAffiche);
                    dateCellule.setDate(premierJourAffiche.getDate() + i);

                    const estCeMois =
                      dateCellule.getMonth() === dateCourante.getMonth();
                    const estAujourdhui =
                      dateCellule.toDateString() === new Date().toDateString();
                    const dateStr = formatDateLocal(dateCellule);
                    const rdvsDuJour = rendezVousFiltres.filter(
                      (rdv) => rdv.date === dateStr
                    );

                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 border rounded-lg ${
                          estCeMois
                            ? estAujourdhui
                              ? "bg-blue-50 border-blue-200"
                              : "bg-white"
                            : "bg-gray-50 text-gray-400"
                        }`}
                        style={{ borderColor: COLORS.SEPARATOR }}
                      >
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            estAujourdhui
                              ? "text-blue-600"
                              : estCeMois
                              ? "text-gray-700"
                              : "text-gray-400"
                          }`}
                        >
                          {dateCellule.getDate()}
                        </div>

                        <div className="space-y-1">
                          {rdvsDuJour.slice(0, 2).map((rdv) => {
                            const TypeIcon =
                              rdv.icone ||
                              TYPES_RENDEZ_VOUS[rdv.type]?.icon ||
                              Clock;
                            return (
                              <div
                                key={rdv.id}
                                className="text-xs p-1 rounded text-white truncate cursor-pointer flex items-center gap-1"
                                style={{ backgroundColor: rdv.couleur }}
                                onClick={() => ouvrirDetailsRendezVous(rdv)}
                              >
                                <TypeIcon size={10} />
                                <span>
                                  {rdv.heureDebut} {rdv.titre}
                                </span>
                              </div>
                            );
                          })}

                          {rdvsDuJour.length > 2 && (
                            <div className="text-xs" style={{ color: COLORS.SECONDARY_TEXT }}>
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
            <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
              <h3
                className="text-xl font-bold mb-4 flex items-center gap-2"
                style={{ color: COLORS.PRIMARY_DARK }}
              >
                <Star size={20} />
                Aujourd'hui
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rendezVousFiltres
                  .filter((rdv) => rdv.date === formatDateLocal(new Date()))
                  .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
                  .map((rdv) => {
                    const TypeIcon =
                      rdv.icone || TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                    return (
                      <div
                        key={rdv.id}
                        className="p-3 border rounded-lg cursor-pointer transition-colors"
                        style={{ 
                          borderColor: COLORS.SEPARATOR,
                          backgroundColor: COLORS.LIGHT_BG
                        }}
                        onClick={() => ouvrirDetailsRendezVous(rdv)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <TypeIcon size={16} style={{ color: COLORS.PRIMARY_DARK }} />
                            <span
                              className="font-semibold text-sm"
                              style={{ color: COLORS.PRIMARY_DARK }}
                            >
                              {rdv.heureDebut}
                            </span>
                          </div>
                          <Badge
                            className={STATUT_RENDEZ_VOUS[rdv.statut].color}
                          >
                            {STATUT_RENDEZ_VOUS[rdv.statut].label}
                          </Badge>
                        </div>

                        <div
                          className="text-sm font-medium mb-1"
                          style={{ color: COLORS.PRIMARY_DARK }}
                        >
                          {rdv.titre}
                        </div>

                        <div className="text-xs" style={{ color: COLORS.TEXT_BLACK }}>
                          {rdv.client.nom}
                        </div>
                      </div>
                    );
                  })}

                {rendezVousFiltres.filter(
                  (rdv) => rdv.date === formatDateLocal(new Date())
                ).length === 0 && (
                  <div className="text-center py-4" style={{ color: COLORS.SECONDARY_TEXT }}>
                    Aucun rendez-vous aujourd'hui
                  </div>
                )}
              </div>
            </Card>

            {/* Créneaux récurrents */}
            <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                  Créneaux récurrents
                </h3>
                <Badge variant="secondary">
                  {creneauxRecurrents.filter((c) => c.actif).length} actifs
                </Badge>
              </div>

              <div className="space-y-2">
                {creneauxRecurrents.slice(0, 5).map((creneau) => (
                  <div
                    key={creneau.id}
                    className="flex items-center justify-between p-2 border rounded"
                    style={{ borderColor: COLORS.SEPARATOR }}
                  >
                    <div>
                      <div
                        className="font-medium text-sm capitalize"
                        style={{ color: COLORS.PRIMARY_DARK }}
                      >
                        {creneau.jour}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.TEXT_BLACK }}>
                        {creneau.debut} - {creneau.fin}
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: COLORS.SEPARATOR,
                        color: COLORS.SECONDARY_TEXT 
                      }}
                    >
                      {TYPES_RENDEZ_VOUS[creneau.type]?.label || creneau.type}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => setShowModalCreneaux(true)}
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  color: COLORS.SECONDARY_TEXT 
                }}
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
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
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