import { useState, useEffect, useMemo } from "react";
import { UserPlus, LogIn } from 'lucide-react';
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import rentProperties1 from "@/assets/propertyLouer-1.jpg";
import rentProperties2 from "@/assets/propertyLouer-2.jpg";
import rentProperties3 from "@/assets/propertyLouer-3.jpeg";
import sellServices1 from "@/assets/propertyVendre-1.jpg";
import sellServices2 from "@/assets/propertyVendre-2.jpeg";
import sellServices3 from "@/assets/propertyVendre-3.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import LocationPickerModal from "@/components/carte";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Ruler,
  Eye,
  X,
  CheckCircle,
  User,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  Calendar,
  FileText,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const styles = {
  section: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  phrase: {
    fontSize: '1.25rem',
    color: '#333',
    marginBottom: '24px',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
    color: '#fff',
  },
};

// Données locales de fallback (garde les images existantes)
const localBuyProperties = [
  {
    id: "1",
    localImage: property1,
    price: 350000,
    title: "Villa avec piscine",
    city: "Saint-Denis",
    surface: 180,
    type: "MAISON / VILLA",
    status: "for_sale",
    rooms: 4,
    features: "4 ch • 3 sdb • Piscine",
  },
  {
    id: "2",
    localImage: property2,
    price: 245000,
    title: "Appartement moderne",
    city: "Saint-Paul",
    surface: 95,
    type: "APPARTEMENT",
    status: "for_sale",
    rooms: 3,
    features: "3 ch • 2 sdb • Balcon",
  },
  {
    id: "3",
    localImage: property3,
    price: 285000,
    title: "Maison contemporaine",
    city: "Saint-Pierre",
    surface: 125,
    type: "MAISON",
    status: "for_sale",
    rooms: 3,
    features: "3 ch • 2 sdb • Jardin",
  },
];

const localRentProperties = [
  {
    id: "4",
    localImage: rentProperties1,
    price: 1250,
    title: "Appartement meublé",
    city: "Saint-Denis",
    surface: 75,
    type: "APPARTEMENT",
    status: "for_rent",
    rooms: 2,
    features: "2 ch • Meublé • Parking",
  },
  {
    id: "5",
    localImage: rentProperties2,
    price: 580,
    title: "Duplex T1 bis 55m² à Saint Gilles les Bains",
    city: "Saint-Gilles-les-Bains",
    surface: 55,
    type: "APPARTEMENT",
    status: "for_rent",
    rooms: 1,
    features: "Location courte durée",
  },
  {
    id: "6",
    localImage: rentProperties3,
    price: 2100,
    title: "Villa de standing",
    city: "Saint-Paul",
    surface: 200,
    type: "VILLA",
    status: "for_rent",
    rooms: 4,
    features: "4 ch • Piscine • Jardin",
  },
];

const localSellServices = [
  {
    id: "7",
    localImage: sellServices1,
    price: 0,
    title: "Évaluez votre bien",
    city: "Toute l'île",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Rapport détaillé • Expert",
  },
  {
    id: "8",
    localImage: sellServices2,
    price: 0,
    title: "Vendez avec SERVO",
    city: "Île de la Réunion",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Accompagnement complet",
  },
  {
    id: "9",
    localImage: sellServices3,
    price: 0,
    title: "Investissement",
    city: "Zones prisées",
    surface: 0,
    type: "SERVICE",
    status: "service",
    rooms: 0,
    features: "Rentabilité garantie",
  },
];

// Utilitaires
const formatPrice = (price: number, _type: string, status: string) => {
  if (status === "service") return "Estimation gratuite";
  if (status === "for_rent") return `${price.toLocaleString('fr-FR')} €/mois`;
  return `${price.toLocaleString('fr-FR')} €`;
};

const normalizeFeatures = (features: any): string[] => {
  if (!features) return [];
  if (Array.isArray(features)) return features as string[];
  return String(features)
    .split(/[•,|]/)
    .map((s) => s.trim())
    .filter(Boolean);
};

const formatFeaturesText = (property: any) => {
  if (property.status === "service") {
    const localService = localSellServices.find((p) => p.id === property.id);
    return localService?.features || "Service professionnel";
  }
  const feats: string[] = [];
  if (property.bedrooms) feats.push(`${property.bedrooms} ch`);
  if (property.bathrooms) feats.push(`${property.bathrooms} sdb`);
  const arr = normalizeFeatures(property.features);
  if (arr.length) feats.push(...arr.slice(0, 2));
  return feats.join(" • ") || "Caractéristiques disponibles";
};

