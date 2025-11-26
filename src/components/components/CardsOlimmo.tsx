import React from 'react';
import { 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Heart,
  Phone
} from 'lucide-react';

const AnnonceCard = ({ annonce }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Image avec overlay */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        <img 
          src={annonce.image} 
          alt={annonce.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge type */}
        <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-semibold ${
          annonce.type === 'location' 
            ? 'bg-blue-500 text-white' 
            : 'bg-emerald-500 text-white'
        }`}>
          {annonce.type === 'location' ? 'À louer' : 'À vendre'}
        </div>
        
        {/* Bouton favori */}
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors duration-200">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
        </button>
        
        {/* Prix */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm">
          <span className="font-bold text-gray-900 text-lg">{annonce.prix}</span>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-6">
        {/* Titre */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {annonce.titre}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {annonce.description}
        </p>

        {/* Caractéristiques */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-gray-600">
            <Bed className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{annonce.chambres} ch.</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Bath className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{annonce.sdb} sdb</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Square className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{annonce.surface}</span>
          </div>
        </div>

        {/* Localisation */}
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm">{annonce.localisation}</span>
        </div>

        {/* Bouton de contact */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center group/btn">
          <Phone className="w-4 h-4 mr-2" />
          Contacter l'agent
          <div className="ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all duration-200">
            →
          </div>
        </button>
      </div>
    </div>
  );
};

const AnnoncesImmobilieres = () => {
  // Données d'exemple pour les annonces
  const annonces = [
    {
      id: 1,
      titre: "Appartement moderne centre-ville",
      description: "Bel appartement lumineux avec vue sur le parc, proche de tous les commerces et transports en commun.",
      prix: "450 000 €",
      type: "vente",
      chambres: 3,
      sdb: 1,
      surface: "75 m²",
      localisation: "Paris 15ème",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 2,
      titre: "Studio étudiant proche université",
      description: "Studio entièrement rénové, meublé et équipé. Idéal pour étudiant. Charges comprises.",
      prix: "650 €/mois",
      type: "location",
      chambres: 1,
      sdb: 1,
      surface: "25 m²",
      localisation: "Lyon 7ème",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 3,
      titre: "Maison de ville avec jardin",
      description: "Charmante maison avec jardin privatif, garage et terrasse. Parfait pour famille.",
      prix: "320 000 €",
      type: "vente",
      chambres: 4,
      sdb: 2,
      surface: "110 m²",
      localisation: "Bordeaux Centre",
      image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: 4,
      titre: "Duplex avec terrasse panoramique",
      description: "Magnifique duplex avec grande terrasse offrant une vue exceptionnelle sur la ville.",
      prix: "1 200 €/mois",
      type: "location",
      chambres: 2,
      sdb: 1,
      surface: "65 m²",
      localisation: "Marseille Vieux-Port",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez nos biens exclusifs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trouvez la propriété de vos rêves parmi notre sélection d'annonces premium
          </p>
        </div>
        
        {/* Grille des annonces */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {annonces.map((annonce) => (
            <AnnonceCard key={annonce.id} annonce={annonce} />
          ))}
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg">
            Voir toutes les annonces
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnoncesImmobilieres;