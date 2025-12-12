import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingModal } from "./listing-modal"; 
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Home,
  Filter,
  Heart,
  MapPin,
  Ruler,
  Users,
  TrendingUp,
  MoreVertical} from "lucide-react";
import api from "@/lib/api";

// Palette de couleurs du thème
const colors = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFF0",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  primaryLight: "#8FBC8F",
  secondaryLight: "#A0522D",
  cardBg: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#5D6D7E",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  accentGold: "#D4AF37",
  gradient1: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)",
  gradient2: "linear-gradient(135deg, #8B4513 0%, #A0522D 100%)",
  gradient3: "linear-gradient(135deg, #6B8E23 0%, #27AE60 100%)",
  oliveHover: "#5D801F",
  oliveLight: "#8FBC8F20",
};

// Types et statuts alignés avec le backend
const STATUT_ANNONCE = {
  draft: { label: "Brouillon", color: `${colors.primaryDark}20`, textColor: colors.primaryDark, borderColor: `${colors.primaryDark}30` },
  for_sale: { label: "À vendre", color: `${colors.success}20`, textColor: colors.success, borderColor: `${colors.success}30` },
  for_rent: { label: "À louer", color: `${colors.accentGold}20`, textColor: colors.accentGold, borderColor: `${colors.accentGold}30` },
  sold: { label: "Vendu", color: `${colors.textSecondary}15`, textColor: colors.textSecondary, borderColor: `${colors.textSecondary}25` },
  rented: { label: "Loué", color: `${colors.textSecondary}15`, textColor: colors.textSecondary, borderColor: `${colors.textSecondary}25` }
};

const TYPE_BIEN = {
  house: "Maison",
  apartment: "Appartement",
  villa: "Villa",
  land: "Terrain",
  studio: "Studio"
};

const LISTING_TYPE = {
  sale: "Vente",
  rent: "Location",
};

