import { useState } from "react";
import {
  MapPin,
  Users,
  Star,
  Heart,
  Bed,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Tv,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  Bath,
  Square,
  Clock,
  Globe,
} from "lucide-react";

// Constantes de couleur
const COLORS = {
  logo: "#556B2F",
  primary: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
  smallText: "#000000",
};

// Amenities disponibles
const availableAmenities = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "breakfast", label: "Petit-déjeuner", icon: Utensils },
  { id: "pool", label: "Piscine", icon: null },
  { id: "spa", label: "Spa", icon: null },
  { id: "gym", label: "Salle de sport", icon: Dumbbell },
  { id: "ac", label: "Climatisation", icon: Snowflake },
  { id: "tv", label: "Télévision", icon: Tv },
  { id: "kitchen", label: "Cuisine", icon: null },
];

const DetailModal = ({ isOpen, onClose, selectedListing }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen || !selectedListing) return null;

  const isTouristicPlace = selectedListing.isTouristicPlace;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b" style={{ borderColor: COLORS.separator }}>
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
              {selectedListing.title}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorite
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <p className="flex items-center mt-2" style={{ color: COLORS.logo }}>
            <MapPin className="w-4 h-4 mr-1" />
            {selectedListing.city}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {selectedListing.images && selectedListing.images.length > 0 ? (
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={selectedListing.images[0]}
                alt={selectedListing.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative h-64 rounded-xl overflow-hidden" style={{ background: `linear-gradient(to bottom right, ${COLORS.logo}, ${COLORS.primary})` }}>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
                Aucune image disponible
              </div>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
              Description
            </h4>
            <p style={{ color: COLORS.smallText }}>{selectedListing.description}</p>
          </div>

          {isTouristicPlace ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedListing.openingHours && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Clock className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                  <div className="text-sm" style={{ color: COLORS.logo }}>Horaires</div>
                  <div className="font-semibold" style={{ color: COLORS.smallText }}>
                    {selectedListing.openingHours}
                  </div>
                </div>
              )}
              {selectedListing.entranceFee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Star className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                  <div className="text-sm" style={{ color: COLORS.logo }}>Tarif d'entrée</div>
                  <div className="font-semibold" style={{ color: COLORS.smallText }}>
                    {selectedListing.entranceFee}
                  </div>
                </div>
              )}
              {selectedListing.website && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Globe className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                  <div className="text-sm" style={{ color: COLORS.logo }}>Site web</div>
                  <div className="font-semibold truncate" style={{ color: COLORS.smallText }}>
                    {selectedListing.website}
                  </div>
                </div>
              )}
              {selectedListing.contactInfo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Users className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                  <div className="text-sm" style={{ color: COLORS.logo }}>Contact</div>
                  <div className="font-semibold" style={{ color: COLORS.smallText }}>
                    {selectedListing.contactInfo}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bed className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                <div className="text-sm" style={{ color: COLORS.logo }}>Chambres</div>
                <div className="font-semibold" style={{ color: COLORS.smallText }}>
                  {selectedListing.bedrooms || 1}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Users className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                <div className="text-sm" style={{ color: COLORS.logo }}>Voyageurs max</div>
                <div className="font-semibold" style={{ color: COLORS.smallText }}>{selectedListing.maxGuests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Bath className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                <div className="text-sm" style={{ color: COLORS.logo }}>Salles de bain</div>
                <div className="font-semibold" style={{ color: COLORS.smallText }}>
                  {selectedListing.bathrooms || 1}
                </div>
              </div>
              {selectedListing.area && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Square className="w-6 h-6 mb-2" style={{ color: COLORS.primary }} />
                  <div className="text-sm" style={{ color: COLORS.logo }}>Surface</div>
                  <div className="font-semibold" style={{ color: COLORS.smallText }}>{selectedListing.area}m²</div>
                </div>
              )}
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold mb-4" style={{ color: COLORS.secondaryText }}>
              Équipements
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {selectedListing.amenities.map((amenityId) => {
                const amenity = availableAmenities.find(
                  (a) => a.id === amenityId
                );
                const IconComponent = amenity?.icon || CheckCircle;
                return (
                  <div
                    key={amenityId}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <IconComponent className="w-5 h-5" style={{ color: COLORS.primary }} />
                    <span className="text-sm" style={{ color: COLORS.smallText }}>
                      {amenity?.label || amenityId}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {!isTouristicPlace && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.primary}15` }}>
              <h4 className="text-lg font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                Informations de réservation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: COLORS.logo }}>Prix par nuit</span>
                    <span className="font-semibold" style={{ color: COLORS.smallText }}>
                      {selectedListing.price}€
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: COLORS.logo }}>
                      Réservation instantanée
                    </span>
                    <span
                      className={`font-semibold ${selectedListing.instantBook
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {selectedListing.instantBook ? "Oui" : "Non"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: COLORS.logo }}>
                      Politique d'annulation
                    </span>
                    <span className="font-semibold capitalize" style={{ color: COLORS.smallText }}>
                      {selectedListing.cancellationPolicy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.logo }}>Note</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold" style={{ color: COLORS.smallText }}>
                        {selectedListing.rating}
                      </span>
                      <span className="ml-1" style={{ color: COLORS.logo }}>
                        ({selectedListing.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 border-2 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300"
              style={{ borderColor: COLORS.separator }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;