import React from 'react';
import { 
  MapPin, 
  Star, 
  Heart, 
  Users, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  city: string;
  price: number;
  rating: number;
  reviewCount: number;
  type: string;
  category: string;
  featured: boolean;
  available: boolean;
  instantBook?: boolean;
  isTouristicPlace: boolean;
  images: string[];
  amenities: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  entranceFee?: string;
  openingHours?: string;
}

interface ListingCardProps {
  listing: Listing;
  user?: { role: string };
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleAvailability: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onOpenDetailModal: (listing: Listing) => void;
  onOpenEditModal: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  getTypeIcon: (type: string, isTouristicPlace: boolean, category?: string) => any;
  availableAmenities: Array<{id: string, label: string, icon?: any}>;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  user,
  isFavorite,
  onToggleFavorite,
  onToggleAvailability,
  onToggleFeatured,
  onOpenDetailModal,
  onOpenEditModal,
  onDeleteListing,
  getTypeIcon,
  availableAmenities
}) => {
  const TypeIcon = getTypeIcon(
    listing.type,
    listing.isTouristicPlace,
    listing.category
  );

  const isTouristicPlace = listing.isTouristicPlace;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            <div className="text-center">
              <TypeIcon className="w-12 h-12 mx-auto mb-2" />
              <div>Galerie d'images</div>
              <div className="text-xs mt-1">
                {listing.images?.length || 0} photos
              </div>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
            {isTouristicPlace ? listing.category : listing.type}
          </span>
          {listing.featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
              <Star className="w-3 h-3 mr-1" />
              Vedette
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => onToggleFavorite(listing.id)}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorite
                ? "bg-red-500 text-white"
                : "bg-white/90 text-gray-600 hover:bg-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          {!isTouristicPlace && listing.instantBook && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
              Instant
            </span>
          )}
        </div>

        {/* Price */}
        {listing.price > 0 && (
          <div className="absolute bottom-3 left-3">
            <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
              <span className="text-lg font-bold">{listing.price}€</span>
              {!isTouristicPlace && (
                <span className="text-sm opacity-90">/nuit</span>
              )}
            </div>
          </div>
        )}

        {/* Availability Toggle */}
        {user?.role === "professional" && (
          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => onToggleAvailability(listing.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                listing.available
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {listing.available ? "✓ Disponible" : "✗ Indisponible"}
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-bold text-lg line-clamp-1 text-[#8B4513]">
            {listing.title}
          </h3>
          <p className="flex items-center text-sm mt-1 text-[#556B2F]">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.city}
          </p>
        </div>

        {/* Rating and Featured Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-semibold text-black">
              {listing.rating}
            </span>
            <span className="ml-1 text-[#556B2F]">
              ({listing.reviewCount} avis)
            </span>
          </div>

          {user?.role === "professional" && (
            <button
              onClick={() => onToggleFeatured(listing.id)}
              className={`p-1 rounded-full transition-all duration-300 ${
                listing.featured
                  ? "text-yellow-500 bg-yellow-50"
                  : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
              }`}
              title={
                listing.featured
                  ? "Retirer des vedettes"
                  : "Mettre en vedette"
              }
            >
              <Star
                className={`w-4 h-4 ${listing.featured ? "fill-current" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Details */}
        {isTouristicPlace ? (
          <div className="mb-4 space-y-2">
            {listing.entranceFee && (
              <div className="flex justify-between text-sm">
                <span className="text-[#556B2F]">Tarif d'entrée:</span>
                <span className="font-semibold text-[#6B8E23]">
                  {listing.entranceFee}
                </span>
              </div>
            )}
            {listing.openingHours && (
              <div className="flex items-center text-sm text-[#556B2F]">
                <Clock className="w-4 h-4 mr-1" />
                <span>{listing.openingHours}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm mb-4 text-[#556B2F]">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{listing.maxGuests}</span>
              </div>
              {listing.bedrooms && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{listing.bedrooms}</span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{listing.bathrooms}</span>
                </div>
              )}
              {listing.area && (
                <div className="flex items-center">
                  <Square className="w-4 h-4 mr-1" />
                  <span>{listing.area}m²</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {listing.amenities.slice(0, 4).map((amenityId) => {
              const amenity = availableAmenities.find(
                (a) => a.id === amenityId
              );
              const IconComponent = amenity?.icon || CheckCircle;
              return (
                <div
                  key={amenityId}
                  className="flex items-center p-1 bg-gray-100 rounded-lg"
                >
                  <IconComponent className="w-3 h-3 mr-1 text-[#6B8E23]" />
                  <span className="text-xs text-black">
                    {amenity?.label}
                  </span>
                </div>
              );
            })}
            {listing.amenities.length > 4 && (
              <div className="flex items-center p-1 bg-gray-100 rounded-lg">
                <span className="text-xs text-black">
                  +{listing.amenities.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onOpenDetailModal(listing)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-1" />
            Détails
          </button>

          {user?.role === "professional" && (
            <>
              <button
                onClick={() => onOpenEditModal(listing)}
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300"
                title="Modifier"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteListing(listing.id)}
                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;