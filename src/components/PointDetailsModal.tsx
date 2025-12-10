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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-separator">
        {/* En-tête du modal */}
        <div 
          className="sticky top-0 p-6 flex items-center justify-between"
          style={{ 
            background: "linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)" 
          }}
        >
          <div className="flex items-center gap-3">
            {isUser ? (
              <Users className="h-7 w-7 text-white" />
            ) : (
              <Home className="h-7 w-7 text-white" />
            )}
            <h2 className="text-2xl font-bold text-white">{point.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 bg-light-bg">
          {/* Informations communes */}
          <div className="space-y-5 mb-6">
            {point.address && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-separator">
                <MapPin className="h-5 w-5 text-logo mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-secondary-text font-medium">Adresse</p>
                  <p className="font-semibold text-gray-900 mt-1">{point.address}</p>
                  {point.city && (
                    <p className="text-gray-600 mt-1">{point.city}</p>
                  )}
                </div>
              </div>
            )}

            {point.phone && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-separator">
                <Phone className="h-5 w-5 text-logo" />
                <div>
                  <p className="text-sm text-secondary-text font-medium">Téléphone</p>
                  <a
                    href={`tel:${point.phone}`}
                    className="font-semibold text-primary-dark hover:underline mt-1 block"
                  >
                    {point.phone}
                  </a>
                </div>
              </div>
            )}

            {point.email && (
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-separator">
                <Mail className="h-5 w-5 text-logo" />
                <div>
                  <p className="text-sm text-secondary-text font-medium">Email</p>
                  <a
                    href={`mailto:${point.email}`}
                    className="font-semibold text-primary-dark hover:underline mt-1 block"
                  >
                    {point.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Informations spécifiques aux utilisateurs */}
          {isUser && point.type === "user" && (
            <div className="border-t border-separator pt-6 space-y-5">
              {point.company && (
                <div className="p-3 bg-white rounded-lg border border-separator">
                  <p className="text-sm text-secondary-text font-medium">Entreprise</p>
                  <p className="font-semibold text-gray-900 mt-1">{point.company}</p>
                </div>
              )}

              {point.metiers && point.metiers.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-separator">
                  <p className="text-sm text-secondary-text font-medium mb-3">Métiers</p>
                  <div className="flex flex-wrap gap-2">
                    {point.metiers.map((metier, idx) => (
                      <span
                        key={idx}
                        style={{ backgroundColor: '#556B2F' }}
                        className="px-3 py-1.5 text-white rounded-lg text-sm font-medium"
                      >
                        {metier}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {point.services && point.services.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-separator">
                  <p className="text-sm text-secondary-text font-medium mb-3">Services</p>
                  <ul className="space-y-3">
                    {point.services.map((service, idx) => (
                      <li 
                        key={idx} 
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <span className="text-gray-800 font-medium">{service.name}</span>
                        {service.price && (
                          <span 
                            className="font-bold px-3 py-1 rounded"
                            style={{ 
                              backgroundColor: '#6B8E23',
                              color: 'white'
                            }}
                          >
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
            <div className="border-t border-separator pt-6 space-y-5">
              {point.price && (
                <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-separator">
                  <DollarSign className="h-6 w-6" style={{ color: '#8B4513' }} />
                  <div>
                    <p className="text-sm text-secondary-text font-medium">Prix</p>
                    <p className="text-2xl font-bold mt-1" style={{ color: '#8B4513' }}>
                      {point.price.toLocaleString("fr-FR")}€
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {point.surface && (
                  <div className="p-3 bg-white rounded-lg border border-separator">
                    <div className="flex items-center gap-2 text-sm text-secondary-text font-medium mb-1">
                      <Ruler className="h-4 w-4" />
                      Surface
                    </div>
                    <p className="text-lg font-bold text-logo">{point.surface} m²</p>
                  </div>
                )}

                {point.rooms && (
                  <div className="p-3 bg-white rounded-lg border border-separator">
                    <p className="text-sm text-secondary-text font-medium mb-1">Pièces</p>
                    <p className="text-lg font-bold text-logo">{point.rooms}</p>
                  </div>
                )}

                {point.bedrooms && (
                  <div className="p-3 bg-white rounded-lg border border-separator">
                    <p className="text-sm text-secondary-text font-medium mb-1">Chambres</p>
                    <p className="text-lg font-bold text-logo">{point.bedrooms}</p>
                  </div>
                )}

                {point.bathrooms && (
                  <div className="p-3 bg-white rounded-lg border border-separator">
                    <p className="text-sm text-secondary-text font-medium mb-1">Salles de bain</p>
                    <p className="text-lg font-bold text-logo">{point.bathrooms}</p>
                  </div>
                )}
              </div>

              {point.status && (
                <div className="p-3 bg-white rounded-lg border border-separator">
                  <p className="text-sm text-secondary-text font-medium">Statut</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{point.status}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pied de page avec bouton d'action */}
        <div className="border-t border-separator bg-gray-50 p-6 flex gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium border border-separator"
          >
            Fermer
          </button>
          <button
            onClick={() => onViewDetails(point)}
            style={{ 
              backgroundColor: '#556B2F',
              color: 'white'
            }}
            className="flex-1 px-4 py-3 rounded-lg hover:opacity-90 transition-all font-medium"
          >
            Voir les détails complets
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetailsModal;