"use client";

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
  Trash2
} from "lucide-react";
import { toast } from "sonner";

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
  SIGNATURE: { label: "Signature", color: "bg-orange-100 text-orange-800", icon: Users }
};

// Données initiales
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

const rendezVousInitiaux = [
  {
    id: 1,
    titre: "Visite appartement - Rue de Paris",
    client: { nom: "Marie Martin", email: "marie.martin@email.com", telephone: "01 23 45 67 89" },
    bien: { adresse: "123 Rue de Paris, 75001 Paris", reference: "APT-2024-001" },
    date: new Date().toISOString().split('T')[0],
    heureDebut: "10:00",
    heureFin: "11:00",
    type: "VISITE",
    statut: "CONFIRME",
    agent: "Pierre Dubois",
    notes: "Client intéressé par le quartier, prévoir documentation transports",
    couleur: "#8B5CF6"
  }
];

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

// Composant Modal Rendez-vous
const ModalRendezVous = ({ isOpen, onClose, rendezVous, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    titre: "",
    client: { nom: "", email: "", telephone: "" },
    bien: { adresse: "", reference: "" },
    date: new Date().toISOString().split('T')[0],
    heureDebut: "10:00",
    heureFin: "11:00",
    type: "VISITE",
    statut: "EN_ATTENTE",
    agent: "Pierre Dubois",
    notes: "",
    couleur: "#8B5CF6"
  });

  useEffect(() => {
    if (rendezVous) {
      setFormData(rendezVous);
    } else {
      setFormData({
        titre: "",
        client: { nom: "", email: "", telephone: "" },
        bien: { adresse: "", reference: "" },
        date: new Date().toISOString().split('T')[0],
        heureDebut: "10:00",
        heureFin: "11:00",
        type: "VISITE",
        statut: "EN_ATTENTE",
        agent: "Pierre Dubois",
        notes: "",
        couleur: "#8B5CF6"
      });
    }
  }, [rendezVous]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: rendezVous?.id || Date.now()
    });
    onClose();
  };

  const couleursDisponibles = [
    "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"
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
                />
              </div>
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
              <select
                className="w-full p-3 border rounded-lg"
                value={formData.agent}
                onChange={(e) =>
                  setFormData({ ...formData, agent: e.target.value })
                }
              >
                <option value="Pierre Dubois">Pierre Dubois</option>
                <option value="Sophie Lambert">Sophie Lambert</option>
              </select>
            </div>

            <div>
              <Label className="block mb-2">Couleur</Label>
              <div className="flex gap-2">
                {couleursDisponibles.map((couleur) => (
                  <button
                    key={couleur}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 ${formData.couleur === couleur
                        ? "border-gray-800"
                        : "border-gray-300"
                      }`}
                    style={{ backgroundColor: couleur }}
                    onClick={() => setFormData({ ...formData, couleur })}
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
            />
            <Input
              placeholder="Référence bien"
              value={formData.bien.reference}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bien: { ...formData.bien, reference: e.target.value },
                })
              }
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
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t">
          {rendezVous && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onDelete(rendezVous.id);
                onClose();
              }}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="mr-2" size={16} />
              Supprimer
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#0052FF", color: "white" }}
            >
              <Save className="mr-2" size={16} />
              {rendezVous ? "Modifier" : "Créer"} le rendez-vous
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

const CalendarPage = () => {
  const [vue, setVue] = useState("semaine");
  const [dateCourante, setDateCourante] = useState(new Date());
  const [rendezVous, setRendezVous] = useState(rendezVousInitiaux);
  const [creneauxRecurrents, setCreneauxRecurrents] = useState(creneauxRecurrentsInitiaux);
  const [filtres, setFiltres] = useState({
    statut: "",
    type: "",
    agent: ""
  });
  const [showModalRendezVous, setShowModalRendezVous] = useState(false);
  const [showModalCreneaux, setShowModalCreneaux] = useState(false);
  const [rendezVousSelectionne, setRendezVousSelectionne] = useState(null);
  const [synchronisation, setSynchronisation] = useState({
    google: true,
    outlook: false
  });

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
    setDateCourante(new Date(dateCourante.setDate(dateCourante.getDate() - 7)));
  };

  const semaineSuivante = () => {
    setDateCourante(new Date(dateCourante.setDate(dateCourante.getDate() + 7)));
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

  // Gestion des créneaux
  const sauvegarderCreneaux = (nouveauxCreneaux) => {
    setCreneauxRecurrents(nouveauxCreneaux);
  };

  // Synchronisation calendrier
  const toggleSynchronisation = (calendrier) => {
    setSynchronisation(prev => ({
      ...prev,
      [calendrier]: !prev[calendrier]
    }));
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
    a.download = `calendrier-immobilier-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
            toast.info("Calendrier importé avec succès !");
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
    const dateStr = date.toISOString().split('T')[0];
    const heureStr = formaterHeure(heure);

    return rendezVousFiltres.filter(rdv =>
      rdv.date === dateStr &&
      parseInt(rdv.heureDebut.split(':')[0]) === heure
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-1 lg:px-4 py-0 lg:py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <CalendarIcon size={32} />
            </div>
            <div>
              <h1 className="text-xl lg:text-4xl font-bold" style={{ color: '#0A0A0A' }}>
                Calendrier & Réservations
              </h1>
              <p className="text-sm lg:text-lg" style={{ color: '#5A6470' }}>
                Gérez vos rendez-vous et disponibilités
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:flex flex-wrap gap-3">
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
              onClick={nouveauRendezVous}
            >
              <Plus className="lg:block md:block hidden mr-2" size={16} />
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
            {/* Barre de filtres - Responsive */}
            <Card className="p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex-1 w-full md:w-auto">
                  <div className="grid grid-cols-1 md:flex md:flex-wrap gap-3 md:gap-4">
                    <select
                      className="w-full md:w-auto p-3 border rounded-lg text-sm md:text-base bg-white flex-1 md:flex-none"
                      value={filtres.statut}
                      onChange={(e) => setFiltres({ ...filtres, statut: e.target.value })}
                    >
                      <option value="">Tous les statuts</option>
                      {Object.entries(STATUT_RENDEZ_VOUS).map(([key, statut]) => (
                        <option key={key} value={key}>{statut.label}</option>
                      ))}
                    </select>

                    <select
                      className="w-full md:w-auto p-3 border rounded-lg text-sm md:text-base bg-white flex-1 md:flex-none"
                      value={filtres.type}
                      onChange={(e) => setFiltres({ ...filtres, type: e.target.value })}
                    >
                      <option value="">Tous les types</option>
                      {Object.entries(TYPES_RENDEZ_VOUS).map(([key, type]) => (
                        <option key={key} value={key}>{type.label}</option>
                      ))}
                    </select>

                    <select
                      className="w-full md:w-auto p-3 border rounded-lg text-sm md:text-base bg-white flex-1 md:flex-none"
                      value={filtres.agent}
                      onChange={(e) => setFiltres({ ...filtres, agent: e.target.value })}
                    >
                      <option value="">Tous les agents</option>
                      <option value="Pierre Dubois">Pierre Dubois</option>
                      <option value="Sophie Lambert">Sophie Lambert</option>
                    </select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2 w-full md:w-auto justify-between md:justify-start">
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={exporterCalendrier}>
                    <Download size={16} />
                    <span className="hidden md:inline ml-2">Exporter</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 md:flex-none" onClick={importerCalendrier}>
                    <Upload size={16} />
                    <span className="hidden md:inline ml-2">Importer</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                    onClick={() => setShowModalCreneaux(true)}
                  >
                    <Settings size={16} />
                    <span className="hidden md:inline ml-2">Créneaux</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Calendrier Semaine - Responsive */}
            {vue === "semaine" && (
              <Card className="p-4 md:p-6">
                {/* En-tête des jours */}
                <div className="hidden md:grid md:grid-cols-8 gap-1 mb-4">
                  <div className="p-3"></div>
                  {joursSemaine.map((date, index) => {
                    const estAujourdhui = date.toDateString() === new Date().toDateString();
                    return (
                      <div key={index} className={`p-3 text-center rounded-lg ${estAujourdhui ? 'bg-blue-100 border border-blue-200' : 'bg-gray-50'
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

                {/* Version mobile - Header scrollable */}
                <div className="md:hidden flex mb-4 overflow-x-auto pb-2 -mx-4 px-4">
                  {joursSemaine.map((date, index) => {
                    const estAujourdhui = date.toDateString() === new Date().toDateString();
                    return (
                      <div
                        key={index}
                        className={`flex-shrink-0 w-16 p-2 text-center rounded-lg mx-1 ${estAujourdhui ? 'bg-blue-100 border border-blue-200' : 'bg-gray-50'
                          }`}
                      >
                        <div className="font-semibold text-xs" style={{ color: '#0A0A0A' }}>
                          {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className={`text-sm font-bold ${estAujourdhui ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Grille horaire Desktop */}
                <div className="hidden md:block relative">
                  {heuresJournee.map(heure => (
                    <div key={heure} className="flex border-t border-gray-200">
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
                              const TypeIcon = TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                              return (
                                <div
                                  key={rdv.id}
                                  className="absolute left-1 right-1 rounded-lg p-2 text-white text-xs cursor-pointer hover:shadow-md transition-all duration-200"
                                  style={{
                                    ...getStyleRendezVous(rdv),
                                    backgroundColor: rdv.couleur,
                                    zIndex: 10 + rdvIndex
                                  }}
                                  onClick={() => {
                                    setRendezVousSelectionne(rdv);
                                    setShowModalRendezVous(true);
                                  }}
                                >
                                  <div className="font-semibold truncate">
                                    {rdv.titre}
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <TypeIcon size={10} />
                                    <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Badge
                                      className={`text-xs ${STATUT_RENDEZ_VOUS[rdv.statut].color
                                        }`}
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

                {/* Grille horaire Mobile */}
                <div className="md:hidden space-y-3">
                  {heuresJournee.map(heure => (
                    <div key={heure} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="text-sm font-medium text-gray-700 mb-3 border-b pb-2">
                        {formaterHeure(heure)}
                      </div>

                      <div className="space-y-2">
                        {joursSemaine.map((date, jourIndex) => {
                          const rdvs = getRendezVousPourJourHeure(date, heure);
                          return rdvs.map((rdv, rdvIndex) => {
                            const TypeIcon = TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                            const jourNom = date.toLocaleDateString('fr-FR', { weekday: 'short' });
                            const jourNum = date.getDate();

                            return (
                              <div
                                key={rdv.id}
                                className="rounded-lg p-3 text-white text-sm cursor-pointer hover:shadow-md transition-all duration-200"
                                style={{
                                  backgroundColor: rdv.couleur,
                                }}
                                onClick={() => {
                                  setRendezVousSelectionne(rdv);
                                  setShowModalRendezVous(true);
                                }}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="font-semibold flex-1">
                                    {rdv.titre}
                                  </div>
                                  <div className="text-xs opacity-90 bg-black/20 px-2 py-1 rounded">
                                    {jourNum} {jourNom}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs opacity-90">
                                  <TypeIcon size={12} />
                                  <span>{rdv.heureDebut} - {rdv.heureFin}</span>
                                </div>
                                <div className="mt-2">
                                  <Badge
                                    className={`text-xs ${STATUT_RENDEZ_VOUS[rdv.statut].color
                                      }`}
                                  >
                                    {STATUT_RENDEZ_VOUS[rdv.statut].label}
                                  </Badge>
                                </div>
                              </div>
                            );
                          });
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Vue Mois - Responsive */}
            {vue === "mois" && (
              <Card className="p-4 md:p-6">
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: '#0A0A0A' }}>
                    {dateCourante.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>

                {/* Grille mois Desktop */}
                <div className="hidden md:grid md:grid-cols-7 gap-1">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
                    <div key={jour} className="p-2 text-center font-semibold text-sm" style={{ color: '#5A6470' }}>
                      {jour}
                    </div>
                  ))}

                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(dateCourante.getFullYear(), dateCourante.getMonth(), 1);
                    date.setDate(i - date.getDay() + 2);

                    const estCeMois = date.getMonth() === dateCourante.getMonth();
                    const estAujourdhui = date.toDateString() === new Date().toDateString();
                    const rdvsDuJour = rendezVousFiltres.filter(rdv =>
                      rdv.date === date.toISOString().split('T')[0]
                    );

                    return (
                      <div
                        key={i}
                        className={`min-h-24 p-2 border rounded-lg ${estCeMois
                            ? estAujourdhui
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white'
                            : 'bg-gray-50 text-gray-400'
                          }`}
                      >
                        <div className={`text-sm font-semibold mb-1 ${estAujourdhui ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                          {date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {rdvsDuJour.slice(0, 2).map(rdv => (
                            <div
                              key={rdv.id}
                              className="text-xs p-1 rounded text-white truncate"
                              style={{ backgroundColor: rdv.couleur }}
                            >
                              {rdv.heureDebut} {rdv.titre.split(' - ')[0]}
                            </div>
                          ))}

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

                {/* Grille mois Mobile */}
                <div className="md:hidden grid grid-cols-7 gap-1">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(jour => (
                    <div key={jour} className="p-1 text-center font-semibold text-xs" style={{ color: '#5A6470' }}>
                      {jour}
                    </div>
                  ))}

                  {Array.from({ length: 35 }, (_, i) => {
                    const date = new Date(dateCourante.getFullYear(), dateCourante.getMonth(), 1);
                    date.setDate(i - date.getDay() + 2);

                    const estCeMois = date.getMonth() === dateCourante.getMonth();
                    const estAujourdhui = date.toDateString() === new Date().toDateString();
                    const rdvsDuJour = rendezVousFiltres.filter(rdv =>
                      rdv.date === date.toISOString().split('T')[0]
                    );

                    return (
                      <div
                        key={i}
                        className={`min-h-12 p-1 border rounded ${estCeMois
                            ? estAujourdhui
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white'
                            : 'bg-gray-50 text-gray-400'
                          }`}
                      >
                        <div className={`text-xs font-semibold ${estAujourdhui ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                          {date.getDate()}
                        </div>

                        {rdvsDuJour.length > 0 && (
                          <div className="mt-1 flex justify-center">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: rdvsDuJour[0].couleur }}></div>
                          </div>
                        )}
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
                  .filter(rdv => rdv.date === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
                  .map(rdv => {
                    const TypeIcon = TYPES_RENDEZ_VOUS[rdv.type]?.icon || Clock;
                    return (
                      <div
                        key={rdv.id}
                        className="p-3 border rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                        onClick={() => {
                          setRendezVousSelectionne(rdv);
                          setShowModalRendezVous(true);
                        }}
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

                {rendezVousFiltres.filter(rdv => rdv.date === new Date().toISOString().split('T')[0]).length === 0 && (
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

            {/* Intégrations calendrier */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#0A0A0A' }}>
                Synchronisation
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <CalendarIcon size={16} className="text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: '#0A0A0A' }}>Google Calendar</div>
                      <div className="text-xs" style={{ color: '#5A6470' }}>Synchronisé</div>
                    </div>
                  </div>
                  <Switch
                    checked={synchronisation.google}
                    onCheckedChange={() => toggleSynchronisation('google')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <CalendarIcon size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: '#0A0A0A' }}>Outlook</div>
                      <div className="text-xs" style={{ color: '#5A6470' }}>Non connecté</div>
                    </div>
                  </div>
                  <Switch
                    checked={synchronisation.outlook}
                    onCheckedChange={() => toggleSynchronisation('outlook')}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalRendezVous
        isOpen={showModalRendezVous}
        onClose={() => {
          setShowModalRendezVous(false);
          setRendezVousSelectionne(null);
        }}
        rendezVous={rendezVousSelectionne}
        onSave={sauvegarderRendezVous}
        onDelete={supprimerRendezVous}
      />

      <ModalCreneaux
        isOpen={showModalCreneaux}
        onClose={() => setShowModalCreneaux(false)}
        creneaux={creneauxRecurrents}
        onSaveCreneaux={sauvegarderCreneaux}
      />

      <style>{`
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