import React from 'react';
import { MapPin, Euro, Star, User, Calendar } from 'lucide-react';

interface Parapente {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

interface ParapenteCardProps {
  parapente: Parapente;
  onReserve: (parapente: Parapente) => void;
}

const ParapenteCard: React.FC<ParapenteCardProps> = ({ parapente, onReserve }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image avec badge de prix */}
      <div className="relative h-56 overflow-hidden">
        {parapente.images.length > 0 ? (
          <img
            src={parapente.images[0]}
            alt={parapente.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
            <div className="text-center p-4">
              <Calendar className="w-12 h-12 text-white/80 mx-auto mb-3" />
              <span className="text-white font-medium">Expérience Parapente</span>
            </div>
          </div>
        )}
        
        {/* Badge de prix */}
        <div className="absolute top-4 right-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center gap-1">
              <Euro className="w-4 h-4" style={{ color: '#556B2F' }} />
              <span className="font-bold text-lg" style={{ color: '#8B4513' }}>
                {formatPrice(parapente.price)}
              </span>
              <span className="text-sm text-gray-500">/jour</span>
            </div>
          </div>
        </div>

        {/* Note (simulée) */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white rounded-full px-3 py-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">4.8</span>
            <span className="text-xs opacity-80">(24 avis)</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        {/* Titre et localisation */}
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-1" style={{ color: '#8B4513' }}>
            {parapente.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{parapente.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {parapente.description}
        </p>

        {/* Propriétaire */}
        <div className="flex items-center gap-3 mb-5 pt-4 border-t border-gray-100">
          <div className="relative">
            {parapente.user.avatar ? (
              <div className="w-12 h-12 rounded-full overflow-hidden border-2" style={{ borderColor: '#556B2F' }}>
                <img 
                  src={parapente.user.avatar} 
                  alt={`${parapente.user.firstName} ${parapente.user.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                style={{ backgroundColor: '#556B2F' }}
              >
                {getInitials(parapente.user.firstName, parapente.user.lastName)}
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium" style={{ color: '#8B4513' }}>
              {parapente.user.firstName} {parapente.user.lastName}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <User className="w-3 h-3" />
              Instructeur certifié
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Disponible</div>
            <div className="text-sm font-semibold" style={{ color: '#556B2F' }}>
              ✔️ Maintenant
            </div>
          </div>
        </div>

        {/* Bouton Réservation */}
        <button
          onClick={() => onReserve(parapente)}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          style={{ 
            background: 'linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)'
          }}
        >
          <Calendar className="w-5 h-5" />
          Réserver maintenant
          <span className="ml-1 text-sm opacity-90">→</span>
        </button>

        {/* Miniatures des images supplémentaires */}
        {parapente.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto mt-4 pt-4 border-t border-gray-100">
            {parapente.images.slice(1, 4).map((image, index) => (
              <div key={index} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`${parapente.title} ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80';
                  }}
                />
              </div>
            ))}
            {parapente.images.length > 4 && (
              <div className="flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F0F7F0' }}>
                <span className="text-sm font-semibold" style={{ color: '#556B2F' }}>
                  +{parapente.images.length - 4}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParapenteCard;