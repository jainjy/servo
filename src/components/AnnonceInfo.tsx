import React from 'react';
import { X, MapPin, Home, Users, Bath, Bed, Phone, Mail, Calendar } from 'lucide-react';

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Annonce {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  surface: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  address: string;
  city: string;
  zipCode: string;
  features: string[];
  images: string[];
  listingType: string;
  rentType: string;
  createdAt: string;
  owner: Owner;
}

interface AnnonceInfoProps {
  isOpen: boolean;
  onClose: () => void;
  annonce: Annonce | null;
}

const AnnonceInfo: React.FC<AnnonceInfoProps> = ({ isOpen, onClose, annonce }) => {
  if (!isOpen || !annonce) return null;

  // Fonction pour formater le prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(price);
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Déterminer le type d'annonce
  const getListingTypeLabel = () => {
    switch (annonce.listingType) {
      case 'rent':
        return 'À Louer';
      case 'sale':
        return 'À Vendre';
      default:
        return 'Annonce';
    }
  };

  // Couleur selon le type
  const getTypeColor = () => {
    switch (annonce.listingType) {
      case 'rent':
        return 'bg-blue-600';
      case 'sale':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Image par défaut
  const defaultImage = "https://i.pinimg.com/736x/41/d8/69/41d8699229ed3bd63cf723faa543fc95.jpg";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal - Taille réduite pour éviter le scroll */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header avec images */}
          <div className="relative flex-shrink-0">
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Images - Hauteur réduite */}
            <div className="h-64 overflow-hidden">
              {annonce.images && annonce.images.length > 0 ? (
                <div className="flex h-full">
                  {/* Image principale */}
                  <div className="flex-1">
                    <img
                      src={annonce.images[0]}
                      alt={annonce.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Images secondaires */}
                  {annonce.images.length > 1 && (
                    <div className="w-1/3 flex flex-col">
                      {annonce.images.slice(1, 3).map((image, index) => (
                        <div key={index} className="flex-1 border-l border-white">
                          <img
                            src={image}
                            alt={`${annonce.title} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {annonce.images.length > 3 && (
                        <div className="flex-1 border-l border-white bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600 font-medium">
                            +{annonce.images.length - 3} photos
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <img
                  src={defaultImage}
                  alt="Image par défaut"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Badge type */}
            <div className={`absolute top-4 left-4 ${getTypeColor()} text-white px-3 py-1 rounded-full text-sm font-medium`}>
              {getListingTypeLabel()}
            </div>

            {/* Prix */}
            <div className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-xl font-bold">
              {formatPrice(annonce.price)}
            </div>
          </div>

          {/* Content - Sans hauteur fixe pour s'adapter au contenu */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne principale */}
              <div className="lg:col-span-2 space-y-4">
                {/* Titre et localisation */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {annonce.title}
                  </h2>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="line-clamp-1">
                      {annonce.address}, {annonce.zipCode} {annonce.city}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
                    {annonce.description || "Aucune description disponible."}
                  </p>
                </div>

                {/* Caractéristiques */}
                <div>
                  <h3 className="font-semibold mb-2">Caractéristiques</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Surface</div>
                        <div className="font-medium text-sm">{annonce.surface} m²</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Pièces</div>
                        <div className="font-medium text-sm">{annonce.rooms || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Bed className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Chambres</div>
                        <div className="font-medium text-sm">{annonce.bedrooms || '-'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Bath className="w-4 h-4 text-gray-600" />
                      <div>
                        <div className="text-xs text-gray-500">Salles de bain</div>
                        <div className="font-medium text-sm">{annonce.bathrooms || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Équipements */}
                {annonce.features && annonce.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Équipements</h3>
                    <div className="flex flex-wrap gap-1">
                      {annonce.features.slice(0, 8).map((feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                      {annonce.features.length > 8 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          +{annonce.features.length - 8} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Propriétaire */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="space-y-2">
                    <div>
                      <div className="font-medium text-sm">
                        {annonce.owner.firstName} {annonce.owner.lastName}
                      </div>
                      <div className="text-xs text-gray-600 truncate">{annonce.owner.email}</div>
                    </div>
                  </div>
                </div>

                {/* Détails de l'annonce */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-semibold mb-2">Détails</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type de bien:</span>
                      <span className="font-medium">{annonce.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span className="font-medium">{annonce.status}</span>
                    </div>
                    {annonce.rentType && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type de location:</span>
                        <span className="font-medium">{annonce.rentType}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Publiée le:</span>
                      <span className="font-medium">{formatDate(annonce.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm">
                    Contacter le propriétaire
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                    Ajouter aux favoris
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                    Partager l'annonce
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnonceInfo;