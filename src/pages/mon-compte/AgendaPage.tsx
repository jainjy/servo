import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Clock4,
  RefreshCw,
  Star,
  X,
  User,
  Building,
  FileText,
  ShoppingCart,
  Scissors,
  Heart,
  MessageCircle,
  CreditCard,
  Plane,
  Zap,
  Calendar,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";

// Types d'événements basés sur votre base de données
const TYPES_EVENEMENTS = {
  DEMANDE: { label: "Demande", color: "bg-blue-500", icon: FileText },
  DEMANDE_ARTISAN: {
    label: "Demande Artisan",
    color: "bg-orange-500",
    icon: Building,
  },
  RENDEZ_VOUS: {
    label: "Rendez-vous",
    color: "bg-purple-500",
    icon: CalendarIcon,
  },
  DEVIS: { label: "Devis", color: "bg-green-500", icon: CreditCard },
  COMMANDE: { label: "Commande", color: "bg-yellow-500", icon: ShoppingCart },
  FACTURE: { label: "Facture", color: "bg-red-500", icon: FileText },
  RESERVATION: { label: "Réservation", color: "bg-indigo-500", icon: Plane },
  AUDIT: { label: "Audit", color: "bg-gray-500", icon: Scissors },
  BIENETRE: { label: "Bien-être", color: "bg-pink-500", icon: Heart },
  MESSAGE: { label: "Message", color: "bg-cyan-500", icon: MessageCircle },
};

