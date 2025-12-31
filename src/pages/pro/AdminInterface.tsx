import React, { useState } from 'react';
import {
  Building,
  Star,
  TrendingUp,
  Users,
  Plane,
  Mountain,
  ChevronDown,
  PlusCircle,
  RefreshCw,
  Shield,
  TreePine
} from 'lucide-react';

interface Stats {
  totalListings?: number;
  averageRating?: number;
  availableListings?: number;
  totalBookings?: number;
}

interface ContentTypeOption {
  id: string;
  label: string;
  icon: any;
  description: string;
}

interface AdminInterfaceProps {
  contentType: string;
  contentTypeOptions: ContentTypeOption[];
  stats: Stats | null;
  flights: any[];
  activities: any[];
  naturePatrimoine: any[];
  listings: any[];
  filteredListings: any[];
  loading: boolean;
  flightsLoading: boolean;
  activitiesLoading: boolean;
  naturePatrimoineLoading: boolean;
  user?: { role: string };
  onContentTypeChange: (type: string) => void;
  onAddClick: () => void;
  onRefreshActivities?: () => void;
  renderListingCards: () => React.ReactNode;
  renderFlightCards: () => React.ReactNode;
  renderActivityCards: () => React.ReactNode;
  renderNaturePatrimoineCards: () => React.ReactNode;
}

