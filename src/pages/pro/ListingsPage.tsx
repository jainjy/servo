import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Home,
  Plus,
  Search,
  Filter,
  Eye,
  Heart,
  Phone,
  Edit,
  Trash2,
  Archive,
  Calendar,
  MapPin,
  Euro,
  Ruler,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Upload,
  Star,
  Loader2,
  MoreVertical,
  User,
  Mail,
  AlertCircle,
  Images,
} from "lucide-react";
import api from "@/lib/api";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";
import { ListingModal } from "@/components/admin/listings/listing-modal";

// Nouvelle palette de couleurs
const COLORS = {
  LOGO: "#556B2F",           /* Olive green - accent */
  PRIMARY_DARK: "#6B8E23",   /* Yellow-green - primary */
  LIGHT_BG: "#FFFFFF",       /* White - fond clair */
  SEPARATOR: "#D3D3D3",      /* Light gray - séparateurs */
  SECONDARY_TEXT: "#8B4513", /* Saddle brown - textes secondaires */
};

// Types et statuts alignés avec le backend
const STATUT_ANNONCE = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  for_sale: { label: "À vendre", color: "bg-green-100 text-green-800" },
  for_rent: { label: "À louer", color: "bg-purple-100 text-purple-800" },
  sold: { label: "Vendu", color: "bg-gray-100 text-gray-800" },
  rented: { label: "Loué", color: "bg-gray-100 text-gray-800" },
};

const TYPE_BIEN = {
  house: "Maison / Villa",
  apartment: "Appartement",
  villa: "Villa",
  land: "Terrain",
  studio: "Studio",
  commercial: "Local commercial",
  professionnel: "Local professionnel",
  fonds_de_commerce: "Fonds de commerce",
  appartements_neufs: "Appartement neufs (VEFA)",
  scpi: "SCPI",
  villa_d_exception: "Villa d'exception",
  villas_neuves: "Villas neuves (VEFA)",
  parking: "Parking",
  hotel: "Hotel",
  gite: "Gite",
  maison_d_hote: "Maison d'hote",
  domaine: "Domaine",
  appartement_meuble: "Appartement meublée",
  villa_meuble: "Villa meublée",
  villa_non_meuble: "Villa non meublée",
  cellier: "Cellier",
  cave: "Cave",
};

const LISTING_TYPE = {
  sale: "Vente",
  rent: "Location",
};

const TYPE_LOCATION = {
  longue_duree: "Longue durée",
  saisonniere: "Saisonnière",
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

// Composant Modal Statistiques
const ModalStatistiques = ({ isOpen, onClose, annonce }) => {
  if (!annonce) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Statistiques de l'annonce"
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <Eye className="mx-auto mb-2" size={24} style={{ color: COLORS.LOGO }} />
            <div className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
              {annonce.views || 0}
            </div>
            <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
              Vues
            </div>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="mx-auto mb-2" size={24} style={{ color: "#DC2626" }} />
            <div className="text-2xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
              {annonce.favorites?.length || 0}
            </div>
            <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
              Favoris
            </div>
          </Card>
        </div>

        <div>
          <h3 className="font-semibold mb-4" style={{ color: COLORS.PRIMARY_DARK }}>
            Informations de publication
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: COLORS.SECONDARY_TEXT }}>Statut:</span>
              <Badge className={STATUT_ANNONCE[annonce.status]?.color}>
                {STATUT_ANNONCE[annonce.status]?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span style={{ color: COLORS.SECONDARY_TEXT }}>Créée le:</span>
              <span style={{ color: COLORS.PRIMARY_DARK }}>
                {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {annonce.publishedAt && (
              <div className="flex justify-between">
                <span style={{ color: COLORS.SECONDARY_TEXT }}>Publiée le:</span>
                <span style={{ color: COLORS.PRIMARY_DARK }}>
                  {new Date(annonce.publishedAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Modal pour confirmer le marquage comme loué
const ModalConfirmationLoue = ({ isOpen, onClose, annonce, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [demandes, setDemandes] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientInfo, setClientInfo] = useState(null);

  useEffect(() => {
    if (isOpen && annonce) {
      chargerDemandes();
    }
  }, [isOpen, annonce]);

  const chargerDemandes = async () => {
    try {
      const response = await api.get(`/demandes/immobilier/property/${annonce.id}`);
      if (response.data && response.data.length > 0) {
        setDemandes(response.data);
        // Sélectionner automatiquement la dernière demande validée
        const derniereValidee = response.data.find(d => d.statut === 'validée');
        if (derniereValidee) {
          setSelectedClientId(derniereValidee.clientId);
          setClientInfo(derniereValidee);
        }
      }
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
    }
  };

  const handleConfirm = async () => {
    if (!selectedClientId) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(selectedClientId);
      onClose();
    } catch (error) {
      console.error("Erreur confirmation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !annonce) return null;

  const isLocationSaisonniere = annonce.rentType  === "saisonniere" && 
                               (annonce.listingType === "rent" || annonce.listingType === "both");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Marquer comme loué" size="md">
      <div className="space-y-6">
        <div className="rounded-lg p-4"
             style={{ 
               backgroundColor: `${COLORS.LOGO}10`,
               borderColor: COLORS.LOGO,
               borderWidth: '1px'
             }}>
          <div className="flex items-center gap-3">
            <Home size={20} style={{ color: COLORS.LOGO }} />
            <div>
              <h4 className="font-semibold" style={{ color: COLORS.LOGO }}>
                {annonce.title}
              </h4>
              <p className="text-sm" style={{ color: COLORS.PRIMARY_DARK }}>
                {annonce.address}, {annonce.city}
              </p>
            </div>
          </div>
        </div>

        {isLocationSaisonniere ? (
          <div className="space-y-4">
            <div className="rounded-lg p-4"
                 style={{ 
                   backgroundColor: `${COLORS.PRIMARY_DARK}10`,
                   borderColor: COLORS.PRIMARY_DARK,
                   borderWidth: '1px'
                 }}>
              <div className="flex items-center gap-2" style={{ color: COLORS.PRIMARY_DARK }}>
                <CheckCircle size={18} />
                <span className="font-medium">Location saisonnière détectée</span>
              </div>
              <p className="text-sm mt-1" style={{ color: COLORS.SECONDARY_TEXT }}>
                Une réservation de location saisonnière sera automatiquement créée.
              </p>
            </div>

            <div className="border rounded-lg p-4" style={{ borderColor: COLORS.SEPARATOR }}>
              <h4 className="font-medium mb-3" style={{ color: COLORS.PRIMARY_DARK }}>
                Sélectionner le client
              </h4>
              
              {demandes.length > 0 ? (
                <div className="space-y-2">
                  {demandes.map((demande) => (
                    <div
                      key={demande.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedClientId === demande.clientId
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{ 
                        borderColor: selectedClientId === demande.clientId 
                          ? COLORS.LOGO 
                          : COLORS.SEPARATOR 
                      }}
                      onClick={() => {
                        setSelectedClientId(demande.clientId);
                        setClientInfo(demande);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedClientId === demande.clientId
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <User size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium" style={{ color: COLORS.PRIMARY_DARK }}>
                            {demande.contactPrenom} {demande.contactNom}
                          </div>
                          <div className="text-sm flex items-center gap-2" 
                               style={{ color: COLORS.SECONDARY_TEXT }}>
                            <Mail size={12} />
                            {demande.contactEmail}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={`text-xs ${
                              demande.statut === 'validée' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {demande.statut}
                            </Badge>
                            {demande.dateSouhaitee && (
                              <span className="text-xs" style={{ color: COLORS.SECONDARY_TEXT }}>
                                Visite: {new Date(demande.dateSouhaitee).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed rounded-lg"
                     style={{ borderColor: COLORS.SEPARATOR }}>
                  <AlertCircle className="mx-auto mb-2" size={24} 
                              style={{ color: COLORS.SEPARATOR }} />
                  <p style={{ color: COLORS.SECONDARY_TEXT }}>Aucune demande de visite trouvée</p>
                  <p className="text-sm mt-1" style={{ color: COLORS.SECONDARY_TEXT }}>
                    Le client doit d'abord faire une demande de visite et vous devez la valider.
                  </p>
                </div>
              )}
            </div>

            {clientInfo && (
              <div className="rounded-lg p-4"
                   style={{ 
                     backgroundColor: `${COLORS.SEPARATOR}20`,
                     borderColor: COLORS.SEPARATOR 
                   }}>
                <h4 className="font-medium mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  Détails de la réservation
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div style={{ color: COLORS.SECONDARY_TEXT }}>Client:</div>
                    <div className="font-medium" style={{ color: COLORS.PRIMARY_DARK }}>
                      {clientInfo.contactPrenom} {clientInfo.contactNom}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: COLORS.SECONDARY_TEXT }}>Email:</div>
                    <div style={{ color: COLORS.PRIMARY_DARK }}>{clientInfo.contactEmail}</div>
                  </div>
                  <div>
                    <div style={{ color: COLORS.SECONDARY_TEXT }}>Durée:</div>
                    <div style={{ color: COLORS.PRIMARY_DARK }}>7 nuits (par défaut)</div>
                  </div>
                  <div>
                    <div style={{ color: COLORS.SECONDARY_TEXT }}>Prix total:</div>
                    <div className="font-medium" style={{ color: COLORS.LOGO }}>
                      {((annonce.price || 0) * 7).toLocaleString()} €
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg p-4"
               style={{ 
                 backgroundColor: `${COLORS.SECONDARY_TEXT}10`,
                 borderColor: COLORS.SECONDARY_TEXT,
                 borderWidth: '1px'
               }}>
            <div className="flex items-center gap-2" style={{ color: COLORS.SECONDARY_TEXT }}>
              <AlertCircle size={18} />
              <span className="font-medium">Attention</span>
            </div>
            <p className="text-sm mt-1" style={{ color: COLORS.SECONDARY_TEXT }}>
              Ce bien n'est pas en location saisonnière. Le marquage comme "loué" ne créera pas de réservation automatique.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t" 
             style={{ borderColor: COLORS.SEPARATOR }}>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            style={{ 
              borderColor: COLORS.SEPARATOR,
              color: COLORS.SECONDARY_TEXT 
            }}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (isLocationSaisonniere && !selectedClientId)}
            style={{ 
              backgroundColor: COLORS.PRIMARY_DARK,
              color: COLORS.LIGHT_BG 
            }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmer
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Modal pour visualiser les images
const ModalGalerieImages = ({ isOpen, onClose, annonce }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !annonce) return null;

  const images = annonce.images && annonce.images.length > 0 
    ? annonce.images 
    : [];

  if (images.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Galerie d'images" size="lg">
        <div className="flex flex-col items-center justify-center py-12">
          <Images size={48} style={{ color: COLORS.SEPARATOR }} className="mb-4" />
          <p style={{ color: COLORS.SECONDARY_TEXT }}>Aucune image disponible</p>
        </div>
      </Modal>
    );
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Galerie d'images" size="lg">
      <div className="space-y-4">
        {/* Image principale */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" 
             style={{ aspectRatio: "16/9" }}>
          <img
            src={images[currentImageIndex]}
            alt={`${annonce.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                title="Image précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                title="Image suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Compteur d'images */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index ? "border-blue-500" : "border-gray-300"
                }`}
                style={{
                  borderColor: currentImageIndex === index ? COLORS.PRIMARY_DARK : COLORS.SEPARATOR
                }}
              >
                <img
                  src={image}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Informations */}
        <div className="text-sm" style={{ color: COLORS.SECONDARY_TEXT }}>
          <p><strong>Propriété:</strong> {annonce.title}</p>
          <p><strong>Localisation:</strong> {annonce.address}, {annonce.city}</p>
          <p><strong>Nombre d'images:</strong> {images.length}</p>
        </div>
      </div>
    </Modal>
  );
};

const ListingsPage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [filtres, setFiltres] = useState({
    recherche: "",
    statut: "",
    type: "",
  });
  const [showModalCreation, setShowModalCreation] = useState(false);
  const [showModalStatistiques, setShowModalStatistiques] = useState(false);
  const [showModalConfirmationLoue, setShowModalConfirmationLoue] = useState(false);
  const [showModalGalerie, setShowModalGalerie] = useState(false);
  const [annonceSelectionnee, setAnnonceSelectionnee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [statsGlobales, setStatsGlobales] = useState({
    total: 0,
    published: 0,
    pending: 0,
    archived: 0,
    totalViews: 0,
    avgViews: 0,
  });

  // Charger les données
  useEffect(() => {
    const init = async () => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser?.id) {
        setUser(currentUser);
        await fetchAnnonces(currentUser.id);
        await fetchStats(currentUser.id);
      }
    };
    init();
  }, []);

  const fetchAnnonces = async (userId) => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await api.get(`/properties/user/${userId}?status=all`);
      setAnnonces(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId) => {
    if (!userId) return;

    try {
      const response = await api.get(`/properties/stats?userId=${userId}`);
      setStatsGlobales(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fonction pour créer une réservation automatique
  const creerReservationAutomatique = async (annonce, clientId) => {
    try {
      // console.log(`🔄 Création réservation automatique pour annonce: ${annonce.id}, client: ${clientId}`);
      
      // Calculer les dates (7 jours après aujourd'hui, durée 7 nuits)
      const dateDebut = new Date();
      dateDebut.setDate(dateDebut.getDate() + 7);
      
      const dateFin = new Date(dateDebut);
      dateFin.setDate(dateFin.getDate() + 7);
      
      // Calculer le prix (7 nuits * prix par nuit)
      const prixNuit = annonce.price || 0;
      const prixTotal = prixNuit * 7;
      
      // Créer la réservation
      const reservationData = {
        propertyId: annonce.id,
        clientId: clientId,
        dateDebut: dateDebut.toISOString(),
        dateFin: dateFin.toISOString(),
        prixTotal: prixTotal,
        nombreAdultes: 2,
        nombreEnfants: 0,
        remarques: `Réservation créée automatiquement suite au marquage "loué" du ${new Date().toLocaleDateString('fr-FR')}`,
        statut: "confirmee"
      };
      
      const response = await api.post('/locations-saisonnieres', reservationData);
      
      // Notifier le client via événement
      window.dispatchEvent(new CustomEvent('reservation:created', {
        detail: { 
          propertyId: annonce.id, 
          clientId: clientId,
          reservationId: response.data.reservation?.id
        }
      }));
      
      // console.log("✅ Réservation créée avec succès:", response.data);
      
      return { 
        success: true, 
        message: "Réservation créée avec succès",
        reservation: response.data.reservation
      };
      
    } catch (error) {
      console.error("❌ Erreur création réservation automatique:", error);
      
      // Essayer avec l'endpoint spécial
      try {
        // console.log("🔄 Tentative via endpoint spécial auto-from-property...");
        
        const responseAlt = await api.post(`/locations-saisonnieres/auto-from-property/${annonce.id}`, {
          clientId: clientId
        });
        
        // console.log("✅ Réservation créée via endpoint spécial:", responseAlt.data);
        
        return { 
          success: true, 
          message: "Réservation créée via méthode alternative",
          reservation: responseAlt.data.reservation
        };
      } catch (errorAlt) {
        console.error("❌ Échec méthode alternative:", errorAlt);
      }
      
      return { 
        success: false, 
        message: error.response?.data?.error || "Erreur lors de la création de la réservation"
      };
    }
  };

  // Filtrer les annonces
  const annoncesFiltrees = annonces.filter((annonce) => {
    const matchRecherche =
      !filtres.recherche ||
      annonce.title.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      annonce.address.toLowerCase().includes(filtres.recherche.toLowerCase());
    const matchStatut = !filtres.statut || annonce.status === filtres.statut;
    const matchType = !filtres.type || annonce.type === filtres.type;

    return matchRecherche && matchStatut && matchType;
  });

  // Gestion des annonces
  const sauvegarderAnnonce = () => {
    fetchAnnonces(user?.id);
    fetchStats(user?.id);
  };

  const supprimerAnnonce = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    try {
      await api.delete(`/properties/${id}`);
      fetchAnnonces(user?.id);
      fetchStats(user?.id);
      toast.success("Annonce supprimée avec succès");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const changerStatut = async (id, nouveauStatut) => {
    try {
      await api.patch(`/properties/${id}`, {
        status: nouveauStatut,
        publishedAt: nouveauStatut === "pending" ? null : new Date().toISOString(),
      });
      await fetchAnnonces(user?.id);
      await fetchStats(user?.id);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  // Marquer comme loué avec création de réservation
  const handleMarquerCommeLoue = async (clientId = null) => {
    if (!annonceSelectionnee) return;

    try {
      const annonce = annonceSelectionnee;
      const isLocationSaisonniere = annonce.rentType  === "saisonniere" && 
                                   (annonce.listingType === "rent" || annonce.listingType === "both");
      
      if (isLocationSaisonniere) {
        // Si clientId fourni, utiliser celui-ci
        const finalClientId = clientId || await getDefaultClientId(annonce.id);
        
        if (!finalClientId) {
          toast.error("Impossible de trouver un client pour créer la réservation");
          return;
        }

        // 1. Créer la réservation
        const resultReservation = await creerReservationAutomatique(annonce, finalClientId);
        
        if (resultReservation.success) {
          // 2. Marquer comme loué
          await changerStatut(annonce.id, "rented");
          
          toast.success(
            <div>
              <p>✅ Annonce marquée comme louée</p>
              <p className="text-sm">Réservation créée avec succès</p>
            </div>
          );
          
          // 3. Émettre un événement pour la demande
          window.dispatchEvent(new CustomEvent('demande:statusChanged', {
            detail: { 
              statut: 'loué',
              propertyId: annonce.id 
            }
          }));
          
        } else {
          toast.error(
            <div>
              <p>❌ Impossible de créer la réservation</p>
              <p className="text-sm">{resultReservation.message}</p>
            </div>
          );
        }
        
      } else {
        // Pour les locations non saisonnières
        await changerStatut(annonce.id, "rented");
        toast.success("Annonce marquée comme louée");
      }
      
      // Fermer le modal
      setShowModalConfirmationLoue(false);
      setAnnonceSelectionnee(null);
      
    } catch (error) {
      console.error("Erreur marquer comme loué:", error);
      toast.error(
        <div>
          <p>❌ Erreur lors du marquage</p>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }
  };

  // Fonction pour récupérer un client par défaut
  const getDefaultClientId = async (propertyId) => {
    try {
      const response = await api.get(`/demandes/immobilier/property/${propertyId}`);
      if (response.data && response.data.length > 0) {
        const derniereValidee = response.data.find(d => d.statut === 'validée');
        if (derniereValidee) {
          return derniereValidee.clientId;
        }
      }
    } catch (error) {
      console.error("Erreur récupération client:", error);
    }
    return null;
  };

  const getListingType = (annonce) => {
    if (annonce.listingType === "both") return { vente: true, location: true };
    if (annonce.listingType === "rent") return { vente: false, location: true };
    return { vente: true, location: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: COLORS.LIGHT_BG }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" 
                  style={{ color: COLORS.LOGO }} />
          <p style={{ color: COLORS.SECONDARY_TEXT }}>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.LIGHT_BG }}>
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl" 
                 style={{ 
                   backgroundColor: `${COLORS.PRIMARY_DARK}20`,
                   color: COLORS.PRIMARY_DARK 
                 }}>
              <Home size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold" style={{ color: COLORS.PRIMARY_DARK }}>
                Gestion des Annonces
              </h1>
              <p className="text-lg" style={{ color: COLORS.SECONDARY_TEXT }}>
                Gérez vos biens immobiliers et suivez leurs performances
              </p>
            </div>
          </div>

          <Button
            style={{ 
              backgroundColor: COLORS.PRIMARY_DARK, 
              color: COLORS.LIGHT_BG 
            }}
            onClick={() => {
              setAnnonceSelectionnee(null);
              setShowModalCreation(true);
            }}
          >
            <Plus className="mr-2" size={16} />
            Nouvelle annonce
          </Button>
        </div>

        {/* Statistiques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: COLORS.PRIMARY_DARK }}>
                  {statsGlobales.total}
                </div>
                <div style={{ color: COLORS.SECONDARY_TEXT }}>Total annonces</div>
              </div>
              <Home size={24} style={{ color: COLORS.LOGO }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: "#059669" }}>
                  {statsGlobales.published}
                </div>
                <div style={{ color: COLORS.SECONDARY_TEXT }}>Publiées</div>
              </div>
              <CheckCircle size={24} style={{ color: "#059669" }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: "#D97706" }}>
                  {statsGlobales.pending}
                </div>
                <div style={{ color: COLORS.SECONDARY_TEXT }}>En attente</div>
              </div>
              <Clock size={24} style={{ color: "#D97706" }} />
            </div>
          </Card>
          <Card className="p-6" style={{ borderColor: COLORS.SEPARATOR }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2" style={{ color: COLORS.SECONDARY_TEXT }}>
                  {statsGlobales.archived}
                </div>
                <div style={{ color: COLORS.SECONDARY_TEXT }}>Archivées</div>
              </div>
              <Archive size={24} style={{ color: COLORS.SECONDARY_TEXT }} />
            </div>
          </Card>
        </div>

        {/* Barre de filtres */}
        <Card className="p-6 mb-8" style={{ borderColor: COLORS.SEPARATOR }}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                size={20}
                style={{ color: COLORS.SECONDARY_TEXT }}
              />
              <Input
                placeholder="Rechercher une annonce..."
                className="pl-10"
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  backgroundColor: COLORS.LIGHT_BG 
                }}
                value={filtres.recherche}
                onChange={(e) =>
                  setFiltres({ ...filtres, recherche: e.target.value })
                }
              />
            </div>

            <select
              className="p-2 border rounded-lg"
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.SECONDARY_TEXT,
                backgroundColor: COLORS.LIGHT_BG 
              }}
              value={filtres.statut}
              onChange={(e) =>
                setFiltres({ ...filtres, statut: e.target.value })
              }
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUT_ANNONCE).map(([key, statut]) => (
                <option key={key} value={key}>
                  {statut.label}
                </option>
              ))}
            </select>

            <select
              className="p-2 border rounded-lg"
              style={{ 
                borderColor: COLORS.SEPARATOR,
                color: COLORS.SECONDARY_TEXT,
                backgroundColor: COLORS.LIGHT_BG 
              }}
              value={filtres.type}
              onChange={(e) => setFiltres({ ...filtres, type: e.target.value })}
            >
              <option value="">Tous les types</option>
              {Object.entries(TYPE_BIEN).map(([key, type]) => (
                <option key={key} value={key}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </Card>

        {/* Liste des annonces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {annoncesFiltrees.map((annonce) => {
            const disponibilite = getListingType(annonce);

            return (
              <Card
                key={annonce.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                style={{ 
                  borderColor: COLORS.SEPARATOR,
                  backgroundColor: COLORS.LIGHT_BG 
                }}
              >
                {/* Image et badge statut */}
                <div className="relative flex-shrink-0">
                  {annonce.images && annonce.images.length > 0 ? (
                    <img
                      src={annonce.images[0]}
                      alt={annonce.title}
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 sm:h-40 lg:h-48 flex items-center justify-center"
                         style={{ backgroundColor: `${COLORS.SEPARATOR}50` }}>
                      <Home size={40} style={{ color: COLORS.SECONDARY_TEXT }} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${
                        STATUT_ANNONCE[annonce.status]?.color
                      } text-xs font-semibold px-3 py-1.5`}
                    >
                      {STATUT_ANNONCE[annonce.status]?.label}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2 flex-wrap max-w-[140px]">
                    {disponibilite.vente && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold px-2.5 py-1"
                        style={{ 
                          backgroundColor: `${COLORS.LOGO}`,
                          color: COLORS.LIGHT_BG 
                        }}
                      >
                        Vente
                      </Badge>
                    )}
                    {disponibilite.location && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold px-2.5 py-1"
                        style={{ 
                          backgroundColor: `${COLORS.PRIMARY_DARK}`,
                          color: COLORS.LIGHT_BG 
                        }}
                      >
                        Location
                      </Badge>
                    )}
                    {annonce.rentType === "saisonniere" && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold px-2.5 py-1"
                        style={{ 
                          backgroundColor: "#7C3AED",
                          color: COLORS.LIGHT_BG 
                        }}
                      >
                        Saisonnière
                      </Badge>
                    )}
                    {annonce.isPSLA && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold px-2.5 py-1"
                        style={{ 
                          backgroundColor: "#EA580C",
                          color: COLORS.LIGHT_BG 
                        }}
                      >
                        PSLA
                      </Badge>
                    )}
                    {annonce.isSHLMR && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold px-2.5 py-1"
                        style={{ 
                          backgroundColor: "#4F46E5",
                          color: COLORS.LIGHT_BG 
                        }}
                      >
                        SHLMR
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3
                      className="font-bold text-base sm:text-lg line-clamp-2 flex-1"
                      style={{ color: COLORS.PRIMARY_DARK }}
                    >
                      {annonce.title}
                    </h3>
                    <div className="text-lg sm:text-xl font-bold whitespace-nowrap"
                         style={{ color: COLORS.LOGO }}>
                      {annonce.price?.toLocaleString()} €
                      {disponibilite.location && !disponibilite.vente && (
                        <span className="text-xs">/mois</span>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 mb-2 text-xs sm:text-sm"
                    style={{ color: COLORS.SECONDARY_TEXT }}
                  >
                    <MapPin size={12} />
                    <span className="line-clamp-1">
                      {annonce.address}, {annonce.city}
                    </span>
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm"
                    style={{ color: COLORS.SECONDARY_TEXT }}
                  >
                    <div className="flex items-center gap-1">
                      <Ruler size={12} />
                      <span>{annonce.surface} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home size={12} />
                      <span>{annonce.rooms} pièces</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{annonce.bedrooms} ch.</span>
                    </div>
                  </div>

                  {/* Statistiques rapides */}
                  <div className="flex justify-between mb-4 p-2 sm:p-3 rounded-lg gap-2"
                       style={{ backgroundColor: `${COLORS.SEPARATOR}20` }}>
                    <div className="text-center flex-1">
                      <div
                        className="font-bold text-sm"
                        style={{ color: COLORS.PRIMARY_DARK }}
                      >
                        {annonce.views || 0}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.SECONDARY_TEXT }}>
                        Vues
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div
                        className="font-bold text-sm"
                        style={{ color: COLORS.PRIMARY_DARK }}>
                        {annonce.favorites?.length || 0}
                      </div>
                      <div className="text-xs" style={{ color: COLORS.SECONDARY_TEXT }}>
                        Favoris
                      </div>
                    </div>
                  </div>

                  {/* Actions - Boutons principaux */}
                  <div className="flex gap-2 mb-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnnonceSelectionnee(annonce);
                        setShowModalGalerie(true);
                      }}
                      className="flex-1 p-2 h-8 sm:h-9"
                      style={{ 
                        borderColor: COLORS.SEPARATOR,
                        color: COLORS.SECONDARY_TEXT 
                      }}
                      title="Galerie d'images"
                    >
                      <Images size={14} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnnonceSelectionnee(annonce);
                        setShowModalStatistiques(true);
                      }}
                      className="flex-1 p-2 h-8 sm:h-9"
                      style={{ 
                        borderColor: COLORS.SEPARATOR,
                        color: COLORS.SECONDARY_TEXT 
                      }}
                      title="Statistiques"
                    >
                      <TrendingUp size={14} />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnnonceSelectionnee(annonce);
                        setShowModalCreation(true);
                      }}
                      className="flex-1 p-2 h-8 sm:h-9"
                      style={{ 
                        borderColor: COLORS.SEPARATOR,
                        color: COLORS.SECONDARY_TEXT 
                      }}
                      title="Éditer"
                    >
                      <Edit size={14} />
                    </Button>

                    {/* Menu Popup */}
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === annonce.id ? null : annonce.id
                          )
                        }
                        className="p-2 h-8 sm:h-9"
                        style={{ 
                          borderColor: COLORS.SEPARATOR,
                          color: COLORS.SECONDARY_TEXT 
                        }}
                        title="Plus d'actions"
                      >
                        <MoreVertical size={14} />
                      </Button>

                      {openMenu === annonce.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 border rounded-lg shadow-lg z-50"
                             style={{ 
                               backgroundColor: COLORS.LIGHT_BG,
                               borderColor: COLORS.SEPARATOR 
                             }}>
                          <button
                            onClick={() => {
                              supprimerAnnonce(annonce.id);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 border-b"
                            style={{ 
                              borderColor: COLORS.SEPARATOR,
                              color: "#DC2626" 
                            }}
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>

                          {annonce.status === "for_sale" ||
                          annonce.status === "for_rent" ? (
                            <>
                              <button
                                onClick={() => {
                                  changerStatut(annonce.id, "pending");
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b"
                                style={{ 
                                  borderColor: COLORS.SEPARATOR,
                                  color: COLORS.SECONDARY_TEXT 
                                }}
                              >
                                <Archive size={14} />
                                Dépublier
                              </button>

                              {annonce.listingType === "sale" ||
                              annonce.listingType === "both" ? (
                                <button
                                  onClick={() => {
                                    changerStatut(annonce.id, "sold");
                                    setOpenMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b"
                                  style={{ 
                                    borderColor: COLORS.SEPARATOR,
                                    color: COLORS.SECONDARY_TEXT 
                                  }}
                                >
                                  <CheckCircle size={14} />
                                  Marquer comme vendu
                                </button>
                              ) : null}

                              {annonce.listingType === "rent" ||
                              annonce.listingType === "both" ? (
                                <button
                                  onClick={() => {
                                    setAnnonceSelectionnee(annonce);
                                    setShowModalConfirmationLoue(true);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 border-b"
                                  style={{ 
                                    borderColor: COLORS.SEPARATOR,
                                    color: COLORS.LOGO 
                                  }}
                                >
                                  <CheckCircle size={14} />
                                  Marquer comme loué
                                </button>
                              ) : null}
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                changerStatut(
                                  annonce.id,
                                  annonce.listingType === "rent"
                                    ? "for_rent"
                                    : "for_sale"
                                );
                                setOpenMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 flex items-center gap-2"
                              style={{ color: COLORS.PRIMARY_DARK }}
                            >
                              <CheckCircle size={14} />
                              Publier
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {annoncesFiltrees.length === 0 && (
          <Card className="p-8 sm:p-12 text-center" 
                style={{ borderColor: COLORS.SEPARATOR }}>
            <Home className="mx-auto mb-4" size={48} 
                  style={{ color: COLORS.SEPARATOR }} />
            <h3
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: COLORS.PRIMARY_DARK }}
            >
              Aucune annonce trouvée
            </h3>
            <p style={{ color: COLORS.SECONDARY_TEXT }}>
              {filtres.recherche || filtres.statut || filtres.type
                ? "Essayez de modifier vos critères de recherche"
                : "Commencez par créer votre première annonce"}
            </p>
          </Card>
        )}
      </div>

      <ListingModal
        open={showModalCreation}
        onOpenChange={setShowModalCreation}
        listing={annonceSelectionnee}
        mode={annonceSelectionnee ? "edit" : "create"}
        onSuccess={sauvegarderAnnonce}
        currentUser={user}
      />

      <ModalGalerieImages
        isOpen={showModalGalerie}
        onClose={() => {
          setShowModalGalerie(false);
          setAnnonceSelectionnee(null);
        }}
        annonce={annonceSelectionnee}
      />

      <ModalStatistiques
        isOpen={showModalStatistiques}
        onClose={() => setShowModalStatistiques(false)}
        annonce={annonceSelectionnee}
      />

      <ModalConfirmationLoue
        isOpen={showModalConfirmationLoue}
        onClose={() => {
          setShowModalConfirmationLoue(false);
          setAnnonceSelectionnee(null);
        }}
        annonce={annonceSelectionnee}
        onConfirm={handleMarquerCommeLoue}
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ListingsPage;