// Interface
interface Listing {
  id: string;
  ownerId:string,
  title: string;
  type: string;
  status: string;
  price: number;
  city: string;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  description: string;
  images: string[];
  features: string[];
  listingType: string;
  views: number;
  favorites: any[];
  owner: { 
    id: string;
    firstName: string | null;
    lastName: string | null; 
    email: string;
  };
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function ListingsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | undefined>();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/properties/admin/all");
      // Extraire le tableau de données
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setListings(data);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      setError(`Erreur lors du chargement des annonces: ${error.response?.data?.error || error.message}`);
      setListings([]); // Important : initialiser avec un tableau vide
    } finally {
      setLoading(false);
    }
  }

  const filteredListings = listings && Array.isArray(listings) ? listings.filter((listing) => {
    const matchRecherche = !searchQuery || 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${listing.owner.firstName || ''} ${listing.owner.lastName || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchStatut = !statusFilter || listing.status === statusFilter;
    const matchType = !typeFilter || listing.type === typeFilter;
    
    return matchRecherche && matchStatut && matchType;
  }) : [];

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setEditModalOpen(true);
  }

  const handleView = (listing: Listing) => {
    window.open(`/immobilier/${listing.id}`);
  }

  const handleStats = (listing: Listing) => {
    setSelectedListing(listing);
    setStatsModalOpen(true);
  }

  const handlePublish = async (listing: Listing, status?: string) => {
    try {
      setActionLoading(listing.id);
      let newStatus = status;
      
      // Si aucun statut n'est spécifié, utiliser le comportement par défaut
      if (!newStatus) {
        newStatus = listing.listingType === 'rent' ? 'for_rent' : 'for_sale';
      }
      
      await api.patch(`/properties/${listing.id}`, { 
        status: newStatus,
        publishedAt: new Date().toISOString()
      });

      await fetchListings(); 
    } catch (error: any) {
      console.error("Error publishing:", error);
      setError(`Erreur lors de la publication: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const handleUnpublish = async (listing: Listing) => {
    try {
      setActionLoading(listing.id);
      
      await api.patch(`/properties/${listing.id}`, { 
        status: 'draft',
        publishedAt: null
      });

      await fetchListings(); 
    } catch (error: any) {
      console.error("Error unpublishing:", error);
      setError(`Erreur lors de la dépublication: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const handleDelete = async (listing: Listing) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
      return;
    }

    try {
      setActionLoading(listing.id);
      
      await api.delete(`/properties/${listing.id}`);

      await fetchListings(); 
    } catch (error: any) {
      console.error("Error deleting:", error);
      setError(`Erreur lors de la suppression: ${error.response?.data?.error || error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const getListingTypeInfo = (listing: Listing) => {
    if (listing.listingType === 'both') return { vente: true, location: true };
    if (listing.listingType === 'rent') return { vente: false, location: true };
    return { vente: true, location: false };
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img src="/loading.gif" alt="" className='w-24 h-24'/>
          <p>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center" style={{ borderColor: colors.separator }}>
        <p className="text-destructive mb-4">{error}</p>
        <Button 
          onClick={fetchListings}
          style={{
            backgroundColor: colors.primaryDark,
            color: colors.lightBg,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.oliveHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primaryDark;
          }}
        >
          Réessayer
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
        <div className="container mx-auto px-4 py-8">
          {/* Barre de filtres */}
          <Card className="p-4 mb-8" style={{ borderColor: colors.separator }}>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: colors.textSecondary }} />
                <Input
                  placeholder="Rechercher une annonce..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ borderColor: colors.separator }}
                />
              </div>
              
              <select
                className="p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ 
                  borderColor: colors.primaryDark,
                  color: colors.textPrimary,
                }}
              >
                <option value="">Tous les statuts</option>
                {Object.entries(STATUT_ANNONCE).map(([key, statut]) => (
                  <option key={key} value={key}>{statut.label}</option>
                ))}
              </select>
              
              <select
                className="p-2 border rounded-lg"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ 
                  borderColor: colors.primaryDark,
                  color: colors.textPrimary,
                }}
              >
                <option value="">Tous les types</option>
                {Object.entries(TYPE_BIEN).map(([key, type]) => (
                  <option key={key} value={key}>{type}</option>
                ))}
              </select>

              <Button 
                variant="outline" 
                className="transition-all duration-200"
                style={{
                  borderColor: colors.primaryDark,
                  color: colors.primaryDark,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.oliveLight;
                  e.currentTarget.style.borderColor = colors.oliveHover;
                  e.currentTarget.style.color = colors.oliveHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = colors.primaryDark;
                  e.currentTarget.style.color = colors.primaryDark;
                }}
              >
                <Filter className="mr-2" size={16} />
                Plus de filtres
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 border rounded-md" style={{ 
                backgroundColor: `${colors.error}10`,
                borderColor: `${colors.error}20`,
              }}>
                <p className="text-sm" style={{ color: colors.error }}>{error}</p>
              </div>
            )}
          </Card>

          {/* Liste des annonces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredListings.map((listing) => {
              const disponibilite = getListingTypeInfo(listing);
              
              return (
                <Card 
                  key={listing.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                  style={{ borderColor: colors.separator }}
                >
                  {/* Image et badge statut */}
                  <div className="relative flex-shrink-0">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 sm:h-40 lg:h-48 bg-gray-200 flex items-center justify-center">
                        <Home className="text-gray-400" size={40} />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        className="border text-xs"
                        style={{
                          backgroundColor: STATUT_ANNONCE[listing.status]?.color,
                          color: STATUT_ANNONCE[listing.status]?.textColor,
                          borderColor: STATUT_ANNONCE[listing.status]?.borderColor,
                        }}
                      >
                        {STATUT_ANNONCE[listing.status]?.label}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 flex-wrap">
                      {disponibilite.vente && (
                        <Badge 
                          className="text-xs"
                          style={{
                            backgroundColor: `${colors.success}20`,
                            color: colors.success,
                            borderColor: `${colors.success}30`,
                          }}
                        >
                          Vente
                        </Badge>
                      )}
                      {disponibilite.location && (
                        <Badge 
                          className="text-xs"
                          style={{
                            backgroundColor: `${colors.accentGold}20`,
                            color: colors.accentGold,
                            borderColor: `${colors.accentGold}30`,
                          }}
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
                        style={{ color: colors.textPrimary }}
                      >
                        {listing.title}
                      </h3>
                      <div 
                        className="text-lg sm:text-xl font-bold whitespace-nowrap"
                        style={{ color: colors.primaryDark }}
                      >
                        {listing.price?.toLocaleString()} €
                        {disponibilite.location && !disponibilite.vente && <span className="text-xs">/mois</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2 text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
                      <MapPin size={12} />
                      <span className="line-clamp-1">{listing.address}, {listing.city}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-3 text-xs sm:text-sm" style={{ color: colors.textSecondary }}>
                      <div className="flex items-center gap-1">
                        <Ruler size={12} />
                        <span>{listing.surface} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={12} />
                        <span>{listing.rooms} pièces</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{listing.bedrooms} ch.</span>
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm mb-3" style={{ color: colors.textSecondary }}>
                      <span className="font-medium">Propriétaire: </span>
                      <span className="line-clamp-1">{listing.owner.firstName} {listing.owner.lastName}</span>
                    </div>

                    {/* Statistiques rapides */}
                    <div className="flex justify-between mb-4 p-2 sm:p-3 rounded-lg gap-2" style={{ backgroundColor: `${colors.primaryDark}05` }}>
                      <div className="text-center flex-1">
                        <div className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                          {listing.views || 0}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>Vues</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="font-bold text-sm" style={{ color: colors.textPrimary }}>
                          {listing.favorites?.length || 0}
                        </div>
                        <div className="text-xs" style={{ color: colors.textSecondary }}>Favoris</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStats(listing)}
                        className="flex-1 p-2 h-8 sm:h-9 transition-all duration-200 hover:scale-105"
                        title="Statistiques"
                        style={{
                          borderColor: colors.primaryDark,
                          color: colors.primaryDark,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.oliveLight;
                          e.currentTarget.style.borderColor = colors.oliveHover;
                          e.currentTarget.style.color = colors.oliveHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = colors.primaryDark;
                          e.currentTarget.style.color = colors.primaryDark;
                        }}
                      >
                        <TrendingUp size={14} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(listing)}
                        className="flex-1 p-2 h-8 sm:h-9 transition-all duration-200 hover:scale-105"
                        title="Voir l'annonce"
                        style={{
                          borderColor: colors.primaryDark,
                          color: colors.primaryDark,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.oliveLight;
                          e.currentTarget.style.borderColor = colors.oliveHover;
                          e.currentTarget.style.color = colors.oliveHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = colors.primaryDark;
                          e.currentTarget.style.color = colors.primaryDark;
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(listing)}
                        className="flex-1 p-2 h-8 sm:h-9 transition-all duration-200 hover:scale-105"
                        title="Éditer"
                        style={{
                          borderColor: colors.primaryDark,
                          color: colors.primaryDark,
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.oliveLight;
                          e.currentTarget.style.borderColor = colors.oliveHover;
                          e.currentTarget.style.color = colors.oliveHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderColor = colors.primaryDark;
                          e.currentTarget.style.color = colors.primaryDark;
                        }}
                      >
                        <Edit size={14} />
                      </Button>

                      {/* Menu Popup */}
                      <div className="relative">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOpenMenu(openMenu === listing.id ? null : listing.id)}
                          className="p-2 h-8 sm:h-9 transition-all duration-200 hover:scale-105"
                          title="Plus d'actions"
                          style={{
                            borderColor: colors.primaryDark,
                            color: colors.primaryDark,
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = colors.oliveLight;
                            e.currentTarget.style.borderColor = colors.oliveHover;
                            e.currentTarget.style.color = colors.oliveHover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = colors.primaryDark;
                            e.currentTarget.style.color = colors.primaryDark;
                          }}
                        >
                          <MoreVertical size={14} />
                        </Button>

                        {openMenu === listing.id && (
                          <div 
                            className="absolute right-0 bottom-full mb-2 w-48 border rounded-lg shadow-lg z-50"
                            style={{ 
                              backgroundColor: colors.cardBg,
                              borderColor: colors.separator,
                            }}
                          >
                            {(listing.status === 'for_sale' || listing.status === 'for_rent') ? (
                              <>
                                <button
                                  onClick={() => {
                                    handleUnpublish(listing);
                                    setOpenMenu(null);
                                  }}
                                  disabled={actionLoading === listing.id}
                                  className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-b disabled:opacity-50 transition-colors"
                                  style={{ 
                                    color: colors.textSecondary,
                                    borderColor: `${colors.separator}80`,
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = `${colors.textSecondary}08`;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <XCircle size={14} />
                                  Dépublier
                                </button>

                                {listing.listingType === 'sale' || listing.listingType === 'both' ? (
                                  <button
                                    onClick={() => {
                                      handlePublish(listing, 'sold');
                                      setOpenMenu(null);
                                    }}
                                    disabled={actionLoading === listing.id}
                                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-b disabled:opacity-50 transition-colors"
                                    style={{ 
                                      color: colors.primaryDark,
                                      borderColor: `${colors.separator}80`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = `${colors.primaryDark}08`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <CheckCircle size={14} />
                                    Marquer comme vendu
                                  </button>
                                ) : null}

                                {listing.listingType === 'rent' || listing.listingType === 'both' ? (
                                  <button
                                    onClick={() => {
                                      handlePublish(listing, 'rented');
                                      setOpenMenu(null);
                                    }}
                                    disabled={actionLoading === listing.id}
                                    className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-b disabled:opacity-50 transition-colors"
                                    style={{ 
                                      color: colors.primaryDark,
                                      borderColor: `${colors.separator}80`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = `${colors.primaryDark}08`;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
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
                                  handlePublish(listing);
                                  setOpenMenu(null);
                                }}
                                disabled={actionLoading === listing.id}
                                className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 border-b disabled:opacity-50 transition-colors"
                                style={{ 
                                  color: colors.primaryDark,
                                  borderColor: `${colors.separator}80`,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${colors.primaryDark}08`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <CheckCircle size={14} />
                                Publier
                              </button>
                            )}

                            <button
                              onClick={() => {
                                handleDelete(listing);
                                setOpenMenu(null);
                              }}
                              disabled={actionLoading === listing.id}
                              className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                              style={{ color: colors.error }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${colors.error}08`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredListings.length === 0 && (
            <Card className="p-12 text-center" style={{ borderColor: colors.separator }}>
              <Home className="mx-auto mb-4" size={48} style={{ color: colors.textSecondary }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.textPrimary }}>
                Aucune annonce trouvée
              </h3>
              <p style={{ color: colors.textSecondary }}>
                {searchQuery || statusFilter || typeFilter 
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucune annonce n'a été créée pour le moment"
                }
              </p>
            </Card>
          )}
        </div>
      </div>
      
      <ListingModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        listing={selectedListing} 
        mode="edit"
        onSuccess={fetchListings}
      />

      {/* Modal Statistiques */}
      {selectedListing && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${statsModalOpen ? 'block' : 'hidden'}`}>
          <div 
            className="rounded-2xl shadow-2xl w-full mx-4 max-w-md max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.separator }}
          >
            <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: colors.separator }}>
              <h2 className="text-2xl font-bold" style={{ color: colors.primaryDark }}>Statistiques de l'annonce</h2>
              <button
                onClick={() => setStatsModalOpen(false)}
                className="p-2 rounded-full transition-all duration-300 transform hover:rotate-90"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.textSecondary}08`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center" style={{ borderColor: colors.separator }}>
                    <Eye className="mx-auto mb-2" size={24} style={{ color: colors.primaryDark }} />
                    <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{selectedListing.views || 0}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>Vues</div>
                  </Card>
                  <Card className="p-4 text-center" style={{ borderColor: colors.separator }}>
                    <Heart className="mx-auto mb-2" size={24} style={{ color: colors.error }} />
                    <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>{selectedListing.favorites?.length || 0}</div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>Favoris</div>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-4" style={{ color: colors.textPrimary }}>Informations de publication</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: colors.textSecondary }}>Statut:</span>
                      <Badge 
                        style={{
                          backgroundColor: STATUT_ANNONCE[selectedListing.status]?.color,
                          color: STATUT_ANNONCE[selectedListing.status]?.textColor,
                          borderColor: STATUT_ANNONCE[selectedListing.status]?.borderColor,
                        }}
                      >
                        {STATUT_ANNONCE[selectedListing.status]?.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.textSecondary }}>Créée le:</span>
                      <span style={{ color: colors.textPrimary }}>
                        {new Date(selectedListing.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {selectedListing.publishedAt && (
                      <div className="flex justify-between">
                        <span style={{ color: colors.textSecondary }}>Publiée le:</span>
                        <span style={{ color: colors.textPrimary }}>
                          {new Date(selectedListing.publishedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
    </>
  );
}