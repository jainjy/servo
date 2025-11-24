import React from "react";
import { X, MapPin, Phone, Mail, Home, Users, DollarSign, Ruler } from "lucide-react";
import { MapPoint } from "../types/map";

interface PointDetailsModalProps {
  point: MapPoint | null;
  onClose: () => void;
  onViewDetails: (point: MapPoint) => void;
}

const PointDetailsModal: React.FC<PointDetailsModalProps> = ({
  point,
  onClose,
  onViewDetails,
}) => {
  if (!point) return null;

  const isUser = point.type === "user";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête du modal */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isUser ? (
              <Users className="h-6 w-6" />
            ) : (
              <Home className="h-6 w-6" />
            )}
            <h2 className="text-2xl font-bold">{point.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6">
          {/* Informations communes */}
          <div className="space-y-4 mb-6">
            {point.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-900">{point.address}</p>
                  {point.city && (
                    <p className="text-sm text-gray-600">{point.city}</p>
                  )}
                </div>
              </div>
            )}

            {point.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a
                    href={`tel:${point.phone}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {point.phone}
                  </a>
                </div>
              </div>
            )}

            {point.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${point.email}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {point.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Informations spécifiques aux utilisateurs */}
          {isUser && point.type === "user" && (
            <div className="border-t pt-6 space-y-4">
              {point.company && (
                <div>
                  <p className="text-sm text-gray-500">Entreprise</p>
                  <p className="font-medium text-gray-900">{point.company}</p>
                </div>
              )}

              {point.metiers && point.metiers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Métiers</p>
                  <div className="flex flex-wrap gap-2">
                    {point.metiers.map((metier, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {metier}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {point.services && point.services.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Services</p>
                  <ul className="space-y-2">
                    {point.services.map((service, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{service.name}</span>
                        {service.price && (
                          <span className="font-medium text-gray-900">
                            {service.price}€
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Informations spécifiques aux propriétés */}
          {!isUser && point.type === "property" && (
            <div className="border-t pt-6 space-y-4">
              {point.price && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="text-2xl font-bold text-green-600">
                      {point.price.toLocaleString("fr-FR")}€
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {point.surface && (
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Ruler className="h-4 w-4" />
                      Surface
                    </div>
                    <p className="text-lg font-semibold">{point.surface} m²</p>
                  </div>
                )}

                {point.rooms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pièces</p>
                    <p className="text-lg font-semibold">{point.rooms}</p>
                  </div>
                )}

                {point.bedrooms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Chambres</p>
                    <p className="text-lg font-semibold">{point.bedrooms}</p>
                  </div>
                )}

                {point.bathrooms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Salles de bain</p>
                    <p className="text-lg font-semibold">{point.bathrooms}</p>
                  </div>
                )}
              </div>

              {point.status && (
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <p className="text-sm font-medium text-gray-900">{point.status}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pied de page avec bouton d'action */}
        <div className="border-t bg-gray-50 p-6 flex gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Fermer
          </button>
          <button
            onClick={() => onViewDetails(point)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voir les détails complets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailsModal;
