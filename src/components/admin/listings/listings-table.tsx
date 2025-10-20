import React, { useState, useEffect } from "react";
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
  Plus,
  Filter,
  Heart,
  Phone,
  Archive,
  Calendar,
  MapPin,
  Euro,
  Ruler,
  Users,
  TrendingUp,
  Clock
} from "lucide-react";
import api from "@/lib/api";

// Types et statuts alignés avec le backend
const STATUT_ANNONCE = {
  draft: { label: "Brouillon", color: "bg-blue-100 text-blue-800" },
  for_sale: { label: "À vendre", color: "bg-green-100 text-green-800" },
  for_rent: { label: "À louer", color: "bg-purple-100 text-purple-800" },
  sold: { label: "Vendu", color: "bg-gray-100 text-gray-800" },
  rented: { label: "Loué", color: "bg-gray-100 text-gray-800" }
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
  both: "Les deux"
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
  
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/properties');
      setListings(response.data);
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      setError(`Erreur lors du chargement des annonces: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredListings = listings.filter((listing) => {
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
  });

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
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement des annonces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchListings}>Réessayer</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Barre de filtres */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Rechercher une annonce..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                className="p-2 border rounded-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
              >
                <option value="">Tous les types</option>
                {Object.entries(TYPE_BIEN).map(([key, type]) => (
                  <option key={key} value={key}>{type}</option>
                ))}
              </select>

              <Button variant="outline" className="border-border bg-transparent">
                <Filter className="mr-2" size={16} />
                Plus de filtres
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </Card>

          {/* Liste des annonces */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const disponibilite = getListingTypeInfo(listing);
              
              return (
                <Card key={listing.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image et badge statut */}
                  <div className="relative">
                    {listing.images && listing.images.length > 0 ? (
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Home className="text-gray-400" size={48} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className={STATUT_ANNONCE[listing.status]?.color}>
                        {STATUT_ANNONCE[listing.status]?.label}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1">
                      {disponibilite.vente && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Vente
                        </Badge>
                      )}
                      {disponibilite.location && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Location
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg line-clamp-2 flex-1 mr-3">
                        {listing.title}
                      </h3>
                      <div className="text-xl font-bold text-blue-600 whitespace-nowrap">
                        {listing.price?.toLocaleString()} €
                        {disponibilite.location && !disponibilite.vente && "/mois"}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span className="line-clamp-1">{listing.address}, {listing.city}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Ruler size={14} />
                        <span>{listing.surface} m²</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Home size={14} />
                        <span>{listing.rooms} pièces</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{listing.bedrooms} chambres</span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Propriétaire: </span>
                      {listing.owner.firstName} {listing.owner.lastName}
                    </div>

                    {/* Statistiques rapides */}
                    <div className="flex justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="font-bold text-sm">
                          {listing.views || 0}
                        </div>
                        <div className="text-xs text-gray-600">Vues</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-sm">
                          {listing.favorites?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Favoris</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStats(listing)}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        <TrendingUp size={14} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(listing)}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        <Eye size={14} />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(listing)}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        <Edit size={14} />
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      {(listing.status === 'for_sale' || listing.status === 'for_rent') ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnpublish(listing)}
                            disabled={actionLoading === listing.id}
                            className="flex-1 border-gray-300 hover:bg-gray-50"
                          >
                            {actionLoading === listing.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Dépublier
                          </Button>
                          {/* Ajouter les boutons Vendu/Loué */}
                          {listing.listingType === 'sale' || listing.listingType === 'both' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublish(listing, 'sold')}
                              disabled={actionLoading === listing.id}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Vendu
                            </Button>
                          ) : null}
                          {listing.listingType === 'rent' || listing.listingType === 'both' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublish(listing, 'rented')}
                              disabled={actionLoading === listing.id}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Loué
                            </Button>
                          ) : null}
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handlePublish(listing)}
                          disabled={actionLoading === listing.id}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                          {actionLoading === listing.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Publier
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(listing)}
                        disabled={actionLoading === listing.id}
                        className="flex-1"
                      >
                        {actionLoading === listing.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredListings.length === 0 && (
            <Card className="p-12 text-center">
              <Home className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">
                Aucune annonce trouvée
              </h3>
              <p className="text-gray-600">
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
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm ${statsModalOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-2xl shadow-2xl w-full mx-4 max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Statistiques de l'annonce</h2>
              <button
                onClick={() => setStatsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:rotate-90 text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 text-center">
                    <Eye className="mx-auto mb-2 text-blue-600" size={24} />
                    <div className="text-2xl font-bold">{selectedListing.views || 0}</div>
                    <div className="text-sm text-gray-600">Vues</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Heart className="mx-auto mb-2 text-red-600" size={24} />
                    <div className="text-2xl font-bold">{selectedListing.favorites?.length || 0}</div>
                    <div className="text-sm text-gray-600">Favoris</div>
                  </Card>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Informations de publication</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <Badge className={STATUT_ANNONCE[selectedListing.status]?.color}>
                        {STATUT_ANNONCE[selectedListing.status]?.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créée le:</span>
                      <span>
                        {new Date(selectedListing.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {selectedListing.publishedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Publiée le:</span>
                        <span>
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