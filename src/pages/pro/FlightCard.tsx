import React from 'react';
import { Plane, Clock, MapPin, Edit, Trash2 } from 'lucide-react';

interface Flight {
  id: string;
  compagnie: string;
  numeroVol: string;
  departVille: string;
  arriveeVille: string;
  departDateHeure: string;
  arriveeDateHeure: string;
  duree: string;
  escales: number;
  classe: 'economy' | 'premium' | 'business' | 'first';
  prix: number;
  services: string[];
  image?: string;
  availableSeats?: number;
  nbrPersonne?: number;
}

interface FlightCardProps {
  flight: Flight;
  user?: { role: string };
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, user }) => {
  const getClassLabel = (classe: string) => {
    switch (classe) {
      case 'economy': return '✈️ Économique';
      case 'premium': return '✨ Premium';
      case 'business': return '💼 Affaires';
      case 'first': return '👑 Première';
      default: return classe;
    }
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case 'meal': return '🍽️ Repas';
      case 'baggage': return '🧳 Bagage';
      case 'wifi': return '📡 Wi-Fi';
      case 'entertainment': return '🎬 Divertissement';
      case 'power': return '🔌 Électricité';
      default: return service;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#556B2F] to-[#6B8E23]">
        {flight.image ? (
          <img
            src={flight.image}
            alt={`${flight.compagnie} - ${flight.numeroVol}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            <div className="text-center">
              <Plane className="w-12 h-12 mx-auto mb-2" />
              <div>{flight.compagnie}</div>
              <div className="text-xs mt-1">{flight.numeroVol}</div>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/70 text-white px-3 py-2 rounded-xl backdrop-blur-sm">
            <span className="text-lg font-bold">{flight.prix}€</span>
            <span className="text-sm opacity-90"> par personne</span>
          </div>
        </div>

        {/* Class Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-800 capitalize">
            {getClassLabel(flight.classe)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Flight Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg text-[#8B4513]">
              {flight.departVille} → {flight.arriveeVille}
            </h3>
            <p className="text-sm text-[#556B2F]">
              {flight.compagnie} • {flight.numeroVol}
            </p>
          </div>
        </div>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-[#556B2F]">Départ</div>
            <div className="font-semibold text-sm text-black">
              {new Date(flight.departDateHeure).toLocaleString("fr-FR")}
            </div>
          </div>
          <div>
            <div className="text-sm text-[#556B2F]">Arrivée</div>
            <div className="font-semibold text-sm text-black">
              {new Date(flight.arriveeDateHeure).toLocaleString("fr-FR")}
            </div>
          </div>
        </div>

        {/* Duration and Stops */}
        <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-[#D3D3D3]">
          <div className="flex items-center text-[#556B2F]">
            <Clock className="w-4 h-4 mr-1" />
            <span>Durée: {flight.duree}</span>
          </div>
          <div className="flex items-center text-[#556B2F]">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {flight.escales} escale{flight.escales > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Services */}
        {flight.services && flight.services.length > 0 && (
          <div className="mb-4">
            <p className="text-xs mb-2 text-[#556B2F]">Services inclus:</p>
            <div className="flex flex-wrap gap-1">
              {flight.services.map((service) => (
                <span
                  key={service}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {getServiceLabel(service)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Admin Actions */}
        {user?.role === "professional" && (
          <div className="flex space-x-2">
            <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-all duration-300">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all duration-300">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;