const STATUT_EVENEMENT = {
  CONFIRME: {
    label: "Confirmé",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  EN_ATTENTE: {
    label: "En attente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  ANNULE: { label: "Annulé", color: "bg-red-100 text-red-800 border-red-200" },
  TERMINE: {
    label: "Terminé",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  EN_COURS: {
    label: "En cours",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  BROUILLON: {
    label: "Brouillon",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

// Filtres par type de date
const FILTRES_DATE = {
  TOUT: { label: "Toutes les dates", icon: Calendar },
  AUJOURDHUI: { label: "Aujourd'hui", icon: Zap },
  SEMAINE: { label: "Cette semaine", icon: Calendar },
  MOIS: { label: "Ce mois", icon: CalendarIcon },
  AVENIR: { label: "À venir", icon: Clock },
  PASSE: { label: "Passé", icon: Clock4 },
};

// Composant Popup pour dates multiples
const PopupDateMultiple = ({
  date,
  evenements,
  position,
  onClose,
  onEventClick,
}) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!evenements || evenements.length === 0) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 min-w-80 max-w-sm animate-scaleIn"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, 10px)",
      }}
    >
      {/* Header du popup */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <CalendarIcon className="text-white" size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {new Date(date).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h3>
            <p className="text-sm text-gray-600">
              {evenements.length} événement(s)
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Liste des événements */}
      <div className="max-h-64 overflow-y-auto">
        {evenements.map((evenement, index) => {
          const TypeIcon =
            TYPES_EVENEMENTS[evenement.type]?.icon || CalendarIcon;
          const StatutBadge = STATUT_EVENEMENT[evenement.statut];

          return (
            <div
              key={evenement.id}
              className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                index === evenements.length - 1 ? "border-b-0" : ""
              }`}
              onClick={() => onEventClick(evenement)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: evenement.couleur }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {evenement.titre}
                    </p>
                    {evenement.heureDebut && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {evenement.heureDebut}
                      </span>
                    )}
                  </div>
                  
                  {/* NOM DE L'UTILISATEUR BIEN VISIBLE */}
                  {evenement.client?.nom && (
                    <div className="flex items-center gap-2 mb-2 p-1 bg-blue-50 rounded-md border border-blue-100">
                      <User size={12} className="text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-blue-700 truncate">
                        {evenement.client.nom}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-1">
                    <TypeIcon size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {TYPES_EVENEMENTS[evenement.type]?.label}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      StatutBadge?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {StatutBadge?.label || evenement.statut}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Cliquez sur un événement pour voir les détails
        </p>
      </div>
    </div>
  );
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
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90 text-gray-500"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Composant Modal Détails Événement
const ModalDetailsEvenement = ({ isOpen, onClose, evenement }) => {
  if (!evenement) return null;

  const TypeIcon = TYPES_EVENEMENTS[evenement.type]?.icon || CalendarIcon;
  const StatutBadge = STATUT_EVENEMENT[evenement.statut];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Détails de l'événement"
      size="lg"
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: evenement.couleur }}
            >
              <TypeIcon className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {evenement.titre}
              </h3>
              <Badge
                className={`mt-2 text-sm ${
                  StatutBadge?.color || "bg-gray-100 text-gray-800"
                }`}
              >
                {StatutBadge?.label || evenement.statut}
              </Badge>
            </div>
          </div>
        </div>

        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <Label className="block mb-2 font-semibold text-gray-900">
                Date et heure
              </Label>
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarIcon size={18} className="text-blue-500" />
                <span className="font-medium">
                  {new Date(evenement.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              {evenement.heureDebut && (
                <div className="flex items-center gap-3 text-gray-700 mt-2">
                  <Clock size={18} className="text-green-500" />
                  <span className="font-medium">
                    {evenement.heureDebut}{" "}
                    {evenement.heureFin && `- ${evenement.heureFin}`}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <Label className="block mb-2 font-semibold text-gray-900">
                Type
              </Label>
              <Badge
                className={`text-sm ${TYPES_EVENEMENTS[evenement.type]?.color
                  .replace("bg-", "bg-")
                  .replace("text-", "text-")} text-white border-0`}
                style={{ backgroundColor: evenement.couleur }}
              >
                <TypeIcon size={14} className="mr-1" />
                {TYPES_EVENEMENTS[evenement.type]?.label || evenement.type}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {evenement.client && (
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="block mb-2 font-semibold text-gray-900">
                  Client
                </Label>
                <div className="flex items-center gap-3 mb-2">
                  <User size={18} className="text-purple-500" />
                  <span className="font-medium text-gray-900">
                    {evenement.client.nom}
                  </span>
                </div>
                {evenement.client.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{evenement.client.email}</span>
                  </div>
                )}
                {evenement.client.telephone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                    <Phone size={14} />
                    <span>{evenement.client.telephone}</span>
                  </div>
                )}
              </div>
            )}

            {evenement.lieu && (
              <div className="bg-gray-50 rounded-lg p-4">
                <Label className="block mb-2 font-semibold text-gray-900">
                  Lieu
                </Label>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-red-500" />
                  <span className="text-gray-700">{evenement.lieu}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description et détails */}
        {(evenement.description || evenement.details) && (
          <div className="bg-gray-50 rounded-lg p-4">
            <Label className="block mb-2 font-semibold text-gray-900">
              {evenement.description ? "Description" : "Détails"}
            </Label>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {evenement.description || evenement.details}
            </p>
          </div>
        )}

        {/* Informations spécifiques selon le type */}
        {evenement.montant && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
            <Label className="block mb-2 font-semibold text-gray-900">
              Montant
            </Label>
            <div className="text-2xl font-bold text-green-600">
              {evenement.montant.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </div>
          </div>
        )}

        {/* Métadonnées */}
        {evenement.metadata && Object.keys(evenement.metadata).length > 0 && (
          <div className="border-t pt-6">
            <Label className="block mb-4 font-semibold text-gray-900 text-lg">
              Informations supplémentaires
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(evenement.metadata).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                  </span>
                  <span className="text-gray-900 font-medium">
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-6 border-t">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Composant Événement du Calendrier
const EventItem = ({ evenement, isMobile = false }) => {
  const TypeIcon = TYPES_EVENEMENTS[evenement.type]?.icon || CalendarIcon;

  return (
    <div
      className={`w-full text-white cursor-pointer hover:shadow-lg transition-all duration-200 border-l-4 rounded-lg ${
        isMobile ? 'p-2 mb-1 text-xs' : 'p-2 mb-1 text-sm'
      }`}
      style={{
        backgroundColor: evenement.couleur,
        borderLeftColor: "rgba(255,255,255,0.5)",
        minHeight: isMobile ? '50px' : '70px',
      }}
    >
      {/* Version Bureau - Structure complète */}
      {!isMobile && (
        <>
          <div className="font-semibold truncate mb-1 leading-tight">
            {evenement.titre}
          </div>
          <div className="flex items-center gap-1 text-xs opacity-90 mb-1">
            <TypeIcon size={12} />
            <span>{evenement.heureDebut}</span>
          </div>
          {/* NOM DU CLIENT BIEN VISIBLE - BUREAU */}
          {evenement.client?.nom && (
            <div className="flex items-center gap-1 text-xs font-semibold bg-white/20 rounded px-1 py-0.5 mt-1">
              <User size={10} />
              <span className="truncate">{evenement.client.nom}</span>
            </div>
          )}
        </>
      )}
      
      {/* Version Mobile - Structure simplifiée */}
      {isMobile && (
        <>
          <div className="font-semibold truncate mb-1 leading-tight text-[10px]">
            {evenement.titre}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] opacity-90">
              <TypeIcon size={10} />
              <span>{evenement.heureDebut}</span>
            </div>
            {/* NOM DU CLIENT BIEN VISIBLE - MOBILE */}
            {evenement.client?.nom && (
              <div className="flex items-center gap-1 text-[10px] font-semibold bg-white/20 rounded px-1">
                <User size={8} />
                <span className="truncate max-w-[60px]">{evenement.client.nom}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const AgendaPage = () => {
  const [vue, setVue] = useState("semaine");
  const [dateCourante, setDateCourante] = useState(new Date());
  const [evenements, setEvenements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    type: "",
    statut: "",
    dateDebut: "",
    dateFin: "",
    filtreDate: "TOUT",
  });
  const [showModalDetails, setShowModalDetails] = useState(false);
  const [evenementSelectionne, setEvenementSelectionne] = useState(null);
  const [popupDate, setPopupDate] = useState({
    visible: false,
    date: null,
    evenements: [],
    position: { x: 0, y: 0 },
  });
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);

  // Charger les événements depuis l'API
  const chargerEvenements = async () => {
    try {
      setChargement(true);
      const response = await api.get("/agenda/evenements");

      if (response.data) {
        const data = await response.data;
        setEvenements(data.evenements || []);
      } else {
        toast.error("Erreur lors du chargement des événements");
        setEvenements(genererDonneesDemonstration());
      }
    } catch (error) {
      console.error("Erreur chargement événements:", error);
      toast.error("Erreur de connexion");
      setEvenements(genererDonneesDemonstration());
    } finally {
      setChargement(false);
    }
  };

  // Générer des données de démonstration
  const genererDonneesDemonstration = () => {
    const aujourdhui = new Date();
    const evenementsDemo = [];

    // Créer plusieurs événements pour certaines dates
    const datesAvecMultiples = [
      new Date(aujourdhui),
      new Date(aujourdhui.getTime() + 2 * 24 * 60 * 60 * 1000),
      new Date(aujourdhui.getTime() + 5 * 24 * 60 * 60 * 1000),
    ];

    datesAvecMultiples.forEach((date, dateIndex) => {
      // 3-5 événements pour ces dates
      const nbEvenements = 3 + Math.floor(Math.random() * 3);

      for (let i = 0; i < nbEvenements; i++) {
        const types = Object.keys(TYPES_EVENEMENTS);
        const type = types[Math.floor(Math.random() * types.length)];
        const TypeIcon = TYPES_EVENEMENTS[type].icon;

        evenementsDemo.push({
          id: `event-${dateIndex}-${i}`,
          titre: `${TYPES_EVENEMENTS[type].label} ${dateIndex + 1}-${i + 1}`,
          type: type,
          statut:
            Object.keys(STATUT_EVENEMENT)[
              Math.floor(Math.random() * Object.keys(STATUT_EVENEMENT).length)
            ],
          date: date.toISOString().split("T")[0],
          heureDebut: `${8 + Math.floor(Math.random() * 10)}:${
            Math.random() > 0.5 ? "00" : "30"
          }`,
          heureFin: `${9 + Math.floor(Math.random() * 10)}:${
            Math.random() > 0.5 ? "00" : "30"
          }`,
          description: `Description de l'événement ${dateIndex + 1}-${i + 1}`,
          client: {
            nom: `Client ${dateIndex + 1}-${i + 1}`,
            email: `client${dateIndex + 1}${i + 1}@email.com`,
            telephone: `01 23 45 67 ${dateIndex}${i}`,
          },
          couleur: TYPES_EVENEMENTS[type].color
            .replace("bg-", "#")
            .replace("-500", ""),
          metadata: {
            priorite: Math.random() > 0.5 ? "Haute" : "Normale",
            duree: "1h",
            participants: 2 + Math.floor(Math.random() * 5),
          },
        });
      }
    });

    return evenementsDemo;
  };

  useEffect(() => {
    chargerEvenements();
  }, []);

  // Gestion du popup de date multiple
  const ouvrirPopupDate = (date, evenements, position) => {
    setPopupDate({
      visible: true,
      date,
      evenements,
      position,
    });
  };

  const fermerPopupDate = () => {
    setPopupDate({
      visible: false,
      date: null,
      evenements: [],
      position: { x: 0, y: 0 },
    });
  };

  // Filtrer les événements selon les critères de date
  const filtrerParDate = (evenements) => {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    switch (filtres.filtreDate) {
      case "AUJOURDHUI":
        return evenements.filter(
          (e) => e.date === aujourdhui.toISOString().split("T")[0]
        );

      case "SEMAINE":
        const debutSemaine = new Date(aujourdhui);
        debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay() + 1);
        const finSemaine = new Date(debutSemaine);
        finSemaine.setDate(debutSemaine.getDate() + 6);
        return evenements.filter((e) => {
          const dateEvent = new Date(e.date);
          return dateEvent >= debutSemaine && dateEvent <= finSemaine;
        });

      case "MOIS":
        const debutMois = new Date(
          aujourdhui.getFullYear(),
          aujourdhui.getMonth(),
          1
        );
        const finMois = new Date(
          aujourdhui.getFullYear(),
          aujourdhui.getMonth() + 1,
          0
        );
        return evenements.filter((e) => {
          const dateEvent = new Date(e.date);
          return dateEvent >= debutMois && dateEvent <= finMois;
        });

      case "AVENIR":
        return evenements.filter((e) => new Date(e.date) >= aujourdhui);

      case "PASSE":
        return evenements.filter((e) => new Date(e.date) < aujourdhui);

      default:
        return evenements;
    }
  };

  // Filtrer les événements
  const evenementsFiltres = filtrerParDate(evenements).filter((evenement) => {
    const matchType = !filtres.type || evenement.type === filtres.type;
    const matchStatut = !filtres.statut || evenement.statut === filtres.statut;

    const dateEvenement = new Date(evenement.date);
    const matchDateDebut =
      !filtres.dateDebut || dateEvenement >= new Date(filtres.dateDebut);
    const matchDateFin =
      !filtres.dateFin || dateEvenement <= new Date(filtres.dateFin);

    return matchType && matchStatut && matchDateDebut && matchDateFin;
  });

  // Grouper les événements par date pour le popup
  const evenementsParDate = evenementsFiltres.reduce((acc, evenement) => {
    if (!acc[evenement.date]) {
      acc[evenement.date] = [];
    }
    acc[evenement.date].push(evenement);
    return acc;
  }, {});

  // Navigation
  const precedenteSemaine = () => {
    setDateCourante(new Date(dateCourante.setDate(dateCourante.getDate() - 7)));
  };

  const semaineSuivante = () => {
    setDateCourante(new Date(dateCourante.setDate(dateCourante.getDate() + 7)));
  };

  const aujourdhui = () => {
    setDateCourante(new Date());
  };

  // Gestion des événements
  const ouvrirDetailsEvenement = (evenement) => {
    setEvenementSelectionne(evenement);
    setShowModalDetails(true);
    fermerPopupDate();
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
  const joursSemaine = getJoursSemaine();

  // Statistiques
  const statistiques = {
    total: evenements.length,
    aujourdhui: evenements.filter(
      (e) => e.date === new Date().toISOString().split("T")[0]
    ).length,
    cetteSemaine: evenements.filter((e) => {
      const dateEvent = new Date(e.date);
      const debutSemaine = new Date(dateCourante);
      debutSemaine.setDate(dateCourante.getDate() - dateCourante.getDay() + 1);
      const finSemaine = new Date(debutSemaine);
      finSemaine.setDate(debutSemaine.getDate() + 6);
      return dateEvent >= debutSemaine && dateEvent <= finSemaine;
    }).length,
    enAttente: evenements.filter((e) => e.statut === "EN_ATTENTE").length,
  };

  if (chargement) {
    return <LoadingSpinner text="Chargement de l'agenda" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 lg:mb-0">
            <div className="p-2 sm:p-3 rounded-xl bg-white shadow-lg border border-blue-100">
              <CalendarIcon size={24} className="sm:w-8 sm:h-8 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Agenda Global
              </h1>
              <p className="text-sm sm:text-lg text-gray-600">
                Tous vos événements et rendez-vous en un seul endroit
              </p>
            </div>
          </div>
          
          {/* Menu mobile */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMenuMobileOuvert(!menuMobileOuvert)}
              className="flex items-center gap-2"
            >
              <Menu size={16} />
              Menu
            </Button>
          </div>
        </div>

        {/* Filtres par type de date */}
        <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="sm:w-5 sm:h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                Filtrer par période
              </h3>
            </div>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {Object.entries(FILTRES_DATE).map(([key, filtre]) => {
                const FiltreIcon = filtre.icon;
                const isActive = filtres.filtreDate === key;

                return (
                  <Button
                    key={key}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setFiltres((prev) => ({ ...prev, filtreDate: key }))
                    }
                    className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      isActive
                        ? "bg-blue-500 text-white border-blue-500"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FiltreIcon size={12} className="sm:w-3 sm:h-3" />
                    <span className="hidden xs:inline">{filtre.label}</span>
                    <span className="xs:hidden">
                      {filtre.label.split(' ')[filtre.label.split(' ').length - 1]}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            {
              label: "Total",
              value: statistiques.total,
              color: "blue",
              icon: CalendarIcon,
            },
            {
              label: "Aujourd'hui",
              value: statistiques.aujourdhui,
              color: "green",
              icon: Star,
            },
            {
              label: "Semaine",
              value: statistiques.cetteSemaine,
              color: "purple",
              icon: Clock,
            },
            {
              label: "En attente",
              value: statistiques.enAttente,
              color: "yellow",
              icon: Clock4,
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="p-3 sm:p-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-lg sm:text-2xl font-bold text-${stat.color}-600 mb-1 sm:mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                </div>
                <div
                  className={`p-2 sm:p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}
                >
                  <stat.icon size={18} className="sm:w-6 sm:h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
          {/* Colonne principale - Calendrier */}
          <div className={`xl:col-span-3 ${menuMobileOuvert ? 'hidden lg:block' : 'block'}`}>
            {/* Barre de filtres avancés */}
            <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3 sm:gap-4">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={aujourdhui}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                  >
                    Aujourd'hui
                  </Button>
                  <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg p-1 border border-gray-200">
                    <Button variant="ghost" size="icon" onClick={precedenteSemaine} className="w-8 h-8">
                      <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={semaineSuivante} className="w-8 h-8">
                      <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  <select
                    className="p-2 border border-gray-200 rounded-lg bg-white shadow-sm text-xs sm:text-sm"
                    value={vue}
                    onChange={(e) => setVue(e.target.value)}
                  >
                    <option value="semaine">Vue Semaine</option>
                    <option value="mois">Vue Mois</option>
                    <option value="liste">Vue Liste</option>
                  </select>
                  <Button
                    variant="outline"
                    onClick={chargerEvenements}
                    className="border-green-200 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                  >
                    <RefreshCw size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center pt-4 border-t border-gray-200/50">
                <div className="flex-1 grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                  <select
                    className="p-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white shadow-sm"
                    value={filtres.type}
                    onChange={(e) =>
                      setFiltres({ ...filtres, type: e.target.value })
                    }
                  >
                    <option value="">Tous les types</option>
                    {Object.entries(TYPES_EVENEMENTS).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="p-2 border border-gray-200 rounded-lg text-xs sm:text-sm bg-white shadow-sm"
                    value={filtres.statut}
                    onChange={(e) =>
                      setFiltres({ ...filtres, statut: e.target.value })
                    }
                  >
                    <option value="">Tous les statuts</option>
                    {Object.entries(STATUT_EVENEMENT).map(([key, statut]) => (
                      <option key={key} value={key}>
                        {statut.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="date"
                    placeholder="Date début"
                    className="text-xs sm:text-sm bg-white"
                    value={filtres.dateDebut}
                    onChange={(e) =>
                      setFiltres({ ...filtres, dateDebut: e.target.value })
                    }
                  />

                  <Input
                    type="date"
                    placeholder="Date fin"
                    className="text-xs sm:text-sm bg-white"
                    value={filtres.dateFin}
                    onChange={(e) =>
                      setFiltres({ ...filtres, dateFin: e.target.value })
                    }
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFiltres({
                      type: "",
                      statut: "",
                      dateDebut: "",
                      dateFin: "",
                      filtreDate: "TOUT",
                    })
                  }
                  className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm mt-2 sm:mt-0"
                >
                  <Filter size={14} className="sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </Card>

            {/* Calendrier Semaine - Version Responsive */}
            {vue === "semaine" && (
              <Card className="p-3 sm:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 overflow-x-auto">
                {/* En-tête des jours - Version mobile compacte */}
                <div className="grid grid-cols-8 gap-1 sm:gap-2 mb-4 sm:mb-6 min-w-[800px]">
                  <div className="p-2 sm:p-3"></div>
                  {joursSemaine.map((date, index) => {
                    const estAujourdhui =
                      date.toDateString() === new Date().toDateString();
                    const evenementsDuJour =
                      evenementsParDate[date.toISOString().split("T")[0]] || [];
                    const hasMultipleEvents = evenementsDuJour.length > 1;

                    return (
                      <div
                        key={index}
                        className={`p-2 sm:p-3 sm:p-4 text-center rounded-lg sm:rounded-xl transition-all cursor-pointer ${
                          estAujourdhui
                            ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg transform -translate-y-1"
                            : "bg-white border border-gray-200 hover:shadow-md"
                        } ${hasMultipleEvents ? "ring-1 sm:ring-2 ring-yellow-400" : ""}`}
                        onClick={(e) => {
                          if (hasMultipleEvents) {
                            ouvrirPopupDate(
                              date.toISOString().split("T")[0],
                              evenementsDuJour,
                              { x: e.clientX, y: e.clientY }
                            );
                          }
                        }}
                      >
                        <div
                          className={`font-semibold capitalize mb-1 text-xs sm:text-sm ${
                            estAujourdhui ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {date.toLocaleDateString("fr-FR", {
                            weekday: "short",
                          })}
                        </div>
                        <div
                          className={`text-lg sm:text-2xl font-bold ${
                            estAujourdhui ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                        {hasMultipleEvents && (
                          <div
                            className={`text-xs mt-1 sm:mt-2 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                              estAujourdhui
                                ? "bg-white/20 text-white"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {evenementsDuJour.length}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Grille horaire améliorée et responsive */}
                <div className="relative min-w-[800px]">
                  {heuresJournee.map((heure) => (
                    <div
                      key={heure}
                      className="flex border-t border-gray-200/50"
                    >
                      <div className="w-16 sm:w-20 py-3 sm:py-4 pr-2 sm:pr-4 text-right text-xs sm:text-sm text-gray-500 font-medium">
                        {heure.toString().padStart(2, "0")}:00
                      </div>

                      {joursSemaine.map((date, jourIndex) => {
                        const dateStr = date.toISOString().split("T")[0];
                        const evenementsDuJour = evenementsFiltres.filter(
                          (evenement) =>
                            evenement.date === dateStr &&
                            evenement.heureDebut &&
                            parseInt(evenement.heureDebut.split(":")[0]) ===
                              heure
                        );

                        return (
                          <div
                            key={jourIndex}
                            className="flex-1 min-h-16 sm:min-h-20 border-l border-gray-200/50 relative group"
                          >
                            {evenementsDuJour.map((evenement, eventIndex) => (
                              <div
                                key={evenement.id}
                                className="absolute left-0.5 right-0.5 sm:left-1 sm:right-1"
                                style={{
                                  top: `${eventIndex * (window.innerWidth < 640 ? 55 : 75)}px`,
                                  height: window.innerWidth < 640 ? '50px' : '70px',
                                  zIndex: 10 + eventIndex,
                                }}
                                onClick={() => ouvrirDetailsEvenement(evenement)}
                              >
                                <EventItem 
                                  evenement={evenement} 
                                  isMobile={window.innerWidth < 640}
                                />
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Colonne latérale - Cachée sur mobile quand le menu est fermé */}
          <div className={`space-y-4 sm:space-y-6 ${menuMobileOuvert ? 'block' : 'hidden lg:block'}`}>
            {/* Événements du jour */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900">
                <Star size={18} className="sm:w-5 sm:h-5 text-yellow-500" />
                Aujourd'hui
              </h3>

              <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {evenementsFiltres
                  .filter(
                    (evenement) =>
                      evenement.date === new Date().toISOString().split("T")[0]
                  )
                  .sort((a, b) =>
                    (a.heureDebut || "").localeCompare(b.heureDebut || "")
                  )
                  .map((evenement) => {
                    const TypeIcon =
                      TYPES_EVENEMENTS[evenement.type]?.icon || CalendarIcon;
                    return (
                      <div
                        key={evenement.id}
                        className="p-2 sm:p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:shadow-md transition-all bg-white"
                        onClick={() => ouvrirDetailsEvenement(evenement)}
                      >
                        <div className="flex items-start justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <TypeIcon
                              size={14}
                              className="sm:w-4 sm:h-4"
                              style={{ color: evenement.couleur }}
                            />
                            <span className="font-semibold text-xs sm:text-sm text-gray-900">
                              {evenement.heureDebut || "Toute la journée"}
                            </span>
                          </div>
                          <Badge
                            className={`text-xs ${STATUT_EVENEMENT[evenement.statut]?.color}`}
                          >
                            {STATUT_EVENEMENT[evenement.statut]?.label ||
                              evenement.statut}
                          </Badge>
                        </div>

                        <div className="text-xs sm:text-sm font-medium mb-1 text-gray-900">
                          {evenement.titre}
                        </div>

                        {/* NOM DU CLIENT BIEN VISIBLE DANS LA COLONNE LATÉRALE */}
                        {evenement.client?.nom && (
                          <div className="flex items-center gap-2 mb-1 p-1 bg-blue-50 rounded border border-blue-100">
                            <User size={12} className="text-blue-600 flex-shrink-0" />
                            <span className="text-xs font-semibold text-blue-700">
                              {evenement.client.nom}
                            </span>
                          </div>
                        )}

                        <div className="text-xs text-gray-600">
                          {TYPES_EVENEMENTS[evenement.type]?.label ||
                            evenement.type}
                        </div>
                      </div>
                    );
                  })}

                {evenementsFiltres.filter(
                  (evenement) =>
                    evenement.date === new Date().toISOString().split("T")[0]
                ).length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <CalendarIcon
                      size={24}
                      className="sm:w-8 sm:h-8 mx-auto mb-2 text-gray-300"
                    />
                    <p className="text-sm sm:text-base">Aucun événement aujourd'hui</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Types d'événements */}
            <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border border-gray-200/50">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">
                Types d'événements
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {Object.entries(TYPES_EVENEMENTS).map(([key, type]) => {
                  const count = evenements.filter((e) => e.type === key).length;
                  const isActive = filtres.type === key;

                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-all ${
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() =>
                        setFiltres((prev) => ({
                          ...prev,
                          type: isActive ? "" : key,
                        }))
                      }
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{
                            backgroundColor: type.color
                              .replace("bg-", "#")
                              .replace("-500", ""),
                          }}
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          {type.label}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${isActive ? "bg-blue-500 text-white" : ""}`}
                      >
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Popup pour dates multiples */}
      {popupDate.visible && (
        <PopupDateMultiple
          date={popupDate.date}
          evenements={popupDate.evenements}
          position={popupDate.position}
          onClose={fermerPopupDate}
          onEventClick={ouvrirDetailsEvenement}
        />
      )}

      {/* Modal Détails */}
      <ModalDetailsEvenement
        isOpen={showModalDetails}
        onClose={() => {
          setShowModalDetails(false);
          setEvenementSelectionne(null);
        }}
        evenement={evenementSelectionne}
      />

      <style>{`
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
            transform: scale(0.8) translate(-50%, -50%);
            opacity: 0;
          }
          to {
            transform: scale(1) translate(-50%, 10px);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AgendaPage;