// Fonction pour normaliser les adresses (supprime accents et caractères spéciaux)
const normalizeAddress = (address: string) => {
  if (!address) return '';
  return address
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s]/g, '') // Garde seulement lettres, chiffres et espaces
    .replace(/\s+/g, ' ') // Réduit les espaces multiples
    .trim();
};

// Composant Modal pour la demande de visite
const ModalDemandeVisite = ({
  open,
  onClose,
  property,
  onSuccess,
  isAlreadySent,
}: {
  open: boolean;
  onClose: () => void;
  property: any;
  onSuccess?: (propertyId: string) => void;
  isAlreadySent?: boolean;
}) => {
  const [formData, setFormData] = useState({
    nomPrenom: "",
    email: "",
    telephone: "",
    message: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { user, isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    if (isAlreadySent) {
      toast({ title: "Demande déjà envoyée", description: "Vous avez déjà envoyé une demande pour ce bien." });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({ title: 'Connexion requise', description: 'Veuillez vous connecter pour demander une visite.' });
      return;
    }

    setLoadingSubmit(true);
    try {
      // Récupérer un service pertinent (préférence pour un service lié à l'immobilier/visite)
      const servicesResp = await api.get('/services');
      const services = servicesResp.data || [];

      if (!Array.isArray(services) || services.length === 0) {
        toast({ title: 'Aucun service', description: 'Aucun service disponible sur le serveur. Créez un service ou configurez-en un pour les visites.' });
        setLoadingSubmit(false);
        return;
      }

      // Essayer de trouver un service lié aux visites ou à l'immobilier
      let chosenService = services.find((s: any) => /visite|visiter/i.test(String(s.name || s.libelle || '')));
      if (!chosenService) {
        chosenService = services.find((s: any) => /immobilier|property|bien/i.test(String(s.name || s.libelle || '')));
      }
      if (!chosenService) {
        // fallback: first service
        chosenService = services[0];
      }

      // Ensure backend-required contactPrenom and contactNom are provided
      const nameParts = String(formData.nomPrenom || '').trim().split(/\s+/).filter(Boolean);
      const contactPrenom = nameParts.length > 0 ? nameParts[0] : '';
      const contactNom = nameParts.length > 1 ? nameParts.slice(1).join(' ') : (nameParts[0] || '');

      const payload = {
        // backend expects serviceId and createdById
        serviceId: chosenService.id,
        createdById: user.id,
        propertyId: property?.id,
        contactNom,
        contactPrenom,
        contactEmail: formData.email,
        contactTel: formData.telephone,
        description: `Demande visite pour le bien: ${property?.title || property?.id} (${property?.id}). ${formData.message || ''}`,
        lieuAdresse: property?.address || property?.city || '',
        dateSouhaitee: formData.dateSouhaitee,
        heureSouhaitee: formData.heureSouhaitee,
        // nombreArtisans, optionAssurance etc left as defaults
      };

  await api.post('/immobilier/demandes', payload);

      // Notify parent that a request was sent
      onSuccess?.(String(property.id));

      toast({ title: "Demande envoyée", description: "Votre demande de visite a bien été envoyée." });

      // Réinitialiser le formulaire et fermer le modal
      setFormData({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
      });
      onClose();
    } catch (err: any) {
      console.error('Erreur en envoyant la demande de visite', err);
      toast({ title: "Erreur", description: err?.response?.data?.error || err?.message || 'Impossible d\'envoyer la demande. Réessayez.' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!open) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* En-tête du modal */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-white text-xl font-bold">Demander une visite</h2>
              <p className="text-blue-100 text-sm mt-1">
                Pour le bien : {property?.title}
              </p>
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
            {/* Informations de contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Vos coordonnées</span>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="nomPrenom"
                    value={formData.nomPrenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nom et Prénom"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adresse email"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Téléphone"
                  />
                </div>
              </div>
            </div>

            {/* Date et heure souhaitées */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">Disponibilités</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="dateSouhaitee"
                    type="date"
                    value={formData.dateSouhaitee}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <select
                      id="heureSouhaitee"
                      name="heureSouhaitee"
                      value={formData.heureSouhaitee}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:bg-white"
                    >
                      <option value="">Sélectionnez un créneau</option>
                      <option value="08:00-10:00">Matin : 08h00 - 10h00</option>
                      <option value="10:00-12:00">Matin : 10h00 - 12h00</option>
                      <option value="14:00-16:00">Après-midi : 14h00 - 16h00</option>
                      <option value="16:00-18:00">Après-midi : 16h00 - 18h00</option>
                      <option value="18:00-20:00">Soir : 18h00 - 20h00</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="block text-gray-700 font-medium text-sm">
                Message complémentaire (optionnel)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Précisez vos disponibilités ou toute information complémentaire..."
              />
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
              disabled={loadingSubmit || !!isAlreadySent}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Calendar className="w-4 h-4" />
              {loadingSubmit ? 'Envoi...' : isAlreadySent ? 'Demande déjà envoyée' : 'Demander la visite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

const PropertyListings = (
  { cardsOnly = false, initialTab, maxItems }: { cardsOnly?: boolean; initialTab?: 'tous' | 'achat' | 'location' | 'saisonniere'; maxItems?: number }
) => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);
  const [activeTab, setActiveTab] = useState<'achat' | 'location' | 'saisonniere' | 'tous'>(initialTab ?? 'tous');
  const [radiusKm, setRadiusKm] = useState(5);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [surfaceMin, setSurfaceMin] = useState<number | undefined>(undefined);
  const [surfaceMax, setSurfaceMax] = useState<number | undefined>(undefined);
  const [pieces, setPieces] = useState<number | undefined>(undefined);
  const [chambres, setChambres] = useState<number | undefined>(undefined);
  const [exterieur, setExterieur] = useState<string | undefined>(undefined);
  const [extras, setExtras] = useState<string | undefined>(undefined);
  const [typeBienAchat, setTypeBienAchat] = useState<string | undefined>(undefined);
  const [typeBienLocation, setTypeBienLocation] = useState<string | undefined>(undefined);
  const [typeBienSaison, setTypeBienSaison] = useState<string | undefined>(undefined);
  const [localisation, setLocalisation] = useState("");

  // AJOUT: État pour la modale de carte
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const [buyProperties, setBuyProperties] = useState<any[]>([]);
  const [rentProperties, setRentProperties] = useState<any[]>([]);
  const [seasonalProperties, setSeasonalProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState({ buy: true, rent: true });
  const [error, setError] = useState<string | null>(null);

  // Loading state for user's demandes
  const [demandesLoading, setDemandesLoading] = useState(false);

  // Carousel/favorite state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState<Record<string, number>>({});
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // Auth (to load user's demandes and mark sent requests)
  const { user, isAuthenticated } = useAuth();

  // Load user's demandes to persist "demande déjà envoyée" state
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    let mounted = true;
    const loadUserDemandes = async () => {
      setDemandesLoading(true);
      try {
  const resp = await api.get(`/immobilier/demandes/user/${user.id}`);
        const demandes = resp.data || [];
        const map: Record<string, boolean> = {};
        demandes.forEach((d: any) => {
          if (d && d.propertyId) map[String(d.propertyId)] = true;
        });
        if (mounted) setSentRequests(prev => ({ ...prev, ...map }));
      } catch (err) {
        console.error('Unable to load user demandes', err);
      } finally {
        if (mounted) setDemandesLoading(false);
      }
    };

    loadUserDemandes();
    return () => { mounted = false; };
  }, [isAuthenticated, user?.id]);

  const fetchProperties = async () => {
    try {
      setError(null);
      const response = await api.get('/properties');
      if (!response.data) throw new Error('Erreur lors de la récupération des propriétés');
      const properties = response.data;

      const forSale = properties
        .filter((p: any) => p.status === 'for_sale' && p.isActive)
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [property1, property2, property3][i % 3] }));

      // Filtrer les propriétés saisonnières en utilisant le champ rentType
      const forRent = properties
        .filter((p: any) => p.status === 'for_rent' && p.isActive && p.rentType === 'longue_duree')
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [rentProperties1, rentProperties2, rentProperties3][i % 3] }));

      const seasonal = properties
        .filter((p: any) => p.status === 'for_rent' && p.isActive && p.rentType === 'saisonniere')
        .slice(0, 8)
        .map((p: any, i: number) => ({ ...p, localImage: [rentProperties1, rentProperties2, rentProperties3][i % 3] }));

      setBuyProperties(forSale);
      setRentProperties(forRent);
      // Stockez directement les propriétés saisonnières au lieu d'utiliser useMemo
      setSeasonalProperties(seasonal);

    } catch (err) {
      console.error('Error fetching properties:', err);
      setError("Impossible de charger les propriétés. Affichage des exemples.");
      setBuyProperties(localBuyProperties as any[]);
      setRentProperties(localRentProperties as any[]);
      setSeasonalProperties(localRentProperties.filter(p => p.features.toLowerCase().includes('courte')) as any[]);
    } finally {
      setLoading({ buy: false, rent: false });
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Initialiser les index d'images pour chaque jeu de données
  useEffect(() => {
    const indexes: Record<string, number> = {};
    [...buyProperties, ...rentProperties, ...seasonalProperties].forEach((p: any) => {
      indexes[p.id] = indexes[p.id] ?? 0;
    });
    setCurrentImageIndexes((prev) => ({ ...indexes, ...prev }));
  }, [buyProperties, rentProperties, seasonalProperties]);

  const getPropertyImages = (property: any): string[] => {
    if (property.images && property.images.length > 0) return property.images as string[];
    if (property.localImage) return [property.localImage as string];
    return [property1];
  };

  const displayed = useMemo(() => {
    const hasFeature = (p: any, token: string) => {
      if (!token) return true;
      const feats = Array.isArray(p.features) ? p.features.join(' ').toLowerCase() : String(p.features || '').toLowerCase();
      const more = `${String(p.type || '').toLowerCase()} ${String(p.title || '').toLowerCase()} ${String(p.description || '').toLowerCase()}`;
      return feats.includes(token.toLowerCase()) || more.includes(token.toLowerCase());
    };

    const applyFilters = (arr: any[]) =>
      arr.filter((p) => {
        if (!p) return false;

        // FILTRE LOCALISATION AMÉLIORÉ
        if (localisation && localisation.trim()) {
          const searchTerm = normalizeAddress(localisation);

          // Normaliser aussi les adresses des propriétés
          const city = normalizeAddress(p.city || '');
          const address = normalizeAddress(p.address || '');
          const zipCode = normalizeAddress(p.zipCode || '');

          // Vérifier la correspondance dans les deux sens
          const matchesLocation =
            city.includes(searchTerm) ||
            address.includes(searchTerm) ||
            zipCode.includes(searchTerm) ||
            searchTerm.includes(city) ||
            searchTerm.includes(address);

          if (!matchesLocation) return false;
        }

        // Filtres prix
        if (priceMin !== undefined && (p.price === undefined || p.price < priceMin)) return false;
        if (priceMax !== undefined && (p.price === undefined || p.price > priceMax)) return false;

        // Filtres surface
        if (surfaceMin !== undefined && (p.surface === undefined || p.surface < surfaceMin)) return false;
        if (surfaceMax !== undefined && (p.surface === undefined || p.surface > surfaceMax)) return false;

        // Filtres pièces et chambres
        if (pieces !== undefined) {
          const pcs = p.rooms ?? p.pieces ?? p.bedrooms ?? 0;
          if (pcs < pieces) return false;
        }
        if (chambres !== undefined) {
          const ch = p.bedrooms ?? p.rooms ?? 0;
          if (ch < chambres) return false;
        }

        // Filtres équipements
        if (exterieur !== undefined && exterieur !== '') {
          if (!hasFeature(p, exterieur)) return false;
        }
        if (extras !== undefined && extras !== '') {
          if (!hasFeature(p, extras)) return false;
        }

        return true;
      });

    let base: any[] = [];
    if (activeTab === 'achat') base = buyProperties;
    else if (activeTab === 'location') base = rentProperties;
    else if (activeTab === 'saisonniere') base = seasonalProperties;
    else {
      const all = [...buyProperties, ...rentProperties, ...seasonalProperties];
      const map = new Map<string, any>();
      all.forEach((p) => {
        if (!map.has(p.id)) map.set(p.id, p);
      });
      base = Array.from(map.values());
    }

    if (activeTab === 'achat' && typeBienAchat) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienAchat).toLowerCase()));
    } else if (activeTab === 'location' && typeBienLocation) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienLocation).toLowerCase()));
    } else if (activeTab === 'saisonniere' && typeBienSaison) {
      base = base.filter((p) => String(p.type || '').toLowerCase().includes(String(typeBienSaison).toLowerCase()));
    }

    return applyFilters(base);
  }, [
    activeTab,
    buyProperties,
    rentProperties,
    seasonalProperties,
    localisation,
    typeBienAchat,
    typeBienLocation,
    typeBienSaison,
    priceMin,
    priceMax,
    surfaceMin,
    surfaceMax,
    pieces,
    chambres,
    exterieur,
    extras,
  ]);

  const ctaMoreRoute = activeTab === 'achat' ? '/acheter' : '/louer';

  const toggleFavorite = (id: string, e?: any) => {
    e?.stopPropagation?.();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const prevImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({ ...prev, [id]: (prev[id] - 1 + total) % total }));
  };

  const nextImage = (id: string, total: number, e?: any) => {
    e?.stopPropagation?.();
    setCurrentImageIndexes((prev) => ({ ...prev, [id]: (prev[id] + 1) % total }));
  };

  const handleDemanderVisite = (property: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sentRequests?.[property?.id]) {
      toast({ title: "Demande déjà envoyée", description: "Vous avez déjà envoyé une demande pour ce bien." });
      return;
    }
    setSelectedProperty(property);
    setModalOpen(true);
  };

  // Mode cartes seules (utilisé sur la Home)
  if (cardsOnly) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 py-6">
          {loading.buy && loading.rent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-2xl mb-4" />
                  <div className="bg-muted h-6 rounded mb-2" />
                  <div className="bg-muted h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(maxItems ? displayed.slice(0, maxItems) : displayed).map((property: any) => {
                  const images = getPropertyImages(property);
                  const totalImages = images.length;
                  const idx = currentImageIndexes[property.id] || 0;
                  const featuresArr = normalizeFeatures(property.features);
                  const priceLabel = formatPrice(property.price || 0, property.type, property.status);

                  return (
                    <Card
                      key={property.id}
                      className="home-card group cursor-pointer h-full"
                      onClick={() => navigate(`/immobilier/${property.id}`)}
                    >
                      <div className="relative">
                        <div className="relative rounded-lg h-52 overflow-hidden">
                          <img
                            src={images[idx % totalImages]}
                            alt={property.title}
                            className="home-card-image h-full w-full group-hover:scale-110"
                          />

                          <div className="absolute bg-gray-700 rounded-full py-1 px-2 text-white font-semibold text-sm top-3 left-3 home-card-badge">
                            {property.type}
                          </div>
                          <div className="absolute bg-green-700 p-1 text-white font-semibold text-sm rounded-full bottom-3 right-3 home-card-price">
                            {priceLabel}
                          </div>
                          {totalImages > 1 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                                onClick={(e) => prevImage(property.id, totalImages, e)}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                                onClick={(e) => nextImage(property.id, totalImages, e)}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                {idx + 1}/{totalImages}
                              </div>
                            </>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2 leading-tight">
                              {property.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {property.city}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            {property.surface && (
                              <div className="flex items-center gap-1">
                                <Ruler className="h-3 w-3" />
                                <span>{property.surface} m²</span>
                              </div>
                            )}
                            {(property.bedrooms || property.rooms) && (
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{property.bedrooms || property.rooms} ch.</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3" />
                                <span>{property.bathrooms} sdb</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {featuresArr.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                              >
                                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                                {feature}
                              </span>
                            ))}
                          </div>
                          {/* Boutons d'action */}
                          <div className="flex gap-1">
                            <button
                              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                              onClick={(e) => handleDemanderVisite(property, e)}
                              disabled={!!sentRequests?.[property?.id]}
                            >
                              {sentRequests?.[property?.id] ? 'Demande déjà envoyée' : 'Demander visite'}
                            </button>
                            <button
                              className="border-2 p-2 rounded-md"
                              onClick={() => navigate(`/immobilier/${property.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Voir plus button */}
              <div className="text-center mt-6">
                <Button className="px-8 py-3" onClick={() => navigate('/immobilier')}>
                  Voir plus
                </Button>
              </div>
            </>
          )}
        </div>

        {/* MODAL AJOUTÉ ICI POUR LE MODE CARDS ONLY */}
        <ModalDemandeVisite
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={selectedProperty}
          isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
          onSuccess={(id: string) => setSentRequests(prev => ({ ...prev, [id]: true }))}
        />
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className=" container mx-auto px-4 py-6">
        {/* Barre d'onglets + CTA */}
        <div className="sticky top-16 z-30 bg-white flex flex-col lg:flex-row gap-4 items-center justify-between rounded-2xl border border-border/50 p-4">
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant={activeTab === 'tous' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 lg:text-sm ${activeTab === 'tous' ? 'bg-primary text-primary-foreground' : 'border-2'}`}
              onClick={() => setActiveTab('tous')}
            >
              TOUS
            </Button>

            <Button
              variant={activeTab === 'achat' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 lg:text-sm ${activeTab === 'achat' ? 'bg-primary text-primary-foreground' : 'border-2'}`}
              onClick={() => setActiveTab('achat')}
            >
              ACHAT
            </Button>
            <Button
              variant={activeTab === 'location' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 lg:text-sm ${activeTab === 'location' ? 'bg-primary text-primary-foreground' : 'border-2'}`}
              onClick={() => setActiveTab('location')}
            >
              LOCATION LONGUE DURÉE
            </Button>
            <Button
              variant={activeTab === 'saisonniere' ? 'default' : 'outline'}
              className={`px-2 py-1 text-xs lg:p-4 lg:text-sm ${activeTab === 'saisonniere' ? 'bg-primary text-primary-foreground' : 'border-2'}`}
              onClick={() => setActiveTab('saisonniere')}
            >
              LOCATION SAISONNIÈRE
            </Button >
          </div>
          <div>

            <div className="relative z-10">
              {/* Bouton principal */}
              <motion.button
                onClick={() => setShowCard(true)}
                className="p-2 text-xs lg:p-4 lg:text-sm flex items-center justify-center rounded-lg bg-gradient-to-r from-slate-900 to-blue-950 text-white font-semibold shadow-md"
                style={{
                  backgroundSize: "200% 100%",
                  backgroundPosition: "50% 50%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear",
                }}
              >
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                VENDRE / LOUER SON BIEN
              </motion.button>

              {demandesLoading && (
                <div className="inline-flex items-center ml-3 text-sm text-muted-foreground">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                  Chargement demandes...
                </div>
              )}

              {/* Overlay flouté + Card */}
              <AnimatePresence>
                {showCard && (
                  <motion.div
                    className="fixed inset-0 flex z-50 items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="bg-gray-900 relative rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden bg-opacity-95"
                    >
                      <button
                        onClick={() => setShowCard(false)}
                        className="p-2 absolute right-0 z-50 group ml-2 flex-shrink-0"
                      >
                        <X className="w-7 h-7 text-white bg-red-700 rounded-full p-1 group-hover:text-black transition-colors" />
                      </button>
                      {/* Conteneur d'image avec image réelle */}
                      <div className="relative h-56 bg-gray-800  overflow-hidden">
                        <img
                          src="/illus.gif"
                          alt="Immobilier"
                          className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                      </div>

                      {/* Le reste du contenu reste identique */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-3 h-12 bg-blue-500 rounded-full mt-1 shadow-lg shadow-blue-500/30" />
                            <p className="text-gray-200 text-sm lg:text-base leading-relaxed font-medium">
                              Merci de vous connecter à votre compte afin de publier une annonce de location ou de vente de votre bien.
                            </p>
                          </div>

                        </div>

                        <div className="grid lg:flex gap-3">
                          <button
                            onClick={() => navigate('/register')}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center gap-3 group"
                          >
                            <div className="p-1.5 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                              <UserPlus className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base">Créer un compte</span>
                          </button>

                          <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 flex items-center justify-center gap-3 group"
                          >
                            <div className="p-1.5 bg-white bg-opacity-20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                              <LogIn className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base">Se connecter</span>
                          </button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <p className="text-gray-400 text-xs text-center">
                            Accédez à tous vos biens et gérez vos annonces en toute simplicité
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>


                )}

              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Filtres */}
        <div className=" mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-card rounded-2xl border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <div className="w-full">
              <Select
                onValueChange={(v) => {
                  if (activeTab === 'achat') setTypeBienAchat(v || undefined);
                  else if (activeTab === 'location') setTypeBienLocation(v || undefined);
                  else if (activeTab === 'saisonniere') setTypeBienSaison(v || undefined);
                }}
                value={
                  activeTab === 'achat'
                    ? typeBienAchat
                    : activeTab === 'location'
                      ? typeBienLocation
                      : activeTab === 'saisonniere'
                        ? typeBienSaison
                        : undefined
                }
              >
                <SelectTrigger className="h-11 border-2">
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === 'tous' && (
                    <>
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="professionnel">Local professionnel</SelectItem>
                      <SelectItem value="fonds_de_commerce">Fonds de commerce</SelectItem>
                      <SelectItem value="appartements_neufs">Appartement neufs (VEFA)</SelectItem>
                      <SelectItem value="scpi">SCPI</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="villas_neuves">Villas neuves (VEFA)</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="gite">Gite</SelectItem>
                      <SelectItem value="maison_d_hote">Maison d'hote</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="domaine">Domaine</SelectItem>
                      <SelectItem value="appartement">Appartement meublée</SelectItem>
                      <SelectItem value="villa">Appartement non meublée</SelectItem>
                      <SelectItem value="studio">Villa meublée</SelectItem>
                      <SelectItem value="studio">Villa non meublée</SelectItem>
                      <SelectItem value="parking">Local commercial</SelectItem>
                      <SelectItem value="parking">Local professionnel</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="cellier">Cellier</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </>
                  )}
                  {activeTab === 'achat' && (
                    <>
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="commercial">Local commercial</SelectItem>
                      <SelectItem value="professionnel">Local professionnel</SelectItem>
                      <SelectItem value="fonds_de_commerce">Fonds de commerce</SelectItem>
                      <SelectItem value="villas_neuves">Villas neuves (VEFA)</SelectItem>
                      <SelectItem value="appartements_neufs">Appartement neufs (VEFA)</SelectItem>
                      <SelectItem value="scpi">SCPI</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="gite">Gite</SelectItem>
                      <SelectItem value="maison_d_hote">Maison d'hote</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="domaine">Domaine</SelectItem>
                    </>
                  )}

                  {activeTab === 'location' && (
                    <>
                      <SelectItem value="appartement">Appartement meublée</SelectItem>
                      <SelectItem value="villa">Appartement non meublée</SelectItem>
                      <SelectItem value="studio">Villa meublée</SelectItem>
                      <SelectItem value="studio">Villa non meublée</SelectItem>
                      <SelectItem value="parking">Local commercial</SelectItem>
                      <SelectItem value="parking">Local professionnel</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="cellier">Cellier</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </>
                  )}

                  {activeTab === 'saisonniere' && (
                    <>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="maison">Maison / Villa</SelectItem>
                      <SelectItem value="villa_d_exception">Villa d'exception</SelectItem>
                      <SelectItem value="location_journee">Location à la journée</SelectItem>
                      <SelectItem value="location_salle_bureau">Location de salle de bureau</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="chambre_d_hote">Chambre d'hote</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={localisation}
              onChange={(e) => setLocalisation(e.target.value)}
              onClick={() => setIsLocationModalOpen(true)}
              placeholder="Cliquez pour choisir sur la carte"
              className="pl-9 h-11 border-2 cursor-pointer bg-white"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>RAYON</span>
              <span className="font-medium">{radiusKm} Km</span>
            </div>
            <Slider
              value={[radiusKm]}
              min={0}
              max={10}
              step={1}
              onValueChange={(v) => setRadiusKm(v[0] ?? 0)}
              className="mt-1"
            />
          </div>

          {/* Filtres supplémentaires */}
          <div className="col-span-1 lg:col-span-3 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeTab === 'achat' && (
              <>
                <div className="flex items-center gap-2">
                  <Input placeholder="Prix min (€)" value={priceMin ?? ''} onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)} className="h-10" />
                  <Input placeholder="Prix max (€)" value={priceMax ?? ''} onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10" />
                </div>
              </>
            )}
            {(activeTab === 'location' || activeTab === 'saisonniere') && (
              <div className="flex w-full items-center gap-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Prix MAX / mois (€)" value={priceMax ?? ''} onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Surface min (m²)" value={surfaceMin ?? ''} onChange={(e) => setSurfaceMin(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Surface max (m²)" value={surfaceMax ?? ''} onChange={(e) => setSurfaceMax(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                </div>

                <div className="flex items-center gap-2">
                  <Input placeholder="Pièces" value={pieces ?? ''} onChange={(e) => setPieces(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                  <Input placeholder="Chambres" value={chambres ?? ''} onChange={(e) => setChambres(e.target.value ? Number(e.target.value) : undefined)} className="h-10 w-32" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Select onValueChange={(v) => setExterieur(v || undefined)} value={exterieur}>
                    <SelectTrigger className="h-10 border-2 w-40">
                      <SelectValue placeholder="Exterieur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piscine">Piscine</SelectItem>
                      <SelectItem value="jardin">Jardin</SelectItem>
                      <SelectItem value="terrasse">Terrasse</SelectItem>
                      <SelectItem value="balcon">Balcon</SelectItem>
                      <SelectItem value="garage">Garage</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(v) => setExtras(v || undefined)} value={extras}>
                    <SelectTrigger className="h-10 border-2 w-40">
                      <SelectValue placeholder="En plus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcon">Balcon</SelectItem>
                      <SelectItem value="parking">Parking</SelectItem>
                      <SelectItem value="ascenseur">Ascenseur</SelectItem>
                      <SelectItem value="cave">Cave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Indicateur de filtre actif */}
        {localisation && (
          <div></div>
        )}

        {/* Résultats */}
        <div className="mt-6">
          {loading.buy && loading.rent ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-2xl mb-4" />
                  <div className="bg-muted h-6 rounded mb-2" />
                  <div className="bg-muted h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayed.map((property: any) => {
                const images = getPropertyImages(property);
                const totalImages = images.length;
                const idx = currentImageIndexes[property.id] || 0;
                const isFav = !!favorites[property.id];
                const featuresArr = normalizeFeatures(property.features);
                const priceLabel = formatPrice(property.price || 0, property.type, property.status);

                return (
                  <Card
                    key={property.id}
                    className="overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl group cursor-pointer"
                    onClick={() => navigate(`/immobilier/${property.id}`)}
                  >
                    <div className="relative">
                      {/* Zone image avec navigation */}
                      <div className="relative h-48 w-11/12 rounded-lg mx-3 shadow-lg my-2 overflow-hidden">

                        <img
                          src={images[idx % totalImages]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                        />


                        {/* Badge type */}
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                          {property.type}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-green-200 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
                          {priceLabel}
                        </div>

                        {/* Badge + Actions */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          {(() => {
                            const badgeLabel = property.status === 'for_sale' ? 'ACHAT' : property.status === 'for_rent' ? 'LOCATION' : 'SAISONNIÈRE';
                            const badgeColor = property.status === 'for_sale' ? 'bg-blue-600' : property.status === 'for_rent' ? 'bg-green-600' : 'bg-orange-600';
                            return (
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${badgeColor}`}>
                                {badgeLabel}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Navigation images */}
                        {totalImages > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => prevImage(property.id, totalImages, e)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => nextImage(property.id, totalImages, e)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Compteur */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                              {idx + 1}/{totalImages}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm flex-1 line-clamp-2 leading-tight">
                            {property.title}
                          </h3>
                        </div>

                        {/* Prix et localisation */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {property.city}
                          </span>
                        </div>

                        {/* Caractéristiques */}
                        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                          {property.surface && (
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3" />
                              <span>{property.surface} m²</span>
                            </div>
                          )}
                          {(property.bedrooms || property.rooms) && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              <span>{property.bedrooms || property.rooms} ch.</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-3 w-3" />
                              <span>{property.bathrooms} sdb</span>
                            </div>
                          )}
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {featuresArr.slice(0, 2).map((feature, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              <div className="w-1 h-1 bg-blue-600 rounded-full" />
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-1">
                          <button
                            className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:bg-orange-600"
                            onClick={(e) => handleDemanderVisite(property, e)}
                            disabled={!!sentRequests?.[property?.id]}
                          >
                            {sentRequests?.[property?.id] ? 'En attente' : 'Demander visite'}
                          </button>
                          <button
                            className="border-2 p-2 rounded-md"
                            onClick={() => navigate(`/immobilier/${property.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Modal de demande de visite */}
      <ModalDemandeVisite
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        property={selectedProperty}
        isAlreadySent={selectedProperty ? !!sentRequests?.[selectedProperty.id] : false}
        onSuccess={(id: string) => setSentRequests(prev => ({ ...prev, [id]: true }))}
      />

      {/* Modal de sélection de localisation */}
      <LocationPickerModal
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        value={localisation}
        onChange={setLocalisation}
        onLocationSelect={(location) => {
          setLocalisation(location.address);
          console.log('Location selected:', location);
        }}
        properties={[
          ...buyProperties,
          ...rentProperties,
          ...seasonalProperties
        ].map(p => ({
          id: p.id,
          title: p.title,
          address: p.address || '',
          city: p.city,
          latitude: p.latitude,
          longitude: p.longitude,
          type: p.type,
          price: p.price,
          status: p.status
        }))}
      />
    </section>

  );
};

export default PropertyListings;