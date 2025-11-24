import React, { useState } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  Eye,
  Calendar
} from 'lucide-react';

const CartesBiensImmobiliers = () => {
  const [filtreType, setFiltreType] = useState('tous');
  const [filtreCategorie, setFiltreCategorie] = useState('tous');

  const biensImmobiliers = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
      type: "achat",
      categorie: "maison",
      prix: "450 000 €",
      titre: "Villa moderne avec piscine",
      lieu: "Marseille, 13008",
      description: "Magnifique villa contemporaine avec piscine privative et jardin arboré. Proche commodités et transports.",
      caracteristiques: {
        chambres: 4,
        sdb: 3,
        surface: "185 m²",
        parking: 2,
        annee: 2020
      },
      favori: false,
      vues: 124
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      type: "location",
      categorie: "appartement",
      prix: "1 200 €/mois",
      titre: "Appartement standing centre-ville",
      lieu: "Lyon, 69002",
      description: "Bel appartement rénové avec vue dégagée. Séjour lumineux, cuisine équipée, proche métro.",
      caracteristiques: {
        chambres: 3,
        sdb: 2,
        surface: "85 m²",
        parking: 1,
        annee: 2018
      },
      favori: true,
      vues: 89
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
      type: "achat",
      categorie: "villa",
      prix: "750 000 €",
      titre: "Villa de prestige avec vue mer",
      lieu: "Nice, 06000",
      description: "Exceptionnelle villa de standing avec vue panoramique sur la mer. Piscine, jardin paysager.",
      caracteristiques: {
        chambres: 5,
        sdb: 4,
        surface: "240 m²",
        parking: 3,
        annee: 2022
      },
      favori: false,
      vues: 256
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400",
      type: "location",
      categorie: "maison",
      prix: "1 800 €/mois",
      titre: "Maison de ville avec terrasse",
      lieu: "Toulouse, 31000",
      description: "Charmante maison de ville avec grande terrasse ensoleillée. Idéale pour famille.",
      caracteristiques: {
        chambres: 3,
        sdb: 2,
        surface: "110 m²",
        parking: 1,
        annee: 2015
      },
      favori: false,
      vues: 67
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1600585154340-963ed7af6c16?w=400",
      type: "achat",
      categorie: "appartement",
      prix: "320 000 €",
      titre: "Appartement neuf avec balcon",
      lieu: "Bordeaux, 33000",
      description: "Appartement neuf de standing avec grand balcon. Proche parc et commerces.",
      caracteristiques: {
        chambres: 2,
        sdb: 1,
        surface: "65 m²",
        parking: 1,
        annee: 2023
      },
      favori: true,
      vues: 142
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400",
      type: "achat",
      categorie: "villa",
      prix: "920 000 €",
      titre: "Villa contemporaine avec jardin",
      lieu: "Montpellier, 34000",
      description: "Splendide villa contemporaine avec piscine et jardin clos. Matériaux haut de gamme.",
      caracteristiques: {
        chambres: 4,
        sdb: 3,
        surface: "210 m²",
        parking: 2,
        annee: 2021
      },
      favori: false,
      vues: 198
    }
  ];

  const types = [
    { value: 'tous', label: 'Tous les types' },
    { value: 'achat', label: 'À acheter' },
    { value: 'location', label: 'À louer' }
  ];

  const categories = [
    { value: 'tous', label: 'Toutes catégories' },
    { value: 'maison', label: 'Maisons' },
    { value: 'appartement', label: 'Appartements' },
    { value: 'villa', label: 'Villas' }
  ];

  const biensFiltres = biensImmobiliers.filter(bien => {
    const matchType = filtreType === 'tous' || bien.type === filtreType;
    const matchCategorie = filtreCategorie === 'tous' || bien.categorie === filtreCategorie;
    return matchType && matchCategorie;
  });

  const toggleFavori = (id) => {
    // Implémentation de la fonction de favori
    console.log('Toggle favori:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos biens immobiliers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de propriétés exceptionnelles 
            pour votre projet d'achat ou de location
          </p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              {/* Filtre par type */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Type :</label>
                <select 
                  value={filtreType}
                  onChange={(e) => setFiltreType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre par catégorie */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">Catégorie :</label>
                <select 
                  value={filtreCategorie}
                  onChange={(e) => setFiltreCategorie(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(categorie => (
                    <option key={categorie.value} value={categorie.value}>
                      {categorie.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              {biensFiltres.length} bien{biensFiltres.length > 1 ? 's' : ''} trouvé{biensFiltres.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biensFiltres.map((bien) => (
            <div 
              key={bien.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image avec badges superposés */}
              <div className="relative">
                <img 
                  src={bien.image} 
                  alt={bien.titre}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges superposés */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    bien.type === 'achat' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {bien.type === 'achat' ? 'À vendre' : 'À louer'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    bien.categorie === 'villa' 
                      ? 'bg-purple-500 text-white'
                      : bien.categorie === 'maison'
                      ? 'bg-orange-500 text-white'
                      : 'bg-cyan-500 text-white'
                  }`}>
                    {bien.categorie.charAt(0).toUpperCase() + bien.categorie.slice(1)}
                  </span>
                </div>

                {/* Badge prix */}
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-gray-900 shadow-lg">
                    {bien.prix}
                  </span>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Titre et lieu */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {bien.titre}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{bien.lieu}</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {bien.description}
                </p>

                {/* Caractéristiques */}
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bed className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.chambres} chambre{bien.caracteristiques.chambres > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.sdb} salle{bien.caracteristiques.sdb > 1 ? 's' : ''} de bain
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Square className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.surface}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700">
                      {bien.caracteristiques.parking} place{bien.caracteristiques.parking > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{bien.caracteristiques.annee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{bien.vues} vues</span>
                    </div>
                  </div>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                    {bien.type === 'achat' ? 'Visiter' : 'Contacter'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {biensFiltres.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun bien trouvé
            </h3>
            <p className="text-gray-500">
              Aucun bien ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Bouton voir plus */}
        {biensFiltres.length > 0 && (
          <div className="text-center mt-12">
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
              Voir plus de biens
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartesBiensImmobiliers;