import { useState, useEffect } from "react";
import {
  X,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  Receipt,
  DollarSign,
  ArrowRight,
  BarChart3,
  RefreshCw,
  ClipboardCheck,
  Wrench,
  Zap,
  Palette,
  Home,
  User,
  Mail,
  Phone,
  Map,
  FileText as DescriptionIcon,
  MessageCircle
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Modal de publication d'une demande connecté à la base de données
const ModalDemande = ({ open, onClose, userId, onDemandeCreated }) => {
  const [formData, setFormData] = useState({
    contactNom: '',
    contactPrenom: '',
    contactEmail: '',
    contactTel: '',
    contactAdresse: '',
    contactAdresseCp: '',
    contactAdresseVille: '',
    lieuAdresse: '',
    lieuAdresseCp: '',
    lieuAdresseVille: '',
    optionAssurance: false,
    description: '',
    serviceId: '',
    metierId: '',
    nombreArtisans: 'UNIQUE'
  });
  const [metiers, setMetiers] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMetier, setSelectedMetier] = useState('');

  // Charger les métiers et services au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metiersResponse, servicesResponse] = await Promise.all([
          api.get('/metiers/all'),
          api.get('/services')
        ]);
        setMetiers(metiersResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
    fetchData();
  }, []);

  // Filtrer les services quand un métier est sélectionné
  useEffect(() => {
    if (selectedMetier) {
      const filtered = services.filter(service =>
        service.metiers.some(metier => metier.id === parseInt(selectedMetier))
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [selectedMetier, services]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      formData.metierId = selectedMetier
      await api.post('/demandes', {
        ...formData,
        createdById: userId
      });

      onDemandeCreated();
      onClose();
      // Réinitialiser le formulaire
      setFormData({
        contactNom: "",
        contactPrenom: "",
        contactEmail: "",
        contactTel: "",
        contactAdresse: "",
        contactAdresseCp: "",
        contactAdresseVille: "",
        lieuAdresse: "",
        lieuAdresseCp: "",
        lieuAdresseVille: "",
        optionAssurance: false,
        description: "",
        serviceId: "",
        nombreArtisans: "UNIQUE",
        metierId: "",
      });
      setSelectedMetier('');
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      toast.error("Erreur lors de la création de la demande");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* En-tête du modal */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Publier une demande</h2>
              <p className="text-blue-100 text-sm mt-1">Remplissez les informations de votre projet</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assurance */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Pris en charge par l'assurance
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('optionAssurance', true)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 flex items-center justify-center gap-2 ${formData.optionAssurance
                    ? 'bg-green-50 text-green-700 border-green-300 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('optionAssurance', false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 flex items-center justify-center gap-2 ${!formData.optionAssurance
                    ? 'bg-red-50 text-red-700 border-red-300 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <X className="w-4 h-4" />
                  Non
                </button>
              </div>
            </div>

            {/* Personne à contacter */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Personne à contacter</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={formData.contactNom}
                    onChange={(e) => handleInputChange('contactNom', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nom"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={formData.contactPrenom}
                    onChange={(e) => handleInputChange('contactPrenom', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={formData.contactTel}
                    onChange={(e) => handleInputChange('contactTel', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            {/* Lieu d'intervention */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Lieu de l'intervention</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={formData.lieuAdresse}
                    onChange={(e) => handleInputChange('lieuAdresse', e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse complète"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      value={formData.lieuAdresseCp}
                      onChange={(e) => handleInputChange('lieuAdresseCp', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Code Postal"
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      value={formData.lieuAdresseVille}
                      onChange={(e) => handleInputChange('lieuAdresseVille', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Ville"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Métier */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Type d'artisan recherché
              </label>
              <div className="relative">
                <select
                  value={selectedMetier}
                  onChange={(e) => {
                    setSelectedMetier(e.target.value)
                    console.log(e.target.value)
                  }}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                >
                  <option value="">Sélectionnez un métier</option>
                  {metiers.map(metier => (
                    <option key={metier.id} value={metier.id}>
                      {metier.libelle}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* Service */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Service demandé
              </label>
              <div className="relative">
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleInputChange('serviceId', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                  required
                >
                  <option value="">Sélectionnez un service</option>
                  {filteredServices.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* Nombre d'artisans */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Nombre d'artisans souhaité
              </label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('nombreArtisans', 'UNIQUE')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${formData.nombreArtisans === 'UNIQUE'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  Un seul artisan
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('nombreArtisans', 'MULTIPLE')}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 border-2 ${formData.nombreArtisans === 'MULTIPLE'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-sm'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  Plusieurs artisans
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className=" text-gray-700 font-medium text-sm flex items-center gap-2">
                <DescriptionIcon className="w-4 h-4" />
                Description de la demande
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Décrivez votre projet en détail, les matériaux souhaités, les contraintes particulières..."
                  required
                />
              </div>
              <div className="text-right text-sm text-gray-500">
                {formData.description.length}/500 caractères
              </div>
            </div>
          </form>
        </div>

        {/* Boutons d'action */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {loading ? 'Publication...' : 'Publier la demande'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de carte de demande (inchangé mais adapté aux vraies données)
const DemandeCard = ({ demande, onVoirDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'En cours': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Devis reçus': return 'bg-green-100 text-green-800 border-green-200';
      case 'Terminé': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Urgent': return 'text-red-500';
      case 'Moyen': return 'text-orange-500';
      case 'Faible': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'Urgent': return <AlertCircle className="w-4 h-4" />;
      case 'Moyen': return <Clock className="w-4 h-4" />;
      case 'Faible': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getMetierIcon = (metier) => {
    switch (metier) {
      case 'Plombier': return <Wrench className="w-5 h-5" />;
      case 'Électricien': return <Zap className="w-5 h-5" />;
      case 'Menuisier': return <Home className="w-5 h-5" />;
      case 'Peintre': return <Palette className="w-5 h-5" />;
      default: return <Wrench className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
            {getMetierIcon(demande.metier)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {demande.titre}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
              <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200 w-fit">
                {demande.metier}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{demande.lieu}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status et Urgence */}
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2 self-stretch">
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(demande.statut)}`}>
            {demande.statut}
          </span>
          <span className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${getUrgencyColor(demande.urgence)}`}>
            {getUrgencyIcon(demande.urgence)}
            {demande.urgence}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 bg-white py-3 sm:py-4 px-3 sm:px-4 shadow-sm rounded-md text-sm sm:text-base mb-4 leading-relaxed flex items-start gap-2 sm:gap-3">
  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5" />
  <span className="flex-1 line-clamp-3 sm:line-clamp-4">{demande.description}</span>
</p>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-gray-500 text-xs sm:text-sm w-full sm:w-auto">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            {demande.date}
          </span>
          <span className="flex items-center gap-1">
            <Receipt className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            {demande.devisCount} devis
          </span>
          {demande.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {demande.budget}
            </span>
          )}
        </div>

        {demande.statut !== "En attente" &&
          <Link
            to={`/mon-compte/demandes/messages/${demande.id}`}
            state={{ demande }}
            className="w-full sm:w-auto bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group/btn border border-blue-200 text-sm sm:text-base"
          >
            Voir détails
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        }
      </div>
    </div>
  );
};

// Composant de statistiques
const StatsCard = ({ number, label, color, icon }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const IconComponent = icon;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 group shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
            {number}
          </div>
          <div className="text-gray-600 text-sm mt-1">{label}</div>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white group-hover:scale-110 transition-transform duration-300`}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Page principale Mes demandes
const MesDemande = () => {
  const [open, setOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userId, setUserId] = useState(user.id);
  const filters = [
    { key: "Toutes", label: "Toutes les demandes" },
    { key: "En cours", label: "En cours" },
    { key: "Devis reçus", label: "Devis reçus" },
    { key: "Terminées", label: "Terminées" },
    { key: "En attente", label: "En attente" }
  ];

  // Charger les demandes et statistiques
  const fetchData = async () => {
    try {
      setLoading(true);
      const [demandesResponse, statsResponse] = await Promise.all([
        api.get(`/demandes/user/${userId}`),
        api.get(`/demandes/stats/${userId}`)
      ]);

      setDemandes(demandesResponse.data);

      // Transformer les stats pour l'affichage
      const statsData = statsResponse.data;
      setStats([
        { number: statsData.total.toString(), label: "Total demandes", color: "purple", icon: BarChart3 },
        { number: statsData.enCours.toString(), label: "En cours", color: "blue", icon: RefreshCw },
        { number: statsData.avecDevis.toString(), label: "Devis reçus", color: "green", icon: ClipboardCheck },
        { number: statsData.terminees.toString(), label: "Terminées", color: "orange", icon: CheckCircle }
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    console.log(user)
  }, [userId]);

  const filteredDemandes = activeFilter === "Toutes"
    ? demandes
    : demandes.filter(demande =>
      activeFilter.toLowerCase().includes(demande.statut.toLowerCase())
    );

  const handleDemandeCreated = () => {
    fetchData(); // Recharger les données après création
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <img src="/loading.gif" className="w-32 h-32" alt="" />
          <p className="text-gray-600">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-12 bg-gray-50 p-6">
      {/* Barre d'en-tête améliorée */}
      <div className="flex bg-white p-4 rounded-lg shadow-sm  items-center flex-col md:flex-row justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes demandes
          </h1>
          <p className="text-gray-600 mt-2">Gérez et suivez l'ensemble de vos demandes de travaux</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-slate-900 self-start  mt-4 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Publier une demande
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            number={stat.number}
            label={stat.label}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Filtres améliorés */}
      <div className="grid grid-cols-2 lg:flex gap-2 mb-8 justify-start flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border ${activeFilter === filter.key
              ? "bg-blue-100 text-blue-700 border-blue-300 shadow-md"
              : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-gray-700 hover:bg-gray-50"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* En-tête de liste */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {activeFilter === "Toutes" ? "Toutes vos demandes" : `Demandes ${activeFilter.toLowerCase()}`}
          <span className="text-gray-600 text-sm font-normal ml-2">
            ({filteredDemandes.length} demande{filteredDemandes.length > 1 ? 's' : ''})
          </span>
        </h2>
        <div className="text-gray-500 text-sm hidden lg:flex items-center gap-1">
          <span>Tri: Plus récent</span>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {filteredDemandes.length > 0 ? (
          filteredDemandes.map((demande) => (
            <DemandeCard
              key={demande.id}
              demande={demande}
              onVoirDetails={() => navigate('/mon-compte/demandes/message')}
            />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-gray-300 mb-4">
              <FileText className="w-20 h-20 mx-auto" />
            </div>
            <h4 className="text-gray-700 text-lg font-medium mb-2">
              Aucune demande {activeFilter.toLowerCase()}
            </h4>
            <p className="text-gray-500 text-sm mb-6">
              Publiez votre première demande pour commencer
            </p>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Publier une demande
            </button>
          </div>
        )}
      </div>

      {/* Modal amélioré */}
      <ModalDemande
        open={open}
        onClose={() => setOpen(false)}
        userId={userId}
        onDemandeCreated={handleDemandeCreated}
      />
    </div>
  );
};

export default MesDemande;