const AdminInterface: React.FC<AdminInterfaceProps> = ({
  contentType,
  contentTypeOptions,
  stats,
  flights,
  activities,
  naturePatrimoine,
  listings,
  filteredListings,
  loading,
  flightsLoading,
  activitiesLoading,
  naturePatrimoineLoading,
  user,
  onContentTypeChange,
  onAddClick,
  onRefreshActivities,
  renderListingCards,
  renderFlightCards,
  renderActivityCards,
  renderNaturePatrimoineCards,
}) => {
  const [showContentTypeDropdown, setShowContentTypeDropdown] = useState(false);
  const currentContentType = contentTypeOptions.find(
    (opt) => opt.id === contentType
  );

  const getAddButtonText = () => {
    switch (contentType) {
      case 'accommodations': return 'Ajouter un hébergement';
      case 'touristic_places': return 'Ajouter un lieu touristique';
      case 'flights': return 'Ajouter un vol';
      case 'activities': return 'Ajouter une activité';
      case 'nature_patrimoine': return 'Ajouter un site';
      default: return 'Ajouter';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="lg:flex grid gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#8B4513]">
            {currentContentType?.label || "Gestion du Tourisme"}
          </h1>
          <p className="text-[#556B2F]">
            {currentContentType?.description ||
              "Administrez vos services touristiques"}
          </p>
        </div>

        <div className="grid gap-4 lg:flex items-center space-x-4">
          {/* Content Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowContentTypeDropdown(!showContentTypeDropdown)}
              className="bg-white border-2 text-gray-700 px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 min-w-64 justify-between border-[#D3D3D3]"
            >
              <div className="flex items-center">
                {currentContentType?.icon && (
                  <currentContentType.icon className="w-5 h-5 mr-3" />
                )}
                <span className="text-black">{currentContentType?.label || "Sélectionner"}</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {showContentTypeDropdown && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50 border-[#D3D3D3]">
                <div className="p-2">
                  {contentTypeOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          onContentTypeChange(option.id);
                          setShowContentTypeDropdown(false);
                        }}
                        className="w-full flex items-center px-4 py-4 text-left rounded-lg transition-all duration-300 border-b last:border-b-0 hover:bg-gray-50 border-[#D3D3D3] text-black"
                      >
                        <IconComponent className="w-6 h-6 mr-4 text-[#6B8E23]" />
                        <div className="flex-1">
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-[#556B2F]">
                            {option.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Add Button */}
          {user?.role === "professional" && (
            <button
              onClick={onAddClick}
              className="text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 bg-[#6B8E23] hover:bg-[#556B2F]"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              {getAddButtonText()}
            </button>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {stats && contentType !== "flights" && contentType !== "activities" && contentType !== "nature_patrimoine" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Building className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {stats.totalListings || 0}
                </div>
                <div className="text-[#556B2F]">
                  {contentType === "accommodations"
                    ? "Hébergements"
                    : contentType === "touristic_places"
                      ? "Lieux touristiques"
                      : "Total"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Star className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {stats.averageRating?.toFixed(2) || "0.00"}
                </div>
                <div className="text-[#556B2F]">Note moyenne</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {stats.availableListings || 0}
                </div>
                <div className="text-[#556B2F]">Disponibles</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {stats.totalBookings || 0}
                </div>
                <div className="text-[#556B2F]">Réservations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flights Stats */}
      {contentType === "flights" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Plane className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">{flights.length}</div>
                <div className="text-[#556B2F]">Vols actifs</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {flights.length > 0
                    ? flights.reduce(
                      (total, flight) => total + (flight.availableSeats || 0),
                      0
                    )
                    : 0}
                </div>
                <div className="text-[#556B2F]">Places disponibles</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Star className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {flights.length > 0
                    ? Math.min(...flights.map((f) => f.prix || Infinity)) === Infinity
                      ? 0
                      : Math.min(...flights.map((f) => f.prix || Infinity))
                    : 0}
                  €
                </div>
                <div className="text-[#556B2F]">Prix minimum</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {flights.length > 0
                    ? flights.reduce(
                      (total, flight) => total + (flight.nbrPersonne || 0),
                      0
                    )
                    : 0}
                </div>
                <div className="text-[#556B2F]">Réservations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activities Stats */}
      {contentType === "activities" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Mountain className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">{activities.length}</div>
                <div className="text-[#556B2F]">Activités</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {activities.length > 0
                    ? (activities.reduce(
                      (total, activity) => total + (activity.price || 0),
                      0
                    ) / activities.length).toFixed(2)
                    : "0.00"}
                  €
                </div>
                <div className="text-[#556B2F]">Prix moyen</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Star className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {activities.length > 0
                    ? Math.min(...activities.map((a) => a.price || Infinity)) === Infinity
                      ? 0
                      : Math.min(...activities.map((a) => a.price || Infinity))
                    : 0}
                  €
                </div>
                <div className="text-[#556B2F]">Prix minimum</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Users className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {activities.length > 0
                    ? activities.filter((a) => a.available !== false).length
                    : 0}
                </div>
                <div className="text-[#556B2F]">Disponibles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nature & Patrimoine Stats */}
      {contentType === "nature_patrimoine" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <TreePine className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">{naturePatrimoine.length}</div>
                <div className="text-[#556B2F]">Sites</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Star className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {naturePatrimoine.length > 0
                    ? (naturePatrimoine.reduce(
                      (total, item) => total + (item.rating || 0),
                      0
                    ) / naturePatrimoine.length).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-[#556B2F]">Note moyenne</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {naturePatrimoine.length > 0
                    ? naturePatrimoine.filter((item) => item.featured).length
                    : 0}
                </div>
                <div className="text-[#556B2F]">En vedette</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D3D3D3]">
            <div className="flex items-center">
              <Shield className="w-8 h-8 mr-4 text-[#6B8E23]" />
              <div>
                <div className="text-2xl font-bold text-black">
                  {naturePatrimoine.length > 0
                    ? naturePatrimoine.filter((item) => item.available !== false).length
                    : 0}
                </div>
                <div className="text-[#556B2F]">Disponibles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading || flightsLoading || activitiesLoading || naturePatrimoineLoading ? (
        <div className="text-center flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl">
          <img src="/loading.gif" alt="Chargement" className="w-24 h-24" />
          <p className="mt-4 text-xl font-semibold text-black">
            Chargement...
          </p>
        </div>
      ) : (
        <>
          {/* Content based on contentType */}
          {(contentType === "accommodations" || contentType === "touristic_places") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {renderListingCards()}
              </div>

              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  {contentType === "accommodations" ? (
                    <Building className="w-16 h-16 mx-auto mb-4 text-[#D3D3D3]" />
                  ) : (
                    <Mountain className="w-16 h-16 mx-auto mb-4 text-[#D3D3D3]" />
                  )}
                  <h3 className="text-lg font-semibold mb-2 text-[#8B4513]">
                    {contentType === "accommodations"
                      ? "Aucun hébergement trouvé"
                      : "Aucun lieu touristique trouvé"}
                  </h3>
                  <p className="mb-4 text-[#556B2F]">
                    {listings.length === 0
                      ? `Commencez par ajouter votre premier ${contentType === "accommodations"
                        ? "hébergement"
                        : "lieu touristique"
                      }.`
                      : "Aucun élément ne correspond à vos critères de recherche."}
                  </p>
                  {listings.length === 0 && user?.role === "professional" && (
                    <button
                      onClick={onAddClick}
                      className="text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 mx-auto bg-[#6B8E23] hover:bg-[#556B2F]"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      {contentType === "accommodations"
                        ? "Ajouter un hébergement"
                        : "Ajouter un lieu touristique"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {contentType === "flights" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {renderFlightCards()}
              </div>

              {flights.length === 0 && (
                <div className="text-center py-12">
                  <Plane className="w-16 h-16 mx-auto mb-4 text-[#D3D3D3]" />
                  <h3 className="text-lg font-semibold mb-2 text-[#8B4513]">
                    Aucun vol trouvé
                  </h3>
                  <p className="mb-4 text-[#556B2F]">
                    {user?.role === "professional"
                      ? "Commencez par ajouter votre premier vol."
                      : "Aucun vol disponible pour le moment."}
                  </p>
                  {user?.role === "professional" && (
                    <button
                      onClick={onAddClick}
                      className="text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all duration-300 mx-auto bg-[#6B8E23] hover:bg-[#556B2F]"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Ajouter un vol
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {contentType === "activities" && (
            <div className="space-y-8">
              {/* Activities Header */}
              <div className="rounded-2xl p-6 border bg-[#6B8E23] bg-opacity-10 border-[#D3D3D3]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#8B4513]">Gestion des Activités</h2>
                    <p className="mt-1 text-[#556B2F]">
                      Gérez vos activités touristiques et catégories
                    </p>
                  </div>
                  
                  {user?.role === "professional" && (
                    <div className="flex items-center space-x-3">
                      <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-[#D3D3D3]">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-black">
                          {activities.filter(a => a.isActive !== false).length} actives
                        </span>
                      </div>
                      <button
                        onClick={onAddClick}
                        className="text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl bg-[#6B8E23] hover:bg-[#556B2F]"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Nouvelle activité</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Activities Content */}
              {activitiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden border-[#D3D3D3]">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex space-x-2">
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length > 0 ? (
                <>
                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#6B8E23] bg-opacity-20 text-[#6B8E23]">
                      Toutes ({activities.length})
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#D3D3D3] bg-opacity-50 text-black hover:bg-opacity-70">
                      Actives ({activities.filter(a => a.isActive !== false).length})
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#D3D3D3] bg-opacity-50 text-black hover:bg-opacity-70">
                      Inactives ({activities.filter(a => a.isActive === false).length})
                    </button>
                  </div>

                  {/* Activities Grid */}
                  {renderActivityCards()}

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-8 border-t border-[#D3D3D3]">
                    <div className="text-[#556B2F]">
                      Affichage de <span className="font-semibold text-black">{activities.length}</span> activité{activities.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 border-[#D3D3D3] text-black">
                        ← Précédent
                      </button>
                      <span className="px-4 py-2 rounded-lg font-medium text-white bg-[#6B8E23]">1</span>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors border-[#D3D3D3] text-black">
                        Suivant →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="rounded-2xl border-2 border-dashed p-12 text-center bg-[#D3D3D3] bg-opacity-20 border-[#D3D3D3]">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#556B2F] from-opacity-20 to-[#6B8E23] to-opacity-20">
                    <div className="text-4xl">🎯</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#8B4513]">
                    Aucune activité disponible
                  </h3>
                  <p className="max-w-md mx-auto mb-8 text-[#556B2F]">
                    {user?.role === "professional"
                      ? "Commencez par créer votre première activité pour enrichir votre catalogue touristique."
                      : "Revenez plus tard pour découvrir nos activités passionnantes."}
                  </p>
                  {user?.role === "professional" && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={onAddClick}
                        className="text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl bg-[#6B8E23] hover:bg-[#556B2F]"
                      >
                        <PlusCircle className="w-6 h-6" />
                        <span>Créer une activité</span>
                      </button>
                      <button
                        onClick={onRefreshActivities}
                        className="px-8 py-4 border-2 rounded-xl font-semibold transition-all duration-300 border-[#D3D3D3] text-black hover:bg-gray-50"
                      >
                        <RefreshCw className="w-5 h-5 inline mr-2" />
                        Rafraîchir
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Nature & Patrimoine Content */}
          {contentType === "nature_patrimoine" && (
            <div className="space-y-8">
              {/* Nature & Patrimoine Header */}
            

              {/* Nature & Patrimoine Content */}
              {naturePatrimoineLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border overflow-hidden border-[#D3D3D3]">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="flex space-x-2">
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : naturePatrimoine.length > 0 ? (
                <>
                  {/* Quick Filters */}
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#6B8E23] bg-opacity-20 text-[#6B8E23]">
                      Tous ({naturePatrimoine.length})
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#D3D3D3] bg-opacity-50 text-black hover:bg-opacity-70">
                      Nature ({naturePatrimoine.filter(item => item.type === "nature").length})
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#D3D3D3] bg-opacity-50 text-black hover:bg-opacity-70">
                      Patrimoine ({naturePatrimoine.filter(item => item.type === "patrimoine").length})
                    </button>
                    <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#D3D3D3] bg-opacity-50 text-black hover:bg-opacity-70">
                      En vedette ({naturePatrimoine.filter(item => item.featured).length})
                    </button>
                  </div>

                  {/* Nature & Patrimoine Grid */}
                  {renderNaturePatrimoineCards()}

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-8 border-t border-[#D3D3D3]">
                    <div className="text-[#556B2F]">
                      Affichage de <span className="font-semibold text-black">{naturePatrimoine.length}</span> site{naturePatrimoine.length > 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 border-[#D3D3D3] text-black">
                        ← Précédent
                      </button>
                      <span className="px-4 py-2 rounded-lg font-medium text-white bg-[#6B8E23]">1</span>
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors border-[#D3D3D3] text-black">
                        Suivant →
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="rounded-2xl border-2 border-dashed p-12 text-center bg-[#D3D3D3] bg-opacity-20 border-[#D3D3D3]">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#556B2F] from-opacity-20 to-[#6B8E23] to-opacity-20">
                    <div className="text-4xl">🌿</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#8B4513]">
                    Aucun site trouvé
                  </h3>
                  <p className="max-w-md mx-auto mb-8 text-[#556B2F]">
                    {user?.role === "professional"
                      ? "Commencez par créer votre premier site naturel ou patrimonial."
                      : "Revenez plus tard pour découvrir nos sites naturels et patrimoniaux."}
                  </p>
                  {user?.role === "professional" && (
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={onAddClick}
                        className="text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl bg-[#6B8E23] hover:bg-[#556B2F]"
                      >
                        <PlusCircle className="w-6 h-6" />
                        <span>Créer un site</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminInterface;