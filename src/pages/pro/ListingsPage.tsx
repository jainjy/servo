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
} from "lucide-react";
import api from "@/lib/api";
import AuthService from "@/services/authService";
import { toast } from "sonner";
import { LocationPickerModal } from "@/components/location-picker-modal";
import { ListingModal } from "@/components/admin/listings/listing-modal";

// Types et statuts alignés avec le backend
const STATUT_ANNONCE = {
  draft: { label: "Brouillon", color: "bg-blue-100 text-blue-800" },
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
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90"
            style={{ color: "#5A6470" }}
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
            <Eye className="mx-auto mb-2 text-blue-600" size={24} />
            <div className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
              {annonce.views || 0}
            </div>
            <div className="text-sm" style={{ color: "#5A6470" }}>
              Vues
            </div>
          </Card>
          <Card className="p-4 text-center">
            <Heart className="mx-auto mb-2 text-red-600" size={24} />
            <div className="text-2xl font-bold" style={{ color: "#0A0A0A" }}>
              {annonce.favorites?.length || 0}
            </div>
            <div className="text-sm" style={{ color: "#5A6470" }}>
              Favoris
            </div>
          </Card>
        </div>

        <div>
          <h3 className="font-semibold mb-4" style={{ color: "#0A0A0A" }}>
            Informations de publication
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "#5A6470" }}>Statut:</span>
              <Badge className={STATUT_ANNONCE[annonce.status]?.color}>
                {STATUT_ANNONCE[annonce.status]?.label}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "#5A6470" }}>Créée le:</span>
              <span style={{ color: "#0A0A0A" }}>
                {new Date(annonce.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {annonce.publishedAt && (
              <div className="flex justify-between">
                <span style={{ color: "#5A6470" }}>Publiée le:</span>
                <span style={{ color: "#0A0A0A" }}>
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

const ListingsPage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [filtres, setFiltres] = useState({
    recherche: "",
    statut: "",
    type: "",
  });
  const [showModalCreation, setShowModalCreation] = useState(false);
  const [showModalStatistiques, setShowModalStatistiques] = useState(false);
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
        // Vérifier que l'ID existe
        setUser(currentUser);
        await fetchAnnonces(currentUser.id);
        await fetchStats(currentUser.id);
      }
    };
    init();
  }, []);

  const fetchAnnonces = async (userId) => {
    if (!userId) return; // Ne pas faire la requête si pas d'ID

    try {
      setLoading(true);
      const response = await api.get(`/properties/user/${userId}`);
      setAnnonces(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (userId) => {
    if (!userId) return; // Ne pas faire la requête si pas d'ID

    try {
      const response = await api.get(`/properties/stats?userId=${userId}`);
      setStatsGlobales(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
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
        publishedAt:
          nouveauStatut === "draft" ? null : new Date().toISOString(),
      });
      await fetchAnnonces(user?.id);
      await fetchStats(user?.id);
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const getListingType = (annonce) => {
    if (annonce.listingType === "both") return { vente: true, location: true };
    if (annonce.listingType === "rent") return { vente: false, location: true };
    return { vente: true, location: false };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-1 lg:px-4 py-2 lg:py-8">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Home size={32} />
            </div>
            <div>
              <h1 className="text-lg lg:text-4xl font-bold" style={{ color: "#0A0A0A" }}>
                Gestion des Annonces
              </h1>
              <p className="text-lg" style={{ color: "#5A6470" }}>
                Gérez vos biens immobiliers et suivez leurs performances
              </p>
            </div>
          </div>

          <Button
            style={{ backgroundColor: "#0052FF", color: "white" }}
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
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {statsGlobales.total}
                </div>
                <div style={{ color: "#5A6470" }}>Total annonces</div>
              </div>
              <Home className="text-blue-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {statsGlobales.published}
                </div>
                <div style={{ color: "#5A6470" }}>Publiées</div>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600 mb-2">
                  {statsGlobales.pending}
                </div>
                <div style={{ color: "#5A6470" }}>En attente</div>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-600 mb-2">
                  {statsGlobales.archived}
                </div>
                <div style={{ color: "#5A6470" }}>Archivées</div>
              </div>
              <Archive className="text-gray-600" size={24} />
            </div>
          </Card>
        </div>

        {/* Barre de filtres */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="Rechercher une annonce..."
                className="pl-10"
                value={filtres.recherche}
                onChange={(e) =>
                  setFiltres({ ...filtres, recherche: e.target.value })
                }
              />
            </div>

            <select
              className="p-2 border rounded-lg"
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
                    <div className="w-full h-32 sm:h-40 lg:h-48 bg-gray-200 flex items-center justify-center">
                      <Home className="text-gray-400" size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      className={`${
                        STATUT_ANNONCE[annonce.status]?.color
                      } text-xs`}
                    >
                      {STATUT_ANNONCE[annonce.status]?.label}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                    {disponibilite.vente && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 text-xs"
                      >
                        Vente
                      </Badge>
                    )}
                    {disponibilite.location && (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 text-xs"
                      >
                        Location
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                    <h3
                      className="font-bold text-base sm:text-lg line-clamp-2 flex-1"
                      style={{ color: "#0A0A0A" }}
                    >
                      {annonce.title}
                    </h3>
                    <div className="text-lg sm:text-xl font-bold text-blue-600 whitespace-nowrap">
                      {annonce.price?.toLocaleString()} €
                      {disponibilite.location && !disponibilite.vente && (
                        <span className="text-xs">/mois</span>
                      )}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 mb-2 text-xs sm:text-sm"
                    style={{ color: "#5A6470" }}
                  >
                    <MapPin size={12} />
                    <span className="line-clamp-1">
                      {annonce.address}, {annonce.city}
                    </span>
                  </div>

                  <div
                    className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm"
                    style={{ color: "#5A6470" }}
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
                  <div className="flex justify-between mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="text-center flex-1">
                      <div
                        className="font-bold text-sm"
                        style={{ color: "#0A0A0A" }}
                      >
                        {annonce.views || 0}
                      </div>
                      <div className="text-xs" style={{ color: "#5A6470" }}>
                        Vues
                      </div>
                    </div>
                    <div className="text-center flex-1">
                      <div
                        className="font-bold text-sm"
                        style={{ color: "#0A0A0A" }}
                      >
                        {annonce.favorites?.length || 0}
                      </div>
                      <div className="text-xs" style={{ color: "#5A6470" }}>
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
                        setShowModalStatistiques(true);
                      }}
                      className="flex-1 border-gray-300 hover:bg-gray-50 p-2 h-8 sm:h-9"
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
                      className="flex-1 border-gray-300 hover:bg-gray-50 p-2 h-8 sm:h-9"
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
                        className="border-gray-300 hover:bg-gray-50 p-2 h-8 sm:h-9"
                        title="Plus d'actions"
                      >
                        <MoreVertical size={14} />
                      </Button>

                      {openMenu === annonce.id && (
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <button
                            onClick={() => {
                              supprimerAnnonce(annonce.id);
                              setOpenMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 border-b border-gray-100 text-red-600"
                          >
                            <Trash2 size={14} />
                            Supprimer
                          </button>

                          {annonce.status === "for_sale" ||
                          annonce.status === "for_rent" ? (
                            <>
                              <button
                                onClick={() => {
                                  changerStatut(annonce.id, "draft");
                                  setOpenMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100"
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
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100"
                                >
                                  <CheckCircle size={14} />
                                  Marquer comme vendu
                                </button>
                              ) : null}

                              {annonce.listingType === "rent" ||
                              annonce.listingType === "both" ? (
                                <button
                                  onClick={() => {
                                    changerStatut(annonce.id, "rented");
                                    setOpenMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
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
                              className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 flex items-center gap-2 text-green-600"
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
          <Card className="p-8 sm:p-12 text-center">
            <Home className="mx-auto mb-4 text-gray-400" size={48} />
            <h3
              className="text-lg sm:text-xl font-semibold mb-2"
              style={{ color: "#0A0A0A" }}
            >
              Aucune annonce trouvée
            </h3>
            <p style={{ color: "#5A6470" }}>
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

      <ModalStatistiques
        isOpen={showModalStatistiques}
        onClose={() => setShowModalStatistiques(false)}
        annonce={annonceSelectionnee}
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
